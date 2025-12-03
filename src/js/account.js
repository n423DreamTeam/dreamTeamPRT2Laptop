import { app, db, auth, storage } from "../../firebase.js";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Unlock thresholds (same as dashboard.js logic)
const UNLOCK_THRESHOLDS = [
  { points: 120, label: "Premium Player 1" },
  { points: 150, label: "Premium Player 2" },
  { points: 200, label: "Elite Player" },
];

// Max allowed file size for profile images (bytes)
const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

async function compressImage(file, maxWidth = 1024, quality = 0.8) {
  if (!file || !file.type || !file.type.startsWith("image/")) return file;
  if (file.size <= MAX_PROFILE_IMAGE_SIZE) return file;

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return await new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) resolve(file);
        else resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

function initLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", async () => {
    try {
      const confirmed = window.confirm("Log out now?");
      if (!confirmed) return;
      await signOut(auth);
      localStorage.removeItem("dt_username");
      window.location.href = "./login.html";
    } catch (e) {
      console.error("Logout failed:", e);
      showToast("Logout failed. Please try again.", "error");
    }
  });
}

// Simple toast helper (global within this module)
function showToast(message, type = "info", ms = 3500) {
  const root = document.getElementById("toast-root");
  if (!root) {
    // fallback to alert if toast root missing
    alert(message);
    return;
  }
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = message;
  root.appendChild(t);
  // animate in
  requestAnimationFrame(() => {
    t.style.opacity = "1";
    t.style.transform = "translateY(0)";
  });
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    setTimeout(() => t.remove(), 300);
  }, ms);
}

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadAccountData(user);
      initProfileControls(user);
      initLogout();
    } else {
      window.location.href = "./login.html";
    }
  });
});

async function loadAccountData(user) {
  // Display user email
  document.getElementById("user-email").textContent = user.email;

  // Populate profile fields if present
  const displayInput = document.getElementById("display-name-input");
  const usernameInput = document.getElementById("username-input");
  const profileImg = document.getElementById("profile-img");
  const fullNameDisplay = document.getElementById("full-name-display");

  if (displayInput) displayInput.value = user.displayName || "";
  if (fullNameDisplay) fullNameDisplay.textContent = user.displayName || "";
  const emailInput = document.getElementById("email-input");
  if (emailInput) emailInput.value = user.email || "";

  // username: load from Firestore if present
  try {
    if (db && user && user.uid) {
      // Verify db is a valid Firestore instance
      if (typeof db === "object" && db !== null) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc && userDoc.exists()) {
          const data = userDoc.data();
          if (usernameInput) usernameInput.value = data.username || "";

          // Load profile photo from Firestore (base64 stored here)
          if (data.photoURL && profileImg) {
            profileImg.src = data.photoURL;
          }

          // show password last changed if available
          const pwdInfo = document.getElementById("password-info");
          if (pwdInfo) {
            if (data.passwordLastChanged && data.passwordLastChanged.toDate) {
              const d = data.passwordLastChanged.toDate();
              pwdInfo.textContent = `Password: •••••••• (last changed ${d.toLocaleString()})`;
            } else {
              pwdInfo.textContent = `Password: ••••••••`;
            }
          }
        } else {
          const storedUsername = localStorage.getItem("dt_username");
          if (usernameInput) usernameInput.value = storedUsername || "";
        }
      } else {
        throw new Error("Firestore database instance is invalid");
      }
    } else {
      // Firestore not available, use localStorage
      const storedUsername = localStorage.getItem("dt_username");
      if (usernameInput) usernameInput.value = storedUsername || "";
    }
  } catch (err) {
    // Surface the error to the user while keeping the fallback behavior
    console.error("Could not load username from Firestore:", err);
    // Silently fall back to localStorage without showing toast on every page load
    const storedUsername = localStorage.getItem("dt_username");
    if (usernameInput) usernameInput.value = storedUsername || "";
  }

  // Fallback: profile image from Firebase Auth if not in Firestore
  if (profileImg && !profileImg.src.includes("data:image")) {
    profileImg.src = user.photoURL || "./images/default-avatar.png";
  }

  // Load user progress from localStorage
  const PROGRESS_KEY = "dt_user_progress_v1";
  let userProgress = { points: 0, wins: 0 };

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) userProgress = JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load user progress:", e);
  }

  // Update stats
  document.getElementById("total-points").textContent = userProgress.points;
  document.getElementById("total-wins").textContent = userProgress.wins;

  // Count unlocked players
  const unlockedCount = UNLOCK_THRESHOLDS.filter(
    (t) => userProgress.points >= t.points
  ).length;
  document.getElementById("players-unlocked").textContent = unlockedCount;

  // Populate unlocks list
  populateUnlocks(userProgress.points);

  // Show next unlock progress
  showNextUnlockProgress(userProgress.points);
}

function populateUnlocks(currentPoints) {
  const list = document.getElementById("unlocks-list");
  list.innerHTML = "";

  if (UNLOCK_THRESHOLDS.length === 0) {
    list.innerHTML =
      '<div class="empty-message">No unlocks available yet.</div>';
    return;
  }

  UNLOCK_THRESHOLDS.forEach((unlock, idx) => {
    const isUnlocked = currentPoints >= unlock.points;
    const item = document.createElement("div");
    item.className = `unlock-item ${isUnlocked ? "unlocked" : ""}`;

    const icon = isUnlocked ? "🔓" : "🔒";
    const status = isUnlocked
      ? "Unlocked ✓"
      : `${unlock.points - currentPoints} points remaining`;

    item.innerHTML = `
      <div>
        <span style="font-size: 1.5rem; margin-right: 1rem;">${icon}</span>
        <span class="name">${unlock.label}</span>
      </div>
      <div class="status">${status}</div>
    `;

    list.appendChild(item);
  });
}

function showNextUnlockProgress(currentPoints) {
  // Find the next locked unlock
  const nextUnlock = UNLOCK_THRESHOLDS.find((t) => currentPoints < t.points);

  if (!nextUnlock) {
    // All unlocked
    document.getElementById("next-unlock-label").textContent =
      "🌟 All Premium Players Unlocked!";
    document.getElementById("next-unlock-fill").style.width = "100%";
    document.getElementById("next-unlock-text").textContent = "100%";
    return;
  }

  const progress = Math.round((currentPoints / nextUnlock.points) * 100);
  const remaining = nextUnlock.points - currentPoints;

  document.getElementById(
    "next-unlock-label"
  ).textContent = `${nextUnlock.label} - ${remaining} points remaining`;
  document.getElementById("next-unlock-fill").style.width = `${Math.min(
    progress,
    100
  )}%`;
  document.getElementById("next-unlock-text").textContent = `${progress}%`;
}

// Reset progress (with confirmation)
window.resetProgress = function () {
  if (
    confirm(
      "⚠️ Are you sure? This will reset all your progress. This cannot be undone."
    )
  ) {
    const PROGRESS_KEY = "dt_user_progress_v1";
    localStorage.removeItem(PROGRESS_KEY);
    showToast("✅ Progress reset. Reloading...", "success");
    location.reload();
  }
};

// Initialize profile controls: photo upload, save profile, change password
function initProfileControls(user) {
  const photoInput = document.getElementById("profile-photo-input");
  const profileImg = document.getElementById("profile-img");
  const saveBtn = document.getElementById("save-profile-btn");
  const savePhotoBtn = document.getElementById("save-photo-btn");
  const displayInput = document.getElementById("display-name-input");
  const usernameInput = document.getElementById("username-input");

  // upload progress UI state
  let progressEl = null;

  function createProgressBar() {
    if (progressEl) return progressEl;
    const container = document.createElement("div");
    container.className = "upload-progress-container";
    container.style.position = "relative";
    container.style.width = "160px";
    container.style.marginTop = "8px";

    const bar = document.createElement("div");
    bar.className = "upload-progress-bar";
    bar.style.width = "0%";
    bar.style.height = "8px";
    bar.style.background = "#ffd166";
    bar.style.borderRadius = "4px";
    bar.style.transition = "width 200ms linear";

    container.appendChild(bar);
    // attach just under the avatar image
    if (profileImg && profileImg.parentNode) {
      profileImg.parentNode.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    progressEl = { container, bar };
    return progressEl;
  }

  function updateProgress(pct) {
    const el = createProgressBar();
    el.bar.style.width = Math.min(100, Math.max(0, Math.round(pct))) + "%";
    if (pct >= 100) {
      setTimeout(() => {
        try {
          el.container.remove();
        } catch (e) {}
        progressEl = null;
      }, 600);
    }
  }

  if (photoInput) {
    photoInput.addEventListener("change", async (e) => {
      let file = e.target.files && e.target.files[0];
      if (!file) return;

      // Show preview locally
      const reader = new FileReader();
      reader.onload = (event) => {
        if (profileImg) profileImg.src = event.target.result;
        // Store the actual file object for later upload
        photoInput.dataset.pendingFile = "true";
        photoInput._fileToUpload = file;
        // Show the save photo button
        if (savePhotoBtn) savePhotoBtn.style.display = "inline-flex";
        showToast("Photo ready. Click 'Save Photo' to upload.", "success");
      };
      reader.readAsDataURL(file);
    });
  }

  // Save photo button handler
  if (savePhotoBtn) {
    savePhotoBtn.addEventListener("click", async () => {
      if (!photoInput || !photoInput._fileToUpload) {
        showToast("No photo selected.", "error");
        return;
      }

      try {
        showToast("Saving photo...", "info", 2000);
        const file = photoInput._fileToUpload;

        // Compress if needed
        const compressedFile = await compressImage(file);

        // Create a Blob if compressImage returned a Blob
        const uploadFile =
          compressedFile instanceof Blob
            ? new File([compressedFile], file.name, {
                type: compressedFile.type || "image/jpeg",
              })
            : compressedFile;

        let photoURL;
        let usedFallback = false;

        // For now, skip Firebase Storage and use base64 directly (CORS workaround)
        console.log("Converting image to base64 (CORS workaround)...");
        photoURL = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(uploadFile);
        });
        usedFallback = true;

        // Update preview
        if (profileImg) profileImg.src = photoURL;

        // Save to Firestore ONLY (base64 is too large for Auth photoURL)
        if (db) {
          try {
            await setDoc(
              doc(db, "users", user.uid),
              {
                photoURL: photoURL,
                photoType: "base64",
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (firestoreErr) {
            console.error("Could not update Firestore:", firestoreErr);
            showToast("Failed to save photo to database.", "error");
            return;
          }
        } else {
          showToast("Database not available.", "error");
          return;
        }

        // Clear pending file and hide button
        delete photoInput._fileToUpload;
        delete photoInput.dataset.pendingFile;
        savePhotoBtn.style.display = "none";

        showToast("Photo saved successfully!", "success");
      } catch (err) {
        console.error("Photo save failed:", err);
        showToast(
          "Failed to save photo: " + (err.message || "Unknown error"),
          "error"
        );
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const newDisplay = displayInput ? displayInput.value.trim() : "";
      const newUsername = usernameInput ? usernameInput.value.trim() : "";
      const emailInput = document.getElementById("email-input");
      const newEmail = emailInput ? emailInput.value.trim() : user.email;

      try {
        // update Firebase displayName only (photo has separate save button)
        await updateProfile(user, {
          displayName: newDisplay || user.displayName,
        });

        // Reload user to get updated photoURL
        await user.reload();

        // store username and photoURL in Firestore under users/{uid}
        const userData = {
          username: newUsername,
          displayName: newDisplay || user.displayName,
          email: user.email,
        };

        // Include photoURL if it exists
        if (user.photoURL) {
          userData.photoURL = user.photoURL;
        }

        try {
          if (db) {
            await setDoc(doc(db, "users", user.uid), userData, { merge: true });
          } else {
            throw new Error("Firestore not available");
          }
          showToast("Profile updated successfully.", "success");
        } catch (err) {
          console.warn("Could not save to Firestore:", err);
          if (newUsername) localStorage.setItem("dt_username", newUsername);
          showToast("Profile updated locally (server sync failed).", "warning");
        }

        document.getElementById("user-email").textContent = user.email;
        document.getElementById("full-name-display").textContent =
          newDisplay || "";
      } catch (err) {
        console.error("Error updating profile:", err);
        showToast(err.message || "Could not update profile.", "error");
      }
    });
  }
  // Change password flow
  const changePassBtn = document.getElementById("change-password-btn");
  if (changePassBtn) {
    // If account is not password-based, disable password change
    const isPasswordProvider =
      user.providerData &&
      user.providerData.some((p) => p.providerId === "password");
    const currentPassInput = document.getElementById("current-password");
    if (!isPasswordProvider) {
      changePassBtn.disabled = true;
      changePassBtn.title = "Password managed by provider; cannot change here.";
      if (currentPassInput) currentPassInput.disabled = true;
    }
    changePassBtn.addEventListener("click", async () => {
      const current = document.getElementById("current-password").value;
      const next = document.getElementById("new-password").value;
      const confirm = document.getElementById("confirm-new-password").value;

      if (!current || !next) {
        showToast("Please fill current and new password fields.", "error");
        return;
      }
      if (next.length < 6) {
        showToast("New password must be at least 6 characters.", "error");
        return;
      }
      if (next !== confirm) {
        showToast("New password and confirmation do not match.", "error");
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, current);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, next);
        // record password change time in Firestore for this user
        try {
          await setDoc(
            doc(db, "users", user.uid),
            { passwordLastChanged: serverTimestamp() },
            { merge: true }
          );
        } catch (err) {
          console.warn("Could not record password change time:", err);
        }
        showToast("Password changed successfully.", "success");
        // clear inputs
        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("confirm-new-password").value = "";
      } catch (err) {
        console.error("Password change error:", err);
        showToast(
          err.message ||
            "Could not change password. Make sure current password is correct.",
          "error"
        );
      }
    });
  }
}
