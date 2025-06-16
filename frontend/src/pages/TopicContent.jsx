import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axiosClient from "../utils/axiosClient";

function TopicContent() {
    const { topic } = useParams();
    const [allTitles, setAllTitles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTitles = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/content/contentbytopic/${topic}`);
                setAllTitles(response.data);
            } catch (err) {
                setError(err.response?.data || "Failed to fetch content");
            } finally {
                setLoading(false);
            }
        };
        fetchTitles();
    }, [topic]); // Added topic as dependency

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg">Loading {topic} content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-primary capitalize mb-2">{topic}</h1>
                    <div className="divider"></div>
                    <p className="text-lg text-gray-600">Explore all available content on this topic</p>
                </div>

                {allTitles.length === 0 ? (
                    <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>No content available for this topic yet.</span>
                    </div>
                ) : (
                    <div className="bg-base-200 rounded-box p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Available Content</h2>
                        <ul className="space-y-4">
                            {allTitles.map((curr) => (
                                <li key={curr._id} className="hover:bg-base-300 transition-colors p-3 rounded-lg">
                                    <Link 
                                        to={`/content/${topic}/${curr._id}`} 
                                        className="flex items-center text-lg hover:text-primary transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                        </svg>
                                        {curr.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopicContent;