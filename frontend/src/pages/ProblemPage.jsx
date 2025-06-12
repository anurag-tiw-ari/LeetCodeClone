import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../utils/axiosClient';
import Editor from '@monaco-editor/react';
import { Navigate, useParams } from 'react-router';
import { FaPlay, FaCheck, FaTimes, FaExclamationTriangle, FaCode } from 'react-icons/fa';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { NavLink } from 'react-router';
import ChatAI from '../Components/ChatAI';
import { FaFileAlt,FaBook,FaHistory,FaRobot,FaArrowLeft } from 'react-icons/fa';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router';


const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [submissions, setSubmissions] = useState([]);
  const [runResults, setRunResults] = useState(null);
  const [submitResults, setSubmitResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionTab, setShowSubmissionTab] = useState(false);
  const [compilationError, setCompilationError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const editorRef = useRef(null);
  const consoleRef = useRef(null);
  const [viewingSubmissionCode, setViewingSubmissionCode] = useState(null);
  const [showEditor,setShowEditor] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [codeByLanguage, setCodeByLanguage] = useState({});

  const navigate = useNavigate();

  const languageToMonacoId = {
    'C++': 'cpp',
    'Java': 'java',
    'JavaScript': 'javascript'
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/getProblemById/${id}`);
        setProblem(response.data);
        
        const likedResponse = await axiosClient.get(`/problem/checkLike/${id}`);
        setIsLiked(likedResponse.data);

        const initialCodes = {};
        response.data.startCode.forEach(sc => {
          initialCodes[sc.language] = sc.initialCode || '';
        });
        setCodeByLanguage(initialCodes);
        
        const submissionsRes = await axiosClient.get(`/problem/submittedProblem/${id}`);
        if (submissionsRes.data !== "No Submissions") {
          setSubmissions(submissionsRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || err.message);
        setLoading(false);
      }
    };
    
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (consoleRef.current && (runResults || submitResults || compilationError)) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [runResults, submitResults, compilationError]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

const handleRunCode = async () => {
    if (!codeByLanguage[language]) return;
    
    setIsRunning(true);
    setSubmitResults(null);
    setCompilationError(null);
    try {
      const response = await axiosClient.post(`/submission/run/${id}`, {
        code: codeByLanguage[language],
        language
      });
      setRunResults(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setCompilationError(errorMessage);
      console.error('Run code error:', err);
    } finally {
      setIsRunning(false);
    }
};

const handleSubmitCode = async () => {
    if (!codeByLanguage[language]) return;
    
    setIsSubmitting(true);
    setRunResults(null);
    setCompilationError(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${id}`, {
        code: codeByLanguage[language],
        language
      });
      setSubmitResults(response.data);
      setShowSubmissionTab(true);
      
      const submissionsRes = await axiosClient.get(`/problem/submittedProblem/${id}`);
      if (submissionsRes.data !== "No Submissions") {
        setSubmissions(submissionsRes.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setCompilationError(errorMessage);
      console.error('Submit code error:', err);
    } finally {
      setIsSubmitting(false);
    }
};

const handleLike = async () =>{

     try{
       const result = await axiosClient.get(`/problem/likedProblem/${id}`);
       setIsLiked(!isLiked)
     }
     catch(err)
     {
        toast.error(err?.response?.data)
     }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-info';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-base-100">
      <div className="card bg-base-200 border border-error max-w-md">
        <div className="card-body">
          <div className="flex items-center justify-center text-error mb-4">
            <FaExclamationTriangle className="mr-2" size={24} />
            <h2 className="card-title">Error Loading Problem</h2>
          </div>
          <p className="text-base-content mb-4 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate("/")}
            className="btn btn-accent w-full"
          >
            HomePage
          </button>
        </div>
      </div>
    </div>
  );
  
  if (!problem) return (
    <div className="flex justify-center items-center h-screen bg-base-100 text-base-content">
      Problem not found
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-base-100 text-base-content overflow-hidden fixed z-15 inset-0">
      {/* Mobile Header */}
      {isMobileView && (
        <div className="flex items-center justify-between p-3 border-b border-base-300 bg-base-200">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">{problem.title}</h1>
          </div>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="select select-sm select-bordered w-[100px]"
          >
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
          </select>
           <div className="flex">
                    <button
                      onClick={handleLike}
                      className={`text-[17px] ${isLiked ? "text-red-500" : "text-gray-400"} `}
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart/>}
                    </button>
                  </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobileView ? (
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - Problem Description */}
          <Panel defaultSize={40} minSize={20} collapsible={true}>
            <div className="h-full flex flex-col bg-base-200 border-r border-base-300">
              {/* Tab Navigation */}
              <div className="tabs tabs-boxed bg-base-200 px-2 pt-2">
                <button
                  className={`tab ${activeTab === 'problem' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('problem')}
                >
                  Description
                </button>
                <button
                  className={`tab ${activeTab === 'editorial' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('editorial')}
                >
                  Editorial
                </button>
                <button
                  className={`tab ${activeTab === 'solutions' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('solutions')}
                >
                  Solutions
                </button>
                <button
                  className={`tab ${activeTab === 'submissions' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('submissions')}
                >
                  Submissions
                </button>
                <button
                  className={`tab ${activeTab === 'AskAI' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('AskAI')}
                >
                   AskAI
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-4">
                {activeTab === 'problem' && (
                  <div>
                    <h2 className='mb-2 text-2xl'>{problem.title}</h2>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="badge badge-outline">
                        {problem.tags}
                      </span>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-md font-semibold mb-3">Examples</h3>
                      {problem.visibleTestCases.map((testCase, index) => (
                        <div key={index} className="mb-5 bg-base-300 p-4 rounded-lg border border-base-content/10">
                          <div className="mb-3">
                            <div className="text-sm font-medium text-base-content/70 mb-1">Input:</div>
                            <pre className="bg-base-100 p-3 rounded text-sm font-mono overflow-x-auto">
                              {testCase.input}
                            </pre>
                          </div>
                          <div className="mb-3">
                            <div className="text-sm font-medium text-base-content/70 mb-1">Output:</div>
                            <pre className="bg-base-100 p-3 rounded text-sm font-mono overflow-x-auto">
                              {testCase.output}
                            </pre>
                          </div>
                          {testCase.explanation && (
                            <div>
                              <div className="text-sm font-medium text-base-content/70 mb-1">Explanation:</div>
                              <p className="text-sm">{testCase.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'editorial' && (
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-xl font-bold mb-4">Approach</h2>
                    <p>Editorial content will go here...</p>
                  </div>
                )}
                
                {activeTab === 'solutions' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Reference Solutions</h2>
                    {problem.referenceSolution.map((solution, index) => (
                      <div key={index} className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{solution.language}</h3>
                        </div>
                        <div className="bg-base-300 p-4 rounded-lg border border-base-content/10">
                          <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                            {solution.completeCode}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                 
                  <div className="prose prose-invert max-w-none" style={{ display: activeTab === 'AskAI' ? 'block' : 'none' }}>
                    <h2 className="text-xl font-bold mb-2 text-center">AI Helper</h2>
                    <p>Ask Your Query...</p>
                    <ChatAI problem={problem} />
                  </div>
                
                
                {activeTab === 'submissions' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Your Submissions</h2>
                    {submissions.length === 0 ? (
                      <p className="text-base-content/70">No submissions yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Language</th>
                              <th>Status</th>
                              <th>Code</th>
                              <th>Runtime</th>
                              <th>Memory</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((submission, index) => (
                              <tr key={index}>
                                <td>
                                  {new Date(submission.createdAt).toLocaleString()}
                                </td>
                                <td>
                                  {submission.language}
                                </td>
                                <td>
                                  <span className={` ${
                                    submission.status === 'accepted' ? 'text-success' :
                                    submission.status === 'wrong answer' ? 'text-error' :
                                    'text-warning'
                                  }`}>
                                    {submission.status}
                                  </span>
                                </td>
                                <td>
                                <button 
                                    onClick={() => setViewingSubmissionCode(submission)}
                                    className="btn btn-xs btn-ghost"
                                >
                                    View Code
                                </button>
                                </td>
                                <td>
                                  {submission.runTime.toFixed(5)} ms
                                </td>
                                <td>
                                  {submission.memory} KB
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-base-300 hover:bg-primary transition-colors" />
          
          {/* Right Panel - Editor and Console */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Enhanced Editor Header */}
              <div className="flex items-center justify-between p-2 bg-base-200 border-b border-base-300">
                <div className="flex items-center space-x-3">
                  <FaCode className="text-primary" />
                  <h3 className="font-medium">Code Editor</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="select select-sm select-bordered bg-base-100"
                  >
                    <option value="C++">C++</option>
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleLike}
                      className={`text-xl ${isLiked ? "text-red-500" : "text-gray-400"} `}
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart/>}
                    </button>
                  </div>
                </div>
              </div>

              <Panel defaultSize={70} minSize={30}>
                <div className="h-full bg-base-100">
                  <Editor
                    height="100%"
                    language={languageToMonacoId[language] || 'javascript'}
                    theme="vs-dark"
                     value={codeByLanguage[language] || ''}
                    onChange={(value) => {
                      setCodeByLanguage(prev => ({
                        ...prev,
                        [language]: value
                      }));
                    }}
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      renderWhitespace: 'selection',
                      wordWrap: 'on',
                      padding: { top: 10 },
                    }}
                  />
                </div>
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-base-300 hover:bg-primary transition-colors" />
              
              <Panel defaultSize={30} minSize={10} collapsible={true}>
                <div className="h-full flex flex-col bg-base-200 border-t border-base-300">
                  <div className="flex justify-between items-center p-2 border-b border-base-300">
                    <h3 className="font-medium text-sm">Console</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className={`btn btn-sm ${isRunning ? 'btn-disabled' : 'btn-primary'}`}
                      >
                        <FaPlay size={12} />
                        <span>{isRunning ? 'Running...' : 'Run'}</span>
                      </button>
                      <button
                        onClick={handleSubmitCode}
                        disabled={isSubmitting}
                        className={`btn btn-sm ${isSubmitting ? 'btn-disabled' : 'btn-success'}`}
                      >
                        <FaCheck size={12} />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    ref={consoleRef}
                    className="flex-1 overflow-auto p-3 text-sm font-mono"
                  >
                    {compilationError && (
                      <div className="alert alert-error mb-4">
                        <FaExclamationTriangle />
                        <span>Compilation Error</span>
                        <pre className="whitespace-pre-wrap overflow-x-auto">
                          {compilationError}
                        </pre>
                      </div>
                    )}
                    
                    {runResults && (
                      <div className="space-y-4">
                        <h4 className="font-medium mb-2">Run Results</h4>
                        {runResults.map((result, index) => (
                          <div key={index} className="mb-3 bg-base-300 p-3 rounded-lg border border-base-content/10">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-medium">Test Case {index + 1}</span>
                              <span className={`badge ${
                                result.status_id === 3 ? 'text-success' : 'text-error'
                              }`}>
                                {result.status_id === 3 ? 'Passed' : 'Failed'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-base-content/70 mb-1">Input</div>
                                <pre className="bg-base-100 p-2 rounded whitespace-pre-wrap text-xs">
                                  {problem.visibleTestCases[index]?.input}
                                </pre>
                              </div>
                              
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-base-content/70 mb-1">Expected</div>
                                  <pre className="bg-base-100 p-2 rounded whitespace-pre-wrap text-xs">
                                    {problem.visibleTestCases[index]?.output}
                                  </pre>
                                </div>
                                <div>
                                  <div className="text-xs text-base-content/70 mb-1">Your Output</div>
                                  <pre className={`p-2 rounded whitespace-pre-wrap text-xs ${
                                    result.status_id === 3 ? 'bg-success' : 'bg-error'
                                  }`}>
                                    {result.stdout || 'No output'}
                                  </pre>
                                </div>
                              </div>
                            </div>
                            
                            {result.status_id !== 3 && (
                              <div className="mt-3">
                                <div className="text-xs text-base-content/70 mb-1">Error</div>
                                <pre className="bg-error p-2 rounded whitespace-pre-wrap text-xs">
                                  {result.stderr || 'Wrong answer'}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      ) : (   
  <div className="flex flex-col h-full">
    {/* Mobile Tab Navigation - Top */}
    <div className="tabs tabs-boxed bg-base-200 px-2 pt-2 flex overflow-x-auto">
      <button
        className={`tab flex-1 ${activeTab === 'problem' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('problem')}
      >
        <FaFileAlt className="mr-1" />
        <span className="text-xs">Problem</span>
      </button>
      <button
        className={`tab flex-1 ${activeTab === 'editorial' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('editorial')}
      >
        <FaBook className="mr-1" />
        <span className="text-xs">Editorial</span>
      </button>
      <button
        className={`tab flex-1 ${activeTab === 'solutions' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('solutions')}
      >
        <FaCode className="mr-1" />
        <span className="text-xs">Solutions</span>
      </button>
      <button
        className={`tab flex-1 ${activeTab === 'submissions' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('submissions')}
      >
        <FaHistory className="mr-1" />
        <span className="text-xs">Submissions</span>
      </button>
      <button
        className={`tab flex-1 ${activeTab === 'AskAI' ? 'tab-active' : ''}`}
        onClick={() => setActiveTab('AskAI')}
      >
        <FaRobot className="mr-1" />
        <span className="text-xs">Ask AI</span>
      </button>
    </div>

    {/* Mobile Content Area */}
    <div className="flex-1 overflow-auto p-3">
      {activeTab === 'problem' && (
        <div>
          <h2 className='mb-2 text-xl font-bold'>{problem.title}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="badge badge-outline">
              {problem.tags}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: problem.description }} />
          </div>
          
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Examples</h3>
            {problem.visibleTestCases.map((testCase, index) => (
              <div key={index} className="mb-3 bg-base-300 p-3 rounded-lg border border-base-content/10">
                <div className="mb-2">
                  <div className="text-xs font-medium text-base-content/70 mb-1">Input:</div>
                  <pre className="bg-base-100 p-2 rounded text-xs font-mono overflow-x-auto">
                    {testCase.input}
                  </pre>
                </div>
                <div className="mb-2">
                  <div className="text-xs font-medium text-base-content/70 mb-1">Output:</div>
                  <pre className="bg-base-100 p-2 rounded text-xs font-mono overflow-x-auto">
                    {testCase.output}
                  </pre>
                </div>
                {testCase.explanation && (
                  <div>
                    <div className="text-xs font-medium text-base-content/70 mb-1">Explanation:</div>
                    <p className="text-xs">{testCase.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'editorial' && (
        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-bold mb-3">Approach</h2>
          <p>Editorial content will go here...</p>
        </div>
      )}
      
      {activeTab === 'solutions' && (
        <div>
          <h2 className="text-lg font-bold mb-3">Reference Solutions</h2>
          <div className="space-y-3">
            {problem.referenceSolution.map((solution, index) => (
              <div key={index} className="collapse collapse-arrow bg-base-300">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">
                  {solution.language} Solution
                </div>
                <div className="collapse-content">
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto bg-base-100 p-2 rounded">
                    {solution.completeCode}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
        <div className="h-full flex flex-col" style={{ display: activeTab === 'AskAI' ? 'block' : 'none' }}>
          <h2 className="text-lg font-bold mb-2 text-center">AI Helper</h2>
          <div className="flex-1">
            <ChatAI mobileView={true} problem={problem}/>
          </div>
        </div>
      
      
      {activeTab === 'submissions' && (
        <div>
          <h2 className="text-lg font-bold mb-3">Your Submissions</h2>
          {submissions.length === 0 ? (
            <p className="text-base-content/70 text-sm">No submissions yet</p>
          ) : (
            <div className="space-y-2">
              {submissions.map((submission, index) => (
                <div key={index} className="card bg-base-300 shadow-sm">
                  <div className="card-body p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-base-content/70">
                          {new Date(submission.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm font-medium">
                          {submission.language}
                        </div>
                      </div>
                      <span className={`badge badge-sm ${
                        submission.status === 'accepted' ? 'badge-success' :
                        submission.status === 'wrong answer' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs">
                        <span className="mr-2">{submission.runTime.toFixed(5)} ms</span>
                        <span>{submission.memory} KB</span>
                      </div>
                      <button 
                        onClick={() => setViewingSubmissionCode(submission)}
                        className="btn btn-xs btn-ghost"
                      >
                        View Code
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Mobile Editor Toggle */}
    <div className="btm-nav btm-nav-sm bg-base-200 border-t border-base-300 flex flex-col items-center mb-20">
      
      <button 
        className={`${showEditor ? 'active' : ''}`}
        onClick={() => setShowEditor(true)}
      >
        <FaCode />
      </button>
      <h3 className="btm-nav-label">Click Icon To Write Code</h3>
    </div>

    {/* Mobile Editor Panel */}
    {showEditor && (
      <div className="fixed inset-0 bg-base-100 z-50 flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between p-2 bg-base-200 border-b border-base-300">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowEditor(false)}
              className="btn btn-sm btn-ghost"
            >
              <FaArrowLeft />
            </button>
            <h3 className="font-medium">Code Editor</h3>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="select select-xs select-bordered bg-base-100"
            >
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={languageToMonacoId[language] || 'javascript'}
            theme="vs-dark"
            value={codeByLanguage[language] || ''}
            onChange={(value) => {
            setCodeByLanguage(prev => ({  
              ...prev,
              [language]: value
            }));
          }}
          onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              padding: { top: 8 },
            }}
          />
        </div>

        {/* Editor Footer */}
        <div className="flex justify-between p-2 bg-base-200 border-t border-base-300">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`btn btn-sm btn-primary flex-1 mr-1 ${isRunning ? 'loading' : ''}`}
          >
            {!isRunning && <FaPlay size={12} className="mr-1" />}
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button
            onClick={handleSubmitCode}
            disabled={isSubmitting}
            className={`btn btn-sm btn-success flex-1 ml-1 ${isSubmitting ? 'loading' : ''}`}
          >
            {!isSubmitting && <FaCheck size={12} className="mr-1" />}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Console Panel */}
        <div className="h-1/3 flex flex-col border-t border-base-300">
          <div className="flex justify-between items-center p-2 bg-base-200 border-b border-base-300">
            <h3 className="font-medium text-sm">Console</h3>
          </div>
          <div 
            ref={consoleRef}
            className="flex-1 overflow-auto p-2 text-xs font-mono"
          >
            {compilationError && (
              <div className="alert alert-error mb-3 p-2">
                <FaExclamationTriangle size={14} />
                <span className="text-xs">Compilation Error</span>
                <pre className="whitespace-pre-wrap overflow-x-auto text-xs">
                  {compilationError}
                </pre>
              </div>
            )}
            
            {runResults && (
              <div className="space-y-2">
                <h4 className="font-medium mb-1 text-sm">Run Results</h4>
                {runResults.map((result, index) => (
                  <div key={index} className="mb-2 bg-base-300 p-2 rounded-lg border border-base-content/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium">Case {index + 1}</span>
                      <span className={`badge badge-xs ${
                        result.status_id === 3 ? 'text-success' : 'text-error'
                      }`}>
                        {result.status_id === 3 ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div>
                        <div className="text-xs text-base-content/70 mb-0.5">Input</div>
                        <pre className="bg-base-100 p-1 rounded whitespace-pre-wrap text-xs">
                          {problem.visibleTestCases[index]?.input}
                        </pre>
                      </div>
                      
                      <div>
                        <div className="text-xs text-base-content/70 mb-0.5">Expected</div>
                        <pre className="bg-base-100 p-1 rounded whitespace-pre-wrap text-xs">
                          {problem.visibleTestCases[index]?.output}
                        </pre>
                      </div>
                      
                      <div>
                        <div className="text-xs text-base-content/70 mb-0.5">Your Output</div>
                        <pre className={`p-1 rounded whitespace-pre-wrap text-xs ${
                          result.status_id === 3 ? 'bg-success' : 'bg-error'
                        }`}>
                          {result.stdout || 'No output'}
                        </pre>
                      </div>
                    </div>
                    
                    {result.status_id !== 3 && (
                      <div className="mt-2">
                        <div className="text-xs text-base-content/70 mb-0.5">Error</div>
                        <pre className="bg-error/20 p-1 rounded whitespace-pre-wrap text-xs">
                          {result.stderr || 'Wrong answer'}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
)}
      
      {/* Submission Results Modal */}
      {showSubmissionTab && submitResults && (
        <div className={`modal ${showSubmissionTab ? 'modal-open' : ''}`}>
          <div className="modal-box max-w-2xl bg-base-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Submission Result</h3>
              <button 
                onClick={() => setShowSubmissionTab(false)}
                className="btn btn-sm btn-circle"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`alert ${
                submitResults.accepted ? 'alert-success' : 'alert-error'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {submitResults.accepted ? <FaCheck size={20} /> : <FaExclamationTriangle size={20} />}
                      <span className="font-bold">
                        {submitResults.accepted ? 'Accepted' : 'Wrong Answer'}
                      </span>
                    </div>
                    <span className="text-sm">
                      {submitResults.testCasesPassed}/{submitResults.testCasesTotal} test cases passed
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="stats bg-base-300">
                  <div className="stat">
                    <div className="stat-title">Runtime</div>
                    <div className="stat-value text-primary text-lg">
                      {submitResults.runTime} ms
                    </div>
                  </div>
                </div>
                
                <div className="stats bg-base-300">
                  <div className="stat">
                    <div className="stat-title">Memory</div>
                    <div className="stat-value text-secondary text-lg">
                      {submitResults.memory} KB
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="stats bg-base-300">
                <div className="stat">
                  <div className="stat-title">Language</div>
                  <div className="stat-value text-lg">
                    {language}
                  </div>
                </div>
              </div>
              
              {!submitResults.accepted && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Failed Test Cases</h4>
                  <div className="space-y-3">
                    {submitResults.failedCases?.map((failedCase, index) => (
                      <div key={index} className="bg-base-300 p-3 rounded-lg">
                        <div className="text-sm font-medium mb-1">Input</div>
                        <pre className="bg-base-100 p-2 rounded text-xs font-mono whitespace-pre-wrap">
                          {failedCase.input}
                        </pre>
                        
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <div>
                            <div className="text-sm font-medium mb-1">Expected</div>
                            <pre className="bg-base-100 p-2 rounded text-xs font-mono whitespace-pre-wrap">
                              {failedCase.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Your Output</div>
                            <pre className="bg-error/20 p-2 rounded text-xs font-mono whitespace-pre-wrap">
                              {failedCase.actualOutput || 'No output'}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="modal-action">
                <button 
                  onClick={() => {
                    setActiveTab('submissions');
                    setShowSubmissionTab(false);
                  }}
                  className="btn btn-ghost"
                >
                  View All Submissions
                </button>
                <button 
                  className="btn btn-primary"
                >
                    <NavLink to="/problems">Next Challenge</NavLink>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Submitted Code Modal */}
    {viewingSubmissionCode && (
        <div className="modal modal-open">
            <div className="modal-box max-w-5xl bg-base-200 h-5/6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">
                Submission Code ({viewingSubmissionCode.language})
                </h3>
                <button 
                onClick={() => setViewingSubmissionCode(null)}
                className="btn btn-sm btn-circle"
                >
                <FaTimes />
                </button>
            </div>
            
            <div className="flex-1 bg-base-100 rounded-lg overflow-hidden">
                <Editor
                height="100%"
                language={languageToMonacoId[viewingSubmissionCode.language] || 'javascript'}
                theme="vs-dark"
                value={viewingSubmissionCode.code}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderWhitespace: 'none',
                    wordWrap: 'on',
                }}
                />
            </div>
            
            <div className="modal-action mt-4">
                <button 
                onClick={() => {
                    setCode(viewingSubmissionCode.code);
                    setLanguage(viewingSubmissionCode.language);
                    setViewingSubmissionCode(null);
                }}
                className="btn btn-primary"
                >
                Use This Code
                </button>
                <button 
                onClick={() => setViewingSubmissionCode(null)}
                className="btn btn-ghost"
                >
                Close
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default ProblemPage;