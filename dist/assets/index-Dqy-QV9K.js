(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();function Hc(n,e=100){const t=n.getBoundingClientRect();return t.top<=(window.innerHeight||document.documentElement.clientHeight)-e&&t.bottom>=0}function An(){document.querySelectorAll(".animate-on-scroll").forEach((e,t)=>{Hc(e)&&setTimeout(()=>{e.classList.add("is-visible")},t*100)})}function yr(){[".stat-card",".info-card",".section",".unlock-item",".puzzle-section",".puzzle-objective",".player",".leaderboard-list li",".banner",".reward-card",".chat-container",".player-card"].forEach(t=>{document.querySelectorAll(t).forEach(r=>{r.classList.contains("animate-on-scroll")||r.classList.add("animate-on-scroll")})}),An();let e=!1;window.addEventListener("scroll",()=>{e||(window.requestAnimationFrame(()=>{An(),e=!1}),e=!0)}),window.addEventListener("load",An),window.addEventListener("resize",An)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",yr):yr();const Wc=()=>{};var Ir={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let r=n.charCodeAt(s);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},qc=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const r=n[t++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const a=n[t++];e[s++]=String.fromCharCode((r&31)<<6|a&63)}else if(r>239&&r<365){const a=n[t++],l=n[t++],u=n[t++],p=((r&7)<<18|(a&63)<<12|(l&63)<<6|u&63)-65536;e[s++]=String.fromCharCode(55296+(p>>10)),e[s++]=String.fromCharCode(56320+(p&1023))}else{const a=n[t++],l=n[t++];e[s++]=String.fromCharCode((r&15)<<12|(a&63)<<6|l&63)}}return e.join("")},Mo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<n.length;r+=3){const a=n[r],l=r+1<n.length,u=l?n[r+1]:0,p=r+2<n.length,E=p?n[r+2]:0,S=a>>2,b=(a&3)<<4|u>>4;let v=(u&15)<<2|E>>6,M=E&63;p||(M=64,l||(v=64)),s.push(t[S],t[b],t[v],t[M])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Lo(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):qc(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<n.length;){const a=t[n.charAt(r++)],u=r<n.length?t[n.charAt(r)]:0;++r;const E=r<n.length?t[n.charAt(r)]:64;++r;const b=r<n.length?t[n.charAt(r)]:64;if(++r,a==null||u==null||E==null||b==null)throw new Gc;const v=a<<2|u>>4;if(s.push(v),E!==64){const M=u<<4&240|E>>2;if(s.push(M),b!==64){const D=E<<6&192|b;s.push(D)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Gc extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const zc=function(n){const e=Lo(n);return Mo.encodeByteArray(e,!0)},Ln=function(n){return zc(n).replace(/\./g,"")},Uo=function(n){try{return Mo.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc=()=>Kc().__FIREBASE_DEFAULTS__,Xc=()=>{if(typeof process>"u"||typeof Ir>"u")return;const n=Ir.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Yc=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Uo(n[1]);return e&&JSON.parse(e)},Ki=()=>{try{return Wc()||Jc()||Xc()||Yc()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},xo=n=>{var e,t;return(t=(e=Ki())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Fo=n=>{const e=xo(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Vo=()=>{var n;return(n=Ki())==null?void 0:n.config},Bo=n=>{var e;return(e=Ki())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zc{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bt(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ji(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jo(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",r=n.iat||0,a=n.sub||n.user_id;if(!a)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l={iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:a,user_id:a,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Ln(JSON.stringify(t)),Ln(JSON.stringify(l)),""].join(".")}const Kt={};function Qc(){const n={prod:[],emulator:[]};for(const e of Object.keys(Kt))Kt[e]?n.emulator.push(e):n.prod.push(e);return n}function el(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let wr=!1;function Xi(n,e){if(typeof window>"u"||typeof document>"u"||!bt(window.location.host)||Kt[n]===e||Kt[n]||wr)return;Kt[n]=e;function t(v){return`__firebase__banner__${v}`}const s="__firebase__banner",a=Qc().prod.length>0;function l(){const v=document.getElementById(s);v&&v.remove()}function u(v){v.style.display="flex",v.style.background="#7faaf0",v.style.position="fixed",v.style.bottom="5px",v.style.left="5px",v.style.padding=".5em",v.style.borderRadius="5px",v.style.alignItems="center"}function p(v,M){v.setAttribute("width","24"),v.setAttribute("id",M),v.setAttribute("height","24"),v.setAttribute("viewBox","0 0 24 24"),v.setAttribute("fill","none"),v.style.marginLeft="-6px"}function E(){const v=document.createElement("span");return v.style.cursor="pointer",v.style.marginLeft="16px",v.style.fontSize="24px",v.innerHTML=" &times;",v.onclick=()=>{wr=!0,l()},v}function S(v,M){v.setAttribute("id",M),v.innerText="Learn more",v.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",v.setAttribute("target","__blank"),v.style.paddingLeft="5px",v.style.textDecoration="underline"}function b(){const v=el(s),M=t("text"),D=document.getElementById(M)||document.createElement("span"),U=t("learnmore"),P=document.getElementById(U)||document.createElement("a"),W=t("preprendIcon"),K=document.getElementById(W)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(v.created){const $=v.element;u($),S(P,U);const B=E();p(K,W),$.append(K,D,P,B),document.body.appendChild($)}a?(D.innerText="Preview backend disconnected.",K.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(K.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,D.innerText="Preview backend running in this workspace."),D.setAttribute("id",M)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",b):b()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function tl(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Q())}function nl(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function $o(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function il(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function sl(){const n=Q();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Ho(){try{return typeof indexedDB=="object"}catch{return!1}}function Wo(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var a;e(((a=r.error)==null?void 0:a.message)||"")}}catch(t){e(t)}})}function rl(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ol="FirebaseError";class le extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=ol,Object.setPrototypeOf(this,le.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ft.prototype.create)}}class ft{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},r=`${this.service}/${e}`,a=this.errors[e],l=a?al(a,s):"Error",u=`${this.serviceName}: ${l} (${r}).`;return new le(r,u,s)}}function al(n,e){return n.replace(cl,(t,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const cl=/\{\$([^}]+)}/g;function ll(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function ze(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const r of t){if(!s.includes(r))return!1;const a=n[r],l=e[r];if(Er(a)&&Er(l)){if(!ze(a,l))return!1}else if(a!==l)return!1}for(const r of s)if(!t.includes(r))return!1;return!0}function Er(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sn(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Gt(n){const e={};return n.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[r,a]=s.split("=");e[decodeURIComponent(r)]=decodeURIComponent(a)}}),e}function zt(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function hl(n,e){const t=new ul(n,e);return t.subscribe.bind(t)}class ul{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let r;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");dl(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:s},r.next===void 0&&(r.next=Si),r.error===void 0&&(r.error=Si),r.complete===void 0&&(r.complete=Si);const a=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),a}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function dl(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Si(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fl=1e3,pl=2,gl=4*60*60*1e3,ml=.5;function Tr(n,e=fl,t=pl){const s=e*Math.pow(t,n),r=Math.round(ml*s*(Math.random()-.5)*2);return Math.min(gl,s+r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ie(n){return n&&n._delegate?n._delegate:n}class ae{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new Zc;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Il(e))try{this.getOrInitializeService({instanceIdentifier:tt})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const a=this.getOrInitializeService({instanceIdentifier:r});s.resolve(a)}catch{}}}}clearInstance(e=tt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=tt){return this.instances.has(e)}getOptions(e=tt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[a,l]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(a);s===u&&l.resolve(r)}return r}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const a=this.instances.get(s);return a&&e(a,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const r of s)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:yl(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=tt){return this.component?this.component.multipleInstances?e:tt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function yl(n){return n===tt?void 0:n}function Il(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new _l(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var L;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(L||(L={}));const El={debug:L.DEBUG,verbose:L.VERBOSE,info:L.INFO,warn:L.WARN,error:L.ERROR,silent:L.SILENT},Tl=L.INFO,vl={[L.DEBUG]:"log",[L.VERBOSE]:"log",[L.INFO]:"info",[L.WARN]:"warn",[L.ERROR]:"error"},Al=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),r=vl[e];if(r)console[r](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class zn{constructor(e){this.name=e,this._logLevel=Tl,this._logHandler=Al,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in L))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?El[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,L.DEBUG,...e),this._logHandler(this,L.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,L.VERBOSE,...e),this._logHandler(this,L.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,L.INFO,...e),this._logHandler(this,L.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,L.WARN,...e),this._logHandler(this,L.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,L.ERROR,...e),this._logHandler(this,L.ERROR,...e)}}const Sl=(n,e)=>e.some(t=>n instanceof t);let vr,Ar;function bl(){return vr||(vr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Rl(){return Ar||(Ar=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const qo=new WeakMap,Fi=new WeakMap,Go=new WeakMap,bi=new WeakMap,Yi=new WeakMap;function Cl(n){const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("success",a),n.removeEventListener("error",l)},a=()=>{t(qe(n.result)),r()},l=()=>{s(n.error),r()};n.addEventListener("success",a),n.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&qo.set(t,n)}).catch(()=>{}),Yi.set(e,n),e}function Pl(n){if(Fi.has(n))return;const e=new Promise((t,s)=>{const r=()=>{n.removeEventListener("complete",a),n.removeEventListener("error",l),n.removeEventListener("abort",l)},a=()=>{t(),r()},l=()=>{s(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",a),n.addEventListener("error",l),n.addEventListener("abort",l)});Fi.set(n,e)}let Vi={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Fi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Go.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return qe(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function kl(n){Vi=n(Vi)}function Ol(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(Ri(this),e,...t);return Go.set(s,e.sort?e.sort():[e]),qe(s)}:Rl().includes(n)?function(...e){return n.apply(Ri(this),e),qe(qo.get(this))}:function(...e){return qe(n.apply(Ri(this),e))}}function Nl(n){return typeof n=="function"?Ol(n):(n instanceof IDBTransaction&&Pl(n),Sl(n,bl())?new Proxy(n,Vi):n)}function qe(n){if(n instanceof IDBRequest)return Cl(n);if(bi.has(n))return bi.get(n);const e=Nl(n);return e!==n&&(bi.set(n,e),Yi.set(e,n)),e}const Ri=n=>Yi.get(n);function zo(n,e,{blocked:t,upgrade:s,blocking:r,terminated:a}={}){const l=indexedDB.open(n,e),u=qe(l);return s&&l.addEventListener("upgradeneeded",p=>{s(qe(l.result),p.oldVersion,p.newVersion,qe(l.transaction),p)}),t&&l.addEventListener("blocked",p=>t(p.oldVersion,p.newVersion,p)),u.then(p=>{a&&p.addEventListener("close",()=>a()),r&&p.addEventListener("versionchange",E=>r(E.oldVersion,E.newVersion,E))}).catch(()=>{}),u}const Dl=["get","getKey","getAll","getAllKeys","count"],Ll=["put","add","delete","clear"],Ci=new Map;function Sr(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ci.get(e))return Ci.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,r=Ll.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Dl.includes(t)))return;const a=async function(l,...u){const p=this.transaction(l,r?"readwrite":"readonly");let E=p.store;return s&&(E=E.index(u.shift())),(await Promise.all([E[t](...u),r&&p.done]))[0]};return Ci.set(e,a),a}kl(n=>({...n,get:(e,t,s)=>Sr(e,t)||n.get(e,t,s),has:(e,t)=>!!Sr(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ml{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Ul(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function Ul(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Bi="@firebase/app",br="0.14.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oe=new zn("@firebase/app"),xl="@firebase/app-compat",Fl="@firebase/analytics-compat",Vl="@firebase/analytics",Bl="@firebase/app-check-compat",jl="@firebase/app-check",$l="@firebase/auth",Hl="@firebase/auth-compat",Wl="@firebase/database",ql="@firebase/data-connect",Gl="@firebase/database-compat",zl="@firebase/functions",Kl="@firebase/functions-compat",Jl="@firebase/installations",Xl="@firebase/installations-compat",Yl="@firebase/messaging",Zl="@firebase/messaging-compat",Ql="@firebase/performance",eh="@firebase/performance-compat",th="@firebase/remote-config",nh="@firebase/remote-config-compat",ih="@firebase/storage",sh="@firebase/storage-compat",rh="@firebase/firestore",oh="@firebase/ai",ah="@firebase/firestore-compat",ch="firebase",lh="12.5.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ji="[DEFAULT]",hh={[Bi]:"fire-core",[xl]:"fire-core-compat",[Vl]:"fire-analytics",[Fl]:"fire-analytics-compat",[jl]:"fire-app-check",[Bl]:"fire-app-check-compat",[$l]:"fire-auth",[Hl]:"fire-auth-compat",[Wl]:"fire-rtdb",[ql]:"fire-data-connect",[Gl]:"fire-rtdb-compat",[zl]:"fire-fn",[Kl]:"fire-fn-compat",[Jl]:"fire-iid",[Xl]:"fire-iid-compat",[Yl]:"fire-fcm",[Zl]:"fire-fcm-compat",[Ql]:"fire-perf",[eh]:"fire-perf-compat",[th]:"fire-rc",[nh]:"fire-rc-compat",[ih]:"fire-gcs",[sh]:"fire-gcs-compat",[rh]:"fire-fst",[ah]:"fire-fst-compat",[oh]:"fire-vertex","fire-js":"fire-js",[ch]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt=new Map,uh=new Map,$i=new Map;function Rr(n,e){try{n.container.addComponent(e)}catch(t){Oe.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ge(n){const e=n.name;if($i.has(e))return Oe.debug(`There were multiple attempts to register component ${e}.`),!1;$i.set(e,n);for(const t of Qt.values())Rr(t,n);for(const t of uh.values())Rr(t,n);return!0}function Je(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function te(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ge=new ft("app","Firebase",dh);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ae("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ge.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt=lh;function Ko(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s={name:ji,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw Ge.create("bad-app-name",{appName:String(r)});if(t||(t=Vo()),!t)throw Ge.create("no-options");const a=Qt.get(r);if(a){if(ze(t,a.options)&&ze(s,a.config))return a;throw Ge.create("duplicate-app",{appName:r})}const l=new wl(r);for(const p of $i.values())l.addComponent(p);const u=new fh(t,s,l);return Qt.set(r,u),u}function rn(n=ji){const e=Qt.get(n);if(!e&&n===ji&&Vo())return Ko();if(!e)throw Ge.create("no-app",{appName:n});return e}function ph(){return Array.from(Qt.values())}function ne(n,e,t){let s=hh[n]??n;t&&(s+=`-${t}`);const r=s.match(/\s|\//),a=e.match(/\s|\//);if(r||a){const l=[`Unable to register library "${s}" with version "${e}":`];r&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&a&&l.push("and"),a&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Oe.warn(l.join(" "));return}ge(new ae(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gh="firebase-heartbeat-database",mh=1,en="firebase-heartbeat-store";let Pi=null;function Jo(){return Pi||(Pi=zo(gh,mh,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(en)}catch(t){console.warn(t)}}}}).catch(n=>{throw Ge.create("idb-open",{originalErrorMessage:n.message})})),Pi}async function _h(n){try{const t=(await Jo()).transaction(en),s=await t.objectStore(en).get(Xo(n));return await t.done,s}catch(e){if(e instanceof le)Oe.warn(e.message);else{const t=Ge.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Oe.warn(t.message)}}}async function Cr(n,e){try{const s=(await Jo()).transaction(en,"readwrite");await s.objectStore(en).put(e,Xo(n)),await s.done}catch(t){if(t instanceof le)Oe.warn(t.message);else{const s=Ge.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Oe.warn(s.message)}}}function Xo(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yh=1024,Ih=30;class wh{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Th(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=Pr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(l=>l.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:r}),this._heartbeatsCache.heartbeats.length>Ih){const l=vh(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(l,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){Oe.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Pr(),{heartbeatsToSend:s,unsentEntries:r}=Eh(this._heartbeatsCache.heartbeats),a=Ln(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(t){return Oe.warn(t),""}}}function Pr(){return new Date().toISOString().substring(0,10)}function Eh(n,e=yh){const t=[];let s=n.slice();for(const r of n){const a=t.find(l=>l.agent===r.agent);if(a){if(a.dates.push(r.date),kr(t)>e){a.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),kr(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Th{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ho()?Wo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await _h(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Cr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Cr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function kr(n){return Ln(JSON.stringify({version:2,heartbeats:n})).length}function vh(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ah(n){ge(new ae("platform-logger",e=>new Ml(e),"PRIVATE")),ge(new ae("heartbeat",e=>new wh(e),"PRIVATE")),ne(Bi,br,n),ne(Bi,br,"esm2020"),ne("fire-js","")}Ah("");function Yo(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Sh=Yo,Zo=new ft("auth","Firebase",Yo());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mn=new zn("@firebase/auth");function bh(n,...e){Mn.logLevel<=L.WARN&&Mn.warn(`Auth (${pt}): ${n}`,...e)}function Pn(n,...e){Mn.logLevel<=L.ERROR&&Mn.error(`Auth (${pt}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(n,...e){throw Qi(n,...e)}function pe(n,...e){return Qi(n,...e)}function Zi(n,e,t){const s={...Sh(),[e]:t};return new ft("auth","Firebase",s).create(e,{appName:n.name})}function ke(n){return Zi(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Rh(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&ce(n,"argument-error"),Zi(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Qi(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return Zo.create(n,...e)}function R(n,e,...t){if(!n)throw Qi(e,...t)}function Re(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Pn(e),new Error(e)}function Ne(n,e){n||Re(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hi(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function Ch(){return Or()==="http:"||Or()==="https:"}function Or(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ph(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ch()||$o()||"connection"in navigator)?navigator.onLine:!0}function kh(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ne(t>e,"Short delay should be less than long delay!"),this.isMobile=tl()||il()}get(){return Ph()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(n,e){Ne(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Re("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Re("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Re("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nh=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Dh=new on(3e4,6e4);function De(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function ve(n,e,t,s,r={}){return ea(n,r,async()=>{let a={},l={};s&&(e==="GET"?l=s:a={body:JSON.stringify(s)});const u=sn({key:n.config.apiKey,...l}).slice(1),p=await n._getAdditionalHeaders();p["Content-Type"]="application/json",n.languageCode&&(p["X-Firebase-Locale"]=n.languageCode);const E={method:e,headers:p,...a};return nl()||(E.referrerPolicy="no-referrer"),n.emulatorConfig&&bt(n.emulatorConfig.host)&&(E.credentials="include"),Qo.fetch()(await ta(n,n.config.apiHost,t,u),E)})}async function ea(n,e,t){n._canInitEmulator=!1;const s={...Oh,...e};try{const r=new Mh(n),a=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const l=await a.json();if("needConfirmation"in l)throw Sn(n,"account-exists-with-different-credential",l);if(a.ok&&!("errorMessage"in l))return l;{const u=a.ok?l.errorMessage:l.error.message,[p,E]=u.split(" : ");if(p==="FEDERATED_USER_ID_ALREADY_LINKED")throw Sn(n,"credential-already-in-use",l);if(p==="EMAIL_EXISTS")throw Sn(n,"email-already-in-use",l);if(p==="USER_DISABLED")throw Sn(n,"user-disabled",l);const S=s[p]||p.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw Zi(n,S,E);ce(n,S)}}catch(r){if(r instanceof le)throw r;ce(n,"network-request-failed",{message:String(r)})}}async function an(n,e,t,s,r={}){const a=await ve(n,e,t,s,r);return"mfaPendingCredential"in a&&ce(n,"multi-factor-auth-required",{_serverResponse:a}),a}async function ta(n,e,t,s){const r=`${e}${t}?${s}`,a=n,l=a.config.emulator?es(n.config,r):`${n.config.apiScheme}://${r}`;return Nh.includes(t)&&(await a._persistenceManagerAvailable,a._getPersistenceType()==="COOKIE")?a._getPersistence()._getFinalTarget(l).toString():l}function Lh(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Mh{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(pe(this.auth,"network-request-failed")),Dh.get())})}}function Sn(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const r=pe(n,e,s);return r.customData._tokenResponse=t,r}function Nr(n){return n!==void 0&&n.enterprise!==void 0}class Uh{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Lh(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function xh(n,e){return ve(n,"GET","/v2/recaptchaConfig",De(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fh(n,e){return ve(n,"POST","/v1/accounts:delete",e)}async function Un(n,e){return ve(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Vh(n,e=!1){const t=ie(n),s=await t.getIdToken(e),r=ts(s);R(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const a=typeof r.firebase=="object"?r.firebase:void 0,l=a==null?void 0:a.sign_in_provider;return{claims:r,token:s,authTime:Jt(ki(r.auth_time)),issuedAtTime:Jt(ki(r.iat)),expirationTime:Jt(ki(r.exp)),signInProvider:l||null,signInSecondFactor:(a==null?void 0:a.sign_in_second_factor)||null}}function ki(n){return Number(n)*1e3}function ts(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return Pn("JWT malformed, contained fewer than 3 sections"),null;try{const r=Uo(t);return r?JSON.parse(r):(Pn("Failed to decode base64 JWT payload"),null)}catch(r){return Pn("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function Dr(n){const e=ts(n);return R(e,"internal-error"),R(typeof e.exp<"u","internal-error"),R(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function At(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof le&&Bh(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function Bh({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Jt(this.lastLoginAt),this.creationTime=Jt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xn(n){var b;const e=n.auth,t=await n.getIdToken(),s=await At(n,Un(e,{idToken:t}));R(s==null?void 0:s.users.length,e,"internal-error");const r=s.users[0];n._notifyReloadListener(r);const a=(b=r.providerUserInfo)!=null&&b.length?na(r.providerUserInfo):[],l=Hh(n.providerData,a),u=n.isAnonymous,p=!(n.email&&r.passwordHash)&&!(l!=null&&l.length),E=u?p:!1,S={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:l,metadata:new Wi(r.createdAt,r.lastLoginAt),isAnonymous:E};Object.assign(n,S)}async function $h(n){const e=ie(n);await xn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Hh(n,e){return[...n.filter(s=>!e.some(r=>r.providerId===s.providerId)),...e]}function na(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wh(n,e){const t=await ea(n,{},async()=>{const s=sn({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:a}=n.config,l=await ta(n,r,"/v1/token",`key=${a}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const p={method:"POST",headers:u,body:s};return n.emulatorConfig&&bt(n.emulatorConfig.host)&&(p.credentials="include"),Qo.fetch()(l,p)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function qh(n,e){return ve(n,"POST","/v2/accounts:revokeToken",De(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){R(e.idToken,"internal-error"),R(typeof e.idToken<"u","internal-error"),R(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Dr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){R(e.length!==0,"internal-error");const t=Dr(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(R(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:r,expiresIn:a}=await Wh(e,t);this.updateTokensAndExpiration(s,r,Number(a))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:r,expirationTime:a}=t,l=new It;return s&&(R(typeof s=="string","internal-error",{appName:e}),l.refreshToken=s),r&&(R(typeof r=="string","internal-error",{appName:e}),l.accessToken=r),a&&(R(typeof a=="number","internal-error",{appName:e}),l.expirationTime=a),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new It,this.toJSON())}_performRefresh(){return Re("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(n,e){R(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class ue{constructor({uid:e,auth:t,stsTokenManager:s,...r}){this.providerId="firebase",this.proactiveRefresh=new jh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Wi(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await At(this,this.stsTokenManager.getToken(this.auth,e));return R(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Vh(this,e)}reload(){return $h(this)}_assign(e){this!==e&&(R(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ue({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){R(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await xn(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(te(this.auth.app))return Promise.reject(ke(this.auth));const e=await this.getIdToken();return await At(this,Fh(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,r=t.email??void 0,a=t.phoneNumber??void 0,l=t.photoURL??void 0,u=t.tenantId??void 0,p=t._redirectEventId??void 0,E=t.createdAt??void 0,S=t.lastLoginAt??void 0,{uid:b,emailVerified:v,isAnonymous:M,providerData:D,stsTokenManager:U}=t;R(b&&U,e,"internal-error");const P=It.fromJSON(this.name,U);R(typeof b=="string",e,"internal-error"),je(s,e.name),je(r,e.name),R(typeof v=="boolean",e,"internal-error"),R(typeof M=="boolean",e,"internal-error"),je(a,e.name),je(l,e.name),je(u,e.name),je(p,e.name),je(E,e.name),je(S,e.name);const W=new ue({uid:b,auth:e,email:r,emailVerified:v,displayName:s,isAnonymous:M,photoURL:l,phoneNumber:a,tenantId:u,stsTokenManager:P,createdAt:E,lastLoginAt:S});return D&&Array.isArray(D)&&(W.providerData=D.map(K=>({...K}))),p&&(W._redirectEventId=p),W}static async _fromIdTokenResponse(e,t,s=!1){const r=new It;r.updateFromServerResponse(t);const a=new ue({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:s});return await xn(a),a}static async _fromGetAccountInfoResponse(e,t,s){const r=t.users[0];R(r.localId!==void 0,"internal-error");const a=r.providerUserInfo!==void 0?na(r.providerUserInfo):[],l=!(r.email&&r.passwordHash)&&!(a!=null&&a.length),u=new It;u.updateFromIdToken(s);const p=new ue({uid:r.localId,auth:e,stsTokenManager:u,isAnonymous:l}),E={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new Wi(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(a!=null&&a.length)};return Object.assign(p,E),p}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lr=new Map;function Ce(n){Ne(n instanceof Function,"Expected a class definition");let e=Lr.get(n);return e?(Ne(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Lr.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ia.type="NONE";const Mr=ia;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kn(n,e,t){return`firebase:${n}:${e}:${t}`}class wt{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:r,name:a}=this.auth;this.fullUserKey=kn(this.userKey,r.apiKey,a),this.fullPersistenceKey=kn("persistence",r.apiKey,a),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Un(this.auth,{idToken:e}).catch(()=>{});return t?ue._fromGetAccountInfoResponse(this.auth,t,e):null}return ue._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new wt(Ce(Mr),e,s);const r=(await Promise.all(t.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let a=r[0]||Ce(Mr);const l=kn(s,e.config.apiKey,e.name);let u=null;for(const E of t)try{const S=await E._get(l);if(S){let b;if(typeof S=="string"){const v=await Un(e,{idToken:S}).catch(()=>{});if(!v)break;b=await ue._fromGetAccountInfoResponse(e,v,S)}else b=ue._fromJSON(e,S);E!==a&&(u=b),a=E;break}}catch{}const p=r.filter(E=>E._shouldAllowMigration);return!a._shouldAllowMigration||!p.length?new wt(a,e,s):(a=p[0],u&&await a._set(l,u.toJSON()),await Promise.all(t.map(async E=>{if(E!==a)try{await E._remove(l)}catch{}})),new wt(a,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(aa(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(sa(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(la(e))return"Blackberry";if(ha(e))return"Webos";if(ra(e))return"Safari";if((e.includes("chrome/")||oa(e))&&!e.includes("edge/"))return"Chrome";if(ca(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function sa(n=Q()){return/firefox\//i.test(n)}function ra(n=Q()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function oa(n=Q()){return/crios\//i.test(n)}function aa(n=Q()){return/iemobile/i.test(n)}function ca(n=Q()){return/android/i.test(n)}function la(n=Q()){return/blackberry/i.test(n)}function ha(n=Q()){return/webos/i.test(n)}function ns(n=Q()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Gh(n=Q()){var e;return ns(n)&&!!((e=window.navigator)!=null&&e.standalone)}function zh(){return sl()&&document.documentMode===10}function ua(n=Q()){return ns(n)||ca(n)||ha(n)||la(n)||/windows phone/i.test(n)||aa(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function da(n,e=[]){let t;switch(n){case"Browser":t=Ur(Q());break;case"Worker":t=`${Ur(Q())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${pt}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kh{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=a=>new Promise((l,u)=>{try{const p=e(a);l(p)}catch(p){u(p)}});s.onAbort=t,this.queue.push(s);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jh(n,e={}){return ve(n,"GET","/v2/passwordPolicy",De(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xh=6;class Yh{constructor(e){var s;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Xh,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((s=e.allowedNonAlphanumericCharacters)==null?void 0:s.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let r=0;r<e.length;r++)s=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,r,a){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=a))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e,t,s,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new xr(this),this.idTokenSubscription=new xr(this),this.beforeStateQueue=new Kh(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Zo,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(a=>this._resolvePersistenceManagerAvailable=a)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ce(t)),this._initializationPromise=this.queue(async()=>{var s,r,a;if(!this._deleted&&(this.persistenceManager=await wt.create(this,e),(s=this._resolvePersistenceManagerAvailable)==null||s.call(this),!this._deleted)){if((r=this._popupRedirectResolver)!=null&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((a=this.currentUser)==null?void 0:a.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Un(this,{idToken:e}),s=await ue._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var a;if(te(this.app)){const l=this.app.settings.authIdToken;return l?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(l).then(u,u))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const l=(a=this.redirectUser)==null?void 0:a._redirectEventId,u=s==null?void 0:s._redirectEventId,p=await this.tryRedirectSignIn(e);(!l||l===u)&&(p!=null&&p.user)&&(s=p.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(l){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(l))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return R(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await xn(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=kh()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(te(this.app))return Promise.reject(ke(this));const t=e?ie(e):null;return t&&R(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&R(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return te(this.app)?Promise.reject(ke(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return te(this.app)?Promise.reject(ke(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ce(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Jh(this),t=new Yh(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ft("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await qh(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ce(e)||this._popupRedirectResolver;R(t,this,"argument-error"),this.redirectPersistenceManager=await wt.create(this,[Ce(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)==null?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,r){if(this._deleted)return()=>{};const a=typeof t=="function"?t:t.next.bind(t);let l=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(R(u,this,"internal-error"),u.then(()=>{l||a(this.currentUser)}),typeof t=="function"){const p=e.addObserver(t,s,r);return()=>{l=!0,p()}}else{const p=e.addObserver(t);return()=>{l=!0,p()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return R(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=da(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var r;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((r=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:r.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){var t;if(te(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&bh(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Le(n){return ie(n)}class xr{constructor(e){this.auth=e,this.observer=null,this.addObserver=hl(t=>this.observer=t)}get next(){return R(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Kn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Qh(n){Kn=n}function fa(n){return Kn.loadJS(n)}function eu(){return Kn.recaptchaEnterpriseScript}function tu(){return Kn.gapiScript}function nu(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class iu{constructor(){this.enterprise=new su}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class su{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const ru="recaptcha-enterprise",pa="NO_RECAPTCHA";class ou{constructor(e){this.type=ru,this.auth=Le(e)}async verify(e="verify",t=!1){async function s(a){if(!t){if(a.tenantId==null&&a._agentRecaptchaConfig!=null)return a._agentRecaptchaConfig.siteKey;if(a.tenantId!=null&&a._tenantRecaptchaConfigs[a.tenantId]!==void 0)return a._tenantRecaptchaConfigs[a.tenantId].siteKey}return new Promise(async(l,u)=>{xh(a,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(p=>{if(p.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const E=new Uh(p);return a.tenantId==null?a._agentRecaptchaConfig=E:a._tenantRecaptchaConfigs[a.tenantId]=E,l(E.siteKey)}}).catch(p=>{u(p)})})}function r(a,l,u){const p=window.grecaptcha;Nr(p)?p.enterprise.ready(()=>{p.enterprise.execute(a,{action:e}).then(E=>{l(E)}).catch(()=>{l(pa)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new iu().execute("siteKey",{action:"verify"}):new Promise((a,l)=>{s(this.auth).then(u=>{if(!t&&Nr(window.grecaptcha))r(u,a,l);else{if(typeof window>"u"){l(new Error("RecaptchaVerifier is only supported in browser"));return}let p=eu();p.length!==0&&(p+=u),fa(p).then(()=>{r(u,a,l)}).catch(E=>{l(E)})}}).catch(u=>{l(u)})})}}async function Fr(n,e,t,s=!1,r=!1){const a=new ou(n);let l;if(r)l=pa;else try{l=await a.verify(t)}catch{l=await a.verify(t,!0)}const u={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const p=u.phoneEnrollmentInfo.phoneNumber,E=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:p,recaptchaToken:E,captchaResponse:l,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const p=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:p,captchaResponse:l,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return s?Object.assign(u,{captchaResp:l}):Object.assign(u,{captchaResponse:l}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function Fn(n,e,t,s,r){var a;if((a=n._getRecaptchaConfig())!=null&&a.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const l=await Fr(n,e,t,t==="getOobCode");return s(n,l)}else return s(n,e).catch(async l=>{if(l.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await Fr(n,e,t,t==="getOobCode");return s(n,u)}else return Promise.reject(l)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function au(n,e){const t=Je(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),a=t.getOptions();if(ze(a,e??{}))return r;ce(r,"already-initialized")}return t.initialize({options:e})}function cu(n,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Ce);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function lu(n,e,t){const s=Le(n);R(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const r=!1,a=ga(e),{host:l,port:u}=hu(e),p=u===null?"":`:${u}`,E={url:`${a}//${l}${p}/`},S=Object.freeze({host:l,port:u,protocol:a.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!s._canInitEmulator){R(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),R(ze(E,s.config.emulator)&&ze(S,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=E,s.emulatorConfig=S,s.settings.appVerificationDisabledForTesting=!0,bt(l)?(Ji(`${a}//${l}${p}`),Xi("Auth",!0)):uu()}function ga(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function hu(n){const e=ga(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(s);if(r){const a=r[1];return{host:a,port:Vr(s.substr(a.length+1))}}else{const[a,l]=s.split(":");return{host:a,port:Vr(l)}}}function Vr(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function uu(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Re("not implemented")}_getIdTokenResponse(e){return Re("not implemented")}_linkToIdToken(e,t){return Re("not implemented")}_getReauthenticationResolver(e){return Re("not implemented")}}async function du(n,e){return ve(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fu(n,e){return an(n,"POST","/v1/accounts:signInWithPassword",De(n,e))}async function pu(n,e){return ve(n,"POST","/v1/accounts:sendOobCode",De(n,e))}async function gu(n,e){return pu(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mu(n,e){return an(n,"POST","/v1/accounts:signInWithEmailLink",De(n,e))}async function _u(n,e){return an(n,"POST","/v1/accounts:signInWithEmailLink",De(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn extends is{constructor(e,t,s,r=null){super("password",s),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new tn(e,t,"password")}static _fromEmailAndCode(e,t,s=null){return new tn(e,t,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Fn(e,t,"signInWithPassword",fu);case"emailLink":return mu(e,{email:this._email,oobCode:this._password});default:ce(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const s={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Fn(e,s,"signUpPassword",du);case"emailLink":return _u(e,{idToken:t,email:this._email,oobCode:this._password});default:ce(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Et(n,e){return an(n,"POST","/v1/accounts:signInWithIdp",De(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yu="http://localhost";class ct extends is{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new ct(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ce("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:r,...a}=t;if(!s||!r)return null;const l=new ct(s,r);return l.idToken=a.idToken||void 0,l.accessToken=a.accessToken||void 0,l.secret=a.secret,l.nonce=a.nonce,l.pendingToken=a.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return Et(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Et(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Et(e,t)}buildRequest(){const e={requestUri:yu,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=sn(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function wu(n){const e=Gt(zt(n)).link,t=e?Gt(zt(e)).deep_link_id:null,s=Gt(zt(n)).deep_link_id;return(s?Gt(zt(s)).link:null)||s||t||e||n}class ss{constructor(e){const t=Gt(zt(e)),s=t.apiKey??null,r=t.oobCode??null,a=Iu(t.mode??null);R(s&&r&&a,"argument-error"),this.apiKey=s,this.operation=a,this.code=r,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=wu(e);try{return new ss(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(){this.providerId=Rt.PROVIDER_ID}static credential(e,t){return tn._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const s=ss.parseLink(t);return R(s,"argument-error"),tn._fromEmailAndCode(e,s.code,s.tenantId)}}Rt.PROVIDER_ID="password";Rt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Rt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn extends rs{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e extends cn{constructor(){super("facebook.com")}static credential(e){return ct._fromParams({providerId:$e.PROVIDER_ID,signInMethod:$e.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return $e.credentialFromTaggedObject(e)}static credentialFromError(e){return $e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return $e.credential(e.oauthAccessToken)}catch{return null}}}$e.FACEBOOK_SIGN_IN_METHOD="facebook.com";$e.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se extends cn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return ct._fromParams({providerId:Se.PROVIDER_ID,signInMethod:Se.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Se.credentialFromTaggedObject(e)}static credentialFromError(e){return Se.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Se.credential(t,s)}catch{return null}}}Se.GOOGLE_SIGN_IN_METHOD="google.com";Se.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He extends cn{constructor(){super("github.com")}static credential(e){return ct._fromParams({providerId:He.PROVIDER_ID,signInMethod:He.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return He.credentialFromTaggedObject(e)}static credentialFromError(e){return He.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return He.credential(e.oauthAccessToken)}catch{return null}}}He.GITHUB_SIGN_IN_METHOD="github.com";He.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We extends cn{constructor(){super("twitter.com")}static credential(e,t){return ct._fromParams({providerId:We.PROVIDER_ID,signInMethod:We.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return We.credentialFromTaggedObject(e)}static credentialFromError(e){return We.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return We.credential(t,s)}catch{return null}}}We.TWITTER_SIGN_IN_METHOD="twitter.com";We.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Eu(n,e){return an(n,"POST","/v1/accounts:signUp",De(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,r=!1){const a=await ue._fromIdTokenResponse(e,s,r),l=Br(s);return new lt({user:a,providerId:l,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const r=Br(s);return new lt({user:e,providerId:r,_tokenResponse:s,operationType:t})}}function Br(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn extends le{constructor(e,t,s,r){super(t.code,t.message),this.operationType=s,this.user=r,Object.setPrototypeOf(this,Vn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,r){return new Vn(e,t,s,r)}}function ma(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(a=>{throw a.code==="auth/multi-factor-auth-required"?Vn._fromErrorAndOperation(n,a,e,s):a})}async function Tu(n,e,t=!1){const s=await At(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return lt._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vu(n,e,t=!1){const{auth:s}=n;if(te(s.app))return Promise.reject(ke(s));const r="reauthenticate";try{const a=await At(n,ma(s,r,e,n),t);R(a.idToken,s,"internal-error");const l=ts(a.idToken);R(l,s,"internal-error");const{sub:u}=l;return R(n.uid===u,s,"user-mismatch"),lt._forOperation(n,r,a)}catch(a){throw(a==null?void 0:a.code)==="auth/user-not-found"&&ce(s,"user-mismatch"),a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _a(n,e,t=!1){if(te(n.app))return Promise.reject(ke(n));const s="signIn",r=await ma(n,s,e),a=await lt._fromIdTokenResponse(n,s,r);return t||await n._updateCurrentUser(a.user),a}async function Au(n,e){return _a(Le(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ya(n){const e=Le(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Su(n,e,t){const s=Le(n);await Fn(s,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",gu)}async function bu(n,e,t){if(te(n.app))return Promise.reject(ke(n));const s=Le(n),l=await Fn(s,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Eu).catch(p=>{throw p.code==="auth/password-does-not-meet-requirements"&&ya(n),p}),u=await lt._fromIdTokenResponse(s,"signIn",l);return await s._updateCurrentUser(u.user),u}function Ru(n,e,t){return te(n.app)?Promise.reject(ke(n)):Au(ie(n),Rt.credential(e,t)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&ya(n),s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cu(n,e){return ve(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pu(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const s=ie(n),a={idToken:await s.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},l=await At(s,Cu(s.auth,a));s.displayName=l.displayName||null,s.photoURL=l.photoUrl||null;const u=s.providerData.find(({providerId:p})=>p==="password");u&&(u.displayName=s.displayName,u.photoURL=s.photoURL),await s._updateTokensIfNecessary(l)}function ku(n,e,t,s){return ie(n).onIdTokenChanged(e,t,s)}function Ou(n,e,t){return ie(n).beforeAuthStateChanged(e,t)}function Nu(n,e,t,s){return ie(n).onAuthStateChanged(e,t,s)}function Du(n){return ie(n).signOut()}const Bn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ia{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Bn,"1"),this.storage.removeItem(Bn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lu=1e3,Mu=10;class wa extends Ia{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ua(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),r=this.localCache[t];s!==r&&e(t,r,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,u,p)=>{this.notifyListeners(l,p)});return}const s=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const l=this.storage.getItem(s);!t&&this.localCache[s]===l||this.notifyListeners(s,l)},a=this.storage.getItem(s);zh()&&a!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Mu):r()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},Lu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}wa.type="LOCAL";const Uu=wa;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ea extends Ia{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ea.type="SESSION";const Ta=Ea;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xu(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const s=new Jn(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:r,data:a}=t.data,l=this.handlersMap[r];if(!(l!=null&&l.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:r});const u=Array.from(l).map(async E=>E(t.origin,a)),p=await xu(u);t.ports[0].postMessage({status:"done",eventId:s,eventType:r,response:p})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Jn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function os(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let a,l;return new Promise((u,p)=>{const E=os("",20);r.port1.start();const S=setTimeout(()=>{p(new Error("unsupported_event"))},s);l={messageChannel:r,onMessage(b){const v=b;if(v.data.eventId===E)switch(v.data.status){case"ack":clearTimeout(S),a=setTimeout(()=>{p(new Error("timeout"))},3e3);break;case"done":clearTimeout(a),u(v.data.response);break;default:clearTimeout(S),clearTimeout(a),p(new Error("invalid_response"));break}}},this.handlers.add(l),r.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:E,data:t},[r.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(){return window}function Vu(n){Ee().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va(){return typeof Ee().WorkerGlobalScope<"u"&&typeof Ee().importScripts=="function"}async function Bu(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ju(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function $u(){return va()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Aa="firebaseLocalStorageDb",Hu=1,jn="firebaseLocalStorage",Sa="fbase_key";class ln{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Xn(n,e){return n.transaction([jn],e?"readwrite":"readonly").objectStore(jn)}function Wu(){const n=indexedDB.deleteDatabase(Aa);return new ln(n).toPromise()}function qi(){const n=indexedDB.open(Aa,Hu);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(jn,{keyPath:Sa})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(jn)?e(s):(s.close(),await Wu(),e(await qi()))})})}async function jr(n,e,t){const s=Xn(n,!0).put({[Sa]:e,value:t});return new ln(s).toPromise()}async function qu(n,e){const t=Xn(n,!1).get(e),s=await new ln(t).toPromise();return s===void 0?null:s.value}function $r(n,e){const t=Xn(n,!0).delete(e);return new ln(t).toPromise()}const Gu=800,zu=3;class ba{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await qi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>zu)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return va()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Jn._getInstance($u()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,s;if(this.activeServiceWorker=await Bu(),!this.activeServiceWorker)return;this.sender=new Fu(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(s=e[0])!=null&&s.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ju()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await qi();return await jr(e,Bn,"1"),await $r(e,Bn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>jr(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>qu(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>$r(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const a=Xn(r,!1).getAll();return new ln(a).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:r,value:a}of e)s.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(a)&&(this.notifyListeners(r,a),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!s.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const r of Array.from(s))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Gu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ba.type="LOCAL";const Ku=ba;new on(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ra(n,e){return e?Ce(e):(R(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as extends is{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Et(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Et(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Et(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Ju(n){return _a(n.auth,new as(n),n.bypassAuthState)}function Xu(n){const{auth:e,user:t}=n;return R(t,e,"internal-error"),vu(t,new as(n),n.bypassAuthState)}async function Yu(n){const{auth:e,user:t}=n;return R(t,e,"internal-error"),Tu(t,new as(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(e,t,s,r,a=!1){this.auth=e,this.resolver=s,this.user=r,this.bypassAuthState=a,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:r,tenantId:a,error:l,type:u}=e;if(l){this.reject(l);return}const p={auth:this.auth,requestUri:t,sessionId:s,tenantId:a||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(p))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ju;case"linkViaPopup":case"linkViaRedirect":return Yu;case"reauthViaPopup":case"reauthViaRedirect":return Xu;default:ce(this.auth,"internal-error")}}resolve(e){Ne(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ne(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zu=new on(2e3,1e4);async function Qu(n,e,t){if(te(n.app))return Promise.reject(pe(n,"operation-not-supported-in-this-environment"));const s=Le(n);Rh(n,e,rs);const r=Ra(s,t);return new it(s,"signInViaPopup",e,r).executeNotNull()}class it extends Ca{constructor(e,t,s,r,a){super(e,t,r,a),this.provider=s,this.authWindow=null,this.pollId=null,it.currentPopupAction&&it.currentPopupAction.cancel(),it.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return R(e,this.auth,"internal-error"),e}async onExecution(){Ne(this.filter.length===1,"Popup operations only handle one event");const e=os();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(pe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(pe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,it.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if((s=(t=this.authWindow)==null?void 0:t.window)!=null&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(pe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Zu.get())};e()}}it.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ed="pendingRedirect",On=new Map;class td extends Ca{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=On.get(this.auth._key());if(!e){try{const s=await nd(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}On.set(this.auth._key(),e)}return this.bypassAuthState||On.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function nd(n,e){const t=rd(e),s=sd(n);if(!await s._isAvailable())return!1;const r=await s._get(t)==="true";return await s._remove(t),r}function id(n,e){On.set(n._key(),e)}function sd(n){return Ce(n._redirectPersistence)}function rd(n){return kn(ed,n.config.apiKey,n.name)}async function od(n,e,t=!1){if(te(n.app))return Promise.reject(ke(n));const s=Le(n),r=Ra(s,e),l=await new td(s,r,t).execute();return l&&!t&&(delete l.user._redirectEventId,await s._persistUserIfCurrent(l.user),await s._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ad=10*60*1e3;class cd{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ld(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!Pa(e)){const r=((s=e.error.code)==null?void 0:s.split("auth/")[1])||"internal-error";t.onError(pe(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ad&&this.cachedEventUids.clear(),this.cachedEventUids.has(Hr(e))}saveEventToCache(e){this.cachedEventUids.add(Hr(e)),this.lastProcessedEventTime=Date.now()}}function Hr(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Pa({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function ld(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Pa(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hd(n,e={}){return ve(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,dd=/^https?/;async function fd(n){if(n.config.emulator)return;const{authorizedDomains:e}=await hd(n);for(const t of e)try{if(pd(t))return}catch{}ce(n,"unauthorized-domain")}function pd(n){const e=Hi(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const l=new URL(n);return l.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===s}if(!dd.test(t))return!1;if(ud.test(n))return s===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gd=new on(3e4,6e4);function Wr(){const n=Ee().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function md(n){return new Promise((e,t)=>{var r,a,l;function s(){Wr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Wr(),t(pe(n,"network-request-failed"))},timeout:gd.get()})}if((a=(r=Ee().gapi)==null?void 0:r.iframes)!=null&&a.Iframe)e(gapi.iframes.getContext());else if((l=Ee().gapi)!=null&&l.load)s();else{const u=nu("iframefcb");return Ee()[u]=()=>{gapi.load?s():t(pe(n,"network-request-failed"))},fa(`${tu()}?onload=${u}`).catch(p=>t(p))}}).catch(e=>{throw Nn=null,e})}let Nn=null;function _d(n){return Nn=Nn||md(n),Nn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yd=new on(5e3,15e3),Id="__/auth/iframe",wd="emulator/auth/iframe",Ed={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Td=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function vd(n){const e=n.config;R(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?es(e,wd):`https://${n.config.authDomain}/${Id}`,s={apiKey:e.apiKey,appName:n.name,v:pt},r=Td.get(n.config.apiHost);r&&(s.eid=r);const a=n._getFrameworks();return a.length&&(s.fw=a.join(",")),`${t}?${sn(s).slice(1)}`}async function Ad(n){const e=await _d(n),t=Ee().gapi;return R(t,n,"internal-error"),e.open({where:document.body,url:vd(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Ed,dontclear:!0},s=>new Promise(async(r,a)=>{await s.restyle({setHideOnLeave:!1});const l=pe(n,"network-request-failed"),u=Ee().setTimeout(()=>{a(l)},yd.get());function p(){Ee().clearTimeout(u),r(s)}s.ping(p).then(p,()=>{a(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sd={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},bd=500,Rd=600,Cd="_blank",Pd="http://localhost";class qr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function kd(n,e,t,s=bd,r=Rd){const a=Math.max((window.screen.availHeight-r)/2,0).toString(),l=Math.max((window.screen.availWidth-s)/2,0).toString();let u="";const p={...Sd,width:s.toString(),height:r.toString(),top:a,left:l},E=Q().toLowerCase();t&&(u=oa(E)?Cd:t),sa(E)&&(e=e||Pd,p.scrollbars="yes");const S=Object.entries(p).reduce((v,[M,D])=>`${v}${M}=${D},`,"");if(Gh(E)&&u!=="_self")return Od(e||"",u),new qr(null);const b=window.open(e||"",u,S);R(b,n,"popup-blocked");try{b.focus()}catch{}return new qr(b)}function Od(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nd="__/auth/handler",Dd="emulator/auth/handler",Ld=encodeURIComponent("fac");async function Gr(n,e,t,s,r,a){R(n.config.authDomain,n,"auth-domain-config-required"),R(n.config.apiKey,n,"invalid-api-key");const l={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:pt,eventId:r};if(e instanceof rs){e.setDefaultLanguage(n.languageCode),l.providerId=e.providerId||"",ll(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[S,b]of Object.entries({}))l[S]=b}if(e instanceof cn){const S=e.getScopes().filter(b=>b!=="");S.length>0&&(l.scopes=S.join(","))}n.tenantId&&(l.tid=n.tenantId);const u=l;for(const S of Object.keys(u))u[S]===void 0&&delete u[S];const p=await n._getAppCheckToken(),E=p?`#${Ld}=${encodeURIComponent(p)}`:"";return`${Md(n)}?${sn(u).slice(1)}${E}`}function Md({config:n}){return n.emulator?es(n,Dd):`https://${n.authDomain}/${Nd}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oi="webStorageSupport";class Ud{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ta,this._completeRedirectFn=od,this._overrideRedirectResult=id}async _openPopup(e,t,s,r){var l;Ne((l=this.eventManagers[e._key()])==null?void 0:l.manager,"_initialize() not called before _openPopup()");const a=await Gr(e,t,s,Hi(),r);return kd(e,a,os())}async _openRedirect(e,t,s,r){await this._originValidation(e);const a=await Gr(e,t,s,Hi(),r);return Vu(a),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:a}=this.eventManagers[t];return r?Promise.resolve(r):(Ne(a,"If manager is not set, promise should be"),a)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await Ad(e),s=new cd(e);return t.register("authEvent",r=>(R(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:s.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Oi,{type:Oi},r=>{var l;const a=(l=r==null?void 0:r[0])==null?void 0:l[Oi];a!==void 0&&t(!!a),ce(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=fd(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ua()||ra()||ns()}}const xd=Ud;var zr="@firebase/auth",Kr="1.11.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){R(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vd(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Bd(n){ge(new ae("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),a=e.getProvider("app-check-internal"),{apiKey:l,authDomain:u}=s.options;R(l&&!l.includes(":"),"invalid-api-key",{appName:s.name});const p={apiKey:l,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:da(n)},E=new Zh(s,r,a,p);return cu(E,t),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),ge(new ae("auth-internal",e=>{const t=Le(e.getProvider("auth").getImmediate());return(s=>new Fd(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),ne(zr,Kr,Vd(n)),ne(zr,Kr,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jd=5*60,$d=Bo("authIdTokenMaxAge")||jd;let Jr=null;const Hd=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>$d)return;const r=t==null?void 0:t.token;Jr!==r&&(Jr=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function ka(n=rn()){const e=Je(n,"auth");if(e.isInitialized())return e.getImmediate();const t=au(n,{popupRedirectResolver:xd,persistence:[Ku,Uu,Ta]}),s=Bo("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const a=new URL(s,location.origin);if(location.origin===a.origin){const l=Hd(a.toString());Ou(t,l,()=>l(t.currentUser)),ku(t,u=>l(u))}}const r=xo("auth");return r&&lu(t,`http://${r}`),t}function Wd(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}Qh({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=r=>{const a=pe("internal-error");a.customData=r,t(a)},s.type="text/javascript",s.charset="UTF-8",Wd().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Bd("Browser");var qd="firebase",Gd="12.5.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ne(qd,Gd,"app");const Oa="@firebase/installations",cs="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Na=1e4,Da=`w:${cs}`,La="FIS_v2",zd="https://firebaseinstallations.googleapis.com/v1",Kd=60*60*1e3,Jd="installations",Xd="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},ht=new ft(Jd,Xd,Yd);function Ma(n){return n instanceof le&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ua({projectId:n}){return`${zd}/projects/${n}/installations`}function xa(n){return{token:n.token,requestStatus:2,expiresIn:Qd(n.expiresIn),creationTime:Date.now()}}async function Fa(n,e){const s=(await e.json()).error;return ht.create("request-failed",{requestName:n,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function Va({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function Zd(n,{refreshToken:e}){const t=Va(n);return t.append("Authorization",ef(e)),t}async function Ba(n){const e=await n();return e.status>=500&&e.status<600?n():e}function Qd(n){return Number(n.replace("s","000"))}function ef(n){return`${La} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tf({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const s=Ua(n),r=Va(n),a=e.getImmediate({optional:!0});if(a){const E=await a.getHeartbeatsHeader();E&&r.append("x-firebase-client",E)}const l={fid:t,authVersion:La,appId:n.appId,sdkVersion:Da},u={method:"POST",headers:r,body:JSON.stringify(l)},p=await Ba(()=>fetch(s,u));if(p.ok){const E=await p.json();return{fid:E.fid||t,registrationStatus:2,refreshToken:E.refreshToken,authToken:xa(E.authToken)}}else throw await Fa("Create Installation",p)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ja(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nf(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sf=/^[cdef][\w-]{21}$/,Gi="";function rf(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=of(n);return sf.test(t)?t:Gi}catch{return Gi}}function of(n){return nf(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yn(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $a=new Map;function Ha(n,e){const t=Yn(n);Wa(t,e),af(t,e)}function Wa(n,e){const t=$a.get(n);if(t)for(const s of t)s(e)}function af(n,e){const t=cf();t&&t.postMessage({key:n,fid:e}),lf()}let st=null;function cf(){return!st&&"BroadcastChannel"in self&&(st=new BroadcastChannel("[Firebase] FID Change"),st.onmessage=n=>{Wa(n.data.key,n.data.fid)}),st}function lf(){$a.size===0&&st&&(st.close(),st=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hf="firebase-installations-database",uf=1,ut="firebase-installations-store";let Ni=null;function ls(){return Ni||(Ni=zo(hf,uf,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(ut)}}})),Ni}async function $n(n,e){const t=Yn(n),r=(await ls()).transaction(ut,"readwrite"),a=r.objectStore(ut),l=await a.get(t);return await a.put(e,t),await r.done,(!l||l.fid!==e.fid)&&Ha(n,e.fid),e}async function qa(n){const e=Yn(n),s=(await ls()).transaction(ut,"readwrite");await s.objectStore(ut).delete(e),await s.done}async function Zn(n,e){const t=Yn(n),r=(await ls()).transaction(ut,"readwrite"),a=r.objectStore(ut),l=await a.get(t),u=e(l);return u===void 0?await a.delete(t):await a.put(u,t),await r.done,u&&(!l||l.fid!==u.fid)&&Ha(n,u.fid),u}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hs(n){let e;const t=await Zn(n.appConfig,s=>{const r=df(s),a=ff(n,r);return e=a.registrationPromise,a.installationEntry});return t.fid===Gi?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function df(n){const e=n||{fid:rf(),registrationStatus:0};return Ga(e)}function ff(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const r=Promise.reject(ht.create("app-offline"));return{installationEntry:e,registrationPromise:r}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},s=pf(n,t);return{installationEntry:t,registrationPromise:s}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:gf(n)}:{installationEntry:e}}async function pf(n,e){try{const t=await tf(n,e);return $n(n.appConfig,t)}catch(t){throw Ma(t)&&t.customData.serverCode===409?await qa(n.appConfig):await $n(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function gf(n){let e=await Xr(n.appConfig);for(;e.registrationStatus===1;)await ja(100),e=await Xr(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:s}=await hs(n);return s||t}return e}function Xr(n){return Zn(n,e=>{if(!e)throw ht.create("installation-not-found");return Ga(e)})}function Ga(n){return mf(n)?{fid:n.fid,registrationStatus:0}:n}function mf(n){return n.registrationStatus===1&&n.registrationTime+Na<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _f({appConfig:n,heartbeatServiceProvider:e},t){const s=yf(n,t),r=Zd(n,t),a=e.getImmediate({optional:!0});if(a){const E=await a.getHeartbeatsHeader();E&&r.append("x-firebase-client",E)}const l={installation:{sdkVersion:Da,appId:n.appId}},u={method:"POST",headers:r,body:JSON.stringify(l)},p=await Ba(()=>fetch(s,u));if(p.ok){const E=await p.json();return xa(E)}else throw await Fa("Generate Auth Token",p)}function yf(n,{fid:e}){return`${Ua(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function us(n,e=!1){let t;const s=await Zn(n.appConfig,a=>{if(!za(a))throw ht.create("not-registered");const l=a.authToken;if(!e&&Ef(l))return a;if(l.requestStatus===1)return t=If(n,e),a;{if(!navigator.onLine)throw ht.create("app-offline");const u=vf(a);return t=wf(n,u),u}});return t?await t:s.authToken}async function If(n,e){let t=await Yr(n.appConfig);for(;t.authToken.requestStatus===1;)await ja(100),t=await Yr(n.appConfig);const s=t.authToken;return s.requestStatus===0?us(n,e):s}function Yr(n){return Zn(n,e=>{if(!za(e))throw ht.create("not-registered");const t=e.authToken;return Af(t)?{...e,authToken:{requestStatus:0}}:e})}async function wf(n,e){try{const t=await _f(n,e),s={...e,authToken:t};return await $n(n.appConfig,s),t}catch(t){if(Ma(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await qa(n.appConfig);else{const s={...e,authToken:{requestStatus:0}};await $n(n.appConfig,s)}throw t}}function za(n){return n!==void 0&&n.registrationStatus===2}function Ef(n){return n.requestStatus===2&&!Tf(n)}function Tf(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Kd}function vf(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function Af(n){return n.requestStatus===1&&n.requestTime+Na<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sf(n){const e=n,{installationEntry:t,registrationPromise:s}=await hs(e);return s?s.catch(console.error):us(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bf(n,e=!1){const t=n;return await Rf(t),(await us(t,e)).token}async function Rf(n){const{registrationPromise:e}=await hs(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cf(n){if(!n||!n.options)throw Di("App Configuration");if(!n.name)throw Di("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Di(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Di(n){return ht.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ka="installations",Pf="installations-internal",kf=n=>{const e=n.getProvider("app").getImmediate(),t=Cf(e),s=Je(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},Of=n=>{const e=n.getProvider("app").getImmediate(),t=Je(e,Ka).getImmediate();return{getId:()=>Sf(t),getToken:r=>bf(t,r)}};function Nf(){ge(new ae(Ka,kf,"PUBLIC")),ge(new ae(Pf,Of,"PRIVATE"))}Nf();ne(Oa,cs);ne(Oa,cs,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hn="analytics",Df="firebase_id",Lf="origin",Mf=60*1e3,Uf="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ds="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z=new zn("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},re=new ft("analytics","Analytics",xf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ff(n){if(!n.startsWith(ds)){const e=re.create("invalid-gtag-resource",{gtagURL:n});return Z.warn(e.message),""}return n}function Ja(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Vf(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Bf(n,e){const t=Vf("firebase-js-sdk-policy",{createScriptURL:Ff}),s=document.createElement("script"),r=`${ds}?l=${n}&id=${e}`;s.src=t?t==null?void 0:t.createScriptURL(r):r,s.async=!0,document.head.appendChild(s)}function jf(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function $f(n,e,t,s,r,a){const l=s[r];try{if(l)await e[l];else{const p=(await Ja(t)).find(E=>E.measurementId===r);p&&await e[p.appId]}}catch(u){Z.error(u)}n("config",r,a)}async function Hf(n,e,t,s,r){try{let a=[];if(r&&r.send_to){let l=r.send_to;Array.isArray(l)||(l=[l]);const u=await Ja(t);for(const p of l){const E=u.find(b=>b.measurementId===p),S=E&&e[E.appId];if(S)a.push(S);else{a=[];break}}}a.length===0&&(a=Object.values(e)),await Promise.all(a),n("event",s,r||{})}catch(a){Z.error(a)}}function Wf(n,e,t,s){async function r(a,...l){try{if(a==="event"){const[u,p]=l;await Hf(n,e,t,u,p)}else if(a==="config"){const[u,p]=l;await $f(n,e,t,s,u,p)}else if(a==="consent"){const[u,p]=l;n("consent",u,p)}else if(a==="get"){const[u,p,E]=l;n("get",u,p,E)}else if(a==="set"){const[u]=l;n("set",u)}else n(a,...l)}catch(u){Z.error(u)}}return r}function qf(n,e,t,s,r){let a=function(...l){window[s].push(arguments)};return window[r]&&typeof window[r]=="function"&&(a=window[r]),window[r]=Wf(a,n,e,t),{gtagCore:a,wrappedGtag:window[r]}}function Gf(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(ds)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zf=30,Kf=1e3;class Jf{constructor(e={},t=Kf){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Xa=new Jf;function Xf(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Yf(n){var l;const{appId:e,apiKey:t}=n,s={method:"GET",headers:Xf(t)},r=Uf.replace("{app-id}",e),a=await fetch(r,s);if(a.status!==200&&a.status!==304){let u="";try{const p=await a.json();(l=p.error)!=null&&l.message&&(u=p.error.message)}catch{}throw re.create("config-fetch-failed",{httpStatus:a.status,responseMessage:u})}return a.json()}async function Zf(n,e=Xa,t){const{appId:s,apiKey:r,measurementId:a}=n.options;if(!s)throw re.create("no-app-id");if(!r){if(a)return{measurementId:a,appId:s};throw re.create("no-api-key")}const l=e.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new tp;return setTimeout(async()=>{u.abort()},Mf),Ya({appId:s,apiKey:r,measurementId:a},l,u,e)}async function Ya(n,{throttleEndTimeMillis:e,backoffCount:t},s,r=Xa){var u;const{appId:a,measurementId:l}=n;try{await Qf(s,e)}catch(p){if(l)return Z.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${p==null?void 0:p.message}]`),{appId:a,measurementId:l};throw p}try{const p=await Yf(n);return r.deleteThrottleMetadata(a),p}catch(p){const E=p;if(!ep(E)){if(r.deleteThrottleMetadata(a),l)return Z.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${E==null?void 0:E.message}]`),{appId:a,measurementId:l};throw p}const S=Number((u=E==null?void 0:E.customData)==null?void 0:u.httpStatus)===503?Tr(t,r.intervalMillis,zf):Tr(t,r.intervalMillis),b={throttleEndTimeMillis:Date.now()+S,backoffCount:t+1};return r.setThrottleMetadata(a,b),Z.debug(`Calling attemptFetch again in ${S} millis`),Ya(n,b,s,r)}}function Qf(n,e){return new Promise((t,s)=>{const r=Math.max(e-Date.now(),0),a=setTimeout(t,r);n.addEventListener(()=>{clearTimeout(a),s(re.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function ep(n){if(!(n instanceof le)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class tp{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function np(n,e,t,s,r){if(r&&r.global){n("event",t,s);return}else{const a=await e,l={...s,send_to:a};n("event",t,l)}}async function ip(n,e,t,s){if(s&&s.global){const r={};for(const a of Object.keys(t))r[`user_properties.${a}`]=t[a];return n("set",r),Promise.resolve()}else{const r=await e;n("config",r,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sp(){if(Ho())try{await Wo()}catch(n){return Z.warn(re.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Z.warn(re.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function rp(n,e,t,s,r,a,l){const u=Zf(n);u.then(v=>{t[v.measurementId]=v.appId,n.options.measurementId&&v.measurementId!==n.options.measurementId&&Z.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${v.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(v=>Z.error(v)),e.push(u);const p=sp().then(v=>{if(v)return s.getId()}),[E,S]=await Promise.all([u,p]);Gf(a)||Bf(a,E.measurementId),r("js",new Date);const b=(l==null?void 0:l.config)??{};return b[Lf]="firebase",b.update=!0,S!=null&&(b[Df]=S),r("config",E.measurementId,b),E.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class op{constructor(e){this.app=e}_delete(){return delete Tt[this.app.options.appId],Promise.resolve()}}let Tt={},Zr=[];const Qr={};let Li="dataLayer",ap="gtag",eo,fs,to=!1;function cp(){const n=[];if($o()&&n.push("This is a browser extension environment."),rl()||n.push("Cookies are not available."),n.length>0){const e=n.map((s,r)=>`(${r+1}) ${s}`).join(" "),t=re.create("invalid-analytics-context",{errorInfo:e});Z.warn(t.message)}}function lp(n,e,t){cp();const s=n.options.appId;if(!s)throw re.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Z.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw re.create("no-api-key");if(Tt[s]!=null)throw re.create("already-exists",{id:s});if(!to){jf(Li);const{wrappedGtag:a,gtagCore:l}=qf(Tt,Zr,Qr,Li,ap);fs=a,eo=l,to=!0}return Tt[s]=rp(n,Zr,Qr,e,eo,Li,t),new op(n)}function hp(n=rn()){n=ie(n);const e=Je(n,Hn);return e.isInitialized()?e.getImmediate():up(n)}function up(n,e={}){const t=Je(n,Hn);if(t.isInitialized()){const r=t.getImmediate();if(ze(e,t.getOptions()))return r;throw re.create("already-initialized")}return t.initialize({options:e})}function dp(n,e,t){n=ie(n),ip(fs,Tt[n.app.options.appId],e,t).catch(s=>Z.error(s))}function fp(n,e,t,s){n=ie(n),np(fs,Tt[n.app.options.appId],e,t,s).catch(r=>Z.error(r))}const no="@firebase/analytics",io="0.10.19";function pp(){ge(new ae(Hn,(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),r=e.getProvider("installations-internal").getImmediate();return lp(s,r,t)},"PUBLIC")),ge(new ae("analytics-internal",n,"PRIVATE")),ne(no,io),ne(no,io,"esm2020");function n(e){try{const t=e.getProvider(Hn).getImmediate();return{logEvent:(s,r,a)=>fp(t,s,r,a),setUserProperties:(s,r)=>dp(t,s,r)}}catch(t){throw re.create("interop-component-reg-failed",{reason:t})}}}pp();var so=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ps;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(_,d){function g(){}g.prototype=d.prototype,_.F=d.prototype,_.prototype=new g,_.prototype.constructor=_,_.D=function(y,m,w){for(var f=Array(arguments.length-2),ee=2;ee<arguments.length;ee++)f[ee-2]=arguments[ee];return d.prototype[m].apply(y,f)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(s,t),s.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(_,d,g){g||(g=0);const y=Array(16);if(typeof d=="string")for(var m=0;m<16;++m)y[m]=d.charCodeAt(g++)|d.charCodeAt(g++)<<8|d.charCodeAt(g++)<<16|d.charCodeAt(g++)<<24;else for(m=0;m<16;++m)y[m]=d[g++]|d[g++]<<8|d[g++]<<16|d[g++]<<24;d=_.g[0],g=_.g[1],m=_.g[2];let w=_.g[3],f;f=d+(w^g&(m^w))+y[0]+3614090360&4294967295,d=g+(f<<7&4294967295|f>>>25),f=w+(m^d&(g^m))+y[1]+3905402710&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(g^w&(d^g))+y[2]+606105819&4294967295,m=w+(f<<17&4294967295|f>>>15),f=g+(d^m&(w^d))+y[3]+3250441966&4294967295,g=m+(f<<22&4294967295|f>>>10),f=d+(w^g&(m^w))+y[4]+4118548399&4294967295,d=g+(f<<7&4294967295|f>>>25),f=w+(m^d&(g^m))+y[5]+1200080426&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(g^w&(d^g))+y[6]+2821735955&4294967295,m=w+(f<<17&4294967295|f>>>15),f=g+(d^m&(w^d))+y[7]+4249261313&4294967295,g=m+(f<<22&4294967295|f>>>10),f=d+(w^g&(m^w))+y[8]+1770035416&4294967295,d=g+(f<<7&4294967295|f>>>25),f=w+(m^d&(g^m))+y[9]+2336552879&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(g^w&(d^g))+y[10]+4294925233&4294967295,m=w+(f<<17&4294967295|f>>>15),f=g+(d^m&(w^d))+y[11]+2304563134&4294967295,g=m+(f<<22&4294967295|f>>>10),f=d+(w^g&(m^w))+y[12]+1804603682&4294967295,d=g+(f<<7&4294967295|f>>>25),f=w+(m^d&(g^m))+y[13]+4254626195&4294967295,w=d+(f<<12&4294967295|f>>>20),f=m+(g^w&(d^g))+y[14]+2792965006&4294967295,m=w+(f<<17&4294967295|f>>>15),f=g+(d^m&(w^d))+y[15]+1236535329&4294967295,g=m+(f<<22&4294967295|f>>>10),f=d+(m^w&(g^m))+y[1]+4129170786&4294967295,d=g+(f<<5&4294967295|f>>>27),f=w+(g^m&(d^g))+y[6]+3225465664&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^g&(w^d))+y[11]+643717713&4294967295,m=w+(f<<14&4294967295|f>>>18),f=g+(w^d&(m^w))+y[0]+3921069994&4294967295,g=m+(f<<20&4294967295|f>>>12),f=d+(m^w&(g^m))+y[5]+3593408605&4294967295,d=g+(f<<5&4294967295|f>>>27),f=w+(g^m&(d^g))+y[10]+38016083&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^g&(w^d))+y[15]+3634488961&4294967295,m=w+(f<<14&4294967295|f>>>18),f=g+(w^d&(m^w))+y[4]+3889429448&4294967295,g=m+(f<<20&4294967295|f>>>12),f=d+(m^w&(g^m))+y[9]+568446438&4294967295,d=g+(f<<5&4294967295|f>>>27),f=w+(g^m&(d^g))+y[14]+3275163606&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^g&(w^d))+y[3]+4107603335&4294967295,m=w+(f<<14&4294967295|f>>>18),f=g+(w^d&(m^w))+y[8]+1163531501&4294967295,g=m+(f<<20&4294967295|f>>>12),f=d+(m^w&(g^m))+y[13]+2850285829&4294967295,d=g+(f<<5&4294967295|f>>>27),f=w+(g^m&(d^g))+y[2]+4243563512&4294967295,w=d+(f<<9&4294967295|f>>>23),f=m+(d^g&(w^d))+y[7]+1735328473&4294967295,m=w+(f<<14&4294967295|f>>>18),f=g+(w^d&(m^w))+y[12]+2368359562&4294967295,g=m+(f<<20&4294967295|f>>>12),f=d+(g^m^w)+y[5]+4294588738&4294967295,d=g+(f<<4&4294967295|f>>>28),f=w+(d^g^m)+y[8]+2272392833&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^g)+y[11]+1839030562&4294967295,m=w+(f<<16&4294967295|f>>>16),f=g+(m^w^d)+y[14]+4259657740&4294967295,g=m+(f<<23&4294967295|f>>>9),f=d+(g^m^w)+y[1]+2763975236&4294967295,d=g+(f<<4&4294967295|f>>>28),f=w+(d^g^m)+y[4]+1272893353&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^g)+y[7]+4139469664&4294967295,m=w+(f<<16&4294967295|f>>>16),f=g+(m^w^d)+y[10]+3200236656&4294967295,g=m+(f<<23&4294967295|f>>>9),f=d+(g^m^w)+y[13]+681279174&4294967295,d=g+(f<<4&4294967295|f>>>28),f=w+(d^g^m)+y[0]+3936430074&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^g)+y[3]+3572445317&4294967295,m=w+(f<<16&4294967295|f>>>16),f=g+(m^w^d)+y[6]+76029189&4294967295,g=m+(f<<23&4294967295|f>>>9),f=d+(g^m^w)+y[9]+3654602809&4294967295,d=g+(f<<4&4294967295|f>>>28),f=w+(d^g^m)+y[12]+3873151461&4294967295,w=d+(f<<11&4294967295|f>>>21),f=m+(w^d^g)+y[15]+530742520&4294967295,m=w+(f<<16&4294967295|f>>>16),f=g+(m^w^d)+y[2]+3299628645&4294967295,g=m+(f<<23&4294967295|f>>>9),f=d+(m^(g|~w))+y[0]+4096336452&4294967295,d=g+(f<<6&4294967295|f>>>26),f=w+(g^(d|~m))+y[7]+1126891415&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~g))+y[14]+2878612391&4294967295,m=w+(f<<15&4294967295|f>>>17),f=g+(w^(m|~d))+y[5]+4237533241&4294967295,g=m+(f<<21&4294967295|f>>>11),f=d+(m^(g|~w))+y[12]+1700485571&4294967295,d=g+(f<<6&4294967295|f>>>26),f=w+(g^(d|~m))+y[3]+2399980690&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~g))+y[10]+4293915773&4294967295,m=w+(f<<15&4294967295|f>>>17),f=g+(w^(m|~d))+y[1]+2240044497&4294967295,g=m+(f<<21&4294967295|f>>>11),f=d+(m^(g|~w))+y[8]+1873313359&4294967295,d=g+(f<<6&4294967295|f>>>26),f=w+(g^(d|~m))+y[15]+4264355552&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~g))+y[6]+2734768916&4294967295,m=w+(f<<15&4294967295|f>>>17),f=g+(w^(m|~d))+y[13]+1309151649&4294967295,g=m+(f<<21&4294967295|f>>>11),f=d+(m^(g|~w))+y[4]+4149444226&4294967295,d=g+(f<<6&4294967295|f>>>26),f=w+(g^(d|~m))+y[11]+3174756917&4294967295,w=d+(f<<10&4294967295|f>>>22),f=m+(d^(w|~g))+y[2]+718787259&4294967295,m=w+(f<<15&4294967295|f>>>17),f=g+(w^(m|~d))+y[9]+3951481745&4294967295,_.g[0]=_.g[0]+d&4294967295,_.g[1]=_.g[1]+(m+(f<<21&4294967295|f>>>11))&4294967295,_.g[2]=_.g[2]+m&4294967295,_.g[3]=_.g[3]+w&4294967295}s.prototype.v=function(_,d){d===void 0&&(d=_.length);const g=d-this.blockSize,y=this.C;let m=this.h,w=0;for(;w<d;){if(m==0)for(;w<=g;)r(this,_,w),w+=this.blockSize;if(typeof _=="string"){for(;w<d;)if(y[m++]=_.charCodeAt(w++),m==this.blockSize){r(this,y),m=0;break}}else for(;w<d;)if(y[m++]=_[w++],m==this.blockSize){r(this,y),m=0;break}}this.h=m,this.o+=d},s.prototype.A=function(){var _=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);_[0]=128;for(var d=1;d<_.length-8;++d)_[d]=0;d=this.o*8;for(var g=_.length-8;g<_.length;++g)_[g]=d&255,d/=256;for(this.v(_),_=Array(16),d=0,g=0;g<4;++g)for(let y=0;y<32;y+=8)_[d++]=this.g[g]>>>y&255;return _};function a(_,d){var g=u;return Object.prototype.hasOwnProperty.call(g,_)?g[_]:g[_]=d(_)}function l(_,d){this.h=d;const g=[];let y=!0;for(let m=_.length-1;m>=0;m--){const w=_[m]|0;y&&w==d||(g[m]=w,y=!1)}this.g=g}var u={};function p(_){return-128<=_&&_<128?a(_,function(d){return new l([d|0],d<0?-1:0)}):new l([_|0],_<0?-1:0)}function E(_){if(isNaN(_)||!isFinite(_))return b;if(_<0)return P(E(-_));const d=[];let g=1;for(let y=0;_>=g;y++)d[y]=_/g|0,g*=4294967296;return new l(d,0)}function S(_,d){if(_.length==0)throw Error("number format error: empty string");if(d=d||10,d<2||36<d)throw Error("radix out of range: "+d);if(_.charAt(0)=="-")return P(S(_.substring(1),d));if(_.indexOf("-")>=0)throw Error('number format error: interior "-" character');const g=E(Math.pow(d,8));let y=b;for(let w=0;w<_.length;w+=8){var m=Math.min(8,_.length-w);const f=parseInt(_.substring(w,w+m),d);m<8?(m=E(Math.pow(d,m)),y=y.j(m).add(E(f))):(y=y.j(g),y=y.add(E(f)))}return y}var b=p(0),v=p(1),M=p(16777216);n=l.prototype,n.m=function(){if(U(this))return-P(this).m();let _=0,d=1;for(let g=0;g<this.g.length;g++){const y=this.i(g);_+=(y>=0?y:4294967296+y)*d,d*=4294967296}return _},n.toString=function(_){if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(D(this))return"0";if(U(this))return"-"+P(this).toString(_);const d=E(Math.pow(_,6));var g=this;let y="";for(;;){const m=B(g,d).g;g=W(g,m.j(d));let w=((g.g.length>0?g.g[0]:g.h)>>>0).toString(_);if(g=m,D(g))return w+y;for(;w.length<6;)w="0"+w;y=w+y}},n.i=function(_){return _<0?0:_<this.g.length?this.g[_]:this.h};function D(_){if(_.h!=0)return!1;for(let d=0;d<_.g.length;d++)if(_.g[d]!=0)return!1;return!0}function U(_){return _.h==-1}n.l=function(_){return _=W(this,_),U(_)?-1:D(_)?0:1};function P(_){const d=_.g.length,g=[];for(let y=0;y<d;y++)g[y]=~_.g[y];return new l(g,~_.h).add(v)}n.abs=function(){return U(this)?P(this):this},n.add=function(_){const d=Math.max(this.g.length,_.g.length),g=[];let y=0;for(let m=0;m<=d;m++){let w=y+(this.i(m)&65535)+(_.i(m)&65535),f=(w>>>16)+(this.i(m)>>>16)+(_.i(m)>>>16);y=f>>>16,w&=65535,f&=65535,g[m]=f<<16|w}return new l(g,g[g.length-1]&-2147483648?-1:0)};function W(_,d){return _.add(P(d))}n.j=function(_){if(D(this)||D(_))return b;if(U(this))return U(_)?P(this).j(P(_)):P(P(this).j(_));if(U(_))return P(this.j(P(_)));if(this.l(M)<0&&_.l(M)<0)return E(this.m()*_.m());const d=this.g.length+_.g.length,g=[];for(var y=0;y<2*d;y++)g[y]=0;for(y=0;y<this.g.length;y++)for(let m=0;m<_.g.length;m++){const w=this.i(y)>>>16,f=this.i(y)&65535,ee=_.i(m)>>>16,Xe=_.i(m)&65535;g[2*y+2*m]+=f*Xe,K(g,2*y+2*m),g[2*y+2*m+1]+=w*Xe,K(g,2*y+2*m+1),g[2*y+2*m+1]+=f*ee,K(g,2*y+2*m+1),g[2*y+2*m+2]+=w*ee,K(g,2*y+2*m+2)}for(_=0;_<d;_++)g[_]=g[2*_+1]<<16|g[2*_];for(_=d;_<2*d;_++)g[_]=0;return new l(g,0)};function K(_,d){for(;(_[d]&65535)!=_[d];)_[d+1]+=_[d]>>>16,_[d]&=65535,d++}function $(_,d){this.g=_,this.h=d}function B(_,d){if(D(d))throw Error("division by zero");if(D(_))return new $(b,b);if(U(_))return d=B(P(_),d),new $(P(d.g),P(d.h));if(U(d))return d=B(_,P(d)),new $(P(d.g),d.h);if(_.g.length>30){if(U(_)||U(d))throw Error("slowDivide_ only works with positive integers.");for(var g=v,y=d;y.l(_)<=0;)g=se(g),y=se(y);var m=G(g,1),w=G(y,1);for(y=G(y,2),g=G(g,2);!D(y);){var f=w.add(y);f.l(_)<=0&&(m=m.add(g),w=f),y=G(y,1),g=G(g,1)}return d=W(_,m.j(d)),new $(m,d)}for(m=b;_.l(d)>=0;){for(g=Math.max(1,Math.floor(_.m()/d.m())),y=Math.ceil(Math.log(g)/Math.LN2),y=y<=48?1:Math.pow(2,y-48),w=E(g),f=w.j(d);U(f)||f.l(_)>0;)g-=y,w=E(g),f=w.j(d);D(w)&&(w=v),m=m.add(w),_=W(_,f)}return new $(m,_)}n.B=function(_){return B(this,_).h},n.and=function(_){const d=Math.max(this.g.length,_.g.length),g=[];for(let y=0;y<d;y++)g[y]=this.i(y)&_.i(y);return new l(g,this.h&_.h)},n.or=function(_){const d=Math.max(this.g.length,_.g.length),g=[];for(let y=0;y<d;y++)g[y]=this.i(y)|_.i(y);return new l(g,this.h|_.h)},n.xor=function(_){const d=Math.max(this.g.length,_.g.length),g=[];for(let y=0;y<d;y++)g[y]=this.i(y)^_.i(y);return new l(g,this.h^_.h)};function se(_){const d=_.g.length+1,g=[];for(let y=0;y<d;y++)g[y]=_.i(y)<<1|_.i(y-1)>>>31;return new l(g,_.h)}function G(_,d){const g=d>>5;d%=32;const y=_.g.length-g,m=[];for(let w=0;w<y;w++)m[w]=d>0?_.i(w+g)>>>d|_.i(w+g+1)<<32-d:_.i(w+g);return new l(m,_.h)}s.prototype.digest=s.prototype.A,s.prototype.reset=s.prototype.u,s.prototype.update=s.prototype.v,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.B,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=E,l.fromString=S,ps=l}).apply(typeof so<"u"?so:typeof self<"u"?self:typeof window<"u"?window:{});var bn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof bn=="object"&&bn];for(var o=0;o<i.length;++o){var c=i[o];if(c&&c.Math==Math)return c}throw Error("Cannot find global object")}var s=t(this);function r(i,o){if(o)e:{var c=s;i=i.split(".");for(var h=0;h<i.length-1;h++){var I=i[h];if(!(I in c))break e;c=c[I]}i=i[i.length-1],h=c[i],o=o(h),o!=h&&o!=null&&e(c,i,{configurable:!0,writable:!0,value:o})}}r("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),r("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),r("Object.entries",function(i){return i||function(o){var c=[],h;for(h in o)Object.prototype.hasOwnProperty.call(o,h)&&c.push([h,o[h]]);return c}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function u(i){var o=typeof i;return o=="object"&&i!=null||o=="function"}function p(i,o,c){return i.call.apply(i.bind,arguments)}function E(i,o,c){return E=p,E.apply(null,arguments)}function S(i,o){var c=Array.prototype.slice.call(arguments,1);return function(){var h=c.slice();return h.push.apply(h,arguments),i.apply(this,h)}}function b(i,o){function c(){}c.prototype=o.prototype,i.Z=o.prototype,i.prototype=new c,i.prototype.constructor=i,i.Ob=function(h,I,T){for(var A=Array(arguments.length-2),C=2;C<arguments.length;C++)A[C-2]=arguments[C];return o.prototype[I].apply(h,A)}}var v=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function M(i){const o=i.length;if(o>0){const c=Array(o);for(let h=0;h<o;h++)c[h]=i[h];return c}return[]}function D(i,o){for(let h=1;h<arguments.length;h++){const I=arguments[h];var c=typeof I;if(c=c!="object"?c:I?Array.isArray(I)?"array":c:"null",c=="array"||c=="object"&&typeof I.length=="number"){c=i.length||0;const T=I.length||0;i.length=c+T;for(let A=0;A<T;A++)i[c+A]=I[A]}else i.push(I)}}class U{constructor(o,c){this.i=o,this.j=c,this.h=0,this.g=null}get(){let o;return this.h>0?(this.h--,o=this.g,this.g=o.next,o.next=null):o=this.i(),o}}function P(i){l.setTimeout(()=>{throw i},0)}function W(){var i=_;let o=null;return i.g&&(o=i.g,i.g=i.g.next,i.g||(i.h=null),o.next=null),o}class K{constructor(){this.h=this.g=null}add(o,c){const h=$.get();h.set(o,c),this.h?this.h.next=h:this.g=h,this.h=h}}var $=new U(()=>new B,i=>i.reset());class B{constructor(){this.next=this.g=this.h=null}set(o,c){this.h=o,this.g=c,this.next=null}reset(){this.next=this.g=this.h=null}}let se,G=!1,_=new K,d=()=>{const i=Promise.resolve(void 0);se=()=>{i.then(g)}};function g(){for(var i;i=W();){try{i.h.call(i.g)}catch(c){P(c)}var o=$;o.j(i),o.h<100&&(o.h++,i.next=o.g,o.g=i)}G=!1}function y(){this.u=this.u,this.C=this.C}y.prototype.u=!1,y.prototype.dispose=function(){this.u||(this.u=!0,this.N())},y.prototype[Symbol.dispose]=function(){this.dispose()},y.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function m(i,o){this.type=i,this.g=this.target=o,this.defaultPrevented=!1}m.prototype.h=function(){this.defaultPrevented=!0};var w=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var i=!1,o=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const c=()=>{};l.addEventListener("test",c,o),l.removeEventListener("test",c,o)}catch{}return i}();function f(i){return/^[\s\xa0]*$/.test(i)}function ee(i,o){m.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,o)}b(ee,m),ee.prototype.init=function(i,o){const c=this.type=i.type,h=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=o,o=i.relatedTarget,o||(c=="mouseover"?o=i.fromElement:c=="mouseout"&&(o=i.toElement)),this.relatedTarget=o,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&ee.Z.h.call(this)},ee.prototype.h=function(){ee.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var Xe="closure_listenable_"+(Math.random()*1e6|0),lc=0;function hc(i,o,c,h,I){this.listener=i,this.proxy=null,this.src=o,this.type=c,this.capture=!!h,this.ha=I,this.key=++lc,this.da=this.fa=!1}function dn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function fn(i,o,c){for(const h in i)o.call(c,i[h],h,i)}function uc(i,o){for(const c in i)o.call(void 0,i[c],c,i)}function Is(i){const o={};for(const c in i)o[c]=i[c];return o}const ws="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Es(i,o){let c,h;for(let I=1;I<arguments.length;I++){h=arguments[I];for(c in h)i[c]=h[c];for(let T=0;T<ws.length;T++)c=ws[T],Object.prototype.hasOwnProperty.call(h,c)&&(i[c]=h[c])}}function pn(i){this.src=i,this.g={},this.h=0}pn.prototype.add=function(i,o,c,h,I){const T=i.toString();i=this.g[T],i||(i=this.g[T]=[],this.h++);const A=ei(i,o,h,I);return A>-1?(o=i[A],c||(o.fa=!1)):(o=new hc(o,this.src,T,!!h,I),o.fa=c,i.push(o)),o};function Qn(i,o){const c=o.type;if(c in i.g){var h=i.g[c],I=Array.prototype.indexOf.call(h,o,void 0),T;(T=I>=0)&&Array.prototype.splice.call(h,I,1),T&&(dn(o),i.g[c].length==0&&(delete i.g[c],i.h--))}}function ei(i,o,c,h){for(let I=0;I<i.length;++I){const T=i[I];if(!T.da&&T.listener==o&&T.capture==!!c&&T.ha==h)return I}return-1}var ti="closure_lm_"+(Math.random()*1e6|0),ni={};function Ts(i,o,c,h,I){if(Array.isArray(o)){for(let T=0;T<o.length;T++)Ts(i,o[T],c,h,I);return null}return c=Ss(c),i&&i[Xe]?i.J(o,c,u(h)?!!h.capture:!1,I):dc(i,o,c,!1,h,I)}function dc(i,o,c,h,I,T){if(!o)throw Error("Invalid event type");const A=u(I)?!!I.capture:!!I;let C=si(i);if(C||(i[ti]=C=new pn(i)),c=C.add(o,c,h,A,T),c.proxy)return c;if(h=fc(),c.proxy=h,h.src=i,h.listener=c,i.addEventListener)w||(I=A),I===void 0&&(I=!1),i.addEventListener(o.toString(),h,I);else if(i.attachEvent)i.attachEvent(As(o.toString()),h);else if(i.addListener&&i.removeListener)i.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return c}function fc(){function i(c){return o.call(i.src,i.listener,c)}const o=pc;return i}function vs(i,o,c,h,I){if(Array.isArray(o))for(var T=0;T<o.length;T++)vs(i,o[T],c,h,I);else h=u(h)?!!h.capture:!!h,c=Ss(c),i&&i[Xe]?(i=i.i,T=String(o).toString(),T in i.g&&(o=i.g[T],c=ei(o,c,h,I),c>-1&&(dn(o[c]),Array.prototype.splice.call(o,c,1),o.length==0&&(delete i.g[T],i.h--)))):i&&(i=si(i))&&(o=i.g[o.toString()],i=-1,o&&(i=ei(o,c,h,I)),(c=i>-1?o[i]:null)&&ii(c))}function ii(i){if(typeof i!="number"&&i&&!i.da){var o=i.src;if(o&&o[Xe])Qn(o.i,i);else{var c=i.type,h=i.proxy;o.removeEventListener?o.removeEventListener(c,h,i.capture):o.detachEvent?o.detachEvent(As(c),h):o.addListener&&o.removeListener&&o.removeListener(h),(c=si(o))?(Qn(c,i),c.h==0&&(c.src=null,o[ti]=null)):dn(i)}}}function As(i){return i in ni?ni[i]:ni[i]="on"+i}function pc(i,o){if(i.da)i=!0;else{o=new ee(o,this);const c=i.listener,h=i.ha||i.src;i.fa&&ii(i),i=c.call(h,o)}return i}function si(i){return i=i[ti],i instanceof pn?i:null}var ri="__closure_events_fn_"+(Math.random()*1e9>>>0);function Ss(i){return typeof i=="function"?i:(i[ri]||(i[ri]=function(o){return i.handleEvent(o)}),i[ri])}function z(){y.call(this),this.i=new pn(this),this.M=this,this.G=null}b(z,y),z.prototype[Xe]=!0,z.prototype.removeEventListener=function(i,o,c,h){vs(this,i,o,c,h)};function J(i,o){var c,h=i.G;if(h)for(c=[];h;h=h.G)c.push(h);if(i=i.M,h=o.type||o,typeof o=="string")o=new m(o,i);else if(o instanceof m)o.target=o.target||i;else{var I=o;o=new m(h,i),Es(o,I)}I=!0;let T,A;if(c)for(A=c.length-1;A>=0;A--)T=o.g=c[A],I=gn(T,h,!0,o)&&I;if(T=o.g=i,I=gn(T,h,!0,o)&&I,I=gn(T,h,!1,o)&&I,c)for(A=0;A<c.length;A++)T=o.g=c[A],I=gn(T,h,!1,o)&&I}z.prototype.N=function(){if(z.Z.N.call(this),this.i){var i=this.i;for(const o in i.g){const c=i.g[o];for(let h=0;h<c.length;h++)dn(c[h]);delete i.g[o],i.h--}}this.G=null},z.prototype.J=function(i,o,c,h){return this.i.add(String(i),o,!1,c,h)},z.prototype.K=function(i,o,c,h){return this.i.add(String(i),o,!0,c,h)};function gn(i,o,c,h){if(o=i.i.g[String(o)],!o)return!0;o=o.concat();let I=!0;for(let T=0;T<o.length;++T){const A=o[T];if(A&&!A.da&&A.capture==c){const C=A.listener,H=A.ha||A.src;A.fa&&Qn(i.i,A),I=C.call(H,h)!==!1&&I}}return I&&!h.defaultPrevented}function gc(i,o){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=E(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(o)>2147483647?-1:l.setTimeout(i,o||0)}function bs(i){i.g=gc(()=>{i.g=null,i.i&&(i.i=!1,bs(i))},i.l);const o=i.h;i.h=null,i.m.apply(null,o)}class mc extends y{constructor(o,c){super(),this.m=o,this.l=c,this.h=null,this.i=!1,this.g=null}j(o){this.h=arguments,this.g?this.i=!0:bs(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function kt(i){y.call(this),this.h=i,this.g={}}b(kt,y);var Rs=[];function Cs(i){fn(i.g,function(o,c){this.g.hasOwnProperty(c)&&ii(o)},i),i.g={}}kt.prototype.N=function(){kt.Z.N.call(this),Cs(this)},kt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var oi=l.JSON.stringify,_c=l.JSON.parse,yc=class{stringify(i){return l.JSON.stringify(i,void 0)}parse(i){return l.JSON.parse(i,void 0)}};function Ps(){}function Ic(){}var Ot={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ai(){m.call(this,"d")}b(ai,m);function ci(){m.call(this,"c")}b(ci,m);var gt={},ks=null;function li(){return ks=ks||new z}gt.Ia="serverreachability";function Os(i){m.call(this,gt.Ia,i)}b(Os,m);function Nt(i){const o=li();J(o,new Os(o))}gt.STAT_EVENT="statevent";function Ns(i,o){m.call(this,gt.STAT_EVENT,i),this.stat=o}b(Ns,m);function X(i){const o=li();J(o,new Ns(o,i))}gt.Ja="timingevent";function Ds(i,o){m.call(this,gt.Ja,i),this.size=o}b(Ds,m);function Dt(i,o){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){i()},o)}function Lt(){this.g=!0}Lt.prototype.ua=function(){this.g=!1};function wc(i,o,c,h,I,T){i.info(function(){if(i.g)if(T){var A="",C=T.split("&");for(let x=0;x<C.length;x++){var H=C[x].split("=");if(H.length>1){const q=H[0];H=H[1];const _e=q.split("_");A=_e.length>=2&&_e[1]=="type"?A+(q+"="+H+"&"):A+(q+"=redacted&")}}}else A=null;else A=T;return"XMLHTTP REQ ("+h+") [attempt "+I+"]: "+o+`
`+c+`
`+A})}function Ec(i,o,c,h,I,T,A){i.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+I+"]: "+o+`
`+c+`
`+T+" "+A})}function mt(i,o,c,h){i.info(function(){return"XMLHTTP TEXT ("+o+"): "+vc(i,c)+(h?" "+h:"")})}function Tc(i,o){i.info(function(){return"TIMEOUT: "+o})}Lt.prototype.info=function(){};function vc(i,o){if(!i.g)return o;if(!o)return null;try{const T=JSON.parse(o);if(T){for(i=0;i<T.length;i++)if(Array.isArray(T[i])){var c=T[i];if(!(c.length<2)){var h=c[1];if(Array.isArray(h)&&!(h.length<1)){var I=h[0];if(I!="noop"&&I!="stop"&&I!="close")for(let A=1;A<h.length;A++)h[A]=""}}}}return oi(T)}catch{return o}}var hi={NO_ERROR:0,TIMEOUT:8},Ac={},Ls;function ui(){}b(ui,Ps),ui.prototype.g=function(){return new XMLHttpRequest},Ls=new ui;function Mt(i){return encodeURIComponent(String(i))}function Sc(i){var o=1;i=i.split(":");const c=[];for(;o>0&&i.length;)c.push(i.shift()),o--;return i.length&&c.push(i.join(":")),c}function Me(i,o,c,h){this.j=i,this.i=o,this.l=c,this.S=h||1,this.V=new kt(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Ms}function Ms(){this.i=null,this.g="",this.h=!1}var Us={},di={};function fi(i,o,c){i.M=1,i.A=_n(me(o)),i.u=c,i.R=!0,xs(i,null)}function xs(i,o){i.F=Date.now(),mn(i),i.B=me(i.A);var c=i.B,h=i.S;Array.isArray(h)||(h=[String(h)]),Xs(c.i,"t",h),i.C=0,c=i.j.L,i.h=new Ms,i.g=pr(i.j,c?o:null,!i.u),i.P>0&&(i.O=new mc(E(i.Y,i,i.g),i.P)),o=i.V,c=i.g,h=i.ba;var I="readystatechange";Array.isArray(I)||(I&&(Rs[0]=I.toString()),I=Rs);for(let T=0;T<I.length;T++){const A=Ts(c,I[T],h||o.handleEvent,!1,o.h||o);if(!A)break;o.g[A.key]=A}o=i.J?Is(i.J):{},i.u?(i.v||(i.v="POST"),o["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,o)):(i.v="GET",i.g.ea(i.B,i.v,null,o)),Nt(),wc(i.i,i.v,i.B,i.l,i.S,i.u)}Me.prototype.ba=function(i){i=i.target;const o=this.O;o&&Fe(i)==3?o.j():this.Y(i)},Me.prototype.Y=function(i){try{if(i==this.g)e:{const C=Fe(this.g),H=this.g.ya(),x=this.g.ca();if(!(C<3)&&(C!=3||this.g&&(this.h.h||this.g.la()||ir(this.g)))){this.K||C!=4||H==7||(H==8||x<=0?Nt(3):Nt(2)),pi(this);var o=this.g.ca();this.X=o;var c=bc(this);if(this.o=o==200,Ec(this.i,this.v,this.B,this.l,this.S,C,o),this.o){if(this.U&&!this.L){t:{if(this.g){var h,I=this.g;if((h=I.g?I.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!f(h)){var T=h;break t}}T=null}if(i=T)mt(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,gi(this,i);else{this.o=!1,this.m=3,X(12),Ye(this),Ut(this);break e}}if(this.R){i=!0;let q;for(;!this.K&&this.C<c.length;)if(q=Rc(this,c),q==di){C==4&&(this.m=4,X(14),i=!1),mt(this.i,this.l,null,"[Incomplete Response]");break}else if(q==Us){this.m=4,X(15),mt(this.i,this.l,c,"[Invalid Chunk]"),i=!1;break}else mt(this.i,this.l,q,null),gi(this,q);if(Fs(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),C!=4||c.length!=0||this.h.h||(this.m=1,X(16),i=!1),this.o=this.o&&i,!i)mt(this.i,this.l,c,"[Invalid Chunked Response]"),Ye(this),Ut(this);else if(c.length>0&&!this.W){this.W=!0;var A=this.j;A.g==this&&A.aa&&!A.P&&(A.j.info("Great, no buffering proxy detected. Bytes received: "+c.length),vi(A),A.P=!0,X(11))}}else mt(this.i,this.l,c,null),gi(this,c);C==4&&Ye(this),this.o&&!this.K&&(C==4?hr(this.j,this):(this.o=!1,mn(this)))}else jc(this.g),o==400&&c.indexOf("Unknown SID")>0?(this.m=3,X(12)):(this.m=0,X(13)),Ye(this),Ut(this)}}}catch{}finally{}};function bc(i){if(!Fs(i))return i.g.la();const o=ir(i.g);if(o==="")return"";let c="";const h=o.length,I=Fe(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return Ye(i),Ut(i),"";i.h.i=new l.TextDecoder}for(let T=0;T<h;T++)i.h.h=!0,c+=i.h.i.decode(o[T],{stream:!(I&&T==h-1)});return o.length=0,i.h.g+=c,i.C=0,i.h.g}function Fs(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function Rc(i,o){var c=i.C,h=o.indexOf(`
`,c);return h==-1?di:(c=Number(o.substring(c,h)),isNaN(c)?Us:(h+=1,h+c>o.length?di:(o=o.slice(h,h+c),i.C=h+c,o)))}Me.prototype.cancel=function(){this.K=!0,Ye(this)};function mn(i){i.T=Date.now()+i.H,Vs(i,i.H)}function Vs(i,o){if(i.D!=null)throw Error("WatchDog timer not null");i.D=Dt(E(i.aa,i),o)}function pi(i){i.D&&(l.clearTimeout(i.D),i.D=null)}Me.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Tc(this.i,this.B),this.M!=2&&(Nt(),X(17)),Ye(this),this.m=2,Ut(this)):Vs(this,this.T-i)};function Ut(i){i.j.I==0||i.K||hr(i.j,i)}function Ye(i){pi(i);var o=i.O;o&&typeof o.dispose=="function"&&o.dispose(),i.O=null,Cs(i.V),i.g&&(o=i.g,i.g=null,o.abort(),o.dispose())}function gi(i,o){try{var c=i.j;if(c.I!=0&&(c.g==i||mi(c.h,i))){if(!i.L&&mi(c.h,i)&&c.I==3){try{var h=c.Ba.g.parse(o)}catch{h=null}if(Array.isArray(h)&&h.length==3){var I=h;if(I[0]==0){e:if(!c.v){if(c.g)if(c.g.F+3e3<i.F)Tn(c),wn(c);else break e;Ti(c),X(18)}}else c.xa=I[1],0<c.xa-c.K&&I[2]<37500&&c.F&&c.A==0&&!c.C&&(c.C=Dt(E(c.Va,c),6e3));$s(c.h)<=1&&c.ta&&(c.ta=void 0)}else Qe(c,11)}else if((i.L||c.g==i)&&Tn(c),!f(o))for(I=c.Ba.g.parse(o),o=0;o<I.length;o++){let x=I[o];const q=x[0];if(!(q<=c.K))if(c.K=q,x=x[1],c.I==2)if(x[0]=="c"){c.M=x[1],c.ba=x[2];const _e=x[3];_e!=null&&(c.ka=_e,c.j.info("VER="+c.ka));const et=x[4];et!=null&&(c.za=et,c.j.info("SVER="+c.za));const Ve=x[5];Ve!=null&&typeof Ve=="number"&&Ve>0&&(h=1.5*Ve,c.O=h,c.j.info("backChannelRequestTimeoutMs_="+h)),h=c;const Be=i.g;if(Be){const vn=Be.g?Be.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(vn){var T=h.h;T.g||vn.indexOf("spdy")==-1&&vn.indexOf("quic")==-1&&vn.indexOf("h2")==-1||(T.j=T.l,T.g=new Set,T.h&&(_i(T,T.h),T.h=null))}if(h.G){const Ai=Be.g?Be.g.getResponseHeader("X-HTTP-Session-Id"):null;Ai&&(h.wa=Ai,F(h.J,h.G,Ai))}}c.I=3,c.l&&c.l.ra(),c.aa&&(c.T=Date.now()-i.F,c.j.info("Handshake RTT: "+c.T+"ms")),h=c;var A=i;if(h.na=fr(h,h.L?h.ba:null,h.W),A.L){Hs(h.h,A);var C=A,H=h.O;H&&(C.H=H),C.D&&(pi(C),mn(C)),h.g=A}else cr(h);c.i.length>0&&En(c)}else x[0]!="stop"&&x[0]!="close"||Qe(c,7);else c.I==3&&(x[0]=="stop"||x[0]=="close"?x[0]=="stop"?Qe(c,7):Ei(c):x[0]!="noop"&&c.l&&c.l.qa(x),c.A=0)}}Nt(4)}catch{}}var Cc=class{constructor(i,o){this.g=i,this.map=o}};function Bs(i){this.l=i||10,l.PerformanceNavigationTiming?(i=l.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function js(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function $s(i){return i.h?1:i.g?i.g.size:0}function mi(i,o){return i.h?i.h==o:i.g?i.g.has(o):!1}function _i(i,o){i.g?i.g.add(o):i.h=o}function Hs(i,o){i.h&&i.h==o?i.h=null:i.g&&i.g.has(o)&&i.g.delete(o)}Bs.prototype.cancel=function(){if(this.i=Ws(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Ws(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let o=i.i;for(const c of i.g.values())o=o.concat(c.G);return o}return M(i.i)}var qs=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Pc(i,o){if(i){i=i.split("&");for(let c=0;c<i.length;c++){const h=i[c].indexOf("=");let I,T=null;h>=0?(I=i[c].substring(0,h),T=i[c].substring(h+1)):I=i[c],o(I,T?decodeURIComponent(T.replace(/\+/g," ")):"")}}}function Ue(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let o;i instanceof Ue?(this.l=i.l,xt(this,i.j),this.o=i.o,this.g=i.g,Ft(this,i.u),this.h=i.h,yi(this,Ys(i.i)),this.m=i.m):i&&(o=String(i).match(qs))?(this.l=!1,xt(this,o[1]||"",!0),this.o=Vt(o[2]||""),this.g=Vt(o[3]||"",!0),Ft(this,o[4]),this.h=Vt(o[5]||"",!0),yi(this,o[6]||"",!0),this.m=Vt(o[7]||"")):(this.l=!1,this.i=new jt(null,this.l))}Ue.prototype.toString=function(){const i=[];var o=this.j;o&&i.push(Bt(o,Gs,!0),":");var c=this.g;return(c||o=="file")&&(i.push("//"),(o=this.o)&&i.push(Bt(o,Gs,!0),"@"),i.push(Mt(c).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.u,c!=null&&i.push(":",String(c))),(c=this.h)&&(this.g&&c.charAt(0)!="/"&&i.push("/"),i.push(Bt(c,c.charAt(0)=="/"?Nc:Oc,!0))),(c=this.i.toString())&&i.push("?",c),(c=this.m)&&i.push("#",Bt(c,Lc)),i.join("")},Ue.prototype.resolve=function(i){const o=me(this);let c=!!i.j;c?xt(o,i.j):c=!!i.o,c?o.o=i.o:c=!!i.g,c?o.g=i.g:c=i.u!=null;var h=i.h;if(c)Ft(o,i.u);else if(c=!!i.h){if(h.charAt(0)!="/")if(this.g&&!this.h)h="/"+h;else{var I=o.h.lastIndexOf("/");I!=-1&&(h=o.h.slice(0,I+1)+h)}if(I=h,I==".."||I==".")h="";else if(I.indexOf("./")!=-1||I.indexOf("/.")!=-1){h=I.lastIndexOf("/",0)==0,I=I.split("/");const T=[];for(let A=0;A<I.length;){const C=I[A++];C=="."?h&&A==I.length&&T.push(""):C==".."?((T.length>1||T.length==1&&T[0]!="")&&T.pop(),h&&A==I.length&&T.push("")):(T.push(C),h=!0)}h=T.join("/")}else h=I}return c?o.h=h:c=i.i.toString()!=="",c?yi(o,Ys(i.i)):c=!!i.m,c&&(o.m=i.m),o};function me(i){return new Ue(i)}function xt(i,o,c){i.j=c?Vt(o,!0):o,i.j&&(i.j=i.j.replace(/:$/,""))}function Ft(i,o){if(o){if(o=Number(o),isNaN(o)||o<0)throw Error("Bad port number "+o);i.u=o}else i.u=null}function yi(i,o,c){o instanceof jt?(i.i=o,Mc(i.i,i.l)):(c||(o=Bt(o,Dc)),i.i=new jt(o,i.l))}function F(i,o,c){i.i.set(o,c)}function _n(i){return F(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function Vt(i,o){return i?o?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function Bt(i,o,c){return typeof i=="string"?(i=encodeURI(i).replace(o,kc),c&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function kc(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Gs=/[#\/\?@]/g,Oc=/[#\?:]/g,Nc=/[#\?]/g,Dc=/[#\?@]/g,Lc=/#/g;function jt(i,o){this.h=this.g=null,this.i=i||null,this.j=!!o}function Ze(i){i.g||(i.g=new Map,i.h=0,i.i&&Pc(i.i,function(o,c){i.add(decodeURIComponent(o.replace(/\+/g," ")),c)}))}n=jt.prototype,n.add=function(i,o){Ze(this),this.i=null,i=_t(this,i);let c=this.g.get(i);return c||this.g.set(i,c=[]),c.push(o),this.h+=1,this};function zs(i,o){Ze(i),o=_t(i,o),i.g.has(o)&&(i.i=null,i.h-=i.g.get(o).length,i.g.delete(o))}function Ks(i,o){return Ze(i),o=_t(i,o),i.g.has(o)}n.forEach=function(i,o){Ze(this),this.g.forEach(function(c,h){c.forEach(function(I){i.call(o,I,h,this)},this)},this)};function Js(i,o){Ze(i);let c=[];if(typeof o=="string")Ks(i,o)&&(c=c.concat(i.g.get(_t(i,o))));else for(i=Array.from(i.g.values()),o=0;o<i.length;o++)c=c.concat(i[o]);return c}n.set=function(i,o){return Ze(this),this.i=null,i=_t(this,i),Ks(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[o]),this.h+=1,this},n.get=function(i,o){return i?(i=Js(this,i),i.length>0?String(i[0]):o):o};function Xs(i,o,c){zs(i,o),c.length>0&&(i.i=null,i.g.set(_t(i,o),M(c)),i.h+=c.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],o=Array.from(this.g.keys());for(let h=0;h<o.length;h++){var c=o[h];const I=Mt(c);c=Js(this,c);for(let T=0;T<c.length;T++){let A=I;c[T]!==""&&(A+="="+Mt(c[T])),i.push(A)}}return this.i=i.join("&")};function Ys(i){const o=new jt;return o.i=i.i,i.g&&(o.g=new Map(i.g),o.h=i.h),o}function _t(i,o){return o=String(o),i.j&&(o=o.toLowerCase()),o}function Mc(i,o){o&&!i.j&&(Ze(i),i.i=null,i.g.forEach(function(c,h){const I=h.toLowerCase();h!=I&&(zs(this,h),Xs(this,I,c))},i)),i.j=o}function Uc(i,o){const c=new Lt;if(l.Image){const h=new Image;h.onload=S(xe,c,"TestLoadImage: loaded",!0,o,h),h.onerror=S(xe,c,"TestLoadImage: error",!1,o,h),h.onabort=S(xe,c,"TestLoadImage: abort",!1,o,h),h.ontimeout=S(xe,c,"TestLoadImage: timeout",!1,o,h),l.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=i}else o(!1)}function xc(i,o){const c=new Lt,h=new AbortController,I=setTimeout(()=>{h.abort(),xe(c,"TestPingServer: timeout",!1,o)},1e4);fetch(i,{signal:h.signal}).then(T=>{clearTimeout(I),T.ok?xe(c,"TestPingServer: ok",!0,o):xe(c,"TestPingServer: server error",!1,o)}).catch(()=>{clearTimeout(I),xe(c,"TestPingServer: error",!1,o)})}function xe(i,o,c,h,I){try{I&&(I.onload=null,I.onerror=null,I.onabort=null,I.ontimeout=null),h(c)}catch{}}function Fc(){this.g=new yc}function Ii(i){this.i=i.Sb||null,this.h=i.ab||!1}b(Ii,Ps),Ii.prototype.g=function(){return new yn(this.i,this.h)};function yn(i,o){z.call(this),this.H=i,this.o=o,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}b(yn,z),n=yn.prototype,n.open=function(i,o){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=o,this.readyState=1,Ht(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const o={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(o.body=i),(this.H||l).fetch(new Request(this.D,o)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,$t(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Ht(this)),this.g&&(this.readyState=3,Ht(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Zs(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Zs(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var o=i.value?i.value:new Uint8Array(0);(o=this.B.decode(o,{stream:!i.done}))&&(this.response=this.responseText+=o)}i.done?$t(this):Ht(this),this.readyState==3&&Zs(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,$t(this))},n.Na=function(i){this.g&&(this.response=i,$t(this))},n.ga=function(){this.g&&$t(this)};function $t(i){i.readyState=4,i.l=null,i.j=null,i.B=null,Ht(i)}n.setRequestHeader=function(i,o){this.A.append(i,o)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],o=this.h.entries();for(var c=o.next();!c.done;)c=c.value,i.push(c[0]+": "+c[1]),c=o.next();return i.join(`\r
`)};function Ht(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(yn.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Qs(i){let o="";return fn(i,function(c,h){o+=h,o+=":",o+=c,o+=`\r
`}),o}function wi(i,o,c){e:{for(h in c){var h=!1;break e}h=!0}h||(c=Qs(c),typeof i=="string"?c!=null&&Mt(c):F(i,o,c))}function V(i){z.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}b(V,z);var Vc=/^https?$/i,Bc=["POST","PUT"];n=V.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,o,c,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);o=o?o.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ls.g(),this.g.onreadystatechange=v(E(this.Ca,this));try{this.B=!0,this.g.open(o,String(i),!0),this.B=!1}catch(T){er(this,T);return}if(i=c||"",c=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var I in h)c.set(I,h[I]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const T of h.keys())c.set(T,h.get(T));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(c.keys()).find(T=>T.toLowerCase()=="content-type"),I=l.FormData&&i instanceof l.FormData,!(Array.prototype.indexOf.call(Bc,o,void 0)>=0)||h||I||c.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[T,A]of c)this.g.setRequestHeader(T,A);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(T){er(this,T)}};function er(i,o){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=o,i.o=5,tr(i),In(i)}function tr(i){i.A||(i.A=!0,J(i,"complete"),J(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,J(this,"complete"),J(this,"abort"),In(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),In(this,!0)),V.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?nr(this):this.Xa())},n.Xa=function(){nr(this)};function nr(i){if(i.h&&typeof a<"u"){if(i.v&&Fe(i)==4)setTimeout(i.Ca.bind(i),0);else if(J(i,"readystatechange"),Fe(i)==4){i.h=!1;try{const T=i.ca();e:switch(T){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var o=!0;break e;default:o=!1}var c;if(!(c=o)){var h;if(h=T===0){let A=String(i.D).match(qs)[1]||null;!A&&l.self&&l.self.location&&(A=l.self.location.protocol.slice(0,-1)),h=!Vc.test(A?A.toLowerCase():"")}c=h}if(c)J(i,"complete"),J(i,"success");else{i.o=6;try{var I=Fe(i)>2?i.g.statusText:""}catch{I=""}i.l=I+" ["+i.ca()+"]",tr(i)}}finally{In(i)}}}}function In(i,o){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const c=i.g;i.g=null,o||J(i,"ready");try{c.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Fe(i){return i.g?i.g.readyState:0}n.ca=function(){try{return Fe(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var o=this.g.responseText;return i&&o.indexOf(i)==0&&(o=o.substring(i.length)),_c(o)}};function ir(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function jc(i){const o={};i=(i.g&&Fe(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<i.length;h++){if(f(i[h]))continue;var c=Sc(i[h]);const I=c[0];if(c=c[1],typeof c!="string")continue;c=c.trim();const T=o[I]||[];o[I]=T,T.push(c)}uc(o,function(h){return h.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Wt(i,o,c){return c&&c.internalChannelParams&&c.internalChannelParams[i]||o}function sr(i){this.za=0,this.i=[],this.j=new Lt,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Wt("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Wt("baseRetryDelayMs",5e3,i),this.Za=Wt("retryDelaySeedMs",1e4,i),this.Ta=Wt("forwardChannelMaxRetries",2,i),this.va=Wt("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Bs(i&&i.concurrentRequestLimit),this.Ba=new Fc,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=sr.prototype,n.ka=8,n.I=1,n.connect=function(i,o,c,h){X(0),this.W=i,this.H=o||{},c&&h!==void 0&&(this.H.OSID=c,this.H.OAID=h),this.F=this.X,this.J=fr(this,null,this.W),En(this)};function Ei(i){if(rr(i),i.I==3){var o=i.V++,c=me(i.J);if(F(c,"SID",i.M),F(c,"RID",o),F(c,"TYPE","terminate"),qt(i,c),o=new Me(i,i.j,o),o.M=2,o.A=_n(me(c)),c=!1,l.navigator&&l.navigator.sendBeacon)try{c=l.navigator.sendBeacon(o.A.toString(),"")}catch{}!c&&l.Image&&(new Image().src=o.A,c=!0),c||(o.g=pr(o.j,null),o.g.ea(o.A)),o.F=Date.now(),mn(o)}dr(i)}function wn(i){i.g&&(vi(i),i.g.cancel(),i.g=null)}function rr(i){wn(i),i.v&&(l.clearTimeout(i.v),i.v=null),Tn(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&l.clearTimeout(i.m),i.m=null)}function En(i){if(!js(i.h)&&!i.m){i.m=!0;var o=i.Ea;se||d(),G||(se(),G=!0),_.add(o,i),i.D=0}}function $c(i,o){return $s(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=o.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=Dt(E(i.Ea,i,o),ur(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const I=new Me(this,this.j,i);let T=this.o;if(this.U&&(T?(T=Is(T),Es(T,this.U)):T=this.U),this.u!==null||this.R||(I.J=T,T=null),this.S)e:{for(var o=0,c=0;c<this.i.length;c++){t:{var h=this.i[c];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break t}h=void 0}if(h===void 0)break;if(o+=h,o>4096){o=c;break e}if(o===4096||c===this.i.length-1){o=c+1;break e}}o=1e3}else o=1e3;o=ar(this,I,o),c=me(this.J),F(c,"RID",i),F(c,"CVER",22),this.G&&F(c,"X-HTTP-Session-Id",this.G),qt(this,c),T&&(this.R?o="headers="+Mt(Qs(T))+"&"+o:this.u&&wi(c,this.u,T)),_i(this.h,I),this.Ra&&F(c,"TYPE","init"),this.S?(F(c,"$req",o),F(c,"SID","null"),I.U=!0,fi(I,c,null)):fi(I,c,o),this.I=2}}else this.I==3&&(i?or(this,i):this.i.length==0||js(this.h)||or(this))};function or(i,o){var c;o?c=o.l:c=i.V++;const h=me(i.J);F(h,"SID",i.M),F(h,"RID",c),F(h,"AID",i.K),qt(i,h),i.u&&i.o&&wi(h,i.u,i.o),c=new Me(i,i.j,c,i.D+1),i.u===null&&(c.J=i.o),o&&(i.i=o.G.concat(i.i)),o=ar(i,c,1e3),c.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),_i(i.h,c),fi(c,h,o)}function qt(i,o){i.H&&fn(i.H,function(c,h){F(o,h,c)}),i.l&&fn({},function(c,h){F(o,h,c)})}function ar(i,o,c){c=Math.min(i.i.length,c);const h=i.l?E(i.l.Ka,i.l,i):null;e:{var I=i.i;let C=-1;for(;;){const H=["count="+c];C==-1?c>0?(C=I[0].g,H.push("ofs="+C)):C=0:H.push("ofs="+C);let x=!0;for(let q=0;q<c;q++){var T=I[q].g;const _e=I[q].map;if(T-=C,T<0)C=Math.max(0,I[q].g-100),x=!1;else try{T="req"+T+"_"||"";try{var A=_e instanceof Map?_e:Object.entries(_e);for(const[et,Ve]of A){let Be=Ve;u(Ve)&&(Be=oi(Ve)),H.push(T+et+"="+encodeURIComponent(Be))}}catch(et){throw H.push(T+"type="+encodeURIComponent("_badmap")),et}}catch{h&&h(_e)}}if(x){A=H.join("&");break e}}A=void 0}return i=i.i.splice(0,c),o.G=i,A}function cr(i){if(!i.g&&!i.v){i.Y=1;var o=i.Da;se||d(),G||(se(),G=!0),_.add(o,i),i.A=0}}function Ti(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=Dt(E(i.Da,i),ur(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,lr(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=Dt(E(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,X(10),wn(this),lr(this))};function vi(i){i.B!=null&&(l.clearTimeout(i.B),i.B=null)}function lr(i){i.g=new Me(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var o=me(i.na);F(o,"RID","rpc"),F(o,"SID",i.M),F(o,"AID",i.K),F(o,"CI",i.F?"0":"1"),!i.F&&i.ia&&F(o,"TO",i.ia),F(o,"TYPE","xmlhttp"),qt(i,o),i.u&&i.o&&wi(o,i.u,i.o),i.O&&(i.g.H=i.O);var c=i.g;i=i.ba,c.M=1,c.A=_n(me(o)),c.u=null,c.R=!0,xs(c,i)}n.Va=function(){this.C!=null&&(this.C=null,wn(this),Ti(this),X(19))};function Tn(i){i.C!=null&&(l.clearTimeout(i.C),i.C=null)}function hr(i,o){var c=null;if(i.g==o){Tn(i),vi(i),i.g=null;var h=2}else if(mi(i.h,o))c=o.G,Hs(i.h,o),h=1;else return;if(i.I!=0){if(o.o)if(h==1){c=o.u?o.u.length:0,o=Date.now()-o.F;var I=i.D;h=li(),J(h,new Ds(h,c)),En(i)}else cr(i);else if(I=o.m,I==3||I==0&&o.X>0||!(h==1&&$c(i,o)||h==2&&Ti(i)))switch(c&&c.length>0&&(o=i.h,o.i=o.i.concat(c)),I){case 1:Qe(i,5);break;case 4:Qe(i,10);break;case 3:Qe(i,6);break;default:Qe(i,2)}}}function ur(i,o){let c=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(c*=2),c*o}function Qe(i,o){if(i.j.info("Error code "+o),o==2){var c=E(i.bb,i),h=i.Ua;const I=!h;h=new Ue(h||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||xt(h,"https"),_n(h),I?Uc(h.toString(),c):xc(h.toString(),c)}else X(2);i.I=0,i.l&&i.l.pa(o),dr(i),rr(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),X(2)):(this.j.info("Failed to ping google.com"),X(1))};function dr(i){if(i.I=0,i.ja=[],i.l){const o=Ws(i.h);(o.length!=0||i.i.length!=0)&&(D(i.ja,o),D(i.ja,i.i),i.h.i.length=0,M(i.i),i.i.length=0),i.l.oa()}}function fr(i,o,c){var h=c instanceof Ue?me(c):new Ue(c);if(h.g!="")o&&(h.g=o+"."+h.g),Ft(h,h.u);else{var I=l.location;h=I.protocol,o=o?o+"."+I.hostname:I.hostname,I=+I.port;const T=new Ue(null);h&&xt(T,h),o&&(T.g=o),I&&Ft(T,I),c&&(T.h=c),h=T}return c=i.G,o=i.wa,c&&o&&F(h,c,o),F(h,"VER",i.ka),qt(i,h),h}function pr(i,o,c){if(o&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return o=i.Aa&&!i.ma?new V(new Ii({ab:c})):new V(i.ma),o.Fa(i.L),o}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function gr(){}n=gr.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function oe(i,o){z.call(this),this.g=new sr(o),this.l=i,this.h=o&&o.messageUrlParams||null,i=o&&o.messageHeaders||null,o&&o.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=o&&o.initMessageHeaders||null,o&&o.messageContentType&&(i?i["X-WebChannel-Content-Type"]=o.messageContentType:i={"X-WebChannel-Content-Type":o.messageContentType}),o&&o.sa&&(i?i["X-WebChannel-Client-Profile"]=o.sa:i={"X-WebChannel-Client-Profile":o.sa}),this.g.U=i,(i=o&&o.Qb)&&!f(i)&&(this.g.u=i),this.A=o&&o.supportsCrossDomainXhr||!1,this.v=o&&o.sendRawJson||!1,(o=o&&o.httpSessionIdParam)&&!f(o)&&(this.g.G=o,i=this.h,i!==null&&o in i&&(i=this.h,o in i&&delete i[o])),this.j=new yt(this)}b(oe,z),oe.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},oe.prototype.close=function(){Ei(this.g)},oe.prototype.o=function(i){var o=this.g;if(typeof i=="string"){var c={};c.__data__=i,i=c}else this.v&&(c={},c.__data__=oi(i),i=c);o.i.push(new Cc(o.Ya++,i)),o.I==3&&En(o)},oe.prototype.N=function(){this.g.l=null,delete this.j,Ei(this.g),delete this.g,oe.Z.N.call(this)};function mr(i){ai.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var o=i.__sm__;if(o){e:{for(const c in o){i=c;break e}i=void 0}(this.i=i)&&(i=this.i,o=o!==null&&i in o?o[i]:void 0),this.data=o}else this.data=i}b(mr,ai);function _r(){ci.call(this),this.status=1}b(_r,ci);function yt(i){this.g=i}b(yt,gr),yt.prototype.ra=function(){J(this.g,"a")},yt.prototype.qa=function(i){J(this.g,new mr(i))},yt.prototype.pa=function(i){J(this.g,new _r)},yt.prototype.oa=function(){J(this.g,"b")},oe.prototype.send=oe.prototype.o,oe.prototype.open=oe.prototype.m,oe.prototype.close=oe.prototype.close,hi.NO_ERROR=0,hi.TIMEOUT=8,hi.HTTP_ERROR=6,Ac.COMPLETE="complete",Ic.EventType=Ot,Ot.OPEN="a",Ot.CLOSE="b",Ot.ERROR="c",Ot.MESSAGE="d",z.prototype.listen=z.prototype.J,V.prototype.listenOnce=V.prototype.K,V.prototype.getLastError=V.prototype.Ha,V.prototype.getLastErrorCode=V.prototype.ya,V.prototype.getStatus=V.prototype.ca,V.prototype.getResponseJson=V.prototype.La,V.prototype.getResponseText=V.prototype.la,V.prototype.send=V.prototype.ea,V.prototype.setWithCredentials=V.prototype.Fa}).apply(typeof bn<"u"?bn:typeof self<"u"?self:typeof window<"u"?window:{});const ro="@firebase/firestore",oo="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Y.UNAUTHENTICATED=new Y(null),Y.GOOGLE_CREDENTIALS=new Y("google-credentials-uid"),Y.FIRST_PARTY=new Y("first-party-uid"),Y.MOCK_USER=new Y("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hn="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St=new zn("@firebase/firestore");function de(n,...e){if(St.logLevel<=L.DEBUG){const t=e.map(gs);St.debug(`Firestore (${hn}): ${n}`,...t)}}function Za(n,...e){if(St.logLevel<=L.ERROR){const t=e.map(gs);St.error(`Firestore (${hn}): ${n}`,...t)}}function gp(n,...e){if(St.logLevel<=L.WARN){const t=e.map(gs);St.warn(`Firestore (${hn}): ${n}`,...t)}}function gs(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nn(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,Qa(n,s,t)}function Qa(n,e,t){let s=`FIRESTORE (${hn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw Za(s),new Error(s)}function Xt(n,e,t,s){let r="Unexpected state";typeof t=="string"?r=t:s=t,n||Qa(e,r,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class N extends le{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class mp{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Y.UNAUTHENTICATED))}shutdown(){}}class _p{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class yp{constructor(e){this.t=e,this.currentUser=Y.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Xt(this.o===void 0,42304);let s=this.i;const r=p=>this.i!==s?(s=this.i,t(p)):Promise.resolve();let a=new Yt;this.o=()=>{this.i++,this.currentUser=this.u(),a.resolve(),a=new Yt,e.enqueueRetryable(()=>r(this.currentUser))};const l=()=>{const p=a;e.enqueueRetryable(async()=>{await p.promise,await r(this.currentUser)})},u=p=>{de("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=p,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit(p=>u(p)),setTimeout(()=>{if(!this.auth){const p=this.t.getImmediate({optional:!0});p?u(p):(de("FirebaseAuthCredentialsProvider","Auth not yet detected"),a.resolve(),a=new Yt)}},0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(s=>this.i!==e?(de("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Xt(typeof s.accessToken=="string",31837,{l:s}),new ec(s.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Xt(e===null||typeof e=="string",2055,{h:e}),new Y(e)}}class Ip{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Y.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class wp{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new Ip(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(Y.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ao{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Ep{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,te(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Xt(this.o===void 0,3512);const s=a=>{a.error!=null&&de("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${a.error.message}`);const l=a.token!==this.m;return this.m=a.token,de("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(a.token):Promise.resolve()};this.o=a=>{e.enqueueRetryable(()=>s(a))};const r=a=>{de("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=a,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(a=>r(a)),setTimeout(()=>{if(!this.appCheck){const a=this.V.getImmediate({optional:!0});a?r(a):de("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new ao(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Xt(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ao(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tp(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vp{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const r=Tp(40);for(let a=0;a<r.length;++a)s.length<20&&r[a]<t&&(s+=e.charAt(r[a]%62))}return s}}function Ke(n,e){return n<e?-1:n>e?1:0}function Ap(n,e){const t=Math.min(n.length,e.length);for(let s=0;s<t;s++){const r=n.charAt(s),a=e.charAt(s);if(r!==a)return Mi(r)===Mi(a)?Ke(r,a):Mi(r)?1:-1}return Ke(n.length,e.length)}const Sp=55296,bp=57343;function Mi(n){const e=n.charCodeAt(0);return e>=Sp&&e<=bp}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const co="__name__";class ye{constructor(e,t,s){t===void 0?t=0:t>e.length&&nn(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&nn(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return ye.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ye?e.forEach(s=>{t.push(s)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let r=0;r<s;r++){const a=ye.compareSegments(e.get(r),t.get(r));if(a!==0)return a}return Ke(e.length,t.length)}static compareSegments(e,t){const s=ye.isNumericId(e),r=ye.isNumericId(t);return s&&!r?-1:!s&&r?1:s&&r?ye.extractNumericId(e).compare(ye.extractNumericId(t)):Ap(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return ps.fromString(e.substring(4,e.length-2))}}class he extends ye{construct(e,t,s){return new he(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new N(O.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter(r=>r.length>0))}return new he(t)}static emptyPath(){return new he([])}}const Rp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class nt extends ye{construct(e,t,s){return new nt(e,t,s)}static isValidIdentifier(e){return Rp.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),nt.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===co}static keyField(){return new nt([co])}static fromServerFormat(e){const t=[];let s="",r=0;const a=()=>{if(s.length===0)throw new N(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let l=!1;for(;r<e.length;){const u=e[r];if(u==="\\"){if(r+1===e.length)throw new N(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const p=e[r+1];if(p!=="\\"&&p!=="."&&p!=="`")throw new N(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=p,r+=2}else u==="`"?(l=!l,r++):u!=="."||l?(s+=u,r++):(a(),r++)}if(a(),l)throw new N(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new nt(t)}static emptyPath(){return new nt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.path=e}static fromPath(e){return new rt(he.fromString(e))}static fromName(e){return new rt(he.fromString(e).popFirst(5))}static empty(){return new rt(he.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&he.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return he.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new rt(new he(e.slice()))}}function Cp(n,e,t,s){if(e===!0&&s===!0)throw new N(O.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Pp(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function kp(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(s){return s.constructor?s.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":nn(12329,{type:typeof n})}function Op(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=kp(n);throw new N(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(n,e){const t={typeString:n};return e&&(t.value=e),t}function un(n,e){if(!Pp(n))throw new N(O.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const r=e[s].typeString,a="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const l=n[s];if(r&&typeof l!==r){t=`JSON field '${s}' must be a ${r}.`;break}if(a!==void 0&&l!==a.value){t=`Expected '${s}' field to equal '${a.value}'`;break}}if(t)throw new N(O.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lo=-62135596800,ho=1e6;class Ie{static now(){return Ie.fromMillis(Date.now())}static fromDate(e){return Ie.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*ho);return new Ie(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<lo)throw new N(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ho}_compareTo(e){return this.seconds===e.seconds?Ke(this.nanoseconds,e.nanoseconds):Ke(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ie._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(un(e,Ie._jsonSchema))return new Ie(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-lo;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ie._jsonSchemaVersion="firestore/timestamp/1.0",Ie._jsonSchema={type:j("string",Ie._jsonSchemaVersion),seconds:j("number"),nanoseconds:j("number")};function Np(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(r){try{return atob(r)}catch(a){throw typeof DOMException<"u"&&a instanceof DOMException?new Dp("Invalid base64 string: "+a):a}}(e);return new dt(t)}static fromUint8Array(e){const t=function(r){let a="";for(let l=0;l<r.length;++l)a+=String.fromCharCode(r[l]);return a}(e);return new dt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const s=new Uint8Array(t.length);for(let r=0;r<t.length;r++)s[r]=t.charCodeAt(r);return s}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Ke(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}dt.EMPTY_BYTE_STRING=new dt("");const zi="(default)";class Wn{constructor(e,t){this.projectId=e,this.database=t||zi}static empty(){return new Wn("","")}get isDefaultDatabase(){return this.database===zi}isEqual(e){return e instanceof Wn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lp{constructor(e,t=null,s=[],r=[],a=null,l="F",u=null,p=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=r,this.limit=a,this.limitType=l,this.startAt=u,this.endAt=p,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Mp(n){return new Lp(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var uo,k;(k=uo||(uo={}))[k.OK=0]="OK",k[k.CANCELLED=1]="CANCELLED",k[k.UNKNOWN=2]="UNKNOWN",k[k.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",k[k.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",k[k.NOT_FOUND=5]="NOT_FOUND",k[k.ALREADY_EXISTS=6]="ALREADY_EXISTS",k[k.PERMISSION_DENIED=7]="PERMISSION_DENIED",k[k.UNAUTHENTICATED=16]="UNAUTHENTICATED",k[k.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",k[k.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",k[k.ABORTED=10]="ABORTED",k[k.OUT_OF_RANGE=11]="OUT_OF_RANGE",k[k.UNIMPLEMENTED=12]="UNIMPLEMENTED",k[k.INTERNAL=13]="INTERNAL",k[k.UNAVAILABLE=14]="UNAVAILABLE",k[k.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new ps([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Up=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xp=1048576;function Ui(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fp{constructor(e,t,s=1e3,r=1.5,a=6e4){this.Mi=e,this.timerId=t,this.d_=s,this.A_=r,this.R_=a,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),s=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-s);r>0&&de("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(e,t,s,r,a){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=r,this.removalCallback=a,this.deferred=new Yt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(l=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,r,a){const l=Date.now()+s,u=new ms(e,t,l,r,a);return u.start(s),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var fo,po;(po=fo||(fo={})).Ma="default",po.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vp(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const go=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tc="firestore.googleapis.com",mo=!0;class _o{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new N(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=tc,this.ssl=mo}else this.host=e.host,this.ssl=e.ssl??mo;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Up;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<xp)throw new N(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Cp("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Vp(e.experimentalLongPollingOptions??{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(s,r){return s.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class nc{constructor(e,t,s,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _o({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _o(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(s){if(!s)return new mp;switch(s.type){case"firstParty":return new wp(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new N(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const s=go.get(t);s&&(de("ComponentProvider","Removing Datastore"),go.delete(t),s.terminate())}(this),Promise.resolve()}}function Bp(n,e,t,s={}){var E;n=Op(n,nc);const r=bt(e),a=n._getSettings(),l={...a,emulatorOptions:n._getEmulatorOptions()},u=`${e}:${t}`;r&&(Ji(`https://${u}`),Xi("Firestore",!0)),a.host!==tc&&a.host!==u&&gp("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const p={...a,host:u,ssl:r,emulatorOptions:s};if(!ze(p,l)&&(n._setSettings(p),s.mockUserToken)){let S,b;if(typeof s.mockUserToken=="string")S=s.mockUserToken,b=Y.MOCK_USER;else{S=jo(s.mockUserToken,(E=n._app)==null?void 0:E.options.projectId);const v=s.mockUserToken.sub||s.mockUserToken.user_id;if(!v)throw new N(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");b=new Y(v)}n._authCredentials=new _p(new ec(S,b))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new _s(this.firestore,e,this._query)}}class we{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ys(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new we(this.firestore,e,this._key)}toJSON(){return{type:we._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(un(t,we._jsonSchema))return new we(e,s||null,new rt(he.fromString(t.referencePath)))}}we._jsonSchemaVersion="firestore/documentReference/1.0",we._jsonSchema={type:j("string",we._jsonSchemaVersion),referencePath:j("string")};class ys extends _s{constructor(e,t,s){super(e,t,Mp(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new we(this.firestore,null,new rt(e))}withConverter(e){return new ys(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yo="AsyncQueue";class Io{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Fp(this,"async_queue_retry"),this._c=()=>{const s=Ui();s&&de(yo,"Visibility state changed to "+s.visibilityState),this.M_.w_()},this.ac=e;const t=Ui();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Ui();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Yt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!Np(e))throw e;de(yo,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(s=>{throw this.nc=s,this.rc=!1,Za("INTERNAL UNHANDLED ERROR: ",wo(s)),s}).then(s=>(this.rc=!1,s))));return this.ac=t,t}enqueueAfterDelay(e,t,s){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=ms.createAndSchedule(this,e,t,s,a=>this.hc(a));return this.tc.push(r),r}uc(){this.nc&&nn(47125,{Pc:wo(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((t,s)=>t.targetTimeMs-s.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function wo(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class jp extends nc{constructor(e,t,s,r){super(e,t,s,r),this.type="firestore",this._queue=new Io,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Io(e),this._firestoreClient=void 0,await e}}}function $p(n,e){const t=typeof n=="object"?n:rn(),s=typeof n=="string"?n:zi,r=Je(t,"firestore").getImmediate({identifier:s});if(!r._initialized){const a=Fo("firestore");a&&Bp(r,...a)}return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e){this._byteString=e}static fromBase64String(e){try{return new be(dt.fromBase64String(e))}catch(t){throw new N(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new be(dt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:be._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(un(e,be._jsonSchema))return be.fromBase64String(e.bytes)}}be._jsonSchemaVersion="firestore/bytes/1.0",be._jsonSchema={type:j("string",be._jsonSchemaVersion),bytes:j("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new nt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Ke(this._lat,e._lat)||Ke(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ot._jsonSchemaVersion}}static fromJSON(e){if(un(e,ot._jsonSchema))return new ot(e.latitude,e.longitude)}}ot._jsonSchemaVersion="firestore/geoPoint/1.0",ot._jsonSchema={type:j("string",ot._jsonSchemaVersion),latitude:j("number"),longitude:j("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(s,r){if(s.length!==r.length)return!1;for(let a=0;a<s.length;++a)if(s[a]!==r[a])return!1;return!0}(this._values,e._values)}toJSON(){return{type:at._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(un(e,at._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new at(e.vectorValues);throw new N(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}at._jsonSchemaVersion="firestore/vectorValue/1.0",at._jsonSchema={type:j("string",at._jsonSchemaVersion),vectorValues:j("object")};const Hp=new RegExp("[~\\*/\\[\\]]");function Wp(n,e,t){if(e.search(Hp)>=0)throw Eo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n);try{return new ic(...e.split("."))._internalPath}catch{throw Eo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n)}}function Eo(n,e,t,s,r){let a=`Function ${e}() called with invalid data`;a+=". ";let l="";return new N(O.INVALID_ARGUMENT,a+n+l)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sc{constructor(e,t,s,r,a){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=r,this._converter=a}get id(){return this._key.path.lastSegment()}get ref(){return new we(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new qp(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(rc("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class qp extends sc{data(){return super.data()}}function rc(n,e){return typeof e=="string"?Wp(n,e):e instanceof ic?e._internalPath:e._delegate._internalPath}class Rn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class vt extends sc{constructor(e,t,s,r,a,l){super(e,t,s,r,l),this._firestore=e,this._firestoreImpl=e,this.metadata=a}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Dn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(rc("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=vt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}vt._jsonSchemaVersion="firestore/documentSnapshot/1.0",vt._jsonSchema={type:j("string",vt._jsonSchemaVersion),bundleSource:j("string","DocumentSnapshot"),bundleName:j("string"),bundle:j("string")};class Dn extends vt{data(e={}){return super.data(e)}}class Zt{constructor(e,t,s,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Rn(r.hasPendingWrites,r.fromCache),this.query=s}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(s=>{e.call(t,new Dn(this._firestore,this._userDataWriter,s.key,s,new Rn(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(r,a){if(r._snapshot.oldDocs.isEmpty()){let l=0;return r._snapshot.docChanges.map(u=>{const p=new Dn(r._firestore,r._userDataWriter,u.doc.key,u.doc,new Rn(r._snapshot.mutatedKeys.has(u.doc.key),r._snapshot.fromCache),r.query.converter);return u.doc,{type:"added",doc:p,oldIndex:-1,newIndex:l++}})}{let l=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(u=>a||u.type!==3).map(u=>{const p=new Dn(r._firestore,r._userDataWriter,u.doc.key,u.doc,new Rn(r._snapshot.mutatedKeys.has(u.doc.key),r._snapshot.fromCache),r.query.converter);let E=-1,S=-1;return u.type!==0&&(E=l.indexOf(u.doc.key),l=l.delete(u.doc.key)),u.type!==1&&(l=l.add(u.doc),S=l.indexOf(u.doc.key)),{type:Gp(u.type),doc:p,oldIndex:E,newIndex:S}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Zt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=vp.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],r=[];return this.docs.forEach(a=>{a._document!==null&&(t.push(a._document),s.push(this._userDataWriter.convertObjectMap(a._document.data.value.mapValue.fields,"previous")),r.push(a.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Gp(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return nn(61501,{type:n})}}Zt._jsonSchemaVersion="firestore/querySnapshot/1.0",Zt._jsonSchema={type:j("string",Zt._jsonSchemaVersion),bundleSource:j("string","QuerySnapshot"),bundleName:j("string"),bundle:j("string")};(function(e,t=!0){(function(r){hn=r})(pt),ge(new ae("firestore",(s,{instanceIdentifier:r,options:a})=>{const l=s.getProvider("app").getImmediate(),u=new jp(new yp(s.getProvider("auth-internal")),new Ep(l,s.getProvider("app-check-internal")),function(E,S){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new N(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Wn(E.options.projectId,S)}(l,r),l);return a={useFetchStreams:t,...a},u._setSettings(a),u},"PUBLIC").setMultipleInstances(!0)),ne(ro,oo,e),ne(ro,oo,"esm2020")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oc="firebasestorage.googleapis.com",zp="storageBucket",Kp=2*60*1e3,Jp=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae extends le{constructor(e,t,s=0){super(xi(e),`Firebase Storage: ${t} (${xi(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Ae.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return xi(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Te;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Te||(Te={}));function xi(n){return"storage/"+n}function Xp(){const n="An unknown error occurred, please check the error payload for server response.";return new Ae(Te.UNKNOWN,n)}function Yp(){return new Ae(Te.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Zp(){return new Ae(Te.CANCELED,"User canceled the upload/download.")}function Qp(n){return new Ae(Te.INVALID_URL,"Invalid URL '"+n+"'.")}function eg(n){return new Ae(Te.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function To(n){return new Ae(Te.INVALID_ARGUMENT,n)}function ac(){return new Ae(Te.APP_DELETED,"The Firebase app was deleted.")}function tg(n){return new Ae(Te.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let s;try{s=fe.makeFromUrl(e,t)}catch{return new fe(e,"")}if(s.path==="")return s;throw eg(e)}static makeFromUrl(e,t){let s=null;const r="([A-Za-z0-9.\\-_]+)";function a(B){B.path.charAt(B.path.length-1)==="/"&&(B.path_=B.path_.slice(0,-1))}const l="(/(.*))?$",u=new RegExp("^gs://"+r+l,"i"),p={bucket:1,path:3};function E(B){B.path_=decodeURIComponent(B.path)}const S="v[A-Za-z0-9_]+",b=t.replace(/[.]/g,"\\."),v="(/([^?#]*).*)?$",M=new RegExp(`^https?://${b}/${S}/b/${r}/o${v}`,"i"),D={bucket:1,path:3},U=t===oc?"(?:storage.googleapis.com|storage.cloud.google.com)":t,P="([^?#]*)",W=new RegExp(`^https?://${U}/${r}/${P}`,"i"),$=[{regex:u,indices:p,postModify:a},{regex:M,indices:D,postModify:E},{regex:W,indices:{bucket:1,path:2},postModify:E}];for(let B=0;B<$.length;B++){const se=$[B],G=se.regex.exec(e);if(G){const _=G[se.indices.bucket];let d=G[se.indices.path];d||(d=""),s=new fe(_,d),se.postModify(s);break}}if(s==null)throw Qp(e);return s}}class ng{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ig(n,e,t){let s=1,r=null,a=null,l=!1,u=0;function p(){return u===2}let E=!1;function S(...P){E||(E=!0,e.apply(null,P))}function b(P){r=setTimeout(()=>{r=null,n(M,p())},P)}function v(){a&&clearTimeout(a)}function M(P,...W){if(E){v();return}if(P){v(),S.call(null,P,...W);return}if(p()||l){v(),S.call(null,P,...W);return}s<64&&(s*=2);let $;u===1?(u=2,$=0):$=(s+Math.random())*1e3,b($)}let D=!1;function U(P){D||(D=!0,v(),!E&&(r!==null?(P||(u=2),clearTimeout(r),b(0)):P||(u=1)))}return b(0),a=setTimeout(()=>{l=!0,U(!0)},t),U}function sg(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rg(n){return n!==void 0}function vo(n,e,t,s){if(s<e)throw To(`Invalid value for '${n}'. Expected ${e} or greater.`);if(s>t)throw To(`Invalid value for '${n}'. Expected ${t} or less.`)}function og(n){const e=encodeURIComponent;let t="?";for(const s in n)if(n.hasOwnProperty(s)){const r=e(s)+"="+e(n[s]);t=t+r+"&"}return t=t.slice(0,-1),t}var qn;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(qn||(qn={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ag(n,e){const t=n>=500&&n<600,r=[408,429].indexOf(n)!==-1,a=e.indexOf(n)!==-1;return t||r||a}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cg{constructor(e,t,s,r,a,l,u,p,E,S,b,v=!0,M=!1){this.url_=e,this.method_=t,this.headers_=s,this.body_=r,this.successCodes_=a,this.additionalRetryCodes_=l,this.callback_=u,this.errorCallback_=p,this.timeout_=E,this.progressCallback_=S,this.connectionFactory_=b,this.retry=v,this.isUsingEmulator=M,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((D,U)=>{this.resolve_=D,this.reject_=U,this.start_()})}start_(){const e=(s,r)=>{if(r){s(!1,new Cn(!1,null,!0));return}const a=this.connectionFactory_();this.pendingConnection_=a;const l=u=>{const p=u.loaded,E=u.lengthComputable?u.total:-1;this.progressCallback_!==null&&this.progressCallback_(p,E)};this.progressCallback_!==null&&a.addUploadProgressListener(l),a.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&a.removeUploadProgressListener(l),this.pendingConnection_=null;const u=a.getErrorCode()===qn.NO_ERROR,p=a.getStatus();if(!u||ag(p,this.additionalRetryCodes_)&&this.retry){const S=a.getErrorCode()===qn.ABORT;s(!1,new Cn(!1,null,S));return}const E=this.successCodes_.indexOf(p)!==-1;s(!0,new Cn(E,a))})},t=(s,r)=>{const a=this.resolve_,l=this.reject_,u=r.connection;if(r.wasSuccessCode)try{const p=this.callback_(u,u.getResponse());rg(p)?a(p):a()}catch(p){l(p)}else if(u!==null){const p=Xp();p.serverResponse=u.getErrorText(),this.errorCallback_?l(this.errorCallback_(u,p)):l(p)}else if(r.canceled){const p=this.appDelete_?ac():Zp();l(p)}else{const p=Yp();l(p)}};this.canceled_?t(!1,new Cn(!1,null,!0)):this.backoffId_=ig(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&sg(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Cn{constructor(e,t,s){this.wasSuccessCode=e,this.connection=t,this.canceled=!!s}}function lg(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function hg(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function ug(n,e){e&&(n["X-Firebase-GMPID"]=e)}function dg(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function fg(n,e,t,s,r,a,l=!0,u=!1){const p=og(n.urlParams),E=n.url+p,S=Object.assign({},n.headers);return ug(S,e),lg(S,t),hg(S,a),dg(S,s),new cg(E,n.method,S,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,r,l,u)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pg(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function gg(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(e,t){this._service=e,t instanceof fe?this._location=t:this._location=fe.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Gn(e,t)}get root(){const e=new fe(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return gg(this._location.path)}get storage(){return this._service}get parent(){const e=pg(this._location.path);if(e===null)return null;const t=new fe(this._location.bucket,e);return new Gn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw tg(e)}}function Ao(n,e){const t=e==null?void 0:e[zp];return t==null?null:fe.makeFromBucketSpec(t,n)}function mg(n,e,t,s={}){n.host=`${e}:${t}`;const r=bt(e);r&&(Ji(`https://${n.host}/b`),Xi("Storage",!0)),n._isUsingEmulator=!0,n._protocol=r?"https":"http";const{mockUserToken:a}=s;a&&(n._overrideAuthToken=typeof a=="string"?a:jo(a,n.app.options.projectId))}class _g{constructor(e,t,s,r,a,l=!1){this.app=e,this._authProvider=t,this._appCheckProvider=s,this._url=r,this._firebaseVersion=a,this._isUsingEmulator=l,this._bucket=null,this._host=oc,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Kp,this._maxUploadRetryTime=Jp,this._requests=new Set,r!=null?this._bucket=fe.makeFromBucketSpec(r,this._host):this._bucket=Ao(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=fe.makeFromBucketSpec(this._url,e):this._bucket=Ao(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){vo("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){vo("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(te(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Gn(this,e)}_makeRequest(e,t,s,r,a=!0){if(this._deleted)return new ng(ac());{const l=fg(e,this._appId,s,r,t,this._firebaseVersion,a,this._isUsingEmulator);return this._requests.add(l),l.getPromise().then(()=>this._requests.delete(l),()=>this._requests.delete(l)),l}}async makeRequestWithTokens(e,t){const[s,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,s,r).getPromise()}}const So="@firebase/storage",bo="0.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc="storage";function yg(n=rn(),e){n=ie(n);const s=Je(n,cc).getImmediate({identifier:e}),r=Fo("storage");return r&&Ig(s,...r),s}function Ig(n,e,t,s={}){mg(n,e,t,s)}function wg(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),s=n.getProvider("auth-internal"),r=n.getProvider("app-check-internal");return new _g(t,s,r,e,pt)}function Eg(){ge(new ae(cc,wg,"PUBLIC").setMultipleInstances(!0)),ne(So,bo,""),ne(So,bo,"esm2020")}Eg();const Tg={apiKey:"AIzaSyC74Yy1umbex7FlZbo3WLb9Skr3YRyDGDA",authDomain:"n423-6048d.firebaseapp.com",projectId:"n423-6048d",storageBucket:"n423-6048d.appspot.com",messagingSenderId:"358545178901",appId:"1:358545178901:web:19ce544398e43bb601e91c",measurementId:"G-72TXE25F8B"},Ct=ph().length?rn():Ko(Tg);let vg=null;try{typeof window<"u"&&(vg=hp(Ct))}catch{}const Ag=ka(Ct),Sg=$p(Ct),bg=yg(Ct);console.log("Firebase initialized:",{app:!!Ct,auth:!!Ag,db:!!Sg,storage:!!bg});const Pt=ka(Ct);Nu(Pt,n=>{n?console.log("User is signed in:",n.email,n.displayName):(console.log("No user is signed in."),window.location.pathname.includes("dashboard.html")&&(window.location.href="/index.html"))});const Ro=document.getElementById("login-btn");Ro&&Ro.addEventListener("click",n=>{n.preventDefault();const e=document.getElementById("email").value,t=document.getElementById("password").value;Ru(Pt,e,t).then(()=>{console.log("User logged in successfully"),alert("🎯 NEW DAILY CHALLENGE!"),window.location.href="/src/dashboard.html"}).catch(s=>{console.error("Error logging in:",s),alert(s.message)})});const Co=document.getElementById("signup-btn");Co&&Co.addEventListener("click",n=>{n.preventDefault();const e=document.getElementById("fName").value,t=document.getElementById("username").value,s=document.getElementById("email").value,r=document.getElementById("password").value;bu(Pt,s,r).then(a=>{const l=a.user;return Pu(l,{displayName:`${e} (${t})`})}).then(()=>{console.log("✅ User signed up and profile updated!"),window.location.href="/src/dashboard.html"}).catch(a=>{console.error("❌ Error signing up:",a),alert(a.message)})});const Po=document.getElementById("googleSignIn");Po&&Po.addEventListener("click",n=>{n.preventDefault();const e=new Se;Qu(Pt,e).then(t=>{console.log("Google sign-in successful:",t.user.email),window.location.href="/src/dashboard.html"}).catch(t=>{console.error("Error with Google sign-in:",t),alert(t.message)})});const ko=document.getElementById("signOut");ko&&ko.addEventListener("click",()=>{Du(Pt).then(()=>{console.log("User signed out successfully"),window.location.href="/index.html"}).catch(n=>{console.error("Error signing out:",n)})});const Oo=document.querySelector(".forgot-link"),Pe=document.getElementById("forgot-password-modal"),No=document.querySelector(".close-modal"),Do=document.getElementById("forgot-password-form");Oo&&Pe&&Oo.addEventListener("click",n=>{n.preventDefault(),Pe.style.display="flex"});No&&Pe&&No.addEventListener("click",()=>{Pe.style.display="none",document.getElementById("reset-message").textContent=""});Pe&&Pe.addEventListener("click",n=>{n.target===Pe&&(Pe.style.display="none",document.getElementById("reset-message").textContent="")});Do&&Do.addEventListener("submit",n=>{n.preventDefault();const e=document.getElementById("reset-email").value,t=document.getElementById("reset-message");console.log("Attempting to send password reset email to:",e),t.textContent="Sending...",t.style.color="#ffc107",Su(Pt,e).then(()=>{console.log("✅ Password reset email sent successfully to:",e),t.textContent="Password reset email sent! Check your inbox (and spam folder).",t.style.color="#4CAF50",document.getElementById("reset-email").value="",setTimeout(()=>{Pe.style.display="none",t.textContent=""},5e3)}).catch(s=>{console.error("❌ Error sending password reset email:",s),console.error("Error code:",s.code),console.error("Error message:",s.message);let r=s.message;s.code==="auth/user-not-found"?r="No account found with this email address.":s.code==="auth/invalid-email"&&(r="Please enter a valid email address."),t.textContent=r,t.style.color="#f44336"})});
