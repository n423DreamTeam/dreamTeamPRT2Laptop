import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { app, auth, db } from "../../firebase.js";
import { ensurePushTokenForUser } from "./push-notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const playersContainer = document.querySelector(".players");
  const pointsBar = document.querySelector("#points-bar");
  const assistsBar = document.querySelector("#assists-bar");
  let pointsVal = document.querySelector("#points-val");
  let assistsVal = document.querySelector("#assists-val");
  const refreshBtn = document.getElementById("refresh-btn");
  const previewPushBtn = document.getElementById("dashboard-push-preview-btn");
  const previewPushStatus = document.getElementById(
    "dashboard-push-preview-status"
  );

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3001/api"
      : "/api";

  let allPlayersPool = [];
  let playersData = [];
  let lineup = [];
  const MAX_LINEUP_SIZE = 5;

  let goalPoints = 150;
  let goalAssists = 50;

  const PROGRESS_KEY = "dt_user_progress_v1";
  const POP_QUIZ_REWARD = 5000;
  const POP_QUIZ_LENGTH = 5;
  const POP_QUIZ_PASS_SCORE = 5;
  const POP_QUIZ_CLAIM_KEY = "dt_pop_quiz_claims_v1";
  const POP_QUIZ_QUESTION_BANK = [
    {
      prompt:
        "In a standard NBA game, how many personal fouls disqualify a player?",
      options: ["5", "6", "7", "8"],
      correct: "6",
    },
    {
      prompt: "How many seconds can an offensive player stay in the lane?",
      options: ["2 seconds", "3 seconds", "4 seconds", "5 seconds"],
      correct: "3 seconds",
    },
    {
      prompt:
        "Which stat is credited to the player who passes directly to a made basket?",
      options: ["Steal", "Assist", "Usage", "Deflection"],
      correct: "Assist",
    },
    {
      prompt: "How many players from one team are on the court at once?",
      options: ["4", "5", "6", "7"],
      correct: "5",
    },
    {
      prompt:
        "What is the value of a made shot from beyond the three-point line?",
      options: ["1 point", "2 points", "3 points", "4 points"],
      correct: "3 points",
    },
    {
      prompt: "How long is the NBA shot clock on a new possession?",
      options: ["20 seconds", "22 seconds", "24 seconds", "30 seconds"],
      correct: "24 seconds",
    },
    {
      prompt: "Which turnover occurs when a player takes too many steps without dribbling?",
      options: ["Double dribble", "Carrying", "Traveling", "Backcourt"],
      correct: "Traveling",
    },
    {
      prompt: "How many periods are played in a regulation NBA game?",
      options: ["2", "3", "4", "5"],
      correct: "4",
    },
  ];
  let userProgress = { points: 0, wins: 0 };
  let firebaseUser = null;
  let canUseDashboardPushPreview = false;
  let challengeCompleted = false;
  let popQuizClaimedToday = false;
  let popQuizClaimStateLoading = true;
  const ADMIN_EMAIL_KEYWORDS = ["megan"];

  function getFunctionUrls(functionName) {
    const projectId = app?.options?.projectId || "";
    const cloudUrl = `https://us-central1-${projectId}.cloudfunctions.net/${functionName}`;
    if (window.location.hostname === "localhost") {
      const emulatorUrl = `http://127.0.0.1:5001/${projectId}/us-central1/${functionName}`;
      return [emulatorUrl, cloudUrl];
    }
    return [cloudUrl];
  }

  function isNetworkFetchError(error) {
    const message = String(error?.message || "");
    return error instanceof TypeError || /failed to fetch|networkerror/i.test(message);
  }

  async function postFunctionWithFallback(functionName, user, payload) {
    const idToken = await user.getIdToken();
    const urls = getFunctionUrls(functionName);
    let lastError = null;

    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index];
      const isLastAttempt = index === urls.length - 1;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result?.error || "Could not send preview push.");
        }

        return result;
      } catch (error) {
        lastError = error;
        if (!isNetworkFetchError(error) || isLastAttempt) {
          throw error;
        }
      }
    }

    throw lastError || new Error("Could not send preview push.");
  }

  function isAdminUser(user, userData = {}) {
    const roleFlag = userData?.isAdmin || userData?.role === "admin";
    const email = String(user?.email || "").toLowerCase();
    const keywordMatch = ADMIN_EMAIL_KEYWORDS.some((keyword) =>
      email.includes(keyword)
    );
    return Boolean(roleFlag || keywordMatch);
  }

  function updateDashboardPushPreviewUi() {
    if (!previewPushBtn || !previewPushStatus) return;

    if (!canUseDashboardPushPreview) {
      previewPushBtn.style.display = "none";
      previewPushStatus.style.display = "none";
      previewPushStatus.textContent = "";
      return;
    }

    previewPushBtn.style.display = "block";
    previewPushStatus.style.display = "block";
    if (!previewPushStatus.textContent) {
      previewPushStatus.textContent = "Send a preview notification to this account.";
    }
  }

  async function sendDashboardPreviewPush() {
    if (!firebaseUser) throw new Error("Sign in required.");
    await ensurePushTokenForUser(firebaseUser);
    return postFunctionWithFallback("adminSendPushTest", firebaseUser, {
        uid: firebaseUser.uid,
        title: "DreamTeam Push Preview",
        body: "This is how your live push notifications will look.",
        data: {
          source: "dashboard-preview",
          path: "/dashboard.html",
        },
      });
  }

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

  function getTodayStamp() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function getClaimIdentity(uid) {
    return uid || null;
  }

  function setLocalPopQuizClaimDate(uid, dateStamp) {
    try {
      const identity = getClaimIdentity(uid);
      if (!identity) return;

      const raw = localStorage.getItem(POP_QUIZ_CLAIM_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const claimsByUser = parsed?.claimsByUser || {};

      if (dateStamp) {
        claimsByUser[identity] = dateStamp;
      } else {
        delete claimsByUser[identity];
      }

      localStorage.setItem(
        POP_QUIZ_CLAIM_KEY,
        JSON.stringify({ claimsByUser })
      );
    } catch (e) {
      console.warn("Could not update local pop quiz claim state:", e);
    }
  }

  function loadPopQuizClaimState(uid) {
    try {
      const raw = localStorage.getItem(POP_QUIZ_CLAIM_KEY);
      if (!raw) {
        popQuizClaimedToday = false;
        return;
      }

      const parsed = JSON.parse(raw);
      const identity = getClaimIdentity(uid);

      if (!identity) {
        popQuizClaimedToday = false;
        return;
      }

      // Backward compatibility: previous format stored only one global date.
      if (parsed?.lastClaimedDate) {
        popQuizClaimedToday = false;
        return;
      }

      const claimsByUser = parsed?.claimsByUser || {};
      popQuizClaimedToday = claimsByUser[identity] === getTodayStamp();
    } catch (e) {
      console.warn("Could not load pop quiz claim state:", e);
      popQuizClaimedToday = false;
    }
  }

  function markPopQuizClaimedToday(uid) {
    setLocalPopQuizClaimDate(uid, getTodayStamp());
    popQuizClaimedToday = true;
  }

  function updatePopQuizUi() {
    const quizBtn = document.getElementById("pop-quiz-btn");
    const quizStatus = document.getElementById("pop-quiz-status");
    if (!quizBtn || !quizStatus) return;

    if (popQuizClaimStateLoading) {
      quizBtn.disabled = true;
      quizBtn.textContent = "⏳ Syncing Quiz";
      quizStatus.textContent = "Syncing your quiz bonus status...";
      return;
    }

    if (popQuizClaimedToday) {
      quizBtn.disabled = true;
      quizBtn.textContent = "✅ Bonus Claimed";
      quizStatus.textContent = "You already earned your 5,000 quiz points today.";
    } else {
      quizBtn.disabled = false;
      quizBtn.textContent = "🧠 Pop Quiz (+5000)";
      quizStatus.textContent = "Answer 5 hard questions and score a perfect 5/5 for the 5,000 point bonus.";
    }
  }

  function openPopQuizModal() {
    if (popQuizClaimStateLoading) {
      updatePopQuizUi();
      return;
    }

    if (popQuizClaimedToday) {
      updatePopQuizUi();
      return;
    }

    const selectedQuestions = [...POP_QUIZ_QUESTION_BANK]
      .sort(() => Math.random() - 0.5)
      .slice(0, POP_QUIZ_LENGTH);

    let currentIndex = 0;
    let correctAnswers = 0;

    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(3, 8, 29, 0.8);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
      width: min(560px, 100%);
      background: linear-gradient(145deg, rgba(22, 36, 97, 0.98), rgba(13, 22, 62, 0.98));
      border: 1px solid rgba(255, 203, 5, 0.45);
      border-radius: 16px;
      color: #fff;
      padding: 1.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
      font-family: Arial, sans-serif;
    `;

    card.innerHTML = `
      <h3 style="margin: 0 0 0.5rem 0; color: #ffcb05; font-size: 1.6rem;">Pop Quiz</h3>
      <p style="margin: 0 0 0.4rem 0; color: rgba(255,255,255,0.88);">
        Answer ${POP_QUIZ_LENGTH} questions. Score at least ${POP_QUIZ_PASS_SCORE}/${POP_QUIZ_LENGTH} to earn
        <strong style="color:#ffcb05;">+${POP_QUIZ_REWARD}</strong> points.
      </p>
      <p id="quiz-progress" style="margin: 0 0 1rem 0; color: rgba(255,255,255,0.75); font-size: 0.95rem;"></p>
      <p id="quiz-prompt" style="margin: 0 0 1rem 0; font-size: 1.1rem; line-height: 1.4;"></p>
      <div class="quiz-options" style="display: grid; gap: 0.7rem;"></div>
      <p id="quiz-feedback" style="min-height: 1.4em; margin: 1rem 0 0; font-weight: 700;"></p>
      <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
        <button id="quiz-close-btn" type="button" style="background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 0.55rem 0.9rem; cursor: pointer;">Close</button>
      </div>
    `;

    modal.appendChild(card);
    document.body.appendChild(modal);

    const optionsWrap = card.querySelector(".quiz-options");
    const progressEl = card.querySelector("#quiz-progress");
    const promptEl = card.querySelector("#quiz-prompt");
    const feedback = card.querySelector("#quiz-feedback");
    const closeBtn = card.querySelector("#quiz-close-btn");

    function renderQuizQuestion() {
      const activeQuestion = selectedQuestions[currentIndex];
      progressEl.textContent = `Question ${currentIndex + 1} of ${POP_QUIZ_LENGTH}`;
      promptEl.textContent = activeQuestion.prompt;
      feedback.textContent = "";
      optionsWrap.innerHTML = "";

      activeQuestion.options.forEach((opt) => {
        const optionBtn = document.createElement("button");
        optionBtn.type = "button";
        optionBtn.textContent = opt;
        optionBtn.style.cssText = `
          text-align: left;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          cursor: pointer;
          font-size: 0.98rem;
        `;

        optionBtn.addEventListener("click", () => {
          const isCorrect = opt === activeQuestion.correct;
          if (isCorrect) {
            correctAnswers += 1;
            feedback.textContent = "Correct.";
            feedback.style.color = "#7dffae";
            optionBtn.style.borderColor = "#7dffae";
            optionBtn.style.background = "rgba(125, 255, 174, 0.2)";
          } else {
            feedback.textContent = `Incorrect. Correct answer: ${activeQuestion.correct}`;
            feedback.style.color = "#ff9f9f";
            optionBtn.style.borderColor = "#ff9f9f";
            optionBtn.style.background = "rgba(255, 121, 121, 0.18)";
          }

          optionsWrap.querySelectorAll("button").forEach((btn) => {
            btn.disabled = true;
            btn.style.opacity = "0.8";
            if (btn.textContent === activeQuestion.correct) {
              btn.style.borderColor = "#7dffae";
            }
          });

          setTimeout(() => {
            currentIndex += 1;
            if (currentIndex < POP_QUIZ_LENGTH) {
              renderQuizQuestion();
              return;
            }

            optionsWrap.innerHTML = "";
            progressEl.textContent = `Final Score: ${correctAnswers}/${POP_QUIZ_LENGTH}`;

            if (correctAnswers >= POP_QUIZ_PASS_SCORE) {
              userProgress.points += POP_QUIZ_REWARD;
              saveProgress();
              renderUserPointsHud();
              markPopQuizClaimedToday(firebaseUser?.uid);
              syncPopQuizClaimToFirestore(firebaseUser?.uid);
              updatePopQuizUi();
              showRewardToast(POP_QUIZ_REWARD);
              syncProgressToFirestore({
                pointsDelta: POP_QUIZ_REWARD,
                winIncrement: 0,
                perfectChallengeAchieved: false,
              });

              if (playersData.length) {
                displayPlayers(playersData);
              }

              promptEl.textContent = "Quiz complete.";
              feedback.textContent = `You passed and earned +${POP_QUIZ_REWARD} points.`;
              feedback.style.color = "#7dffae";
            } else {
              promptEl.textContent = "Quiz complete.";
              feedback.textContent = `You need ${POP_QUIZ_PASS_SCORE}/${POP_QUIZ_LENGTH} to pass. Try again tomorrow.`;
              feedback.style.color = "#ff9f9f";
            }
          }, 700);
        });

        optionsWrap.appendChild(optionBtn);
      });
    }

    renderQuizQuestion();

    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  loadProgress();
  loadPopQuizClaimState();

  async function hydrateProgressFromFirestore(user) {
    if (!db || !user) return;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        userProgress.points = data.points ?? userProgress.points;
        userProgress.wins =
          data.challengesCompleted ?? data.wins ?? userProgress.wins;

        const claimedStamp = data.popQuizLastClaimedDate;
        if (typeof claimedStamp === "string") {
          popQuizClaimedToday = claimedStamp === getTodayStamp();
          setLocalPopQuizClaimDate(user.uid, claimedStamp);
        }

        saveProgress();
        renderUserPointsHud();
        updatePopQuizUi();
        return data;
      }
    } catch (e) {
      console.warn("Could not hydrate progress from Firestore", e);
    }
    return {};
  }

  async function syncPopQuizClaimToFirestore(uid) {
    if (!db || !uid) return;
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          popQuizLastClaimedDate: getTodayStamp(),
          popQuizLastClaimedAt: serverTimestamp(),
          lastPlayedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Could not sync pop quiz claim to Firestore", e);
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

  function renderUserPointsHud() {
    let hud = document.querySelector(".user-points-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.className = "user-points-hud";
      hud.style.cssText =
        "position: fixed; right: 3rem; top: 10rem; color: #fff; background: rgba(0,0,0,0.4); padding: 0.7rem 1.5rem; border-radius: 10px; font-weight:700; z-index: 999;";
      document.body.appendChild(hud);

      const updateHudPosition = () => {
        if (window.innerWidth <= 600) {
          hud.style.right = "1.2rem";
          hud.style.top = "6.5rem";
          hud.style.padding = "0.75rem 1rem";
          hud.style.fontSize = "0.9rem";
        } else if (window.innerWidth <= 900) {
          hud.style.right = "1.5rem";
          hud.style.top = "7.5rem";
          hud.style.padding = "0.85rem 1.2rem";
          hud.style.fontSize = "0.95rem";
        } else {
          hud.style.right = "3rem";
          hud.style.top = "10rem";
          hud.style.padding = "1rem 1.5rem";
          hud.style.fontSize = "1rem";
        }
      };

      updateHudPosition();
      window.addEventListener("resize", updateHudPosition);
    }
    hud.innerHTML = `Points: <span style='color:#ffcb05'>${userProgress.points}</span> • Wins: ${userProgress.wins}`;
  }

  renderUserPointsHud();
  updatePopQuizUi();

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

    setTimeout(() => {
      toast.style.animation = "slideIn 0.5s ease-out reverse";
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  onAuthStateChanged(auth, async (user) => {
    firebaseUser = user;
    popQuizClaimStateLoading = true;
    updatePopQuizUi();
    loadPopQuizClaimState(user?.uid);

    if (user) {
      const userData = await hydrateProgressFromFirestore(user);
      canUseDashboardPushPreview = isAdminUser(user, userData);
    } else {
      popQuizClaimedToday = false;
      canUseDashboardPushPreview = false;
    }

    popQuizClaimStateLoading = false;
    updatePopQuizUi();
    updateDashboardPushPreviewUi();
  });

  function generateDailyChallenge() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const seed = dayOfYear % 10;

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

  const dailyChallenge = generateDailyChallenge();

  function updateChallengeDisplay() {
    const objectiveText = document.querySelector(".puzzle-objective p");
    if (objectiveText) {
      objectiveText.innerHTML = `Achieve a total team score of <span class="highlight">${goalPoints} points</span> and <span class="highlight">${goalAssists} assists</span> using any 5 players.<br><em style="font-size: 0.9em; color: rgba(255,255,255,0.7);">${dailyChallenge.desc}</em>`;
    }

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

    pointsVal = document.querySelector("#points-val");
    assistsVal = document.querySelector("#assists-val");
  }

  updateChallengeDisplay();

  const currentRoster = [
    { name: "Tyrese Haliburton", pts: 20.1, ast: 10.8, requiredPoints: 1000 },
    { name: "Pascal Siakam", pts: 21.3, ast: 4.8, requiredPoints: 400 },
    { name: "Andrew Nembhard", pts: 9.2, ast: 4.1, requiredPoints: 0 },
    { name: "Aaron Nesmith", pts: 12.2, ast: 1.5, requiredPoints: 200 },
    { name: "Benedict Mathurin", pts: 14.5, ast: 2.0, requiredPoints: 300 },
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
    { name: "Quenton Jackson", pts: 11.8, ast: 3.6, requiredPoints: 100 },
    { name: "Ethan Thompson", pts: 2.0, ast: 1.0, requiredPoints: 0 },
  ];

  function pickRandomPlayers(pool, count = 5) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async function fetchPacersPlayers() {
    const cacheKey = "pacersPlayers_2024";
    allPlayersPool = [...currentRoster];

    try {
      const playersRes = await fetch(`${API_URL}/players?team_id=12`);

      if (playersRes.status === 429) {
        console.warn(
          "⚠️ Server returned 429 Too Many Requests, using current roster only"
        );
      } else if (playersRes.status === 403) {
        console.warn(
          "⚠️ Server returned 403 Forbidden, using current roster only"
        );
      } else if (!playersRes.ok) {
        console.warn(
          `⚠️ Server returned ${playersRes.status}, using current roster only`
        );
      } else {
        const playersData_raw = await playersRes.json();
        const apiPlayers = playersData_raw.data || [];

        console.log(`🟣 Found ${apiPlayers.length} players from API.`);

        const apiFormattedPlayers = apiPlayers
          .map((p) => {
            const existsInRoster = currentRoster.some(
              (cr) =>
                cr.name.toLowerCase() ===
                `${p.first_name} ${p.last_name}`.toLowerCase()
            );

            if (existsInRoster) return null;

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
              requiredPoints:
                pts >= 20
                  ? 1000
                  : pts >= 18
                  ? 400
                  : pts >= 16
                  ? 300
                  : pts >= 14
                  ? 200
                  : 0,
            };
          })
          .filter((p) => p !== null);

        allPlayersPool = [...currentRoster, ...apiFormattedPlayers];
        console.log(
          `✅ Merged current roster (${currentRoster.length}) with API players (${apiFormattedPlayers.length}). Total pool: ${allPlayersPool.length}`
        );
      }
    } catch (err) {
      console.warn(
        "⚠️ API fetch error, using current roster only:",
        err.message
      );
    }

    playersData = pickRandomPlayers(allPlayersPool, 5);
    console.log(
      `✅ Loaded ${allPlayersPool.length} total players (${
        currentRoster.length
      } roster + ${
        allPlayersPool.length - currentRoster.length
      } API); showing ${playersData.length}`
    );
    displayPlayers(playersData);
  }

  function displayPlayers(players) {
    const visible = players.slice(0, 5);

    if (!visible.length) {
      playersContainer.innerHTML = `<p style="color:yellow">No Pacers found.</p>`;
      return;
    }
    playersContainer.innerHTML = visible
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

    playersContainer.querySelectorAll(".player").forEach((playerEl) => {
      const isLocked = playerEl.classList.contains("locked");
      const name = playerEl.getAttribute("data-name");
      if (!isLocked) {
        playerEl.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", name.toUpperCase());
        });

        playerEl.addEventListener("click", () => {
          const player = players.find(
            (p) => p.name.toUpperCase() === name.toUpperCase()
          );
          addPlayerToLineup(player);
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

  fetchPacersPlayers();

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
    const reward = Math.max(25, Math.round(goalPoints * 0.2));
    const previousPoints = userProgress.points;
    userProgress.points += reward;
    userProgress.wins += 1;
    saveProgress();
    renderUserPointsHud();

    showRewardToast(reward);

    const perfectChallengeAchieved =
      totalPoints >= goalPoints * 1.5 && totalAssists >= goalAssists * 1.5;

    syncProgressToFirestore({
      pointsDelta: reward,
      winIncrement: 1,
      perfectChallengeAchieved,
    });

    const newlyUnlockedPlayers = currentRoster.filter((player) => {
      const wasLocked = previousPoints < player.requiredPoints;
      const isNowUnlocked = userProgress.points >= player.requiredPoints;
      return wasLocked && isNowUnlocked && player.requiredPoints > 0;
    });

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

    document.getElementById("play-again-btn").addEventListener("click", () => {
      modal.remove();
      lineup = [];
      challengeCompleted = false;
      dropZone.innerHTML = `<p><strong>BUILD YOUR DREAMTEAM</strong><br>Drag & Drop players into this area</p>`;
      updateBars();
      fetchPacersPlayers();
    });

    document.getElementById("close-popup-btn").addEventListener("click", () => {
      modal.remove();
    });

    displayPlayers(playersData);
  }

  function createLineupTag(name) {
    const tag = document.createElement("div");
    tag.className = "lineup-player";

    const playerContent = document.createElement("span");
    playerContent.className = "player-content";
    playerContent.textContent = name;
    tag.appendChild(playerContent);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-player-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      lineup = lineup.filter(
        (p) => p.name.toUpperCase() !== name.toUpperCase()
      );
      tag.remove();
      updateBars();

      if (lineup.length === 0) {
        const defaultText = dropZone.querySelector("p");
        if (defaultText) {
          defaultText.style.display = "block";
        }
      }
    });
    tag.appendChild(removeBtn);

    const defaultText = dropZone.querySelector("p");
    if (defaultText) {
      defaultText.style.display = "none";
    }

    let clearBtn = dropZone.querySelector(".clear-btn");
    if (!clearBtn) {
      clearBtn = document.createElement("button");
      clearBtn.className = "clear-btn";
      clearBtn.textContent = "✕ Clear";
      clearBtn.addEventListener("click", () => {
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

    if (clearBtn) {
      dropZone.insertBefore(tag, clearBtn);
    } else {
      dropZone.appendChild(tag);
    }
  }

  function addPlayerToLineup(player) {
    if (!player) return;

    const exists = lineup.some(
      (p) => p.name.toUpperCase() === player.name.toUpperCase()
    );
    if (exists || lineup.length >= MAX_LINEUP_SIZE) return;

    lineup.push(player);
    createLineupTag(player.name);
    updateBars();
  }

  dropZone.addEventListener("dragover", (e) => e.preventDefault());
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const name = e.dataTransfer.getData("text/plain").trim();
    const player = playersData.find((p) => p.name.toUpperCase() === name);
    addPlayerToLineup(player);
  });

  refreshBtn.addEventListener("click", () => {
    fetchPacersPlayers();
  });

  const popQuizBtn = document.getElementById("pop-quiz-btn");
  if (popQuizBtn) {
    popQuizBtn.addEventListener("click", openPopQuizModal);
  }

  if (previewPushBtn && previewPushStatus) {
    previewPushBtn.addEventListener("click", async () => {
      if (!canUseDashboardPushPreview) return;
      const originalLabel = previewPushBtn.textContent;
      previewPushBtn.disabled = true;
      previewPushBtn.textContent = "Sending...";
      previewPushStatus.textContent = "Sending preview push...";
      try {
        const result = await sendDashboardPreviewPush();
        previewPushStatus.textContent = `Preview sent. Success: ${
          result.successCount || 0
        }, Failed: ${result.failureCount || 0}.`;
      } catch (error) {
        previewPushStatus.textContent =
          error?.message || "Could not send preview push.";
      } finally {
        previewPushBtn.disabled = false;
        previewPushBtn.textContent = originalLabel;
      }
    });
  }
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

  if (banner) {
    banner.addEventListener("mouseenter", stopAutoRotate);
    banner.addEventListener("mouseleave", () => startAutoRotate(3500));
  }

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
