import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CountryCard({ country }) {
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [animationState, setAnimationState] = useState('');
  
  // Check if country is in favorites when component mounts
  useEffect(() => {
    const favorites = JSON.parse(sessionStorage.getItem('favoriteCountries')) || [];
    setIsFavorite(favorites.includes(country.cca3));
  }, [country.cca3]);
  
  // Toggle favorite status with animation
  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation();
    
    // Set animation state based on action
    setAnimationState(isFavorite ? 'removing' : 'adding');
    
    const favorites = JSON.parse(sessionStorage.getItem('favoriteCountries')) || [];
    
    let updatedFavorites;
    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = favorites.filter(id => id !== country.cca3);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, country.cca3];
    }
    
    // Update session storage
    sessionStorage.setItem('favoriteCountries', JSON.stringify(updatedFavorites));
    
    // Update state after animation delay
    setTimeout(() => {
      setIsFavorite(!isFavorite);
      setTimeout(() => setAnimationState(''), 600);
    }, 300);
  };

  // CSS classes for animation states
  const starClasses = `
    h-6 w-6 transition-all duration-500
    ${animationState === 'adding' ? 'text-yellow-500 animate-bounce' : ''} 
    ${animationState === 'removing' ? 'animate-spin text-gray-400' : ''}
    ${isFavorite && !animationState ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
  `;
  
  // Card animation classes
  const cardClasses = `
    bg-white dark:bg-gray-700 rounded-lg overflow-hidden 
    transition-all duration-500 ease-out
    ${animationState === 'adding' ? 'shadow-2xl shadow-yellow-200 dark:shadow-yellow-900' : 'shadow-md'}
    ${!animationState ? 'hover:shadow-xl hover:translate-y-[-4px] hover:translate-x-[-2px]' : ''}
    ${animationState === 'adding' ? 'scale-105' : ''}
    ${animationState === 'removing' ? 'scale-95 opacity-70' : 'opacity-100'}
  `;
  
  return (
    <div className="relative overflow-visible group">
      <Link
        to={`/country/${country.cca3}`}
        className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
        aria-label={`View details about ${country.name.common}`}
      >
        <div className={cardClasses}>
          {/* Background ripple effect when adding to favorites */}
          {animationState === 'adding' && (
            <div className="absolute z-0 inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
            </div>
          )}
          
          {/* Flag container with parallax effect */}
          <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-600 relative group-hover:brightness-110 transition-all duration-700">
            {/* Loading skeleton */}
            <div className={`absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-500 dark:to-gray-600 animate-pulse ${!imgError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}></div>
            
            {/* Flag image with parallax effect */}
            <img
              src={!imgError ? country.flags.svg : '/placeholder-flag.svg'}
              onError={() => setImgError(true)}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 transform origin-center"
              loading="lazy"
            />
            
            {/* Country code badge */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-mono tracking-wide">
              {country.cca3}
            </div>
           
          </div>
          
          <div className="p-5 relative z-10 transform transition-transform duration-500">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {country.name.common}
            </h2>
            
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-600 pb-2">
                <span className="font-medium">Population</span>
                <span className="tabular-nums">{country.population.toLocaleString()}</span>
              </li>
              <li className="flex items-center justify-between border-b border-gray-100 dark:border-gray-600 pb-2">
                <span className="font-medium">Capital</span>
                <span className="italic">{country.capital?.[0] || 'N/A'}</span>
              </li>
              <li className="flex items-center justify-between pt-1">
                <span className="font-medium">Currency</span>
                <span>{Object.values(country.currencies || {})[0]?.symbol || 'N/A'}</span>
              </li>
            </ul>
          </div>
        </div>
      </Link>
      
      {/* Floating favorite button */}
      <button
        onClick={toggleFavorite}
        className={`
          absolute top-2 right-2 p-3 z-20
          rounded-full shadow-lg backdrop-blur-sm
          transition-all duration-500
          ${isFavorite ? 'bg-yellow-50 dark:bg-yellow-900/70' : 'bg-white/80 dark:bg-gray-800/80'}
          ${animationState === 'adding' ? 'scale-150' : ''}
          ${animationState === 'removing' ? 'scale-75 rotate-180' : ''}
          hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400
        `}
        aria-label={isFavorite ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
      >
        {isFavorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" className={starClasses} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className={starClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
      </button>
      
      {/* Animated tooltip */}
      <div className={`
        absolute -top-12 right-0 
        transition-all duration-300 
        opacity-0 group-hover:opacity-100 
        transform translate-y-2 group-hover:translate-y-0
        pointer-events-none
      `}>
        <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-3 font-medium">
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      </div>
    </div>
  );
}

export default CountryCard;