Team Members: Dhruv Krishna Srinivasan, Anas Slassi, Ahmad Sorush, Jeffrey Luu, Guadalupe Luna, Rodas Tekle

# Let-Them-Cook

Link to the Deployed Website (preferred to use Chrome and Safari): https://let-them-cook-1d7b3.web.app/

Link to Team Status Reports: https://docs.google.com/document/d/1eTC_VSmyYSDE3__Ye2_9YM9x5vDOsuFFiBD-rr5rpxo/edit?usp=sharing

Link to User Manual (for software and bug reporting): https://github.com/jeffreyhluu/Let-Them-Cook/blob/main/USER_MANUAL.md

Link to Developer Manual (for setup, build, run, and test instructions): https://github.com/jeffreyhluu/Let-Them-Cook/blob/main/DEVELOPER_MANUAL.md

## Idea

**Let-Them-Cook** is meant to be a revolutionary app to help users with the everyday struggle of cooking. Our goal is to be able to identify the best recipes for a users given ingredients and help them make the most of the food they have at home; we want users to be able to interact with an AI chatbot to help them efficiently make recipes/food based on the ingredients they have.

## Goals Accomplished

- Create App UI
- Enable secure authentication
- Create chatbot for User to interact with
- Create explore/recipes page for user to be able to learn more about different cuisines and foods and rate recipes
- Create a profile page for the user
- Enable the user to find the nearest grocery stores & estimated prices for their ingredients

## Layout of Repository

```bash
Let-Them-Cook/
├── public/                   # Static files
│
├── src/                      # Main source code
│   ├── assets/               # Images, fonts, etc.
│   ├── __tests__             # Unit tests and UI tests
│   ├── Components/           # Reusable UI components, Chatbot logic and interface
│   ├── pages/                # Page-level components (e.g. Home, Explore, Recipe)
│       └── css/              # Styling for pages
│   ├── data/                 # Local JSON or sample data to test
│   └── App.jsx               # Main app
│
├── server/                   # For preliminary local host testing
│   ├── .env            
│   └── node_modules          # Necessary modules
│── functions/                # Firebase functions
│   ├── .env  
│── └── index.js              # Firebase cloud functions
├── dataconnect/   
├── .gitignore                
├── .env                      # Secure storage of API Keys  
├── README.md
├── package.json
├── package-lock.json
└── LICENSE
```

Our GitHub Actions is set up to run tests automatically on push.

# Operational User Flow 
We currently have a full user flow that works end-to-end where the user tells the chatbot what ingredients they have → the app recommends recipes → the user can save/submit recipes -> the user can access the recipes on their Explore page.

Here’s what that flow looks like behind the scenes after a user logs in:

## Starting from the /home page (Chatbot)
1. The user types their available ingredients into the chatbot on the home page. They can also modify their Profile page with ingredients they have.
2. The app checks whether the user has saved a similar recipe. Say the user has saved a similar recipe:

    a. The Chatbot outputs the similar recipe and asks the user whether they want a different recipe with those ingredients.

        i. If the user types and submits "Yes", a new recipe is generated, and the user will have the option to submit that recipe.

        ii. If the user types and submits "No", no new recipe is generated.

3. The app checks whether another user has saved a similar recipe to the one this user is requesting. Say another user has saved a similar recipe:

    a. The Chatbot outputs the similar recipe, and the User has the option to save that recipe in their Explore Page. If the user doesn't want that recipe, they can try their search again.

4. Say there were no similar recipes from the logged-in user or other users. Our app uses the OpenAI API to generate recipes that match the ingredients. Once the new recipe is generated, the user can "submit" the recipe to their Explore page.
5. If there are missing ingredients, the app uses the Google Maps API to display the closest grocery stores near the user, along with the estimated prices of some ingredients from each store. The user can access these store and estimated prices by clicking the "Find Stores & Ingredient Prices" button.
6. The user can explore more recipe options or save them using Firebase auth and Firestore.

## User goes to the Explore Page.
1. Say the user wants to make a meal they have made before. The user can see all their submitted/saved recipes, and they can search for recipes to narrow down what they want.
2. The user can click on the recipe title to see the instructions for the recipe.
3. After making the recipe, the user can rate the recipe. They can refresh the Explore page to see the average rating across all users.

## What else the User can do:
- Use the standalone Nearest Grocery store page if they already have their shopping list in mind, but they want to know which grocery store to go to. They can input a zip code if they do not want to share their actual location. They can see a list of grocery stores with their addresses and ratings.
- Use the Profile page to add a profile image, list their dietary restrictions, and add current ingredients that they have

## This user flow covers:
All core parts of the system:
- React frontend (Chatbot.jsx, Explore.jsx, NearestGroceryStore.jsx, Profile.jsx)
- API integration (OpenAI + Google Maps)
- Firebase for login and saving user-specific data
- State management and routing
