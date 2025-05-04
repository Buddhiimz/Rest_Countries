import { useState, useEffect, useRef } from 'react';
import { useCountryContext } from '../context/CountryContext.jsx';
import { Search, ChevronDown, X } from 'lucide-react';

function SearchFilter() {
  const { searchTerm, setSearchTerm, selectedRegion, setSelectedRegion } = useCountryContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear search input handler
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 my-8 flex flex-col md:flex-row justify-between gap-6 mt-28">
      {/* Enhanced Search Input */}
      <div className="relative w-full md:w-2/5 group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 transition-all duration-200 group-focus-within:text-blue-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 pr-10 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
        />
        {searchTerm && (
          <button 
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-all duration-200"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Custom Dropdown for Region Filter */}
      <div className="relative w-full md:w-1/4" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-4 pl-6 pr-12 flex items-center justify-between border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
        >
          <span className="truncate">
            {selectedRegion || "Filter by Region"}
          </span>
          <ChevronDown 
            size={18} 
            className={`absolute right-4 text-gray-400 dark:text-gray-300 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
          />
        </button>
        
        {isDropdownOpen && (
          <ul className="absolute z-10 w-full mt-2 py-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-200 animate-fadeIn">
            <li>
              <button
                onClick={() => {
                  setSelectedRegion('');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${!selectedRegion ? 'text-blue-500 dark:text-blue-400 font-medium' : 'text-gray-800 dark:text-gray-200'}`}
              >
                All Regions
              </button>
            </li>
            {regions.map(region => (
              <li key={region}>
                <button
                  onClick={() => {
                    setSelectedRegion(region);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${selectedRegion === region ? 'text-blue-500 dark:text-blue-400 font-medium' : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {region}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;

// Add this to your global CSS or tailwind.config.js extend
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-8px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.2s ease-out forwards;
// }