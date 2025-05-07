# 🌍 Country Explorer App

This is a React-based Country Explorer app that uses the [REST Countries API](https://restcountries.com) to provide information about countries worldwide. Users can browse all countries, search by name, filter by region, view detailed country information, and mark favorite countries. The app also supports light/dark themes and maintains user preferences across sessions.

🔗 **Live Demo:** [https://restcountriies.netlify.app/](https://restcountriies.netlify.app/)

---

## ✨ Features

- 🌐 Browse all countries
- 🔍 Search countries by name
- 🌍 Filter countries by region
- 📄 View detailed information for each country
- ⭐ Mark/unmark countries as favorites (stored in `localStorage`)
- 👤 Show logged-in username (retrieved from `sessionStorage`)
- 🌙 Light/Dark theme toggle
- ✅ Responsive and user-friendly UI

---

## 🚀 Tech Stack

- **Frontend:** React, React Router, Tailwind CSS
- **API:** [REST Countries API](https://restcountries.com)
- **State Management:** useState, useEffect, localStorage, sessionStorage

---

## 🚀 Usage

- **1** Open the app.
- **2** Use the search bar or region dropdown to find countries.
- **3** Click on a country card to view more details.
- **4** Click the ⭐ icon to mark as favorite.
- **5** Favorites are stored per user using the username from sessionStorage.

---

## 📘 API Used

- **REST Countries API v3.1 Endpoint:** [Open the app](https://restcountries.com/v3.1/all).

---

# ❗ Challenges Faced

- CORS issues with API on localhost.
- Handling inconsistent data (e.g., some countries missing fields like capital or flags).
- Used conditional rendering to display "Not Available" for missing fields.
- Implemented user-specific keys in localStorage using sessionStorage
- Responsive design and theme toggling.
- Tailwind CSS and React state were used for responsive layout and dark/light mode handling.


## Author
- A.G.B. Vilochana
