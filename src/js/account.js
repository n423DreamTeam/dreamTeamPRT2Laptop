import { app, db, auth, storage } from "../../firebase.js";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UNLOCK_THRESHOLDS = [
  { points: 120, label: "Premium Player 1" },
  { points: 150, label: "Premium Player 2" },
  { points: 200, label: "Elite Player" },
];

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;

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
  console.log("initLogout called, button found:", !!logoutBtn);
  if (!logoutBtn) {
    console.error("Logout button not found in DOM");
    return;
  }
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      console.log("Logout button clicked");

      const confirmed = await showConfirmModal(
        "Log Out",
        "Are you sure you want to log out?"
      );

      if (!confirmed) {
        console.log("Logout cancelled by user");
        return;
      }
      console.log("Signing out...");
      await signOut(auth);
      localStorage.removeItem("dt_username");
      console.log("Sign out successful, redirecting...");
      window.location.href = "./login.html";
    } catch (e) {
      console.error("Logout failed:", e);
      showToast("Logout failed. Please try again.", "error");
    }
  });
  console.log("Logout button event listener attached");
}

function showConfirmModal(title, message) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7); display: flex;
      justify-content: center; align-items: center; z-index: 10000;
    `;

    const popup = document.createElement("div");
    popup.style.cssText = `
      background: linear-gradient(135deg, #5b7fff, #3f4dd3);
      border: 2px solid #ffcb05; border-radius: 20px;
      padding: 2.5rem; text-align: center; max-width: 400px; width: 90%;
      box-shadow: 0 0 30px rgba(91, 127, 255, 0.6);
      color: white; font-family: Arial, sans-serif;
    `;

    popup.innerHTML = `
      <h2 style="font-size: 1.8rem; margin: 0 0 1rem 0; color: #ffcb05;">${title}</h2>
      <p style="font-size: 1.1rem; margin: 1rem 0; color: rgba(255,255,255,0.9);">${message}</p>
      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
        <button id="confirm-yes" style="
          background: linear-gradient(135deg, #ffcb05, #ffb300);
          color: #000; border: none; border-radius: 10px;
          padding: 0.75rem 2rem; font-weight: bold; font-size: 1rem;
          cursor: pointer; transition: 0.3s ease;
        ">Yes</button>
        <button id="confirm-no" style="
          background: rgba(255,255,255,0.2); color: #fff;
          border: 2px solid rgba(255,255,255,0.5); border-radius: 10px;
          padding: 0.75rem 2rem; font-weight: bold; font-size: 1rem;
          cursor: pointer; transition: 0.3s ease;
        ">Cancel</button>
      </div>
    `;

    modal.appendChild(popup);
    document.body.appendChild(modal);

    const yesBtn = popup.querySelector("#confirm-yes");
    const noBtn = popup.querySelector("#confirm-no");

    yesBtn.addEventListener("mouseenter", () => {
      yesBtn.style.transform = "scale(1.05)";
      yesBtn.style.boxShadow = "0 0 20px rgba(255, 203, 5, 0.8)";
    });
    yesBtn.addEventListener("mouseleave", () => {
      yesBtn.style.transform = "scale(1)";
      yesBtn.style.boxShadow = "none";
    });

    noBtn.addEventListener("mouseenter", () => {
      noBtn.style.transform = "scale(1.05)";
    });
    noBtn.addEventListener("mouseleave", () => {
      noBtn.style.transform = "scale(1)";
    });

    yesBtn.addEventListener("click", () => {
      modal.remove();
      resolve(true);
    });

    noBtn.addEventListener("click", () => {
      modal.remove();
      resolve(false);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(false);
      }
    });
  });
}

function showDeleteConfirmModal() {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7); display: flex;
      justify-content: center; align-items: center; z-index: 10000;
    `;

    const popup = document.createElement("div");
    popup.style.cssText = `
      background: #0f172a;
      border: 2px solid #ff4d4f; border-radius: 16px;
      padding: 2rem; text-align: center; max-width: 420px; width: 92%;
      box-shadow: 0 0 30px rgba(255, 77, 79, 0.35);
      color: #fff; font-family: Arial, sans-serif;
    `;

    popup.innerHTML = `
      <h2 style="font-size: 1.6rem; margin: 0 0 0.5rem 0; color: #ffcb05;">Delete Account</h2>
      <p style="margin: 0.25rem 0; color: rgba(255,255,255,0.9);">This will delete:</p>
      <ul style="text-align: left; margin: 0.5rem 0 1rem 1.2rem; color: rgba(255,255,255,0.9); line-height: 1.4;">
        <li>Your login and profile</li>
        <li>Stored progress and points</li>
        <li>Local saved progress on this device</li>
      </ul>
      <p style="margin: 0.25rem 0 0.5rem 0; color: #f8caca; font-weight: bold;">Type DELETE to confirm.</p>
      <input id="delete-confirm-input" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #334155; background: #1e293b; color: #fff;" placeholder="DELETE" />
      <div id="delete-error" style="color: #ff4d4f; min-height: 1.2rem; margin-top: 0.5rem; font-size: 0.9rem;"></div>
      <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: center;">
        <button id="delete-confirm-btn" style="
          background: linear-gradient(135deg, #ff4d4f, #ff7a7c);
          color: #000; border: none; border-radius: 10px;
          padding: 0.75rem 1.5rem; font-weight: bold; font-size: 1rem;
          cursor: pointer; transition: 0.2s ease; opacity: 0.5; pointer-events: none;
        ">Delete</button>
        <button id="delete-cancel-btn" style="
          background: rgba(255,255,255,0.12); color: #fff;
          border: 1px solid rgba(255,255,255,0.25); border-radius: 10px;
          padding: 0.75rem 1.5rem; font-weight: bold; font-size: 1rem;
          cursor: pointer; transition: 0.2s ease;
        ">Cancel</button>
      </div>
    `;

    modal.appendChild(popup);
    document.body.appendChild(modal);

    const input = popup.querySelector("#delete-confirm-input");
    const error = popup.querySelector("#delete-error");
    const confirmBtn = popup.querySelector("#delete-confirm-btn");
    const cancelBtn = popup.querySelector("#delete-cancel-btn");

    function teardown(result) {
      modal.remove();
      resolve(result);
    }

    input.addEventListener("input", () => {
      const ok = input.value.trim().toUpperCase() === "DELETE";
      confirmBtn.style.opacity = ok ? "1" : "0.5";
      confirmBtn.style.pointerEvents = ok ? "auto" : "none";
      error.textContent = ok ? "" : "Enter DELETE to continue.";
    });

    confirmBtn.addEventListener("click", () => teardown(true));
    cancelBtn.addEventListener("click", () => teardown(false));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) teardown(false);
    });

    input.focus();
  });
}

function showToast(message, type = "info", ms = 3500) {
  const root = document.getElementById("toast-root");
  if (!root) {
    alert(message);
    return;
  }
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = message;
  root.appendChild(t);
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
      initDeleteAccount(user);
    } else {
      window.location.href = "./login.html";
    }
  });
});

async function ensureRecentLogin(user) {
  const isPasswordProvider =
    user.providerData &&
    user.providerData.some((p) => p.providerId === "password");

  if (!isPasswordProvider) return;

  const pwd = prompt("Re-enter your password to delete your account:");
  if (pwd === null) {
    throw new Error("cancelled");
  }
  if (!pwd.trim()) {
    throw new Error("Password is required for deletion.");
  }

  const credential = EmailAuthProvider.credential(user.email, pwd.trim());
  await reauthenticateWithCredential(user, credential);
}

function initDeleteAccount(user) {
  const btn = document.getElementById("delete-account-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const confirmed = await showDeleteConfirmModal();

    if (!confirmed) return;

    try {
      showToast("Deleting account...", "info", 4000);

      try {
        await ensureRecentLogin(user);
      } catch (reauthErr) {
        if (reauthErr.message === "cancelled") {
          showToast("Account deletion cancelled.", "warning", 2000);
          return;
        }
        throw reauthErr;
      }

      try {
        await deleteDoc(doc(db, "users", user.uid));
      } catch (err) {
        console.warn("Could not delete user profile doc:", err);
      }

      await deleteUser(user);

      localStorage.removeItem("dt_username");
      localStorage.removeItem("dt_user_progress_v1");

      showToast("Account deleted. Redirecting...", "success", 2500);
      setTimeout(() => {
        window.location.href = "./signup.html";
      }, 1200);
    } catch (err) {
      console.error("Account deletion failed:", err);
      if (err && err.code === "auth/requires-recent-login") {
        showToast(
          "Please log in again and retry account deletion.",
          "error",
          4000
        );
      } else {
        showToast(
          err.message || "Account deletion failed. Please try again.",
          "error",
          4000
        );
      }
    }
  });
}

async function loadAccountData(user) {
  document.getElementById("user-email").textContent = user.email;

  const displayInput = document.getElementById("display-name-input");
  const usernameInput = document.getElementById("username-input");
  const profileImg = document.getElementById("profile-img");
  const fullNameDisplay = document.getElementById("full-name-display");

  if (displayInput) displayInput.value = user.displayName || "";
  if (fullNameDisplay) fullNameDisplay.textContent = user.displayName || "";
  const emailInput = document.getElementById("email-input");
  if (emailInput) emailInput.value = user.email || "";

  try {
    if (db && user && user.uid) {
      if (typeof db === "object" && db !== null) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc && userDoc.exists()) {
          const data = userDoc.data();
          if (usernameInput) usernameInput.value = data.username || "";

          if (data.photoURL && profileImg) {
            profileImg.src = data.photoURL;
          }

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
      const storedUsername = localStorage.getItem("dt_username");
      if (usernameInput) usernameInput.value = storedUsername || "";
    }
  } catch (err) {
    console.error("Could not load username from Firestore:", err);
    const storedUsername = localStorage.getItem("dt_username");
    if (usernameInput) usernameInput.value = storedUsername || "";
  }

  if (profileImg && !profileImg.src.includes("data:image")) {
    profileImg.src = user.photoURL || "./images/default-avatar.png";
  }

  const PROGRESS_KEY = "dt_user_progress_v1";
  let userProgress = { points: 0, wins: 0 };

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) userProgress = JSON.parse(raw);
  } catch (e) {
    console.warn("Could not load user progress:", e);
  }

  document.getElementById("total-points").textContent = userProgress.points;
  document.getElementById("total-wins").textContent = userProgress.wins;

  const unlockedCount = UNLOCK_THRESHOLDS.filter(
    (t) => userProgress.points >= t.points
  ).length;
  document.getElementById("players-unlocked").textContent = unlockedCount;

  populateUnlocks(userProgress.points);

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
  const nextUnlock = UNLOCK_THRESHOLDS.find((t) => currentPoints < t.points);

  if (!nextUnlock) {
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

function initProfileControls(user) {
  const photoInput = document.getElementById("profile-photo-input");
  const profileImg = document.getElementById("profile-img");
  const savePhotoBtn = document.getElementById("save-photo-btn");
  const saveBtn = document.getElementById("save-profile-btn");
  const displayInput = document.getElementById("display-name-input");
  const usernameInput = document.getElementById("username-input");

  // ---- PHOTO UPLOAD HANDLER ----
  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      photoInput._fileToUpload = file;
      savePhotoBtn.style.display = "inline-block";

      if (profileImg) {
        profileImg.src = URL.createObjectURL(file);
      }
    });
  }

  if (savePhotoBtn) {
    savePhotoBtn.addEventListener("click", async () => {
      if (!photoInput || !photoInput._fileToUpload) {
        showToast("No photo selected.", "error");
        return;
      }

      try {
        showToast("Saving photo...", "info", 2000);

        const file = photoInput._fileToUpload;
        const compressed = await compressImage(file);

        const uploadFile =
          compressed instanceof Blob
            ? new File([compressed], file.name, { type: compressed.type })
            : file;

        // Convert to base64 (works around CORS issues)
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(uploadFile);
        });

        if (profileImg) profileImg.src = base64;

        await setDoc(
          doc(db, "users", user.uid),
          {
            photoURL: base64,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        delete photoInput._fileToUpload;
        savePhotoBtn.style.display = "none";

        showToast("Photo saved successfully!", "success");
      } catch (err) {
        console.error("Photo upload failed:", err);
        showToast(
          "Failed to save photo: " + (err.message || "Unknown error"),
          "error"
        );
      }
    });
  }

  // ---- SAVE PROFILE BUTTON (name + email + stored username) ----
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const newDisplay = displayInput?.value.trim() || "";
      const newUsername = usernameInput?.value.trim() || "";
      const emailInput = document.getElementById("email-input");
      const newEmail = emailInput?.value.trim() || user.email;

      try {
        await updateProfile(user, { displayName: newDisplay });
        await user.reload();

        const userData = {
          username: newUsername,
          displayName: newDisplay,
          email: user.email,
          photoURL: user.photoURL || null,
        };

        await setDoc(doc(db, "users", user.uid), userData, { merge: true });

        document.getElementById("full-name-display").textContent = newDisplay;
        document.getElementById("user-email").textContent = user.email;

        showToast("Profile updated successfully.", "success");
      } catch (err) {
        console.error("Profile update failed:", err);
        showToast(err.message || "Could not update profile.", "error");
      }
    });
  }

  // ---- CHANGE PASSWORD ----
  const changePassBtn = document.getElementById("change-password-btn");
  if (changePassBtn) {
    const isPasswordProvider = user.providerData.some(
      (p) => p.providerId === "password"
    );

    if (!isPasswordProvider) {
      changePassBtn.disabled = true;
      changePassBtn.title = "Password managed by provider.";
      document.getElementById("current-password").disabled = true;
    }

    changePassBtn.addEventListener("click", async () => {
      const current = document.getElementById("current-password").value;
      const next = document.getElementById("new-password").value;
      const confirm = document.getElementById("confirm-new-password").value;

      if (!current || !next) {
        showToast("Please fill out password fields.", "error");
        return;
      }
      if (next.length < 6) {
        showToast("Password must be at least 6 characters.", "error");
        return;
      }
      if (next !== confirm) {
        showToast("Passwords do not match.", "error");
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, current);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, next);

        await setDoc(
          doc(db, "users", user.uid),
          { passwordLastChanged: serverTimestamp() },
          { merge: true }
        );

        showToast("Password changed successfully.", "success");

        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("confirm-new-password").value = "";
      } catch (err) {
        console.error("Password change error:", err);
        showToast(err.message || "Could not change password.", "error");
      }
    });
  }
}

if (saveBtn) {
  saveBtn.addEventListener("click", async () => {
    const newDisplay = displayInput ? displayInput.value.trim() : "";
    const newUsername = usernameInput ? usernameInput.value.trim() : "";
    const emailInput = document.getElementById("email-input");
    const newEmail = emailInput ? emailInput.value.trim() : user.email;

    try {
      await updateProfile(user, {
        displayName: newDisplay || user.displayName,
      });

      await user.reload();

      const userData = {
        username: newUsername,
        displayName: newDisplay || user.displayName,
        email: user.email,
      };

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
const changePassBtn = document.getElementById("change-password-btn");
if (changePassBtn) {
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
