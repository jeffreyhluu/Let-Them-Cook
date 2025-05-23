Team Members: Dhruv Krishna Srinivasan, Anas Slassi, Ahmad Sorush, Jeffrey Luu, Guadalupe Luna, Rodas Tekle

# Let-Them-Cook

Link to Status Reports: https://docs.google.com/document/d/1eTC_VSmyYSDE3__Ye2_9YM9x5vDOsuFFiBD-rr5rpxo/edit?usp=sharing

## Idea

**Let-Them-Cook** is meant to be a revolutionary app to help users with the everyday struggle of cooking. Our goal is to be able to identify the best recipes for a users given ingredients and help them make the most of the food they have at home; we want users to be able to interact with an AI chatbot to help them efficiently make recipes/food based on the ingredients they have. We also plan to help users explore more cultures, recipes, and unique cooking experiences thanks to our propietary databases and unique AI.

## Goals

- Create App UI
- Create chatbot for User to interact with
- Create explore/recipes page for user to be able to learn more about different cuisines and foods

## Layout of Repository AND Beta Release Details

```bash
Let-Them-Cook/
├── public/                   # Static files
│
├── src/                      # Main source code
│   ├── assets/               # Images, fonts, etc.
│   ├── __tests__             # Unit tests and UI tests
│   ├── Components/           # Reusable UI components, Chatbot logic and interface
│   ├── pages/                # Page-level components (e.g. Home, Explore, Recipe)
<<<<<<< HEAD
│   ├── chatbot/              # Chatbot logic and interface
│   ├── api/                  # API calls or backend integration, most likely Chat GPT API
│   ├── data/                 # Local JSON or sample data to test
│   ├── styles/               # Style themes
│   └── App.jsx               # Main app
=======
│   └── App.jsx               # Main app 
>>>>>>> 06b8580716888bf5889e40fd4c660242bec4822b
│
├── server/                   # Not sure about this section, we may or may not use our own backend (potentially thinking of firestore) ->            temporary for Nearest Grocery Store
│   ├── node_modules          # Necessary modules
│
├── .gitignore                
├── .env                      # Secure storage of API Keys  
├── README.md
├── package.json
├── package-lock.json
└── LICENSE

<<<<<<< HEAD

=======
>>>>>>> 06b8580716888bf5889e40fd4c660242bec4822b
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

<<<<<<< HEAD

# 2) Then, start the development server by running the command:
=======
#2) In one terminal, cd into the server folder, and run the command:
node server.js

# 3) Then, in a separate terminal in the base Let Them Cook folder, start the app by running the command:
>>>>>>> 06b8580716888bf5889e40fd4c660242bec4822b
npm start

# The app will be running on the http://localhost:3000

# This will run the frontend React UI, which includes the following:

# - The recipe chatbot

<<<<<<< HEAD
# - Nearest grocery store locator

# - Firebase-based login and profile functionality

# ***** TO RUN TESTS ******
=======
# - The Explore page

# - Nearest grocery store locator

# - Firebase-based login 

# ***** TO TEST/BUILD THE SYSTEM AND RUN TESTS ******
>>>>>>> 06b8580716888bf5889e40fd4c660242bec4822b
# For testing, we are using jest and @testing-library/react for component and logic testing.
# Our test files are located in:
/src/__tests__/

# In order to run the tests, you can run the command:
npm test

<<<<<<< HEAD
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








=======
# We have all of the core features covered (e.g., Chatbot, Explore page, routing logic).
# Our GitHub Actions is set up to run tests automatically on each push.


# Example Operational Use Case (Beta Release)
#  We currently have a full user flow that works end-to-end where the user tells the chatbot what ingredients they have → the app recommends recipes. The user can submit a recipe if they want it to be saved in their explore page. 

# Here’s what that flow looks like behind the scenes (Beta Release):

# 1. The user logs in using Firebase Authentication.
# 2. The user types their available ingredients into the chatbot on the home page.
# 3. Our app uses the OpenAI API to generate recipes that match what they have.
# 4. The user can choose to submit the recipe or add different ingredients for different recipes. If the user submits the recipe, the recipe is saved under their user in a UsersCollection in Firestore.
# 5. Say the user took a 10-minute break and wants to access the recipe they had submitted. The Explore page renders the recipes that the logged-in user has submitted. The user can see an image of the recipe, click the title of the recipe to access the recipe instrutions, and see the cuisine/difficulty of the recipe. Images for each recipe are being generated via an OpenAI API Key. Currently, all recipes have a 3/5 rating by default, but we are implementing a rating feature for each recipe by final release (stretch goal).
# 6. Say the user wants to make a certain recipe, but they don't yet have all the ingredients. They can access the Nearest Grocery Store tab, which uses a Google Maps API to find the nearest grocery store to the user. The user is asked to provide their location. If they do not want to provide their exact location, the user can input their zip code instead. By final release, we aim to integrate the Nearest Grocery Store feature with the Chatbot, so that specific stores can be suggested based on the ingredients that the user still needs to obtain (stretch goal).

# Operational Parts of the Let Them Cook App for the User (which the above use case covers):
# - Firebase authentication
# - Chatbot recipe output with a link to similar recipes and the option to save recipes via the submit button
# - Explore page where the user can access their saved/submitted recipes, with the instructions linked
# - Nearest grocery store tab so the user knows where to find their remaining ingredients

# Operational Technical Parts of the Let Them Cook App:
# - React frontend (Chatbot.jsx, NearestGroceryStore.jsx, Explore.jsx, etc.)
# - API integration (OpenAI + Google Maps)
# - Firebase + Firestore for login and saving user-specific data
# - State management and routing
# - Github Actions for automated testing (all tests are run on each push)
>>>>>>> 06b8580716888bf5889e40fd4c660242bec4822b
