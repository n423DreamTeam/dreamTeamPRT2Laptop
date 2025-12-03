import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "../../firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  // === Hamburger menu toggle ===
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".navbar nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });

    // Close menu when clicking a link
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      }
    });
  }

  // === grab elements once ===
  const dropZone = document.getElementById("drop-zone");
  const playersContainer = document.querySelector(".players");
  const pointsBar = document.querySelector("#points-bar");
  const assistsBar = document.querySelector("#assists-bar");
  let pointsVal = document.querySelector("#points-val");
  let assistsVal = document.querySelector("#assists-val");
  const refreshBtn = document.getElementById("refresh-btn");

  // ✅ Backend API endpoint (running on localhost:3001)
  const API_URL = "http://localhost:3001/api";

  let playersData = [];
  let lineup = [];

  // Dynamic goals (will be computed from real stats)
  let goalPoints = 0;
  let goalAssists = 0;

  // === User progression (points & wins) persisted in Firestore per user ===
  let userProgress = { points: 0, wins: 0 };
  const auth = getAuth(app);

  // Load user progress from Firestore (user-specific)
  async function loadProgress() {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          userProgress.points = data.points || 0;
          userProgress.wins = data.wins || 0;
          console.log("Loaded user progress from Firestore:", userProgress);
        } else {
          console.log("No existing user data, starting fresh");
        }
      } else {
        console.warn("No user logged in, progress will not be saved");
      }
    } catch (e) {
      console.warn("Could not load user progress from Firestore:", e);
    }
    renderUserPointsHud();
  }

  // Save user progress to Firestore (user-specific)
  async function saveProgress() {
    try {
      const user = auth.currentUser;
      if (user) {
        const displayName =
          user.displayName ||
          (user.email ? user.email.split("@")[0] : "Player");
        await setDoc(
          doc(db, "users", user.uid),
          {
            displayName,
            points: userProgress.points,
            wins: userProgress.wins,
            challengesCompleted: userProgress.wins,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        console.log("Saved user progress to Firestore:", userProgress);
      } else {
        console.warn("No user logged in, cannot save progress");
      }
    } catch (e) {
      console.warn("Could not save user progress to Firestore:", e);
    }
  }

  // Load progress when page loads (async)
  loadProgress();

  // Small UI hook to show user's points
  function renderUserPointsHud() {
    let hud = document.querySelector(".user-points-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.className = "user-points-hud";
      hud.style.cssText =
        "position: absolute; right: 2rem; top: 1.5rem; color: #fff; background: rgba(0,0,0,0.4); padding: 0.4rem 0.8rem; border-radius: 10px; font-weight:700;";
      document.body.appendChild(hud);
    }
    hud.innerHTML = `Points: <span style='color:#ffcb05'>${userProgress.points}</span> • Wins: ${userProgress.wins}`;
  }

  renderUserPointsHud();

  // Placeholder for challenge (filled after stats load)
  let dailyChallenge = { desc: "Loading real Pacers stats..." };

  // === Update challenge objective in DOM ===
  function updateChallengeDisplay() {
    const objectiveText = document.querySelector(".puzzle-objective p");
    if (objectiveText) {
      objectiveText.innerHTML = `Achieve a total team score of <span class="highlight">${goalPoints} points</span> and <span class="highlight">${goalAssists} assists</span> using any 5 players.<br><em style="font-size: 0.9em; color: rgba(255,255,255,0.7);">${dailyChallenge.desc}</em>`;
    }

    // Update progress bar labels
    const pointsLabel = document
      .querySelector("#points-bar")
      .parentElement.parentElement.querySelector("p");
    const assistsLabel = document
      .querySelector("#assists-bar")
      .parentElement.parentElement.querySelector("p");
    if (pointsLabel)
      pointsLabel.innerHTML = `<span id="points-val">0</span> / ${goalPoints}`;
    if (assistsLabel)
      assistsLabel.innerHTML = `<span id="assists-val">0</span> / ${goalAssists}`;

    // Re-bind the points/assists DOM refs in case they were replaced
    pointsVal = document.querySelector("#points-val");
    assistsVal = document.querySelector("#assists-val");
  }

  // Defer initial display until we compute dynamic goals
  updateChallengeDisplay();

  // Accept a boolean flag; default false
  async function fetchDailyChallenge(refresh = false) {
    playersContainer.innerHTML = refresh
      ? '<p style="color:#ffcb05">Refreshing challenge...</p>'
      : '<p style="color:#ffcb05">Loading daily challenge...</p>';
    try {
      const url = refresh ? `${API_URL}/daily?refresh=1` : `${API_URL}/daily`;
      const res = await fetch(url);
      if (res.status === 429) {
        // Client-side backoff (should rarely happen now that server falls back)
        playersContainer.innerHTML = `<p style="color:yellow">Rate limited. Retrying in 5s...</p>`;
        refreshBtn.disabled = true;
        setTimeout(() => {
          refreshBtn.disabled = false;
          fetchDailyChallenge(refresh);
        }, 5000);
        return;
      }
      if (!res.ok) throw new Error(`Daily fetch failed: ${res.status}`);
      const json = await res.json();
      goalPoints = json.goals.points;
      goalAssists = json.goals.assists;
      playersData = json.players.map((p) => ({
        id: p.id,
        name: p.name,
        pts: parseFloat(p.pts.toFixed(1)),
        ast: parseFloat(p.ast.toFixed(1)),
        // Progressive locking thresholds: better scorers unlock later
        requiredPoints:
          p.pts >= 20 ? 250 : p.pts >= 16 ? 180 : p.pts >= 12 ? 120 : 0,
      }));
      let descBase = json.fallback
        ? `Fallback stats active — reach ${goalPoints} pts & ${goalAssists} ast.`
        : `Reach ${goalPoints} pts & ${goalAssists} ast (season averages).`;
      if (json.goalsLocked && json.refreshed) {
        descBase += ` Players refreshed — goals unchanged.`;
      } else if (json.refreshed) {
        descBase += ` (New goals recalculated.)`;
      }
      if (json.rateLimited) {
        descBase += " (Upstream rate limit – using fallback stats.)";
      }
      dailyChallenge = { desc: descBase };
      updateChallengeDisplay();
      displayPlayers(playersData);
    } catch (e) {
      console.error("Daily challenge error", e);
      playersContainer.innerHTML = `<p style="color:red">Failed to load daily challenge. <button id='retry-daily' style='color:#fff;background:#3f4dd3;border:1px solid #ffcb05;padding:2px 6px;border-radius:6px;'>Retry</button></p>`;
      const retry = document.getElementById("retry-daily");
      if (retry) retry.addEventListener("click", () => fetchDailyChallenge());
    }
  }

  // Server now handles fallback; old synthetic function removed

  // === Display players ===
  function displayPlayers(players) {
    if (!players.length) {
      playersContainer.innerHTML = `<p style="color:yellow">No Pacers found.</p>`;
      return;
    }
    // Show all available players
    playersContainer.innerHTML = players
      .map((p) => {
        const locked =
          p.requiredPoints && userProgress.points < p.requiredPoints;
        return `
          <div class="player ${locked ? "locked" : ""}" data-name="${
          p.name
        }" data-req="${p.requiredPoints}" ${locked ? "" : 'draggable="true"'}>
            ${p.name.toUpperCase()}
            ${
              locked
                ? `<div class="lock-overlay">🔒 Unlock at ${p.requiredPoints} pts</div>`
                : ""
            }
          </div>`;
      })
      .join("");
    playersContainer.querySelectorAll(".player").forEach((playerEl) => {
      const isLocked = playerEl.classList.contains("locked");
      const name = playerEl.getAttribute("data-name");
      if (!isLocked) {
        playerEl.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", name.toUpperCase());
        });
      } else {
        playerEl.addEventListener("click", () => {
          const req = playerEl.getAttribute("data-req") || 0;
          alert(
            `This player is locked. Reach ${req} points to unlock. You have ${userProgress.points} points.`
          );
        });
      }
    });
  }

  // Initialize via daily endpoint
  fetchDailyChallenge(); // Initial call without refresh

  // === Drag & Drop logic ===
  function updateBars() {
    const totalPoints = lineup.reduce((sum, p) => sum + p.pts, 0);
    const totalAssists = lineup.reduce((sum, p) => sum + p.ast, 0);

    const pointsPct = Math.min((totalPoints / goalPoints) * 100, 100);
    const assistsPct = Math.min((totalAssists / goalAssists) * 100, 100);

    pointsBar.style.width = `${pointsPct}%`;
    assistsBar.style.width = `${assistsPct}%`;
    pointsVal.textContent = totalPoints.toFixed(1);
    assistsVal.textContent = totalAssists.toFixed(1);

    if (pointsPct === 100 && assistsPct === 100) showChallengeComplete();
  }

  function showChallengeComplete() {
    const oldPoints = userProgress.points;
    // Award user points and record a win
    const reward = Math.max(25, Math.round(goalPoints * 0.2)); // minimum reward
    userProgress.points += reward;
    userProgress.wins += 1;

    // Save to Firestore
    saveProgress().then(() => {
      renderUserPointsHud();
    });

    // Create modal overlay and popup
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7); display: flex;
      justify-content: center; align-items: center; z-index: 9999;
    `;

    const popup = document.createElement("div");
    popup.style.cssText = `
      background: linear-gradient(135deg, #5b7fff, #3f4dd3);
      border: 2px solid #ffcb05; border-radius: 20px;
      padding: 2.5rem; text-align: center; max-width: 450px;
      box-shadow: 0 0 30px rgba(91, 127, 255, 0.6);
      color: white; font-family: Arial, sans-serif;
    `;

    popup.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
      <h2 style="font-size: 2rem; margin: 0.5rem 0; color: #ffcb05;">Awesome Work!</h2>
      <p style="font-size: 1.1rem; margin: 1rem 0; color: rgba(255,255,255,0.9);">You crushed that challenge!</p>
      <p style="font-size: 1rem; margin: 1rem 0; color: #ffcb05; font-weight: bold;">+${reward} Points</p>
      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
        <button id="play-again-btn" style="
          background: linear-gradient(135deg, #ffcb05, #ffb300);
          color: #000; border: none; border-radius: 10px;
          padding: 0.75rem 2rem; font-weight: bold; font-size: 1rem;
          cursor: pointer; transition: 0.3s ease;
        ">Play Again</button>
        <button id="close-popup-btn" style="
          background: rgba(255,255,255,0.2); color: #fff;
          border: 2px solid rgba(255,255,255,0.5); border-radius: 10px;
          padding: 0.75rem 2rem; font-weight: bold; font-size: 1rem;
          cursor: pointer; transition: 0.3s ease;
        ">Done</button>
      </div>
    `;

    modal.appendChild(popup);
    document.body.appendChild(modal);

    // Play Again: clear lineup and refresh players
    document.getElementById("play-again-btn").addEventListener("click", () => {
      modal.remove();
      lineup = [];
      dropZone.innerHTML = `<p><strong>BUILD YOUR DREAMTEAM</strong><br>Drag & Drop players into this area</p>`;
      updateBars();
      fetchDailyChallenge(true); // Call with refresh flag
    });

    // Done: just close the popup
    document.getElementById("close-popup-btn").addEventListener("click", () => {
      modal.remove();
    });

    // Re-render players so any newly-unlocked players appear
    displayPlayers(playersData);

    // Notify user about newly unlocked players
    try {
      const unlockedNow = playersData
        .filter(
          (p) =>
            p.requiredPoints &&
            oldPoints < p.requiredPoints &&
            userProgress.points >= p.requiredPoints
        )
        .map((p) => p.name);
      if (unlockedNow.length) {
        const toast = document.createElement("div");
        toast.style.cssText = `
          position: fixed; right: 20px; bottom: 20px; z-index: 10000;
          background: rgba(255, 203, 5, 0.95); color: #111; border: 2px solid #ffcb05;
          border-radius: 12px; padding: 0.9rem 1rem; box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          max-width: 380px; font-weight: 700;
        `;
        toast.innerHTML = `🔓 Players unlocked: ${unlockedNow
          .map((n) => n.toUpperCase())
          .join(", ")}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }
    } catch (_) {}
  }

  function createLineupTag(name) {
    const tag = document.createElement("div");
    tag.className = "lineup-player";

    // Create a container for player name and X button
    const playerContent = document.createElement("span");
    playerContent.className = "player-content";
    playerContent.textContent = name;
    tag.appendChild(playerContent);

    // Create X button to remove player
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-player-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Remove player from lineup
      lineup = lineup.filter(
        (p) => p.name.toUpperCase() !== name.toUpperCase()
      );
      tag.remove();
      updateBars();

      // Show default text if lineup is now empty
      if (lineup.length === 0) {
        const defaultText = dropZone.querySelector("p");
        if (defaultText) {
          defaultText.style.display = "block";
        }
      }
    });
    tag.appendChild(removeBtn);

    // Hide the default text when first player is added
    const defaultText = dropZone.querySelector("p");
    if (defaultText && lineup.length === 0) {
      defaultText.style.display = "none";
    }

    // Show/create clear button when players are in the lineup
    let clearBtn = dropZone.querySelector(".clear-btn");
    if (!clearBtn) {
      clearBtn = document.createElement("button");
      clearBtn.className = "clear-btn";
      clearBtn.textContent = "✕ Clear";
      clearBtn.addEventListener("click", () => {
        // Clear the lineup
        lineup = [];
        dropZone.innerHTML = `<p><strong>BUILD YOUR DREAMTEAM</strong><br>Drag & Drop players into this area</p>`;
        document
          .querySelector(".feedback")
          .classList.remove("challenge-complete");
        updateBars();
      });
      dropZone.appendChild(clearBtn);
    }

    // Insert player tag before the clear button
    if (clearBtn) {
      dropZone.insertBefore(tag, clearBtn);
    } else {
      dropZone.appendChild(tag);
    }
  }

  dropZone.addEventListener("dragover", (e) => e.preventDefault());
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const name = e.dataTransfer.getData("text/plain").trim();
    if (
      !name ||
      lineup.some((p) => p.name.toUpperCase() === name) ||
      lineup.length >= 5
    )
      return;

    const player = playersData.find((p) => p.name.toUpperCase() === name);
    if (!player) return;

    lineup.push(player);
    createLineupTag(player.name);
    updateBars();
  });

  refreshBtn.addEventListener("click", () => {
    fetchDailyChallenge(true); // Call with refresh flag on button click
  });
  const slider = document.querySelector(".slider");
  const quantity = slider
    ? parseInt(getComputedStyle(slider).getPropertyValue("--quantity"))
    : 0;
  let angle = 0;
  let current = 0;
  // Enable continuous CSS auto-spin
  const CSS_AUTO_CLASS = "css-auto-spin";
  if (slider && !slider.classList.contains(CSS_AUTO_CLASS)) {
    slider.classList.add(CSS_AUTO_CLASS);
  }

  // Prevent JS from clobbering transform if CSS auto-spin is active
  function rotateCarousel(direction) {
    if (!slider || !quantity) return;
    if (slider.classList.contains(CSS_AUTO_CLASS)) return;
    current = (current + direction + quantity) % quantity;
    angle = (360 / quantity) * current;
    slider.style.transform = `perspective(1000px) rotateY(-${angle}deg)`;
  }

  // Arrow buttons (if present)
  const banner =
    document.querySelector(".banner.floating") ||
    document.querySelector(".banner");
  const leftBtn = document.querySelector(".nav2.left2");
  const rightBtn = document.querySelector(".nav2.right2");

  if (leftBtn)
    leftBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      rotateCarousel(-1);
    });
  if (rightBtn)
    rightBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      rotateCarousel(1);
    });

  // Re-apply CSS auto-spin if URL hash changes (navigation to anchors)
  window.addEventListener("hashchange", () => {
    if (slider && !slider.classList.contains(CSS_AUTO_CLASS)) {
      slider.classList.add(CSS_AUTO_CLASS);
    }
  });

  // If the document becomes visible again, re-enable the CSS spin (some browsers throttle)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && slider) {
      slider.classList.add(CSS_AUTO_CLASS);
    }
  });
});
const dateElement = document.getElementById("challenge-date");
if (dateElement) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", // e.g. "Tuesday"
    month: "long", // e.g. "April"
    day: "numeric", // e.g. "2"
    year: "numeric", // e.g. "2025"
  });
  dateElement.textContent = formattedDate;
}
