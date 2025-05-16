import React from 'react';

interface BackgroundTextProps {
  className?: string;
}

const BackgroundText: React.FC<BackgroundTextProps> = ({ className }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute bottom-[10vh] -right-[2vw] text-[18vw] font-extrabold text-black/[0.05] tracking-tighter leading-none animate-float">
        WORKOUT
      </div>
      <div className="absolute top-[10vh] left-[20vw] text-[10vw] font-extrabold text-black/[0.08] tracking-tighter leading-none animate-float-delayed">
        PERFORMANCE
      </div>
    </div>
  );
};

export default BackgroundText;