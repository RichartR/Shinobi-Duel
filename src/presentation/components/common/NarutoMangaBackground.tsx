import React from 'react';

/**
 * Global Naruto Manga Background Component
 * 
 * Features:
 * 1. Unified seamless 15-column Masashi Kishimoto character panel grid (naruto_manga_composed_bg.png)
 * 2. Distinct characters: Left flank features Konoha heroes, Right flank features Akatsuki/rivals
 * 3. Vibrant Shonen Jump orange sunburst overlay on top (naruto-bg-sunburst with multiply blending)
 * 4. Subtle screentone halftone dot texture
 * 5. Positioned as fixed -z-10 layer behind all application views (Menu, Guide, Codex, Arena)
 */
export const NarutoMangaBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10 bg-[#FA9427]" 
      aria-hidden="true"
    >
      {/* Layer 1: Unified Composed Manga Grid Background */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: 'url(/assets/naruto_manga_composed_bg.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          filter: 'contrast(120%)',
        }}
      />

      {/* Layer 2: Vibrant Orange Sunburst Tone Overlay ON TOP of the Manga */}
      <div 
        className="absolute inset-0 naruto-bg-sunburst opacity-80 mix-blend-multiply" 
      />

      {/* Layer 3: Subtle Halftone Screentone Texture */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
