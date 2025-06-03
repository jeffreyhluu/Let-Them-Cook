# Let Them Cook — User Manual

Link to the Deployed Website (preferred to use Chrome and Safari): https://let-them-cook-1d7b3.web.app/

Link to the Developer Manual: https://github.com/jeffreyhluu/Let-Them-Cook/blob/main/DEVELOPER_MANUAL.md

**Let Them Cook** is a web application designed to help users find recipes based on ingredients they already have and discover nearby grocery stores to purchase missing ingredients. The app features a smart chatbot assistant, personalized profile pages, recipe browsing via an Explore page, and user-friendly UI for seamless meal planning.

This project aims to make cooking more accessible and efficient, especially for users who want to minimize food waste and save time searching for recipes or grocery locations. Our target audience consists of college students and young adults.

---

## How to Install the Software + Setup

If a user just wants to access the deployed website, they do not need to install any software. They can go to https://let-them-cook-1d7b3.web.app/. 

If the user wants to run the app locally, setup is required. 

### Prerequisites (steps are below)

* **Node.js** (v18 or later)
* **npm** (v9 or later)
* **Firebase CLI**
* **Git**
* **Google Maps API key** (for location features)
* **Spoonacular API key** (for recipes)
* **OPEN AI API key** (for chatbot) -> may require payment plan
* **.env** files with secured keys (described below)
* **Google Account**


This section explains the repo and Firebase setup process.

### 1) Clone the repo
git clone https://github.com/jeffreyhluu/Let-Them-Cook.git

### 2) Checkout the final release branch
git checkout final-release

### 3) Email the owner of the project for Firebase permissions
Email Dhruv at sdhruvkrishna@gmail.com (with the subject line "Let Them Cook - Please Add") or message on Slack to be added to the Firebase "Let Them Cook" project with appropriate permissions. Accept the invite from your email account once Dhruv adds you.

### 4) Install dependencies
Make sure you are in the "Let Them Cook" root directory. In your terminal, run:
```bash
npm install
```

Then cd into the functions directory and run the same command:
```bash
cd functions
npm install
```

Navigate back to the root directory:
```bash
cd ..
```

### 5) Make a .env file in your root directory
The format should look like this: 

```bash
REACT_APP_OPENAI_API_KEY=<your key here>
REACT_APP_GOOGLE_MAPS_API_KEY=<your key here>
REACT_APP_SPOONACULAR_API_KEY=<your key here>
REACT_APP_FIREBASE_PROJECT_ID=let-them-cook-1d7b3
```

Get an OpenAI API Key: https://platform.openai.com/api-keys

Get a Google Maps API Key from the Places API: https://developers.google.com/maps/documentation/places/web-service
-> Make an API key and select all services

Get a Spoonacular API Key: https://www.postman.com/spoonacular-api/spoonacular-api/collection/rqqne3j/spoonacular-api

### 6) Make a .env file in your server directory
The format should look like this:

```bash
GOOGLE_MAPS_API_KEY=<your key here>
```

Use the same Google Maps API Key as before.

### 7) Make a .env file in your functions directory.
The format should look like this:

```bash
GOOGLE_API_KEY=<your key here>
```

Use the same Google Maps API Key as before.

### 8) Go to your Google Cloud Console's API Library:
Go to: https://console.cloud.google.com/apis/library?inv=1&invt=AbzJeQ

Under "Select a Project" in the top left, select the Let Them Cook project that you have been added to. Search for these 2 APIs from Google Enterprise API to make sure they are enabled, and if they are not enabled, enable them:
- Places API
- Geolocation API

### 9) Get your Firebase CLI working
In your terminal, run these three commands:
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
```
After you run the 2nd command, login with the email address that has access to "Let Them Cook." After the 3rd command, make sure the projects list shows the Let Them Cook project.

### 10) Set the Google Maps API as a secret parameter
In your terminal, run the command: 
```bash
firebase functions:secrets:set GOOGLE_MAPS_API_KEY
```
Enter your same Google Maps API key when prompted in the terminal.

### 11) Set the Google Maps API in the function config
In your terminal, run the command:
```bash
firebase functions:config:set google_maps_api_key="YOUR_ACTUAL_API_KEY_HERE"
```
and replace "YOUR_ACTUAL_API_KEY_HERE" with the same Google Maps API Key as before.


---

## How to Run the Software

To access the deployed website, just go to: https://let-them-cook-1d7b3.web.app/.

To run **Let Them Cook** locally, use **two terminals** as described below:


### 1) Start a Firebase emulator to simulate the backend:
In your terminal, run:
```bash
firebase emulators:start --only functions
```

### 2) Then, start the local host with the following steps:
Keep the Firebase emulator running in one terminal, and open a separate terminal.
In that separate terminal, run:
```bash
npm start
```

The app will be running on the http://localhost:3000

This will run the frontend React UI, which includes the following:
- The recipe chatbot
- Nearest grocery store locator
- Firebase-based login and profile functionality

---

## How to Use the App (with User Flow Example)

### Features

* **Login Page:** Sign in using Firebase authentication.
* **Chatbot Page:** Ask the chatbot for recipe suggestions, missing ingredients, or nearby stores. The user can save recipes if there are similar ones from other users, or they can submit a new generated recipe.
* **Nearest Grocery Store:** Find grocery stores near your current location or via a ZIP code. Within the Chatbot page, this feature is integrated to also estimate prices of some of the ingredients in the searched recipe.
* **Explore Page:** Browse recipes that you have saved and submitted. You can rate the recipes, change your rating later, and see the average rating across users.
* **Profile Page:** Customize and view your saved preferences.

We currently have a full user flow that works end-to-end where the user tells the chatbot what ingredients they have → the app recommends recipes → the user can save/submit recipes -> the user can access the recipes on their Explore page.

The user starts on the Chatbot page. Here’s what that flow looks like behind the scenes after a user logs in:

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

---

## How to Report a Bug

Please report bugs through our GitHub issue tracker:
[GitHub Issues](https://github.com/jeffreyhluu/Let-Them-Cook/issues)

Only bugs that are in the deployed app should be reported through our issue tracker. It is not necessary to create an issue for every new branch or feature.

When reporting a bug, include the following if possible:

* **Steps to reproduce**
* **Expected behavior**
* **Actual behavior**
* **Screenshots** (if applicable)

You can make a bug report [here](https://github.com/jeffreyhluu/Let-Them-Cook/issues/new?template=bug_report.md) to help guide your submission.
We do not have a standardized expected format because some bugs require different information than others. Please include screenshots if possible. 

---

## Known Bugs / Limitations

Tracked bugs are listed in the [Issues](https://github.com/jeffreyhluu/Let-Them-Cook/issues) tab. We have resolved the bugs before final release. Our app has some minor limitations. Some current known limitations include:

* Buttons do not always work in Microsoft Edge
* Command-Shift-R (Macbook) or CTRL-Shift-R (Windows) is sometimes needed to clear the cache after a deployment for features to work



