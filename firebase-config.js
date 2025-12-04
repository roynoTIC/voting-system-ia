// Configuration Firebase
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyA_WDd_zxF4peryVPGt-47IPPgzoQPpe1o",
    authDomain: "kiro-90012.firebaseapp.com",
    databaseURL: "https://kiro-90012-default-rtdb.firebaseio.com",
    projectId: "kiro-90012",
    storageBucket: "kiro-90012.firebasestorage.app",
    messagingSenderId: "799548301552",
    appId: "1:799548301552:web:788c557d98157e1585a235"
};

// Initialiser Firebase
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(FIREBASE_CONFIG);
        console.log('Firebase initialisé avec succès');
    } catch (error) {
        console.error('Erreur initialisation Firebase:', error);
    }
}
