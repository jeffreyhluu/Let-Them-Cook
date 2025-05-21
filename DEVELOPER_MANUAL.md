# Let Them Cook — Developer Manual

## How to Obtain the Source Code

1. Clone the repository: git clone https://github.com/jeffreyhluu/Let-Them-Cook.git
2. npm install
3. Put API Keys in the outer .env file for REACT_APP_OPENAI_API_KEY, REACT_APP_GOOGLE_MAPS_API_KEY, and REACT_APP_SPOONACULAR_API_KEY.
4. Put API Keys in the server .env file for GOOGLE_MAPS_API_KEY=AIzaSyDIg3mfp4XtPxlFXvocQLF9nQHGxLx-5cs.

---

## Layout of Directory Structure

Let-Them-Cook/
├── public/                   # Static files 
│
├── src/                      # Main source code
│   ├── assets/               # Images, fonts, etc.
│   ├── __tests__             # Unit tests and UI tests
│   ├── Components/           # Reusable UI components, Chatbot Logic and Interface
│   ├── pages/                # Page-level components (e.g. Home, Explore, Recipe)
│   └── App.jsx               # Main app 
│
├── server/                   # Temporary for Nearest Grocery Store
│   ├── node_modules          # Necessary modules
│
├── .gitignore                
├── .env                      # Secure storage of API Keys  
├── README.md
├── package.json
├── package-lock.json
└── LICENSE

## How to Build the Software

1. **How to Build the **



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
