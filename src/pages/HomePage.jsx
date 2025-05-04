// src/pages/HomePage.js
import { useCountryContext } from '../context/CountryContext.jsx';
import CountryCard from '../components/CountryCard';
import SearchFilter from '../components/SearchFilter';

function HomePage() {
  const { filteredCountries, loading, error } = useCountryContext();

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading countries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md" role="alert">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium">Error: {error}</p>
          </div>
          <p className="mt-3 text-sm">Please try refreshing the page or check your internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-1 pb-1">

      </div>
      
      <SearchFilter />
      
      <div className="container mx-auto px-6 py-1">
        {filteredCountries.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md max-w-2xl mx-auto">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M12 14a3 3 0 100-6 3 3 0 000 6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No countries found matching your criteria.</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
              Found {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredCountries.map(country => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          </>
        )}
      </div>
      
      <footer className="py-8 mt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Countries Explorer | Data from REST Countries API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;