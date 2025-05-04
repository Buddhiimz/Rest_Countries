import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Load favorite country IDs from session storage
  useEffect(() => {
    const loadFavoriteIds = () => {
      try {
        const storedFavoriteIds = JSON.parse(sessionStorage.getItem('favoriteCountries')) || [];
        setFavoriteIds(storedFavoriteIds);
        
        // If we have favorite IDs, fetch the country data
        if (storedFavoriteIds.length > 0) {
          fetchCountryData(storedFavoriteIds);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setError('Failed to load your favorite countries');
        setFavoriteIds([]);
        setIsLoading(false);
      }
    };

    loadFavoriteIds();

    // Set up event listeners for real-time updates
    const handleFavoritesChange = () => {
      loadFavoriteIds();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'favoriteCountries') {
        handleFavoritesChange();
      }
    });

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
      window.removeEventListener('storage', handleFavoritesChange);
    };
  }, []);

  // Fetch country data from API based on favorite IDs
  const fetchCountryData = async (countryIds) => {
    if (!countryIds.length) {
      setFavoriteCountries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all countries and filter to just our favorites
      // Note: RestCountries API doesn't support fetching multiple specific countries by code
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region,subregion,cca3,currencies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch country data');
      }
      
      const allCountries = await response.json();
      
      // Filter to just our favorite countries
      const favoriteCountryData = allCountries.filter(country => 
        countryIds.includes(country.cca3)
      );
      
      setFavoriteCountries(favoriteCountryData);
    } catch (error) {
      console.error('Error fetching country data:', error);
      setError('Failed to load country details');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter favorites based on search query
  const filteredFavorites = favoriteCountries.filter(country => {
    if (!country || !country.name) return false;
    
    const countryName = country.name.common || country.name.official || '';
    const regionName = country.region || '';
    
    return countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      regionName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Remove a country from favorites
  const removeFavorite = (countryCode) => {
    const updatedFavoriteIds = favoriteIds.filter(id => id !== countryCode);
    sessionStorage.setItem('favoriteCountries', JSON.stringify(updatedFavoriteIds));
    setFavoriteIds(updatedFavoriteIds);
    setFavoriteCountries(prevCountries => 
      prevCountries.filter(country => country.cca3 !== countryCode)
    );
    
    // Dispatch custom event to notify other components
    const event = new Event('favoritesUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Favorite Countries
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          View and manage your collection of favorite countries from around the world.
        </p>

        {/* Search input */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mt-0.5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  Please try refreshing the page or check your internet connection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && favoriteIds.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Explore countries around the world and add them to your favorites to see them here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                />
              </svg>
              Explore Countries
            </Link>
          </div>
        )}

        {/* Search no results */}
        {!isLoading && !error && favoriteIds.length > 0 && filteredFavorites.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No results found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try a different search term or clear the search
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200 font-medium transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Favorites grid */}
        {!isLoading && !error && filteredFavorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((country) => {
              // Safe access to country properties with fallbacks
              const countryName = country.name?.common || country.name?.official || 'Unknown Country';
              const countryCode = country.cca3 || country.alpha3Code || country.id || '';
              const countryFlag = country.flags?.svg || country.flags?.png || null;
              const region = country.region || 'Unknown Region';
              const subregion = country.subregion || '';
              const capitals = Array.isArray(country.capital) ? country.capital : (country.capital ? [country.capital] : []);
              const population = country.population || 0;
              
              return (
                <div
                  key={countryCode || `country-${Math.random().toString(36).substr(2, 9)}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="relative h-40 overflow-hidden">
                    {/* Country flag */}
                    {countryFlag ? (
                      <img
                        src={countryFlag}
                        alt={`Flag of ${countryName}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No flag available</span>
                      </div>
                    )}
                    
                    {/* Remove from favorites button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavorite(countryCode);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-red-500 hover:text-white hover:bg-red-500 transition-colors shadow-sm"
                      aria-label={`Remove ${countryName} from favorites`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Country info */}
                  <Link
                    to={countryCode ? `/country/${countryCode}` : "#"}
                    className="block p-4"
                  >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {countryName}
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                      <p className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {region}{subregion ? `, ${subregion}` : ''}
                      </p>
                      {capitals.length > 0 && (
                        <p className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {capitals.join(', ')}
                        </p>
                      )}
                      <p className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {population.toLocaleString()} people
                      </p>
                    </div>
                    
                    {/* View details button */}
                    <div className="mt-4 flex justify-end">
                      <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 group-hover:dark:text-indigo-300">
                        View details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;