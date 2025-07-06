// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

// ✅ Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const fetchSleepDataFromFirebase = async () => {
    const sleepRef = collection(db, "sleepData")
    const snapshot = await getDocs(sleepRef)

    const sleepData = snapshot.docs.map(doc => {
        const { time, hr, movement } = doc.data()
        return {
            time,
            hr: Number(hr),
            movement: Number(movement)
        }
    })

    return sleepData;
}
