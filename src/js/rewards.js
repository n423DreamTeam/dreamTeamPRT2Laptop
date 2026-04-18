import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app, db } from "../../firebase.js";
import { ensurePushTokenForUser } from "./push-notifications.js";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const auth = getAuth(app);

const PROGRESS_KEY = "dt_user_progress_v1";

const BADGE_THRESHOLDS = {
  firstWin: 1,
  hotStreak: 5,
  perfectLineup: 1,
  statMaster: 10,
};

const FAN_PERKS = [
  {
    id: "merch-5",
    title: "Pacers Store 5% Off",
    description: "Redeem for 5% off one Pacers Store merch order.",
    cost: 2500,
    type: "discount",
    discountPercent: 5,
    codePrefix: "PACER5",
    limitWindow: "day",
    limitCount: 1,
  },
  {
    id: "merch-10",
    title: "Pacers Store 10% Off",
    description: "Higher tier code for fans who keep winning challenges.",
    cost: 7000,
    type: "discount",
    discountPercent: 10,
    codePrefix: "PACER10",
    limitWindow: "week",
    limitCount: 1,
  },
  {
    id: "raffle-entry",
    title: "Signed Gear Raffle Entry",
    description: "Enter monthly raffle for signed Pacers gear.",
    cost: 1200,
    type: "raffle",
    codePrefix: "RAFFLE",
    limitWindow: "week",
    limitCount: 2,
  },
  {
    id: "vip-wallpaper",
    title: "VIP Wallpaper Pack",
    description: "Unlock exclusive mobile/desktop Pacers fan wallpapers.",
    cost: 800,
    type: "digital",
    codePrefix: "VIP",
    limitWindow: "day",
    limitCount: 1,
  },
];

let activeUser = null;
let activeUserData = {};
let activePoints = 0;
let pendingPerkId = null;
let latestMerchReceipt = null;

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

async function postFunctionWithFallback(functionName, user, payload, errorMessage) {
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
        throw new Error(result?.error || errorMessage);
      }

      return result;
    } catch (error) {
      lastError = error;
      if (!isNetworkFetchError(error) || isLastAttempt) {
        throw error;
      }
    }
  }

  throw lastError || new Error(errorMessage);
}

async function sendAdminTestPush(user, title, body) {
  const safeTitle = String(title || "DreamTeam Admin Test").trim();
  const safeBody = String(body || "Push notifications are working for your account.").trim();
  await ensurePushTokenForUser(user);
  return postFunctionWithFallback(
    "adminSendPushTest",
    user,
    {
      uid: user.uid,
      title: safeTitle,
      body: safeBody,
      data: {
        source: "admin-test",
        path: "/rewards.html",
      },
    },
    "Could not send test push."
  );
}

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

function normalizePoints(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

async function loadUserStats(user) {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const data = userDoc.data();
      activeUserData = data;
      const localProgress = getLocalProgress();
      const localPoints = normalizePoints(localProgress.points, 0);
      let serverPoints = normalizePoints(data.points, 0);

      // One-time migration path: if server points are missing but local points exist,
      // sync local points to Firestore so spend checks and UI stay aligned.
      if (serverPoints <= 0 && localPoints > 0) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            points: localPoints,
            lastPlayedAt: serverTimestamp(),
          },
          { merge: true }
        );
        serverPoints = localPoints;
        activeUserData = { ...data, points: localPoints };
      }

      const points = serverPoints;
      const wins = Math.max(data.wins || 0, localProgress.wins || 0);
      const challengesCompleted =
        data.challengesCompleted || wins || localProgress.wins || 0;
      activePoints = points;

      setPointsDisplays(points);

      updateBadges(challengesCompleted, data);
      renderFanPerks(points, data);
      hydrateLatestMerchReceipt(data);
      setupAdminExport(user, data);
    } else {
      const localProgress = getLocalProgress();
      const localPoints = normalizePoints(localProgress.points, 0);
      const localWins = normalizePoints(localProgress.wins, 0);

      // First-time migration: if user doc is missing, seed it from local progress
      // so spend transactions and UI use the same point balance.
      if (localPoints > 0 || localWins > 0) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            points: localPoints,
            wins: localWins,
            challengesCompleted: localWins,
            lastPlayedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      activeUserData = {};
      activePoints = localPoints;
      setPointsDisplays(localPoints);
      updateBadges(localProgress.wins || 0, {});
      renderFanPerks(localPoints, {});
      hydrateLatestMerchReceipt({});
      setupAdminExport(user, {});
    }
  } catch (error) {
    console.error("Error loading user stats:", error);
    const localProgress = getLocalProgress();
    activeUserData = {};
    activePoints = localProgress.points || 0;
    setPointsDisplays(localProgress.points || 0);
    updateBadges(localProgress.wins || 0, {});
    renderFanPerks(localProgress.points || 0, {});
    hydrateLatestMerchReceipt({});
    setupAdminExport(user, {});
  }
}

function formatDateDisplay(isoString) {
  try {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

function getIsoWeekKey(dateObj) {
  const date = new Date(
    Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  );
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function getWindowKey(windowType, isoDateString) {
  const dateObj = isoDateString ? new Date(isoDateString) : new Date();
  if (Number.isNaN(dateObj.getTime())) return null;

  if (windowType === "week") {
    return getIsoWeekKey(dateObj);
  }

  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dateObj.getDate()).padStart(2, "0")}`;
}

function getPerkLimitUsage(redemptions, perk) {
  const currentWindowKey = getWindowKey(perk.limitWindow);
  const used = redemptions.filter((entry) => {
    if (entry.perkId !== perk.id) return false;
    const entryWindow = getWindowKey(perk.limitWindow, entry.redeemedAt);
    return entryWindow && entryWindow === currentWindowKey;
  }).length;

  return {
    used,
    remaining: Math.max(0, perk.limitCount - used),
    reached: used >= perk.limitCount,
  };
}

function getPerkLimitText(perk, usage) {
  const windowText = perk.limitWindow === "week" ? "this week" : "today";
  return `${usage.remaining} of ${perk.limitCount} left ${windowText}`;
}

function canUserSeeAdminExport(user, userData) {
  const roleFlag = userData?.isAdmin || userData?.role === "admin";
  const email = (user?.email || "").toLowerCase();
  const keywordMatch = ADMIN_EMAIL_KEYWORDS.some((keyword) =>
    email.includes(keyword)
  );
  return Boolean(roleFlag || keywordMatch);
}

function generateRewardCode(prefix = "PACER") {
  const now = new Date();
  const stamp = `${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${randomPart}`;
}

function getRedemptions(userData) {
  return Array.isArray(userData.rewardRedemptions)
    ? [...userData.rewardRedemptions]
    : [];
}

function setPointsDisplays(points) {
  const pointsElement = document.getElementById("user-points");
  if (pointsElement) pointsElement.textContent = points;

  const heroPointsElement = document.getElementById("user-points-hero");
  if (heroPointsElement) heroPointsElement.textContent = points;
}

function getMerch5ReceiptPayload(entry) {
  if (!entry) return null;
  return {
    title: "Pacers Store 5% Off",
    code: entry.code || "",
    redeemedAt: entry.redeemedAt || new Date().toISOString(),
    userEmail: activeUser?.email || "DreamTeam User",
  };
}

function buildOfflineQrPayload(receipt) {
  return `DreamTeam Reward\nPerk: ${receipt.title}\nCode: ${receipt.code}\nUser: ${receipt.userEmail}\nRedeemed: ${receipt.redeemedAt}`;
}

async function generateOfflineQrDataUrl(receipt) {
  return QRCode.toDataURL(buildOfflineQrPayload(receipt), {
    width: 220,
    margin: 1,
    color: {
      dark: "#0b1839",
      light: "#ffffff",
    },
  });
}

async function showMerchReceipt(receipt) {
  const panel = document.getElementById("merch-receipt");
  const codeEl = document.getElementById("receipt-code");
  const dateEl = document.getElementById("receipt-date");
  const qrEl = document.getElementById("receipt-qr");
  if (!panel || !codeEl || !dateEl || !qrEl) return;

  latestMerchReceipt = receipt;
  codeEl.textContent = receipt.code;
  dateEl.textContent = `Redeemed: ${formatDateDisplay(receipt.redeemedAt)}`;
  panel.style.display = "block";

  try {
    const qrDataUrl = await generateOfflineQrDataUrl(receipt);
    qrEl.src = qrDataUrl;
  } catch {
    qrEl.removeAttribute("src");
    setFeedback(
      "Redemption saved, but QR preview could not be generated right now.",
      "error"
    );
  }
}

function hydrateLatestMerchReceipt(userData) {
  const latest = getRedemptions(userData)
    .filter((entry) => entry.perkId === "merch-5")
    .sort(
      (a, b) =>
        new Date(b.redeemedAt || 0).getTime() -
        new Date(a.redeemedAt || 0).getTime()
    )[0];

  if (!latest) {
    const panel = document.getElementById("merch-receipt");
    if (panel) panel.style.display = "none";
    latestMerchReceipt = null;
    return;
  }

  const payload = getMerch5ReceiptPayload(latest);
  if (payload) {
    showMerchReceipt(payload).catch(() => {
      setFeedback("Could not render receipt QR right now.", "error");
    });
  }
}

async function generateReceiptQrDataUrl(receipt) {
  return generateOfflineQrDataUrl(receipt);
}

async function downloadReceiptPdf(receipt) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const qrDataUrl = await generateReceiptQrDataUrl(receipt);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 595, 842, "F");
  doc.setFillColor(24, 39, 90);
  doc.roundedRect(margin, margin, 595 - margin * 2, 320, 12, 12, "F");

  doc.setTextColor(255, 203, 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("DreamTeam Reward Receipt", margin + 20, margin + 42);

  doc.setFontSize(14);
  doc.setTextColor(230, 236, 247);
  doc.text(receipt.title, margin + 20, margin + 74);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(12);
  doc.text(`Code: ${receipt.code}`, margin + 20, margin + 108);
  doc.text(`User: ${receipt.userEmail}`, margin + 20, margin + 130);
  doc.text(`Redeemed: ${formatDateDisplay(receipt.redeemedAt)}`, margin + 20, margin + 152);
  doc.text("Discount: 5% off one Pacers Store merch order", margin + 20, margin + 174);
  doc.text("Present this code/QR during checkout.", margin + 20, margin + 196);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + 360, margin + 86, 150, 150, 10, 10, "F");
  doc.addImage(qrDataUrl, "PNG", margin + 372, margin + 98, 126, 126);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Pacers fan perks by DreamTeam", margin + 20, margin + 296);

  doc.save(`dreamteam-${receipt.code}-receipt.pdf`);
}

async function downloadOfflineQrImage() {
  if (!latestMerchReceipt) return;
  const dataUrl = await generateOfflineQrDataUrl(latestMerchReceipt);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `dreamteam-${latestMerchReceipt.code}-qr.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function setupReceiptActions() {
  const receiptBtn = document.getElementById("download-receipt-btn");
  const qrBtn = document.getElementById("download-qr-btn");
  if (!receiptBtn || !qrBtn) return;

  receiptBtn.addEventListener("click", async () => {
    if (!latestMerchReceipt) return;
    try {
      await downloadReceiptPdf(latestMerchReceipt);
    } catch {
      setFeedback("Could not generate receipt PDF right now.", "error");
    }
  });

  qrBtn.addEventListener("click", async () => {
    if (!latestMerchReceipt) return;
    try {
      await downloadOfflineQrImage();
    } catch {
      setFeedback("Could not download QR image right now.", "error");
    }
  });
}

function renderRedemptionHistory(userData) {
  const list = document.getElementById("redemption-list");
  if (!list) return;

  const redemptions = getRedemptions(userData)
    .sort((a, b) => {
      const aTime = new Date(a.redeemedAt || 0).getTime();
      const bTime = new Date(b.redeemedAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 5);

  if (!redemptions.length) {
    list.innerHTML = "<li>No rewards redeemed yet. Spend points to unlock fan perks.</li>";
    return;
  }

  list.innerHTML = redemptions
    .map(
      (entry) =>
        `<li><strong>${entry.title}</strong> • ${entry.code} • ${formatDateDisplay(
          entry.redeemedAt
        )}</li>`
    )
    .join("");
}

function renderFanPerks(points, userData) {
  const grid = document.getElementById("perks-grid");
  if (!grid) return;

  const redemptions = getRedemptions(userData);

  grid.innerHTML = FAN_PERKS.map((perk) => {
    const limitUsage = getPerkLimitUsage(redemptions, perk);
    const canAfford = points >= perk.cost;
    const canRedeem = canAfford && !limitUsage.reached;
    return `
      <article class="perk-card ${canRedeem ? "" : "locked"}">
        <div class="perk-meta">
          <h4>${perk.title}</h4>
          <p>${perk.description}</p>
          <p class="perk-limit">${getPerkLimitText(perk, limitUsage)}</p>
        </div>
        <div class="perk-actions">
          <span class="perk-cost">${perk.cost.toLocaleString()} pts</span>
          <button class="redeem-btn" data-perk-id="${perk.id}" ${
      canRedeem ? "" : "disabled"
    }>
            ${
              limitUsage.reached
                ? "Limit Reached"
                : canAfford
                ? "Redeem"
                : "Need More Points"
            }
          </button>
        </div>
      </article>
    `;
  }).join("");

  attachRedeemHandlers();
  renderRedemptionHistory(userData);
}

function setFeedback(message, type = "neutral") {
  const feedback = document.getElementById("perk-feedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove("success", "error");
  if (type === "success") feedback.classList.add("success");
  if (type === "error") feedback.classList.add("error");
}

function openRedeemConfirmModal(perk) {
  const modal = document.getElementById("redeem-confirm-modal");
  const title = document.getElementById("redeem-modal-title");
  const desc = document.getElementById("redeem-modal-desc");
  const limit = document.getElementById("redeem-modal-limit");
  if (!modal || !title || !desc || !limit) return;

  const usage = getPerkLimitUsage(getRedemptions(activeUserData), perk);
  pendingPerkId = perk.id;
  title.textContent = `Redeem ${perk.title}`;
  desc.textContent = `Spend ${perk.cost.toLocaleString()} points for this reward?`;
  limit.textContent = `Limit: ${getPerkLimitText(perk, usage)}`;
  modal.style.display = "flex";
}

function closeRedeemConfirmModal() {
  const modal = document.getElementById("redeem-confirm-modal");
  if (!modal) return;
  modal.style.display = "none";
  pendingPerkId = null;
}

function setupRedeemConfirmModalHandlers() {
  const modal = document.getElementById("redeem-confirm-modal");
  const cancelBtn = document.getElementById("redeem-modal-cancel");
  const confirmBtn = document.getElementById("redeem-modal-confirm");
  if (!modal || !cancelBtn || !confirmBtn) return;

  cancelBtn.addEventListener("click", closeRedeemConfirmModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeRedeemConfirmModal();
  });

  confirmBtn.addEventListener("click", async () => {
    if (!pendingPerkId) {
      setFeedback("No reward selected. Please try redeeming again.", "error");
      return;
    }

    const originalLabel = confirmBtn.textContent;
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Processing...";

    const selectedPerkId = pendingPerkId;
    closeRedeemConfirmModal();
    try {
      await redeemPerk(selectedPerkId);
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = originalLabel;
    }
  });
}

function toCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename, rows) {
  const content = rows.map((row) => row.map(toCsvValue).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function exportRedemptionsCsv() {
  const statusEl = document.getElementById("admin-export-status");
  if (statusEl) statusEl.textContent = "Building export...";

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const rows = [
      [
        "uid",
        "displayName",
        "email",
        "perkId",
        "title",
        "cost",
        "code",
        "redeemedAt",
      ],
    ];

    let total = 0;
    usersSnap.forEach((userDoc) => {
      const data = userDoc.data();
      const redemptions = Array.isArray(data.rewardRedemptions)
        ? data.rewardRedemptions
        : [];

      redemptions.forEach((entry) => {
        total += 1;
        rows.push([
          userDoc.id,
          data.displayName || "",
          data.email || "",
          entry.perkId || "",
          entry.title || "",
          entry.cost || "",
          entry.code || "",
          entry.redeemedAt || "",
        ]);
      });
    });

    const stamp = getWindowKey("day").replace(/-/g, "");
    downloadCsv(`dreamteam-redemptions-${stamp}.csv`, rows);
    if (statusEl) {
      statusEl.textContent = `Export ready. ${total} redemption records downloaded.`;
    }
  } catch (error) {
    console.error("Failed to export redemptions", error);
    if (statusEl) statusEl.textContent = "Could not build export right now.";
  }
}

function setupAdminExport(user, userData) {
  const adminPanel = document.getElementById("admin-export");
  const exportBtn = document.getElementById("export-csv-btn");
  const pushBtn = document.getElementById("send-test-push-btn");
  const pushStatus = document.getElementById("admin-push-status");
  const pushTitleInput = document.getElementById("admin-push-title");
  const pushBodyInput = document.getElementById("admin-push-body");
  if (!adminPanel || !exportBtn) return;

  if (!canUserSeeAdminExport(user, userData)) {
    adminPanel.style.display = "none";
    return;
  }

  adminPanel.style.display = "block";
  exportBtn.onclick = () => {
    exportRedemptionsCsv();
  };

  if (!pushBtn || !pushStatus || !pushTitleInput || !pushBodyInput) return;
  pushBtn.onclick = async () => {
    const originalLabel = pushBtn.textContent;
    const customTitle = pushTitleInput.value;
    const customBody = pushBodyInput.value;
    pushBtn.disabled = true;
    pushBtn.textContent = "Sending...";
    pushStatus.textContent = "Sending push notification...";
    try {
      const result = await sendAdminTestPush(user, customTitle, customBody);
      pushStatus.textContent = `Push sent. Success: ${result.successCount || 0}, Failed: ${
        result.failureCount || 0
      }.`;
    } catch (error) {
      pushStatus.textContent = error?.message || "Could not send test push.";
    } finally {
      pushBtn.disabled = false;
      pushBtn.textContent = originalLabel;
    }
  };
}

async function redeemPerk(perkId) {
  const perk = FAN_PERKS.find((p) => p.id === perkId);
  if (!perk) {
    setFeedback("That reward is unavailable right now.", "error");
    return;
  }

  if (!activeUser) {
    setFeedback("Still loading your account. Try again in a second.", "error");
    return;
  }

  const currentRedemptions = getRedemptions(activeUserData);
  const limitUsage = getPerkLimitUsage(currentRedemptions, perk);

  if (limitUsage.reached) {
    setFeedback("You reached this perk's redemption limit for the current period.", "error");
    return;
  }

  if (activePoints < perk.cost) {
    setFeedback("Not enough points yet. Keep playing daily challenges.", "error");
    return;
  }

  const rewardCode = generateRewardCode(perk.codePrefix);
  const redeemedAt = new Date().toISOString();
  const userRef = doc(db, "users", activeUser.uid);

  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRef);
      const data = snap.exists() ? snap.data() : {};
      const serverPoints = normalizePoints(data.points, 0);
      const localPoints = normalizePoints(getLocalProgress().points, 0);
      const effectivePoints =
        serverPoints < perk.cost && localPoints > serverPoints
          ? localPoints
          : serverPoints;
      const serverRedemptions = Array.isArray(data.rewardRedemptions)
        ? data.rewardRedemptions
        : [];
      const serverLimitUsage = getPerkLimitUsage(serverRedemptions, perk);

      if (effectivePoints < perk.cost) {
        throw new Error("INSUFFICIENT_POINTS");
      }

      if (serverLimitUsage.reached) {
        throw new Error("LIMIT_REACHED");
      }

      tx.set(
        userRef,
        {
          points: effectivePoints - perk.cost,
          rewardRedemptions: arrayUnion({
            perkId: perk.id,
            title: perk.title,
            cost: perk.cost,
            code: rewardCode,
            redeemedAt,
            limitWindow: perk.limitWindow,
          }),
          lastPlayedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    activePoints -= perk.cost;
    activeUserData = {
      ...activeUserData,
      rewardRedemptions: [
        ...(Array.isArray(activeUserData.rewardRedemptions)
          ? activeUserData.rewardRedemptions
          : []),
        {
          perkId: perk.id,
          title: perk.title,
          cost: perk.cost,
          code: rewardCode,
          redeemedAt,
        },
      ],
    };

    const localProgress = getLocalProgress();
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        ...localProgress,
        points: Math.max(0, activePoints),
      })
    );

    setPointsDisplays(activePoints);

    const perkLabel = perk.type === "discount" ? "discount code" : "perk code";
    setFeedback(
      `Redeemed ${perk.title}. Your ${perkLabel}: ${rewardCode}`,
      "success"
    );

    if (perk.id === "merch-5") {
      const receiptPayload = getMerch5ReceiptPayload({
        code: rewardCode,
        redeemedAt,
      });
      if (receiptPayload) {
        showMerchReceipt(receiptPayload).catch(() => {
          setFeedback("Could not render receipt QR right now.", "error");
        });
      }
    }

    renderFanPerks(activePoints, activeUserData);
  } catch (error) {
    if (error?.message === "INSUFFICIENT_POINTS") {
      await loadUserStats(activeUser);
      setFeedback(
        `Not enough spendable points on your account for this reward. Current points: ${activePoints}.`,
        "error"
      );
      return;
    }
    if (error?.message === "LIMIT_REACHED") {
      setFeedback(
        "Limit reached for this perk period. Try a different perk or come back later.",
        "error"
      );
      await loadUserStats(activeUser);
      return;
    }
    console.error("Could not redeem perk", error);
    setFeedback("Could not redeem right now. Please try again.", "error");
  }
}

function attachRedeemHandlers() {
  const buttons = document.querySelectorAll(".redeem-btn[data-perk-id]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const perkId = btn.getAttribute("data-perk-id");
      const perk = FAN_PERKS.find((entry) => entry.id === perkId);
      if (!perk) return;
      openRedeemConfirmModal(perk);
    });
  });
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
  setupRedeemConfirmModalHandlers();
  setupReceiptActions();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      activeUser = user;
      loadUserStats(user);
    } else {
      window.location.href = "./login.html";
    }
  });
});
