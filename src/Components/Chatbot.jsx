import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Paper, CircularProgress } from '@mui/material';
import { Chat } from '@mui/icons-material';
import { addRecipeToUser, addOrInitRecipeRating, createOrUpdateUser } from '../firestoreHelpers';
import { auth } from '../firebase';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
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

      Make sure to clearly distinguish between metadata, ingredients, and instructions.`
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const [parsedRecipe, setParsedRecipe] = useState(null);

  const scrollToBottom = () => {
    const el = messageEndRef.current;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const payloadMessages = [
        messages[0], // system prompt only
        userMessage
      ];

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

      const assistantMessage = response.data.choices[0].message;
      const responseText = assistantMessage.content;

      if (isRecipe(responseText)) {
        const recipeObj = extractRecipeData(responseText);
        setParsedRecipe(recipeObj);
        const formattedHTML = formatRecipe(recipeObj);
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

  const isRecipe = (responseText) => {
    return responseText.includes('Ingredients:') && responseText.includes('Instructions:');
  };

  const extractRecipeData = (recipeText) => {
    const metadataMatch = recipeText.match(
      /Metadata:\s*Name:\s*(.+?)\s*Dietary:\s*(.+?)\s*Cuisine:\s*(.+?)\s*Difficulty:\s*(.+?)\s*(?:\n|$)/i
    );

    let recipeName = 'Not specified';
    let dietary = 'Not specified';
    let cuisine = 'Not specified';
    let difficulty = 'Easy'; // Default difficulty is "Easy" for display purposes

    if (metadataMatch) {
      recipeName = metadataMatch[1].trim();
      dietary = metadataMatch[2].trim();
      cuisine = metadataMatch[3].trim();
      difficulty = metadataMatch[4].trim();
    }

    // Convert the difficulty text to numeric value
    difficulty = mapDifficultyToNumber(difficulty);

    const ingredientsSection = recipeText.match(/Ingredients:([\s\S]*?)Instructions:/);
    const instructionsSection = recipeText.match(/Instructions:([\s\S]*)/);

    const ingredients = ingredientsSection ? ingredientsSection[1].trim() : 'No ingredients provided.';
    const instructions = instructionsSection ? instructionsSection[1].trim() : 'No instructions provided.';

    return {
      recipeID: crypto.randomUUID(),
      recipeName: recipeName,
      ingredients,
      instructions,
      rating: 3,
      difficulty: difficulty, // Store numeric difficulty
      cuisineType: cuisine,
      dietary: parseDietaryEnum(dietary),
      saved: true
    };
  };

  // Convert difficulty string to numeric value for DB storage
  function mapDifficultyToNumber(difficulty) {
    const difficultyMap = {
      'easy': 1,
      'medium': 2,
      'hard': 3
    };
    return difficultyMap[difficulty.toLowerCase()] ?? 1; // Default to 1 (Easy) if not found
  }

  // Convert numeric difficulty value back to text for display
  function getDifficultyText(difficulty) {
    const difficultyTextMap = {
      1: 'Easy',
      2: 'Medium',
      3: 'Hard'
    };
    return difficultyTextMap[difficulty] ?? 'Easy'; // Default to 'Easy' if invalid value
  }

  const formatRecipe = (recipeObj) => {
    const { recipeName, dietary, cuisineType, difficulty, ingredients, instructions } = recipeObj;

    // Convert numeric difficulty to text for display
    const difficultyText = getDifficultyText(difficulty);

    // Convert dietary enum value to text
    const dietaryText = getDietaryText(dietary);

    let ingredientsHTML = '';
    ingredients.split('\n').forEach((ingredient) => {
      if (ingredient.trim()) {
        ingredientsHTML += `<li>${ingredient.trim()}</li>`;
      }
    });

    let instructionsHTML = '';
    instructions.split('\n').forEach((instruction) => {
      if (instruction.trim()) {
        instructionsHTML += `<p>${instruction.trim()}</p>`;
      }
    });

    return `
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
    `;
  };

  function parseDietaryEnum(value) {
    const map = {
      'gluten-free and dairy-free': 0,
      'gluten-free': 1,
      'dairy-free': 2,
      'vegetarian': 4,
      'vegan': 5
    };
    return map[value.toLowerCase()] ?? 3;
  }

  function getDietaryText(dietaryEnum) {
    const map = {
      0: 'Gluten-free and dairy-free',
      1: 'Gluten-free',
      2: 'Dairy-free',
      4: 'Vegetarian',
      5: 'Vegan',
      3: 'Not specified'
    };
    return map[dietaryEnum] ?? 'Not specified';
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <Box className="chatbot-container">
      <Box className="chatbot-header">Recipe Assistant 👨‍🍳</Box>
      <Box className="chatbot-messages">
        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, index) => (
            <Box
              key={index}
              className={`chatbot-message ${msg.role}`}
            >
              <Paper className={`bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                {msg.role === 'assistant' ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                ) : (
                  msg.content
                )}
              </Paper>
            </Box>
          ))}
        <div ref={messageEndRef} />
      </Box>
      <Box className="chatbot-input">
        <TextField
          variant="outlined"
          placeholder="e.g., chicken, broccoli, garlic"
          fullWidth
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
      {parsedRecipe && (
        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              if (!parsedRecipe) {
                alert("No recipe to submit!");
                return;
              }

              const user = auth.currentUser;
              if (!user) {
                alert("You must be logged in to submit a recipe.");
                return;
              }

              const { uid, displayName, email } = user;
              
              await createOrUpdateUser(uid, displayName ?? 'Anonymous', email ?? 'unknown@example.com');
              await addRecipeToUser(uid, parsedRecipe);
              await addOrInitRecipeRating(parsedRecipe);
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
