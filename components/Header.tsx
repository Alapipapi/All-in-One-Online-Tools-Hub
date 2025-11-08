import React, { useState } from 'react';

interface HeaderProps {
  currentPage: 'home' | 'about';
  onNavigate: (page: 'home' | 'about') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ToolHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g transform="rotate(-15 16 16)">
            <path d="M19 5H13C11.3431 5 10 6.34315 10 8V10H22V8C22 6.34315 20.6569 5 19 5Z"/>
            <rect x="6" y="10" width="20" height="14" rx="3"/>
            <g fill="rgba(255,255,255,0.4)">
                <circle cx="12" cy="15" r="1.5" />
                <circle cx="17" cy="15" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
                <circle cx="17" cy="19" r="1.5" />
            </g>
        </g>
    </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isDarkMode, toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const linkClasses = "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition cursor-pointer";
  const activeLinkClasses = "text-blue-600 dark:text-blue-400 font-semibold";

  const handleMobileNav = (page: 'home' | 'about') => {
      onNavigate(page);
      setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/[.5] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
             <ToolHubIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-gray-100">Tools Hub</span>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-8">
            <nav className="hidden md:flex space-x-8">
              <a onClick={() => onNavigate('home')} className={`${linkClasses} ${currentPage === 'home' ? activeLinkClasses : ''}`}>Home</a>
              <a onClick={() => onNavigate('about')} className={`${linkClasses} ${currentPage === 'about' ? activeLinkClasses : ''}`}>About</a>
            </nav>
            <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition">
                {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition" aria-label="Toggle menu">
                  {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

       {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <a onClick={() => handleMobileNav('home')} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${currentPage === 'home' ? 'bg-blue-50 dark:bg-gray-900 text-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>Home</a>
                  <a onClick={() => handleMobileNav('about')} className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${currentPage === 'about' ? 'bg-blue-50 dark:bg-gray-900 text-blue-700 dark:text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}>About</a>
              </div>
          </div>
      )}
    </header>
  );
};

export default Header;