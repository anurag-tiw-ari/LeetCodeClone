import React, { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { FaReply, FaPaperPlane, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";

const Comment = ({ comment, depth = 0, onReply,onDelete, currentUser,commentId }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const {user} = useSelector((state)=>state.auth);
    
        useEffect(()=>{
  
          if(commentId)
          {
              const element = document.getElementById(`comment-${commentId}`)
  
              if(element)
              {
                  element.scrollIntoView({behavior:'smooth', block:'center'}),
                  element.classList.add("bg-gray-600")
                  setTimeout(()=>{
                  element.classList.remove("bg-gray-600")
                  },3000)
              }
              console.log("element", element)
          }
  
      },[commentId])

  console.log("user", user)

  const navigate = useNavigate();

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    await onReply(comment._id, replyContent);
    setReplyContent('');
    setReplying(false);
  };


  return (
    <div 
      className={`p-4 mt-2 rounded-lg ${depth % 2 === 0 ? 'bg-base-200' : 'bg-base-100'} 
      ${depth > 0 ? `ml-${depth * 4} border-l-2 border-primary` : ''}`}
    >
      <div className="flex items-center mb-2">
  <div className="avatar">
  <div className="w-6 h-6 rounded-full overflow-hidden">
    <img 
      src={comment.userId.profilePic.secureURL || 'https://th.bing.com/th/id/OIP.-OwdeGjbVmQWf62Ynk9_8AHaHa?r=0&w=720&h=720&rs=1&pid=ImgDetMain'} 
      alt="User avatar"
      className="w-full h-full object-cover cursor-pointer"
      onClick={() => navigate(`/userprofile/${comment.userId._id}`)}
    />
  </div>
</div>
        <span className="font-bold text-sm ml-2">
          {comment.userId?.firstName || 'Anonymous'}
        </span>
        <span className="text-gray-500 text-xs ml-2">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        <span className="text-primary text-sm ml-2">
          {`${comment?.userId?.role==='admin' ? "By Admin":""}`}
        </span>
      </div>
      
      <p className="whitespace-pre-wrap break-words text-sm" id={`comment-${comment._id}`}>{comment.content}</p>

      {comment.userId._id == user._id || user.role==='admin' ?(
      <div className='flex flex-row-reverse'><button onClick={()=>{onDelete(comment)}} className='text-xl text-gray-700 hover:text-red-600'><MdDeleteOutline /></button></div>)
      : null
      }
      
      <div className="flex justify-between items-center mt-2">
        <button 
          onClick={() => setReplying(!replying)}
          className="btn btn-ghost btn-xs flex items-center"
        >
          <FaReply className="mr-1" size={14} />
          Reply
        </button>
        
        {comment.replies?.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="btn btn-ghost btn-xs flex items-center"
          >
            {showReplies ? (
              <>
                Hide replies <FaChevronUp className="ml-1" size={14} />
              </>
            ) : (
              <>
                Show replies ({comment.replies.length}) <FaChevronDown className="ml-1" size={14} />
              </>
            )}
          </button>
        )}
      </div>
      
      {replying && (
        <div className="mt-2 flex items-start">
          <textarea
            className="textarea textarea-bordered flex-1"
            rows="2"
            placeholder="Write your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button 
            onClick={handleReplySubmit} 
            disabled={!replyContent.trim()}
            className="btn btn-ghost ml-2"
          >
            <FaPaperPlane />
          </button>
        </div>
      )}
      
      {showReplies && comment.replies?.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onDelete = {onDelete}
              currentUser={currentUser}
              commentId={commentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function CommentsSection({ contentId,commentId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/contentcomment/getcomments/${contentId}`);
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [contentId]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    
    try {
      await axiosClient.post('/contentcomment/postcomment', {
        contentId: contentId,
        content: commentContent,
        parentCommentId: null
      });
      setCommentContent('');
      
      // Refresh comments
      const res = await axiosClient.get(`/contentcomment/getcomments/${contentId}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error posting comment:', error.response.data);
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      await axiosClient.post('/contentcomment/postcomment', {
        contentId: contentId,
        content: content,
        parentCommentId: parentCommentId
      });
      
      // Refresh comments
      const res = await axiosClient.get(`/contentcomment/getcomments/${contentId}`);
      setComments(res.data);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleCommentDelete = async (comment) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment and its replies?");
    if (!confirmDelete) return;

    try {
        await axiosClient.delete(`/contentcomment/deletecomment/${comment._id}`);
        const res = await axiosClient.get(`/contentcomment/getcomments/${contentId}`);
        setComments(res.data);
    } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Failed to delete comment. Please try again.");
    }
};


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        Comments ({comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)})
      </h2>
      
      <div className="mb-6">
        <textarea
          className="textarea textarea-bordered w-full mb-2"
          rows="3"
          placeholder="Share your thoughts..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <button
          onClick={handleSubmitComment}
          disabled={!commentContent.trim() || loading}
          className="btn btn-primary"
        >
          <FaPaperPlane className="mr-2" />
          Post Comment
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onDelete = {handleCommentDelete}
              currentUser={currentUser}
              commentId={commentId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentsSection;

