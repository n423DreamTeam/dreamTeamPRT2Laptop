import{n as h,f as c,e as m,q as y,p as f,h as g,j as b,k as L}from"./main-Dz9wZmOr.js";const v=h(c),i=m(c);function $(e){e.innerHTML='<li class="placeholder" style="opacity:.7">No players yet. Complete a challenge to appear here.</li>'}function C(){const e=document.querySelector("#leaderboard-users");if(!e)return;const n=y(b(v,"users"),g("points","desc"),f(25));L(n,a=>{if(a.empty){$(e);return}e.innerHTML="",a.docs.forEach((s,d)=>{const t=s.data(),o=document.createElement("li"),p=(t.displayName||"?").substring(0,2).toUpperCase(),r=t.challengesCompleted??t.wins??0,l=i.currentUser&&i.currentUser.uid===s.id,u=t.photoURL?`<img src="${t.photoURL}" alt="${t.displayName||"User"}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`:p;o.innerHTML=`
          <span class="rank">${d+1}</span>
          <div class="user-info ${l?"self":""}">
            <div class="avatar">${u}</div>
            <div>
              <h3>${t.displayName||"Unknown"}${l?" <span style='color:#ffcb05'>(You)</span>":""}</h3>
              <p>${r} challenge${r===1?"":"s"} completed</p>
            </div>
          </div>
          <span class="points">${t.points||0} pts</span>
        `,e.appendChild(o)})},a=>{console.error("Leaderboard snapshot error",a),e.innerHTML=`<li class="placeholder" style="color:red">Leaderboard unavailable: ${a.code}</li>`})}function U(){const e=document.getElementById("challenge-date");if(e){const a=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});e.textContent=a}}document.addEventListener("DOMContentLoaded",()=>{C(),U()});
