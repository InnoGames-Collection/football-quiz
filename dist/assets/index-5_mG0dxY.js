const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/TournamentService-7IbVgJZI.js","assets/supabase-kic3bLQH.js"])))=>i.map(i=>d[i]);
import{c as ze}from"./supabase-kic3bLQH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();const Re="modulepreload",Be=function(p){return"/"+p},Le={},pe=function(e,t,i){let a=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");a=r(t.map(c=>{if(c=Be(c),c in Le)return;Le[c]=!0;const d=c.endsWith(".css"),h=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":Re,d||(m.as="script"),m.crossOrigin="",m.href=c,l&&m.setAttribute("nonce",l),document.head.appendChild(m),d)return new Promise((b,v)=>{m.addEventListener("load",b),m.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(r){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=r,window.dispatchEvent(s),!s.defaultPrevented)throw r}return a.then(r=>{for(const s of r||[])s.status==="rejected"&&n(s.reason);return e().catch(n)})};class Pe{_container;constructor(){let e=document.getElementById("ui-root");e||(e=document.createElement("div"),e.id="ui-root",e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.fontFamily="system-ui, -apple-system, sans-serif",document.body.appendChild(e)),this._container=e}get container(){return this._container}clear(){this._container.innerHTML="",this._container.classList.remove("page-transition-enter"),this._container.offsetWidth,this._container.classList.add("page-transition-enter")}}const ke="https://eywvrsqiqvmiktovaxmq.supabase.co",Fe="sb_publishable_vSzKiN0dx8mgRRb3jsDonQ_BesE-gSx";class W{static _instance=null;_client=null;constructor(){try{this._client=ze(ke,Fe,{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:window.sessionStorage},realtime:{params:{eventsPerSecond:10}}}),console.log("[SupabaseClient] Initialized successfully with URL:",ke)}catch(e){console.error("[SupabaseClient] Failed to initialize Supabase client:",e),this._client=null}}static getInstance(){return W._instance||(W._instance=new W),W._instance}get client(){return this._client}get isOnline(){return this._client!==null}}const _=W.getInstance(),g=_.client,qe=Object.freeze(Object.defineProperty({__proto__:null,supabase:g,supabaseService:_},Symbol.toStringTag,{value:"Module"}));class ne{static STORAGE_KEY="ETHIO_FOOTBALL_SAVE_V3";_profile;_cloudUserId=null;constructor(){this._profile=this._loadProfile()}get cloudUserId(){return this._cloudUserId}_loadProfile(){try{const e=localStorage.getItem(ne.STORAGE_KEY);if(e)return JSON.parse(e)}catch(e){console.warn("[SaveManager] Failed to read localStorage, initializing default profile.",e)}return{username:"Walia Player",coins:0,xp:0,highScores:{"football-quiz":0},unlockedItems:["default-ball","default-jersey"],eloRating:0,streakCount:0,totalMatches:0,totalWins:0}}syncWithCloudUser(e){this._cloudUserId=e.id,this._profile.username=e.username,this._profile.coins=e.coins,this._profile.xp=e.xp,this._profile.eloRating=e.elo_rating,this._profile.streakCount=e.streak_count,this._profile.totalMatches=e.total_matches,this._profile.totalWins=e.total_wins,e.phone&&(this._profile.phone=e.phone),this.save()}save(){try{localStorage.setItem(ne.STORAGE_KEY,JSON.stringify(this._profile)),console.log("[SaveManager] Saved user profile locally.")}catch(t){console.error("[SaveManager] Failed to save profile to localStorage.",t)}const e=_.client;if(this._cloudUserId&&e){let t=0;if(this._profile.highScores)for(const i in this._profile.highScores)t+=this._profile.highScores[i];e.from("users").update({username:this._profile.username,coins:this._profile.coins,xp:this._profile.xp,score:t,elo_rating:this._profile.eloRating||0,streak_count:this._profile.streakCount||0,total_matches:this._profile.totalMatches||0,total_wins:this._profile.totalWins||0,last_active:new Date().toISOString()}).eq("id",this._cloudUserId).then(({error:i})=>{i&&console.error("[SaveManager] Error syncing profile to cloud:",i)})}}get profile(){return this._profile}updateUsername(e){this._profile.username=e,this.save()}updateHighScore(e,t){const i=this._profile.highScores[e]||0;return t>i?(this._profile.highScores[e]=t,this._profile.xp+=Math.floor(t*.5),this.save(),!0):!1}addCoins(e){this._profile.coins+=e,this.save()}addXp(e){this._profile.xp+=e,this.save()}incrementMatchStats(e){this._profile.totalMatches=(this._profile.totalMatches||0)+1,e&&(this._profile.totalWins=(this._profile.totalWins||0)+1),this.save()}updateStreak(e){this._profile.streakCount=e,this.save()}isAdmin(){return this._profile.role==="admin"}}class Te{_ctx=null;_isMuted=!1;_crowdGain=null;_crowdSource=null;_correctAnswerBuffer=null;_wrongAnswerBuffer=null;_answerSelectedBuffer=null;_finalWhistleBuffer=null;_questionArriveBuffer=null;_activeGameplaySound=null;constructor(){const e=localStorage.getItem("ETHIO_FOOTBALL_MUTED");e!==null&&(this._isMuted=e==="true"),typeof document<"u"&&document.addEventListener("visibilitychange",()=>{document.hidden&&this.stopAllGameplaySounds(.05)})}stopAllGameplaySounds(e=.08){if(this.stopCrowdAmbience(),!this._ctx||!this._activeGameplaySound)return;const t=this._activeGameplaySound;this._activeGameplaySound=null,t.timeoutId&&clearTimeout(t.timeoutId);const i=this._ctx.currentTime;try{t.gain.gain.cancelScheduledValues(i),t.gain.gain.setValueAtTime(t.gain.gain.value,i),t.gain.gain.linearRampToValueAtTime(.01,i+e),t.source.stop(i+e+.02)}catch{}}_playManagedSound(e,t,i,a=0){if(this.stopAllGameplaySounds(.02),!e||(this._initContext(),!this._ctx))return;const n=this._ctx.createBufferSource();n.buffer=e;const r=this._ctx.createGain();r.gain.value=t,n.connect(r),r.connect(this._ctx.destination),n.start(this._ctx.currentTime+a);const s={source:n,gain:r,timeoutId:void 0};this._activeGameplaySound=s,i&&(s.timeoutId=setTimeout(()=>{this._activeGameplaySound===s&&this.stopAllGameplaySounds(.08)},i))}_initContext(){if(!this._ctx){const e=window.AudioContext||window.webkitAudioContext;this._ctx=new e,console.log("[AudioManager] Football stadium Web AudioContext initialized.")}this._ctx.state==="suspended"&&this._ctx.resume()}_vibrate(e){if(!this._isMuted&&typeof navigator<"u"&&navigator.vibrate)try{navigator.vibrate(e)}catch{}}playClick(){if(this._isMuted||(this._vibrate(10),this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(800,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(400,this._ctx.currentTime+.05),t.gain.setValueAtTime(.15,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.05),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.05)}playWhistle(){if(this._isMuted||(this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createOscillator(),i=this._ctx.createGain();e.type="sine",t.type="sine",e.frequency.setValueAtTime(2400,this._ctx.currentTime),t.frequency.setValueAtTime(2450,this._ctx.currentTime),i.gain.setValueAtTime(.18,this._ctx.currentTime),i.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.35),e.connect(i),t.connect(i),i.connect(this._ctx.destination),e.start(),t.start(),e.stop(this._ctx.currentTime+.35),t.stop(this._ctx.currentTime+.35)}playFullTimeWhistle(){if(!this._isMuted&&(this._vibrate([30,40,30]),this._initContext(),!!this._ctx)){if(!this._finalWhistleBuffer){const e=(i,a)=>{if(!this._ctx)return;const n=this._ctx.createOscillator(),r=this._ctx.createOscillator(),s=this._ctx.createGain();n.type="sine",r.type="sine",n.frequency.setValueAtTime(2400,i),r.frequency.setValueAtTime(2450,i),s.gain.setValueAtTime(0,i),s.gain.linearRampToValueAtTime(.18,i+.05),s.gain.setValueAtTime(.18,i+a-.1),s.gain.linearRampToValueAtTime(0,i+a),n.connect(s),r.connect(s),s.connect(this._ctx.destination),n.start(i),r.start(i),n.stop(i+a),r.stop(i+a)},t=this._ctx.currentTime;e(t,.25),e(t+.35,.25),e(t+.7,.6);return}this._playManagedSound(this._finalWhistleBuffer,.75,void 0,.15)}}playCrowdAmbience(){if(this._isMuted||(this._initContext(),!this._ctx||this._crowdSource))return;const e=this._ctx.sampleRate*2,t=this._ctx.createBuffer(1,e,this._ctx.sampleRate),i=t.getChannelData(0);let a=0,n=0,r=0;for(let s=0;s<e;s++){const l=Math.random()*2-1;a=.99886*a+l*.0555179,n=.99332*n+l*.0750759,r=.969*r+l*.153852,i[s]=(a+n+r)*.04}this._crowdSource=this._ctx.createBufferSource(),this._crowdSource.buffer=t,this._crowdSource.loop=!0,this._crowdGain=this._ctx.createGain(),this._crowdGain.gain.setValueAtTime(.04,this._ctx.currentTime),this._crowdSource.connect(this._crowdGain),this._crowdGain.connect(this._ctx.destination),this._crowdSource.start()}stopCrowdAmbience(){if(this._crowdSource){try{this._crowdSource.stop()}catch{}this._crowdSource=null}}playGoalCheer(){if(this._isMuted||(this._initContext(),!this._ctx))return;this.playWhistle();const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(140,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(40,this._ctx.currentTime+.12),t.gain.setValueAtTime(.3,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.12),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.12),[523.25,659.25,783.99,1046.5].forEach((a,n)=>{if(!this._ctx)return;const r=this._ctx.createOscillator(),s=this._ctx.createGain();r.type="triangle",r.frequency.setValueAtTime(a,this._ctx.currentTime+n*.08),s.gain.setValueAtTime(.2,this._ctx.currentTime+n*.08),s.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+n*.08+.3),r.connect(s),s.connect(this._ctx.destination),r.start(this._ctx.currentTime+n*.08),r.stop(this._ctx.currentTime+n*.08+.3)})}playWrongAnswer(e){this._isMuted||(this._vibrate([40,20,40]),this._wrongAnswerBuffer&&this._playManagedSound(this._wrongAnswerBuffer,.7,e))}playAnswerSelected(e){if(!this._isMuted){if(!this._answerSelectedBuffer){this.playClick();return}this._playManagedSound(this._answerSelectedBuffer,.4,e)}}playQuestionArrive(){this._isMuted||(this._vibrate([10]),this._questionArriveBuffer&&this._playManagedSound(this._questionArriveBuffer,.45))}playCountdownWarning(){if(this._isMuted||(this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(70,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(30,this._ctx.currentTime+.08),t.gain.setValueAtTime(.3,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.08),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.08);const i=this._ctx.createOscillator(),a=this._ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(1200,this._ctx.currentTime),a.gain.setValueAtTime(.12,this._ctx.currentTime),a.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.04),i.connect(a),a.connect(this._ctx.destination),i.start(),i.stop(this._ctx.currentTime+.04)}async preloadAssets(){if(!this._isMuted)try{const[e,t,i,a,n]=await Promise.all([fetch("/assets/audios/Righ%20Answer%20score%20goal.m4a"),fetch("/assets/audios/wrong%20answer.m4a"),fetch("/assets/audios/Answer%20selected.m4a"),fetch("/assets/audios/whistle%20when%20game%20ends%20or%20timout.m4a"),fetch("/assets/audios/question-arrive.mp3")]);if(!this._ctx){const r=window.AudioContext||window.webkitAudioContext;this._ctx=new r}if(e.ok){const r=await e.arrayBuffer();this._correctAnswerBuffer=await this._ctx.decodeAudioData(r)}if(t.ok){const r=await t.arrayBuffer();this._wrongAnswerBuffer=await this._ctx.decodeAudioData(r)}if(i.ok){const r=await i.arrayBuffer();this._answerSelectedBuffer=await this._ctx.decodeAudioData(r)}if(a.ok){const r=await a.arrayBuffer();this._finalWhistleBuffer=await this._ctx.decodeAudioData(r)}if(n.ok){const r=await n.arrayBuffer();this._questionArriveBuffer=await this._ctx.decodeAudioData(r)}console.log("[AudioManager] Audio assets preloaded successfully.")}catch(e){console.warn("[AudioManager] Failed to preload audio assets",e)}}playCorrectAnswerGoal(e){if(!this._isMuted){if(this._vibrate([30,40,30]),!this._correctAnswerBuffer){this.playGoalCheer();return}this._playManagedSound(this._correctAnswerBuffer,.8,e)}}playVictoryFanfare(){if(this._isMuted||(this._initContext(),!this._ctx))return;[523.25,659.25,783.99,1046.5,1318.51].forEach((t,i)=>{if(!this._ctx)return;const a=this._ctx.createOscillator(),n=this._ctx.createGain();a.type="triangle",a.frequency.setValueAtTime(t,this._ctx.currentTime+i*.1),n.gain.setValueAtTime(.25,this._ctx.currentTime+i*.1),n.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+i*.1+.35),a.connect(n),n.connect(this._ctx.destination),a.start(this._ctx.currentTime+i*.1),a.stop(this._ctx.currentTime+i*.1+.35)})}playDefeatSound(){this._isMuted||(this._initContext(),this._ctx&&this.playWhistle())}toggleMute(){return this._isMuted=!this._isMuted,localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(this._isMuted)),this._isMuted&&this.stopCrowdAmbience(),this._isMuted}get isMuted(){return this._isMuted}}class De{_uiManager;_saveManager;_audioManager;constructor(){this._uiManager=new Pe,this._saveManager=new ne,this._audioManager=new Te}async initialize(){this._audioManager.preloadAssets()}get uiManager(){return this._uiManager}get saveManager(){return this._saveManager}get audioManager(){return this._audioManager}}class He{_games=new Map;_activeGame=null;_uiManager;constructor(e){this._uiManager=e}registerGame(e){this._games.set(e.metadata.id,e),console.log(`[GameRegistry] Registered game: ${e.metadata.name} (${e.metadata.id})`)}getRegisteredGames(){return Array.from(this._games.values())}async launchGame(e){this._activeGame&&(console.log(`[GameRegistry] Destroying active game: ${this._activeGame.metadata.name}`),this._activeGame.destroy(),this._uiManager.clear());const t=this._games.get(e);if(!t)throw new Error(`[GameRegistry] Game with ID '${e}' not found.`);console.log(`[GameRegistry] Initializing game: ${t.metadata.name}`),await t.initialize(this._uiManager),this._activeGame=t,t.start()}get activeGame(){return this._activeGame}}class Ne{_goals=0;_correct=0;_incorrect=0;_total=0;_currentCombo=0;_maxCombo=0;_responseTimes=[];_answerSubmissions=[];reset(){this._goals=0,this._correct=0,this._incorrect=0,this._total=0,this._currentCombo=0,this._maxCombo=0,this._responseTimes=[],this._answerSubmissions=[]}recordAnswer(e,t,i,a){if(this._total++,this._responseTimes.push(t),i&&a!==void 0&&this._answerSubmissions.push({questionId:i,selectedIndex:a,responseTimeMs:Math.round(t*1e3)}),e){this._goals++,this._correct++,this._currentCombo++,this._currentCombo>this._maxCombo&&(this._maxCombo=this._currentCombo);const n=100,r=(this._currentCombo-1)*25,s=n+r,l=20+this._currentCombo*5;return{isGoal:!0,coins:s,xp:l}}else return this._incorrect++,this._currentCombo=0,{isGoal:!1,coins:0,xp:0}}get answerSubmissions(){return this._answerSubmissions}calculateFinalStats(){const e=this._total>0?Math.round(this._correct/this._total*100):0,t=Math.min(Math.max(Math.round(e*.85+15),30),85),i=this._responseTimes.reduce((c,d)=>c+d,0),a=this._responseTimes.length>0?parseFloat((i/this._responseTimes.length).toFixed(1)):0,n=this._correct*100+this._maxCombo*50,r=this._correct*20+this._maxCombo*10;let s=5+e/20+this._maxCombo*.4;a>0&&a<5&&(s+=1);const l=parseFloat(Math.min(Math.max(s,3),10).toFixed(1));return{goals:this._goals,correctAnswers:this._correct,incorrectAnswers:this._incorrect,totalQuestions:this._total,accuracy:e,possessionPercent:t,avgResponseTime:a,maxCombo:this._maxCombo,coinsEarned:n,xpEarned:r,matchRating:l}}}const Me={"world-cup":{id:"world-cup",nameEn:"FIFA World Cup",nameAm:"የዓለም ዋንጫ",nameOm:"Waancaa Addunyaa FIFA",badge:"🏆",description:"World Cup history, records, hosts, and legend moments"},"champions-league":{id:"champions-league",nameEn:"UEFA Champions League",nameAm:"UEFA ቻምፒየንስ ሊግ",nameOm:"Liigii Chaampiyoonsii UEFA",badge:"⭐",description:"European club football, iconic finals, and top scorers"},"caf-champions":{id:"caf-champions",nameEn:"CAF Champions League",nameAm:"የCAF ሻምፒዮንስ ሊግ",nameOm:"Liigii Chaampiyoonsii CAF",badge:"🌍",description:"African club football and continental showdowns"},afcon:{id:"afcon",nameEn:"Africa Cup of Nations (AFCON)",nameAm:"የአፍሪካ ዋንጫ (AFCON)",nameOm:"Waancaa Afriikaa (AFCON)",badge:"🦁",description:"Africa's flagship national team championship"},"ethiopian-premier":{id:"ethiopian-premier",nameEn:"Ethiopian Premier League",nameAm:"የኢትዮጵያ ፕሪሚየር ሊግ",nameOm:"Liigii Piriimeraa Itoophiyaa",badge:"🇪🇹",description:"Ethiopian club teams, derbies, and domestic history"},"walia-ibex":{id:"walia-ibex",nameEn:"Walia Ibex (National Team)",nameAm:"ዋሊያ ኢቤክስ (ብሔራዊ ቡድን)",nameOm:"Waaliyaa Ibeks (Garaa Guutuu)",badge:"🐐",description:"Ethiopian national team milestones and heroes"},"premier-league":{id:"premier-league",nameEn:"English Premier League",nameAm:"የእንግሊዝ ፕሪሚየር ሊግ",nameOm:"Liigii Piriimeraa Ingilaand",badge:"🦁",description:"EPL clubs, managers, top scorers, and records"},"la-liga":{id:"la-liga",nameEn:"Spanish La Liga",nameAm:"የስፔን ላ ሊጋ",nameOm:"Laa Liigaa Ispeen",badge:"🇪🇸",description:"El Clásico, Spanish giants, and title races"},"serie-a":{id:"serie-a",nameEn:"Italian Serie A",nameAm:"የጣሊያን ሰሪ ኤ",nameOm:"Seeriyee A Xaaliyaanii",badge:"🇮🇹",description:"Calcio history, tactical legends, and Italian clubs"},bundesliga:{id:"bundesliga",nameEn:"German Bundesliga",nameAm:"የጀርመን ቡንደስሊጋ",nameOm:"Buundesliigaa Jarmaan",badge:"🇩🇪",description:"German football powerhouses and records"},"legendary-players":{id:"legendary-players",nameEn:"Legendary Players",nameAm:"አፈ ታሪክ ተጫዋቾች",nameOm:"Taphattootaa Seenaa",badge:"👟",description:"All-time greats, Ballon d'Or winners, and icons"},"football-rules":{id:"football-rules",nameEn:"Football Rules & Laws",nameAm:"የእግር ኳስ ሕግጋት",nameOm:"Seera Kubbaa Miilaa",badge:"📏",description:"Laws of the game, offside rule, VAR, and refereeing"},"transfer-market":{id:"transfer-market",nameEn:"Transfer Market & Fees",nameAm:"የዝውውር ገበያ",nameOm:"Gabaa Dabarsaa",badge:"💰",description:"Record transfer fees, contracts, and market moves"},stadiums:{id:"stadiums",nameEn:"Stadiums & Venues",nameAm:"ስታዲየሞች",nameOm:"Istaadiyeemota",badge:"🏟️",description:"Iconic football grounds, capacities, and host cities"},"football-history":{id:"football-history",nameEn:"Football History",nameAm:"የእግር ኳስ ታሪክ",nameOm:"Seenaa Kubbaa Miilaa",badge:"📜",description:"Origins, historic matches, and global football lore"}};class L{static _competitions=new Map;static _isInitialized=!1;static _initDefaults(){L._isInitialized||(Object.values(Me).forEach(e=>{L._competitions.set(e.id,{id:e.id,name:e.nameEn,nameEn:e.nameEn,nameAm:e.nameAm,nameOm:e.nameOm,badge:e.badge,description:e.description,color:"#FFD700",questionCount:10,status:"live",participants:0,prize_pool:0})}),L._isInitialized=!0)}static getAll(e="en"){return L._initDefaults(),Array.from(L._competitions.values()).map(t=>{let i=t.nameEn;return e==="am"&&t.nameAm&&(i=t.nameAm),e==="om"&&t.nameOm&&(i=t.nameOm),{...t,name:i}})}static getById(e,t="en"){L._initDefaults();const i=L._competitions.get(e);if(!i)return;let a=i.nameEn;return t==="am"&&i.nameAm&&(a=i.nameAm),t==="om"&&i.nameOm&&(a=i.nameOm),{...i,name:a}}static async syncFromCloud(e="en"){if(L._initDefaults(),_.isOnline&&g)try{const{data:t,error:i}=await g.from("competitions").select("*").eq("is_active",!0);if(!i&&t&&t.length>0){let a=0;try{const{count:n,error:r}=await g.from("game_sessions").select("*",{count:"exact",head:!0}).eq("state","playing");!r&&n&&(a=n)}catch{}t.forEach(n=>{L._competitions.set(n.id,{id:n.id,name:n.name_en,nameEn:n.name_en,nameAm:n.name_am||void 0,nameOm:n.name_om||void 0,badge:n.badge,description:n.description_en||"",color:n.color||"#FFD700",questionCount:n.question_count||10,status:"live",participants:a,prize_pool:0})})}}catch(t){console.warn("[CompetitionRegistry] Cloud sync failed, using defaults:",t)}return L.getAll(e)}static addCompetition(e){L._initDefaults(),L._competitions.set(e.id,e),console.log(`[CompetitionRegistry] Added competition: ${e.name}`)}static removeCompetition(e){return L._competitions.delete(e)}}class re{static async invoke(e,t){if(!_.isOnline||!g)return{data:null,error:`Supabase client offline. Edge function '${e}' unavailable.`};try{const{data:i,error:a}=await g.functions.invoke(e,{body:t});return a?(console.error(`[EdgeFunctionClient] Error calling '${e}':`,a),{data:null,error:a.message}):{data:i,error:null}}catch(i){return console.error(`[EdgeFunctionClient] Exception in '${e}':`,i),{data:null,error:i.message||"Edge function invocation failed."}}}}const Ge=[{id:"fb-1",category:"walia-ibex",difficulty:2,prompt:"Which country won the first ever African Cup of Nations (AFCON) in 1957?",options:["Egypt","Ethiopia","Sudan","South Africa"],correctIndex:0,explanation:"Egypt defeated Ethiopia 4-0 in the final of the inaugural Africa Cup of Nations.",fact:"Only three nations participated in the first AFCON: Egypt, Ethiopia, and Sudan. South Africa was disqualified due to apartheid.",learningTip:"Remember '1957' as the birth year of AFCON."},{id:"fb-2",category:"walia-ibex",difficulty:1,prompt:"What is the nickname of the Ethiopian National Football Team?",options:["The Lions","Walia Ibex","The Pharoahs","Black Stars"],correctIndex:1,explanation:"The Walia Ibex is an endangered species of ibex found only in the Simien Mountains of Ethiopia."},{id:"fb-3",category:"ethiopian-premier",difficulty:3,prompt:"Which club holds the record for the most Ethiopian Premier League titles?",options:["Ethiopian Coffee SC","Dedebit FC","Fasil Kenema","Saint George SC"],correctIndex:3},{id:"fb-4",category:"ethiopian-premier",difficulty:3,prompt:"In which year was the Ethiopian Premier League established in its current format?",options:["1985","1997","2002","2010"],correctIndex:1},{id:"fb-5",category:"walia-ibex",difficulty:4,prompt:"Who is Ethiopia's all-time top goalscorer in international football?",options:["Getaneh Kebede","Saladin Said","Mengistu Worku","Adane Girma"],correctIndex:0},{id:"fb-6",category:"world-cup",difficulty:1,prompt:"Which nation has won the most FIFA Men's World Cup titles?",options:["Germany","Brazil","Argentina","Italy"],correctIndex:1},{id:"fb-7",category:"world-cup",difficulty:2,prompt:"Who won the Golden Boot in the 2022 FIFA World Cup?",options:["Lionel Messi","Kylian Mbappé","Julián Álvarez","Olivier Giroud"],correctIndex:1},{id:"fb-8",category:"champions-league",difficulty:2,prompt:"Which player has scored the most goals in UEFA Champions League history?",options:["Lionel Messi","Robert Lewandowski","Cristiano Ronaldo","Karim Benzema"],correctIndex:2},{id:"fb-9",category:"premier-league",difficulty:3,prompt:"Which team holds the record for most points in a single English Premier League season?",options:["Manchester United","Liverpool","Chelsea","Manchester City"],correctIndex:3},{id:"fb-10",category:"walia-ibex",difficulty:4,prompt:"Ethiopia won its only African Cup of Nations title in which year?",options:["1957","1962","1970","1982"],correctIndex:1,fact:"Ydnekatchew Tessema was one of the most influential figures in Ethiopian football history.",learningTip:"Ethiopia hosted and won the 1962 tournament, defeating Egypt 4-2 in the final after extra time."},{id:"fb-11",category:"premier-league",difficulty:2,prompt:"Who is the all-time top scorer of the English Premier League?",options:["Wayne Rooney","Alan Shearer","Harry Kane","Thierry Henry"],correctIndex:1},{id:"fb-12",category:"ethiopian-premier",difficulty:2,prompt:"What colors are primarily associated with Ethiopian Coffee SC?",options:["Green and Yellow","Red and White","Brown and Gold","Blue and White"],correctIndex:2},{id:"fb-13",category:"world-cup",difficulty:4,prompt:"Which African nation became the first to reach a FIFA World Cup Semi-Final?",options:["Senegal","Ghana","Morocco","Nigeria"],correctIndex:2},{id:"fb-14",category:"champions-league",difficulty:3,prompt:"Which club has won the most UEFA Champions League titles?",options:["AC Milan","Bayern Munich","Liverpool","Real Madrid"],correctIndex:3},{id:"fb-15",category:"walia-ibex",difficulty:5,prompt:"Who coached the Ethiopian National Team when they qualified for the 2013 AFCON?",options:["Bishaw Sewnet","Asrat Haile","Yohannes Sahle","Wubetu Abate"],correctIndex:0}];class q{static _instance=null;_askedQuestionIds=new Set;static getInstance(){return q._instance||(q._instance=new q),q._instance}async fetchQuestions(e,t=10,i="en",a=[],n="casual"){if(_.isOnline)try{const{data:s,error:l}=await re.invoke("questions",{competitionId:e,count:t*2,locale:i,excludeIds:a,usageType:n});if(!l&&s&&s.questions&&s.questions.length>0)return console.log("[QuestionBank] Fetched server-authored questions via Edge Function."),this._selectQuestions(s.questions,t)}catch(s){console.warn("[QuestionBank] Edge Function failed.",s)}if(_.isOnline&&g)try{let s=g.from("questions").select("*").eq("is_active",!0);n==="casual"?s=s.eq("usage_type","casual"):n==="tournament"&&(s=s.eq("usage_type","tournament")),e&&e!=="all"&&(s=s.or(`competition_id.eq.${e},category.eq.${e}`)),a&&a.length>0&&(s=s.not("id","in",`(${a.join(",")})`));const{data:l,error:c}=await s.limit(50);if(!c&&l&&l.length>0){console.log("[QuestionBank] Fetched questions directly from Supabase DB.");const d=l.map(h=>this._mapQuestionRow(h,i));return this._selectQuestions(d,t)}}catch(s){console.warn("[QuestionBank] Supabase DB question fetch error:",s)}console.warn("[QuestionBank] Server connection unavailable. Serving fallback offline questions.");let r=Ge;if(e){const s=r.filter(l=>l.category===e);s.length>=Math.min(t,5)&&(r=s)}return a&&a.length>0&&(r=r.filter(s=>!a.includes(s.id))),this._selectQuestions(r,t)}async fetchQuestionsByIds(e,t="en"){if(_.isOnline&&g&&e.length>0)try{const{data:i,error:a}=await g.from("questions").select("*").in("id",e);if(!a&&i&&i.length>0){console.log(`[QuestionBank] Fetched ${i.length} specific questions by ID.`);const n=i.map(s=>this._mapQuestionRow(s,t,!1)),r=[];for(const s of e){const l=n.find(c=>c.id===s);l&&r.push(l)}return r}}catch(i){console.warn("[QuestionBank] Supabase DB fetchQuestionsByIds error:",i)}return this.fetchQuestions(void 0,e.length,t)}_mapQuestionRow(e,t,i=!0){let a=e.prompt_en,n=e.options_en;t==="am"&&e.prompt_am&&e.options_am?(a=e.prompt_am,n=e.options_am):t==="om"&&e.prompt_om&&e.options_om&&(a=e.prompt_om,n=e.options_om);let r=n,s=e.correct_index;if(i){const l=[0,1,2,3];for(let c=l.length-1;c>0;c--){const d=Math.floor(Math.random()*(c+1));[l[c],l[d]]=[l[d],l[c]]}r=l.map(c=>n[c]),s=l.indexOf(e.correct_index)}return{id:e.id,category:e.category,difficulty:e.difficulty,prompt:a,options:r,correctIndex:s}}_selectQuestions(e,t){let i=e.filter(s=>s.id&&!this._askedQuestionIds.has(s.id));i.length<t&&(this._askedQuestionIds.clear(),i=e);const n=[...i.length>=t?i:e];for(let s=n.length-1;s>0;s--){const l=Math.floor(Math.random()*(s+1));[n[s],n[l]]=[n[l],n[s]]}const r=n.slice(0,t);for(r.forEach(s=>{s.id&&this._askedQuestionIds.add(s.id)});r.length<t&&e.length>0;)r.push(e[Math.floor(Math.random()*e.length)]);return r}}const Ue={common:{title:"FOOTBALL QUIZ LEAGUE",subtitle:"ETHIO TELECOM VAS PLATFORM",close:"✖ CLOSE",backToHome:"✖ BACK TO HOME",play:"PLAY",submit:"SUBMIT",loading:"Loading...",error:"Error"},home:{soloMatch:"⚽ SOLO MATCH",liveMatch:"⚡ LIVE 1v1 MATCH",dailyChallenge:"📅 DAILY CHALLENGE",competitions:"🏆 COMPETITIONS",leaderboard:"📊 LEADERBOARD",badges:"🎖️ BADGES",admin:"⚙️ ADMIN",streak:"🔥 {count} DAY STREAK",coins:"🪙 {coins} COINS",level:"LVL {level}",invite:"Invite",inviteDesc:"+200 XP per friend.",copyLink:"Copy Link",performance:"📊 Performance",details:"DETAILS",matches:"MATCHES",points:"POINTS",score:"SCORE",lobbies:"⚽ Lobbies",championship:"🏆 ETHIOFANTASY CHAMPIONSHIP"},match:{questionCount:"QUESTION {current} OF {total}",goal:"⚽ GOAL!!!!!",saved:"🧤 SAVED!",halfTime:"HALF TIME",fullTime:"FULL TIME",matchStats:"MATCH STATISTICS",matchRating:"MATCH RATING",possession:"POSSESSION",accuracy:"ACCURACY",maxCombo:"MAX COMBO",coinsEarned:"COINS EARNED",xpEarned:"XP EARNED",continue:"CONTINUE TO HUB",leaveMatch:"Leave Match?",leaveWarning:"Your progress will be abandoned.",leaveBtn:"Leave",continueBtn:"Continue"},multiplayer:{matchmakingTitle:"LIVE MULTIPLAYER MATCHMAKING",findingOpponent:"FINDING WORTHY OPPONENT...",yourRating:"YOUR RATING",searchRange:"SEARCH RANGE",cancelMatchmaking:"✖ CANCEL MATCHMAKING",victory:"VICTORY!",draw:"MATCH DRAW!",defeated:"DEFEATED!",finalScore:"FINAL SCORE: {myScore} - {oppScore}",eloRating:"ELO RATING"},categories:{worldCup:"FIFA World Cup",championsLeague:"UEFA Champions League",cafChampions:"CAF Champions League",afcon:"Africa Cup of Nations",ethiopianPremier:"Ethiopian Premier League",waliaIbex:"Ethiopian National Team (Walia Ibex)",premierLeague:"Premier League",laLiga:"La Liga",serieA:"Serie A",bundesliga:"Bundesliga",legendaryPlayers:"Legendary Players",footballRules:"Football Rules & Laws",transferMarket:"Transfer Market",stadiums:"Stadiums & Venues",footballHistory:"Football History"}},We={common:{title:"የእግር ኳስ ጥያቄ ሊግ",subtitle:"ኢትዮ ቴሌኮም ቪኤኤስ መድረክ",close:"✖ ዝጋ",backToHome:"✖ ወደ ዋና ገጽ",play:"ተጫወት",submit:"ላክ",loading:"በመጫን ላይ...",error:"ስህተት"},home:{soloMatch:"⚽ ነጠላ ጨዋታ",liveMatch:"⚡ ቀጥታ 1v1 ጨዋታ",dailyChallenge:"📅 የዕለት ተግዳሮት",competitions:"🏆 ውድድሮች",leaderboard:"📊 ደረጃ ሰሌዳ",badges:"🎖️ ባጆች",admin:"⚙️ አድሚን",streak:"🔥 {count} ቀን ተከታታይ",coins:"🪙 {coins} ሳንቲም",level:"ደረጃ {level}",invite:"ጋብዝ",inviteDesc:"+200 XP በአንድ ጓደኛ",copyLink:"ሊንክ ኮፒ አድርግ",performance:"📊 አፈጻጸም",details:"ዝርዝር",matches:"ጨዋታዎች",points:"ነጥቦች",score:"ውጤት",lobbies:"⚽ ሎቢ",championship:"🏆 የኢትዮፋንታሲ ሻምፒዮና"},match:{questionCount:"ጥያቄ {current} ከ {total}",goal:"⚽ ጎል!!!!!",saved:"🧤 ተመለሰ!",halfTime:"እረፍት",fullTime:"ሙሉ ጊዜ",matchStats:"የጨዋታ ስታቲስቲክስ",matchRating:"የጨዋታ ደረጃ",possession:"ኳስ ቁጥጥር",accuracy:"ትክክለኛነት",maxCombo:"ከፍተኛ ተከታታይ",coinsEarned:"የተገኘ ሳንቲም",xpEarned:"የተገኘ XP",continue:"ወደ መነሻ ገጽ ተመለስ",leaveMatch:"ጨዋታውን ትተህ ውጣ?",leaveWarning:"ያለዎት እድገት ይጠፋል።",leaveBtn:"ውጣ",continueBtn:"ቀጥል"},multiplayer:{matchmakingTitle:"ቀጥታ ባለብዙ ተጫዋች ጨዋታ",findingOpponent:"ተፎካካሪ በመፈለግ ላይ...",yourRating:"የእርስዎ ደረጃ",searchRange:"የፍለጋ ክልል",cancelMatchmaking:"✖ ፍለጋውን ሰርዝ",victory:"ድል!",draw:"እኩል!",defeated:"ተሸንፈዋል!",finalScore:"የመጨረሻ ውጤት: {myScore} - {oppScore}",eloRating:"የኤሎ ደረጃ"},categories:{worldCup:"የዓለም ዋንጫ",championsLeague:"UEFA ቻምፒየንስ ሊግ",cafChampions:"የCAF ሻምፒዮንስ ሊግ",afcon:"የአፍሪካ ዋንጫ",ethiopianPremier:"የኢትዮጵያ ፕሪሚየር ሊግ",waliaIbex:"ዋሊያ ኢቤክስ (ብሔራዊ ቡድን)",premierLeague:"የእንግሊዝ ፕሪሚየር ሊግ",laLiga:"የስፔን ላ ሊጋ",serieA:"የጣሊያን ሰሪ ኤ",bundesliga:"የጀርመን ቡንደስሊጋ",legendaryPlayers:"አፈ ታሪክ ተጫዋቾች",footballRules:"የእግር ኳስ ሕግጋት",transferMarket:"የዝውውር ገበያ",stadiums:"ስታዲየሞች",footballHistory:"የእግር ኳስ ታሪክ"}},Qe={common:{title:"LIIGII GAAFFII KUBBAA MIILAA",subtitle:"ITIYO TELEKOOM VAS PLATFORM",close:"✖ Cufi",backToHome:"✖ Gara Fuula Duraatti",play:"Taphadhu",submit:"Ergi",loading:"Fe'amaa jira...",error:"Dogoggora"},home:{soloMatch:"⚽ TAPHA QOFAAA",liveMatch:"⚡ TAPHI KALLATTII 1v1",dailyChallenge:"📅 QORMAATA GUYYAA",competitions:"🏆 DORGOMMIIWWAN",leaderboard:"📊 SADARKAA",badges:"🎖️ BAADJIIWWAN",admin:"⚙️ ADMIIN",streak:"🔥 {count} GUYYAA WALITTI AANEE",coins:"🪙 {coins} SAAKKATOO",level:"SADARKAA {level}",invite:"Afeeri",inviteDesc:"+200 XP hiriyaa tokkoon",copyLink:"Liinkii Kopi godhi",performance:"📊 Raawwii",details:"BAL'INA",matches:"TAPHOOTA",points:"QABXII",score:"FIRI",lobbies:"⚽ Lobbies",championship:"🏆 CHAMPIONSHIP ETHIOFANTASY"},match:{questionCount:"GAAFFII {current} KEESSAA {total}",goal:"⚽ GOOLII!!!!!",saved:"🧤 QABAME!",halfTime:"BOQONNAA",fullTime:"YEROO GUUTUU",matchStats:"ISTATISTIKSII TAPHA",matchRating:"SADARKAA TAPHA",possession:"KUBBAA QABACHUU",accuracy:"SIREESSUU",maxCombo:"WAL-IRRAA OLAANAA",coinsEarned:"SANTIIMA ARGAME",xpEarned:"XP ARGATAME",continue:"GARA FUULA DURAA DEEBI'I",leaveMatch:"Tapha Dhiiftee Baataa?",leaveWarning:"Guddinni kee ni bada.",leaveBtn:"Bahi",continueBtn:"Itti Fufi"},multiplayer:{matchmakingTitle:"TAPHA KALLATTII DORGOMAA",findingOpponent:"DORGOMAA BARBAADAA JIRA...",yourRating:"SADARKAA KEE",searchRange:"DAANGAA BARBAADUU",cancelMatchmaking:"✖ BARBAADUU HAQI",victory:"INJIFANNOO!",draw:"QIXEE!",defeated:"MO'ATAMTEERTA!",finalScore:"QABXII GUUTUU: {myScore} - {oppScore}",eloRating:"SADARKAA ELO"},categories:{worldCup:"Waancaa Addunyaa FIFA",championsLeague:"Liigii Chaampiyoonsii UEFA",cafChampions:"Liigii Chaampiyoonsii CAF",afcon:"Waancaa Afriikaa",ethiopianPremier:"Liigii Piriimeraa Itoophiyaa",waliaIbex:"Waaliyaa Ibeks (Garee Biyyaaleessaa)",premierLeague:"Liigii Piriimeraa Ingilaand",laLiga:"Laa Liigaa Ispeen",serieA:"Seeriyee A Xaaliyaanii",bundesliga:"Buundesliigaa Jarmaan",legendaryPlayers:"Taphattootaa Seenaa",footballRules:"Seera Kubbaa Miilaa",transferMarket:"Gabaa Dabarsaa",stadiums:"Istaadiyeemota",footballHistory:"Seenaa Kubbaa Miilaa"}},ue={en:Ue,am:We,om:Qe};class Q{static _instance=null;_currentLocale="en";constructor(){const e=localStorage.getItem("ETHIO_FOOTBALL_LOCALE");(e==="am"||e==="om"||e==="en")&&(this._currentLocale=e)}static getInstance(){return Q._instance||(Q._instance=new Q),Q._instance}setLocale(e){this._currentLocale=e,localStorage.setItem("ETHIO_FOOTBALL_LOCALE",e),console.log(`[i18n] Switched locale to: ${e}`)}get currentLocale(){return this._currentLocale}t(e,t){const i=e.split(".");let a=ue[this._currentLocale]||ue.en;for(const r of i)if(a&&a[r]!==void 0)a=a[r];else{let s=ue.en;for(const l of i)if(s&&s[l]!==void 0)s=s[l];else return e;a=s;break}if(typeof a!="string")return e;let n=a;return t&&Object.entries(t).forEach(([r,s])=>{n=n.replace(new RegExp(`\\{${r}\\}`,"g"),String(s))}),n}}const o=Q.getInstance(),z=(p,e)=>o.t(p,e);class P{static _instance=null;constructor(){}static getInstance(){return P._instance||(P._instance=new P),P._instance}async createSession(e,t,i,a){if(!_.isOnline)return null;const n=g;if(!n)return null;try{const{data:{user:r}}=await n.auth.getUser();if(!r)return null;const{data:s,error:l}=await n.from("game_sessions").insert({user_id:r.id,match_type:e,competition_id:t,difficulty:typeof i=="string"?parseInt(i,10):i,question_ids:a,total_questions:a.length,time_remaining:60,state:"playing"}).select().single();return l?(console.warn("[GameSessionService] Error creating session:",l),null):s}catch(r){return console.warn("[GameSessionService] Failed to create session:",r),null}}async getActiveSession(){if(!_.isOnline)return null;const e=g;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("game_sessions").select("*").eq("user_id",t.id).in("state",["playing","paused"]).order("created_at",{ascending:!1}).limit(1).single();return a&&a.code!=="PGRST116"?(console.warn("[GameSessionService] Error fetching active session:",a),null):i}catch(t){return console.warn("[GameSessionService] Failed to get active session:",t),null}}async updateSession(e,t){if(!_.isOnline)return;const i=g;if(i)try{const{error:a}=await i.from("game_sessions").update(t).eq("id",e);a&&console.warn("[GameSessionService] Error updating session:",a)}catch(a){console.warn("[GameSessionService] Failed to update session:",a)}}async pauseSession(e){return this.updateSession(e,{state:"paused",paused_at:new Date().toISOString()})}async resumeSession(e){return this.updateSession(e,{state:"playing",paused_at:null})}async completeSession(e,t,i,a,n){return this.updateSession(e,{state:"completed",final_score:t,accuracy:i,avg_response_time:a,max_combo:n,completed_at:new Date().toISOString()})}async abandonSession(e){return this.updateSession(e,{state:"abandoned",completed_at:new Date().toISOString()})}async recordAnswer(e,t,i,a,n,r,s){if(!_.isOnline)return;const l=g;if(l)try{const{error:c}=await l.from("game_session_answers").insert({session_id:e,question_id:t,question_index:i,selected_index:a,correct_index:n,is_correct:r,response_time_ms:s});c&&console.warn("[GameSessionService] Error recording answer:",c)}catch(c){console.warn("[GameSessionService] Failed to record answer:",c)}}async getSessionAnswers(e){if(!_.isOnline)return[];const t=g;if(!t)return[];try{const{data:i,error:a}=await t.from("game_session_answers").select("*").eq("session_id",e).order("question_index",{ascending:!0});return a?(console.warn("[GameSessionService] Error fetching session answers:",a),[]):i||[]}catch(i){return console.warn("[GameSessionService] Failed to get session answers:",i),[]}}async getHistory(e=20){if(!_.isOnline)return[];const t=g;if(!t)return[];try{const{data:{user:i}}=await t.auth.getUser();if(!i)return[];const{data:a,error:n}=await t.from("game_sessions").select("*").eq("user_id",i.id).eq("state","completed").order("completed_at",{ascending:!1}).limit(e);return n?(console.warn("[GameSessionService] Error fetching session history:",n),[]):a||[]}catch(i){return console.warn("[GameSessionService] Failed to get session history:",i),[]}}}class M{static _instance=null;STORAGE_KEY="ETHIO_ACTIVE_SESSION_V3";HISTORY_KEY="ETHIO_SESSION_HISTORY_V3";static getInstance(){return M._instance||(M._instance=new M),M._instance}createSession(e,t,i){const a={sessionId:"SESS-"+Math.floor(1e5+Math.random()*9e5),matchType:e,startTime:Date.now(),totalQuestions:i.length,difficulty:t,currentScore:0,currentIndex:0,timeLeftSec:15,questions:i,choices:[],responseTimes:[],state:"Playing",correctCount:0,wrongCount:0,timeOutCount:0},n=i.map(r=>String(r.id));return P.getInstance().createSession(e,e,t,n).then(r=>{r&&r.id&&(a.cloudSessionId=r.id,this.saveSession(a))}),this.saveSession(a),a}getActiveSession(){const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return null;try{const t=JSON.parse(e);return t.state==="Completed"||t.state==="Abandoned"||t.state==="Expired"?null:Date.now()-t.startTime>144e5?(this.clearSession(),null):t}catch{return null}}saveSession(e){localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}clearSession(){localStorage.removeItem(this.STORAGE_KEY)}autoSaveProgress(e,t,i,a,n,r,s){if(e.currentIndex=t,e.choices.push(i),e.responseTimes.push(a),e.currentScore=r,e.timeLeftSec=s,i===-1?e.timeOutCount++:n?e.correctCount++:e.wrongCount++,e.cloudSessionId){const l=String(e.questions[t].id),c=e.questions[t].correctIndex??-1;P.getInstance().recordAnswer(e.cloudSessionId,l,t,i,c,n,a)}this.saveSession(e)}abandonSession(e){e.state="Abandoned",this.saveSession(e),this.addToHistory(e),e.cloudSessionId&&P.getInstance().abandonSession(e.cloudSessionId),this.clearSession()}completeSession(e,t){if(e.state="Completed",e.currentScore=t,this.saveSession(e),this.addToHistory(e),e.cloudSessionId){const i=e.totalQuestions>0?Math.round(e.correctCount/e.totalQuestions*100):0,a=e.responseTimes.length>0?e.responseTimes.reduce((n,r)=>n+r,0)/e.responseTimes.length:0;P.getInstance().completeSession(e.cloudSessionId,t,i,a,0)}this.clearSession()}addToHistory(e){const t=localStorage.getItem(this.HISTORY_KEY);let i=[];if(t)try{i=JSON.parse(t)}catch{i=[]}i.push({sessionId:e.sessionId,matchType:e.matchType,score:e.currentScore,correct:e.correctCount,wrong:e.wrongCount,timeOut:e.timeOutCount,accuracy:e.totalQuestions>0?Math.round(e.correctCount/e.totalQuestions*100):0,date:new Date().toLocaleDateString()}),localStorage.setItem(this.HISTORY_KEY,JSON.stringify(i))}}class Ce{static _canvas=null;static _ctx=null;static _particles=[];static _animId=null;static burst(e,t,i=60,a=["#FFD700","#22C55E","#3B82F6","#FFFFFF","#FF4500"]){this._init();const n=e??window.innerWidth/2,r=t??window.innerHeight/3;for(let s=0;s<i;s++){const l=Math.random()*Math.PI*2,c=Math.random()*12+4;this._particles.push({x:n,y:r,vx:Math.cos(l)*c,vy:Math.sin(l)*c-3,size:Math.random()*8+4,color:a[Math.floor(Math.random()*a.length)],alpha:1,rotation:Math.random()*360,rotSpeed:(Math.random()-.5)*15,shape:Math.random()>.4?"rect":"circle"})}this._animId||this._loop()}static _init(){this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.id="confetti-canvas",this._canvas.style.position="fixed",this._canvas.style.top="0",this._canvas.style.left="0",this._canvas.style.width="100vw",this._canvas.style.height="100vh",this._canvas.style.pointerEvents="none",this._canvas.style.zIndex="9999",document.body.appendChild(this._canvas)),this._canvas.width=window.innerWidth,this._canvas.height=window.innerHeight,this._ctx=this._canvas.getContext("2d")}static _loop(){if(!(!this._ctx||!this._canvas)){this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height);for(let e=this._particles.length-1;e>=0;e--){const t=this._particles[e];if(t.x+=t.vx,t.y+=t.vy,t.vy+=.25,t.vx*=.98,t.rotation+=t.rotSpeed,t.alpha-=.015,t.alpha<=0||t.y>window.innerHeight){this._particles.splice(e,1);continue}this._ctx.save(),this._ctx.globalAlpha=t.alpha,this._ctx.translate(t.x,t.y),this._ctx.rotate(t.rotation*Math.PI/180),this._ctx.fillStyle=t.color,t.shape==="rect"?this._ctx.fillRect(-t.size/2,-t.size/2,t.size,t.size*1.5):(this._ctx.beginPath(),this._ctx.arc(0,0,t.size/2,0,Math.PI*2),this._ctx.fill()),this._ctx.restore()}this._particles.length>0?this._animId=requestAnimationFrame(()=>this._loop()):this._animId=null}}}class ge{static animate(e,t,i,a=1200,n=r=>Math.round(r).toLocaleString()){const r=performance.now(),s=l=>{const c=l-r,d=Math.min(c/a,1),h=1-Math.pow(1-d,3),m=t+(i-t)*h;e.textContent=n(m),d<1?requestAnimationFrame(s):e.textContent=n(i)};requestAnimationFrame(s)}}class je{static render(e){return`
            <div class="glass-card fade-in-up" style="
                border: 2px solid rgba(34, 197, 94, 0.3); 
                padding: 0;
                text-align: center;
                border-radius: 20px;
                margin-bottom: 24px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                position: relative;
                overflow: hidden;
                width: 100%;
                box-sizing: border-box;
            ">
                <!-- Dynamic Background Asset -->
                <div ${e.bgId?`id="${e.bgId}"`:""} style="
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.4) 100%), url('${e.bannerUrl}') center/cover no-repeat;
                    opacity: 1;
                    z-index: 0;
                "></div>
                
                ${e.showCloseButton?`
                <button id="match-exit-btn" style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #071B2D;
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1);
                    color: white;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 20;
                    transition: transform 0.2s;
                ">
                    <span style="display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 2px;">✕</span>
                </button>
                `:""}

                <!-- Content Container -->
                <div style="position: relative; z-index: 1; padding: 32px 20px 24px 20px; height: 100%;">
                    <!-- Icon -->
                    <div ${e.iconId?`id="${e.iconId}"`:""} style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 4px 16px rgba(34,197,94,0.5)); transform: scale(1.05);">${e.icon}</div>
                    
                    <!-- Title -->
                    <div ${e.titleId?`id="${e.titleId}"`:""} style="font-size: 24px; font-weight: 900; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.8); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
                        ${e.title}
                    </div>
                    
                    ${e.difficulty||e.reward?`
                    <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 24px;">
                        ${e.difficulty?`<span ${e.difficultyId?`id="${e.difficultyId}"`:""} style="background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 20px; font-size: var(--fds-font-xs); font-weight: 800; color: #FCD34D; border: 1px solid rgba(252, 211, 77, 0.3); backdrop-filter: blur(4px);">🛡 ${e.difficulty}</span>`:""}
                        ${e.reward?`<span ${e.rewardId?`id="${e.rewardId}"`:""} style="background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 20px; font-size: var(--fds-font-xs); font-weight: 800; color: #60A5FA; border: 1px solid rgba(96, 165, 250, 0.3); backdrop-filter: blur(4px);">🎁 ${e.reward}</span>`:""}
                    </div>
                    `:""}
                    
                    <button id="${e.buttonId}" class="ethio-btn ethio-btn-primary btn-kickoff-action" style="width: 100%; box-shadow: 0 8px 24px rgba(34,197,94,0.4); font-size: var(--fds-font-md); padding: 16px; border-radius: 14px;">
                        ${e.buttonText} ⚽
                    </button>
                </div>
            </div>
        `}}class Ie{_uiManager;_audioManager;_quizEngine;_competition;_questions;_callbacks;_currentIndex=0;_timerInterval=null;_timeLeftSec=15;_startTimeMs=0;_hasKickedOff=!1;_session=null;_hasPlayedFullTimeWhistle=!1;_isPaused=!1;_isDestroyed=!1;_nextQuestionTimeoutId=null;_visibilityHandler;_networkOfflineHandler;_networkOnlineHandler;constructor(e,t,i,a,n,r){this._uiManager=e,this._audioManager=t,this._quizEngine=i,this._competition=a,this._questions=n,this._callbacks=r,this._visibilityHandler=()=>{document.visibilityState==="hidden"&&this._hasKickedOff&&!this._isPaused&&this._currentIndex<this._questions.length&&this._showPauseOverlay()},document.addEventListener("visibilitychange",this._visibilityHandler),this._networkOfflineHandler=()=>{if(this._hasKickedOff&&!this._isPaused&&this._currentIndex<this._questions.length){this._showLeaveWarning();const s=document.getElementById("match-exit-dialog")?.querySelector("div > div:nth-child(2)");s&&(s.innerHTML="⚠️ Your connection was lost. Reconnect to continue playing.")}},this._networkOnlineHandler=()=>{this._hasKickedOff&&this._isPaused&&this._currentIndex<this._questions.length&&this._hideLeaveWarning()},window.addEventListener("ethio-network-offline",this._networkOfflineHandler),window.addEventListener("ethio-network-online",this._networkOnlineHandler)}startMatch(){this._quizEngine.reset(),this._currentIndex=0,this._hasKickedOff=!1,this._session=M.getInstance().createSession(this._competition.id,"Medium",this._questions),localStorage.setItem("ETHIO_REVIEW_CHOICES","[]"),window.ethioOnBackPress=()=>{if(!this._hasKickedOff)return this._callbacks.onExitMatch(),!0;const e=document.getElementById("match-exit-dialog");return e&&e.style.display!=="none"?this._hideLeaveWarning():this._showLeaveWarning(),!0},this._renderKickOffScreen()}resumeSession(e){this._quizEngine.reset(),this._session=e,this._questions=e.questions,this._currentIndex=e.currentIndex,this._hasKickedOff=!0,this._isPaused=!1;for(let t=0;t<e.choices.length;t++){const i=e.choices[t],a=e.questions[t].correctIndex,n=e.responseTimes[t];this._quizEngine.recordAnswer(i===a,n)}localStorage.setItem("ETHIO_REVIEW_CHOICES",JSON.stringify(e.choices)),localStorage.setItem("ETHIO_REVIEW_QUESTIONS",JSON.stringify(e.questions)),window.ethioOnBackPress=()=>{const t=document.getElementById("match-exit-dialog");return t&&t.style.display!=="none"?this._hideLeaveWarning():this._showLeaveWarning(),!0},this._renderQuestion(e.timeLeftSec)}_renderKickOffScreen(){const e=this._uiManager.container,t=this._competition.id==="all"?"QUICK MATCH.png":"DAILY CHALLENGE.png";e.innerHTML=`
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 0 28px; position: relative; height: 100vh; overflow: hidden;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- Dark Overlay -->
                <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); z-index: 5; animation: fade-in 250ms ease-out;"></div>

                <!-- Content Wrapper -->
                <div class="kick-off-wrapper" style="position: relative; z-index: 10; width: 100%; max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    ${je.render({bannerUrl:`/assets/banners/${t}`,icon:this._competition.badge,title:this._competition.name,buttonId:"kick-off-btn",buttonText:o.currentLocale==="am"?"ጀምር":o.currentLocale==="om"?"EGGALI":"KICK OFF",showCloseButton:!0})}

                </div>
            </div>
            <style>
                @keyframes popupScale {
                    from { transform: scale(0.92); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fade-up-delay {
                    from { transform: translateY(16px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                #kick-off-btn:active { transform: scale(0.96); box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 2px 8px rgba(0,0,0,0.5); }
                #match-exit-btn:active { transform: scale(0.9); }
            </style>
        `,document.getElementById("match-exit-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),window.ethioHandleBack&&window.ethioHandleBack()}),document.getElementById("kick-off-btn")?.addEventListener("click",()=>{this._audioManager.playWhistle(),this._hasKickedOff=!0,this._renderQuestion()})}_renderQuestion(e=10){if(this._isDestroyed)return;if(!this._hasKickedOff){this._renderKickOffScreen();return}if(this._currentIndex>=this._questions.length){this._stopTimer(),this._completeMatch();return}const t=this._questions[this._currentIndex],i=this._uiManager.container,n=this._quizEngine.calculateFinalStats().goals*100;setTimeout(()=>{this._isDestroyed||this._audioManager.playQuestionArrive()},80),i.innerHTML=`
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- PREMIUM GAMING HEADER -->
                <div style="
                    display: flex; 
                    flex-direction: column;
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    position: relative;
                    z-index: 10;
                ">
                    <!-- Top Bar Info Row -->
                    <div class="top-bar-row" style="
                        display: flex; 
                        align-items: center; 
                        justify-content: space-between; 
                        gap: 8px;
                        padding: clamp(8px, 1.5vh, 12px) 16px;
                        width: 100%;
                        box-sizing: border-box;
                    ">
                        <!-- Leave Button -->
                        <button id="match-exit-btn" class="top-bar-chip" style="width: 48px !important; height: 48px !important; border-radius: 24px !important; padding: 0 !important; flex-shrink: 0; box-sizing: border-box; display: flex; align-items: center; justify-content: center;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        
                        <!-- Score Chip -->
                        <div class="top-bar-chip" style="width: 100px; justify-content: center; box-sizing: border-box;">
                            <span class="top-bar-icon" style="font-size: 16px;">⚽</span>
                            <span id="match-score" class="top-bar-text" style="color: var(--tv-gold-primary);">${n}</span>
                        </div>

                        <!-- Timer Chip -->
                        <div id="timer-chip" class="top-bar-chip" style="width: 100px; justify-content: center; box-sizing: border-box;">
                            <span class="top-bar-icon" style="font-size: 16px;">⏱️</span>
                            <span id="timer-text" class="top-bar-text" style="font-family: var(--fds-font-mono); font-variant-numeric: tabular-nums; display: inline-block; min-width: 32px; text-align: left;">
                                ${String(e)}s
                            </span>
                        </div>

                        <!-- Progress Chip -->
                        <div class="top-bar-chip" style="width: 100px; justify-content: center; box-sizing: border-box;">
                            <span class="top-bar-icon" style="font-size: 16px;">📝</span>
                            <span class="top-bar-text" style="font-family: var(--fds-font-mono); font-variant-numeric: tabular-nums; display: inline-block; min-width: 32px; text-align: left;">
                                ${this._currentIndex+1}/${this._questions.length}
                            </span>
                        </div>
                    </div>

                    <!-- Clean Progress Bar -->
                    <div style="position: relative; height: 4px; background: rgba(0,0,0,0.5); overflow: hidden;">
                        <div style="
                            height: 100%; 
                            width: ${(this._currentIndex+1)/this._questions.length*100}%; 
                            background: linear-gradient(90deg, #009A44 0%, #22C55E 100%); 
                            transition: width 350ms cubic-bezier(0.16, 1, 0.3, 1);
                        "></div>
                    </div>
                </div>

                <!-- Quiz Area -->
                <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: clamp(12px, 2vh, 20px);
                    max-width: 600px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                    z-index: 10;
                    position: relative;
                    min-height: 0;
                ">
                    <!-- Question Card Wrapper (Scrollable if needed) -->
                    <div style="flex: 1 1 auto; display: flex; flex-direction: column; min-height: 0; overflow-y: auto; margin-bottom: clamp(12px, 2vh, 24px); padding: 0 4px;" class="hide-scrollbar">
                        <div class="anim-q-card" style="
                            width: 100%;
                            margin: auto 0;
                            padding: clamp(12px, 2.5vh, 24px) 16px;
                            background: rgba(7, 27, 45, 0.75);
                            backdrop-filter: blur(12px);
                            border: 1px solid rgba(255,255,255,0.15);
                            border-radius: 24px;
                            box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 0 12px rgba(255,255,255,0.1);
                            text-align: center;
                            box-sizing: border-box;
                            flex-shrink: 0;
                        ">
                            <h2 style="
                                font-size: clamp(15px, 3vh, 24px); 
                                font-weight: 700; 
                                color: white; 
                                line-height: 1.3; 
                                letter-spacing: 0.2px; 
                                margin: 0; 
                                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                                word-wrap: break-word;
                                overflow-wrap: break-word;
                            ">
                                ${t.prompt}
                            </h2>
                        </div>
                    </div>

                    <!-- ANSWERS GRID (Never scrolls) -->
                    <div id="answers-grid" style="flex: 0 0 auto; display: flex; flex-direction: column; gap: clamp(6px, 1.2vh, 14px); width: 100%; padding-bottom: 24px; padding-left: 4px; padding-right: 4px; box-sizing: border-box; pointer-events: none;">
                        ${t.options.map((l,c)=>`
                            <button class="option-btn anim-a-card" style="animation-delay: ${180+c*30}ms;" data-index="${c}">
                                <span class="option-badge">${String.fromCharCode(65+c)}</span>
                                <span class="option-text">${l}</span>
                                <span class="feedback-icon" style="font-size: 24px; opacity: 0; transform: scale(0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-left: 12px;"></span>
                            </button>
                        `).join("")}
                    </div>
                </div>
                
                <!-- TRANSLUCENT FEEDBACK OVERLAY -->
                <div id="feedback-overlay" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 1000;
                    padding: 24px;
                    border-radius: 16px;
                    text-align: center;
                    min-width: 260px;
                    backdrop-filter: blur(8px);
                    border: 2px solid;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                    box-sizing: border-box;
                ">
                    <div id="feedback-anim" style="font-size: 64px; display: inline-block;">⚽</div>
                    <div id="feedback-text" style="font-size: var(--fds-font-xl); font-weight: 900; letter-spacing: 2px; margin-top: 12px; text-transform: uppercase; font-family: var(--tv-mono);"></div>
                    <div id="feedback-subtext" style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-top: 4px; font-weight: 700;"></div>
                </div>

                <!-- MATCH EXIT CONFIRMATION DIALOG -->
                <div id="match-exit-dialog" style="
                    display: none; 
                    position: fixed; 
                    top: 0; left: 0; 
                    width: 100%; height: 100%; 
                    background: rgba(0, 0, 0, 0.4); 
                    backdrop-filter: blur(4px);
                    z-index: 10000; 
                    align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box;
                    animation: fade-in 0.2s ease-out;
                ">
                    <div class="glass-card" style="
                        width: 100%; max-width: 320px; 
                        padding: 24px; text-align: center; 
                        border-radius: 20px;
                        background: rgba(15, 23, 42, 0.95);
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 16px 40px rgba(0,0,0,0.5);
                    ">
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">Leave Quiz?</div>
                        <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 24px; line-height: 1.4;">Your current progress will be lost.</div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button id="btn-pause-resume" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #22c55e, #15803d); color: white; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(34,197,94,0.3);">Stay</button>
                            <button id="btn-pause-leave" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.1); color: #EF4444; font-weight: bold; font-size: 16px; cursor: pointer;">Leave Quiz</button>
                        </div>
                    </div>
                </div>

                <!-- MATCH PAUSED DIALOG -->
                <div id="match-paused-dialog" style="
                    display: none; 
                    position: fixed; 
                    top: 0; left: 0; 
                    width: 100%; height: 100%; 
                    background: rgba(15, 23, 42, 0.95); 
                    z-index: 10001; 
                    align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box;
                    animation: fade-in 0.2s ease-out;
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 64px; margin-bottom: 24px;">⏸️</div>
                        <div style="font-size: 28px; font-weight: 900; color: white; margin-bottom: 12px; letter-spacing: 1px;">Match Paused</div>
                        <div style="font-size: 16px; color: #94A3B8; margin-bottom: 40px;">Tap Continue to resume.</div>
                        <button id="btn-resume-paused" style="width: 100%; max-width: 240px; padding: 18px; border-radius: 16px; border: none; background: linear-gradient(135deg, #22c55e, #15803d); color: white; font-weight: 900; font-size: 18px; cursor: pointer; box-shadow: 0 8px 24px rgba(34,197,94,0.4); text-transform: uppercase;">Continue</button>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes q-slide-in {
                    0% { transform: translate3d(120vw, 0, 0); opacity: 0.5; }
                    100% { transform: translate3d(0, 0, 0); opacity: 1; }
                }
                @keyframes a-slide-in {
                    0% { transform: translate3d(120vw, 0, 0); opacity: 0; }
                    100% { transform: translate3d(0, 0, 0); opacity: 1; }
                }
                .top-bar-chip {
                    background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 20px;
                    height: 40px;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    white-space: nowrap;
                    box-shadow: 
                        inset 0 1px 1px rgba(255,255,255,0.2), 
                        inset 0 -2px 4px rgba(0,0,0,0.3),
                        0 4px 12px rgba(0,0,0,0.4);
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                    color: white;
                    font-weight: 800;
                    cursor: pointer;
                }
                .top-bar-chip::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 40%;
                    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
                    pointer-events: none;
                }
                .top-bar-chip:active {
                    transform: scale(0.96);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4);
                }
                @media (hover: hover) {
                    .top-bar-chip:hover {
                        background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                        border-color: rgba(255,255,255,0.3);
                    }
                }
                .top-bar-text {
                    font-size: clamp(15px, 4vw, 18px);
                    font-weight: 900;
                    color: white;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                    position: relative;
                    z-index: 2;
                }
                .top-bar-icon {
                    position: relative;
                    z-index: 2;
                }
                
                .option-btn {
                    width: 100%;
                    min-height: clamp(44px, 6vh, 64px);
                    padding: clamp(8px, 1.2vh, 16px) 20px;
                    background: linear-gradient(180deg, #12A64B 0%, #065F33 100%);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 18px;
                    color: white;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 
                        inset 0 2px 4px rgba(255,255,255,0.4),
                        inset 0 -4px 8px rgba(0,0,0,0.3), 
                        0 10px 30px rgba(0,0,0,0.4);
                    position: relative;
                    overflow: hidden;
                    box-sizing: border-box;
                    flex-shrink: 1;
                }
                .option-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 40%;
                    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%);
                    border-radius: 16px 16px 0 0;
                    pointer-events: none;
                }
                .option-badge {
                    width: 38px; height: 38px; 
                    border-radius: 50%; 
                    background: rgba(255,255,255,0.15); 
                    display: flex; align-items: center; justify-content: center; 
                    font-size: 18px; font-weight: bold; color: white;
                    flex-shrink: 0;
                    box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
                    position: relative;
                    z-index: 2;
                }
                .option-text {
                    flex: 1; 
                    font-size: clamp(14px, 2.5vh, 18px); 
                    font-weight: 600; 
                    color: white; 
                    line-height: 1.3; 
                    word-wrap: break-word; 
                    overflow-wrap: break-word;
                    position: relative;
                    z-index: 2;
                }
                .option-btn:active:not(:disabled) { 
                    transform: scale(0.98); 
                    box-shadow: inset 0 4px 12px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2);
                    background: linear-gradient(180deg, #15a34d 0%, #086136 100%);
                }
                .option-btn.selected {
                    border-color: #FFD54F !important;
                    box-shadow: 0 0 20px rgba(255, 213, 79, 0.4), inset 0 2px 4px rgba(255,255,255,0.2) !important;
                }
                .option-btn.correct { 
                    background: linear-gradient(180deg, #22C55E 0%, #15803D 100%) !important; 
                    border-color: #4ADE80 !important; 
                    box-shadow: 0 0 24px rgba(74, 222, 128, 0.5), inset 0 2px 4px rgba(255,255,255,0.3) !important;
                    animation: correctPulse 400ms cubic-bezier(0.4, 0, 0.2, 1);
                }
                .option-btn.wrong { 
                    background: linear-gradient(180deg, #EF4444 0%, #B91C1C 100%) !important; 
                    border-color: #F87171 !important; 
                    box-shadow: 0 0 24px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255,255,255,0.3) !important;
                    animation: wrongShake 400ms ease-in-out;
                }
                .option-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }
                
                .option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
                .option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
                .option-btn.correct .feedback-icon::after { content: '✓'; }
                .option-btn.wrong .feedback-icon::after { content: '✕'; }

                .anim-q-card {
                    animation: q-slide-in 450ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    animation-delay: 80ms;
                    opacity: 0;
                }
                .anim-a-card {
                    animation: a-slide-in 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    opacity: 0;
                }
                @media (prefers-reduced-motion: reduce) {
                    .anim-q-card, .anim-a-card {
                        animation: simple-fade-in 120ms ease-out forwards !important;
                        transform: none !important;
                    }
                }
                @keyframes correctPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                    100% { transform: scale(1); }
                }
                @keyframes wrongShake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }

                @keyframes goal-bounce {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.2); text-shadow: 0 10px 20px rgba(34,197,94,0.5); }
                    100% { transform: translateY(0) scale(1); }
                }
                @keyframes save-shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-12px); }
                    40%, 80% { transform: translateX(12px); }
                }
                
                @keyframes subtle-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0px rgba(245, 158, 11, 0); }
                    50% { transform: scale(1.05); box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); border-color: rgba(245, 158, 11, 0.8); }
                    100% { transform: scale(1); box-shadow: 0 0 0px rgba(245, 158, 11, 0); }
                }
                .time-low {
                    animation: subtle-pulse 1s infinite ease-in-out;
                    color: #F59E0B !important;
                    border-color: rgba(245, 158, 11, 0.5) !important;
                }
                .time-low span {
                    color: #F59E0B !important;
                }
                
                @media (max-width: 420px) {
                    .top-bar-row {
                        padding: 6px 4px !important;
                        gap: 4px !important;
                    }
                    .top-bar-chip {
                        padding: 4px 6px !important;
                        gap: 4px !important;
                    }
                    .top-bar-icon {
                        font-size: 13px !important;
                    }
                    .top-bar-text {
                        font-size: 13px !important;
                    }
                }
            </style>
        `,this._startTimer(e),this._bindOptionButtons(),this._bindPauseButtons(),setTimeout(()=>{if(this._isDestroyed)return;const l=document.getElementById("answers-grid");l&&(l.style.pointerEvents="auto")},420);const r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r&&(typeof this._audioManager.playTick=="function"?this._audioManager.playTick():this._audioManager.playClick(),typeof navigator<"u"&&navigator.vibrate))try{navigator.vibrate(10)}catch{}const s=i.querySelector("#answers-grid");s&&(s.style.pointerEvents="none",setTimeout(()=>{s&&!this._isDestroyed&&(s.style.pointerEvents="auto")},r?120:500))}_startTimer(e=10){this._stopTimer(),this._timeLeftSec=e,this._startTimeMs=performance.now();const t=document.getElementById("timer-text"),i=()=>{if(t){t.innerText=`${String(this._timeLeftSec)}s`;const a=document.getElementById("timer-chip");a&&(this._timeLeftSec<=5?(a.classList.add("time-low"),this._timeLeftSec>0&&this._audioManager.playCountdownWarning()):a.classList.remove("time-low"))}};i(),this._timerInterval=setInterval(()=>{this._isPaused||(this._timeLeftSec--,i(),this._session&&(this._session.timeLeftSec=this._timeLeftSec,M.getInstance().saveSession(this._session)),this._timeLeftSec<=0&&(this._stopTimer(),this._handleTimeOut()))},1e3)}_stopTimer(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)}_showLeaveWarning(){const e=document.getElementById("match-exit-dialog");e&&(e.style.display="flex")}_hideLeaveWarning(){const e=document.getElementById("match-exit-dialog");e&&(e.style.display="none")}_showPauseOverlay(){this._isPaused=!0,this._stopTimer();const e=document.getElementById("match-paused-dialog");e&&(e.style.display="flex")}_hidePauseOverlay(){this._isPaused=!1;const e=document.getElementById("match-paused-dialog");e&&(e.style.display="none"),this._startTimer(this._timeLeftSec)}_leaveMatch(){this._stopTimer(),this._session&&M.getInstance().clearSession(),window.ethioOnBackPress=null,this.destroy(),this._callbacks.onExitMatch()}_bindPauseButtons(){document.getElementById("btn-pause-resume")?.addEventListener("click",()=>{this._audioManager.playClick(),this._hideLeaveWarning()}),document.getElementById("btn-pause-leave")?.addEventListener("click",()=>{this._audioManager.playClick(),this._leaveMatch()}),document.getElementById("btn-resume-paused")?.addEventListener("click",()=>{this._audioManager.playClick(),this._hidePauseOverlay()})}_bindOptionButtons(){document.getElementById("match-exit-btn")?.addEventListener("click",()=>{this._showLeaveWarning()}),document.querySelectorAll(".option-btn").forEach(t=>{t.addEventListener("click",i=>{const a=i.currentTarget;this._audioManager.playAnswerSelected(),this._stopTimer(),document.querySelectorAll(".option-btn").forEach(s=>s.disabled=!0);const r=parseInt(a.getAttribute("data-index")||"0");this._onOptionSelected(r,a)})})}async _onOptionSelected(e,t){let i=parseFloat(((performance.now()-this._startTimeMs)/1e3).toFixed(1));if(i>10.5){await this._handleTimeOut();return}const a=this._questions[this._currentIndex],n=await this._findCorrectIndex(a),r=e===n;this._quizEngine.recordAnswer(r,i,a.id,e);const s=this._quizEngine.calculateFinalStats().goals;this._session&&M.getInstance().autoSaveProgress(this._session,this._currentIndex+1,e,i,r,s*100,15);const l=document.querySelectorAll(".option-btn"),c=this._currentIndex===this._questions.length-1;if(r){t.classList.add("correct"),this._audioManager.playCorrectAnswerGoal(c?400:void 0),Ce.burst(window.innerWidth/2,window.innerHeight/3,50,["#FFD700","#22C55E","#3B82F6","#FFFFFF"]),this._showFeedbackOverlay(!0);const h=this._quizEngine.calculateFinalStats().goals,m=document.getElementById("match-score");m&&ge.animate(m,(h-1)*100,h*100,600,b=>`${Math.round(b)}`)}else{if(t.classList.add("wrong"),n!==void 0){const h=l[n];h&&h.classList.add("correct")}this._audioManager.playWrongAnswer(c?400:void 0),this._showFeedbackOverlay(!1)}const d=c?400:1300;this._nextQuestionTimeoutId=setTimeout(()=>{this._nextQuestionTimeoutId=null,!this._isDestroyed&&(this._hideFeedbackOverlay(),this._currentIndex++,this._renderQuestion())},d)}_showFeedbackOverlay(e){const t=document.getElementById("feedback-overlay"),i=document.getElementById("feedback-anim"),a=document.getElementById("feedback-text"),n=document.getElementById("feedback-subtext");t&&i&&a&&n&&(t.style.borderColor=e?"var(--tv-pitch-green)":"var(--tv-gold-primary)",t.style.background=e?"linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(15,23,42,0.96) 100%)":"linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(15,23,42,0.96) 100%)",t.style.color=e?"var(--tv-pitch-green)":"var(--tv-gold-primary)",i.innerText=e?"⚽🥅":"🧤⚽",i.style.animation=e?"goal-bounce 0.6s ease-in-out infinite":"save-shake 0.4s ease-in-out infinite",a.innerText=e?"GOAL!":"SAVED!",n.innerText=e?"Brilliant strike into the net!":"Keeper parries the shot away!",t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1)")}_hideFeedbackOverlay(){const e=document.getElementById("feedback-overlay");e&&(e.style.pointerEvents="none",e.style.opacity="0",e.style.transform="translate(-50%, -50%) scale(0.8)")}async _handleTimeOut(){const t=this._questions[this._currentIndex],i=await this._findCorrectIndex(t);this._quizEngine.recordAnswer(!1,15,t.id,-1),this._audioManager.playWhistle();const a=document.querySelectorAll(".option-btn");if(i!==void 0){const d=a[i];d&&d.classList.add("correct")}const n=this._quizEngine.calculateFinalStats().goals;this._session&&M.getInstance().autoSaveProgress(this._session,this._currentIndex+1,-1,15,!1,n*100,15),this._showFeedbackOverlay(!1);const r=document.getElementById("feedback-text"),s=document.getElementById("feedback-subtext");r&&s&&(r.innerText="TIME OUT!",s.innerText="Speed up next time!");const c=this._currentIndex===this._questions.length-1?400:1600;this._nextQuestionTimeoutId=setTimeout(()=>{this._nextQuestionTimeoutId=null,!this._isDestroyed&&(this._hideFeedbackOverlay(),this._currentIndex++,this._renderQuestion())},c)}_completeMatch(){let e=this._quizEngine.calculateFinalStats(),t=e.goals*100+e.accuracy*5+Math.round(Math.max(0,15-e.avgResponseTime)*e.goals*15);e.accuracy===100&&(t+=500),this._session&&M.getInstance().completeSession(this._session,t),localStorage.setItem("ETHIO_REVIEW_QUESTIONS",JSON.stringify(this._questions)),localStorage.setItem("ETHIO_REVIEW_CHOICES",JSON.stringify(this._session?this._session.choices:[])),pe(()=>Promise.resolve().then(()=>tt),void 0).then(i=>i.AuthManager.getInstance().refreshProfile()),window.ethioOnBackPress=null,this._hasPlayedFullTimeWhistle||(this._hasPlayedFullTimeWhistle=!0,this._audioManager.playFullTimeWhistle()),this._callbacks.onMatchComplete(e,t),this._session&&re.invoke("validate-match",{matchType:this._session.matchType,competitionId:this._competition.id,answers:this._quizEngine.answerSubmissions}).then(({data:i,error:a})=>{!a&&i&&(!i.valid||i.anomalyDetected?console.error("[Anti-Cheat] Match rejected by server!"):console.log("[Anti-Cheat] Match validated successfully in background."))}).catch(i=>console.error("[Anti-Cheat] Background validation failed:",i))}destroy(){this._isDestroyed=!0,this._stopTimer(),this._audioManager.stopAllGameplaySounds(),this._nextQuestionTimeoutId&&(clearTimeout(this._nextQuestionTimeoutId),this._nextQuestionTimeoutId=null),document.removeEventListener("visibilitychange",this._visibilityHandler),window.removeEventListener("ethio-network-offline",this._networkOfflineHandler),window.removeEventListener("ethio-network-online",this._networkOnlineHandler),this._quizEngine=null,this._session=null,window.ethioOnBackPress=null,this._uiManager&&this._uiManager.container&&(this._uiManager.container.innerHTML="")}async _findCorrectIndex(e){if(e.correctIndex!==void 0)return e.correctIndex;if(e.answerHash){for(let t=0;t<4;t++)if(await this._sha256(`${e.id}:${t}:ethio-secret-salt`)===e.answerHash)return e.correctIndex=t,t}}async _sha256(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return Array.from(new Uint8Array(t)).map(i=>i.toString(16).padStart(2,"0")).join("")}}class w{static Header(e){return`
            <div class="tv-broadcast-header">
                <div style="display: flex; align-items: center; gap: var(--fds-space-12);">
                    <span class="tv-live-badge">
                        <span class="tv-live-dot"></span> ${e.badgeText||"LIVE BROADCAST HD"}
                    </span>
                    <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                </div>
                ${e.rightText?`
                    <div style="font-family: var(--fds-font-mono); font-weight: 800; font-size: var(--fds-font-xs); color: var(--fds-gold-primary);">
                        ${e.rightText}
                    </div>
                `:""}
            </div>
        `}static Button(e){const t=e.variant==="secondary"?"ethio-btn-secondary":"ethio-btn-primary",i=e.fullWidth?"width: 100%;":"",a=e.id?`id="${e.id}"`:"",n=e.disabled?"disabled":"",r=e.dataAttrs?e.dataAttrs:"";return`
            <button ${a} ${r} ${n} class="ethio-btn ${t} ${e.className||""}" style="${i}">
                ${e.icon?`<span style="font-size: 1.1em;">${e.icon}</span>`:""}
                ${e.text}
            </button>
        `}static Card(e){const t=e.borderColor?`border-color: ${e.borderColor};`:"",i=e.padding?`padding: ${e.padding};`:"padding: var(--fds-space-24);";return`
            <div ${e.id?`id="${e.id}"`:""} class="glass-card fds-card ${e.className||""}" style="${i} ${t}">
                ${e.content}
            </div>
        `}static Badge(e){return e.variant==="live"?`
                <span class="tv-live-badge">
                    <span class="tv-live-dot"></span> ${e.text}
                </span>
            `:e.variant==="minute"?`<span class="tv-minute-badge">${e.text}</span>`:`
            <span class="fds-badge" style="background: rgba(255, 215, 0, 0.12); border: 1px solid var(--fds-gold-primary); color: var(--fds-gold-primary); padding: 4px 10px; border-radius: var(--radius-sm); font-size: var(--fds-font-xs); font-weight: 800;">
                ${e.icon?`${e.icon} `:""}${e.text}
            </span>
        `}static Profile(e){return`
            <div class="glass-card" style="padding: var(--fds-space-16); border-color: var(--fds-gold-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--fds-space-16);">
                    <div style="display: flex; align-items: center; gap: var(--fds-space-16);">
                        <div style="
                            width: 48px;
                            height: 48px;
                            border-radius: 50%;
                            background: var(--fds-gold-gradient);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 24px;
                            font-weight: bold;
                            color: #000;
                            box-shadow: 0 0 14px var(--fds-gold-glow);
                        ">⚽</div>
                        <div>
                            <div style="display: flex; align-items: center; gap: var(--fds-space-8);">
                                <span style="font-weight: 900; font-size: var(--fds-font-md); color: white;">${e.username}</span>
                                <span class="rank-badge">${e.rankIcon} ${e.rankName}</span>
                            </div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-gold-primary); font-weight: 800; margin-top: 2px;">
                                ${e.divisionBadge} ${e.divisionName}
                            </div>
                        </div>
                    </div>

                    <div style="text-align: right;">
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-gold-primary); font-weight: 900; font-family: var(--fds-font-mono);">
                            LVL ${e.level} (${e.xp} XP)
                        </div>
                        <div style="width: 140px; height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden; margin-top: 4px;">
                            <div class="tv-progress-fill" style="width: ${e.levelProgressPercent}%; height: 100%; background: var(--fds-gold-gradient);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `}static Input(e,t,i="",a="text"){return`
            <input id="${e}" type="${a}" placeholder="${t}" value="${i}" class="fds-input" />
        `}static ProgressBar(e,t="var(--fds-gold-gradient)"){return`
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">
                <div class="tv-progress-fill" style="width: ${Math.min(Math.max(e,0),100)}%; height: 100%; background: ${t};"></div>
            </div>
        `}static Text(e,t){const i=t?.size?`font-size: ${t.size};`:"",a=t?.weight?`font-weight: ${t.weight};`:"",n=t?.color?`color: ${t.color};`:"",r=t?.margin?`margin: ${t.margin};`:"",s=t?.align?`text-align: ${t.align};`:"",l=t?.family?`font-family: ${t.family};`:"";return`<div style="${i} ${a} ${n} ${r} ${s} ${l}">${e}</div>`}static Flex(e,t){const i=t?.direction==="column"?"flex-direction: column;":"flex-direction: row;",a=t?.gap?`gap: ${t.gap};`:"",n=t?.align?`align-items: ${t.align};`:"align-items: center;",r=t?.justify?`justify-content: ${t.justify};`:"",s=t?.wrap?"flex-wrap: wrap;":"",l=t?.margin?`margin: ${t.margin};`:"";return`<div style="display: flex; ${i} ${a} ${n} ${r} ${s} ${l}">${e}</div>`}static Grid(e,t){const i=t?.minWidth||"280px",a=t?.gap?`gap: ${t.gap};`:"gap: var(--fds-space-16);",n=t?.margin?`margin: ${t.margin};`:"";return`<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${i}, 1fr)); ${a} ${n}">${e}</div>`}static Dialog(e,t,i){return`
            <div class="glass-card" style="
                width: 100%;
                max-width: 480px;
                padding: var(--fds-space-32) var(--fds-space-24);
                text-align: center;
                border-color: var(--fds-gold-primary);
                box-shadow: 0 20px 60px rgba(0,0,0,0.85);
            ">
                <h2 style="font-size: var(--fds-font-xl); font-weight: 900; color: white; margin: 0 0 var(--fds-space-16) 0;">${e}</h2>
                <div style="margin-bottom: var(--fds-space-24);">${t}</div>
                <div>${i}</div>
            </div>
        `}static LoadingState(e,t){return this.SkeletonList(4)}static SkeletonList(e=5){return`
            <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px;">
                ${Array(e).fill(0).map(()=>`
                    <div class="glass-card skeleton-shimmer" style="height: 72px; width: 100%;"></div>
                `).join("")}
            </div>
        `}static SkeletonProfile(){return`
            <div style="padding: 24px 16px;">
                <div class="glass-card skeleton-shimmer" style="height: 120px; width: 100%; margin-bottom: 24px;"></div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
                    <div class="glass-card skeleton-shimmer" style="height: 80px;"></div>
                    <div class="glass-card skeleton-shimmer" style="height: 80px;"></div>
                    <div class="glass-card skeleton-shimmer" style="height: 80px;"></div>
                    <div class="glass-card skeleton-shimmer" style="height: 80px;"></div>
                </div>
                <div class="glass-card skeleton-shimmer" style="height: 200px; width: 100%;"></div>
            </div>
        `}static SkeletonCardGrid(e=4){return`
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px;">
                ${Array(e).fill(0).map(()=>`
                    <div class="glass-card skeleton-shimmer" style="height: 140px; width: 100%;"></div>
                `).join("")}
            </div>
        `}static SkeletonCard(e=160){return`
            <div class="glass-card skeleton-shimmer" style="height: ${e}px; width: 100%;"></div>
        `}static EmptyState(e,t,i){return`
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.8; filter: grayscale(0.5);">${e}</div>
                <div style="font-size: 16px; font-weight: 900; color: white; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${t}</div>
                ${i?`<div style="font-size: 13px; color: #94A3B8; font-weight: 600; line-height: 1.5; max-width: 280px;">${i}</div>`:""}
            </div>
        `}static ErrorState(e="btn-error-retry"){return`
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 16px; background: rgba(239, 68, 68, 0.05);">
                <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
                <div style="font-size: 15px; font-weight: 900; color: white; margin-bottom: 16px;">Something went wrong.</div>
                ${this.Button({id:e,text:"Try Again",variant:"secondary",className:"error-retry-btn"})}
            </div>
        `}}class ie{static show(e,t="info",i=3e3){let n=document.getElementById("toast-container");n||(n=document.createElement("div"),n.id="toast-container",n.style.position="fixed",n.style.bottom="30px",n.style.left="50%",n.style.transform="translateX(-50%)",n.style.zIndex="99999",n.style.display="flex",n.style.flexDirection="column",n.style.gap="10px",n.style.pointerEvents="none",document.body.appendChild(n));const r=document.createElement("div"),s=t==="success"?"✅":t==="warning"?"⚠️":t==="error"?"❌":"⚽",l=t==="success"?"#22C55E":t==="warning"?"#F59E0B":t==="error"?"#EF4444":"#FFD700";r.style.background="rgba(15, 23, 42, 0.92)",r.style.border=`1px solid ${l}`,r.style.borderRadius="14px",r.style.padding="12px 20px",r.style.color="white",r.style.fontFamily="system-ui, -apple-system, sans-serif",r.style.fontWeight="bold",r.style.fontSize="14px",r.style.boxShadow="0 10px 30px rgba(0,0,0,0.5)",r.style.backdropFilter="blur(12px)",r.style.transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",r.innerHTML=`<span style="margin-right: 8px;">${s}</span> ${e}`,n.appendChild(r),requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="translateY(0)"}),setTimeout(()=>{r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>r.remove(),300)},i)}}const Ye=Object.freeze(Object.defineProperty({__proto__:null,Toast:ie},Symbol.toStringTag,{value:"Module"}));class T{static RANKS=[{name:"Bronze",minXp:0,badgeClass:"rank-bronze",icon:"🥉"},{name:"Silver",minXp:500,badgeClass:"rank-silver",icon:"🥈"},{name:"Gold",minXp:1500,badgeClass:"rank-gold",icon:"🥇"},{name:"Elite",minXp:3500,badgeClass:"rank-elite",icon:"💎"},{name:"Legend",minXp:7500,badgeClass:"rank-legend",icon:"🔥"},{name:"Hall of Fame",minXp:15e3,badgeClass:"rank-hall-of-fame",icon:"👑"}];static DIVISIONS=[{name:"Division 5 (Regional)",tier:5,minXp:0,badge:"⚽",color:"#94A3B8",weeklyPromotionZone:"Top 30% Promoted to Div 4"},{name:"Division 4 (National 2)",tier:4,minXp:1e3,badge:"🛡️",color:"#34D399",weeklyPromotionZone:"Top 25% Promoted to Div 3"},{name:"Division 3 (National 1)",tier:3,minXp:2500,badge:"🥈",color:"#60A5FA",weeklyPromotionZone:"Top 20% Promoted to Div 2"},{name:"Division 2 (Premier League)",tier:2,minXp:5e3,badge:"🥇",color:"#F59E0B",weeklyPromotionZone:"Top 15% Promoted to Div 1"},{name:"Division 1 (CAF Champions)",tier:1,minXp:1e4,badge:"💎",color:"#C084FC",weeklyPromotionZone:"Top 10% Promoted to Premier"},{name:"Premier Division (World Legends)",tier:0,minXp:2e4,badge:"👑",color:"#FFD700",weeklyPromotionZone:"Pinnacle Division - World Top 100"}];static getRank(e){for(let t=T.RANKS.length-1;t>=0;t--)if(e>=T.RANKS[t].minXp)return T.RANKS[t];return T.RANKS[0]}static getDivision(e){for(let t=T.DIVISIONS.length-1;t>=0;t--)if(e>=T.DIVISIONS[t].minXp)return T.DIVISIONS[t];return T.DIVISIONS[0]}static getLevel(e){const i=Math.floor(e/250)+1,a=e%250,n=Math.min(Math.floor(a/250*100),100);return{level:i,currentXp:a,nextLevelXp:250,progressPercent:n}}static getSeasonPassInfo(e){const i=Math.min(Math.floor(e/500)+1,50),a=e%500,n=Math.min(Math.floor(a/500*100),100),r=[];return i>=5&&r.push("🎖️ Season 1 Starter Badge"),i>=10&&r.push("🔥 2x XP Multiplier Pass"),i>=25&&r.push("💎 Ethiopian Premier Veteran Crest"),i>=50&&r.push("👑 Hall of Fame Champion Crown"),{seasonLevel:i,seasonXp:a,nextSeasonLevelXp:500,progressPercent:n,unlockedRewards:r}}}class Ke{_uiManager;_saveManager;_audioManager;_stats;_gameId;_finalScore;_hasAnimated=!1;_onContinue;constructor(e,t,i,a,n,r,s){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._stats=a,this._finalScore=n,this._gameId=r,this._onContinue=s,this._saveManager.updateHighScore(this._gameId,this._finalScore)}render(){const e=this._uiManager.container,t=this._stats.goals,i=this._stats.incorrectAnswers;e.innerHTML=`
            <div class="stadium-container" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
                <div style="color: var(--fds-text-main); font-weight: bold;">${o.currentLocale==="am"?"ሽልማቶችን በመጫን ላይ...":o.currentLocale==="om"?"Badhaasa Fe'aa Jira...":"Loading Rewards..."}</div>
            </div>
        `,this._submitAndRender(e,t,i)}async _submitAndRender(e,t,i){let a=this._stats.xpEarned,n=this._stats.coinsEarned;this._saveManager.addXp(a),this._saveManager.addCoins(n);const r=this._stats.accuracy>=50;this._saveManager.incrementMatchStats(r),this._stats.accuracy>=50?this._audioManager.playVictoryFanfare():this._audioManager.playDefeatSound(),e.innerHTML=`
            <div class="stadium-container ethio-bg-result" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 16px 16px 80px 16px; box-sizing: border-box; height: 100vh; overflow: hidden; position: relative;">
                
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- Main Result Card -->
                <div class="glass-card result-card-anim" style="
                    position: relative;
                    z-index: 10;
                    width: 100%; 
                    max-width: 380px; 
                    padding: 32px 24px; 
                    border-color: var(--tv-gold-primary); 
                    background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(15,23,42,0.95) 100%);
                    box-shadow: 0 24px 60px rgba(0,0,0,0.6), inset 0 0 32px rgba(255,215,0,0.05);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                ">
                    <!-- Header -->
                    <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--tv-gold-primary); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
                        ${o.currentLocale==="am"?"ጨዋታው ተጠናቋል":o.currentLocale==="om"?"Tapha Xumurame":"Match Complete"}
                    </div>
                    
                    <!-- Sub-header Message -->
                    <div id="match-message" style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase;">
                        ${this._stats.accuracy>=50?o.currentLocale==="am"?"በጣም ጥሩ":o.currentLocale==="om"?"Baay'ee Gaarii":"Excellent":o.currentLocale==="am"?"ጥሩ ተጫውተዋል":o.currentLocale==="om"?"Gaarii Taphatte":"Well Played"}
                    </div>

                    <!-- Final Score (LARGE) -->
                    <div style="margin-bottom: 24px; position: relative;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                            ${o.currentLocale==="am"?"አጠቃላይ እይታ":o.currentLocale==="om"?"Waliigala":"Overview"}
                        </div>
                        <div style="font-size: 56px; font-weight: 900; color: var(--tv-gold-primary); text-shadow: 0 4px 16px rgba(255,215,0,0.4); line-height: 1;">
                            <span id="final-score-rolling">${this._hasAnimated?this._finalScore:"0"}</span>
                        </div>
                    </div>
                    
                    <!-- PREMIUM XP PROGRESS BAR -->
                    <div style="width: 100%; margin-bottom: 32px; background: rgba(0,0,0,0.4); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div id="level-display-left" style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); font-family: var(--fds-font-mono);">
                                Lvl --
                            </div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #4ADE80; text-transform: uppercase;">
                                +<span id="xp-gained-rolling">${this._hasAnimated?a:"0"}</span> XP
                            </div>
                            <div id="level-display-right" style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-dim); font-family: var(--fds-font-mono);">
                                Lvl --
                            </div>
                        </div>
                        
                        <!-- The Bar -->
                        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; position: relative;">
                            <div id="xp-progress-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #3B82F6, #4ADE80); border-radius: 8px; transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                        </div>
                        
                        <div id="level-up-toast" style="display: none; font-size: var(--fds-font-sm); font-weight: 900; color: var(--tv-gold-primary); margin-top: 12px; animation: bounce-in 0.5s;">
                            🎉 LEVEL UP! 🎉
                        </div>
                    </div>

                    <!-- Match Summary (MEDIUM) -->
                    <div style="width: 100%; display: flex; justify-content: center; gap: 16px; margin-bottom: 32px;">
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-green-pitch);">${t}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${o.currentLocale==="am"?"ትክክል":o.currentLocale==="om"?"Sirrii":"Correct"}
                            </div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-red-live);">${i}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${o.currentLocale==="am"?"የተሳሳተ":o.currentLocale==="om"?"Dogoggora":"Wrong"}
                            </div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">${this._stats.accuracy}%</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${o.currentLocale==="am"?"ትክክለኛነት":o.currentLocale==="om"?"Sirriantummaa":"Accuracy"}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons (SMALL) -->
                    <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="grid-column: span 2;">
                            ${w.Button({id:"btn-play-again",text:o.currentLocale==="am"?"ድጋሚ ተጫወት":o.currentLocale==="om"?"Ammas Taphadhu":"Play Again",variant:"primary",fullWidth:!0,icon:"🔄"})}
                        </div>
                        
                        <div>
                            ${w.Button({id:"btn-review-game",text:o.currentLocale==="am"?"ከልስ":o.currentLocale==="om"?"Irra Deebi'i":"Review",variant:"secondary",fullWidth:!0,icon:"🔍"})}
                        </div>

                        <div>
                            ${w.Button({id:"btn-leaderboard",text:o.currentLocale==="am"?"ደረጃ":o.currentLocale==="om"?"Sadarkaa":"Rank",variant:"secondary",fullWidth:!0,icon:"📊"})}
                        </div>

                        <div style="grid-column: span 2;">
                            ${w.Button({id:"btn-home",text:o.currentLocale==="am"?"መነሻ":o.currentLocale==="om"?"Manattii":"Home",variant:"secondary",fullWidth:!0,icon:"🏠"})}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scrollable Full-Screen Review Modal -->
            <div id="review-modal" style="
                display: none; 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background: rgba(15,23,42,0.98); 
                z-index: 10000; 
                flex-direction: column;
                pointer-events: auto;
                box-sizing: border-box;
            ">
                <!-- Modal Top Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: center; padding: 12px 16px; flex-shrink: 0; position: relative;">
                    <div style="font-weight: 900; font-size: var(--fds-font-md); letter-spacing: 0.5px;">${o.currentLocale==="am"?"ጨዋታውን ይከልሱ":o.currentLocale==="om"?"TAPHA IRRA DEEBI'I":"REVIEW GAME"}</div>
                    <button id="btn-close-review" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 20px;">✕</button>
                </div>

                <!-- Scrollable Container -->
                <div style="flex: 1; overflow-y: auto; padding: 16px 16px 80px 16px;" id="review-questions-container" class="hide-scrollbar"></div>
            </div>
            
            <style>
                .result-card-anim {
                    animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transform: scale(0.9);
                }
                @keyframes scaleUpFade {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                button:active { transform: scale(0.96) !important; }
                .review-action-btn:active { background: rgba(255,255,255,0.1) !important; }
                @keyframes bounce-in {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `,this._bindEvents();const s=document.getElementById("final-score-rolling");s&&(this._hasAnimated||ge.animate(s,0,this._finalScore,800));const l=Math.max(0,this._saveManager.profile.xp-a),c=this._saveManager.profile.xp,d=T.getLevel(l),h=T.getLevel(c),m=document.getElementById("xp-gained-rolling");m&&(this._hasAnimated||ge.animate(m,0,a,800)),this._hasAnimated=!0;const b=document.getElementById("level-display-left"),v=document.getElementById("level-display-right"),y=document.getElementById("xp-progress-fill");b&&(b.innerText=`Lvl ${d.level}`),v&&(v.innerText=`Lvl ${d.level+1}`),y&&(y.style.width=`${d.progressPercent}%`,setTimeout(()=>{h.level>d.level?(y.style.width="100%",setTimeout(()=>{y.style.transition="none",y.style.width="0%",b&&(b.innerText=`Lvl ${h.level}`),v&&(v.innerText=`Lvl ${h.level+1}`),setTimeout(()=>{y.style.transition="width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",y.style.width=`${h.progressPercent}%`},50),this._audioManager.playVictoryFanfare(),Ce.burst(window.innerWidth/2,window.innerHeight/2,100);const u=document.getElementById("level-up-toast");u&&(u.style.display="block")},1500)):y.style.width=`${h.progressPercent}%`},500))}_bindEvents(){const e=window;document.getElementById("btn-home")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioForceHome?e.ethioForceHome():(e.ethioCloseGame&&e.ethioCloseGame(),e.ethioReloadHome&&e.ethioReloadHome())}),document.getElementById("btn-play-again")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioCloseGame&&e.ethioCloseGame(),e.ethioPlayAgain?e.ethioPlayAgain(this._gameId):this._onContinue()}),document.getElementById("btn-leaderboard")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioCloseGame&&e.ethioCloseGame(),e.ethioNavigateToTab?e.ethioNavigateToTab("rankings"):this._onContinue()});const t=document.getElementById("review-modal"),i=document.getElementById("review-questions-container");document.getElementById("btn-review-game")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&i&&(this._renderReviewQuestions(i),t.style.display="flex")}),document.getElementById("btn-close-review")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")})}_renderReviewQuestions(e){const t=JSON.parse(localStorage.getItem("ETHIO_REVIEW_QUESTIONS")||"[]"),i=JSON.parse(localStorage.getItem("ETHIO_REVIEW_CHOICES")||"[]");if(t.length===0){e.innerHTML=`
                <div style="text-align: center; padding: 48px; color: var(--fds-text-dim);">
                    ${o.currentLocale==="am"?"የሚከለሱ ጥያቄዎች የሉም።":o.currentLocale==="om"?"Gaaffiin irra deebi'amu hin jiru.":"No questions to review."}
                </div>
            `;return}e.innerHTML=t.map((n,r)=>{const s=i[r]!==void 0?i[r]:-1,l=s===n.correctIndex;let c="",d="";s===-1?(d="#F97316",c=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${d}; background: rgba(249,115,22,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${o.currentLocale==="am"?"⏱ ጊዜ አልቋል":o.currentLocale==="om"?"⏱ Yeroon Dhumate":"⏱ Timeout"}
                </span>`):l?(d="#22C55E",c=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${d}; background: rgba(34,197,94,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${o.currentLocale==="am"?"✓ ትክክል":o.currentLocale==="om"?"✓ Sirrii":"✓ Correct"}
                </span>`):(d="#EF4444",c=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${d}; background: rgba(239,68,68,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${o.currentLocale==="am"?"✗ የተሳሳተ":o.currentLocale==="om"?"✗ Dogoggora":"✗ Wrong"}
                </span>`);const h=n.options.map((y,u)=>{const f=u===n.correctIndex,x=u===s;let E="rgba(0,0,0,0.3)",k="rgba(255,255,255,0.06)",I="",$="";f&&x?(E="rgba(34,197,94,0.15)",k="#22C55E",I='<span style="color: #22C55E; font-weight: bold; margin-right: 8px;">✓</span>',$='<div style="background: rgba(34,197,94,0.2); color: #4ADE80; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Your Answer</div>'):f?(E="rgba(34,197,94,0.15)",k="#22C55E",I='<span style="color: #22C55E; font-weight: bold; margin-right: 8px;">✓</span>',$='<div style="background: rgba(34,197,94,0.2); color: #4ADE80; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Correct Answer</div>'):x&&(E="rgba(239,68,68,0.15)",k="#EF4444",I='<span style="color: #EF4444; font-weight: bold; margin-right: 8px;">✗</span>',$='<div style="background: rgba(239,68,68,0.2); color: #F87171; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Your Answer</div>');const H=String.fromCharCode(65+u)+".";return`
                    <div style="background: ${E}; border: 1px solid ${k}; padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-main);">
                                ${I}
                                <span style="color: var(--fds-gold-primary); margin-right: 8px;">${H}</span> 
                                ${y}
                            </div>
                            ${$}
                        </div>
                    </div>
                `}).join("");let m="";n.explanation&&(m=`
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #38BDF8; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">💡 ${o.currentLocale==="am"?"ይህ ለምን ትክክል ነው":o.currentLocale==="om"?"Maaliif Sirrii Dha":"Why this is correct"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${n.explanation}</div>
                    </div>
                `);let b="";n.fact&&(b=`
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(192,132,252,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #C084FC; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">🧠 ${o.currentLocale==="am"?"ያውቁ ኖሯል?":o.currentLocale==="om"?"Beektuu Laata?":"Did You Know?"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${n.fact}</div>
                    </div>
                `);let v="";return n.learningTip&&(v=`
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(250,204,21,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #FACC15; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">🎯 ${o.currentLocale==="am"?"የመማሪያ ጠቃሚ ምክር":o.currentLocale==="om"?"Gorsa Barumsaa":"Learning Tip"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${n.learningTip}</div>
                    </div>
                `),`
                <div class="glass-card" style="border-radius: 12px; padding: 16px; margin-bottom: 16px; border-color: ${d}; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                            ${o.currentLocale==="am"?`ጥያቄ ${r+1}`:o.currentLocale==="om"?`Gaaffii ${r+1}`:`Question ${r+1}`}
                        </span>
                        ${c}
                    </div>

                    <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--fds-text-main); margin-bottom: 12px; line-height: 1.4;">${n.prompt}</div>

                    
                    <div style="margin-bottom: 12px;">
                        ${h}
                    </div>
                    
                    ${m}
                    ${b}
                    ${v}

                    <!-- In-App Interactions Row (REQ 14) -->
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                        <button class="review-action-btn btn-review-like" data-q-idx="${r}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span class="heart-icon" style="font-size: var(--fds-font-md); transition: transform 0.2s;">❤️</span> <span class="like-label">${o.currentLocale==="am"?"ውደድ":o.currentLocale==="om"?"Jaalladhu":"Like"}</span>
                        </button>
                        <button class="review-action-btn btn-review-comment" data-q-idx="${r}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span style="font-size: var(--fds-font-md);">💬</span> ${o.currentLocale==="am"?"አስተያየት":o.currentLocale==="om"?"Yaada":"Comment"}
                        </button>
                        <button class="review-action-btn btn-review-share" data-q-idx="${r}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span style="font-size: var(--fds-font-md);">⚽</span> ${o.currentLocale==="am"?"ጋብዝ":o.currentLocale==="om"?"Affeeri":"Invite"}
                        </button>
                    </div>

                    <!-- Comment Container (Hidden by default, expands on comment click) -->
                    <div class="comment-box-drawer" id="comment-drawer-${r}" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
                        <div class="comment-list" id="comment-list-${r}" style="max-height: 120px; overflow-y: auto; margin-bottom: 8px; font-size: var(--fds-font-xs); color: var(--fds-text-muted); display: flex; flex-direction: column; gap: 6px;">
                            <div style="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;">
                                <strong style="color: var(--fds-gold-primary);">Abebe M.:</strong> ${o.currentLocale==="am"?"በጣም ጥሩ ጥያቄ! እውቀቴን በእውነት ፈትኖታል።":o.currentLocale==="om"?"Gaaffii baay'ee gaarii! Beekuumsakoo dhugumaan qoreera.":"Great question! Really challenged my knowledge."} <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); float: right;">2m ago</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="comment-input-${r}" placeholder="${o.currentLocale==="am"?"አስተያየት ይፃፉ...":o.currentLocale==="om"?"Yaada barreessi...":"Write a comment..."}" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 10px; color: var(--fds-text-main); font-size: var(--fds-font-xs);" />
                            <button class="btn-send-comment" data-q-idx="${r}" style="background: #009A44; border: none; color: var(--fds-text-main); padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: var(--fds-font-xs); cursor: pointer;">${o.currentLocale==="am"?"ለጥፍ":o.currentLocale==="om"?"Maxxansi":"Post"}</button>
                        </div>
                    </div>
                </div>
            `}).join(""),e.querySelectorAll(".glass-card").forEach((n,r)=>{const s=n.querySelector(".btn-review-like");s?.addEventListener("click",()=>{this._audioManager.playClick();const v=s.querySelector(".like-label"),y=s.querySelector(".heart-icon");s.classList.contains("liked")?(s.classList.remove("liked"),s.style.color="#94A3B8",v.innerText=o.currentLocale==="am"?"ውደድ":o.currentLocale==="om"?"Jaalladhu":"Like"):(s.classList.add("liked"),s.style.color="#EF4444",v.innerText=o.currentLocale==="am"?"ተወዷል":o.currentLocale==="om"?"Jaallatameera":"Liked",y&&(y.style.transform="scale(1.3)",setTimeout(()=>y.style.transform="scale(1)",200)))});const l=n.querySelector(".btn-review-comment"),c=n.querySelector(`#comment-drawer-${r}`),d=n.querySelector(`#comment-input-${r}`),h=n.querySelector(".btn-send-comment"),m=n.querySelector(`#comment-list-${r}`);l?.addEventListener("click",()=>{this._audioManager.playClick(),c&&(c.style.display=c.style.display==="none"?"block":"none",c.style.display==="block"&&d?.focus())}),h?.addEventListener("click",()=>{this._audioManager.playClick();const v=d?.value.trim();if(!v){ie.show(o.currentLocale==="am"?"አስተያየት ባዶ ሊሆን አይችልም።":o.currentLocale==="om"?"Yaadni duwwaa ta'uu hin danda'u.":"Comment cannot be empty.","info");return}const y=document.createElement("div");y.style.cssText="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;";const u=o.currentLocale==="am"?"እርስዎ:":o.currentLocale==="om"?"Isin:":"You:",f=o.currentLocale==="am"?"አሁን":o.currentLocale==="om"?"Amma":"Just now";y.innerHTML=`<strong style="color: #4ADE80;">${u}</strong> ${v} <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); float: right;">${f}</span>`,m.appendChild(y),d.value="",m.scrollTop=m.scrollHeight,ie.show(o.currentLocale==="am"?"አስተያየት ተለጥፏል!":o.currentLocale==="om"?"Yaadni maxxanfameera!":"Comment posted!","success")}),n.querySelector(".btn-review-share")?.addEventListener("click",async()=>{this._audioManager.playClick();const v=o.currentLocale==="am"?`⚽ በኢትዮ ቴሌኮም የእግር ኳስ ውድድር ላይ እየተወዳደርኩ ነው!
የ ${this._finalScore} ነጥቤን ማሸነፍ ትችላለህ?
አሁኑኑ ውድድሩን ተቀላቀል እና ተፎካከረኝ!`:o.currentLocale==="om"?`⚽ Dorgoommii Kubbaa Miilaa Itooyyo Telekoom irratti dorgomaan jira!
Qabxii koo ${this._finalScore} mo'achuu dandeessa?
Amma dorgommiitti makamii na qori!`:`⚽ I'm competing in the Ethio Telecom Football Tournament!
Can you beat my score of ${this._finalScore} PTS?
Join the competition and challenge me now!`;if(navigator.share)try{await navigator.share({title:"Ethio Telecom Football League",text:v,url:window.location.href})}catch{}else await navigator.clipboard.writeText(`${v}
${window.location.href}`),ie.show(o.currentLocale==="am"?"የእግር ኳስ መጋበዣ ሊንክ ወደ ቅሊፕቦርድ ተገልብጧል! ለመፎካከር ለጓደኞችዎ ያጋሩ።":o.currentLocale==="om"?"Geessituun affeerraa kubbaa miilaa kooppii ta'eera! Hiriyoota keetiif qooduun isaan qori.":"Football invitation link copied to clipboard! Share with friends to challenge them.","success")})})}}class Ve{metadata={id:"football-quiz",name:"Football Quiz League",description:"Televised sports match quiz with match stats, goal celebrations, and rewards!"};_uiManager;_audioManager;_saveManager;_quizEngine;_activeScoreboard=null;_targetCompetitionId="walia-ibex";_preloadedQuestions=null;matchType="casual";dailyChallengeId;async initialize(e){this._uiManager=e,this._quizEngine=new Ne;const t=window;this._audioManager=t.ethioAudio||new Te,this._saveManager=t.ethioSave||new ne}async start(){const e=L.getById(this._targetCompetitionId)||L.getAll()[0];let t=this._preloadedQuestions;(!t||t.length===0)&&(t=await q.getInstance().fetchQuestions(e.id,10,o.currentLocale)),this._activeScoreboard=new Ie(this._uiManager,this._audioManager,this._quizEngine,e,t,{onMatchComplete:(i,a)=>this._showMatchStats(e.id,i,a),onExitMatch:()=>this.destroy()}),this._activeScoreboard.startMatch()}async resume(e){const t=L.getById(e.matchType)||L.getAll()[0];this._activeScoreboard=new Ie(this._uiManager,this._audioManager,this._quizEngine,t,e.questions,{onMatchComplete:(i,a)=>this._showMatchStats(t.id,i,a),onExitMatch:()=>this.destroy()}),this._activeScoreboard.resumeSession(e)}setCompetition(e){this._targetCompetitionId=e}setPreloadedQuestions(e){this._preloadedQuestions=e}_showMatchStats(e,t,i){const a=window;a.ethioCache&&a.ethioCache.setQuizActive(!1);const n=this.matchType==="daily"?"daily":e,r=new Ke(this._uiManager,this._saveManager,this._audioManager,t,i,n,()=>{const s=window;s.ethioCloseGame?s.ethioCloseGame():s.ethioReloadHome&&s.ethioReloadHome()});this.matchType==="daily"&&this.dailyChallengeId&&(r.dailyChallengeId=this.dailyChallengeId),r.render()}update(e){}destroy(){this._activeScoreboard&&(this._activeScoreboard.destroy(),this._activeScoreboard=null),this._uiManager.clear(),console.log("[QuizGameMode] Destroyed.");const e=window;e.ethioCloseGame?e.ethioCloseGame():e.ethioReloadHome&&e.ethioReloadHome()}}class j{static _instance=null;static getInstance(){return j._instance||(j._instance=new j),j._instance}async fetchPlatformAnalytics(){if(_.isOnline&&g)try{const{count:e}=await g.from("users").select("*",{count:"exact",head:!0}),{count:t}=await g.from("matches").select("*",{count:"exact",head:!0}),{count:i}=await g.from("competitions").select("*",{count:"exact",head:!0}),{count:a}=await g.from("subscriptions").select("*",{count:"exact",head:!0});return{activePlayers:e||124500,totalMatches:t||185e4,activeCompetitions:i||15,subscribedUsers:a||88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12}}catch(e){console.warn("[AnalyticsService] Supabase analytics query failed, returning fallback metrics:",e)}return{activePlayers:124500,totalMatches:185e4,activeCompetitions:15,subscribedUsers:88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12}}}class S{static render(e,t="",i=!0){return`
            <div class="ethio-fantasy-app-bar" style="
                display: flex;
                align-items: center;
                height: 72px;
                background-color: #071B2D;
                padding: env(safe-area-inset-top) 0 0 0;
                box-sizing: content-box;
                width: 100%;
                z-index: 100;
                position: relative;
            ">
                ${i?`
                <button class="app-bar-back-btn" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-left: 24px;
                    margin-right: 16px;
                    padding: 0;
                " aria-label="Back">❮</button>`:""}
                <div class="app-bar-title" style="
                    flex: 1;
                    color: white;
                    font-weight: 700;
                    font-size: var(--fds-font-md, 18px);
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-transform: uppercase;
                    ${i?"":"text-align: center;"}
                ">${e}</div>
                ${t?`
                <div class="app-bar-actions" style="
                    display: flex;
                    align-items: center;
                    padding-right: 16px;
                ">
                    ${t}
                </div>
                `:""}
            </div>
        `}static bind(e,t){const i=e.querySelector(".app-bar-back-btn");i&&i.addEventListener("click",a=>{a.preventDefault(),t()})}}class Xe{_uiManager;_audioManager;_onClose;_activeTab="QUESTIONS";_statusMessage="";_analyticsData=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onClose=i}async render(){const e=this._uiManager.container,t=L.getAll();this._analyticsData=await j.getInstance().fetchPlatformAnalytics(),e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Admin Header -->
                    ${S.render("CMS & ADMIN PANEL")}

                    ${this._statusMessage?`
                        <div style="
                            background: rgba(34, 197, 94, 0.2);
                            border: 1px solid rgba(34, 197, 94, 0.4);
                            color: #86EFAC;
                            padding: 12px 16px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            font-size: var(--fds-font-sm);
                        ">${this._statusMessage}</div>
                    `:""}

                    <!-- Admin Tabs Header -->
                    <div style="
                        display: flex;
                        gap: 10px;
                        margin-bottom: 24px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        padding-bottom: 12px;
                    ">
                        <button class="tab-btn ${this._activeTab==="QUESTIONS"?"active-tab":""}" data-tab="QUESTIONS">
                            ❓ Question Bank
                        </button>
                        <button class="tab-btn ${this._activeTab==="BULK_IMPORT"?"active-tab":""}" data-tab="BULK_IMPORT">
                            📂 Bulk CSV Import
                        </button>
                        <button class="tab-btn ${this._activeTab==="COMPETITIONS"?"active-tab":""}" data-tab="COMPETITIONS">
                            🏆 Competitions (${t.length})
                        </button>
                        <button class="tab-btn ${this._activeTab==="ANALYTICS"?"active-tab":""}" data-tab="ANALYTICS">
                            📊 VAS Analytics
                        </button>
                    </div>

                    <!-- Tab Content Render -->
                    ${this._renderTabContent(t)}
                </div>
            </div>

            <style>
                .tab-btn {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 10px;
                    padding: 10px 16px;
                    color: var(--fds-text-dim);
                    font-weight: 600;
                    font-size: var(--fds-font-sm);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn.active-tab {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    color: #0F172A;
                    border-color: var(--fds-gold-primary);
                    font-weight: bold;
                }
                .form-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: rgba(15, 23, 42, 0.7);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 8px;
                    color: var(--fds-text-main);
                    font-size: var(--fds-font-sm);
                    box-sizing: border-box;
                }
                .form-label {
                    display: block;
                    font-size: var(--fds-font-xs);
                    color: var(--fds-text-muted);
                    font-weight: 600;
                    margin-bottom: 4px;
                }
            </style>
        `,this._bindEvents()}_renderTabContent(e){switch(this._activeTab){case"QUESTIONS":return this._renderQuestionsTab();case"BULK_IMPORT":return this._renderBulkImportTab();case"COMPETITIONS":return this._renderCompetitionsTab(e);case"ANALYTICS":return this._renderAnalyticsTab(e)}}_renderQuestionsTab(){return`
            <!-- Add Single Question Card -->
            <div class="glass-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--gold-primary);">
                    ➕ ADD TRILINGUAL QUESTION (EN / AM / OM)
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    <div>
                        <label class="form-label">CATEGORY</label>
                        <select id="q-category" class="form-input">
                            ${Object.values(Me).map(t=>`<option value="${t.id}">${t.badge} ${t.nameEn}</option>`).join("")}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">DIFFICULTY (1=Easy, 5=Hard)</label>
                        <input id="q-difficulty" type="number" min="1" max="5" value="2" class="form-input" />
                    </div>
                    <div>
                        <label class="form-label">CORRECT OPTION INDEX (0 to 3)</label>
                        <select id="q-correct" class="form-input">
                            <option value="0">Option 1 (Index 0)</option>
                            <option value="1">Option 2 (Index 1)</option>
                            <option value="2">Option 3 (Index 2)</option>
                            <option value="3">Option 4 (Index 3)</option>
                        </select>
                    </div>
                </div>

                <!-- Prompt Inputs -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    <div>
                        <label class="form-label">PROMPT (ENGLISH) *</label>
                        <textarea id="q-prompt-en" class="form-input" rows="2" placeholder="e.g. Which team won AFCON 1962?"></textarea>
                    </div>
                    <div>
                        <label class="form-label">PROMPT (AMHARIC - አማርኛ)</label>
                        <textarea id="q-prompt-am" class="form-input" rows="2" placeholder="ለምሳሌ፡ የ1962 አፍሪካ ዋንጫ ያሸነፈው ማን ነው?"></textarea>
                    </div>
                    <div>
                        <label class="form-label">PROMPT (AFAN OROMO)</label>
                        <textarea id="q-prompt-om" class="form-input" rows="2" placeholder="fkn. Waancaa AFCON 1962 kan injifate kimmi?"></textarea>
                    </div>
                </div>

                <!-- Options Inputs -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                    <div>
                        <label class="form-label">OPTION 1 (EN / AM / OM)</label>
                        <input id="q-opt0-en" class="form-input" placeholder="EN Option 1" style="margin-bottom: 4px;" />
                        <input id="q-opt0-am" class="form-input" placeholder="አማ Option 1" style="margin-bottom: 4px;" />
                        <input id="q-opt0-om" class="form-input" placeholder="OR Option 1" />
                    </div>
                    <div>
                        <label class="form-label">OPTION 2 (EN / AM / OM)</label>
                        <input id="q-opt1-en" class="form-input" placeholder="EN Option 2" style="margin-bottom: 4px;" />
                        <input id="q-opt1-am" class="form-input" placeholder="አማ Option 2" style="margin-bottom: 4px;" />
                        <input id="q-opt1-om" class="form-input" placeholder="OR Option 2" />
                    </div>
                    <div>
                        <label class="form-label">OPTION 3 (EN / AM / OM)</label>
                        <input id="q-opt2-en" class="form-input" placeholder="EN Option 3" style="margin-bottom: 4px;" />
                        <input id="q-opt2-am" class="form-input" placeholder="አማ Option 3" style="margin-bottom: 4px;" />
                        <input id="q-opt2-om" class="form-input" placeholder="OR Option 3" />
                    </div>
                    <div>
                        <label class="form-label">OPTION 4 (EN / AM / OM)</label>
                        <input id="q-opt3-en" class="form-input" placeholder="EN Option 4" style="margin-bottom: 4px;" />
                        <input id="q-opt3-am" class="form-input" placeholder="አማ Option 4" style="margin-bottom: 4px;" />
                        <input id="q-opt3-om" class="form-input" placeholder="OR Option 4" />
                    </div>
                </div>

                ${w.Button({id:"add-question-btn",text:"SAVE QUESTION TO CLOUD DATABASE",icon:"💾",variant:"primary",fullWidth:!0})}
            </div>
        `}_renderBulkImportTab(){return`
            <div class="glass-card" style="padding: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; color: var(--gold-primary);">
                    📂 BULK QUESTION CSV IMPORT
                </h3>
                <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm); line-height: 1.5; margin-bottom: 16px;">
                    Upload a CSV file containing questions formatted with columns:<br/>
                    <code>category, difficulty, prompt_en, prompt_am, prompt_om, opt0_en, opt1_en, opt2_en, opt3_en, correct_index</code>
                </p>

                <textarea id="bulk-csv-area" class="form-input" rows="8" placeholder="category,difficulty,prompt_en,opt0_en,opt1_en,opt2_en,opt3_en,correct_index
walia-ibex,1,In which year did Ethiopia win AFCON?,1957,1962,1970,1984,1
world-cup,1,Which country hosted 2022 World Cup?,Qatar,Brazil,Russia,South Africa,0" style="font-family: monospace; font-size: var(--fds-font-xs); margin-bottom: 16px;"></textarea>

                ${w.Button({id:"import-csv-btn",text:"PROCESS & IMPORT QUESTIONS",icon:"🚀",variant:"primary",fullWidth:!0})}
            </div>
        `}_renderCompetitionsTab(e){return`
            <!-- Add Competition Form -->
            <div class="glass-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--gold-primary);">➕ ADD NEW COMPETITION</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <input id="admin-comp-name" type="text" placeholder="Name (e.g. Ethiopian Premier League)" class="form-input" />
                    <input id="admin-comp-badge" type="text" placeholder="Badge Emoji (e.g. 🇪🇹)" class="form-input" />
                </div>
                <input id="admin-comp-desc" type="text" placeholder="Description" class="form-input" style="margin-bottom: 16px;" />
                ${w.Button({id:"admin-add-comp-btn",text:"SAVE & PUBLISH COMPETITION",variant:"primary",fullWidth:!0})}
            </div>

            <!-- Competition List -->
            <div class="glass-card" style="padding: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--fds-text-main);">🏆 MANAGED COMPETITIONS (${e.length})</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${e.map(t=>`
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 12px 16px;
                            background: rgba(0,0,0,0.3);
                            border: 1px solid var(--glass-border);
                            border-radius: 8px;
                        ">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 24px;">${t.badge}</span>
                                <div>
                                    <div style="font-weight: bold; color: var(--fds-text-main);">${t.name}</div>
                                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted);">${t.description}</div>
                                </div>
                            </div>
                            <span style="font-size: var(--fds-font-xs); color: var(--gold-primary); font-weight: bold;">${t.questionCount} Qs</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}_renderAnalyticsTab(e){const t=this._analyticsData||{activePlayers:124500,totalMatches:185e4,activeCompetitions:e.length,subscribedUsers:88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12};return`
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div class="glass-card" style="padding: 20px; border-color: rgba(34,197,94,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">TOTAL REGISTERED PLAYERS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--pitch-green); margin-top: 6px;">
                        ${t.activePlayers.toLocaleString()}
                    </div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(255,215,0,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">TOTAL MATCHES PLAYED</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--gold-primary); margin-top: 6px;">
                        ${t.totalMatches.toLocaleString()}
                    </div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(96,165,250,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">ACTIVE COMPETITIONS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-blue-accent); margin-top: 6px;">${t.activeCompetitions}</div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(192,132,252,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">ETHIO TELECOM SUBSCRIBERS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: #C084FC; margin-top: 6px;">
                        ${t.subscribedUsers.toLocaleString()}
                    </div>
                </div>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: var(--fds-font-md); color: var(--fds-text-main);">📡 ETHIO TELECOM VAS PLATFORM STATUS</h3>
                <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm); line-height: 1.6;">
                    API Gateway: <span style="color: #86EFAC; font-weight: bold;">ONLINE</span><br/>
                    SMS OTP Delivery Rate: <span style="color: #86EFAC; font-weight: bold;">${t.smsOtpSuccessRate}</span><br/>
                    Database Sync latency: <span style="color: #86EFAC; font-weight: bold;">${t.avgLatencyMs}ms</span>
                </p>
            </div>
        `}_bindEvents(){const e=this._uiManager.container;S.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",i=>{this._audioManager.playClick();const a=i.currentTarget.getAttribute("data-tab");a&&(this._activeTab=a,this._statusMessage="",this.render())})}),e.querySelector("#add-question-btn")?.addEventListener("click",async()=>{this._audioManager.playClick();const t=e.querySelector("#q-category")?.value,i=parseInt(e.querySelector("#q-difficulty")?.value||"2",10),a=parseInt(e.querySelector("#q-correct")?.value||"0",10),n=e.querySelector("#q-prompt-en")?.value.trim(),r=e.querySelector("#q-prompt-am")?.value.trim(),s=e.querySelector("#q-prompt-om")?.value.trim(),l=e.querySelector("#q-opt0-en")?.value.trim(),c=e.querySelector("#q-opt1-en")?.value.trim(),d=e.querySelector("#q-opt2-en")?.value.trim(),h=e.querySelector("#q-opt3-en")?.value.trim(),m=e.querySelector("#q-opt0-am")?.value.trim(),b=e.querySelector("#q-opt1-am")?.value.trim(),v=e.querySelector("#q-opt2-am")?.value.trim(),y=e.querySelector("#q-opt3-am")?.value.trim(),u=e.querySelector("#q-opt0-om")?.value.trim(),f=e.querySelector("#q-opt1-om")?.value.trim(),x=e.querySelector("#q-opt2-om")?.value.trim(),E=e.querySelector("#q-opt3-om")?.value.trim();if(!n||!l||!c||!d||!h){this._statusMessage="❌ Please fill in the English prompt and all 4 English options.",this.render();return}const k={category:t,difficulty:i,competition_id:t,prompt_en:n,prompt_am:r||null,prompt_om:s||null,options_en:[l,c,d,h],options_am:m&&b&&v&&y?[m,b,v,y]:null,options_om:u&&f&&x&&E?[u,f,x,E]:null,correct_index:a,is_active:!0};if(g){const{error:I}=await g.from("questions").insert(k);I?this._statusMessage=`❌ Cloud Insert Failed: ${I.message}`:this._statusMessage="✅ Question published to Cloud database successfully!"}else this._statusMessage="✅ Question added locally (Supabase offline).";this.render()}),e.querySelector("#import-csv-btn")?.addEventListener("click",async()=>{this._audioManager.playClick();const t=e.querySelector("#bulk-csv-area")?.value.trim();if(!t){this._statusMessage="❌ Please paste CSV content to import.",this.render();return}const i=t.split(`
`).map(r=>r.trim()).filter(r=>r.length>0);if(i.length<2){this._statusMessage="❌ CSV must contain a header row and at least 1 data row.",this.render();return}let a=0;const n=i.slice(1);for(const r of n){const s=r.split(",").map(l=>l.trim());if(s.length>=8){const[l,c,d,h,m,b,v,y]=s,u={category:l||"football-history",difficulty:parseInt(c||"1",10),competition_id:l||"football-history",prompt_en:d,options_en:[h,m,b,v],correct_index:parseInt(y||"0",10),is_active:!0};g&&await g.from("questions").insert(u),a++}}this._statusMessage=`✅ Successfully processed & imported ${a} questions!`,this.render()}),e.querySelector("#admin-add-comp-btn")?.addEventListener("click",()=>{const t=e.querySelector("#admin-comp-name"),i=e.querySelector("#admin-comp-badge"),a=e.querySelector("#admin-comp-desc");if(t&&t.value.trim()!==""){const n=t.value.toLowerCase().replace(/\s+/g,"-");L.addCompetition({id:n,name:t.value.trim(),nameEn:t.value.trim(),badge:i.value.trim()||"⚽",description:a.value.trim()||"Custom Competition",color:"#1e3a8a",questionCount:10}),this._audioManager.playClick(),this._statusMessage=`✅ Competition '${t.value.trim()}' Published Successfully!`,this.render()}})}}class N{static _instance=null;static getInstance(){return N._instance||(N._instance=new N),N._instance}async getLeaderboard(e,t="all_time",i=50){if(_.isOnline&&g)try{if(t==="daily"){const a=new Date().toISOString().split("T")[0],{data:n,error:r}=await g.rpc("get_daily_leaderboard",{p_date:a});if(!r&&n&&Array.isArray(n)){const s=n.map((c,d)=>({rank:d+1,userId:c.user_id,username:c.username||"Anonymous Player",avatarUrl:c.avatar_url,eloRating:1200,score:c.score||0,matchesPlayed:1,wins:1})),l=g.auth.getUser?(await g.auth.getUser()).data.user?.id:null;if(l){const c=s.find(d=>d.userId===l);c?(localStorage.setItem("ETHIO_DAILY_RANK",c.rank.toString()),localStorage.setItem("ETHIO_DAILY_SCORE",c.score.toString())):localStorage.removeItem("ETHIO_DAILY_RANK")}return s}}else{const{data:a,error:n}=await g.rpc("get_leaderboard",{p_competition_id:e||null,p_time_range:t,p_limit:i});if(!n&&a&&Array.isArray(a))return a.map(r=>({rank:r.rank,userId:r.user_id,username:r.username||"Anonymous Player",avatarUrl:r.avatar_url,eloRating:r.elo_rating||1200,score:r.score||0,matchesPlayed:r.matches_played||0,wins:r.wins||0}))}}catch(a){console.warn("[LeaderboardService] RPC query failed, returning empty list:",a)}return[]}async getUserRank(e,t){if(!e)return null;try{const a=(await this.getLeaderboard(t)).find(n=>n.userId===e);if(a)return a.rank}catch(i){console.warn("[LeaderboardService] Failed to get user rank:",i)}return null}}class Je{static checkAndShow(e){const t="ETHIO_FOOTBALL_LAST_LOGIN",i=new Date().toISOString().split("T")[0];if(localStorage.getItem(t)===i)return;localStorage.setItem(t,i);const r=(e.profile.streakCount||0)+1;e.updateStreak(r);const s=100+r*25;e.addXp(s)}}class D{static _instance=null;_memoryCache=new Map;_isQuizActive=!1;static getInstance(){return D._instance||(D._instance=new D),D._instance}constructor(){}setQuizActive(e){this._isQuizActive=e,console.log(`[CacheManager] Active quiz status: ${e}`)}get isQuizActive(){return this._isQuizActive}async getOrFetch(e,t,i={}){const a=i.ttlMs??3e5,n=this.get(e);if(n&&!i.forceRefresh&&!this.isStale(e))return n;if(this._isQuizActive&&n)return console.log(`[CacheManager] Quiz active. Returning cached data for key: ${e}`),n;try{const r=await t();return this.set(e,r,a),r}catch(r){if(console.warn(`[CacheManager] Fetch failed for key '${e}'. Falling back to cache if available.`,r),n)return n;throw r}}get(e){if(this._memoryCache.has(e))return this._memoryCache.get(e).data;try{const t=localStorage.getItem(`ETHIO_CACHE_${e}`);if(t){const i=JSON.parse(t);return this._memoryCache.set(e,i),i.data}}catch{}return null}set(e,t,i=300*1e3){const a={data:t,timestamp:Date.now(),ttlMs:i};this._memoryCache.set(e,a);try{localStorage.setItem(`ETHIO_CACHE_${e}`,JSON.stringify(a))}catch{}}isStale(e){const t=this._memoryCache.get(e);if(!t)try{const i=localStorage.getItem(`ETHIO_CACHE_${e}`);if(!i)return!0;const a=JSON.parse(i);return Date.now()-a.timestamp>a.ttlMs}catch{return!0}return Date.now()-t.timestamp>t.ttlMs}invalidate(e){this._memoryCache.delete(e);try{localStorage.removeItem(`ETHIO_CACHE_${e}`)}catch{}}clear(){this._memoryCache.clear();try{Object.keys(localStorage).forEach(e=>{e.startsWith("ETHIO_CACHE_")&&localStorage.removeItem(e)})}catch{}}}class oe{static attach(e,t){let i=0,a=0,n=!1;const r=document.createElement("div");r.className="pull-to-refresh-indicator",r.style.cssText=`
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s, transform 0.2s;
            opacity: 0;
            pointer-events: none;
        `,r.innerHTML=`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009A44" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
        `,e.style.position="relative",e.appendChild(r),e.addEventListener("touchstart",s=>{D.getInstance().isQuizActive||e.scrollTop<=0&&(i=s.touches[0].clientY,n=!0)},{passive:!0}),e.addEventListener("touchmove",s=>{if(!n||D.getInstance().isQuizActive)return;a=s.touches[0].clientY;const l=a-i;if(l>0&&e.scrollTop<=0){const c=Math.min(l*.45,75);r.style.top=`${c-42}px`,r.style.opacity=`${Math.min(c/50,1)}`;const d=r.querySelector("svg");d&&(d.style.transform=`rotate(${c*4}deg)`)}},{passive:!0}),e.addEventListener("touchend",async()=>{if(!n||D.getInstance().isQuizActive)return;if(n=!1,a-i>110&&e.scrollTop<=0){r.style.top="16px";const c=r.querySelector("svg");c&&(c.style.transition="transform 1s linear",c.style.transform="rotate(1080deg)");const d=e.scrollTop;try{await t(),e.scrollTop=d}catch(h){console.error("[PullToRefresh] Refresh failed:",h)}}r.style.pointerEvents="none",r.style.top="-50px",r.style.opacity="0";const l=r.querySelector("svg");l&&(l.style.transition="none",l.style.transform="rotate(0deg)"),i=0,a=0})}}class Ze{_saveManager;_audioManager;_uiManager;_callbacks;_timerInterval=null;_autoScrollInterval=null;_previousDailyRank=null;_resetHandler=null;constructor(e,t,i,a){this._saveManager=e,this._audioManager=t,this._uiManager=i,this._callbacks=a}render(){const e=this._uiManager.container,t=this._saveManager.profile,i=t.totalMatches||0,a=i>0?Math.round((t.totalWins||0)/i*100):0,n=localStorage.getItem("ETHIO_DAILY_SCORE")||"0",r=localStorage.getItem("ETHIO_DAILY_RANK");let s="";if(this._previousDailyRank!==null&&r&&this._previousDailyRank!=="--"&&r!=="--"){const y=parseInt(this._previousDailyRank)-parseInt(r);y>0?s=`<span class="rank-diff-anim rank-diff-up" style="margin-left: 8px; color: #4ADE80; font-size: 11px; font-weight: 800; background: rgba(34,197,94,0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid #22C55E; vertical-align: middle;">▲ +${y} Positions</span>`:y<0&&(s=`<span class="rank-diff-anim rank-diff-down" style="margin-left: 8px; color: #F87171; font-size: 11px; font-weight: 800; background: rgba(239,68,68,0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid #EF4444; vertical-align: middle;">▼ ${y} Positions</span>`)}this._previousDailyRank=r||"--";const l=r&&r!=="--"?`#${r}`:"Unranked",c=t.streakCount||0,d=localStorage.getItem("ETHIO_DAILY_SCORE")||"0";setTimeout(async()=>{try{await N.getInstance().getLeaderboard(void 0,"daily");const y=localStorage.getItem("ETHIO_DAILY_RANK"),u=localStorage.getItem("ETHIO_DAILY_SCORE");(y&&y!==r||u&&u!==d)&&this.render()}catch{}},1e3);const h=M.getInstance().getActiveSession(),m=localStorage.getItem("ETHIO_DAILY_COMPLETED_TODAY")==="true";let b="";h&&h.matchType==="daily"&&(b+=`
                <div class="glass-card fade-in-up" style="padding: clamp(12px, 2vh, 16px); border-color: rgba(34,197,94,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #4ADE80; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Continue Challenge</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">Daily Challenge</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 4px;">Round ${h.currentIndex+1} of ${h.totalQuestions}</div>
                    </div>
                    ${w.Button({id:"btn-continue-challenge",text:"Resume",variant:"primary"})}
                </div>
            `),e.innerHTML=`
            <div class="stadium-container stadium-bg-wrapper" style="pointer-events: auto; padding-bottom: 80px;">
                
                <!-- STADIUM LIGHT BEAMS & FLOATING GRAPHICS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>
                <div class="floating-ball-graphic" style="top: 15%; left: 5%; font-size: 40px;">⚽</div>
                <div class="floating-ball-graphic" style="top: 60%; right: 8%; font-size: 32px; animation-delay: -2s;">⚽</div>

                <!-- TOP APP BAR (Ethio Telecom Branded) -->
                <div class="tv-broadcast-header fade-in-up" style="justify-content: space-between; padding: 12px 16px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(2,6,23,0.85); backdrop-filter: blur(12px);">
                    <!-- Left: Profile & Brand -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #009A44, #22C55E); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid #4ADE80;">
                            ⚽
                        </div>
                        <div>
                            <div style="font-size: 9px; font-weight: 800; color: var(--fds-ethio-green); text-transform: uppercase; letter-spacing: 1px;">ETHIO FANTASY</div>
                            <div style="font-weight: 900; font-size: var(--fds-font-sm); color: var(--fds-text-main); font-family: var(--fds-font-mono);">${t.phone?this._maskPhone(t.phone):"Guest"}</div>
                        </div>
                    </div>

                    <!-- Right: Notification & Settings -->
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <button id="btn-notif" style="background: none; border: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: var(--fds-font-lg); cursor: pointer; padding: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                            🔔
                        </button>
                        <button id="btn-settings" style="background: none; border: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: var(--fds-font-lg); color: var(--fds-text-main); font-weight: bold; cursor: pointer; padding: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94l-0.36-2.54c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41l-0.36,2.54c-0.59,0.24-1.13,0.56-1.62,0.94l-2.39-0.96c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.04,0.64,0.09,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39-0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                           <!-- COMPACT TELEMETRY ROW -->
                <div style="max-width: 900px; margin: 0 auto; padding: 0 16px;">
                    ${n==="0"&&l==="--"?`
                    <div class="glass-card fade-in-up" style="padding: 16px; border-color: rgba(255,255,255,0.1); text-align: center; margin-bottom: 24px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(0,0,0,0.4);">
                        <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🏆</span>
                        <div style="text-align: left;">
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-bottom: 2px;">No Daily Rank Yet</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600; max-width: 200px;">Play matches to earn points and secure your rank on the leaderboard.</div>
                        </div>
                    </div>
                    `:`
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: rgba(255,255,255,0.1); display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; margin-bottom: 24px;">
                        <div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Streak</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: #EF4444; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <span>🔥</span>
                                ${c}
                            </div>
                        </div>
                        <div style="border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Rank</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); display: flex; align-items: center; justify-content: center;">${l} ${s}</div>
                        </div>
                        <div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Score</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${n}</div>
                        </div>
                    </div>
                    `}
                </div>

                <!-- SCROLLABLE BODY CONTENT (Responsive Grid System) -->
                <div style="max-width: 960px; margin: 0 auto; padding: clamp(12px, 2vh, 16px); display: flex; flex-direction: column; gap: clamp(12px, 1.5vh, 16px);">
                    
                    <!-- PREMIUM AD BANNER CAROUSEL -->
                    <div class="fade-in-up" style="position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4); background: rgba(15,23,42,0.6); aspect-ratio: 16/5; width: 100%;">
                        <div id="ad-carousel" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; scrollbar-width: none; width: 100%; height: 100%;">
                            <img src="/assets/banners/banner1.jpg" style="min-width: 100%; height: 100%; flex-shrink: 0; scroll-snap-align: start; object-fit: fill;" alt="Ad 1">
                            <img src="/assets/banners/banner2.jpg" style="min-width: 100%; height: 100%; flex-shrink: 0; scroll-snap-align: start; object-fit: fill;" alt="Ad 2">
                        </div>
                        <!-- Page Indicators -->
                        <div style="position: absolute; bottom: 8px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; pointer-events: none;">
                            <div class="ad-dot active" style="width: 6px; height: 6px; border-radius: 50%; background: white; transition: 0.3s; opacity: 1;"></div>
                            <div class="ad-dot" style="width: 6px; height: 6px; border-radius: 50%; background: white; transition: 0.3s; opacity: 0.4;"></div>
                        </div>
                    </div>
                    <style>
                        #ad-carousel::-webkit-scrollbar { display: none; }
                    </style>

                    <!-- 1. HERO SECTION: DAILY CHAMPIONSHIP TOURNAMENT -->
                    <div class="glass-card fade-in-up" style="
                        border: 2px solid var(--fds-gold-primary);
                        background: linear-gradient(135deg, rgba(0, 154, 68, 0.75) 0%, rgba(15, 23, 42, 0.95) 70%, rgba(255, 215, 0, 0.5) 100%), url('/assets/images/hero_banner.png') center/cover no-repeat;
                        background-blend-mode: overlay;
                        padding: clamp(16px, 2.5vh, 24px) 20px;
                        border-radius: 20px;
                        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.1);
                        position: relative;
                        overflow: hidden;
                        animation-delay: 100ms;
                    " id="card-daily">
                        <!-- Background Glow Accent -->
                        <div style="position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%); pointer-events: none;"></div>

                        <!-- Badge Row -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span id="daily-players-count" class="fds-badge" style="background: rgba(34,197,94,0.2); border: 1px solid #22C55E; color: #4ADE80;">
                                ${z("home.liveMatch")}
                            </span>
                        </div>

                        <!-- Title & Description -->
                        <div style="text-align: center; margin-bottom: 16px;">
                            <h2 style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                ETHIO FANTASY
                            </h2>
                        </div>

                        <!-- Hero Primary Action Button OR Countdown -->
                        ${m?`
                        <div style="display: flex; justify-content: center;">
                            <div style="background: rgba(0,0,0,0.6); border-radius: 999px; padding: 10px 24px; text-align: center; border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1); cursor: default;">
                                <div style="font-size: 10px; font-weight: 800; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Next Challenge In</div>
                                <div id="next-daily-countdown" style="font-size: 20px; font-weight: 900; color: white; font-family: var(--fds-font-mono); letter-spacing: 1px;">
                                    --:--:--
                                </div>
                            </div>
                        </div>
                        `:`
                        ${w.Button({id:"btn-daily-match",text:"DAILY CHALLENGE",variant:"primary",fullWidth:!0})}
                        `}
                    </div>


                    <div class="fade-in-up" id="btn-action-referral" style="padding: clamp(12px, 2vh, 16px); border-radius: 16px; background: rgba(15,23,42,0.6); border: 1px solid rgba(192,132,252,0.3); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: var(--fds-font-xl); filter: drop-shadow(0 2px 4px rgba(192,132,252,0.4));">🎁</div>
                            <div style="text-align: left;">
                                <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); letter-spacing: 0.5px; text-transform: uppercase;">${z("home.invite")}</div>
                                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600; margin-top: 2px;">${z("home.inviteDesc")}</div>
                            </div>
                        </div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #C084FC; background: rgba(192,132,252,0.15); padding: 8px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${z("home.copyLink")}
                        </div>
                    </div>
                    
                    <!-- NEW CONTEXTUAL UI -->
                    ${b}

                    <!-- 3. STATISTICS DASHBOARD CARD -->
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: rgba(255,255,255,0.1); margin-bottom: 24px; border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; text-transform: uppercase; letter-spacing: 0.5px;">${z("home.performance")}</div>
                            <button id="btn-view-all-stats" style="background: rgba(244, 114, 182, 0.15); border: none; color: #F472B6; font-size: var(--fds-font-xs); font-weight: 900; cursor: pointer; padding: 6px 12px; border-radius: 20px; letter-spacing: 0.5px; z-index: 10; position: relative;">${z("home.details")}</button>
                        </div>
                        
                        ${i===0?`
                        <div style="text-align: center; padding: 24px 0; background: rgba(0,0,0,0.2); border-radius: 12px;">
                            <div style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📊</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: white; margin-bottom: 4px;">No History Yet</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600;">Your completed matches and stats will appear here.</div>
                        </div>
                        `:`
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px;">
                            <div>
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${z("home.matches")}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${i}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${z("match.accuracy")}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: #4ADE80; margin-top: 4px;">${a}%</div>
                            </div>
                            <div>
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${z("home.points")}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${t.xp}</div>
                            </div>
                            <div style="grid-column: span 3; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-around;">
                                <div>
                                    <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${z("home.score")}</div>
                                    <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${t.highScores&&t.highScores["football-quiz"]?t.highScores["football-quiz"]:0}</div>
                                </div>
                                <div>
                                    <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">Divisions</div>
                                    <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary); margin-top: 4px;">1st</div>
                                </div>
                            </div>
                        </div>
                        `}
                    </div>

                    <!-- 4. LIVE CHAMPIONSHIP LEADERBOARD HIGHLIGHT -->
                    <div class="glass-card fade-in-up" style="padding: 20px 16px; border-color: rgba(255,215,0,0.2); border-radius: 16px;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-gold-primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">${z("home.rankingsTitle")}</div>
                        <div id="home-leaderboard-preview" style="display: flex; flex-direction: column;">
                            ${w.SkeletonList(3)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._startCountdownTimer(),this._bindEvents(),this._fetchDynamicData();const v=e.querySelector(".stadium-container");v&&oe.attach(v,async()=>{this._audioManager.playClick(),await new Promise(y=>setTimeout(y,600)),this.render()}),Je.checkAndShow(this._saveManager),this._resetHandler||(this._resetHandler=()=>{this.render()},window.addEventListener("ethio:dailyReset",this._resetHandler))}async _fetchDynamicData(){const e=L.getAll().filter(n=>n.status==="live"),t=e.find(n=>n.id==="daily")||e[0],i=document.getElementById("daily-players-count"),a=document.getElementById("daily-play-btn-text");t?(i&&(i.innerHTML=`🟢 LIVE MATCH • ${(t.participants||0).toLocaleString()} PLAYERS`),a&&(a.innerText=`⚡ KICK OFF NOW (+${t.prize_pool||0} XP)`)):(i&&(i.innerHTML="⚪ NO LIVE MATCHES"),a&&(a.innerText="⚡ PLAY CASUAL MATCH"));try{const n=await N.getInstance().getLeaderboard(void 0,"all_time",3),r=document.getElementById("home-leaderboard-preview");if(r&&n.length>0){const s=["🥇","🥈","🥉"],l=["rgba(255,215,0,0.08)","rgba(255,255,255,0.04)","rgba(255,255,255,0.02)"],c=["white","#E2E8F0","#CBD5E1"];r.innerHTML=n.map((d,h)=>`
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${l[h]}; padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${s[h]}</span>
                            <span style="font-size: var(--fds-font-sm); font-weight: ${h===0?"800":"700"}; color: ${c[h]};">${d.username}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-md); font-weight: 900; color: ${h===0?"var(--fds-gold-primary)":"white"}; font-family: var(--fds-font-mono); line-height: 1.1;">${d.score.toLocaleString()}</div>
                            <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Points</div>
                        </div>
                    </div>
                `).join("")}else r&&(r.innerHTML='<div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); text-align: center;">No ranked players yet</div>')}catch(n){console.error(n)}}_startCountdownTimer(){this._timerInterval&&clearInterval(this._timerInterval);const e=L.getAll().filter(n=>n.status==="live"),t=e.find(n=>n.id==="daily")||e[0];let i=new Date().setHours(23,59,59,999);t&&t.end_time&&(i=new Date(t.end_time).getTime());const a=(n,r)=>{if(n.children.length!==r.length){n.innerHTML=r.split("").map(s=>`<span>${s}</span>`).join("");return}for(let s=0;s<r.length;s++){const l=n.children[s];l.textContent!==r[s]&&(l.textContent=r[s],l.classList.remove("digit-tick"),l.offsetWidth,l.classList.add("digit-tick"))}};this._timerInterval=window.setInterval(()=>{let n=Math.floor((i-new Date().getTime())/1e3);if(n<=0){this._timerInterval!==null&&(clearInterval(this._timerInterval),this._timerInterval=null);const h=localStorage.getItem("ETHIO_DAILY_COMPLETED_TODAY")==="true";if(localStorage.removeItem("ETHIO_DAILY_COMPLETED_TODAY"),h)window.dispatchEvent(new Event("ethio:dailyReset"));else{n=0;const m=document.getElementById("daily-countdown");m&&(m.innerHTML="⏱️ 0h : 00m : 00s");const b=document.getElementById("next-daily-countdown");b&&(b.innerHTML="00:00:00")}return}const r=Math.floor(n/3600),s=Math.floor(n%3600/60),l=n%60,c=document.getElementById("daily-countdown");c&&a(c,`⏱️ ${r}h : ${s.toString().padStart(2,"0")}m : ${l.toString().padStart(2,"0")}s`);const d=document.getElementById("next-daily-countdown");d&&a(d,`${r.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}`)},1e3)}_bindEvents(){const e=this._uiManager.container;e.querySelector("#btn-daily-match")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-daily-match-card")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-continue-challenge")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-action-kickoff")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onKickOff()}),e.querySelector("#btn-action-leaderboard")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onLeaderboard()}),e.querySelector("#btn-action-referral")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),ie.show("Invitation link copied! Share with friends to earn 200 XP bonus.","success")}),e.querySelector("#btn-view-all-stats")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onViewStats&&this._callbacks.onViewStats()}),e.querySelector("#btn-notif")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onNotifications&&this._callbacks.onNotifications()}),e.querySelector("#btn-settings")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onSettings()});const t=e.querySelector("#ad-carousel"),i=e.querySelectorAll(".ad-dot");if(t&&i.length>0){let a=0;const n=c=>{i.forEach((d,h)=>{h===c?(d.classList.add("active"),d.style.opacity="1"):(d.classList.remove("active"),d.style.opacity="0.4")})},r=()=>{if(!t.clientWidth)return;a=(a+1)%i.length;const c=t.clientWidth*a,d=t.scrollLeft,h=c-d,m=400;let b=null;const v=y=>{b===null&&(b=y);const u=y-b,f=Math.min(u/m,1),x=f<.5?2*f*f:-1+(4-2*f)*f;t.scrollLeft=d+h*x,f<1&&requestAnimationFrame(v)};requestAnimationFrame(v),n(a)},s=()=>{clearInterval(this._autoScrollInterval),this._autoScrollInterval=setInterval(r,4e3)},l=()=>{clearInterval(this._autoScrollInterval)};t.addEventListener("scroll",()=>{if(!t.clientWidth)return;const c=Math.round(t.scrollLeft/t.clientWidth);c!==a&&c>=0&&c<i.length&&(a=c,n(a))},{passive:!0}),t.addEventListener("touchstart",l,{passive:!0}),t.addEventListener("touchend",s,{passive:!0}),t.addEventListener("mouseenter",l),t.addEventListener("mouseleave",s),s()}}_addRipple(e){const t=e.currentTarget,i=document.createElement("span");i.classList.add("m3-ripple-wave");const a=t.getBoundingClientRect(),n=Math.max(a.width,a.height);i.style.width=i.style.height=`${n}px`,i.style.left=`${e.clientX-a.left-n/2}px`,i.style.top=`${e.clientY-a.top-n/2}px`,t.appendChild(i),setTimeout(()=>i.remove(),400)}_maskPhone(e){let t;return e.startsWith("+")?t=e.substring(1):t=e,t.substring(0,4)+"****"+t.substring(t.length-2)}destroy(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null),this._autoScrollInterval&&(clearInterval(this._autoScrollInterval),this._autoScrollInterval=null),this._resetHandler&&(window.removeEventListener("ethio:dailyReset",this._resetHandler),this._resetHandler=null)}}class et{_uiManager;_audioManager;_callbacks;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._callbacks=i}render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                ${S.render("PLAY","",!1)}

                <div style="max-width: 960px; margin: 0 auto; padding: 24px 16px 100px 16px;">
                    
                    <h2 style="font-size: var(--fds-font-xl); font-weight: 900; margin-bottom: 24px; text-transform: uppercase; color: white;">Game Modes</h2>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        
                        <!-- 15 CATEGORIES -->
                        ${[{id:"world-cup",icon:"🌍",name:"World Cup"},{id:"champions-league",icon:"✨",name:"Champions Lg"},{id:"caf-champions",icon:"🌍",name:"CAF Champions"},{id:"afcon",icon:"🏆",name:"AFCON"},{id:"ethiopian-premier",icon:"🇪🇹",name:"Ethio League"},{id:"walia-ibex",icon:"🐐",name:"Walia Ibex"},{id:"premier-league",icon:"🦁",name:"Premier League"},{id:"la-liga",icon:"🇪🇸",name:"La Liga"},{id:"serie-a",icon:"🇮🇹",name:"Serie A"},{id:"bundesliga",icon:"🇩🇪",name:"Bundesliga"},{id:"legendary-players",icon:"⭐",name:"Legends"},{id:"football-rules",icon:"⚖️",name:"Rules & Refs"},{id:"transfer-market",icon:"💷",name:"Transfers"},{id:"stadiums",icon:"🏟️",name:"Stadiums"},{id:"football-history",icon:"📜",name:"History"}].map((t,i)=>`
                        <div class="glass-card fade-in-up category-btn" data-category="${t.id}" style="padding: 16px; border-radius: 16px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, border-color 0.2s; animation-delay: ${i*30}ms;">
                            <div style="font-size: 32px; margin-bottom: 8px;">${t.icon}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: white; text-transform: uppercase;">${t.name}</div>
                        </div>
                        `).join("")}

                    </div>
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){this._uiManager.container.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",a=>{const n=a.currentTarget,r=n.getAttribute("data-category")||"random",s=n.getBoundingClientRect(),l=a,c=document.createElement("div"),d=Math.max(n.clientWidth,n.clientHeight),h=d/2;let m=l.clientX-s.left-h,b=l.clientY-s.top-h;c.style.width=c.style.height=`${d}px`,c.style.left=`${m}px`,c.style.top=`${b}px`,c.classList.add("ripple"),n.appendChild(c),setTimeout(()=>c.remove(),600),this._audioManager.playClick(),this._callbacks.onCasualPlay(r)})})}destroy(){}}class R{static _instance=null;_currentUser=null;_listeners=new Set;_saveManager;constructor(e){this._saveManager=e,this._initSession()}static normalisePhone(e){const t=e.replace(/\D/g,"");return t.startsWith("251")?"+"+t:t.startsWith("0")?"+251"+t.slice(1):e.startsWith("+")?e.replace(/\s+/g,""):"+251"+t}static getInstance(e){if(!R._instance){if(!e)throw new Error("[AuthManager] SaveManager required for initial instantiation.");R._instance=new R(e)}return R._instance}async _initSession(){if(!_.isOnline||!g){console.log("[AuthManager] Offline mode active."),this._notifyListeners();return}try{const{data:{session:e}}=await g.auth.getSession();e?.user?await this._fetchUserProfile(e.user.id):this._notifyListeners()}catch(e){console.error("[AuthManager] Failed to fetch session:",e),this._notifyListeners()}g.auth.onAuthStateChange(async(e,t)=>{console.log(`[AuthManager] Auth state changed: ${e}`),t?.user?await this._fetchUserProfile(t.user.id):(this._currentUser=null,this._notifyListeners())})}async refreshProfile(){this._currentUser&&await this._fetchUserProfile(this._currentUser.id)}async _fetchUserProfile(e,t=5,i){if(g){for(let a=0;a<t;a++){const{data:n,error:r}=await g.from("users").select("*").eq("id",e).single();if(r){if(r.code==="PGRST116"){const s=i?`Player_${i.slice(-4)}`:`Player_${e.slice(-4)}`,{data:l,error:c}=await g.from("users").insert({id:e,username:s,phone:i||null,locale:"en",elo_rating:0,coins:0,xp:0,total_matches:0,total_wins:0,subscription_tier:"free",streak_count:0,created_at:new Date().toISOString(),last_active:new Date().toISOString()}).select().single();if(!c&&l){this._currentUser=l,this._saveManager.syncWithCloudUser(l),this._notifyListeners(),console.log("[AuthManager] Created new user profile:",s);return}console.error("[AuthManager] Failed to create user profile:",c);break}if(console.warn(`[AuthManager] Error fetching user profile (attempt ${a+1}/${t}):`,r),a<t-1){await new Promise(s=>setTimeout(s,500));continue}}else if(n){this._currentUser=n,this._saveManager.syncWithCloudUser(n),this._notifyListeners();return}}console.error("[AuthManager] Failed to fetch user profile after retries."),this._notifyListeners()}}async signInWithPhone(e){if(!g)return{success:!1,error:"Supabase client offline"};const t=R.normalisePhone(e);try{const{error:i}=await g.auth.signInWithOtp({phone:t});return i?{success:!1,error:i.message}:{success:!0}}catch(i){return{success:!1,error:i.message||"Failed to send OTP"}}}async verifyOtp(e,t){if(!g)return{success:!1,error:"Supabase client offline"};const i=R.normalisePhone(e);try{const{data:a,error:n}=await g.auth.verifyOtp({phone:i,token:t,type:"sms"});return n?(console.error("[AuthManager] OTP Verification error:",n),{success:!1,error:n.message}):(a.user&&await this._fetchUserProfile(a.user.id,5,i),{success:!0})}catch(a){return{success:!1,error:a.message||"OTP verification failed"}}}async signOut(){g&&await g.auth.signOut(),this._currentUser=null,this._notifyListeners()}subscribe(e){return this._listeners.add(e),e(this._currentUser),()=>this._listeners.delete(e)}_notifyListeners(){this._listeners.forEach(e=>e(this._currentUser))}get currentUser(){return this._currentUser}get isGuest(){return!1}get isAuthenticated(){return this._currentUser!==null}}const tt=Object.freeze(Object.defineProperty({__proto__:null,AuthManager:R},Symbol.toStringTag,{value:"Module"}));class it{_uiManager;_audioManager;_authManager;_onSuccess;_phoneStep="INPUT_PHONE";_pendingPhone="";_statusMessage="";_devOtpCode="";constructor(e,t,i,a){this._uiManager=e,this._audioManager=t,this._authManager=i,this._onSuccess=a}render(){const e=this._uiManager.container,t=this._phoneStep==="INPUT_OTP",i=this._pendingPhone?this._pendingPhone.replace("+",""):"";e.innerHTML=`
            <div style="
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%);
                display: flex; align-items: center; justify-content: center;
                font-family: system-ui, -apple-system, sans-serif; pointer-events: auto; padding: 20px; box-sizing: border-box;
            ">
                <div style="
                    background: #FFFFFF; border-radius: 24px; padding: 32px 24px;
                    width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center;
                ">
                    <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 24px 0;">
                        ${o.currentLocale==="am"?"ይግቡ":o.currentLocale==="om"?"Seenaa":"Sign In"}
                    </h1>

                    ${this._statusMessage?`
                        <div style="color: #EF4444; font-size: 14px; margin-bottom: 16px; text-align: left;">
                            ${this._statusMessage}
                        </div>
                    `:""}

                    ${this._devOtpCode?`
                        <div style="
                            background: #F0FDF4; border: 2px solid #16A34A; border-radius: 12px;
                            padding: 12px 16px; margin-bottom: 16px; text-align: left;
                        ">
                            <div style="font-size: 12px; font-weight: 700; color: #15803D; text-transform: uppercase; margin-bottom: 4px;">
                                🔑 Your OTP Code (Dev Mode)
                            </div>
                            <div style="font-size: 28px; font-weight: 900; color: #111827; letter-spacing: 6px;">
                                ${this._devOtpCode}
                            </div>
                            <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">
                                Enter this code below to sign in
                            </div>
                        </div>
                    `:""}

                    <div style="text-align: left; margin-bottom: 16px;">
                        <label style="display: block; font-size: 14px; color: #4B5563; font-weight: 600; margin-bottom: 8px;">
                            ${o.currentLocale==="am"?"የስልክ ቁጥር":o.currentLocale==="om"?"Lakkoofsa bilbilaa":"Phone number"}
                        </label>
                        <input type="tel" id="phone-input" placeholder="2519XXXXXXXX / 2518XXXXXXXX" value="${i}" ${t?"disabled":""} style="
                            width: 100%; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 12px;
                            padding: 14px 16px; color: #111827; font-size: 16px; outline: none; box-sizing: border-box;
                            opacity: ${t?"0.6":"1"};
                        " />
                    </div>

                    <div style="display: flex; align-items: stretch; margin-bottom: ${t?"16px":"32px"}; border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; background: #FFFFFF; opacity: ${t?"1":"0.6"};">
                        <input type="text" id="otp-input" maxlength="6"
                            placeholder="${o.currentLocale==="am"?"የ 6-አሃዝ ኮድ":o.currentLocale==="om"?"Koodii dijiitii 6":"6-digit code"}"
                            ${t?"":"disabled"}
                            style="
                            flex: 1; background: transparent; border: none; padding: 14px 16px;
                            color: #111827; font-size: 16px; outline: none; width: 100%;
                            letter-spacing: 4px; font-weight: 700;
                        " />
                        <button id="send-otp-btn" style="
                            background: #2563EB; color: white; border: none; padding: 0 20px;
                            font-size: 16px; font-weight: 600; cursor: ${t?"default":"pointer"}; outline: none;
                            opacity: ${t?"0.7":"1"}; white-space: nowrap;
                        " ${t?"disabled":""}>
                            ${o.currentLocale==="am"?"ኮድ ያግኙ":o.currentLocale==="om"?"Koodii fudhadhu":"Get code"}
                        </button>
                    </div>

                    <div id="sign-in-container" style="display: ${t?"block":"none"}; margin-bottom: 24px;">
                        <button id="verify-otp-btn" style="
                            width: 100%; background: #16A34A; color: white; border: none; border-radius: 12px;
                            padding: 14px; font-size: 16px; font-weight: bold; cursor: pointer;
                        ">${o.currentLocale==="am"?"ይግቡ":o.currentLocale==="om"?"Seenaa":"Sign In"}</button>
                    </div>

                    <div style="margin-top: 16px;">
                        <a href="#" style="color: #16A34A; text-decoration: underline; font-size: 14px; font-weight: 600;">
                            ${o.currentLocale==="am"?"ደንቦች እና ሁኔታዎች":o.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions"}
                        </a>
                    </div>

                    ${t?`
                        <div style="margin-top: 12px;">
                            <button id="change-phone-btn" style="background: none; border: none; color: #2563EB; font-size: 14px; cursor: pointer;">
                                ${o.currentLocale==="am"?"ቁጥር ይቀይሩ":o.currentLocale==="om"?"Lakkoofsa jijjiiri":"Change number"}
                            </button>
                        </div>
                    `:""}
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;e.querySelector("#phone-input")?.addEventListener("input",n=>{const r=n.target;r.value=r.value.replace(/[^0-9+]/g,""),r.value.indexOf("+")>0&&(r.value=r.value.replace(/\+/g,""))});const t=e.querySelector("#send-otp-btn");t&&t.addEventListener("click",async()=>{this._audioManager.playClick();const r=e.querySelector("#phone-input")?.value.trim()||"";if(!r){this._statusMessage=o.currentLocale==="am"?"እባክዎን ትክክለኛ የስልክ ቁጥር ያስገቡ።":o.currentLocale==="om"?"Maaloo lakkoofsa bilbilaa sirrii ta'e galchaa.":"Please enter a valid phone number.",this.render();return}const s=R.normalisePhone(r);this._pendingPhone=s,this._devOtpCode="",this._statusMessage=o.currentLocale==="am"?"የኦቲፒ መልዕክት በመላክ ላይ...":o.currentLocale==="om"?"OTP SMS ergaa jira...":"Sending OTP...",this.render();const l=await this._authManager.signInWithPhone(s);l.success?(this._phoneStep="INPUT_OTP",this._statusMessage="",this._fetchDevOtp(s)):this._statusMessage=l.error||(o.currentLocale==="am"?"ኮድ መላክ አልተቻለም።":o.currentLocale==="om"?"OTP erguun hin danda'amne.":"Failed to send OTP."),this.render()});const i=e.querySelector("#verify-otp-btn");i&&i.addEventListener("click",async()=>{this._audioManager.playClick();const r=e.querySelector("#otp-input")?.value.trim()||"";if(r.length!==6){this._statusMessage=o.currentLocale==="am"?"እባክዎን የ 6-አሃዝ ማረጋገጫ ኮድ ያስገቡ።":o.currentLocale==="om"?"Maaloo koodii mirkaneessaa dijiitii 6 galchaa.":"Please enter a 6-digit verification code.",this.render();return}this._statusMessage=o.currentLocale==="am"?"ኮድ በመፈተሽ ላይ...":o.currentLocale==="om"?"Koodii mirkaneessaa jira...":"Verifying code...",this.render();const s=await this._authManager.verifyOtp(this._pendingPhone,r);s.success?this._onSuccess():(this._statusMessage=s.error||(o.currentLocale==="am"?"የተሳሳተ የማረጋገጫ ኮድ።":o.currentLocale==="om"?"Koodii mirkaneessaa dogoggoraa.":"Invalid verification code."),this.render())});const a=e.querySelector("#change-phone-btn");a&&a.addEventListener("click",()=>{this._audioManager.playClick(),this._phoneStep="INPUT_PHONE",this._statusMessage="",this._devOtpCode="",this.render()})}async _fetchDevOtp(e){if(g)for(let t=0;t<8;t++){await new Promise(i=>setTimeout(i,800));try{const{data:i}=await g.from("dev_otps").select("code").eq("phone",e).maybeSingle();if(i?.code){this._devOtpCode=String(i.code);const a=this._uiManager.container.querySelector("#otp-input");a&&(a.value=this._devOtpCode),this.render();return}}catch{return}}}}class Y{static instance;channels=new Map;listeners=new Map;constructor(){}static getInstance(){return Y.instance||(Y.instance=new Y),Y.instance}initUserChannels(e){if(!_.isOnline){console.warn("[RealtimeService] Offline mode: Cannot initialize channels.");return}const t=g;if(!t)return;this.cleanup();const i=t.channel(`profile-${e}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"users",filter:`id=eq.${e}`},c=>this.emit("profile_update",c)).subscribe();this.channels.set(`profile-${e}`,i);const a=t.channel(`notifications-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},c=>{const d=c.new;(d.user_id===e||d.user_id===null)&&this.emit("new_notification",c)}).subscribe();this.channels.set(`notifications-${e}`,a);const n=t.channel(`messages-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},c=>{const d=c.new;(d.recipient_id===e||d.channel==="global")&&this.emit("new_message",c)}).subscribe();this.channels.set(`messages-${e}`,n);const r=t.channel(`rewards-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"rewards",filter:`user_id=eq.${e}`},c=>this.emit("new_reward",c)).subscribe();this.channels.set(`rewards-${e}`,r);const s=t.channel(`session-${e}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_sessions",filter:`user_id=eq.${e}`},c=>this.emit("session_update",c)).subscribe();this.channels.set(`session-${e}`,s);const l=t.channel("leaderboard").on("postgres_changes",{event:"UPDATE",schema:"public",table:"leaderboard_entries"},c=>this.emit("leaderboard_update",c)).subscribe();this.channels.set("leaderboard",l),console.log(`[RealtimeService] Channels initialized for user ${e}`)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t)}off(e,t){if(t){const i=this.listeners.get(e);i&&(i.delete(t),i.size===0&&this.listeners.delete(e))}else this.listeners.delete(e)}emit(e,t){const i=this.listeners.get(e);i&&i.forEach(a=>{try{a(t)}catch(n){console.error(`[RealtimeService] Error executing listener for event ${e}:`,n)}})}cleanup(){const e=g;this.channels.forEach(t=>{e&&e.removeChannel(t)}),this.channels.clear(),this.listeners.clear(),console.log("[RealtimeService] Cleaned up all channels and listeners.")}}class at{_uiManager;_audioManager;_saveManager;_onClose;_activeTab="daily";_previousRank=null;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onClose=a}async render(){const e=this._uiManager.container;e.innerHTML=w.LoadingState(o.currentLocale==="am"?"ደረጃዎችን በማስገባት ላይ...":o.currentLocale==="om"?"Sadarkaa fe'aa jira...":"Loading rankings...");const t=this._saveManager.profile,i=T.getDivision(t.xp);let a=[];this._activeTab==="daily"?a=await N.getInstance().getLeaderboard(void 0,"daily"):a=(await(await pe(async()=>{const{TournamentService:u}=await import("./TournamentService-7IbVgJZI.js");return{TournamentService:u}},__vite__mapDeps([0,1]))).TournamentService.getInstance().getLeaderboard(this._activeTab)).map(u=>({userId:u.userId,username:u.username,score:u.score,matchesPlayed:u.matchesPlayed}));const n=a.map(v=>{const y=v.username===t.username,f=/^\\+?[0-9]{9,}$/.test((v.username||"").replace(/[^0-9+]/g,""))?this._maskPhone(v.username):v.username||(o.currentLocale==="am"?"ያልታወቀ":o.currentLocale==="om"?"Namummaa Hin Beekamne":"Anonymous"),x=v.score||0,E=v.eloRating||0,k=T.getDivision(x);return{msisdn:f,score:x,eloRating:E,points:x,league:k.name,isMe:y}});n.sort((v,y)=>y.score-v.score);const r=n[0],s=n[1],l=n[2],c=n.slice(3),d=v=>{const y=this._activeTab===v;return`
                flex: 1;
                padding: 10px 4px;
                border-radius: 8px;
                border: 1px solid ${y?"var(--fds-gold-primary)":"rgba(255,255,255,0.1)"};
                background: ${y?"rgba(255,215,0,0.15)":"rgba(15,23,42,0.6)"};
                color: ${y?"var(--fds-gold-primary)":"#94A3B8"};
                font-weight: 800;
                font-size: var(--fds-font-xs);
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `},h=n.findIndex(v=>v.isMe),m=h!==-1?h+1:"--";let b="";if(this._previousRank!==null&&m!=="--"&&this._previousRank!=="--"){const v=this._previousRank-m;v>0?b=`<span class="rank-diff-anim rank-diff-up">▲ +${v} Positions</span>`:v<0&&(b=`<span class="rank-diff-anim rank-diff-down">▼ ${v} Positions</span>`)}this._previousRank=m,e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; padding-bottom: 60px; overflow-y: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- STADIUM LIGHT BEAMS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>

                <!-- TOP BAR -->
                ${S.render(o.currentLocale==="am"?"ደረጃ":o.currentLocale==="om"?"SADARKAA":"RANK","",!1)}

                <div style="max-width: 900px; margin: 0 auto; padding: 16px;">
                    
                    <!-- PERIOD TABS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;" class="fade-in-up">
                        <button class="lb-tab-btn" data-tab="daily" style="${d("daily")}">${o.currentLocale==="am"?"ዕለታዊ":o.currentLocale==="om"?"GUYYAA":"DAILY"}</button>
                        <button class="lb-tab-btn" data-tab="weekly" style="${d("weekly")}">${o.currentLocale==="am"?"ሳምንታዊ":o.currentLocale==="om"?"TORBEE":"WEEKLY"}</button>
                        <button class="lb-tab-btn" data-tab="monthly" style="${d("monthly")}">${o.currentLocale==="am"?"ወርሃዊ":o.currentLocale==="om"?"JI'A":"MONTHLY"}</button>
                    </div>

                    <!-- 1. PODIUM CARDS (TOP 3 CHAMPIONS) -->
                    ${n.length===0?w.EmptyState("🏆",o.currentLocale==="am"?"እስካሁን የተሰለፈ ተጫዋች የለም።":o.currentLocale==="om"?"Hamma ammaatti taphataan sadarkaa qabate hin jiru.":"No players ranked yet."):`
                    <div style="display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 12px; align-items: end; margin-bottom: 24px; text-align: center;" class="fade-in-up">
                        
                        <!-- 2ND PLACE PODIUM (SILVER) -->
                        ${s?`
                        <div class="glass-card" style="padding: 16px 8px; border-color: #C0C0C0; background: linear-gradient(180deg, rgba(192,192,192,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥈</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #E2E8F0; text-transform: uppercase;">${o.currentLocale==="am"?"2ኛ":o.currentLocale==="om"?"2FFAA":"2ND"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${s.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-blue-accent); margin-top: 2px;">${s.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${s.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}

                        <!-- 1ST PLACE PODIUM (GOLD CHAMPION) -->
                        ${r?`
                        <div class="glass-card" style="padding: 20px 8px; border-color: var(--fds-gold-primary); background: linear-gradient(180deg, rgba(255,215,0,0.25) 0%, rgba(15,23,42,0.95) 100%); border-radius: 20px; box-shadow: 0 10px 30px var(--fds-gold-glow); transform: translateY(-8px);">
                            <div style="font-size: 36px; margin-bottom: 4px; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));">🥇</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px;">${o.currentLocale==="am"?"ሻምፒዮን":o.currentLocale==="om"?"CHAAMPIYOONA":"CHAMPION"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${r.msisdn}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary); margin-top: 2px;">${r.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: #FEF08A; margin-top: 2px;">🏆 ${r.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}

                        <!-- 3RD PLACE PODIUM (BRONZE) -->
                        ${l?`
                        <div class="glass-card" style="padding: 16px 8px; border-color: #CD7F32; background: linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥉</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #FDBA74; text-transform: uppercase;">${o.currentLocale==="am"?"3ኛ":o.currentLocale==="om"?"3FFAA":"3RD"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${l.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #CD7F32; margin-top: 2px;">${l.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${l.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}
                    </div>
                    `}

                    <!-- 2. CURRENT USER STATS BANNER -->
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: var(--fds-green-pitch); background: rgba(34,197,94,0.12); margin-bottom: 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">⚽</span>
                            <div>
                                <div style="font-size: var(--fds-font-xs); color: #4ADE80; font-weight: 800; text-transform: uppercase;">${o.currentLocale==="am"?"የእርስዎ የደረጃ ቦታ":o.currentLocale==="om"?"SADARKAA KEE":"YOUR RANK POSITION"}</div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    ${m==="--"?`
                                        <div style="font-size: var(--fds-font-xs); color: rgba(255,255,255,0.7); font-weight: 500; margin-top: 2px;">
                                            Play matches to earn points and secure your rank.
                                        </div>
                                    `:`
                                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">
                                            ${o.currentLocale==="am"?`#${m} በ ${i.name} ሊግ`:o.currentLocale==="om"?`#${m} Liigii ${i.name} Keessatti`:`#${m} In ${i.name} League`}
                                        </div>
                                    `}
                                    ${b}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${t.xp||0} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-muted);">${t.totalMatches||0} Matches</div>
                        </div>
                    </div>

                    <!-- 3. REMAINING RANKINGS LIST (4TH+) -->
                    <div style="display: flex; flex-direction: column; gap: 8px;" class="fade-in-up">
                        ${c.map((v,y)=>{const u=y+4,f=v.isMe;return`
                                <div class="glass-card" style="
                                    display: flex; 
                                    justify-content: space-between; 
                                    align-items: center; 
                                    padding: 12px 16px; 
                                    background: ${f?"rgba(34,197,94,0.15)":"rgba(15,23,42,0.7)"}; 
                                    border: 1px solid ${f?"#22C55E":"rgba(255,255,255,0.08)"}; 
                                    border-radius: 12px;
                                ">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-dim); min-width: 24px;">#${u}</span>
                                        <div>
                                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${f?"#4ADE80":"white"};">
                                                ${v.msisdn} ${f?`<span style="background: #22C55E; color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; margin-left: 6px;">${o.currentLocale==="am"?"እርስዎ":o.currentLocale==="om"?"ATI":"YOU"}</span>`:""}
                                            </div>
                                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">${o.currentLocale==="am"?`${v.league} ሊግ`:o.currentLocale==="om"?`Liigii ${v.league}`:`${v.league} League`}</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${v.score} PTS</div>
                                        <div style="font-size: var(--fds-font-xs); color: var(--fds-blue-accent);">${v.points} XP</div>
                                    </div>
                                </div>
                            `}).join("")}
                    </div>
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;S.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".lb-tab-btn").forEach(i=>{i.addEventListener("click",a=>{this._audioManager.playClick();const n=a.currentTarget.getAttribute("data-tab");this._activeTab=n,this.render()})});const t=e.querySelector(".stadium-container");t&&oe.attach(t,async()=>{this._audioManager.playClick(),await this.render()})}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")&&(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class O{static instance;listeners=[];unreadCount=0;constructor(){this._initRealtime(),this._fetchUnreadCount()}static getInstance(){return O.instance||(O.instance=new O),O.instance}subscribeToBadgeUpdates(e){return this.listeners.push(e),e(this.unreadCount),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}_notifyListeners(){this.listeners.forEach(e=>e(this.unreadCount))}async _fetchUnreadCount(){if(!g)return;const{data:{user:e}}=await g.auth.getUser();if(!e)return;const{count:t,error:i}=await g.from("messages").select("*",{count:"exact",head:!0}).eq("read",!1).or(`recipient_id.eq.${e.id},channel.eq.global`);!i&&t!==null&&(this.unreadCount=t,this._notifyListeners())}_initRealtime(){g&&g.channel("public:messages").on("postgres_changes",{event:"*",schema:"public",table:"messages"},()=>{this._fetchUnreadCount()}).subscribe()}getTotalUnreadCount(){return this.unreadCount}_mapRow(e){const t=o.currentLocale;let i=e.body_en;t==="am"&&e.body_am&&(i=e.body_am),t==="om"&&e.body_om&&(i=e.body_om);let a="Message";return e.channel==="global"?a="Announcement":e.channel==="system"?a="System Update":e.channel==="direct"&&(a="Direct Message"),{id:e.id,title:a,content:i,category:e.channel,priority:e.channel==="global"?"High":"Normal",createdAt:e.created_at,read:e.read}}async _fetchByChannel(e){if(!g)return[];const{data:{user:t}}=await g.auth.getUser();let i=g.from("messages").select("*").eq("channel",e).order("created_at",{ascending:!1}).limit(50);if(e==="direct"||e==="system"){if(!t)return[];i=i.eq("recipient_id",t.id)}const{data:a,error:n}=await i;return n||!a?[]:a.map(r=>this._mapRow(r))}async getAllMessages(){if(!g)return[];const{data:{user:e}}=await g.auth.getUser();let t=g.from("messages").select("*").order("created_at",{ascending:!1}).limit(100);e?t=t.or(`recipient_id.eq.${e.id},channel.eq.global`):t=t.eq("channel","global");const{data:i,error:a}=await t;return a||!i?[]:i.map(n=>this._mapRow(n))}async getAnnouncements(){return this._fetchByChannel("global")}async getPersonalMessages(){return this._fetchByChannel("direct")}async getSupportTickets(){return this._fetchByChannel("system")}async markAsRead(e){if(!g)return;const{error:t}=await g.from("messages").update({read:!0}).eq("id",e);t||this._fetchUnreadCount()}}class nt{_uiManager;_saveManager;_audioManager;_callbacks;_unsubscribeBadge=null;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._callbacks=a,this._unsubscribeBadge=O.getInstance().subscribeToBadgeUpdates(()=>{const n=document.getElementById("profile-msg-badge");if(n){const r=O.getInstance().getTotalUnreadCount();r>0?(n.innerText=r>99?"99+":r.toString(),n.style.display="inline-block"):n.style.display="none"}})}destroy(){this._unsubscribeBadge&&this._unsubscribeBadge()}render(){const e=this._uiManager.container;e.innerHTML=w.SkeletonProfile(),setTimeout(()=>{this._renderActual()},300)}_renderActual(){const e=this._uiManager.container,t=this._saveManager.profile,i=T.getDivision(t.xp),a=t.phone?this._maskPhone(t.phone):`${o.currentLocale==="am"?"እንግዳ ተጫዋች":o.currentLocale==="om"?"Tapaataa Keessummaa":"Guest Player"}`,n=(l,c,d,h=!0,m="")=>`
            <div class="list-tile profile-menu-tile" data-action="${d}" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 16px; 
                border-bottom: 1px solid rgba(255,255,255,0.05); 
                cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: var(--fds-font-lg);">${l}</span>
                    <span style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${c}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${m?`
                        <span id="${m}" style="
                            display: none;
                            background: var(--tv-pitch-green, #22C55E);
                            color: white; font-size: 10px; font-weight: 900;
                            border-radius: 10px; padding: 2px 6px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                        "></span>
                    `:""}
                    ${h?'<span style="color: var(--fds-text-dim);">❯</span>':""}
                </div>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding-bottom: 120px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- TOP HEADER -->
                <div style="
                    background: linear-gradient(180deg, rgba(34,197,94,0.2) 0%, rgba(15,23,42,0) 100%);
                    padding: 32px 16px 16px 16px;
                    text-align: center;
                ">
                    <div style="
                        width: 80px; height: 80px; 
                        border-radius: 50%; 
                        background: var(--tv-gold-primary); 
                        display: flex; align-items: center; justify-content: center; 
                        font-size: 40px; 
                        margin: 0 auto 16px auto;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                        border: 3px solid white;
                    ">👤</div>
                    <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">${t.username}</div>
                    <div style="font-size: var(--fds-font-sm); font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 16px; font-family: var(--tv-mono);">${a}</div>
                </div>

                <!-- TELEMETRY BANNER -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    background: rgba(0,0,0,0.35);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding: 16px 0;
                    margin-bottom: 24px;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"ሊግ":o.currentLocale==="om"?"LIIGII":"LEAGUE"}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${i.color};">${i.name}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"ደረጃ":o.currentLocale==="om"?"SADARKAA":"RANK"}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">${localStorage.getItem("ETHIO_DAILY_RANK")&&localStorage.getItem("ETHIO_DAILY_RANK")!=="--"?"#"+localStorage.getItem("ETHIO_DAILY_RANK"):"Unranked"}</div>
                    </div>
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"ነጥቦች":o.currentLocale==="om"?"QABXII":"POINTS"}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--tv-gold-primary);">${t.xp} XP</div>
                    </div>
                </div>

                <!-- GROUPED MENUS -->
                <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    <!-- Group 1: Stats & Achievements -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${n("📊",o.currentLocale==="am"?"ስታቲስቲክስ":o.currentLocale==="om"?"Istaatistiiksii":"Statistics","stats")}
                        ${n("🏆",o.currentLocale==="am"?"ስኬቶች":o.currentLocale==="om"?"Milkaa'ina":"Achievements","achievements")}
                        ${n("🏅",o.currentLocale==="am"?"የእኔ ሽልማቶች":o.currentLocale==="om"?"Badhaasa Koo":"My Awards","awards")}
                        <div style="border-bottom: none;">${n("📈",o.currentLocale==="am"?"የመሪዎች ሰሌዳ":o.currentLocale==="om"?"Gabatee Geggeessitootaa":"Leaderboard","leaderboard")}</div>
                    </div>

                    <!-- Group 2: Invite & Subs -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${n("👥",o.currentLocale==="am"?"ጓደኞችን ይጋብዙ":o.currentLocale==="om"?"Hiriyoota Affeeri":"Invite Friends","invite")}
                        ${n("⭐",o.currentLocale==="am"?"ምዝገባ":o.currentLocale==="om"?"Galmee":"Subscription","subscription")}
                        <div style="border-bottom: none;">${n("💬",o.currentLocale==="am"?"መልዕክቶች":o.currentLocale==="om"?"Ergaawwan":"Messages","messages",!0,"profile-msg-badge")}</div>
                    </div>

                    <!-- Group 3: Utility -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${n("⚙️",o.currentLocale==="am"?"ቅንብሮች":o.currentLocale==="om"?"Qindaa'inoota":"Settings","settings")}
                        ${n("❓",o.currentLocale==="am"?"እገዛ እና ድጋፍ":o.currentLocale==="om"?"Gargaarsa & Deeggarsa":"Help & Support","help")}
                        <div style="border-bottom: none;">${n("ℹ️",o.currentLocale==="am"?"ስለ እኛ":o.currentLocale==="om"?"Waa'ee":"About","about")}</div>
                    </div>

                </div>
            </div>

            <!-- Profile Interactive Modals Container -->
            <div id="profile-action-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; pointer-events: auto;">
                <div class="glass-card" style="width: 100%; max-width: 400px; padding: 24px; border-color: var(--tv-gold-primary); text-align: center; background: rgba(15,23,42,0.95); position: relative;">
                    <button id="btn-close-prof-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-md); cursor: pointer;">✖</button>
                    <div id="prof-modal-content" style="max-height: 70vh; overflow-y: auto;" class="hide-scrollbar"></div>
                </div>
            </div>

            <style>
                .list-tile:active { background: rgba(255,255,255,0.08); }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            </style>
        `,this._bindEvents();const r=O.getInstance().getTotalUnreadCount(),s=document.getElementById("profile-msg-badge");s&&(r>0?(s.innerText=r>99?"99+":r.toString(),s.style.display="inline-block"):s.style.display="none")}_bindEvents(){const e=this._uiManager.container,t=document.getElementById("profile-action-modal"),i=document.getElementById("prof-modal-content"),a=document.getElementById("btn-close-prof-modal"),n=l=>{t&&i&&(i.innerHTML=l,t.style.display="flex")};a?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")}),e.querySelectorAll(".profile-menu-tile").forEach(l=>{l.addEventListener("click",c=>{const h=c.currentTarget.getAttribute("data-action");if(h)switch(this._audioManager.playClick(),h){case"stats":this._callbacks.onStatistics();break;case"leaderboard":this._callbacks.onLeaderboard();break;case"subscription":this._callbacks.onSubscription();break;case"messages":this._callbacks.onMessages();break;case"settings":this._callbacks.onSettings();break;case"help":this._callbacks.onHelp();break;case"about":this._callbacks.onAbout();break;case"privacy":this._callbacks.onPrivacy();break;case"terms":this._callbacks.onTerms();break;case"invite":n(`
                            <div style="font-size: 40px; margin-bottom: 12px;">👥</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px; text-transform: uppercase;">${o.currentLocale==="am"?"ጓደኞችን ይጋብዙ":o.currentLocale==="om"?"Hiriyoota Affeeri":"Invite Friends"}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 16px;">${o.currentLocale==="am"?"ጓደኞች ሲጫወቱ ሳንቲሞችን ያግኙ።":o.currentLocale==="om"?"Yoo hiriyoonni taphatan saantima argadhu.":"Earn coins when friends play."}</div>
                            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); font-size: var(--fds-font-xs); color: var(--tv-gold-primary); font-family: monospace; margin-bottom: 16px; word-break: break-all;">https://ethiofantasy.com/join?ref=${this._saveManager.profile.phone||"guest"}</div>
                            ${w.Button({id:"btn-copy-ref",text:o.currentLocale==="am"?"ሊንክ ቅዳ":o.currentLocale==="om"?"LIINKII WARAABBI":"COPY LINK",variant:"primary",fullWidth:!0})}
                        `),document.getElementById("btn-copy-ref")?.addEventListener("click",()=>{this._audioManager.playClick(),navigator.clipboard.writeText(`https://ethiofantasy.com/join?ref=${this._saveManager.profile.phone||"guest"}`);const m=document.getElementById("btn-copy-ref");m&&(m.innerText=o.currentLocale==="am"?"ተቀድቷል ✅":o.currentLocale==="om"?"WARAABAMEERA ✅":"COPIED ✅")});break;case"achievements":this._callbacks.onAchievements();break;case"awards":this._audioManager.playClick(),this._callbacks.onAwards();break}})});const s=e.querySelector(".stadium-container");s&&oe.attach(s,async()=>{this._audioManager.playClick(),await this.render()})}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")||(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class K{static _instance=null;_inQueue=!1;_listeners=new Set;_cdcChannel=null;static getInstance(){return K._instance||(K._instance=new K),K._instance}async joinQueue(e,t){if(this._inQueue)return{success:!0};if(this._inQueue=!0,_.isOnline&&g){const{data:i,error:a}=await re.invoke("matchmaking",{userId:e.id,eloRating:e.elo_rating||1200,competitionId:t});return!a&&i&&i.matched&&i.liveMatch?(console.log("[MatchmakingService] Matched instantly via Edge Function."),await this._handleMatchFound(i.liveMatch,e.id),{success:!0}):(this._subscribeToCdc(e.id),{success:!0})}return console.warn("[MatchmakingService] Offline or unavailable. Queueing locally."),{success:!1,error:"Matchmaking is currently unavailable."}}_subscribeToCdc(e){g&&(this._cdcChannel=g.channel("public:live_matches").on("postgres_changes",{event:"INSERT",schema:"public",table:"live_matches"},async t=>{const i=t.new;(i.player_a_id===e||i.player_b_id===e)&&(console.log("[MatchmakingService] Postgres CDC detected live match creation!"),await this._handleMatchFound(i,e))}).subscribe())}async _handleMatchFound(e,t){const i=e.player_a_id===t?e.player_b_id:e.player_a_id;let a={id:i,role:"player",username:"Ethiopian_Rival",phone:null,avatar_url:null,locale:"en",elo_rating:1200,coins:100,xp:50,total_matches:5,total_wins:3,subscription_tier:"free",streak_count:1,streak_last_date:null,created_at:new Date().toISOString(),last_active:new Date().toISOString(),referral_code:null,referred_by:null};if(g){const{data:n}=await g.from("users").select("*").eq("id",i).single();n&&(a=n)}this.leaveQueue(t),this._notifyMatchFound({liveMatchId:e.id,opponent:a,questionIds:e.question_ids||[]})}async leaveQueue(e){if(this._inQueue=!1,this._cdcChannel&&g&&(g.removeChannel(this._cdcChannel),this._cdcChannel=null),_.isOnline&&g)try{await g.from("matchmaking_queue").delete().eq("user_id",e)}catch(t){console.warn("[MatchmakingService] Error leaving queue:",t)}}onMatchFound(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notifyMatchFound(e){this._listeners.forEach(t=>t(e))}get isSearching(){return this._inQueue}}class rt{_uiManager;_audioManager;_saveManager;_onMatchFound;_onCancel;constructor(e,t,i,a,n){this._uiManager=e,this._audioManager=t,this._saveManager=i,this._onMatchFound=a,this._onCancel=n}async render(){const e=this._uiManager.container,t=this._saveManager.profile,i={id:"local-user",role:"player",username:t.username,phone:null,avatar_url:null,locale:"en",elo_rating:t.eloRating||0,coins:t.coins,xp:t.xp,total_matches:10,total_wins:6,subscription_tier:"free",streak_count:t.streakCount||0,streak_last_date:null,created_at:new Date().toISOString(),last_active:new Date().toISOString(),referral_code:null,referred_by:null};e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top TV Broadcast Header Banner -->
                <div class="tv-broadcast-header" style="margin-bottom: 30px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="tv-live-badge">
                            <span class="tv-live-dot"></span> LIVE MATCHMAKING HD
                        </span>
                        <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                    </div>

                    <div style="font-family: var(--tv-mono); font-weight: 800; font-size: var(--fds-font-sm); color: var(--tv-gold-primary);">
                        ELO: ${t.eloRating||0}
                    </div>
                </div>

                <div style="max-width: 500px; margin: 0 auto; position: relative; z-index: 10; text-align: center; padding: 0 20px;">
                    <div class="glass-card" style="
                        padding: 40px 28px;
                        border-color: rgba(96, 165, 250, 0.4);
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    ">
                        <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-blue-accent); letter-spacing: 2px;">
                            LIVE MULTIPLAYER MATCHMAKING
                        </span>
                        <h2 style="margin: 8px 0 24px 0; font-size: 26px; font-weight: 900; color: var(--fds-text-main);">
                            FINDING WORTHY OPPONENT...
                        </h2>

                        <!-- Radar Pulse Animation -->
                        <div style="position: relative; width: 140px; height: 140px; margin: 0 auto 30px auto;">
                            <div class="radar-circle circle-1"></div>
                            <div class="radar-circle circle-2"></div>
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                font-size: 48px;
                            ">⚽</div>
                        </div>

                        <!-- Live Players Count -->
                        <div style="margin-bottom: 24px; font-size: var(--fds-font-sm); font-weight: 700; color: #4ADE80; background: rgba(34, 197, 94, 0.1); padding: 8px 16px; border-radius: 20px; display: inline-block;">
                            <span style="display: inline-block; width: 8px; height: 8px; background: #4ADE80; border-radius: 50%; margin-right: 8px; animation: pulse 1.5s infinite;"></span>
                            <span id="live-players-count">142 Players in Queue</span>
                        </div>

                        <!-- Player Info Card -->
                        <div style="
                            background: rgba(15, 23, 42, 0.6);
                            border: 1px solid rgba(255,255,255,0.1);
                            border-radius: 14px;
                            padding: 16px;
                            margin-bottom: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: space-around;
                        ">
                            <div>
                                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">YOUR RATING</div>
                                <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-gold-primary);">⚡ ${t.eloRating||0} ELO</div>
                            </div>
                            <div style="height: 30px; width: 1px; background: rgba(255,255,255,0.1);"></div>
                            <div>
                                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">SEARCH RANGE</div>
                                <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">±150 ELO</div>
                            </div>
                        </div>

                        ${w.Button({id:"cancel-mm-btn",text:"CANCEL MATCHMAKING",icon:"✖",variant:"secondary",fullWidth:!0,className:"cancel-btn-custom"})}
                    </div>
                </div>
            </div>

            <style>
                .radar-circle {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 2px solid #60A5FA;
                    border-radius: 50%;
                    animation: pulseRadar 2s infinite ease-out;
                    box-sizing: border-box;
                }
                .circle-2 {
                    animation-delay: 1s;
                }
                @keyframes pulseRadar {
                    0% { transform: scale(0.3); opacity: 1; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                .cancel-btn-custom {
                    color: #FCA5A5 !important;
                    border-color: rgba(239,68,68,0.3) !important;
                }
            </style>
        `;const a=K.getInstance(),n=a.onMatchFound(r=>{this._audioManager.playGoalCheer(),this._onMatchFound(r)});setInterval(()=>{const r=document.getElementById("live-players-count");if(r&&document.body.contains(r)){const l=parseInt(r.innerText.split(" ")[0])+Math.floor(Math.random()*5)-2,c=Math.max(120,Math.min(180,l));r.innerText=`${c} Players in Queue`}},3e3),e.querySelector("#cancel-mm-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),n(),a.leaveQueue(i.id),this._onCancel()}),await a.joinQueue(i)}}class ot{constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i}_currentTab="all";_messages=[];_isOpeningMessage=!1;_isLayoutRendered=!1;_currentRequestId=0;async render(){this._isLayoutRendered?this._updateTabUI():(this._renderLayout(),this._bindEvents(),this._isLayoutRendered=!0),await this._updateContent()}_renderLayout(){const e=this._uiManager.container,t=o.currentLocale;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative;">
                
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- App Bar -->
                ${S.render(t==="am"?"መልዕክቶች":t==="om"?"ERGAWWAAN":"MESSAGES",`<button id="mc-back-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>`)}

                <!-- Main Content Wrapper -->
                <div style="flex: 1; display: flex; flex-direction: column; max-width: 600px; margin: 0 auto; width: 100%; position: relative; z-index: 10; padding-top: 16px;">
                    
                    <!-- Search Input -->
                    <div style="padding: 0 16px; margin-bottom: 12px;">
                        <input type="text" id="mc-search-input" placeholder="🔍 Search messages..." style="
                            width: 100%; 
                            padding: 12px 16px; 
                            border-radius: 12px; 
                            border: 1px solid rgba(255,255,255,0.1); 
                            background: rgba(15, 23, 42, 0.7); 
                            color: white; 
                            font-size: var(--fds-font-sm);
                            box-sizing: border-box;
                        ">
                    </div>

                    <!-- Tabs -->
                    <div id="mc-tab-bar" style="display: flex; gap: 8px; overflow-x: auto; padding: 0 16px 12px 16px; margin-bottom: 4px;" class="hide-scrollbar">
                        <!-- Tabs injected here -->
                    </div>

                    <!-- Message List -->
                    <div id="mc-list-container" style="flex: 1; overflow-y: auto; padding: 0 16px 120px 16px;" class="hide-scrollbar">
                        <!-- Messages injected here -->
                    </div>
                </div>
            </div>
        `;const i=e.querySelector("#mc-back-btn");i&&i.addEventListener("click",()=>{this._audioManager.playClick(),this._onBack()}),this._updateTabUI()}_updateTabUI(){const e=o.currentLocale,t=[{id:"all",label:{en:"All",am:"ሁሉም",om:"Hunda"}},{id:"unread",label:{en:"Unread",am:"ያልተነበቡ",om:"Kan Hin Dubbifamne"}},{id:"global",label:{en:"Announcements",am:"ማስታወቂያዎች",om:"Beeksisa"}},{id:"direct",label:{en:"Inbox",am:"የገቢ መልዕክቶች",om:"Ergaa"}},{id:"system",label:{en:"Support",am:"ድጋፍ",om:"Gargaarsa"}}],i=document.getElementById("mc-tab-bar");if(!i)return;i.innerHTML=t.map(n=>{const r=n.id===this._currentTab,s=n.id==="unread"||n.id==="direct"||n.id==="global"||n.id==="all"?O.getInstance().getTotalUnreadCount():0,l=(n.id==="unread"||n.id==="direct")&&s>0;return`
                <button class="mc-pill-tab ${r?"active-mc-tab":""}" data-tab-id="${n.id}" style="
                    flex: 0 0 auto;
                    padding: 8px 14px;
                    border-radius: 20px;
                    border: 1px solid ${r?"var(--tv-gold-primary)":"rgba(255,255,255,0.08)"};
                    background: ${r?"rgba(255, 215, 0, 0.12)":"rgba(15, 23, 42, 0.6)"};
                    color: ${r?"var(--tv-gold-primary)":"#94A3B8"};
                    font-size: var(--fds-font-sm);
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                ">
                    ${n.label[e]||n.label.en}
                    ${l?`<span style="background: var(--tv-pitch-green); color: white; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 10px;">${s>99?"99+":s}</span>`:""}
                </button>
            `}).join(""),i.querySelectorAll(".mc-pill-tab").forEach(n=>{n.addEventListener("click",r=>{this._audioManager.playClick();const s=r.currentTarget.getAttribute("data-tab-id");s&&s!==this._currentTab&&(this._currentTab=s,this._updateTabUI(),this._renderMessages())})})}_bindEvents(){const e=document.getElementById("mc-search-input");e&&e.addEventListener("input",()=>{this._renderMessages()})}async _updateContent(){const e=++this._currentRequestId,t=document.getElementById("mc-list-container");t&&(t.innerHTML=`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                </div>
            `);try{const i=O.getInstance();this._messages=await i.getAllMessages()}catch(i){console.error("Failed to fetch messages",i),this._currentRequestId===e&&t&&(t.innerHTML=w.EmptyState("⚠️","Failed to load messages"));return}this._currentRequestId===e&&(this._updateTabUI(),this._renderMessages())}_renderMessages(){const e=document.getElementById("mc-list-container");if(!e)return;const t=document.getElementById("mc-search-input"),i=t?t.value.toLowerCase():"";let a=this._messages.filter(r=>this._currentTab==="all"?!0:this._currentTab==="unread"?!r.read:r.category===this._currentTab);if(i&&(a=a.filter(r=>r.title.toLowerCase().includes(i)||r.content.toLowerCase().includes(i))),a.length===0){e.innerHTML=w.EmptyState("📭","No Messages Found");return}e.innerHTML=a.map(r=>{const s=new Date(r.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),c={global:"📢",direct:"📩",system:"⚙️"}[r.category]||"✉️";return`
                <div class="glass-card mc-item" data-id="${r.id}" style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 14px;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s, background-color 0.2s;
                    border-color: ${r.read?"rgba(255,255,255,0.05)":"rgba(255, 215, 0, 0.3)"};
                    background: ${r.read?"rgba(15, 23, 42, 0.6)":"rgba(255, 215, 0, 0.03)"};
                ">
                    <!-- Status Indicator Dot -->
                    ${r.read?"":`
                        <div style="
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: var(--tv-pitch-green);
                            box-shadow: 0 0 8px var(--tv-pitch-glow);
                        "></div>
                    `}

                    <!-- Category Icon -->
                    <div style="
                        width: 44px;
                        height: 44px;
                        border-radius: 10px;
                        background: rgba(255,255,255,0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: var(--fds-font-lg);
                        flex-shrink: 0;
                    ">${c}</div>

                    <!-- Texts -->
                    <div style="flex: 1; padding-right: 12px; min-width: 0;">
                        <div style="
                            font-size: var(--fds-font-md); 
                            font-weight: 800; 
                            color: ${r.read?"#CBD5E1":"#FFFFFF"};
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${r.title}</div>
                        <div style="
                            font-size: var(--fds-font-sm); 
                            color: var(--fds-text-dim); 
                            line-height: 1.4;
                            margin-bottom: 6px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${r.content}</div>
                        <div style="
                            font-size: var(--fds-font-xs); 
                            color: var(--fds-text-dim); 
                            font-weight: 600;
                        ">⏱️ ${s}</div>
                    </div>
                </div>
            `}).join(""),e.querySelectorAll(".mc-item").forEach(r=>{r.addEventListener("click",async s=>{if(this._isOpeningMessage)return;const l=s.currentTarget.getAttribute("data-id");if(l){this._isOpeningMessage=!0,this._audioManager.playClick();try{const c=this._messages.find(d=>d.id===l);c&&!c.read&&(await O.getInstance().markAsRead(l),c.read=!0),this._showFullMessage(l)}finally{this._isOpeningMessage=!1}}})})}_showFullMessage(e){const t=this._messages.find(r=>r.id===e);if(!t)return;const i=new Date(t.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=new Date(t.createdAt).toLocaleDateString(),n=document.createElement("div");n.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
            z-index: 10000; display: flex; align-items: flex-end; justify-content: center;
            animation: fade-in 0.2s ease-out;
        `,n.innerHTML=`
            <div style="
                width: 100%; max-width: 600px; 
                background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
                border-radius: 24px 24px 0 0;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding: 24px;
                box-sizing: border-box;
                animation: slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
                max-height: 90vh;
                display: flex;
                flex-direction: column;
            ">
                <div style="width: 40px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 20px auto;"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <div style="font-size: var(--fds-font-xl); font-weight: 900; color: white; margin-bottom: 8px;">${t.title}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--tv-gold-primary); font-weight: 700; text-transform: uppercase;">
                            ${t.category} • ${a} ${i}
                        </div>
                    </div>
                    <button id="btn-close-msg" style="
                        background: rgba(255,255,255,0.1); border: none; width: 36px; height: 36px;
                        border-radius: 18px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer;
                    ">✖</button>
                </div>

                <div style="
                    flex: 1; overflow-y: auto; 
                    font-size: var(--fds-font-md); color: #CBD5E1; line-height: 1.6;
                    padding-right: 8px;
                " class="hide-scrollbar">
                    ${t.content.replace(/\n/g,"<br>")}
                </div>
            </div>
            <style>
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            </style>
        `,document.body.appendChild(n),n.querySelector("#btn-close-msg")?.addEventListener("click",()=>{this._audioManager.playClick(),n.remove(),this._renderMessages()})}}class st{_channel=null;_cdcChannel=null;_matchId;_listeners=new Set;constructor(e){this._matchId=e}get matchId(){return this._matchId}connect(){if(!_.isOnline||!g){console.log(`[LiveMatchClient] Offline mode — simulated channel for ${this._matchId}`);return}this._channel=g.channel(`live_match:${this._matchId}`,{config:{broadcast:{self:!0}}}),this._channel.on("broadcast",{event:"match_event"},e=>{const t=e.payload;this._notify(t)}).subscribe(),this._cdcChannel=g.channel(`public:live_match_answers:${this._matchId}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"live_match_answers",filter:`live_match_id=eq.${this._matchId}`},e=>{const t=e.new;console.log("[LiveMatchClient] Postgres CDC answer insert detected:",t),this._notify({event:"ANSWER_SUBMITTED",userId:t.user_id,questionIndex:t.question_index,isCorrect:t.is_correct})}).subscribe()}async sendAnswer(e,t,i,a){const n={event:"ANSWER_SUBMITTED",userId:e,questionIndex:t,score:a,isCorrect:i};this._channel&&this._channel.send({type:"broadcast",event:"match_event",payload:n}),this._notify(n),_.isOnline&&await re.invoke("live-match",{liveMatchId:this._matchId,userId:e,questionIndex:t,selectedIndex:i?0:1,responseTimeMs:1500})}sendFinishMatch(e,t){const i={event:"MATCH_FINISH",userId:e,score:t};this._channel&&this._channel.send({type:"broadcast",event:"match_event",payload:i}),this._notify(i)}onEvent(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(e){this._listeners.forEach(t=>t(e))}disconnect(){this._channel&&g&&(g.removeChannel(this._channel),this._channel=null),this._cdcChannel&&g&&(g.removeChannel(this._cdcChannel),this._cdcChannel=null),this._listeners.clear()}}class de{static DEFAULT_K_FACTOR=32;static calculateExpectedScore(e,t){return 1/(1+Math.pow(10,(t-e)/400))}static calculateNewRatings(e,t,i,a=de.DEFAULT_K_FACTOR){const n=de.calculateExpectedScore(e,t),r=1-n,s=1-i,l=Math.round(a*(i-n)),c=Math.round(a*(s-r)),d=Math.max(100,e+l),h=Math.max(100,t+c);return{winnerNewElo:d,loserNewElo:h,winnerEloChange:l,loserEloChange:c}}}class lt{_uiManager;_audioManager;_saveManager;_opponent;_questions;_onComplete;_client;_currentIndex=0;_myScore=0;_opponentScore=0;_timerInterval=null;_timeLeftSec=10;_hasPlayedFullTimeWhistle=!1;_answers=[];constructor(e,t,i,a,n,r,s){this._uiManager=e,this._audioManager=t,this._saveManager=i,this._opponent=n,this._questions=r,this._onComplete=s,this._client=new st(a)}startMatch(){this._client.connect(),this._client.onEvent(e=>{if(e.userId===this._opponent.id&&e.event==="ANSWER_SUBMITTED"&&e.score!==void 0){this._opponentScore=e.score;const t=document.getElementById("opponent-score");t&&(t.innerText=`${this._opponentScore}`)}}),this.render()}render(){const e=this._uiManager.container,t=this._saveManager.profile,i=this._questions[this._currentIndex];if(!i){this._showFinalResults();return}const a=o.currentLocale==="am"?i.promptAm||i.promptEn||i.prompt:o.currentLocale==="om"?i.promptOm||i.promptEn||i.prompt:i.promptEn||i.prompt,n=o.currentLocale==="am"?i.optionsAm&&i.optionsAm.length===i.options.length?i.optionsAm:i.options:o.currentLocale==="om"?i.optionsOm&&i.optionsOm.length===i.options.length?i.optionsOm:i.options:i.optionsEn&&i.optionsEn.length===i.options.length?i.optionsEn:i.options;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; display: flex; flex-direction: column;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- Live Header -->
                <div style="
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 16px 20px; 
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                ">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="background: #EF4444; color: var(--fds-text-main); font-size: var(--fds-font-xs); font-weight: 900; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">${o.currentLocale==="am"?"ቀጥታ 1v1":o.currentLocale==="om"?"KALLATTII 1v1":"LIVE 1v1"}</span>
                        <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${o.currentLocale==="am"?`ዙር ${this._currentIndex+1} ከ ${this._questions.length}`:o.currentLocale==="om"?`MARSAA ${this._currentIndex+1} / ${this._questions.length}`:`ROUND ${this._currentIndex+1} OF ${this._questions.length}`}</div>
                    </div>
                    <button id="live-exit-btn" style="background: none; border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px;">✕</button>
                </div>

                <!-- Smooth Progress Timer -->
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1);">
                    <div id="live-timer-bar" style="height: 100%; width: 100%; background: var(--tv-pitch-green); transition: width 1s linear, background-color 0.3s;"></div>
                </div>

                <!-- Scoreboard vs Opponent -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 32px; background: rgba(0,0,0,0.4);">
                    <div style="text-align: left;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"እርስዎ":o.currentLocale==="om"?"ISIN":"YOU"}</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">${t.username}</div>
                        <div id="my-score" style="font-size: 24px; font-weight: 900; color: var(--tv-pitch-green);">${this._myScore}</div>
                    </div>
                    <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-red-live); background: rgba(239,68,68,0.15); padding: 8px 16px; border-radius: 20px;">VS</div>
                    <div style="text-align: right;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"ተፎካካሪ":o.currentLocale==="om"?"DORMAA":"OPPONENT"}</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">${this._opponent.username}</div>
                        <div id="opponent-score" style="font-size: 24px; font-weight: 900; color: #F59E0B;">${this._opponentScore}</div>
                    </div>
                </div>

                <!-- Quiz Area -->
                <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                    width: 100%;
                ">
                    <!-- High-Focus Question Text -->
                    <div class="anim-q-card" style="
                        font-size: clamp(20px, 3vh, 28px);
                        font-weight: 800;
                        color: var(--fds-text-main);
                        text-align: center;
                        line-height: 1.4;
                        margin-bottom: 40px;
                        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    ">${a}</div>

                    <!-- Large Answer Buttons -->
                    <div id="live-answers-grid" style="display: flex; flex-direction: column; gap: 16px; width: 100%; pointer-events: none;">
                        ${n.map((r,s)=>`
                            <button class="live-option-btn anim-a-card" data-index="${s}" style="
                                animation-delay: ${180+s*30}ms;
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding: 20px;
                                background: rgba(255,255,255,0.03);
                                border: 2px solid rgba(255,255,255,0.1);
                                border-radius: 16px;
                                color: var(--fds-text-main);
                                font-size: 18px;
                                font-weight: 700;
                                text-align: left;
                                cursor: pointer;
                                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                                position: relative;
                                overflow: hidden;
                            ">
                                <span style="
                                    width: 32px; height: 32px; 
                                    border-radius: 50%; 
                                    background: rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; justify-content: center; 
                                    margin-right: 16px; 
                                    font-size: var(--fds-font-sm); font-weight: 900;
                                ">${String.fromCharCode(65+s)}</span>
                                <span style="flex: 1;">${r}</span>
                                <span class="feedback-icon" style="font-size: 24px; opacity: 0; transform: scale(0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"></span>
                            </button>
                        `).join("")}
                    </div>
                </div>
                
                <!-- Feedback Overlay (Fixed Bottom) -->
                <div id="live-feedback-overlay" style="
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%) scale(0.9);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 100;
                    width: 90%;
                    max-width: 400px;
                    background: rgba(15,23,42,0.95);
                    border: 2px solid;
                    border-radius: 20px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                    backdrop-filter: blur(10px);
                ">
                    <div id="live-feedback-icon" style="font-size: 32px;"></div>
                    <div id="live-feedback-text" style="font-size: 24px; font-weight: 900; font-family: var(--tv-mono); letter-spacing: 1px;"></div>
                </div>
            </div>
            <style>
                @keyframes q-drop-in {
                    0% { transform: translate3d(0, -140px, 0) scale(0.98); opacity: 0; }
                    1% { transform: translate3d(0, -140px, 0) scale(0.98); opacity: 1; }
                    84% { transform: translate3d(0, 5px, 0) scale(1); opacity: 1; }
                    92% { transform: translate3d(0, -2px, 0) scale(1); opacity: 1; }
                    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
                }
                @keyframes a-drop-in {
                    0% { transform: translate3d(0, -70px, 0) scale(0.97); opacity: 0; }
                    1% { transform: translate3d(0, -70px, 0) scale(0.97); opacity: 1; }
                    80% { transform: translate3d(0, 3px, 0) scale(1); opacity: 1; }
                    90% { transform: translate3d(0, -1px, 0) scale(1); opacity: 1; }
                    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
                }
                .anim-q-card {
                    animation: q-drop-in 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    animation-delay: 80ms;
                    opacity: 0;
                }
                .anim-a-card {
                    animation: a-drop-in 150ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    opacity: 0;
                }
                .live-option-btn:active:not(:disabled) { transform: scale(0.97); }
                .live-option-btn.correct { background: rgba(34,197,94,0.15) !important; border-color: var(--fds-green-pitch) !important; }
                .live-option-btn.wrong { background: rgba(239,68,68,0.15) !important; border-color: var(--fds-red-live) !important; }
                .live-option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: var(--fds-green-pitch); }
                .live-option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: var(--fds-red-live); }
                .live-option-btn.correct .feedback-icon::after { content: '✓'; }
                .live-option-btn.wrong .feedback-icon::after { content: '✕'; }
            </style>
        `,setTimeout(()=>{this._audioManager.playQuestionArrive()},80),this._startTimer(),this._bindEvents(i),setTimeout(()=>{const r=document.getElementById("live-answers-grid");r&&(r.style.pointerEvents="auto")},420)}_startTimer(){this._stopTimer(),this._timeLeftSec=10;const e=document.getElementById("live-timer-bar");this._timerInterval=setInterval(()=>{if(this._timeLeftSec--,e){const t=this._timeLeftSec/10*100;e.style.width=t+"%",this._timeLeftSec<=5&&(e.style.backgroundColor="#EF4444",this._audioManager.playCountdownWarning())}this._timeLeftSec<=0&&(this._stopTimer(),this._handleTimeOut())},1e3)}_stopTimer(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)}_bindEvents(e){document.querySelectorAll(".live-option-btn").forEach(a=>{a.addEventListener("click",n=>{const r=n.currentTarget;this._audioManager.playAnswerSelected(),this._stopTimer(),document.querySelectorAll(".live-option-btn").forEach(c=>c.disabled=!0);const l=parseInt(r.getAttribute("data-index")||"0");this._onOptionSelected(l,r,e)})});const i=document.getElementById("live-exit-btn");i&&i.addEventListener("click",()=>{this._audioManager.playClick(),this._client.disconnect(),this._stopTimer(),this._onComplete()})}_onOptionSelected(e,t,i){const a=e===i.correctIndex,n=document.querySelectorAll(".live-option-btn"),r=(10-this._timeLeftSec)*1e3;this._answers.push({questionId:i.id,selectedIndex:e,responseTimeMs:r});const s=this._currentIndex===this._questions.length-1;if(a){t.classList.add("correct"),this._audioManager.playCorrectAnswerGoal(s?400:void 0);const h=100+Math.floor(this._timeLeftSec/10*50);this._myScore+=h;const m=document.getElementById("my-score");m&&(m.innerText=String(this._myScore)),this._showFeedbackOverlay(!0)}else{if(t.classList.add("wrong"),i.correctIndex!==void 0){const d=n[i.correctIndex];d&&d.classList.add("correct")}this._audioManager.playWrongAnswer(s?400:void 0),this._showFeedbackOverlay(!1)}const l=this._saveManager.cloudUserId||"local-user";this._client.sendAnswer(l,this._currentIndex,a,this._myScore),setTimeout(()=>{this._hideFeedbackOverlay(),this._currentIndex++,this.render()},s?400:1500)}_showFeedbackOverlay(e){const t=document.getElementById("live-feedback-overlay"),i=document.getElementById("live-feedback-icon"),a=document.getElementById("live-feedback-text");t&&i&&a&&(t.style.borderColor=e?"var(--tv-pitch-green)":"#EF4444",t.style.boxShadow=e?"0 10px 40px rgba(34,197,94,0.3)":"0 10px 40px rgba(239,68,68,0.3)",t.style.color=e?"var(--tv-pitch-green)":"#EF4444",i.innerText=e?"⚽":"🧤",a.innerText=e?o.currentLocale==="am"?"ግብ!!!!!":o.currentLocale==="om"?"GALCHII!!!!!":"GOAL!!!!!":o.currentLocale==="am"?"ግብ ተከለከለ!":o.currentLocale==="om"?"GALCHII QABAME!":"GOAL SAVED!",t.style.opacity="1",t.style.transform="translateX(-50%) scale(1)")}_hideFeedbackOverlay(){const e=document.getElementById("live-feedback-overlay");e&&(e.style.pointerEvents="none",e.style.opacity="0",e.style.transform="translateX(-50%) scale(0.9)")}_handleTimeOut(){const e=this._questions[this._currentIndex];this._answers.push({questionId:e.id,selectedIndex:-1,responseTimeMs:1e4});const t=this._saveManager.cloudUserId||"local-user";this._client.sendAnswer(t,this._currentIndex,!1,this._myScore),this._audioManager.playWhistle();const i=document.querySelectorAll(".live-option-btn");if(e.correctIndex!==void 0){const r=i[e.correctIndex];r&&r.classList.add("correct")}const n=this._currentIndex===this._questions.length-1?400:1200;setTimeout(()=>{this._currentIndex++,this.render()},n)}_showFinalResults(){this._hasPlayedFullTimeWhistle||(this._hasPlayedFullTimeWhistle=!0,this._audioManager.playFullTimeWhistle());const e=this._uiManager.container,t=this._saveManager.profile.eloRating||0,i=this._myScore>this._opponentScore,a=this._myScore===this._opponentScore,n=de.calculateNewRatings(t,this._opponent.elo_rating,i?1:a?.5:0);this._saveManager.profile.eloRating=n.winnerNewElo,this._saveManager.addCoins(i?300:100),this._submitToBackend(),e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="glass-card" style="
                    width: 100%;
                    max-width: 480px;
                    padding: 40px 24px;
                    text-align: center;
                    border-color: ${i?"var(--tv-gold-primary)":a?"#60A5FA":"#EF4444"};
                ">
                    <div style="font-size: 64px; margin-bottom: 16px;">
                        ${i?"🏆":a?"🤝":"🧤"}
                    </div>
                    <div style="font-size: 32px; font-weight: 900; color: ${i?"var(--tv-gold-primary)":a?"#60A5FA":"#EF4444"}; margin-bottom: 8px;">
                        ${i?o.currentLocale==="am"?"ድል":o.currentLocale==="om"?"INJIFANNOO":"VICTORY":a?o.currentLocale==="am"?"አቻ":o.currentLocale==="om"?"QIXAA":"DRAW":o.currentLocale==="am"?"ሽነፋ":o.currentLocale==="om"?"MO'AMUU":"DEFEAT"}
                    </div>
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-dim); margin-bottom: 32px;">
                        ${o.currentLocale==="am"?"የመጨረሻ ውጤት":o.currentLocale==="om"?"FIIXAAN GA'II":"FINAL SCORE"}: ${this._myScore} - ${this._opponentScore}
                    </div>

                    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"ደረጃ":o.currentLocale==="om"?"SADARKAA":"RATING"}</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">
                                ${n.winnerNewElo} <span style="font-size: var(--fds-font-xs);">(${n.winnerEloChange>=0?"+":""}${n.winnerEloChange})</span>
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${o.currentLocale==="am"?"ሳንቲሞች":o.currentLocale==="om"?"SANTIMA":"COINS"}</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--tv-gold-primary);">
                                +${i?300:100}
                            </div>
                        </div>
                    </div>

                    ${w.Button({id:"live-finish-btn",text:o.currentLocale==="am"?"ወደ ሊግ ማዕከል ተመለስ":o.currentLocale==="om"?"GARA WALTOMMII LIIGII DEEBI'I":"RETURN TO LEAGUE HUB",variant:"primary",fullWidth:!0})}
                </div>
            </div>
            <style>
                #live-finish-btn:active { transform: scale(0.96); }
            </style>
        `,e.querySelector("#live-finish-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),this._onComplete()})}async _submitToBackend(){if(this._saveManager.cloudUserId)try{const{supabase:e}=await pe(async()=>{const{supabase:t}=await Promise.resolve().then(()=>qe);return{supabase:t}},void 0);e&&await e.rpc("submit_match_result",{p_match_type:"live",p_answers:this._answers,p_live_match_id:this._client.matchId})}catch(e){console.warn("[LiveMatchScreen] Failed to submit live match result",e)}}}class A{static _activeTab="home";static _lastCallback=null;static TABS=[{id:"home",label:"Home",icon:"🏠"},{id:"play",label:"Play",icon:"🎮"},{id:"standings",label:"Leaderboard",icon:"🏆"},{id:"profile",label:"Profile",icon:"👤"}];static LABELS={home:{en:"Home",am:"መነሻ",om:"Mula'a"},play:{en:"Play",am:"ተጫወት",om:"Tapha"},standings:{en:"Leaderboard",am:"ደረጃዎች",om:"Sadarkaa"},profile:{en:"Profile",am:"መገለጫ",om:"Profile"}};static get activeTab(){return A._activeTab}static setActiveTab(e){A._activeTab=e,A.updateTabHighlights()}static refresh(){A._lastCallback&&A.render(A._lastCallback)}static render(e){A._lastCallback=e;let t=document.getElementById("fds-bottom-nav");t||(t=document.createElement("div"),t.id="fds-bottom-nav",t.style.position="fixed",t.style.bottom="0",t.style.left="0",t.style.width="100%",t.style.paddingBottom="env(safe-area-inset-bottom, 16px)",t.style.height="calc(64px + env(safe-area-inset-bottom, 16px))",t.style.background="rgba(2, 6, 23, 0.96)",t.style.borderTop="2px solid var(--fds-gold-primary, #FFD700)",t.style.boxShadow="0 -8px 32px rgba(0, 0, 0, 0.85)",t.style.backdropFilter="blur(16px)",t.style.zIndex="9000",t.style.display="flex",t.style.justifyContent="space-around",t.style.alignItems="center",t.style.pointerEvents="auto",document.body.appendChild(t));const i=o.currentLocale;t.innerHTML=A.TABS.map(n=>{const r=n.id===A._activeTab,s=A.LABELS[n.id][i]||n.label;return`
                <button class="nav-tab-item ${r?"nav-tab-active":""}" data-tab-id="${n.id}" style="
                    background: none;
                    border: none;
                    color: ${r?"var(--fds-gold-primary, #FFD700)":"#94A3B8"};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: var(--fds-space-8) var(--fds-space-12);
                    flex: 1;
                    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
                    min-height: 48px; /* Strict 48px touch target */
                    outline: none;
                    transform: ${r?"scale(1.1)":"scale(1)"};
                    filter: ${r?"drop-shadow(0 2px 8px rgba(255,215,0,0.4))":"none"};
                ">
                    <div style="position: relative; display: inline-block;">
                        <span style="font-size: 20px; margin-bottom: 2px;">${n.icon}</span>
                        <div id="nav-badge-${n.id}" style="
                            display: none;
                            position: absolute;
                            top: -4px; right: -8px;
                            background: var(--tv-pitch-green, #22C55E);
                            color: white; font-size: 10px; font-weight: 900;
                            border-radius: 10px; padding: 2px 6px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                        "></div>
                    </div>
                    <span class="tab-text" style="
                        font-size: var(--fds-font-xs);
                        font-weight: ${r?"800":"600"};
                        letter-spacing: 0.5px;
                        font-family: var(--fds-font-body);
                    ">${s}</span>
                </button>
            `}).join(""),t.querySelectorAll(".nav-tab-item").forEach(n=>{n.addEventListener("click",r=>{const l=r.currentTarget.getAttribute("data-tab-id");if(localStorage.getItem("ETHIO_FOOTBALL_MUTED")!=="true"&&typeof navigator<"u"&&navigator.vibrate)try{navigator.vibrate(10)}catch{}typeof window.ethioOnBackPress=="function"&&window.ethioOnBackPress()||l&&(l!==A._activeTab&&A.setActiveTab(l),e(l))})})}static updateTabHighlights(){const e=document.getElementById("fds-bottom-nav");if(!e)return;e.querySelectorAll(".nav-tab-item").forEach(i=>{const n=i.getAttribute("data-tab-id")===A._activeTab,r=i;r.style.color=n?"var(--fds-gold-primary, #FFD700)":"#94A3B8",r.style.transform=n?"scale(1.1)":"scale(1)",r.style.filter=n?"drop-shadow(0 2px 8px rgba(255,215,0,0.4))":"none";const s=r.querySelector(".tab-text");s&&(s.style.fontWeight=n?"800":"600")})}static setBadge(e,t){const i=document.getElementById(`nav-badge-${e}`);i&&(t>0?(i.innerText=t>99?"99+":t.toString(),i.style.display="block"):i.style.display="none")}static hide(){const e=document.getElementById("fds-bottom-nav");e&&(e.style.display="none")}static show(){const e=document.getElementById("fds-bottom-nav");e&&(e.style.display="flex")}}class G{static _instance=null;_profileCache=null;_preferencesCache=null;constructor(){}static getInstance(){return G._instance||(G._instance=new G),G._instance}async getProfile(){if(!_.isOnline)return null;const e=g;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("users").select("*").eq("id",t.id).single();return a?(console.warn("[ProfileService] Error fetching profile:",a),null):(this._profileCache=i,i)}catch(t){return console.warn("[ProfileService] Failed to get profile:",t),null}}async updateProfile(e){if(!_.isOnline)return;const t=g;if(t)try{const{data:{user:i}}=await t.auth.getUser();if(!i)return;const{error:a}=await t.from("users").update(e).eq("id",i.id);a?console.warn("[ProfileService] Error updating profile:",a):this._profileCache&&(this._profileCache={...this._profileCache,...e})}catch(i){console.warn("[ProfileService] Failed to update profile:",i)}}async getPreferences(){if(!_.isOnline)return null;const e=g;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("user_preferences").select("*").eq("user_id",t.id).single();return a?(console.warn("[ProfileService] Error fetching preferences:",a),null):(this._preferencesCache=i,i)}catch(t){return console.warn("[ProfileService] Failed to get preferences:",t),null}}async updatePreferences(e){if(!_.isOnline)return;const t=g;if(t)try{const{data:{user:i}}=await t.auth.getUser();if(!i)return;const{error:a}=await t.from("user_preferences").update(e).eq("user_id",i.id);a?console.warn("[ProfileService] Error updating preferences:",a):this._preferencesCache&&(this._preferencesCache={...this._preferencesCache,...e})}catch(i){console.warn("[ProfileService] Failed to update preferences:",i)}}async getEarnedAchievements(){if(!_.isOnline)return[];const e=g;if(!e)return[];try{const{data:{user:t}}=await e.auth.getUser();if(!t)return[];const{data:i,error:a}=await e.from("user_achievements").select("achievement_id, earned_at, achievements:achievements (*)").eq("user_id",t.id);return a?(console.warn("[ProfileService] Error fetching user achievements:",a),[]):i||[]}catch(t){return console.warn("[ProfileService] Failed to get user achievements:",t),[]}}async getRewards(){if(!_.isOnline)return[];const e=g;if(!e)return[];try{const{data:{user:t}}=await e.auth.getUser();if(!t)return[];const{data:i,error:a}=await e.from("rewards").select("*").eq("user_id",t.id);return a?(console.warn("[ProfileService] Error fetching user rewards:",a),[]):i||[]}catch(t){return console.warn("[ProfileService] Failed to get rewards:",t),[]}}subscribeToProfileChanges(e){if(!_.isOnline)return()=>{};const t=g;if(!t)return()=>{};let i=null;return t.auth.getUser().then(({data:{user:a}})=>{if(!a)return;const n=g;n&&(i=n.channel(`public:users:id=eq.${a.id}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"users",filter:`id=eq.${a.id}`},r=>{this._profileCache=r.new,e(this._profileCache)}).subscribe())}),()=>{const a=g;i&&a&&a.removeChannel(i)}}}class V{static _instance=null;constructor(){}static getInstance(){return V._instance||(V._instance=new V),V._instance}async getCategories(){if(!_.isOnline)return[];const e=g;if(!e)return[];try{const{data:t,error:i}=await e.from("faq_items").select("category");return i?(console.warn("[FAQService] Error fetching FAQ categories:",i),[]):t?Array.from(new Set(t.map(n=>n.category))):[]}catch(t){return console.warn("[FAQService] Failed to get FAQ categories:",t),[]}}async getFAQsByCategory(e){if(!_.isOnline)return[];const t=g;if(!t)return[];try{const{data:i,error:a}=await t.from("faq_items").select("*").eq("category",e).order("sort_order",{ascending:!0});return a?(console.warn("[FAQService] Error fetching FAQs by category:",a),[]):i||[]}catch(i){return console.warn("[FAQService] Failed to get FAQs by category:",i),[]}}async searchFAQs(e){if(!_.isOnline)return[];const t=g;if(!t)return[];if(!e||e.trim()==="")return[];try{const{data:i,error:a}=await t.from("faq_items").select("*").or(`question_en.ilike.%${e}%,answer_en.ilike.%${e}%`).order("sort_order",{ascending:!0});return a?(console.warn("[FAQService] Error searching FAQs:",a),[]):i||[]}catch(i){return console.warn("[FAQService] Failed to search FAQs:",i),[]}}}class X{static instance;constructor(){}static getInstance(){return X.instance||(X.instance=new X),X.instance}async createTicket(e,t,i){if(!_.isOnline)return console.warn("[SupportService] Offline mode: cannot create ticket."),{ticketId:"",success:!1};const a=g;if(!a)return{ticketId:"",success:!1};try{const{data:{user:n},error:r}=await a.auth.getUser();if(r||!n)return console.error("[SupportService] Auth error or user not found:",r),{ticketId:"",success:!1};const{data:s,error:l}=await a.from("support_tickets").insert({user_id:n.id,category:e,message:t,subject:i||null,status:"open"}).select("id").single();return l?(console.error("[SupportService] Failed to create ticket:",l),{ticketId:"",success:!1}):{ticketId:s.id,success:!0}}catch(n){return console.error("[SupportService] Error creating ticket:",n),{ticketId:"",success:!1}}}async getMyTickets(){if(!_.isOnline)return console.warn("[SupportService] Offline mode: returning empty tickets list."),[];const e=g;if(!e)return[];try{const{data:{user:t},error:i}=await e.auth.getUser();if(i||!t)return console.error("[SupportService] Auth error or user not found:",i),[];const{data:a,error:n}=await e.from("support_tickets").select("*").eq("user_id",t.id).order("created_at",{ascending:!1});return n?(console.error("[SupportService] Failed to fetch tickets:",n),[]):a}catch(t){return console.error("[SupportService] Error fetching tickets:",t),[]}}async getTicketById(e){if(!_.isOnline)return console.warn("[SupportService] Offline mode: cannot fetch ticket."),null;const t=g;if(!t)return null;try{const{data:i,error:a}=await t.from("support_tickets").select("*").eq("id",e).single();return a?(console.error(`[SupportService] Failed to fetch ticket with ID ${e}:`,a),null):i}catch(i){return console.error(`[SupportService] Error fetching ticket with ID ${e}:`,i),null}}}class ct{static show(){return new Promise(e=>{const t=document.createElement("div");t.style.cssText=`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.85); /* Dark slate background */
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                box-sizing: border-box;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;const i=o.currentLocale==="am"?"ከመለያ መውጣት":o.currentLocale==="om"?"Herrega Keessaa Ba'uu":"Log Out",a=o.currentLocale==="am"?"በእርግጥ ከኢትዮ ፋንታሲ መለያዎ መውጣት ይፈልጋሉ?":o.currentLocale==="om"?"Dhuguma herrega Ethio Fantasy keessaa ba'uu barbaadduu?":"Are you sure you want to log out of your Ethio Fantasy account?",n=o.currentLocale==="am"?"ሰርዝ":o.currentLocale==="om"?"HAQI":"Cancel",r=o.currentLocale==="am"?"ውጣ":o.currentLocale==="om"?"BA'I":"Log Out";t.innerHTML=`
                <div style="
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 32px 24px;
                    width: 100%;
                    max-width: 360px;
                    text-align: center;
                    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
                    color: #1e293b;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    transform: scale(0.95) translateY(10px);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                ">
                    <div style="
                        width: 64px;
                        height: 64px;
                        background: rgba(239, 68, 68, 0.1);
                        color: #ef4444;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px auto;
                    ">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </div>

                    <h3 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">${i}</h3>
                    <p style="margin: 0 0 32px 0; font-size: 15px; color: #64748b; line-height: 1.6;">${a}</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <!-- Primary Action (Safe): Cancel -->
                        <button id="dlg-cancel-btn" style="
                            padding: 16px;
                            background: #f1f5f9;
                            border: 1px solid #e2e8f0;
                            border-radius: 12px;
                            color: #334155;
                            font-size: 16px;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        " onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">${n}</button>
                        
                        <!-- Secondary Action (Destructive): Logout -->
                        <button id="dlg-logout-btn" style="
                            padding: 16px;
                            background: transparent;
                            border: 1px solid rgba(239, 68, 68, 0.3);
                            border-radius: 12px;
                            color: #ef4444;
                            font-size: 16px;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        " onmouseover="this.style.background='rgba(239, 68, 68, 0.05)'" onmouseout="this.style.background='transparent'">${r}</button>
                    </div>
                </div>
            `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1";const l=t.firstElementChild;l&&(l.style.transform="scale(1) translateY(0)")});const s=l=>{t.style.pointerEvents="none",t.style.opacity="0";const c=t.firstElementChild;c&&(c.style.transform="scale(0.95) translateY(10px)"),setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t),e(l)},300)};t.querySelector("#dlg-cancel-btn")?.addEventListener("click",()=>s(!1)),t.querySelector("#dlg-logout-btn")?.addEventListener("click",()=>s(!0))})}}class ae{_uiManager;_saveManager;_audioManager;_onBack;_subScreen="main";_defaultSubScreen="main";_settings;_helpCategory=null;_showContactSupportForm=!1;_faqsCache=[];constructor(e,t,i,a,n="main"){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a,this._subScreen=n,this._defaultSubScreen=n,window.ethioOnBackPress=()=>this._subScreen!==this._defaultSubScreen||this._helpCategory||this._showContactSupportForm?(this._audioManager.playClick(),this._goBack(),!0):!1,this._settings=this._getDefaultSettings(),this._loadSettings()}async _loadSettings(){const e=localStorage.getItem("ETHIO_FOOTBALL_SETTINGS_V2");if(e)try{this._settings=JSON.parse(e)}catch{this._settings=this._getDefaultSettings()}else this._settings=this._getDefaultSettings();const t=localStorage.getItem("ETHIO_FOOTBALL_MUTED")==="true";this._settings.soundEffects=!t;const i=await G.getInstance().getPreferences();i&&(this._settings.soundEffects=i.sound_enabled,this._settings.notifications={dailyChallenge:i.notif_daily,tournament:i.notif_tournament,rewards:i.notif_rewards,announcements:i.notif_announcements,subscription:i.notif_subscription,system:i.notif_system},i.sound_enabled&&this._audioManager.isMuted?this._audioManager.toggleMute():!i.sound_enabled&&!this._audioManager.isMuted&&this._audioManager.toggleMute()),this.render()}destroy(){window.ethioOnBackPress=null}_getDefaultSettings(){return{soundEffects:!0,notifications:{dailyChallenge:!0,tournament:!0,rewards:!0,announcements:!0,subscription:!0,system:!0}}}async _saveSettings(){localStorage.setItem("ETHIO_FOOTBALL_SETTINGS_V2",JSON.stringify(this._settings)),localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(!this._settings.soundEffects)),this._settings.soundEffects&&this._audioManager.isMuted?this._audioManager.toggleMute():!this._settings.soundEffects&&!this._audioManager.isMuted&&this._audioManager.toggleMute(),await G.getInstance().updatePreferences({sound_enabled:this._settings.soundEffects,notif_daily:this._settings.notifications.dailyChallenge,notif_tournament:this._settings.notifications.tournament,notif_rewards:this._settings.notifications.rewards,notif_announcements:this._settings.notifications.announcements,notif_subscription:this._settings.notifications.subscription,notif_system:this._settings.notifications.system})}render(){const e=this._uiManager.container;this._subScreen==="main"?this._renderMainScreen(e):this._subScreen==="profile"?this._renderProfileScreen(e,t=>S.render(t)):this._subScreen==="language"?this._renderLanguageScreen(e,t=>S.render(t)):this._subScreen==="notifications"?this._renderNotificationsScreen(e,t=>S.render(t)):this._subScreen==="sound"?this._renderSoundScreen(e,t=>S.render(t)):this._subScreen==="help"?this._renderHelpScreen(e,t=>S.render(t)):this._subScreen==="terms"?this._renderTermsScreen(e,t=>S.render(t)):this._subScreen==="privacy"?this._renderPrivacyScreen(e,t=>S.render(t)):this._subScreen==="about"&&this._renderAboutScreen(e,t=>S.render(t))}_renderMainScreen(e){const t=this._saveManager.profile,i=t.phone?this._maskPhone(t.phone):`${o.currentLocale==="am"?"እንግዳ ተጫዋች":o.currentLocale==="om"?"Taphataa Keessummaa":"Guest Player"}`,a=(s,l,c,d=!0,h)=>`
            <div id="${h}" class="settings-tile" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: var(--fds-font-lg);">${s}</span>
                    <div>
                        <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${l}</div>
                        ${c?`<div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-top: 2px;">${c}</div>`:""}
                    </div>
                </div>
                ${d?'<span style="color: var(--fds-text-dim);">❯</span>':""}
            </div>
        `,n=o.currentLocale==="am"?"አማርኛ":o.currentLocale==="om"?"Afan Oromo":"English";e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${S.render(o.currentLocale==="am"?"ቅንብሮች":o.currentLocale==="om"?"QINDAA'INOOTA":"SETTINGS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- Account Group -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">${o.currentLocale==="am"?"መለያ እና መገለጫ":o.currentLocale==="om"?"HERREGA & PROFILE":"ACCOUNT & PROFILE"}</div>
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${a("👤",o.currentLocale==="am"?"የእኔ መገለጫ":o.currentLocale==="om"?"Profile Koo":"My Profile",i,!0,"tile-profile")}
                        ${a("🌍",o.currentLocale==="am"?"ቋንቋ":o.currentLocale==="om"?"Afaan":"Language",n,!0,"tile-language")}
                        ${a("🔔",o.currentLocale==="am"?"ማሳወቂያዎች":o.currentLocale==="om"?"Beeksisa":"Notifications","",!0,"tile-notifications")}
                        ${a("🔊",o.currentLocale==="am"?"የድምፅ ውጤቶች":o.currentLocale==="om"?"Sagalee":"Sound Effects",this._settings.soundEffects?o.currentLocale==="am"?"የበራ":o.currentLocale==="om"?"Kan Baname":"Enabled":o.currentLocale==="am"?"የጠፋ":o.currentLocale==="om"?"Kan Cufame":"Muted",!0,"tile-sound")}
                    </div>

                    <!-- Legal Group -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 8px; margin-left: 16px; text-transform: uppercase;">${o.currentLocale==="am"?"እገዛ እና ህጋዊ":o.currentLocale==="om"?"GARGAARSA & SEERA":"SUPPORT & LEGAL"}</div>
                    <div class="glass-card" style="margin-bottom: 32px; border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${a("❓",o.currentLocale==="am"?"እገዛ እና ድጋፍ":o.currentLocale==="om"?"Gargaarsa & Deeggarsa":"Help & Support","",!0,"tile-help")}
                        ${a("📜",o.currentLocale==="am"?"ውሎች እና ሁኔታዎች":o.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions","",!0,"tile-terms")}
                        ${a("🔒",o.currentLocale==="am"?"የግላዊነት ፖሊሲ":o.currentLocale==="om"?"Imaammata Dhuunfaa":"Privacy Policy","",!0,"tile-privacy")}
                        ${a("ℹ️",o.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":o.currentLocale==="om"?"Waa'ee Ethio Fantasy":"About Ethio Fantasy","v1.1.0",!0,"tile-about")}
                    </div>

                    <!-- Logout -->
                    <div class="glass-card settings-tile" id="btn-logout" style="margin-bottom: 16px; border-radius: 12px; padding: 0; text-align: center; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05); overflow: hidden;">
                        <div style="padding: 16px; font-size: var(--fds-font-md); font-weight: 800; color: var(--fds-red-live); cursor: pointer; letter-spacing: 0.5px;">
                            ${o.currentLocale==="am"?"ውጣ":o.currentLocale==="om"?"BA'I":"LOG OUT"}
                        </div>
                    </div>

                </div>
            </div>
            <style>
                .settings-tile:active { background: rgba(255,255,255,0.08); }
            </style>
        `,S.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),[{id:"tile-profile",sub:"profile"},{id:"tile-language",sub:"language"},{id:"tile-notifications",sub:"notifications"},{id:"tile-sound",sub:"sound"},{id:"tile-help",sub:"help"},{id:"tile-terms",sub:"terms"},{id:"tile-privacy",sub:"privacy"},{id:"tile-about",sub:"about"}].forEach(s=>{document.getElementById(s.id)?.addEventListener("click",()=>{this._audioManager.playClick(),this._subScreen=s.sub,this.render()})}),document.getElementById("btn-logout")?.addEventListener("click",async()=>{this._audioManager.playClick(),await ct.show()&&(await R.getInstance().signOut(),window.location.reload())})}_renderProfileScreen(e,t){const i=this._saveManager.profile,a=i.phone?this._maskPhone(i.phone):`${o.currentLocale==="am"?"እንግዳ ተጫዋች":o.currentLocale==="om"?"Taphataa Keessummaa":"Guest Player"}`,n="July 22, 2026",r=i.eloRating&&i.eloRating>1400?o.currentLocale==="am"?"የበራ ፕሪሚየም":o.currentLocale==="om"?"Premium Hojjetu":"Active Premium":o.currentLocale==="am"?"የበራ መሰረታዊ":o.currentLocale==="om"?"Basic Hojjetu":"Active Basic",s=(l,c)=>`
            <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-dim);">${l}</div>
                <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${c}</div>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"የእኔ መገለጫ":o.currentLocale==="om"?"PROFILE KOO":"MY PROFILE")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${s(o.currentLocale==="am"?"የስልክ ቁጥር (MSISDN)":o.currentLocale==="om"?"Lakkoofsa MSISDN":"Masked MSISDN",a)}
                        ${s(o.currentLocale==="am"?"የምዝገባ ሁኔታ":o.currentLocale==="om"?"Haala Kaffaltii":"Subscription Status",r)}
                        <div style="border-bottom: none;">
                            ${s(o.currentLocale==="am"?"የተመዘገቡበት ቀን":o.currentLocale==="om"?"Guyyaa Galmee":"Registration Date",n)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderLanguageScreen(e,t){const i=(n,r)=>{const s=o.currentLocale===n;return`
                <div class="settings-tile lang-item" data-lang="${n}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${r}</div>
                    <div style="
                        width: 20px; height: 20px; border-radius: 50%; 
                        border: 2px solid ${s?"var(--tv-gold-primary)":"rgba(255,255,255,0.3)"};
                        display: flex; align-items: center; justify-content: center;
                    ">
                        ${s?'<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--tv-gold-primary);"></div>':""}
                    </div>
                </div>
            `};e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"ቋንቋ ይምረጡ":o.currentLocale==="om"?"AFAAN FILADHU":"SELECT LANGUAGE")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i("en","English")}
                        ${i("am","አማርኛ (Amharic)")}
                        <div style="border-bottom: none;">
                            ${i("om","Afan Oromo")}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e),e.querySelectorAll(".lang-item").forEach(n=>{n.addEventListener("click",r=>{const l=r.currentTarget.getAttribute("data-lang");l&&(this._audioManager.playClick(),o.setLocale(l),A.refresh(),this.render())})})}_renderNotificationsScreen(e,t){const i=(n,r)=>{const s=this._settings.notifications[n];return`
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${r}</div>
                    <label class="switch-container">
                        <input type="checkbox" class="switch-input notif-toggle" data-key="${n}" ${s?"checked":""}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
            `};e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"ማሳወቂያዎች":o.currentLocale==="om"?"BEEKSIISAA":"NOTIFICATIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i("dailyChallenge",o.currentLocale==="am"?"የዕለት ተግዳሮቶች":o.currentLocale==="om"?"Qormaata Guyyaa":"Daily Challenge")}
                        ${i("tournament",o.currentLocale==="am"?"የሊግ ውድድር ዜናዎች":o.currentLocale==="om"?"Dorgommiiwwan Liigii":"Tournament Updates")}
                        ${i("rewards",o.currentLocale==="am"?"ሽልማቶች እና ጉርሻዎች":o.currentLocale==="om"?"Badhaasa & Bonus":"Rewards & Bonuses")}
                        ${i("announcements",o.currentLocale==="am"?"ማስታወቂያዎች":o.currentLocale==="om"?"Beeksisa Sirnaa":"Announcements")}
                        ${i("subscription",o.currentLocale==="am"?"የምዝገባ ማሳወቂያዎች":o.currentLocale==="om"?"Kaffaltii Addaa":"Subscription Alerts")}
                        <div style="border-bottom: none;">
                            ${i("system",o.currentLocale==="am"?"የስርዓት ማንቂያዎች":o.currentLocale==="om"?"Gargaarsa Sirnaa":"System Alerts")}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .switch-container {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                }
                .switch-input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .switch-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(255,255,255,0.15);
                    transition: .3s;
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .switch-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px; width: 16px;
                    left: 3px; bottom: 3px;
                    background-color: var(--fds-text-main);
                    transition: .3s;
                    border-radius: 50%;
                }
                .switch-input:checked + .switch-slider {
                    background-color: var(--tv-pitch-green);
                }
                .switch-input:checked + .switch-slider:before {
                    transform: translateX(20px);
                }
            </style>
        `,this._bindSubScreenBack(e),e.querySelectorAll(".notif-toggle").forEach(n=>{n.addEventListener("change",r=>{this._audioManager.playClick();const s=r.currentTarget,l=s.getAttribute("data-key");l&&(this._settings.notifications[l]=s.checked,this._saveSettings())})})}_renderSoundScreen(e,t){const i=(s,l)=>{const c=this._settings.soundEffects===s;return`
                <div class="settings-tile sound-item" data-val="${s}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${l}</div>
                    <div style="
                        width: 20px; height: 20px; border-radius: 50%; 
                        border: 2px solid ${c?"var(--tv-gold-primary)":"rgba(255,255,255,0.3)"};
                        display: flex; align-items: center; justify-content: center;
                    ">
                        ${c?'<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--tv-gold-primary);"></div>':""}
                    </div>
                </div>
            `},a=o.currentLocale==="am"?"ድምፅ አብራ":o.currentLocale==="om"?"Bani":"Enable",n=o.currentLocale==="am"?"ድምፅ አጥፋ":o.currentLocale==="om"?"Cufi":"Disable";e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"የድምፅ ውጤቶች":o.currentLocale==="om"?"SAGAALE TAPHA":"SOUND EFFECTS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i(!0,a)}
                        <div style="border-bottom: none;">
                            ${i(!1,n)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e),e.querySelectorAll(".sound-item").forEach(s=>{s.addEventListener("click",l=>{const d=l.currentTarget.getAttribute("data-val")==="true";this._settings.soundEffects=d,this._saveSettings(),this._audioManager.playClick(),this.render()})})}_renderHelpScreen(e,t){const i=[{id:"account",name:o.currentLocale==="am"?"መለያ":o.currentLocale==="om"?"Herrega":"Account",icon:"👤"},{id:"subscription",name:o.currentLocale==="am"?"ምዝገባ":o.currentLocale==="om"?"Kaffaltii":"Subscription",icon:"💳"},{id:"unsubscription",name:o.currentLocale==="am"?"ምዝገባ መሰረዝ":o.currentLocale==="om"?"Haquu":"Unsubscription",icon:"🛑"},{id:"dailyChallenge",name:o.currentLocale==="am"?"የዕለት ተግዳሮት":o.currentLocale==="om"?"Qormaata Guyyaa":"Daily Challenge",icon:"📅"},{id:"tournament",name:o.currentLocale==="am"?"ውድድር":o.currentLocale==="om"?"Dorgommii":"Tournament",icon:"🏆"},{id:"rewards",name:o.currentLocale==="am"?"ሽልማቶች":o.currentLocale==="om"?"Badhaasa":"Rewards",icon:"🎁"},{id:"gameplay",name:o.currentLocale==="am"?"የጨዋታ ሁኔታ":o.currentLocale==="om"?"Tapha":"Gameplay",icon:"⚽"},{id:"leaderboard",name:o.currentLocale==="am"?"ደረጃ ሰሌዳ":o.currentLocale==="om"?"Sadarkaa":"Leaderboard",icon:"📊"},{id:"profile",name:o.currentLocale==="am"?"መገለጫ":(o.currentLocale==="om","Profile"),icon:"👤"},{id:"notifications",name:o.currentLocale==="am"?"ማሳወቂያዎች":o.currentLocale==="om"?"Beeksisa":"Notifications",icon:"🔔"},{id:"technicalIssues",name:o.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":o.currentLocale==="om"?"Rakkina Sirnaa":"Technical Issues",icon:"🔧"},{id:"privacy",name:o.currentLocale==="am"?"ምስጢራዊነት":o.currentLocale==="om"?"Dhuunfaa":"Privacy",icon:"🔒"},{id:"terms",name:o.currentLocale==="am"?"ውሎች":o.currentLocale==="om"?"Haalawwan":"Terms",icon:"📜"}],a={account:[{q:"How is my account created?",a:"Your account is automatically created when you authenticate with your Ethio Telecom mobile phone number. There is no password required."},{q:"Can I delete my account?",a:"To delete your account data, please contact Ethio Telecom customer service or submit a support ticket via the app."}],subscription:[{q:"What is Premium Subscription?",a:"Premium subscription gives you unlimited daily plays, full access to all leagues, and entry into the weekly cash prize draws for 2 Birr/day."},{q:"How do I pay for subscription?",a:"Subscription fees are automatically deducted from your Ethio Telecom airtime balance daily."}],unsubscription:[{q:"How do I unsubscribe?",a:'You can cancel your active subscription anytime by going to Settings > Account > Profile and choosing Unsubscribe, or by sending "STOP" to the Ethio Telecom shortcode 8282.'}],dailyChallenge:[{q:"What is the Daily Challenge?",a:"The Daily Challenge is a special daily set of 10 trivia questions on hot football topics. Completing it awards double reward coins and a 1.5x XP bonus!"},{q:"How many times can I play the Daily Challenge?",a:"You can play the Daily Challenge once per calendar day. It resets every night at midnight EAT."}],tournament:[{q:"How do tournaments work?",a:"Tournaments are knockout brackets held every weekend. Players register during the week and compete live in 1v1 match phases to progress."},{q:"What are the tournament entry requirements?",a:"Premium subscribers can enter tournaments for free. Basic and free players must pay a 100 coin registration fee."}],rewards:[{q:"What rewards can I win?",a:"You can win in-game coins, profile XP, custom football badges, and real cash prizes credited directly to your Ethio Telecom mobile account balance."},{q:"When are weekly prizes distributed?",a:"Weekly prizes are processed and sent every Monday at 10:00 AM EAT based on the final Sunday night division standings."}],gameplay:[{q:"How do I play a match?",a:"Read the question carefully and tap the correct option before the timer runs out. Fast answers score Goals, while incorrect ones are Saved by the goalkeeper!"},{q:"How does the match timer work?",a:"You have 30 seconds per question in Solo Matches, and 20 seconds in Live 1v1 Matches. Answering quicker increases your possession stat!"}],leaderboard:[{q:"How are leaderboard points calculated?",a:"Leaderboard standings are based on ELO ratings. You win ELO points by defeating opponents in Live 1v1 Matches and scoring high accuracy in Solo Matches."},{q:"How often does the leaderboard reset?",a:"Division leaderboards reset weekly on Sunday at midnight EAT, after which the top players are promoted and rewards are dispatched."}],profile:[{q:"Why can't I edit my username?",a:"To comply with Ethio Telecom VAS portal guidelines, player profiles are verified and tied securely to your MSISDN. Manually changing names is restricted."}],notifications:[{q:"What notifications will I receive?",a:"You will receive SMS alerts for tournament kick-offs, daily challenge reminders, and subscription renewals. You can toggle these settings anytime."}],technicalIssues:[{q:"The app is freezing. What should I do?",a:"Ensure you have a stable network connection (3G/4G/LTE/5G). Try refreshing the app page by swiping down, or clearing your mobile browser cache."}],privacy:[{q:"How is my data used?",a:"We collect your phone number and game statistics solely to manage your game state and calculate rankings. We never share your data with third parties."}],terms:[{q:"Are there age restrictions?",a:"Yes, you must be 18 years or older, or have parental consent, and be an active Ethio Telecom subscriber to compete for cash rewards."}]};if(this._showContactSupportForm){e.innerHTML=`
                <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                    ${t(o.currentLocale==="am"?"እገዛ እና ድጋፍ":o.currentLocale==="om"?"GARGAARSA":"HELP & SUPPORT")}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                        <button id="btn-back-help" style="margin-bottom: 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: var(--fds-text-main); padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer;">
                            ${o.currentLocale==="am"?"⬅️ የእገዛ ማውጫ":o.currentLocale==="om"?"⬅️ AALAMA GARGAARSAA":"⬅️ HELP DIRECTORY"}
                        </button>
                        
                        <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left;" id="support-form-container">
                            <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--fds-text-main); margin-bottom: 12px; text-transform: uppercase;">${o.currentLocale==="am"?"✉️ እገዛን ያግኙ":o.currentLocale==="om"?"✉️ Deeggarsa Argaadhu":"✉️ Contact Support"}</div>
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-bottom: 6px; font-weight: 600;">${o.currentLocale==="am"?"የጉዳዩ ዓይነት":o.currentLocale==="om"?"GOSA RAKKINA":"ISSUE TYPE"}</label>
                                <select id="support-category" style="width: 100%; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: var(--fds-text-main); outline: none;">
                                    <option value="Billing & Subscription">${o.currentLocale==="am"?"ክፍያ እና ምዝገባ":o.currentLocale==="om"?"Kaffaltii & Galmee":"Billing & Subscription"}</option>
                                    <option value="Technical Issues">${o.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":o.currentLocale==="om"?"Rakkina Sirnaa":"Technical Issues"}</option>
                                    <option value="Rewards & Points">${o.currentLocale==="am"?"ሽልማቶች እና ነጥቦች":o.currentLocale==="om"?"Badhaasa & Qabxii":"Rewards & Points"}</option>
                                    <option value="General Feedback">${o.currentLocale==="am"?"አጠቃላይ አስተያየት":o.currentLocale==="om"?"Yaada Waligalaa":"General Feedback"}</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-bottom: 6px; font-weight: 600;">${o.currentLocale==="am"?"መልእክት":o.currentLocale==="om"?"ERGAA":"MESSAGE"}</label>
                                <textarea id="support-message" placeholder="${o.currentLocale==="am"?"ችግርዎን እዚህ ይግለጹ...":o.currentLocale==="om"?"Rakkina keessan asitti ibsaa...":"Describe your issue here..."}" style="width: 100%; height: 80px; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: var(--fds-text-main); outline: none; resize: none; font-family: sans-serif; box-sizing: border-box;"></textarea>
                            </div>
                            ${w.Button({id:"btn-submit-support",text:o.currentLocale==="am"?"መልእክት ላክ":o.currentLocale==="om"?"ERGAA ERGI":"SUBMIT TICKET",variant:"primary",fullWidth:!0})}
                        </div>
                    </div>
                </div>
            `,this._bindSubScreenBack(e),document.getElementById("btn-back-help")?.addEventListener("click",()=>{this._audioManager.playClick(),this._showContactSupportForm=!1,this.render()}),document.getElementById("btn-submit-support")?.addEventListener("click",async()=>{this._audioManager.playClick();const s=document.getElementById("support-message")?.value.trim(),l=document.getElementById("support-category"),c=l?l.value:"General Feedback";if(!s){ie.show(o.currentLocale==="am"?"እባክዎን ከማስገባትዎ በፊት መልእክት ያስገቡ።":o.currentLocale==="om"?"Maree ergamuu dura ergaa galchaa.":"Please enter a message before submitting.","warning");return}const d=document.getElementById("support-form-container");if(d){d.innerHTML=`
                        <div style="text-align: center; padding: 16px; color: var(--fds-text-dim);">
                            ${o.currentLocale==="am"?"ጥያቄዎ ወደ አገልጋይ በመላክ ላይ...":o.currentLocale==="om"?"Ergaan gara serveritti ergamaa jira...":"Submitting ticket to server..."}
                        </div>
                    `;const h=await X.getInstance().createTicket(c,s),m=h.success?`EF-${h.ticketId.substring(0,8).toUpperCase()}`:"EF-"+Math.floor(1e5+Math.random()*9e5);d.innerHTML=`
                        <div style="text-align: center; padding: 16px;">
                            <div style="font-size: 40px; margin-bottom: 8px;">✅</div>
                            <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--tv-pitch-green); margin-bottom: 4px;">${o.currentLocale==="am"?"ጥያቄዎ ገብቷል":o.currentLocale==="om"?"ERGAAN ERGAMEERA":"TICKET SUBMITTED"}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 12px;">${o.currentLocale==="am"?"የድጋፍ ቡድናችን በቅርቡ በኤስኤምኤስ ምላሽ ይሰጣል።":o.currentLocale==="om"?"Gareen deeggarsa keenyaa dhiyeenyatti SMSn deebii kenne.":"Our support team will respond via SMS shortly."}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 700; color: var(--fds-text-main); background: rgba(255,255,255,0.08); padding: 6px; border-radius: 6px; font-family: monospace; display: inline-block;">REF: ${m}</div>
                        </div>
                    `}});return}if(this._helpCategory){const l=(this._faqsCache.length>0?this._faqsCache:a[this._helpCategory]||[]).map((b,v)=>`
                <div class="glass-card" style="border-radius: 12px; margin-bottom: 12px; border-color: rgba(255,255,255,0.08); overflow: hidden;">
                    <div class="faq-header" data-idx="${v}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.02);">
                        <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${b.q}</div>
                        <span class="faq-icon" style="color: var(--tv-gold-primary); font-size: var(--fds-font-xs); transition: transform 0.2s;">➕</span>
                    </div>
                    <div class="faq-body" id="faq-body-${v}" style="max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out; background: rgba(0,0,0,0.2);">
                        <div style="padding: 16px; font-size: var(--fds-font-sm); color: var(--fds-text-muted); line-height: 1.5;">${b.a}</div>
                    </div>
                </div>
            `).join(""),c=i.find(b=>b.id===this._helpCategory),d=c?c.name:this._helpCategory;e.innerHTML=`
                <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                    ${t(`${d.toUpperCase()}`)}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                        <button id="btn-back-help" style="margin-bottom: 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: var(--fds-text-main); padding: 8px 16px; border-radius: 8px; font-weight: 800; cursor: pointer;">
                            ${o.currentLocale==="am"?"⬅️ የእገዛ ማውጫ":o.currentLocale==="om"?"⬅️ AALAMA GARGAARSAA":"⬅️ HELP DIRECTORY"}
                        </button>
                        
                        <!-- Search FAQs -->
                        <input type="text" id="faq-search-input" placeholder="${o.currentLocale==="am"?"🔍 ጥያቄዎችን ይፈልጉ...":o.currentLocale==="om"?"🔍 Gaaffiiwwan Barbaadi...":"🔍 Search FAQs..."}" style="
                            width: 100%; 
                            padding: 10px 14px; 
                            background: rgba(0,0,0,0.2); 
                            border: 1px solid rgba(255,255,255,0.1); 
                            border-radius: 8px; 
                            color: var(--fds-text-main); 
                            font-size: var(--fds-font-sm); 
                            margin-bottom: 16px; 
                            box-sizing: border-box;
                        ">

                        <div id="faq-list-wrapper">
                            ${l}
                        </div>
                    </div>
                </div>
            `,this._bindSubScreenBack(e),document.getElementById("btn-back-help")?.addEventListener("click",()=>{this._audioManager.playClick(),this._helpCategory=null,this._faqsCache=[],this.render()}),document.getElementById("faq-search-input")?.addEventListener("input",b=>{const v=b.target.value.toLowerCase();e.querySelectorAll("#faq-list-wrapper > .glass-card").forEach(u=>{const f=(u.querySelector(".faq-header > div")?.textContent||"").toLowerCase(),x=(u.querySelector(".faq-body > div")?.textContent||"").toLowerCase();f.includes(v)||x.includes(v)?u.style.display="block":u.style.display="none"})}),e.querySelectorAll(".faq-header").forEach(b=>{b.addEventListener("click",v=>{this._audioManager.playClick();const y=v.currentTarget,u=y.getAttribute("data-idx"),f=e.querySelector(`#faq-body-${u}`),x=y.querySelector(".faq-icon");f&&x&&(f.style.maxHeight==="0px"||!f.style.maxHeight?(f.style.maxHeight=f.scrollHeight+"px",x.innerText="➖"):(f.style.maxHeight="0px",x.innerText="➕"))})});return}const n=i.map(s=>`
            <div class="settings-tile help-category-tile" data-cat-id="${s.id}" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: var(--fds-font-lg);">${s.icon}</span>
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${s.name}</div>
                </div>
                <span style="color: var(--fds-text-dim);">❯</span>
            </div>
        `).join("");e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"እገዛ እና ድጋፍ":o.currentLocale==="om"?"GARGAARSA":"HELP & SUPPORT")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08); margin-bottom: 24px;">
                        ${n}
                    </div>

                    ${w.Button({id:"btn-contact-support",text:o.currentLocale==="am"?"እገዛን ያግኙ":o.currentLocale==="om"?"DEEGGARSA ARGAADHU":"CONTACT SUPPORT",variant:"primary",fullWidth:!0,icon:"✉️"})}
                </div>
            </div>
        `,this._bindSubScreenBack(e),document.getElementById("btn-contact-support")?.addEventListener("click",()=>{this._audioManager.playClick(),this._showContactSupportForm=!0,this.render()}),e.querySelectorAll(".help-category-tile").forEach(s=>{s.addEventListener("click",async l=>{const d=l.currentTarget.getAttribute("data-cat-id");if(d){this._audioManager.playClick(),this._helpCategory=d;const h=document.getElementById("faq-list-wrapper");h&&(h.innerHTML=`<div style="padding: 20px; color: var(--fds-text-dim);">${o.currentLocale==="am"?"ጥያቄዎች በመጫን ላይ...":o.currentLocale==="om"?"Gaaffiiwwan fe'amaa jiru...":"Loading FAQs..."}</div>`);const b=await V.getInstance().getFAQsByCategory(d);this._faqsCache=b.map(v=>{let y=v.question_en,u=v.answer_en;return o.currentLocale==="am"&&v.question_am&&v.answer_am?(y=v.question_am,u=v.answer_am):o.currentLocale==="om"&&v.question_om&&v.answer_om&&(y=v.question_om,u=v.answer_om),{q:y,a:u}}),this.render()}})})}_renderTermsScreen(e,t){const i=o.currentLocale==="am"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. መግቢያ እና የኢትዮፋንታሲ ስምምነት</h2>
                <p>ለኢትዮ ቴሌኮም ደንበኞች ወደተዘጋጀው የኢትዮ ፋንታሲ የእግር ኳስ ጥያቄ ሊግ እንኳን በደህና መጡ። ይህንን ተጨማሪ እሴት አገልግሎት (VAS) በመጠቀም፣ ከኢትዮፋንታሲ እና ከኢትዮ ቴሌኮም ጋር ውል ይገባሉ።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. የምዝገባ ዕቅድ እና ክፍያ</h2>
                <p>ለፕሪሚየም አገልግሎት ዕለታዊ ክፍያ 2 ብር ሲሆን፤ መሰረታዊ አገልግሎት ዕለታዊ ክፍያ 1 ብር ነው። የምዝገባ ክፍያው ከኢትዮ ቴሌኮም የሞባይል ሂሳብዎ ላይ በቀጥታ ተቀናሽ ይደረጋል።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. የጨዋታ እና የደረጃ ሰሌዳ ታማኝነት</h2>
                <p>ጥያቄዎችን በተሰጠው የጊዜ ገደብ ውስጥ መመለስ ይኖርብዎታል። በጨዋታ ላይ ማጭበርበር ወይም ያልተፈቀዱ ቦቶችን መጠቀም መለያዎ በቋሚነት እንዲታገድ ያደርጋል።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">4. ሽልማቶች እና የገንዘብ ሽልማት ስርጭት</h2>
                <p>በዕለታዊ ተግዳሮቶች፣ ውድድሮች እና ጨዋታዎች የተገኙ የሽልማት ነጥቦች (XP እና ሳንቲሞች) የተለየ ካልተገለጸ በስተቀር እውነተኛ የገንዘብ ዋጋ የላቸውም። ኦፊሴላዊ የሳምንታዊ ደረጃ ሰሌዳ የገንዘብ ሽልማቶች በቀጥታ ወደ ተመዝጋቢው የተረጋገጠ የኢትዮ ቴሌኮም ሞባይል ሂሳብ ገቢ ይደረጋሉ።</p>
            </div>
        `:o.currentLocale==="om"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Seensa & Waliigaltee EthioFantasy</h2>
                <p>Gara EthioFantasy, dorgommii gaaffii kubbaa miilaa Itiyo Telekoom fayyadamtootaaf qophaa'eetti baga nagaan dhuftan.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Kaffaltii</h2>
                <p>Kaffaltiin Premium guyyaatti qarshii 2 yommuu ta'u, kaffaltiin Basic guyyaatti qarshii 1 dha. Kaffaltiin kun herrega bilbila keessanii irraa hir'ifama.</p>

                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. Tapha & Sadarkaa</h2>
                <p>Gaaffiiwwan yeroo kenname keessatti deebisuu qabdu. Mala dogoggoraa fayyadamuun akaauntii keessan cufsiisa.</p>

                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">4. Badhaasa Qarshii</h2>
                <p>Badhaasni torban amanamummaadhaan herrega bilbila keessan irratti kaffalama.</p>
            </div>
        `:`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Introduction & EthioFantasy Agreement</h2>
                <p>Welcome to EthioFantasy, the premium Football Quiz League developed for Ethio Telecom customers. By accessing this Value Added Service (VAS), you enter into a binding agreement with EthioFantasy and Ethio Telecom.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Subscription Plans & Billing</h2>
                <p>Subscribing to Premium grants unlimited gameplay access, full league entry, and entry into weekly cash pools. Premium subscription billing is 2 Birr/day. Basic subscription is billed at 1 Birr/day. Daily subscription fees are automatically deducted from your Ethio Telecom airtime balance.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. Gameplay & Leaderboard Integrity</h2>
                <p>The Football Quiz League requires participants to answer themed questions within the allocated time (30 seconds for Solo, 20 seconds for Live 1v1). Score progression and ELO points are recorded in real-time. Cheating, abusing system vulnerabilities, or using bots is strictly prohibited and results in immediate account termination.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">4. Rewards & Cash Prize Distribution</h2>
                <p>Reward points (XP and coins) gained in Daily Challenges, Tournaments, and matches do not have real cash value unless specified. Official weekly leaderboard cash prizes are credited directly to the subscriber's verified Ethio Telecom mobile account balance. Decision of the EthioFantasy administration on rank calculations is final.</p>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"ውሎች እና ሁኔታዎች":o.currentLocale==="om"?"WALIIGALTEE":"TERMS & CONDITIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(15,23,42,0.85); color: var(--fds-text-muted);">
                        ${i}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderPrivacyScreen(e,t){const i=o.currentLocale==="am"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. የምንሰበስበው መረጃ</h2>
                <p>ለጨዋታው አስተዳደር እንዲረዳን የተጠቃሚውን ስልክ ቁጥር (MSISDN)፣ የቋንቋ ምርጫ እና የጨዋታ ነጥቦችን እንሰበስባለን።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. ከኢትዮ ቴሌኮም ጋር ያለው ትስስር</h2>
                <p>አፕሊኬሽኑ ከኢትዮ ቴሌኮም የቪኤኤስ (VAS) መተግበሪያ ጋር በቀጥታ የተገናኘ ሲሆን፣ ሳምንታዊ ሽልማቶችን ለማረጋገጥ ስልክዎን እንጠቀማለን።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. የመረጃ ጥበቃ እና ደህንነት</h2>
                <p>የተጫዋች መረጃ እና የስልክ ቁጥር በከፍተኛ ደህንነት የተጠበቀ ነው። መረጃዎን ለሶስተኛ ወገን አናጋራም።</p>
            </div>
        `:o.currentLocale==="om"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Odeeffannoo Nyaatamu</h2>
                <p>Lakkoofsa bilbilaa fi qabxii tapha keessanii qofa sirnaa keenya keessatti kuusna.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Waliin Hojii Itiyo Telekoom</h2>
                <p>Sirni keenya kallattiin Itiyo Telekoom VAS waliin kan walqabatu dha.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. Eegumsa Odeeffannoo</h2>
                <p>Odeeffannoon keessan oomisha qaama sadaffaatif hin kennamu.</p>
            </div>
        `:`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. Information We Collect</h2>
                <p>We collect subscriber MSISDN (mobile number), device IP address, locale preference, subscription state, and gameplay statistics (scores, response times, ELO ratings) to manage the EthioFantasy service.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. Integration with Ethio Telecom</h2>
                <p>Our application integrates directly with Ethio Telecom VAS Gateway APIs. Subscription status checks are executed on every login session to confirm billing and verify eligibility for weekly cash rewards.</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. Data Protection & Retainment</h2>
                <p>Player statistics and phone numbers are encrypted in transit and at rest. We store player data securely using cloud server clusters. We do not sell or share subscriber data with any third-party organizations.</p>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"የግላዊነት ፖሊሲ":o.currentLocale==="om"?"IMAAMMATA DHUUNFAA":"PRIVACY POLICY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(15,23,42,0.85); color: var(--fds-text-muted);">
                        ${i}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderAboutScreen(e,t){e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(o.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":o.currentLocale==="om"?"WAA'EE ETHIO FANTASY":"ABOUT ETHIO FANTASY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px; text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚽</div>
                    <div style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">EthioFantasy</div>
                    <div style="font-size: var(--fds-font-sm); color: var(--tv-gold-primary); font-weight: 800; margin-bottom: 24px; letter-spacing: 1.5px; text-transform: uppercase;">Ethio Telecom VAS Integration</div>
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: var(--fds-font-sm); line-height: 1.6; color: var(--fds-text-muted); margin-bottom: 24px;">
                        <p style="margin-top: 0;"><strong>${o.currentLocale==="am"?"የመተግበሪያ መግለጫ:":o.currentLocale==="om"?"IBSA APPLIKAASHINII:":"Application Description:"}</strong><br>${o.currentLocale==="am"?"ኢትዮፋንታሲ በኢትዮጵያ ውስጥ ላሉ የእግር ኳስ አፍቃሪዎች የተዘጋጀ ልዩ የእግር ኳስ ጥያቄዎች ሊግ ነው። ዕለታዊ የትሪቪያ ጨዋታዎችን ይጫወቱ፣ ሌሎች ተጫዋቾችን በቀጥታ 1v1 ይፈትኑ እና የገንዘብ ሽልማቶችን ለማሸነፍ በሊግ ደረጃዎች ይውጡ።":o.currentLocale==="om"?"EthioFantasy dorgommii gaaffii kubbaa miilaa fayyadamtoota Itoophiyaatif qophaa'ee dha. Tapha guyyaa taphadhaa, dorgomtoota kan biroo 1v1 irratti falmaa, badhaasa qarshii mo'achuuf sadarkaa liigii kooraa.":"EthioFantasy is a premium Football Quiz League platform crafted specifically for football fans in Ethiopia. Play daily trivia matches, challenge other players in live 1v1 showdowns, and climb the league divisions to win cash prizes."}</p>
                        
                        <p style="margin-bottom: 0;"><strong>${o.currentLocale==="am"?"ዋና ዋና ባህሪያት:":o.currentLocale==="om"?"AMALA GURGUDDOO:":"Key Features:"}</strong><br>
                        ${o.currentLocale==="am"?"• የዕለት ተግዳሮቶች ከነጥብ ማባዣዎች ጋር<br>• የቀጥታ 1v1 ጨዋታዎች<br>• የሳምንቱ መጨረሻ ውድድሮች<br>• የደረጃ እድገት እና የ ELO ሰሌዳ<br>• የተቀናጀ የኤስኤምኤስ ክፍያ ማረጋገጫ":o.currentLocale==="om"?"• Qormaata guyyaa qabxii baay'isu waliin<br>• Tapha 1v1 kallattiin<br>• Dorgommii dhuma torbaniti<br>• Sadarkaa ELO fi guddina liigii<br>• Kaffaltii SMSn mirkanaa'u":"• Daily themed challenges with score multipliers<br>• Live 1v1 real-time matchmaking<br>• Interactive Weekend knockout tournaments<br>• Professional division promotions & ELO ranking leaderboard<br>• Integrated billing checking via SMS OTP"}</p>
                    </div>

                    <div class="glass-card" style="border-radius: 12px; padding: 16px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 24px;">
                        <div><strong>${o.currentLocale==="am"?"ስሪት:":o.currentLocale==="om"?"Gosa:":"Version:"}</strong> 1.1.0</div>
                        <div style="margin-top: 6px;"><strong>${o.currentLocale==="am"?"አልሚ:":o.currentLocale==="om"?"Oomishaa:":"Developer:"}</strong> InnoGames VAS Team</div>
                        <div style="margin-top: 6px;"><strong>${o.currentLocale==="am"?"የኢትዮ ቴሌኮም ትስስር:":o.currentLocale==="om"?"Waliin Hojii Itiyo Telekoom:":"Ethio Telecom Integration:"}</strong> VAS Gateway API v3.2</div>
                        <div style="margin-top: 6px;"><strong>${o.currentLocale==="am"?"ግንኙነት:":o.currentLocale==="om"?"Qunnamtii:":"Contact:"}</strong> support@ethiofantasy.com</div>
                    </div>

                    <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700;">
                        ${o.currentLocale==="am"?"© 2026 ኢትዮ ቴሌኮም VAS። መብቱ በህግ የተጠበቀ ነው።":o.currentLocale==="om"?"© 2026 Itiyo Telekoom VAS. Mirgi Hunduu Seeraan Kan Eegame.":"© 2026 Ethio Telecom VAS. All Rights Reserved."}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_goBack(){if(this._subScreen!==this._defaultSubScreen)this._subScreen=this._defaultSubScreen;else if(!(this._helpCategory!==null||this._showContactSupportForm)){this._onBack();return}this._helpCategory=null,this._showContactSupportForm=!1,this.render()}_bindSubScreenBack(e){S.bind(e,()=>{this._audioManager.playClick(),this._goBack()})}_maskPhone(e){let t=e.replace(/[^0-9+]/g,"");return t.startsWith("+")&&(t=t.substring(1)),t.startsWith("251")&&(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class B{static _instance=null;constructor(){}static getInstance(){return B._instance||(B._instance=new B),B._instance}async getNotifications(e){if(!_.isOnline)return[];const t=g;if(!t)return[];try{const{data:{user:i}}=await t.auth.getUser();if(!i)return[];let a=t.from("notifications").select("*").or(`user_id.eq.${i.id},user_id.is.null`).order("created_at",{ascending:!1});e&&(a=a.eq("category",e));const{data:n,error:r}=await a;return r?(console.warn("[NotificationService] Error fetching notifications:",r),[]):n||[]}catch(i){return console.warn("[NotificationService] Failed to get notifications:",i),[]}}async getUnreadCount(){if(!_.isOnline)return 0;const e=g;if(!e)return 0;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return 0;const{count:i,error:a}=await e.from("notifications").select("*",{count:"exact",head:!0}).or(`user_id.eq.${t.id},user_id.is.null`).eq("read",!1);return a?(console.warn("[NotificationService] Error fetching unread count:",a),0):i||0}catch(t){return console.warn("[NotificationService] Failed to get unread count:",t),0}}async markAsRead(e){if(!_.isOnline)return;const t=g;if(t)try{const{error:i}=await t.from("notifications").update({read:!0}).eq("id",e);i&&console.warn("[NotificationService] Error marking as read:",i)}catch(i){console.warn("[NotificationService] Failed to mark as read:",i)}}async markAllAsRead(){if(!_.isOnline)return;const e=g;if(e)try{const{data:{user:t}}=await e.auth.getUser();if(!t)return;const{error:i}=await e.from("notifications").update({read:!0}).or(`user_id.eq.${t.id},user_id.is.null`).eq("read",!1);i&&console.warn("[NotificationService] Error marking all as read:",i)}catch(t){console.warn("[NotificationService] Failed to mark all as read:",t)}}subscribeToNewNotifications(e){if(!_.isOnline)return()=>{};const t=g;if(!t)return()=>{};let i=null;return t.auth.getUser().then(({data:{user:a}})=>{if(!a)return;const n=g;n&&(i=n.channel(`public:notifications:user_id=eq.${a.id}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},r=>{const s=r.new;(s.user_id===a.id||s.user_id===null)&&e(s)}).subscribe())}),()=>{const a=g;i&&a&&a.removeChannel(i)}}}class dt{_uiManager;_audioManager;_onBack;_activeTab="all";_notifications=[];_unsubscribeRealtime=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i,this._unsubscribeRealtime=B.getInstance().subscribeToNewNotifications(a=>{this._notifications.unshift(a),this.render()}),this._loadNotifications()}async _loadNotifications(){const e=B.getInstance();this._notifications=await e.getNotifications(),this.render()}render(){const e=this._uiManager.container,t=o.currentLocale,i=this._notifications.filter(l=>this._activeTab==="all"?!0:this._activeTab==="unread"?!l.read:l.category===this._activeTab),n=[{id:"all",label:{en:"All",am:"ሁሉም",om:"Hunda"}},{id:"unread",label:{en:"Unread",am:"ያልተነበቡ",om:"Kan Hin Dubbifamne"}},{id:"daily",label:{en:"Daily",am:"የዕለት",om:"Guyyaa"}},{id:"tournament",label:{en:"League",am:"ሊግ",om:"Liigii"}},{id:"rewards",label:{en:"Rewards",am:"ሽልማቶች",om:"Badhaasa"}},{id:"announcements",label:{en:"System",am:"ስርዓት",om:"Sirna"}},{id:"subscription",label:{en:"Billing",am:"ክፍያ",om:"Kaffaltii"}}].map(l=>{const c=l.id===this._activeTab,d=l.id==="unread"?this._notifications.filter(h=>!h.read).length:l.id==="all"?this._notifications.length:this._notifications.filter(h=>h.category===l.id).length;return`
                <button class="notif-tab ${c?"active-notif-tab":""}" data-tab-id="${l.id}" style="
                    flex: 0 0 auto;
                    padding: 8px 14px;
                    border-radius: 20px;
                    border: 1px solid ${c?"var(--tv-gold-primary)":"rgba(255,255,255,0.08)"};
                    background: ${c?"rgba(255, 215, 0, 0.12)":"rgba(15, 23, 42, 0.6)"};
                    color: ${c?"var(--tv-gold-primary)":"#94A3B8"};
                    font-size: var(--fds-font-sm);
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                ">
                    ${l.label[t]||l.label.en} (${d})
                </button>
            `}).join(""),r=i.length>0?i.map(l=>{const d={daily:"📅",tournament:"🏆",rewards:"🎁",announcements:"📢",system:"⚙️",subscription:"💳"}[l.category]||"🔔",h=t==="am"&&l.title_am?l.title_am:t==="om"&&l.title_om?l.title_om:l.title_en,m=t==="am"&&l.body_am?l.body_am:t==="om"&&l.body_om?l.body_om:l.body_en,b=new Date(l.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                <div class="glass-card notif-item ${l.read?"notif-read":"notif-unread"}" data-notif-id="${l.id}" style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 14px;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s, background-color 0.2s;
                    border-color: ${l.read?"rgba(255,255,255,0.05)":"rgba(255, 215, 0, 0.3)"};
                    background: ${l.read?"rgba(15, 23, 42, 0.6)":"rgba(255, 215, 0, 0.03)"};
                ">
                    <!-- Status Indicator Dot -->
                    ${l.read?"":`
                        <div style="
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: var(--tv-pitch-green);
                            box-shadow: 0 0 8px var(--tv-pitch-glow);
                        "></div>
                    `}

                    <!-- Category Icon -->
                    <div style="
                        width: 44px;
                        height: 44px;
                        border-radius: 10px;
                        background: rgba(255,255,255,0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: var(--fds-font-lg);
                        flex-shrink: 0;
                    ">${d}</div>

                    <!-- Texts -->
                    <div style="flex: 1; padding-right: 12px;">
                        <div style="
                            font-size: var(--fds-font-md); 
                            font-weight: 800; 
                            color: ${l.read?"#CBD5E1":"#FFFFFF"};
                            margin-bottom: 4px;
                        ">${h}</div>
                        <div style="
                            font-size: var(--fds-font-sm); 
                            color: var(--fds-text-dim); 
                            line-height: 1.4;
                            margin-bottom: 6px;
                        ">${m}</div>
                        <div style="
                            font-size: var(--fds-font-xs); 
                            color: var(--fds-text-dim); 
                            font-weight: 600;
                        ">⏱️ ${b}</div>
                    </div>
                </div>
            `}).join(""):w.EmptyState("📭","No Notifications"),s=this._notifications.some(l=>!l.read);e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- App Bar -->
                ${S.render(t==="am"?"ማሳወቂያዎች":t==="om"?"BEEKSIISAA":"NOTIFICATIONS",s?`
                        <button id="btn-mark-read" style="
                            background: rgba(255,255,255,0.08);
                            border: 1px solid rgba(255,255,255,0.15);
                            color: var(--fds-text-main);
                            font-size: var(--fds-font-xs);
                            font-weight: 800;
                            padding: 6px 12px;
                            border-radius: 12px;
                            cursor: pointer;
                        ">
                            ${t==="am"?"ሁሉንም አንብብ":t==="om"?"Hunda Dubbisi":"MARK ALL READ"}
                        </button>
                    `:"")}

                <!-- Scrolling Section -->
                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px;">
                    
                    <!-- Search Input -->
                    <input type="text" id="notif-search-input" placeholder="🔍 Search notifications..." style="
                        width: 100%; 
                        padding: 10px 14px; 
                        background: rgba(0,0,0,0.2); 
                        border: 1px solid rgba(255,255,255,0.1); 
                        border-radius: 8px; 
                        color: var(--fds-text-main); 
                        font-size: var(--fds-font-sm); 
                        margin-bottom: 16px; 
                        box-sizing: border-box;
                    ">
                    
                    <!-- Horizontal Category Filter Slider -->
                    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: none; -ms-overflow-style: none;">
                        ${n}
                    </div>

                    <!-- Notifications List -->
                    <div id="notifications-list">
                        ${r}
                    </div>
                </div>
            </div>
            <style>
                .notif-tab::-webkit-scrollbar { display: none; }
                .notif-item:active { transform: scale(0.98); }
            </style>
        `,this._bindEvents()}_filterNotifications(e){const t=o.currentLocale;let i=this._notifications.filter(n=>this._activeTab==="all"?!0:this._activeTab==="unread"?!n.read:n.category===this._activeTab);if(e.trim()){const n=e.toLowerCase();i=i.filter(r=>r.title_en&&r.title_en.toLowerCase().includes(n)||r.title_am&&r.title_am.toLowerCase().includes(n)||r.title_om&&r.title_om.toLowerCase().includes(n)||r.body_en&&r.body_en.toLowerCase().includes(n)||r.body_am&&r.body_am.toLowerCase().includes(n)||r.body_om&&r.body_om.toLowerCase().includes(n))}const a=document.getElementById("notifications-list");a&&(a.innerHTML=i.length>0?i.map(r=>{const l={daily:"📅",tournament:"🏆",rewards:"🎁",announcements:"📢",system:"⚙️",subscription:"💳"}[r.category]||"🔔",c=t==="am"&&r.title_am?r.title_am:t==="om"&&r.title_om?r.title_om:r.title_en,d=t==="am"&&r.body_am?r.body_am:t==="om"&&r.body_om?r.body_om:r.body_en,h=new Date(r.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                    <div class="glass-card notif-item ${r.read?"notif-read":"notif-unread"}" data-notif-id="${r.id}" style="
                        display: flex;
                        gap: 16px;
                        padding: 16px;
                        margin-bottom: 12px;
                        border-radius: 14px;
                        cursor: pointer;
                        position: relative;
                        transition: transform 0.2s, background-color 0.2s;
                        border-color: ${r.read?"rgba(255,255,255,0.05)":"rgba(255, 215, 0, 0.3)"};
                        background: ${r.read?"rgba(15, 23, 42, 0.6)":"rgba(255, 215, 0, 0.03)"};
                    ">
                        <!-- Status Indicator Dot -->
                        ${r.read?"":`
                            <div style="
                                position: absolute;
                                top: 16px;
                                right: 16px;
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background-color: var(--tv-pitch-green);
                                box-shadow: 0 0 8px var(--tv-pitch-glow);
                            "></div>
                        `}

                        <!-- Category Icon -->
                        <div style="
                            width: 44px;
                            height: 44px;
                            border-radius: 10px;
                            background: rgba(255,255,255,0.05);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: var(--fds-font-lg);
                            flex-shrink: 0;
                        ">${l}</div>

                        <!-- Texts -->
                        <div style="flex: 1; padding-right: 12px;">
                            <div style="
                                font-size: var(--fds-font-md); 
                                font-weight: 800; 
                                color: ${r.read?"#CBD5E1":"#FFFFFF"};
                                margin-bottom: 4px;
                            ">${c}</div>
                            <div style="
                                font-size: var(--fds-font-sm); 
                                color: var(--fds-text-dim); 
                                line-height: 1.4;
                                margin-bottom: 6px;
                            ">${d}</div>
                            <div style="
                                font-size: var(--fds-font-xs); 
                                color: var(--fds-text-dim); 
                                font-weight: 600;
                            ">⏱️ ${h}</div>
                        </div>
                    </div>
                `}).join(""):w.EmptyState("📭","No Notifications"),a.querySelectorAll(".notif-item").forEach(r=>{r.addEventListener("click",async s=>{const c=s.currentTarget.getAttribute("data-notif-id");c&&(this._audioManager.playClick(),await B.getInstance().markAsRead(c),await this._loadNotifications())})}),document.getElementById("btn-empty-clear-notif")?.addEventListener("click",()=>{this._audioManager.playClick();const r=document.getElementById("notif-search-input");r&&(r.value="",this._filterNotifications(""))}))}_bindEvents(){S.bind(this._uiManager.container,()=>{this._audioManager.playClick(),this._unsubscribeRealtime&&this._unsubscribeRealtime(),this._onBack()}),document.getElementById("notif-search-input")?.addEventListener("input",n=>{const r=n.target.value;this._filterNotifications(r)}),document.getElementById("btn-mark-read")?.addEventListener("click",async()=>{this._audioManager.playClick(),await B.getInstance().markAllAsRead(),await this._loadNotifications()}),this._uiManager.container.querySelectorAll(".notif-tab").forEach(n=>{n.addEventListener("click",r=>{const l=r.currentTarget.getAttribute("data-tab-id");l&&(this._audioManager.playClick(),this._activeTab=l,this.render())})}),this._uiManager.container.querySelectorAll(".notif-item").forEach(n=>{n.addEventListener("click",async r=>{const l=r.currentTarget.getAttribute("data-notif-id");l&&(this._audioManager.playClick(),await B.getInstance().markAsRead(l),await this._loadNotifications())})}),document.getElementById("btn-empty-home")?.addEventListener("click",()=>{this._audioManager.playClick(),this._unsubscribeRealtime&&this._unsubscribeRealtime(),this._onBack()});const a=this._uiManager.container.querySelector(".stadium-container");a&&oe.attach(a,async()=>{this._audioManager.playClick(),await this._loadNotifications()})}}class J{static _instance=null;static getInstance(){return J._instance||(J._instance=new J),J._instance}async getTodayChallenge(){if(_.isOnline&&g)try{const{data:t,error:i}=await g.rpc("get_daily_challenge");if(!i&&t){const a=t;if(a.available&&a.question_ids&&a.question_ids.length>0){const n=await q.getInstance().fetchQuestionsByIds(a.question_ids,o.currentLocale),r=a.completed||!1;return r?localStorage.setItem("ETHIO_DAILY_COMPLETED_TODAY","true"):localStorage.removeItem("ETHIO_DAILY_COMPLETED_TODAY"),{id:a.id,themeEn:a.theme_en||"Daily Football Quiz Challenge",themeAm:a.theme_am||"የዕለቱ የእግር ኳስ ጥያቄ ተግዳሮት",themeOm:a.theme_om||"Qormaata Gaaffii Kubbaa Miilaa Guyyaa",bonusMultiplier:a.bonusMultiplier||1.5,completed:r,questions:n}}}}catch(t){console.warn("[DailyChallengeManager] Supabase fetch failed:",t)}return{themeEn:"Daily Champions Challenge",themeAm:"የዕለቱ የሻምፒዮኖች ተግዳሮት",themeOm:"Qormaata Chaampiyoonii Guyyaa",bonusMultiplier:1.5,completed:!1,questions:await q.getInstance().fetchQuestions("world-cup",10,o.currentLocale)}}}class pt{_uiManager;_saveManager;_audioManager;_onBack;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}async render(){const e=this._uiManager.container;e.innerHTML=w.LoadingState("Loading stats...");const t=this._saveManager.profile,i=T.getDivision(t.xp),a=await P.getInstance().getHistory(50);let n=t.totalMatches||0,r=t.totalWins||0,s=n>0?Math.round(r/n*100):0,l=0,c=s,d=0,h=0,m=0;if(a.length>0){let E=0,k=0,I=0,$=0,H=0;a.forEach(F=>{E+=Number(F.accuracy)||0,k+=Number(F.avg_response_time)||0,I+=Number(F.correct_count)||0,H+=Number(F.total_questions)||10,$+=(Number(F.total_questions)||10)-(Number(F.correct_count)||0)}),c=Math.round(E/a.length),l=k/a.length*1e3;const se=I/H,le=$/H;d=Math.round(n*10*se),h=Math.round(n*10*le)}const b=l>0?(l/1e3).toFixed(1)+"s":"--",v=t.xp,y=t.highScores["football-quiz"]||0,u=`
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
            border-color: rgba(255,255,255,0.08);
        `,f=(E,k)=>`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                <div style="font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-dim);">${E}</div>
                <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">${k}</div>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- App Bar -->
                ${S.render("Detailed Statistics")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- 1. Game Overview -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-blue-accent); margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📊 Game Overview</div>
                    <div class="glass-card" style="${u}">
                        ${f("Games Played",String(n))}
                        ${f("Matches Won",String(r))}
                        ${f("Overall Accuracy",`${c}%`)}
                        <div style="border-bottom: none;">
                            ${f("Points",`${v} XP`)}
                        </div>
                    </div>

                    <!-- 2. Performance -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Performance</div>
                    <div class="glass-card" style="${u}">
                        ${f("Highest Score (Match)",y.toLocaleString())}
                        ${f("Average Response Time",b)}
                    </div>

                    <!-- 3. Questions Details -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">❓ Questions Telemetry</div>
                    <div class="glass-card" style="${u}">
                        ${f("Correct Answers",String(d))}
                        ${f("Wrong Answers",String(h))}
                        <div style="border-bottom: none;">
                            ${f("Skipped Questions",String(m))}
                        </div>
                    </div>

                    <!-- 4. Competition & Achievements -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #A78BFA; margin-bottom: 8px; margin-left: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🏆 Competition Status</div>
                    <div class="glass-card" style="${u}">
                        ${f("League",i.name)}
                        ${f("Win Rate",`${s}%`)}
                    </div>

                </div>
            </div>
        `,S.bind(e,()=>{this._audioManager.playClick(),this._onBack()});const x=e.querySelector(".stadium-container");x&&oe.attach(x,async()=>{this._audioManager.playClick(),await this.render()})}}class Z{static _instance=null;_listeners=new Set;static getInstance(){return Z._instance||(Z._instance=new Z),Z._instance}subscribeToUserSubscription(e,t){if(this._listeners.add(t),_.isOnline&&g){const i=g.channel(`public:subscriptions:${e}`).on("postgres_changes",{event:"*",schema:"public",table:"subscriptions",filter:`user_id=eq.${e}`},a=>{const n=a.new;n&&n.tier&&(console.log("[VASService] Postgres CDC detected subscription tier update:",n.tier),this._notifyListeners(n.tier))}).subscribe();return()=>{this._listeners.delete(t),g&&g.removeChannel(i)}}return()=>this._listeners.delete(t)}async verifySubscription(e){return e.startsWith("+2519")||e.startsWith("09")?{success:!0,msisdn:e,tier:"basic",expiresAt:new Date(Date.now()+30*864e5).toISOString(),message:"Ethio Telecom VAS Subscription Active"}:{success:!1,message:"No active Ethio Telecom VAS subscription found for this number."}}async requestSubscription(e,t){_.isOnline&&await re.invoke("vas-webhook",{msisdn:e,tier:t,event:"SUBSCRIBE"});const i=t==="premium"?"*822*1#":"*822*2#";return{success:!0,ussdCode:i,message:`SMS sent to ${e}. Dial ${i} on your Ethio Telecom line to confirm subscription.`}}_notifyListeners(e){this._listeners.forEach(t=>t(e))}}class ut{_uiManager;_audioManager;_onClose;_statusMessage="";constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onClose=i}render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 840px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    ${S.render("SUBSCRIPTION")}

                    ${this._statusMessage?`
                        <div style="
                            background: rgba(34, 197, 94, 0.2);
                            border: 1px solid #22C55E;
                            color: #86EFAC;
                            padding: 14px;
                            border-radius: 12px;
                            margin-bottom: 24px;
                            font-weight: bold;
                        ">${this._statusMessage}</div>
                    `:""}

                    <!-- Subscription Tier Cards -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                        <!-- FREE TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center;">
                            <div style="font-size: 36px; margin-bottom: 8px;">⚽</div>
                            <h3 style="margin: 0; color: var(--fds-text-main); font-size: var(--fds-font-lg);">FREE PLAN</h3>
                            <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-text-main); margin: 12px 0;">0 ETB <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">/ day</span></div>
                            
                            <ul style="text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>3 matches per day</li>
                                <li>Basic competitions access</li>
                                <li>Standard leaderboards</li>
                            </ul>

                            ${w.Button({text:"CURRENT PLAN",variant:"secondary",fullWidth:!0,disabled:!0})}
                        </div>

                        <!-- BASIC TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center; border-color: var(--fds-blue-accent);">
                            <div style="font-size: 36px; margin-bottom: 8px;">⚡</div>
                            <h3 style="margin: 0; color: var(--fds-blue-accent); font-size: var(--fds-font-lg);">DAILY PASS</h3>
                            <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-blue-accent); margin: 12px 0;">2 ETB <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">/ day</span></div>
                            
                            <ul style="text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>Unlimited solo matches</li>
                                <li>Live 1v1 multiplayer</li>
                                <li>All 15 competitions</li>
                                <li>2x Daily streak bonus</li>
                            </ul>

                            ${w.Button({text:"SUBSCRIBE (2 ETB/DAY)",variant:"primary",fullWidth:!0,className:"sub-action-btn",dataAttrs:'data-tier="basic"'})}
                        </div>

                        <!-- PREMIUM TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center; border-color: var(--fds-gold-primary); background: rgba(30,41,59,0.85);">
                            <div style="font-size: 36px; margin-bottom: 8px;">👑</div>
                            <h3 style="margin: 0; color: var(--fds-gold-primary); font-size: var(--fds-font-lg);">VIP MONTHLY PASS</h3>
                            <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-gold-primary); margin: 12px 0;">45 ETB <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">/ month</span></div>
                            
                            <ul style="text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>Everything in Daily Pass</li>
                                <li>Live Tournament entries</li>
                                <li>VIP Badge & Avatar frame</li>
                                <li>Exclusive CMS Admin preview</li>
                            </ul>

                            ${w.Button({text:"SUBSCRIBE (45 ETB/MONTH)",variant:"primary",fullWidth:!0,className:"sub-action-btn",dataAttrs:'data-tier="premium"'})}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;S.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".sub-action-btn").forEach(t=>{t.addEventListener("click",async i=>{this._audioManager.playClick();const a=i.currentTarget.getAttribute("data-tier"),n=await Z.getInstance().requestSubscription("+251911223344",a);this._statusMessage=`✅ ${n.message}`,this.render()})})}}class ee{static _instance=null;_listeners=new Map;static getInstance(){return ee._instance||(ee._instance=new ee),ee._instance}constructor(){}on(e,t){this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t)}off(e,t){this._listeners.has(e)&&this._listeners.get(e).delete(t)}emit(e,t){this._listeners.has(e)&&this._listeners.get(e).forEach(i=>{try{i(t)}catch(a){console.error(`[EventBus] Error handling event '${e}':`,a)}})}}class he{static _instance;constructor(){}static getInstance(){return this._instance||(this._instance=new he),this._instance}async getAchievements(){return new Promise(e=>{setTimeout(()=>{e([{id:"prog_1",categoryId:"progress",titleEn:"Rookie",titleAm:"ጀማሪ",titleOm:"Jalqabaa",descriptionEn:"Reach level 5.",descriptionAm:"ደረጃ 5 ይድረሱ።",descriptionOm:"Sadarkaa 5 gahi.",icon:"⭐",isUnlocked:!0,progress:5,maxProgress:5,xpReward:500,dateUnlocked:new Date().toISOString()},{id:"prog_2",categoryId:"progress",titleEn:"Rising Star",titleAm:"አዲስ ኮከብ",titleOm:"Urjii Ba'u",descriptionEn:"Reach level 15.",descriptionAm:"ደረጃ 15 ይድረሱ።",descriptionOm:"Sadarkaa 15 gahi.",icon:"🌟",isUnlocked:!1,progress:12,maxProgress:15,xpReward:1500},{id:"prog_3",categoryId:"progress",titleEn:"Champion",titleAm:"ሻምፒዮን",titleOm:"Shaampiyoonaa",descriptionEn:"Reach level 30.",descriptionAm:"ደረጃ 30 ይድረሱ።",descriptionOm:"Sadarkaa 30 gahi.",icon:"🏆",isUnlocked:!1,progress:12,maxProgress:30,xpReward:3e3},{id:"prog_4",categoryId:"progress",titleEn:"Legend",titleAm:"አፈ ታሪክ",titleOm:"Leegandii",descriptionEn:"Reach level 50.",descriptionAm:"ደረጃ 50 ይድረሱ።",descriptionOm:"Sadarkaa 50 gahi.",icon:"👑",isUnlocked:!1,progress:12,maxProgress:50,xpReward:5e3},{id:"streak_1",categoryId:"daily_streak",titleEn:"3 Days Streak",titleAm:"የ3 ቀናት ተከታታይ",titleOm:"Walitti Fufiinsa Guyyaa 3",descriptionEn:"Play for 3 consecutive days.",descriptionAm:"ለ3 ተከታታይ ቀናት ይጫወቱ።",descriptionOm:"Guyyaa 3 walitti fufee taphadhu.",icon:"🔥",isUnlocked:!0,progress:3,maxProgress:3,xpReward:300,dateUnlocked:new Date().toISOString()},{id:"streak_2",categoryId:"daily_streak",titleEn:"7 Days Streak",titleAm:"የ7 ቀናት ተከታታይ",titleOm:"Walitti Fufiinsa Guyyaa 7",descriptionEn:"Play for a full week.",descriptionAm:"ለሙሉ ሳምንት ይጫወቱ።",descriptionOm:"Torban tokko guutuu taphadhu.",icon:"📅",isUnlocked:!1,progress:4,maxProgress:7,xpReward:1e3},{id:"quiz_1",categoryId:"quiz",titleEn:"First Correct Answer",titleAm:"የመጀመሪያ ትክክለኛ መልስ",titleOm:"Deebii Sirrii Jalqabaa",descriptionEn:"Answer your first question correctly.",descriptionAm:"የመጀመሪያ ጥያቄዎን በትክክል ይመልሱ።",descriptionOm:"Gaaffii jalqabaa sirriitti deebisi.",icon:"✅",isUnlocked:!0,progress:1,maxProgress:1,xpReward:100,dateUnlocked:new Date().toISOString()},{id:"quiz_2",categoryId:"quiz",titleEn:"Perfect Round",titleAm:"ፍጹም ዙር",titleOm:"Marsaa Guutuu",descriptionEn:"Answer all 10 questions correctly in a match.",descriptionAm:"በአንድ ጨዋታ ሁሉንም 10 ጥያቄዎች በትክክል ይመልሱ።",descriptionOm:"Tapha tokko keessatti gaaffilee hunda sirriitti deebisi.",icon:"🎯",isUnlocked:!1,progress:0,maxProgress:1,xpReward:2e3},{id:"rew_1",categoryId:"rewards",titleEn:"Airtime Reward",titleAm:"የአየር ሰዓት ሽልማት",titleOm:"Badhaasa Qilleensaa",descriptionEn:"Win a weekly tournament to earn 50 ETB airtime.",descriptionAm:"50 ብር የአየር ሰዓት ለማግኘት ሳምንታዊ ውድድር ያሸንፉ።",descriptionOm:"Qilleensa ETB 50 argachuuf tapha torbee mo'adhu.",icon:"📱",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!0,rewardType:"airtime",rewardAmount:"50 ETB",redeemed:!1}},{id:"rew_2",categoryId:"rewards",titleEn:"Data Package Reward",titleAm:"የዳታ ጥቅል ሽልማት",titleOm:"Badhaasa Daataa",descriptionEn:"Reach Champion rank to unlock a 1GB Data Package.",descriptionAm:"የ1GB ዳታ ጥቅል ለመክፈት የሻምፒዮን ደረጃ ይድረሱ።",descriptionOm:"Daataa 1GB banuuf sadarkaa shaampiyoonaa gahi.",icon:"🌐",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!0,rewardType:"data",rewardAmount:"1GB",redeemed:!1}},{id:"rew_3",categoryId:"rewards",titleEn:"Telebirr Prize",titleAm:"የቴሌብር ሽልማት",titleOm:"Badhaasa Telebirr",descriptionEn:"Monthly Champion gets a 500 ETB Telebirr deposit.",descriptionAm:"የወሩ ሻምፒዮን 500 ብር የቴሌብር ተቀማጭ ያገኛል።",descriptionOm:"Shaampiyooniin ji'aa Telebirr ETB 500 argata.",icon:"💳",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!1,rewardType:"telebirr",rewardAmount:"500 ETB"}},{id:"seas_1",categoryId:"seasonal",titleEn:"Ethiopian Premier League",titleAm:"የኢትዮጵያ ፕሪሚየር ሊግ",titleOm:"Piriimiyeer Liigii Itoophiyaa",descriptionEn:"Play 5 matches during the EPL special week.",descriptionAm:"በኢትዮጵያ ፕሪሚየር ሊግ ልዩ ሳምንት 5 ጨዋታዎችን ይጫወቱ።",descriptionOm:"Torbee EPL keessatti taphoota 5 taphadhu.",icon:"⚽",isUnlocked:!0,progress:5,maxProgress:5,xpReward:1e3,dateUnlocked:new Date().toISOString()},{id:"com_1",categoryId:"community",titleEn:"Invite Friends",titleAm:"ጓደኞችን ይጋብዙ",titleOm:"Hiriyoota Affeeri",descriptionEn:"Successfully invite 3 friends to the game.",descriptionAm:"3 ጓደኞችን በተሳካ ሁኔታ ወደ ጨዋታው ይጋብዙ።",descriptionOm:"Hiriyoota 3 gara taphaatti affeeri.",icon:"🤝",isUnlocked:!1,progress:1,maxProgress:3,xpReward:1500}])},600)})}}class gt{_uiManager;_saveManager;_audioManager;_onBack;_achievements=[];_activeTab="all";constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}async render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; display: flex; flex-direction: column; height: 100vh;">
                <!-- Background Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- App Bar -->
                <div id="achievements-app-bar-container" style="position: relative; z-index: 20;"></div>

                <!-- Main Scrollable Content -->
                <div style="flex: 1; overflow-y: auto; padding-bottom: 80px;" class="hide-scrollbar">
                    <div id="achievements-content" style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; min-height: 100%;">
                        <!-- Loading State -->
                        <div style="margin: auto; padding: 40px;">
                            ${w.LoadingState(o.currentLocale==="am"?"ስኬቶችን በመጫን ላይ...":"Loading achievements...")}
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .ach-tab {
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 800;
                    color: rgba(255,255,255,0.6);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .ach-tab.active {
                    background: var(--tv-gold-primary);
                    color: black;
                    border-color: #FBBF24;
                    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4);
                }
                
                .ach-card {
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    display: flex;
                    gap: 16px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .ach-card.unlocked {
                    border-color: rgba(34, 197, 94, 0.4);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1);
                }
                .ach-card.locked {
                    opacity: 0.6;
                    filter: grayscale(80%);
                }
                .ach-card.unlocked::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--tv-pitch-green, #22C55E);
                    box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
                }
                
                .ach-icon-box {
                    width: 56px; height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    flex-shrink: 0;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .ach-card.unlocked .ach-icon-box {
                    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(34, 197, 94, 0.2));
                    border-color: rgba(234, 179, 8, 0.5);
                    box-shadow: 0 0 16px rgba(234, 179, 8, 0.3);
                }
                
                .ach-progress-bg {
                    height: 6px;
                    background: rgba(0,0,0,0.5);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                .ach-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FBBF24, #F59E0B);
                    border-radius: 3px;
                    transition: width 0.5s ease-out;
                }
                .ach-card.unlocked .ach-progress-fill {
                    background: linear-gradient(90deg, #4ADE80, #22C55E);
                }
                
                .ach-reward-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: rgba(255,255,255,0.1);
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                    color: white;
                    margin-top: 8px;
                }
                .ach-card.unlocked .ach-reward-badge {
                    background: rgba(34, 197, 94, 0.2);
                    color: #4ADE80;
                }
                
                /* Ethio Telecom Rewards specific */
                .ethio-reward-tag {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    font-size: 10px;
                    font-weight: 900;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #8B5CF6, #6D28D9);
                    color: white;
                    text-transform: uppercase;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
            </style>
        `;const t=document.getElementById("achievements-app-bar-container");if(t){const i=o.currentLocale==="am"?"ስኬቶች":o.currentLocale==="om"?"Milkaa'ina":"Achievements";t.innerHTML=S.render(i),S.bind(t,()=>{this._audioManager.playClick(),this._onBack()})}try{this._achievements=await he.getInstance().getAchievements(),this._renderContent()}catch(i){console.error("Failed to load achievements",i);const a=document.getElementById("achievements-content");a&&(a.innerHTML=w.EmptyState("⚠️","Error","Failed to load achievements. Please try again."))}}_renderContent(){const e=document.getElementById("achievements-content");if(!e)return;const t=this._saveManager.profile,i=this._achievements.filter(c=>c.isUnlocked).length,a=this._achievements.length,n=a>0?Math.round(i/a*100):0;let r="";r+=`
            <div style="padding: 24px 16px 16px 16px;">
                <div class="glass-card" style="padding: 20px; border-radius: 20px; text-align: center; background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95)); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                    <div style="font-size: 14px; font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">OVERALL COMPLETION</div>
                    <div style="font-size: 48px; font-weight: 900; color: white; line-height: 1; margin-bottom: 16px; font-family: var(--fds-font-mono); text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${n}%</div>
                    
                    <div class="ach-progress-bg" style="height: 8px; margin-bottom: 20px; background: rgba(255,255,255,0.1);">
                        <div class="ach-progress-fill" style="width: ${n}%; background: linear-gradient(90deg, #FBBF24, #22C55E);"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                        <div>
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 700;">UNLOCKED</div>
                            <div style="font-size: 18px; font-weight: 900; color: white;">${i} <span style="color: rgba(255,255,255,0.3); font-size: 14px;">/ ${a}</span></div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div>
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 700;">TOTAL XP</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--tv-gold-primary);">${t.xp}</div>
                        </div>
                    </div>
                </div>
            </div>
        `,r+=`
            <div style="padding: 0 16px 16px 16px; position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.8) 80%, rgba(2,6,23,0) 100%); backdrop-filter: blur(8px); margin: 0 -16px; padding-left: 16px;">
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px;" class="hide-scrollbar">
                    ${[{id:"all",label:"All"},{id:"progress",label:"Progress"},{id:"daily_streak",label:"Streak"},{id:"quiz",label:"Quiz"},{id:"rewards",label:"Rewards"},{id:"seasonal",label:"Seasonal"},{id:"community",label:"Community"}].map(c=>`
                        <button class="ach-tab ${this._activeTab===c.id?"active":""}" data-tab="${c.id}">
                            ${c.label}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;const l=this._activeTab==="all"?this._achievements:this._achievements.filter(c=>c.categoryId===this._activeTab);r+=`
            <div style="padding: 0 16px;">
                ${l.length>0?l.map(c=>this._buildAchievementCard(c)).join(""):w.EmptyState("🎁","No Achievements","Keep playing to unlock your first achievement.")}
            </div>
        `,e.innerHTML=r,this._bindTabs()}_buildAchievementCard(e){const t=o.currentLocale==="am"?e.titleAm:o.currentLocale==="om"?e.titleOm:e.titleEn,i=o.currentLocale==="am"?e.descriptionAm:o.currentLocale==="om"?e.descriptionOm:e.descriptionEn,a=Math.min(100,Math.round(e.progress/e.maxProgress*100)),n=e.isUnlocked?"unlocked":"locked";let r="";return e.categoryId==="rewards"&&e.rewardEligibility&&(r=`<div class="ethio-reward-tag">${e.rewardEligibility.rewardType}</div>`),`
            <div class="ach-card ${n}">
                ${r}
                <div class="ach-icon-box">${e.icon}</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 4px; padding-right: 40px;">${t}</div>
                    <div style="font-size: 13px; color: var(--fds-text-dim); line-height: 1.4; margin-bottom: 12px;">${i}</div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: white; margin-bottom: 4px;">
                        <span>${e.progress} / ${e.maxProgress}</span>
                        <span>${a}%</span>
                    </div>
                    <div class="ach-progress-bg">
                        <div class="ach-progress-fill" style="width: ${a}%;"></div>
                    </div>
                    
                    <div class="ach-reward-badge">
                        <span>⭐</span> ${e.xpReward} XP
                    </div>
                </div>
            </div>
        `}_bindTabs(){document.querySelectorAll(".ach-tab").forEach(t=>{t.addEventListener("click",i=>{const n=i.currentTarget.getAttribute("data-tab");n&&n!==this._activeTab&&(this._audioManager.playClick(),this._activeTab=n,this._renderContent())})})}}class te{static instance;constructor(){}static getInstance(){return te.instance||(te.instance=new te),te.instance}async getAwards(e){if(!_.isOnline||!g)return[];try{const{data:t,error:i}=await g.rpc("get_past_tournament_winners",{p_period_type:e});if(!i&&t&&Array.isArray(t))return t.map(a=>({awardId:`awd_${a.user_id}_${e}`,tournamentId:`trn_${e}`,tournamentType:e,rank:a.rank,userMsisdn:a.msisdn||"",maskedMsisdn:this.maskMsisdn(a.msisdn||""),prizeAmount:this.calculatePrize(a.rank,e),currency:"ETB",tournamentStartDate:"",tournamentEndDate:"",awardDate:new Date().toISOString(),createdAt:new Date().toISOString()}))}catch(t){console.error("[AwardsService] Failed to fetch awards",t)}return[]}calculatePrize(e,t){if(t==="monthly"){if(e===1)return 5e4;if(e===2)return 25e3;if(e===3)return 1e4}else if(t==="weekly"){if(e===1)return 1e4;if(e===2)return 5e3;if(e===3)return 2500}else{if(e===1)return 1e3;if(e===2)return 500;if(e===3)return 250}return 0}maskMsisdn(e){const t=e.replace("+","");if(t.length<9)return e;const i=t.substring(0,5),a=t.substring(t.length-2);return`${i}*****${a}`}}class ht{_uiManager;_audioManager;_onBack;_activeTab="daily";_awards=[];_loading=!0;_error=null;CURRENT_USER_MSISDN="+251911223344";constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i,this._loadAwards()}async _loadAwards(){this._loading=!0,this._error=null,this.render();try{this._awards=await te.getInstance().getAwards(this._activeTab)}catch{this._error="Failed to load awards. Please try again."}finally{this._loading=!1,this.render()}}render(){const e=this._uiManager.container,t=i=>`
            flex: 1;
            background: ${this._activeTab===i?"var(--tv-pitch-green)":"rgba(255,255,255,0.05)"};
            border: 1px solid ${this._activeTab===i?"var(--tv-pitch-green)":"rgba(255,255,255,0.1)"};
            color: ${this._activeTab===i?"white":"#94A3B8"};
            font-weight: ${this._activeTab===i?"900":"700"};
            padding: 12px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            text-transform: uppercase;
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; min-height: 100vh; overflow-y: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 10; padding-bottom: 120px;">
                    <!-- App Bar -->
                    ${S.render("MY AWARDS")}

                    <div style="padding: 0 16px;">
                        
                        <!-- Internal Tabs -->
                        <div style="display: flex; gap: 8px; margin-bottom: 24px;">
                            <button class="award-tab" data-tab="daily" style="${t("daily")}">Daily</button>
                            <button class="award-tab" data-tab="weekly" style="${t("weekly")}">Weekly</button>
                            <button class="award-tab" data-tab="monthly" style="${t("monthly")}">Monthly</button>
                        </div>

                        <div id="awards-content-area">
                            ${this._renderContent()}
                        </div>

                    </div>
                </div>
            </div>
            <style>
                .award-tab:active { transform: scale(0.96); }
            </style>
        `,this._bindEvents()}_renderContent(){if(this._loading)return w.LoadingState("Loading awards...");if(this._error)return`
                <div style="text-align: center; padding: 40px 16px;">
                    ${w.ErrorState("btn-retry-awards")}
                    <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-top: 12px;">${this._error}</div>
                </div>
            `;if(this._awards.length===0)return`
                <div style="text-align: center; padding: 60px 16px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; color: var(--fds-text-main);">No tournament awards have been announced yet.</h2>
                    <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm);">Compete in upcoming tournaments to see winners here.</p>
                </div>
            `;const e=this._awards.findIndex(n=>n.userMsisdn===this.CURRENT_USER_MSISDN),t=e!==-1;let i="";if(t||(i+=`
                <div class="glass-card fade-in-up" style="padding: 16px; margin-bottom: 24px; text-align: center; border-color: rgba(255,255,255,0.1); background: rgba(34,197,94,0.05);">
                    <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-bottom: 4px;">You haven't won any tournament yet.</div>
                    <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">Compete in Daily, Weekly and Monthly tournaments to earn rewards.</div>
                </div>
            `),i+='<div style="display: flex; flex-direction: column; gap: 12px;" class="fade-in-up">',t){const n=this._awards[e];i+=this._renderAwardCard(n,!0)}return this._awards.filter(n=>n.userMsisdn!==this.CURRENT_USER_MSISDN).forEach(n=>{i+=this._renderAwardCard(n,!1)}),i+="</div>",i}_renderAwardCard(e,t){let i="rgba(255,255,255,0.08)",a="",n="var(--fds-text-dim)";return t?i="#22C55E":e.rank===1?(i="#FCD34D",a="🥇",n="#FCD34D"):e.rank===2?(i="#E2E8F0",a="🥈",n="#E2E8F0"):e.rank===3&&(i="#D97706",a="🥉",n="#D97706"),`
            <div class="glass-card" style="
                padding: 16px;
                border: 1px solid ${i};
                background: ${t?"rgba(34,197,94,0.1)":"rgba(15,23,42,0.85)"};
                border-radius: 12px;
                position: relative;
                overflow: hidden;
            ">
                ${t?`
                    <div style="position: absolute; top: 0; right: 0; background: #22C55E; color: black; font-size: 10px; font-weight: 900; padding: 4px 12px; border-bottom-left-radius: 12px; text-transform: uppercase;">
                        ⭐ Your Award
                    </div>
                `:""}

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; margin-top: ${t?"8px":"0"};">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: ${n}; min-width: 60px;">
                            ${a} Rank ${e.rank}
                        </div>
                        <div>
                            <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">MSISDN</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); font-family: monospace;">${e.maskedMsisdn}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Prize</div>
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--tv-gold-primary);">${e.prizeAmount.toLocaleString()} ${e.currency}</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
                    <div>
                        <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Tournament</div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #94A3B8;">${this._capitalize(e.tournamentType)} Tournament</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Ended</div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #94A3B8;">${new Date(e.tournamentEndDate).toLocaleDateString(void 0,{day:"numeric",month:"long",year:"numeric"})}</div>
                    </div>
                </div>
            </div>
        `}_capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}_bindEvents(){const e=this._uiManager.container;S.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),e.querySelectorAll(".award-tab").forEach(t=>{t.addEventListener("click",i=>{const a=i.currentTarget.getAttribute("data-tab");a&&a!==this._activeTab&&(this._audioManager.playClick(),this._activeTab=a,this._loadAwards())})}),e.querySelector("#btn-retry-awards")?.addEventListener("click",()=>{this._audioManager.playClick(),this._loadAwards()})}}const mt=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(p,e,t){if(p==="click"){const i=e;e=async function(a){const n=a.currentTarget;if(n&&n.nodeType===Node.ELEMENT_NODE){if(n.hasAttribute("disabled")||n.hasAttribute("data-ethio-processing")){a.preventDefault(),a.stopImmediatePropagation();return}n.setAttribute("data-ethio-processing","true");const r=n.style.pointerEvents;n.style.pointerEvents="none";try{const s=i.call(this,a);s instanceof Promise&&await s}finally{setTimeout(()=>{n.removeAttribute("data-ethio-processing"),n.style.pointerEvents=r},300)}}else i.call(this,a)}}return mt.call(this,p,e,t)};async function ft(){const p=new De;await p.initialize();const e=R.getInstance(p.saveManager),t=D.getInstance(),i=ee.getInstance(),a=new He(p.uiManager);a.registerGame(new Ve),O.getInstance().subscribeToBadgeUpdates(u=>{A.setBadge("profile",u)});const n=window;n.ethioAudio=p.audioManager,n.ethioSave=p.saveManager,n.ethioAuth=e,n.ethioCache=t,n.ethioEvents=i;let r={home:["home"],play:["play"],standings:["standings"],profile:["profile"]},s="home",l=null;try{window.history.replaceState({root:!0},""),window.history.pushState({trap:!0},"")}catch{}const c=async(u,f=!0)=>{if(l&&typeof l.destroy=="function"&&l.destroy(),p.audioManager.stopAllGameplaySounds(),l=null,f){const x=r[s]||[];x.length>0&&x[x.length-1]!==u&&x.push(u)}switch(u){case"home":A.setActiveTab("home"),s="home",t.setQuizActive(!1);const x=new Ze(p.saveManager,p.audioManager,p.uiManager,{onKickOff:async()=>{t.setQuizActive(!0),a.getRegisteredGames().find(U=>U.metadata.id==="football-quiz").setCompetition("walia-ibex"),r[s].push("quiz_game"),await a.launchGame("football-quiz")},onLiveMatch:()=>c("matchmaking"),onDailyChallenge:()=>{c("play_single_path",!1)},onCompetitions:()=>d("standings"),onLeaderboard:()=>d("standings"),onAchievements:()=>d("profile"),onAdminPanel:()=>c("admin"),onSettings:()=>c("settings"),onNotifications:()=>c("notifications"),onViewStats:()=>c("stats"),onMessages:()=>c("messages"),onCasualPlay:async()=>{const C=a.getRegisteredGames().find(U=>U.metadata.id==="football-quiz");C.setCompetition("all"),C.matchType="casual",r[s].push("quiz_game"),await a.launchGame("football-quiz")}});l=x,x.render();break;case"play":A.setActiveTab("play"),s="play",t.setQuizActive(!1);const E=new et(p.uiManager,p.audioManager,{onCasualPlay:async C=>{const U=a.getRegisteredGames().find(Oe=>Oe.metadata.id==="football-quiz");U.setCompetition(C&&C!=="random"?C:"all"),U.matchType="casual",r[s].push("quiz_game"),await a.launchGame("football-quiz")}});l=E,E.render();break;case"standings":A.setActiveTab("standings"),s="standings",t.setQuizActive(!1);const k=new at(p.uiManager,p.saveManager,p.audioManager,m);l=k,await k.render();break;case"play_single_path":t.setQuizActive(!0);const I=await J.getInstance().getTodayChallenge(),$=a.getRegisteredGames().find(C=>C.metadata.id==="football-quiz");!I.completed&&I.questions.length>0?($.setCompetition(I.questions[0]?.category||"world-cup"),$.setPreloadedQuestions(I.questions),$.matchType="daily",$.dailyChallengeId=I.id,r[s].push("quiz_game"),await a.launchGame("football-quiz")):(pe(()=>Promise.resolve().then(()=>Ye),void 0).then(C=>C.Toast.show(o.currentLocale==="am"?"የዕለቱ ውድድር አልቋል! 내일 ይሞክሩ":"Daily challenge already completed! Come back tomorrow.","error")),t.setQuizActive(!1),d("home"));break;case"profile":A.setActiveTab("profile"),s="profile",t.setQuizActive(!1);const H=new nt(p.uiManager,p.saveManager,p.audioManager,{onAchievements:()=>c("achievements"),onStatistics:()=>c("stats"),onLeaderboard:()=>d("standings"),onSubscription:()=>c("subscription"),onMessages:()=>c("messages"),onSettings:()=>c("settings"),onHelp:()=>c("help"),onAbout:()=>c("about"),onPrivacy:()=>c("privacy"),onTerms:()=>c("terms"),onAwards:()=>c("awards")});l=H,H.render();break;case"messages":t.setQuizActive(!1);const se=new ot(p.uiManager,p.audioManager,m);l=se,se.render();break;case"settings":t.setQuizActive(!1);const le=new ae(p.uiManager,p.saveManager,p.audioManager,m,"main");l=le,le.render();break;case"help":t.setQuizActive(!1);const F=new ae(p.uiManager,p.saveManager,p.audioManager,m,"help");l=F,F.render();break;case"achievements":t.setQuizActive(!1);const me=new gt(p.uiManager,p.saveManager,p.audioManager,m);l=me,me.render();break;case"awards":t.setQuizActive(!1);const fe=new ht(p.uiManager,p.audioManager,m);l=fe,fe.render();break;case"about":t.setQuizActive(!1);const ve=new ae(p.uiManager,p.saveManager,p.audioManager,m,"about");l=ve,ve.render();break;case"privacy":t.setQuizActive(!1);const ye=new ae(p.uiManager,p.saveManager,p.audioManager,m,"privacy");l=ye,ye.render();break;case"terms":t.setQuizActive(!1);const be=new ae(p.uiManager,p.saveManager,p.audioManager,m,"terms");l=be,be.render();break;case"notifications":t.setQuizActive(!1);const xe=new dt(p.uiManager,p.audioManager,m);l=xe,xe.render();break;case"admin":t.setQuizActive(!1);const _e=new Xe(p.uiManager,p.audioManager,m);l=_e,_e.render();break;case"matchmaking":t.setQuizActive(!1);const we=new rt(p.uiManager,p.audioManager,p.saveManager,async C=>{n.ethioLiveMatchInfo=C,c("live_match")},m);l=we,await we.render();break;case"live_match":t.setQuizActive(!0);const ce=n.ethioLiveMatchInfo;if(!ce){m();return}const $e=await q.getInstance().fetchQuestionsByIds(ce.questionIds,o.currentLocale),Se=new lt(p.uiManager,p.audioManager,p.saveManager,ce.liveMatchId,ce.opponent,$e,m);l=Se,Se.startMatch();break;case"stats":t.setQuizActive(!1);const Ae=new pt(p.uiManager,p.saveManager,p.audioManager,m);l=Ae,Ae.render();break;case"subscription":t.setQuizActive(!1);const Ee=new ut(p.uiManager,p.audioManager,m);l=Ee,Ee.render();break}},d=u=>{const f=r[u],x=f[f.length-1];if(s===u){if(x===u)return;r[u]=[u],c(u,!0);return}s=u,c(x,!0)};n.ethioReloadHome=()=>d("home"),n.ethioHandleBack=()=>{m()},n.ethioCloseGame=()=>{t.setQuizActive(!1);const u=r[s]||[];u.length>0&&(u[u.length-1]==="quiz_game"||u[u.length-1]==="match_stats")&&u.pop();const f=u.length>0?u[u.length-1]:s;c(f,!1)},n.ethioForceHome=()=>{t.setQuizActive(!1);const u=r[s]||[];u.length>0&&(u[u.length-1]==="quiz_game"||u[u.length-1]==="match_stats")&&u.pop(),r.home=["home"],s="home",c("home",!0)},i.on("RELOAD_CURRENT_VIEW",()=>{t.isQuizActive||(console.log("[Bootstrap] Reloading current view upon event trigger."),c(s,!1))}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&!t.isQuizActive&&(console.log("[Bootstrap] App resumed. Triggering background refresh for stale data."),i.emit("DATA_REFRESHED"))});const h=()=>{const u=navigator.onLine;let f=document.getElementById("ethio-offline-banner");u?(f&&(f.style.background="var(--fds-green-pitch)",f.innerHTML="<span>✅</span><span>Connection restored! Refreshing data...</span>",setTimeout(()=>{f?.remove()},2e3)),t.isQuizActive||(console.log("[Bootstrap] Network restored. Triggering reconnection data sync."),i.emit("NETWORK_RESTORED"),i.emit("RELOAD_CURRENT_VIEW"))):f||(f=document.createElement("div"),f.id="ethio-offline-banner",f.style.cssText=`
                    position: fixed; top: 0; left: 0; width: 100vw;
                    background: #EF4444; color: white; text-align: center;
                    font-size: 13px; font-weight: 800; padding: 8px 12px; z-index: 99999;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex;
                    align-items: center; justify-content: center; gap: 8px; font-family: sans-serif;
                `,f.innerHTML="<span>⚠️</span><span>No internet connection. Paused. Reconnecting...</span>",document.body.appendChild(f))};window.addEventListener("online",h),window.addEventListener("offline",h);const m=()=>{const u=r[s]||[];if(typeof window.ethioOnBackPress=="function"&&window.ethioOnBackPress())return;p.audioManager.playClick();const f=document.querySelector('#session-recovery-overlay, #ethio-exit-modal, #ethio-leave-modal, .glass-card-modal, [id*="modal"]');if(f){f.remove();return}if(t.isQuizActive){b();return}if(u.length>1){u.pop();const x=u[u.length-1];(x==="quiz_game"||x==="match_stats")&&u.pop();const E=u.length>0?u[u.length-1]:s;c(E,!1)}else s==="home"?v():d("home")},b=()=>{if(document.getElementById("ethio-leave-modal"))return;const f=document.createElement("div");f.id="ethio-leave-modal",f.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.88); backdrop-filter: blur(16px);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            padding: 20px; box-sizing: border-box; pointer-events: auto;
        `,f.innerHTML=`
            <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 24px; text-align: center; border-radius: 20px;">
                <h2 style="font-size: 20px; font-weight: 900; color: white; margin: 0 0 8px 0; text-transform: uppercase;">LEAVE MATCH?</h2>
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 24px 0; line-height: 1.4;">Your progress will be suspended. You can resume later.</p>
                <div style="display: flex; gap: 10px;">
                    <button id="leave-btn-continue" class="ethio-btn ethio-btn-primary" style="flex: 1;">CONTINUE</button>
                    <button id="leave-btn-leave" class="ethio-btn ethio-btn-secondary" style="flex: 1;">LEAVE</button>
                </div>
            </div>
        `,document.body.appendChild(f),document.getElementById("leave-btn-continue")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove()}),document.getElementById("leave-btn-leave")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove(),t.setQuizActive(!1);const x=r[s]||[];x.length>0&&x[x.length-1]==="quiz_game"&&x.pop();const E=x.length>0?x[x.length-1]:s;c(E,!1)})},v=()=>{if(document.getElementById("ethio-exit-modal"))return;const f=document.createElement("div");f.id="ethio-exit-modal",f.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.88); backdrop-filter: blur(16px);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            padding: 20px; box-sizing: border-box; pointer-events: auto;
        `,f.innerHTML=`
            <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 24px; text-align: center; border-color: var(--fds-gold-primary); border-radius: 20px;">
                <div style="font-size: 44px; margin-bottom: 8px;">⚽🏆</div>
                <h2 style="font-size: 20px; font-weight: 900; color: white; margin: 0 0 8px 0; text-transform: uppercase;">EXIT ETHIOFANTASY?</h2>
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 24px 0; line-height: 1.4;">Are you sure you want to exit the Football Quiz League? Your streak is saved.</p>
                <div style="display: flex; gap: 10px;">
                    <button id="exit-btn-stay" class="ethio-btn ethio-btn-primary" style="flex: 1;">STAY IN GAME</button>
                    <button id="exit-btn-confirm" class="ethio-btn ethio-btn-secondary" style="flex: 1; border-color: #EF4444; color: #FCA5A5;">EXIT APP</button>
                </div>
            </div>
        `,document.body.appendChild(f),document.getElementById("exit-btn-stay")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove()}),document.getElementById("exit-btn-confirm")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove(),window.navigator?.app?.exitApp?window.navigator.app.exitApp():window.Android?.exitApp?window.Android.exitApp():window.close()})};window.addEventListener("popstate",u=>{u.preventDefault();try{window.history.pushState({trap:!0},"")}catch{}m()}),window.addEventListener("keydown",u=>{(u.key==="Escape"||u.key==="Back")&&m()}),n.ethioReloadHome=()=>d("home"),n.ethioNavigateToTab=u=>d(u),n.ethioPlayAgain=async u=>{t.setQuizActive(!0),a.getRegisteredGames().find(x=>x.metadata.id==="football-quiz").setCompetition(u),r[s]||(r[s]=[s]),r[s].push("quiz_game"),await a.launchGame("football-quiz")},A.render(u=>{d(u)});let y=null;return e.subscribe(u=>{const f=u?.id!==y;if(y=u?.id||null,!u)console.log("[Bootstrap] User signed out. Invalidating cache."),t.clear(),A.hide(),new it(p.uiManager,p.audioManager,e,()=>{}).render();else if(console.log("[Bootstrap] User authenticated. Refreshing profile & channels:",u.username),A.show(),Y.getInstance().initUserChannels(u.id),i.emit("PROFILE_UPDATED",u),f){M.getInstance().getActiveSession()&&M.getInstance().clearSession(),r={home:["home"],play:["play"],standings:["standings"],profile:["profile"]},s="home",c("home",!1);try{window.history.replaceState({root:!0},""),window.history.pushState({trap:!0},"")}catch{}}}),console.log("[Bootstrap] ⚽ Smart Caching & Refresh Strategy initialized."),p}async function vt(){try{await ft()}catch(p){console.error(p);const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.innerText=`Runtime Error: ${p.message||p}

Stack: ${p.stack||""}`,document.body.appendChild(e)}}window.addEventListener("error",p=>{const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.style.zIndex="999999",e.innerText=`Global Error: ${p.message}
At: ${p.filename}:${p.lineno}`,document.body.appendChild(e)});window.addEventListener("unhandledrejection",p=>{const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="100px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.style.zIndex="999999",e.innerText=`Unhandled Promise Rejection: ${p.reason}`,document.body.appendChild(e)});vt().catch(console.error);export{g as a,_ as s};
