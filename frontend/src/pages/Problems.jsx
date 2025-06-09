import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Problems() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  //console.log("user", user)
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  const [percentageValue,setPercentageValue] = useState(0);
  //const [solvedNumber,setSolvedNumber] = useState(0)

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
      //  console.log('a')
        const { data } = await axiosClient.get('/problem/solvedProblemsByUser');
     //   console.log('b')
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, []);


  const filteredProblems = problems.filter((problem) => 
    {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  const solvedNumber = filteredProblems.filter((problem)=>
    {
             const statusMatch = solvedProblems.some(sp => sp._id === problem._id);;

             return statusMatch;
  })


  useEffect(()=>{
    if(filteredProblems.length!=0)
   { 
    setPercentageValue((solvedNumber.length/filteredProblems.length)*100)
   }
   else
    {
        setPercentageValue(0)
    }
},[filters,solvedNumber,filteredProblems])


//  useEffect(()=>{setSolvedNumber(solvedProblems.length)},[solvedProblems])

  return (
    <div className="min-h-screen bg-base-200 pt-25">


      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {/* New Status Filter */}
          <select 
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="Array">Array</option>
            <option value="String">String</option>
            <option value="Recursion">Recusrion</option>
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
        <div className='flex justify-center mb-3 items-center'>
            <p className='text-xs'>{solvedNumber.length}/{filteredProblems.length}</p>
            <progress className="progress progress-primary w-56 mx-0.5"  value={percentageValue} max="100"></progress>
            <p className='text-xs'>{percentageValue}%</p>
        </div>
         
        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-secondary">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Problems;