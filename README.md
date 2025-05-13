# Let-Them-Cook

Link to Status Reports: https://docs.google.com/document/d/1eTC_VSmyYSDE3__Ye2_9YM9x5vDOsuFFiBD-rr5rpxo/edit?usp=sharing

## Idea

**Let-Them-Cook** is meant to be a revolutionary app to help users with the everyday struggle of cooking. Our goal is to be able to identify the best recipes for a users given ingredients and help them make the most of the food they have at home; we want users to be able to interact with an AI chatbot to help them efficiently make recipes/food based on the ingredients they have. We also plan to help users explore more cultures, recipes, and unique cooking experiences thanks to our propietary databases and unique AI.

## Goals

- Create App UI
- Create chatbot for User to interact with
- Create explore/recipes page for user to be able to learn more about different cuisines and foods

## Layout of Repository

```bash
Let-Them-Cook/
├── public/                   # Static files 
│
├── src/                      # Main source code
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page-level components (e.g. Home, Explore, Recipe)
│   ├── chatbot/              # Chatbot logic and interface
│   ├── api/                  # API calls or backend integration, most likely Chat GPT API
│   ├── data/                 # Local JSON or sample data to test
│   ├── styles/               # Style themes
│   └── App.jsx               # Main app 
│
├── server/                   # Not sure about this section, we may or may not use our own backend (potentially thinking of firestore)
│   ├── routes/               # API routes
│   ├── controllers/          # Logic for routes
│   ├── models/               # DB models (like MongoDB)
│   └── index.js              # Entry point for server
│
├── .gitignore                # Other files like gitignore and readme
├── README.md
├── package.json
└── LICENSE

# ***************************************** Build, Run, and Test Instructions (Beta Release) *********************************************
# Make sure the followings are installed:
#  - Node.js (v18 or higher)
#  - npm (v9 or higher)

# You will also need to create a .env file in the root directory that contains following:
REACT_APP_OPENAI_API_KEY=your-openai-key
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-api-key
REACT_APP_FIREBASE_API_KEY=your-firebase-key


# Now, in order to run the app locally..

# 1) First install the dependencies by running the command:
npm install


# 2) Then, start the development server by running the command:
npm start

# The app will be running on the http://localhost:3000

# This will run the frontend React UI, which includes the following:

# - The recipe chatbot

# - Nearest grocery store locator

# - Firebase-based login and profile functionality

# ***** TO RUN TESTS ******
# For testing, we are using jest and @testing-library/react for component and logic testing.
# Our test files are located in:
/src/__tests__/

# In order to run the tests, you can run the command:
npm test

# We have all of the core features covered (e.g., Chatbot, Profile page, routing logic).
# Our GitHub Actions is set up to run tests automatically on push.


# Operational Use Case (Beta Release)
#  We currently have one full user flow that works end-to-end where the user tells the chatbot what ingredients they have → the app recommends recipes → if something is missing, it shows the nearest grocery stores.

# Here’s what that flow looks like behind the scenes:

# 1. The user types their available ingredients into the chatbot on the home page.
# 2. Our app uses the OpenAI API to generate recipes that match what they have.
# 3. It checks for any missing ingredients from the recommended recipes.
# 4. If there are missing ingredients, the app uses the Google Maps API to display the 5 closest grocery stores near the user.
# 5. The user can explore more recipe options or save them using Firebase auth and Firestore.

# This use case covers all the core parts of our system:
# - React frontend (Chatbot.jsx, NearestGroceryStore.jsx, Profile.jsx)
# - API integration (OpenAI + Google Maps)
# - Firebase for login and saving user-specific data
# - State management and routing
