type Props = { primaryHex: string; secondaryHex: string; threadHex: string; trimHex: string; ambientLightHex: string; hidden: boolean; compositionTier: string; cameraLabel: string };
export function StudioFallback({primaryHex,secondaryHex,threadHex,trimHex,ambientLightHex, hidden,compositionTier,cameraLabel}: Props) {
return <div hidden={hidden} data-testid="svg-fallback" aria-label="Illustrated interior preview" style={{width:"100%"}}>
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full drop-shadow-2xl transition-all duration-700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Dynamic Gradients */}
              <linearGradient id="leatherPrimaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={primaryHex} stopOpacity="0.95" />
                <stop offset="100%" stopColor={primaryHex} stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="leatherSecondaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={secondaryHex} stopOpacity="0.98" />
                <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="trimDeckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={trimHex} />
                <stop offset="50%" stopColor="#3C3D42" stopOpacity="0.5" />
                <stop offset="100%" stopColor={trimHex} />
              </linearGradient>

              <radialGradient id="oledGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0F1015" stopOpacity="0.9" />
              </radialGradient>

              {/* Diamond Quilting Pattern with Accent Thread */}
              <pattern
                id="quiltPattern"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <path
                  d="M 0 0 L 20 0 L 20 20 L 0 20 Z"
                  fill="none"
                  stroke={threadHex}
                  strokeWidth="0.8"
                  strokeOpacity="0.55"
                />
              </pattern>
            </defs>

            {/* Background Cabin Depth Architecture */}
            <rect x="40" y="30" width="720" height="440" rx="28" fill="#111216" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            
            {/* Rear Cabin Depth & Headlining */}
            <path d="M 120 70 L 680 70 L 630 180 L 170 180 Z" fill="#0C0D10" stroke="rgba(255,255,255,0.04)" />
            
            {/* 253-LED Ambient Fiber Sweep (Reacts to Ambient Lighting Hex) */}
            <path
              d="M 100 190 Q 400 160 700 190"
              stroke={ambientLightHex}
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px currentColor)"
              className="transition-colors duration-500"
            />
            <path
              d="M 140 230 Q 400 205 660 230"
              stroke={ambientLightHex}
              strokeWidth="2"
              strokeOpacity="0.6"
              strokeLinecap="round"
              className="transition-colors duration-500"
            />

            {/* Upper Dashboard Trim Deck (Open-pore Wood / Carbon) */}
            <path
              d="M 140 220 L 660 220 L 620 260 L 180 260 Z"
              fill="url(#trimDeckGrad)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            {/* Fine Horizontal Pinstripes for Veneer Texture */}
            <line x1="160" y1="230" x2="640" y2="230" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="6 3" />
            <line x1="170" y1="245" x2="630" y2="245" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="10 4" />

            {/* Front Left Seat (Driver) */}
            {/* Outer Bolsters (Secondary Leather) */}
            <path
              d="M 160 270 Q 140 330 150 430 L 260 430 Q 270 330 250 270 Z"
              fill="url(#leatherSecondaryGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.2"
            />
            {/* Center Flutes (Primary Leather with Quilting & Stitching) */}
            <path
              d="M 180 280 Q 170 340 180 430 L 230 430 Q 240 340 230 280 Z"
              fill="url(#leatherPrimaryGrad)"
              stroke={threadHex}
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            {/* Center Quilted Mesh Overlay */}
            <path
              d="M 182 285 Q 172 342 182 425 L 228 425 Q 238 342 228 285 Z"
              fill="url(#quiltPattern)"
              opacity="0.4"
            />

            {/* Front Right Seat (Passenger) */}
            {/* Outer Bolsters (Secondary Leather) */}
            <path
              d="M 540 270 Q 520 330 530 430 L 640 430 Q 650 330 630 270 Z"
              fill="url(#leatherSecondaryGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.2"
            />
            {/* Center Flutes (Primary Leather with Stitching) */}
            <path
              d="M 560 280 Q 550 340 560 430 L 610 430 Q 620 340 610 280 Z"
              fill="url(#leatherPrimaryGrad)"
              stroke={threadHex}
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <path
              d="M 562 285 Q 552 342 562 425 L 608 425 Q 618 342 608 285 Z"
              fill="url(#quiltPattern)"
              opacity="0.4"
            />

            {/* Center Console Waterfall Tunnel */}
            <path
              d="M 330 250 L 470 250 L 490 440 L 310 440 Z"
              fill="#16171B"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />
            {/* Center Armrest Split (Secondary or Primary depending on tier) */}
            <rect
              x="340"
              y="370"
              width="120"
              height="70"
              rx="12"
              fill={compositionTier === "executive_fluted" ? primaryHex : secondaryHex}
              stroke={threadHex}
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
            <line x1="400" y1="370" x2="400" y2="440" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* 12.3" Lexus Center Display */}
            <rect
              x="345"
              y="255"
              width="110"
              height="100"
              rx="10"
              fill="url(#oledGlow)"
              stroke="#38B6FF"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            <text x="400" y="295" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
              AUTOLAB INTERIOR STUDIO
            </text>
            <text x="400" y="315" textAnchor="middle" fill="#94A3B8" fontSize="7.5" fontFamily="sans-serif">
              {cameraLabel}
            </text>
            <circle cx="400" cy="335" r="3" fill="#38B6FF" />

            {/* Driver Steering Wheel Boss Silhouette (Left Cockpit) */}
            <circle cx="210" cy="240" r="46" fill="none" stroke="#23252C" strokeWidth="9" />
            <circle cx="210" cy="240" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="210" cy="240" r="16" fill="#17181D" stroke={threadHex} strokeWidth="1" />
            <line x1="165" y1="240" x2="255" y2="240" stroke="#2A2C34" strokeWidth="5" />

            {/* Burmester 4D Speaker Grille Silhouette (Left & Right) */}
            <circle cx="90" cy="310" r="18" fill="#1C1E23" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />
            <circle cx="710" cy="310" r="18" fill="#1C1E23" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />

            {/* View Annotation Pin */}
            <g transform="translate(400, 100)">
              <rect x="-100" y="-14" width="200" height="28" rx="14" fill="#141416" stroke="rgba(255,255,255,0.12)" />
              <circle cx="-80" cy="0" r="3.5" fill="#38B6FF" />
              <text x="-65" y="4" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                {cameraLabel} Focal View
              </text>
            </g>
          </svg>
</div>;
}
