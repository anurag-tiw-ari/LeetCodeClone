import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['Array','String','Recursion','Basic Programming','Star Pattern','Maths','LinkedList','Tree','Graph','DP','Stack','Queue']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenVisibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

export default function CreateTab() {
  const navigate = useNavigate();
  const [activeLanguage, setActiveLanguage] = useState(0);
  const languages = ['C++', 'Java', 'JavaScript'];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '// C++ starter code\n\nclass Solution {\npublic:\n    // Your code here\n};' },
        { language: 'Java', initialCode: '// Java starter code\n\nclass Solution {\n    // Your code here\n}' },
        { language: 'JavaScript', initialCode: '// JavaScript starter code\n\n/**\n * Your code here\n */' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '// C++ solution\n\nclass Solution {\npublic:\n    // Complete solution\n};' },
        { language: 'Java', completeCode: '// Java solution\n\nclass Solution {\n    // Complete solution\n}' },
        { language: 'JavaScript', completeCode: '// JavaScript solution\n\n// Complete solution' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible 
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenVisibleTestCases' });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      alert(`Error: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Create New Problem</h1>
            <p className="text-sm opacity-70">Add a new coding challenge to the platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">
                <span className="bg-primary w-2 h-6 mr-2 rounded-full"></span>
                Problem Details
              </h2>
              <div className="divider my-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold mr-2">Title</span>
                  </label>
                  <input
                    {...register('title')}
                    className={`input input-bordered ${errors.title ? 'input-error' : 'input-primary'}`}
                    placeholder="Problem title"
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
                      <span className="label-text font-semibold">Difficulty</span>
                    </label>
                    <select
                      {...register('difficulty')}
                      className={`select select-bordered ${errors.difficulty ? 'select-error' : 'select-primary'}`}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text font-semibold">Category</span>
                    </label>
                    <select
                      {...register('tags')}
                      className={`select select-bordered ${errors.tags ? 'select-error' : 'select-primary'}`}
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

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold mr-2">Description</span>
                  </label>
                  <textarea
                    {...register('description')}
                    className={`textarea textarea-bordered h-40 ${errors.description ? 'textarea-error' : 'textarea-primary'}`}
                    placeholder="Detailed problem description..."
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.description.message}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">
                <span className="bg-secondary w-2 h-6 mr-2 rounded-full"></span>
                Test Cases
              </h2>
              <div className="divider my-0"></div>
              
              {/* Visible Test Cases */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-secondary">Visible Test Cases</h3>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="btn btn-secondary btn-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Case
                  </button>
                </div>

                {visibleFields.length === 0 && (
                  <div className="alert alert-info">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>No visible test cases added yet</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Case #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeVisible(index)}
                            className="btn btn-circle btn-xs btn-error"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text mr-2">Input</span>
                            </label>
                            <input
                              {...register(`visibleTestCases.${index}.input`)}
                              className="input input-sm input-bordered"
                            />
                            {errors.visibleTestCases?.[index]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.visibleTestCases[index].input.message}
                                </span>
                              </label>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text mr-2">Output</span>
                            </label>
                            <textarea
                              {...register(`visibleTestCases.${index}.output`)}
                              className="input input-sm input-bordered"
                            />
                            {errors.visibleTestCases?.[index]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.visibleTestCases[index].output.message}
                                </span>
                              </label>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text mr-2">Explanation</span>
                            </label>
                            <textarea
                              {...register(`visibleTestCases.${index}.explanation`)}
                              className="textarea textarea-sm textarea-bordered"
                              rows={3}
                            />
                            {errors.visibleTestCases?.[index]?.explanation && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.visibleTestCases[index].explanation.message}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider">Hidden Test Cases</div>

              {/* Hidden Test Cases */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-accent">Hidden Test Cases</h3>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="btn btn-accent btn-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Case
                  </button>
                </div>

                {hiddenFields.length === 0 && (
                  <div className="alert alert-warning">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>No hidden test cases added yet</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Case #{index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeHidden(index)}
                            className="btn btn-circle btn-xs btn-error"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text mr-2">Input</span>
                            </label>
                            <input
                              {...register(`hiddenVisibleTestCases.${index}.input`)}
                              className="input input-sm input-bordered mt-1"
                            />
                            {errors.hiddenTestCases?.[index]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.hiddenVisibleTestCases[index].input.message}
                                </span>
                              </label>
                            )}
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Output</span>
                            </label>
                            <textarea
                              {...register(`hiddenVisibleTestCases.${index}.output`)}
                              className="input input-sm input-bordered mt-1"
                            />
                            {errors.hiddenTestCases?.[index]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.hiddenVisibleTestCases[index].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Templates Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">
                <span className="bg-info w-2 h-6 mr-2 rounded-full"></span>
                Code Templates
              </h2>
              <div className="divider my-0"></div>
              
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

              <div className="space-y-6">
                {/* Initial Code Template */}
                {languages.map((lang, index) => (
                  <div 
                    key={`initial-${index}`}
                    className={`form-control ${activeLanguage === index ? '' : 'hidden'}`}
                  >
                    <label className="label">
                      <span className="label-text font-semibold">Initial Code Template</span>
                      <span className="label-text-alt">{lang}</span>
                    </label>
                    <div className="mockup-code bg-base-300">
                      <pre className="p-4">
                        <textarea
                          {...register(`startCode.${index}.initialCode`)}
                          className="w-full bg-transparent font-mono text-sm h-40"
                          spellCheck="false"
                        />
                      </pre>
                    </div>
                    {errors.startCode?.[index]?.initialCode && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.startCode[index].initialCode.message}
                        </span>
                      </label>
                    )}
                  </div>
                ))}

                {/* Reference Solution */}
                {languages.map((lang, index) => (
                  <div 
                    key={`reference-${index}`}
                    className={`form-control ${activeLanguage === index ? '' : 'hidden'}`}
                  >
                    <label className="label">
                      <span className="label-text font-semibold">Reference Solution</span>
                      <span className="label-text-alt">{lang}</span>
                    </label>
                    <div className="mockup-code bg-base-300">
                      <pre className="p-4">
                        <textarea
                          {...register(`referenceSolution.${index}.completeCode`)}
                          className="w-full bg-transparent font-mono text-sm h-40"
                          spellCheck="false"
                        />
                      </pre>
                    </div>
                    {errors.referenceSolution?.[index]?.completeCode && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.referenceSolution[index].completeCode.message}
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Create Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}