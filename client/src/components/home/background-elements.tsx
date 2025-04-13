// Removed unused parallax effect for performance

interface BackgroundElementsProps {
  scrollY: number;
}

export default function BackgroundElements({ scrollY }: BackgroundElementsProps) {
  // Simplified - removed relativePosition as it causes performance issues
  
  return (
    <>
      {/* Cursor glow effect container - removed for performance */}
      
      {/* Simplified background elements with minimal animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs - reduced number and simplified effects */}
        <div 
          className="absolute -right-[10%] -top-[5%] w-[70vw] h-[70vw] max-w-[1100px] max-h-[1100px] rounded-full bg-gradient-to-bl from-[#09261E]/20 to-[#135341]/30 blur-3xl"
          style={{
            transform: `translate3d(0, ${scrollY * -0.02}px, 0)`,
          }}
        />
        
        {/* Community-themed orb */}
        <div 
          className="absolute -left-[10%] bottom-[5%] w-[55vw] h-[55vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-tr from-[#E59F9F]/15 to-[#803344]/15 blur-3xl"
          style={{
            transform: `translate3d(0, ${scrollY * -0.01}px, 0)`,
          }}
        />
        
        {/* Subtle grid pattern for structure */}
        <div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMiAwaDF2NGgtMXYtNHptLTcgM2g0djFoLTR2LTF6bTAtMmgxdjRoLTF2LTR6bTIgMGgxdjRoLTF2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"
          style={{
            opacity: 0.4,
          }}
        />
      </div>
    </>
  );
}