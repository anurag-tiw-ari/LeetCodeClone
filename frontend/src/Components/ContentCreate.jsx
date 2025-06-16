
import AdminEditor from "./AdminEditor";
import { useState } from "react";

function ContentCreate()
{
    const [topic,setTopic] = useState(null);
    const [title,setTitle] = useState(null);

    const optionArray = ['Array','LinkedList','Binary Tree','Binary Serach Tree', 'Recursion', 'Graph','Heap','Stack','Queue']
    return (
         <div className="px-4 py-2">
        
                    <div className="flex flex-row items-center">
                          <label htmlFor="topic" className="mr-2"><span>Topic:</span></label>
                        <select id="topic" className="bg-base-100 select select-bordered" required={true} value={topic}
                        onChange={(e)=>{setTopic(e.target.value)}}>
                            <option value="" disabled selected>Choose Topic:</option>
                           { optionArray.map((curr)=><option value={curr}>{curr}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="algo" className="mr-2 mt-2">Title:</label>
                        <input type="text" id="algo" className="input input-bordered mt-3" placeholder="Provide Title..." 
                        value={title} onChange={(e)=>{setTitle(e.target.value)}} />
                    </div>
                       <AdminEditor topic={topic} title={title} content="" />
                </div>
    )
}

export default ContentCreate;