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
