import { useState, useEffect } from 'react';
import { IoMdStats, IoMdDocument } from "react-icons/io";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';
import axiosClient from '../utils/axiosClient';

export default function ContentStatsTab() {
    const [contentType, setContentType] = useState('all'); // 'all', 'my', 'latest'
    const [topicFilter, setTopicFilter] = useState('all');
    const [allContent, setAllContent] = useState([]);
    const [userContent, setUserContent] = useState([]);
    const [latestUserContent, setLatestUserContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const topics = ['Array', 'LinkedList', 'Binary Tree', 'Binary Search Tree', 'Recursion', 'Graph', 'Heap', 'Stack', 'Queue'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch all content
               // console.log("H1")
                const allResponse = await axiosClient.get('/content/allcontent');
                setAllContent(allResponse.data);
                
                // Fetch user content
              //  console.log("H2")
                const userResponse = await axiosClient.get('/content/contentbyuser');
                setUserContent(userResponse.data);
                
                // Fetch latest user content
              //  console.log("H3")
                const latestResponse = await axiosClient.get('/content/latestcontentbyuser');
                setLatestUserContent(latestResponse.data);
                
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch content');
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);


    const getFilteredContent = () => {
        let content = [];
        switch(contentType) {
            case 'my':
                content = [...userContent];
                break;
            case 'latest':
                content = [...latestUserContent];
                break;
            default:
                content = [...allContent];
        }
        
        if (topicFilter !== 'all') {
            content = content.filter(item => item.topic === topicFilter);
        }
        
        return content;
    };

const getContentStats = (content) => {
    const stats = {
        total: content.length,
        byTopic: {},
        byDate: {}
    };
    
    // Count by topic
    topics.forEach(topic => {
        stats.byTopic[topic] = content.filter(item => item.topic === topic).length;
    });
    
    // Count by date (last 7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        stats.byDate[dateString] = content.filter(item => {
            // Use updatedAt for latest content, createdAt for others
            const dateField = contentType === 'latest' ? item.updatedAt : item.createdAt;
            if (!dateField) return false;
            
            try {
                const itemDate = new Date(dateField);
                if (isNaN(itemDate.getTime())) return false;
                
                itemDate.setHours(0, 0, 0, 0); // Normalize to start of day
                const itemDateString = itemDate.toISOString().split('T')[0];
                return itemDateString === dateString;
            } catch (e) {
                return false;
            }
        }).length;
    }
    
    return stats;
};
    const filteredContent = getFilteredContent();
    const stats = getContentStats(filteredContent);

        useEffect(() => {
    console.log("Filtered content dates:", 
        filteredContent.map(item => ({
            title: item.title,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            type: contentType
        }))
    );
}, [filteredContent, contentType]);

    const chartData = topics.map(topic => ({
        name: topic,
        count: stats.byTopic[topic]
    }));

    const dateChartData = Object.keys(stats.byDate).map(date => ({
        name: date,
        count: stats.byDate[date]
    }));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 w-full">
            <div className="bg-base-100 rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <IoMdStats /> Content Statistics
                </h2>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="form-control w-full md:w-1/2">
                        <label className="label">
                            <span className="label-text">Content Type</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value)}
                        >
                            <option value="all">All Content</option>
                            <option value="my">My Content</option>
                            <option value="latest">My Content By Latest</option>
                        </select>
                    </div>
                    
                    <div className="form-control w-full md:w-1/2">
                        <label className="label">
                            <span className="label-text">Filter by Topic</span>
                        </label>
                        <select 
                            className="select select-bordered"
                            value={topicFilter}
                            onChange={(e) => setTopicFilter(e.target.value)}
                        >
                            <option value="all">All Topics</option>
                            {topics.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="stats bg-base-100 shadow">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <IoMdDocument className="text-2xl" />
                            </div>
                            <div className="stat-title">Total Content</div>
                            <div className="stat-value text-primary">{stats.total}</div>
                            <div className="stat-desc">All topics</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-base-100 shadow">
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <IoMdDocument className="text-2xl" />
                            </div>
                            <div className="stat-title">My Content</div>
                            <div className="stat-value text-secondary">{userContent.length}</div>
                            <div className="stat-desc">Created by me</div>
                        </div>
                    </div>
                    
                    <div className="stats bg-base-100 shadow">
                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <IoMdDocument className="text-2xl" />
                            </div>
                            <div className="stat-title">Latest Content</div>
                            <div className="stat-value text-accent">{Object.values(stats.byDate).reduce((sum, count) => sum + count, 0)}</div>
                            <div className="stat-desc">Last 7 Days</div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-base-200 p-4 rounded-box">
                        <h3 className="text-lg font-semibold mb-4">Content by Topic</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" name="Content Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-box">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dateChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#82ca9d" name="Last 7 Days Content" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                <div className="bg-base-200 rounded-box p-6 shadow-lg">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <IoMdDocument /> Content List
                    </h3>
                    
                    {filteredContent.length === 0 ? (
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>No content found with the current filters</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-primary text-primary-content">
                                        <th className="rounded-tl-lg">Title</th>
                                        <th>Topic</th>
                                        <th className="rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContent.map((content) => (
                                        <tr key={content._id} className="hover:bg-base-300">
                                            <td>{content.title}</td>
                                            <td>
                                                <span className="badge badge-outline">{content.topic}</span>
                                            </td>
                                            <td>
                                                <Link 
                                                    to={`/content/${content.topic}/${content._id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}