import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

export default function UpdateTab({ problems,createdProblems }) {
  const navigate = useNavigate();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [problemTypeFilter, setProblemTypeFilter] = useState('all');
  const [activeLanguage, setActiveLanguage] = useState(0);
  const languages = ['C++', 'Java', 'JavaScript'];

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      visibleTestCases: [],
      hiddenVisibleTestCases: [],
      startCode: languages.map(lang => ({ language: lang, initialCode: '' })),
      referenceSolution: languages.map(lang => ({ language: lang, completeCode: '' }))
    }
  });

  // Field arrays
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
    replace: replaceVisible
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
    replace: replaceHidden
  } = useFieldArray({ control, name: 'hiddenVisibleTestCases' });

  const {
    fields: startCodeFields,
    append: appendStartCode,
    remove: removeStartCode,
    replace: replaceStartCode
  } = useFieldArray({ control, name: 'startCode' });

  const {
    fields: referenceSolutionFields,
    append: appendReferenceSolution,
    remove: removeReferenceSolution,
    replace: replaceReferenceSolution
  } = useFieldArray({ control, name: 'referenceSolution' });

  // Filter problems
  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesType = problemTypeFilter === 'all' || 
                       (problemTypeFilter === 'yours' && createdProblems.some((cp)=>cp._id===problem._id));
    return matchesDifficulty && matchesType;
  });

  // Load problem data
  useEffect(() => {
    if (selectedProblem) {
      // Reset form first
      reset();

      // Set basic fields
      setValue('title', selectedProblem.title);
      setValue('description', selectedProblem.description);
      setValue('difficulty', selectedProblem.difficulty);
      setValue('tags', selectedProblem.tags);

      // Set test cases
      if (selectedProblem.visibleTestCases) {
        replaceVisible(selectedProblem.visibleTestCases.map(tc => ({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation || ''
        })));
      }

      if (selectedProblem.hiddenTestCases) {
        replaceHidden(selectedProblem.hiddenVisibleTestCases.map(tc => ({
          input: tc.input,
          output: tc.output
        })));
      }

      // Set start code
      const initialStartCode = languages.map(lang => {
        const existing = selectedProblem.startCode?.find(sc => sc.language === lang);
        return existing || { language: lang, initialCode: '' };
      });
      replaceStartCode(initialStartCode);

      // Set reference solution
      const initialReferenceSolution = languages.map(lang => {
        const existing = selectedProblem.referenceSolution?.find(rs => rs.language === lang);
        return existing || { language: lang, completeCode: '' };
      });
      replaceReferenceSolution(initialReferenceSolution);
    }
  }, [selectedProblem, reset, setValue, replaceVisible, replaceHidden, replaceStartCode, replaceReferenceSolution]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await axiosClient.put(`/problem/update/${selectedProblem._id}`, data);
      setSuccess('Problem updated successfully!');
      setTimeout(() => {
        setSuccess(null);
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Update Problem</h2>
        
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
            <span className="label-text">Select Problem to Update</span>
          </label>
          <select 
            className="select select-bordered w-full"
            onChange={(e) => {
              const problemId = e.target.value;
              const problem = filteredProblems.find(p => p._id === problemId);
              setSelectedProblem(problem || null);
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Problem Title</span>
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.title.message}</span>
                  </label>
                )}
              </div>
              
              <div className="flex gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Difficulty</span>
                  </label>
                  <select
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    className="select select-bordered w-full"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    {...register('tags', { required: 'Category is required' })}
                    className="select select-bordered w-full"
                  >
                    <option value="Array">Array</option>
                    <option value="String">String</option>
                    <option value="Recursion">Recursion</option>
                    <option value="Basic Programming">Basic Programming</option>
                    <option value="Star Pattern">Star Pattern</option>
                    <option value="Maths">Maths</option>
                    <option value="LinkedList">Linked List</option>
                    <option value="Tree">Tree</option>
                    <option value="Graph">Graph</option>
                    <option value="DP">DP</option>
                    <option value="Stack">Stack</option>
                    <option value="Queue">Queue</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="textarea textarea-bordered h-40"
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>
            
            {/* Visible Test Cases */}
            <div className="divider">Visible Test Cases</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="btn btn-secondary btn-sm"
                >
                  Add Case
                </button>
              </div>
              
              {visibleFields.map((field, index) => (
                <div key={field.id} className="card bg-base-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4>Case #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn btn-circle btn-xs btn-error"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Input</span>
                      </label>
                      <input
                        {...register(`visibleTestCases.${index}.input`, { required: true })}
                        className="input input-bordered"
                        defaultValue={field.input}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Output</span>
                      </label>
                      <textarea
                        {...register(`visibleTestCases.${index}.output`, { required: true })}
                        className="input input-bordered"
                        defaultValue={field.output}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Explanation</span>
                      </label>
                      <textarea
                        {...register(`visibleTestCases.${index}.explanation`)}
                        className="textarea textarea-bordered"
                        rows={3}
                        defaultValue={field.explanation}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Hidden Test Cases */}
            <div className="divider">Hidden Test Cases</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="btn btn-accent btn-sm"
                >
                  Add Case
                </button>
              </div>
              
              {hiddenFields.map((field, index) => (
                <div key={field.id} className="card bg-base-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4>Case #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn btn-circle btn-xs btn-error"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Input</span>
                      </label>
                      <input
                        {...register(`hiddenVisibleTestCases.${index}.input`, { required: true })}
                        className="input input-bordered"
                        defaultValue={field.input}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Output</span>
                      </label>
                      <textarea
                        {...register(`hiddenVisibleTestCases.${index}.output`, { required: true })}
                        className="input input-bordered"
                        defaultValue={field.output}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Code Templates */}
            <div className="divider">Code Templates</div>
            
            {/* Language Tabs */}
            <div className="tabs tabs-boxed bg-base-200 w-fit mb-4">
              {languages.map((lang, index) => (
                <button
                  key={lang}
                  type="button"
                  className={`tab ${activeLanguage === index ? 'tab-active' : ''}`}
                  onClick={() => setActiveLanguage(index)}
                >
                  {lang}
                </button>
              ))}
            </div>
            
            {/* Starter Code */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Starter Code</h3>
              {startCodeFields.map((field, index) => (
                <div 
                  key={field.id} 
                  className={`form-control ${activeLanguage === index ? '' : 'hidden'}`}
                >
                  <label className="label">
                    <span className="label-text">{field.language}</span>
                  </label>
                  <textarea
                    {...register(`startCode.${index}.initialCode`)}
                    className="textarea textarea-bordered font-mono h-40"
                    defaultValue={field.initialCode}
                  />
                </div>
              ))}
            </div>
            
            {/* Reference Solution */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reference Solution</h3>
              {referenceSolutionFields.map((field, index) => (
                <div 
                  key={field.id} 
                  className={`form-control ${activeLanguage === index ? '' : 'hidden'}`}
                >
                  <label className="label">
                    <span className="label-text">{field.language}</span>
                  </label>
                  <textarea
                    {...register(`referenceSolution.${index}.completeCode`)}
                    className="textarea textarea-bordered font-mono h-40"
                    defaultValue={field.completeCode}
                  />
                </div>
              ))}
            </div>
            
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-warning" disabled={loading}>
                {loading ? 'Updating...' : 'Update Problem'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}