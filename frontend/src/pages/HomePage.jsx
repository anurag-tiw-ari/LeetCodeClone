import { Link } from "react-router";
import DataStructureCards from "../Components/DataStructureCards";
import { motion } from "framer-motion";
import HomePageMarquee from "../Components/HomePageMarquee";
import Footer from "../Components/Footer.jsx";

function HomePage() {
  return (
    <div className="min-h-screen bg-base-300">
      {/* Hero Section */}
      <section className="h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight sm:leading-tight lg:leading-tight"
          >
            Master <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Data Structures And Algorithms</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl sm:text-2xl my-6 text-gray-300"
          >
            Your Journey To Coding Mastery Starts Here
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <svg
              className="size-6 animate-bounce text-indigo-500 motion-reduce:animate-none mb-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
            
            <Link 
              to="/problems" 
              className="btn btn-primary px-8 py-3 text-lg font-medium rounded-lg bg-indigo-600 border-none hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/20"
            >
              Start Practicing Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Data Structures Section */}
      <DataStructureCards />
      <HomePageMarquee />
      <Footer />
    </div>
  );
}

export default HomePage;