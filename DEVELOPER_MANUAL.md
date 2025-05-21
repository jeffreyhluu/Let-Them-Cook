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

---

## How to Build the Software
1. Clone the repository: git clone https://github.com/jeffreyhluu/Let-Them-Cook.git
2. npm install
No separate "build" for our app

---

## How to Test the Software
In order to run all the tests, you can run the command:
npm test

In order to run 1 test (example: Chatbot.test.js), you can run the command:
npm test Chatbot.test.js

---

## How to Add New Tests
1. Add the new test file to the src/__tests__ folder.
2. Make sure the test file suffix is ".test.js".
3. Make sure the test file prefix helps the user identify what is being tested (like "Chatbot" in Chatbot.test.js).

---

## How to Build a Release of the Software
All build tasks are automated with our app. When a developer does a "git push," Github Actions makes sure 
the new push passes all tests and build requirements. As a sanity check, the developer should just make sure 
that the Github Actions led to a successful build after their push.
