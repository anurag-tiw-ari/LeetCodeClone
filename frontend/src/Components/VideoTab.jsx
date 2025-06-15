import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {toast} from 'react-toastify';

export default function VideoTab({ problems, createdProblems }) {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [problemTypeFilter, setProblemTypeFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [active, setActive] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError: setFormError,
    clearErrors,
    formState: { errors }
  } = useForm();

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesType = problemTypeFilter === 'all' || 
                       (problemTypeFilter === 'yours' && createdProblems.some((cp) => cp._id === problem._id));
    return matchesDifficulty && matchesType;
  });

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    if (!selectedProblem) {
      setFormError('root', { 
        type: 'manual', 
        message: 'Please select a problem first' 
      });
      return;
    }

    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${selectedProblem._id}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: selectedProblem._id,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      setSuccess('Video uploaded successfully!');
      reset();
      toast.success('Video uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
      setFormError('root', { type: 'manual', message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    if (!selectedProblem) {
      setError('Please select a problem to delete');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axiosClient.delete(`/video/delete/${selectedProblem._id}`);
      setSuccess('Video deleted successfully!');
      setSelectedProblem(null);
      setActive(null);
      toast.success('Video deleted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Delete failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Video Solutions</h2>
        
        {/* Messages */}
        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filter by Difficulty</span>
            </label>
            <select 
              className="select select-bordered"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filter by Problem Type</span>
            </label>
            <select 
              className="select select-bordered"
              value={problemTypeFilter}
              onChange={(e) => setProblemTypeFilter(e.target.value)}
            >
              <option value="all">All Problems</option>
              <option value="yours">Created by You</option>
            </select>
          </div>
        </div>
        
        {/* Problem Selection */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Select Problem</span>
          </label>
          <select 
            className="select select-bordered w-full"
            onChange={(e) => {
              const problemId = e.target.value;
              const problem = filteredProblems.find(p => p._id === problemId);
              setSelectedProblem(problem || null);
              setActive(null);
              setUploadedVideo(null);
              setError(null);
              setSuccess(null);
            }}
            value={selectedProblem?._id || ''}
          >
            <option disabled value="">Choose a problem</option>
            {filteredProblems.map(problem => (
              <option key={problem._id} value={problem._id}>
                {problem.title} ({problem.difficulty})
              </option>
            ))}
          </select>
        </div>
        
        {selectedProblem && (
          <div>
            <h2 className='text-center text-xl font-semibold mb-5'>Selected Problem: {selectedProblem?.title}</h2>
            <div className='flex justify-center gap-10'>
              <button 
                className={`btn ${active === 'Upload' ? 'btn-primary' : 'btn-outline btn-primary'}`} 
                onClick={() => { setActive('Upload') }}
              >
                Upload
              </button>
              <button 
                className={`btn ${active === 'Delete' ? 'btn-error' : 'btn-outline btn-error'}`} 
                onClick={() => { setActive('Delete') }}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {selectedProblem && active === 'Upload' && (
          <div className="card bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <h2 className="card-title">Upload Video Solution</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* File Input */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Choose video file</span>
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return 'Please select a video file';
                          const file = files[0];
                          return file.type.startsWith('video/') || 'Please select a valid video file';
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          const file = files[0];
                          const maxSize = 100 * 1024 * 1024; // 100MB
                          return file.size <= maxSize || 'File size must be less than 100MB';
                        }
                      }
                    })}
                    className={`file-input file-input-bordered w-full ${errors.videoFile ? 'file-input-error' : ''}`}
                    disabled={uploading}
                  />
                  {errors.videoFile && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.videoFile.message}</span>
                    </label>
                  )}
                </div>
    
                {/* Selected File Info */}
                {selectedFile && (
                  <div className="alert alert-info">
                    <div>
                      <h3 className="font-bold">Selected File:</h3>
                      <p className="text-sm">{selectedFile.name}</p>
                      <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>
                      <p className="text-sm">Type: {selectedFile.type}</p>
                    </div>
                  </div>
                )}
    
                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={uploadProgress} 
                      max="100"
                    ></progress>
                  </div>
                )}
    
                {/* Error Message */}
                {errors.root && (
                  <div className="alert alert-error">
                    <span>{errors.root.message}</span>
                  </div>
                )}
    
                {/* Success Message */}
                {uploadedVideo && (
                  <div className="alert alert-success">
                    <div>
                      <h3 className="font-bold">Upload Successful!</h3>
                      <p className="text-sm">Duration: {formatDuration(uploadedVideo.duration)}</p>
                      <p className="text-sm">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
    
                {/* Upload Button */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    disabled={uploading || !selectedProblem}
                    className={`btn btn-primary ${uploading ? 'loading' : ''}`}
                  >
                    {uploading ? 'Uploading...' : 'Upload Video'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedProblem && active === 'Delete' && (
          <div className="mt-5">
            <div className="alert alert-warning mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Warning: Deleting a video cannot be undone!</span>
            </div>

            <div className="form-control">
              <button 
                className="btn btn-error" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Video'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}