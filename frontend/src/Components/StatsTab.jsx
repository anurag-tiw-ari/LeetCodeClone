import { IoMdStats } from "react-icons/io";

export default function StatsTab({ problems, createdProblems }) {
    const EasyProblems = problems?.filter((curr) => curr.difficulty === 'easy');
    const mediumProblems = problems?.filter((curr) => curr.difficulty === 'medium');
    const hardProblems = problems?.filter((curr) => curr.difficulty === 'hard');

    const createdEasyProblems = createdProblems?.filter((curr) => curr.difficulty === 'easy');
    const createdMediumProblems = createdProblems?.filter((curr) => curr.difficulty === 'medium');
    const createdHardProblems = createdProblems?.filter((curr) => curr.difficulty === 'hard');

    return (
        <div className="p-4 w-full">
            <div className="bg-base-100 rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <IoMdStats /> Problems Statistics
                </h2>
                <div className="overflow-x-auto">
                    <table className="table w-full border-collapse">
                        <thead>
                            <tr className="bg-primary text-primary-content">
                                <th className="p-3 text-left rounded-tl-lg">Problems</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Easy</th>
                                <th className="p-3 text-left">Medium</th>
                                <th className="p-3 text-left rounded-tr-lg">Hard</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-base-200 border-b border-base-300">
                                <td className="p-3">All Problems</td>
                                <td className="p-3">{problems?.length}</td>
                                <td className="p-3">{EasyProblems?.length}</td>
                                <td className="p-3">{mediumProblems?.length}</td>
                                <td className="p-3">{hardProblems?.length}</td>
                            </tr>
                            <tr className="hover:bg-base-200">
                                <td className="p-3">Your Problems</td>
                                <td className="p-3">{createdProblems?.length}</td>
                                <td className="p-3">{createdEasyProblems?.length}</td>
                                <td className="p-3">{createdMediumProblems?.length}</td>
                                <td className="p-3">{createdHardProblems?.length}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats bg-base-100 shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Problems</div>
                        <div className="stat-value text-primary">{problems?.length}</div>
                        <div className="stat-desc">All difficulty levels</div>
                    </div>
                </div>

                <div className="stats bg-base-100 shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Your Problems</div>
                        <div className="stat-value text-secondary">{createdProblems?.length}</div>
                        <div className="stat-desc">Created By You</div>
                    </div>
                </div>

                <div className="stats bg-base-100 shadow">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Hard Problems</div>
                        <div className="stat-value text-accent">{hardProblems?.length}</div>
                        <div className="stat-desc">Created By You</div>
                    </div>
                </div>
            </div>
        </div>
    );
}