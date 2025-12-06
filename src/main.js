import "./scss/styles.scss";
import "./js/scroll-animations.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "../firebase.js";
// Use shared Firebase app instance
const auth = getAuth(app);

// Track login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email, user.displayName);
    // Removed auto-redirect from login/signup so user can choose to switch accounts.
  } else {
    console.log("No user is signed in.");

    // Optional redirect if user logs out and tries to access dashboard
    const path = window.location.pathname;
    if (path.includes("dashboard.html")) {
      window.location.href = "/index.html";
    }
  }
});

// ✅ LOGIN
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User logged in successfully");
        alert("🎯 NEW DAILY CHALLENGE!");
        window.location.href = "/src/dashboard.html"; // redirect after login
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert(error.message);
      });
  });
}

// ✅ SIGNUP
const signupBtn = document.getElementById("signup-btn");
if (signupBtn) {
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("fName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Use your name + username as the Firebase display name
        return updateProfile(user, {
          displayName: `${name} (${username})`,
        });
      })
      .then(() => {
        console.log("✅ User signed up and profile updated!");
        window.location.href = "/src/dashboard.html";
      })
      .catch((error) => {
        console.error("❌ Error signing up:", error);
        alert(error.message);
      });
  });
}

// ✅ GOOGLE SIGN-IN
const googleBtn = document.getElementById("googleSignIn");
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Google sign-in successful:", result.user.email);
        window.location.href = "/src/dashboard.html";
      })
      .catch((error) => {
        console.error("Error with Google sign-in:", error);
        alert(error.message);
      });
  });
}

// ✅ SIGN OUT
const signOutBtn = document.getElementById("signOut");
if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        window.location.href = "/index.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
}

// ✅ FORGOT PASSWORD
const forgotLink = document.querySelector(".forgot-link");
const forgotModal = document.getElementById("forgot-password-modal");
const closeModal = document.querySelector(".close-modal");
const forgotPasswordForm = document.getElementById("forgot-password-form");

if (forgotLink && forgotModal) {
  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    forgotModal.style.display = "flex";
  });
}

if (closeModal && forgotModal) {
  closeModal.addEventListener("click", () => {
    forgotModal.style.display = "none";
    document.getElementById("reset-message").textContent = "";
  });
}

// Close modal when clicking outside
if (forgotModal) {
  forgotModal.addEventListener("click", (e) => {
    if (e.target === forgotModal) {
      forgotModal.style.display = "none";
      document.getElementById("reset-message").textContent = "";
    }
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("reset-email").value;
    const messageDiv = document.getElementById("reset-message");

    console.log("Attempting to send password reset email to:", email);
    messageDiv.textContent = "Sending...";
    messageDiv.style.color = "#ffc107";

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("✅ Password reset email sent successfully to:", email);
        messageDiv.textContent =
          "Password reset email sent! Check your inbox (and spam folder).";
        messageDiv.style.color = "#4CAF50";
        document.getElementById("reset-email").value = "";
        setTimeout(() => {
          forgotModal.style.display = "none";
          messageDiv.textContent = "";
        }, 5000);
      })
      .catch((error) => {
        console.error("❌ Error sending password reset email:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        // More user-friendly error messages
        let userMessage = error.message;
        if (error.code === "auth/user-not-found") {
          userMessage = "No account found with this email address.";
        } else if (error.code === "auth/invalid-email") {
          userMessage = "Please enter a valid email address.";
        }

        messageDiv.textContent = userMessage;
        messageDiv.style.color = "#f44336";
      });
  });
}
