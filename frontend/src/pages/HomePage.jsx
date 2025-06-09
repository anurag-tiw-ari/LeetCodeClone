import { Link } from "react-router"

function HomePage()
{
     return(
        <>
          <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h1 className="lg:text-5xl sm:text-4xl text-3xl font-bold uppercase text-center">
            Master <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Data Structures And Algorithms</span>
            </h1>
            <p className="text-center text-2xl my-6">One click away</p>
             <svg
               className="size-6 animate-bounce text-indigo-500 motion-reduce:animate-none text-center"
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
               <button className="btn btn-primary my-3"><Link to="/problems">Practice Problem</Link></button>
            </div>
           
          </div>
        </>
     )
}

export default HomePage