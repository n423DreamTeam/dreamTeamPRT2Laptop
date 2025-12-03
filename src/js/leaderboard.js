import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase.js";

const db = getFirestore(app);
const auth = getAuth(app);

function renderEmpty(list) {
  list.innerHTML = `<li class="placeholder" style="opacity:.7">No players yet. Complete a challenge to appear here.</li>`;
}

function subscribeLeaderboard() {
  const list = document.querySelector("#leaderboard-users");
  if (!list) return;
  const q = query(
    collection(db, "users"),
    orderBy("points", "desc"),
    limit(25)
  );
  onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        renderEmpty(list);
        return;
      }
      list.innerHTML = "";
      snapshot.docs.forEach((docSnap, i) => {
        const data = docSnap.data();
        const li = document.createElement("li");
        const initials = (data.displayName || "?")
          .substring(0, 2)
          .toUpperCase();
        const challenges = data.challengesCompleted ?? data.wins ?? 0;
        const isSelf = auth.currentUser && auth.currentUser.uid === docSnap.id;
        li.innerHTML = `
          <span class="rank">${i + 1}</span>
          <div class="user-info ${isSelf ? "self" : ""}">
            <div class="avatar">${initials}</div>
            <div>
              <h3>${data.displayName || "Unknown"}${
          isSelf ? " <span style='color:#ffcb05'>(You)</span>" : ""
        }</h3>
              <p>${challenges} challenge${
          challenges === 1 ? "" : "s"
        } completed</p>
            </div>
          </div>
          <span class="points">${data.points || 0} pts</span>
        `;
        list.appendChild(li);
      });
    },
    (err) => {
      console.error("Leaderboard snapshot error", err);
      list.innerHTML = `<li class="placeholder" style="color:red">Leaderboard unavailable: ${err.code}</li>`;
    }
  );
}

document.addEventListener("DOMContentLoaded", subscribeLeaderboard);
