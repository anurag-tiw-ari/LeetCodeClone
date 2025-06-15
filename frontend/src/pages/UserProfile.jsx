import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import YearHeatmap from "../Components/heatMap";
import axiosClient from "../utils/axiosClient";

function UserProfile() {
    const [total, setTotal] = useState([]);
    const [solved, setSolved] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [problemsRes, solvedRes] = await Promise.all([
                    axiosClient.get('/problem/getAllProblem'),
                    user ? axiosClient.get('/problem/solvedProblemsByUser') : { data: [] }
                ]);
                setTotal(problemsRes.data);
                setSolved(user ? solvedRes.data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const difficultyStats = (totalProblems, solvedProblems) => {
        const difficulties = ['easy', 'medium', 'hard'];
        return difficulties.map(difficulty => {
            const total = totalProblems.filter(p => p.difficulty === difficulty).length;
            const solved = solvedProblems.filter(p => p.difficulty === difficulty).length;
            const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
            
            return {
                difficulty,
                total,
                solved,
                percentage
            };
        });
    };

    const stats = difficultyStats(total, solved);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 mt-15" data-theme="dark">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-shrink-0">
                    {user ? (
                        <div className="w-32 h-32 rounded-full bg-neutral flex items-center justify-center overflow-hidden">
                            <span className="text-4xl font-bold text-neutral-content">
                                {user.firstName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    ) : (
                        <img 
                            src="https://th.bing.com/th/id/OIP.-OwdeGjbVmQWf62Ynk9_8AHaHa?r=0&w=720&h=720&rs=1&pid=ImgDetMain" 
                            alt="Default user" 
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    )}
                </div>
                
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2 ">
                        {user ? `${user.firstName}` : 'Anonymous User'}
                    </h1>
                    <p className="mb-4">
                        {user ? user.email : 'Not logged in'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="bg-base-200 p-4 rounded-lg shadow-sm border border-base-300 flex-1 min-w-[200px]">
                            <h3 className=" text-sm font-medium">Total Solved</h3>
                            <p className="text-2xl font-bold text-primary">{solved.length}</p>
                        </div>
                        <div className="bg-base-200 p-4 rounded-lg shadow-sm border border-base-300 flex-1 min-w-[200px]">
                            <h3 className=" text-sm font-medium">Total Problems</h3>
                            <p className="text-2xl font-bold text-secondary">{total.length}</p>
                        </div>
                        <div className="bg-base-200 p-4 rounded-lg shadow-sm border border-base-300 flex-1 min-w-[200px]">
                            <h3 className=" text-sm font-medium">Accuracy</h3>
                            <p className="text-2xl font-bold text-accent">
                                {total.length > 0 ? Math.round((solved.length / total.length) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="bg-base-200 p-6 rounded-lg shadow-sm border border-base-300 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-neutral-content">Activity Heatmap</h2>
                <div className="overflow-x-auto">
                    <YearHeatmap  />
                </div>
            </div>

            {/* Difficulty Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-base-200 p-6 rounded-lg shadow-sm border border-base-300">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="capitalize text-lg font-semibold">
                                {stat.difficulty}
                            </h3>
                            <span className="text-sm">
                                {stat.solved}/{stat.total} ({stat.percentage}%)
                            </span>
                        </div>
                        <div className="w-full bg-neutral rounded-full h-2.5">
                            <div 
                                className={`h-2.5 rounded-full ${
                                    stat.difficulty === 'easy' ? 'bg-success' :
                                    stat.difficulty === 'medium' ? 'bg-warning' : 'bg-error'
                                }`} 
                                style={{ width: `${stat.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-base-200 p-6 rounded-lg shadow-sm border border-base-300">
                <h2 className="text-xl font-semibold mb-4 ">Recent Activity</h2>
                {solved.length > 0 ? (
                    <ul className="space-y-3">
                        {solved.slice(0, 5).map((problem, index) => (
                            <li key={index} className="flex items-center p-3 hover:bg-base-300 rounded-lg transition-colors">
                                <span className={`w-3 h-3 rounded-full mr-3 ${
                                    problem.difficulty === 'easy' ? 'bg-success' :
                                    problem.difficulty === 'medium' ? 'bg-warning' : 'bg-error'
                                }`}></span>
                                <span className="font-medium flex-1 text-neutral-content">{problem.title}</span>
                                <span className="text-sm capitalize">{problem.difficulty}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-neutral">No recent activity</p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
