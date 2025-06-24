import React from "react";

function HomePageMarquee() {
  return (
    <div className="bg-base-300 py-16 overflow-hidden relative">
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
      </div>

      {/* First marquee - primary gradient */}
      <div className="relative mb-8">
        <div className="flex overflow-hidden">
          <div className="flex items-center animate-marquee whitespace-nowrap py-4">
            {[...Array(4)].map((_, i) => (
              <span 
                key={`line1-${i}`} 
                className="mx-8 text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                Learn DSA LIKE NEVER BEFORE
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Second marquee - subtle outline effect */}
      <div className="relative">
        <div className="flex overflow-hidden">
          <div className="flex items-center animate-marquee-reverse whitespace-nowrap py-2">
            {[...Array(4)].map((_, i) => (
              <span 
                key={`line2-${i}`}
                className="mx-8 text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-transparent [-webkit-text-stroke:1px] [-webkit-text-stroke-color:oklch(var(--bc)/0.2)]"
              >
                <span className="text-primary/70">ARRAY</span> • 
                <span className="text-secondary/70"> LINKEDLIST</span> • 
                <span className="text-accent/70"> TREE</span> • 
                <span className="text-primary/70"> GRAPH</span> • 
                <span className="text-secondary/70"> STACK</span> • 
                <span className="text-accent/70"> QUEUE</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default HomePageMarquee;