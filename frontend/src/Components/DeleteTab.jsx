import { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

export default function DeleteTab({ problems,createdProblems }) {
  const navigate = useNavigate();
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [problemTypeFilter, setProblemTypeFilter] = useState('all');

  // Filter problems based on selected filters
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesType = problemTypeFilter === 'all' || 
                       (problemTypeFilter === 'yours' && createdProblems.some((cp)=>cp._id===problem._id));
    return matchesDifficulty && matchesType;
  });

  const handleDelete = async () => {
    if (!selectedProblemId) {
      setError('Please select a problem to delete');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axiosClient.delete(`/problem/delete/${selectedProblemId}`);
      setSuccess('Problem deleted successfully!');
      setTimeout(() => {
        setSuccess(null);
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to delete problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Delete Problem</h2>
        
        {success && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className="alert alert-warning mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Warning: Deleting a problem cannot be undone!</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Filter by Difficulty</span>
            </label>
            <select 
              className="select select-bordered"
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setSelectedProblemId('');
              }}
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
              onChange={(e) => {
                setProblemTypeFilter(e.target.value);
                setSelectedProblemId('');
              }}
            >
              <option value="all">All Problems</option>
              <option value="yours">Created by You</option>
            </select>
          </div>
        </div>
        
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Select Problem to Delete</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={selectedProblemId}
            onChange={(e) => setSelectedProblemId(e.target.value)}
          >
            <option disabled value="">Choose a problem</option>
            {filteredProblems.map(problem => (
              <option key={problem._id} value={problem._id}>
                {problem.title} ({problem.difficulty})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-control">
          <button 
            className="btn btn-error" 
            onClick={handleDelete}
            disabled={loading || !selectedProblemId}
          >
            {loading ? 'Deleting...' : 'Delete Problem'}
          </button>
        </div>
      </div>
    </div>
  );
}