import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import axiosClient from "../utils/axiosClient";

function ArticlePage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/content/contentbyId/${id}`);
                setArticle(response.data);
            } catch (err) {
                setError(err.response?.data || "Failed to fetch article");
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]); // Added id as dependency

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-lg">Loading article...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="alert alert-error max-w-md shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="font-bold">Error loading article</h3>
                        <div className="text-xs">{error}</div>
                    </div>
                    <Link to="/" className="btn btn-sm btn-ghost">Back to Home</Link>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="alert alert-warning max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Article not found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-primary mb-4">{article.title}</h1>
                    {article.topic && (
                        <div className="badge badge-primary badge-lg mb-4">
                            {article.topic}
                        </div>
                    )}
                    <div className="divider"></div>
                </div>

                <div className="bg-base-200 rounded-box p-8 shadow-lg">
                    <article 
                        className="prose lg:prose-xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    ></article>
                </div>

                <div className="mt-10 text-center">
                    <Link to={`/content/${article.topic}`} className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to {article.topic} Content
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ArticlePage;