import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem('theme');
    if (storedPreference) return storedPreference === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const location = useLocation();

  // Handle theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for favorites count and set up event listeners
  useEffect(() => {
    const checkFavorites = () => {
      const favorites = JSON.parse(sessionStorage.getItem('favoriteCountries')) || [];
      setFavoriteCount(favorites.length);
    };
    
    // Initial check on mount
    checkFavorites();
    
    // Create custom event for real-time updates
    const handleFavoritesChange = () => {
      checkFavorites();
    };

    // Set up event listener for storage changes from other tabs
    window.addEventListener('storage', e => {
      if (e.key === 'favoriteCountries') {
        checkFavorites();
      }
    });
    
    // Set up mutation observer for real-time updates
    const targetNode = document.body;
    const config = { attributes: false, childList: true, subtree: true };
    
    // Create a MutationObserver to watch for DOM changes that might indicate favorite toggling
    const observer = new MutationObserver((mutationsList) => {
      // Check if any mutations might indicate a favorite toggle
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          checkFavorites();
          break;
        }
      }
    });
    
    // Start observing
    observer.observe(targetNode, config);
    
    // Set up interval as a backup method
    const intervalId = setInterval(checkFavorites, 2000);
    
    // Listen for our custom event
    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    
    // Set up session storage event listener override
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
      // Call the original function first
      originalSetItem.apply(this, arguments);
      
      // Create and dispatch the custom event
      if (key === 'favoriteCountries') {
        const event = new Event('favoritesUpdated');
        window.dispatchEvent(event);
      }
    };
    
    // Cleanup
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
      window.removeEventListener('storage', handleFavoritesChange);
      observer.disconnect();
      clearInterval(intervalId);
      
      // Restore original setItem
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  const toggleDarkMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDarkMode(prev => !prev);
  };
  
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className={`
      fixed w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg' 
        : 'py-4 bg-white dark:bg-gray-800'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="Go to home page"
          >
            <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Rest Countries
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-gray-700 dark:text-gray-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks favoriteCount={favoriteCount} />
            
            {/* Theme Toggle Button */}
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}
        `}>
          <div className="flex flex-col gap-4 py-4">
            <NavLinks favoriteCount={favoriteCount} mobile={true} />
            
            {/* Mobile Theme Toggle */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleDarkMode}
                className="flex w-full items-center justify-between px-4 py-2 rounded-lg text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
                <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                  Toggle
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Navigation Links Component
function NavLinks({ favoriteCount, mobile = false }) {
  const location = useLocation();
  
  const linkClass = mobile
    ? `flex justify-between items-center px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`
    : `relative px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`;
  
  const activeLinkClass = mobile
    ? `bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400`
    : `text-indigo-600 dark:text-indigo-400`;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/favorites', label: 'Favorites', count: favoriteCount }
  ];

  return (
    <>
      {links.map(link => (
        <Link 
          key={link.path}
          to={link.path}
          className={`${linkClass} ${isActive(link.path) ? activeLinkClass : ''}`}
        >
          <span className="flex items-center gap-2">
            {link.path === '/' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
            {link.path === '/favorites' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
            {link.label}
            
            {/* Favorites count badge - moved to be directly next to label */}
            {link.count > 0 && link.path === '/favorites' && (
              <span className="inline-flex items-center justify-center ml-1 px-2 py-0.5 text-xs font-bold leading-none text-indigo-100 bg-indigo-600 rounded-full">
                {link.count}
              </span>
            )}
          </span>
          
          {/* Active indicator for desktop */}
          {!mobile && isActive(link.path) && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform origin-left transition-transform duration-300"></span>
          )}
        </Link>
      ))}
    </>
  );
}

// Theme Toggle Component
function ThemeToggle({ darkMode, toggleDarkMode }) {
  return (
    <button
      onClick={toggleDarkMode}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      className="relative inline-flex w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
    >
      <span className="sr-only">{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
      
      {/* Sun icon */}
      <span 
        className={`
          absolute inset-0 flex items-center justify-center transition-opacity duration-300
          ${darkMode ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <span className="h-4 w-4 flex items-center justify-center absolute right-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </span>
      
      {/* Moon icon */}
      <span 
        className={`
          absolute inset-0 flex items-center justify-center transition-opacity duration-300
          ${darkMode ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <span className="h-4 w-4 flex items-center justify-center absolute left-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </span>
      </span>
      
      {/* Toggle knob */}
      <span 
        className={`
          absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
          ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
}

export default Header;