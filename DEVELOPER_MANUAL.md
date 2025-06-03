# Let Them Cook — Developer Manual

Link to the Deployed Website: https://let-them-cook-1d7b3.web.app/
Link to the User Manual: https://github.com/jeffreyhluu/Let-Them-Cook/blob/main/USER_MANUAL.md

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

# ***************************************** Setup, Build, Run, and Test Instructions *********************************************
# Make sure the followings are installed:
#  - Node.js (v18 or higher)
#  - npm (v9 or higher)

## Setup + How to Obtain Source Code

This section explains the repo and Firebase setup process. Use the USER_MANUAL.md (link at the top) if you just want to use the web app at the link https://let-them-cook-1d7b3.web.app/.

# 1) Clone the repo
git clone https://github.com/jeffreyhluu/Let-Them-Cook.git

# 2) Checkout the final release branch
git checkout final-release

# 3) If you want to build + deploy, email the owner of the project
Email Dhruv at sdhruvkrishna@gmail.com (with the subject line "Let Them Cook - Please Add") or message on Slack to be added to the Firebase "Let Them Cook" project with appropriate permissions.

# 4) Install dependencies
In your terminal, run:
```bash
npm install
```

# 5) Make a .env file in your root directory
The format should look like this: 

REACT_APP_OPENAI_API_KEY=<your key here>
REACT_APP_GOOGLE_MAPS_API_KEY=<your key here>
REACT_APP_SPOONACULAR_API_KEY=<your key here>
REACT_APP_FIREBASE_PROJECT_ID=let-them-cook-1d7b3

Get an OpenAI API Key: https://platform.openai.com/api-keys

Get a Google Maps API Key from the Places API: https://developers.google.com/maps/documentation/places/web-service
-> Make an API key and select all services

Get a Spoonacular API Key: https://www.postman.com/spoonacular-api/spoonacular-api/collection/rqqne3j/spoonacular-api

# 6) Make a .env file in your server directory
The format should look like this:

GOOGLE_MAPS_API_KEY=<your key here>

Use the same Google Maps API Key as before.

# 7) Make a .env file in your functions directory.
The format should look like this:

GOOGLE_API_KEY=<your key here>

Use the same Google Maps API Key as before.

# 8) Go to your Google Cloud Console's API Library:
Go to: https://console.cloud.google.com/apis/library?inv=1&invt=AbzJeQ

Under "Select a Project" in the top left, select the Let Them Cook project that you have been added to. Search for these 2 APIs from Google Enterprise API to make sure they are enabled, and if they are not enabled, enable them:
- Places API
- Geolocation API

# 9) Get your Firebase CLI working
In your terminal, run these three commands:
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
```
Make sure the projects list shows the Let Them Cook project.

# 10) Set the Google Maps API as a secret parameter
In your terminal, run the command: 
```bash
firebase functions:secrets:set GOOGLE_MAPS_API_KEY
```
Enter your same Google Maps API key when prompted in the terminal.

## Build

Complete the "Setup" section instructions before this section. This section explains how to build and deploy new code to the web app. If you just want to run the app locally, skip below to the "Run (Locally)" section.

# 1) BEFORE you deploy any changes:
Make sure you tested your changes locally (using the instructions in the "Run (Locally)" section below).

# 2) Navigate back to the root directory of the "Let Them Cook" project.
```bash
cd .. 
```
Until you reach the root directory of the project if you are inside a subdirectory.

# 3) In your terminal, run the following 2 commands to do a new build.
```bash
rm -rf build
npm run build
```

Choose 4a, 4b, or 4c depending on what code you changed.

# 4a) If you only made changes to the frontend code (src directory), run:
```bash
firebase deploy --only hosting
```
This will deploy your changes quickly to the web app.

# 4b) If you made changes to any code in the functions directory, run:
```bash
firebase deploy --only functions
firebase deploy --only hosting
```
This will deploy your changes to the web app.

# 4c) If you want to do a full deployment, run:
```bash
firebase deploy
```
This will deploy your changes to the web app after 5-10 minutes. It will also modify some Firebase Storage rules that you will want change. 

Go to the Let Them Cook project in Firebase, and select the "Storage" tab on the left panel. Once you're in the Storage tab, select the "Rules" tab at the top of the page. Change the rules to:

rules_version = '2';
service firebase.storage {
    match /b/{bucket}/o {
    match /{allPaths=**} {
        allow read, write: if request.auth != null;
    }
  }
}

and make sure to PUBLISH the changes!

# 5) Open the app, clear the cache, and see your changes:
Open the app at: https://let-them-cook-1d7b3.web.app/

Clear the cache by running: 
Macbook: Command-Shift-R
Window: CTRL-Shift-F5

(You may need to clear the cache on the specific page where you made changes)

You'll see your changes in the updated app! If you run into any issues, contact Dhruv at sdhruvkrishna@gmail.com or through Slack.

See the "Sanity Checks" section at the bottom of this manual for checks you should do.

# 6) Make sure to push your changes to the repo.
Push to the repo using the typical git add, git commit, git push, code review process (specific instructions in the "Git Etiquette" section).
Our GitHub Actions is set up to run tests automatically on push.


## Run (Locally)

Completing the "Setup" section instructions is necessary before this section. This section explains how to run "Let Them Cook" in your local host.

# 1) Start a Firebase emulator to simulate the backend:
In your terminal, run:
```bash
firebase emulators:start
```

OR if you just want to run the functions emulator, run:
```bash
firebase emulators:start --only functions
```

# 2) Then, start the local host with the following steps:
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

## Test (Testing the software and Adding new tests)
For testing, we are using jest and @testing-library/react for component and logic testing.
Our test files are located in:
/src/__tests__/

In order to run the tests, you can run the command:
```bash
npm test
```

Here are the steps to create a test file and make sure your tests work:

# 1) Go to the src/__tests__ directory

# 2) Create a test file
Your file name must end with ".test.js"

# 3) Create your test
Use the Jest testing framework with mocks. See a test from firestoreHelpersTest.test.js as an example:
test('getUserData returns null when document does not exist', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });

    const result = await getUserData('123');
    expect(result).toBeNull();
});

# 4) Make sure the code passes the test
In your terminal, run:
```bash
npm test
```
If all tests pass, you can push your new tests to the repo (using the instructions in the Git Etiquette section).


## Git Etiquette
# 1) Separate branches
Make your code changes in a separate branch using
```bash
git checkout -b <your branch name>
```

# 2) Before you push
Run the test command in your terminal:
```bash
npm test
```

# 3) How to push
Run the typical git add and git commit commands. Then to push, run:
```bash
git push -u origin your-branch-name
```

# 4) Open a PR
Go to the Github repo (https://github.com/jeffreyhluu/Let-Them-Cook) and open a Pull Request under the "Pull requests" tab. Wait for a few minutes for the necessary CI checks / tests to pass. Request another developer to merge your changes.

# 5) After your changes are merged ...
In your VSCode setup, run these two commands to make sure your codebase is up to date.
```bash
git checkout main
git pull
```

Then you can choose to delete your previous feature branch in the repo.

## Sanity Checks After Building a Release
After building/deploying the web app, here are some sanity checks to do:
1. Make sure Chatbot still generates recipes (make sure to clear the cache with Command-Shift-R or CTRL-Shift-F5).
2. Make sure Nearest Grocery Store still returns the nearest grocery store (make sure to clear the cache with Command-Shift-R or CTRL-Shift-F5). 
3. Check the Explore page to make sure images for recipes are still showing up. If images disappear after a few hours, this means you forgot to change the Firebase Storage rules. Change the Firebase Storage rules as explained above:
rules_version = '2';
service firebase.storage {
    match /b/{bucket}/o {
    match /{allPaths=**} {
        allow read, write: if request.auth != null;
    }
  }
}



