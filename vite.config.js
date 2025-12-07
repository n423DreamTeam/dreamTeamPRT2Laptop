import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        signup: resolve(__dirname, "signup.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        chat: resolve(__dirname, "chat.html"),
        players: resolve(__dirname, "players.html"),
        playerProfile: resolve(__dirname, "player-profile.html"),
        leaderboard: resolve(__dirname, "leadboard.html"),
        rewards: resolve(__dirname, "rewards.html"),
        account: resolve(__dirname, "account.html"),
      },
    },
  },
  server: {
    proxy: {
      "/balldontlie": {
        target: "https://api.balldontlie.io",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/balldontlie/, ""),
      },
    },
  },
});
