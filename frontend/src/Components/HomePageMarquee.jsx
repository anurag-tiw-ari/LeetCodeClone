import React from "react";

function HomePageMarquee() {
  return (
    <div className="bg-base-300 text-base-content pb-20 overflow-x-hidden">
      <div className="overflow-hidden py-6">
        {/* First marquee line - left to right */}
        <div className="relative flex w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-5xl sm:text-9xl font-bold uppercase tracking-wider">
            <span className="mx-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VISUALISE DSA NEVER LIKE BEFORE
            </span>
             <span className="mx-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VISUALISE DSA NEVER LIKE BEFORE
            </span>
            <span className="mx-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VISUALISE DSA NEVER LIKE BEFORE
            </span>
          </div>
        </div>

        {/*Second marquee line - right to left */}
         <div className="relative mt-4 flex w-full overflow-hidden">
          <div className="animate-marquee-reverse whitespace-nowrap text-3xl sm:text-5xl font-bold uppercase tracking-wider">
            <span className="mx-8 font-bold tracking-tight text-transparent 
[-webkit-text-stroke:1px_rgba(229,231,235,0.6)] [text-stroke:1px_rgba(209,213,219,0.3)]
[text-shadow:_0_0_12px_rgba(229,231,235,0.3),_0_0_4px_rgba(209,213,219,0.4)]
bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text">
              ARRAY . LINKEDLIST . TREE . GRAPH . STACK . QUEUE
            </span>
             <span className="mx-8 font-bold tracking-tight text-transparent 
[-webkit-text-stroke:1px_rgba(229,231,235,0.6)] [text-stroke:1px_rgba(209,213,219,0.3)]
[text-shadow:_0_0_12px_rgba(229,231,235,0.3),_0_0_4px_rgba(209,213,219,0.4)]
bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text">
              ARRAY . LINKEDLIST . TREE . GRAPH . STACK . QUEUE
            </span>
           <span className="mx-8 font-bold tracking-tight text-transparent 
[-webkit-text-stroke:1px_rgba(229,231,235,0.6)] [text-stroke:1px_rgba(209,213,219,0.3)]
[text-shadow:_0_0_12px_rgba(229,231,235,0.3),_0_0_4px_rgba(209,213,219,0.4)]
bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text">
              ARRAY . LINKEDLIST . TREE . GRAPH . STACK . QUEUE
            </span>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePageMarquee;