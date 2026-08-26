const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/TournamentService-DcYfsBlB.js","assets/supabase-kic3bLQH.js"])))=>i.map(i=>d[i]);
import{c as ze}from"./supabase-kic3bLQH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const Be="modulepreload",Pe=function(p){return"/"+p},Ae={},pe=function(e,t,i){let a=Promise.resolve();if(t&&t.length>0){let n=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=o?.nonce||o?.getAttribute("nonce");a=n(t.map(c=>{if(c=Pe(c),c in Ae)return;Ae[c]=!0;const d=c.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${g}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":Be,d||(m.as="script"),m.crossOrigin="",m.href=c,l&&m.setAttribute("nonce",l),document.head.appendChild(m),d)return new Promise((x,y)=>{m.addEventListener("load",x),m.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return a.then(n=>{for(const o of n||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};class Re{_container;constructor(){let e=document.getElementById("ui-root");e||(e=document.createElement("div"),e.id="ui-root",e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.fontFamily="system-ui, -apple-system, sans-serif",document.body.appendChild(e)),this._container=e}get container(){return this._container}clear(){this._container.innerHTML="",this._container.classList.remove("page-transition-enter"),this._container.offsetWidth,this._container.classList.add("page-transition-enter")}}const Ee="https://eywvrsqiqvmiktovaxmq.supabase.co",Fe="sb_publishable_vSzKiN0dx8mgRRb3jsDonQ_BesE-gSx";class Y{static _instance=null;_client=null;constructor(){try{this._client=ze(Ee,Fe,{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:window.sessionStorage},realtime:{params:{eventsPerSecond:10}}}),console.log("[SupabaseClient] Initialized successfully with URL:",Ee)}catch(e){console.error("[SupabaseClient] Failed to initialize Supabase client:",e),this._client=null}}static getInstance(){return Y._instance||(Y._instance=new Y),Y._instance}get client(){return this._client}get isOnline(){return this._client!==null}}const _=Y.getInstance(),h=_.client,qe=Object.freeze(Object.defineProperty({__proto__:null,supabase:h,supabaseService:_},Symbol.toStringTag,{value:"Module"}));class Te{_profile;_cloudUserId=null;constructor(){this._profile=this._defaultProfile()}get cloudUserId(){return this._cloudUserId}_defaultProfile(){return{username:"Player",coins:0,xp:0,highScores:{"football-quiz":0},unlockedItems:["default-ball","default-jersey"],eloRating:0,streakCount:0,totalMatches:0,totalWins:0}}syncWithCloudUser(e){this._cloudUserId=e.id,this._profile.username=e.username,this._profile.coins=e.coins,this._profile.xp=e.xp,this._profile.eloRating=e.elo_rating,this._profile.streakCount=e.streak_count,this._profile.totalMatches=e.total_matches,this._profile.totalWins=e.total_wins,e.phone&&(this._profile.phone=e.phone),this.save()}save(){const e=_.client;if(this._cloudUserId&&e){let t=0;if(this._profile.highScores)for(const i in this._profile.highScores)t+=this._profile.highScores[i];e.from("users").update({username:this._profile.username,coins:this._profile.coins,xp:this._profile.xp,score:t,elo_rating:this._profile.eloRating||0,streak_count:this._profile.streakCount||0,total_matches:this._profile.totalMatches||0,total_wins:this._profile.totalWins||0,last_active:new Date().toISOString()}).eq("id",this._cloudUserId).then(({error:i})=>{i&&console.error("[SaveManager] Error syncing profile to cloud:",i)})}}get profile(){return this._profile}updateUsername(e){this._profile.username=e,this.save()}updateHighScore(e,t){const i=this._profile.highScores[e]||0;return t>i?(this._profile.highScores[e]=t,this._profile.xp+=Math.floor(t*.5),this.save(),!0):!1}addCoins(e){this._profile.coins+=e,this.save()}addXp(e){this._profile.xp+=e,this.save()}incrementMatchStats(e){this._profile.totalMatches=(this._profile.totalMatches||0)+1,e&&(this._profile.totalWins=(this._profile.totalWins||0)+1),this.save()}updateStreak(e){this._profile.streakCount=e,this.save()}isAdmin(){return this._profile.role==="admin"}}class Ie{_ctx=null;_isMuted=!1;_crowdGain=null;_crowdSource=null;_correctAnswerBuffer=null;_wrongAnswerBuffer=null;_answerSelectedBuffer=null;_finalWhistleBuffer=null;_questionArriveBuffer=null;_activeGameplaySound=null;constructor(){const e=localStorage.getItem("ETHIO_FOOTBALL_MUTED");e!==null&&(this._isMuted=e==="true"),typeof document<"u"&&document.addEventListener("visibilitychange",()=>{document.hidden&&this.stopAllGameplaySounds(.05)})}stopAllGameplaySounds(e=.08){if(this.stopCrowdAmbience(),!this._ctx||!this._activeGameplaySound)return;const t=this._activeGameplaySound;this._activeGameplaySound=null,t.timeoutId&&clearTimeout(t.timeoutId);const i=this._ctx.currentTime;try{t.gain.gain.cancelScheduledValues(i),t.gain.gain.setValueAtTime(t.gain.gain.value,i),t.gain.gain.linearRampToValueAtTime(.01,i+e),t.source.stop(i+e+.02)}catch{}}_playManagedSound(e,t,i,a=0){if(this.stopAllGameplaySounds(.02),!e||(this._initContext(),!this._ctx))return;const r=this._ctx.createBufferSource();r.buffer=e;const n=this._ctx.createGain();n.gain.value=t,r.connect(n),n.connect(this._ctx.destination),r.start(this._ctx.currentTime+a);const o={source:r,gain:n,timeoutId:void 0};this._activeGameplaySound=o,i&&(o.timeoutId=setTimeout(()=>{this._activeGameplaySound===o&&this.stopAllGameplaySounds(.08)},i))}_initContext(){if(!this._ctx){const e=window.AudioContext||window.webkitAudioContext;this._ctx=new e,console.log("[AudioManager] Football stadium Web AudioContext initialized.")}this._ctx.state==="suspended"&&this._ctx.resume()}_vibrate(e){if(!this._isMuted&&typeof navigator<"u"&&navigator.vibrate)try{navigator.vibrate(e)}catch{}}playClick(){if(this._isMuted||(this._vibrate(10),this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(800,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(400,this._ctx.currentTime+.05),t.gain.setValueAtTime(.15,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.05),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.05)}playWhistle(){if(this._isMuted||(this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createOscillator(),i=this._ctx.createGain();e.type="sine",t.type="sine",e.frequency.setValueAtTime(2400,this._ctx.currentTime),t.frequency.setValueAtTime(2450,this._ctx.currentTime),i.gain.setValueAtTime(.18,this._ctx.currentTime),i.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.35),e.connect(i),t.connect(i),i.connect(this._ctx.destination),e.start(),t.start(),e.stop(this._ctx.currentTime+.35),t.stop(this._ctx.currentTime+.35)}playFullTimeWhistle(){if(!this._isMuted&&(this._vibrate([30,40,30]),this._initContext(),!!this._ctx)){if(!this._finalWhistleBuffer){const e=(i,a)=>{if(!this._ctx)return;const r=this._ctx.createOscillator(),n=this._ctx.createOscillator(),o=this._ctx.createGain();r.type="sine",n.type="sine",r.frequency.setValueAtTime(2400,i),n.frequency.setValueAtTime(2450,i),o.gain.setValueAtTime(0,i),o.gain.linearRampToValueAtTime(.18,i+.05),o.gain.setValueAtTime(.18,i+a-.1),o.gain.linearRampToValueAtTime(0,i+a),r.connect(o),n.connect(o),o.connect(this._ctx.destination),r.start(i),n.start(i),r.stop(i+a),n.stop(i+a)},t=this._ctx.currentTime;e(t,.25),e(t+.35,.25),e(t+.7,.6);return}this._playManagedSound(this._finalWhistleBuffer,.75,void 0,.15)}}playCrowdAmbience(){if(this._isMuted||(this._initContext(),!this._ctx||this._crowdSource))return;const e=this._ctx.sampleRate*2,t=this._ctx.createBuffer(1,e,this._ctx.sampleRate),i=t.getChannelData(0);let a=0,r=0,n=0;for(let o=0;o<e;o++){const l=Math.random()*2-1;a=.99886*a+l*.0555179,r=.99332*r+l*.0750759,n=.969*n+l*.153852,i[o]=(a+r+n)*.04}this._crowdSource=this._ctx.createBufferSource(),this._crowdSource.buffer=t,this._crowdSource.loop=!0,this._crowdGain=this._ctx.createGain(),this._crowdGain.gain.setValueAtTime(.04,this._ctx.currentTime),this._crowdSource.connect(this._crowdGain),this._crowdGain.connect(this._ctx.destination),this._crowdSource.start()}stopCrowdAmbience(){if(this._crowdSource){try{this._crowdSource.stop()}catch{}this._crowdSource=null}}playGoalCheer(){if(this._isMuted||(this._initContext(),!this._ctx))return;this.playWhistle();const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(140,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(40,this._ctx.currentTime+.12),t.gain.setValueAtTime(.3,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.12),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.12),[523.25,659.25,783.99,1046.5].forEach((a,r)=>{if(!this._ctx)return;const n=this._ctx.createOscillator(),o=this._ctx.createGain();n.type="triangle",n.frequency.setValueAtTime(a,this._ctx.currentTime+r*.08),o.gain.setValueAtTime(.2,this._ctx.currentTime+r*.08),o.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+r*.08+.3),n.connect(o),o.connect(this._ctx.destination),n.start(this._ctx.currentTime+r*.08),n.stop(this._ctx.currentTime+r*.08+.3)})}playWrongAnswer(e){this._isMuted||(this._vibrate([40,20,40]),this._wrongAnswerBuffer&&this._playManagedSound(this._wrongAnswerBuffer,.7,e))}playAnswerSelected(e){if(!this._isMuted){if(!this._answerSelectedBuffer){this.playClick();return}this._playManagedSound(this._answerSelectedBuffer,.4,e)}}playQuestionArrive(){this._isMuted||(this._vibrate([10]),this._questionArriveBuffer&&this._playManagedSound(this._questionArriveBuffer,.45))}playCountdownWarning(){if(this._isMuted||(this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(70,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(30,this._ctx.currentTime+.08),t.gain.setValueAtTime(.3,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.08),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.08);const i=this._ctx.createOscillator(),a=this._ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(1200,this._ctx.currentTime),a.gain.setValueAtTime(.12,this._ctx.currentTime),a.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.04),i.connect(a),a.connect(this._ctx.destination),i.start(),i.stop(this._ctx.currentTime+.04)}async preloadAssets(){if(!this._isMuted)try{const[e,t,i,a,r]=await Promise.all([fetch("/assets/audios/Righ%20Answer%20score%20goal.m4a"),fetch("/assets/audios/wrong%20answer.m4a"),fetch("/assets/audios/Answer%20selected.m4a"),fetch("/assets/audios/whistle%20when%20game%20ends%20or%20timout.m4a"),fetch("/assets/audios/question-arrive.mp3")]);if(!this._ctx){const n=window.AudioContext||window.webkitAudioContext;this._ctx=new n}if(e.ok){const n=await e.arrayBuffer();this._correctAnswerBuffer=await this._ctx.decodeAudioData(n)}if(t.ok){const n=await t.arrayBuffer();this._wrongAnswerBuffer=await this._ctx.decodeAudioData(n)}if(i.ok){const n=await i.arrayBuffer();this._answerSelectedBuffer=await this._ctx.decodeAudioData(n)}if(a.ok){const n=await a.arrayBuffer();this._finalWhistleBuffer=await this._ctx.decodeAudioData(n)}if(r.ok){const n=await r.arrayBuffer();this._questionArriveBuffer=await this._ctx.decodeAudioData(n)}console.log("[AudioManager] Audio assets preloaded successfully.")}catch(e){console.warn("[AudioManager] Failed to preload audio assets",e)}}playCorrectAnswerGoal(e){if(!this._isMuted){if(this._vibrate([30,40,30]),!this._correctAnswerBuffer){this.playGoalCheer();return}this._playManagedSound(this._correctAnswerBuffer,.8,e)}}playVictoryFanfare(){if(this._isMuted||(this._initContext(),!this._ctx))return;[523.25,659.25,783.99,1046.5,1318.51].forEach((t,i)=>{if(!this._ctx)return;const a=this._ctx.createOscillator(),r=this._ctx.createGain();a.type="triangle",a.frequency.setValueAtTime(t,this._ctx.currentTime+i*.1),r.gain.setValueAtTime(.25,this._ctx.currentTime+i*.1),r.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+i*.1+.35),a.connect(r),r.connect(this._ctx.destination),a.start(this._ctx.currentTime+i*.1),a.stop(this._ctx.currentTime+i*.1+.35)})}playDefeatSound(){this._isMuted||(this._initContext(),this._ctx&&this.playWhistle())}toggleMute(){return this._isMuted=!this._isMuted,localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(this._isMuted)),this._isMuted&&this.stopCrowdAmbience(),this._isMuted}get isMuted(){return this._isMuted}}class De{_uiManager;_saveManager;_audioManager;constructor(){this._uiManager=new Re,this._saveManager=new Te,this._audioManager=new Ie}async initialize(){this._audioManager.preloadAssets()}get uiManager(){return this._uiManager}get saveManager(){return this._saveManager}get audioManager(){return this._audioManager}}class Ne{_games=new Map;_activeGame=null;_uiManager;constructor(e){this._uiManager=e}registerGame(e){this._games.set(e.metadata.id,e),console.log(`[GameRegistry] Registered game: ${e.metadata.name} (${e.metadata.id})`)}getRegisteredGames(){return Array.from(this._games.values())}async launchGame(e){this._activeGame&&(console.log(`[GameRegistry] Destroying active game: ${this._activeGame.metadata.name}`),this._activeGame.destroy(),this._uiManager.clear());const t=this._games.get(e);if(!t)throw new Error(`[GameRegistry] Game with ID '${e}' not found.`);console.log(`[GameRegistry] Initializing game: ${t.metadata.name}`),await t.initialize(this._uiManager),this._activeGame=t,t.start()}get activeGame(){return this._activeGame}}class He{_goals=0;_correct=0;_incorrect=0;_total=0;_currentCombo=0;_maxCombo=0;_responseTimes=[];_answerSubmissions=[];reset(){this._goals=0,this._correct=0,this._incorrect=0,this._total=0,this._currentCombo=0,this._maxCombo=0,this._responseTimes=[],this._answerSubmissions=[]}recordAnswer(e,t,i,a){if(this._total++,this._responseTimes.push(t),i&&a!==void 0&&this._answerSubmissions.push({questionId:i,selectedIndex:a,responseTimeMs:Math.round(t*1e3)}),e){this._goals++,this._correct++,this._currentCombo++,this._currentCombo>this._maxCombo&&(this._maxCombo=this._currentCombo);const r=100,n=(this._currentCombo-1)*25,o=r+n,l=20+this._currentCombo*5;return{isGoal:!0,coins:o,xp:l}}else return this._incorrect++,this._currentCombo=0,{isGoal:!1,coins:0,xp:0}}get answerSubmissions(){return this._answerSubmissions}calculateFinalStats(){const e=this._total>0?Math.round(this._correct/this._total*100):0,t=Math.min(Math.max(Math.round(e*.85+15),30),85),i=this._responseTimes.reduce((c,d)=>c+d,0),a=this._responseTimes.length>0?parseFloat((i/this._responseTimes.length).toFixed(1)):0,r=this._correct*100+this._maxCombo*50,n=this._correct*20+this._maxCombo*10;let o=5+e/20+this._maxCombo*.4;a>0&&a<5&&(o+=1);const l=parseFloat(Math.min(Math.max(o,3),10).toFixed(1));return{goals:this._goals,correctAnswers:this._correct,incorrectAnswers:this._incorrect,totalQuestions:this._total,accuracy:e,possessionPercent:t,avgResponseTime:a,maxCombo:this._maxCombo,coinsEarned:r,xpEarned:n,matchRating:l}}}const Me={"world-cup":{id:"world-cup",nameEn:"FIFA World Cup",nameAm:"የዓለም ዋንጫ",nameOm:"Waancaa Addunyaa FIFA",badge:"🏆",description:"World Cup history, records, hosts, and legend moments"},"champions-league":{id:"champions-league",nameEn:"UEFA Champions League",nameAm:"UEFA ቻምፒየንስ ሊግ",nameOm:"Liigii Chaampiyoonsii UEFA",badge:"⭐",description:"European club football, iconic finals, and top scorers"},"caf-champions":{id:"caf-champions",nameEn:"CAF Champions League",nameAm:"የCAF ሻምፒዮንስ ሊግ",nameOm:"Liigii Chaampiyoonsii CAF",badge:"🌍",description:"African club football and continental showdowns"},afcon:{id:"afcon",nameEn:"Africa Cup of Nations (AFCON)",nameAm:"የአፍሪካ ዋንጫ (AFCON)",nameOm:"Waancaa Afriikaa (AFCON)",badge:"🦁",description:"Africa's flagship national team championship"},"ethiopian-premier":{id:"ethiopian-premier",nameEn:"Ethiopian Premier League",nameAm:"የኢትዮጵያ ፕሪሚየር ሊግ",nameOm:"Liigii Piriimeraa Itoophiyaa",badge:"🇪🇹",description:"Ethiopian club teams, derbies, and domestic history"},"walia-ibex":{id:"walia-ibex",nameEn:"Walia Ibex (National Team)",nameAm:"ዋሊያ ኢቤክስ (ብሔራዊ ቡድን)",nameOm:"Waaliyaa Ibeks (Garaa Guutuu)",badge:"🐐",description:"Ethiopian national team milestones and heroes"},"premier-league":{id:"premier-league",nameEn:"English Premier League",nameAm:"የእንግሊዝ ፕሪሚየር ሊግ",nameOm:"Liigii Piriimeraa Ingilaand",badge:"🦁",description:"EPL clubs, managers, top scorers, and records"},"la-liga":{id:"la-liga",nameEn:"Spanish La Liga",nameAm:"የስፔን ላ ሊጋ",nameOm:"Laa Liigaa Ispeen",badge:"🇪🇸",description:"El Clásico, Spanish giants, and title races"},"serie-a":{id:"serie-a",nameEn:"Italian Serie A",nameAm:"የጣሊያን ሰሪ ኤ",nameOm:"Seeriyee A Xaaliyaanii",badge:"🇮🇹",description:"Calcio history, tactical legends, and Italian clubs"},bundesliga:{id:"bundesliga",nameEn:"German Bundesliga",nameAm:"የጀርመን ቡንደስሊጋ",nameOm:"Buundesliigaa Jarmaan",badge:"🇩🇪",description:"German football powerhouses and records"},"legendary-players":{id:"legendary-players",nameEn:"Legendary Players",nameAm:"አፈ ታሪክ ተጫዋቾች",nameOm:"Taphattootaa Seenaa",badge:"👟",description:"All-time greats, Ballon d'Or winners, and icons"},"football-rules":{id:"football-rules",nameEn:"Football Rules & Laws",nameAm:"የእግር ኳስ ሕግጋት",nameOm:"Seera Kubbaa Miilaa",badge:"📏",description:"Laws of the game, offside rule, VAR, and refereeing"},"transfer-market":{id:"transfer-market",nameEn:"Transfer Market & Fees",nameAm:"የዝውውር ገበያ",nameOm:"Gabaa Dabarsaa",badge:"💰",description:"Record transfer fees, contracts, and market moves"},stadiums:{id:"stadiums",nameEn:"Stadiums & Venues",nameAm:"ስታዲየሞች",nameOm:"Istaadiyeemota",badge:"🏟️",description:"Iconic football grounds, capacities, and host cities"},"football-history":{id:"football-history",nameEn:"Football History",nameAm:"የእግር ኳስ ታሪክ",nameOm:"Seenaa Kubbaa Miilaa",badge:"📜",description:"Origins, historic matches, and global football lore"}};class T{static _competitions=new Map;static _isInitialized=!1;static _initDefaults(){T._isInitialized||(Object.values(Me).forEach(e=>{T._competitions.set(e.id,{id:e.id,name:e.nameEn,nameEn:e.nameEn,nameAm:e.nameAm,nameOm:e.nameOm,badge:e.badge,description:e.description,color:"#FFD700",questionCount:10,status:"live",participants:0,prize_pool:0})}),T._isInitialized=!0)}static getAll(e="en"){return T._initDefaults(),Array.from(T._competitions.values()).map(t=>{let i=t.nameEn;return e==="am"&&t.nameAm&&(i=t.nameAm),e==="om"&&t.nameOm&&(i=t.nameOm),{...t,name:i}})}static getById(e,t="en"){T._initDefaults();const i=T._competitions.get(e);if(!i)return;let a=i.nameEn;return t==="am"&&i.nameAm&&(a=i.nameAm),t==="om"&&i.nameOm&&(a=i.nameOm),{...i,name:a}}static async syncFromCloud(e="en"){if(T._initDefaults(),_.isOnline&&h)try{const{data:t,error:i}=await h.from("competitions").select("*").eq("is_active",!0);if(!i&&t&&t.length>0){let a=0;try{const{count:r,error:n}=await h.from("game_sessions").select("*",{count:"exact",head:!0}).eq("state","playing");!n&&r&&(a=r)}catch{}t.forEach(r=>{T._competitions.set(r.id,{id:r.id,name:r.name_en,nameEn:r.name_en,nameAm:r.name_am||void 0,nameOm:r.name_om||void 0,badge:r.badge,description:r.description_en||"",color:r.color||"#FFD700",questionCount:r.question_count||10,status:"live",participants:a,prize_pool:0})})}}catch(t){console.warn("[CompetitionRegistry] Cloud sync failed, using defaults:",t)}return T.getAll(e)}static addCompetition(e){T._initDefaults(),T._competitions.set(e.id,e),console.log(`[CompetitionRegistry] Added competition: ${e.name}`)}static removeCompetition(e){return T._competitions.delete(e)}}class ue{static async invoke(e,t){if(!_.isOnline||!h)return{data:null,error:`Supabase client offline. Edge function '${e}' unavailable.`};try{const{data:i,error:a}=await h.functions.invoke(e,{body:t});return a?(console.error(`[EdgeFunctionClient] Error calling '${e}':`,a),{data:null,error:a.message}):{data:i,error:null}}catch(i){return console.error(`[EdgeFunctionClient] Exception in '${e}':`,i),{data:null,error:i.message||"Edge function invocation failed."}}}}const Ue=[{id:"fb-1",category:"walia-ibex",difficulty:2,prompt:"Which country won the first ever African Cup of Nations (AFCON) in 1957?",options:["Egypt","Ethiopia","Sudan","South Africa"],correctIndex:0,explanation:"Egypt defeated Ethiopia 4-0 in the final of the inaugural Africa Cup of Nations.",fact:"Only three nations participated in the first AFCON: Egypt, Ethiopia, and Sudan. South Africa was disqualified due to apartheid.",learningTip:"Remember '1957' as the birth year of AFCON."},{id:"fb-2",category:"walia-ibex",difficulty:1,prompt:"What is the nickname of the Ethiopian National Football Team?",options:["The Lions","Walia Ibex","The Pharoahs","Black Stars"],correctIndex:1,explanation:"The Walia Ibex is an endangered species of ibex found only in the Simien Mountains of Ethiopia."},{id:"fb-3",category:"ethiopian-premier",difficulty:3,prompt:"Which club holds the record for the most Ethiopian Premier League titles?",options:["Ethiopian Coffee SC","Dedebit FC","Fasil Kenema","Saint George SC"],correctIndex:3},{id:"fb-4",category:"ethiopian-premier",difficulty:3,prompt:"In which year was the Ethiopian Premier League established in its current format?",options:["1985","1997","2002","2010"],correctIndex:1},{id:"fb-5",category:"walia-ibex",difficulty:4,prompt:"Who is Ethiopia's all-time top goalscorer in international football?",options:["Getaneh Kebede","Saladin Said","Mengistu Worku","Adane Girma"],correctIndex:0},{id:"fb-6",category:"world-cup",difficulty:1,prompt:"Which nation has won the most FIFA Men's World Cup titles?",options:["Germany","Brazil","Argentina","Italy"],correctIndex:1},{id:"fb-7",category:"world-cup",difficulty:2,prompt:"Who won the Golden Boot in the 2022 FIFA World Cup?",options:["Lionel Messi","Kylian Mbappé","Julián Álvarez","Olivier Giroud"],correctIndex:1},{id:"fb-8",category:"champions-league",difficulty:2,prompt:"Which player has scored the most goals in UEFA Champions League history?",options:["Lionel Messi","Robert Lewandowski","Cristiano Ronaldo","Karim Benzema"],correctIndex:2},{id:"fb-9",category:"premier-league",difficulty:3,prompt:"Which team holds the record for most points in a single English Premier League season?",options:["Manchester United","Liverpool","Chelsea","Manchester City"],correctIndex:3},{id:"fb-10",category:"walia-ibex",difficulty:4,prompt:"Ethiopia won its only African Cup of Nations title in which year?",options:["1957","1962","1970","1982"],correctIndex:1,fact:"Ydnekatchew Tessema was one of the most influential figures in Ethiopian football history.",learningTip:"Ethiopia hosted and won the 1962 tournament, defeating Egypt 4-2 in the final after extra time."},{id:"fb-11",category:"premier-league",difficulty:2,prompt:"Who is the all-time top scorer of the English Premier League?",options:["Wayne Rooney","Alan Shearer","Harry Kane","Thierry Henry"],correctIndex:1},{id:"fb-12",category:"ethiopian-premier",difficulty:2,prompt:"What colors are primarily associated with Ethiopian Coffee SC?",options:["Green and Yellow","Red and White","Brown and Gold","Blue and White"],correctIndex:2},{id:"fb-13",category:"world-cup",difficulty:4,prompt:"Which African nation became the first to reach a FIFA World Cup Semi-Final?",options:["Senegal","Ghana","Morocco","Nigeria"],correctIndex:2},{id:"fb-14",category:"champions-league",difficulty:3,prompt:"Which club has won the most UEFA Champions League titles?",options:["AC Milan","Bayern Munich","Liverpool","Real Madrid"],correctIndex:3},{id:"fb-15",category:"walia-ibex",difficulty:5,prompt:"Who coached the Ethiopian National Team when they qualified for the 2013 AFCON?",options:["Bishaw Sewnet","Asrat Haile","Yohannes Sahle","Wubetu Abate"],correctIndex:0}];class N{static _instance=null;_askedQuestionIds=new Set;static getInstance(){return N._instance||(N._instance=new N),N._instance}async fetchQuestions(e,t=10,i="en",a=[],r="casual"){if(_.isOnline)try{const{data:o,error:l}=await ue.invoke("questions",{competitionId:e,count:t*2,locale:i,excludeIds:a,usageType:r});if(!l&&o&&o.questions&&o.questions.length>0)return console.log("[QuestionBank] Fetched server-authored questions via Edge Function."),this._selectQuestions(o.questions,t)}catch(o){console.warn("[QuestionBank] Edge Function failed.",o)}if(_.isOnline&&h)try{let o=h.from("questions").select("*").eq("is_active",!0);r==="casual"?o=o.eq("usage_type","casual"):r==="tournament"&&(o=o.eq("usage_type","tournament")),e&&e!=="all"&&(o=o.or(`competition_id.eq.${e},category.eq.${e}`)),a&&a.length>0&&(o=o.not("id","in",`(${a.join(",")})`));const{data:l,error:c}=await o.limit(50);if(!c&&l&&l.length>0){console.log("[QuestionBank] Fetched questions directly from Supabase DB.");const d=l.map(g=>this._mapQuestionRow(g,i));return this._selectQuestions(d,t)}}catch(o){console.warn("[QuestionBank] Supabase DB question fetch error:",o)}console.warn("[QuestionBank] Server connection unavailable. Serving fallback offline questions.");let n=Ue;if(e){const o=n.filter(l=>l.category===e);o.length>=Math.min(t,5)&&(n=o)}return a&&a.length>0&&(n=n.filter(o=>!a.includes(o.id))),this._selectQuestions(n,t)}async fetchQuestionsByIds(e,t="en"){if(_.isOnline&&h&&e.length>0)try{const{data:i,error:a}=await h.from("questions").select("*").in("id",e);if(!a&&i&&i.length>0){console.log(`[QuestionBank] Fetched ${i.length} specific questions by ID.`);const r=i.map(o=>this._mapQuestionRow(o,t,!1)),n=[];for(const o of e){const l=r.find(c=>c.id===o);l&&n.push(l)}return n}}catch(i){console.warn("[QuestionBank] Supabase DB fetchQuestionsByIds error:",i)}return this.fetchQuestions(void 0,e.length,t)}_mapQuestionRow(e,t,i=!0){let a=e.prompt_en,r=e.options_en;t==="am"&&e.prompt_am&&e.options_am?(a=e.prompt_am,r=e.options_am):t==="om"&&e.prompt_om&&e.options_om&&(a=e.prompt_om,r=e.options_om);let n=r,o=e.correct_index;if(i){const l=[0,1,2,3];for(let c=l.length-1;c>0;c--){const d=Math.floor(Math.random()*(c+1));[l[c],l[d]]=[l[d],l[c]]}n=l.map(c=>r[c]),o=l.indexOf(e.correct_index)}return{id:e.id,category:e.category,difficulty:e.difficulty,prompt:a,options:n,correctIndex:o}}_selectQuestions(e,t){let i=e.filter(o=>o.id&&!this._askedQuestionIds.has(o.id));i.length<t&&(this._askedQuestionIds.clear(),i=e);const r=[...i.length>=t?i:e];for(let o=r.length-1;o>0;o--){const l=Math.floor(Math.random()*(o+1));[r[o],r[l]]=[r[l],r[o]]}const n=r.slice(0,t);for(n.forEach(o=>{o.id&&this._askedQuestionIds.add(o.id)});n.length<t&&e.length>0;)n.push(e[Math.floor(Math.random()*e.length)]);return n}}const Ge={common:{title:"FOOTBALL QUIZ LEAGUE",subtitle:"ETHIO TELECOM VAS PLATFORM",close:"✖ CLOSE",backToHome:"✖ BACK TO HOME",play:"PLAY",submit:"SUBMIT",loading:"Loading...",error:"Error"},home:{soloMatch:"⚽ SOLO MATCH",liveMatch:"⚡ LIVE 1v1 MATCH",dailyChallenge:"📅 DAILY CHALLENGE",competitions:"🏆 COMPETITIONS",leaderboard:"📊 LEADERBOARD",badges:"🎖️ BADGES",admin:"⚙️ ADMIN",streak:"🔥 {count} DAY STREAK",coins:"🪙 {coins} COINS",level:"LVL {level}",invite:"Invite",inviteDesc:"+200 XP per friend.",copyLink:"Copy Link",performance:"📊 Performance",details:"DETAILS",matches:"MATCHES",points:"POINTS",score:"SCORE",lobbies:"⚽ Lobbies",championship:"🏆 ETHIOFANTASY CHAMPIONSHIP"},match:{questionCount:"QUESTION {current} OF {total}",goal:"⚽ GOAL!!!!!",saved:"🧤 SAVED!",halfTime:"HALF TIME",fullTime:"FULL TIME",matchStats:"MATCH STATISTICS",matchRating:"MATCH RATING",possession:"POSSESSION",accuracy:"ACCURACY",maxCombo:"MAX COMBO",coinsEarned:"COINS EARNED",xpEarned:"XP EARNED",continue:"CONTINUE TO HUB",leaveMatch:"Leave Match?",leaveWarning:"Your progress will be abandoned.",leaveBtn:"Leave",continueBtn:"Continue"},multiplayer:{matchmakingTitle:"LIVE MULTIPLAYER MATCHMAKING",findingOpponent:"FINDING WORTHY OPPONENT...",yourRating:"YOUR RATING",searchRange:"SEARCH RANGE",cancelMatchmaking:"✖ CANCEL MATCHMAKING",victory:"VICTORY!",draw:"MATCH DRAW!",defeated:"DEFEATED!",finalScore:"FINAL SCORE: {myScore} - {oppScore}",eloRating:"ELO RATING"},categories:{worldCup:"FIFA World Cup",championsLeague:"UEFA Champions League",cafChampions:"CAF Champions League",afcon:"Africa Cup of Nations",ethiopianPremier:"Ethiopian Premier League",waliaIbex:"Ethiopian National Team (Walia Ibex)",premierLeague:"Premier League",laLiga:"La Liga",serieA:"Serie A",bundesliga:"Bundesliga",legendaryPlayers:"Legendary Players",footballRules:"Football Rules & Laws",transferMarket:"Transfer Market",stadiums:"Stadiums & Venues",footballHistory:"Football History"}},We={common:{title:"የእግር ኳስ ጥያቄ ሊግ",subtitle:"ኢትዮ ቴሌኮም ቪኤኤስ መድረክ",close:"✖ ዝጋ",backToHome:"✖ ወደ ዋና ገጽ",play:"ተጫወት",submit:"ላክ",loading:"በመጫን ላይ...",error:"ስህተት"},home:{soloMatch:"⚽ ነጠላ ጨዋታ",liveMatch:"⚡ ቀጥታ 1v1 ጨዋታ",dailyChallenge:"📅 የዕለት ተግዳሮት",competitions:"🏆 ውድድሮች",leaderboard:"📊 ደረጃ ሰሌዳ",badges:"🎖️ ባጆች",admin:"⚙️ አድሚን",streak:"🔥 {count} ቀን ተከታታይ",coins:"🪙 {coins} ሳንቲም",level:"ደረጃ {level}",invite:"ጋብዝ",inviteDesc:"+200 XP በአንድ ጓደኛ",copyLink:"ሊንክ ኮፒ አድርግ",performance:"📊 አፈጻጸም",details:"ዝርዝር",matches:"ጨዋታዎች",points:"ነጥቦች",score:"ውጤት",lobbies:"⚽ ሎቢ",championship:"🏆 የኢትዮፋንታሲ ሻምፒዮና"},match:{questionCount:"ጥያቄ {current} ከ {total}",goal:"⚽ ጎል!!!!!",saved:"🧤 ተመለሰ!",halfTime:"እረፍት",fullTime:"ሙሉ ጊዜ",matchStats:"የጨዋታ ስታቲስቲክስ",matchRating:"የጨዋታ ደረጃ",possession:"ኳስ ቁጥጥር",accuracy:"ትክክለኛነት",maxCombo:"ከፍተኛ ተከታታይ",coinsEarned:"የተገኘ ሳንቲም",xpEarned:"የተገኘ XP",continue:"ወደ መነሻ ገጽ ተመለስ",leaveMatch:"ጨዋታውን ትተህ ውጣ?",leaveWarning:"ያለዎት እድገት ይጠፋል።",leaveBtn:"ውጣ",continueBtn:"ቀጥል"},multiplayer:{matchmakingTitle:"ቀጥታ ባለብዙ ተጫዋች ጨዋታ",findingOpponent:"ተፎካካሪ በመፈለግ ላይ...",yourRating:"የእርስዎ ደረጃ",searchRange:"የፍለጋ ክልል",cancelMatchmaking:"✖ ፍለጋውን ሰርዝ",victory:"ድል!",draw:"እኩል!",defeated:"ተሸንፈዋል!",finalScore:"የመጨረሻ ውጤት: {myScore} - {oppScore}",eloRating:"የኤሎ ደረጃ"},categories:{worldCup:"የዓለም ዋንጫ",championsLeague:"UEFA ቻምፒየንስ ሊግ",cafChampions:"የCAF ሻምፒዮንስ ሊግ",afcon:"የአፍሪካ ዋንጫ",ethiopianPremier:"የኢትዮጵያ ፕሪሚየር ሊግ",waliaIbex:"ዋሊያ ኢቤክስ (ብሔራዊ ቡድን)",premierLeague:"የእንግሊዝ ፕሪሚየር ሊግ",laLiga:"የስፔን ላ ሊጋ",serieA:"የጣሊያን ሰሪ ኤ",bundesliga:"የጀርመን ቡንደስሊጋ",legendaryPlayers:"አፈ ታሪክ ተጫዋቾች",footballRules:"የእግር ኳስ ሕግጋት",transferMarket:"የዝውውር ገበያ",stadiums:"ስታዲየሞች",footballHistory:"የእግር ኳስ ታሪክ"}},je={common:{title:"LIIGII GAAFFII KUBBAA MIILAA",subtitle:"ITIYO TELEKOOM VAS PLATFORM",close:"✖ Cufi",backToHome:"✖ Gara Fuula Duraatti",play:"Taphadhu",submit:"Ergi",loading:"Fe'amaa jira...",error:"Dogoggora"},home:{soloMatch:"⚽ TAPHA QOFAAA",liveMatch:"⚡ TAPHI KALLATTII 1v1",dailyChallenge:"📅 QORMAATA GUYYAA",competitions:"🏆 DORGOMMIIWWAN",leaderboard:"📊 SADARKAA",badges:"🎖️ BAADJIIWWAN",admin:"⚙️ ADMIIN",streak:"🔥 {count} GUYYAA WALITTI AANEE",coins:"🪙 {coins} SAAKKATOO",level:"SADARKAA {level}",invite:"Afeeri",inviteDesc:"+200 XP hiriyaa tokkoon",copyLink:"Liinkii Kopi godhi",performance:"📊 Raawwii",details:"BAL'INA",matches:"TAPHOOTA",points:"QABXII",score:"FIRI",lobbies:"⚽ Lobbies",championship:"🏆 CHAMPIONSHIP ETHIOFANTASY"},match:{questionCount:"GAAFFII {current} KEESSAA {total}",goal:"⚽ GOOLII!!!!!",saved:"🧤 QABAME!",halfTime:"BOQONNAA",fullTime:"YEROO GUUTUU",matchStats:"ISTATISTIKSII TAPHA",matchRating:"SADARKAA TAPHA",possession:"KUBBAA QABACHUU",accuracy:"SIREESSUU",maxCombo:"WAL-IRRAA OLAANAA",coinsEarned:"SANTIIMA ARGAME",xpEarned:"XP ARGATAME",continue:"GARA FUULA DURAA DEEBI'I",leaveMatch:"Tapha Dhiiftee Baataa?",leaveWarning:"Guddinni kee ni bada.",leaveBtn:"Bahi",continueBtn:"Itti Fufi"},multiplayer:{matchmakingTitle:"TAPHA KALLATTII DORGOMAA",findingOpponent:"DORGOMAA BARBAADAA JIRA...",yourRating:"SADARKAA KEE",searchRange:"DAANGAA BARBAADUU",cancelMatchmaking:"✖ BARBAADUU HAQI",victory:"INJIFANNOO!",draw:"QIXEE!",defeated:"MO'ATAMTEERTA!",finalScore:"QABXII GUUTUU: {myScore} - {oppScore}",eloRating:"SADARKAA ELO"},categories:{worldCup:"Waancaa Addunyaa FIFA",championsLeague:"Liigii Chaampiyoonsii UEFA",cafChampions:"Liigii Chaampiyoonsii CAF",afcon:"Waancaa Afriikaa",ethiopianPremier:"Liigii Piriimeraa Itoophiyaa",waliaIbex:"Waaliyaa Ibeks (Garee Biyyaaleessaa)",premierLeague:"Liigii Piriimeraa Ingilaand",laLiga:"Laa Liigaa Ispeen",serieA:"Seeriyee A Xaaliyaanii",bundesliga:"Buundesliigaa Jarmaan",legendaryPlayers:"Taphattootaa Seenaa",footballRules:"Seera Kubbaa Miilaa",transferMarket:"Gabaa Dabarsaa",stadiums:"Istaadiyeemota",footballHistory:"Seenaa Kubbaa Miilaa"}},he={en:Ge,am:We,om:je};class V{static _instance=null;_currentLocale="en";constructor(){const e=localStorage.getItem("ETHIO_FOOTBALL_LOCALE");(e==="am"||e==="om"||e==="en")&&(this._currentLocale=e)}static getInstance(){return V._instance||(V._instance=new V),V._instance}setLocale(e){this._currentLocale=e,localStorage.setItem("ETHIO_FOOTBALL_LOCALE",e),console.log(`[i18n] Switched locale to: ${e}`)}get currentLocale(){return this._currentLocale}t(e,t){const i=e.split(".");let a=he[this._currentLocale]||he.en;for(const n of i)if(a&&a[n]!==void 0)a=a[n];else{let o=he.en;for(const l of i)if(o&&o[l]!==void 0)o=o[l];else return e;a=o;break}if(typeof a!="string")return e;let r=a;return t&&Object.entries(t).forEach(([n,o])=>{r=r.replace(new RegExp(`\\{${n}\\}`,"g"),String(o))}),r}}const s=V.getInstance(),P=(p,e)=>s.t(p,e);class q{static _instance=null;constructor(){}static getInstance(){return q._instance||(q._instance=new q),q._instance}async createSession(e,t,i,a){if(!_.isOnline)return null;const r=h;if(!r)return null;try{const{data:{user:n}}=await r.auth.getUser();if(!n)return null;const{data:o,error:l}=await r.from("game_sessions").insert({user_id:n.id,match_type:e,competition_id:t,difficulty:typeof i=="string"?parseInt(i,10):i,question_ids:a,total_questions:a.length,time_remaining:60,state:"playing"}).select().single();return l?(console.warn("[GameSessionService] Error creating session:",l),null):o}catch(n){return console.warn("[GameSessionService] Failed to create session:",n),null}}async getActiveSession(){if(!_.isOnline)return null;const e=h;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("game_sessions").select("*").eq("user_id",t.id).in("state",["playing","paused"]).order("created_at",{ascending:!1}).limit(1).single();return a&&a.code!=="PGRST116"?(console.warn("[GameSessionService] Error fetching active session:",a),null):i}catch(t){return console.warn("[GameSessionService] Failed to get active session:",t),null}}async updateSession(e,t){if(!_.isOnline)return;const i=h;if(i)try{const{error:a}=await i.from("game_sessions").update(t).eq("id",e);a&&console.warn("[GameSessionService] Error updating session:",a)}catch(a){console.warn("[GameSessionService] Failed to update session:",a)}}async pauseSession(e){return this.updateSession(e,{state:"paused",paused_at:new Date().toISOString()})}async resumeSession(e){return this.updateSession(e,{state:"playing",paused_at:null})}async completeSession(e,t,i,a,r){return this.updateSession(e,{state:"completed",final_score:t,accuracy:i,avg_response_time:a,max_combo:r,completed_at:new Date().toISOString()})}async abandonSession(e){return this.updateSession(e,{state:"abandoned",completed_at:new Date().toISOString()})}async recordAnswer(e,t,i,a,r,n,o){if(!_.isOnline)return;const l=h;if(l)try{const{error:c}=await l.from("game_session_answers").insert({session_id:e,question_id:t,question_index:i,selected_index:a,correct_index:r,is_correct:n,response_time_ms:o});c&&console.warn("[GameSessionService] Error recording answer:",c)}catch(c){console.warn("[GameSessionService] Failed to record answer:",c)}}async getSessionAnswers(e){if(!_.isOnline)return[];const t=h;if(!t)return[];try{const{data:i,error:a}=await t.from("game_session_answers").select("*").eq("session_id",e).order("question_index",{ascending:!0});return a?(console.warn("[GameSessionService] Error fetching session answers:",a),[]):i||[]}catch(i){return console.warn("[GameSessionService] Failed to get session answers:",i),[]}}async getHistory(e=20){if(!_.isOnline)return[];const t=h;if(!t)return[];try{const{data:{user:i}}=await t.auth.getUser();if(!i)return[];const{data:a,error:r}=await t.from("game_sessions").select("*").eq("user_id",i.id).eq("state","completed").order("completed_at",{ascending:!1}).limit(e);return r?(console.warn("[GameSessionService] Error fetching session history:",r),[]):a||[]}catch(i){return console.warn("[GameSessionService] Failed to get session history:",i),[]}}}class ${static _instance=null;STORAGE_KEY="ETHIO_ACTIVE_SESSION_V3";static getInstance(){return $._instance||($._instance=new $),$._instance}createSession(e,t,i){const a={sessionId:"SESS-"+Math.floor(1e5+Math.random()*9e5),matchType:e,startTime:Date.now(),totalQuestions:i.length,difficulty:t,currentScore:0,currentIndex:0,timeLeftSec:15,questions:i,choices:[],responseTimes:[],state:"Playing",correctCount:0,wrongCount:0,timeOutCount:0},r=i.map(n=>String(n.id));return q.getInstance().createSession(e,e,t,r).then(n=>{n&&n.id&&(a.cloudSessionId=n.id,this.saveSession(a))}),this.saveSession(a),a}getActiveSession(){const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return null;try{const t=JSON.parse(e);return t.state==="Completed"||t.state==="Abandoned"||t.state==="Expired"?null:Date.now()-t.startTime>144e5?(this.clearSession(),null):t}catch{return null}}saveSession(e){localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}clearSession(){localStorage.removeItem(this.STORAGE_KEY)}autoSaveProgress(e,t,i,a,r,n,o){if(e.currentIndex=t,e.choices.push(i),e.responseTimes.push(a),e.currentScore=n,e.timeLeftSec=o,i===-1?e.timeOutCount++:r?e.correctCount++:e.wrongCount++,e.cloudSessionId){const l=String(e.questions[t].id),c=e.questions[t].correctIndex??-1;q.getInstance().recordAnswer(e.cloudSessionId,l,t,i,c,r,a)}this.saveSession(e)}abandonSession(e){e.state="Abandoned",this.saveSession(e),this.addToHistory(e),e.cloudSessionId&&q.getInstance().abandonSession(e.cloudSessionId),this.clearSession()}completeSession(e,t){if(e.state="Completed",e.currentScore=t,this.saveSession(e),this.addToHistory(e),e.cloudSessionId){const i=e.totalQuestions>0?Math.round(e.correctCount/e.totalQuestions*100):0,a=e.responseTimes.length>0?e.responseTimes.reduce((r,n)=>r+n,0)/e.responseTimes.length:0;q.getInstance().completeSession(e.cloudSessionId,t,i,a,0)}this.clearSession()}addToHistory(e){}}class Ce{static _canvas=null;static _ctx=null;static _particles=[];static _animId=null;static burst(e,t,i=60,a=["#FFD700","#22C55E","#3B82F6","#FFFFFF","#FF4500"]){this._init();const r=e??window.innerWidth/2,n=t??window.innerHeight/3;for(let o=0;o<i;o++){const l=Math.random()*Math.PI*2,c=Math.random()*12+4;this._particles.push({x:r,y:n,vx:Math.cos(l)*c,vy:Math.sin(l)*c-3,size:Math.random()*8+4,color:a[Math.floor(Math.random()*a.length)],alpha:1,rotation:Math.random()*360,rotSpeed:(Math.random()-.5)*15,shape:Math.random()>.4?"rect":"circle"})}this._animId||this._loop()}static _init(){this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.id="confetti-canvas",this._canvas.style.position="fixed",this._canvas.style.top="0",this._canvas.style.left="0",this._canvas.style.width="100vw",this._canvas.style.height="100vh",this._canvas.style.pointerEvents="none",this._canvas.style.zIndex="9999",document.body.appendChild(this._canvas)),this._canvas.width=window.innerWidth,this._canvas.height=window.innerHeight,this._ctx=this._canvas.getContext("2d")}static _loop(){if(!(!this._ctx||!this._canvas)){this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height);for(let e=this._particles.length-1;e>=0;e--){const t=this._particles[e];if(t.x+=t.vx,t.y+=t.vy,t.vy+=.25,t.vx*=.98,t.rotation+=t.rotSpeed,t.alpha-=.015,t.alpha<=0||t.y>window.innerHeight){this._particles.splice(e,1);continue}this._ctx.save(),this._ctx.globalAlpha=t.alpha,this._ctx.translate(t.x,t.y),this._ctx.rotate(t.rotation*Math.PI/180),this._ctx.fillStyle=t.color,t.shape==="rect"?this._ctx.fillRect(-t.size/2,-t.size/2,t.size,t.size*1.5):(this._ctx.beginPath(),this._ctx.arc(0,0,t.size/2,0,Math.PI*2),this._ctx.fill()),this._ctx.restore()}this._particles.length>0?this._animId=requestAnimationFrame(()=>this._loop()):this._animId=null}}}class ge{static animate(e,t,i,a=1200,r=n=>Math.round(n).toLocaleString()){const n=performance.now(),o=l=>{const c=l-n,d=Math.min(c/a,1),g=1-Math.pow(1-d,3),m=t+(i-t)*g;e.textContent=r(m),d<1?requestAnimationFrame(o):e.textContent=r(i)};requestAnimationFrame(o)}}class Qe{static render(e){return`
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
        `}}class Le{_uiManager;_audioManager;_quizEngine;_competition;_questions;_callbacks;_currentIndex=0;_timerInterval=null;_timeLeftSec=15;_startTimeMs=0;_hasKickedOff=!1;_session=null;_hasPlayedFullTimeWhistle=!1;_isPaused=!1;_isDestroyed=!1;_nextQuestionTimeoutId=null;_visibilityHandler;_networkOfflineHandler;_networkOnlineHandler;constructor(e,t,i,a,r,n){this._uiManager=e,this._audioManager=t,this._quizEngine=i,this._competition=a,this._questions=r,this._callbacks=n,this._visibilityHandler=()=>{document.visibilityState==="hidden"&&this._hasKickedOff&&!this._isPaused&&this._currentIndex<this._questions.length&&this._showPauseOverlay()},document.addEventListener("visibilitychange",this._visibilityHandler),this._networkOfflineHandler=()=>{if(this._hasKickedOff&&!this._isPaused&&this._currentIndex<this._questions.length){this._showLeaveWarning();const o=document.getElementById("match-exit-dialog")?.querySelector("div > div:nth-child(2)");o&&(o.innerHTML="⚠️ Your connection was lost. Reconnect to continue playing.")}},this._networkOnlineHandler=()=>{this._hasKickedOff&&this._isPaused&&this._currentIndex<this._questions.length&&this._hideLeaveWarning()},window.addEventListener("ethio-network-offline",this._networkOfflineHandler),window.addEventListener("ethio-network-online",this._networkOnlineHandler)}startMatch(){this._quizEngine.reset(),this._currentIndex=0,this._hasKickedOff=!1,this._session=$.getInstance().createSession(this._competition.id,"Medium",this._questions),window.ethioReviewData={questions:[],choices:[]},window.ethioOnBackPress=()=>{if(!this._hasKickedOff)return this._callbacks.onExitMatch(),!0;const e=document.getElementById("match-exit-dialog");return e&&e.style.display!=="none"?this._hideLeaveWarning():this._showLeaveWarning(),!0},this._renderKickOffScreen()}resumeSession(e){this._quizEngine.reset(),this._session=e,this._questions=e.questions,this._currentIndex=e.currentIndex,this._hasKickedOff=!0,this._isPaused=!1;for(let t=0;t<e.choices.length;t++){const i=e.choices[t],a=e.questions[t].correctIndex,r=e.responseTimes[t];this._quizEngine.recordAnswer(i===a,r)}window.ethioReviewData={questions:e.questions||[],choices:e.choices||[]},window.ethioOnBackPress=()=>{const t=document.getElementById("match-exit-dialog");return t&&t.style.display!=="none"?this._hideLeaveWarning():this._showLeaveWarning(),!0},this._renderQuestion(e.timeLeftSec)}_renderKickOffScreen(){const e=this._uiManager.container,t=this._competition.id==="all"?"QUICK MATCH.png":"DAILY CHALLENGE.png";e.innerHTML=`
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 0 28px; position: relative; height: 100vh; overflow: hidden;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- Dark Overlay -->
                <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); z-index: 5; animation: fade-in 250ms ease-out;"></div>

                <!-- Content Wrapper -->
                <div class="kick-off-wrapper" style="position: relative; z-index: 10; width: 100%; max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    ${Qe.render({bannerUrl:`/assets/banners/${t}`,icon:this._competition.badge,title:this._competition.name,buttonId:"kick-off-btn",buttonText:s.currentLocale==="am"?"ጀምር":s.currentLocale==="om"?"EGGALI":"KICK OFF",showCloseButton:!0})}

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
        `,document.getElementById("match-exit-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),window.ethioHandleBack&&window.ethioHandleBack()}),document.getElementById("kick-off-btn")?.addEventListener("click",()=>{this._audioManager.playWhistle(),this._hasKickedOff=!0,this._renderQuestion()})}_renderQuestion(e=10){if(this._isDestroyed)return;if(!this._hasKickedOff){this._renderKickOffScreen();return}if(this._currentIndex>=this._questions.length){this._stopTimer(),this._completeMatch();return}const t=this._questions[this._currentIndex],i=this._uiManager.container,r=this._quizEngine.calculateFinalStats().goals*100;setTimeout(()=>{this._isDestroyed||this._audioManager.playQuestionArrive()},80),i.innerHTML=`
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
                            <span id="match-score" class="top-bar-text" style="color: var(--tv-gold-primary);">${r}</span>
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
        `,this._startTimer(e),this._bindOptionButtons(),this._bindPauseButtons(),setTimeout(()=>{if(this._isDestroyed)return;const l=document.getElementById("answers-grid");l&&(l.style.pointerEvents="auto")},420);const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!n&&(typeof this._audioManager.playTick=="function"?this._audioManager.playTick():this._audioManager.playClick(),typeof navigator<"u"&&navigator.vibrate))try{navigator.vibrate(10)}catch{}const o=i.querySelector("#answers-grid");o&&(o.style.pointerEvents="none",setTimeout(()=>{o&&!this._isDestroyed&&(o.style.pointerEvents="auto")},n?120:500))}_startTimer(e=10){this._stopTimer(),this._timeLeftSec=e,this._startTimeMs=performance.now();const t=document.getElementById("timer-text"),i=()=>{if(t){t.innerText=`${String(this._timeLeftSec)}s`;const a=document.getElementById("timer-chip");a&&(this._timeLeftSec<=5?(a.classList.add("time-low"),this._timeLeftSec>0&&this._audioManager.playCountdownWarning()):a.classList.remove("time-low"))}};i(),this._timerInterval=setInterval(()=>{this._isPaused||(this._timeLeftSec--,i(),this._session&&(this._session.timeLeftSec=this._timeLeftSec,$.getInstance().saveSession(this._session)),this._timeLeftSec<=0&&(this._stopTimer(),this._handleTimeOut()))},1e3)}_stopTimer(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)}_showLeaveWarning(){const e=document.getElementById("match-exit-dialog");e&&(e.style.display="flex")}_hideLeaveWarning(){const e=document.getElementById("match-exit-dialog");e&&(e.style.display="none")}_showPauseOverlay(){this._isPaused=!0,this._stopTimer();const e=document.getElementById("match-paused-dialog");e&&(e.style.display="flex")}_hidePauseOverlay(){this._isPaused=!1;const e=document.getElementById("match-paused-dialog");e&&(e.style.display="none"),this._startTimer(this._timeLeftSec)}_leaveMatch(){this._stopTimer(),this._session&&$.getInstance().clearSession(),window.ethioOnBackPress=null,this.destroy(),this._callbacks.onExitMatch()}_bindPauseButtons(){document.getElementById("btn-pause-resume")?.addEventListener("click",()=>{this._audioManager.playClick(),this._hideLeaveWarning()}),document.getElementById("btn-pause-leave")?.addEventListener("click",()=>{this._audioManager.playClick(),this._leaveMatch()}),document.getElementById("btn-resume-paused")?.addEventListener("click",()=>{this._audioManager.playClick(),this._hidePauseOverlay()})}_bindOptionButtons(){document.getElementById("match-exit-btn")?.addEventListener("click",()=>{this._showLeaveWarning()}),document.querySelectorAll(".option-btn").forEach(t=>{t.addEventListener("click",i=>{const a=i.currentTarget;this._audioManager.playAnswerSelected(),this._stopTimer(),document.querySelectorAll(".option-btn").forEach(o=>o.disabled=!0);const n=parseInt(a.getAttribute("data-index")||"0");this._onOptionSelected(n,a)})})}async _onOptionSelected(e,t){let i=parseFloat(((performance.now()-this._startTimeMs)/1e3).toFixed(1));if(i>10.5){await this._handleTimeOut();return}const a=this._questions[this._currentIndex],r=await this._findCorrectIndex(a),n=e===r;this._quizEngine.recordAnswer(n,i,a.id,e);const o=this._quizEngine.calculateFinalStats().goals;this._session&&$.getInstance().autoSaveProgress(this._session,this._currentIndex+1,e,i,n,o*100,15);const l=document.querySelectorAll(".option-btn"),c=this._currentIndex===this._questions.length-1;if(n){t.classList.add("correct"),this._audioManager.playCorrectAnswerGoal(c?400:void 0),Ce.burst(window.innerWidth/2,window.innerHeight/3,50,["#FFD700","#22C55E","#3B82F6","#FFFFFF"]),this._showFeedbackOverlay(!0);const g=this._quizEngine.calculateFinalStats().goals,m=document.getElementById("match-score");m&&ge.animate(m,(g-1)*100,g*100,600,x=>`${Math.round(x)}`)}else{if(t.classList.add("wrong"),r!==void 0){const g=l[r];g&&g.classList.add("correct")}this._audioManager.playWrongAnswer(c?400:void 0),this._showFeedbackOverlay(!1)}const d=c?400:1300;this._nextQuestionTimeoutId=setTimeout(()=>{this._nextQuestionTimeoutId=null,!this._isDestroyed&&(this._hideFeedbackOverlay(),this._currentIndex++,this._renderQuestion())},d)}_showFeedbackOverlay(e){const t=document.getElementById("feedback-overlay"),i=document.getElementById("feedback-anim"),a=document.getElementById("feedback-text"),r=document.getElementById("feedback-subtext");t&&i&&a&&r&&(t.style.borderColor=e?"var(--tv-pitch-green)":"var(--tv-gold-primary)",t.style.background=e?"linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(15,23,42,0.96) 100%)":"linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(15,23,42,0.96) 100%)",t.style.color=e?"var(--tv-pitch-green)":"var(--tv-gold-primary)",i.innerText=e?"⚽🥅":"🧤⚽",i.style.animation=e?"goal-bounce 0.6s ease-in-out infinite":"save-shake 0.4s ease-in-out infinite",a.innerText=e?"GOAL!":"SAVED!",r.innerText=e?"Brilliant strike into the net!":"Keeper parries the shot away!",t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1)")}_hideFeedbackOverlay(){const e=document.getElementById("feedback-overlay");e&&(e.style.pointerEvents="none",e.style.opacity="0",e.style.transform="translate(-50%, -50%) scale(0.8)")}async _handleTimeOut(){const t=this._questions[this._currentIndex],i=await this._findCorrectIndex(t);this._quizEngine.recordAnswer(!1,15,t.id,-1),this._audioManager.playWhistle();const a=document.querySelectorAll(".option-btn");if(i!==void 0){const d=a[i];d&&d.classList.add("correct")}const r=this._quizEngine.calculateFinalStats().goals;this._session&&$.getInstance().autoSaveProgress(this._session,this._currentIndex+1,-1,15,!1,r*100,15),this._showFeedbackOverlay(!1);const n=document.getElementById("feedback-text"),o=document.getElementById("feedback-subtext");n&&o&&(n.innerText="TIME OUT!",o.innerText="Speed up next time!");const c=this._currentIndex===this._questions.length-1?400:1600;this._nextQuestionTimeoutId=setTimeout(()=>{this._nextQuestionTimeoutId=null,!this._isDestroyed&&(this._hideFeedbackOverlay(),this._currentIndex++,this._renderQuestion())},c)}_completeMatch(){let e=this._quizEngine.calculateFinalStats(),t=e.goals*100+e.accuracy*5+Math.round(Math.max(0,15-e.avgResponseTime)*e.goals*15);e.accuracy===100&&(t+=500),this._session&&$.getInstance().completeSession(this._session,t),window.ethioReviewData={questions:this._questions,choices:this._session?this._session.choices:[]},pe(()=>Promise.resolve().then(()=>tt),void 0).then(i=>i.AuthManager.getInstance().refreshProfile()),window.ethioOnBackPress=null,this._hasPlayedFullTimeWhistle||(this._hasPlayedFullTimeWhistle=!0,this._audioManager.playFullTimeWhistle()),this._callbacks.onMatchComplete(e,t),this._session&&ue.invoke("validate-match",{matchType:this._session.matchType,competitionId:this._competition.id,answers:this._quizEngine.answerSubmissions}).then(({data:i,error:a})=>{!a&&i&&(!i.valid||i.anomalyDetected?console.error("[Anti-Cheat] Match rejected by server!"):console.log("[Anti-Cheat] Match validated successfully in background."))}).catch(i=>console.error("[Anti-Cheat] Background validation failed:",i))}destroy(){this._isDestroyed=!0,this._stopTimer(),this._audioManager.stopAllGameplaySounds(),this._nextQuestionTimeoutId&&(clearTimeout(this._nextQuestionTimeoutId),this._nextQuestionTimeoutId=null),document.removeEventListener("visibilitychange",this._visibilityHandler),window.removeEventListener("ethio-network-offline",this._networkOfflineHandler),window.removeEventListener("ethio-network-online",this._networkOnlineHandler),this._quizEngine=null,this._session=null,window.ethioOnBackPress=null,this._uiManager&&this._uiManager.container&&(this._uiManager.container.innerHTML="")}async _findCorrectIndex(e){if(e.correctIndex!==void 0)return e.correctIndex;if(e.answerHash){for(let t=0;t<4;t++)if(await this._sha256(`${e.id}:${t}:ethio-secret-salt`)===e.answerHash)return e.correctIndex=t,t}}async _sha256(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return Array.from(new Uint8Array(t)).map(i=>i.toString(16).padStart(2,"0")).join("")}}class S{static Header(e){return`
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
        `}static Button(e){const t=e.variant==="secondary"?"ethio-btn-secondary":"ethio-btn-primary",i=e.fullWidth?"width: 100%;":"",a=e.id?`id="${e.id}"`:"",r=e.disabled?"disabled":"",n=e.dataAttrs?e.dataAttrs:"";return`
            <button ${a} ${n} ${r} class="ethio-btn ${t} ${e.className||""}" style="${i}">
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
        `}static Text(e,t){const i=t?.size?`font-size: ${t.size};`:"",a=t?.weight?`font-weight: ${t.weight};`:"",r=t?.color?`color: ${t.color};`:"",n=t?.margin?`margin: ${t.margin};`:"",o=t?.align?`text-align: ${t.align};`:"",l=t?.family?`font-family: ${t.family};`:"";return`<div style="${i} ${a} ${r} ${n} ${o} ${l}">${e}</div>`}static Flex(e,t){const i=t?.direction==="column"?"flex-direction: column;":"flex-direction: row;",a=t?.gap?`gap: ${t.gap};`:"",r=t?.align?`align-items: ${t.align};`:"align-items: center;",n=t?.justify?`justify-content: ${t.justify};`:"",o=t?.wrap?"flex-wrap: wrap;":"",l=t?.margin?`margin: ${t.margin};`:"";return`<div style="display: flex; ${i} ${a} ${r} ${n} ${o} ${l}">${e}</div>`}static Grid(e,t){const i=t?.minWidth||"280px",a=t?.gap?`gap: ${t.gap};`:"gap: var(--fds-space-16);",r=t?.margin?`margin: ${t.margin};`:"";return`<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${i}, 1fr)); ${a} ${r}">${e}</div>`}static Dialog(e,t,i){return`
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
        `}}class ne{static show(e,t="info",i=3e3){let r=document.getElementById("toast-container");r||(r=document.createElement("div"),r.id="toast-container",r.style.position="fixed",r.style.bottom="30px",r.style.left="50%",r.style.transform="translateX(-50%)",r.style.zIndex="99999",r.style.display="flex",r.style.flexDirection="column",r.style.gap="10px",r.style.pointerEvents="none",document.body.appendChild(r));const n=document.createElement("div"),o=t==="success"?"✅":t==="warning"?"⚠️":t==="error"?"❌":"⚽",l=t==="success"?"#22C55E":t==="warning"?"#F59E0B":t==="error"?"#EF4444":"#FFD700";n.style.background="rgba(15, 23, 42, 0.92)",n.style.border=`1px solid ${l}`,n.style.borderRadius="14px",n.style.padding="12px 20px",n.style.color="white",n.style.fontFamily="system-ui, -apple-system, sans-serif",n.style.fontWeight="bold",n.style.fontSize="14px",n.style.boxShadow="0 10px 30px rgba(0,0,0,0.5)",n.style.backdropFilter="blur(12px)",n.style.transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",n.style.pointerEvents="none",n.style.opacity="0",n.style.transform="translateY(20px)",n.innerHTML=`<span style="margin-right: 8px;">${o}</span> ${e}`,r.appendChild(n),requestAnimationFrame(()=>{n.style.opacity="1",n.style.transform="translateY(0)"}),setTimeout(()=>{n.style.pointerEvents="none",n.style.opacity="0",n.style.transform="translateY(20px)",setTimeout(()=>n.remove(),300)},i)}}const Ke=Object.freeze(Object.defineProperty({__proto__:null,Toast:ne},Symbol.toStringTag,{value:"Module"}));class C{static RANKS=[{name:"Bronze",minXp:0,badgeClass:"rank-bronze",icon:"🥉"},{name:"Silver",minXp:500,badgeClass:"rank-silver",icon:"🥈"},{name:"Gold",minXp:1500,badgeClass:"rank-gold",icon:"🥇"},{name:"Elite",minXp:3500,badgeClass:"rank-elite",icon:"💎"},{name:"Legend",minXp:7500,badgeClass:"rank-legend",icon:"🔥"},{name:"Hall of Fame",minXp:15e3,badgeClass:"rank-hall-of-fame",icon:"👑"}];static DIVISIONS=[{name:"Division 5 (Regional)",tier:5,minXp:0,badge:"⚽",color:"#94A3B8",weeklyPromotionZone:"Top 30% Promoted to Div 4"},{name:"Division 4 (National 2)",tier:4,minXp:1e3,badge:"🛡️",color:"#34D399",weeklyPromotionZone:"Top 25% Promoted to Div 3"},{name:"Division 3 (National 1)",tier:3,minXp:2500,badge:"🥈",color:"#60A5FA",weeklyPromotionZone:"Top 20% Promoted to Div 2"},{name:"Division 2 (Premier League)",tier:2,minXp:5e3,badge:"🥇",color:"#F59E0B",weeklyPromotionZone:"Top 15% Promoted to Div 1"},{name:"Division 1 (CAF Champions)",tier:1,minXp:1e4,badge:"💎",color:"#C084FC",weeklyPromotionZone:"Top 10% Promoted to Premier"},{name:"Premier Division (World Legends)",tier:0,minXp:2e4,badge:"👑",color:"#FFD700",weeklyPromotionZone:"Pinnacle Division - World Top 100"}];static getRank(e){for(let t=C.RANKS.length-1;t>=0;t--)if(e>=C.RANKS[t].minXp)return C.RANKS[t];return C.RANKS[0]}static getDivision(e){for(let t=C.DIVISIONS.length-1;t>=0;t--)if(e>=C.DIVISIONS[t].minXp)return C.DIVISIONS[t];return C.DIVISIONS[0]}static getLevel(e){const i=Math.floor(e/250)+1,a=e%250,r=Math.min(Math.floor(a/250*100),100);return{level:i,currentXp:a,nextLevelXp:250,progressPercent:r}}static getSeasonPassInfo(e){const i=Math.min(Math.floor(e/500)+1,50),a=e%500,r=Math.min(Math.floor(a/500*100),100),n=[];return i>=5&&n.push("🎖️ Season 1 Starter Badge"),i>=10&&n.push("🔥 2x XP Multiplier Pass"),i>=25&&n.push("💎 Ethiopian Premier Veteran Crest"),i>=50&&n.push("👑 Hall of Fame Champion Crown"),{seasonLevel:i,seasonXp:a,nextSeasonLevelXp:500,progressPercent:r,unlockedRewards:n}}}class Ye{_uiManager;_saveManager;_audioManager;_stats;_gameId;_finalScore;_hasAnimated=!1;_onContinue;constructor(e,t,i,a,r,n,o){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._stats=a,this._finalScore=r,this._gameId=n,this._onContinue=o,this._saveManager.updateHighScore(this._gameId,this._finalScore)}render(){const e=this._uiManager.container,t=this._stats.goals,i=this._stats.incorrectAnswers;e.innerHTML=`
            <div class="stadium-container" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
                <div style="color: var(--fds-text-main); font-weight: bold;">${s.currentLocale==="am"?"ሽልማቶችን በመጫን ላይ...":s.currentLocale==="om"?"Badhaasa Fe'aa Jira...":"Loading Rewards..."}</div>
            </div>
        `,this._submitAndRender(e,t,i)}async _submitAndRender(e,t,i){let a=this._stats.xpEarned,r=this._stats.coinsEarned;this._saveManager.addXp(a),this._saveManager.addCoins(r);const n=this._stats.accuracy>=50;this._saveManager.incrementMatchStats(n),this._stats.accuracy>=50?this._audioManager.playVictoryFanfare():this._audioManager.playDefeatSound(),e.innerHTML=`
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
                        ${s.currentLocale==="am"?"ጨዋታው ተጠናቋል":s.currentLocale==="om"?"Tapha Xumurame":"Match Complete"}
                    </div>
                    
                    <!-- Sub-header Message -->
                    <div id="match-message" style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase;">
                        ${this._stats.accuracy>=50?s.currentLocale==="am"?"በጣም ጥሩ":s.currentLocale==="om"?"Baay'ee Gaarii":"Excellent":s.currentLocale==="am"?"ጥሩ ተጫውተዋል":s.currentLocale==="om"?"Gaarii Taphatte":"Well Played"}
                    </div>

                    <!-- Final Score (LARGE) -->
                    <div style="margin-bottom: 24px; position: relative;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                            ${s.currentLocale==="am"?"አጠቃላይ እይታ":s.currentLocale==="om"?"Waliigala":"Overview"}
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
                                ${s.currentLocale==="am"?"ትክክል":s.currentLocale==="om"?"Sirrii":"Correct"}
                            </div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-red-live);">${i}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${s.currentLocale==="am"?"የተሳሳተ":s.currentLocale==="om"?"Dogoggora":"Wrong"}
                            </div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">${this._stats.accuracy}%</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${s.currentLocale==="am"?"ትክክለኛነት":s.currentLocale==="om"?"Sirriantummaa":"Accuracy"}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons (SMALL) -->
                    <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="grid-column: span 2;">
                            ${S.Button({id:"btn-play-again",text:s.currentLocale==="am"?"ድጋሚ ተጫወት":s.currentLocale==="om"?"Ammas Taphadhu":"Play Again",variant:"primary",fullWidth:!0,icon:"🔄"})}
                        </div>
                        
                        <div>
                            ${S.Button({id:"btn-review-game",text:s.currentLocale==="am"?"ከልስ":s.currentLocale==="om"?"Irra Deebi'i":"Review",variant:"secondary",fullWidth:!0,icon:"🔍"})}
                        </div>

                        <div>
                            ${S.Button({id:"btn-leaderboard",text:s.currentLocale==="am"?"ደረጃ":s.currentLocale==="om"?"Sadarkaa":"Rank",variant:"secondary",fullWidth:!0,icon:"📊"})}
                        </div>

                        <div style="grid-column: span 2;">
                            ${S.Button({id:"btn-home",text:s.currentLocale==="am"?"መነሻ":s.currentLocale==="om"?"Manattii":"Home",variant:"secondary",fullWidth:!0,icon:"🏠"})}
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
                    <div style="font-weight: 900; font-size: var(--fds-font-md); letter-spacing: 0.5px;">${s.currentLocale==="am"?"ጨዋታውን ይከልሱ":s.currentLocale==="om"?"TAPHA IRRA DEEBI'I":"REVIEW GAME"}</div>
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
        `,this._bindEvents();const o=document.getElementById("final-score-rolling");o&&(this._hasAnimated||ge.animate(o,0,this._finalScore,800));const l=Math.max(0,this._saveManager.profile.xp-a),c=this._saveManager.profile.xp,d=C.getLevel(l),g=C.getLevel(c),m=document.getElementById("xp-gained-rolling");m&&(this._hasAnimated||ge.animate(m,0,a,800)),this._hasAnimated=!0;const x=document.getElementById("level-display-left"),y=document.getElementById("level-display-right"),v=document.getElementById("xp-progress-fill");x&&(x.innerText=`Lvl ${d.level}`),y&&(y.innerText=`Lvl ${d.level+1}`),v&&(v.style.width=`${d.progressPercent}%`,setTimeout(()=>{g.level>d.level?(v.style.width="100%",setTimeout(()=>{v.style.transition="none",v.style.width="0%",x&&(x.innerText=`Lvl ${g.level}`),y&&(y.innerText=`Lvl ${g.level+1}`),setTimeout(()=>{v.style.transition="width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",v.style.width=`${g.progressPercent}%`},50),this._audioManager.playVictoryFanfare(),Ce.burst(window.innerWidth/2,window.innerHeight/2,100);const u=document.getElementById("level-up-toast");u&&(u.style.display="block")},1500)):v.style.width=`${g.progressPercent}%`},500))}_bindEvents(){const e=window;document.getElementById("btn-home")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioForceHome?e.ethioForceHome():(e.ethioCloseGame&&e.ethioCloseGame(),e.ethioReloadHome&&e.ethioReloadHome())}),document.getElementById("btn-play-again")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioCloseGame&&e.ethioCloseGame(),e.ethioPlayAgain?e.ethioPlayAgain(this._gameId):this._onContinue()}),document.getElementById("btn-leaderboard")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioCloseGame&&e.ethioCloseGame(),e.ethioNavigateToTab?e.ethioNavigateToTab("rankings"):this._onContinue()});const t=document.getElementById("review-modal"),i=document.getElementById("review-questions-container");document.getElementById("btn-review-game")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&i&&(this._renderReviewQuestions(i),t.style.display="flex")}),document.getElementById("btn-close-review")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")})}_renderReviewQuestions(e){const t=window.ethioReviewData||{questions:[],choices:[]},i=t.questions||[],a=t.choices||[];if(i.length===0){e.innerHTML=`
                <div style="text-align: center; padding: 48px; color: var(--fds-text-dim);">
                    ${s.currentLocale==="am"?"የሚከለሱ ጥያቄዎች የሉም።":s.currentLocale==="om"?"Gaaffiin irra deebi'amu hin jiru.":"No questions to review."}
                </div>
            `;return}e.innerHTML=i.map((n,o)=>{const l=a[o]!==void 0?a[o]:-1,c=l===n.correctIndex;let d="",g="";l===-1?(g="#F97316",d=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${g}; background: rgba(249,115,22,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${s.currentLocale==="am"?"⏱ ጊዜ አልቋል":s.currentLocale==="om"?"⏱ Yeroon Dhumate":"⏱ Timeout"}
                </span>`):c?(g="#22C55E",d=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${g}; background: rgba(34,197,94,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${s.currentLocale==="am"?"✓ ትክክል":s.currentLocale==="om"?"✓ Sirrii":"✓ Correct"}
                </span>`):(g="#EF4444",d=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${g}; background: rgba(239,68,68,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${s.currentLocale==="am"?"✗ የተሳሳተ":s.currentLocale==="om"?"✗ Dogoggora":"✗ Wrong"}
                </span>`);const m=n.options.map((u,f)=>{const b=f===n.correctIndex,w=f===l;let M="rgba(0,0,0,0.3)",A="rgba(255,255,255,0.06)",I="",O="";b&&w?(M="rgba(34,197,94,0.15)",A="#22C55E",I='<span style="color: #22C55E; font-weight: bold; margin-right: 8px;">✓</span>',O='<div style="background: rgba(34,197,94,0.2); color: #4ADE80; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Your Answer</div>'):b?(M="rgba(34,197,94,0.15)",A="#22C55E",I='<span style="color: #22C55E; font-weight: bold; margin-right: 8px;">✓</span>',O='<div style="background: rgba(34,197,94,0.2); color: #4ADE80; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Correct Answer</div>'):w&&(M="rgba(239,68,68,0.15)",A="#EF4444",I='<span style="color: #EF4444; font-weight: bold; margin-right: 8px;">✗</span>',O='<div style="background: rgba(239,68,68,0.2); color: #F87171; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Your Answer</div>');const G=String.fromCharCode(65+f)+".";return`
                    <div style="background: ${M}; border: 1px solid ${A}; padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-main);">
                                ${I}
                                <span style="color: var(--fds-gold-primary); margin-right: 8px;">${G}</span> 
                                ${u}
                            </div>
                            ${O}
                        </div>
                    </div>
                `}).join("");let x="";n.explanation&&(x=`
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(56,189,248,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #38BDF8; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">💡 ${s.currentLocale==="am"?"ይህ ለምን ትክክል ነው":s.currentLocale==="om"?"Maaliif Sirrii Dha":"Why this is correct"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${n.explanation}</div>
                    </div>
                `);let y="";n.fact&&(y=`
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(192,132,252,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #C084FC; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">🧠 ${s.currentLocale==="am"?"ያውቁ ኖሯል?":s.currentLocale==="om"?"Beektuu Laata?":"Did You Know?"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${n.fact}</div>
                    </div>
                `);let v="";return n.learningTip&&(v=`
                    <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(250,204,21,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #FACC15; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">🎯 ${s.currentLocale==="am"?"የመማሪያ ጠቃሚ ምክር":s.currentLocale==="om"?"Gorsa Barumsaa":"Learning Tip"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${n.learningTip}</div>
                    </div>
                `),`
                <div class="glass-card" style="border-radius: 12px; padding: 16px; margin-bottom: 16px; border-color: ${g}; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                            ${s.currentLocale==="am"?`ጥያቄ ${o+1}`:s.currentLocale==="om"?`Gaaffii ${o+1}`:`Question ${o+1}`}
                        </span>
                        ${d}
                    </div>

                    <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--fds-text-main); margin-bottom: 12px; line-height: 1.4;">${n.prompt}</div>

                    
                    <div style="margin-bottom: 12px;">
                        ${m}
                    </div>
                    
                    ${x}
                    ${y}
                    ${v}

                    <!-- In-App Interactions Row (REQ 14) -->
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                        <button class="review-action-btn btn-review-like" data-q-idx="${o}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span class="heart-icon" style="font-size: var(--fds-font-md); transition: transform 0.2s;">❤️</span> <span class="like-label">${s.currentLocale==="am"?"ውደድ":s.currentLocale==="om"?"Jaalladhu":"Like"}</span>
                        </button>
                        <button class="review-action-btn btn-review-comment" data-q-idx="${o}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span style="font-size: var(--fds-font-md);">💬</span> ${s.currentLocale==="am"?"አስተያየት":s.currentLocale==="om"?"Yaada":"Comment"}
                        </button>
                        <button class="review-action-btn btn-review-share" data-q-idx="${o}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span style="font-size: var(--fds-font-md);">⚽</span> ${s.currentLocale==="am"?"ጋብዝ":s.currentLocale==="om"?"Affeeri":"Invite"}
                        </button>
                    </div>

                    <!-- Comment Container (Hidden by default, expands on comment click) -->
                    <div class="comment-box-drawer" id="comment-drawer-${o}" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
                        <div class="comment-list" id="comment-list-${o}" style="max-height: 120px; overflow-y: auto; margin-bottom: 8px; font-size: var(--fds-font-xs); color: var(--fds-text-muted); display: flex; flex-direction: column; gap: 6px;">
                            <div style="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;">
                                <strong style="color: var(--fds-gold-primary);">Abebe M.:</strong> ${s.currentLocale==="am"?"በጣም ጥሩ ጥያቄ! እውቀቴን በእውነት ፈትኖታል።":s.currentLocale==="om"?"Gaaffii baay'ee gaarii! Beekuumsakoo dhugumaan qoreera.":"Great question! Really challenged my knowledge."} <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); float: right;">2m ago</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="comment-input-${o}" placeholder="${s.currentLocale==="am"?"አስተያየት ይፃፉ...":s.currentLocale==="om"?"Yaada barreessi...":"Write a comment..."}" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 10px; color: var(--fds-text-main); font-size: var(--fds-font-xs);" />
                            <button class="btn-send-comment" data-q-idx="${o}" style="background: #009A44; border: none; color: var(--fds-text-main); padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: var(--fds-font-xs); cursor: pointer;">${s.currentLocale==="am"?"ለጥፍ":s.currentLocale==="om"?"Maxxansi":"Post"}</button>
                        </div>
                    </div>
                </div>
            `}).join(""),e.querySelectorAll(".glass-card").forEach((n,o)=>{const l=n.querySelector(".btn-review-like");l?.addEventListener("click",()=>{this._audioManager.playClick();const v=l.querySelector(".like-label"),u=l.querySelector(".heart-icon");l.classList.contains("liked")?(l.classList.remove("liked"),l.style.color="#94A3B8",v.innerText=s.currentLocale==="am"?"ውደድ":s.currentLocale==="om"?"Jaalladhu":"Like"):(l.classList.add("liked"),l.style.color="#EF4444",v.innerText=s.currentLocale==="am"?"ተወዷል":s.currentLocale==="om"?"Jaallatameera":"Liked",u&&(u.style.transform="scale(1.3)",setTimeout(()=>u.style.transform="scale(1)",200)))});const c=n.querySelector(".btn-review-comment"),d=n.querySelector(`#comment-drawer-${o}`),g=n.querySelector(`#comment-input-${o}`),m=n.querySelector(".btn-send-comment"),x=n.querySelector(`#comment-list-${o}`);c?.addEventListener("click",()=>{this._audioManager.playClick(),d&&(d.style.display=d.style.display==="none"?"block":"none",d.style.display==="block"&&g?.focus())}),m?.addEventListener("click",()=>{this._audioManager.playClick();const v=g?.value.trim();if(!v){ne.show(s.currentLocale==="am"?"አስተያየት ባዶ ሊሆን አይችልም።":s.currentLocale==="om"?"Yaadni duwwaa ta'uu hin danda'u.":"Comment cannot be empty.","info");return}const u=document.createElement("div");u.style.cssText="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;";const f=s.currentLocale==="am"?"እርስዎ:":s.currentLocale==="om"?"Isin:":"You:",b=s.currentLocale==="am"?"አሁን":s.currentLocale==="om"?"Amma":"Just now";u.innerHTML=`<strong style="color: #4ADE80;">${f}</strong> ${v} <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); float: right;">${b}</span>`,x.appendChild(u),g.value="",x.scrollTop=x.scrollHeight,ne.show(s.currentLocale==="am"?"አስተያየት ተለጥፏል!":s.currentLocale==="om"?"Yaadni maxxanfameera!":"Comment posted!","success")}),n.querySelector(".btn-review-share")?.addEventListener("click",async()=>{this._audioManager.playClick();const v=s.currentLocale==="am"?`⚽ በኢትዮ ቴሌኮም የእግር ኳስ ውድድር ላይ እየተወዳደርኩ ነው!
የ ${this._finalScore} ነጥቤን ማሸነፍ ትችላለህ?
አሁኑኑ ውድድሩን ተቀላቀል እና ተፎካከረኝ!`:s.currentLocale==="om"?`⚽ Dorgoommii Kubbaa Miilaa Itooyyo Telekoom irratti dorgomaan jira!
Qabxii koo ${this._finalScore} mo'achuu dandeessa?
Amma dorgommiitti makamii na qori!`:`⚽ I'm competing in the Ethio Telecom Football Tournament!
Can you beat my score of ${this._finalScore} PTS?
Join the competition and challenge me now!`;if(navigator.share)try{await navigator.share({title:"Ethio Telecom Football League",text:v,url:window.location.href})}catch{}else await navigator.clipboard.writeText(`${v}
${window.location.href}`),ne.show(s.currentLocale==="am"?"የእግር ኳስ መጋበዣ ሊንክ ወደ ቅሊፕቦርድ ተገልብጧል! ለመፎካከር ለጓደኞችዎ ያጋሩ።":s.currentLocale==="om"?"Geessituun affeerraa kubbaa miilaa kooppii ta'eera! Hiriyoota keetiif qooduun isaan qori.":"Football invitation link copied to clipboard! Share with friends to challenge them.","success")})})}}class Ve{metadata={id:"football-quiz",name:"Football Quiz League",description:"Televised sports match quiz with match stats, goal celebrations, and rewards!"};_uiManager;_audioManager;_saveManager;_quizEngine;_activeScoreboard=null;_targetCompetitionId="walia-ibex";_preloadedQuestions=null;matchType="casual";dailyChallengeId;async initialize(e){this._uiManager=e,this._quizEngine=new He;const t=window;this._audioManager=t.ethioAudio||new Ie,this._saveManager=t.ethioSave||new Te}async start(){const e=T.getById(this._targetCompetitionId)||T.getAll()[0];let t=this._preloadedQuestions;(!t||t.length===0)&&(t=await N.getInstance().fetchQuestions(e.id,10,s.currentLocale)),this._activeScoreboard=new Le(this._uiManager,this._audioManager,this._quizEngine,e,t,{onMatchComplete:(i,a)=>this._showMatchStats(e.id,i,a),onExitMatch:()=>this.destroy()}),this._activeScoreboard.startMatch()}async resume(e){const t=T.getById(e.matchType)||T.getAll()[0];this._activeScoreboard=new Le(this._uiManager,this._audioManager,this._quizEngine,t,e.questions,{onMatchComplete:(i,a)=>this._showMatchStats(t.id,i,a),onExitMatch:()=>this.destroy()}),this._activeScoreboard.resumeSession(e)}setCompetition(e){this._targetCompetitionId=e}setPreloadedQuestions(e){this._preloadedQuestions=e}_showMatchStats(e,t,i){const a=window;a.ethioCache&&a.ethioCache.setQuizActive(!1);const r=this.matchType==="daily"?"daily":e,n=new Ye(this._uiManager,this._saveManager,this._audioManager,t,i,r,()=>{const o=window;o.ethioCloseGame?o.ethioCloseGame():o.ethioReloadHome&&o.ethioReloadHome()});this.matchType==="daily"&&this.dailyChallengeId&&(n.dailyChallengeId=this.dailyChallengeId),n.render()}update(e){}destroy(){this._activeScoreboard&&(this._activeScoreboard.destroy(),this._activeScoreboard=null),this._uiManager.clear(),console.log("[QuizGameMode] Destroyed.");const e=window;e.ethioCloseGame?e.ethioCloseGame():e.ethioReloadHome&&e.ethioReloadHome()}}class X{static _instance=null;static getInstance(){return X._instance||(X._instance=new X),X._instance}async fetchPlatformAnalytics(){if(_.isOnline&&h)try{const{count:e}=await h.from("users").select("*",{count:"exact",head:!0}),{count:t}=await h.from("matches").select("*",{count:"exact",head:!0}),{count:i}=await h.from("competitions").select("*",{count:"exact",head:!0}),{count:a}=await h.from("subscriptions").select("*",{count:"exact",head:!0});return{activePlayers:e||124500,totalMatches:t||185e4,activeCompetitions:i||15,subscribedUsers:a||88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12}}catch(e){console.warn("[AnalyticsService] Supabase analytics query failed, returning fallback metrics:",e)}return{activePlayers:124500,totalMatches:185e4,activeCompetitions:15,subscribedUsers:88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12}}}class k{static render(e,t="",i=!0){return`
            <div class="ethio-fantasy-app-bar" style="
                display: flex;
                align-items: center;
                height: 72px;
                background-color: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 14px;
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-left: 16px;
                    margin-right: 12px;
                    padding: 0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: transform 0.2s, background-color 0.2s;
                " aria-label="Back">❮</button>`:""}
                <div class="app-bar-title" style="
                    flex: 1;
                    color: white;
                    font-weight: 800;
                    font-size: var(--fds-font-md, 18px);
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-transform: uppercase;
                    ${i?"":"text-align: center; padding-left: 16px;"}
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
        `}static bind(e,t){const i=e.querySelector(".app-bar-back-btn");i&&i.addEventListener("click",a=>{a.preventDefault(),t()})}}class Xe{_uiManager;_audioManager;_onClose;_activeTab="QUESTIONS";_statusMessage="";_analyticsData=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onClose=i}async render(){const e=this._uiManager.container,t=T.getAll();this._analyticsData=await X.getInstance().fetchPlatformAnalytics(),e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Admin Header -->
                    ${k.render("CMS & ADMIN PANEL")}

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

                ${S.Button({id:"add-question-btn",text:"SAVE QUESTION TO CLOUD DATABASE",icon:"💾",variant:"primary",fullWidth:!0})}
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

                ${S.Button({id:"import-csv-btn",text:"PROCESS & IMPORT QUESTIONS",icon:"🚀",variant:"primary",fullWidth:!0})}
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
                ${S.Button({id:"admin-add-comp-btn",text:"SAVE & PUBLISH COMPETITION",variant:"primary",fullWidth:!0})}
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
        `}_bindEvents(){const e=this._uiManager.container;k.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",i=>{this._audioManager.playClick();const a=i.currentTarget.getAttribute("data-tab");a&&(this._activeTab=a,this._statusMessage="",this.render())})}),e.querySelector("#add-question-btn")?.addEventListener("click",async()=>{this._audioManager.playClick();const t=e.querySelector("#q-category")?.value,i=parseInt(e.querySelector("#q-difficulty")?.value||"2",10),a=parseInt(e.querySelector("#q-correct")?.value||"0",10),r=e.querySelector("#q-prompt-en")?.value.trim(),n=e.querySelector("#q-prompt-am")?.value.trim(),o=e.querySelector("#q-prompt-om")?.value.trim(),l=e.querySelector("#q-opt0-en")?.value.trim(),c=e.querySelector("#q-opt1-en")?.value.trim(),d=e.querySelector("#q-opt2-en")?.value.trim(),g=e.querySelector("#q-opt3-en")?.value.trim(),m=e.querySelector("#q-opt0-am")?.value.trim(),x=e.querySelector("#q-opt1-am")?.value.trim(),y=e.querySelector("#q-opt2-am")?.value.trim(),v=e.querySelector("#q-opt3-am")?.value.trim(),u=e.querySelector("#q-opt0-om")?.value.trim(),f=e.querySelector("#q-opt1-om")?.value.trim(),b=e.querySelector("#q-opt2-om")?.value.trim(),w=e.querySelector("#q-opt3-om")?.value.trim();if(!r||!l||!c||!d||!g){this._statusMessage="❌ Please fill in the English prompt and all 4 English options.",this.render();return}const M={category:t,difficulty:i,competition_id:t,prompt_en:r,prompt_am:n||null,prompt_om:o||null,options_en:[l,c,d,g],options_am:m&&x&&y&&v?[m,x,y,v]:null,options_om:u&&f&&b&&w?[u,f,b,w]:null,correct_index:a,is_active:!0};if(h){const{error:A}=await h.from("questions").insert(M);A?this._statusMessage=`❌ Cloud Insert Failed: ${A.message}`:this._statusMessage="✅ Question published to Cloud database successfully!"}else this._statusMessage="✅ Question added locally (Supabase offline).";this.render()}),e.querySelector("#import-csv-btn")?.addEventListener("click",async()=>{this._audioManager.playClick();const t=e.querySelector("#bulk-csv-area")?.value.trim();if(!t){this._statusMessage="❌ Please paste CSV content to import.",this.render();return}const i=t.split(`
`).map(n=>n.trim()).filter(n=>n.length>0);if(i.length<2){this._statusMessage="❌ CSV must contain a header row and at least 1 data row.",this.render();return}let a=0;const r=i.slice(1);for(const n of r){const o=n.split(",").map(l=>l.trim());if(o.length>=8){const[l,c,d,g,m,x,y,v]=o,u={category:l||"football-history",difficulty:parseInt(c||"1",10),competition_id:l||"football-history",prompt_en:d,options_en:[g,m,x,y],correct_index:parseInt(v||"0",10),is_active:!0};h&&await h.from("questions").insert(u),a++}}this._statusMessage=`✅ Successfully processed & imported ${a} questions!`,this.render()}),e.querySelector("#admin-add-comp-btn")?.addEventListener("click",()=>{const t=e.querySelector("#admin-comp-name"),i=e.querySelector("#admin-comp-badge"),a=e.querySelector("#admin-comp-desc");if(t&&t.value.trim()!==""){const r=t.value.toLowerCase().replace(/\s+/g,"-");T.addCompetition({id:r,name:t.value.trim(),nameEn:t.value.trim(),badge:i.value.trim()||"⚽",description:a.value.trim()||"Custom Competition",color:"#1e3a8a",questionCount:10}),this._audioManager.playClick(),this._statusMessage=`✅ Competition '${t.value.trim()}' Published Successfully!`,this.render()}})}}class H{static _instance=null;static getInstance(){return H._instance||(H._instance=new H),H._instance}async getLeaderboard(e,t="all_time",i=50){if(_.isOnline&&h)try{if(t==="daily"){const a=new Date().toISOString().split("T")[0],{data:r,error:n}=await h.rpc("get_daily_leaderboard",{p_date:a});if(!n&&r&&Array.isArray(r))return r.map((l,c)=>({rank:c+1,userId:l.user_id,username:l.username||"Anonymous Player",avatarUrl:l.avatar_url,eloRating:1200,score:l.score||0,matchesPlayed:1,wins:1}))}else{const{data:a,error:r}=await h.rpc("get_leaderboard",{p_competition_id:e||null,p_time_range:t,p_limit:i});if(!r&&a&&Array.isArray(a))return a.map(n=>({rank:n.rank,userId:n.user_id,username:n.username||"Anonymous Player",avatarUrl:n.avatar_url,eloRating:n.elo_rating||1200,score:n.score||0,matchesPlayed:n.matches_played||0,wins:n.wins||0}))}}catch(a){console.warn("[LeaderboardService] RPC query failed, returning empty list:",a)}return[]}async getUserRank(e,t){if(!e)return null;try{const a=(await this.getLeaderboard(t)).find(r=>r.userId===e);if(a)return a.rank}catch(i){console.warn("[LeaderboardService] Failed to get user rank:",i)}return null}async getMyDailyStats(){if(!h||!_.isOnline)return null;try{const{data:{user:e}}=await h.auth.getUser();if(!e)return null;const t=new Date().toISOString().split("T")[0],{data:i,error:a}=await h.rpc("get_daily_leaderboard",{p_date:t});if(a||!i||!Array.isArray(i))return null;const r=i.findIndex(n=>n.user_id===e.id);return r===-1?null:{rank:String(r+1),score:String(i[r].score||0)}}catch(e){return console.warn("[LeaderboardService] getMyDailyStats failed:",e),null}}}class W{static _instance=null;static getInstance(){return W._instance||(W._instance=new W),W._instance}async getTodayChallenge(){if(_.isOnline&&h)try{const{data:t,error:i}=await h.rpc("get_daily_challenge");if(!i&&t){const a=t;if(a.available&&a.question_ids&&a.question_ids.length>0){const r=await N.getInstance().fetchQuestionsByIds(a.question_ids,s.currentLocale),n=a.completed||!1;return{id:a.id,themeEn:a.theme_en||"Daily Football Quiz Challenge",themeAm:a.theme_am||"የዕለቱ የእግር ኳስ ጥያቄ ተግዳሮት",themeOm:a.theme_om||"Qormaata Gaaffii Kubbaa Miilaa Guyyaa",bonusMultiplier:a.bonusMultiplier||1.5,completed:n,questions:r}}}}catch(t){console.warn("[DailyChallengeManager] Supabase fetch failed:",t)}return{themeEn:"Daily Champions Challenge",themeAm:"የዕለቱ የሻምፒዮኖች ተግዳሮት",themeOm:"Qormaata Chaampiyoonii Guyyaa",bonusMultiplier:1.5,completed:!1,questions:await N.getInstance().fetchQuestions("world-cup",10,s.currentLocale)}}}class Je{static checkAndShow(e){const t="ETHIO_FOOTBALL_LAST_LOGIN",i=new Date().toISOString().split("T")[0];if(localStorage.getItem(t)===i)return;localStorage.setItem(t,i);const n=(e.profile.streakCount||0)+1;e.updateStreak(n);const o=100+n*25;e.addXp(o)}}class U{static _instance=null;_memoryCache=new Map;_isQuizActive=!1;static getInstance(){return U._instance||(U._instance=new U),U._instance}constructor(){}setQuizActive(e){this._isQuizActive=e}get isQuizActive(){return this._isQuizActive}async getOrFetch(e,t,i={}){const a=i.ttlMs??3e5,r=this.get(e);if(r&&!i.forceRefresh&&!this.isStale(e)||this._isQuizActive&&r)return r;try{const n=await t();return this.set(e,n,a),n}catch(n){if(r)return r;throw n}}get(e){return this._memoryCache.has(e)?this._memoryCache.get(e).data:null}set(e,t,i=300*1e3){this._memoryCache.set(e,{data:t,timestamp:Date.now(),ttlMs:i})}isStale(e){const t=this._memoryCache.get(e);return t?Date.now()-t.timestamp>t.ttlMs:!0}invalidate(e){this._memoryCache.delete(e)}clear(){this._memoryCache.clear()}}class se{static attach(e,t){let i=0,a=0,r=!1;const n=document.createElement("div");n.className="pull-to-refresh-indicator",n.style.cssText=`
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
        `,n.innerHTML=`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009A44" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
        `,e.style.position="relative",e.appendChild(n),e.addEventListener("touchstart",o=>{U.getInstance().isQuizActive||e.scrollTop<=0&&(i=o.touches[0].clientY,r=!0)},{passive:!0}),e.addEventListener("touchmove",o=>{if(!r||U.getInstance().isQuizActive)return;a=o.touches[0].clientY;const l=a-i;if(l>0&&e.scrollTop<=0){const c=Math.min(l*.45,75);n.style.top=`${c-42}px`,n.style.opacity=`${Math.min(c/50,1)}`;const d=n.querySelector("svg");d&&(d.style.transform=`rotate(${c*4}deg)`)}},{passive:!0}),e.addEventListener("touchend",async()=>{if(!r||U.getInstance().isQuizActive)return;if(r=!1,a-i>110&&e.scrollTop<=0){n.style.top="16px";const c=n.querySelector("svg");c&&(c.style.transition="transform 1s linear",c.style.transform="rotate(1080deg)");const d=e.scrollTop;try{await t(),e.scrollTop=d}catch(g){console.error("[PullToRefresh] Refresh failed:",g)}}n.style.pointerEvents="none",n.style.top="-50px",n.style.opacity="0";const l=n.querySelector("svg");l&&(l.style.transition="none",l.style.transform="rotate(0deg)"),i=0,a=0})}}class Ze{_saveManager;_audioManager;_uiManager;_callbacks;_timerInterval=null;_autoScrollInterval=null;_resetHandler=null;constructor(e,t,i,a){this._saveManager=e,this._audioManager=t,this._uiManager=i,this._callbacks=a}render(){const e=this._uiManager.container,t=this._saveManager.profile,i=t.totalMatches||0,a=i>0?Math.round((t.totalWins||0)/i*100):0,r=t.streakCount||0,n=$.getInstance().getActiveSession();let o="";n&&n.matchType==="daily"&&(o+=`
                <div class="glass-card fade-in-up" style="padding: clamp(12px, 2vh, 16px); border-color: rgba(34,197,94,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #4ADE80; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Continue Challenge</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">Daily Challenge</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 4px;">Round ${n.currentIndex+1} of ${n.totalQuestions}</div>
                    </div>
                    ${S.Button({id:"btn-continue-challenge",text:"Resume",variant:"primary"})}
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
                    <div id="home-daily-stats-row" class="glass-card fade-in-up" style="padding: 14px 16px; border-color: rgba(255,255,255,0.1); display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; margin-bottom: 24px;">
                        <div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Streak</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: #EF4444; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <span>🔥</span>${r}
                            </div>
                        </div>
                        <div style="border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Rank</div>
                            <div id="home-daily-rank" style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">--</div>
                        </div>
                        <div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Score</div>
                            <div id="home-daily-score" style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">--</div>
                        </div>
                    </div>
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
                                ${P("home.liveMatch")}
                            </span>
                        </div>

                        <!-- Title & Description -->
                        <div style="text-align: center; margin-bottom: 16px;">
                            <h2 style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                ETHIO FANTASY
                            </h2>
                        </div>

                        <!-- Hero Primary Action Button — replaced by server data in _fetchDynamicData -->
                        <div id="home-daily-action">
                            ${S.SkeletonList(1)}
                        </div>
                    </div>


                    <div class="fade-in-up" id="btn-action-referral" style="padding: clamp(12px, 2vh, 16px); border-radius: 16px; background: rgba(15,23,42,0.6); border: 1px solid rgba(192,132,252,0.3); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: var(--fds-font-xl); filter: drop-shadow(0 2px 4px rgba(192,132,252,0.4));">🎁</div>
                            <div style="text-align: left;">
                                <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); letter-spacing: 0.5px; text-transform: uppercase;">${P("home.invite")}</div>
                                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600; margin-top: 2px;">${P("home.inviteDesc")}</div>
                            </div>
                        </div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #C084FC; background: rgba(192,132,252,0.15); padding: 8px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${P("home.copyLink")}
                        </div>
                    </div>
                    
                    <!-- NEW CONTEXTUAL UI -->
                    ${o}

                    <!-- 3. STATISTICS DASHBOARD CARD -->
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: rgba(255,255,255,0.1); margin-bottom: 24px; border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; text-transform: uppercase; letter-spacing: 0.5px;">${P("home.performance")}</div>
                            <button id="btn-view-all-stats" style="background: rgba(244, 114, 182, 0.15); border: none; color: #F472B6; font-size: var(--fds-font-xs); font-weight: 900; cursor: pointer; padding: 6px 12px; border-radius: 20px; letter-spacing: 0.5px; z-index: 10; position: relative;">${P("home.details")}</button>
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
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${P("home.matches")}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${i}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${P("match.accuracy")}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: #4ADE80; margin-top: 4px;">${a}%</div>
                            </div>
                            <div>
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${P("home.points")}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${t.xp}</div>
                            </div>
                            <div style="grid-column: span 3; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-around;">
                                <div>
                                    <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${P("home.score")}</div>
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
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-gold-primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">${P("home.rankingsTitle")}</div>
                        <div id="home-leaderboard-preview" style="display: flex; flex-direction: column;">
                            ${S.SkeletonList(3)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._startCountdownTimer(),this._bindEvents(),this._fetchDynamicData();const l=e.querySelector(".stadium-container");l&&se.attach(l,async()=>{this._audioManager.playClick(),await new Promise(c=>setTimeout(c,600)),this.render()}),Je.checkAndShow(this._saveManager),this._resetHandler||(this._resetHandler=()=>{this.render()},window.addEventListener("ethio:dailyReset",this._resetHandler))}async _fetchDynamicData(){try{const n=(await W.getInstance().getTodayChallenge()).completed,o=document.getElementById("home-daily-action");o&&(n?(o.innerHTML=`
                        <div style="display: flex; justify-content: center;">
                            <div style="background: rgba(0,0,0,0.6); border-radius: 999px; padding: 10px 24px; text-align: center; border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: default;">
                                <div style="font-size: 10px; font-weight: 800; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Next Challenge In</div>
                                <div id="next-daily-countdown" style="font-size: 20px; font-weight: 900; color: white; font-family: var(--fds-font-mono); letter-spacing: 1px;">--:--:--</div>
                            </div>
                        </div>`,this._startCountdownTimer()):(o.innerHTML=`${S.Button({id:"btn-daily-match",text:"DAILY CHALLENGE",variant:"primary",fullWidth:!0})}`,document.getElementById("btn-daily-match")?.addEventListener("click",c=>{this._addRipple(c),this._audioManager.playClick(),this._callbacks.onDailyChallenge()})))}catch{const n=document.getElementById("home-daily-action");n&&(n.innerHTML=`${S.Button({id:"btn-daily-match",text:"DAILY CHALLENGE",variant:"primary",fullWidth:!0})}`,document.getElementById("btn-daily-match")?.addEventListener("click",()=>this._callbacks.onDailyChallenge()))}try{const r=await H.getInstance().getMyDailyStats(),n=document.getElementById("home-daily-rank"),o=document.getElementById("home-daily-score");n&&(n.textContent=r?`#${r.rank}`:"Unranked"),o&&(o.textContent=r?r.score:"0")}catch{}const e=T.getAll().filter(r=>r.status==="live"),t=e.find(r=>r.id==="daily")||e[0],i=document.getElementById("daily-players-count"),a=document.getElementById("daily-play-btn-text");t?(i&&(i.innerHTML=`🟢 LIVE MATCH • ${(t.participants||0).toLocaleString()} PLAYERS`),a&&(a.innerText=`⚡ KICK OFF NOW (+${t.prize_pool||0} XP)`)):(i&&(i.innerHTML="⚪ NO LIVE MATCHES"),a&&(a.innerText="⚡ PLAY CASUAL MATCH"));try{const r=await H.getInstance().getLeaderboard(void 0,"all_time",3),n=document.getElementById("home-leaderboard-preview");if(n&&r.length>0){const o=["🥇","🥈","🥉"],l=["rgba(255,215,0,0.08)","rgba(255,255,255,0.04)","rgba(255,255,255,0.02)"],c=["white","#E2E8F0","#CBD5E1"];n.innerHTML=r.map((d,g)=>`
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${l[g]}; padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${o[g]}</span>
                            <span style="font-size: var(--fds-font-sm); font-weight: ${g===0?"800":"700"}; color: ${c[g]};">${d.username}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-md); font-weight: 900; color: ${g===0?"var(--fds-gold-primary)":"white"}; font-family: var(--fds-font-mono); line-height: 1.1;">${d.score.toLocaleString()}</div>
                            <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Points</div>
                        </div>
                    </div>
                `).join("")}else n&&(n.innerHTML='<div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); text-align: center;">No ranked players yet</div>')}catch(r){console.error(r)}}_startCountdownTimer(){this._timerInterval&&clearInterval(this._timerInterval);const e=T.getAll().filter(r=>r.status==="live"),t=e.find(r=>r.id==="daily")||e[0];let i=new Date().setHours(23,59,59,999);t&&t.end_time&&(i=new Date(t.end_time).getTime());const a=(r,n)=>{if(r.children.length!==n.length){r.innerHTML=n.split("").map(o=>`<span>${o}</span>`).join("");return}for(let o=0;o<n.length;o++){const l=r.children[o];l.textContent!==n[o]&&(l.textContent=n[o],l.classList.remove("digit-tick"),l.offsetWidth,l.classList.add("digit-tick"))}};this._timerInterval=window.setInterval(()=>{let r=Math.floor((i-new Date().getTime())/1e3);if(r<=0){this._timerInterval!==null&&(clearInterval(this._timerInterval),this._timerInterval=null),window.dispatchEvent(new Event("ethio:dailyReset"));return}const n=Math.floor(r/3600),o=Math.floor(r%3600/60),l=r%60,c=document.getElementById("daily-countdown");c&&a(c,`⏱️ ${n}h : ${o.toString().padStart(2,"0")}m : ${l.toString().padStart(2,"0")}s`);const d=document.getElementById("next-daily-countdown");d&&a(d,`${n.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}`)},1e3)}_bindEvents(){const e=this._uiManager.container;e.querySelector("#btn-daily-match-card")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-continue-challenge")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-action-kickoff")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onKickOff()}),e.querySelector("#btn-action-leaderboard")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onLeaderboard()}),e.querySelector("#btn-action-referral")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),ne.show("Invitation link copied! Share with friends to earn 200 XP bonus.","success")}),e.querySelector("#btn-view-all-stats")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onViewStats&&this._callbacks.onViewStats()}),e.querySelector("#btn-notif")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onNotifications&&this._callbacks.onNotifications()}),e.querySelector("#btn-settings")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onSettings()});const t=e.querySelector("#ad-carousel"),i=e.querySelectorAll(".ad-dot");if(t&&i.length>0){let a=0;const r=c=>{i.forEach((d,g)=>{g===c?(d.classList.add("active"),d.style.opacity="1"):(d.classList.remove("active"),d.style.opacity="0.4")})},n=()=>{if(!t.clientWidth)return;a=(a+1)%i.length;const c=t.clientWidth*a,d=t.scrollLeft,g=c-d,m=400;let x=null;const y=v=>{x===null&&(x=v);const u=v-x,f=Math.min(u/m,1),b=f<.5?2*f*f:-1+(4-2*f)*f;t.scrollLeft=d+g*b,f<1&&requestAnimationFrame(y)};requestAnimationFrame(y),r(a)},o=()=>{clearInterval(this._autoScrollInterval),this._autoScrollInterval=setInterval(n,4e3)},l=()=>{clearInterval(this._autoScrollInterval)};t.addEventListener("scroll",()=>{if(!t.clientWidth)return;const c=Math.round(t.scrollLeft/t.clientWidth);c!==a&&c>=0&&c<i.length&&(a=c,r(a))},{passive:!0}),t.addEventListener("touchstart",l,{passive:!0}),t.addEventListener("touchend",o,{passive:!0}),t.addEventListener("mouseenter",l),t.addEventListener("mouseleave",o),o()}}_addRipple(e){const t=e.currentTarget,i=document.createElement("span");i.classList.add("m3-ripple-wave");const a=t.getBoundingClientRect(),r=Math.max(a.width,a.height);i.style.width=i.style.height=`${r}px`,i.style.left=`${e.clientX-a.left-r/2}px`,i.style.top=`${e.clientY-a.top-r/2}px`,t.appendChild(i),setTimeout(()=>i.remove(),400)}_maskPhone(e){let t;return e.startsWith("+")?t=e.substring(1):t=e,t.substring(0,4)+"****"+t.substring(t.length-2)}destroy(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null),this._autoScrollInterval&&(clearInterval(this._autoScrollInterval),this._autoScrollInterval=null),this._resetHandler&&(window.removeEventListener("ethio:dailyReset",this._resetHandler),this._resetHandler=null)}}class et{_uiManager;_audioManager;_callbacks;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._callbacks=i}render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                ${k.render("PLAY","",!1)}

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
        `,this._bindEvents()}_bindEvents(){this._uiManager.container.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",a=>{const r=a.currentTarget,n=r.getAttribute("data-category")||"random",o=r.getBoundingClientRect(),l=a,c=document.createElement("div"),d=Math.max(r.clientWidth,r.clientHeight),g=d/2;let m=l.clientX-o.left-g,x=l.clientY-o.top-g;c.style.width=c.style.height=`${d}px`,c.style.left=`${m}px`,c.style.top=`${x}px`,c.classList.add("ripple"),r.appendChild(c),setTimeout(()=>c.remove(),600),this._audioManager.playClick(),this._callbacks.onCasualPlay(n)})})}destroy(){}}class R{static _instance=null;_currentUser=null;_listeners=new Set;_saveManager;constructor(e){this._saveManager=e,this._initSession()}static normalisePhone(e){const t=e.replace(/\D/g,"");return t.startsWith("251")?"+"+t:t.startsWith("0")?"+251"+t.slice(1):e.startsWith("+")?e.replace(/\s+/g,""):"+251"+t}static getInstance(e){if(!R._instance){if(!e)throw new Error("[AuthManager] SaveManager required for initial instantiation.");R._instance=new R(e)}return R._instance}async _initSession(){if(!_.isOnline||!h){console.log("[AuthManager] Offline mode active."),this._notifyListeners();return}try{const{data:{session:e}}=await h.auth.getSession();e?.user?await this._fetchUserProfile(e.user.id):this._notifyListeners()}catch(e){console.error("[AuthManager] Failed to fetch session:",e),this._notifyListeners()}h.auth.onAuthStateChange(async(e,t)=>{console.log(`[AuthManager] Auth state changed: ${e}`),t?.user?await this._fetchUserProfile(t.user.id):(this._currentUser=null,this._notifyListeners())})}async refreshProfile(){this._currentUser&&await this._fetchUserProfile(this._currentUser.id)}async _fetchUserProfile(e,t=5,i){if(h){for(let a=0;a<t;a++){const{data:r,error:n}=await h.from("users").select("*").eq("id",e).single();if(n){if(n.code==="PGRST116"){const o=i?`Player_${i.slice(-4)}`:`Player_${e.slice(-4)}`,{data:l,error:c}=await h.from("users").insert({id:e,username:o,phone:i||null,locale:"en",elo_rating:0,coins:0,xp:0,total_matches:0,total_wins:0,subscription_tier:"free",streak_count:0,created_at:new Date().toISOString(),last_active:new Date().toISOString()}).select().single();if(!c&&l){this._currentUser=l,this._saveManager.syncWithCloudUser(l),this._notifyListeners(),console.log("[AuthManager] Created new user profile:",o);return}console.error("[AuthManager] Failed to create user profile:",c);break}if(console.warn(`[AuthManager] Error fetching user profile (attempt ${a+1}/${t}):`,n),a<t-1){await new Promise(o=>setTimeout(o,500));continue}}else if(r){this._currentUser=r,this._saveManager.syncWithCloudUser(r),this._notifyListeners();return}}console.error("[AuthManager] Failed to fetch user profile after retries."),this._notifyListeners()}}async signInWithPhone(e){if(!h)return{success:!1,error:"Supabase client offline"};const t=R.normalisePhone(e);try{const{error:i}=await h.auth.signInWithOtp({phone:t});return i?{success:!1,error:i.message}:{success:!0}}catch(i){return{success:!1,error:i.message||"Failed to send OTP"}}}async verifyOtp(e,t){if(!h)return{success:!1,error:"Supabase client offline"};const i=R.normalisePhone(e);try{const{data:a,error:r}=await h.auth.verifyOtp({phone:i,token:t,type:"sms"});return r?(console.error("[AuthManager] OTP Verification error:",r),{success:!1,error:r.message}):(a.user&&await this._fetchUserProfile(a.user.id,5,i),{success:!0})}catch(a){return{success:!1,error:a.message||"OTP verification failed"}}}async signOut(){h&&await h.auth.signOut(),this._currentUser=null,this._notifyListeners()}subscribe(e){return this._listeners.add(e),e(this._currentUser),()=>this._listeners.delete(e)}_notifyListeners(){this._listeners.forEach(e=>e(this._currentUser))}get currentUser(){return this._currentUser}get isGuest(){return!1}get isAuthenticated(){return this._currentUser!==null}}const tt=Object.freeze(Object.defineProperty({__proto__:null,AuthManager:R},Symbol.toStringTag,{value:"Module"}));class it{_uiManager;_audioManager;_authManager;_onSuccess;_phoneStep="INPUT_PHONE";_pendingPhone="";_statusMessage="";_devOtpCode="";_showSettings=!1;_settingsTab="main";_faqExpandedIndex=-1;_bannerInterval=null;_currentBanner=1;constructor(e,t,i,a){this._uiManager=e,this._audioManager=t,this._authManager=i,this._onSuccess=a,window.ethioOnBackPress=()=>this._showSettings?(this._settingsTab!=="main"?this._settingsTab="main":this._showSettings=!1,this.render(),!0):!1}_renderSettingsContent(){return this._settingsTab==="main"?`
                <div class="settings-tile" data-tab="language" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05); border-radius: 12px 12px 0 0;">
                    <div style="font-weight: 700; font-size: 16px;">${s.currentLocale==="am"?"ቋንቋ":s.currentLocale==="om"?"Afaan":"Language"}</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94A3B8;">${s.currentLocale==="am"?"አማርኛ":s.currentLocale==="om"?"Afan Oromo":"English"}</span>
                        <span>❯</span>
                    </div>
                </div>
                <div class="settings-tile sound-toggle" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 16px;">${s.currentLocale==="am"?"የድምፅ ውጤቶች":s.currentLocale==="om"?"Sagalee":"Sound Effects"}</div>
                    <div style="color: ${this._audioManager.isMuted?"#F87171":"#4ADE80"}; font-weight: 700;">${this._audioManager.isMuted?"OFF":"ON"}</div>
                </div>
                <div class="settings-tile" data-tab="tc" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 16px;">${s.currentLocale==="am"?"ውሎች እና ሁኔታዎች":s.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions"}</div>
                    <span>❯</span>
                </div>
                <div class="settings-tile" data-tab="faq" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.05); border-radius: 0 0 12px 12px;">
                    <div style="font-weight: 700; font-size: 16px;">FAQ</div>
                    <span>❯</span>
                </div>
            `:this._settingsTab==="language"?`
                <div class="settings-tile lang-item" data-lang="en" style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between;">
                    <span>English</span>
                    ${s.currentLocale==="en"?"<span>✓</span>":""}
                </div>
                <div class="settings-tile lang-item" data-lang="am" style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; display: flex; justify-content: space-between;">
                    <span>አማርኛ (Amharic)</span>
                    ${s.currentLocale==="am"?"<span>✓</span>":""}
                </div>
                <div class="settings-tile lang-item" data-lang="om" style="padding: 16px; background: rgba(255,255,255,0.05); cursor: pointer; border-radius: 0 0 12px 12px; display: flex; justify-content: space-between;">
                    <span>Afan Oromo</span>
                    ${s.currentLocale==="om"?"<span>✓</span>":""}
                </div>
            `:this._settingsTab==="tc"?`
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
                    <h2 style="margin-top: 0; font-size: 20px;">Terms & Conditions</h2>
                    <p style="color: #CBD5E1; line-height: 1.6;">Welcome to EthioFantasy. By logging in, you agree to our Terms & Conditions. You must be 18 years or older and an active subscriber to participate. Your data is handled securely and in compliance with local regulations. Subscription fees are deducted automatically from your airtime.</p>
                </div>
            `:this._settingsTab==="faq"?[{q:"How do I play?",a:"Answer questions quickly to score goals. Each fast correct answer increases your chance to win!"},{q:"Is it free?",a:"There is a daily subscription fee for premium access. It will be deducted from your airtime balance."},{q:"How are prizes awarded?",a:"Prizes are distributed based on weekly leaderboard standings and sent directly to your mobile account."},{q:"How do I unsubscribe?",a:"You can unsubscribe anytime by sending 'STOP' to 8282 or visiting your profile settings."}].map((t,i)=>`
                <div class="faq-item" data-idx="${i}" style="background: rgba(255,255,255,0.05); margin-bottom: 10px; border-radius: 12px; overflow: hidden; cursor: pointer;">
                    <div style="padding: 16px; font-weight: bold; border-bottom: ${this._faqExpandedIndex===i?"1px solid rgba(255,255,255,0.1)":"none"}; display: flex; justify-content: space-between;">
                        <span>${t.q}</span>
                        <span style="color: #F59E0B;">${this._faqExpandedIndex===i?"−":"+"}</span>
                    </div>
                    ${this._faqExpandedIndex===i?`<div style="padding: 16px; color: #CBD5E1; line-height: 1.5;">${t.a}</div>`:""}
                </div>
            `).join(""):""}render(){const e=this._uiManager.container,t=this._phoneStep==="INPUT_OTP",i=this._pendingPhone?this._pendingPhone.replace("+",""):"";e.innerHTML=`
            <div style="
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: #020617;
                background-image: 
                    radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.98) 100%),
                    repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255, 255, 255, 0.02) 40px, rgba(255, 255, 255, 0.02) 80px);
                display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
                font-family: system-ui, -apple-system, sans-serif; pointer-events: auto; padding: max(16px, env(safe-area-inset-top)) 16px 16px 16px; box-sizing: border-box; overflow-y: auto; overflow-x: hidden;
            ">
                <!-- Top-Right Settings -->
                <div style="width: 100%; max-width: 400px; display: flex; justify-content: flex-end; margin-bottom: 16px; flex-shrink: 0;">
                    <button id="auth-settings-btn" style="background: rgba(255,255,255,0.1); border: none; border-radius: 50%; width: 40px; height: 40px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
                        <span style="font-size: 20px; line-height: 1;">⚙️</span>
                    </button>
                </div>

                <!-- 10-Banner Carousel -->
                <div style="width: 100%; max-width: 400px; margin-bottom: clamp(12px, 2.5vh, 20px); flex-shrink: 0; position: relative; height: clamp(110px, 22vh, 160px); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); background: #0F172A;">
                    <img id="auth-banner-bg" src="/assets/banners/${this._currentBanner}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 1; transition: opacity 0.8s ease-in-out;" />
                    <img id="auth-banner-fg" src="/assets/banners/${this._currentBanner===10?1:this._currentBanner+1}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.8s ease-in-out;" />
                </div>
                
                ${this._showSettings?`
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #0F172A; z-index: 1000; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;">
                    <div style="display: flex; align-items: center; height: 72px; padding: env(safe-area-inset-top) 0 0 0; background: #020617; border-bottom: 1px solid rgba(255,255,255,0.1); box-sizing: content-box;">
                        <button id="auth-settings-back" style="width: 48px; height: 48px; background: none; border: none; color: white; font-size: 24px; cursor: pointer; margin-left: 16px; display: flex; align-items: center; justify-content: center;">❮</button>
                        <div style="flex: 1; color: white; font-weight: 700; font-size: 18px; text-transform: uppercase;">
                            ${this._settingsTab==="main"?s.currentLocale==="am"?"ቅንብሮች":s.currentLocale==="om"?"Qindaa'inoota":"Settings":this._settingsTab==="language"?s.currentLocale==="am"?"ቋንቋ ይምረጡ":s.currentLocale==="om"?"Afaan Filadhu":"Select Language":this._settingsTab==="tc"?"Terms & Conditions":"FAQ"}
                        </div>
                    </div>
                    <div style="padding: 20px; color: white; flex: 1; max-width: 600px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                        ${this._renderSettingsContent()}
                    </div>
                </div>
                `:""}

                <!-- Compact Sign In Card -->
                <div style="
                    background: #FFFFFF; border-radius: 16px; padding: 16px;
                    width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center; margin-bottom: 16px; flex-shrink: 0;
                ">
                    <h1 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">
                        ${s.currentLocale==="am"?"ይግቡ":s.currentLocale==="om"?"Seenaa":"Sign In"}
                    </h1>

                    ${this._statusMessage?`
                        <div style="color: #EF4444; font-size: 12px; margin-bottom: 8px; text-align: left;">
                            ${this._statusMessage}
                        </div>
                    `:""}

                    ${this._devOtpCode?`
                        <div style="
                            background: #F0FDF4; border: 2px solid #16A34A; border-radius: 8px;
                            padding: 8px 12px; margin-bottom: 8px; text-align: left;
                        ">
                            <div style="font-size: 10px; font-weight: 700; color: #15803D; text-transform: uppercase; margin-bottom: 2px;">
                                🔑 Your OTP Code (Dev Mode)
                            </div>
                            <div style="font-size: 20px; font-weight: 900; color: #111827; letter-spacing: 4px;">
                                ${this._devOtpCode}
                            </div>
                        </div>
                    `:""}

                    <div style="text-align: left; margin-bottom: 10px;">
                        <label style="display: block; font-size: 12px; color: #4B5563; font-weight: 600; margin-bottom: 4px;">
                            ${s.currentLocale==="am"?"የስልክ ቁጥር":s.currentLocale==="om"?"Lakkoofsa bilbilaa":"Phone number"}
                        </label>
                        <input type="tel" id="phone-input" placeholder="2519XXXXXXXX / 2518XXXXXXXX" value="${i}" ${t?"disabled":""} style="
                            width: 100%; background: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 8px;
                            padding: 10px 12px; color: #111827; font-size: 14px; outline: none; box-sizing: border-box;
                            opacity: ${t?"0.6":"1"};
                        " />
                    </div>

                    <div style="display: flex; align-items: stretch; margin-bottom: 12px; border: 1px solid #D1D5DB; border-radius: 8px; overflow: hidden; background: #FFFFFF; opacity: ${t?"1":"0.6"};">
                        <input type="text" id="otp-input" maxlength="6"
                            placeholder="${s.currentLocale==="am"?"የ 6-አሃዝ ኮድ":s.currentLocale==="om"?"Koodii dijiitii 6":"6-digit code"}"
                            ${t?"":"disabled"}
                            style="
                            flex: 1; background: transparent; border: none; padding: 10px 12px;
                            color: #111827; font-size: 14px; outline: none; width: 100%;
                            letter-spacing: 2px; font-weight: 700;
                        " />
                        <button id="send-otp-btn" style="
                            background: #2563EB; color: white; border: none; padding: 0 14px;
                            font-size: 13px; font-weight: 600; cursor: ${t?"default":"pointer"}; outline: none;
                            opacity: ${t?"0.7":"1"}; white-space: nowrap;
                        " ${t?"disabled":""}>
                            ${s.currentLocale==="am"?"ኮድ ያግኙ":s.currentLocale==="om"?"Koodii fudhadhu":"Get code"}
                        </button>
                    </div>

                    <div id="sign-in-container" style="margin-bottom: 12px;">
                        <button id="verify-otp-btn" disabled style="
                            width: 100%; background: #2563EB; color: white; border: none; border-radius: 8px;
                            padding: 10px; font-size: 14px; font-weight: bold; cursor: not-allowed; opacity: 0.5; transition: all 0.2s;
                        ">${s.currentLocale==="am"?"ይግቡ":s.currentLocale==="om"?"Seenaa":"Sign In"}</button>
                    </div>

                    <div style="margin-top: 8px; display: flex; justify-content: center; gap: 16px;">
                        <a href="#" style="color: #64748B; text-decoration: underline; font-size: 12px; font-weight: 600;">
                            ${s.currentLocale==="am"?"ደንቦች እና ሁኔታዎች":s.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions"}
                        </a>
                        ${t?`
                        <button id="change-phone-btn" style="background: none; border: none; color: #2563EB; font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;">
                            ${s.currentLocale==="am"?"ቁጥር ይቀይሩ":s.currentLocale==="om"?"Lakkoofsa jijjiiri":"Change number"}
                        </button>
                        `:""}
                    </div>
                </div>

                <!-- Subscribe Button -->
                <button id="auth-subscribe-btn" style="
                    background: #FFFFFF; color: #16A34A;
                    border: 2px solid #16A34A; border-radius: 12px; padding: 10px 24px; font-size: 15px;
                    font-weight: 700; width: 100%; max-width: 400px; cursor: pointer;
                    flex-shrink: 0; margin-bottom: clamp(16px, 4vh, 40px);
                ">
                    ${s.currentLocale==="am"?"ሰብስክራይብ":s.currentLocale==="om"?"Galmoofadhu":"Subscribe"}
                </button>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;this._bannerInterval&&(clearInterval(this._bannerInterval),this._bannerInterval=null),this._showSettings||(this._bannerInterval=setInterval(()=>{const l=e.querySelector("#auth-banner-bg"),c=e.querySelector("#auth-banner-fg");l&&c&&(c.style.opacity="1",setTimeout(()=>{if(!l||!c)return;l.src=c.src,c.style.transition="none",c.style.opacity="0",this._currentBanner=this._currentBanner>=10?1:this._currentBanner+1;const d=this._currentBanner>=10?1:this._currentBanner+1;c.src=`/assets/banners/${d}.png`,c.offsetWidth,c.style.transition="opacity 0.8s ease-in-out"},800))},4e3)),e.querySelector("#phone-input")?.addEventListener("input",l=>{const c=l.target;c.value=c.value.replace(/[^0-9+]/g,""),c.value.indexOf("+")>0&&(c.value=c.value.replace(/\+/g,""))}),e.querySelector("#otp-input")?.addEventListener("input",l=>{const c=l.target,d=e.querySelector("#verify-otp-btn");d&&(c.value.trim().length===6?(d.disabled=!1,d.style.opacity="1",d.style.cursor="pointer"):(d.disabled=!0,d.style.opacity="0.5",d.style.cursor="not-allowed"))});const t=e.querySelector("#send-otp-btn");t&&t.addEventListener("click",async()=>{this._audioManager.playClick();const c=e.querySelector("#phone-input")?.value.trim()||"";if(!c){this._statusMessage=s.currentLocale==="am"?"እባክዎን ትክክለኛ የስልክ ቁጥር ያስገቡ።":s.currentLocale==="om"?"Maaloo lakkoofsa bilbilaa sirrii ta'e galchaa.":"Please enter a valid phone number.",this.render();return}const d=R.normalisePhone(c);this._pendingPhone=d,this._devOtpCode="",this._statusMessage=s.currentLocale==="am"?"የኦቲፒ መልዕክት በመላክ ላይ...":s.currentLocale==="om"?"OTP SMS ergaa jira...":"Sending OTP...",this.render();const g=await this._authManager.signInWithPhone(d);g.success?(this._phoneStep="INPUT_OTP",this._statusMessage="",this._fetchDevOtp(d)):this._statusMessage=g.error||(s.currentLocale==="am"?"ኮድ መላክ አልተቻለም።":s.currentLocale==="om"?"OTP erguun hin danda'amne.":"Failed to send OTP."),this.render()});const i=e.querySelector("#verify-otp-btn");i&&i.addEventListener("click",async()=>{this._audioManager.playClick();const c=e.querySelector("#otp-input")?.value.trim()||"";if(c.length!==6){this._statusMessage=s.currentLocale==="am"?"እባክዎን የ 6-አሃዝ ማረጋገጫ ኮድ ያስገቡ።":s.currentLocale==="om"?"Maaloo koodii mirkaneessaa dijiitii 6 galchaa.":"Please enter a 6-digit verification code.",this.render();return}this._statusMessage=s.currentLocale==="am"?"ኮድ በመፈተሽ ላይ...":s.currentLocale==="om"?"Koodii mirkaneessaa jira...":"Verifying code...",this.render();const d=await this._authManager.verifyOtp(this._pendingPhone,c);d.success?this._onSuccess():(this._statusMessage=d.error||(s.currentLocale==="am"?"የተሳሳተ የማረጋገጫ ኮድ።":s.currentLocale==="om"?"Koodii mirkaneessaa dogoggoraa.":"Invalid verification code."),this.render())});const a=e.querySelector("#change-phone-btn");a&&a.addEventListener("click",()=>{this._audioManager.playClick(),this._phoneStep="INPUT_PHONE",this._statusMessage="",this._devOtpCode="",this.render()});const r=e.querySelector("#auth-settings-btn");r&&r.addEventListener("click",()=>{this._audioManager.playClick(),this._showSettings=!0,this._settingsTab="main",this.render()});const n=e.querySelector("#auth-settings-back");n&&n.addEventListener("click",()=>{this._audioManager.playClick(),this._settingsTab!=="main"?this._settingsTab="main":this._showSettings=!1,this.render()}),e.querySelectorAll(".settings-tile[data-tab]").forEach(l=>{l.addEventListener("click",c=>{this._audioManager.playClick(),this._settingsTab=c.currentTarget.getAttribute("data-tab"),this.render()})}),e.querySelector(".sound-toggle")?.addEventListener("click",()=>{this._audioManager.toggleMute(),this._audioManager.playClick();const l=this._audioManager.isMuted;localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(l));const c=localStorage.getItem("ETHIO_FOOTBALL_SETTINGS_V2");if(c)try{const d=JSON.parse(c);d.soundEffects=!l,localStorage.setItem("ETHIO_FOOTBALL_SETTINGS_V2",JSON.stringify(d))}catch{}this.render()}),e.querySelectorAll(".lang-item").forEach(l=>{l.addEventListener("click",c=>{const d=c.currentTarget.getAttribute("data-lang");s.setLocale(d),this._audioManager.playClick(),this._settingsTab="main",this.render()})}),e.querySelectorAll(".faq-item").forEach(l=>{l.addEventListener("click",c=>{const d=parseInt(c.currentTarget.getAttribute("data-idx")||"-1",10);this._faqExpandedIndex=this._faqExpandedIndex===d?-1:d,this._audioManager.playClick(),this.render()})});const o=e.querySelector("#auth-subscribe-btn");o&&o.addEventListener("click",()=>{this._audioManager.playClick(),window.location.href="sms:9401?body=OK"})}async _fetchDevOtp(e){if(h)for(let t=0;t<8;t++){await new Promise(i=>setTimeout(i,800));try{const{data:i}=await h.from("dev_otps").select("code").eq("phone",e).maybeSingle();if(i?.code){this._devOtpCode=String(i.code),this.render();const a=this._uiManager.container.querySelector("#otp-input");a&&(a.value=this._devOtpCode,a.dispatchEvent(new Event("input",{bubbles:!0})));return}}catch{return}}}}class J{static instance;channels=new Map;listeners=new Map;constructor(){}static getInstance(){return J.instance||(J.instance=new J),J.instance}initUserChannels(e){if(!_.isOnline){console.warn("[RealtimeService] Offline mode: Cannot initialize channels.");return}const t=h;if(!t)return;this.cleanup();const i=t.channel(`profile-${e}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"users",filter:`id=eq.${e}`},c=>this.emit("profile_update",c)).subscribe();this.channels.set(`profile-${e}`,i);const a=t.channel(`notifications-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},c=>{const d=c.new;(d.user_id===e||d.user_id===null)&&this.emit("new_notification",c)}).subscribe();this.channels.set(`notifications-${e}`,a);const r=t.channel(`messages-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},c=>{const d=c.new;(d.recipient_id===e||d.channel==="global")&&this.emit("new_message",c)}).subscribe();this.channels.set(`messages-${e}`,r);const n=t.channel(`rewards-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"rewards",filter:`user_id=eq.${e}`},c=>this.emit("new_reward",c)).subscribe();this.channels.set(`rewards-${e}`,n);const o=t.channel(`session-${e}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_sessions",filter:`user_id=eq.${e}`},c=>this.emit("session_update",c)).subscribe();this.channels.set(`session-${e}`,o);const l=t.channel("leaderboard").on("postgres_changes",{event:"UPDATE",schema:"public",table:"leaderboard_entries"},c=>this.emit("leaderboard_update",c)).subscribe();this.channels.set("leaderboard",l),console.log(`[RealtimeService] Channels initialized for user ${e}`)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t)}off(e,t){if(t){const i=this.listeners.get(e);i&&(i.delete(t),i.size===0&&this.listeners.delete(e))}else this.listeners.delete(e)}emit(e,t){const i=this.listeners.get(e);i&&i.forEach(a=>{try{a(t)}catch(r){console.error(`[RealtimeService] Error executing listener for event ${e}:`,r)}})}cleanup(){const e=h;this.channels.forEach(t=>{e&&e.removeChannel(t)}),this.channels.clear(),this.listeners.clear(),console.log("[RealtimeService] Cleaned up all channels and listeners.")}}class at{_uiManager;_audioManager;_saveManager;_onClose;_activeTab="daily";_previousRank=null;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onClose=a}async render(){const e=this._uiManager.container;e.innerHTML=S.LoadingState(s.currentLocale==="am"?"ደረጃዎችን በማስገባት ላይ...":s.currentLocale==="om"?"Sadarkaa fe'aa jira...":"Loading rankings...");const t=this._saveManager.profile,i=C.getDivision(t.xp);let a=[];this._activeTab==="daily"?a=await H.getInstance().getLeaderboard(void 0,"daily"):a=(await(await pe(async()=>{const{TournamentService:u}=await import("./TournamentService-DcYfsBlB.js");return{TournamentService:u}},__vite__mapDeps([0,1]))).TournamentService.getInstance().getLeaderboard(this._activeTab)).map(u=>({userId:u.userId,username:u.username,score:u.score,matchesPlayed:u.matchesPlayed}));const r=a.map(y=>{const v=y.username===t.username,f=/^\\+?[0-9]{9,}$/.test((y.username||"").replace(/[^0-9+]/g,""))?this._maskPhone(y.username):y.username||(s.currentLocale==="am"?"ያልታወቀ":s.currentLocale==="om"?"Namummaa Hin Beekamne":"Anonymous"),b=y.score||0,w=y.eloRating||0,M=C.getDivision(b);return{msisdn:f,score:b,eloRating:w,points:b,league:M.name,isMe:v}});r.sort((y,v)=>v.score-y.score);const n=r[0],o=r[1],l=r[2],c=r.slice(3),d=y=>{const v=this._activeTab===y;return`
                flex: 1;
                padding: 10px 4px;
                border-radius: 8px;
                border: 1px solid ${v?"var(--fds-gold-primary)":"rgba(255,255,255,0.1)"};
                background: ${v?"rgba(255,215,0,0.15)":"rgba(15,23,42,0.6)"};
                color: ${v?"var(--fds-gold-primary)":"#94A3B8"};
                font-weight: 800;
                font-size: var(--fds-font-xs);
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `},g=r.findIndex(y=>y.isMe),m=g!==-1?g+1:"--";let x="";if(this._previousRank!==null&&m!=="--"&&this._previousRank!=="--"){const y=this._previousRank-m;y>0?x=`<span class="rank-diff-anim rank-diff-up">▲ +${y} Positions</span>`:y<0&&(x=`<span class="rank-diff-anim rank-diff-down">▼ ${y} Positions</span>`)}this._previousRank=m,e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; padding-bottom: 60px; overflow-y: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- STADIUM LIGHT BEAMS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>

                <!-- TOP BAR -->
                ${k.render(s.currentLocale==="am"?"ደረጃ":s.currentLocale==="om"?"SADARKAA":"RANK","",!1)}

                <div style="max-width: 900px; margin: 0 auto; padding: 16px;">
                    
                    <!-- PERIOD TABS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;" class="fade-in-up">
                        <button class="lb-tab-btn" data-tab="daily" style="${d("daily")}">${s.currentLocale==="am"?"ዕለታዊ":s.currentLocale==="om"?"GUYYAA":"DAILY"}</button>
                        <button class="lb-tab-btn" data-tab="weekly" style="${d("weekly")}">${s.currentLocale==="am"?"ሳምንታዊ":s.currentLocale==="om"?"TORBEE":"WEEKLY"}</button>
                        <button class="lb-tab-btn" data-tab="monthly" style="${d("monthly")}">${s.currentLocale==="am"?"ወርሃዊ":s.currentLocale==="om"?"JI'A":"MONTHLY"}</button>
                    </div>

                    <!-- 1. PODIUM CARDS (TOP 3 CHAMPIONS) -->
                    ${r.length===0?S.EmptyState("🏆",s.currentLocale==="am"?"እስካሁን የተሰለፈ ተጫዋች የለም።":s.currentLocale==="om"?"Hamma ammaatti taphataan sadarkaa qabate hin jiru.":"No players ranked yet."):`
                    <div style="display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 12px; align-items: end; margin-bottom: 24px; text-align: center;" class="fade-in-up">
                        
                        <!-- 2ND PLACE PODIUM (SILVER) -->
                        ${o?`
                        <div class="glass-card" style="padding: 16px 8px; border-color: #C0C0C0; background: linear-gradient(180deg, rgba(192,192,192,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥈</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #E2E8F0; text-transform: uppercase;">${s.currentLocale==="am"?"2ኛ":s.currentLocale==="om"?"2FFAA":"2ND"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${o.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-blue-accent); margin-top: 2px;">${o.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${o.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}

                        <!-- 1ST PLACE PODIUM (GOLD CHAMPION) -->
                        ${n?`
                        <div class="glass-card" style="padding: 20px 8px; border-color: var(--fds-gold-primary); background: linear-gradient(180deg, rgba(255,215,0,0.25) 0%, rgba(15,23,42,0.95) 100%); border-radius: 20px; box-shadow: 0 10px 30px var(--fds-gold-glow); transform: translateY(-8px);">
                            <div style="font-size: 36px; margin-bottom: 4px; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));">🥇</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px;">${s.currentLocale==="am"?"ሻምፒዮን":s.currentLocale==="om"?"CHAAMPIYOONA":"CHAMPION"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${n.msisdn}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary); margin-top: 2px;">${n.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: #FEF08A; margin-top: 2px;">🏆 ${n.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}

                        <!-- 3RD PLACE PODIUM (BRONZE) -->
                        ${l?`
                        <div class="glass-card" style="padding: 16px 8px; border-color: #CD7F32; background: linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥉</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #FDBA74; text-transform: uppercase;">${s.currentLocale==="am"?"3ኛ":s.currentLocale==="om"?"3FFAA":"3RD"}</div>
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
                                <div style="font-size: var(--fds-font-xs); color: #4ADE80; font-weight: 800; text-transform: uppercase;">${s.currentLocale==="am"?"የእርስዎ የደረጃ ቦታ":s.currentLocale==="om"?"SADARKAA KEE":"YOUR RANK POSITION"}</div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    ${m==="--"?`
                                        <div style="font-size: var(--fds-font-xs); color: rgba(255,255,255,0.7); font-weight: 500; margin-top: 2px;">
                                            Play matches to earn points and secure your rank.
                                        </div>
                                    `:`
                                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">
                                            ${s.currentLocale==="am"?`#${m} በ ${i.name} ሊግ`:s.currentLocale==="om"?`#${m} Liigii ${i.name} Keessatti`:`#${m} In ${i.name} League`}
                                        </div>
                                    `}
                                    ${x}
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
                        ${c.map((y,v)=>{const u=v+4,f=y.isMe;return`
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
                                                ${y.msisdn} ${f?`<span style="background: #22C55E; color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; margin-left: 6px;">${s.currentLocale==="am"?"እርስዎ":s.currentLocale==="om"?"ATI":"YOU"}</span>`:""}
                                            </div>
                                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">${s.currentLocale==="am"?`${y.league} ሊግ`:s.currentLocale==="om"?`Liigii ${y.league}`:`${y.league} League`}</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${y.score} PTS</div>
                                        <div style="font-size: var(--fds-font-xs); color: var(--fds-blue-accent);">${y.points} XP</div>
                                    </div>
                                </div>
                            `}).join("")}
                    </div>
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;k.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".lb-tab-btn").forEach(i=>{i.addEventListener("click",a=>{this._audioManager.playClick();const r=a.currentTarget.getAttribute("data-tab");this._activeTab=r,this.render()})});const t=e.querySelector(".stadium-container");t&&se.attach(t,async()=>{this._audioManager.playClick(),await this.render()})}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")&&(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class B{static instance;listeners=[];unreadCount=0;constructor(){this._initRealtime(),this._fetchUnreadCount()}static getInstance(){return B.instance||(B.instance=new B),B.instance}subscribeToBadgeUpdates(e){return this.listeners.push(e),e(this.unreadCount),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}_notifyListeners(){this.listeners.forEach(e=>e(this.unreadCount))}async _fetchUnreadCount(){if(!h)return;const{data:{user:e}}=await h.auth.getUser();if(!e)return;const{count:t,error:i}=await h.from("messages").select("*",{count:"exact",head:!0}).eq("read",!1).or(`recipient_id.eq.${e.id},channel.eq.global`);!i&&t!==null&&(this.unreadCount=t,this._notifyListeners())}_initRealtime(){h&&h.channel("public:messages").on("postgres_changes",{event:"*",schema:"public",table:"messages"},()=>{this._fetchUnreadCount()}).subscribe()}getTotalUnreadCount(){return this.unreadCount}_mapRow(e){const t=s.currentLocale;let i=e.body_en;t==="am"&&e.body_am&&(i=e.body_am),t==="om"&&e.body_om&&(i=e.body_om);let a="Message";return e.channel==="global"?a="Announcement":e.channel==="system"?a="System Update":e.channel==="direct"&&(a="Direct Message"),{id:e.id,title:a,content:i,category:e.channel,priority:e.channel==="global"?"High":"Normal",createdAt:e.created_at,read:e.read}}async _fetchByChannel(e){if(!h)return[];const{data:{user:t}}=await h.auth.getUser();let i=h.from("messages").select("*").eq("channel",e).order("created_at",{ascending:!1}).limit(50);if(e==="direct"||e==="system"){if(!t)return[];i=i.eq("recipient_id",t.id)}const{data:a,error:r}=await i;return r||!a?[]:a.map(n=>this._mapRow(n))}async getAllMessages(){if(!h)return[];const{data:{user:e}}=await h.auth.getUser();let t=h.from("messages").select("*").order("created_at",{ascending:!1}).limit(100);e?t=t.or(`recipient_id.eq.${e.id},channel.eq.global`):t=t.eq("channel","global");const{data:i,error:a}=await t;return a||!i?[]:i.map(r=>this._mapRow(r))}async getAnnouncements(){return this._fetchByChannel("global")}async getPersonalMessages(){return this._fetchByChannel("direct")}async getSupportTickets(){return this._fetchByChannel("system")}async markAsRead(e){if(!h)return;const{error:t}=await h.from("messages").update({read:!0}).eq("id",e);t||this._fetchUnreadCount()}}class L{static renderCard(e,t){return`
            <div class="ethio-profile-group">
                ${t?`<div class="ethio-profile-group-title">${t}</div>`:""}
                <div class="ethio-profile-card">
                    ${e}
                </div>
            </div>
        `}static renderNavRow(e,t,i,a,r=!0,n,o=!1){return`
            <div class="ethio-nav-row profile-menu-tile" data-action="${i}" style="${o?"border-bottom: none;":""}">
                <div class="ethio-nav-icon">
                    ${e}
                </div>
                <div class="ethio-nav-content">
                    <div class="ethio-nav-title">${t}</div>
                    ${a?`<div class="ethio-nav-desc">${a}</div>`:""}
                </div>
                ${n?`<div id="${n}" class="ethio-nav-badge" style="display: none;"></div>`:""}
                ${r?'<div class="ethio-nav-chevron">❯</div>':""}
            </div>
        `}static renderButton(e,t,i="primary",a){return`
            <button id="${e}" class="ethio-profile-btn ethio-profile-btn-${i}">
                ${a?`<span style="margin-right: 8px;">${a}</span>`:""}
                ${t}
            </button>
        `}}class nt{_uiManager;_saveManager;_audioManager;_callbacks;_unsubscribeBadge=null;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._callbacks=a,this._unsubscribeBadge=B.getInstance().subscribeToBadgeUpdates(()=>{const r=document.getElementById("profile-msg-badge");if(r){const n=B.getInstance().getTotalUnreadCount();n>0?(r.innerText=n>99?"99+":n.toString(),r.style.display="inline-block"):r.style.display="none"}})}destroy(){this._unsubscribeBadge&&this._unsubscribeBadge()}render(){const e=this._uiManager.container;e.innerHTML=S.SkeletonProfile(),setTimeout(()=>{this._renderActual()},300)}_renderActual(){const e=this._uiManager.container,t=this._saveManager.profile,i=C.getDivision(t.xp);e.innerHTML=`
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
                    <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">
                        ${t.username}
                    </div>
                    <div style="font-size: var(--fds-font-sm); font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 16px; font-family: var(--tv-mono);">
                        ${t.phone?this._maskPhone(t.phone):"GUEST_PLAYER"}
                    </div>
                </div>

                <!-- PLAYER PERFORMANCE -->
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
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${s.currentLocale==="am"?"ሊግ":s.currentLocale==="om"?"LIIGII":"LEAGUE"}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${i.color};">${i.name}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${s.currentLocale==="am"?"ደረጃ":s.currentLocale==="om"?"SADARKAA":"RANK"}</div>
                        <div id="profile-daily-rank" style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">--</div>
                    </div>
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 4px; text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);">${s.currentLocale==="am"?"ነጥቦች":s.currentLocale==="om"?"QABXII":"POINTS"}</div>
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--tv-gold-primary); text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);">${t.xp} XP</div>
                    </div>
                </div>

                <!-- PROFILE ACTIONS -->
                <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    ${L.renderCard(`
                        ${L.renderNavRow("📊",s.currentLocale==="am"?"ስታቲስቲክስ":"Statistics","stats")}
                        ${L.renderNavRow("🏆",s.currentLocale==="am"?"ስኬቶች":"Achievements","achievements")}
                        ${L.renderNavRow("🏅",s.currentLocale==="am"?"የእኔ ሽልማቶች":"My Awards","awards")}
                        ${L.renderNavRow("📈",s.currentLocale==="am"?"የመሪዎች ሰሌዳ":"Leaderboard","leaderboard","",!0,"",!0)}
                    `,"PERFORMANCE")}

                    ${L.renderCard(`
                        ${L.renderNavRow("👤",s.currentLocale==="am"?"ማንነት":"Identity","identity")}
                        ${L.renderNavRow("👥",s.currentLocale==="am"?"ጓደኞችን ይጋብዙ":"Invite Friends","invite")}
                        ${L.renderNavRow("💬",s.currentLocale==="am"?"መልዕክቶች":"Messages","messages","",!0,"profile-msg-badge",!0)}
                    `,"ACCOUNT")}

                    ${L.renderCard(`
                        ${L.renderNavRow("⭐",s.currentLocale==="am"?"ምዝገባ":"Subscription","subscription")}
                        ${L.renderNavRow("⚙️",s.currentLocale==="am"?"ቅንብሮች":"Settings","settings")}
                        ${L.renderNavRow("❓",s.currentLocale==="am"?"እገዛ እና ድጋፍ":"Help & Support","help","",!0,"",!0)}
                    `,"SERVICE")}

                    ${L.renderCard(`
                        ${L.renderNavRow("ℹ️",s.currentLocale==="am"?"ስለ እኛ":"About","about")}
                        ${L.renderNavRow("📝",s.currentLocale==="am"?"አዘውትረው የሚጠየቁ ጥያቄዎች":"FAQ","faq")}
                        ${L.renderNavRow("📜",s.currentLocale==="am"?"ደንቦች እና ሁኔታዎች":"Terms & Conditions","terms","",!0,"",!0)}
                    `,"INFORMATION")}
                    
                    ${L.renderCard(`
                        ${L.renderNavRow("🚪",s.currentLocale==="am"?"ውጣ":"Log Out","logout","",!1,"",!0)}
                    `,"SESSION")}

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
        `,this._bindEvents();const a=B.getInstance().getTotalUnreadCount(),r=document.getElementById("profile-msg-badge");r&&(a>0?(r.innerText=a>99?"99+":a.toString(),r.style.display="inline-block"):r.style.display="none"),H.getInstance().getMyDailyStats().then(n=>{const o=document.getElementById("profile-daily-rank");o&&(o.textContent=n?`#${n.rank}`:"Unranked")}).catch(()=>{const n=document.getElementById("profile-daily-rank");n&&(n.textContent="Unranked")})}_bindEvents(){const e=this._uiManager.container,t=document.getElementById("profile-action-modal"),i=document.getElementById("prof-modal-content"),a=document.getElementById("btn-close-prof-modal"),r=l=>{t&&i&&(i.innerHTML=l,t.style.display="flex")};a?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")}),e.querySelectorAll(".profile-menu-tile").forEach(l=>{l.addEventListener("click",c=>{const g=c.currentTarget.getAttribute("data-action");if(g)switch(this._audioManager.playClick(),g){case"stats":this._callbacks.onStatistics();break;case"leaderboard":this._callbacks.onLeaderboard();break;case"subscription":this._callbacks.onSubscription();break;case"messages":this._callbacks.onMessages();break;case"settings":this._callbacks.onSettings();break;case"help":this._callbacks.onHelp();break;case"about":this._callbacks.onAbout();break;case"privacy":this._callbacks.onPrivacy();break;case"terms":this._callbacks.onTerms();break;case"invite":r(`
                            <div style="font-size: 40px; margin-bottom: 12px;">👥</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px; text-transform: uppercase;">${s.currentLocale==="am"?"ጓደኞችን ይጋብዙ":s.currentLocale==="om"?"Hiriyoota Affeeri":"Invite Friends"}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 16px;">${s.currentLocale==="am"?"ጓደኞች ሲጫወቱ ሳንቲሞችን ያግኙ።":s.currentLocale==="om"?"Yoo hiriyoonni taphatan saantima argadhu.":"Earn coins when friends play."}</div>
                            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); font-size: var(--fds-font-xs); color: var(--tv-gold-primary); font-family: monospace; margin-bottom: 16px; word-break: break-all;">https://ethiofantasy.com/join?ref=${this._saveManager.profile.phone||"guest"}</div>
                            ${S.Button({id:"btn-copy-ref",text:s.currentLocale==="am"?"ሊንክ ቅዳ":s.currentLocale==="om"?"LIINKII WARAABBI":"COPY LINK",variant:"primary",fullWidth:!0})}
                        `),document.getElementById("btn-copy-ref")?.addEventListener("click",()=>{this._audioManager.playClick(),navigator.clipboard.writeText(`https://ethiofantasy.com/join?ref=${this._saveManager.profile.phone||"guest"}`);const m=document.getElementById("btn-copy-ref");m&&(m.innerText=s.currentLocale==="am"?"ተቀድቷል ✅":s.currentLocale==="om"?"WARAABAMEERA ✅":"COPIED ✅")});break;case"achievements":this._callbacks.onAchievements();break;case"awards":this._callbacks.onAwards();break;case"identity":r(`
                            <div style="font-size: 40px; margin-bottom: 12px;">👤</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">IDENTITY</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 4px;">Phone: ${this._saveManager.profile.phone||"Guest"}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-muted);">Username: ${this._saveManager.profile.username||"N/A"}</div>
                        `);break;case"faq":this._callbacks.onHelp();break;case"logout":r(`
                            <div style="font-size: 40px; margin-bottom: 12px;">🚪</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-red-live); margin-bottom: 8px;">LOG OUT</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 16px;">Are you sure you want to log out?</div>
                            ${L.renderButton("btn-confirm-logout","CONFIRM LOGOUT","destructive")}
                        `),document.getElementById("btn-confirm-logout")?.addEventListener("click",()=>{this._audioManager.playClick(),localStorage.removeItem("ETHIO_FOOTBALL_AUTH_V2"),window.location.reload()});break}})});const o=e.querySelector(".stadium-container");o&&se.attach(o,async()=>{this._audioManager.playClick(),await this.render()})}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")||(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class Z{static _instance=null;_inQueue=!1;_listeners=new Set;_cdcChannel=null;static getInstance(){return Z._instance||(Z._instance=new Z),Z._instance}async joinQueue(e,t){if(this._inQueue)return{success:!0};if(this._inQueue=!0,_.isOnline&&h){const{data:i,error:a}=await ue.invoke("matchmaking",{userId:e.id,eloRating:e.elo_rating||1200,competitionId:t});return!a&&i&&i.matched&&i.liveMatch?(console.log("[MatchmakingService] Matched instantly via Edge Function."),await this._handleMatchFound(i.liveMatch,e.id),{success:!0}):(this._subscribeToCdc(e.id),{success:!0})}return console.warn("[MatchmakingService] Offline or unavailable. Queueing locally."),{success:!1,error:"Matchmaking is currently unavailable."}}_subscribeToCdc(e){h&&(this._cdcChannel=h.channel("public:live_matches").on("postgres_changes",{event:"INSERT",schema:"public",table:"live_matches"},async t=>{const i=t.new;(i.player_a_id===e||i.player_b_id===e)&&(console.log("[MatchmakingService] Postgres CDC detected live match creation!"),await this._handleMatchFound(i,e))}).subscribe())}async _handleMatchFound(e,t){const i=e.player_a_id===t?e.player_b_id:e.player_a_id;let a={id:i,role:"player",username:"Ethiopian_Rival",phone:null,avatar_url:null,locale:"en",elo_rating:1200,coins:100,xp:50,total_matches:5,total_wins:3,subscription_tier:"free",streak_count:1,streak_last_date:null,created_at:new Date().toISOString(),last_active:new Date().toISOString(),referral_code:null,referred_by:null};if(h){const{data:r}=await h.from("users").select("*").eq("id",i).single();r&&(a=r)}this.leaveQueue(t),this._notifyMatchFound({liveMatchId:e.id,opponent:a,questionIds:e.question_ids||[]})}async leaveQueue(e){if(this._inQueue=!1,this._cdcChannel&&h&&(h.removeChannel(this._cdcChannel),this._cdcChannel=null),_.isOnline&&h)try{await h.from("matchmaking_queue").delete().eq("user_id",e)}catch(t){console.warn("[MatchmakingService] Error leaving queue:",t)}}onMatchFound(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notifyMatchFound(e){this._listeners.forEach(t=>t(e))}get isSearching(){return this._inQueue}}class rt{_uiManager;_audioManager;_saveManager;_onMatchFound;_onCancel;constructor(e,t,i,a,r){this._uiManager=e,this._audioManager=t,this._saveManager=i,this._onMatchFound=a,this._onCancel=r}async render(){const e=this._uiManager.container,t=this._saveManager.profile,i={id:"local-user",role:"player",username:t.username,phone:null,avatar_url:null,locale:"en",elo_rating:t.eloRating||0,coins:t.coins,xp:t.xp,total_matches:10,total_wins:6,subscription_tier:"free",streak_count:t.streakCount||0,streak_last_date:null,created_at:new Date().toISOString(),last_active:new Date().toISOString(),referral_code:null,referred_by:null};e.innerHTML=`
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

                        ${S.Button({id:"cancel-mm-btn",text:"CANCEL MATCHMAKING",icon:"✖",variant:"secondary",fullWidth:!0,className:"cancel-btn-custom"})}
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
        `;const a=Z.getInstance(),r=a.onMatchFound(n=>{this._audioManager.playGoalCheer(),this._onMatchFound(n)});setInterval(()=>{const n=document.getElementById("live-players-count");if(n&&document.body.contains(n)){const l=parseInt(n.innerText.split(" ")[0])+Math.floor(Math.random()*5)-2,c=Math.max(120,Math.min(180,l));n.innerText=`${c} Players in Queue`}},3e3),e.querySelector("#cancel-mm-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),r(),a.leaveQueue(i.id),this._onCancel()}),await a.joinQueue(i)}}class st{constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i}_currentTab="all";_messages=[];_isOpeningMessage=!1;_isLayoutRendered=!1;_currentRequestId=0;async render(){this._isLayoutRendered?this._updateTabUI():(this._renderLayout(),this._bindEvents(),this._isLayoutRendered=!0),await this._updateContent()}_renderLayout(){const e=this._uiManager.container,t=s.currentLocale;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative;">
                
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- App Bar -->
                ${k.render(t==="am"?"መልዕክቶች":t==="om"?"ERGAWWAAN":"Messages")}

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
        `,k.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),this._updateTabUI()}_updateTabUI(){const e=s.currentLocale,t=[{id:"all",label:{en:"All",am:"ሁሉም",om:"Hunda"}},{id:"unread",label:{en:"Unread",am:"ያልተነበቡ",om:"Kan Hin Dubbifamne"}},{id:"global",label:{en:"Announcements",am:"ማስታወቂያዎች",om:"Beeksisa"}},{id:"direct",label:{en:"Inbox",am:"የገቢ መልዕክቶች",om:"Ergaa"}},{id:"system",label:{en:"Support",am:"ድጋፍ",om:"Gargaarsa"}}],i=document.getElementById("mc-tab-bar");if(!i)return;i.innerHTML=t.map(r=>{const n=r.id===this._currentTab,o=r.id==="unread"||r.id==="direct"||r.id==="global"||r.id==="all"?B.getInstance().getTotalUnreadCount():0,l=(r.id==="unread"||r.id==="direct")&&o>0;return n?`
                    <button class="mc-pill-tab ${n?"active-mc-tab":""}" data-tab-id="${r.id}" style="
                        flex: 0 0 auto;
                        padding: 8px 16px;
                        border-radius: 12px;
                        border: 1px solid rgba(74, 222, 128, 0.4);
                        background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%);
                        color: white;
                        font-size: var(--fds-font-sm);
                        font-weight: 900;
                        cursor: pointer;
                        white-space: nowrap;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
                    ">
                        ${r.label[e]||r.label.en}
                        ${l?`<span style="background: white; color: var(--fds-green-dark); font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 10px;">${o>99?"99+":o}</span>`:""}
                    </button>
                `:`
                    <button class="mc-pill-tab" data-tab-id="${r.id}" style="
                        flex: 0 0 auto;
                        padding: 8px 16px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.08);
                        background: rgba(15, 23, 42, 0.7);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        color: var(--fds-text-dim);
                        font-size: var(--fds-font-sm);
                        font-weight: 700;
                        cursor: pointer;
                        white-space: nowrap;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        ${r.label[e]||r.label.en}
                        ${l?`<span style="background: rgba(255,255,255,0.1); color: white; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 10px;">${o>99?"99+":o}</span>`:""}
                    </button>
                `}).join(""),i.querySelectorAll(".mc-pill-tab").forEach(r=>{r.addEventListener("click",n=>{this._audioManager.playClick();const o=n.currentTarget.getAttribute("data-tab-id");o&&o!==this._currentTab&&(this._currentTab=o,this._updateTabUI(),this._renderMessages())})})}_bindEvents(){const e=document.getElementById("mc-search-input");e&&e.addEventListener("input",()=>{this._renderMessages()})}async _updateContent(){const e=++this._currentRequestId,t=document.getElementById("mc-list-container");t&&(t.innerHTML=`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                </div>
            `);try{const i=B.getInstance();this._messages=await i.getAllMessages()}catch(i){console.error("Failed to fetch messages",i),this._currentRequestId===e&&t&&(t.innerHTML=`
                    <div style="text-align: center; padding: 40px 16px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                        <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 8px;">Unable to load messages.</div>
                        <button id="mc-btn-retry" class="ethio-profile-btn ethio-profile-btn-primary" style="max-width: 160px;">Retry</button>
                    </div>
                `,document.getElementById("mc-btn-retry")?.addEventListener("click",()=>{this._audioManager.playClick(),this._updateContent()}));return}this._currentRequestId===e&&(this._updateTabUI(),this._renderMessages())}_renderMessages(){const e=document.getElementById("mc-list-container");if(!e)return;const t=document.getElementById("mc-search-input"),i=t?t.value.toLowerCase():"";let a=this._messages.filter(n=>this._currentTab==="all"?!0:this._currentTab==="unread"?!n.read:n.category===this._currentTab);if(i&&(a=a.filter(n=>n.title.toLowerCase().includes(i)||n.content.toLowerCase().includes(i))),a.length===0){i?e.innerHTML=`
                    <div style="text-align: center; padding: 60px 16px; display: flex; flex-direction: column; align-items: center;">
                        <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;">🔍</div>
                        <div style="font-size: 18px; font-weight: 900; color: white;">No messages match your search.</div>
                    </div>
                `:e.innerHTML=`
                    <div style="text-align: center; padding: 60px 16px; display: flex; flex-direction: column; align-items: center;">
                        <div style="font-size: 80px; margin-bottom: 24px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">📬</div>
                        <div style="font-size: 20px; font-weight: 900; color: white; margin-bottom: 8px;">No messages found</div>
                        <div style="color: var(--fds-text-dim); font-size: 14px;">You have no messages in this category.</div>
                    </div>
                `;return}e.innerHTML=a.map(n=>{const o=new Date(n.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),c={global:"📢",direct:"📩",system:"⚙️"}[n.category]||"✉️";return`
                <div class="glass-card mc-item" data-id="${n.id}" style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 16px;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s, background-color 0.2s;
                    border: 1px solid ${n.read?"rgba(255,255,255,0.08)":"rgba(34, 197, 94, 0.4)"};
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: ${n.read?"none":"0 4px 16px rgba(34, 197, 94, 0.1)"};
                    align-items: center;
                ">
                    <!-- Category Icon -->
                    <div style="
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                        background: ${n.read?"rgba(255,255,255,0.05)":"rgba(34, 197, 94, 0.1)"};
                        border: 1px solid ${n.read?"rgba(255,255,255,0.1)":"rgba(34, 197, 94, 0.3)"};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        flex-shrink: 0;
                        position: relative;
                    ">
                        ${c}
                        ${n.read?"":`
                            <div style="
                                position: absolute;
                                top: -4px;
                                right: -4px;
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                background-color: var(--tv-pitch-green);
                                border: 2px solid rgba(15, 23, 42, 1);
                                box-shadow: 0 0 8px var(--tv-pitch-glow);
                            "></div>
                        `}
                    </div>

                    <!-- Texts -->
                    <div style="flex: 1; padding-right: 8px; min-width: 0;">
                        <div style="
                            font-size: 15px; 
                            font-weight: 900; 
                            color: white;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${n.title}</div>
                        <div style="
                            font-size: 13px; 
                            color: var(--fds-text-dim); 
                            line-height: 1.4;
                            margin-bottom: 6px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${n.content}</div>
                        <div style="
                            font-size: 11px; 
                            color: var(--fds-text-muted); 
                            font-weight: 700;
                            text-transform: uppercase;
                        ">${o}</div>
                    </div>

                    <!-- Chevron -->
                    <div style="color: rgba(255,255,255,0.2); flex-shrink: 0;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </div>
                </div>
            `}).join(""),e.querySelectorAll(".mc-item").forEach(n=>{n.addEventListener("click",async o=>{if(this._isOpeningMessage)return;const l=o.currentTarget.getAttribute("data-id");if(l){this._isOpeningMessage=!0,this._audioManager.playClick();try{const c=this._messages.find(d=>d.id===l);c&&!c.read&&(await B.getInstance().markAsRead(l),c.read=!0),this._showFullMessage(l)}finally{this._isOpeningMessage=!1}}})})}_showFullMessage(e){const t=this._messages.find(n=>n.id===e);if(!t)return;const i=new Date(t.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=new Date(t.createdAt).toLocaleDateString(),r=document.createElement("div");r.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
            z-index: 10000; display: flex; align-items: flex-end; justify-content: center;
            animation: fade-in 0.2s ease-out;
        `,r.innerHTML=`
            <div style="
                width: 100%; max-width: 600px; 
                background: rgba(15,23,42,0.95);
                backdrop-filter: blur(12px);
                border-radius: 24px 24px 0 0;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding: 24px;
                box-sizing: border-box;
                animation: slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 -8px 32px rgba(0,0,0,0.5);
            ">
                <div style="width: 48px; height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; margin: 0 auto 24px auto;"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                    <div style="flex: 1; padding-right: 16px;">
                        <div style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px; line-height: 1.2;">${t.title}</div>
                        <div style="font-size: 12px; color: var(--tv-gold-primary); font-weight: 800; text-transform: uppercase;">
                            ${t.category} • ${a} ${i}
                        </div>
                    </div>
                    <button id="btn-close-msg" style="
                        background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); width: 36px; height: 36px;
                        border-radius: 18px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
                    ">✕</button>
                </div>

                <div style="
                    flex: 1; overflow-y: auto; 
                    font-size: 15px; color: #CBD5E1; line-height: 1.6;
                    padding-right: 8px; margin-bottom: 24px;
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
        `,document.body.appendChild(r),r.querySelector("#btn-close-msg")?.addEventListener("click",()=>{this._audioManager.playClick(),r.remove(),this._renderMessages()})}}class ot{_channel=null;_cdcChannel=null;_matchId;_listeners=new Set;constructor(e){this._matchId=e}get matchId(){return this._matchId}connect(){if(!_.isOnline||!h){console.log(`[LiveMatchClient] Offline mode — simulated channel for ${this._matchId}`);return}this._channel=h.channel(`live_match:${this._matchId}`,{config:{broadcast:{self:!0}}}),this._channel.on("broadcast",{event:"match_event"},e=>{const t=e.payload;this._notify(t)}).subscribe(),this._cdcChannel=h.channel(`public:live_match_answers:${this._matchId}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"live_match_answers",filter:`live_match_id=eq.${this._matchId}`},e=>{const t=e.new;console.log("[LiveMatchClient] Postgres CDC answer insert detected:",t),this._notify({event:"ANSWER_SUBMITTED",userId:t.user_id,questionIndex:t.question_index,isCorrect:t.is_correct})}).subscribe()}async sendAnswer(e,t,i,a){const r={event:"ANSWER_SUBMITTED",userId:e,questionIndex:t,score:a,isCorrect:i};this._channel&&this._channel.send({type:"broadcast",event:"match_event",payload:r}),this._notify(r),_.isOnline&&await ue.invoke("live-match",{liveMatchId:this._matchId,userId:e,questionIndex:t,selectedIndex:i?0:1,responseTimeMs:1500})}sendFinishMatch(e,t){const i={event:"MATCH_FINISH",userId:e,score:t};this._channel&&this._channel.send({type:"broadcast",event:"match_event",payload:i}),this._notify(i)}onEvent(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(e){this._listeners.forEach(t=>t(e))}disconnect(){this._channel&&h&&(h.removeChannel(this._channel),this._channel=null),this._cdcChannel&&h&&(h.removeChannel(this._cdcChannel),this._cdcChannel=null),this._listeners.clear()}}class de{static DEFAULT_K_FACTOR=32;static calculateExpectedScore(e,t){return 1/(1+Math.pow(10,(t-e)/400))}static calculateNewRatings(e,t,i,a=de.DEFAULT_K_FACTOR){const r=de.calculateExpectedScore(e,t),n=1-r,o=1-i,l=Math.round(a*(i-r)),c=Math.round(a*(o-n)),d=Math.max(100,e+l),g=Math.max(100,t+c);return{winnerNewElo:d,loserNewElo:g,winnerEloChange:l,loserEloChange:c}}}class lt{_uiManager;_audioManager;_saveManager;_opponent;_questions;_onComplete;_client;_currentIndex=0;_myScore=0;_opponentScore=0;_timerInterval=null;_timeLeftSec=10;_hasPlayedFullTimeWhistle=!1;_answers=[];constructor(e,t,i,a,r,n,o){this._uiManager=e,this._audioManager=t,this._saveManager=i,this._opponent=r,this._questions=n,this._onComplete=o,this._client=new ot(a)}startMatch(){this._client.connect(),this._client.onEvent(e=>{if(e.userId===this._opponent.id&&e.event==="ANSWER_SUBMITTED"&&e.score!==void 0){this._opponentScore=e.score;const t=document.getElementById("opponent-score");t&&(t.innerText=`${this._opponentScore}`)}}),this.render()}render(){const e=this._uiManager.container,t=this._saveManager.profile,i=this._questions[this._currentIndex];if(!i){this._showFinalResults();return}const a=s.currentLocale==="am"?i.promptAm||i.promptEn||i.prompt:s.currentLocale==="om"?i.promptOm||i.promptEn||i.prompt:i.promptEn||i.prompt,r=s.currentLocale==="am"?i.optionsAm&&i.optionsAm.length===i.options.length?i.optionsAm:i.options:s.currentLocale==="om"?i.optionsOm&&i.optionsOm.length===i.options.length?i.optionsOm:i.options:i.optionsEn&&i.optionsEn.length===i.options.length?i.optionsEn:i.options;e.innerHTML=`
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
                        <span style="background: #EF4444; color: var(--fds-text-main); font-size: var(--fds-font-xs); font-weight: 900; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">${s.currentLocale==="am"?"ቀጥታ 1v1":s.currentLocale==="om"?"KALLATTII 1v1":"LIVE 1v1"}</span>
                        <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${s.currentLocale==="am"?`ዙር ${this._currentIndex+1} ከ ${this._questions.length}`:s.currentLocale==="om"?`MARSAA ${this._currentIndex+1} / ${this._questions.length}`:`ROUND ${this._currentIndex+1} OF ${this._questions.length}`}</div>
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
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${s.currentLocale==="am"?"እርስዎ":s.currentLocale==="om"?"ISIN":"YOU"}</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">${t.username}</div>
                        <div id="my-score" style="font-size: 24px; font-weight: 900; color: var(--tv-pitch-green);">${this._myScore}</div>
                    </div>
                    <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-red-live); background: rgba(239,68,68,0.15); padding: 8px 16px; border-radius: 20px;">VS</div>
                    <div style="text-align: right;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${s.currentLocale==="am"?"ተፎካካሪ":s.currentLocale==="om"?"DORMAA":"OPPONENT"}</div>
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
                        ${r.map((n,o)=>`
                            <button class="live-option-btn anim-a-card" data-index="${o}" style="
                                animation-delay: ${180+o*30}ms;
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
                                ">${String.fromCharCode(65+o)}</span>
                                <span style="flex: 1;">${n}</span>
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
        `,setTimeout(()=>{this._audioManager.playQuestionArrive()},80),this._startTimer(),this._bindEvents(i),setTimeout(()=>{const n=document.getElementById("live-answers-grid");n&&(n.style.pointerEvents="auto")},420)}_startTimer(){this._stopTimer(),this._timeLeftSec=10;const e=document.getElementById("live-timer-bar");this._timerInterval=setInterval(()=>{if(this._timeLeftSec--,e){const t=this._timeLeftSec/10*100;e.style.width=t+"%",this._timeLeftSec<=5&&(e.style.backgroundColor="#EF4444",this._audioManager.playCountdownWarning())}this._timeLeftSec<=0&&(this._stopTimer(),this._handleTimeOut())},1e3)}_stopTimer(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)}_bindEvents(e){document.querySelectorAll(".live-option-btn").forEach(a=>{a.addEventListener("click",r=>{const n=r.currentTarget;this._audioManager.playAnswerSelected(),this._stopTimer(),document.querySelectorAll(".live-option-btn").forEach(c=>c.disabled=!0);const l=parseInt(n.getAttribute("data-index")||"0");this._onOptionSelected(l,n,e)})});const i=document.getElementById("live-exit-btn");i&&i.addEventListener("click",()=>{this._audioManager.playClick(),this._client.disconnect(),this._stopTimer(),this._onComplete()})}_onOptionSelected(e,t,i){const a=e===i.correctIndex,r=document.querySelectorAll(".live-option-btn"),n=(10-this._timeLeftSec)*1e3;this._answers.push({questionId:i.id,selectedIndex:e,responseTimeMs:n});const o=this._currentIndex===this._questions.length-1;if(a){t.classList.add("correct"),this._audioManager.playCorrectAnswerGoal(o?400:void 0);const g=100+Math.floor(this._timeLeftSec/10*50);this._myScore+=g;const m=document.getElementById("my-score");m&&(m.innerText=String(this._myScore)),this._showFeedbackOverlay(!0)}else{if(t.classList.add("wrong"),i.correctIndex!==void 0){const d=r[i.correctIndex];d&&d.classList.add("correct")}this._audioManager.playWrongAnswer(o?400:void 0),this._showFeedbackOverlay(!1)}const l=this._saveManager.cloudUserId||"local-user";this._client.sendAnswer(l,this._currentIndex,a,this._myScore),setTimeout(()=>{this._hideFeedbackOverlay(),this._currentIndex++,this.render()},o?400:1500)}_showFeedbackOverlay(e){const t=document.getElementById("live-feedback-overlay"),i=document.getElementById("live-feedback-icon"),a=document.getElementById("live-feedback-text");t&&i&&a&&(t.style.borderColor=e?"var(--tv-pitch-green)":"#EF4444",t.style.boxShadow=e?"0 10px 40px rgba(34,197,94,0.3)":"0 10px 40px rgba(239,68,68,0.3)",t.style.color=e?"var(--tv-pitch-green)":"#EF4444",i.innerText=e?"⚽":"🧤",a.innerText=e?s.currentLocale==="am"?"ግብ!!!!!":s.currentLocale==="om"?"GALCHII!!!!!":"GOAL!!!!!":s.currentLocale==="am"?"ግብ ተከለከለ!":s.currentLocale==="om"?"GALCHII QABAME!":"GOAL SAVED!",t.style.opacity="1",t.style.transform="translateX(-50%) scale(1)")}_hideFeedbackOverlay(){const e=document.getElementById("live-feedback-overlay");e&&(e.style.pointerEvents="none",e.style.opacity="0",e.style.transform="translateX(-50%) scale(0.9)")}_handleTimeOut(){const e=this._questions[this._currentIndex];this._answers.push({questionId:e.id,selectedIndex:-1,responseTimeMs:1e4});const t=this._saveManager.cloudUserId||"local-user";this._client.sendAnswer(t,this._currentIndex,!1,this._myScore),this._audioManager.playWhistle();const i=document.querySelectorAll(".live-option-btn");if(e.correctIndex!==void 0){const n=i[e.correctIndex];n&&n.classList.add("correct")}const r=this._currentIndex===this._questions.length-1?400:1200;setTimeout(()=>{this._currentIndex++,this.render()},r)}_showFinalResults(){this._hasPlayedFullTimeWhistle||(this._hasPlayedFullTimeWhistle=!0,this._audioManager.playFullTimeWhistle());const e=this._uiManager.container,t=this._saveManager.profile.eloRating||0,i=this._myScore>this._opponentScore,a=this._myScore===this._opponentScore,r=de.calculateNewRatings(t,this._opponent.elo_rating,i?1:a?.5:0);this._saveManager.profile.eloRating=r.winnerNewElo,this._saveManager.addCoins(i?300:100),this._submitToBackend(),e.innerHTML=`
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
                        ${i?s.currentLocale==="am"?"ድል":s.currentLocale==="om"?"INJIFANNOO":"VICTORY":a?s.currentLocale==="am"?"አቻ":s.currentLocale==="om"?"QIXAA":"DRAW":s.currentLocale==="am"?"ሽነፋ":s.currentLocale==="om"?"MO'AMUU":"DEFEAT"}
                    </div>
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-dim); margin-bottom: 32px;">
                        ${s.currentLocale==="am"?"የመጨረሻ ውጤት":s.currentLocale==="om"?"FIIXAAN GA'II":"FINAL SCORE"}: ${this._myScore} - ${this._opponentScore}
                    </div>

                    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${s.currentLocale==="am"?"ደረጃ":s.currentLocale==="om"?"SADARKAA":"RATING"}</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">
                                ${r.winnerNewElo} <span style="font-size: var(--fds-font-xs);">(${r.winnerEloChange>=0?"+":""}${r.winnerEloChange})</span>
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${s.currentLocale==="am"?"ሳንቲሞች":s.currentLocale==="om"?"SANTIMA":"COINS"}</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--tv-gold-primary);">
                                +${i?300:100}
                            </div>
                        </div>
                    </div>

                    ${S.Button({id:"live-finish-btn",text:s.currentLocale==="am"?"ወደ ሊግ ማዕከል ተመለስ":s.currentLocale==="om"?"GARA WALTOMMII LIIGII DEEBI'I":"RETURN TO LEAGUE HUB",variant:"primary",fullWidth:!0})}
                </div>
            </div>
            <style>
                #live-finish-btn:active { transform: scale(0.96); }
            </style>
        `,e.querySelector("#live-finish-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),this._onComplete()})}async _submitToBackend(){if(this._saveManager.cloudUserId)try{const{supabase:e}=await pe(async()=>{const{supabase:t}=await Promise.resolve().then(()=>qe);return{supabase:t}},void 0);e&&await e.rpc("submit_match_result",{p_match_type:"live",p_answers:this._answers,p_live_match_id:this._client.matchId})}catch(e){console.warn("[LiveMatchScreen] Failed to submit live match result",e)}}}class E{static _activeTab="home";static _lastCallback=null;static TABS=[{id:"home",label:"Home",icon:"🏠"},{id:"play",label:"Play",icon:"🎮"},{id:"standings",label:"Leaderboard",icon:"🏆"},{id:"profile",label:"Profile",icon:"👤"}];static LABELS={home:{en:"Home",am:"መነሻ",om:"Mula'a"},play:{en:"Play",am:"ተጫወት",om:"Tapha"},standings:{en:"Leaderboard",am:"ደረጃዎች",om:"Sadarkaa"},profile:{en:"Profile",am:"መገለጫ",om:"Profile"}};static get activeTab(){return E._activeTab}static setActiveTab(e){E._activeTab=e,E.updateTabHighlights()}static refresh(){E._lastCallback&&E.render(E._lastCallback)}static render(e){E._lastCallback=e;let t=document.getElementById("fds-bottom-nav");t||(t=document.createElement("div"),t.id="fds-bottom-nav",t.style.position="fixed",t.style.bottom="0",t.style.left="0",t.style.width="100%",t.style.paddingBottom="env(safe-area-inset-bottom, 16px)",t.style.height="calc(64px + env(safe-area-inset-bottom, 16px))",t.style.background="rgba(2, 6, 23, 0.96)",t.style.borderTop="2px solid var(--fds-gold-primary, #FFD700)",t.style.boxShadow="0 -8px 32px rgba(0, 0, 0, 0.85)",t.style.backdropFilter="blur(16px)",t.style.zIndex="9000",t.style.display="flex",t.style.justifyContent="space-around",t.style.alignItems="center",t.style.pointerEvents="auto",document.body.appendChild(t));const i=s.currentLocale;t.innerHTML=E.TABS.map(r=>{const n=r.id===E._activeTab,o=E.LABELS[r.id][i]||r.label;return`
                <button class="nav-tab-item ${n?"nav-tab-active":""}" data-tab-id="${r.id}" style="
                    background: none;
                    border: none;
                    color: ${n?"var(--fds-gold-primary, #FFD700)":"#94A3B8"};
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
                    transform: ${n?"scale(1.1)":"scale(1)"};
                    filter: ${n?"drop-shadow(0 2px 8px rgba(255,215,0,0.4))":"none"};
                ">
                    <div style="position: relative; display: inline-block;">
                        <span style="font-size: 20px; margin-bottom: 2px;">${r.icon}</span>
                        <div id="nav-badge-${r.id}" style="
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
                        font-weight: ${n?"800":"600"};
                        letter-spacing: 0.5px;
                        font-family: var(--fds-font-body);
                    ">${o}</span>
                </button>
            `}).join(""),t.querySelectorAll(".nav-tab-item").forEach(r=>{r.addEventListener("click",n=>{const l=n.currentTarget.getAttribute("data-tab-id");if(localStorage.getItem("ETHIO_FOOTBALL_MUTED")!=="true"&&typeof navigator<"u"&&navigator.vibrate)try{navigator.vibrate(10)}catch{}typeof window.ethioOnBackPress=="function"&&window.ethioOnBackPress()||l&&(l!==E._activeTab&&E.setActiveTab(l),e(l))})})}static updateTabHighlights(){const e=document.getElementById("fds-bottom-nav");if(!e)return;e.querySelectorAll(".nav-tab-item").forEach(i=>{const r=i.getAttribute("data-tab-id")===E._activeTab,n=i;n.style.color=r?"var(--fds-gold-primary, #FFD700)":"#94A3B8",n.style.transform=r?"scale(1.1)":"scale(1)",n.style.filter=r?"drop-shadow(0 2px 8px rgba(255,215,0,0.4))":"none";const o=n.querySelector(".tab-text");o&&(o.style.fontWeight=r?"800":"600")})}static setBadge(e,t){const i=document.getElementById(`nav-badge-${e}`);i&&(t>0?(i.innerText=t>99?"99+":t.toString(),i.style.display="block"):i.style.display="none")}static hide(){const e=document.getElementById("fds-bottom-nav");e&&(e.style.display="none")}static show(){const e=document.getElementById("fds-bottom-nav");e&&(e.style.display="flex")}}class j{static _instance=null;_profileCache=null;_preferencesCache=null;constructor(){}static getInstance(){return j._instance||(j._instance=new j),j._instance}async getProfile(){if(!_.isOnline)return null;const e=h;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("users").select("*").eq("id",t.id).single();return a?(console.warn("[ProfileService] Error fetching profile:",a),null):(this._profileCache=i,i)}catch(t){return console.warn("[ProfileService] Failed to get profile:",t),null}}async updateProfile(e){if(!_.isOnline)return;const t=h;if(t)try{const{data:{user:i}}=await t.auth.getUser();if(!i)return;const{error:a}=await t.from("users").update(e).eq("id",i.id);a?console.warn("[ProfileService] Error updating profile:",a):this._profileCache&&(this._profileCache={...this._profileCache,...e})}catch(i){console.warn("[ProfileService] Failed to update profile:",i)}}async getPreferences(){if(!_.isOnline)return null;const e=h;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("user_preferences").select("*").eq("user_id",t.id).single();return a?(console.warn("[ProfileService] Error fetching preferences:",a),null):(this._preferencesCache=i,i)}catch(t){return console.warn("[ProfileService] Failed to get preferences:",t),null}}async updatePreferences(e){if(!_.isOnline)return;const t=h;if(t)try{const{data:{user:i}}=await t.auth.getUser();if(!i)return;const{error:a}=await t.from("user_preferences").update(e).eq("user_id",i.id);a?console.warn("[ProfileService] Error updating preferences:",a):this._preferencesCache&&(this._preferencesCache={...this._preferencesCache,...e})}catch(i){console.warn("[ProfileService] Failed to update preferences:",i)}}async getEarnedAchievements(){if(!_.isOnline)return[];const e=h;if(!e)return[];try{const{data:{user:t}}=await e.auth.getUser();if(!t)return[];const{data:i,error:a}=await e.from("user_achievements").select("achievement_id, earned_at, achievements:achievements (*)").eq("user_id",t.id);return a?(console.warn("[ProfileService] Error fetching user achievements:",a),[]):i||[]}catch(t){return console.warn("[ProfileService] Failed to get user achievements:",t),[]}}async getRewards(){if(!_.isOnline)return[];const e=h;if(!e)return[];try{const{data:{user:t}}=await e.auth.getUser();if(!t)return[];const{data:i,error:a}=await e.from("rewards").select("*").eq("user_id",t.id);return a?(console.warn("[ProfileService] Error fetching user rewards:",a),[]):i||[]}catch(t){return console.warn("[ProfileService] Failed to get rewards:",t),[]}}subscribeToProfileChanges(e){if(!_.isOnline)return()=>{};const t=h;if(!t)return()=>{};let i=null;return t.auth.getUser().then(({data:{user:a}})=>{if(!a)return;const r=h;r&&(i=r.channel(`public:users:id=eq.${a.id}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"users",filter:`id=eq.${a.id}`},n=>{this._profileCache=n.new,e(this._profileCache)}).subscribe())}),()=>{const a=h;i&&a&&a.removeChannel(i)}}}class ee{static _instance=null;constructor(){}static getInstance(){return ee._instance||(ee._instance=new ee),ee._instance}async getCategories(){if(!_.isOnline)return[];const e=h;if(!e)return[];try{const{data:t,error:i}=await e.from("faq_items").select("category");return i?(console.warn("[FAQService] Error fetching FAQ categories:",i),[]):t?Array.from(new Set(t.map(r=>r.category))):[]}catch(t){return console.warn("[FAQService] Failed to get FAQ categories:",t),[]}}async getFAQsByCategory(e){if(!_.isOnline)return[];const t=h;if(!t)return[];try{const{data:i,error:a}=await t.from("faq_items").select("*").eq("category",e).order("sort_order",{ascending:!0});return a?(console.warn("[FAQService] Error fetching FAQs by category:",a),[]):i||[]}catch(i){return console.warn("[FAQService] Failed to get FAQs by category:",i),[]}}async searchFAQs(e){if(!_.isOnline)return[];const t=h;if(!t)return[];if(!e||e.trim()==="")return[];try{const{data:i,error:a}=await t.from("faq_items").select("*").or(`question_en.ilike.%${e}%,answer_en.ilike.%${e}%`).order("sort_order",{ascending:!0});return a?(console.warn("[FAQService] Error searching FAQs:",a),[]):i||[]}catch(i){return console.warn("[FAQService] Failed to search FAQs:",i),[]}}}class te{static instance;constructor(){}static getInstance(){return te.instance||(te.instance=new te),te.instance}async createTicket(e,t,i){if(!_.isOnline)return console.warn("[SupportService] Offline mode: cannot create ticket."),{ticketId:"",success:!1};const a=h;if(!a)return{ticketId:"",success:!1};try{const{data:{user:r},error:n}=await a.auth.getUser();if(n||!r)return console.error("[SupportService] Auth error or user not found:",n),{ticketId:"",success:!1};const{data:o,error:l}=await a.from("support_tickets").insert({user_id:r.id,category:e,message:t,subject:i||null,status:"open"}).select("id").single();return l?(console.error("[SupportService] Failed to create ticket:",l),{ticketId:"",success:!1}):{ticketId:o.id,success:!0}}catch(r){return console.error("[SupportService] Error creating ticket:",r),{ticketId:"",success:!1}}}async getMyTickets(){if(!_.isOnline)return console.warn("[SupportService] Offline mode: returning empty tickets list."),[];const e=h;if(!e)return[];try{const{data:{user:t},error:i}=await e.auth.getUser();if(i||!t)return console.error("[SupportService] Auth error or user not found:",i),[];const{data:a,error:r}=await e.from("support_tickets").select("*").eq("user_id",t.id).order("created_at",{ascending:!1});return r?(console.error("[SupportService] Failed to fetch tickets:",r),[]):a}catch(t){return console.error("[SupportService] Error fetching tickets:",t),[]}}async getTicketById(e){if(!_.isOnline)return console.warn("[SupportService] Offline mode: cannot fetch ticket."),null;const t=h;if(!t)return null;try{const{data:i,error:a}=await t.from("support_tickets").select("*").eq("id",e).single();return a?(console.error(`[SupportService] Failed to fetch ticket with ID ${e}:`,a),null):i}catch(i){return console.error(`[SupportService] Error fetching ticket with ID ${e}:`,i),null}}}class ct{static show(){return new Promise(e=>{const t=document.createElement("div");t.style.cssText=`
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
            `;const i=s.currentLocale==="am"?"ከመለያ መውጣት":s.currentLocale==="om"?"Herrega Keessaa Ba'uu":"Log Out",a=s.currentLocale==="am"?"በእርግጥ ከኢትዮ ፋንታሲ መለያዎ መውጣት ይፈልጋሉ?":s.currentLocale==="om"?"Dhuguma herrega Ethio Fantasy keessaa ba'uu barbaadduu?":"Are you sure you want to log out of your Ethio Fantasy account?",r=s.currentLocale==="am"?"ሰርዝ":s.currentLocale==="om"?"HAQI":"Cancel",n=s.currentLocale==="am"?"ውጣ":s.currentLocale==="om"?"BA'I":"Log Out";t.innerHTML=`
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
                        " onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">${r}</button>
                        
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
                        " onmouseover="this.style.background='rgba(239, 68, 68, 0.05)'" onmouseout="this.style.background='transparent'">${n}</button>
                    </div>
                </div>
            `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1";const l=t.firstElementChild;l&&(l.style.transform="scale(1) translateY(0)")});const o=l=>{t.style.pointerEvents="none",t.style.opacity="0";const c=t.firstElementChild;c&&(c.style.transform="scale(0.95) translateY(10px)"),setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t),e(l)},300)};t.querySelector("#dlg-cancel-btn")?.addEventListener("click",()=>o(!1)),t.querySelector("#dlg-logout-btn")?.addEventListener("click",()=>o(!0))})}}const dt="1.0.0",pt={version:dt};class re{_uiManager;_saveManager;_audioManager;_onBack;_subScreen="main";_defaultSubScreen="main";_settings;_helpCategory=null;_showContactSupportForm=!1;_faqsCache=[];constructor(e,t,i,a,r="main"){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a,this._subScreen=r,this._defaultSubScreen=r,window.ethioOnBackPress=()=>this._subScreen!==this._defaultSubScreen||this._helpCategory||this._showContactSupportForm?(this._audioManager.playClick(),this._goBack(),!0):!1,this._settings=this._getDefaultSettings(),this._loadSettings()}async _loadSettings(){const e=localStorage.getItem("ETHIO_FOOTBALL_SETTINGS_V2");if(e)try{this._settings=JSON.parse(e)}catch{this._settings=this._getDefaultSettings()}else this._settings=this._getDefaultSettings();const t=localStorage.getItem("ETHIO_FOOTBALL_MUTED")==="true";this._settings.soundEffects=!t;const i=await j.getInstance().getPreferences();i&&(this._settings.soundEffects=i.sound_enabled,this._settings.notifications={dailyChallenge:i.notif_daily,tournament:i.notif_tournament,rewards:i.notif_rewards,announcements:i.notif_announcements,subscription:i.notif_subscription,system:i.notif_system},i.sound_enabled&&this._audioManager.isMuted?this._audioManager.toggleMute():!i.sound_enabled&&!this._audioManager.isMuted&&this._audioManager.toggleMute()),this.render()}destroy(){window.ethioOnBackPress=null}_getDefaultSettings(){return{soundEffects:!0,notifications:{dailyChallenge:!0,tournament:!0,rewards:!0,announcements:!0,subscription:!0,system:!0}}}async _saveSettings(){localStorage.setItem("ETHIO_FOOTBALL_SETTINGS_V2",JSON.stringify(this._settings)),localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(!this._settings.soundEffects)),this._settings.soundEffects&&this._audioManager.isMuted?this._audioManager.toggleMute():!this._settings.soundEffects&&!this._audioManager.isMuted&&this._audioManager.toggleMute(),await j.getInstance().updatePreferences({sound_enabled:this._settings.soundEffects,notif_daily:this._settings.notifications.dailyChallenge,notif_tournament:this._settings.notifications.tournament,notif_rewards:this._settings.notifications.rewards,notif_announcements:this._settings.notifications.announcements,notif_subscription:this._settings.notifications.subscription,notif_system:this._settings.notifications.system})}render(){const e=this._uiManager.container;this._subScreen==="main"?this._renderMainScreen(e):this._subScreen==="profile"?this._renderProfileScreen(e,t=>k.render(t)):this._subScreen==="language"?this._renderLanguageScreen(e,t=>k.render(t)):this._subScreen==="notifications"?this._renderNotificationsScreen(e,t=>k.render(t)):this._subScreen==="sound"?this._renderSoundScreen(e,t=>k.render(t)):this._subScreen==="help"?this._renderHelpScreen(e,t=>k.render(t)):this._subScreen==="terms"?this._renderTermsScreen(e,t=>k.render(t)):this._subScreen==="privacy"?this._renderPrivacyScreen(e,t=>k.render(t)):this._subScreen==="about"&&this._renderAboutScreen(e,t=>k.render(t))}_renderMainScreen(e){const t=this._saveManager.profile,i=t.phone?this._maskPhone(t.phone):`${s.currentLocale==="am"?"እንግዳ ተጫዋች":s.currentLocale==="om"?"Taphataa Keessummaa":"Guest Player"}`,a=(d,g,m,x,y)=>`
            <div id="${y}" class="settings-tile" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 24px; width: 28px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${d}</span>
                    <div>
                        <div style="font-size: 15px; font-weight: 800; color: white; letter-spacing: 0.3px;">${g}</div>
                        ${m?`<div style="font-size: 13px; color: var(--fds-text-dim); margin-top: 2px; font-weight: 600;">${m}</div>`:""}
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    ${x}
                </div>
            </div>
        `,r='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',n=d=>`
            <label class="switch-container" style="pointer-events: none;">
                <input type="checkbox" class="switch-input" ${d?"checked":""}>
                <span class="switch-slider"></span>
            </label>
        `,o=s.currentLocale==="am"?"አማርኛ":s.currentLocale==="om"?"Afan Oromo":"English",l=Object.values(this._settings.notifications).some(d=>d);e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${k.render(s.currentLocale==="am"?"ቅንብሮች":s.currentLocale==="om"?"QINDAA'INOOTA":"Settings")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- Account Group -->
                    <div style="font-size: 12px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 20px; text-transform: uppercase; letter-spacing: 1px;">${s.currentLocale==="am"?"መለያ እና መገለጫ":s.currentLocale==="om"?"HERREGA & PROFILE":"ACCOUNT & PROFILE"}</div>
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 16px; padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        ${a("👤",s.currentLocale==="am"?"የእኔ መገለጫ":s.currentLocale==="om"?"Profile Koo":"My Profile",i,r,"tile-profile")}
                        ${a("🌍",s.currentLocale==="am"?"ቋንቋ":s.currentLocale==="om"?"Afaan":"Language",o,r,"tile-language")}
                        ${a("🔔",s.currentLocale==="am"?"ማሳወቂያዎች":s.currentLocale==="om"?"Beeksisa":"Notifications","",n(l),"tile-notifications")}
                        <div style="border-bottom: none;">
                            ${a("🔊",s.currentLocale==="am"?"የድምፅ ውጤቶች":s.currentLocale==="om"?"Sagalee":"Sound Effects",this._settings.soundEffects?s.currentLocale==="am"?"የበራ":s.currentLocale==="om"?"Kan Baname":"Enabled":s.currentLocale==="am"?"የጠፋ":s.currentLocale==="om"?"Kan Cufame":"Muted",n(this._settings.soundEffects),"tile-sound")}
                        </div>
                    </div>

                    <!-- Legal Group -->
                    <div style="font-size: 12px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 20px; text-transform: uppercase; letter-spacing: 1px;">${s.currentLocale==="am"?"እገዛ እና ህጋዊ":s.currentLocale==="om"?"GARGAARSA & SEERA":"SUPPORT & LEGAL"}</div>
                    <div class="glass-card" style="margin-bottom: 32px; border-radius: 16px; padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        ${a("❓",s.currentLocale==="am"?"እገዛ እና ድጋፍ":s.currentLocale==="om"?"Gargaarsa & Deeggarsa":"Help & Support","",r,"tile-help")}
                        ${a("📜",s.currentLocale==="am"?"ውሎች እና ሁኔታዎች":s.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions","",r,"tile-terms")}
                        ${a("🔒",s.currentLocale==="am"?"የግላዊነት ፖሊሲ":s.currentLocale==="om"?"Imaammata Dhuunfaa":"Privacy Policy","",r,"tile-privacy")}
                        <div style="border-bottom: none;">
                            ${a("ℹ️",s.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":s.currentLocale==="om"?"Waa'ee Ethio Fantasy":"About EthioFantasy",`v${pt.version}`,r,"tile-about")}
                        </div>
                    </div>

                    <!-- Logout -->
                    <div class="glass-card settings-tile" id="btn-logout" style="margin-bottom: 16px; border-radius: 16px; padding: 0; text-align: center; border: 1px solid rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1); overflow: hidden; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);">
                        <div style="padding: 16px; font-size: 15px; font-weight: 900; color: #FCA5A5; cursor: pointer; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            ${s.currentLocale==="am"?"ውጣ":s.currentLocale==="om"?"BA'I":"LOG OUT"}
                        </div>
                    </div>

                </div>
            </div>
            <style>
                .settings-tile:active { background: rgba(255,255,255,0.08) !important; }
                
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
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                .switch-input:checked + .switch-slider {
                    background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%);
                    border-color: var(--tv-pitch-green);
                }
                .switch-input:checked + .switch-slider:before {
                    transform: translateX(20px);
                }
            </style>
        `,k.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),[{id:"tile-profile",sub:"profile"},{id:"tile-language",sub:"language"},{id:"tile-help",sub:"help"},{id:"tile-terms",sub:"terms"},{id:"tile-privacy",sub:"privacy"},{id:"tile-about",sub:"about"}].forEach(d=>{document.getElementById(d.id)?.addEventListener("click",()=>{this._audioManager.playClick(),this._subScreen=d.sub,this.render()})}),document.getElementById("tile-notifications")?.addEventListener("click",()=>{this._audioManager.playClick();const d=!Object.values(this._settings.notifications).some(g=>g);Object.keys(this._settings.notifications).forEach(g=>{this._settings.notifications[g]=d}),this._saveSettings(),this.render()}),document.getElementById("tile-sound")?.addEventListener("click",()=>{this._audioManager.playClick(),this._settings.soundEffects=!this._settings.soundEffects,this._saveSettings(),this.render()}),document.getElementById("btn-logout")?.addEventListener("click",async()=>{this._audioManager.playClick(),await ct.show()&&(await R.getInstance().signOut(),window.location.reload())})}_renderProfileScreen(e,t){const i=this._saveManager.profile,a=i.phone?this._maskPhone(i.phone):`${s.currentLocale==="am"?"እንግዳ ተጫዋች":s.currentLocale==="om"?"Taphataa Keessummaa":"Guest Player"}`,r="July 22, 2026",n=i.eloRating&&i.eloRating>1400?s.currentLocale==="am"?"የበራ ፕሪሚየም":s.currentLocale==="om"?"Premium Hojjetu":"Active Premium":s.currentLocale==="am"?"የበራ መሰረታዊ":s.currentLocale==="om"?"Basic Hojjetu":"Active Basic",o=(l,c)=>`
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

                ${t(s.currentLocale==="am"?"የእኔ መገለጫ":s.currentLocale==="om"?"PROFILE KOO":"MY PROFILE")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${o(s.currentLocale==="am"?"የስልክ ቁጥር (MSISDN)":s.currentLocale==="om"?"Lakkoofsa MSISDN":"Masked MSISDN",a)}
                        ${o(s.currentLocale==="am"?"የምዝገባ ሁኔታ":s.currentLocale==="om"?"Haala Kaffaltii":"Subscription Status",n)}
                        <div style="border-bottom: none;">
                            ${o(s.currentLocale==="am"?"የተመዘገቡበት ቀን":s.currentLocale==="om"?"Guyyaa Galmee":"Registration Date",r)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderLanguageScreen(e,t){const i=(r,n)=>{const o=s.currentLocale===r;return`
                <div class="settings-tile lang-item" data-lang="${r}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${n}</div>
                    <div style="
                        width: 20px; height: 20px; border-radius: 50%; 
                        border: 2px solid ${o?"var(--tv-gold-primary)":"rgba(255,255,255,0.3)"};
                        display: flex; align-items: center; justify-content: center;
                    ">
                        ${o?'<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--tv-gold-primary);"></div>':""}
                    </div>
                </div>
            `};e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(s.currentLocale==="am"?"ቋንቋ ይምረጡ":s.currentLocale==="om"?"AFAAN FILADHU":"SELECT LANGUAGE")}

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
        `,this._bindSubScreenBack(e),e.querySelectorAll(".lang-item").forEach(r=>{r.addEventListener("click",n=>{const l=n.currentTarget.getAttribute("data-lang");l&&(this._audioManager.playClick(),s.setLocale(l),E.refresh(),this.render())})})}_renderNotificationsScreen(e,t){const i=(r,n)=>{const o=this._settings.notifications[r];return`
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${n}</div>
                    <label class="switch-container">
                        <input type="checkbox" class="switch-input notif-toggle" data-key="${r}" ${o?"checked":""}>
                        <span class="switch-slider"></span>
                    </label>
                </div>
            `};e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(s.currentLocale==="am"?"ማሳወቂያዎች":s.currentLocale==="om"?"BEEKSIISAA":"NOTIFICATIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i("dailyChallenge",s.currentLocale==="am"?"የዕለት ተግዳሮቶች":s.currentLocale==="om"?"Qormaata Guyyaa":"Daily Challenge")}
                        ${i("tournament",s.currentLocale==="am"?"የሊግ ውድድር ዜናዎች":s.currentLocale==="om"?"Dorgommiiwwan Liigii":"Tournament Updates")}
                        ${i("rewards",s.currentLocale==="am"?"ሽልማቶች እና ጉርሻዎች":s.currentLocale==="om"?"Badhaasa & Bonus":"Rewards & Bonuses")}
                        ${i("announcements",s.currentLocale==="am"?"ማስታወቂያዎች":s.currentLocale==="om"?"Beeksisa Sirnaa":"Announcements")}
                        ${i("subscription",s.currentLocale==="am"?"የምዝገባ ማሳወቂያዎች":s.currentLocale==="om"?"Kaffaltii Addaa":"Subscription Alerts")}
                        <div style="border-bottom: none;">
                            ${i("system",s.currentLocale==="am"?"የስርዓት ማንቂያዎች":s.currentLocale==="om"?"Gargaarsa Sirnaa":"System Alerts")}
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
        `,this._bindSubScreenBack(e),e.querySelectorAll(".notif-toggle").forEach(r=>{r.addEventListener("change",n=>{this._audioManager.playClick();const o=n.currentTarget,l=o.getAttribute("data-key");l&&(this._settings.notifications[l]=o.checked,this._saveSettings())})})}_renderSoundScreen(e,t){const i=(o,l)=>{const c=this._settings.soundEffects===o;return`
                <div class="settings-tile sound-item" data-val="${o}" style="
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
            `},a=s.currentLocale==="am"?"ድምፅ አብራ":s.currentLocale==="om"?"Bani":"Enable",r=s.currentLocale==="am"?"ድምፅ አጥፋ":s.currentLocale==="om"?"Cufi":"Disable";e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(s.currentLocale==="am"?"የድምፅ ውጤቶች":s.currentLocale==="om"?"SAGAALE TAPHA":"SOUND EFFECTS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i(!0,a)}
                        <div style="border-bottom: none;">
                            ${i(!1,r)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e),e.querySelectorAll(".sound-item").forEach(o=>{o.addEventListener("click",l=>{const d=l.currentTarget.getAttribute("data-val")==="true";this._settings.soundEffects=d,this._saveSettings(),this._audioManager.playClick(),this.render()})})}_renderHelpScreen(e,t){const i='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',a=[{id:"account",name:s.currentLocale==="am"?"መለያ":s.currentLocale==="om"?"Herrega":"Account",desc:"Account creation, recovery and security",icon:"👤"},{id:"subscription",name:s.currentLocale==="am"?"ምዝገባ":s.currentLocale==="om"?"Kaffaltii":"Subscription",desc:"Premium access and daily billing",icon:"💳"},{id:"unsubscription",name:s.currentLocale==="am"?"ምዝገባ መሰረዝ":s.currentLocale==="om"?"Haquu":"Unsubscription",desc:"How to opt out or cancel service",icon:"🛑"},{id:"dailyChallenge",name:s.currentLocale==="am"?"የዕለት ተግዳሮት":s.currentLocale==="om"?"Qormaata Guyyaa":"Daily Challenge",desc:"Rules and bonuses for daily plays",icon:"📅"},{id:"tournament",name:s.currentLocale==="am"?"ውድድር":s.currentLocale==="om"?"Dorgommii":"Tournament",desc:"Joining and competing in live events",icon:"🏆"},{id:"rewards",name:s.currentLocale==="am"?"ሽልማቶች":s.currentLocale==="om"?"Badhaasa":"Rewards",desc:"Claiming cash prizes and coins",icon:"🎁"},{id:"gameplay",name:s.currentLocale==="am"?"የጨዋታ ሁኔታ":s.currentLocale==="om"?"Tapha":"Gameplay",desc:"How to answer questions and score",icon:"⚽"},{id:"leaderboard",name:s.currentLocale==="am"?"ደረጃ ሰሌዳ":s.currentLocale==="om"?"Sadarkaa":"Leaderboard",desc:"ELO rating and division climbing",icon:"📊"},{id:"profile",name:s.currentLocale==="am"?"መገለጫ":(s.currentLocale==="om","Profile"),desc:"Managing your player identity",icon:"👤"},{id:"notifications",name:s.currentLocale==="am"?"ማሳወቂያዎች":s.currentLocale==="om"?"Beeksisa":"Notifications",desc:"SMS alerts and system updates",icon:"🔔"},{id:"technicalIssues",name:s.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":s.currentLocale==="om"?"Rakkina Sirnaa":"Technical Issues",desc:"Report bugs or connection problems",icon:"🔧"}],r={account:[{q:"How is my account created?",a:"Your account is automatically created when you authenticate with your Ethio Telecom mobile phone number. There is no password required."},{q:"Can I delete my account?",a:"To delete your account data, please contact Ethio Telecom customer service or submit a support ticket via the app."}],subscription:[{q:"What is Premium Subscription?",a:"Premium subscription gives you unlimited daily plays, full access to all leagues, and entry into the weekly cash prize draws for 2 Birr/day."},{q:"How do I pay for subscription?",a:"Subscription fees are automatically deducted from your Ethio Telecom airtime balance daily."}],unsubscription:[{q:"How do I unsubscribe?",a:'You can cancel your active subscription anytime by going to Settings > Account > Profile and choosing Unsubscribe, or by sending "STOP" to the Ethio Telecom shortcode 8282.'}],dailyChallenge:[{q:"What is the Daily Challenge?",a:"The Daily Challenge is a special daily set of 10 trivia questions on hot football topics. Completing it awards double reward coins and a 1.5x XP bonus!"},{q:"How many times can I play the Daily Challenge?",a:"You can play the Daily Challenge once per calendar day. It resets every night at midnight EAT."}],tournament:[{q:"How do tournaments work?",a:"Tournaments are knockout brackets held every weekend. Players register during the week and compete live in 1v1 match phases to progress."},{q:"What are the tournament entry requirements?",a:"Premium subscribers can enter tournaments for free. Basic and free players must pay a 100 coin registration fee."}],rewards:[{q:"What rewards can I win?",a:"You can win in-game coins, profile XP, custom football badges, and real cash prizes credited directly to your Ethio Telecom mobile account balance."},{q:"When are weekly prizes distributed?",a:"Weekly prizes are processed and sent every Monday at 10:00 AM EAT based on the final Sunday night division standings."}],gameplay:[{q:"How do I play a match?",a:"Read the question carefully and tap the correct option before the timer runs out. Fast answers score Goals, while incorrect ones are Saved by the goalkeeper!"},{q:"How does the match timer work?",a:"You have 30 seconds per question in Solo Matches, and 20 seconds in Live 1v1 Matches. Answering quicker increases your possession stat!"}],leaderboard:[{q:"How are leaderboard points calculated?",a:"Leaderboard standings are based on ELO ratings. You win ELO points by defeating opponents in Live 1v1 Matches and scoring high accuracy in Solo Matches."},{q:"How often does the leaderboard reset?",a:"Division leaderboards reset weekly on Sunday at midnight EAT, after which the top players are promoted and rewards are dispatched."}],profile:[{q:"Why can't I edit my username?",a:"To comply with Ethio Telecom VAS portal guidelines, player profiles are verified and tied securely to your MSISDN. Manually changing names is restricted."}],notifications:[{q:"What notifications will I receive?",a:"You will receive SMS alerts for tournament kick-offs, daily challenge reminders, and subscription renewals. You can toggle these settings anytime."}],technicalIssues:[{q:"The app is freezing. What should I do?",a:"Ensure you have a stable network connection (3G/4G/LTE/5G). Try refreshing the app page by swiping down, or clearing your mobile browser cache."}],privacy:[{q:"How is my data used?",a:"We collect your phone number and game statistics solely to manage your game state and calculate rankings. We never share your data with third parties."}],terms:[{q:"Are there age restrictions?",a:"Yes, you must be 18 years or older, or have parental consent, and be an active Ethio Telecom subscriber to compete for cash rewards."}]};if(this._showContactSupportForm){e.innerHTML=`
                <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                    ${t(s.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":s.currentLocale==="om"?"RAKKINA SIRNAA":"TECHNICAL ISSUES")}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                        
                        <div class="glass-card" style="border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); text-align: left;" id="support-form-container">
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px; letter-spacing: 0.5px;">${s.currentLocale==="am"?"✉️ ሪፖርት ያድርጉ":s.currentLocale==="om"?"✉️ Gabaasi":"✉️ Report an Issue"}</div>
                            <div style="font-size: 14px; color: var(--fds-text-dim); margin-bottom: 20px;">Contact support to resolve bugs, connection drops, or game errors.</div>

                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">${s.currentLocale==="am"?"የጉዳዩ ዓይነት":s.currentLocale==="om"?"GOSA RAKKINA":"PROBLEM CATEGORY"}</label>
                                <select id="support-category" style="width: 100%; padding: 12px 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: white; outline: none; font-size: 15px; appearance: none; -webkit-appearance: none;">
                                    <option value="Billing & Subscription">${s.currentLocale==="am"?"ክፍያ እና ምዝገባ":s.currentLocale==="om"?"Kaffaltii & Galmee":"Billing & Subscription"}</option>
                                    <option value="Technical Issues">${s.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":s.currentLocale==="om"?"Rakkina Sirnaa":"Technical Issues"}</option>
                                    <option value="Rewards & Points">${s.currentLocale==="am"?"ሽልማቶች እና ነጥቦች":s.currentLocale==="om"?"Badhaasa & Qabxii":"Rewards & Points"}</option>
                                    <option value="General Feedback">${s.currentLocale==="am"?"አጠቃላይ አስተያየት":s.currentLocale==="om"?"Yaada Waligalaa":"General Feedback"}</option>
                                </select>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">${s.currentLocale==="am"?"መልእክት":s.currentLocale==="om"?"ERGAA":"DESCRIPTION"}</label>
                                <textarea id="support-message" placeholder="${s.currentLocale==="am"?"ችግርዎን እዚህ ይግለጹ...":s.currentLocale==="om"?"Rakkina keessan asitti ibsaa...":"Provide details about the issue..."}" style="width: 100%; height: 100px; padding: 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: white; outline: none; resize: none; font-family: inherit; font-size: 15px; box-sizing: border-box;"></textarea>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">OPTIONAL SCREENSHOT</label>
                                <div style="width: 100%; padding: 14px; background: rgba(0,0,0,0.3); border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; color: var(--fds-text-dim); text-align: center; font-size: 14px; cursor: pointer;">
                                    📷 Tap to upload screenshot
                                </div>
                            </div>
                            
                            <div id="btn-submit-support" style="background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%); padding: 14px; text-align: center; border-radius: 12px; font-weight: 900; color: white; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                                ${s.currentLocale==="am"?"መልእክት ላክ":s.currentLocale==="om"?"ERGAA ERGI":"SUBMIT SUPPORT TICKET"}
                            </div>
                        </div>
                    </div>
                </div>
            `,this._bindSubScreenBack(e),document.getElementById("btn-back-help")?.addEventListener("click",()=>{this._audioManager.playClick(),this._showContactSupportForm=!1,this.render()}),document.getElementById("btn-submit-support")?.addEventListener("click",async()=>{this._audioManager.playClick();const l=document.getElementById("support-message")?.value.trim(),c=document.getElementById("support-category"),d=c?c.value:"General Feedback";if(!l){ne.show(s.currentLocale==="am"?"እባክዎን ከማስገባትዎ በፊት መልእክት ያስገቡ።":s.currentLocale==="om"?"Maree ergamuu dura ergaa galchaa.":"Please enter a message before submitting.","warning");return}const g=document.getElementById("support-form-container");if(g){g.innerHTML=`
                        <div style="text-align: center; padding: 16px; color: var(--fds-text-dim);">
                            ${s.currentLocale==="am"?"ጥያቄዎ ወደ አገልጋይ በመላክ ላይ...":s.currentLocale==="om"?"Ergaan gara serveritti ergamaa jira...":"Submitting ticket to server..."}
                        </div>
                    `;const m=await te.getInstance().createTicket(d,l),x=m.success?`EF-${m.ticketId.substring(0,8).toUpperCase()}`:"EF-"+Math.floor(1e5+Math.random()*9e5);g.innerHTML=`
                        <div style="text-align: center; padding: 16px;">
                            <div style="font-size: 40px; margin-bottom: 8px;">✅</div>
                            <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--tv-pitch-green); margin-bottom: 4px;">${s.currentLocale==="am"?"ጥያቄዎ ገብቷል":s.currentLocale==="om"?"ERGAAN ERGAMEERA":"TICKET SUBMITTED"}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 12px;">${s.currentLocale==="am"?"የድጋፍ ቡድናችን በቅርቡ በኤስኤምኤስ ምላሽ ይሰጣል።":s.currentLocale==="om"?"Gareen deeggarsa keenyaa dhiyeenyatti SMSn deebii kenne.":"Our support team will respond via SMS shortly."}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 700; color: var(--fds-text-main); background: rgba(255,255,255,0.08); padding: 6px; border-radius: 6px; font-family: monospace; display: inline-block;">REF: ${x}</div>
                        </div>
                    `}});return}if(this._helpCategory){const l=this._faqsCache.length>0?this._faqsCache:r[this._helpCategory]||[],c=l.map((v,u)=>`
                <div class="glass-card" style="border-radius: 12px; margin-bottom: 12px; border-color: rgba(255,255,255,0.08); overflow: hidden;">
                    <div class="faq-header" data-idx="${u}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.02);">
                        <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${v.q}</div>
                        <span class="faq-icon" style="color: var(--tv-gold-primary); font-size: var(--fds-font-xs); transition: transform 0.2s;">➕</span>
                    </div>
                    <div class="faq-body" id="faq-body-${u}" style="max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out; background: rgba(0,0,0,0.2);">
                        <div style="padding: 16px; font-size: var(--fds-font-sm); color: var(--fds-text-muted); line-height: 1.5;">${v.a}</div>
                    </div>
                </div>
            `).join(""),d=a.find(v=>v.id===this._helpCategory),g=d?d.name:this._helpCategory,m=`
                <div style="text-align: center; padding: 40px 16px;">
                    <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">📋</div>
                    <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 8px;">No FAQs Available</div>
                    <div style="font-size: 14px; color: var(--fds-text-dim);">There are no common questions listed for this category yet.</div>
                </div>
            `;e.innerHTML=`
                <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                    ${t(`${g.toUpperCase()}`)}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                        
                        <div style="margin-bottom: 24px; padding-left: 12px; border-left: 4px solid var(--tv-gold-primary);">
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 4px; letter-spacing: 0.5px;">Common Questions</div>
                            <div style="font-size: 14px; color: var(--fds-text-dim);">Solutions and relevant instructions</div>
                        </div>
                        
                        <!-- Search FAQs -->
                        <div style="position: relative; margin-bottom: 24px;">
                            <span style="position: absolute; left: 14px; top: 12px; opacity: 0.6;">🔍</span>
                            <input type="text" id="faq-search-input" placeholder="${s.currentLocale==="am"?"ጥያቄዎችን ይፈልጉ...":s.currentLocale==="om"?"Gaaffiiwwan Barbaadi...":"Search FAQs..."}" style="
                                width: 100%; 
                                padding: 12px 14px 12px 42px; 
                                background: rgba(0,0,0,0.4); 
                                border: 1px solid rgba(255,255,255,0.15); 
                                border-radius: 12px; 
                                color: white; 
                                font-size: 15px; 
                                box-sizing: border-box;
                                outline: none;
                            ">
                        </div>

                        <div id="faq-list-wrapper">
                            ${l.length>0?c:m}
                        </div>
                    </div>
                </div>
            `,this._bindSubScreenBack(e),document.getElementById("btn-back-help")?.addEventListener("click",()=>{this._audioManager.playClick(),this._helpCategory=null,this._faqsCache=[],this.render()}),document.getElementById("faq-search-input")?.addEventListener("input",v=>{const u=v.target.value.toLowerCase();e.querySelectorAll("#faq-list-wrapper > .glass-card").forEach(b=>{const w=(b.querySelector(".faq-header > div")?.textContent||"").toLowerCase(),M=(b.querySelector(".faq-body > div")?.textContent||"").toLowerCase();w.includes(u)||M.includes(u)?b.style.display="block":b.style.display="none"})}),e.querySelectorAll(".faq-header").forEach(v=>{v.addEventListener("click",u=>{this._audioManager.playClick();const f=u.currentTarget,b=f.getAttribute("data-idx"),w=e.querySelector(`#faq-body-${b}`),M=f.querySelector(".faq-icon");w&&M&&(w.style.maxHeight==="0px"||!w.style.maxHeight?(w.style.maxHeight=w.scrollHeight+"px",M.innerText="➖"):(w.style.maxHeight="0px",M.innerText="➕"))})});return}const n=a.map(l=>`
            <div class="settings-tile help-category-tile" data-cat-id="${l.id}" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 24px; width: 28px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${l.icon}</span>
                    <div>
                        <div style="font-size: 15px; font-weight: 800; color: white; letter-spacing: 0.3px;">${l.name}</div>
                        <div style="font-size: 13px; color: var(--fds-text-dim); margin-top: 2px; font-weight: 600;">${l.desc}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    ${i}
                </div>
            </div>
        `).join("");e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(s.currentLocale==="am"?"እገዛ እና ድጋፍ":s.currentLocale==="om"?"GARGAARSA":"HELP & SUPPORT")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <div class="glass-card" style="border-radius: 16px; padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        ${n}
                    </div>

                </div>
            </div>
        `,this._bindSubScreenBack(e),document.getElementById("btn-contact-support")?.addEventListener("click",()=>{this._audioManager.playClick(),this._showContactSupportForm=!0,this.render()}),e.querySelectorAll(".help-category-tile").forEach(l=>{l.addEventListener("click",async c=>{const g=c.currentTarget.getAttribute("data-cat-id");if(g){if(this._audioManager.playClick(),g==="technicalIssues"){this._showContactSupportForm=!0,this.render();return}this._helpCategory=g;const m=document.getElementById("faq-list-wrapper");m&&(m.innerHTML=`<div style="padding: 20px; color: var(--fds-text-dim);">${s.currentLocale==="am"?"ጥያቄዎች በመጫን ላይ...":s.currentLocale==="om"?"Gaaffiiwwan fe'amaa jiru...":"Loading FAQs..."}</div>`);const y=await ee.getInstance().getFAQsByCategory(g);this._faqsCache=y.map(v=>{let u=v.question_en,f=v.answer_en;return s.currentLocale==="am"&&v.question_am&&v.answer_am?(u=v.question_am,f=v.answer_am):s.currentLocale==="om"&&v.question_om&&v.answer_om&&(u=v.question_om,f=v.answer_om),{q:u,a:f}}),this.render()}})})}_renderTermsScreen(e,t){const i=s.currentLocale==="am"?`
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
        `:s.currentLocale==="om"?`
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

                ${t(s.currentLocale==="am"?"ውሎች እና ሁኔታዎች":s.currentLocale==="om"?"WALIIGALTEE":"TERMS & CONDITIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(15,23,42,0.85); color: var(--fds-text-muted);">
                        ${i}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderPrivacyScreen(e,t){const i=s.currentLocale==="am"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. የምንሰበስበው መረጃ</h2>
                <p>ለጨዋታው አስተዳደር እንዲረዳን የተጠቃሚውን ስልክ ቁጥር (MSISDN)፣ የቋንቋ ምርጫ እና የጨዋታ ነጥቦችን እንሰበስባለን።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. ከኢትዮ ቴሌኮም ጋር ያለው ትስስር</h2>
                <p>አፕሊኬሽኑ ከኢትዮ ቴሌኮም የቪኤኤስ (VAS) መተግበሪያ ጋር በቀጥታ የተገናኘ ሲሆን፣ ሳምንታዊ ሽልማቶችን ለማረጋገጥ ስልክዎን እንጠቀማለን።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. የመረጃ ጥበቃ እና ደህንነት</h2>
                <p>የተጫዋች መረጃ እና የስልክ ቁጥር በከፍተኛ ደህንነት የተጠበቀ ነው። መረጃዎን ለሶስተኛ ወገን አናጋራም።</p>
            </div>
        `:s.currentLocale==="om"?`
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

                ${t(s.currentLocale==="am"?"የግላዊነት ፖሊሲ":s.currentLocale==="om"?"IMAAMMATA DHUUNFAA":"PRIVACY POLICY")}

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

                ${t(s.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":s.currentLocale==="om"?"WAA'EE ETHIO FANTASY":"ABOUT ETHIO FANTASY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px; text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚽</div>
                    <div style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">EthioFantasy</div>
                    <div style="font-size: var(--fds-font-sm); color: var(--tv-gold-primary); font-weight: 800; margin-bottom: 24px; letter-spacing: 1.5px; text-transform: uppercase;">Ethio Telecom VAS Integration</div>
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: var(--fds-font-sm); line-height: 1.6; color: var(--fds-text-muted); margin-bottom: 24px;">
                        <p style="margin-top: 0;"><strong>${s.currentLocale==="am"?"የመተግበሪያ መግለጫ:":s.currentLocale==="om"?"IBSA APPLIKAASHINII:":"Application Description:"}</strong><br>${s.currentLocale==="am"?"ኢትዮፋንታሲ በኢትዮጵያ ውስጥ ላሉ የእግር ኳስ አፍቃሪዎች የተዘጋጀ ልዩ የእግር ኳስ ጥያቄዎች ሊግ ነው። ዕለታዊ የትሪቪያ ጨዋታዎችን ይጫወቱ፣ ሌሎች ተጫዋቾችን በቀጥታ 1v1 ይፈትኑ እና የገንዘብ ሽልማቶችን ለማሸነፍ በሊግ ደረጃዎች ይውጡ።":s.currentLocale==="om"?"EthioFantasy dorgommii gaaffii kubbaa miilaa fayyadamtoota Itoophiyaatif qophaa'ee dha. Tapha guyyaa taphadhaa, dorgomtoota kan biroo 1v1 irratti falmaa, badhaasa qarshii mo'achuuf sadarkaa liigii kooraa.":"EthioFantasy is a premium Football Quiz League platform crafted specifically for football fans in Ethiopia. Play daily trivia matches, challenge other players in live 1v1 showdowns, and climb the league divisions to win cash prizes."}</p>
                        
                        <p style="margin-bottom: 0;"><strong>${s.currentLocale==="am"?"ዋና ዋና ባህሪያት:":s.currentLocale==="om"?"AMALA GURGUDDOO:":"Key Features:"}</strong><br>
                        ${s.currentLocale==="am"?"• የዕለት ተግዳሮቶች ከነጥብ ማባዣዎች ጋር<br>• የቀጥታ 1v1 ጨዋታዎች<br>• የሳምንቱ መጨረሻ ውድድሮች<br>• የደረጃ እድገት እና የ ELO ሰሌዳ<br>• የተቀናጀ የኤስኤምኤስ ክፍያ ማረጋገጫ":s.currentLocale==="om"?"• Qormaata guyyaa qabxii baay'isu waliin<br>• Tapha 1v1 kallattiin<br>• Dorgommii dhuma torbaniti<br>• Sadarkaa ELO fi guddina liigii<br>• Kaffaltii SMSn mirkanaa'u":"• Daily themed challenges with score multipliers<br>• Live 1v1 real-time matchmaking<br>• Interactive Weekend knockout tournaments<br>• Professional division promotions & ELO ranking leaderboard<br>• Integrated billing checking via SMS OTP"}</p>
                    </div>

                    <div class="glass-card" style="border-radius: 12px; padding: 16px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 24px;">
                        <div><strong>${s.currentLocale==="am"?"ስሪት:":s.currentLocale==="om"?"Gosa:":"Version:"}</strong> 1.1.0</div>
                        <div style="margin-top: 6px;"><strong>${s.currentLocale==="am"?"አልሚ:":s.currentLocale==="om"?"Oomishaa:":"Developer:"}</strong> InnoGames VAS Team</div>
                        <div style="margin-top: 6px;"><strong>${s.currentLocale==="am"?"የኢትዮ ቴሌኮም ትስስር:":s.currentLocale==="om"?"Waliin Hojii Itiyo Telekoom:":"Ethio Telecom Integration:"}</strong> VAS Gateway API v3.2</div>
                        <div style="margin-top: 6px;"><strong>${s.currentLocale==="am"?"ግንኙነት:":s.currentLocale==="om"?"Qunnamtii:":"Contact:"}</strong> support@ethiofantasy.com</div>
                    </div>

                    <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700;">
                        ${s.currentLocale==="am"?"© 2026 ኢትዮ ቴሌኮም VAS። መብቱ በህግ የተጠበቀ ነው።":s.currentLocale==="om"?"© 2026 Itiyo Telekoom VAS. Mirgi Hunduu Seeraan Kan Eegame.":"© 2026 Ethio Telecom VAS. All Rights Reserved."}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_goBack(){if(this._subScreen!==this._defaultSubScreen)this._subScreen=this._defaultSubScreen;else if(!(this._helpCategory!==null||this._showContactSupportForm)){this._onBack();return}this._helpCategory=null,this._showContactSupportForm=!1,this.render()}_bindSubScreenBack(e){k.bind(e,()=>{this._audioManager.playClick(),this._goBack()})}_maskPhone(e){let t=e.replace(/[^0-9+]/g,"");return t.startsWith("+")&&(t=t.substring(1)),t.startsWith("251")&&(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class F{static _instance=null;constructor(){}static getInstance(){return F._instance||(F._instance=new F),F._instance}async getNotifications(e){if(!_.isOnline)return[];const t=h;if(!t)return[];try{const{data:{user:i}}=await t.auth.getUser();if(!i)return[];let a=t.from("notifications").select("*").or(`user_id.eq.${i.id},user_id.is.null`).order("created_at",{ascending:!1});e&&(a=a.eq("category",e));const{data:r,error:n}=await a;return n?(console.warn("[NotificationService] Error fetching notifications:",n),[]):r||[]}catch(i){return console.warn("[NotificationService] Failed to get notifications:",i),[]}}async getUnreadCount(){if(!_.isOnline)return 0;const e=h;if(!e)return 0;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return 0;const{count:i,error:a}=await e.from("notifications").select("*",{count:"exact",head:!0}).or(`user_id.eq.${t.id},user_id.is.null`).eq("read",!1);return a?(console.warn("[NotificationService] Error fetching unread count:",a),0):i||0}catch(t){return console.warn("[NotificationService] Failed to get unread count:",t),0}}async markAsRead(e){if(!_.isOnline)return;const t=h;if(t)try{const{error:i}=await t.from("notifications").update({read:!0}).eq("id",e);i&&console.warn("[NotificationService] Error marking as read:",i)}catch(i){console.warn("[NotificationService] Failed to mark as read:",i)}}async markAllAsRead(){if(!_.isOnline)return;const e=h;if(e)try{const{data:{user:t}}=await e.auth.getUser();if(!t)return;const{error:i}=await e.from("notifications").update({read:!0}).or(`user_id.eq.${t.id},user_id.is.null`).eq("read",!1);i&&console.warn("[NotificationService] Error marking all as read:",i)}catch(t){console.warn("[NotificationService] Failed to mark all as read:",t)}}subscribeToNewNotifications(e){if(!_.isOnline)return()=>{};const t=h;if(!t)return()=>{};let i=null;return t.auth.getUser().then(({data:{user:a}})=>{if(!a)return;const r=h;r&&(i=r.channel(`public:notifications:user_id=eq.${a.id}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},n=>{const o=n.new;(o.user_id===a.id||o.user_id===null)&&e(o)}).subscribe())}),()=>{const a=h;i&&a&&a.removeChannel(i)}}}class ut{_uiManager;_audioManager;_onBack;_activeTab="all";_notifications=[];_unsubscribeRealtime=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i,this._unsubscribeRealtime=F.getInstance().subscribeToNewNotifications(a=>{this._notifications.unshift(a),this.render()}),this._loadNotifications()}async _loadNotifications(){const e=F.getInstance();this._notifications=await e.getNotifications(),this.render()}render(){const e=this._uiManager.container,t=s.currentLocale,i=this._notifications.filter(l=>this._activeTab==="all"?!0:this._activeTab==="unread"?!l.read:l.category===this._activeTab),r=[{id:"all",label:{en:"All",am:"ሁሉም",om:"Hunda"}},{id:"unread",label:{en:"Unread",am:"ያልተነበቡ",om:"Kan Hin Dubbifamne"}},{id:"daily",label:{en:"Daily",am:"የዕለት",om:"Guyyaa"}},{id:"tournament",label:{en:"League",am:"ሊግ",om:"Liigii"}},{id:"rewards",label:{en:"Rewards",am:"ሽልማቶች",om:"Badhaasa"}},{id:"announcements",label:{en:"System",am:"ስርዓት",om:"Sirna"}},{id:"subscription",label:{en:"Billing",am:"ክፍያ",om:"Kaffaltii"}}].map(l=>{const c=l.id===this._activeTab,d=l.id==="unread"?this._notifications.filter(g=>!g.read).length:l.id==="all"?this._notifications.length:this._notifications.filter(g=>g.category===l.id).length;return`
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
            `}).join(""),n=i.length>0?i.map(l=>{const d={daily:"📅",tournament:"🏆",rewards:"🎁",announcements:"📢",system:"⚙️",subscription:"💳"}[l.category]||"🔔",g=t==="am"&&l.title_am?l.title_am:t==="om"&&l.title_om?l.title_om:l.title_en,m=t==="am"&&l.body_am?l.body_am:t==="om"&&l.body_om?l.body_om:l.body_en,x=new Date(l.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
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
                        ">${g}</div>
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
                        ">⏱️ ${x}</div>
                    </div>
                </div>
            `}).join(""):S.EmptyState("📭","No Notifications"),o=this._notifications.some(l=>!l.read);e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- App Bar -->
                ${k.render(t==="am"?"ማሳወቂያዎች":t==="om"?"BEEKSIISAA":"NOTIFICATIONS",o?`
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
                        ${r}
                    </div>

                    <!-- Notifications List -->
                    <div id="notifications-list">
                        ${n}
                    </div>
                </div>
            </div>
            <style>
                .notif-tab::-webkit-scrollbar { display: none; }
                .notif-item:active { transform: scale(0.98); }
            </style>
        `,this._bindEvents()}_filterNotifications(e){const t=s.currentLocale;let i=this._notifications.filter(r=>this._activeTab==="all"?!0:this._activeTab==="unread"?!r.read:r.category===this._activeTab);if(e.trim()){const r=e.toLowerCase();i=i.filter(n=>n.title_en&&n.title_en.toLowerCase().includes(r)||n.title_am&&n.title_am.toLowerCase().includes(r)||n.title_om&&n.title_om.toLowerCase().includes(r)||n.body_en&&n.body_en.toLowerCase().includes(r)||n.body_am&&n.body_am.toLowerCase().includes(r)||n.body_om&&n.body_om.toLowerCase().includes(r))}const a=document.getElementById("notifications-list");a&&(a.innerHTML=i.length>0?i.map(n=>{const l={daily:"📅",tournament:"🏆",rewards:"🎁",announcements:"📢",system:"⚙️",subscription:"💳"}[n.category]||"🔔",c=t==="am"&&n.title_am?n.title_am:t==="om"&&n.title_om?n.title_om:n.title_en,d=t==="am"&&n.body_am?n.body_am:t==="om"&&n.body_om?n.body_om:n.body_en,g=new Date(n.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                    <div class="glass-card notif-item ${n.read?"notif-read":"notif-unread"}" data-notif-id="${n.id}" style="
                        display: flex;
                        gap: 16px;
                        padding: 16px;
                        margin-bottom: 12px;
                        border-radius: 14px;
                        cursor: pointer;
                        position: relative;
                        transition: transform 0.2s, background-color 0.2s;
                        border-color: ${n.read?"rgba(255,255,255,0.05)":"rgba(255, 215, 0, 0.3)"};
                        background: ${n.read?"rgba(15, 23, 42, 0.6)":"rgba(255, 215, 0, 0.03)"};
                    ">
                        <!-- Status Indicator Dot -->
                        ${n.read?"":`
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
                                color: ${n.read?"#CBD5E1":"#FFFFFF"};
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
                            ">⏱️ ${g}</div>
                        </div>
                    </div>
                `}).join(""):S.EmptyState("📭","No Notifications"),a.querySelectorAll(".notif-item").forEach(n=>{n.addEventListener("click",async o=>{const c=o.currentTarget.getAttribute("data-notif-id");c&&(this._audioManager.playClick(),await F.getInstance().markAsRead(c),await this._loadNotifications())})}),document.getElementById("btn-empty-clear-notif")?.addEventListener("click",()=>{this._audioManager.playClick();const n=document.getElementById("notif-search-input");n&&(n.value="",this._filterNotifications(""))}))}_bindEvents(){k.bind(this._uiManager.container,()=>{this._audioManager.playClick(),this._unsubscribeRealtime&&this._unsubscribeRealtime(),this._onBack()}),document.getElementById("notif-search-input")?.addEventListener("input",r=>{const n=r.target.value;this._filterNotifications(n)}),document.getElementById("btn-mark-read")?.addEventListener("click",async()=>{this._audioManager.playClick(),await F.getInstance().markAllAsRead(),await this._loadNotifications()}),this._uiManager.container.querySelectorAll(".notif-tab").forEach(r=>{r.addEventListener("click",n=>{const l=n.currentTarget.getAttribute("data-tab-id");l&&(this._audioManager.playClick(),this._activeTab=l,this.render())})}),this._uiManager.container.querySelectorAll(".notif-item").forEach(r=>{r.addEventListener("click",async n=>{const l=n.currentTarget.getAttribute("data-notif-id");l&&(this._audioManager.playClick(),await F.getInstance().markAsRead(l),await this._loadNotifications())})}),document.getElementById("btn-empty-home")?.addEventListener("click",()=>{this._audioManager.playClick(),this._unsubscribeRealtime&&this._unsubscribeRealtime(),this._onBack()});const a=this._uiManager.container.querySelector(".stadium-container");a&&se.attach(a,async()=>{this._audioManager.playClick(),await this._loadNotifications()})}}class ht{_uiManager;_saveManager;_audioManager;_onBack;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}async render(){const e=this._uiManager.container;e.innerHTML=S.LoadingState("Loading stats...");const t=this._saveManager.profile,i=await q.getInstance().getHistory(50);let a=t.totalMatches||0,r=t.totalWins||0,n=a>0?Math.round(r/a*100):0,o=0,l=n,c=0,d=0,g=0;if(i.length>0){let A=0,I=0,O=0,G=0,Q=0;i.forEach(D=>{A+=Number(D.accuracy)||0,I+=Number(D.avg_response_time)||0,O+=Number(D.correct_count)||0,Q+=Number(D.total_questions)||10,G+=(Number(D.total_questions)||10)-(Number(D.correct_count)||0)}),l=Math.round(A/i.length),o=I/i.length*1e3;const oe=O/Q,le=G/Q;c=Math.round(a*10*oe),d=Math.round(a*10*le)}const m=o>0?(o/1e3).toFixed(1)+"s":"--",x=t.xp,y=t.highScores["football-quiz"]||0,v=(A,I,O)=>`
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <div style="font-size: var(--fds-font-xs); font-weight: 700; color: var(--fds-text-dim); text-transform: uppercase;">${A}</div>
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-main);">${I}%</div>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: ${I}%; height: 100%; background: ${O}; border-radius: 4px; box-shadow: 0 0 8px ${O}; transition: width 1s ease-out;"></div>
                </div>
            </div>
        `,u=(A,I)=>`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: 14px; font-weight: 600; color: var(--fds-text-dim);">${A}</div>
                <div style="font-size: 15px; font-weight: 800; color: var(--fds-text-main);">${I}</div>
            </div>
        `,f=(A,I)=>L.renderCard(`<div style="display: flex; flex-direction: column;">${I}</div>`,A),b=(A,I)=>L.renderCard(`<div style="padding: 20px 16px 8px 16px;">${I}</div>`,A);let w="";a>0?w=b("VISUAL ANALYTICS",`
                ${v("Win Rate",n,"var(--fds-gold-primary)")}
                ${v("Overall Accuracy",l,"var(--fds-green-pitch)")}
            `):w=b("VISUAL ANALYTICS",`
                <div style="text-align: center; padding: 24px 0; color: var(--fds-text-dim);">
                    <div style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;">📉</div>
                    <div style="font-size: 14px; font-weight: 600;">No match data available yet</div>
                    <div style="font-size: 12px; margin-top: 4px;">Play your first match to see analytics.</div>
                </div>
            `),e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding-bottom: 120px;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- App Bar -->
                ${k.render("Statistics")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    
                    ${f("OVERVIEW",`
                        ${u("Games Played",String(a))}
                        ${u("Matches Won",String(r))}
                        ${u("Accuracy",`${l}%`)}
                        <div style="border-bottom: none;">${u("Points / Rank Point",`${x} XP`)}</div>
                    `)}

                    ${f("PERFORMANCE",`
                        ${u("Highest Score",y.toLocaleString())}
                        ${u("Average Response Time",m)}
                        ${u("Correct Answers",String(c))}
                        ${u("Wrong Answers",String(d))}
                        <div style="border-bottom: none;">${u("Skipped Questions",String(g))}</div>
                    `)}

                    ${w}

                </div>
            </div>
        `,k.bind(e,()=>{this._audioManager.playClick(),this._onBack()});const M=e.querySelector(".stadium-container");M&&se.attach(M,async()=>{this._audioManager.playClick(),await this.render()})}}class gt{_uiManager;_audioManager;_onClose;_statusMessage="";_isSubscribing=!1;_isCheckingStatus=!1;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onClose=i,window.addEventListener("focus",this._handleFocus)}_handleFocus=()=>{this._isSubscribing&&!this._isCheckingStatus&&this._checkSubscriptionStatus()};destroy(){window.removeEventListener("focus",this._handleFocus)}async _checkSubscriptionStatus(){this._isCheckingStatus=!0,this._statusMessage="Checking subscription status...",this.render();try{await new Promise(e=>setTimeout(e,1e3)),this._statusMessage="Complete the SMS subscription to activate EthioFantasy."}catch{this._statusMessage="Could not verify subscription. Please try again."}finally{this._isCheckingStatus=!1,this._isSubscribing=!1,this.render()}}render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding-bottom: 80px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 600px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    ${k.render("Subscription")}

                    <div style="padding: 24px 16px;">
                        ${this._statusMessage?`
                            <div style="
                                background: rgba(15, 23, 42, 0.85);
                                backdrop-filter: blur(12px);
                                -webkit-backdrop-filter: blur(12px);
                                border: 1px solid rgba(255,255,255,0.1);
                                color: white;
                                padding: 16px;
                                border-radius: 12px;
                                margin-bottom: 24px;
                                font-weight: 700;
                                font-size: 14px;
                                text-align: center;
                                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                                animation: fade-in 0.3s ease-out;
                            ">${this._statusMessage}</div>
                        `:""}

                        <!-- ONLY ONE TIER: DAILY PASS -->
                        <div class="glass-card" style="
                            padding: 32px 24px; 
                            text-align: center; 
                            border-radius: 24px;
                            background: rgba(15, 23, 42, 0.85);
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                            border: 1px solid var(--tv-pitch-green);
                            box-shadow: 0 16px 48px rgba(34, 197, 94, 0.15), inset 0 1px 1px rgba(255,255,255,0.1);
                        ">
                            <div style="font-size: 48px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(34,197,94,0.4));">⚡</div>
                            <h3 style="margin: 0; color: white; font-size: 24px; font-weight: 900; letter-spacing: 1px;">ETHIOFANTASY DAILY</h3>
                            <div style="font-size: 32px; font-weight: 900; color: var(--tv-pitch-green); margin: 16px 0 24px 0;">2 Birr <span style="font-size: 16px; color: var(--fds-text-dim);">/ Day</span></div>
                            
                            <ul style="text-align: left; font-size: 15px; color: var(--fds-text-muted); padding-left: 0; margin-bottom: 32px; line-height: 2; list-style-type: none; font-weight: 600;">
                                <li style="display: flex; align-items: center; gap: 12px;"><span style="color: var(--tv-pitch-green); font-size: 18px;">✓</span> Unlimited solo matches</li>
                                <li style="display: flex; align-items: center; gap: 12px;"><span style="color: var(--tv-pitch-green); font-size: 18px;">✓</span> Live 1v1 multiplayer</li>
                                <li style="display: flex; align-items: center; gap: 12px;"><span style="color: var(--tv-pitch-green); font-size: 18px;">✓</span> All 15 competitions</li>
                                <li style="display: flex; align-items: center; gap: 12px;"><span style="color: var(--tv-pitch-green); font-size: 18px;">✓</span> Daily streak bonuses</li>
                                <li style="display: flex; align-items: center; gap: 12px;"><span style="color: var(--tv-pitch-green); font-size: 18px;">✓</span> Win real prizes</li>
                            </ul>

                            <button id="btn-subscribe" class="ethio-profile-btn" style="
                                width: 100%;
                                background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%);
                                color: white;
                                font-size: 16px;
                                font-weight: 900;
                                border: none;
                                padding: 18px 24px;
                                border-radius: 16px;
                                box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255,255,255,0.2);
                                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                ${this._isCheckingStatus?"opacity: 0.7; pointer-events: none;":""}
                            ">
                                ${this._isCheckingStatus?"PROCESSING...":"SUBSCRIBE — 2 BIRR/DAY"}
                            </button>
                        </div>
                        
                        <!-- Fallback SMS UI (Hidden by Default) -->
                        <div id="sms-fallback-ui" style="display: none; margin-top: 24px; padding: 24px; background: rgba(0,0,0,0.5); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.2); text-align: center;">
                            <div style="font-size: 14px; color: var(--fds-text-dim); margin-bottom: 16px;">If your messaging app didn't open automatically:</div>
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px;">Send SMS to 9401</div>
                            <div style="font-size: 24px; font-weight: 900; color: var(--tv-pitch-green); margin-bottom: 20px;">Message: OK</div>
                            <div style="display: flex; gap: 12px; justify-content: center;">
                                <button id="btn-copy-num" class="ethio-profile-btn ethio-profile-btn-secondary" style="flex: 1; padding: 12px; font-size: 13px;">Copy Number</button>
                                <button id="btn-copy-msg" class="ethio-profile-btn ethio-profile-btn-secondary" style="flex: 1; padding: 12px; font-size: 13px;">Copy Message</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <style>
                #btn-subscribe:active {
                    transform: scale(0.97);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
                }
            </style>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;k.bind(e,()=>{this._audioManager.playClick(),this.destroy(),this._onClose()});const t=e.querySelector("#btn-subscribe");t&&t.addEventListener("click",()=>{this._isCheckingStatus||(this._audioManager.playClick(),this._isSubscribing=!0,this._statusMessage="Opening Messages app...",this.render(),setTimeout(()=>{const i="sms:9401?body=OK",a=document.createElement("a");a.href=i;try{document.body.appendChild(a),a.click(),document.body.removeChild(a),setTimeout(()=>{const r=document.getElementById("sms-fallback-ui");r&&(r.style.display="block"),this._statusMessage="Complete the SMS subscription to activate EthioFantasy.";const n=e.querySelector(".status-msg-text");n&&(n.textContent=this._statusMessage)},1500)}catch{const n=document.getElementById("sms-fallback-ui");n&&(n.style.display="block")}},500))}),e.querySelector("#btn-copy-num")?.addEventListener("click",()=>{this._audioManager.playClick(),navigator.clipboard.writeText("9401"),this._statusMessage="Number copied to clipboard.",this.render()}),e.querySelector("#btn-copy-msg")?.addEventListener("click",()=>{this._audioManager.playClick(),navigator.clipboard.writeText("OK"),this._statusMessage="Message copied to clipboard.",this.render()})}}class ie{static _instance=null;_listeners=new Map;static getInstance(){return ie._instance||(ie._instance=new ie),ie._instance}constructor(){}on(e,t){this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t)}off(e,t){this._listeners.has(e)&&this._listeners.get(e).delete(t)}emit(e,t){this._listeners.has(e)&&this._listeners.get(e).forEach(i=>{try{i(t)}catch(a){console.error(`[EventBus] Error handling event '${e}':`,a)}})}}class me{static _instance;constructor(){}static getInstance(){return this._instance||(this._instance=new me),this._instance}async getAchievements(){return new Promise(e=>{setTimeout(()=>{e([{id:"prog_1",categoryId:"progress",titleEn:"Rookie",titleAm:"ጀማሪ",titleOm:"Jalqabaa",descriptionEn:"Reach level 5.",descriptionAm:"ደረጃ 5 ይድረሱ።",descriptionOm:"Sadarkaa 5 gahi.",icon:"⭐",isUnlocked:!0,progress:5,maxProgress:5,xpReward:500,dateUnlocked:new Date().toISOString()},{id:"prog_2",categoryId:"progress",titleEn:"Rising Star",titleAm:"አዲስ ኮከብ",titleOm:"Urjii Ba'u",descriptionEn:"Reach level 15.",descriptionAm:"ደረጃ 15 ይድረሱ።",descriptionOm:"Sadarkaa 15 gahi.",icon:"🌟",isUnlocked:!1,progress:12,maxProgress:15,xpReward:1500},{id:"prog_3",categoryId:"progress",titleEn:"Champion",titleAm:"ሻምፒዮን",titleOm:"Shaampiyoonaa",descriptionEn:"Reach level 30.",descriptionAm:"ደረጃ 30 ይድረሱ።",descriptionOm:"Sadarkaa 30 gahi.",icon:"🏆",isUnlocked:!1,progress:12,maxProgress:30,xpReward:3e3},{id:"prog_4",categoryId:"progress",titleEn:"Legend",titleAm:"አፈ ታሪክ",titleOm:"Leegandii",descriptionEn:"Reach level 50.",descriptionAm:"ደረጃ 50 ይድረሱ።",descriptionOm:"Sadarkaa 50 gahi.",icon:"👑",isUnlocked:!1,progress:12,maxProgress:50,xpReward:5e3},{id:"streak_1",categoryId:"daily_streak",titleEn:"3 Days Streak",titleAm:"የ3 ቀናት ተከታታይ",titleOm:"Walitti Fufiinsa Guyyaa 3",descriptionEn:"Play for 3 consecutive days.",descriptionAm:"ለ3 ተከታታይ ቀናት ይጫወቱ።",descriptionOm:"Guyyaa 3 walitti fufee taphadhu.",icon:"🔥",isUnlocked:!0,progress:3,maxProgress:3,xpReward:300,dateUnlocked:new Date().toISOString()},{id:"streak_2",categoryId:"daily_streak",titleEn:"7 Days Streak",titleAm:"የ7 ቀናት ተከታታይ",titleOm:"Walitti Fufiinsa Guyyaa 7",descriptionEn:"Play for a full week.",descriptionAm:"ለሙሉ ሳምንት ይጫወቱ።",descriptionOm:"Torban tokko guutuu taphadhu.",icon:"📅",isUnlocked:!1,progress:4,maxProgress:7,xpReward:1e3},{id:"quiz_1",categoryId:"quiz",titleEn:"First Correct Answer",titleAm:"የመጀመሪያ ትክክለኛ መልስ",titleOm:"Deebii Sirrii Jalqabaa",descriptionEn:"Answer your first question correctly.",descriptionAm:"የመጀመሪያ ጥያቄዎን በትክክል ይመልሱ።",descriptionOm:"Gaaffii jalqabaa sirriitti deebisi.",icon:"✅",isUnlocked:!0,progress:1,maxProgress:1,xpReward:100,dateUnlocked:new Date().toISOString()},{id:"quiz_2",categoryId:"quiz",titleEn:"Perfect Round",titleAm:"ፍጹም ዙር",titleOm:"Marsaa Guutuu",descriptionEn:"Answer all 10 questions correctly in a match.",descriptionAm:"በአንድ ጨዋታ ሁሉንም 10 ጥያቄዎች በትክክል ይመልሱ።",descriptionOm:"Tapha tokko keessatti gaaffilee hunda sirriitti deebisi.",icon:"🎯",isUnlocked:!1,progress:0,maxProgress:1,xpReward:2e3},{id:"rew_1",categoryId:"rewards",titleEn:"Airtime Reward",titleAm:"የአየር ሰዓት ሽልማት",titleOm:"Badhaasa Qilleensaa",descriptionEn:"Win a weekly tournament to earn 50 ETB airtime.",descriptionAm:"50 ብር የአየር ሰዓት ለማግኘት ሳምንታዊ ውድድር ያሸንፉ።",descriptionOm:"Qilleensa ETB 50 argachuuf tapha torbee mo'adhu.",icon:"📱",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!0,rewardType:"airtime",rewardAmount:"50 ETB",redeemed:!1}},{id:"rew_2",categoryId:"rewards",titleEn:"Data Package Reward",titleAm:"የዳታ ጥቅል ሽልማት",titleOm:"Badhaasa Daataa",descriptionEn:"Reach Champion rank to unlock a 1GB Data Package.",descriptionAm:"የ1GB ዳታ ጥቅል ለመክፈት የሻምፒዮን ደረጃ ይድረሱ።",descriptionOm:"Daataa 1GB banuuf sadarkaa shaampiyoonaa gahi.",icon:"🌐",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!0,rewardType:"data",rewardAmount:"1GB",redeemed:!1}},{id:"rew_3",categoryId:"rewards",titleEn:"Telebirr Prize",titleAm:"የቴሌብር ሽልማት",titleOm:"Badhaasa Telebirr",descriptionEn:"Monthly Champion gets a 500 ETB Telebirr deposit.",descriptionAm:"የወሩ ሻምፒዮን 500 ብር የቴሌብር ተቀማጭ ያገኛል።",descriptionOm:"Shaampiyooniin ji'aa Telebirr ETB 500 argata.",icon:"💳",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!1,rewardType:"telebirr",rewardAmount:"500 ETB"}},{id:"seas_1",categoryId:"seasonal",titleEn:"Ethiopian Premier League",titleAm:"የኢትዮጵያ ፕሪሚየር ሊግ",titleOm:"Piriimiyeer Liigii Itoophiyaa",descriptionEn:"Play 5 matches during the EPL special week.",descriptionAm:"በኢትዮጵያ ፕሪሚየር ሊግ ልዩ ሳምንት 5 ጨዋታዎችን ይጫወቱ።",descriptionOm:"Torbee EPL keessatti taphoota 5 taphadhu.",icon:"⚽",isUnlocked:!0,progress:5,maxProgress:5,xpReward:1e3,dateUnlocked:new Date().toISOString()},{id:"com_1",categoryId:"community",titleEn:"Invite Friends",titleAm:"ጓደኞችን ይጋብዙ",titleOm:"Hiriyoota Affeeri",descriptionEn:"Successfully invite 3 friends to the game.",descriptionAm:"3 ጓደኞችን በተሳካ ሁኔታ ወደ ጨዋታው ይጋብዙ።",descriptionOm:"Hiriyoota 3 gara taphaatti affeeri.",icon:"🤝",isUnlocked:!1,progress:1,maxProgress:3,xpReward:1500}])},600)})}}class mt{_uiManager;_saveManager;_audioManager;_onBack;_achievements=[];_activeTab="all";constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}async render(){const e=this._uiManager.container;e.innerHTML=`
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
                            ${S.LoadingState(s.currentLocale==="am"?"ስኬቶችን በመጫን ላይ...":"Loading achievements...")}
                        </div>
                    </div>
                </div>

                <!-- Detail Modal -->
                <div id="ach-detail-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2,6,23,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 24px;">
                    <div style="background: rgba(15,23,42,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 400px; position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 24px 48px rgba(0,0,0,0.5);">
                        <button id="btn-close-ach-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--fds-text-muted); font-size: 24px; cursor: pointer; padding: 8px;">✕</button>
                        <div id="ach-modal-content" style="display: flex; flex-direction: column; align-items: center; width: 100%;"></div>
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
                    background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%);
                    color: white;
                    border-color: rgba(74, 222, 128, 0.4);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
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
        `;const t=document.getElementById("achievements-app-bar-container");if(t){const i=s.currentLocale==="am"?"ስኬቶች":s.currentLocale==="om"?"Milkaa'ina":"Achievements";t.innerHTML=k.render(i),k.bind(t,()=>{this._audioManager.playClick(),this._onBack()})}try{this._achievements=await me.getInstance().getAchievements(),this._renderContent()}catch(i){console.error("Failed to load achievements",i);const a=document.getElementById("achievements-content");a&&(a.innerHTML=S.EmptyState("⚠️","Error","Failed to load achievements. Please try again."))}}_renderContent(){const e=document.getElementById("achievements-content");if(!e)return;const t=this._saveManager.profile,i=this._achievements.filter(c=>c.isUnlocked).length,a=this._achievements.length,r=a>0?Math.round(i/a*100):0;let n="";n+=`
            <div style="padding: 24px 16px 16px 16px;">
                <div class="glass-card" style="padding: 16px; border-radius: 16px; text-align: center; background: rgba(15,23,42,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="text-align: left;">
                            <div style="font-size: 11px; font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase; letter-spacing: 0.5px;">OVERALL COMPLETION</div>
                            <div style="font-size: 24px; font-weight: 900; color: white;">${r}%</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 11px; font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase; letter-spacing: 0.5px;">TOTAL XP</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--tv-gold-primary);">${t.xp} XP</div>
                        </div>
                    </div>

                    <div class="ach-progress-bg" style="height: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.4);">
                        <div class="ach-progress-fill" style="width: ${r}%; background: linear-gradient(90deg, #FBBF24, #22C55E);"></div>
                    </div>
                    
                    <div style="font-size: 13px; font-weight: 700; color: var(--fds-text-muted);">
                        UNLOCKED: <span style="color: white;">${i}</span> / ${a}
                    </div>
                </div>
            </div>
        `,n+=`
            <div style="padding: 0 16px 16px 16px; position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.8) 80%, rgba(2,6,23,0) 100%); backdrop-filter: blur(8px); margin: 0 -16px; padding-left: 16px;">
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px;" class="hide-scrollbar">
                    ${[{id:"all",label:"All"},{id:"progress",label:"Progress"},{id:"daily_streak",label:"Streak"},{id:"quiz",label:"Quiz"},{id:"rewards",label:"Rewards"},{id:"seasonal",label:"Seasonal"},{id:"community",label:"Community"}].map(c=>`
                        <button class="ach-tab ${this._activeTab===c.id?"active":""}" data-tab="${c.id}">
                            ${c.label}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;const l=this._activeTab==="all"?this._achievements:this._achievements.filter(c=>c.categoryId===this._activeTab);n+=`
            <div style="padding: 0 16px;">
                ${l.length>0?l.map(c=>this._buildAchievementCard(c)).join(""):S.EmptyState("🎁","No Achievements","Keep playing to unlock your first achievement.")}
            </div>
        `,e.innerHTML=n,this._bindTabs()}_buildAchievementCard(e){const t=s.currentLocale==="am"?e.titleAm:s.currentLocale==="om"?e.titleOm:e.titleEn,i=s.currentLocale==="am"?e.descriptionAm:s.currentLocale==="om"?e.descriptionOm:e.descriptionEn,a=Math.min(100,Math.round(e.progress/e.maxProgress*100)),r=e.isUnlocked?"unlocked":"locked";let n="";return e.categoryId==="rewards"&&e.rewardEligibility&&(n=`<div class="ethio-reward-tag">${e.rewardEligibility.rewardType}</div>`),`
            <div class="ach-card ${r}" data-id="${e.id}" style="cursor: pointer;">
                ${n}
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
                        <span>⭐</span> +${e.xpReward} XP
                    </div>
                </div>
            </div>
        `}_bindTabs(){document.querySelectorAll(".ach-tab").forEach(n=>{n.addEventListener("click",o=>{const c=o.currentTarget.getAttribute("data-tab");c&&c!==this._activeTab&&(this._audioManager.playClick(),this._activeTab=c,this._renderContent())})});const t=document.querySelectorAll(".ach-card"),i=document.getElementById("ach-detail-modal"),a=document.getElementById("ach-modal-content"),r=document.getElementById("btn-close-ach-modal");t.forEach(n=>{n.addEventListener("click",o=>{const c=o.currentTarget.getAttribute("data-id"),d=this._achievements.find(g=>g.id===c);if(d&&i&&a){this._audioManager.playClick();const g=s.currentLocale==="am"?d.titleAm:s.currentLocale==="om"?d.titleOm:d.titleEn,m=s.currentLocale==="am"?d.descriptionAm:s.currentLocale==="om"?d.descriptionOm:d.descriptionEn,x=Math.min(100,Math.round(d.progress/d.maxProgress*100)),y=d.isUnlocked?"linear-gradient(90deg, #4ADE80, #22C55E)":"linear-gradient(90deg, #FBBF24, #F59E0B)";a.innerHTML=`
                        <div style="font-size: 64px; margin-bottom: 16px; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${d.icon}</div>
                        <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 8px;">${g}</div>
                        <div style="font-size: 14px; color: var(--fds-text-muted); margin-bottom: 24px; max-width: 80%; line-height: 1.5;">${m}</div>
                        
                        <div style="width: 100%; max-width: 300px; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 800; color: white; margin-bottom: 8px;">
                                <span>PROGRESS</span>
                                <span>${d.progress} / ${d.maxProgress}</span>
                            </div>
                            <div class="ach-progress-bg" style="height: 8px; background: rgba(255,255,255,0.1); margin-bottom: 16px; margin-top: 0;">
                                <div class="ach-progress-fill" style="width: ${x}%; background: ${y};"></div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 800; color: white;">
                                <span>REWARD</span>
                                <span style="color: var(--tv-gold-primary);">+${d.xpReward} XP</span>
                            </div>
                        </div>
                        
                        <button id="btn-close-ach-modal-inner" class="ethio-profile-btn ethio-profile-btn-primary" style="max-width: 300px;">OK</button>
                    `,i.style.display="flex",document.getElementById("btn-close-ach-modal-inner")?.addEventListener("click",()=>{this._audioManager.playClick(),i.style.display="none"})}})}),r?.addEventListener("click",()=>{this._audioManager.playClick(),i&&(i.style.display="none")})}}class ae{static instance;constructor(){}static getInstance(){return ae.instance||(ae.instance=new ae),ae.instance}async getAwards(e){if(!_.isOnline||!h)return[];try{const{data:t,error:i}=await h.rpc("get_past_tournament_winners",{p_period_type:e});if(!i&&t&&Array.isArray(t))return t.map(a=>({awardId:`awd_${a.user_id}_${e}`,tournamentId:`trn_${e}`,tournamentType:e,rank:a.rank,userMsisdn:a.msisdn||"",maskedMsisdn:this.maskMsisdn(a.msisdn||""),prizeAmount:this.calculatePrize(a.rank,e),currency:"ETB",tournamentStartDate:"",tournamentEndDate:"",awardDate:new Date().toISOString(),createdAt:new Date().toISOString()}))}catch(t){console.error("[AwardsService] Failed to fetch awards",t)}return[]}calculatePrize(e,t){if(t==="monthly"){if(e===1)return 5e4;if(e===2)return 25e3;if(e===3)return 1e4}else if(t==="weekly"){if(e===1)return 1e4;if(e===2)return 5e3;if(e===3)return 2500}else{if(e===1)return 1e3;if(e===2)return 500;if(e===3)return 250}return 0}maskMsisdn(e){const t=e.replace("+","");if(t.length<9)return e;const i=t.substring(0,5),a=t.substring(t.length-2);return`${i}*****${a}`}}class ft{_uiManager;_audioManager;_onBack;_activeTab="daily";_awards=[];_loading=!0;_error=null;CURRENT_USER_MSISDN="+251911223344";constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i,this._loadAwards()}async _loadAwards(){this._loading=!0,this._error=null,this.render();try{this._awards=await ae.getInstance().getAwards(this._activeTab)}catch{this._error="Failed to load awards. Please try again."}finally{this._loading=!1,this.render()}}render(){const e=this._uiManager.container,t=i=>this._activeTab===i?`
                    flex: 1;
                    background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%);
                    border: 1px solid rgba(74, 222, 128, 0.4);
                    color: white;
                    font-weight: 900;
                    padding: 12px 0;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                    text-transform: uppercase;
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
                `:`
                    flex: 1;
                    background: rgba(15, 23, 42, 0.7);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: var(--fds-text-dim);
                    font-weight: 700;
                    padding: 12px 0;
                    border-radius: 12px;
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
                    ${k.render("My Awards")}

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
        `,this._bindEvents()}_renderContent(){if(this._loading)return S.LoadingState("Loading awards...");if(this._error)return`
                <div style="text-align: center; padding: 40px 16px;">
                    ${S.ErrorState("btn-retry-awards")}
                    <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-top: 12px;">${this._error}</div>
                </div>
            `;const e=this._awards.filter(i=>i.userMsisdn===this.CURRENT_USER_MSISDN);if(e.length===0)return`
                <div style="text-align: center; padding: 60px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 80px; margin-bottom: 24px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">🏆</div>
                    <div style="font-size: 20px; font-weight: 900; color: white; margin-bottom: 12px;">No tournament awards yet</div>
                    <div style="color: var(--fds-text-dim); font-size: 14px; margin-bottom: 32px; max-width: 280px; line-height: 1.5;">Compete in tournaments to earn rewards.</div>
                    <button class="ethio-profile-btn ethio-profile-btn-secondary" style="max-width: 240px;" id="btn-view-tournaments">VIEW TOURNAMENTS</button>
                </div>
            `;let t='<div style="display: flex; flex-direction: column; gap: 16px;" class="fade-in-up">';return e.forEach(i=>{t+=this._renderAwardCard(i)}),t+="</div>",t}_renderAwardCard(e){let t="";e.rank===1?t="🥇 1st Place":e.rank===2?t="🥈 2nd Place":e.rank===3?t="🥉 3rd Place":t=`🏅 ${e.rank}th Place`;const i=new Date(e.tournamentEndDate).toLocaleDateString("en-US",{month:"long",year:"numeric"});return`
            <div class="glass-card" style="
                padding: 16px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                background: rgba(15, 23, 42, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-radius: 16px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 15px; font-weight: 800; color: white;">
                        ${this._capitalize(e.tournamentType)} Tournament
                    </div>
                    <div style="background: rgba(34, 197, 94, 0.2); color: #4ADE80; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">
                        Paid
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 13px; font-weight: 700; color: var(--fds-text-dim);">Position</span>
                        <span style="font-size: 14px; font-weight: 800; color: var(--fds-text-main);">${t}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 13px; font-weight: 700; color: var(--fds-text-dim);">Award Amount</span>
                        <span style="font-size: 15px; font-weight: 900; color: var(--tv-gold-primary);">${e.prizeAmount.toLocaleString()} ${e.currency}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 13px; font-weight: 700; color: var(--fds-text-dim);">Date</span>
                        <span style="font-size: 14px; font-weight: 800; color: var(--fds-text-main);">${i}</span>
                    </div>
                </div>
            </div>
        `}_capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}_bindEvents(){const e=this._uiManager.container;k.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),e.querySelectorAll(".award-tab").forEach(t=>{t.addEventListener("click",i=>{const a=i.currentTarget.getAttribute("data-tab");a&&a!==this._activeTab&&(this._audioManager.playClick(),this._activeTab=a,this._loadAwards())})}),e.querySelector("#btn-view-tournaments")?.addEventListener("click",()=>{this._audioManager.playClick(),this._onBack()}),e.querySelector("#btn-retry-awards")?.addEventListener("click",()=>{this._audioManager.playClick(),this._loadAwards()})}}const vt=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(p,e,t){if(p==="click"){const i=e;e=async function(a){const r=a.currentTarget;if(r&&r.nodeType===Node.ELEMENT_NODE){if(r.hasAttribute("disabled")||r.hasAttribute("data-ethio-processing")){a.preventDefault(),a.stopImmediatePropagation();return}r.setAttribute("data-ethio-processing","true");const n=r.style.pointerEvents;r.style.pointerEvents="none";try{const o=i.call(this,a);o instanceof Promise&&await o}finally{setTimeout(()=>{r.removeAttribute("data-ethio-processing"),r.style.pointerEvents=n},300)}}else i.call(this,a)}}return vt.call(this,p,e,t)};async function yt(){const p=new De;await p.initialize();const e=R.getInstance(p.saveManager),t=U.getInstance(),i=ie.getInstance(),a=new Ne(p.uiManager);a.registerGame(new Ve),B.getInstance().subscribeToBadgeUpdates(u=>{E.setBadge("profile",u)});const r=window;r.ethioAudio=p.audioManager,r.ethioSave=p.saveManager,r.ethioAuth=e,r.ethioCache=t,r.ethioEvents=i;let n={home:["home"],play:["play"],standings:["standings"],profile:["profile"]},o="home",l=null;try{window.history.replaceState({root:!0},""),window.history.pushState({trap:!0},"")}catch{}const c=async(u,f=!0)=>{if(l&&typeof l.destroy=="function"&&l.destroy(),p.audioManager.stopAllGameplaySounds(),l=null,f){const b=n[o]||[];b.length>0&&b[b.length-1]!==u&&b.push(u)}switch(u){case"home":E.setActiveTab("home"),o="home",t.setQuizActive(!1);const b=new Ze(p.saveManager,p.audioManager,p.uiManager,{onKickOff:async()=>{t.setQuizActive(!0),a.getRegisteredGames().find(K=>K.metadata.id==="football-quiz").setCompetition("walia-ibex"),n[o].push("quiz_game"),await a.launchGame("football-quiz")},onLiveMatch:()=>c("matchmaking"),onDailyChallenge:()=>{c("play_single_path",!1)},onCompetitions:()=>d("standings"),onLeaderboard:()=>d("standings"),onAchievements:()=>d("profile"),onAdminPanel:()=>c("admin"),onSettings:()=>c("settings"),onNotifications:()=>c("notifications"),onViewStats:()=>c("stats"),onMessages:()=>c("messages"),onCasualPlay:async()=>{const z=a.getRegisteredGames().find(K=>K.metadata.id==="football-quiz");z.setCompetition("all"),z.matchType="casual",n[o].push("quiz_game"),await a.launchGame("football-quiz")}});l=b,b.render();break;case"play":E.setActiveTab("play"),o="play",t.setQuizActive(!1);const w=new et(p.uiManager,p.audioManager,{onCasualPlay:async z=>{const K=a.getRegisteredGames().find(Oe=>Oe.metadata.id==="football-quiz");K.setCompetition(z&&z!=="random"?z:"all"),K.matchType="casual",n[o].push("quiz_game"),await a.launchGame("football-quiz")}});l=w,w.render();break;case"standings":E.setActiveTab("standings"),o="standings",t.setQuizActive(!1);const M=new at(p.uiManager,p.saveManager,p.audioManager,m);l=M,await M.render();break;case"play_single_path":t.setQuizActive(!0);const A=await W.getInstance().getTodayChallenge(),I=a.getRegisteredGames().find(z=>z.metadata.id==="football-quiz");!A.completed&&A.questions.length>0?(I.setCompetition(A.questions[0]?.category||"world-cup"),I.setPreloadedQuestions(A.questions),I.matchType="daily",I.dailyChallengeId=A.id,n[o].push("quiz_game"),await a.launchGame("football-quiz")):(pe(()=>Promise.resolve().then(()=>Ke),void 0).then(z=>z.Toast.show(s.currentLocale==="am"?"የዕለቱ ውድድር አልቋል! 내일 ይሞክሩ":"Daily challenge already completed! Come back tomorrow.","error")),t.setQuizActive(!1),d("home"));break;case"profile":E.setActiveTab("profile"),o="profile",t.setQuizActive(!1);const O=new nt(p.uiManager,p.saveManager,p.audioManager,{onAchievements:()=>c("achievements"),onStatistics:()=>c("stats"),onLeaderboard:()=>d("standings"),onSubscription:()=>c("subscription"),onMessages:()=>c("messages"),onSettings:()=>c("settings"),onHelp:()=>c("help"),onAbout:()=>c("about"),onPrivacy:()=>c("privacy"),onTerms:()=>c("terms"),onAwards:()=>c("awards")});l=O,O.render();break;case"messages":t.setQuizActive(!1);const G=new st(p.uiManager,p.audioManager,m);l=G,G.render();break;case"settings":t.setQuizActive(!1);const Q=new re(p.uiManager,p.saveManager,p.audioManager,m,"main");l=Q,Q.render();break;case"help":t.setQuizActive(!1);const oe=new re(p.uiManager,p.saveManager,p.audioManager,m,"help");l=oe,oe.render();break;case"achievements":t.setQuizActive(!1);const le=new mt(p.uiManager,p.saveManager,p.audioManager,m);l=le,le.render();break;case"awards":t.setQuizActive(!1);const D=new ft(p.uiManager,p.audioManager,m);l=D,D.render();break;case"about":t.setQuizActive(!1);const fe=new re(p.uiManager,p.saveManager,p.audioManager,m,"about");l=fe,fe.render();break;case"privacy":t.setQuizActive(!1);const ve=new re(p.uiManager,p.saveManager,p.audioManager,m,"privacy");l=ve,ve.render();break;case"terms":t.setQuizActive(!1);const ye=new re(p.uiManager,p.saveManager,p.audioManager,m,"terms");l=ye,ye.render();break;case"notifications":t.setQuizActive(!1);const be=new ut(p.uiManager,p.audioManager,m);l=be,be.render();break;case"admin":t.setQuizActive(!1);const xe=new Xe(p.uiManager,p.audioManager,m);l=xe,xe.render();break;case"matchmaking":t.setQuizActive(!1);const _e=new rt(p.uiManager,p.audioManager,p.saveManager,async z=>{r.ethioLiveMatchInfo=z,c("live_match")},m);l=_e,await _e.render();break;case"live_match":t.setQuizActive(!0);const ce=r.ethioLiveMatchInfo;if(!ce){m();return}const $e=await N.getInstance().fetchQuestionsByIds(ce.questionIds,s.currentLocale),we=new lt(p.uiManager,p.audioManager,p.saveManager,ce.liveMatchId,ce.opponent,$e,m);l=we,we.startMatch();break;case"stats":t.setQuizActive(!1);const ke=new ht(p.uiManager,p.saveManager,p.audioManager,m);l=ke,ke.render();break;case"subscription":t.setQuizActive(!1);const Se=new gt(p.uiManager,p.audioManager,m);l=Se,Se.render();break}},d=u=>{const f=n[u],b=f[f.length-1];if(o===u){if(b===u)return;n[u]=[u],c(u,!0);return}o=u,c(b,!0)};r.ethioReloadHome=()=>d("home"),r.ethioHandleBack=()=>{m()},r.ethioCloseGame=()=>{t.setQuizActive(!1);const u=n[o]||[];u.length>0&&(u[u.length-1]==="quiz_game"||u[u.length-1]==="match_stats")&&u.pop();const f=u.length>0?u[u.length-1]:o;c(f,!1)},r.ethioForceHome=()=>{t.setQuizActive(!1);const u=n[o]||[];u.length>0&&(u[u.length-1]==="quiz_game"||u[u.length-1]==="match_stats")&&u.pop(),n.home=["home"],o="home",c("home",!0)},i.on("RELOAD_CURRENT_VIEW",()=>{t.isQuizActive||(console.log("[Bootstrap] Reloading current view upon event trigger."),c(o,!1))}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&!t.isQuizActive&&(console.log("[Bootstrap] App resumed. Triggering background refresh for stale data."),i.emit("DATA_REFRESHED"))});const g=()=>{const u=navigator.onLine;let f=document.getElementById("ethio-offline-banner");u?(f&&(f.style.background="var(--fds-green-pitch)",f.innerHTML="<span>✅</span><span>Connection restored! Refreshing data...</span>",setTimeout(()=>{f?.remove()},2e3)),t.isQuizActive||(console.log("[Bootstrap] Network restored. Triggering reconnection data sync."),i.emit("NETWORK_RESTORED"),i.emit("RELOAD_CURRENT_VIEW"))):f||(f=document.createElement("div"),f.id="ethio-offline-banner",f.style.cssText=`
                    position: fixed; top: 0; left: 0; width: 100vw;
                    background: #EF4444; color: white; text-align: center;
                    font-size: 13px; font-weight: 800; padding: 8px 12px; z-index: 99999;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex;
                    align-items: center; justify-content: center; gap: 8px; font-family: sans-serif;
                `,f.innerHTML="<span>⚠️</span><span>No internet connection. Paused. Reconnecting...</span>",document.body.appendChild(f))};window.addEventListener("online",g),window.addEventListener("offline",g);const m=()=>{const u=n[o]||[];if(typeof window.ethioOnBackPress=="function"&&window.ethioOnBackPress())return;p.audioManager.playClick();const f=document.querySelector('#session-recovery-overlay, #ethio-exit-modal, #ethio-leave-modal, .glass-card-modal, [id*="modal"]');if(f){f.remove();return}if(t.isQuizActive){x();return}if(u.length>1){u.pop();const b=u[u.length-1];(b==="quiz_game"||b==="match_stats")&&u.pop();const w=u.length>0?u[u.length-1]:o;c(w,!1)}else o==="home"?y():d("home")},x=()=>{if(document.getElementById("ethio-leave-modal"))return;const f=document.createElement("div");f.id="ethio-leave-modal",f.style.cssText=`
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
        `,document.body.appendChild(f),document.getElementById("leave-btn-continue")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove()}),document.getElementById("leave-btn-leave")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove(),t.setQuizActive(!1);const b=n[o]||[];b.length>0&&b[b.length-1]==="quiz_game"&&b.pop();const w=b.length>0?b[b.length-1]:o;c(w,!1)})},y=()=>{if(document.getElementById("ethio-exit-modal"))return;const f=document.createElement("div");f.id="ethio-exit-modal",f.style.cssText=`
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
        `,document.body.appendChild(f),document.getElementById("exit-btn-stay")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove()}),document.getElementById("exit-btn-confirm")?.addEventListener("click",()=>{p.audioManager.playClick(),f.remove(),window.navigator?.app?.exitApp?window.navigator.app.exitApp():window.Android?.exitApp?window.Android.exitApp():window.close()})};window.addEventListener("popstate",u=>{u.preventDefault();try{window.history.pushState({trap:!0},"")}catch{}m()}),window.addEventListener("keydown",u=>{(u.key==="Escape"||u.key==="Back")&&m()}),r.ethioReloadHome=()=>d("home"),r.ethioNavigateToTab=u=>d(u),r.ethioPlayAgain=async u=>{t.setQuizActive(!0),a.getRegisteredGames().find(b=>b.metadata.id==="football-quiz").setCompetition(u),n[o]||(n[o]=[o]),n[o].push("quiz_game"),await a.launchGame("football-quiz")},E.render(u=>{d(u)});let v=null;return e.subscribe(u=>{const f=u?.id!==v;if(v=u?.id||null,!u)console.log("[Bootstrap] User signed out. Invalidating cache."),t.clear(),E.hide(),new it(p.uiManager,p.audioManager,e,()=>{}).render();else if(console.log("[Bootstrap] User authenticated. Refreshing profile & channels:",u.username),E.show(),J.getInstance().initUserChannels(u.id),i.emit("PROFILE_UPDATED",u),f){$.getInstance().getActiveSession()&&$.getInstance().clearSession(),n={home:["home"],play:["play"],standings:["standings"],profile:["profile"]},o="home",c("home",!1);try{window.history.replaceState({root:!0},""),window.history.pushState({trap:!0},"")}catch{}}}),console.log("[Bootstrap] ⚽ Smart Caching & Refresh Strategy initialized."),p}async function bt(){try{await yt()}catch(p){console.error(p);const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.innerText=`Runtime Error: ${p.message||p}

Stack: ${p.stack||""}`,document.body.appendChild(e)}}window.addEventListener("error",p=>{const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.style.zIndex="999999",e.innerText=`Global Error: ${p.message}
At: ${p.filename}:${p.lineno}`,document.body.appendChild(e)});window.addEventListener("unhandledrejection",p=>{const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="100px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.style.zIndex="999999",e.innerText=`Unhandled Promise Rejection: ${p.reason}`,document.body.appendChild(e)});bt().catch(console.error);export{h as a,_ as s};
