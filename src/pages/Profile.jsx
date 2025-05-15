import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './css/input.css';


const Profile = () => {
 const [displayName, setDisplayName] = useState("");
 const [dietaryRestrictions, setDietaryRestrictions] = useState("");
 const [shoppingList, setShoppingList] = useState("");
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
         setShoppingList(data.shoppingList || "");
         setPhotoURL(data.photoURL || "");
       }
     });
   }
 }, [user]);


 const handleImageChange = (e) => {
   if (e.target.files[0]) {
     setSelectedImage(e.target.files[0]);
   }
 };


 const handleSave = async () => {
   if (!user) return alert("You must be signed in to save your profile.");
   const userRef = doc(db, "users", user.uid);


   let updatedPhotoURL = photoURL;


   if (selectedImage) {
     const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);
     await uploadBytes(imageRef, selectedImage);
     updatedPhotoURL = await getDownloadURL(imageRef);
     setPhotoURL(updatedPhotoURL);
   }


   await setDoc(userRef, {
     displayName,
     dietaryRestrictions,
     shoppingList,
     photoURL: updatedPhotoURL
   });


   alert("Profile information saved!");
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
       {photoURL && <img src={photoURL} alt="Profile" className="w-32 h-32 object-cover rounded-full mb-2" />}
       <input type="file" accept="image/*" onChange={handleImageChange} />
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


     {/* Shopping List */}
     <section className="profile-section">
       <h2 className="section-title">Shopping List</h2>
       <textarea
         className="textarea"
         rows={4}
         value={shoppingList}
         onChange={(e) => setShoppingList(e.target.value)}
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


