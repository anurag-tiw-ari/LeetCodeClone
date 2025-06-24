import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router";

function DataStructureCards() {
  const topics = [
    { name: "Array", color: "bg-emerald-500" },
    { name: "LinkedList", color: "bg-blue-500" },
    { name: "Recursion", color: "bg-purple-500" },
    { name: "Binary Tree", color: "bg-amber-500" },
    { name: "Binary Search Tree", color: "bg-rose-500" },
    { name: "Graph", color: "bg-indigo-500" },
    { name: "Stack", color: "bg-sky-500" },
    { name: "Queue", color: "bg-fuchsia-500" },
    { name: "Heap", color: "bg-teal-500" }
  ];

  const navigate = useNavigate();

  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.08,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hover: {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-300 py-24 px-4 sm:px-6 lg:px-8" id="learnDSA">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 mb-4">
            Learn And Visulaize
          </h1>
        </motion.div>
        
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative rounded-xl border border-neutral-800 overflow-hidden transition-all duration-300 group-hover:border-neutral-700 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <div className="p-6">
                  <div className="flex items-center mb-5">
                    <div className={`w-2 h-2 rounded-full ${topic.color} mr-3`}></div>
                    <h2 className="text-xl font-medium text-gray-100">{topic.name}</h2>
                  </div>
                  <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
                    Comprehensive {topic.name.toLowerCase()} implementation with real-world use cases and complexity analysis.
                  </p>
                  <div className="flex justify-between items-center">
                    <button onClick={()=>{navigate(`/content/${topic.name}`)}}
                    className="text-xs font-medium px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-200 transition-colors flex items-center">
                      View Details
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3.5 w-3.5 ml-2 transition-transform group-hover:translate-x-1" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={`absolute bottom-0 right-0 w-32 h-32 ${topic.color} rounded-full filter blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DataStructureCards;