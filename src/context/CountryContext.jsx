// src/context/CountryContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { fetchAllCountries } from '../services/CountryService';

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTermState, setSearchTermState] = useState('');
  const [selectedRegionState, setSelectedRegionState] = useState('');

  // Wrapper to persist selectedRegion to localStorage
  const setSelectedRegion = (region) => {
    setSelectedRegionState(region);
    localStorage.setItem('selectedRegion', region);
  };

  // Wrapper to persist searchTerm to localStorage
  const setSearchTerm = (term) => {
    setSearchTermState(term);
    localStorage.setItem('searchTerm', term);
  };

  // Load persisted values on mount
  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    const savedSearch = localStorage.getItem('searchTerm');

    if (savedRegion) {
      setSelectedRegionState(savedRegion);
    }

    if (savedSearch) {
      setSearchTermState(savedSearch);
    }
  }, []);

  // Fetch all countries
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

  // Filter countries based on search and region
  useEffect(() => {
    let result = countries;

    if (selectedRegionState) {
      result = result.filter(country => country.region === selectedRegionState);
    }

    if (searchTermState) {
      result = result.filter(country =>
        country.name.common.toLowerCase().includes(searchTermState.toLowerCase())
      );
    }

    setFilteredCountries(result);
  }, [searchTermState, selectedRegionState, countries]);

  return (
    <CountryContext.Provider value={{
      countries,
      filteredCountries,
      loading,
      error,
      searchTerm: searchTermState,
      setSearchTerm,
      selectedRegion: selectedRegionState,
      setSelectedRegion
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountryContext = () => useContext(CountryContext);
