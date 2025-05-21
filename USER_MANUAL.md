# Let Them Cook — User Manual

**Let Them Cook** is a web application designed to help users find recipes based on ingredients they already have and discover nearby grocery stores to purchase missing ingredients. The app features a smart chatbot assistant, personalized profile pages, recipe browsing via an Explore page, and user-friendly UI for seamless meal planning.

This project aims to make cooking more accessible and efficient, especially for users who want to minimize food waste and save time searching for recipes or grocery locations.

---

## Installation Instructions

To run **Let Them Cook** locally, follow these steps:

### Prerequisites

* **Node.js** (v18 or later)
* **npm** (v9 or later)
* **Firebase CLI**
* **Git**
* **Google Maps API key** (for location features)
* **Spoonacular API key** (for recipes)
* **OPEN AI API key** (for chatbot)
* **.env** file with secured keys

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/jeffreyhluu/Let-Them-Cook.git
   cd Let-Them-Cook
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase Emulator (for local testing)**

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init emulators
   ```

4. **Configure `.env` file**
   Create a `.env` file in the root directory with the following keys:

   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_key
   REACT_APP_MAPS_API_KEY=your_google_maps_key
   REACT_APP_SPOONACULAR_API_KEY=your_spoonacular_key
   ```

---

## How to Run the App

1. **Start the Firebase emulator** (if using local authentication and DB testing)

   ```bash
   firebase emulators:start
   ```

2. **Run the React development server**

   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

---

## How to Use the App

### Features

* **Login Page:** Sign in using Firebase authentication.
* **Chatbot Page:** Ask the chatbot for recipe suggestions, missing ingredients, or nearby stores.
* **Nearest Grocery Store:** Find grocery stores near your current location or via a ZIP code.
* **Explore Page:** Browse recipes fetched using the Spoonacular API.
* **Profile Page:** Customize and view your saved preferences.

### Work in Progress

* Image display for each recipe on the Explore Page.
* Full review page functionality connected to the chatbot.
* Store suggestions based on missing ingredients (future feature).

---

## How to Report a Bug

Please report bugs through our GitHub issue tracker:
[GitHub Issues](https://github.com/jeffreyhluu/Let-Them-Cook/issues)

When reporting a bug, include the following:

* **Steps to reproduce**
* **Expected behavior**
* **Actual behavior**
* **Screenshots** (if applicable)
* **Environment** (e.g., browser, device, OS)

We also use a [bug report template](https://github.com/jeffreyhluu/Let-Them-Cook/issues/new?template=bug_report.md) to help guide your submission.

---

## Known Bugs / Limitations

Tracked bugs are listed in the [Issues](https://github.com/jeffreyhluu/Let-Them-Cook/issues) tab. Some current known limitations include:

* Incomplete recipe image integration.
* Review page UI may not display correctly on small screens.
* ZIP code fallback may fail if Google Maps location services are disabled.

We aim to resolve these bugs in our next development sprint.
