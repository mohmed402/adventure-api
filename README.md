# 🌍 City Explorer

City Explorer is a full-stack web application that allows users to search for any city and view rich information such as:

- Real-time weather data ☁️
- Places to visit 🗺️
- Country details like population, capital, and currency 🌐
- Dynamic images and flags 📷
- A responsive and accessible user experience across all devices ✅

Built using modern web technologies with a strong focus on usability, accessibility, and efficient API integration.

---

## 🚀 Features

- 🔍 **City Search**: Enter any city name and fetch data instantly.
- 🖼️ **Dynamic City Images**: City backgrounds and "things to do" images using [SerpAPI].
- 🌤️ **Weather**: Current weather powered by [OpenWeatherMap], updated every 12 hours and cached.
- 🌍 **Country Info**: Currency, language, capital, continent, and population from [RapidAPI].
- 🧑‍💻 **Admin Panel**: Customer management dashboard with login and session support (via Supabase).
- ♿ **Accessibility**: Full keyboard support, semantic HTML, and contrast-aware styles.
- 📱 **Responsive Design**: Works across all major browsers and screen sizes.

---

## 🛠️ Technologies Used

- **Frontend**: React, CSS Modules, React Hooks
- **Backend**: Node.js, Express.js
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **APIs**:
  - [SerpAPI] – Google Image + Local Places
  - [OpenWeatherMap] – Live weather data
  - [REST Countries API] & [Country Info (RapidAPI)] – Country and flag info

---

## 📁 Project Structure
```

📦 city-explorer
├── frontend
│ ├── components
│ ├── pages
│ ├── hooks
│ ├── styles
│ └── App.js
├── backend
│ ├── routes
│ ├── supabaseClient.js
│ └── server.js

```
---

🧪 Testing
Accessibility: WAVE, axe DevTools, Lighthouse

Manual device testing across Chrome, Safari, and Firefox

Semantic markup and alt text reviewed for screen reader compatibility
