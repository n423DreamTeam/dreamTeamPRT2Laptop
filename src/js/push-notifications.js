import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "../../firebase.js";

let initializedUid = null;
let foregroundListenerAttached = false;
let activePushUser = null;
let pendingPushToken = null;
let retryBusy = false;
const PUSH_ICON_URL = "/icons/dt-android-notif-icon.png?v=2";
const PUSH_BADGE_URL = "/icons/dt-android-notif-badge.png?v=2";

function canUsePushApi() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

function getVapidKey() {
  return import.meta.env.VITE_FIREBASE_VAPID_KEY || "";
}

function removePushRetryBanner() {
  const banner = document.getElementById("push-retry-banner");
  if (banner) banner.remove();
}

function showPushRetryBanner(user, message) {
  activePushUser = user;

  let banner = document.getElementById("push-retry-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "push-retry-banner";
    banner.style.cssText = [
      "position:fixed",
      "left:1rem",
      "bottom:1rem",
      "z-index:10002",
      "max-width:350px",
      "background:#7f1d1d",
      "color:#fee2e2",
      "padding:0.9rem",
      "border-radius:12px",
      "box-shadow:0 12px 24px rgba(2,6,23,0.35)",
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
      "border:1px solid rgba(254,202,202,0.3)",
    ].join(";");

    banner.innerHTML = `
      <div id="push-retry-message" style="font-size:0.9rem;line-height:1.35;margin-bottom:0.65rem;"></div>
      <div style="display:flex;gap:0.55rem;justify-content:flex-end;">
        <button id="push-retry-dismiss" style="background:#450a0a;color:#fee2e2;border:none;padding:0.45rem 0.65rem;border-radius:8px;cursor:pointer;">Dismiss</button>
        <button id="push-retry-btn" style="background:#fca5a5;color:#111827;border:none;padding:0.45rem 0.65rem;border-radius:8px;cursor:pointer;font-weight:700;">Retry</button>
      </div>
    `;

    document.body.appendChild(banner);

    const dismissBtn = document.getElementById("push-retry-dismiss");
    const retryBtn = document.getElementById("push-retry-btn");

    dismissBtn?.addEventListener("click", removePushRetryBanner);
    retryBtn?.addEventListener("click", async () => {
      if (!activePushUser || retryBusy) return;
      retryBusy = true;
      const original = retryBtn.textContent;
      retryBtn.disabled = true;
      retryBtn.textContent = "Retrying...";
      try {
        await registerAndStoreToken(activePushUser, pendingPushToken);
      } catch {
        // No-op: registerAndStoreToken will re-show/update banner message.
      } finally {
        retryBusy = false;
        retryBtn.disabled = false;
        retryBtn.textContent = original;
      }
    });
  }

  const messageEl = document.getElementById("push-retry-message");
  if (messageEl) {
    messageEl.textContent = message || "Push setup failed. Tap retry to finish enabling notifications.";
  }
}

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

async function persistPushState(user, token = null) {
  const payload = {
    pushPermission: Notification.permission,
    pushUpdatedAt: serverTimestamp(),
  };

  if (token) {
    payload.pushTokenPending = token;
  }

  await setDoc(doc(db, "users", user.uid), payload, { merge: true });
}

async function registerPushTokenServer(user, token) {
  const idToken = await user.getIdToken();
  const urls = getFunctionUrls("registerPushToken");
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
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.error || "Push registration failed");
      }

      return;
    } catch (error) {
      lastError = error;
      if (!isNetworkFetchError(error) || isLastAttempt) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Push registration failed");
}

function showForegroundNotification(payload) {
  if (Notification.permission !== "granted") return;
  const title = payload?.notification?.title || "DreamTeam Update";
  const body = payload?.notification?.body || "You have a new challenge alert.";
  const notification = new Notification(title, {
    body,
    icon: PUSH_ICON_URL,
    badge: PUSH_BADGE_URL,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = "/dashboard.html";
  };
}

function removePrompt() {
  const prompt = document.getElementById("push-permission-prompt");
  if (prompt) prompt.remove();
}

function renderEnablePrompt(user) {
  if (document.getElementById("push-permission-prompt")) return;

  const prompt = document.createElement("div");
  prompt.id = "push-permission-prompt";
  prompt.style.cssText = [
    "position:fixed",
    "right:1rem",
    "bottom:1rem",
    "z-index:10001",
    "max-width:320px",
    "background:#0f172a",
    "color:#f8fafc",
    "padding:0.9rem",
    "border-radius:12px",
    "box-shadow:0 12px 24px rgba(2,6,23,0.35)",
    "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
  ].join(";");

  prompt.innerHTML = `
    <div style="font-size:0.95rem;line-height:1.35;margin-bottom:0.65rem;">
      Turn on push alerts for new daily challenges and reward updates.
    </div>
    <div style="display:flex;gap:0.55rem;justify-content:flex-end;">
      <button id="push-later-btn" style="background:#334155;color:#e2e8f0;border:none;padding:0.45rem 0.65rem;border-radius:8px;cursor:pointer;">Later</button>
      <button id="push-enable-btn" style="background:#facc15;color:#111827;border:none;padding:0.45rem 0.65rem;border-radius:8px;cursor:pointer;font-weight:600;">Enable</button>
    </div>
  `;

  document.body.appendChild(prompt);

  const laterBtn = document.getElementById("push-later-btn");
  const enableBtn = document.getElementById("push-enable-btn");

  laterBtn?.addEventListener("click", async () => {
    removePrompt();
    await persistPushState(user, null).catch(() => {});
  });

  enableBtn?.addEventListener("click", async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await registerAndStoreToken(user);
      } else {
        await persistPushState(user, null).catch(() => {});
      }
    } finally {
      removePrompt();
    }
  });
}

async function registerAndStoreToken(user, existingToken = null) {
  activePushUser = user;
  const vapidKey = getVapidKey();
  if (!vapidKey) {
    console.warn("VITE_FIREBASE_VAPID_KEY is not set. Attempting token registration with Firebase default key.");
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const messaging = getMessaging(app);
    const tokenOptions = {
      serviceWorkerRegistration: registration,
      ...(vapidKey ? { vapidKey } : {}),
    };
    const token = existingToken || (await getToken(messaging, tokenOptions));

    if (!token) {
      const message = "Push token was unavailable. Please retry.";
      console.warn(message);
      showPushRetryBanner(user, message);
      throw new Error(message);
    }

    pendingPushToken = token;
    await persistPushState(user, token);
    await registerPushTokenServer(user, token);
    removePushRetryBanner();

    if (!foregroundListenerAttached) {
      foregroundListenerAttached = true;
      onMessage(messaging, showForegroundNotification);
    }
  } catch (error) {
    const rawMessage = String(error?.message || "");
    const message = /vapid|web push|push service/i.test(rawMessage)
      ? "Push setup needs a valid Web Push certificate (VAPID key) in Firebase and VITE_FIREBASE_VAPID_KEY in your web env."
      : error?.message || "Push setup failed. Please retry.";
    showPushRetryBanner(user, message);
    throw error;
  }
}

export async function initPushNotifications(user) {
  if (!user?.uid) return;
  if (initializedUid === user.uid) return;
  initializedUid = user.uid;

  if (!canUsePushApi()) return;

  const supported = await isSupported().catch(() => false);
  if (!supported) return;

  if (Notification.permission === "granted") {
    await registerAndStoreToken(user).catch((error) => {
      console.warn("Push init failed", error);
    });
    return;
  }

  if (Notification.permission === "default") {
    renderEnablePrompt(user);
    return;
  }

  await persistPushState(user, null).catch(() => {});
}

export async function ensurePushTokenForUser(user) {
  if (!user?.uid) {
    throw new Error("Sign in required.");
  }

  if (!canUsePushApi()) {
    throw new Error("This browser does not support push notifications.");
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    throw new Error("Push messaging is not supported in this browser.");
  }

  if (Notification.permission === "denied") {
    throw new Error("Notifications are blocked in your browser settings.");
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission is required to send a push test.");
    }
  }

  await registerAndStoreToken(user);
}
