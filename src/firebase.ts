import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD5newlEIQDmPxTzJKtbII6m0MGcUHdcF8",
    authDomain: "whatsapp-clone-b9e40.firebaseapp.com",
    projectId: "whatsapp-clone-b9e40",
    storageBucket: "whatsapp-clone-b9e40.appspot.com",
    messagingSenderId: "399901891959",
    appId: "1:399901891959:web:2179a3f2249c7e91669572"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage().ref("images");
const audioStorage = firebase.storage().ref("audios");
const createTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;

export {
    db,
    auth,
    provider,
    storage,
    audioStorage,
    createTimestamp,
    serverTimestamp,
};