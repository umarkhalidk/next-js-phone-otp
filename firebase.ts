// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKSMxe3jJ1TMOuBcdDZ78H8hlh4g14KaA",
    authDomain: "phone-otp-login-a98c0.firebaseapp.com",
    projectId: "phone-otp-login-a98c0",
    storageBucket: "phone-otp-login-a98c0.appspot.com",
    messagingSenderId: "689055173710",
    appId: "1:689055173710:web:2b0ba0a569957bebb2071f",
    measurementId: "G-JC0MPN7M84"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();  // Ensuring language settings are correct

export { auth };
