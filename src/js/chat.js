import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  doc,
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
      const time = msg.timestamp
        ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Just now";

      const div = document.createElement("div");
      div.classList.add("message");

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

      div.innerHTML = `
        ${avatarHtml}
        <div class="msg-content">
          <h4>${nameLine} <span class="time">${time}</span></h4>
          <p>${msg.text}</p>
        </div>
      `;

      messagesDiv.appendChild(div);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
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
