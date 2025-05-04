// src/context/CountryContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { fetchAllCountries } from '../services/CountryService';

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    getCountries();
  }, []);

  // Filter countries based on search term and region
  useEffect(() => {
    let result = countries;
    
    if (searchTerm) {
      result = result.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRegion) {
      result = result.filter(country => 
        country.region === selectedRegion
      );
    }
    
    setFilteredCountries(result);
  }, [searchTerm, selectedRegion, countries]);

  return (
    <CountryContext.Provider value={{
      countries,
      filteredCountries,
      loading,
      error,
      searchTerm,
      setSearchTerm,
      selectedRegion,
      setSelectedRegion
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountryContext = () => useContext(CountryContext);