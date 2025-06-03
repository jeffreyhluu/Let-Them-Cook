import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './css/input.css';



const Profile = () => {
 const [displayName, setDisplayName] = useState("");
 const [dietaryRestrictions, setDietaryRestrictions] = useState("");
 const [currIngredients, setCurrIngredients] = useState("");
 const [photoURL, setPhotoURL] = useState("");
 const [selectedImage, setSelectedImage] = useState(null);


 const user = auth.currentUser;


 useEffect(() => {
   if (user) {
     const userRef = doc(db, "users", user.uid);
     getDoc(userRef).then((docSnap) => {
       if (docSnap.exists()) {
         const data = docSnap.data();
         setDisplayName(data.displayName || "");
         setDietaryRestrictions(data.dietaryRestrictions || "");
         setCurrIngredients(data.currIngredients || "");
         setPhotoURL(data.photoURL || "");
       }
     });
   }
 }, [user]);


 const handleImageChange = async (e) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (!user) {
      alert("You must be signed in to upload a profile photo.");
      return;
    }

    try {
      const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      setPhotoURL(url);
      setSelectedImage(null); 

      // Update Firestore immediately with new photoURL
      const firestoreUserRef = doc(db, "users", user.uid);
      const userCollectionRef = doc(db, "UsersCollection", user.uid);

      await setDoc(firestoreUserRef, { photoURL: url }, { merge: true });
      await setDoc(userCollectionRef, { userImage: url }, { merge: true });

      alert("Profile photo updated!");
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo. Please try again.");
    }
  }
};



 const handleSave = async () => {
  if (!user) return alert("You must be signed in to save your profile.");

  const firestoreUserRef = doc(db, "users", user.uid);
  const userCollectionRef = doc(db, "UsersCollection", user.uid);

  let updatedPhotoURL = photoURL;

  try {
    if (selectedImage) {
      const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(imageRef, selectedImage);
      updatedPhotoURL = await getDownloadURL(imageRef);
      setPhotoURL(updatedPhotoURL);
    }

    await setDoc(firestoreUserRef, {
      displayName,
      dietaryRestrictions,
      currIngredients,
      photoURL: updatedPhotoURL
    });

    await setDoc(userCollectionRef, {
      userImage: updatedPhotoURL,
      dietaryRestrictions,
      currentIngredients: currIngredients
    }, { merge: true });

    alert("Profile information saved!");
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("There was an error saving your profile. Please try again.");
  }
};




 return (
   <div className="max-w-3xl mx-auto p-6">
     <h1 className="text-3xl font-bold text-red-500 mb-6">User Profile</h1>


     {/* Profile Info */}
     <section className="profile-section">
       <h2 className="section-title">Profile Information</h2>
       <label className="label">Display Name</label>
       <input
         type="text"
         value={displayName}
         onChange={(e) => setDisplayName(e.target.value)}
         className="input"
         placeholder="Your name"
       />
     </section>


    {/* Profile Image */}
    <section className="profile-section mt-4">
      <h2 className="section-title">Profile Image</h2>

      {/* Current Profile Image Preview */}
      {photoURL && (
        <img
          src={photoURL}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full mb-2"
        />
      )}

      {/* Upload New Image */}
      <div className="mt-2">
        <label htmlFor="fileInput" className="custom-file-label">
          Choose a new image
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input-hidden"
        />
      </div>
    </section>




     {/* Dietary Restrictions */}
     <section className="profile-section">
       <h2 className="section-title">Dietary Restrictions</h2>
       <textarea
         className="textarea"
         rows={4}
         value={dietaryRestrictions}
         onChange={(e) => setDietaryRestrictions(e.target.value)}
         placeholder="E.g., vegetarian, gluten-free, nut allergy..."
       />
     </section>


     {/* Current Ingredients */}
     <section className="profile-section">
       <h2 className="section-title">Current Ingredients</h2>
       <textarea
         className="textarea"
         rows={4}
         value={currIngredients}
         onChange={(e) => setCurrIngredients(e.target.value)}
         placeholder="E.g., Milk, Eggs, Bread..."
       />
     </section>


     {/* Save Button */}
     <div className="save-btn-container mt-4">
       <button onClick={handleSave} className="save-btn">
         Save
       </button>
     </div>
   </div>
 );
};


export default Profile;


