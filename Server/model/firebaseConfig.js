// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyDDp6K93UFL6kZu69prY9ZaPgO3QgNepes",
  authDomain: "produc-e30a9.firebaseapp.com",
  databaseURL: "https://produc-e30a9-default-rtdb.firebaseio.com",
  projectId: "produc-e30a9",
  storageBucket: "produc-e30a9.appspot.com",
  messagingSenderId: "427068550669",
  appId: "1:427068550669:web:344f001bd7a8feffdeef44",
  measurementId: "G-KEQKJRS6W9"
});

const db = admin.firestore();

module.exports = db;
