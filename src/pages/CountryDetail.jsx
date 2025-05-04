import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/CountryService.jsx';

function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        if (data?.[0]) {
          setCountry(data[0]);
        } else {
          throw new Error('Country not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  const getLanguages = (langObj) =>
    langObj ? Object.values(langObj).join(', ') : 'N/A';

  const getNativeName = (nameObj) => {
    const nativeNames = nameObj?.nativeName
      ? Object.values(nameObj.nativeName)
      : [];
    return nativeNames.length > 0 ? nativeNames[0].common : nameObj.common;
  };

  const getCurrencies = (currObj) =>
    currObj ? Object.values(currObj).map(c => c.name).join(', ') : 'N/A';

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 w-full bg-gray-300 dark:bg-gray-600 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-red-100 dark:bg-red-200/10 text-red-700 dark:text-red-400 p-6 rounded-lg shadow">
          <p className="text-lg font-medium">⚠️ {error || 'Country not found'}</p>
          <Link
            to="/"
            className="inline-block mt-4 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <Link 
        to="/" 
        className="inline-flex items-center px-6 py-3 mb-10 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 dark:text-white text-gray-800 font-medium mt-12"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7m8 14V5" />
        </svg>
        Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <img
            src={!imgError ? country.flags.svg : '/placeholder-flag.svg'}
            onError={() => setImgError(true)}
            alt={`Flag of ${country.name.common}`}
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-6 dark:text-white">{country.name.common}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3 text-gray-800 dark:text-gray-300">
              <p><strong className="dark:text-white">Native Name:</strong> {getNativeName(country.name)}</p>
              <p><strong className="dark:text-white">Population:</strong> {country.population.toLocaleString()}</p>
              <p><strong className="dark:text-white">Region:</strong> {country.region}</p>
              <p><strong className="dark:text-white">Sub Region:</strong> {country.subregion || 'N/A'}</p>
              <p><strong className="dark:text-white">Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
            </div>
            <div className="space-y-3 text-gray-800 dark:text-gray-300">
              <p><strong className="dark:text-white">Top Level Domain:</strong> {country.tld?.[0] || 'N/A'}</p>
              <p><strong className="dark:text-white">Currencies:</strong> {getCurrencies(country.currencies)}</p>
              <p><strong className="dark:text-white">Languages:</strong> {getLanguages(country.languages)}</p>
            </div>
          </div>

          {country.borders?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Border Countries:</h2>
              <div className="flex flex-wrap gap-3">
                {country.borders.map((border) => (
                  <Link
                    key={border}
                    to={`/country/${border}`}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {border}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;