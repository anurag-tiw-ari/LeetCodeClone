
import axiosClient from "../utils/axiosClient";
import AdminEditor from "./AdminEditor";
import { useEffect, useState } from "react";
import UpdateEditor from "./UpdateEditor";

function ContentUpdate()
{
    const [topic,setTopic] = useState(null);
    const [selectedContent,setSelectedContent] = useState(null);
    const [title,setTitle] = useState(null)
    
    const [totalContent,setTotalContent] = useState([])

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

        <div className="flex flex-row items-center">
                          <label htmlFor="topic" className="mr-2"><span>Topic:</span></label>
                        <select id="topic" className="bg-base-100 select select-bordered" required={true} value={topic}
                        onChange={(e)=>{setTopic(e.target.value)}}>
                            <option value="" disabled selected>Choose Topic:</option>
                           { optionArray.map((curr)=><option value={curr}>{curr}</option>)}
                        </select>
        </div>

        <div>
 
            <label htmlFor="content"> <span>Select Article:</span></label>
               <select 
                id="content" 
                value={selectedContent} 
                className="select select-bordered bg-base-100"
                onChange={(e) => {
                    const contentId = e.target.value;
                    const content = filteredContent.find(c => c._id === contentId);
                    setSelectedContent((prev)=> content || null);
                    setTitle(content?.title || null)
                }}
            >
                <option value="" disabled selected>Choose Article:</option>
                {filteredContent.map((curr) => (
                    <option key={curr._id} value={curr._id} >{curr.title|| 1}</option>
                ))}
            </select>

        </div>
 
       { selectedContent && (
         <div className="px-4 py-2">
        
                    <div className="flex flex-row items-center">
                          <label htmlFor="topic" className="mr-2"><span>Topic:</span></label>
                        <select id="topic" className="bg-base-100 select select-bordered" required={true} value={selectedContent.topic}
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
                       <UpdateEditor selectedContent={selectedContent} />
                </div>
        )
    }
        </>

    )
}

export default ContentUpdate;