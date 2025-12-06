import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase.js";

document.addEventListener("DOMContentLoaded", () => {
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

  let goalPoints = 150;
  let goalAssists = 50;

  // === User progression (points & wins) persisted in localStorage ===
  const PROGRESS_KEY = "dt_user_progress_v1";
  let userProgress = { points: 0, wins: 0 };
  let firebaseUser = null;
  let challengeCompleted = false;

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) userProgress = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not load user progress:", e);
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.warn("Could not save user progress:", e);
    }
  }

  loadProgress();

  async function hydrateProgressFromFirestore(user) {
    if (!db || !user) return;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        userProgress.points = data.points ?? userProgress.points;
        userProgress.wins =
          data.challengesCompleted ?? data.wins ?? userProgress.wins;
        saveProgress();
        renderUserPointsHud();
      }
    } catch (e) {
      console.warn("Could not hydrate progress from Firestore", e);
    }
  }

  async function syncProgressToFirestore({
    pointsDelta,
    winIncrement,
    perfectChallengeAchieved,
  }) {
    if (!db || !firebaseUser) return;
    try {
      const payload = {
        points: increment(pointsDelta),
        wins: increment(winIncrement),
        challengesCompleted: increment(winIncrement),
        lastPlayedAt: serverTimestamp(),
      };
      if (perfectChallengeAchieved) {
        payload.perfectChallenges = increment(1);
      }
      await setDoc(doc(db, "users", firebaseUser.uid), payload, {
        merge: true,
      });
    } catch (e) {
      console.warn("Could not sync progress to Firestore", e);
    }
  }

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

  // === Toast notification for rewards ===
  function showRewardToast(points) {
    const toast = document.createElement("div");
    toast.className = "reward-toast";
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; z-index: 10000;
      background: linear-gradient(135deg, #ffcb05, #ffb300);
      color: #000; padding: 1.5rem 2rem; border-radius: 12px;
      box-shadow: 0 4px 15px rgba(255, 203, 5, 0.4);
      font-weight: bold; font-size: 1.1rem;
      animation: slideIn 0.5s ease-out;
      font-family: Arial, sans-serif;
    `;

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.8rem;">
        <span style="font-size: 1.8rem;">🎁</span>
        <div>
          <div style="font-size: 0.95rem;">YOU EARNED A NEW REWARD!</div>
          <div style="font-size: 1.3rem; margin-top: 0.2rem;">+${points} POINTS</div>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Add animation keyframes if not already present
    if (!document.querySelector("style[data-reward-toast]")) {
      const style = document.createElement("style");
      style.setAttribute("data-reward-toast", "true");
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

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = "slideIn 0.5s ease-out reverse";
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // Keep local progress in sync with authenticated user data
  onAuthStateChanged(auth, (user) => {
    firebaseUser = user;
    if (user) {
      hydrateProgressFromFirestore(user);
    }
  });

  // === Generate randomized but realistic daily challenge ===
  function generateDailyChallenge() {
    // Get day of year to ensure same challenge all day
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use day of year as seed for consistency
    const seed = dayOfYear % 10;

    // Challenge presets (60 points, 25 assists each)
    const challenges = [
      {
        points: 60,
        assists: 15,
        desc: "Build a balanced team with moderate scoring",
      },
      {
        points: 70,
        assists: 15,
        desc: "Create a high-assist lineup for ball movement",
      },
      { points: 80, assists: 30, desc: "Focus on playmaking over scoring" },
      { points: 20, assists: 10, desc: "Go for a scoring-focused roster" },
      { points: 20, assists: 10, desc: "Achieve perfect balance" },
      { points: 20, assists: 10, desc: "Team up the assist leaders" },
      { points: 20, assists: 10, desc: "Go big with scoring power" },
      { points: 20, assists: 10, desc: "Ultimate passing challenge" },
      { points: 20, assists: 10, desc: "Create a defensive-minded lineup" },
      { points: 20, assists: 10, desc: "Build a well-rounded squad" },
    ];

    const challenge = challenges[seed];
    goalPoints = challenge.points;
    goalAssists = challenge.assists;

    return challenge;
  }

  // === Initialize daily challenge ===
  const dailyChallenge = generateDailyChallenge();

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

  updateChallengeDisplay();

  // === Current roster with real stats ===
  // Better players (higher PPG) are locked and require points to unlock
  const currentRoster = [
    { name: "Tyrese Haliburton", pts: 20.1, ast: 10.8, requiredPoints: 200 }, // Elite scorer
    { name: "Pascal Siakam", pts: 21.3, ast: 4.8, requiredPoints: 200 }, // Elite scorer
    { name: "Andrew Nembhard", pts: 9.2, ast: 4.1, requiredPoints: 0 },
    { name: "Aaron Nesmith", pts: 12.2, ast: 1.5, requiredPoints: 100 },
    { name: "Benedict Mathurin", pts: 14.5, ast: 2.0, requiredPoints: 150 }, // Good scorer
    { name: "T.J. McConnell", pts: 9.8, ast: 4.3, requiredPoints: 0 },
    { name: "Jay Huff", pts: 7.8, ast: 1.0, requiredPoints: 0 },
    { name: "Obi Toppin", pts: 10.3, ast: 1.5, requiredPoints: 50 },
    { name: "Ben Sheppard", pts: 5.1, ast: 1.2, requiredPoints: 0 },
    { name: "Jarace Walker", pts: 3.8, ast: 0.9, requiredPoints: 0 },
    { name: "Isaiah Jackson", pts: 8.2, ast: 1.0, requiredPoints: 0 },
    { name: "Johnny Furphy", pts: 2.5, ast: 0.3, requiredPoints: 0 },
    { name: "Taelon Peter", pts: 1.8, ast: 1.1, requiredPoints: 0 },
    { name: "Kam Jones", pts: 0.0, ast: 0.0, requiredPoints: 0 },
    { name: "Tony Bradley", pts: 4.9, ast: 0.7, requiredPoints: 0 },
    { name: "Jeremiah Robinson-Earl", pts: 4.8, ast: 0.8, requiredPoints: 0 },
    { name: "Quenton Jackson", pts: 11.8, ast: 3.6, requiredPoints: 100 }, // Good scorer
    { name: "Ethan Thompson", pts: 2.0, ast: 1.0, requiredPoints: 0 },
  ];

  // === Fetch Pacers players from backend API + merge with current roster ===
  async function fetchPacersPlayers() {
    const cacheKey = "pacersPlayers_2024";
    let allPlayersPool = [...currentRoster]; // Start with current roster

    try {
      // Try to fetch additional players from API for historical/past players
      const playersRes = await fetch(`${API_URL}/players?team_id=12`);

      // Handle rate limit from proxy/server
      if (playersRes.status === 429) {
        console.warn(
          "⚠️ Server returned 429 Too Many Requests, using current roster only"
        );
        // Use current roster only
      } else if (playersRes.ok) {
        const playersData_raw = await playersRes.json();
        const apiPlayers = playersData_raw.data || [];

        console.log(`🟣 Found ${apiPlayers.length} players from API.`);

        // Convert API players to our format
        const apiFormattedPlayers = apiPlayers
          .map((p) => {
            // Check if this player is already in current roster
            const existsInRoster = currentRoster.some(
              (cr) =>
                cr.name.toLowerCase() ===
                `${p.first_name} ${p.last_name}`.toLowerCase()
            );

            // Skip if already in current roster (avoid duplicates)
            if (existsInRoster) return null;

            // Generate realistic stats based on position for API players
            let pts, ast;
            if (p.position === "G") {
              pts = 10 + Math.random() * 15;
              ast = 4 + Math.random() * 4;
            } else if (p.position === "F") {
              pts = 12 + Math.random() * 15;
              ast = 2 + Math.random() * 3;
            } else if (p.position === "C") {
              pts = 10 + Math.random() * 14;
              ast = 1 + Math.random() * 2;
            } else {
              pts = 8 + Math.random() * 12;
              ast = 2 + Math.random() * 3;
            }

            return {
              name: `${p.first_name} ${p.last_name}`,
              pts: parseFloat(pts.toFixed(1)),
              ast: parseFloat(ast.toFixed(1)),
              // Past players require points to unlock
              requiredPoints:
                pts >= 18 ? 200 : pts >= 16 ? 150 : pts >= 14 ? 120 : 50,
            };
          })
          .filter((p) => p !== null);

        // Merge API players with current roster
        allPlayersPool = [...currentRoster, ...apiFormattedPlayers];
        console.log(
          `✅ Merged current roster (${currentRoster.length}) with API players (${apiFormattedPlayers.length})`
        );
      }
    } catch (err) {
      console.warn(
        "⚠️ API fetch error, using current roster only:",
        err.message
      );
    }

    // Shuffle and select 5 players, with bias towards current roster
    const shuffled = allPlayersPool.sort(() => Math.random() - 0.5);
    const selectedPlayers = shuffled.slice(0, 5);

    playersData = selectedPlayers;
    console.log(`✅ Loaded 5 players for today's challenge`);
    displayPlayers(playersData);
  }

  // === Display players ===
  function displayPlayers(players) {
    if (!players.length) {
      playersContainer.innerHTML = `<p style="color:yellow">No Pacers found.</p>`;
      return;
    }
    // Build HTML with lock state
    playersContainer.innerHTML = players
      .map((p) => {
        const locked =
          p.requiredPoints && userProgress.points < p.requiredPoints;
        return `
          <div class="player ${locked ? "locked" : ""}" data-name="${
          p.name
        }" data-req="${p.requiredPoints || 0}" ${
          locked ? "" : 'draggable="true"'
        }>
            ${p.name.toUpperCase()}
            ${
              locked
                ? `<div class="lock-overlay">🔒 Unlock at ${p.requiredPoints} pts</div>`
                : ""
            }
          </div>`;
      })
      .join("");

    // Attach listeners but skip locked players
    playersContainer.querySelectorAll(".player").forEach((playerEl) => {
      const isLocked = playerEl.classList.contains("locked");
      const name = playerEl.getAttribute("data-name");
      if (!isLocked) {
        playerEl.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", name.toUpperCase());
        });
      } else {
        // show a tooltip on click explaining unlock requirement
        playerEl.addEventListener("click", () => {
          const req = playerEl.getAttribute("data-req") || 0;
          alert(
            `This player is locked. Reach ${req} points to unlock. You have ${userProgress.points} points.`
          );
        });
      }
    });
  }

  // === Initialize ===
  fetchPacersPlayers();

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

    if (!challengeCompleted && pointsPct === 100 && assistsPct === 100) {
      challengeCompleted = true;
      showChallengeComplete(totalPoints, totalAssists);
    }
  }

  function showChallengeComplete(totalPoints, totalAssists) {
    // Award user points and record a win
    const reward = Math.max(25, Math.round(goalPoints * 0.2)); // minimum reward
    const previousPoints = userProgress.points;
    userProgress.points += reward;
    userProgress.wins += 1;
    saveProgress();
    renderUserPointsHud();

    // Show reward toast notification
    showRewardToast(reward);

    const perfectChallengeAchieved =
      totalPoints >= goalPoints * 1.5 && totalAssists >= goalAssists * 1.5;

    // Persist to Firestore when signed in
    syncProgressToFirestore({
      pointsDelta: reward,
      winIncrement: 1,
      perfectChallengeAchieved,
    });

    // Check for newly unlocked players from current roster
    const newlyUnlockedPlayers = currentRoster.filter((player) => {
      const wasLocked = previousPoints < player.requiredPoints;
      const isNowUnlocked = userProgress.points >= player.requiredPoints;
      return wasLocked && isNowUnlocked && player.requiredPoints > 0;
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

    let unlockedHtml = "";
    if (newlyUnlockedPlayers.length > 0) {
      unlockedHtml = `
        <div style="
          background: rgba(255, 203, 5, 0.2); border: 2px solid #ffcb05;
          border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;
        ">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔓</div>
          <p style="font-size: 0.95rem; margin: 0 0 0.8rem 0; color: #ffcb05; font-weight: bold;">
            YOU HAVE UNLOCKED THESE PLAYERS!
          </p>
          <div style="text-align: left; display: flex; flex-direction: column; gap: 0.5rem;">
            ${newlyUnlockedPlayers
              .map(
                (p) =>
                  `<div style="font-size: 0.9rem; color: #fff; font-weight: 500;">⭐ ${p.name}</div>`
              )
              .join("")}
          </div>
        </div>
      `;
    }

    popup.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
      <h2 style="font-size: 2rem; margin: 0.5rem 0; color: #ffcb05;">Awesome Work!</h2>
      <p style="font-size: 1.1rem; margin: 1rem 0; color: rgba(255,255,255,0.9);">You crushed that challenge!</p>
      <p style="font-size: 1rem; margin: 1rem 0; color: #ffcb05; font-weight: bold;">+${reward} Points</p>
      ${unlockedHtml}
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
      challengeCompleted = false;
      dropZone.innerHTML = `<p><strong>BUILD YOUR DREAMTEAM</strong><br>Drag & Drop players into this area</p>`;
      updateBars();
      fetchPacersPlayers();
    });

    // Done: just close the popup
    document.getElementById("close-popup-btn").addEventListener("click", () => {
      modal.remove();
    });

    // Re-render players so any newly-unlocked players appear
    displayPlayers(playersData);
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
        challengeCompleted = false;
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
    // Fetch new roster of 5 players ONLY (don't clear lineup)
    fetchPacersPlayers();
  });
  const slider = document.querySelector(".slider");
  const quantity = parseInt(
    getComputedStyle(slider).getPropertyValue("--quantity")
  );
  let angle = 0;
  let current = 0;

  function rotateCarousel(direction) {
    current = (current + direction + quantity) % quantity;
    angle = (360 / quantity) * current;
    slider.style.transform = `perspective(1000px) rotateY(-${angle}deg)`;
  }
  // Automatic rotation for the carousel (floating banner is preferred)
  const banner =
    document.querySelector(".banner.floating") ||
    document.querySelector(".banner");
  const leftBtn = document.querySelector(".nav2.left2");
  const rightBtn = document.querySelector(".nav2.right2");

  let autoTimer = null;
  function startAutoRotate(interval = 3500) {
    stopAutoRotate();
    autoTimer = setInterval(() => rotateCarousel(1), interval);
  }
  function stopAutoRotate() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Arrow buttons (if present)
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

  // Pause auto-rotation while hovering the banner
  if (banner) {
    banner.addEventListener("mouseenter", stopAutoRotate);
    banner.addEventListener("mouseleave", () => startAutoRotate(3500));
  }

  // Start auto-rotation
  startAutoRotate(3500);
});
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
