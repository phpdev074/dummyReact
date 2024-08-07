import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

// Initialize Firebase app
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Function to initialize messaging
const initializeMessaging = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    } else {
      console.warn("This browser does not support Firebase messaging.");
      return null;
    }
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return null;
  }
};

// Initialize messaging
let messaging;
initializeMessaging().then((msg) => {
  messaging = msg;
});

// Fetch token function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    if (!messaging) {
      messaging = await initializeMessaging();
    }

    if (!messaging) {
      setTokenFound(false);
      return;
    }

    const currentToken = await getToken(messaging, { vapidKey: "" });
    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
      // Track the token -> client mapping, by sending to backend server
      // Show on the UI that permission is secured
    } else {
      setTokenFound(false);
      setFcmToken(null);
      // Show on the UI that permission is required
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    // Catch error while creating client token
  }
};

// Message listener
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      initializeMessaging().then((msg) => {
        if (msg) {
          onMessage(msg, (payload) => {
            resolve(payload);
          });
        } else {
          console.error("Messaging is not supported.");
        }
      });
    } else {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
