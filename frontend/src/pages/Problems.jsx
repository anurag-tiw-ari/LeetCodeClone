import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Problems() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [likedProblems, setLikedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const [percentageValue, setPercentageValue] = useState(0);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/solvedProblemsByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    const fetchLikedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/likedProblemsByUser');
        setLikedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) 
      {
        fetchSolvedProblems();
        fetchLikedProblems();
      }
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id) || 
    filters.status === 'liked' && likedProblems.some(lp => lp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const solvedNumber = filteredProblems.filter((problem) =>
    solvedProblems.some(sp => sp._id === problem._id)
  ).length;

  useEffect(() => {
    if (filteredProblems.length !== 0) { 
      setPercentageValue((solvedNumber / filteredProblems.length) * 100);
    } else {
      setPercentageValue(0);
    }
  }, [filters, solvedNumber, filteredProblems]);

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary">Problem Set</h1>
          <p className="text-base-content/70 mt-2">Practice to improve your skills</p>
        </div>

        {/* Filters Section */}
        <div className="bg-base-100 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Problems</option>
                <option value="solved">Solved Problems</option>
                <option value="liked">Liked Problems</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">Difficulty</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">Tags</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={filters.tag}
                onChange={(e) => setFilters({...filters, tag: e.target.value})}
              >
                <option value="all">All Tags</option>
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

          {/* Progress Bar */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  {solvedNumber}/{filteredProblems.length} solved
                </span>
                <span className="text-sm font-medium">
                  {percentageValue.toFixed(0)}%
                </span>
              </div>
              <progress 
                className="progress progress-primary w-full h-3" 
                value={percentageValue} 
                max="100"
              ></progress>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.length > 0 ? (
            filteredProblems.map(problem => (
              <div key={problem._id} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
                <div className="card-body p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="card-title text-lg">
                        <NavLink 
                          to={`/problem/${problem._id}`} 
                          className="hover:text-primary transition-colors"
                        >
                          {problem.title}
                        </NavLink>
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} border-gray-700`}>
                          {problem.difficulty}
                        </div>
                        <div className="badge border-gray-700">
                          {problem.tags}
                        </div>
                      </div>
                    </div>
                    
                    {solvedProblems.some(sp => sp._id === problem._id) ? (
                      <div className="badge badge-success gap-2 px-4 py-3 hover:bg-green-300">
                        Solved
                      </div>
                    ) : ( <div className="badge bg-white gap-2 px-5 py-3 text-green-950 hover:bg-green-300">
                        <NavLink to={`/problem/${problem._id}`}>
                           Solve
                        </NavLink>
                      </div>)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🧐</div>
              <h3 className="text-xl font-medium">No problems found</h3>
              <p className="text-base-content/70">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-success';
    case 'medium': return 'text-warning';
    case 'hard': return 'text-error';
    default: return 'badge-neutral';
  }
};

export default Problems;