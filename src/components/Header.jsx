import React, { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Update time every second for the tech display
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  // Format time in 24-hour format
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#080A0F]/90 backdrop-blur-md py-3 tech-border"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between max-w-[1920px]">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-black border border-red-500/30 rounded-sm flex items-center justify-center mr-3 relative tech-corner">
            <span className="text-red-500 font-bold text-xl tech-text">F1</span>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 tech-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none">
              <span className="text-white">HUB</span>
            </h1>
            <div className="tech-text text-red-500 text-[10px] leading-none">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-4">
          {[
            { name: "STANDINGS", id: "standings" },
            { name: "SCHEDULE", id: "schedule" },
            { name: "RESULTS", id: "results" },
          ].map((item, index) => (
            <a
              key={index}
              href={`#${item.id}`}
              className="px-4 py-2 tech-text text-sm tracking-wider text-gray-300 hover:text-red-500 transition-all duration-200 relative group"
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              <span className="absolute top-0 right-0 w-0 h-px bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="https://www.formula1.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2 border border-red-500/50 bg-red-500/10 text-red-500 tech-text text-sm tracking-wider hover:bg-red-500/20 transition-all duration-200 tech-corner"
          >
            OFFICIAL F1
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-8 h-8 flex flex-col items-center justify-center">
            <span
              className={`block transition-all duration-300 ease-out h-0.5 w-6 bg-red-500 ${
                isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`block transition-all duration-300 ease-out h-0.5 w-6 bg-red-500 my-0.5 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block transition-all duration-300 ease-out h-0.5 w-6 bg-red-500 ${
                isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0A0D14] border-t border-red-500/20 px-4 py-2 mt-2">
          <div className="flex flex-col space-y-1">
            {[
              { name: "STANDINGS", id: "standings" },
              { name: "SCHEDULE", id: "schedule" },
              { name: "RESULTS", id: "results" },
            ].map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className="px-4 py-3 tech-text text-sm tracking-wider hover:text-red-500 transition-colors duration-200 data-line"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="https://www.formula1.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-3 border border-red-500/50 bg-red-500/10 text-red-500 tech-text text-sm tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              OFFICIAL F1
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
