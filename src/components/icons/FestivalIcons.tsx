import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * High-detail realistic SVG visual assets for the Ganesh Chaturthi festival.
 * Replaces all generic emoji placeholders with authentic, dignified sacred art.
 */

// 1. Sacred Golden Ukadiche Modak
export const ModakIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="modakGrad" cx="50%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="40%" stopColor="#fef08a" />
        <stop offset="75%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </radialGradient>
      <linearGradient id="saffronStrand" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Base Shadow */}
    <ellipse cx="24" cy="43" rx="15" ry="3.5" fill="rgba(0,0,0,0.3)" />
    {/* Main Modak Body */}
    <path
      d="M24 6 C28 14 39 25 38 36 C37 42 32 44 24 44 C16 44 11 42 10 36 C9 25 20 14 24 6 Z"
      fill="url(#modakGrad)"
      stroke="#d97706"
      strokeWidth="1.2"
    />
    {/* Authentic Sacred Pleats (Kadiyan) */}
    <path d="M24 8 C23 20 20 34 18 43" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
    <path d="M24 8 C25 20 28 34 30 43" stroke="#d97706" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
    <path d="M24 9 C20 22 14 32 12 39" stroke="#b45309" strokeWidth="0.8" opacity="0.65" />
    <path d="M24 9 C28 22 34 32 36 39" stroke="#b45309" strokeWidth="0.8" opacity="0.65" />
    {/* Pointed Tip (Tup) */}
    <path d="M24 5 C25 7 24.5 9 24 9.5 C23.5 9 23 7 24 5 Z" fill="#fbbf24" />
    {/* Saffron Strands */}
    <path d="M23 16 Q24 20 22 24" stroke="url(#saffronStrand)" strokeWidth="1" strokeLinecap="round" />
    <path d="M26 19 Q25 23 27 27" stroke="url(#saffronStrand)" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

// 2. Glowing Brass Diya Oil Lamp
export const DiyaIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="brassDiyaGrad" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#eab308" />
        <stop offset="85%" stopColor="#a16207" />
        <stop offset="100%" stopColor="#713f12" />
      </radialGradient>
      <radialGradient id="diyaFlameGrad" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#dc2626" />
      </radialGradient>
      <filter id="diyaHalo" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Base Shadow */}
    <ellipse cx="24" cy="43" rx="14" ry="3" fill="rgba(0,0,0,0.35)" />
    {/* Pedestal Stand */}
    <path d="M19 41 L29 41 L26 36 L22 36 Z" fill="#854d0e" stroke="#ca8a04" strokeWidth="0.8" />
    {/* Brass Lamp Bowl */}
    <path
      d="M8 29 C8 38 15 41 24 41 C33 41 40 38 40 29 C40 25 35 24 24 24 C13 24 8 25 8 29 Z"
      fill="url(#brassDiyaGrad)"
      stroke="#facc15"
      strokeWidth="1"
    />
    {/* Spout Nose for Wick */}
    <path d="M34 25 C39 24 42 22 43 19 C38 21 34 24 34 25 Z" fill="#ca8a04" />
    {/* Sacred Ghee Surface */}
    <ellipse cx="24" cy="27" rx="13" ry="3.5" fill="#ca8a04" opacity="0.8" />
    {/* Cotton Wick (Baati) */}
    <path d="M34 26 C36 24 38 21 39 18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    {/* Radiant Flame with Halo */}
    <g filter="url(#diyaHalo)">
      <path
        d="M39 18 C42 15 42 10 39 5 C36 10 36 15 39 18 Z"
        fill="url(#diyaFlameGrad)"
      />
      <circle cx="39" cy="13" r="2.5" fill="#ffffff" opacity="0.8" />
    </g>
  </svg>
);

// 3. Sacred Red Hibiscus (Jaswand)
export const HibiscusIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="redPetalGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fee2e2" />
        <stop offset="25%" stopColor="#f87171" />
        <stop offset="70%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
    </defs>
    {/* 5 Wavy Overlapping Petals */}
    <path d="M24 24 C18 10 30 10 24 24" fill="url(#redPetalGrad)" stroke="#7f1d1d" strokeWidth="0.7" />
    <path d="M24 24 C38 18 38 30 24 24" fill="url(#redPetalGrad)" stroke="#7f1d1d" strokeWidth="0.7" />
    <path d="M24 24 C30 38 18 38 24 24" fill="url(#redPetalGrad)" stroke="#7f1d1d" strokeWidth="0.7" />
    <path d="M24 24 C10 30 10 18 24 24" fill="url(#redPetalGrad)" stroke="#7f1d1d" strokeWidth="0.7" />
    <path d="M24 24 C12 12 20 8 24 24" fill="url(#redPetalGrad)" stroke="#7f1d1d" strokeWidth="0.7" />
    {/* Delicate Petal Highlights */}
    <circle cx="24" cy="24" r="5" fill="#b91c1c" />
    {/* Central Stamen Column */}
    <path d="M24 24 Q29 17 33 11" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />
    {/* Golden Anthers */}
    <circle cx="33" cy="11" r="1.5" fill="#facc15" />
    <circle cx="31" cy="13" r="1.2" fill="#facc15" />
    <circle cx="34" cy="14" r="1.2" fill="#facc15" />
    <circle cx="29" cy="15" r="1.2" fill="#facc15" />
  </svg>
);

// 4. Sacred Durva Grass Bundle (21 Blades)
export const DurvaIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="grassGrad1" x1="0%" y1="100%" x2="50%" y2="0%">
        <stop offset="0%" stopColor="#14532d" />
        <stop offset="60%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#86efac" />
      </linearGradient>
    </defs>
    {/* Radiating blades */}
    <path d="M24 40 C20 30 14 18 10 10" stroke="url(#grassGrad1)" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M24 40 C22 28 18 16 16 8" stroke="url(#grassGrad1)" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 40 C24 26 23 14 24 6" stroke="url(#grassGrad1)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 40 C26 28 30 16 32 8" stroke="url(#grassGrad1)" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 40 C28 30 34 18 38 10" stroke="url(#grassGrad1)" strokeWidth="2.2" strokeLinecap="round" />
    {/* Secondary outer blades */}
    <path d="M24 40 C18 34 10 26 7 18" stroke="url(#grassGrad1)" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    <path d="M24 40 C30 34 38 26 41 18" stroke="url(#grassGrad1)" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
    {/* Sacred Red Mauli Binding Thread */}
    <rect x="20" y="34" width="8" height="5" rx="1.5" fill="#dc2626" stroke="#fef08a" strokeWidth="0.8" />
  </svg>
);

// 5. Authentic Festival Dhol & Tasha
export const DholIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="drumWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="40%" stopColor="#b45309" />
        <stop offset="80%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="drumLeather" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Drum Barrel Body */}
    <rect x="12" y="14" width="24" height="20" rx="3" fill="url(#drumWood)" stroke="#ca8a04" strokeWidth="1" />
    {/* Left & Right Drum Heads */}
    <ellipse cx="12" cy="24" rx="4" ry="10" fill="url(#drumLeather)" stroke="#a16207" strokeWidth="1" />
    <ellipse cx="36" cy="24" rx="4" ry="10" fill="url(#drumLeather)" stroke="#a16207" strokeWidth="1" />
    {/* Tightening Ropes (Zig-zag) */}
    <path d="M12 15 L24 33 L36 15 L24 33 Z" stroke="#ea580c" strokeWidth="1.2" opacity="0.9" />
    <path d="M12 33 L24 15 L36 33" stroke="#ea580c" strokeWidth="1.2" opacity="0.9" />
    {/* Brass Tuning Rings */}
    <circle cx="20" cy="24" r="2" fill="#facc15" stroke="#78350f" strokeWidth="0.5" />
    <circle cx="28" cy="24" r="2" fill="#facc15" stroke="#78350f" strokeWidth="0.5" />
    {/* Crossed Wooden Striker Sticks (Tipru) */}
    <path d="M8 8 L22 22" stroke="#fde68a" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M6 38 L22 22" stroke="#fde68a" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 6. Sacred Conch Shell (Shankh)
export const ShankhIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="shankhGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#fffbeb" />
        <stop offset="70%" stopColor="#fed7aa" />
        <stop offset="100%" stopColor="#fcd34d" />
      </linearGradient>
    </defs>
    {/* Base Shadow */}
    <ellipse cx="24" cy="42" rx="14" ry="3" fill="rgba(0,0,0,0.3)" />
    {/* Shankh Spiral Form */}
    <path
      d="M10 24 C10 14 18 8 28 8 C36 8 40 14 38 22 C36 29 28 36 22 38 C16 40 10 32 10 24 Z"
      fill="url(#shankhGrad)"
      stroke="#d97706"
      strokeWidth="1.2"
    />
    {/* Spiral Grooves */}
    <path d="M28 8 C22 14 20 24 22 38" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M33 12 C28 18 26 26 27 34" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" />
    <path d="M14 20 C18 20 22 24 22 30" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
    {/* Golden Inlay & Chimes */}
    <circle cx="36" cy="18" r="1.5" fill="#d97706" />
    <circle cx="32" cy="14" r="1.2" fill="#d97706" />
  </svg>
);

// 7. Grand Mandap / Pandal Gateway Arch
export const PandalIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pandalGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    {/* Columns */}
    <rect x="8" y="18" width="5" height="24" rx="1" fill="url(#pandalGold)" stroke="#854d0e" strokeWidth="0.8" />
    <rect x="35" y="18" width="5" height="24" rx="1" fill="url(#pandalGold)" stroke="#854d0e" strokeWidth="0.8" />
    {/* Ornate Arch Top */}
    <path
      d="M6 18 C6 18 16 8 24 8 C32 8 42 18 42 18 L38 22 C34 14 28 12 24 12 C20 12 14 14 10 22 Z"
      fill="url(#pandalGold)"
      stroke="#78350f"
      strokeWidth="1"
    />
    {/* Kalash on Peak */}
    <path d="M22 8 L24 4 L26 8 Z" fill="#facc15" stroke="#a16207" strokeWidth="0.8" />
    {/* Marigold Flower Festoons (Toran) */}
    <path d="M11 20 Q18 25 24 20 Q30 25 37 20" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="17" cy="23" r="1.5" fill="#facc15" />
    <circle cx="24" cy="20" r="1.5" fill="#facc15" />
    <circle cx="31" cy="23" r="1.5" fill="#facc15" />
  </svg>
);

// 8. Sacred Kalash Pot with Coconut & Mango Leaves
export const KalashIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="kalashBrass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="85%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#713f12" />
      </linearGradient>
    </defs>
    {/* Brass Pot */}
    <path
      d="M16 26 C12 30 13 40 24 40 C35 40 36 30 32 26 C31 23 29 22 24 22 C19 22 17 23 16 26 Z"
      fill="url(#kalashBrass)"
      stroke="#a16207"
      strokeWidth="1"
    />
    {/* Red Sacred Thread Band */}
    <path d="M15 31 Q24 34 33 31" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
    {/* Mango Leaves */}
    <path d="M24 22 L17 14 C19 13 22 16 24 22" fill="#15803d" />
    <path d="M24 22 L31 14 C29 13 26 16 24 22" fill="#15803d" />
    <path d="M24 22 L12 18 C14 17 19 18 24 22" fill="#16a34a" />
    <path d="M24 22 L36 18 C34 17 29 18 24 22" fill="#16a34a" />
    {/* Coconut (Nariyal) */}
    <ellipse cx="24" cy="15" rx="6" ry="8" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
    {/* Coconut Tuft */}
    <path d="M24 7 L23 10 L25 10 Z" fill="#92400e" />
  </svg>
);

// 9. Golden Laddoo
export const LaddooIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="laddooGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f59e0b" />
        <stop offset="75%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="17" fill="url(#laddooGrad)" stroke="#b45309" strokeWidth="1" />
    {/* Boondi Texture Dots */}
    <circle cx="18" cy="18" r="1.5" fill="#fef08a" opacity="0.8" />
    <circle cx="22" cy="15" r="1.8" fill="#fef08a" opacity="0.8" />
    <circle cx="28" cy="19" r="1.5" fill="#fef08a" opacity="0.8" />
    <circle cx="17" cy="25" r="1.6" fill="#fbbf24" />
    <circle cx="24" cy="26" r="2" fill="#fef08a" opacity="0.9" />
    <circle cx="30" cy="27" r="1.8" fill="#fbbf24" />
    {/* Pistachio / Cashew Sliver */}
    <path d="M21 21 Q25 18 25 23 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="0.5" />
    <path d="M27 23 Q29 25 26 27 Z" fill="#fef08a" />
  </svg>
);

// 10. Sacred Sanskrit Mantra Scroll
export const MantraScrollIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="scrollPaper" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="50%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fed7aa" />
      </linearGradient>
    </defs>
    {/* Main Scroll Sheet */}
    <rect x="10" y="10" width="28" height="28" rx="2" fill="url(#scrollPaper)" stroke="#b45309" strokeWidth="1" />
    {/* Rolls at top & bottom */}
    <ellipse cx="24" cy="9" rx="15" ry="3" fill="#ca8a04" stroke="#78350f" strokeWidth="0.8" />
    <ellipse cx="24" cy="39" rx="15" ry="3" fill="#ca8a04" stroke="#78350f" strokeWidth="0.8" />
    {/* Sacred Om Symbol inside Scroll */}
    <path
      d="M24 16 Q27 16 28 18 Q29 20 27 22 Q29 24 27 27 C24 30 19 28 20 24 M27 19 Q31 19 33 22 M30 15 Q32 15 32 13"
      stroke="#b91c1c"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
