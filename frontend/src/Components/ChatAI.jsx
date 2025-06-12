import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import ReactMarkdown from 'react-markdown'; // For better formatting of model responses
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown support

const ChatAI = ({ problem }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      parts: [{ text: "Hello! I'm here to help you with your coding problem. What would you like to know?" }] 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (data) => {
    const userMessage = { role: 'user', parts: [{ text: data.input }] };
    
    setMessages(prev => [...prev, userMessage]);
    reset({ input: '' });

    setLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: [...messages, userMessage],
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: response.data.message }] 
      }]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "Sorry, I encountered an error. Please try again later." }]
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Function to format code blocks in the model's response
  const renderMessagePart = (part) => {
    if (part.text) {
      return (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}) {
              return inline ? (
                <code className="bg-base-100 px-1 py-0.5 rounded">{children}</code>
              ) : (
                <pre className="bg-base-100 p-3 rounded-lg overflow-x-auto">
                  <code>{children}</code>
                </pre>
              );
            }
          }}
        >
          {part.text}
        </ReactMarkdown>
      );
    }
    return null;
  };

  return (
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl mt-3 h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)]" id="AiChat">
      <div className="card-body flex flex-col h-full">
        
        <div 
          className="bg-base-200 rounded-box p-4 overflow-y-auto hide-scrollbar flex-grow" 
          ref={messageRef}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
            >
              <div 
                className={`chat-bubble ${
                  msg.role === "user" 
                    ? "chat-bubble-primary" 
                    : "bg-base-300 text-base-content"
                }`}
              >
                {msg.parts.map((part, partIdx) => (
                  <div key={partIdx} className="whitespace-pre-wrap">
                    {renderMessagePart(part)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Type your question..."
              {...register("input", { required: "Message cannot be empty" })}
              disabled={loading}
            />
            {errors.input && (
              <p className="text-error text-sm mt-1">{errors.input.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAI;