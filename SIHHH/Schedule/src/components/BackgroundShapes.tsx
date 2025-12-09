import React from 'react';

export const BackgroundShapes: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Primary floating shape */}
      <div 
        className="floating-shape animate-float w-96 h-96 bg-primary/30"
        style={{ top: '10%', left: '5%' }}
      />
      
      {/* Secondary floating shape */}
      <div 
        className="floating-shape animate-float-delayed w-80 h-80 bg-secondary/25"
        style={{ top: '60%', right: '10%' }}
      />
      
      {/* Accent shape */}
      <div 
        className="floating-shape animate-pulse-slow w-64 h-64 bg-accent/20"
        style={{ bottom: '20%', left: '30%' }}
      />
      
      {/* Small accents */}
      <div 
        className="floating-shape animate-float w-32 h-32 bg-primary/20"
        style={{ top: '40%', right: '30%' }}
      />
      
      <div 
        className="floating-shape animate-float-delayed w-48 h-48 bg-secondary/15"
        style={{ top: '20%', right: '5%' }}
      />
    </div>
  );
};
