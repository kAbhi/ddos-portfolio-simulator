"use client";

import React from "react";

export function HappyMartStoreIllustration() {
  return (
    <svg
      viewBox="0 0 420 200"
      className="w-full max-w-md mx-auto h-auto drop-shadow-lg"
      role="img"
      aria-label="Customer bringing a shopping cart to HappyMart online clothing store"
    >
      {/* Background Glow */}
      <defs>
        <linearGradient id="storeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="awningGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {/* Ground */}
      <rect x="20" y="172" width="380" height="6" rx="3" fill="#1e293b" />

      {/* Storefront Building */}
      <rect
        x="190"
        y="46"
        width="185"
        height="126"
        rx="12"
        fill="url(#storeGrad)"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Store Awning */}
      <path
        d="M182 52 Q282 28 383 52 L375 72 Q282 56 190 72 Z"
        fill="url(#awningGrad)"
      />

      {/* Store Sign */}
      <rect x="228" y="24" width="110" height="24" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <text
        x="283"
        y="40"
        textAnchor="middle"
        fill="#34d399"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        HappyMart
      </text>

      {/* Store Display Window (Clothes Rack) */}
      <rect x="208" y="86" width="84" height="58" rx="6" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Clothing Hanger Bar */}
      <line x1="218" y1="100" x2="282" y2="100" stroke="#64748b" strokeWidth="2" />
      {/* T-Shirt 1 */}
      <path d="M226 104 L236 104 L240 112 L236 114 L236 130 L226 130 L226 114 L222 112 Z" fill="#34d399" />
      {/* T-Shirt 2 */}
      <path d="M246 104 L256 104 L260 112 L256 114 L256 130 L246 130 L246 114 L242 112 Z" fill="#38bdf8" />
      {/* Dress / Jacket 3 */}
      <path d="M266 104 L276 104 L280 112 L276 114 L278 132 L264 132 L266 114 L262 112 Z" fill="#a78bfa" />

      {/* Store Door */}
      <rect x="308" y="96" width="48" height="76" rx="4" fill="#020617" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="346" cy="134" r="3" fill="#34d399" />

      {/* Customer Walking with Shopping Cart */}
      {/* Head */}
      <circle cx="82" cy="100" r="11" fill="#34d399" />
      {/* Body */}
      <path d="M82 112 L82 144 M82 122 L104 128 M82 144 L72 168 M82 144 L94 168" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />

      {/* Shopping Cart */}
      <path
        d="M104 126 L112 126 L120 152 L156 152 L162 132 L114 132"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Clothes inside Cart */}
      <rect x="122" y="122" width="14" height="10" rx="2" fill="#a78bfa" />
      <rect x="139" y="120" width="14" height="12" rx="2" fill="#fbbf24" />
      {/* Cart Wheels */}
      <circle cx="124" cy="162" r="5" fill="#94a3b8" />
      <circle cx="152" cy="162" r="5" fill="#94a3b8" />

      {/* Motion lines */}
      <line x1="48" y1="124" x2="62" y2="124" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="42" y1="136" x2="58" y2="136" stroke="#34d399" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function AttackFlowIllustration() {
  return (
    <svg
      viewBox="0 0 440 160"
      className="w-full max-w-lg mx-auto h-auto"
      role="img"
      aria-label="Diagram showing genuine shoppers and thousands of fake bots overwhelming a store server"
    >
      {/* Legit Shoppers */}
      <rect x="14" y="18" width="110" height="46" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <text x="69" y="38" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="700">Genuine Shoppers</text>
      <text x="69" y="54" textAnchor="middle" fill="#94a3b8" fontSize="10">500 / sec</text>

      {/* Bot Army */}
      <rect x="14" y="96" width="110" height="46" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
      <text x="69" y="116" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="700">Fake Bot Army</text>
      <text x="69" y="132" textAnchor="middle" fill="#94a3b8" fontSize="10">15,000+ / sec</text>

      {/* Traffic Dots */}
      <circle cx="155" cy="44" r="4" fill="#34d399" />
      <circle cx="185" cy="52" r="4" fill="#34d399" />
      <circle cx="215" cy="60" r="4" fill="#34d399" />

      <circle cx="150" cy="112" r="3.5" fill="#fb7185" />
      <circle cx="164" cy="104" r="3.5" fill="#fb7185" />
      <circle cx="176" cy="118" r="3.5" fill="#fb7185" />
      <circle cx="192" cy="100" r="3.5" fill="#fb7185" />
      <circle cx="204" cy="112" r="3.5" fill="#fb7185" />
      <circle cx="218" cy="96" r="3.5" fill="#fb7185" />
      <circle cx="232" cy="106" r="3.5" fill="#fb7185" />
      <circle cx="246" cy="92" r="3.5" fill="#fb7185" />

      {/* Overwhelmed Server */}
      <rect x="285" y="34" width="138" height="92" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
      <text x="354" y="58" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">HappyMart Server</text>
      <text x="354" y="76" textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="600">OVERLOADED (99%)</text>
      <rect x="303" y="88" width="102" height="8" rx="4" fill="#1e293b" />
      <rect x="303" y="88" width="99" height="8" rx="4" fill="#f43f5e" />
      <text x="354" y="114" textAnchor="middle" fill="#94a3b8" fontSize="9.5">Real shoppers get timed out!</text>
    </svg>
  );
}
