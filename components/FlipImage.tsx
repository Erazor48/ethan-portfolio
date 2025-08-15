import React from 'react';

const FlipImage = ({
  frontImage = '/Profile_Pickture_Men_blue.png',
  backImage = '/Profile_Pickture_Robot.png',
  size = 144,
}) => {
  const containerSize = `${size}px`;

  return (
    <div
      className="relative group"
      style={{
        width: containerSize,
        height: containerSize,
        perspective: '1000px',
      }}
    >
      {/* Glow layer */}
      <span className="absolute inset-0 rounded-full animate-pulse-glow bg-blur blur-2xl" />

      {/* Flip container */}
      <div
        className="w-full h-full transition-transform duration-700 relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face */}
        <div
          className="absolute w-full h-full rounded-full border-4 border-border-pickture shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          <img
            src={frontImage}
            alt="Front"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Back face */}
        <div
          className="absolute w-full h-full rounded-full border-4 border-border-pickture shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) rotateX(10deg)',
          }}
        >
          <img
            src={backImage}
            alt="Back"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Flip effect on hover */}
      <style jsx>{`
        .group:hover > div {
          transform: rotateY(180deg) rotateX(10deg);
        }
      `}</style>
    </div>
  );
};

export default FlipImage;
