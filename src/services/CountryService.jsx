// src/services/api.js
const BASE_URL = 'https://restcountries.com/v3.1';

export const fetchAllCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

export const searchCountryByName = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/name/${name}`);
    return await response.json();
  } catch (error) {
    console.error(`Error searching country ${name}:`, error);
    throw error;
  }
};

export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${BASE_URL}/region/${region}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching countries in ${region}:`, error);
    throw error;
  }
};

export const getCountryByCode = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/alpha/${code}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching country with code ${code}:`, error);
    throw error;
  }
};