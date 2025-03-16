import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080A0F] text-gray-400 py-12 mt-auto border-t border-red-500/20">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 tech-corner flex items-center justify-center mr-3 shadow-lg shadow-red-600/10">
                <span className="text-white font-bold text-xl tech-text">
                  F1
                </span>
              </div>
              <h3 className="text-white text-xl font-bold tech-text tech-glow">
                HUB
              </h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed">
              Access real-time Formula 1 telemetry data, race analytics, and
              performance metrics. Our dashboard provides comprehensive insights
              into the high-tech world of F1 racing.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/f1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors tech-corner border border-red-500/20 p-2 hover:border-red-500/50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/f1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors tech-corner border border-red-500/20 p-2 hover:border-red-500/50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/F1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors tech-corner border border-red-500/20 p-2 hover:border-red-500/50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tech-text">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#standings"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  DRIVER STANDINGS
                </a>
              </li>
              <li>
                <a
                  href="#schedule"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  RACE SCHEDULE
                </a>
              </li>
              <li>
                <a
                  href="#results"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  LAST RACE RESULTS
                </a>
              </li>
              <li>
                <a
                  href="https://www.formula1.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  OFFICIAL F1 WEBSITE
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tech-text">
              RESOURCES
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.formula1.com/en/racing/2024.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  2024 SEASON
                </a>
              </li>
              <li>
                <a
                  href="https://www.formula1.com/en/drivers.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  F1 DRIVERS
                </a>
              </li>
              <li>
                <a
                  href="https://www.formula1.com/en/teams.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  F1 TEAMS
                </a>
              </li>
              <li>
                <a
                  href="https://www.formula1.com/en/racing/2024/circuits.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors tech-text flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 mr-2"></span>
                  F1 CIRCUITS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-red-500/20 text-sm text-center">
          <p className="tech-text text-xs">
            © {currentYear} FORMULA 1 HUB • THIS IS A FAN-MADE APPLICATION AND
            IS NOT AFFILIATED WITH FORMULA ONE GROUP
          </p>
          <p className="mt-2 text-xs text-gray-500">
            DATA PROVIDED BY OPENF1 API • ALL FORMULA 1 LOGOS AND TRADEMARKS ARE
            PROPERTY OF THEIR RESPECTIVE OWNERS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
