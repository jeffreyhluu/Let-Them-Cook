import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Paper, CircularProgress } from '@mui/material';
import { Chat } from '@mui/icons-material';
import './Chatbot.css';  // Import the external CSS file

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
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
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

      // Check if it's a recipe and format accordingly
      const formattedResponse = isRecipe(responseText) ? formatRecipe(responseText) : responseText;

      // Add formatted response message
      setMessages([...newMessages, { role: 'assistant', content: formattedResponse }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I had a problem fetching a recipe. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  // Check if the response contains ingredients and instructions (simple validation)
  const isRecipe = (responseText) => {
    return responseText.includes('Ingredients:') && responseText.includes('Instructions:');
  };

  const formatRecipe = (recipeText) => {
    // If the response already contains HTML, assume it's already formatted
    const isHTML = /<\/?[a-z][\s\S]*>/i.test(recipeText);
    if (isHTML) {
      return recipeText;
    }
  
    // If it's plain text, parse it as before
    const metadataMatch = recipeText.match(
      /Metadata:\s*Name:\s*(.+?)\s*Dietary:\s*(.+?)\s*Cuisine:\s*(.+?)\s*Difficulty:\s*(.+?)\s*(?:\n|$)/i
    );
  
    let recipeName = 'Not specified';
    let dietary = 'Not specified';
    let cuisine = 'Not specified';
    let difficulty = 'Not specified';
  
    if (metadataMatch) {
      recipeName = metadataMatch[1].trim();
      dietary = metadataMatch[2].trim();
      cuisine = metadataMatch[3].trim();
      difficulty = metadataMatch[4].trim();
    }
  
    const ingredientsSection = recipeText.match(/Ingredients:([\s\S]*?)Instructions:/);
    const instructionsSection = recipeText.match(/Instructions:([\s\S]*)/);
  
    const ingredients = ingredientsSection ? ingredientsSection[1].trim() : 'No ingredients provided.';
    const instructions = instructionsSection ? instructionsSection[1].trim() : 'No instructions provided.';
  
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
        <li><strong>Dietary:</strong> ${dietary}</li>
        <li><strong>Cuisine:</strong> ${cuisine}</li>
        <li><strong>Difficulty:</strong> ${difficulty}</li>
      </ul>
      <h3>Ingredients:</h3>
      <ul>${ingredientsHTML}</ul>
      <h3>Instructions:</h3>
      ${instructionsHTML}
    `;
  };
  
  
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
    </Box>
  );
};

export default Chatbot;
