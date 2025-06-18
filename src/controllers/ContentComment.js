import ContentComment from "../models/contentComment.js";
import Content from "../models/content.js";
import Notification from "../models/notification.js";

const postContentComment = async (req,res)=> {
    
    
    const { contentId, content, parentCommentId } = req.body;
    
    const userId = req.result._id

    try {

         if(!contentId || !content)
         {
            throw new Error("Incomplete Credentials")
         }

        const comment = await ContentComment.create({
            contentId,
            userId:req.result._id,
            content,
            parentCommentId: parentCommentId || null
        });

        if (parentCommentId) {
            
            const parentComment = await ContentComment.findById(parentCommentId);
            if (parentComment.userId!=userId) 
                {
                await Notification.create({
                    userId: parentComment.userId,
                    contentId:contentId,
                    message: 'Someone replied to your comment'
                });
            }
        } 
        else 
        {
        
            const content = await Content.findById(contentId);
            if (content.ContentCreator!= userId) 
                {
                await Notification.create(
                    {
                    userId: content.ContentCreator,
                    contentId:contentId,
                    message: 'New comment on your article'
                });
            }

    } 
      res.status(201).send(comment);
}
    catch (err) {
        res.status(500).send( err.message );
    }
}

const getContentComment = async (req, res) => {
    const buildCommentTree = (comments, parentId = null) => {
        return comments
            .filter(c => String(c.parentCommentId) === String(parentId))
            .sort((a, b) => b.createdAt - a.createdAt)
            .map(c => {
                return {
                    ...c.toObject(),
                    replies: buildCommentTree(comments, c._id)
                }
            });
    };

    try {
        const allComments = await ContentComment.find({ contentId: req.params.contentId })
            .sort( {createdAt:1} )
            .populate({
                path: 'userId',
                select: '_id firstName lastName role' // Only include the fields you need
            });

        const nestedComments = buildCommentTree(allComments);
        res.status(200).send(nestedComments);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const getCommentsNotification = async (req,res) =>{

   try {
        const notifications = await Notification.find({ userId: req.result._id, isRead: false })
        .sort({ createdAt: -1 })
        .populate(
            {
                path:"contentId",
                select:"_id topic title"
            }
        )

        res.status(200).send(notifications);

    } 
    catch (err) 
    {
        res.status(500).json(err.message );
    }

}

const readCommentNotification = async (req, res) => {
    const { notificationId } = req.params;

    try {
        if(!notificationId)
        {
            throw new Error ("Id is missing")
        }
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).send("Notification marked as read");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteComment = async (req,res) => {

const deleteCommentAndChildren = async (commentId) => 
{
        console.log("commentId"+commentId)
    const childComments = await ContentComment.find({ parentCommentId: commentId });
    console.log("Deleted2:", childComments)
    for (let child of childComments) 
    {
        await deleteCommentAndChildren(child._id);
    }
    await ContentComment.findByIdAndDelete(commentId);
}

try 
    {
        await deleteCommentAndChildren(req.params.commentId);
        console.log("Deleted1")
        res.status(200).send('Comment and its replies deleted');
    } 
    catch (err) 
    {
        res.status(500).send("Error:" + err.message);
    }
};



export {postContentComment,getContentComment,getCommentsNotification,readCommentNotification,deleteComment}