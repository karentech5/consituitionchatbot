// Header.jsx
// Redesigned header with:
// - A full-width hero banner using the constitution image
// - Overlay gradient for text readability
// - Nepal flag SVG + chatbot title + description

const Header = () => {
  return (
    <header className="relative w-full overflow-hidden" style={{ minHeight: '220px' }}>

      {/* ── Background: Nepal ceremony photo blurred ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/nepal-ceremony.jpg')",
          filter: 'blur(3px) brightness(0.45)',
          transform: 'scale(1.05)', // prevent blur edges showing
        }}
        aria-hidden="true"
      />

      {/* ── Dark gradient overlay for clean bottom fade ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,56,147,0.55) 0%, rgba(0,20,60,0.85) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content on top of the overlay ── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 gap-4">

        {/* Constitution illustration image */}
        <div className="flex items-center gap-5">
          <img
            src="/constitution.webp"
            alt="Nepal Constitution"
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-xl border-2 border-white/30"
            style={{ boxShadow: '0 4px 32px rgba(220,20,60,0.35)' }}
          />

          <div className="flex flex-col">
            {/* Nepal Flag SVG — compact beside the title */}
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 75"
                width="22"
                height="28"
                aria-label="Flag of Nepal"
              >
                <polygon points="4,70 4,4 46,37 4,37 40,70" fill="#003893" />
                <polygon points="8,64 8,10 40,37 8,37 36,64" fill="#DC143C" />
                <circle cx="20" cy="28" r="3.5" fill="white" />
                <circle cx="23" cy="28" r="3.5" fill="#DC143C" />
                <circle cx="20" cy="46" r="5" fill="white" />
                <circle cx="24" cy="46" r="5" fill="#DC143C" />
                <circle cx="20" cy="46" r="2" fill="white" />
              </svg>
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
                Nepal
              </span>
            </div>

            {/* Main title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Nepal Constitution
              <span className="text-[#FF6B6B]"> Chatbot</span>
            </h1>

            {/* Description */}
            <p className="text-blue-200 text-sm mt-1 max-w-xs">
              Ask questions about the Constitution of Nepal — Constitution of 2015.
            </p>
          </div>
        </div>

        {/* Info badges row */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {['272 Articles', '35 Parts', '9 Schedules', 'Promulgated 2015'].map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs font-medium"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
