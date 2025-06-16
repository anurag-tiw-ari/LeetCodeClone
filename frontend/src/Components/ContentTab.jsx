
import AdminEditor from "./AdminEditor";
import { useState } from "react";
import ContentCreate from "./ContentCreate.jsx";
import ContentUpdate from "./ContentUpdate.jsx";
import ContentDelete from "./ContentDelete.jsx";

function ContentTab ()
{

    const [selected,setSelected] = useState(null);
    
     return(

        <>
        <div className="flex justify-evenly p-4">
            <button className={`btn ${selected==='write' ? "btn-primary":"btn-outline btn-primary"}`} onClick={(()=>setSelected("write"))}>Write</button>
            <button className={`btn ${selected==='update' ? "btn-warning":"btn-outline btn-warning"}`} onClick={(()=>setSelected("update"))}>Update</button>
            <button className={`btn ${selected==='delete' ? "btn-error":"btn-outline btn-error"}`} onClick={(()=>setSelected("delete"))}>Delete</button>
        </div>

        <div className="create" style={{display:`${selected==='write'? "block":"none"}`}}><ContentCreate /></div>
        <div className="update" style={{display:`${selected==='update'? "block":"none"}`}}><ContentUpdate /></div>
        <div className="delete" style={{display:`${selected==='delete'? "block":"none"}`}}><ContentDelete /></div>

        </>
     )
}

export default ContentTab;