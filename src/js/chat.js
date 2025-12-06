import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app, db } from "../../firebase.js";

const auth = getAuth(app);

// Elements
const msgForm = document.getElementById("message-form");
const msgInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");

// Load messages in real-time
if (messagesDiv) {
  const chatQuery = query(
    collection(db, "messages"),
    orderBy("timestamp", "asc")
  );

  onSnapshot(chatQuery, async (snapshot) => {
    messagesDiv.innerHTML = "";

    // Process messages sequentially to maintain order
    for (const docSnap of snapshot.docs) {
      const msg = docSnap.data();
      const messageId = docSnap.id;
      const time = msg.timestamp
        ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Just now";

      const div = document.createElement("div");
      div.classList.add("message");
      div.setAttribute("data-message-id", messageId);

      // Check if this message is from current user
      const isSelf = auth.currentUser && msg.uid === auth.currentUser.uid;
      if (isSelf) {
        div.classList.add("self");
      }

      // Try to get user's profile photo from Firestore
      let photoURL = msg.photoURL;
      if (msg.uid && !photoURL) {
        try {
          const userDoc = await getDoc(doc(db, "users", msg.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            photoURL = userData.photoURL || null;
          }
        } catch (err) {
          console.warn("Could not load user photo:", err);
        }
      }

      // avatar: prefer photoURL, else initials
      let avatarHtml = "";
      if (photoURL) {
        avatarHtml = `<div class="avatar"><img src="${photoURL}" alt="avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"/></div>`;
      } else {
        const initials = msg.displayName
          ? msg.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : msg.userInitials || "??";
        avatarHtml = `<div class="avatar">${initials}</div>`;
      }

      // name line: displayName and optional @username
      const nameLine = `${msg.displayName || msg.user || "Unknown"}${
        msg.username ? ` <span class="username">@${msg.username}</span>` : ""
      }`;

      // Edit/Delete buttons for own messages
      let actionButtonsHtml = "";
      if (isSelf) {
        actionButtonsHtml = `
          <div class="message-actions">
            <button class="edit-btn" data-id="${messageId}" title="Edit">✏️</button>
            <button class="delete-btn" data-id="${messageId}" title="Delete">🗑️</button>
          </div>
        `;
      }

      const editIndicator = msg.edited
        ? `<span class="edited-label">(edited)</span>`
        : "";

      div.innerHTML = `
        ${avatarHtml}
        <div class="msg-content">
          <h4>${nameLine} <span class="time">${time}</span> ${editIndicator}</h4>
          <p class="message-text">${msg.text}</p>
        </div>
        ${actionButtonsHtml}
      `;

      messagesDiv.appendChild(div);

      // Attach event listeners for edit/delete buttons
      if (isSelf) {
        const editBtn = div.querySelector(".edit-btn");
        const deleteBtn = div.querySelector(".delete-btn");

        editBtn.addEventListener("click", () => {
          editMessage(messageId, msg.text, div);
        });

        deleteBtn.addEventListener("click", () => {
          deleteMessage(messageId);
        });
      }
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// === Edit Message Function ===
async function editMessage(messageId, currentText, messageDiv) {
  const newText = prompt("Edit your message:", currentText);

  if (newText === null) return; // User cancelled
  if (newText.trim() === "") {
    alert("Message cannot be empty");
    return;
  }

  try {
    await updateDoc(doc(db, "messages", messageId), {
      text: newText.trim(),
      edited: true,
    });
    console.log("Message edited successfully");
  } catch (err) {
    console.error("Failed to edit message:", err);
    alert("Failed to edit message. Please try again.");
  }
}

// === Delete Message Function ===
async function deleteMessage(messageId) {
  if (!confirm("Are you sure you want to delete this message?")) return;

  try {
    await deleteDoc(doc(db, "messages", messageId));
    console.log("Message deleted successfully");
  } catch (err) {
    console.error("Failed to delete message:", err);
    alert("Failed to delete message. Please try again.");
  }
}

// Send message
if (msgForm) {
  msgForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (!text) return;

    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please log in to send messages.");
      return;
    }

    let payload = {
      text,
      timestamp: serverTimestamp(),
      uid: currentUser.uid,
      displayName: currentUser.displayName || "User",
    };

    // Load username and photoURL from Firestore users/{uid}
    try {
      const uDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (uDoc.exists()) {
        const data = uDoc.data();
        if (data.username) payload.username = data.username;
        if (data.photoURL) payload.photoURL = data.photoURL;
      }
    } catch (err) {
      console.warn("Could not load user data for message:", err);
    }

    try {
      await addDoc(collection(db, "messages"), payload);
      msgInput.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    }
  });
}

// === Populate daily challenge date ===
const dateElement = document.getElementById("challenge-date");
if (dateElement) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  dateElement.textContent = formattedDate;
}
