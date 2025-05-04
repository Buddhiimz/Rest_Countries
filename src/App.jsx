// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CountryProvider } from './context/CountryContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CountryDetail from './pages/CountryDetail';
import FavoritesPage from './components/FavoritesPage';

function App() {
  return (
    <CountryProvider>
      <Router>
        <div className=" min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:code" element={<CountryDetail />} />
              <Route path="favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CountryProvider>
  );
}

export default App;