import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "../../firebase.js";

const auth = getAuth(app);

const PROGRESS_KEY = "dt_user_progress_v1";

const BADGE_THRESHOLDS = {
  firstWin: 1,
  hotStreak: 5,
  perfectLineup: 1,
  statMaster: 10,
};

const BADGES = [
  {
    key: "firstWin",
    title: "First Win",
    description: "Complete your first challenge.",
    required: BADGE_THRESHOLDS.firstWin,
  },
  {
    key: "hotStreak",
    title: "Hot Streak",
    description: "Complete 5 challenges in a row.",
    required: BADGE_THRESHOLDS.hotStreak,
  },
  {
    key: "perfectLineup",
    title: "Perfect Lineup",
    description: "Exceed all requirements by 50% in a challenge.",
    required: BADGE_THRESHOLDS.perfectLineup,
  },
  {
    key: "statMaster",
    title: "Stat Master",
    description: "Complete 10 challenges.",
    required: BADGE_THRESHOLDS.statMaster,
  },
];

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

      const pointsElement = document.getElementById("user-points");
      if (pointsElement) {
        pointsElement.textContent = points;
      }

      updateBadges(challengesCompleted, data);
    } else {
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

  const perfectLineupUnlocked = userData.perfectChallenges
    ? userData.perfectChallenges > 0
    : false;

  const badgeStates = {
    firstWin: {
      unlocked: firstWinUnlocked,
      progress: Math.min(challengesCompleted, BADGE_THRESHOLDS.firstWin),
      required: BADGE_THRESHOLDS.firstWin,
      icon: "⭐",
    },
    hotStreak: {
      unlocked: hotStreakUnlocked,
      progress: hotStreakProgress,
      required: BADGE_THRESHOLDS.hotStreak,
      icon: "🏆",
    },
    perfectLineup: {
      unlocked: perfectLineupUnlocked,
      progress: perfectLineupUnlocked ? 1 : 0,
      required: BADGE_THRESHOLDS.perfectLineup,
      icon: "🎯",
    },
    statMaster: {
      unlocked: statMasterUnlocked,
      progress: statMasterProgress,
      required: BADGE_THRESHOLDS.statMaster,
      icon: "📊",
    },
  };

  badgesGrid.innerHTML = BADGES.map((badge) => {
    const state = badgeStates[badge.key];
    const pct = Math.min(100, (state.progress / state.required) * 100);
    return `
      <div class="badge ${state.unlocked ? "unlocked" : ""}" data-badge-key="${
      badge.key
    }">
        <div class="icon">${state.icon}</div>
        <h3>${badge.title}</h3>
        <p>${badge.description}</p>
        <div class="progress"><div style="width: ${pct}%"></div></div>
        <p class="progress-text">${state.progress} / ${state.required}</p>
        ${state.unlocked ? '<div class="badge-status">✓ Unlocked</div>' : ""}
      </div>
    `;
  }).join("");

  attachBadgeModalHandlers(badgeStates);
  renderNextMilestone(challengesCompleted, badgeStates.perfectLineup.unlocked);
}

function renderNextMilestone(challengesCompleted, perfectLineupUnlocked) {
  const banner = document.getElementById("milestone-banner");
  if (!banner) return;

  const order = [
    { key: "firstWin", required: BADGE_THRESHOLDS.firstWin },
    { key: "hotStreak", required: BADGE_THRESHOLDS.hotStreak },
    { key: "statMaster", required: BADGE_THRESHOLDS.statMaster },
  ];

  let next = order.find((b) => challengesCompleted < b.required);
  if (!next && !perfectLineupUnlocked) {
    next = { key: "perfectLineup", required: BADGE_THRESHOLDS.perfectLineup };
  }

  if (!next) {
    banner.textContent = "All badges unlocked — nice work!";
    banner.style.borderColor = "#22c55e";
    banner.style.background = "rgba(34,197,94,0.12)";
    return;
  }

  if (next.key === "perfectLineup") {
    banner.textContent =
      "Next up: Perfect Lineup — exceed all requirements by 50% in any challenge.";
    banner.style.borderColor = "#ffcb05";
    banner.style.background = "rgba(255,203,5,0.12)";
    return;
  }

  const remaining = next.required - challengesCompleted;
  const labelMap = {
    firstWin: "First Win",
    hotStreak: "Hot Streak",
    statMaster: "Stat Master",
  };
  banner.textContent = `${remaining} more challenge${
    remaining === 1 ? "" : "s"
  } to unlock ${labelMap[next.key]}.`;
  banner.style.borderColor = "#ffcb05";
  banner.style.background = "rgba(255,203,5,0.12)";
}

function attachBadgeModalHandlers(badgeStates) {
  const modal = document.getElementById("badge-detail-modal");
  const titleEl = document.getElementById("badge-modal-title");
  const descEl = document.getElementById("badge-modal-desc");
  const progressEl = document.getElementById("badge-modal-progress");
  const closeBtn = document.getElementById("badge-modal-close");
  const closeBtn2 = document.getElementById("badge-modal-close-btn");
  if (!modal || !titleEl || !descEl || !progressEl) return;

  function openModal(badge) {
    const state = badgeStates[badge.key];
    titleEl.textContent = badge.title;
    descEl.textContent = badge.description;
    progressEl.textContent = state.unlocked
      ? "Unlocked"
      : `Progress: ${state.progress} / ${state.required}`;
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeBtn2) closeBtn2.addEventListener("click", closeModal);

  const badgesGrid = document.querySelector(".badges-grid");
  if (!badgesGrid) return;

  badgesGrid.querySelectorAll(".badge").forEach((el) => {
    const key = el.getAttribute("data-badge-key");
    const badge = BADGES.find((b) => b.key === key);
    if (!badge) return;
    el.addEventListener("click", () => openModal(badge));
  });
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
  updateChallengeDate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserStats(user);
    } else {
      window.location.href = "./login.html";
    }
  });
});
