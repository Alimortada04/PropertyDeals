import React from 'react';

interface BackgroundElementsProps {
  scrollY: number;
}

export default function BackgroundElements({ scrollY }: BackgroundElementsProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orb - Trust */}
      <div 
        className="absolute -right-[10%] -top-[5%] w-[70vw] h-[70vw] max-w-[1100px] max-h-[1100px] rounded-full bg-gradient-to-bl from-[#09261E]/20 to-[#135341]/30 blur-3xl will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * -0.05}px, 0)`,
        }}
      />
      
      {/* Secondary orb - Community */}
      <div 
        className="absolute -left-[10%] bottom-[5%] w-[55vw] h-[55vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-tr from-[#E59F9F]/15 to-[#803344]/15 blur-3xl will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * -0.03}px, 0)`,
        }}
      />
      
      {/* Professionalism orb */}
      <div 
        className="absolute left-[25%] top-[15%] w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-r from-[#135341]/10 to-[#298668]/10 blur-3xl will-change-transform animate-pulse-slow"
        style={{
          transform: `translate3d(0, ${scrollY * 0.02}px, 0)`,
        }}
      />
      
      {/* Innovation orb */}
      <div 
        className="absolute right-[20%] bottom-[20%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-b from-[#E5D89F]/10 to-[#F8F8F8]/5 blur-3xl will-change-transform animate-float-slow"
        style={{
          transform: `translate3d(0, ${scrollY * 0.04}px, 0)`,
        }}
      />
      
      {/* Abstract decorative elements */}
      <div className="absolute inset-0">
        {/* Dotted grid pattern for professionalism */}
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMiAwaDF2NGgtMXYtNHptLTcgM2g0djFoLTR2LTF6bTAtMmgxdjRoLTF2LTR6bTIgMGgxdjRoLTF2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"
          style={{
            opacity: 0.8 - scrollY * 0.001,
            transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
          }}
        />
        
        {/* Community - connected nodes */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-10"
          style={{
            transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
          }}
        >
          <g>
            <circle cx="20%" cy="20%" r="10" fill="#135341" />
            <circle cx="30%" cy="30%" r="8" fill="#135341" />
            <circle cx="40%" cy="15%" r="12" fill="#135341" />
            <circle cx="60%" cy="25%" r="6" fill="#135341" />
            <circle cx="70%" cy="10%" r="8" fill="#135341" />
            
            <line x1="20%" y1="20%" x2="30%" y2="30%" stroke="#135341" strokeWidth="1" />
            <line x1="30%" y1="30%" x2="40%" y2="15%" stroke="#135341" strokeWidth="1" />
            <line x1="40%" y1="15%" x2="60%" y2="25%" stroke="#135341" strokeWidth="1" />
            <line x1="60%" y1="25%" x2="70%" y2="10%" stroke="#135341" strokeWidth="1" />
          </g>
        </svg>
        
        {/* Innovation - geometric shapes */}
        <div className="absolute inset-0">
          {/* Triangles for innovation */}
          <div 
            className="absolute left-[5%] top-[40%] w-24 h-24 opacity-20 will-change-transform animate-spin-slow"
            style={{
              transform: `translate3d(0, ${scrollY * 0.03}px, 0)`,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="#135341" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Squares for stability/professionalism */}
          <div 
            className="absolute right-[15%] top-[65%] w-16 h-16 opacity-20 will-change-transform"
            style={{
              transform: `translate3d(0, ${scrollY * -0.05}px, 0) rotate(${scrollY * 0.02}deg)`,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#135341" strokeWidth="2" />
              <rect x="25" y="25" width="50" height="50" fill="none" stroke="#135341" strokeWidth="1" />
            </svg>
          </div>
          
          {/* Hexagon for community/connection */}
          <div 
            className="absolute left-[25%] bottom-[15%] w-20 h-20 opacity-20 will-change-transform"
            style={{
              transform: `translate3d(0, ${scrollY * -0.02}px, 0)`,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#803344" strokeWidth="2" />
            </svg>
          </div>
        </div>
        
        {/* Trust - connected line path */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-10" 
          viewBox="0 0 100 100"
          style={{
            transform: `translate3d(0, ${scrollY * 0.01}px, 0)`,
          }}
        >
          <path 
            d="M10,50 Q30,30 50,50 T90,50" 
            fill="none" 
            stroke="#09261E" 
            strokeWidth="1"
            strokeDasharray="4,4"
          >
            <animate 
              attributeName="stroke-dashoffset" 
              from="0" 
              to="8" 
              dur="4s" 
              repeatCount="indefinite" 
            />
          </path>
        </svg>
      </div>
    </div>
  );
}