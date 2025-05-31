import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  TextField, Button, Box, Paper, CircularProgress,
  Modal, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addRecipeToUser, addOrInitRecipeRating, createOrUpdateUser, getAllUserRecipes, userHasRecipe, copyRecipeToUser, getUserIDByRecipeID } from '../firestoreHelpers';
import { auth, db, storage } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import './Chatbot.css';
import NearestGroceryStore from '../pages/NearestGroceryStore';

const Chatbot = () => {
  const [userName, setUserName] = useState('');
  const [userDietary, setUserDietary] = useState('');
  const [currIngredients, setCurrIngredients] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef();
  const [parsedRecipe, setParsedRecipe] = useState(null);
  const [matchedExistingRecipe, setMatchedExistingRecipe] = useState(null);
  const [oldIdentification, setOldIdentification] = useState(null);

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
          const ingredients = data.currIngredients;
          if (Array.isArray(ingredients)) {
            setCurrIngredients(ingredients);
          } else if (typeof ingredients === 'string') {
            setCurrIngredients(ingredients.split(',').map(i => i.trim()).filter(Boolean));
          } else {
            setCurrIngredients([]);   
          }
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

  useEffect(() => {
    if (!userName) return;
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

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  // Attempting to find similar recipe  
  async function checkForSimilarRecipe(userPrompt) {
    const allRecipes = await getAllUserRecipes();
    const summaries = allRecipes.map(recipe => ({
      recipeID: recipe.recipeID,
      summary: recipe.recipeSummary || `${recipe.recipeName}: ${recipe.ingredients}`,
    }));
  
    const similarityPrompt = `
  You're an assistant that compares a user's ingredient prompt to a list of existing recipes.
  Return only the recipeID of the most similar recipe (with just the number, no surrounding text), or "none" if no similar match is found. Here is an example for 
  what counts as a similar recipe: if a recipeName has eggs and spinach and the user inputs just eggs, the recipe should not be similar. 
  However, if a recipe has strawberry and cream, and the user inputs strawberry and cream, the recipe should be similar. If a recipe has strawberry, then 
  input of completely different fruits should not be similar.

  
  User Input:
  ${userPrompt}
  
  Existing Recipes:
  ${JSON.stringify(summaries, null, 2)}
    `.trim();
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: similarityPrompt }],
          temperature: 0.3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
  
      const result = response.data.choices?.[0]?.message?.content?.trim();
      return result && result !== "none" ? result : null;
  
    } catch (error) {
      console.error("Similarity check error:", error);
      return null;
    }
  }
  
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const similarID = await checkForSimilarRecipe(input);
      console.log("Similar ID: " + similarID);
      if (similarID) {
        const allRecipes = await getAllUserRecipes();
        const matchedRecipe = allRecipes.find(r => r.recipeID === similarID); // Double check step to make sure OpenAI did not hallucinate
        console.log("Matched recipe: " + matchedRecipe);
        if (matchedRecipe) {
          console.log("Matched recipe: " + matchedRecipe);
          const currentUser = auth.currentUser;
          if (currentUser) {
            const hasRecipe = await userHasRecipe(currentUser.uid, similarID);
            if (hasRecipe) {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `You already saved a similar recipe called "${matchedRecipe.recipeName}"!`,
              }]);
              setMatchedExistingRecipe(null);
              setParsedRecipe(null);
            } else {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Here's a recipe I found that's very similar from another user:\n\n${matchedRecipe.recipeName}. Click "Save This Recipe" to save it on your explore page too!`,
              }]);
              setMatchedExistingRecipe(matchedRecipe);
              setParsedRecipe(null);
              const oldID = await getUserIDByRecipeID(similarID);
              setOldIdentification(oldID);
            }
            setLoading(false);
            return;
          } else {
            console.error("User not being identified");
          }
        }
      }

      const payloadMessages = [
        messages.find(m => m.role === 'system'), 
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

      const responseText = response.data.choices[0].message.content;

      if (!isRecipe(responseText)) {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I couldn’t format this as a full recipe. Try again!' }]);
        return;
      }

      const recipeObj = extractRecipeData(responseText);
      setParsedRecipe(recipeObj);
      setMatchedExistingRecipe(null);
      const formattedHTML = await formatRecipeWithRealLink(recipeObj);
      setMessages([...newMessages, { role: 'assistant', content: formattedHTML }]);

    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I had a problem fetching a recipe. Try again!' }]);
    } finally {
      setLoading(false);
    }
  }

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

  const getMissingIngredients = async () => {
    if (!parsedRecipe || !currIngredients) return [];
    const recipeIngs = parsedRecipe.ingredients.split('\n').map(ing => ing.trim().toLowerCase()).filter(Boolean);
    const userIngs = currIngredients.map(ing => ing.toLowerCase());
    const missing = recipeIngs.filter(ing => !userIngs.includes(ing));
    if (missing.length === 0) return [];

    const prompt = `Provide a price estimate in USD for each of these ingredients:\n${missing.join('\n')}`;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You provide estimated average prices in USD for grocery items.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const gptReply = response.data.choices[0].message.content;

      const prices = missing.map(ing => {
        const regex = new RegExp(`${ing}[:\\s]*\\$?(\\d+(\\.\\d{1,2})?)`, 'i');
        const match = gptReply.match(regex);
        return {
          ingredient: ing,
          price: match ? parseFloat(match[1]) : null,
        };
      });

      return prices;
    } catch (error) {
      console.error('Failed to fetch ingredient prices:', error);
      return missing.map(ing => ({ ingredient: ing, price: null }));
    }
  };

  const generateAndStoreImage = async (prompt, recipeID) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          prompt,
          n: 1,
          size: '512x512',
          response_format: 'b64_json',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const b64Image = response.data.data[0].b64_json;
      const storageRef = ref(storage, `recipeImages/${recipeID}.png`);
      await uploadString(storageRef, b64Image, 'base64');
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Failed to generate/store image:', error);
      return null;
    }
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
            ? `<p><strong>If you would like a different recipe with similar ingredients, check out this link: <a href="${recipeLink}" target="_blank">${recipeLink}</a></strong><br /><em>(Note: This recipe may not include all the ingredients you provided.)</em></p>`
            : '<p><strong>No real recipe link found for this dish.</strong></p>'
        }
      </div>
    `;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    const fetchMissingIngredients = async () => {
      const prices = await getMissingIngredients();
      setMissingIngredients(prices);
    };
    fetchMissingIngredients();
  }, [parsedRecipe, currIngredients]);

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
              {msg.role === 'assistant'
                ? <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                : msg.content}
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
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper style={{ position: 'relative', width: '90%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', padding: 20 }}>
          <IconButton
            onClick={() => setModalOpen(false)}
            style={{ position: 'absolute', top: 8, right: 8 }}
            aria-label="close"
            size="large"
          >
            <CloseIcon />
          </IconButton>
          <Typography id="nearest-grocery-modal-title" variant="h6" gutterBottom>
            Nearest Grocery Stores
          </Typography>
          <NearestGroceryStore missingIngredients={missingIngredients} />
        </Paper>
      </Modal>

      <Box mt={2} textAlign="center">
        {matchedExistingRecipe && (
          <Button
            variant="outlined"
            color="primary"
            className="save-existing-button"
            onClick={async () => {
              const currentUser = auth.currentUser;
              if (currentUser) {
                const userRef = doc(db, 'UsersCollection', currentUser.uid);
                console.log("Old ID: " + oldIdentification);
                await copyRecipeToUser(oldIdentification, currentUser.uid, matchedExistingRecipe.recipeID);
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: `Recipe "${matchedExistingRecipe.recipeName}" has been saved to your Explore page!`
                }]);
                setMatchedExistingRecipe(null);
              }
            }}
          >
            Save this recipe
          </Button>
        )}

        {parsedRecipe && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                setLoading(true);
                try {
                  const user = auth.currentUser;
                  if (!user) return alert("You must be logged in to submit a recipe.");
                  const { uid, displayName, email } = user;
                  await createOrUpdateUser(uid, displayName ?? 'Anonymous', email ?? 'unknown@example.com');
                  const prompt = `A top-down photo of a delicious dish called ${parsedRecipe.recipeName}.`;
                  const imageURL = await generateAndStoreImage(prompt, parsedRecipe.recipeID);
                  const recipeWithImage = { ...parsedRecipe, imageURL: imageURL ?? '' };
                  await addRecipeToUser(uid, recipeWithImage);
                  await addOrInitRecipeRating(recipeWithImage);
                  alert('Recipe saved!');
                } catch (err) {
                  console.error("Submission failed", err);
                  alert("There was an error submitting the recipe.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Recipe"}
            </Button>
          </>
        )}
      </Box>
      
    </Box>
  );
};

export default Chatbot;
