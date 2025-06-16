import axiosClient from "../utils/axiosClient";
import AdminEditor from "./AdminEditor";
import { useEffect, useState } from "react";
import UpdateEditor from "./UpdateEditor";
import { toast } from "react-toastify";

function ContentDelete()
{
    const [topic,setTopic] = useState(null);
    const [selectedContent,setSelectedContent] = useState(null);
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState(null)
    const [totalContent,setTotalContent] = useState([])

    const handleContentDelete = async ()=>{
        setLoading(true)
        try{
              const response = await axiosClient.delete(`/content/delete/${selectedContent._id}`)
              setMessage(response?.data)
        }
        catch(err)
        {
              toast.error(err?.response?.data)
        }
          finally{
            setLoading(false)
          }
    }

    useEffect(()=>{
  
         const fetchContent = async ()=>{
          try{
                const response = await axiosClient.get("/content/allcontent");
                setTotalContent(response.data)
          }
          catch(err)
          {
                console.log("Error:"+err.message)
          }
        }
        fetchContent();

    },[])
    
    const filteredContent = totalContent.filter((curr)=>{
        return curr.topic===topic
    })

    const optionArray = ['Array','LinkedList','Binary Tree','Binary Search Tree', 'Recursion', 'Graph','Heap','Stack','Queue']
    return (
        <>
          <div className="alert alert-warning mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Warning: Deleting a Article cannot be undone!</span>
        </div>
        <div className="flex flex-row items-center px-4">
                          <label htmlFor="topic" className="mr-2"><span>Topic:</span></label>
                        <select id="topic" className="bg-base-100 select select-bordered mb-3 mr-2" required={true} value={topic}
                        onChange={(e)=>{setTopic(e.target.value)}}>
                            <option value="" disabled selected>Choose Topic:</option>
                           { optionArray.map((curr)=><option value={curr}>{curr}</option>)}
                        </select>
        </div>

        <div className="px-4">
 
            <label htmlFor="content" className="mr-2"> <span>Select Article:</span></label>
               <select 
                id="content" 
                value={selectedContent} 
                className="select select-bordered bg-base-100 "
                onChange={(e) => {
                    const contentId = e.target.value;
                    const content = filteredContent.find(c => c._id === contentId);
                    setSelectedContent(content || null);
                }}
            >
                <option value="" disabled selected>Choose Article:</option>
                {filteredContent.map((curr) => (
                    <option key={curr._id} value={curr._id} >{curr.title|| 1}</option>
                ))}
            </select>

        </div>
 
       { selectedContent && (
          <div className="p-4">
            <h3 className="text-center mb-5 font-semibold">Selected Content: {selectedContent.title}</h3>
            <div className="bg-base-200 rounded-2xl p-4 mb-3" dangerouslySetInnerHTML={{__html:selectedContent.content}}></div>
            <div className="flex flex-row-reverse px-4 pb-4">
            <button className={`btn btn-error ${loading ? "bg-gray-700":""}`} onClick={handleContentDelete}> {`${loading ? "Deleting":"Delete"}`}</button>
        </div>
        </div>
       )

    }
    
        {
            message && (
                <div className="bg-success p-6">{message}</div>
            )
        }
        </>

    )
}

export default ContentDelete;