// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD2_VwK55RofFoK2sPExa624GextmqXijs",
    authDomain: "devcove-b1ffb.firebaseapp.com",
    projectId: "devcove-b1ffb",
    storageBucket: "devcove-b1ffb.appspot.com",
    messagingSenderId: "657674358098",
    appId: "1:657674358098:web:3670286f7e19220099fe8b",
    measurementId: "G-1B35MTG83S"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Create an instance of the authentication service
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export { firebaseApp, auth, firestore,collection, addDoc, getDocs, storage };