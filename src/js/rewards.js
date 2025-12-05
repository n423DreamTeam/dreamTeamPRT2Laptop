import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "../../firebase.js";

const auth = getAuth(app);

const PROGRESS_KEY = "dt_user_progress_v1";

// Badge thresholds
const BADGE_THRESHOLDS = {
  firstWin: 1,
  hotStreak: 5,
  perfectLineup: 1, // At least one challenge where requirements exceeded by 50%
  statMaster: 10,
};

function getLocalProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read local progress", e);
  }
  return { points: 0, wins: 0 };
}

async function loadUserStats(user) {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const data = userDoc.data();
      const localProgress = getLocalProgress();
      const points = Math.max(data.points || 0, localProgress.points || 0);
      const wins = Math.max(data.wins || 0, localProgress.wins || 0);
      const challengesCompleted =
        data.challengesCompleted || wins || localProgress.wins || 0;

      // Update points display
      const pointsElement = document.getElementById("user-points");
      if (pointsElement) {
        pointsElement.textContent = points;
      }

      // Update badges based on actual stats
      updateBadges(challengesCompleted, data);
    } else {
      // No Firestore data yet - fall back to local progress
      const localProgress = getLocalProgress();
      const pointsElement = document.getElementById("user-points");
      if (pointsElement) {
        pointsElement.textContent = localProgress.points || 0;
      }
      updateBadges(localProgress.wins || 0, {});
    }
  } catch (error) {
    console.error("Error loading user stats:", error);
    const localProgress = getLocalProgress();
    const pointsElement = document.getElementById("user-points");
    if (pointsElement) pointsElement.textContent = localProgress.points || 0;
    updateBadges(localProgress.wins || 0, {});
  }
}

function updateBadges(challengesCompleted, userData) {
  const badgesGrid = document.querySelector(".badges-grid");
  if (!badgesGrid) return;

  // Calculate badge progress
  const firstWinUnlocked = challengesCompleted >= BADGE_THRESHOLDS.firstWin;
  const hotStreakProgress = Math.min(
    challengesCompleted,
    BADGE_THRESHOLDS.hotStreak
  );
  const hotStreakUnlocked = challengesCompleted >= BADGE_THRESHOLDS.hotStreak;
  const statMasterProgress = Math.min(
    challengesCompleted,
    BADGE_THRESHOLDS.statMaster
  );
  const statMasterUnlocked = challengesCompleted >= BADGE_THRESHOLDS.statMaster;

  // Perfect Lineup badge - check if user has any "perfect" challenges
  const perfectLineupUnlocked = userData.perfectChallenges
    ? userData.perfectChallenges > 0
    : false;

  badgesGrid.innerHTML = `
    <div class="badge ${firstWinUnlocked ? "unlocked" : ""}">
      <div class="icon">⭐</div>
      <h3>First Win</h3>
      <p>Complete your first challenge</p>
      ${firstWinUnlocked ? '<div class="badge-status">✓ Unlocked</div>' : ""}
    </div>

    <div class="badge ${hotStreakUnlocked ? "unlocked" : ""}">
      <div class="icon">🏆</div>
      <h3>Hot Streak</h3>
      <p>Complete 5 challenges in a row</p>
      <div class="progress"><div style="width: ${
        (hotStreakProgress / BADGE_THRESHOLDS.hotStreak) * 100
      }%"></div></div>
      <p class="progress-text">${hotStreakProgress} / ${
    BADGE_THRESHOLDS.hotStreak
  }</p>
    </div>

    <div class="badge ${perfectLineupUnlocked ? "unlocked" : ""}">
      <div class="icon">🎯</div>
      <h3>Perfect Lineup</h3>
      <p>Exceed all requirements by 50%</p>
      ${
        perfectLineupUnlocked
          ? '<div class="badge-status">✓ Unlocked</div>'
          : ""
      }
    </div>

    <div class="badge ${statMasterUnlocked ? "unlocked" : ""}">
      <div class="icon">📊</div>
      <h3>Stat Master</h3>
      <p>Complete 10 challenges</p>
      <div class="progress"><div style="width: ${
        (statMasterProgress / BADGE_THRESHOLDS.statMaster) * 100
      }%"></div></div>
      <p class="progress-text">${statMasterProgress} / ${
    BADGE_THRESHOLDS.statMaster
  }</p>
    </div>
  `;
}

function updateChallengeDate() {
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
}

document.addEventListener("DOMContentLoaded", () => {
  // Update the date
  updateChallengeDate();

  // Load user stats when authenticated
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserStats(user);
    } else {
      // Redirect to login if not authenticated
      window.location.href = "./login.html";
    }
  });
});
