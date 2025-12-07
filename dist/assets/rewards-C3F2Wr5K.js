import{e as p,f as u,o as h,g as v,b as m,d as f}from"./main-Dz9wZmOr.js";const S=p(u),k="dt_user_progress_v1",n={firstWin:1,hotStreak:5,statMaster:10};function d(){try{const t=localStorage.getItem(k);if(t)return JSON.parse(t)}catch(t){console.warn("Could not read local progress",t)}return{points:0,wins:0}}async function w(t){try{const o=await v(m(f,"users",t.uid));if(o.exists()){const e=o.data(),s=d(),a=Math.max(e.points||0,s.points||0),c=Math.max(e.wins||0,s.wins||0),i=e.challengesCompleted||c||s.wins||0,r=document.getElementById("user-points");r&&(r.textContent=a),l(i,e)}else{const e=d(),s=document.getElementById("user-points");s&&(s.textContent=e.points||0),l(e.wins||0,{})}}catch(o){console.error("Error loading user stats:",o);const e=d(),s=document.getElementById("user-points");s&&(s.textContent=e.points||0),l(e.wins||0,{})}}function l(t,o){const e=document.querySelector(".badges-grid");if(!e)return;const s=t>=n.firstWin,a=Math.min(t,n.hotStreak),c=t>=n.hotStreak,i=Math.min(t,n.statMaster),r=t>=n.statMaster,g=o.perfectChallenges?o.perfectChallenges>0:!1;e.innerHTML=`
    <div class="badge ${s?"unlocked":""}">
      <div class="icon">⭐</div>
      <h3>First Win</h3>
      <p>Complete your first challenge</p>
      ${s?'<div class="badge-status">✓ Unlocked</div>':""}
    </div>

    <div class="badge ${c?"unlocked":""}">
      <div class="icon">🏆</div>
      <h3>Hot Streak</h3>
      <p>Complete 5 challenges in a row</p>
      <div class="progress"><div style="width: ${a/n.hotStreak*100}%"></div></div>
      <p class="progress-text">${a} / ${n.hotStreak}</p>
    </div>

    <div class="badge ${g?"unlocked":""}">
      <div class="icon">🎯</div>
      <h3>Perfect Lineup</h3>
      <p>Exceed all requirements by 50%</p>
      ${g?'<div class="badge-status">✓ Unlocked</div>':""}
    </div>

    <div class="badge ${r?"unlocked":""}">
      <div class="icon">📊</div>
      <h3>Stat Master</h3>
      <p>Complete 10 challenges</p>
      <div class="progress"><div style="width: ${i/n.statMaster*100}%"></div></div>
      <p class="progress-text">${i} / ${n.statMaster}</p>
    </div>
  `}function y(){const t=document.getElementById("challenge-date");if(t){const e=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});t.textContent=e}}document.addEventListener("DOMContentLoaded",()=>{y(),h(S,t=>{t?w(t):window.location.href="./login.html"})});
