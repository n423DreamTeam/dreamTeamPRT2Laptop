import{o as le,a as de,d as q,g as ce,b as O,s as pe,i as x,c as me}from"./main-BaAJt1vu.js";document.addEventListener("DOMContentLoaded",()=>{const d=document.getElementById("drop-zone"),f=document.querySelector(".players"),J=document.querySelector("#points-bar"),j=document.querySelector("#assists-bar");let M=document.querySelector("#points-val"),A=document.querySelector("#assists-val");const W=document.getElementById("refresh-btn"),G=window.location.hostname==="localhost"?"http://localhost:3001/api":"/api";let m=[],g=[],c=[];const V=5;let u=150,y=50;const D="dt_user_progress_v1";let l={points:0,wins:0},C=null,b=!1;function K(){try{const e=localStorage.getItem(D);e&&(l=JSON.parse(e))}catch(e){console.warn("Could not load user progress:",e)}}function I(){try{localStorage.setItem(D,JSON.stringify(l))}catch(e){console.warn("Could not save user progress:",e)}}K();async function X(e){if(!(!q||!e))try{const n=await ce(O(q,"users",e.uid));if(n.exists()){const t=n.data();l.points=t.points??l.points,l.wins=t.challengesCompleted??t.wins??l.wins,I(),E()}}catch(n){console.warn("Could not hydrate progress from Firestore",n)}}async function Z({pointsDelta:e,winIncrement:n,perfectChallengeAchieved:t}){if(!(!q||!C))try{const s={points:x(e),wins:x(n),challengesCompleted:x(n),lastPlayedAt:pe()};t&&(s.perfectChallenges=x(1)),await me(O(q,"users",C.uid),s,{merge:!0})}catch(s){console.warn("Could not sync progress to Firestore",s)}}function E(){let e=document.querySelector(".user-points-hud");if(!e){e=document.createElement("div"),e.className="user-points-hud",e.style.cssText="position: fixed; right: 3rem; top: 10rem; color: #fff; background: rgba(0,0,0,0.4); padding: 0.7rem 1.5rem; border-radius: 10px; font-weight:700; z-index: 999;",document.body.appendChild(e);const n=()=>{window.innerWidth<=600?(e.style.right="1.2rem",e.style.top="6.5rem",e.style.padding="0.75rem 1rem",e.style.fontSize="0.9rem"):window.innerWidth<=900?(e.style.right="1.5rem",e.style.top="7.5rem",e.style.padding="0.85rem 1.2rem",e.style.fontSize="0.95rem"):(e.style.right="3rem",e.style.top="10rem",e.style.padding="1rem 1.5rem",e.style.fontSize="1rem")};n(),window.addEventListener("resize",n)}e.innerHTML=`Points: <span style='color:#ffcb05'>${l.points}</span> • Wins: ${l.wins}`}E();function Q(e){const n=document.createElement("div");if(n.className="reward-toast",n.style.cssText=`
      position: fixed; bottom: 2rem; right: 2rem; z-index: 10000;
      background: linear-gradient(135deg, #ffcb05, #ffb300);
      color: #000; padding: 1.5rem 2rem; border-radius: 12px;
      box-shadow: 0 4px 15px rgba(255, 203, 5, 0.4);
      font-weight: bold; font-size: 1.1rem;
      animation: slideIn 0.5s ease-out;
      font-family: Arial, sans-serif;
    `,n.innerHTML=`
      <div style="display: flex; align-items: center; gap: 0.8rem;">
        <span style="font-size: 1.8rem;">🎁</span>
        <div>
          <div style="font-size: 0.95rem;">YOU EARNED A NEW REWARD!</div>
          <div style="font-size: 1.3rem; margin-top: 0.2rem;">+${e} POINTS</div>
        </div>
      </div>
    `,document.body.appendChild(n),!document.querySelector("style[data-reward-toast]")){const t=document.createElement("style");t.setAttribute("data-reward-toast","true"),t.textContent=`
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
      `,document.head.appendChild(t)}setTimeout(()=>{n.style.animation="slideIn 0.5s ease-out reverse",setTimeout(()=>n.remove(),500)},4e3)}le(de,e=>{C=e,e&&X(e)});function ee(){const e=new Date,n=new Date(e.getFullYear(),0,0),t=e-n,s=1e3*60*60*24,o=Math.floor(t/s)%10,i=[{points:60,assists:15,desc:"Build a balanced team with moderate scoring"},{points:70,assists:15,desc:"Create a high-assist lineup for ball movement"},{points:80,assists:30,desc:"Focus on playmaking over scoring"},{points:20,assists:10,desc:"Go for a scoring-focused roster"},{points:20,assists:10,desc:"Achieve perfect balance"},{points:20,assists:10,desc:"Team up the assist leaders"},{points:20,assists:10,desc:"Go big with scoring power"},{points:20,assists:10,desc:"Ultimate passing challenge"},{points:20,assists:10,desc:"Create a defensive-minded lineup"},{points:20,assists:10,desc:"Build a well-rounded squad"}][o];return u=i.points,y=i.assists,i}const te=ee();function ne(){const e=document.querySelector(".puzzle-objective p");e&&(e.innerHTML=`Achieve a total team score of <span class="highlight">${u} points</span> and <span class="highlight">${y} assists</span> using any 5 players.<br><em style="font-size: 0.9em; color: rgba(255,255,255,0.7);">${te.desc}</em>`);const n=document.querySelector("#points-bar").parentElement.parentElement.querySelector("p"),t=document.querySelector("#assists-bar").parentElement.parentElement.querySelector("p");n&&(n.innerHTML=`<span id="points-val">0</span> / ${u}`),t&&(t.innerHTML=`<span id="assists-val">0</span> / ${y}`),M=document.querySelector("#points-val"),A=document.querySelector("#assists-val")}ne();const p=[{name:"Tyrese Haliburton",pts:20.1,ast:10.8,requiredPoints:1e3},{name:"Pascal Siakam",pts:21.3,ast:4.8,requiredPoints:400},{name:"Andrew Nembhard",pts:9.2,ast:4.1,requiredPoints:0},{name:"Aaron Nesmith",pts:12.2,ast:1.5,requiredPoints:200},{name:"Benedict Mathurin",pts:14.5,ast:2,requiredPoints:300},{name:"T.J. McConnell",pts:9.8,ast:4.3,requiredPoints:0},{name:"Jay Huff",pts:7.8,ast:1,requiredPoints:0},{name:"Obi Toppin",pts:10.3,ast:1.5,requiredPoints:50},{name:"Ben Sheppard",pts:5.1,ast:1.2,requiredPoints:0},{name:"Jarace Walker",pts:3.8,ast:.9,requiredPoints:0},{name:"Isaiah Jackson",pts:8.2,ast:1,requiredPoints:0},{name:"Johnny Furphy",pts:2.5,ast:.3,requiredPoints:0},{name:"Taelon Peter",pts:1.8,ast:1.1,requiredPoints:0},{name:"Kam Jones",pts:0,ast:0,requiredPoints:0},{name:"Tony Bradley",pts:4.9,ast:.7,requiredPoints:0},{name:"Jeremiah Robinson-Earl",pts:4.8,ast:.8,requiredPoints:0},{name:"Quenton Jackson",pts:11.8,ast:3.6,requiredPoints:100},{name:"Ethan Thompson",pts:2,ast:1,requiredPoints:0}];function se(e,n=5){const t=[...e].sort(()=>Math.random()-.5);return t.slice(0,Math.min(n,t.length))}async function S(){m=[...p];try{const e=await fetch(`${G}/players?team_id=12`);if(e.status===429)console.warn("⚠️ Server returned 429 Too Many Requests, using current roster only");else if(e.status===403)console.warn("⚠️ Server returned 403 Forbidden, using current roster only");else if(!e.ok)console.warn(`⚠️ Server returned ${e.status}, using current roster only`);else{const t=(await e.json()).data||[];console.log(`🟣 Found ${t.length} players from API.`);const s=t.map(r=>{if(p.some(P=>P.name.toLowerCase()===`${r.first_name} ${r.last_name}`.toLowerCase()))return null;let a,i;return r.position==="G"?(a=10+Math.random()*15,i=4+Math.random()*4):r.position==="F"?(a=12+Math.random()*15,i=2+Math.random()*3):r.position==="C"?(a=10+Math.random()*14,i=1+Math.random()*2):(a=8+Math.random()*12,i=2+Math.random()*3),{name:`${r.first_name} ${r.last_name}`,pts:parseFloat(a.toFixed(1)),ast:parseFloat(i.toFixed(1)),requiredPoints:a>=20?1e3:a>=18?400:a>=16?300:a>=14?200:0}}).filter(r=>r!==null);m=[...p,...s],console.log(`✅ Merged current roster (${p.length}) with API players (${s.length}). Total pool: ${m.length}`)}}catch(e){console.warn("⚠️ API fetch error, using current roster only:",e.message)}g=se(m,5),console.log(`✅ Loaded ${m.length} total players (${p.length} roster + ${m.length-p.length} API); showing ${g.length}`),U(g)}function U(e){const n=e.slice(0,5);if(!n.length){f.innerHTML='<p style="color:yellow">No Pacers found.</p>';return}f.innerHTML=n.map(t=>{const s=t.requiredPoints&&l.points<t.requiredPoints;return`
          <div class="player ${s?"locked":""}" data-name="${t.name}" data-req="${t.requiredPoints||0}" ${s?"":'draggable="true"'}>
            ${t.name.toUpperCase()}
            ${s?`<div class="lock-overlay">🔒 Unlock at ${t.requiredPoints} pts</div>`:""}
          </div>`}).join(""),f.querySelectorAll(".player").forEach(t=>{const s=t.classList.contains("locked"),r=t.getAttribute("data-name");s?t.addEventListener("click",()=>{const o=t.getAttribute("data-req")||0;alert(`This player is locked. Reach ${o} points to unlock. You have ${l.points} points.`)}):(t.addEventListener("dragstart",o=>{o.dataTransfer.setData("text/plain",r.toUpperCase())}),t.addEventListener("click",()=>{const o=e.find(a=>a.name.toUpperCase()===r.toUpperCase());z(o)}))})}S();function v(){const e=c.reduce((r,o)=>r+o.pts,0),n=c.reduce((r,o)=>r+o.ast,0),t=Math.min(e/u*100,100),s=Math.min(n/y*100,100);J.style.width=`${t}%`,j.style.width=`${s}%`,M.textContent=e.toFixed(1),A.textContent=n.toFixed(1),!b&&t===100&&s===100&&(b=!0,oe(e,n))}function oe(e,n){const t=Math.max(25,Math.round(u*.2)),s=l.points;l.points+=t,l.wins+=1,I(),E(),Q(t);const r=e>=u*1.5&&n>=y*1.5;Z({pointsDelta:t,winIncrement:1,perfectChallengeAchieved:r});const o=p.filter(h=>{const ae=s<h.requiredPoints,ie=l.points>=h.requiredPoints;return ae&&ie&&h.requiredPoints>0}),a=document.createElement("div");a.style.cssText=`
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7); display: flex;
      justify-content: center; align-items: center; z-index: 9999;
    `;const i=document.createElement("div");i.style.cssText=`
      background: linear-gradient(135deg, #5b7fff, #3f4dd3);
      border: 2px solid #ffcb05; border-radius: 20px;
      padding: 2.5rem; text-align: center; max-width: 450px;
      box-shadow: 0 0 30px rgba(91, 127, 255, 0.6);
      color: white; font-family: Arial, sans-serif;
    `;let P="";o.length>0&&(P=`
        <div style="
          background: rgba(255, 203, 5, 0.2); border: 2px solid #ffcb05;
          border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;
        ">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔓</div>
          <p style="font-size: 0.95rem; margin: 0 0 0.8rem 0; color: #ffcb05; font-weight: bold;">
            YOU HAVE UNLOCKED THESE PLAYERS!
          </p>
          <div style="text-align: left; display: flex; flex-direction: column; gap: 0.5rem;">
            ${o.map(h=>`<div style="font-size: 0.9rem; color: #fff; font-weight: 500;">⭐ ${h.name}</div>`).join("")}
          </div>
        </div>
      `),i.innerHTML=`
      <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
      <h2 style="font-size: 2rem; margin: 0.5rem 0; color: #ffcb05;">Awesome Work!</h2>
      <p style="font-size: 1.1rem; margin: 1rem 0; color: rgba(255,255,255,0.9);">You crushed that challenge!</p>
      <p style="font-size: 1rem; margin: 1rem 0; color: #ffcb05; font-weight: bold;">+${t} Points</p>
      ${P}
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
    `,a.appendChild(i),document.body.appendChild(a),document.getElementById("play-again-btn").addEventListener("click",()=>{a.remove(),c=[],b=!1,d.innerHTML="<p><strong>BUILD YOUR DREAMTEAM</strong><br>Drag & Drop players into this area</p>",v(),S()}),document.getElementById("close-popup-btn").addEventListener("click",()=>{a.remove()}),U(g)}function re(e){const n=document.createElement("div");n.className="lineup-player";const t=document.createElement("span");t.className="player-content",t.textContent=e,n.appendChild(t);const s=document.createElement("button");s.className="remove-player-btn",s.textContent="✕",s.addEventListener("click",a=>{if(a.stopPropagation(),c=c.filter(i=>i.name.toUpperCase()!==e.toUpperCase()),n.remove(),v(),c.length===0){const i=d.querySelector("p");i&&(i.style.display="block")}}),n.appendChild(s);const r=d.querySelector("p");r&&(r.style.display="none");let o=d.querySelector(".clear-btn");o||(o=document.createElement("button"),o.className="clear-btn",o.textContent="✕ Clear",o.addEventListener("click",()=>{c=[],b=!1,d.innerHTML="<p><strong>BUILD YOUR DREAMTEAM</strong><br>Drag & Drop players into this area</p>",document.querySelector(".feedback").classList.remove("challenge-complete"),v()}),d.appendChild(o)),o?d.insertBefore(n,o):d.appendChild(n)}function z(e){!e||c.some(t=>t.name.toUpperCase()===e.name.toUpperCase())||c.length>=V||(c.push(e),re(e.name),v())}d.addEventListener("dragover",e=>e.preventDefault()),d.addEventListener("drop",e=>{e.preventDefault();const n=e.dataTransfer.getData("text/plain").trim(),t=g.find(s=>s.name.toUpperCase()===n);z(t)}),W.addEventListener("click",()=>{S()});const R=document.querySelector(".slider"),L=parseInt(getComputedStyle(R).getPropertyValue("--quantity"));let B=0,T=0;function k(e){T=(T+e+L)%L,B=360/L*T,R.style.transform=`perspective(1000px) rotateY(-${B}deg)`}const $=document.querySelector(".banner.floating")||document.querySelector(".banner"),F=document.querySelector(".nav2.left2"),H=document.querySelector(".nav2.right2");let w=null;function N(e=3500){_(),w=setInterval(()=>k(1),e)}function _(){w&&(clearInterval(w),w=null)}F&&F.addEventListener("click",e=>{e.stopPropagation(),k(-1)}),H&&H.addEventListener("click",e=>{e.stopPropagation(),k(1)}),$&&($.addEventListener("mouseenter",_),$.addEventListener("mouseleave",()=>N(3500))),N(3500)});const Y=document.getElementById("challenge-date");if(Y){const f=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});Y.textContent=f}
