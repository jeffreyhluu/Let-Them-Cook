import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Paper, CircularProgress } from '@mui/material';
import { Chat } from '@mui/icons-material';
import { addRecipeToUser, addOrInitRecipeRating, createOrUpdateUser } from '../firestoreHelpers';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Chatbot.css';
import NearestGroceryStore from '../pages/NearestGroceryStore'; // Adjust path as needed
import { Modal, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const Chatbot = () => {
  const [userName, setUserName] = useState('');
  const [userDietary, setUserDietary] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef();
  const [parsedRecipe, setParsedRecipe] = useState(null);

  // Fetch user info from Firestore once on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(data.displayName || 'there');
          setUserDietary(data.dietaryRestrictions || 'none');
        } else {
          setUserName('there');
          setUserDietary('none');
        }
      } else {
        setUserName('there');
        setUserDietary('none');
      }
    };
    fetchUserInfo();
  }, []);

  // Set initial system + assistant greeting messages once user info loaded
  useEffect(() => {
    if (!userName) return; // wait until userName set

    setMessages([
      {
        role: 'system',
        content: `You are a helpful AI recipe assistant. When a user enters ingredients, suggest a recipe using those items.
  
      Additionally, generate a recipe name and provide the following metadata clearly at the top:
  
      Metadata:
      Name: [recipe name]
      Dietary: [category]
      Cuisine: [type]
      Difficulty: [level]
  
      Then, continue with the recipe as normal with "Ingredients" and "Instructions".
  
      The user has the following dietary restrictions: "${userDietary}". Do NOT recommend recipes that violate these restrictions.

      Make sure to clearly distinguish between metadata, ingredients, and instructions.`
      },
      {
        role: 'assistant',
        content: `Hi ${userName}, I'm Yummerz, your personalized AI assistant! 🧑‍🍳 Based on your dietary preferences (${userDietary}), please input ingredients so I can help you whip up something delicious.`
      }
    ]);
  }, [userName, userDietary]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    const el = messageEndRef.current;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const payloadMessages = [messages[0], userMessage];
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: payloadMessages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const responseText = response.data.choices[0].message.content;

      if (isRecipe(responseText)) {
        const recipeObj = extractRecipeData(responseText);
        setParsedRecipe(recipeObj);
        const formattedHTML = await formatRecipeWithRealLink(recipeObj);
        setMessages([...newMessages, { role: 'assistant', content: formattedHTML }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: responseText }]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I had a problem fetching a recipe. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your code remains exactly the same as you provided,
  // including isRecipe, extractRecipeData, mapDifficultyToNumber, getDifficultyText,
  // parseDietaryEnum, getDietaryText, getRealRecipeLink,
  // generateAndStoreImage, formatRecipeWithRealLink, handleKeyDown,
  // and the return JSX

  // I’ll just paste your unchanged functions and JSX below for completeness:

  const isRecipe = (text) => text.includes('Ingredients:') && text.includes('Instructions:');

  const extractRecipeData = (text) => {
    const metadata = text.match(/Metadata:\s*Name:\s*(.+?)\s*Dietary:\s*(.+?)\s*Cuisine:\s*(.+?)\s*Difficulty:\s*(.+?)(?:\n|$)/i);
    const [recipeName, dietary, cuisine, difficulty] = metadata ? metadata.slice(1).map(str => str.trim()) : ['Not specified', 'Not specified', 'Not specified', 'Easy'];

    const ingredients = text.match(/Ingredients:([\s\S]*?)Instructions:/)?.[1].trim() ?? 'No ingredients provided.';
    const instructions = text.match(/Instructions:([\s\S]*)/)?.[1].trim() ?? 'No instructions provided.';

    return {
      recipeID: crypto.randomUUID(),
      recipeName,
      ingredients,
      instructions,
      rating: 3,
      difficulty: mapDifficultyToNumber(difficulty),
      cuisineType: cuisine,
      dietary: parseDietaryEnum(dietary),
      saved: true
    };
  };

  const mapDifficultyToNumber = (d) => ({ easy: 1, medium: 2, hard: 3 }[d.toLowerCase()] ?? 1);
  const getDifficultyText = (n) => ({ 1: 'Easy', 2: 'Medium', 3: 'Hard' }[n] ?? 'Easy');
  const parseDietaryEnum = (v) => ({ 'gluten-free and dairy-free': 0, 'gluten-free': 1, 'dairy-free': 2, 'vegetarian': 4, 'vegan': 5 }[v.toLowerCase()] ?? 3);
  const getDietaryText = (v) => ({ 0: 'Gluten-free and dairy-free', 1: 'Gluten-free', 2: 'Dairy-free', 4: 'Vegetarian', 5: 'Vegan', 3: 'Not specified' }[v] ?? 'Not specified');

  const getRealRecipeLink = async (ingredients) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients,
            number: 1,
            ranking: 1,
            apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          }
        }
      );
  
      const recipe = response.data[0];
      if (!recipe?.id) return null;
  
      const info = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        }
      });
  
      return info.data?.sourceUrl ?? null;
  
    } catch (err) {
      console.error('Error fetching real recipe link:', err);
      return null;
    }
  };

  const generateAndStoreImage = async (prompt, recipeID) => {
    // Your existing implementation here
  };

  const formatRecipeWithRealLink = async ({ recipeName, dietary, cuisineType, difficulty, ingredients, instructions }) => {
    const difficultyText = getDifficultyText(difficulty);
    const dietaryText = getDietaryText(dietary);

    const ingredientsHTML = ingredients.split('\n').map(i => `<li>${i.trim()}</li>`).join('');
    const instructionsHTML = instructions.split('\n').map(i => `<p>${i.trim()}</p>`).join('');

    const recipeLink = await getRealRecipeLink(ingredients);

    return `
      <div class="assistant-recipe">
        <h2>${recipeName}</h2>
        <h3>Metadata:</h3>
        <ul>
          <li><strong>Name:</strong> ${recipeName}</li>
          <li><strong>Dietary:</strong> ${dietaryText}</li>
          <li><strong>Cuisine:</strong> ${cuisineType}</li>
          <li><strong>Difficulty:</strong> ${difficultyText}</li>
        </ul>
        <h3>Ingredients:</h3>
        <ul>${ingredientsHTML}</ul>
        <h3>Instructions:</h3>
        ${instructionsHTML}
        ${
          recipeLink
            ? `<p><strong>If you would like a different recipe with some similiar ingredients, check out this link: <a href="${recipeLink}" target="_blank">${recipeLink}</a></strong><br /><em>(Note: This recipe may not include all the ingredients you provided.)</em></p>`
            : '<p><strong>No real recipe link found for this dish.</strong></p>'
        }
      </div>
    `;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <Box className="chatbot-container">
      <Box className="chatbot-header">🍽️ Yummerz - Recipe Assistant</Box>

      {!input && (
        <Button
          variant="text"
          size="small"
          onClick={() => setInput("chicken, broccoli, garlic")}
          style={{ margin: '0 auto', marginBottom: '10px' }}
        >
          Try example: chicken, broccoli, garlic
        </Button>
      )}

      <Box className="chatbot-messages">
        {messages.filter(msg => msg.role !== 'system').map((msg, i) => (
          <Box key={i} className={`chatbot-message ${msg.role}`}>
            <Paper className={`bubble ${msg.role}`}>
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : msg.content}
            </Paper>
          </Box>
        ))}
        <div ref={messageEndRef} />
      </Box>

      <Box className="chatbot-input">
        <TextField
          variant="outlined"
          placeholder="Type ingredients (e.g., eggs, spinach) and get a recipe!"
          fullWidth
          inputRef={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          disabled={loading}
          className="send-button"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : <Chat />}
        </Button>
      </Box>
      <Button 
  variant="outlined" 
  color="secondary" 
  onClick={() => setModalOpen(true)}
  style={{ margin: '10px 0' }}
>
  Find Nearest Grocery Stores
</Button>
<Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  aria-labelledby="nearest-grocery-modal-title"
  aria-describedby="nearest-grocery-modal-description"
  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
  <Paper 
    style={{ 
      position: 'relative',  // Make sure relative positioning is set for absolute child
      width: '90%', 
      maxWidth: 600, 
      maxHeight: '80vh', 
      overflowY: 'auto', 
      padding: 20 
    }}
  >
    {/* X button */}
    <IconButton
      onClick={() => setModalOpen(false)}
      style={{ 
        position: 'absolute', 
        top: 8, 
        right: 8 
      }}
      aria-label="close"
      size="large"
    >
      <CloseIcon />
    </IconButton>

    <Typography id="nearest-grocery-modal-title" variant="h6" gutterBottom>
      Nearest Grocery Stores
    </Typography>
    <NearestGroceryStore />
  </Paper>
</Modal>


      {parsedRecipe && (
        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              const user = auth.currentUser;
              if (!user) return alert("You must be logged in to submit a recipe.");
              const { uid, displayName, email } = user;

              await createOrUpdateUser(uid, displayName ?? 'Anonymous', email ?? 'unknown@example.com');

              const prompt = `A top-down photo of a delicious dish called ${parsedRecipe.recipeName}.`;
              const imageURL = await generateAndStoreImage(prompt, parsedRecipe.recipeID);

              const recipeWithImage = {
                ...parsedRecipe,
                imageURL: imageURL ?? '',  // Store empty string if it fails
              };

              await addRecipeToUser(uid, recipeWithImage);
              await addOrInitRecipeRating(recipeWithImage);
              alert('Recipe saved!');
            }}
          >
            Submit Recipe
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;
