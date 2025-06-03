import React from "react";


import {
    getUserData,
    createOrUpdateUser,
    addRecipeToUser,
    addOrInitRecipeRating,
    updateRecipeRatingForUser
  } from '../firestoreHelpers.js';

  import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
  } from 'firebase/firestore';

  jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    arrayUnion: jest.fn((recipe) => recipe),
  }));

  jest.mock('../firebase', () => ({
    db: {}
  }));

  const mockDocRef = {};

  beforeEach(() => {
    jest.clearAllMocks();
    doc.mockReturnValue(mockDocRef);
  });

  // getUserData method test
  test('getUserData returns user data when document exists', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Test User' })
    });

    const result = await getUserData('123');
    expect(result).toEqual({ name: 'Test User' });
  });

  test('getUserData returns null when document does not exist', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });

    const result = await getUserData('123');
    expect(result).toBeNull();
  });

  // createOrUpdateUser method test
  test('createOrUpdateUser creates a new user if not exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    await createOrUpdateUser('123', 'Jeff', 'jeff@example.com');

    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      name: 'Jeff',
      email: 'jeff@example.com',
      recipes: []
    });
  });

  test('createOrUpdateUser updates existing user and retains recipes', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        name: 'Old',
        email: 'old@example.com',
        recipes: ['r1']
      })
    });

    await createOrUpdateUser('123', null, 'new@example.com');

    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      name: 'Old',
      email: 'new@example.com',
      recipes: ['r1']
    });
  });

  // addRecipeToUser method test
  test('addRecipeToUser creates user with recipe if not exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const recipe = { name: 'Torta', email: 'cook@example.com' };
    await addRecipeToUser('123', recipe);

    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      name: 'Torta',
      email: 'cook@example.com',
      recipes: [recipe]
    });
  });

  test('addRecipeToUser appends recipe to existing user', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true });

    const recipe = { name: 'Burger', recipeID: 'r456' };
    await addRecipeToUser('123', recipe);

    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      recipes: recipe
    });
  });

  // addOrInitRecipeRating method test
  test('addOrInitRecipeRating initializes new rating document if not exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const recipe = { recipeID: 'r789', recipeName: 'Salad' };
    await addOrInitRecipeRating(recipe);

    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      recipeID: 'r789',
      recipeName: 'Salad',
      averageRating: null
    });
  });

  test('addOrInitRecipeRating does nothing if rating document exists', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true });

    const recipe = { recipeID: 'r789' };
    await addOrInitRecipeRating(recipe);

    expect(setDoc).not.toHaveBeenCalled();
  });