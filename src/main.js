import "./scss/styles.scss";
import "./js/scroll-animations.js";
import "./js/nav.js";

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
import { initPushNotifications } from "./js/push-notifications.js";
const auth = getAuth(app);

function showToastNotification(
  message,
  icon = "🎯",
  bgColor = "linear-gradient(135deg, #ffcb05, #ffb300)"
) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; z-index: 10000;
    background: ${bgColor};
    color: #000; padding: 1.5rem 2rem; border-radius: 12px;
    box-shadow: 0 4px 15px rgba(255, 203, 5, 0.4);
    font-weight: bold; font-size: 1.1rem;
    animation: slideIn 0.5s ease-out;
    font-family: Arial, sans-serif;
  `;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.8rem;">
      <span style="font-size: 1.8rem;">${icon}</span>
      <div>${message}</div>
    </div>
  `;

  document.body.appendChild(toast);

  if (!document.querySelector("style[data-challenge-toast]")) {
    const style = document.createElement("style");
    style.setAttribute("data-challenge-toast", "true");
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(450px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = "slideIn 0.5s ease-out reverse";
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email, user.displayName);
    initPushNotifications(user).catch((error) => {
      console.warn("Push notifications initialization skipped", error);
    });
    const path = window.location.pathname;
    if (path.includes("index.html") || path === "/") {
      showToastNotification("NEW DAILY CHALLENGE!", "🎯");
    }
  } else {
    console.log("No user is signed in.");

    const path = window.location.pathname;
    if (path.includes("dashboard.html")) {
      window.location.href = "/index.html";
    }
  }
});

const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User logged in successfully");
        showToastNotification("NEW DAILY CHALLENGE!", "🎯");
        window.location.href = "/dashboard.html";
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        alert(error.message);
      });
  });
}

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

        return updateProfile(user, {
          displayName: `${name} (${username})`,
        });
      })
      .then(() => {
        console.log("✅ User signed up and profile updated!");
        window.location.href = "/dashboard.html";
      })
      .catch((error) => {
        console.error("❌ Error signing up:", error);
        alert(error.message);
      });
  });
}

const googleBtn = document.getElementById("googleSignIn");
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Google sign-in successful:", result.user.email);
        window.location.href = "/dashboard.html";
      })
      .catch((error) => {
        console.error("Error with Google sign-in:", error);
        alert(error.message);
      });
  });
}

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
