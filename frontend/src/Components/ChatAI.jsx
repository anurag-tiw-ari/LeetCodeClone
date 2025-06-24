import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiCopy } from 'react-icons/fi';
import { toast } from "react-toastify";

const ChatAI = ({ problem }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      parts: [{ text: "Hello! I'm here to help you with your coding problem. What would you like to know?" }],
      id: Date.now().toString(),
      isStreaming: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messageRef = useRef(null);
  const streamingRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Clean up any ongoing streaming when component unmounts
    return () => {
      if (streamingRef.current) {
        clearInterval(streamingRef.current);
      }
    };
  }, []);

 const simulateStreaming = (messageId, fullText) => {
  let index = 0;

  // Set initial message state before starting the stream
  setMessages(prevMessages =>
    prevMessages.map(msg =>
      msg.id === messageId
        ? { ...msg, parts: [{ text: '' }], isStreaming: true }
        : msg
    )
  );

  const streamNextChar = () => {
    // Capture current character to add
    const char = fullText[index];

    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            parts: [{
              text: msg.parts[0].text + char
            }]
          };
        }
        return msg;
      })
    );

    index++;

    if (index < fullText.length) {
      setTimeout(streamNextChar, 20); // typing speed
    } else {
      // After full message is typed, mark isStreaming false
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    }
  };

  // Start the streaming
  streamNextChar();
};


  const onSubmit = async (data) => {
    const userMessage = { 
      role: 'user', 
      parts: [{ text: data.input }],
      id: Date.now().toString(),
      isStreaming: false
    };
    
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

      const aiMessageId = Date.now().toString();
      const aiMessage = { 
        role: 'model', 
        parts: [{ text: '' }],
        id: aiMessageId,
        isStreaming: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
      simulateStreaming(aiMessageId, response.data.message);
    } catch (error) {
      console.error("API Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "Sorry, I encountered an error. Please try again later." }],
        id: Date.now().toString(),
        isStreaming: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const renderMessagePart = (msg,part, messageId, isStreaming) => {
    if (part.text) {
      return (
        <div className="relative">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const codeText = String(children).replace(/\n$/, '');
                return inline ? (
                  <code className="bg-base-100 px-1 py-0.5 rounded">{children}</code>
                ) : (
                  <div className="relative">
                    <pre className="bg-base-100 p-3 rounded-lg overflow-x-auto">
                      <code>{children}</code>
                    </pre>
                    {!isStreaming && (
                      <button
                        onClick={() => copyToClipboard(codeText)}
                        className="absolute top-2 right-2 p-1 rounded bg-base-200 hover:bg-base-300 transition"
                        title="Copy code"
                      >
                        <FiCopy />
                      </button>
                    )}
                  </div>
                );
              }
            }}
          >
            {part.text}
          </ReactMarkdown>
          
          {!isStreaming && (
            <button
              onClick={() => copyToClipboard(part.text)}
              className={`absolute ${msg.role==='model' ? "-bottom-7 -left-3" : "-bottom-7 -right-7" } p-1 rounded opacity-0 group-hover:opacity-100 transition`}
              title="Copy entire message"
            >
              <FiCopy />
            </button>
          )}
        </div>
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"} group`}
            >
              <div 
                className={`chat-bubble ${
                  msg.role === "user" 
                    ? "chat-bubble-primary" 
                    : "bg-base-300 text-base-content"
                } ${msg.isStreaming ? 'streaming-message' : ''}`}
              >
                {msg.parts.map((part, partIdx) => (
                  <div key={partIdx} className="whitespace-pre-wrap relative">
                    {renderMessagePart(msg,part, msg.id, msg.isStreaming)}
                  </div>
                ))}
                {msg.isStreaming && (
                  <span className="streaming-cursor">|</span>
                )}
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