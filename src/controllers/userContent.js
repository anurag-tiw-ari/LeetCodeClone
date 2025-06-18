
import User from "../models/user.js";
import Content from "../models/content.js";

const contentUpload = async (req,res)=>{
    try{
    
    const {topic,content,title} = req.body;

    if(!topic || !content || !title)
    {
        throw new Error("Incomplete Requirements")
    }

    await Content.create({...req.body,ContentCreator:req.result._id});

    res.status(201).send("Content Saved Successfully")

    }
    catch(err)
    {
        res.status(401).send("Error:" + err.message)
    }

}

const getAllContent = async (req,res)=>{

    try{
    const content = await Content.find({});
    
    res.status(200).send(content)
    }
    catch(err)
    {
        res.status(400).send("Error:"+err.message)
    }

}

const contentUpdate = async (req,res)=>{
  
    try{

    
    const {contentId} = req.params;

    const {topic,content,title} = req.body;

    if(!contentId)
    {
        throw new Error("Id is missing")
    }

    const contentfound = await Content.findById(contentId)

    if(!contentfound)
    {
        throw new Error("Content Does Not Exist")
    }

    await Content.findByIdAndUpdate(contentId,req.body,{runValidators:true,new:true})

    res.status(200).send("Problem Updated Successfully")
    }
    catch(err)
    {
        res.status(400).send("Error:"+err.message);
    }

}

const contentDelete = async (req,res)=>{

    try{
    const {contentId} = req.params;

    if(!contentId) 
    {
        throw new Error("Id is Missing")
    }

    const foundContent = await Content.findById(contentId)

    if(!foundContent)
    {
        throw new Error("Content is not Available")
    }

    await Content.findByIdAndDelete(contentId);

    res.status(200).send("Content Deleted Successfully")
    }
    catch(err)
    {
        res.status(400).send("Error:"+ err.message)
    }

}

const getContentByTopic = async (req,res)=>{

    try{
    const {topic} = req.params;
    
    if(!topic)
    {
        throw new Error("Topic is Missing")
    }

    const titles = await Content.find({topic}).select("_id title")

    if(titles.length==0)
    {
        throw new Error("No Content is Available for Topic")
    }

     res.status(200).send(titles);

    }
    catch(err)
    {
     res.status(400).send("Error:"+err.message);
    }

}

const getContentById =async (req,res)=>{

    try{
    const {contentId} = req.params;
    
    if(!contentId)
    {
        throw new Error("Id is Missing")
    }

    const article = await Content.findById(contentId);

    if(!article)
    {
        throw new Error("Article Not Available")
    }

     res.status(200).send(article);

    }
    catch(err)
    {
     res.status(400).send("Error:"+err.message);
    }
}

const getContentByUser = async (req,res)=>{

 //   console.log(req.result)
 try{
    const id = req.result._id;

    const allContents = await Content.find({ContentCreator:id}).select("_id title topic createdAt updatedAt")

    res.status(200).send(allContents)
 }
 catch(err)
 {
    res.status(400).send("Error:"+err.message)
 }
}

const getLatestContentByUser = async (req,res)=>{

    try{

     const id = req.result._id;

     const allContents = await Content.find({ContentCreator:id}).sort({updatedAt:-1}).select("_id title topic updatedAt createdAt")

     res.status(200).send(allContents)
    }
    catch(err)
    {
        res.status(400).send("Error:"+err.message)
    }


}

export {contentUpload,getAllContent,contentUpdate,contentDelete,getContentByTopic,getContentById,getContentByUser,getLatestContentByUser}