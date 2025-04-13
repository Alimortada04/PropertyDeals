import { useParallaxEffect } from '@/hooks/use-scroll-animation';

interface BackgroundElementsProps {
  scrollY: number;
}

export default function BackgroundElements({ scrollY }: BackgroundElementsProps) {
  const { relativePosition } = useParallaxEffect();
  
  return (
    <>
      {/* Cursor glow effect container */}
      <div className="absolute inset-0 cursor-glow transition-opacity duration-1000"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs - modern color palette */}
        <div 
          className="absolute -right-[10%] -top-[5%] w-[70vw] h-[70vw] max-w-[1100px] max-h-[1100px] rounded-full bg-gradient-to-bl from-[#09261E]/20 to-[#135341]/30 blur-3xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * 0.05 + relativePosition.x * 20}px, ${scrollY * -0.05 + relativePosition.y * 20}px, 0)`,
          }}
        />
        
        {/* Community-themed orb */}
        <div 
          className="absolute -left-[10%] bottom-[5%] w-[55vw] h-[55vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-tr from-[#E59F9F]/15 to-[#803344]/15 blur-3xl will-change-transform"
          style={{
            transform: `translate3d(${scrollY * -0.03 + relativePosition.x * -20}px, ${scrollY * -0.03 + relativePosition.y * -15}px, 0)`,
          }}
        />
        
        {/* Trust-themed orb */}
        <div 
          className="absolute left-[25%] top-[15%] w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-r from-[#135341]/10 to-[#298668]/10 blur-3xl will-change-transform animate-pulse-slow"
          style={{
            transform: `translate3d(${scrollY * 0.02 + relativePosition.x * 5}px, ${scrollY * 0.02 + relativePosition.y * 5}px, 0)`,
          }}
        />
        
        {/* Innovation-themed orb */}
        <div 
          className="absolute right-[20%] bottom-[20%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-b from-[#E5D89F]/10 to-[#F8F8F8]/5 blur-3xl will-change-transform animate-float-slow"
          style={{
            transform: `translate3d(${scrollY * -0.01 + relativePosition.x * -8}px, ${scrollY * 0.04 + relativePosition.y * -8}px, 0)`,
          }}
        />
        
        {/* Professional-themed shapes and abstract elements */}
        <div className="absolute inset-0">
          {/* Subtle grid pattern for structure/professionalism */}
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMiAwaDF2NGgtMXYtNHptLTcgM2g0djFoLTR2LTF6bTAtMmgxdjRoLTF2LTR6bTIgMGgxdjRoLTF2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"
            style={{
              opacity: 0.6 - scrollY * 0.001,
              transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
            }}
          />
          
          {/* Abstract shapes representing community/connections */}
          <svg className="absolute w-full h-full" style={{ opacity: 0.2 }}>
            <defs>
              <linearGradient id="connection-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#09261E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#135341" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Network connection lines */}
            <path 
              d="M100,200 Q400,50 700,300 T1200,200"
              stroke="url(#connection-line)"
              strokeWidth="1.5"
              fill="none"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            />
            
            <path 
              d="M300,600 Q500,400 900,500"
              stroke="url(#connection-line)"
              strokeWidth="1.5"
              fill="none"
              style={{
                transform: `translateY(${-scrollY * 0.05}px)`,
              }}
            />
            
            <path 
              d="M100,400 Q300,500 500,300 T900,400"
              stroke="url(#connection-line)"
              strokeWidth="1.5"
              fill="none"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
              }}
            />
          </svg>
          
          {/* Innovative floating elements - various shapes */}
          <div 
            className="absolute left-[10%] top-[20%] w-16 h-16 border-2 border-[#09261E]/10 rounded-md rotate-12 will-change-transform animate-float"
            style={{
              transform: `rotate(12deg) translate3d(${relativePosition.x * -15}px, ${relativePosition.y * -15 + scrollY * 0.03}px, 0)`,
            }}
          />
          
          <div 
            className="absolute right-[12%] top-[60%] w-24 h-24 rounded-full border-2 border-[#09261E]/5 will-change-transform animate-pulse-slow"
            style={{
              transform: `translate3d(${relativePosition.x * 25}px, ${relativePosition.y * 25 + scrollY * -0.05}px, 0)`,
            }}
          />
          
          <div 
            className="absolute left-[15%] bottom-[30%] w-32 h-4 bg-[#135341]/10 rounded-full will-change-transform animate-breathe"
            style={{
              transform: `translate3d(${relativePosition.x * -20}px, ${relativePosition.y * -10 + scrollY * 0.02}px, 0) rotate(-5deg)`,
            }}
          />
          
          {/* Professionalism squares */}
          <div 
            className="absolute right-[15%] top-[30%] w-10 h-10 border border-[#E59F9F]/20 will-change-transform animate-spin-slow"
            style={{
              transform: `translate3d(${relativePosition.x * 10}px, ${relativePosition.y * 10 + scrollY * -0.01}px, 0) rotate(${scrollY * 0.05}deg)`,
            }}
          />
          
          <div 
            className="absolute left-[25%] top-[50%] w-20 h-1 bg-[#09261E]/5 rounded-full will-change-transform"
            style={{
              transform: `translate3d(${relativePosition.x * -5}px, ${relativePosition.y * -5 + scrollY * 0.03}px, 0) rotate(30deg)`,
            }}
          />
          
          <div 
            className="absolute right-[35%] bottom-[35%] w-16 h-16 rounded-lg border border-[#E5D89F]/20 rotate-45 will-change-transform animate-float-slow"
            style={{
              transform: `rotate(45deg) translate3d(${relativePosition.x * 15}px, ${relativePosition.y * 15 + scrollY * -0.02}px, 0)`,
            }}
          />
        </div>
      </div>
    </>
  );
}