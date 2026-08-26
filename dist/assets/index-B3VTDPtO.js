const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/TournamentService-B856ECCy.js","assets/supabase-kic3bLQH.js"])))=>i.map(i=>d[i]);
import{c as Pe}from"./supabase-kic3bLQH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();const Re="modulepreload",De=function(p){return"/"+p},Me={},pe=function(e,t,i){let a=Promise.resolve();if(t&&t.length>0){let o=function(d){return Promise.all(d.map(c=>Promise.resolve(c).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");a=o(t.map(d=>{if(d=De(d),d in Me)return;Me[d]=!0;const c=d.endsWith(".css"),h=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${h}`))return;const g=document.createElement("link");if(g.rel=c?"stylesheet":Re,c||(g.as="script"),g.crossOrigin="",g.href=d,l&&g.setAttribute("nonce",l),document.head.appendChild(g),c)return new Promise((f,x)=>{g.addEventListener("load",f),g.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return a.then(o=>{for(const s of o||[])s.status==="rejected"&&n(s.reason);return e().catch(n)})};class He{_container;constructor(){let e=document.getElementById("ui-root");e||(e=document.createElement("div"),e.id="ui-root",e.style.position="absolute",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.fontFamily="system-ui, -apple-system, sans-serif",document.body.appendChild(e)),this._container=e}get container(){return this._container}clear(){this._container.innerHTML="",this._container.classList.remove("page-transition-enter"),this._container.offsetWidth,this._container.classList.add("page-transition-enter")}}const Ce="https://eywvrsqiqvmiktovaxmq.supabase.co",Ne="sb_publishable_vSzKiN0dx8mgRRb3jsDonQ_BesE-gSx";class J{static _instance=null;_client=null;constructor(){try{this._client=Pe(Ce,Ne,{auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:window.sessionStorage},realtime:{params:{eventsPerSecond:10}}}),console.log("[SupabaseClient] Initialized successfully with URL:",Ce)}catch(e){console.error("[SupabaseClient] Failed to initialize Supabase client:",e),this._client=null}}static getInstance(){return J._instance||(J._instance=new J),J._instance}get client(){return this._client}get isOnline(){return this._client!==null}}const w=J.getInstance(),m=w.client,Ue=Object.freeze(Object.defineProperty({__proto__:null,supabase:m,supabaseService:w},Symbol.toStringTag,{value:"Module"}));class $e{_profile;_cloudUserId=null;constructor(){this._profile=this._defaultProfile()}get cloudUserId(){return this._cloudUserId}_defaultProfile(){return{username:"Player",coins:0,xp:0,highScores:{"football-quiz":0},unlockedItems:["default-ball","default-jersey"],eloRating:0,streakCount:0,totalMatches:0,totalWins:0}}syncWithCloudUser(e){this._cloudUserId=e.id,this._profile.username=e.username,this._profile.coins=e.coins,this._profile.xp=e.xp,this._profile.eloRating=e.elo_rating,this._profile.streakCount=e.streak_count,this._profile.totalMatches=e.total_matches,this._profile.totalWins=e.total_wins,e.phone&&(this._profile.phone=e.phone),this.save()}save(){const e=w.client;if(this._cloudUserId&&e){let t=0;if(this._profile.highScores)for(const i in this._profile.highScores)t+=this._profile.highScores[i];e.from("users").update({username:this._profile.username,coins:this._profile.coins,xp:this._profile.xp,score:t,elo_rating:this._profile.eloRating||0,streak_count:this._profile.streakCount||0,total_matches:this._profile.totalMatches||0,total_wins:this._profile.totalWins||0,last_active:new Date().toISOString()}).eq("id",this._cloudUserId).then(({error:i})=>{i&&console.error("[SaveManager] Error syncing profile to cloud:",i)})}}get profile(){return this._profile}updateUsername(e){this._profile.username=e,this.save()}updateHighScore(e,t){const i=this._profile.highScores[e]||0;return t>i?(this._profile.highScores[e]=t,this._profile.xp+=Math.floor(t*.5),this.save(),!0):!1}addCoins(e){this._profile.coins+=e,this.save()}addXp(e){this._profile.xp+=e,this.save()}incrementMatchStats(e){this._profile.totalMatches=(this._profile.totalMatches||0)+1,e&&(this._profile.totalWins=(this._profile.totalWins||0)+1),this.save()}updateStreak(e){this._profile.streakCount=e,this.save()}isAdmin(){return this._profile.role==="admin"}}class ze{_ctx=null;_isMuted=!1;_answerSelectedBuffer=null;_correctAnswerBuffer=null;_wrongAnswerBuffer=null;_whistleBuffer=null;_activeQuizSound=null;constructor(){const e=localStorage.getItem("ETHIO_FOOTBALL_MUTED");e!==null&&(this._isMuted=e==="true"),typeof document<"u"&&document.addEventListener("visibilitychange",()=>{document.hidden&&this.stopAllQuizAudio(.05)})}stopAllQuizAudio(e=.08){if(!this._ctx||!this._activeQuizSound)return;const t=this._activeQuizSound;this._activeQuizSound=null,t.timeoutId&&clearTimeout(t.timeoutId);const i=this._ctx.currentTime;try{t.gain.gain.cancelScheduledValues(i),t.gain.gain.setValueAtTime(t.gain.gain.value,i),t.gain.gain.linearRampToValueAtTime(.01,i+e),t.source.stop(i+e+.02)}catch{}}_playQuizSound(e,t){return this.stopAllQuizAudio(.02),!e||(this._initContext(),!this._ctx)?Promise.resolve():new Promise(i=>{const a=this._ctx.createBufferSource();a.buffer=e;const n=this._ctx.createGain();n.gain.value=t,a.connect(n),n.connect(this._ctx.destination),a.onended=()=>i(),a.start(this._ctx.currentTime),this._activeQuizSound={source:a,gain:n,timeoutId:void 0}})}_initContext(){if(!this._ctx){const e=window.AudioContext||window.webkitAudioContext;this._ctx=new e,console.log("[AudioManager] Football stadium Web AudioContext initialized.")}this._ctx.state==="suspended"&&this._ctx.resume()}_vibrate(e){if(!this._isMuted&&typeof navigator<"u"&&navigator.vibrate)try{navigator.vibrate(e)}catch{}}playClick(){if(this._isMuted||(this._vibrate(10),this._initContext(),!this._ctx))return;const e=this._ctx.createOscillator(),t=this._ctx.createGain();e.type="sine",e.frequency.setValueAtTime(800,this._ctx.currentTime),e.frequency.exponentialRampToValueAtTime(400,this._ctx.currentTime+.05),t.gain.setValueAtTime(.15,this._ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this._ctx.currentTime+.05),e.connect(t),t.connect(this._ctx.destination),e.start(),e.stop(this._ctx.currentTime+.05)}async preloadAssets(){if(!this._isMuted)try{const[e,t,i,a]=await Promise.all([fetch("/assets/audios/Answer%20selected.m4a"),fetch("/assets/audios/Right%20Answer%20or%20score%20goal.m4a"),fetch("/assets/audios/wrong%20answer.m4a"),fetch("/assets/audios/whistle%20when%20game%20ends.m4a")]);if(!this._ctx){const n=window.AudioContext||window.webkitAudioContext;this._ctx=new n}if(e.ok){const n=await e.arrayBuffer();this._answerSelectedBuffer=await this._ctx.decodeAudioData(n)}if(t.ok){const n=await t.arrayBuffer();this._correctAnswerBuffer=await this._ctx.decodeAudioData(n)}if(i.ok){const n=await i.arrayBuffer();this._wrongAnswerBuffer=await this._ctx.decodeAudioData(n)}if(a.ok){const n=await a.arrayBuffer();this._whistleBuffer=await this._ctx.decodeAudioData(n)}console.log("[AudioManager] 4 Quiz Audio assets preloaded successfully.")}catch(e){console.warn("[AudioManager] Failed to preload audio assets",e)}}playQuizAnswerSelected(){return this._isMuted?Promise.resolve():this._playQuizSound(this._answerSelectedBuffer,.4)}playQuizCorrectAnswer(){return this._isMuted?Promise.resolve():(this._vibrate([30,40,30]),this._playQuizSound(this._correctAnswerBuffer,.8))}playQuizWrongAnswer(){return this._isMuted?Promise.resolve():(this._vibrate([40,20,40]),this._playQuizSound(this._wrongAnswerBuffer,.7))}playQuizWhistle(){return this._isMuted?Promise.resolve():(this._vibrate([30,40,30]),this._playQuizSound(this._whistleBuffer,.75))}toggleMute(){return this._isMuted=!this._isMuted,localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(this._isMuted)),this._isMuted&&this.stopAllQuizAudio(),this._isMuted}get isMuted(){return this._isMuted}}class Ge{_uiManager;_saveManager;_audioManager;constructor(){this._uiManager=new He,this._saveManager=new $e,this._audioManager=new ze}async initialize(){this._audioManager.preloadAssets()}get uiManager(){return this._uiManager}get saveManager(){return this._saveManager}get audioManager(){return this._audioManager}}class Qe{_games=new Map;_activeGame=null;_uiManager;constructor(e){this._uiManager=e}registerGame(e){this._games.set(e.metadata.id,e),console.log(`[GameRegistry] Registered game: ${e.metadata.name} (${e.metadata.id})`)}getRegisteredGames(){return Array.from(this._games.values())}async launchGame(e){this._activeGame&&(console.log(`[GameRegistry] Destroying active game: ${this._activeGame.metadata.name}`),this._activeGame.destroy(),this._uiManager.clear());const t=this._games.get(e);if(!t)throw new Error(`[GameRegistry] Game with ID '${e}' not found.`);console.log(`[GameRegistry] Initializing game: ${t.metadata.name}`),await t.initialize(this._uiManager),this._activeGame=t,t.start()}get activeGame(){return this._activeGame}}class je{_goals=0;_correct=0;_incorrect=0;_total=0;_currentCombo=0;_maxCombo=0;_responseTimes=[];_answerSubmissions=[];reset(){this._goals=0,this._correct=0,this._incorrect=0,this._total=0,this._currentCombo=0,this._maxCombo=0,this._responseTimes=[],this._answerSubmissions=[]}recordAnswer(e,t,i,a){if(this._total++,this._responseTimes.push(t),i&&a!==void 0&&this._answerSubmissions.push({questionId:i,selectedIndex:a,responseTimeMs:Math.round(t*1e3)}),e){this._goals++,this._correct++,this._currentCombo++,this._currentCombo>this._maxCombo&&(this._maxCombo=this._currentCombo);const n=100,o=(this._currentCombo-1)*25,s=n+o,l=20+this._currentCombo*5;return{isGoal:!0,coins:s,xp:l}}else return this._incorrect++,this._currentCombo=0,{isGoal:!1,coins:0,xp:0}}get answerSubmissions(){return this._answerSubmissions}calculateFinalStats(){const e=this._total>0?Math.round(this._correct/this._total*100):0,t=Math.min(Math.max(Math.round(e*.85+15),30),85),i=this._responseTimes.reduce((d,c)=>d+c,0),a=this._responseTimes.length>0?parseFloat((i/this._responseTimes.length).toFixed(1)):0,n=this._correct*100+this._maxCombo*50,o=this._correct*20+this._maxCombo*10;let s=5+e/20+this._maxCombo*.4;a>0&&a<5&&(s+=1);const l=parseFloat(Math.min(Math.max(s,3),10).toFixed(1));return{goals:this._goals,correctAnswers:this._correct,incorrectAnswers:this._incorrect,totalQuestions:this._total,accuracy:e,possessionPercent:t,avgResponseTime:a,maxCombo:this._maxCombo,coinsEarned:n,xpEarned:o,matchRating:l}}}const Oe={"world-cup":{id:"world-cup",nameEn:"FIFA World Cup",nameAm:"የዓለም ዋንጫ",nameOm:"Waancaa Addunyaa FIFA",badge:"🏆",description:"World Cup history, records, hosts, and legend moments"},"champions-league":{id:"champions-league",nameEn:"UEFA Champions League",nameAm:"UEFA ቻምፒየንስ ሊግ",nameOm:"Liigii Chaampiyoonsii UEFA",badge:"⭐",description:"European club football, iconic finals, and top scorers"},"caf-champions":{id:"caf-champions",nameEn:"CAF Champions League",nameAm:"የCAF ሻምፒዮንስ ሊግ",nameOm:"Liigii Chaampiyoonsii CAF",badge:"🌍",description:"African club football and continental showdowns"},afcon:{id:"afcon",nameEn:"Africa Cup of Nations (AFCON)",nameAm:"የአፍሪካ ዋንጫ (AFCON)",nameOm:"Waancaa Afriikaa (AFCON)",badge:"🦁",description:"Africa's flagship national team championship"},"ethiopian-premier":{id:"ethiopian-premier",nameEn:"Ethiopian Premier League",nameAm:"የኢትዮጵያ ፕሪሚየር ሊግ",nameOm:"Liigii Piriimeraa Itoophiyaa",badge:"🇪🇹",description:"Ethiopian club teams, derbies, and domestic history"},"walia-ibex":{id:"walia-ibex",nameEn:"Walia Ibex (National Team)",nameAm:"ዋሊያ ኢቤክስ (ብሔራዊ ቡድን)",nameOm:"Waaliyaa Ibeks (Garaa Guutuu)",badge:"🐐",description:"Ethiopian national team milestones and heroes"},"premier-league":{id:"premier-league",nameEn:"English Premier League",nameAm:"የእንግሊዝ ፕሪሚየር ሊግ",nameOm:"Liigii Piriimeraa Ingilaand",badge:"🦁",description:"EPL clubs, managers, top scorers, and records"},"la-liga":{id:"la-liga",nameEn:"Spanish La Liga",nameAm:"የስፔን ላ ሊጋ",nameOm:"Laa Liigaa Ispeen",badge:"🇪🇸",description:"El Clásico, Spanish giants, and title races"},"serie-a":{id:"serie-a",nameEn:"Italian Serie A",nameAm:"የጣሊያን ሰሪ ኤ",nameOm:"Seeriyee A Xaaliyaanii",badge:"🇮🇹",description:"Calcio history, tactical legends, and Italian clubs"},bundesliga:{id:"bundesliga",nameEn:"German Bundesliga",nameAm:"የጀርመን ቡንደስሊጋ",nameOm:"Buundesliigaa Jarmaan",badge:"🇩🇪",description:"German football powerhouses and records"},"legendary-players":{id:"legendary-players",nameEn:"Legendary Players",nameAm:"አፈ ታሪክ ተጫዋቾች",nameOm:"Taphattootaa Seenaa",badge:"👟",description:"All-time greats, Ballon d'Or winners, and icons"},"football-rules":{id:"football-rules",nameEn:"Football Rules & Laws",nameAm:"የእግር ኳስ ሕግጋት",nameOm:"Seera Kubbaa Miilaa",badge:"📏",description:"Laws of the game, offside rule, VAR, and refereeing"},"transfer-market":{id:"transfer-market",nameEn:"Transfer Market & Fees",nameAm:"የዝውውር ገበያ",nameOm:"Gabaa Dabarsaa",badge:"💰",description:"Record transfer fees, contracts, and market moves"},stadiums:{id:"stadiums",nameEn:"Stadiums & Venues",nameAm:"ስታዲየሞች",nameOm:"Istaadiyeemota",badge:"🏟️",description:"Iconic football grounds, capacities, and host cities"},"football-history":{id:"football-history",nameEn:"Football History",nameAm:"የእግር ኳስ ታሪክ",nameOm:"Seenaa Kubbaa Miilaa",badge:"📜",description:"Origins, historic matches, and global football lore"}};class M{static _competitions=new Map;static _isInitialized=!1;static _initDefaults(){M._isInitialized||(Object.values(Oe).forEach(e=>{M._competitions.set(e.id,{id:e.id,name:e.nameEn,nameEn:e.nameEn,nameAm:e.nameAm,nameOm:e.nameOm,badge:e.badge,description:e.description,color:"#FFD54F",questionCount:10,status:"live",participants:0,prize_pool:0})}),M._isInitialized=!0)}static getAll(e="en"){return M._initDefaults(),Array.from(M._competitions.values()).map(t=>{let i=t.nameEn;return e==="am"&&t.nameAm&&(i=t.nameAm),e==="om"&&t.nameOm&&(i=t.nameOm),{...t,name:i}})}static getById(e,t="en"){M._initDefaults();const i=M._competitions.get(e);if(!i)return;let a=i.nameEn;return t==="am"&&i.nameAm&&(a=i.nameAm),t==="om"&&i.nameOm&&(a=i.nameOm),{...i,name:a}}static async syncFromCloud(e="en"){if(M._initDefaults(),w.isOnline&&m)try{const{data:t,error:i}=await m.from("competitions").select("*").eq("is_active",!0);if(!i&&t&&t.length>0){let a=0;try{const{count:n,error:o}=await m.from("game_sessions").select("*",{count:"exact",head:!0}).eq("state","playing");!o&&n&&(a=n)}catch{}t.forEach(n=>{M._competitions.set(n.id,{id:n.id,name:n.name_en,nameEn:n.name_en,nameAm:n.name_am||void 0,nameOm:n.name_om||void 0,badge:n.badge,description:n.description_en||"",color:n.color||"#FFD54F",questionCount:n.question_count||10,status:"live",participants:a,prize_pool:0})})}}catch(t){console.warn("[CompetitionRegistry] Cloud sync failed, using defaults:",t)}return M.getAll(e)}static addCompetition(e){M._initDefaults(),M._competitions.set(e.id,e),console.log(`[CompetitionRegistry] Added competition: ${e.name}`)}static removeCompetition(e){return M._competitions.delete(e)}}class ue{static async invoke(e,t){if(!w.isOnline||!m)return{data:null,error:`Supabase client offline. Edge function '${e}' unavailable.`};try{const{data:i,error:a}=await m.functions.invoke(e,{body:t});return a?(console.error(`[EdgeFunctionClient] Error calling '${e}':`,a),{data:null,error:a.message}):{data:i,error:null}}catch(i){return console.error(`[EdgeFunctionClient] Exception in '${e}':`,i),{data:null,error:i.message||"Edge function invocation failed."}}}}const We=[{id:"fb-1",category:"walia-ibex",difficulty:2,prompt:"Which country won the first ever African Cup of Nations (AFCON) in 1957?",options:["Egypt","Ethiopia","Sudan","South Africa"],correctIndex:0,explanation:"Egypt defeated Ethiopia 4-0 in the final of the inaugural Africa Cup of Nations.",fact:"Only three nations participated in the first AFCON: Egypt, Ethiopia, and Sudan. South Africa was disqualified due to apartheid.",learningTip:"Remember '1957' as the birth year of AFCON."},{id:"fb-2",category:"walia-ibex",difficulty:1,prompt:"What is the nickname of the Ethiopian National Football Team?",options:["The Lions","Walia Ibex","The Pharoahs","Black Stars"],correctIndex:1,explanation:"The Walia Ibex is an endangered species of ibex found only in the Simien Mountains of Ethiopia."},{id:"fb-3",category:"ethiopian-premier",difficulty:3,prompt:"Which club holds the record for the most Ethiopian Premier League titles?",options:["Ethiopian Coffee SC","Dedebit FC","Fasil Kenema","Saint George SC"],correctIndex:3},{id:"fb-4",category:"ethiopian-premier",difficulty:3,prompt:"In which year was the Ethiopian Premier League established in its current format?",options:["1985","1997","2002","2010"],correctIndex:1},{id:"fb-5",category:"walia-ibex",difficulty:4,prompt:"Who is Ethiopia's all-time top goalscorer in international football?",options:["Getaneh Kebede","Saladin Said","Mengistu Worku","Adane Girma"],correctIndex:0},{id:"fb-6",category:"world-cup",difficulty:1,prompt:"Which nation has won the most FIFA Men's World Cup titles?",options:["Germany","Brazil","Argentina","Italy"],correctIndex:1},{id:"fb-7",category:"world-cup",difficulty:2,prompt:"Who won the Golden Boot in the 2022 FIFA World Cup?",options:["Lionel Messi","Kylian Mbappé","Julián Álvarez","Olivier Giroud"],correctIndex:1},{id:"fb-8",category:"champions-league",difficulty:2,prompt:"Which player has scored the most goals in UEFA Champions League history?",options:["Lionel Messi","Robert Lewandowski","Cristiano Ronaldo","Karim Benzema"],correctIndex:2},{id:"fb-9",category:"premier-league",difficulty:3,prompt:"Which team holds the record for most points in a single English Premier League season?",options:["Manchester United","Liverpool","Chelsea","Manchester City"],correctIndex:3},{id:"fb-10",category:"walia-ibex",difficulty:4,prompt:"Ethiopia won its only African Cup of Nations title in which year?",options:["1957","1962","1970","1982"],correctIndex:1,fact:"Ydnekatchew Tessema was one of the most influential figures in Ethiopian football history.",learningTip:"Ethiopia hosted and won the 1962 tournament, defeating Egypt 4-2 in the final after extra time."},{id:"fb-11",category:"premier-league",difficulty:2,prompt:"Who is the all-time top scorer of the English Premier League?",options:["Wayne Rooney","Alan Shearer","Harry Kane","Thierry Henry"],correctIndex:1},{id:"fb-12",category:"ethiopian-premier",difficulty:2,prompt:"What colors are primarily associated with Ethiopian Coffee SC?",options:["Green and Yellow","Red and White","Brown and Gold","Blue and White"],correctIndex:2},{id:"fb-13",category:"world-cup",difficulty:4,prompt:"Which African nation became the first to reach a FIFA World Cup Semi-Final?",options:["Senegal","Ghana","Morocco","Nigeria"],correctIndex:2},{id:"fb-14",category:"champions-league",difficulty:3,prompt:"Which club has won the most UEFA Champions League titles?",options:["AC Milan","Bayern Munich","Liverpool","Real Madrid"],correctIndex:3},{id:"fb-15",category:"walia-ibex",difficulty:5,prompt:"Who coached the Ethiopian National Team when they qualified for the 2013 AFCON?",options:["Bishaw Sewnet","Asrat Haile","Yohannes Sahle","Wubetu Abate"],correctIndex:0}];class N{static _instance=null;_askedQuestionIds=new Set;static getInstance(){return N._instance||(N._instance=new N),N._instance}async fetchQuestions(e,t=10,i="en",a=[],n="casual"){if(w.isOnline)try{const{data:s,error:l}=await ue.invoke("questions",{competitionId:e,count:t*2,locale:i,excludeIds:a,usageType:n});if(!l&&s&&s.questions&&s.questions.length>0)return console.log("[QuestionBank] Fetched server-authored questions via Edge Function."),this._selectQuestions(s.questions,t)}catch(s){console.warn("[QuestionBank] Edge Function failed.",s)}if(w.isOnline&&m)try{let s=m.from("questions").select("*").eq("is_active",!0);n==="casual"?s=s.eq("usage_type","casual"):n==="tournament"&&(s=s.eq("usage_type","tournament")),e&&e!=="all"&&(s=s.or(`competition_id.eq.${e},category.eq.${e}`)),a&&a.length>0&&(s=s.not("id","in",`(${a.join(",")})`));const{data:l,error:d}=await s.limit(50);if(!d&&l&&l.length>0){console.log("[QuestionBank] Fetched questions directly from Supabase DB.");const c=l.map(h=>this._mapQuestionRow(h,i));return this._selectQuestions(c,t)}}catch(s){console.warn("[QuestionBank] Supabase DB question fetch error:",s)}console.warn("[QuestionBank] Server connection unavailable. Serving fallback offline questions.");let o=We;if(e){const s=o.filter(l=>l.category===e);s.length>=Math.min(t,5)&&(o=s)}return a&&a.length>0&&(o=o.filter(s=>!a.includes(s.id))),this._selectQuestions(o,t)}async fetchQuestionsByIds(e,t="en"){if(w.isOnline&&m&&e.length>0)try{const{data:i,error:a}=await m.from("questions").select("*").in("id",e);if(!a&&i&&i.length>0){console.log(`[QuestionBank] Fetched ${i.length} specific questions by ID.`);const n=i.map(s=>this._mapQuestionRow(s,t,!1)),o=[];for(const s of e){const l=n.find(d=>d.id===s);l&&o.push(l)}return o}}catch(i){console.warn("[QuestionBank] Supabase DB fetchQuestionsByIds error:",i)}return this.fetchQuestions(void 0,e.length,t)}_mapQuestionRow(e,t,i=!0){let a=e.prompt_en,n=e.options_en;t==="am"&&e.prompt_am&&e.options_am?(a=e.prompt_am,n=e.options_am):t==="om"&&e.prompt_om&&e.options_om&&(a=e.prompt_om,n=e.options_om);let o=n,s=e.correct_index;if(i){const l=[0,1,2,3];for(let d=l.length-1;d>0;d--){const c=Math.floor(Math.random()*(d+1));[l[d],l[c]]=[l[c],l[d]]}o=l.map(d=>n[d]),s=l.indexOf(e.correct_index)}return{id:e.id,category:e.category,difficulty:e.difficulty,prompt:a,options:o,correctIndex:s}}_selectQuestions(e,t){let i=e.filter(s=>s.id&&!this._askedQuestionIds.has(s.id));i.length<t&&(this._askedQuestionIds.clear(),i=e);const n=[...i.length>=t?i:e];for(let s=n.length-1;s>0;s--){const l=Math.floor(Math.random()*(s+1));[n[s],n[l]]=[n[l],n[s]]}const o=n.slice(0,t);for(o.forEach(s=>{s.id&&this._askedQuestionIds.add(s.id)});o.length<t&&e.length>0;)o.push(e[Math.floor(Math.random()*e.length)]);return o}}const Ye={common:{title:"FOOTBALL QUIZ LEAGUE",subtitle:"ETHIO TELECOM VAS PLATFORM",close:"✖ CLOSE",backToHome:"✖ BACK TO HOME",play:"PLAY",submit:"SUBMIT",loading:"Loading...",error:"Error"},home:{soloMatch:"⚽ SOLO MATCH",liveMatch:"⚡ LIVE 1v1 MATCH",dailyChallenge:"📅 DAILY CHALLENGE",competitions:"🏆 COMPETITIONS",leaderboard:"📊 LEADERBOARD",badges:"🎖️ BADGES",admin:"⚙️ ADMIN",streak:"🔥 {count} DAY STREAK",coins:"🪙 {coins} COINS",level:"LVL {level}",invite:"Invite",inviteDesc:"+200 XP per friend.",copyLink:"Copy Link",performance:"📊 Performance",details:"DETAILS",matches:"MATCHES",points:"POINTS",score:"SCORE",lobbies:"⚽ Lobbies",championship:"🏆 ETHIOFANTASY CHAMPIONSHIP"},match:{questionCount:"QUESTION {current} OF {total}",goal:"⚽ GOAL!!!!!",saved:"🧤 SAVED!",halfTime:"HALF TIME",fullTime:"FULL TIME",matchStats:"MATCH STATISTICS",matchRating:"MATCH RATING",possession:"POSSESSION",accuracy:"ACCURACY",maxCombo:"MAX COMBO",coinsEarned:"COINS EARNED",xpEarned:"XP EARNED",continue:"CONTINUE TO HUB",leaveMatch:"Leave Match?",leaveWarning:"Your progress will be abandoned.",leaveBtn:"Leave",continueBtn:"Continue"},multiplayer:{matchmakingTitle:"LIVE MULTIPLAYER MATCHMAKING",findingOpponent:"FINDING WORTHY OPPONENT...",yourRating:"YOUR RATING",searchRange:"SEARCH RANGE",cancelMatchmaking:"✖ CANCEL MATCHMAKING",victory:"VICTORY!",draw:"MATCH DRAW!",defeated:"DEFEATED!",finalScore:"FINAL SCORE: {myScore} - {oppScore}",eloRating:"ELO RATING"},categories:{worldCup:"FIFA World Cup",championsLeague:"UEFA Champions League",cafChampions:"CAF Champions League",afcon:"Africa Cup of Nations",ethiopianPremier:"Ethiopian Premier League",waliaIbex:"Ethiopian National Team (Walia Ibex)",premierLeague:"Premier League",laLiga:"La Liga",serieA:"Serie A",bundesliga:"Bundesliga",legendaryPlayers:"Legendary Players",footballRules:"Football Rules & Laws",transferMarket:"Transfer Market",stadiums:"Stadiums & Venues",footballHistory:"Football History"}},Ke={common:{title:"የእግር ኳስ ጥያቄ ሊግ",subtitle:"ኢትዮ ቴሌኮም ቪኤኤስ መድረክ",close:"✖ ዝጋ",backToHome:"✖ ወደ ዋና ገጽ",play:"ተጫወት",submit:"ላክ",loading:"በመጫን ላይ...",error:"ስህተት"},home:{soloMatch:"⚽ ነጠላ ጨዋታ",liveMatch:"⚡ ቀጥታ 1v1 ጨዋታ",dailyChallenge:"📅 የዕለት ተግዳሮት",competitions:"🏆 ውድድሮች",leaderboard:"📊 ደረጃ ሰሌዳ",badges:"🎖️ ባጆች",admin:"⚙️ አድሚን",streak:"🔥 {count} ቀን ተከታታይ",coins:"🪙 {coins} ሳንቲም",level:"ደረጃ {level}",invite:"ጋብዝ",inviteDesc:"+200 XP በአንድ ጓደኛ",copyLink:"ሊንክ ኮፒ አድርግ",performance:"📊 አፈጻጸም",details:"ዝርዝር",matches:"ጨዋታዎች",points:"ነጥቦች",score:"ውጤት",lobbies:"⚽ ሎቢ",championship:"🏆 የኢትዮፋንታሲ ሻምፒዮና"},match:{questionCount:"ጥያቄ {current} ከ {total}",goal:"⚽ ጎል!!!!!",saved:"🧤 ተመለሰ!",halfTime:"እረፍት",fullTime:"ሙሉ ጊዜ",matchStats:"የጨዋታ ስታቲስቲክስ",matchRating:"የጨዋታ ደረጃ",possession:"ኳስ ቁጥጥር",accuracy:"ትክክለኛነት",maxCombo:"ከፍተኛ ተከታታይ",coinsEarned:"የተገኘ ሳንቲም",xpEarned:"የተገኘ XP",continue:"ወደ መነሻ ገጽ ተመለስ",leaveMatch:"ጨዋታውን ትተህ ውጣ?",leaveWarning:"ያለዎት እድገት ይጠፋል።",leaveBtn:"ውጣ",continueBtn:"ቀጥል"},multiplayer:{matchmakingTitle:"ቀጥታ ባለብዙ ተጫዋች ጨዋታ",findingOpponent:"ተፎካካሪ በመፈለግ ላይ...",yourRating:"የእርስዎ ደረጃ",searchRange:"የፍለጋ ክልል",cancelMatchmaking:"✖ ፍለጋውን ሰርዝ",victory:"ድል!",draw:"እኩል!",defeated:"ተሸንፈዋል!",finalScore:"የመጨረሻ ውጤት: {myScore} - {oppScore}",eloRating:"የኤሎ ደረጃ"},categories:{worldCup:"የዓለም ዋንጫ",championsLeague:"UEFA ቻምፒየንስ ሊግ",cafChampions:"የCAF ሻምፒዮንስ ሊግ",afcon:"የአፍሪካ ዋንጫ",ethiopianPremier:"የኢትዮጵያ ፕሪሚየር ሊግ",waliaIbex:"ዋሊያ ኢቤክስ (ብሔራዊ ቡድን)",premierLeague:"የእንግሊዝ ፕሪሚየር ሊግ",laLiga:"የስፔን ላ ሊጋ",serieA:"የጣሊያን ሰሪ ኤ",bundesliga:"የጀርመን ቡንደስሊጋ",legendaryPlayers:"አፈ ታሪክ ተጫዋቾች",footballRules:"የእግር ኳስ ሕግጋት",transferMarket:"የዝውውር ገበያ",stadiums:"ስታዲየሞች",footballHistory:"የእግር ኳስ ታሪክ"}},Ve={common:{title:"LIIGII GAAFFII KUBBAA MIILAA",subtitle:"ITIYO TELEKOOM VAS PLATFORM",close:"✖ Cufi",backToHome:"✖ Gara Fuula Duraatti",play:"Taphadhu",submit:"Ergi",loading:"Fe'amaa jira...",error:"Dogoggora"},home:{soloMatch:"⚽ TAPHA QOFAAA",liveMatch:"⚡ TAPHI KALLATTII 1v1",dailyChallenge:"📅 QORMAATA GUYYAA",competitions:"🏆 DORGOMMIIWWAN",leaderboard:"📊 SADARKAA",badges:"🎖️ BAADJIIWWAN",admin:"⚙️ ADMIIN",streak:"🔥 {count} GUYYAA WALITTI AANEE",coins:"🪙 {coins} SAAKKATOO",level:"SADARKAA {level}",invite:"Afeeri",inviteDesc:"+200 XP hiriyaa tokkoon",copyLink:"Liinkii Kopi godhi",performance:"📊 Raawwii",details:"BAL'INA",matches:"TAPHOOTA",points:"QABXII",score:"FIRI",lobbies:"⚽ Lobbies",championship:"🏆 CHAMPIONSHIP ETHIOFANTASY"},match:{questionCount:"GAAFFII {current} KEESSAA {total}",goal:"⚽ GOOLII!!!!!",saved:"🧤 QABAME!",halfTime:"BOQONNAA",fullTime:"YEROO GUUTUU",matchStats:"ISTATISTIKSII TAPHA",matchRating:"SADARKAA TAPHA",possession:"KUBBAA QABACHUU",accuracy:"SIREESSUU",maxCombo:"WAL-IRRAA OLAANAA",coinsEarned:"SANTIIMA ARGAME",xpEarned:"XP ARGATAME",continue:"GARA FUULA DURAA DEEBI'I",leaveMatch:"Tapha Dhiiftee Baataa?",leaveWarning:"Guddinni kee ni bada.",leaveBtn:"Bahi",continueBtn:"Itti Fufi"},multiplayer:{matchmakingTitle:"TAPHA KALLATTII DORGOMAA",findingOpponent:"DORGOMAA BARBAADAA JIRA...",yourRating:"SADARKAA KEE",searchRange:"DAANGAA BARBAADUU",cancelMatchmaking:"✖ BARBAADUU HAQI",victory:"INJIFANNOO!",draw:"QIXEE!",defeated:"MO'ATAMTEERTA!",finalScore:"QABXII GUUTUU: {myScore} - {oppScore}",eloRating:"SADARKAA ELO"},categories:{worldCup:"Waancaa Addunyaa FIFA",championsLeague:"Liigii Chaampiyoonsii UEFA",cafChampions:"Liigii Chaampiyoonsii CAF",afcon:"Waancaa Afriikaa",ethiopianPremier:"Liigii Piriimeraa Itoophiyaa",waliaIbex:"Waaliyaa Ibeks (Garee Biyyaaleessaa)",premierLeague:"Liigii Piriimeraa Ingilaand",laLiga:"Laa Liigaa Ispeen",serieA:"Seeriyee A Xaaliyaanii",bundesliga:"Buundesliigaa Jarmaan",legendaryPlayers:"Taphattootaa Seenaa",footballRules:"Seera Kubbaa Miilaa",transferMarket:"Gabaa Dabarsaa",stadiums:"Istaadiyeemota",footballHistory:"Seenaa Kubbaa Miilaa"}},ge={en:Ye,am:Ke,om:Ve};class Z{static _instance=null;_currentLocale="en";constructor(){const e=localStorage.getItem("ETHIO_FOOTBALL_LOCALE");(e==="am"||e==="om"||e==="en")&&(this._currentLocale=e)}static getInstance(){return Z._instance||(Z._instance=new Z),Z._instance}setLocale(e){this._currentLocale=e,localStorage.setItem("ETHIO_FOOTBALL_LOCALE",e),console.log(`[i18n] Switched locale to: ${e}`)}get currentLocale(){return this._currentLocale}t(e,t){const i=e.split(".");let a=ge[this._currentLocale]||ge.en;for(const o of i)if(a&&a[o]!==void 0)a=a[o];else{let s=ge.en;for(const l of i)if(s&&s[l]!==void 0)s=s[l];else return e;a=s;break}if(typeof a!="string")return e;let n=a;return t&&Object.entries(t).forEach(([o,s])=>{n=n.replace(new RegExp(`\\{${o}\\}`,"g"),String(s))}),n}}const r=Z.getInstance(),G=(p,e)=>r.t(p,e);class R{static _instance=null;constructor(){}static getInstance(){return R._instance||(R._instance=new R),R._instance}async createSession(e,t,i,a){if(!w.isOnline)return null;const n=m;if(!n)return null;try{const{data:{user:o}}=await n.auth.getUser();if(!o)return null;const{data:s,error:l}=await n.from("game_sessions").insert({user_id:o.id,match_type:e,competition_id:t,difficulty:typeof i=="string"?parseInt(i,10):i,question_ids:a,total_questions:a.length,time_remaining:60,state:"playing"}).select().single();return l?(console.warn("[GameSessionService] Error creating session:",l),null):s}catch(o){return console.warn("[GameSessionService] Failed to create session:",o),null}}async getActiveSession(){if(!w.isOnline)return null;const e=m;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("game_sessions").select("*").eq("user_id",t.id).in("state",["playing","paused"]).order("created_at",{ascending:!1}).limit(1).single();return a&&a.code!=="PGRST116"?(console.warn("[GameSessionService] Error fetching active session:",a),null):i}catch(t){return console.warn("[GameSessionService] Failed to get active session:",t),null}}async updateSession(e,t){if(!w.isOnline)return;const i=m;if(i)try{const{error:a}=await i.from("game_sessions").update(t).eq("id",e);a&&console.warn("[GameSessionService] Error updating session:",a)}catch(a){console.warn("[GameSessionService] Failed to update session:",a)}}async pauseSession(e){return this.updateSession(e,{state:"paused",paused_at:new Date().toISOString()})}async resumeSession(e){return this.updateSession(e,{state:"playing",paused_at:null})}async completeSession(e,t,i,a,n){return this.updateSession(e,{state:"completed",final_score:t,accuracy:i,avg_response_time:a,max_combo:n,completed_at:new Date().toISOString()})}async abandonSession(e){return this.updateSession(e,{state:"abandoned",completed_at:new Date().toISOString()})}async recordAnswer(e,t,i,a,n,o,s){if(!w.isOnline)return;const l=m;if(l)try{const{error:d}=await l.from("game_session_answers").insert({session_id:e,question_id:t,question_index:i,selected_index:a,correct_index:n,is_correct:o,response_time_ms:s});d&&console.warn("[GameSessionService] Error recording answer:",d)}catch(d){console.warn("[GameSessionService] Failed to record answer:",d)}}async getSessionAnswers(e){if(!w.isOnline)return[];const t=m;if(!t)return[];try{const{data:i,error:a}=await t.from("game_session_answers").select("*").eq("session_id",e).order("question_index",{ascending:!0});return a?(console.warn("[GameSessionService] Error fetching session answers:",a),[]):i||[]}catch(i){return console.warn("[GameSessionService] Failed to get session answers:",i),[]}}async getHistory(e=20){if(!w.isOnline)return[];const t=m;if(!t)return[];try{const{data:{user:i}}=await t.auth.getUser();if(!i)return[];const{data:a,error:n}=await t.from("game_sessions").select("*").eq("user_id",i.id).eq("state","completed").order("completed_at",{ascending:!1}).limit(e);return n?(console.warn("[GameSessionService] Error fetching session history:",n),[]):a||[]}catch(i){return console.warn("[GameSessionService] Failed to get session history:",i),[]}}}class z{static _instance=null;STORAGE_KEY="ETHIO_ACTIVE_SESSION_V3";static getInstance(){return z._instance||(z._instance=new z),z._instance}createSession(e,t,i){const a={sessionId:"SESS-"+Math.floor(1e5+Math.random()*9e5),matchType:e,startTime:Date.now(),totalQuestions:i.length,difficulty:t,currentScore:0,currentIndex:0,timeLeftSec:15,questions:i,choices:[],responseTimes:[],state:"Playing",correctCount:0,wrongCount:0,timeOutCount:0},n=i.map(o=>String(o.id));return R.getInstance().createSession(e,e,t,n).then(o=>{o&&o.id&&(a.cloudSessionId=o.id,this.saveSession(a))}),this.saveSession(a),a}getActiveSession(){const e=localStorage.getItem(this.STORAGE_KEY);if(!e)return null;try{const t=JSON.parse(e);return t.state==="Completed"||t.state==="Abandoned"||t.state==="Expired"?null:Date.now()-t.startTime>144e5?(this.clearSession(),null):t}catch{return null}}saveSession(e){localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}clearSession(){localStorage.removeItem(this.STORAGE_KEY)}autoSaveProgress(e,t,i,a,n,o,s){if(e.currentIndex=t,e.choices.push(i),e.responseTimes.push(a),e.currentScore=o,e.timeLeftSec=s,i===-1?e.timeOutCount++:n?e.correctCount++:e.wrongCount++,e.cloudSessionId){const l=String(e.questions[t].id),d=e.questions[t].correctIndex??-1;R.getInstance().recordAnswer(e.cloudSessionId,l,t,i,d,n,a)}this.saveSession(e)}abandonSession(e){e.state="Abandoned",this.saveSession(e),this.addToHistory(e),e.cloudSessionId&&R.getInstance().abandonSession(e.cloudSessionId),this.clearSession()}completeSession(e,t){if(e.state="Completed",e.currentScore=t,this.saveSession(e),this.addToHistory(e),e.cloudSessionId){const i=e.totalQuestions>0?Math.round(e.correctCount/e.totalQuestions*100):0,a=e.responseTimes.length>0?e.responseTimes.reduce((n,o)=>n+o,0)/e.responseTimes.length:0;R.getInstance().completeSession(e.cloudSessionId,t,i,a,0)}this.clearSession()}addToHistory(e){}}class Fe{static _canvas=null;static _ctx=null;static _particles=[];static _animId=null;static burst(e,t,i=60,a=["#FFD54F","#00C853","#3B82F6","#FFFFFF","#FF4500"]){this._init();const n=e??window.innerWidth/2,o=t??window.innerHeight/3;for(let s=0;s<i;s++){const l=Math.random()*Math.PI*2,d=Math.random()*12+4;this._particles.push({x:n,y:o,vx:Math.cos(l)*d,vy:Math.sin(l)*d-3,size:Math.random()*8+4,color:a[Math.floor(Math.random()*a.length)],alpha:1,rotation:Math.random()*360,rotSpeed:(Math.random()-.5)*15,shape:Math.random()>.4?"rect":"circle"})}this._animId||this._loop()}static _init(){this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.id="confetti-canvas",this._canvas.style.position="fixed",this._canvas.style.top="0",this._canvas.style.left="0",this._canvas.style.width="100vw",this._canvas.style.height="100vh",this._canvas.style.pointerEvents="none",this._canvas.style.zIndex="9999",document.body.appendChild(this._canvas)),this._canvas.width=window.innerWidth,this._canvas.height=window.innerHeight,this._ctx=this._canvas.getContext("2d")}static _loop(){if(!(!this._ctx||!this._canvas)){this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height);for(let e=this._particles.length-1;e>=0;e--){const t=this._particles[e];if(t.x+=t.vx,t.y+=t.vy,t.vy+=.25,t.vx*=.98,t.rotation+=t.rotSpeed,t.alpha-=.015,t.alpha<=0||t.y>window.innerHeight){this._particles.splice(e,1);continue}this._ctx.save(),this._ctx.globalAlpha=t.alpha,this._ctx.translate(t.x,t.y),this._ctx.rotate(t.rotation*Math.PI/180),this._ctx.fillStyle=t.color,t.shape==="rect"?this._ctx.fillRect(-t.size/2,-t.size/2,t.size,t.size*1.5):(this._ctx.beginPath(),this._ctx.arc(0,0,t.size/2,0,Math.PI*2),this._ctx.fill()),this._ctx.restore()}this._particles.length>0?this._animId=requestAnimationFrame(()=>this._loop()):this._animId=null}}}class me{static animate(e,t,i,a=1200,n=o=>Math.round(o).toLocaleString()){const o=performance.now(),s=l=>{const d=l-o,c=Math.min(d/a,1),h=1-Math.pow(1-c,3),g=t+(i-t)*h;e.textContent=n(g),c<1?requestAnimationFrame(s):e.textContent=n(i)};requestAnimationFrame(s)}}class Xe{static render(e){return`
            <div class="glass-card fade-in-up" style="
                border: 2px solid rgba(0, 200, 83, 0.3); 
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
                    background: linear-gradient(to bottom, rgba(7,27,45,0.1) 0%, rgba(7,27,45,0.4) 100%), url('${e.bannerUrl}') center/cover no-repeat;
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
                    <div ${e.iconId?`id="${e.iconId}"`:""} style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 4px 16px rgba(0,200,83,0.5)); transform: scale(1.05);">${e.icon}</div>
                    
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
                    
                    <button id="${e.buttonId}" class="ethio-btn ethio-btn-primary btn-kickoff-action" style="width: 100%; box-shadow: 0 8px 24px rgba(0,200,83,0.4); font-size: var(--fds-font-md); padding: 16px; border-radius: 14px;">
                        ${e.buttonText} ⚽
                    </button>
                </div>
            </div>
        `}}class Te{_uiManager;_audioManager;_quizEngine;_competition;_questions;_callbacks;_currentIndex=0;_timerInterval=null;_timeLeftSec=15;_startTimeMs=0;_hasKickedOff=!1;_session=null;_isPaused=!1;_isDestroyed=!1;_nextQuestionTimeoutId=null;_visibilityHandler;_networkOfflineHandler;_networkOnlineHandler;constructor(e,t,i,a,n,o){this._uiManager=e,this._audioManager=t,this._quizEngine=i,this._competition=a,this._questions=n,this._callbacks=o,this._visibilityHandler=()=>{document.visibilityState==="hidden"&&this._hasKickedOff&&!this._isPaused&&this._currentIndex<this._questions.length&&this._showPauseOverlay()},document.addEventListener("visibilitychange",this._visibilityHandler),this._networkOfflineHandler=()=>{if(this._hasKickedOff&&!this._isPaused&&this._currentIndex<this._questions.length){this._showLeaveWarning();const s=document.getElementById("match-exit-dialog")?.querySelector("div > div:nth-child(2)");s&&(s.innerHTML="⚠️ Your connection was lost. Reconnect to continue playing.")}},this._networkOnlineHandler=()=>{this._hasKickedOff&&this._isPaused&&this._currentIndex<this._questions.length&&this._hideLeaveWarning()},window.addEventListener("ethio-network-offline",this._networkOfflineHandler),window.addEventListener("ethio-network-online",this._networkOnlineHandler)}startMatch(){this._quizEngine.reset(),this._currentIndex=0,this._hasKickedOff=!1,this._session=z.getInstance().createSession(this._competition.id,"Medium",this._questions),window.ethioReviewData={questions:[],choices:[]},window.ethioOnBackPress=()=>{if(!this._hasKickedOff)return this._callbacks.onExitMatch(),!0;const e=document.getElementById("match-exit-dialog");return e&&e.style.display!=="none"?this._hideLeaveWarning():this._showLeaveWarning(),!0},this._renderKickOffScreen()}resumeSession(e){this._quizEngine.reset(),this._session=e,this._questions=e.questions,this._currentIndex=e.currentIndex,this._hasKickedOff=!0,this._isPaused=!1;for(let t=0;t<e.choices.length;t++){const i=e.choices[t],a=e.questions[t].correctIndex,n=e.responseTimes[t];this._quizEngine.recordAnswer(i===a,n)}window.ethioReviewData={questions:e.questions||[],choices:e.choices||[]},window.ethioOnBackPress=()=>{const t=document.getElementById("match-exit-dialog");return t&&t.style.display!=="none"?this._hideLeaveWarning():this._showLeaveWarning(),!0},this._renderQuestion(e.timeLeftSec)}_renderKickOffScreen(){const e=this._uiManager.container,t=this._competition.id==="all"?"QUICK MATCH.png":"DAILY CHALLENGE.png";e.innerHTML=`
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 0 28px; position: relative; height: 100vh; overflow: hidden;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- Dark Overlay -->
                <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); z-index: 5; animation: fade-in 250ms ease-out;"></div>

                <!-- Content Wrapper -->
                <div class="kick-off-wrapper" style="position: relative; z-index: 10; width: 100%; max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    ${Xe.render({bannerUrl:`/assets/banners/${t}`,icon:this._competition.badge,title:this._competition.name,buttonId:"kick-off-btn",buttonText:r.currentLocale==="am"?"ጀምር":r.currentLocale==="om"?"EGGALI":"KICK OFF",showCloseButton:!0})}

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
        `,document.getElementById("match-exit-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),window.ethioHandleBack&&window.ethioHandleBack()}),document.getElementById("kick-off-btn")?.addEventListener("click",()=>{this._audioManager.playQuizWhistle(),this._hasKickedOff=!0,this._renderQuestion()})}_renderQuestion(e=10){if(this._isDestroyed)return;if(!this._hasKickedOff){this._renderKickOffScreen();return}if(this._currentIndex>=this._questions.length){this._stopTimer(),this._completeMatch();return}const t=this._questions[this._currentIndex],i=this._uiManager.container,n=this._quizEngine.calculateFinalStats().goals*100;if(i.innerHTML=`
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- PREMIUM GAMING HEADER -->
                <div style="
                    display: flex; 
                    flex-direction: column;
                    background: rgba(7,27,45,0.95);
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
                            background: linear-gradient(90deg, #009624 0%, #00C853 100%); 
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
                        ${t.options.map((s,l)=>`
                            <button class="option-btn anim-a-card" style="animation-delay: ${180+l*30}ms;" data-index="${l}">
                                <span class="option-badge">${String.fromCharCode(65+l)}</span>
                                <span class="option-text">${s}</span>
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
                        background: rgba(7, 27, 45, 0.95);
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 16px 40px rgba(0,0,0,0.5);
                    ">
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">Leave Quiz?</div>
                        <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 24px; line-height: 1.4;">Your current progress will be lost.</div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button id="btn-pause-resume" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #00C853, #009624); color: white; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,200,83,0.3);">Stay</button>
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
                    background: rgba(7, 27, 45, 0.95); 
                    z-index: 10001; 
                    align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box;
                    animation: fade-in 0.2s ease-out;
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 64px; margin-bottom: 24px;">⏸️</div>
                        <div style="font-size: 28px; font-weight: 900; color: white; margin-bottom: 12px; letter-spacing: 1px;">Match Paused</div>
                        <div style="font-size: 16px; color: #94A3B8; margin-bottom: 40px;">Tap Continue to resume.</div>
                        <button id="btn-resume-paused" style="width: 100%; max-width: 240px; padding: 18px; border-radius: 16px; border: none; background: linear-gradient(135deg, #00C853, #009624); color: white; font-weight: 900; font-size: 18px; cursor: pointer; box-shadow: 0 8px 24px rgba(0,200,83,0.4); text-transform: uppercase;">Continue</button>
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
                    background: linear-gradient(180deg, #00C853 0%, #009624 100%) !important; 
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
                    50% { transform: translateY(-20px) scale(1.2); text-shadow: 0 10px 20px rgba(0,200,83,0.5); }
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
        `,this._startTimer(e),this._bindOptionButtons(),this._bindPauseButtons(),setTimeout(()=>{if(this._isDestroyed)return;const s=document.getElementById("answers-grid");s&&(s.style.pointerEvents="auto")},120),!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(this._audioManager.playClick(),typeof navigator<"u"&&navigator.vibrate))try{navigator.vibrate(10)}catch{}}_startTimer(e=10){this._stopTimer(),this._timeLeftSec=e,this._startTimeMs=performance.now();const t=document.getElementById("timer-text"),i=()=>{if(t){t.innerText=`${String(this._timeLeftSec)}s`;const a=document.getElementById("timer-chip");a&&(this._timeLeftSec<=5?a.classList.add("time-low"):a.classList.remove("time-low"))}};i(),this._timerInterval=setInterval(()=>{if(!this._isPaused&&(this._timeLeftSec--,i(),this._session&&(this._session.timeLeftSec=this._timeLeftSec,z.getInstance().saveSession(this._session)),!(this._isDestroyed||this._isPaused)&&this._timeLeftSec<=0)){this._audioManager.playQuizWhistle(),this._handleTimeOut();return}},1e3)}_stopTimer(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)}_showLeaveWarning(){const e=document.getElementById("match-exit-dialog");e&&(e.style.display="flex")}_hideLeaveWarning(){const e=document.getElementById("match-exit-dialog");e&&(e.style.display="none")}_showPauseOverlay(){this._isPaused=!0,this._stopTimer();const e=document.getElementById("match-paused-dialog");e&&(e.style.display="flex")}_hidePauseOverlay(){this._isPaused=!1;const e=document.getElementById("match-paused-dialog");e&&(e.style.display="none"),this._startTimer(this._timeLeftSec)}_leaveMatch(){this._stopTimer(),this._session&&z.getInstance().clearSession(),window.ethioOnBackPress=null,this.destroy(),this._callbacks.onExitMatch()}_bindPauseButtons(){document.getElementById("btn-pause-resume")?.addEventListener("click",()=>{this._audioManager.playClick(),this._hideLeaveWarning()}),document.getElementById("btn-pause-leave")?.addEventListener("click",()=>{this._audioManager.playClick(),this._leaveMatch()}),document.getElementById("btn-resume-paused")?.addEventListener("click",()=>{this._audioManager.playClick(),this._hidePauseOverlay()})}_bindOptionButtons(){document.getElementById("match-exit-btn")?.addEventListener("click",()=>{this._showLeaveWarning()}),document.querySelectorAll(".option-btn").forEach(t=>{t.addEventListener("click",async i=>{const a=i.currentTarget;if(a.disabled)return;document.querySelectorAll(".option-btn").forEach(s=>s.disabled=!0),this._stopTimer(),await this._audioManager.playQuizAnswerSelected();const o=parseInt(a.getAttribute("data-index")||"0");this._isDestroyed||this._onOptionSelected(o,a)})})}async _onOptionSelected(e,t){let i=parseFloat(((performance.now()-this._startTimeMs)/1e3).toFixed(1));if(i>10.5){await this._handleTimeOut();return}const a=this._questions[this._currentIndex],n=await this._findCorrectIndex(a),o=e===n,s=document.querySelectorAll(".option-btn"),l=this._currentIndex===this._questions.length-1;let d=Promise.resolve();if(o)t.classList.add("correct"),d=this._audioManager.playQuizCorrectAnswer(),Fe.burst(window.innerWidth/2,window.innerHeight/3,50,["#FFD54F","#00C853","#3B82F6","#FFFFFF"]),this._showFeedbackOverlay(!0);else{if(t.classList.add("wrong"),n!==void 0){const h=s[n];h&&h.classList.add("correct")}d=this._audioManager.playQuizWrongAnswer(),this._showFeedbackOverlay(!1)}if(await d,this._isDestroyed||l&&(await this._audioManager.playQuizWhistle(),this._isDestroyed))return;this._quizEngine.recordAnswer(o,i,a.id,e);const c=this._quizEngine.calculateFinalStats().goals;if(this._session&&z.getInstance().autoSaveProgress(this._session,this._currentIndex+1,e,i,o,c*100,15),o){const h=document.getElementById("match-score");h&&me.animate(h,(c-1)*100,c*100,600,g=>`${Math.round(g)}`)}this._hideFeedbackOverlay(),this._currentIndex++,this._renderQuestion()}_showFeedbackOverlay(e){const t=document.getElementById("feedback-overlay"),i=document.getElementById("feedback-anim"),a=document.getElementById("feedback-text"),n=document.getElementById("feedback-subtext");t&&i&&a&&n&&(t.style.borderColor=e?"var(--tv-pitch-green)":"var(--tv-gold-primary)",t.style.background=e?"linear-gradient(135deg, rgba(0,200,83,0.25) 0%, rgba(7,27,45,0.96) 100%)":"linear-gradient(135deg, rgba(255,213,79,0.18) 0%, rgba(7,27,45,0.96) 100%)",t.style.color=e?"var(--tv-pitch-green)":"var(--tv-gold-primary)",i.innerText=e?"⚽🥅":"🧤⚽",i.style.animation=e?"goal-bounce 0.6s ease-in-out infinite":"save-shake 0.4s ease-in-out infinite",a.innerText=e?"GOAL!":"SAVED!",n.innerText=e?"Brilliant strike into the net!":"Keeper parries the shot away!",t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1)")}_hideFeedbackOverlay(){const e=document.getElementById("feedback-overlay");e&&(e.style.pointerEvents="none",e.style.opacity="0",e.style.transform="translate(-50%, -50%) scale(0.8)")}async _handleTimeOut(){const t=this._questions[this._currentIndex],i=await this._findCorrectIndex(t),a=document.querySelectorAll(".option-btn");if(i!==void 0){const d=a[i];d&&d.classList.add("correct")}this._showFeedbackOverlay(!1);const n=document.getElementById("feedback-text"),o=document.getElementById("feedback-subtext");n&&o&&(n.innerText="TIME OUT!",o.innerText="Speed up next time!");const s=this._currentIndex===this._questions.length-1;if(await this._audioManager.playQuizWrongAnswer(),this._isDestroyed||s&&(await this._audioManager.playQuizWhistle(),this._isDestroyed))return;this._quizEngine.recordAnswer(!1,15,t.id,-1);const l=this._quizEngine.calculateFinalStats().goals;this._session&&z.getInstance().autoSaveProgress(this._session,this._currentIndex+1,-1,15,!1,l*100,15),this._hideFeedbackOverlay(),this._currentIndex++,this._renderQuestion()}_completeMatch(){let e=this._quizEngine.calculateFinalStats(),t=e.goals*100+e.accuracy*5+Math.round(Math.max(0,15-e.avgResponseTime)*e.goals*15);e.accuracy===100&&(t+=500),this._session&&z.getInstance().completeSession(this._session,t),window.ethioReviewData={questions:this._questions,choices:this._session?this._session.choices:[]},pe(()=>Promise.resolve().then(()=>ot),void 0).then(i=>i.AuthManager.getInstance().refreshProfile()),window.ethioOnBackPress=null,this._callbacks.onMatchComplete(e,t),this._session&&ue.invoke("validate-match",{matchType:this._session.matchType,competitionId:this._competition.id,answers:this._quizEngine.answerSubmissions}).then(({data:i,error:a})=>{!a&&i&&(!i.valid||i.anomalyDetected?console.error("[Anti-Cheat] Match rejected by server!"):console.log("[Anti-Cheat] Match validated successfully in background."))}).catch(i=>console.error("[Anti-Cheat] Background validation failed:",i))}destroy(){this._isDestroyed=!0,this._stopTimer(),this._audioManager.stopAllQuizAudio(),this._nextQuestionTimeoutId&&(clearTimeout(this._nextQuestionTimeoutId),this._nextQuestionTimeoutId=null),document.removeEventListener("visibilitychange",this._visibilityHandler),window.removeEventListener("ethio-network-offline",this._networkOfflineHandler),window.removeEventListener("ethio-network-online",this._networkOnlineHandler),this._quizEngine=null,this._session=null,window.ethioOnBackPress=null,this._uiManager&&this._uiManager.container&&(this._uiManager.container.innerHTML="")}async _findCorrectIndex(e){if(e.correctIndex!==void 0)return e.correctIndex;if(e.answerHash){for(let t=0;t<4;t++)if(await this._sha256(`${e.id}:${t}:ethio-secret-salt`)===e.answerHash)return e.correctIndex=t,t}}async _sha256(e){const t=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return Array.from(new Uint8Array(t)).map(i=>i.toString(16).padStart(2,"0")).join("")}}class L{static Header(e){return`
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
        `}static Button(e){const t=e.variant==="secondary"?"ethio-btn-secondary":"ethio-btn-primary",i=e.fullWidth?"width: 100%;":"",a=e.id?`id="${e.id}"`:"",n=e.disabled?"disabled":"",o=e.dataAttrs?e.dataAttrs:"";return`
            <button ${a} ${o} ${n} class="ethio-btn ${t} ${e.className||""}" style="${i}">
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
            <span class="fds-badge" style="background: rgba(255, 213, 79, 0.12); border: 1px solid var(--fds-gold-primary); color: var(--fds-gold-primary); padding: 4px 10px; border-radius: var(--radius-sm); font-size: var(--fds-font-xs); font-weight: 800;">
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
        `}static Text(e,t){const i=t?.size?`font-size: ${t.size};`:"",a=t?.weight?`font-weight: ${t.weight};`:"",n=t?.color?`color: ${t.color};`:"",o=t?.margin?`margin: ${t.margin};`:"",s=t?.align?`text-align: ${t.align};`:"",l=t?.family?`font-family: ${t.family};`:"";return`<div style="${i} ${a} ${n} ${o} ${s} ${l}">${e}</div>`}static Flex(e,t){const i=t?.direction==="column"?"flex-direction: column;":"flex-direction: row;",a=t?.gap?`gap: ${t.gap};`:"",n=t?.align?`align-items: ${t.align};`:"align-items: center;",o=t?.justify?`justify-content: ${t.justify};`:"",s=t?.wrap?"flex-wrap: wrap;":"",l=t?.margin?`margin: ${t.margin};`:"";return`<div style="display: flex; ${i} ${a} ${n} ${o} ${s} ${l}">${e}</div>`}static Grid(e,t){const i=t?.minWidth||"280px",a=t?.gap?`gap: ${t.gap};`:"gap: var(--fds-space-16);",n=t?.margin?`margin: ${t.margin};`:"";return`<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${i}, 1fr)); ${a} ${n}">${e}</div>`}static Dialog(e,t,i){return`
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
        `}}class K{static show(e,t="info",i=3e3){let n=document.getElementById("toast-container");n||(n=document.createElement("div"),n.id="toast-container",n.style.position="fixed",n.style.bottom="30px",n.style.left="50%",n.style.transform="translateX(-50%)",n.style.zIndex="99999",n.style.display="flex",n.style.flexDirection="column",n.style.gap="10px",n.style.pointerEvents="none",document.body.appendChild(n));const o=document.createElement("div"),s=t==="success"?"✅":t==="warning"?"⚠️":t==="error"?"❌":"⚽",l=t==="success"?"#00C853":t==="warning"?"#F59E0B":t==="error"?"#EF4444":"#FFD54F";o.style.background="rgba(7, 27, 45, 0.92)",o.style.border=`1px solid ${l}`,o.style.borderRadius="14px",o.style.padding="12px 20px",o.style.color="white",o.style.fontFamily="system-ui, -apple-system, sans-serif",o.style.fontWeight="bold",o.style.fontSize="14px",o.style.boxShadow="0 10px 30px rgba(0,0,0,0.5)",o.style.backdropFilter="blur(12px)",o.style.transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",o.style.pointerEvents="none",o.style.opacity="0",o.style.transform="translateY(20px)",o.innerHTML=`<span style="margin-right: 8px;">${s}</span> ${e}`,n.appendChild(o),requestAnimationFrame(()=>{o.style.opacity="1",o.style.transform="translateY(0)"}),setTimeout(()=>{o.style.pointerEvents="none",o.style.opacity="0",o.style.transform="translateY(20px)",setTimeout(()=>o.remove(),300)},i)}}const Je=Object.freeze(Object.defineProperty({__proto__:null,Toast:K},Symbol.toStringTag,{value:"Module"}));class ${static RANKS=[{name:"Bronze",minXp:0,badgeClass:"rank-bronze",icon:"🥉"},{name:"Silver",minXp:500,badgeClass:"rank-silver",icon:"🥈"},{name:"Gold",minXp:1500,badgeClass:"rank-gold",icon:"🥇"},{name:"Elite",minXp:3500,badgeClass:"rank-elite",icon:"💎"},{name:"Legend",minXp:7500,badgeClass:"rank-legend",icon:"🔥"},{name:"Hall of Fame",minXp:15e3,badgeClass:"rank-hall-of-fame",icon:"👑"}];static DIVISIONS=[{name:"Division 5 (Regional)",tier:5,minXp:0,badge:"⚽",color:"#94A3B8",weeklyPromotionZone:"Top 30% Promoted to Div 4"},{name:"Division 4 (National 2)",tier:4,minXp:1e3,badge:"🛡️",color:"#34D399",weeklyPromotionZone:"Top 25% Promoted to Div 3"},{name:"Division 3 (National 1)",tier:3,minXp:2500,badge:"🥈",color:"#60A5FA",weeklyPromotionZone:"Top 20% Promoted to Div 2"},{name:"Division 2 (Premier League)",tier:2,minXp:5e3,badge:"🥇",color:"#F59E0B",weeklyPromotionZone:"Top 15% Promoted to Div 1"},{name:"Division 1 (CAF Champions)",tier:1,minXp:1e4,badge:"💎",color:"#C084FC",weeklyPromotionZone:"Top 10% Promoted to Premier"},{name:"Premier Division (World Legends)",tier:0,minXp:2e4,badge:"👑",color:"#FFD54F",weeklyPromotionZone:"Pinnacle Division - World Top 100"}];static getRank(e){for(let t=$.RANKS.length-1;t>=0;t--)if(e>=$.RANKS[t].minXp)return $.RANKS[t];return $.RANKS[0]}static getDivision(e){for(let t=$.DIVISIONS.length-1;t>=0;t--)if(e>=$.DIVISIONS[t].minXp)return $.DIVISIONS[t];return $.DIVISIONS[0]}static getLevel(e){const i=Math.floor(e/250)+1,a=e%250,n=Math.min(Math.floor(a/250*100),100);return{level:i,currentXp:a,nextLevelXp:250,progressPercent:n}}static getSeasonPassInfo(e){const i=Math.min(Math.floor(e/500)+1,50),a=e%500,n=Math.min(Math.floor(a/500*100),100),o=[];return i>=5&&o.push("🎖️ Season 1 Starter Badge"),i>=10&&o.push("🔥 2x XP Multiplier Pass"),i>=25&&o.push("💎 Ethiopian Premier Veteran Crest"),i>=50&&o.push("👑 Hall of Fame Champion Crown"),{seasonLevel:i,seasonXp:a,nextSeasonLevelXp:500,progressPercent:n,unlockedRewards:o}}}class Ze{_uiManager;_saveManager;_audioManager;_stats;_gameId;_finalScore;_hasAnimated=!1;_onContinue;constructor(e,t,i,a,n,o,s){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._stats=a,this._finalScore=n,this._gameId=o,this._onContinue=s,this._saveManager.updateHighScore(this._gameId,this._finalScore)}render(){const e=this._uiManager.container,t=this._stats.goals,i=this._stats.incorrectAnswers;e.innerHTML=`
            <div class="stadium-container" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
                <div style="color: var(--fds-text-main); font-weight: bold;">${r.currentLocale==="am"?"ሽልማቶችን በመጫን ላይ...":r.currentLocale==="om"?"Badhaasa Fe'aa Jira...":"Loading Rewards..."}</div>
            </div>
        `,this._submitAndRender(e,t,i)}async _submitAndRender(e,t,i){let a=this._stats.xpEarned,n=this._stats.coinsEarned;this._saveManager.addXp(a),this._saveManager.addCoins(n);const o=this._stats.accuracy>=50;this._saveManager.incrementMatchStats(o),this._stats.accuracy>=50?this._audioManager.playQuizCorrectAnswer():this._audioManager.playQuizWrongAnswer(),e.innerHTML=`
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
                    background: linear-gradient(135deg, rgba(255,213,79,0.1) 0%, rgba(7,27,45,0.95) 100%);
                    box-shadow: 0 24px 60px rgba(0,0,0,0.6), inset 0 0 32px rgba(255,213,79,0.05);
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                ">
                    <!-- Header -->
                    <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--tv-gold-primary); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
                        ${r.currentLocale==="am"?"ጨዋታው ተጠናቋል":r.currentLocale==="om"?"Tapha Xumurame":"Match Complete"}
                    </div>
                    
                    <!-- Sub-header Message -->
                    <div id="match-message" style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase;">
                        ${this._stats.accuracy>=50?r.currentLocale==="am"?"በጣም ጥሩ":r.currentLocale==="om"?"Baay'ee Gaarii":"Excellent":r.currentLocale==="am"?"ጥሩ ተጫውተዋል":r.currentLocale==="om"?"Gaarii Taphatte":"Well Played"}
                    </div>

                    <!-- Final Score (LARGE) -->
                    <div style="margin-bottom: 24px; position: relative;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">
                            ${r.currentLocale==="am"?"አጠቃላይ እይታ":r.currentLocale==="om"?"Waliigala":"Overview"}
                        </div>
                        <div style="font-size: 56px; font-weight: 900; color: var(--tv-gold-primary); text-shadow: 0 4px 16px rgba(255,213,79,0.4); line-height: 1;">
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
                                ${r.currentLocale==="am"?"ትክክል":r.currentLocale==="om"?"Sirrii":"Correct"}
                            </div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-red-live);">${i}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${r.currentLocale==="am"?"የተሳሳተ":r.currentLocale==="om"?"Dogoggora":"Wrong"}
                            </div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div style="text-align: center;">
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">${this._stats.accuracy}%</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                                ${r.currentLocale==="am"?"ትክክለኛነት":r.currentLocale==="om"?"Sirriantummaa":"Accuracy"}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons (SMALL) -->
                    <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="grid-column: span 2;">
                            ${L.Button({id:"btn-play-again",text:r.currentLocale==="am"?"ድጋሚ ተጫወት":r.currentLocale==="om"?"Ammas Taphadhu":"Play Again",variant:"primary",fullWidth:!0,icon:"🔄"})}
                        </div>
                        
                        <div>
                            ${L.Button({id:"btn-review-game",text:r.currentLocale==="am"?"ከልስ":r.currentLocale==="om"?"Irra Deebi'i":"Review",variant:"secondary",fullWidth:!0,icon:"🔍"})}
                        </div>

                        <div>
                            ${L.Button({id:"btn-leaderboard",text:r.currentLocale==="am"?"ደረጃ":r.currentLocale==="om"?"Sadarkaa":"Rank",variant:"secondary",fullWidth:!0,icon:"📊"})}
                        </div>

                        <div style="grid-column: span 2;">
                            ${L.Button({id:"btn-home",text:r.currentLocale==="am"?"መነሻ":r.currentLocale==="om"?"Manattii":"Home",variant:"secondary",fullWidth:!0,icon:"🏠"})}
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
                background: rgba(7,27,45,0.98); 
                z-index: 10000; 
                flex-direction: column;
                pointer-events: auto;
                box-sizing: border-box;
            ">
                <!-- Modal Top Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: center; padding: 12px 16px; flex-shrink: 0; position: relative;">
                    <div style="font-weight: 900; font-size: var(--fds-font-md); letter-spacing: 0.5px;">${r.currentLocale==="am"?"ጨዋታውን ይከልሱ":r.currentLocale==="om"?"TAPHA IRRA DEEBI'I":"REVIEW GAME"}</div>
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
        `,this._bindEvents();const s=document.getElementById("final-score-rolling");s&&(this._hasAnimated||me.animate(s,0,this._finalScore,800));const l=Math.max(0,this._saveManager.profile.xp-a),d=this._saveManager.profile.xp,c=$.getLevel(l),h=$.getLevel(d),g=document.getElementById("xp-gained-rolling");g&&(this._hasAnimated||me.animate(g,0,a,800)),this._hasAnimated=!0;const f=document.getElementById("level-display-left"),x=document.getElementById("level-display-right"),v=document.getElementById("xp-progress-fill");f&&(f.innerText=`Lvl ${c.level}`),x&&(x.innerText=`Lvl ${c.level+1}`),v&&(v.style.width=`${c.progressPercent}%`,setTimeout(()=>{h.level>c.level?(v.style.width="100%",setTimeout(()=>{v.style.transition="none",v.style.width="0%",f&&(f.innerText=`Lvl ${h.level}`),x&&(x.innerText=`Lvl ${h.level+1}`),setTimeout(()=>{v.style.transition="width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",v.style.width=`${h.progressPercent}%`},50),this._audioManager.playQuizCorrectAnswer(),Fe.burst(window.innerWidth/2,window.innerHeight/2,100);const u=document.getElementById("level-up-toast");u&&(u.style.display="block")},1500)):v.style.width=`${h.progressPercent}%`},500))}_bindEvents(){const e=window;document.getElementById("btn-home")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioForceHome?e.ethioForceHome():(e.ethioCloseGame&&e.ethioCloseGame(),e.ethioReloadHome&&e.ethioReloadHome())}),document.getElementById("btn-play-again")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioCloseGame&&e.ethioCloseGame(),e.ethioPlayAgain?e.ethioPlayAgain(this._gameId):this._onContinue()}),document.getElementById("btn-leaderboard")?.addEventListener("click",()=>{this._audioManager.playClick(),e.ethioCloseGame&&e.ethioCloseGame(),e.ethioNavigateToTab?e.ethioNavigateToTab("rankings"):this._onContinue()});const t=document.getElementById("review-modal"),i=document.getElementById("review-questions-container");document.getElementById("btn-review-game")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&i&&(this._renderReviewQuestions(i),t.style.display="flex")}),document.getElementById("btn-close-review")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")})}_renderReviewQuestions(e){const t=window.ethioReviewData||{questions:[],choices:[]},i=t.questions||[],a=t.choices||[];if(i.length===0){e.innerHTML=`
                <div style="text-align: center; padding: 48px; color: var(--fds-text-dim);">
                    ${r.currentLocale==="am"?"የሚከለሱ ጥያቄዎች የሉም።":r.currentLocale==="om"?"Gaaffiin irra deebi'amu hin jiru.":"No questions to review."}
                </div>
            `;return}e.innerHTML=i.map((o,s)=>{const l=a[s]!==void 0?a[s]:-1,d=l===o.correctIndex;let c="",h="";l===-1?(h="#F97316",c=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${h}; background: rgba(249,115,22,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${r.currentLocale==="am"?"⏱ ጊዜ አልቋል":r.currentLocale==="om"?"⏱ Yeroon Dhumate":"⏱ Timeout"}
                </span>`):d?(h="#00C853",c=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${h}; background: rgba(0,200,83,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${r.currentLocale==="am"?"✓ ትክክል":r.currentLocale==="om"?"✓ Sirrii":"✓ Correct"}
                </span>`):(h="#EF4444",c=`<span style="font-size: var(--fds-font-xs); font-weight: 900; color: ${h}; background: rgba(239,68,68,0.15); padding: 2px 8px; border-radius: 4px;">
                    ${r.currentLocale==="am"?"✗ የተሳሳተ":r.currentLocale==="om"?"✗ Dogoggora":"✗ Wrong"}
                </span>`);const g=o.options.map((u,y)=>{const b=y===o.correctIndex,k=y===l;let A="rgba(0,0,0,0.3)",S="rgba(255,255,255,0.06)",E="",O="";b&&k?(A="rgba(0,200,83,0.15)",S="#00C853",E='<span style="color: #00C853; font-weight: bold; margin-right: 8px;">✓</span>',O='<div style="background: rgba(0,200,83,0.2); color: #4ADE80; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Your Answer</div>'):b?(A="rgba(0,200,83,0.15)",S="#00C853",E='<span style="color: #00C853; font-weight: bold; margin-right: 8px;">✓</span>',O='<div style="background: rgba(0,200,83,0.2); color: #4ADE80; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Correct Answer</div>'):k&&(A="rgba(239,68,68,0.15)",S="#EF4444",E='<span style="color: #EF4444; font-weight: bold; margin-right: 8px;">✗</span>',O='<div style="background: rgba(239,68,68,0.2); color: #F87171; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Your Answer</div>');const Q=String.fromCharCode(65+y)+".";return`
                    <div style="background: ${A}; border: 1px solid ${S}; padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-main);">
                                ${E}
                                <span style="color: var(--fds-gold-primary); margin-right: 8px;">${Q}</span> 
                                ${u}
                            </div>
                            ${O}
                        </div>
                    </div>
                `}).join("");let f="";o.explanation&&(f=`
                    <div style="background: rgba(7,27,45,0.6); border: 1px solid rgba(56,189,248,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #38BDF8; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">💡 ${r.currentLocale==="am"?"ይህ ለምን ትክክል ነው":r.currentLocale==="om"?"Maaliif Sirrii Dha":"Why this is correct"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${o.explanation}</div>
                    </div>
                `);let x="";o.fact&&(x=`
                    <div style="background: rgba(7,27,45,0.6); border: 1px solid rgba(192,132,252,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #C084FC; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">🧠 ${r.currentLocale==="am"?"ያውቁ ኖሯል?":r.currentLocale==="om"?"Beektuu Laata?":"Did You Know?"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${o.fact}</div>
                    </div>
                `);let v="";return o.learningTip&&(v=`
                    <div style="background: rgba(7,27,45,0.6); border: 1px solid rgba(250,204,21,0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                        <div style="color: #FACC15; font-size: 10px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">🎯 ${r.currentLocale==="am"?"የመማሪያ ጠቃሚ ምክር":r.currentLocale==="om"?"Gorsa Barumsaa":"Learning Tip"}</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-main); line-height: 1.4;">${o.learningTip}</div>
                    </div>
                `),`
                <div class="glass-card" style="border-radius: 12px; padding: 16px; margin-bottom: 16px; border-color: ${h}; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase;">
                            ${r.currentLocale==="am"?`ጥያቄ ${s+1}`:r.currentLocale==="om"?`Gaaffii ${s+1}`:`Question ${s+1}`}
                        </span>
                        ${c}
                    </div>

                    <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--fds-text-main); margin-bottom: 12px; line-height: 1.4;">${o.prompt}</div>

                    
                    <div style="margin-bottom: 12px;">
                        ${g}
                    </div>
                    
                    ${f}
                    ${x}
                    ${v}

                    <!-- In-App Interactions Row (REQ 14) -->
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                        <button class="review-action-btn btn-review-like" data-q-idx="${s}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span class="heart-icon" style="font-size: var(--fds-font-md); transition: transform 0.2s;">❤️</span> <span class="like-label">${r.currentLocale==="am"?"ውደድ":r.currentLocale==="om"?"Jaalladhu":"Like"}</span>
                        </button>
                        <button class="review-action-btn btn-review-comment" data-q-idx="${s}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span style="font-size: var(--fds-font-md);">💬</span> ${r.currentLocale==="am"?"አስተያየት":r.currentLocale==="om"?"Yaada":"Comment"}
                        </button>
                        <button class="review-action-btn btn-review-share" data-q-idx="${s}" style="flex: 1; padding: 10px 4px; background: transparent; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.15s, color 0.15s;">
                            <span style="font-size: var(--fds-font-md);">⚽</span> ${r.currentLocale==="am"?"ጋብዝ":r.currentLocale==="om"?"Affeeri":"Invite"}
                        </button>
                    </div>

                    <!-- Comment Container (Hidden by default, expands on comment click) -->
                    <div class="comment-box-drawer" id="comment-drawer-${s}" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
                        <div class="comment-list" id="comment-list-${s}" style="max-height: 120px; overflow-y: auto; margin-bottom: 8px; font-size: var(--fds-font-xs); color: var(--fds-text-muted); display: flex; flex-direction: column; gap: 6px;">
                            <div style="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;">
                                <strong style="color: var(--fds-gold-primary);">Abebe M.:</strong> ${r.currentLocale==="am"?"በጣም ጥሩ ጥያቄ! እውቀቴን በእውነት ፈትኖታል።":r.currentLocale==="om"?"Gaaffii baay'ee gaarii! Beekuumsakoo dhugumaan qoreera.":"Great question! Really challenged my knowledge."} <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); float: right;">2m ago</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="comment-input-${s}" placeholder="${r.currentLocale==="am"?"አስተያየት ይፃፉ...":r.currentLocale==="om"?"Yaada barreessi...":"Write a comment..."}" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 10px; color: var(--fds-text-main); font-size: var(--fds-font-xs);" />
                            <button class="btn-send-comment" data-q-idx="${s}" style="background: var(--tv-pitch-green); border: none; color: var(--fds-text-main); padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: var(--fds-font-xs); cursor: pointer;">${r.currentLocale==="am"?"ለጥፍ":r.currentLocale==="om"?"Maxxansi":"Post"}</button>
                        </div>
                    </div>
                </div>
            `}).join(""),e.querySelectorAll(".glass-card").forEach((o,s)=>{const l=o.querySelector(".btn-review-like");l?.addEventListener("click",()=>{this._audioManager.playClick();const v=l.querySelector(".like-label"),u=l.querySelector(".heart-icon");l.classList.contains("liked")?(l.classList.remove("liked"),l.style.color="#94A3B8",v.innerText=r.currentLocale==="am"?"ውደድ":r.currentLocale==="om"?"Jaalladhu":"Like"):(l.classList.add("liked"),l.style.color="#EF4444",v.innerText=r.currentLocale==="am"?"ተወዷል":r.currentLocale==="om"?"Jaallatameera":"Liked",u&&(u.style.transform="scale(1.3)",setTimeout(()=>u.style.transform="scale(1)",200)))});const d=o.querySelector(".btn-review-comment"),c=o.querySelector(`#comment-drawer-${s}`),h=o.querySelector(`#comment-input-${s}`),g=o.querySelector(".btn-send-comment"),f=o.querySelector(`#comment-list-${s}`);d?.addEventListener("click",()=>{this._audioManager.playClick(),c&&(c.style.display=c.style.display==="none"?"block":"none",c.style.display==="block"&&h?.focus())}),g?.addEventListener("click",()=>{this._audioManager.playClick();const v=h?.value.trim();if(!v){K.show(r.currentLocale==="am"?"አስተያየት ባዶ ሊሆን አይችልም።":r.currentLocale==="om"?"Yaadni duwwaa ta'uu hin danda'u.":"Comment cannot be empty.","info");return}const u=document.createElement("div");u.style.cssText="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;";const y=r.currentLocale==="am"?"እርስዎ:":r.currentLocale==="om"?"Isin:":"You:",b=r.currentLocale==="am"?"አሁን":r.currentLocale==="om"?"Amma":"Just now";u.innerHTML=`<strong style="color: #4ADE80;">${y}</strong> ${v} <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); float: right;">${b}</span>`,f.appendChild(u),h.value="",f.scrollTop=f.scrollHeight,K.show(r.currentLocale==="am"?"አስተያየት ተለጥፏል!":r.currentLocale==="om"?"Yaadni maxxanfameera!":"Comment posted!","success")}),o.querySelector(".btn-review-share")?.addEventListener("click",async()=>{this._audioManager.playClick();const v=r.currentLocale==="am"?`⚽ በኢትዮ ቴሌኮም የእግር ኳስ ውድድር ላይ እየተወዳደርኩ ነው!
የ ${this._finalScore} ነጥቤን ማሸነፍ ትችላለህ?
አሁኑኑ ውድድሩን ተቀላቀል እና ተፎካከረኝ!`:r.currentLocale==="om"?`⚽ Dorgoommii Kubbaa Miilaa Itooyyo Telekoom irratti dorgomaan jira!
Qabxii koo ${this._finalScore} mo'achuu dandeessa?
Amma dorgommiitti makamii na qori!`:`⚽ I'm competing in the Ethio Telecom Football Tournament!
Can you beat my score of ${this._finalScore} PTS?
Join the competition and challenge me now!`;if(navigator.share)try{await navigator.share({title:"Ethio Telecom Football League",text:v,url:window.location.href})}catch{}else await navigator.clipboard.writeText(`${v}
${window.location.href}`),K.show(r.currentLocale==="am"?"የእግር ኳስ መጋበዣ ሊንክ ወደ ቅሊፕቦርድ ተገልብጧል! ለመፎካከር ለጓደኞችዎ ያጋሩ።":r.currentLocale==="om"?"Geessituun affeerraa kubbaa miilaa kooppii ta'eera! Hiriyoota keetiif qooduun isaan qori.":"Football invitation link copied to clipboard! Share with friends to challenge them.","success")})})}}class et{metadata={id:"football-quiz",name:"Football Quiz League",description:"Televised sports match quiz with match stats, goal celebrations, and rewards!"};_uiManager;_audioManager;_saveManager;_quizEngine;_activeScoreboard=null;_targetCompetitionId="walia-ibex";_preloadedQuestions=null;matchType="casual";dailyChallengeId;async initialize(e){this._uiManager=e,this._quizEngine=new je;const t=window;this._audioManager=t.ethioAudio||new ze,this._saveManager=t.ethioSave||new $e}async start(){const e=M.getById(this._targetCompetitionId)||M.getAll()[0];let t=this._preloadedQuestions;(!t||t.length===0)&&(t=await N.getInstance().fetchQuestions(e.id,10,r.currentLocale)),this._activeScoreboard=new Te(this._uiManager,this._audioManager,this._quizEngine,e,t,{onMatchComplete:(i,a)=>this._showMatchStats(e.id,i,a),onExitMatch:()=>this.destroy()}),this._activeScoreboard.startMatch()}async resume(e){const t=M.getById(e.matchType)||M.getAll()[0];this._activeScoreboard=new Te(this._uiManager,this._audioManager,this._quizEngine,t,e.questions,{onMatchComplete:(i,a)=>this._showMatchStats(t.id,i,a),onExitMatch:()=>this.destroy()}),this._activeScoreboard.resumeSession(e)}setCompetition(e){this._targetCompetitionId=e}setPreloadedQuestions(e){this._preloadedQuestions=e}_showMatchStats(e,t,i){const a=window;a.ethioCache&&a.ethioCache.setQuizActive(!1);const n=this.matchType==="daily"?"daily":e,o=new Ze(this._uiManager,this._saveManager,this._audioManager,t,i,n,()=>{const s=window;s.ethioCloseGame?s.ethioCloseGame():s.ethioReloadHome&&s.ethioReloadHome()});this.matchType==="daily"&&this.dailyChallengeId&&(o.dailyChallengeId=this.dailyChallengeId),o.render()}update(e){}destroy(){this._activeScoreboard&&(this._activeScoreboard.destroy(),this._activeScoreboard=null),this._uiManager.clear(),console.log("[QuizGameMode] Destroyed.");const e=window;e.ethioCloseGame?e.ethioCloseGame():e.ethioReloadHome&&e.ethioReloadHome()}}class ee{static _instance=null;static getInstance(){return ee._instance||(ee._instance=new ee),ee._instance}async fetchPlatformAnalytics(){if(w.isOnline&&m)try{const{count:e}=await m.from("users").select("*",{count:"exact",head:!0}),{count:t}=await m.from("matches").select("*",{count:"exact",head:!0}),{count:i}=await m.from("competitions").select("*",{count:"exact",head:!0}),{count:a}=await m.from("subscriptions").select("*",{count:"exact",head:!0});return{activePlayers:e||124500,totalMatches:t||185e4,activeCompetitions:i||15,subscribedUsers:a||88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12}}catch(e){console.warn("[AnalyticsService] Supabase analytics query failed, returning fallback metrics:",e)}return{activePlayers:124500,totalMatches:185e4,activeCompetitions:15,subscribedUsers:88200,smsOtpSuccessRate:"99.4%",avgLatencyMs:12}}}class _{static render(e,t="",i=!0){return`
            <div class="ethio-fantasy-app-bar" style="
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: calc(env(safe-area-inset-top) + 16px) 16px 16px 16px;
                gap: 20px;
                width: 100%;
                box-sizing: border-box;
                z-index: 100;
                position: relative;
            ">
                <div style="display: flex; width: 100%; justify-content: space-between; align-items: center;">
                    ${i?`
                    <button class="app-bar-back-btn ethio-profile-btn" style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        width: 160px;
                        height: 56px;
                        background: linear-gradient(135deg, rgba(7, 27, 45, 0.95) 0%, rgba(7, 27, 45, 0.7) 100%);
                        border: 1px solid rgba(0, 200, 83, 0.3);
                        border-radius: 16px;
                        color: white;
                        cursor: pointer;
                        padding: 0 16px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(0, 200, 83, 0.15);
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        flex-shrink: 0;
                        z-index: 9999;
                        position: relative;
                    " aria-label="Back">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span style="font-size: 18px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Back</span>
                    </button>`:'<div style="width: 160px;"></div>'}
                    
                    ${t?`
                    <div class="app-bar-actions">
                        ${t}
                    </div>
                    `:""}
                </div>

                ${e?`
                <div class="app-bar-title" style="
                    color: white;
                    font-weight: 900;
                    font-size: 28px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    text-shadow: 0 2px 12px rgba(0,0,0,0.6);
                    padding-left: 4px;
                ">${e}</div>
                `:""}
            </div>
        `}static bind(e,t){const i=e.querySelector(".app-bar-back-btn");i&&i.addEventListener("click",a=>{a.preventDefault(),t()})}}class tt{_uiManager;_audioManager;_onClose;_activeTab="QUESTIONS";_statusMessage="";_analyticsData=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onClose=i}async render(){const e=this._uiManager.container,t=M.getAll();this._analyticsData=await ee.getInstance().fetchPlatformAnalytics(),e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Admin Header -->
                    ${_.render("CMS & ADMIN PANEL")}

                    ${this._statusMessage?`
                        <div style="
                            background: rgba(0, 200, 83, 0.2);
                            border: 1px solid rgba(0, 200, 83, 0.4);
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
                    background: linear-gradient(135deg, #FFD54F 0%, #FFA500 100%);
                    color: #0F172A;
                    border-color: var(--fds-gold-primary);
                    font-weight: bold;
                }
                .form-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: rgba(7, 27, 45, 0.7);
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
                            ${Object.values(Oe).map(t=>`<option value="${t.id}">${t.badge} ${t.nameEn}</option>`).join("")}
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

                ${L.Button({id:"add-question-btn",text:"SAVE QUESTION TO CLOUD DATABASE",icon:"💾",variant:"primary",fullWidth:!0})}
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

                ${L.Button({id:"import-csv-btn",text:"PROCESS & IMPORT QUESTIONS",icon:"🚀",variant:"primary",fullWidth:!0})}
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
                ${L.Button({id:"admin-add-comp-btn",text:"SAVE & PUBLISH COMPETITION",variant:"primary",fullWidth:!0})}
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
                <div class="glass-card" style="padding: 20px; border-color: rgba(0,200,83,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">TOTAL REGISTERED PLAYERS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--pitch-green); margin-top: 6px;">
                        ${t.activePlayers.toLocaleString()}
                    </div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(255,213,79,0.3);">
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
        `}_bindEvents(){const e=this._uiManager.container;_.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".tab-btn").forEach(t=>{t.addEventListener("click",i=>{this._audioManager.playClick();const a=i.currentTarget.getAttribute("data-tab");a&&(this._activeTab=a,this._statusMessage="",this.render())})}),e.querySelector("#add-question-btn")?.addEventListener("click",async()=>{this._audioManager.playClick();const t=e.querySelector("#q-category")?.value,i=parseInt(e.querySelector("#q-difficulty")?.value||"2",10),a=parseInt(e.querySelector("#q-correct")?.value||"0",10),n=e.querySelector("#q-prompt-en")?.value.trim(),o=e.querySelector("#q-prompt-am")?.value.trim(),s=e.querySelector("#q-prompt-om")?.value.trim(),l=e.querySelector("#q-opt0-en")?.value.trim(),d=e.querySelector("#q-opt1-en")?.value.trim(),c=e.querySelector("#q-opt2-en")?.value.trim(),h=e.querySelector("#q-opt3-en")?.value.trim(),g=e.querySelector("#q-opt0-am")?.value.trim(),f=e.querySelector("#q-opt1-am")?.value.trim(),x=e.querySelector("#q-opt2-am")?.value.trim(),v=e.querySelector("#q-opt3-am")?.value.trim(),u=e.querySelector("#q-opt0-om")?.value.trim(),y=e.querySelector("#q-opt1-om")?.value.trim(),b=e.querySelector("#q-opt2-om")?.value.trim(),k=e.querySelector("#q-opt3-om")?.value.trim();if(!n||!l||!d||!c||!h){this._statusMessage="❌ Please fill in the English prompt and all 4 English options.",this.render();return}const A={category:t,difficulty:i,competition_id:t,prompt_en:n,prompt_am:o||null,prompt_om:s||null,options_en:[l,d,c,h],options_am:g&&f&&x&&v?[g,f,x,v]:null,options_om:u&&y&&b&&k?[u,y,b,k]:null,correct_index:a,is_active:!0};if(m){const{error:S}=await m.from("questions").insert(A);S?this._statusMessage=`❌ Cloud Insert Failed: ${S.message}`:this._statusMessage="✅ Question published to Cloud database successfully!"}else this._statusMessage="✅ Question added locally (Supabase offline).";this.render()}),e.querySelector("#import-csv-btn")?.addEventListener("click",async()=>{this._audioManager.playClick();const t=e.querySelector("#bulk-csv-area")?.value.trim();if(!t){this._statusMessage="❌ Please paste CSV content to import.",this.render();return}const i=t.split(`
`).map(o=>o.trim()).filter(o=>o.length>0);if(i.length<2){this._statusMessage="❌ CSV must contain a header row and at least 1 data row.",this.render();return}let a=0;const n=i.slice(1);for(const o of n){const s=o.split(",").map(l=>l.trim());if(s.length>=8){const[l,d,c,h,g,f,x,v]=s,u={category:l||"football-history",difficulty:parseInt(d||"1",10),competition_id:l||"football-history",prompt_en:c,options_en:[h,g,f,x],correct_index:parseInt(v||"0",10),is_active:!0};m&&await m.from("questions").insert(u),a++}}this._statusMessage=`✅ Successfully processed & imported ${a} questions!`,this.render()}),e.querySelector("#admin-add-comp-btn")?.addEventListener("click",()=>{const t=e.querySelector("#admin-comp-name"),i=e.querySelector("#admin-comp-badge"),a=e.querySelector("#admin-comp-desc");if(t&&t.value.trim()!==""){const n=t.value.toLowerCase().replace(/\s+/g,"-");M.addCompetition({id:n,name:t.value.trim(),nameEn:t.value.trim(),badge:i.value.trim()||"⚽",description:a.value.trim()||"Custom Competition",color:"#1e3a8a",questionCount:10}),this._audioManager.playClick(),this._statusMessage=`✅ Competition '${t.value.trim()}' Published Successfully!`,this.render()}})}}class D{static _instance=null;static getInstance(){return D._instance||(D._instance=new D),D._instance}async getLeaderboard(e,t="all_time",i=50){if(w.isOnline&&m)try{if(t==="daily"){const a=new Date().toISOString().split("T")[0],{data:n,error:o}=await m.rpc("get_daily_leaderboard",{p_date:a});if(!o&&n&&Array.isArray(n))return n.map((l,d)=>({rank:d+1,userId:l.user_id,username:l.username||"Anonymous Player",avatarUrl:l.avatar_url,eloRating:1200,score:l.score||0,matchesPlayed:1,wins:1}))}else{const{data:a,error:n}=await m.rpc("get_leaderboard",{p_competition_id:e||null,p_time_range:t,p_limit:i});if(!n&&a&&Array.isArray(a))return a.map(o=>({rank:o.rank,userId:o.user_id,username:o.username||"Anonymous Player",avatarUrl:o.avatar_url,eloRating:o.elo_rating||1200,score:o.score||0,matchesPlayed:o.matches_played||0,wins:o.wins||0}))}}catch(a){console.warn("[LeaderboardService] RPC query failed, returning empty list:",a)}return[]}async getUserRank(e,t){if(!e)return null;try{const a=(await this.getLeaderboard(t)).find(n=>n.userId===e);if(a)return a.rank}catch(i){console.warn("[LeaderboardService] Failed to get user rank:",i)}return null}async getMyDailyStats(){if(!m||!w.isOnline)return null;try{const{data:{user:e}}=await m.auth.getUser();if(!e)return null;const t=new Date().toISOString().split("T")[0],{data:i,error:a}=await m.rpc("get_daily_leaderboard",{p_date:t});if(a||!i||!Array.isArray(i))return null;const n=i.findIndex(o=>o.user_id===e.id);return n===-1?null:{rank:String(n+1),score:String(i[n].score||0)}}catch(e){return console.warn("[LeaderboardService] getMyDailyStats failed:",e),null}}}class j{static _instance=null;static getInstance(){return j._instance||(j._instance=new j),j._instance}async getTodayChallenge(){if(w.isOnline&&m)try{const{data:t,error:i}=await m.rpc("get_daily_challenge");if(!i&&t){const a=t;if(a.available&&a.question_ids&&a.question_ids.length>0){const n=await N.getInstance().fetchQuestionsByIds(a.question_ids,r.currentLocale),o=a.completed||!1;return{id:a.id,themeEn:a.theme_en||"Daily Football Quiz Challenge",themeAm:a.theme_am||"የዕለቱ የእግር ኳስ ጥያቄ ተግዳሮት",themeOm:a.theme_om||"Qormaata Gaaffii Kubbaa Miilaa Guyyaa",bonusMultiplier:a.bonusMultiplier||1.5,completed:o,questions:n}}}}catch(t){console.warn("[DailyChallengeManager] Supabase fetch failed:",t)}return{themeEn:"Daily Champions Challenge",themeAm:"የዕለቱ የሻምፒዮኖች ተግዳሮት",themeOm:"Qormaata Chaampiyoonii Guyyaa",bonusMultiplier:1.5,completed:!1,questions:await N.getInstance().fetchQuestions("world-cup",10,r.currentLocale)}}}class it{static checkAndShow(e){const t="ETHIO_FOOTBALL_LAST_LOGIN",i=new Date().toISOString().split("T")[0];if(localStorage.getItem(t)===i)return;localStorage.setItem(t,i);const o=(e.profile.streakCount||0)+1;e.updateStreak(o);const s=100+o*25;e.addXp(s)}}class U{static _instance=null;_memoryCache=new Map;_isQuizActive=!1;static getInstance(){return U._instance||(U._instance=new U),U._instance}constructor(){}setQuizActive(e){this._isQuizActive=e}get isQuizActive(){return this._isQuizActive}async getOrFetch(e,t,i={}){const a=i.ttlMs??3e5,n=this.get(e);if(n&&!i.forceRefresh&&!this.isStale(e)||this._isQuizActive&&n)return n;try{const o=await t();return this.set(e,o,a),o}catch(o){if(n)return n;throw o}}get(e){return this._memoryCache.has(e)?this._memoryCache.get(e).data:null}set(e,t,i=300*1e3){this._memoryCache.set(e,{data:t,timestamp:Date.now(),ttlMs:i})}isStale(e){const t=this._memoryCache.get(e);return t?Date.now()-t.timestamp>t.ttlMs:!0}invalidate(e){this._memoryCache.delete(e)}clear(){this._memoryCache.clear()}}class oe{static attach(e,t){let i=0,a=0,n=!1;const o=document.createElement("div");o.className="pull-to-refresh-indicator",o.style.cssText=`
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
        `,o.innerHTML=`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C853" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
        `,e.style.position="relative",e.appendChild(o),e.addEventListener("touchstart",s=>{U.getInstance().isQuizActive||e.scrollTop<=0&&(i=s.touches[0].clientY,n=!0)},{passive:!0}),e.addEventListener("touchmove",s=>{if(!n||U.getInstance().isQuizActive)return;a=s.touches[0].clientY;const l=a-i;if(l>0&&e.scrollTop<=0){const d=Math.min(l*.45,75);o.style.top=`${d-42}px`,o.style.opacity=`${Math.min(d/50,1)}`;const c=o.querySelector("svg");c&&(c.style.transform=`rotate(${d*4}deg)`)}},{passive:!0}),e.addEventListener("touchend",async()=>{if(!n||U.getInstance().isQuizActive)return;if(n=!1,a-i>110&&e.scrollTop<=0){o.style.top="16px";const d=o.querySelector("svg");d&&(d.style.transition="transform 1s linear",d.style.transform="rotate(1080deg)");const c=e.scrollTop;try{await t(),e.scrollTop=c}catch(h){console.error("[PullToRefresh] Refresh failed:",h)}}o.style.pointerEvents="none",o.style.top="-50px",o.style.opacity="0";const l=o.querySelector("svg");l&&(l.style.transition="none",l.style.transform="rotate(0deg)"),i=0,a=0})}}class at{_saveManager;_audioManager;_uiManager;_callbacks;_timerInterval=null;_autoScrollInterval=null;_resetHandler=null;constructor(e,t,i,a){this._saveManager=e,this._audioManager=t,this._uiManager=i,this._callbacks=a}render(){const e=this._uiManager.container,t=this._saveManager.profile,i=t.totalMatches||0,a=i>0?Math.round((t.totalWins||0)/i*100):0,n=t.streakCount||0,o=z.getInstance().getActiveSession();let s="";o&&o.matchType==="daily"&&(s+=`
                <div class="glass-card fade-in-up" style="padding: clamp(12px, 2vh, 16px); border-color: rgba(0,200,83,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #4ADE80; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Continue Challenge</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">Daily Challenge</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 4px;">Round ${o.currentIndex+1} of ${o.totalQuestions}</div>
                    </div>
                    ${L.Button({id:"btn-continue-challenge",text:"Resume",variant:"primary"})}
                </div>
            `),e.innerHTML=`
            <div class="stadium-container stadium-bg-wrapper" style="pointer-events: auto; padding-bottom: 80px;">
                
                <!-- STADIUM LIGHT BEAMS & FLOATING GRAPHICS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>
                <div class="floating-ball-graphic" style="top: 15%; left: 5%; font-size: 40px;">⚽</div>
                <div class="floating-ball-graphic" style="top: 60%; right: 8%; font-size: 32px; animation-delay: -2s;">⚽</div>

                <!-- TOP APP BAR (Ethio Telecom Branded) -->
                <div class="tv-broadcast-header fade-in-up" style="justify-content: space-between; padding: 8px 16px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(2,6,23,0.85); backdrop-filter: blur(12px);">
                    <!-- Left: Profile & Brand -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #009624, #00C853); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid #00C853;">
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
                
                <style>
                    .ethio-home-card {
                        background: linear-gradient(135deg, rgba(7, 27, 45, 0.85) 0%, rgba(7, 27, 45, 0.7) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.05);
                        border-radius: 16px;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    /* Light Reflection */
                    .ethio-home-card::before {
                        content: '';
                        position: absolute;
                        top: 0; left: -100%; width: 50%; height: 100%;
                        background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
                        transform: skewX(-20deg);
                        pointer-events: none;
                    }
                    
                    /* Interactive Cards */
                    .ethio-home-card.interactive {
                        cursor: pointer;
                        transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                    }
                    .ethio-home-card.interactive:hover {
                        background: linear-gradient(135deg, rgba(15, 35, 55, 0.9) 0%, rgba(7, 27, 45, 0.8) 100%);
                        border-color: rgba(0, 200, 83, 0.3);
                        box-shadow: 0 12px 32px rgba(0, 200, 83, 0.15);
                        transform: translateY(-2px);
                    }
                    .ethio-home-card.interactive:active {
                        transform: scale(0.97);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                        background: linear-gradient(135deg, rgba(20, 45, 70, 0.9) 0%, rgba(7, 27, 45, 0.8) 100%);
                    }
                    
                    /* HUD Module */
                    .hud-module {
                        background: linear-gradient(135deg, rgba(7, 27, 45, 0.85) 0%, rgba(7, 27, 45, 0.6) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 14px;
                        padding: 8px 4px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05);
                        position: relative;
                        overflow: hidden;
                    }
                    /* HUD Light Reflection */
                    .hud-module::before {
                        content: '';
                        position: absolute;
                        top: 0; left: -100%; width: 50%; height: 100%;
                        background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
                        transform: skewX(-20deg);
                        pointer-events: none;
                    }
                    .hud-module-icon {
                        font-size: 16px;
                        margin-bottom: 2px;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
                    }
                    .hud-module-label {
                        font-size: 9px;
                        color: var(--fds-text-dim);
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 2px;
                        text-align: center;
                    }
                    .hud-module-value {
                        font-size: 16px;
                        font-weight: 900;
                        color: white;
                        font-family: var(--fds-font-mono);
                        transition: color 0.3s ease, text-shadow 0.3s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    .hud-value-gold { color: #FFD54F; text-shadow: 0 0 12px rgba(255, 213, 79, 0.4); }
                    .hud-value-green { color: #00C853; text-shadow: 0 0 12px rgba(0, 200, 83, 0.4); }
                    .hud-value-red { color: #EF4444; text-shadow: 0 0 12px rgba(239, 68, 68, 0.4); }
                </style>

                <!-- COMPACT TELEMETRY ROW -->
                <div style="max-width: 900px; margin: 0 auto; padding: 0 16px;">
                    <div id="home-daily-stats-row" class="fade-in-up" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 0;">
                        <div class="hud-module">
                            <div class="hud-module-icon">🔥</div>
                            <div class="hud-module-label">Daily Streak</div>
                            <div class="hud-module-value hud-value-red">${n}</div>
                        </div>
                        <div class="hud-module">
                            <div class="hud-module-icon" style="color: #FFD54F;">🏆</div>
                            <div class="hud-module-label">Daily Rank</div>
                            <div id="home-daily-rank" class="hud-module-value hud-value-gold">--</div>
                        </div>
                        <div class="hud-module">
                            <div class="hud-module-icon" style="color: #FFD54F;">★</div>
                            <div class="hud-module-label">Daily Score</div>
                            <div id="home-daily-score" class="hud-module-value hud-value-gold">--</div>
                        </div>
                    </div>
                </div>

                <!-- SCROLLABLE BODY CONTENT (Responsive Grid System) -->
                <div style="max-width: 960px; margin: 0 auto; padding: 12px 16px 100px 16px; display: flex; flex-direction: column; gap: 12px;">
                    
                    <!-- PREMIUM AD BANNER CAROUSEL -->
                    <div class="fade-in-up" style="position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4); background: linear-gradient(135deg, rgba(7, 27, 45, 0.8) 0%, rgba(7, 27, 45, 0.6) 100%); border: 1px solid rgba(255, 255, 255, 0.08); aspect-ratio: 16/5; width: 100%;">
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
                    <div class="fade-in-up ethio-home-card interactive" style="
                        background: linear-gradient(135deg, rgba(0, 200, 83, 0.4) 0%, rgba(7, 27, 45, 0.95) 70%, rgba(255, 213, 79, 0.4) 100%), url('/assets/images/hero_banner.png') center/cover no-repeat;
                        background-blend-mode: overlay;
                        padding: 12px 16px;
                        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 213, 79, 0.15);
                        animation-delay: 100ms;
                    " id="card-daily">
                        <!-- Background Glow Accent -->
                        <div style="position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; background: radial-gradient(circle, rgba(255,213,79,0.3) 0%, transparent 70%); pointer-events: none;"></div>

                        <!-- Badge Row -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span id="daily-players-count" class="fds-badge" style="background: rgba(0,200,83,0.2); border: 1px solid #00C853; color: #00C853; font-weight: 800;">
                                ${G("home.liveMatch")}
                            </span>
                        </div>

                        <!-- Title & Description -->
                        <div style="text-align: center; margin-bottom: 12px;">
                            <h2 style="font-size: var(--fds-font-lg); font-weight: 900; color: white; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                                ETHIO FANTASY
                            </h2>
                        </div>

                        <!-- Hero Primary Action Button — replaced by server data in _fetchDynamicData -->
                        <div id="home-daily-action">
                        </div>
                    </div>

                    <!-- NEW CONTEXTUAL UI -->
                    ${s}

                    <!-- 3. STATISTICS DASHBOARD CARD -->
                    <div class="fade-in-up ethio-home-card interactive" style="padding: 12px 16px; margin-top: 4px; margin-bottom: 0; border: 1px solid rgba(0, 200, 83, 0.3); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 200, 83, 0.05);" id="performance-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: var(--fds-font-md); font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 12px;">
                                <span style="color: #00C853; text-shadow: 0 0 12px rgba(0,200,83,0.5); font-size: 24px;">📊</span> ${G("home.performance")}
                            </div>
                            <button id="btn-view-all-stats" style="background: rgba(0, 200, 83, 0.2); border: 1px solid rgba(0,200,83,0.4); color: #00C853; font-size: var(--fds-font-sm); font-weight: 900; cursor: pointer; padding: 8px 18px; border-radius: 24px; letter-spacing: 0.5px; transition: all 0.2s; z-index: 10; position: relative; box-shadow: 0 4px 12px rgba(0, 200, 83, 0.2);">${G("home.details")}</button>
                        </div>
                        
                        ${i===0?`
                        <div style="text-align: center; padding: 24px 0; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;">
                            <div style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📊</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: white; margin-bottom: 4px;">No History Yet</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600;">Your completed matches and stats will appear here.</div>
                        </div>
                        `:`
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                            <div class="hud-module">
                                <div class="hud-module-icon">🎯</div>
                                <div class="hud-module-label">${G("home.matches")}</div>
                                <div class="hud-module-value">${i}</div>
                            </div>
                            <div class="hud-module">
                                <div class="hud-module-icon">⚡</div>
                                <div class="hud-module-label">${G("match.accuracy")}</div>
                                <div class="hud-module-value hud-value-green">${a}%</div>
                            </div>
                            <div class="hud-module">
                                <div class="hud-module-icon" style="color: #FFD54F;">★</div>
                                <div class="hud-module-label">${G("home.points")}</div>
                                <div class="hud-module-value hud-value-gold">${t.xp}</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                            <div class="hud-module" style="flex-direction: row; justify-content: space-between; padding: 14px 16px;">
                                <div class="hud-module-label" style="margin-bottom: 0;">${G("home.score")}</div>
                                <div class="hud-module-value">${t.highScores&&t.highScores["football-quiz"]?t.highScores["football-quiz"]:0}</div>
                            </div>
                            <div class="hud-module" style="flex-direction: row; justify-content: space-between; padding: 14px 16px;">
                                <div class="hud-module-label" style="margin-bottom: 0;">Divisions</div>
                                <div class="hud-module-value hud-value-gold">1st</div>
                            </div>
                        </div>
                        `}
                    </div>

                    <!-- 4. LIVE CHAMPIONSHIP LEADERBOARD HIGHLIGHT -->
                    <div class="fade-in-up ethio-home-card interactive" style="padding: 20px 16px; display: none;" id="btn-view-leaderboard-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                                <span style="color: #FFD54F; text-shadow: 0 0 12px rgba(255,213,79,0.5);">🏆</span> ${G("home.rankingsTitle")}
                            </div>
                        </div>
                        <div id="home-leaderboard-preview" style="display: flex; flex-direction: column;">
                            ${L.SkeletonList(3)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._startCountdownTimer(),this._bindEvents(),this._fetchDynamicData();const l=e.querySelector(".stadium-container");l&&oe.attach(l,async()=>{this._audioManager.playClick(),await new Promise(d=>setTimeout(d,600)),this.render()}),it.checkAndShow(this._saveManager),this._resetHandler||(this._resetHandler=()=>{this.render()},window.addEventListener("ethio:dailyReset",this._resetHandler))}async _fetchDynamicData(){try{const o=(await j.getInstance().getTodayChallenge()).completed,s=document.getElementById("home-daily-action");s&&(o?(s.innerHTML=`
                        <div style="display: flex; justify-content: center;">
                            <div style="background: rgba(0,0,0,0.6); border-radius: 999px; padding: 10px 24px; text-align: center; border: 1px solid rgba(255,213,79,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: default;">
                                <div style="font-size: 10px; font-weight: 800; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Next Challenge In</div>
                                <div id="next-daily-countdown" style="font-size: 20px; font-weight: 900; color: white; font-family: var(--fds-font-mono); letter-spacing: 1px;">--:--:--</div>
                            </div>
                        </div>`,this._startCountdownTimer()):(s.innerHTML=`${L.Button({id:"btn-daily-match",text:"DAILY CHALLENGE",variant:"primary",fullWidth:!0})}`,document.getElementById("btn-daily-match")?.addEventListener("click",d=>{this._addRipple(d),this._audioManager.playClick(),this._callbacks.onDailyChallenge()})))}catch{const o=document.getElementById("home-daily-action");o&&(o.innerHTML=`${L.Button({id:"btn-daily-match",text:"DAILY CHALLENGE",variant:"primary",fullWidth:!0})}`,document.getElementById("btn-daily-match")?.addEventListener("click",()=>this._callbacks.onDailyChallenge()))}try{const n=await D.getInstance().getMyDailyStats(),o=document.getElementById("home-daily-rank"),s=document.getElementById("home-daily-score");o&&(o.textContent=n?`#${n.rank}`:"Unranked"),s&&(s.textContent=n?n.score:"0")}catch{}const e=M.getAll().filter(n=>n.status==="live"),t=e.find(n=>n.id==="daily")||e[0],i=document.getElementById("daily-players-count"),a=document.getElementById("daily-play-btn-text");t?(i&&(i.innerHTML=`🟢 LIVE MATCH • ${(t.participants||0).toLocaleString()} PLAYERS`),a&&(a.innerText=`⚡ KICK OFF NOW (+${t.prize_pool||0} XP)`)):(i&&(i.innerHTML="⚪ NO LIVE MATCHES"),a&&(a.innerText="⚡ PLAY CASUAL MATCH"));try{const n=await D.getInstance().getLeaderboard(void 0,"all_time",3),o=document.getElementById("home-leaderboard-preview");if(o&&n.length>0){const s=["🥇","🥈","🥉"],l=["rgba(255,213,79,0.08)","rgba(255,255,255,0.04)","rgba(255,255,255,0.02)"],d=["white","#E2E8F0","#CBD5E1"];o.innerHTML=n.map((c,h)=>`
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${l[h]}; padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${s[h]}</span>
                            <span style="font-size: var(--fds-font-sm); font-weight: ${h===0?"800":"700"}; color: ${d[h]};">${c.username}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-md); font-weight: 900; color: ${h===0?"var(--fds-gold-primary)":"white"}; font-family: var(--fds-font-mono); line-height: 1.1;">${c.score.toLocaleString()}</div>
                            <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Points</div>
                        </div>
                    </div>
                `).join("")}else o&&(o.innerHTML='<div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); text-align: center;">No ranked players yet</div>')}catch(n){console.error(n)}}_startCountdownTimer(){this._timerInterval&&clearInterval(this._timerInterval);const e=M.getAll().filter(n=>n.status==="live"),t=e.find(n=>n.id==="daily")||e[0];let i=new Date().setHours(23,59,59,999);t&&t.end_time&&(i=new Date(t.end_time).getTime());const a=(n,o)=>{if(n.children.length!==o.length){n.innerHTML=o.split("").map(s=>`<span>${s}</span>`).join("");return}for(let s=0;s<o.length;s++){const l=n.children[s];l.textContent!==o[s]&&(l.textContent=o[s],l.classList.remove("digit-tick"),l.offsetWidth,l.classList.add("digit-tick"))}};this._timerInterval=window.setInterval(()=>{let n=Math.floor((i-new Date().getTime())/1e3);if(n<=0){this._timerInterval!==null&&(clearInterval(this._timerInterval),this._timerInterval=null),window.dispatchEvent(new Event("ethio:dailyReset"));return}const o=Math.floor(n/3600),s=Math.floor(n%3600/60),l=n%60,d=document.getElementById("daily-countdown");d&&a(d,`⏱️ ${o}h : ${s.toString().padStart(2,"0")}m : ${l.toString().padStart(2,"0")}s`);const c=document.getElementById("next-daily-countdown");c&&a(c,`${o.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}`)},1e3)}_bindEvents(){const e=this._uiManager.container;e.querySelector("#btn-daily-match-card")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-continue-challenge")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onDailyChallenge()}),e.querySelector("#btn-action-kickoff")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onKickOff()}),e.querySelector("#btn-action-leaderboard")?.addEventListener("click",a=>{this._addRipple(a),this._audioManager.playClick(),this._callbacks.onLeaderboard()}),e.querySelector("#btn-view-all-stats")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onViewStats&&this._callbacks.onViewStats()}),e.querySelector("#btn-notif")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onNotifications&&this._callbacks.onNotifications()}),e.querySelector("#btn-settings")?.addEventListener("click",()=>{this._audioManager.playClick(),this._callbacks.onSettings()});const t=e.querySelector("#ad-carousel"),i=e.querySelectorAll(".ad-dot");if(t&&i.length>0){let a=0;const n=d=>{i.forEach((c,h)=>{h===d?(c.classList.add("active"),c.style.opacity="1"):(c.classList.remove("active"),c.style.opacity="0.4")})},o=()=>{if(!t.clientWidth)return;a=(a+1)%i.length;const d=t.clientWidth*a,c=t.scrollLeft,h=d-c,g=400;let f=null;const x=v=>{f===null&&(f=v);const u=v-f,y=Math.min(u/g,1),b=y<.5?2*y*y:-1+(4-2*y)*y;t.scrollLeft=c+h*b,y<1&&requestAnimationFrame(x)};requestAnimationFrame(x),n(a)},s=()=>{clearInterval(this._autoScrollInterval),this._autoScrollInterval=setInterval(o,4e3)},l=()=>{clearInterval(this._autoScrollInterval)};t.addEventListener("scroll",()=>{if(!t.clientWidth)return;const d=Math.round(t.scrollLeft/t.clientWidth);d!==a&&d>=0&&d<i.length&&(a=d,n(a))},{passive:!0}),t.addEventListener("touchstart",l,{passive:!0}),t.addEventListener("touchend",s,{passive:!0}),t.addEventListener("mouseenter",l),t.addEventListener("mouseleave",s),s()}}_addRipple(e){const t=e.currentTarget,i=document.createElement("span");i.classList.add("m3-ripple-wave");const a=t.getBoundingClientRect(),n=Math.max(a.width,a.height);i.style.width=i.style.height=`${n}px`,i.style.left=`${e.clientX-a.left-n/2}px`,i.style.top=`${e.clientY-a.top-n/2}px`,t.appendChild(i),setTimeout(()=>i.remove(),400)}_maskPhone(e){let t;return e.startsWith("+")?t=e.substring(1):t=e,t.substring(0,4)+"****"+t.substring(t.length-2)}destroy(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null),this._autoScrollInterval&&(clearInterval(this._autoScrollInterval),this._autoScrollInterval=null),this._resetHandler&&(window.removeEventListener("ethio:dailyReset",this._resetHandler),this._resetHandler=null)}}const nt=[{id:"world-cup",name:"World Cup",baseColor:"rgba(18, 97, 160, 0.2)",glowColor:"rgba(255, 213, 79, 0.4)",accent:"#FFD54F"},{id:"champions-league",name:"Champions Lg",baseColor:"rgba(23, 78, 166, 0.2)",glowColor:"rgba(54, 217, 255, 0.4)",accent:"#36D9FF"},{id:"caf-champions",name:"CAF Champions",baseColor:"rgba(8, 116, 67, 0.2)",glowColor:"rgba(255, 213, 79, 0.4)",accent:"#FFD54F"},{id:"afcon",name:"AFCON",baseColor:"rgba(0, 140, 90, 0.2)",glowColor:"rgba(245, 197, 66, 0.4)",accent:"#F5C542"},{id:"ethiopian-premier",name:"Ethio League",baseColor:"rgba(11, 143, 77, 0.2)",glowColor:"rgba(244, 196, 48, 0.4)",accent:"#F4C430"},{id:"walia-ibex",name:"Walia Ibex",baseColor:"rgba(36, 92, 69, 0.2)",glowColor:"rgba(217, 164, 65, 0.4)",accent:"#D9A441"},{id:"premier-league",name:"Premier League",baseColor:"rgba(167, 25, 48, 0.2)",glowColor:"rgba(255, 213, 79, 0.4)",accent:"#FFD54F"},{id:"la-liga",name:"La Liga",baseColor:"rgba(198, 40, 40, 0.2)",glowColor:"rgba(255, 138, 0, 0.4)",accent:"#FF8A00"},{id:"serie-a",name:"Serie A",baseColor:"rgba(0, 77, 152, 0.2)",glowColor:"rgba(255, 255, 255, 0.4)",accent:"#FFFFFF"},{id:"bundesliga",name:"Bundesliga",baseColor:"rgba(204, 0, 0, 0.2)",glowColor:"rgba(255, 213, 79, 0.4)",accent:"#FFD54F"},{id:"legendary-players",name:"Legends",baseColor:"rgba(156, 124, 56, 0.2)",glowColor:"rgba(255, 213, 79, 0.4)",accent:"#FFD54F"},{id:"football-rules",name:"Rules & Refs",baseColor:"rgba(51, 51, 51, 0.2)",glowColor:"rgba(239, 68, 68, 0.4)",accent:"#EF4444"},{id:"transfer-market",name:"Transfers",baseColor:"rgba(0, 150, 136, 0.2)",glowColor:"rgba(0, 255, 170, 0.4)",accent:"#00FFAA"},{id:"stadiums",name:"Stadiums",baseColor:"rgba(84, 110, 122, 0.2)",glowColor:"rgba(144, 202, 249, 0.4)",accent:"#90CAF9"},{id:"football-history",name:"History",baseColor:"rgba(121, 85, 72, 0.2)",glowColor:"rgba(215, 204, 200, 0.4)",accent:"#D7CCC8"}];class rt{_uiManager;_audioManager;_callbacks;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._callbacks=i}render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                ${_.render("PLAY","",!1)}

                <style>
                    .ethio-play-card {
                        background: rgba(7, 27, 45, 0.85); /* #071B2D 85% */
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 22px;
                        padding: 24px 12px 20px 12px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 60px var(--cat-base);
                        transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease;
                        cursor: pointer;
                        min-height: 160px;
                    }
                    /* Subtle stadium-light reflection */
                    .ethio-play-card::before {
                        content: '';
                        position: absolute;
                        top: 0; left: -50%; width: 50%; height: 100%;
                        background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
                        transform: skewX(-20deg);
                        pointer-events: none;
                    }
                    .ethio-play-card:active {
                        transform: scale(0.97);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 0 20px var(--cat-base);
                    }
                    
                    .category-icon-wrapper {
                        width: 64px;
                        height: 64px;
                        margin-bottom: 16px;
                        filter: drop-shadow(0 8px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 16px var(--cat-glow));
                        transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
                        z-index: 2;
                    }
                    
                    .category-title {
                        font-size: 16px;
                        font-weight: 800;
                        color: white;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        text-align: center;
                        width: 100%;
                        padding: 0 4px;
                        line-height: 1.2;
                        z-index: 2;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    }
                    
                    .category-accent-line {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40px;
                        height: 4px;
                        background: #00C853; /* Primary EthioFantasy accent */
                        border-radius: 4px 4px 0 0;
                        box-shadow: 0 -2px 8px var(--cat-glow), 0 0 6px rgba(0, 200, 83, 0.6);
                    }
                </style>
                <div style="max-width: 960px; margin: 0 auto; padding: 24px 16px 100px 16px;">
                    
                    <h2 style="font-size: var(--fds-font-xl); font-weight: 900; margin-bottom: 24px; text-transform: uppercase; color: white; letter-spacing: 0.5px;">Game Modes</h2>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        
                        <!-- 15 CATEGORIES -->
                        ${nt.map((t,i)=>`
                        <div class="fade-in-up category-btn ethio-play-card" data-category="${t.id}" style="animation-delay: ${i*30}ms; --cat-accent: ${t.accent}; --cat-glow: ${t.glowColor}; --cat-base: ${t.baseColor};">
                            <div class="category-icon-wrapper" style="width: 100%; height: 120px; overflow: hidden; border-radius: 12px; margin-bottom: 12px;">
                                <img src="/assets/images/modes/${t.id}.jpg" alt="${t.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/images/modes/world-cup.jpg';" />
                            </div>
                            <div class="category-title">${t.name}</div>
                            <div class="category-accent-line"></div>
                        </div>
                        `).join("")}

                    </div>
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){this._uiManager.container.querySelectorAll(".category-btn").forEach(i=>{i.addEventListener("click",a=>{const n=a.currentTarget,o=n.getAttribute("data-category")||"random",s=n.getBoundingClientRect(),l=a,d=document.createElement("div"),c=Math.max(n.clientWidth,n.clientHeight),h=c/2;let g=l.clientX-s.left-h,f=l.clientY-s.top-h;d.style.width=d.style.height=`${c}px`,d.style.left=`${g}px`,d.style.top=`${f}px`,d.classList.add("ripple"),n.appendChild(d),setTimeout(()=>d.remove(),600),this._audioManager.playClick(),this._callbacks.onCasualPlay(o)})})}destroy(){}}class B{static _instance=null;_currentUser=null;_listeners=new Set;_saveManager;constructor(e){this._saveManager=e,this._initSession()}static normalisePhone(e){const t=e.replace(/\D/g,"");return t.startsWith("251")?"+"+t:t.startsWith("0")?"+251"+t.slice(1):e.startsWith("+")?e.replace(/\s+/g,""):"+251"+t}static getInstance(e){if(!B._instance){if(!e)throw new Error("[AuthManager] SaveManager required for initial instantiation.");B._instance=new B(e)}return B._instance}async _initSession(){if(!w.isOnline||!m){console.log("[AuthManager] Offline mode active."),this._notifyListeners();return}try{const{data:{session:e}}=await m.auth.getSession();e?.user?await this._fetchUserProfile(e.user.id):this._notifyListeners()}catch(e){console.error("[AuthManager] Failed to fetch session:",e),this._notifyListeners()}m.auth.onAuthStateChange(async(e,t)=>{console.log(`[AuthManager] Auth state changed: ${e}`),t?.user?await this._fetchUserProfile(t.user.id):(this._currentUser=null,this._notifyListeners())})}async refreshProfile(){this._currentUser&&await this._fetchUserProfile(this._currentUser.id)}async _fetchUserProfile(e,t=5,i){if(m){for(let a=0;a<t;a++){const{data:n,error:o}=await m.from("users").select("*").eq("id",e).single();if(o){if(o.code==="PGRST116"){const s=i?`Player_${i.slice(-4)}`:`Player_${e.slice(-4)}`,{data:l,error:d}=await m.from("users").insert({id:e,username:s,phone:i||null,locale:"en",elo_rating:0,coins:0,xp:0,total_matches:0,total_wins:0,subscription_tier:"free",streak_count:0,created_at:new Date().toISOString(),last_active:new Date().toISOString()}).select().single();if(!d&&l){this._currentUser=l,this._saveManager.syncWithCloudUser(l),this._notifyListeners(),console.log("[AuthManager] Created new user profile:",s);return}console.error("[AuthManager] Failed to create user profile:",d);break}if(console.warn(`[AuthManager] Error fetching user profile (attempt ${a+1}/${t}):`,o),a<t-1){await new Promise(s=>setTimeout(s,500));continue}}else if(n){this._currentUser=n,this._saveManager.syncWithCloudUser(n),this._notifyListeners();return}}console.error("[AuthManager] Failed to fetch user profile after retries."),this._notifyListeners()}}async signInWithPhone(e){if(!m)return{success:!1,error:"Supabase client offline"};const t=B.normalisePhone(e);try{const{error:i}=await m.auth.signInWithOtp({phone:t});return i?{success:!1,error:i.message}:{success:!0}}catch(i){return{success:!1,error:i.message||"Failed to send OTP"}}}async verifyOtp(e,t){if(!m)return{success:!1,error:"Supabase client offline"};const i=B.normalisePhone(e);try{const{data:a,error:n}=await m.auth.verifyOtp({phone:i,token:t,type:"sms"});return n?(console.error("[AuthManager] OTP Verification error:",n),{success:!1,error:n.message}):(a.user&&await this._fetchUserProfile(a.user.id,5,i),{success:!0})}catch(a){return{success:!1,error:a.message||"OTP verification failed"}}}async signOut(){m&&await m.auth.signOut(),this._currentUser=null,this._notifyListeners()}subscribe(e){return this._listeners.add(e),e(this._currentUser),()=>this._listeners.delete(e)}_notifyListeners(){this._listeners.forEach(e=>e(this._currentUser))}get currentUser(){return this._currentUser}get isGuest(){return!1}get isAuthenticated(){return this._currentUser!==null}}const ot=Object.freeze(Object.defineProperty({__proto__:null,AuthManager:B},Symbol.toStringTag,{value:"Module"}));class st{_uiManager;_audioManager;_authManager;_onSuccess;_phoneStep="INPUT_PHONE";_pendingPhone="";_statusMessage="";_devOtpCode="";_showSettings=!1;_settingsTab="main";_faqExpandedIndex=-1;_bannerInterval=null;_currentBanner=1;constructor(e,t,i,a){this._uiManager=e,this._audioManager=t,this._authManager=i,this._onSuccess=a,window.ethioOnBackPress=()=>this._showSettings?(this._settingsTab!=="main"?this._settingsTab="main":this._showSettings=!1,this.render(),!0):!1}_renderSettingsContent(){return this._settingsTab==="main"?`
                <div class="settings-tile" data-tab="language" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05); border-radius: 12px 12px 0 0;">
                    <div style="font-weight: 700; font-size: 16px;">${r.currentLocale==="am"?"ቋንቋ":r.currentLocale==="om"?"Afaan":"Language"}</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94A3B8;">${r.currentLocale==="am"?"አማርኛ":r.currentLocale==="om"?"Afan Oromo":"English"}</span>
                        <span>❯</span>
                    </div>
                </div>
                <div class="settings-tile sound-toggle" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 16px;">${r.currentLocale==="am"?"የድምፅ ውጤቶች":r.currentLocale==="om"?"Sagalee":"Sound Effects"}</div>
                    <div style="color: ${this._audioManager.isMuted?"#F87171":"#4ADE80"}; font-weight: 700;">${this._audioManager.isMuted?"OFF":"ON"}</div>
                </div>
                <div class="settings-tile" data-tab="tc" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; background: rgba(255,255,255,0.05);">
                    <div style="font-weight: 700; font-size: 16px;">${r.currentLocale==="am"?"ውሎች እና ሁኔታዎች":r.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions"}</div>
                    <span>❯</span>
                </div>
                <div class="settings-tile" data-tab="faq" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.05); border-radius: 0 0 12px 12px;">
                    <div style="font-weight: 700; font-size: 16px;">FAQ</div>
                    <span>❯</span>
                </div>
            `:this._settingsTab==="language"?`
                <div class="settings-tile lang-item" data-lang="en" style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between;">
                    <span>English</span>
                    ${r.currentLocale==="en"?"<span>✓</span>":""}
                </div>
                <div class="settings-tile lang-item" data-lang="am" style="padding: 16px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; display: flex; justify-content: space-between;">
                    <span>አማርኛ (Amharic)</span>
                    ${r.currentLocale==="am"?"<span>✓</span>":""}
                </div>
                <div class="settings-tile lang-item" data-lang="om" style="padding: 16px; background: rgba(255,255,255,0.05); cursor: pointer; border-radius: 0 0 12px 12px; display: flex; justify-content: space-between;">
                    <span>Afan Oromo</span>
                    ${r.currentLocale==="om"?"<span>✓</span>":""}
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
                    radial-gradient(circle at center, rgba(7, 27, 45, 0.8) 0%, rgba(2, 6, 23, 0.98) 100%),
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
                <div id="auth-banner-container" style="width: 100%; max-width: 400px; flex-shrink: 0; position: relative; height: clamp(110px, 22vh, 160px); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.3); background: #0F172A; touch-action: pan-y pinch-zoom; cursor: grab;">
                    <img id="auth-banner-bg" src="/assets/banners/${this._currentBanner}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 1; transition: opacity 0.8s ease-in-out;" draggable="false" />
                    <img id="auth-banner-fg" src="/assets/banners/${this._currentBanner===10?1:this._currentBanner+1}.png" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.8s ease-in-out;" draggable="false" />
                </div>
                
                <!-- Pagination Dots -->
                <div id="auth-banner-dots" style="display: flex; gap: 6px; margin-top: 12px; margin-bottom: clamp(12px, 2.5vh, 20px);">
                    ${Array.from({length:10}).map((a,n)=>`
                        <div style="width: 6px; height: 6px; border-radius: 50%; background: ${this._currentBanner===n+1?"#00C853":"rgba(255,255,255,0.2)"}; transition: background 0.3s ease;"></div>
                    `).join("")}
                </div>
                
                ${this._showSettings?`
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #0F172A; z-index: 1000; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden;">
                    ${_.render(this._settingsTab==="main"?r.currentLocale==="am"?"ቅንብሮች":r.currentLocale==="om"?"Qindaa'inoota":"Settings":this._settingsTab==="language"?r.currentLocale==="am"?"ቋንቋ ይምረጡ":r.currentLocale==="om"?"Afaan Filadhu":"Select Language":this._settingsTab==="tc"?"Terms & Conditions":"FAQ")}
                    <div style="padding: 20px; color: white; flex: 1; max-width: 600px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                        ${this._renderSettingsContent()}
                    </div>
                </div>
                `:""}

                <!-- Compact Sign In Card -->
                <div style="
                    background: #071B2D; border-radius: 24px; padding: 24px 16px;
                    width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    text-align: center; margin-bottom: 24px; flex-shrink: 0;
                ">
                    <h1 style="font-size: 20px; font-weight: 800; color: white; margin: 0 0 16px 0;">
                        ${r.currentLocale==="am"?"ይግቡ":r.currentLocale==="om"?"Seenaa":"Sign In"}
                    </h1>

                    ${this._statusMessage?`
                        <div style="color: #EF4444; font-size: 13px; margin-bottom: 12px; text-align: left;">
                            ${this._statusMessage}
                        </div>
                    `:""}

                    ${this._devOtpCode?`
                        <div style="
                            background: rgba(22, 163, 74, 0.1); border: 1px solid #16A34A; border-radius: 12px;
                            padding: 10px 14px; margin-bottom: 12px; text-align: left;
                        ">
                            <div style="font-size: 11px; font-weight: 700; color: #4ADE80; text-transform: uppercase; margin-bottom: 4px;">
                                🔑 Your OTP Code (Dev Mode)
                            </div>
                            <div style="font-size: 22px; font-weight: 900; color: white; letter-spacing: 4px;">
                                ${this._devOtpCode}
                            </div>
                        </div>
                    `:""}

                    <div style="text-align: left; margin-bottom: 16px;">
                        <input type="tel" id="phone-input" placeholder="2519XXXXXXXX / 2518XXXXXXXX" value="${i}" ${t?"disabled":""} style="
                            width: 100%; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px;
                            padding: 0 16px; height: 56px; color: #0F172A; font-size: 16px; outline: none; box-sizing: border-box;
                            opacity: ${t?"0.6":"1"}; transition: border-color 0.2s;
                        " onfocus="this.style.borderColor='#00C853'" onblur="this.style.borderColor='#E2E8F0'" />
                    </div>

                    <div style="display: flex; align-items: stretch; margin-bottom: 16px; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; height: 56px; opacity: ${t?"1":"0.6"}; transition: border-color 0.2s;" id="otp-container">
                        <input type="text" id="otp-input" maxlength="6"
                            placeholder="${r.currentLocale==="am"?"የ 6-አሃዝ ኮድ":r.currentLocale==="om"?"Koodii dijiitii 6":"6-digit code"}"
                            ${t?"":"disabled"}
                            style="
                            flex: 1; background: transparent; border: none; padding: 0 16px;
                            color: #0F172A; font-size: 16px; outline: none; width: 100%;
                            letter-spacing: 2px; font-weight: 700; height: 100%;
                        " onfocus="document.getElementById('otp-container').style.borderColor='#00C853'" onblur="document.getElementById('otp-container').style.borderColor='#E2E8F0'" />
                        <button id="send-otp-btn" style="
                            background: transparent; color: #00C853; border: none; padding: 0 16px; border-left: 1px solid #E2E8F0;
                            font-size: 14px; font-weight: 800; cursor: ${t?"default":"pointer"}; outline: none;
                            opacity: ${t?"0.7":"1"}; white-space: nowrap; height: 100%;
                        " ${t?"disabled":""}>
                            ${r.currentLocale==="am"?"ኮድ ያግኙ":r.currentLocale==="om"?"Koodii fudhadhu":"Get code"}
                        </button>
                    </div>

                    <div id="sign-in-container" style="margin-bottom: 0;">
                        <button id="verify-otp-btn" disabled style="
                            width: 100%; background: #00C853; color: white; border: none; border-radius: 12px;
                            height: 56px; font-size: 16px; font-weight: 800; cursor: not-allowed; opacity: 0.5; transition: opacity 0.2s;
                        ">${r.currentLocale==="am"?"ይግቡ":r.currentLocale==="om"?"Seenaa":"Sign In"}</button>
                    </div>
                    
                    ${t?`
                    <div style="margin-top: 16px; display: flex; justify-content: center;">
                        <button id="change-phone-btn" style="background: none; border: none; color: #FFD54F; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;">
                            ${r.currentLocale==="am"?"ቁጥር ይቀይሩ":r.currentLocale==="om"?"Lakkoofsa jijjiiri":"Change number"}
                        </button>
                    </div>
                    `:""}
                </div>

                <!-- Registration & Subscribe -->
                <div style="width: 100%; max-width: 400px; text-align: center; margin-bottom: 12px;">
                    <span style="color: #64748B; font-size: 14px; font-weight: 600;">Don't Have an Account?</span>
                    <span id="btn-register-here" style="color: #00C853; font-size: 14px; font-weight: 800; cursor: pointer; margin-left: 4px;">Register Here</span>
                </div>

                <button id="auth-subscribe-btn" style="
                    background: rgba(7, 27, 45, 0.6); color: #00C853;
                    border: 2px solid #00C853; border-radius: 12px; height: 56px; font-size: 16px;
                    font-weight: 800; width: 100%; max-width: 400px; cursor: pointer;
                    flex-shrink: 0; margin-bottom: clamp(16px, 4vh, 40px); transition: background 0.2s;
                " onmouseover="this.style.background='rgba(0,200,83,0.1)'" onmouseout="this.style.background='rgba(7, 27, 45, 0.6)'">
                    ${r.currentLocale==="am"?"ሰብስክራይብ":r.currentLocale==="om"?"Galmoofadhu":"Subscribe"}
                </button>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container,t=e.querySelector("#auth-banner-container");if(t){let h=0,g=0,f=!1;const x=b=>{this._currentBanner+=b,this._currentBanner>10&&(this._currentBanner=1),this._currentBanner<1&&(this._currentBanner=10),this.render()},v=b=>{h=b,f=!0},u=b=>{f&&(g=b)},y=()=>{if(!f)return;f=!1;const b=h-g;Math.abs(b)>50&&g!==0&&x(b>0?1:-1),g=0};t.addEventListener("touchstart",b=>v(b.touches[0].clientX)),t.addEventListener("touchmove",b=>u(b.touches[0].clientX)),t.addEventListener("touchend",y),t.addEventListener("mousedown",b=>v(b.clientX)),t.addEventListener("mousemove",b=>u(b.clientX)),t.addEventListener("mouseup",y),t.addEventListener("mouseleave",y)}this._bannerInterval&&(clearInterval(this._bannerInterval),this._bannerInterval=null),this._showSettings||(this._bannerInterval=setInterval(()=>{const h=e.querySelector("#auth-banner-bg"),g=e.querySelector("#auth-banner-fg");h&&g&&(g.style.opacity="1",setTimeout(()=>{if(!h||!g)return;h.src=g.src,g.style.transition="none",g.style.opacity="0",this._currentBanner=this._currentBanner>=10?1:this._currentBanner+1;const f=this._currentBanner>=10?1:this._currentBanner+1;g.src=`/assets/banners/${f}.png`,e.querySelectorAll("#auth-banner-dots > div").forEach((v,u)=>{v.style.background=this._currentBanner===u+1?"#00C853":"rgba(255,255,255,0.2)"}),g.offsetWidth,g.style.transition="opacity 0.8s ease-in-out"},800))},4e3)),e.querySelector("#phone-input")?.addEventListener("input",h=>{const g=h.target;g.value=g.value.replace(/[^0-9+]/g,""),g.value.indexOf("+")>0&&(g.value=g.value.replace(/\+/g,""))}),e.querySelector("#otp-input")?.addEventListener("input",h=>{const g=h.target,f=e.querySelector("#verify-otp-btn");f&&(g.value.trim().length===6?(f.disabled=!1,f.style.opacity="1",f.style.cursor="pointer"):(f.disabled=!0,f.style.opacity="0.5",f.style.cursor="not-allowed"))});const i=e.querySelector("#send-otp-btn");i&&i.addEventListener("click",async()=>{this._audioManager.playClick();const g=e.querySelector("#phone-input")?.value.trim()||"";if(!g){this._statusMessage=r.currentLocale==="am"?"እባክዎን ትክክለኛ የስልክ ቁጥር ያስገቡ።":r.currentLocale==="om"?"Maaloo lakkoofsa bilbilaa sirrii ta'e galchaa.":"Please enter a valid phone number.",this.render();return}const f=B.normalisePhone(g);this._pendingPhone=f,this._devOtpCode="",this._statusMessage=r.currentLocale==="am"?"የኦቲፒ መልዕክት በመላክ ላይ...":r.currentLocale==="om"?"OTP SMS ergaa jira...":"Sending OTP...",this.render();const x=await this._authManager.signInWithPhone(f);x.success?(this._phoneStep="INPUT_OTP",this._statusMessage="",this._fetchDevOtp(f)):this._statusMessage=x.error||(r.currentLocale==="am"?"ኮድ መላክ አልተቻለም።":r.currentLocale==="om"?"OTP erguun hin danda'amne.":"Failed to send OTP."),this.render()});const a=e.querySelector("#verify-otp-btn");a&&a.addEventListener("click",async()=>{this._audioManager.playClick();const g=e.querySelector("#otp-input")?.value.trim()||"";if(g.length!==6){this._statusMessage=r.currentLocale==="am"?"እባክዎን የ 6-አሃዝ ማረጋገጫ ኮድ ያስገቡ።":r.currentLocale==="om"?"Maaloo koodii mirkaneessaa dijiitii 6 galchaa.":"Please enter a 6-digit verification code.",this.render();return}this._statusMessage=r.currentLocale==="am"?"ኮድ በመፈተሽ ላይ...":r.currentLocale==="om"?"Koodii mirkaneessaa jira...":"Verifying code...",this.render();const f=await this._authManager.verifyOtp(this._pendingPhone,g);f.success?this._onSuccess():(this._statusMessage=f.error||(r.currentLocale==="am"?"የተሳሳተ የማረጋገጫ ኮድ።":r.currentLocale==="om"?"Koodii mirkaneessaa dogoggoraa.":"Invalid verification code."),this.render())});const n=e.querySelector("#change-phone-btn");n&&n.addEventListener("click",()=>{this._audioManager.playClick(),this._phoneStep="INPUT_PHONE",this._statusMessage="",this._devOtpCode="",this.render()});const o=e.querySelector("#auth-settings-btn");o&&o.addEventListener("click",()=>{this._audioManager.playClick(),this._showSettings=!0,this._settingsTab="main",this.render()});const s=e.querySelector(".app-bar-back-btn");s&&s.addEventListener("click",()=>{this._audioManager.playClick(),this._settingsTab!=="main"?(this._settingsTab="main",this.render()):(this._showSettings=!1,this.render())}),e.querySelectorAll(".settings-tile[data-tab]").forEach(h=>{h.addEventListener("click",g=>{this._audioManager.playClick(),this._settingsTab=g.currentTarget.getAttribute("data-tab"),this.render()})}),e.querySelector(".sound-toggle")?.addEventListener("click",()=>{this._audioManager.toggleMute(),this._audioManager.playClick();const h=this._audioManager.isMuted;localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(h));const g=localStorage.getItem("ETHIO_FOOTBALL_SETTINGS_V2");if(g)try{const f=JSON.parse(g);f.soundEffects=!h,localStorage.setItem("ETHIO_FOOTBALL_SETTINGS_V2",JSON.stringify(f))}catch{}this.render()}),e.querySelectorAll(".lang-item").forEach(h=>{h.addEventListener("click",g=>{const f=g.currentTarget.getAttribute("data-lang");r.setLocale(f),this._audioManager.playClick(),this._settingsTab="main",this.render()})}),e.querySelectorAll(".faq-item").forEach(h=>{h.addEventListener("click",g=>{const f=parseInt(g.currentTarget.getAttribute("data-idx")||"-1",10);this._faqExpandedIndex=this._faqExpandedIndex===f?-1:f,this._audioManager.playClick(),this.render()})});const l=e.querySelector("#auth-subscribe-btn"),d=e.querySelector("#btn-register-here"),c=()=>{this._audioManager.playClick(),window.location.href="sms:9401?body=OK"};l&&l.addEventListener("click",c),d&&d.addEventListener("click",c)}async _fetchDevOtp(e){if(m)for(let t=0;t<8;t++){await new Promise(i=>setTimeout(i,800));try{const{data:i}=await m.from("dev_otps").select("code").eq("phone",e).maybeSingle();if(i?.code){this._devOtpCode=String(i.code),this.render();const a=this._uiManager.container.querySelector("#otp-input");a&&(a.value=this._devOtpCode,a.dispatchEvent(new Event("input",{bubbles:!0})));return}}catch{return}}}}class te{static instance;channels=new Map;listeners=new Map;constructor(){}static getInstance(){return te.instance||(te.instance=new te),te.instance}initUserChannels(e){if(!w.isOnline){console.warn("[RealtimeService] Offline mode: Cannot initialize channels.");return}const t=m;if(!t)return;this.cleanup();const i=t.channel(`profile-${e}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"users",filter:`id=eq.${e}`},d=>this.emit("profile_update",d)).subscribe();this.channels.set(`profile-${e}`,i);const a=t.channel(`notifications-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},d=>{const c=d.new;(c.user_id===e||c.user_id===null)&&this.emit("new_notification",d)}).subscribe();this.channels.set(`notifications-${e}`,a);const n=t.channel(`messages-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},d=>{const c=d.new;(c.recipient_id===e||c.channel==="global")&&this.emit("new_message",d)}).subscribe();this.channels.set(`messages-${e}`,n);const o=t.channel(`rewards-${e}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"rewards",filter:`user_id=eq.${e}`},d=>this.emit("new_reward",d)).subscribe();this.channels.set(`rewards-${e}`,o);const s=t.channel(`session-${e}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"game_sessions",filter:`user_id=eq.${e}`},d=>this.emit("session_update",d)).subscribe();this.channels.set(`session-${e}`,s);const l=t.channel("leaderboard").on("postgres_changes",{event:"UPDATE",schema:"public",table:"leaderboard_entries"},d=>this.emit("leaderboard_update",d)).subscribe();this.channels.set("leaderboard",l),console.log(`[RealtimeService] Channels initialized for user ${e}`)}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t)}off(e,t){if(t){const i=this.listeners.get(e);i&&(i.delete(t),i.size===0&&this.listeners.delete(e))}else this.listeners.delete(e)}emit(e,t){const i=this.listeners.get(e);i&&i.forEach(a=>{try{a(t)}catch(n){console.error(`[RealtimeService] Error executing listener for event ${e}:`,n)}})}cleanup(){const e=m;this.channels.forEach(t=>{e&&e.removeChannel(t)}),this.channels.clear(),this.listeners.clear(),console.log("[RealtimeService] Cleaned up all channels and listeners.")}}class lt{_uiManager;_audioManager;_saveManager;_onClose;_activeTab="daily";_previousRank=null;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onClose=a}async render(){const e=this._uiManager.container;e.innerHTML=L.LoadingState(r.currentLocale==="am"?"ደረጃዎችን በማስገባት ላይ...":r.currentLocale==="om"?"Sadarkaa fe'aa jira...":"Loading rankings...");const t=this._saveManager.profile,i=$.getDivision(t.xp);let a=[];this._activeTab==="daily"?a=await D.getInstance().getLeaderboard(void 0,"daily"):a=(await(await pe(async()=>{const{TournamentService:u}=await import("./TournamentService-B856ECCy.js");return{TournamentService:u}},__vite__mapDeps([0,1]))).TournamentService.getInstance().getLeaderboard(this._activeTab)).map(u=>({userId:u.userId,username:u.username,score:u.score,matchesPlayed:u.matchesPlayed}));const n=a.map(x=>{const v=x.username===t.username,y=/^\\+?[0-9]{9,}$/.test((x.username||"").replace(/[^0-9+]/g,""))?this._maskPhone(x.username):x.username||(r.currentLocale==="am"?"ያልታወቀ":r.currentLocale==="om"?"Namummaa Hin Beekamne":"Anonymous"),b=x.score||0,k=x.eloRating||0,A=$.getDivision(b);return{msisdn:y,score:b,eloRating:k,points:b,league:A.name,isMe:v}});n.sort((x,v)=>v.score-x.score);const o=n[0],s=n[1],l=n[2],d=n.slice(3),c=x=>{const v=this._activeTab===x;return`
                flex: 1;
                padding: 10px 4px;
                border-radius: 8px;
                border: 1px solid ${v?"#FFD54F":"rgba(255,255,255,0.1)"};
                background: ${v?"rgba(255,213,79,0.15)":"linear-gradient(135deg, rgba(7, 27, 45, 0.8) 0%, rgba(7, 27, 45, 0.6) 100%)"};
                color: ${v?"#FFD54F":"#94A3B8"};
                font-weight: 800;
                font-size: var(--fds-font-xs);
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `},h=n.findIndex(x=>x.isMe),g=h!==-1?h+1:"--";let f="";if(this._previousRank!==null&&g!=="--"&&this._previousRank!=="--"){const x=this._previousRank-g;x>0?f=`<span class="rank-diff-anim rank-diff-up">▲ +${x} Positions</span>`:x<0&&(f=`<span class="rank-diff-anim rank-diff-down">▼ ${x} Positions</span>`)}this._previousRank=g,e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; padding-bottom: 60px; overflow-y: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- STADIUM LIGHT BEAMS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>

                <!-- TOP BAR -->
                ${_.render(r.currentLocale==="am"?"ደረጃ":r.currentLocale==="om"?"SADARKAA":"RANK","",!1)}

                <div style="max-width: 900px; margin: 0 auto; padding: 16px;">
                    
                    <!-- PERIOD TABS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;" class="fade-in-up">
                        <button class="lb-tab-btn" data-tab="daily" style="${c("daily")}">${r.currentLocale==="am"?"ዕለታዊ":r.currentLocale==="om"?"GUYYAA":"DAILY"}</button>
                        <button class="lb-tab-btn" data-tab="weekly" style="${c("weekly")}">${r.currentLocale==="am"?"ሳምንታዊ":r.currentLocale==="om"?"TORBEE":"WEEKLY"}</button>
                        <button class="lb-tab-btn" data-tab="monthly" style="${c("monthly")}">${r.currentLocale==="am"?"ወርሃዊ":r.currentLocale==="om"?"JI'A":"MONTHLY"}</button>
                    </div>

                    <!-- 1. PODIUM CARDS (TOP 3 CHAMPIONS) -->
                    ${n.length===0?L.EmptyState("🏆",r.currentLocale==="am"?"እስካሁን የተሰለፈ ተጫዋች የለም።":r.currentLocale==="om"?"Hamma ammaatti taphataan sadarkaa qabate hin jiru.":"No players ranked yet."):`
                    <div style="display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 12px; align-items: end; margin-bottom: 24px; text-align: center;" class="fade-in-up">
                        
                        <!-- 2ND PLACE PODIUM (SILVER) -->
                        ${s?`
                        <div class="ethio-profile-card" style="padding: 16px 8px; border-color: #C0C0C0;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥈</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #E2E8F0; text-transform: uppercase;">${r.currentLocale==="am"?"2ኛ":r.currentLocale==="om"?"2FFAA":"2ND"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${s.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-blue-accent); margin-top: 2px;">${s.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${s.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}

                        <!-- 1ST PLACE PODIUM (GOLD CHAMPION) -->
                        ${o?`
                        <div class="ethio-profile-card" style="padding: 20px 8px; border-color: #FFD54F; box-shadow: 0 10px 30px rgba(255, 213, 79, 0.3); transform: translateY(-8px);">
                            <div style="font-size: 36px; margin-bottom: 4px; filter: drop-shadow(0 0 10px rgba(255,213,79,0.6));">🥇</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #FFD54F; text-transform: uppercase; letter-spacing: 1px;">${r.currentLocale==="am"?"ሻምፒዮን":r.currentLocale==="om"?"CHAAMPIYOONA":"CHAMPION"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: white; margin-top: 4px;">${o.msisdn}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: #FFD54F; margin-top: 2px;">${o.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: #FEF08A; margin-top: 2px;">🏆 ${o.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}

                        <!-- 3RD PLACE PODIUM (BRONZE) -->
                        ${l?`
                        <div class="ethio-profile-card" style="padding: 16px 8px; border-color: #CD7F32;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥉</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #FDBA74; text-transform: uppercase;">${r.currentLocale==="am"?"3ኛ":r.currentLocale==="om"?"3FFAA":"3RD"}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${l.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #CD7F32; margin-top: 2px;">${l.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${l.points} XP</div>
                        </div>
                        `:'<div style="visibility: hidden;"></div>'}
                    </div>
                    `}

                    <!-- 2. CURRENT USER STATS BANNER -->
                    <div class="ethio-profile-card fade-in-up" style="padding: 14px 16px; border-color: #00C853; box-shadow: 0 0 20px rgba(0, 200, 83, 0.15); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">⚽</span>
                            <div>
                                <div style="font-size: var(--fds-font-xs); color: #00C853; font-weight: 800; text-transform: uppercase;">${r.currentLocale==="am"?"የእርስዎ የደረጃ ቦታ":r.currentLocale==="om"?"SADARKAA KEE":"YOUR RANK POSITION"}</div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    ${g==="--"?`
                                        <div style="font-size: var(--fds-font-xs); color: rgba(255,255,255,0.7); font-weight: 500; margin-top: 2px;">
                                            Play matches to earn points and secure your rank.
                                        </div>
                                    `:`
                                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: white;">
                                            ${r.currentLocale==="am"?`#${g} በ ${i.name} ሊግ`:r.currentLocale==="om"?`#${g} Liigii ${i.name} Keessatti`:`#${g} In ${i.name} League`}
                                        </div>
                                    `}
                                    ${f}
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: #FFD54F;">${t.xp||0} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-muted);">${t.totalMatches||0} Matches</div>
                        </div>
                    </div>

                    <!-- 3. REMAINING RANKINGS LIST (4TH+) -->
                    <div style="display: flex; flex-direction: column; gap: 8px;" class="fade-in-up">
                        ${d.map((x,v)=>{const u=v+4,y=x.isMe;return`
                                <div class="ethio-profile-card interactive" style="
                                    display: flex; 
                                    justify-content: space-between; 
                                    align-items: center; 
                                    padding: 12px 16px; 
                                    border-color: ${y?"#00C853":"rgba(255,255,255,0.08)"}; 
                                ">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-dim); min-width: 24px;">#${u}</span>
                                        <div>
                                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${y?"#00C853":"white"};">
                                                ${x.msisdn} ${y?`<span style="background: #00C853; color: white; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; margin-left: 6px;">${r.currentLocale==="am"?"እርስዎ":r.currentLocale==="om"?"ATI":"YOU"}</span>`:""}
                                            </div>
                                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">${r.currentLocale==="am"?`${x.league} ሊግ`:r.currentLocale==="om"?`Liigii ${x.league}`:`${x.league} League`}</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: #FFD54F;">${x.score} PTS</div>
                                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">${x.points} XP</div>
                                    </div>
                                </div>
                            `}).join("")}
                    </div>
                </div>
            </div>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;_.bind(e,()=>{this._audioManager.playClick(),this._onClose()}),e.querySelectorAll(".lb-tab-btn").forEach(i=>{i.addEventListener("click",a=>{this._audioManager.playClick();const n=a.currentTarget.getAttribute("data-tab");this._activeTab=n,this.render()})});const t=e.querySelector(".stadium-container");t&&oe.attach(t,async()=>{this._audioManager.playClick(),await this.render()})}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")&&(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class q{static instance;listeners=[];unreadCount=0;constructor(){this._initRealtime(),this._fetchUnreadCount()}static getInstance(){return q.instance||(q.instance=new q),q.instance}subscribeToBadgeUpdates(e){return this.listeners.push(e),e(this.unreadCount),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}_notifyListeners(){this.listeners.forEach(e=>e(this.unreadCount))}async _fetchUnreadCount(){if(!m)return;const{data:{user:e}}=await m.auth.getUser();if(!e)return;const{count:t,error:i}=await m.from("messages").select("*",{count:"exact",head:!0}).eq("read",!1).or(`recipient_id.eq.${e.id},channel.eq.global`);!i&&t!==null&&(this.unreadCount=t,this._notifyListeners())}_initRealtime(){m&&m.channel("public:messages").on("postgres_changes",{event:"*",schema:"public",table:"messages"},()=>{this._fetchUnreadCount()}).subscribe()}getTotalUnreadCount(){return this.unreadCount}_mapRow(e){const t=r.currentLocale;let i=e.body_en;t==="am"&&e.body_am&&(i=e.body_am),t==="om"&&e.body_om&&(i=e.body_om);let a="Message";return e.channel==="global"?a="Announcement":e.channel==="system"?a="System Update":e.channel==="direct"&&(a="Direct Message"),{id:e.id,title:a,content:i,category:e.channel,priority:e.channel==="global"?"High":"Normal",createdAt:e.created_at,read:e.read}}async _fetchByChannel(e){if(!m)return[];const{data:{user:t}}=await m.auth.getUser();let i=m.from("messages").select("*").eq("channel",e).order("created_at",{ascending:!1}).limit(50);if(e==="direct"||e==="system"){if(!t)return[];i=i.eq("recipient_id",t.id)}const{data:a,error:n}=await i;return n||!a?[]:a.map(o=>this._mapRow(o))}async getAllMessages(){if(!m)return[];const{data:{user:e}}=await m.auth.getUser();let t=m.from("messages").select("*").order("created_at",{ascending:!1}).limit(100);e?t=t.or(`recipient_id.eq.${e.id},channel.eq.global`):t=t.eq("channel","global");const{data:i,error:a}=await t;return a||!i?[]:i.map(n=>this._mapRow(n))}async getAnnouncements(){return this._fetchByChannel("global")}async getPersonalMessages(){return this._fetchByChannel("direct")}async getSupportTickets(){return this._fetchByChannel("system")}async markAsRead(e){if(!m)return;const{error:t}=await m.from("messages").update({read:!0}).eq("id",e);t||this._fetchUnreadCount()}}class C{static renderCard(e,t){return`
            <div class="ethio-profile-group">
                ${t?`<div class="ethio-profile-group-title">${t}</div>`:""}
                <div class="ethio-profile-card">
                    ${e}
                </div>
            </div>
        `}static renderNavRow(e,t,i,a,n=!0,o,s=!1){return`
            <div class="ethio-nav-row profile-menu-tile" data-action="${i}" style="${s?"border-bottom: none;":""}">
                <div class="ethio-nav-icon">
                    ${e}
                </div>
                <div class="ethio-nav-content">
                    <div class="ethio-nav-title">${t}</div>
                    ${a?`<div class="ethio-nav-desc">${a}</div>`:""}
                </div>
                ${o?`<div id="${o}" class="ethio-nav-badge" style="display: none;"></div>`:""}
                ${n?'<div class="ethio-nav-chevron">❯</div>':""}
            </div>
        `}static renderButton(e,t,i="primary",a){return`
            <button id="${e}" class="ethio-profile-btn ethio-profile-btn-${i}">
                ${a?`<span style="margin-right: 8px;">${a}</span>`:""}
                ${t}
            </button>
        `}}const T={statistics:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',achievements:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fds-gold-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',awards:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fds-gold-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',leaderboard:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fds-ethio-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="8" width="6" height="12"></rect><rect x="6" y="14" width="6" height="6"></rect><path d="M18 20V4"></path></svg>',identity:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',invite:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fds-ethio-green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>',messages:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',subscription:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fds-gold-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',settings:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',help:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',about:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',faq:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 13a2 2 0 0 0 4 0c0-1.5-2-2.5-2-2.5"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',terms:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',logout:'<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--fds-red-live)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>'};class dt{_uiManager;_saveManager;_audioManager;_callbacks;_unsubscribeBadge=null;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._callbacks=a,this._unsubscribeBadge=q.getInstance().subscribeToBadgeUpdates(()=>{const n=document.getElementById("profile-msg-badge");if(n){const o=q.getInstance().getTotalUnreadCount();o>0?(n.innerText=o>99?"99+":o.toString(),n.style.display="inline-block"):n.style.display="none"}})}destroy(){this._unsubscribeBadge&&this._unsubscribeBadge()}render(){const e=this._uiManager.container;e.innerHTML=L.SkeletonProfile(),setTimeout(()=>{this._renderActual()},300)}_renderActual(){const e=this._uiManager.container,t=this._saveManager.profile,i=$.getDivision(t.xp);e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding-bottom: 120px;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- TOP HEADER -->
                <div style="
                    background: linear-gradient(180deg, rgba(0,200,83,0.2) 0%, rgba(7,27,45,0) 100%);
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
                <div class="ethio-profile-card" style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    padding: 16px 0;
                    margin: 0 16px 24px 16px;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${r.currentLocale==="am"?"ሊግ":r.currentLocale==="om"?"LIIGII":"LEAGUE"}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${i.color};">${i.name}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${r.currentLocale==="am"?"ደረጃ":r.currentLocale==="om"?"SADARKAA":"RANK"}</div>
                        <div id="profile-daily-rank" style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">--</div>
                    </div>
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${r.currentLocale==="am"?"ነጥቦች":r.currentLocale==="om"?"QABXII":"POINTS"}</div>
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: #FFD54F; text-shadow: 0 0 12px rgba(255, 213, 79, 0.4);">${t.xp} XP</div>
                    </div>
                </div>

                <!-- PROFILE ACTIONS -->
                <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    ${C.renderCard(`
                        ${C.renderNavRow(T.statistics,r.currentLocale==="am"?"ስታቲስቲክስ":"Statistics","stats")}
                        ${C.renderNavRow(T.achievements,r.currentLocale==="am"?"ስኬቶች":"Achievements","achievements")}
                        ${C.renderNavRow(T.awards,r.currentLocale==="am"?"የእኔ ሽልማቶች":"My Awards","awards")}
                        ${C.renderNavRow(T.leaderboard,r.currentLocale==="am"?"የመሪዎች ሰሌዳ":"Leaderboard","leaderboard","",!0,"",!0)}
                    `,"PERFORMANCE")}

                    ${C.renderCard(`
                        ${C.renderNavRow(T.identity,r.currentLocale==="am"?"ማንነት":"Identity","identity")}
                        ${C.renderNavRow(T.invite,r.currentLocale==="am"?"ጓደኞችን ይጋብዙ":"Invite Friends","invite")}
                        ${C.renderNavRow(T.messages,r.currentLocale==="am"?"መልዕክቶች":"Messages","messages","",!0,"profile-msg-badge",!0)}
                    `,"ACCOUNT")}

                    ${C.renderCard(`
                        ${C.renderNavRow(T.subscription,r.currentLocale==="am"?"ምዝገባ":"Subscription","subscription")}
                        ${C.renderNavRow(T.settings,r.currentLocale==="am"?"ቅንብሮች":"Settings","settings")}
                        ${C.renderNavRow(T.help,r.currentLocale==="am"?"እገዛ እና ድጋፍ":"Help & Support","help","",!0,"",!0)}
                    `,"SERVICE")}

                    ${C.renderCard(`
                        ${C.renderNavRow(T.about,r.currentLocale==="am"?"ስለ እኛ":"About","about")}
                        ${C.renderNavRow(T.faq,r.currentLocale==="am"?"አዘውትረው የሚጠየቁ ጥያቄዎች":"FAQ","faq")}
                        ${C.renderNavRow(T.terms,r.currentLocale==="am"?"ደንቦች እና ሁኔታዎች":"Terms & Conditions","terms","",!0,"",!0)}
                    `,"INFORMATION")}
                    
                    ${C.renderCard(`
                        ${C.renderNavRow(T.logout,r.currentLocale==="am"?"ውጣ":"Log Out","logout","",!1,"",!0)}
                    `,"SESSION")}

                </div>
            </div>

            <!-- Profile Interactive Modals Container -->
            <div id="profile-action-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; pointer-events: auto;">
                <div class="glass-card" style="width: 100%; max-width: 400px; padding: 24px; border-color: var(--tv-gold-primary); text-align: center; background: var(--ethio-deep-navy); position: relative;">
                    <button id="btn-close-prof-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-md); cursor: pointer;">✖</button>
                    <div id="prof-modal-content" style="max-height: 70vh; overflow-y: auto;" class="hide-scrollbar"></div>
                </div>
            </div>

            <style>
                .list-tile:active { background: rgba(255,255,255,0.08); }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            </style>
        `,this._bindEvents();const a=q.getInstance().getTotalUnreadCount(),n=document.getElementById("profile-msg-badge");n&&(a>0?(n.innerText=a>99?"99+":a.toString(),n.style.display="inline-block"):n.style.display="none"),D.getInstance().getMyDailyStats().then(o=>{const s=document.getElementById("profile-daily-rank");s&&(s.textContent=o?`#${o.rank}`:"Unranked")}).catch(()=>{const o=document.getElementById("profile-daily-rank");o&&(o.textContent="Unranked")})}_bindEvents(){const e=this._uiManager.container,t=document.getElementById("profile-action-modal"),i=document.getElementById("prof-modal-content"),a=document.getElementById("btn-close-prof-modal"),n=l=>{t&&i&&(i.innerHTML=l,t.style.display="flex")};a?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")}),e.querySelectorAll(".profile-menu-tile").forEach(l=>{l.addEventListener("click",d=>{const h=d.currentTarget.getAttribute("data-action");if(h)switch(this._audioManager.playClick(),h){case"stats":this._callbacks.onStatistics();break;case"leaderboard":this._callbacks.onLeaderboard();break;case"subscription":this._callbacks.onSubscription();break;case"messages":this._callbacks.onMessages();break;case"settings":this._callbacks.onSettings();break;case"help":this._callbacks.onHelp();break;case"about":this._callbacks.onAbout();break;case"privacy":this._callbacks.onPrivacy();break;case"terms":this._callbacks.onTerms();break;case"invite":this._callbacks.onInvite();break;case"achievements":this._callbacks.onAchievements();break;case"awards":this._callbacks.onAwards();break;case"identity":this._callbacks.onIdentity();break;case"faq":this._callbacks.onFaq();break;case"logout":n(`
                            <div style="font-size: 40px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🚪</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-red-live); margin-bottom: 8px;">Log Out?</div>
                            <div style="font-size: 15px; color: var(--fds-text-muted); margin-bottom: 24px; line-height: 1.5;">Are you sure you want to log out of EthioFantasy?</div>
                            <div style="display: flex; gap: 12px; margin-top: 16px;">
                                <div id="btn-cancel-logout" style="flex: 1; padding: 14px; text-align: center; background: rgba(255,255,255,0.1); border-radius: 12px; font-weight: 800; cursor: pointer;">Cancel</div>
                                <div id="btn-confirm-logout" style="flex: 1; padding: 14px; text-align: center; background: var(--fds-red-live); border-radius: 12px; font-weight: 800; cursor: pointer; color: white;">Log Out</div>
                            </div>
                        `),document.getElementById("btn-cancel-logout")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")}),document.getElementById("btn-confirm-logout")?.addEventListener("click",async g=>{const f=g.currentTarget;if(f.style.opacity!=="0.5"){this._audioManager.playClick(),f.style.opacity="0.5",f.style.pointerEvents="none",f.innerHTML="Logging out...";try{await B.getInstance().signOut(),localStorage.removeItem("ETHIO_FOOTBALL_AUTH_V2"),localStorage.removeItem("ETHIO_FOOTBALL_SAVE_V1"),window.location.replace(window.location.origin+window.location.pathname)}catch(x){console.error("Logout error:",x),n(`
                                    <div style="font-size: 40px; margin-bottom: 12px;">⚠️</div>
                                    <div style="font-size: 18px; font-weight: 900; color: var(--fds-red-live); margin-bottom: 8px;">Error</div>
                                    <div style="font-size: 15px; color: var(--fds-text-muted); margin-bottom: 24px;">Unable to log out. Please try again.</div>
                                    <div style="display: flex; gap: 12px;">
                                        <div id="btn-cancel-error" style="flex: 1; padding: 14px; text-align: center; background: rgba(255,255,255,0.1); border-radius: 12px; font-weight: 800; cursor: pointer;">Cancel</div>
                                        <div id="btn-retry-logout" style="flex: 1; padding: 14px; text-align: center; background: var(--tv-gold-primary); border-radius: 12px; font-weight: 800; cursor: pointer; color: white;">Retry</div>
                                    </div>
                                `),document.getElementById("btn-cancel-error")?.addEventListener("click",()=>{this._audioManager.playClick(),t&&(t.style.display="none")}),document.getElementById("btn-retry-logout")?.addEventListener("click",()=>{this._audioManager.playClick();const v=e.querySelector('[data-action="logout"]');v&&v.click()})}}});break}})});const s=e.querySelector(".stadium-container");s&&oe.attach(s,async()=>{this._audioManager.playClick(),await this.render()})}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")||(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class ie{static _instance=null;_inQueue=!1;_listeners=new Set;_cdcChannel=null;static getInstance(){return ie._instance||(ie._instance=new ie),ie._instance}async joinQueue(e,t){if(this._inQueue)return{success:!0};if(this._inQueue=!0,w.isOnline&&m){const{data:i,error:a}=await ue.invoke("matchmaking",{userId:e.id,eloRating:e.elo_rating||1200,competitionId:t});return!a&&i&&i.matched&&i.liveMatch?(console.log("[MatchmakingService] Matched instantly via Edge Function."),await this._handleMatchFound(i.liveMatch,e.id),{success:!0}):(this._subscribeToCdc(e.id),{success:!0})}return console.warn("[MatchmakingService] Offline or unavailable. Queueing locally."),{success:!1,error:"Matchmaking is currently unavailable."}}_subscribeToCdc(e){m&&(this._cdcChannel=m.channel("public:live_matches").on("postgres_changes",{event:"INSERT",schema:"public",table:"live_matches"},async t=>{const i=t.new;(i.player_a_id===e||i.player_b_id===e)&&(console.log("[MatchmakingService] Postgres CDC detected live match creation!"),await this._handleMatchFound(i,e))}).subscribe())}async _handleMatchFound(e,t){const i=e.player_a_id===t?e.player_b_id:e.player_a_id;let a={id:i,role:"player",username:"Ethiopian_Rival",phone:null,avatar_url:null,locale:"en",elo_rating:1200,coins:100,xp:50,total_matches:5,total_wins:3,subscription_tier:"free",streak_count:1,streak_last_date:null,created_at:new Date().toISOString(),last_active:new Date().toISOString(),referral_code:null,referred_by:null};if(m){const{data:n}=await m.from("users").select("*").eq("id",i).single();n&&(a=n)}this.leaveQueue(t),this._notifyMatchFound({liveMatchId:e.id,opponent:a,questionIds:e.question_ids||[]})}async leaveQueue(e){if(this._inQueue=!1,this._cdcChannel&&m&&(m.removeChannel(this._cdcChannel),this._cdcChannel=null),w.isOnline&&m)try{await m.from("matchmaking_queue").delete().eq("user_id",e)}catch(t){console.warn("[MatchmakingService] Error leaving queue:",t)}}onMatchFound(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notifyMatchFound(e){this._listeners.forEach(t=>t(e))}get isSearching(){return this._inQueue}}class ct{_uiManager;_audioManager;_saveManager;_onMatchFound;_onCancel;constructor(e,t,i,a,n){this._uiManager=e,this._audioManager=t,this._saveManager=i,this._onMatchFound=a,this._onCancel=n}async render(){const e=this._uiManager.container,t=this._saveManager.profile,i={id:"local-user",role:"player",username:t.username,phone:null,avatar_url:null,locale:"en",elo_rating:t.eloRating||0,coins:t.coins,xp:t.xp,total_matches:10,total_wins:6,subscription_tier:"free",streak_count:t.streakCount||0,streak_last_date:null,created_at:new Date().toISOString(),last_active:new Date().toISOString(),referral_code:null,referred_by:null};e.innerHTML=`
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
                        <div style="margin-bottom: 24px; font-size: var(--fds-font-sm); font-weight: 700; color: #4ADE80; background: rgba(0, 200, 83, 0.1); padding: 8px 16px; border-radius: 20px; display: inline-block;">
                            <span style="display: inline-block; width: 8px; height: 8px; background: #4ADE80; border-radius: 50%; margin-right: 8px; animation: pulse 1.5s infinite;"></span>
                            <span id="live-players-count">142 Players in Queue</span>
                        </div>

                        <!-- Player Info Card -->
                        <div style="
                            background: rgba(7, 27, 45, 0.6);
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

                        ${L.Button({id:"cancel-mm-btn",text:"CANCEL MATCHMAKING",icon:"✖",variant:"secondary",fullWidth:!0,className:"cancel-btn-custom"})}
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
        `;const a=ie.getInstance(),n=a.onMatchFound(o=>{this._audioManager.playQuizCorrectAnswer(),this._onMatchFound(o)});setInterval(()=>{const o=document.getElementById("live-players-count");if(o&&document.body.contains(o)){const l=parseInt(o.innerText.split(" ")[0])+Math.floor(Math.random()*5)-2,d=Math.max(120,Math.min(180,l));o.innerText=`${d} Players in Queue`}},3e3),e.querySelector("#cancel-mm-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),n(),a.leaveQueue(i.id),this._onCancel()}),await a.joinQueue(i)}}class pt{constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i}_currentTab="all";_messages=[];_isOpeningMessage=!1;_isLayoutRendered=!1;_currentRequestId=0;async render(){this._isLayoutRendered?this._updateTabUI():(this._renderLayout(),this._bindEvents(),this._isLayoutRendered=!0),await this._updateContent()}_renderLayout(){const e=this._uiManager.container,t=r.currentLocale;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative;">
                
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- App Bar -->
                ${_.render(t==="am"?"መልዕክቶች":t==="om"?"ERGAWWAAN":"Messages")}

                <!-- Main Content Wrapper -->
                <div style="flex: 1; display: flex; flex-direction: column; max-width: 600px; margin: 0 auto; width: 100%; position: relative; z-index: 10; padding-top: 16px;">
                    
                    <!-- Search Input -->
                    <div style="padding: 0 16px; margin-bottom: 12px;">
                        <input type="text" id="mc-search-input" placeholder="🔍 Search messages..." style="
                            width: 100%; 
                            padding: 12px 16px; 
                            border-radius: 12px; 
                            border: 1px solid rgba(255,255,255,0.1); 
                            background: rgba(7, 27, 45, 0.7); 
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
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),this._updateTabUI()}_updateTabUI(){const e=r.currentLocale,t=[{id:"all",label:{en:"All",am:"ሁሉም",om:"Hunda"}},{id:"unread",label:{en:"Unread",am:"ያልተነበቡ",om:"Kan Hin Dubbifamne"}},{id:"global",label:{en:"Announcements",am:"ማስታወቂያዎች",om:"Beeksisa"}},{id:"direct",label:{en:"Inbox",am:"የገቢ መልዕክቶች",om:"Ergaa"}},{id:"system",label:{en:"Support",am:"ድጋፍ",om:"Gargaarsa"}}],i=document.getElementById("mc-tab-bar");if(!i)return;i.innerHTML=t.map(n=>{const o=n.id===this._currentTab,s=n.id==="unread"||n.id==="direct"||n.id==="global"||n.id==="all"?q.getInstance().getTotalUnreadCount():0,l=(n.id==="unread"||n.id==="direct")&&s>0;return o?`
                    <button class="mc-pill-tab ${o?"active-mc-tab":""}" data-tab-id="${n.id}" style="
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
                        box-shadow: 0 4px 12px rgba(0, 200, 83, 0.4);
                    ">
                        ${n.label[e]||n.label.en}
                        ${l?`<span style="background: white; color: var(--fds-green-dark); font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 10px;">${s>99?"99+":s}</span>`:""}
                    </button>
                `:`
                    <button class="mc-pill-tab" data-tab-id="${n.id}" style="
                        flex: 0 0 auto;
                        padding: 8px 16px;
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.08);
                        background: rgba(7, 27, 45, 0.7);
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
                        ${n.label[e]||n.label.en}
                        ${l?`<span style="background: rgba(255,255,255,0.1); color: white; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 10px;">${s>99?"99+":s}</span>`:""}
                    </button>
                `}).join(""),i.querySelectorAll(".mc-pill-tab").forEach(n=>{n.addEventListener("click",o=>{this._audioManager.playClick();const s=o.currentTarget.getAttribute("data-tab-id");s&&s!==this._currentTab&&(this._currentTab=s,this._updateTabUI(),this._renderMessages())})})}_bindEvents(){const e=document.getElementById("mc-search-input");e&&e.addEventListener("input",()=>{this._renderMessages()})}async _updateContent(){const e=++this._currentRequestId,t=document.getElementById("mc-list-container");t&&(t.innerHTML=`
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.05); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                </div>
            `);try{const i=q.getInstance();this._messages=await i.getAllMessages()}catch(i){console.error("Failed to fetch messages",i),this._currentRequestId===e&&t&&(t.innerHTML=`
                    <div style="text-align: center; padding: 40px 16px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                        <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 8px;">Unable to load messages.</div>
                        <button id="mc-btn-retry" class="ethio-profile-btn ethio-profile-btn-primary" style="max-width: 160px;">Retry</button>
                    </div>
                `,document.getElementById("mc-btn-retry")?.addEventListener("click",()=>{this._audioManager.playClick(),this._updateContent()}));return}this._currentRequestId===e&&(this._updateTabUI(),this._renderMessages())}_renderMessages(){const e=document.getElementById("mc-list-container");if(!e)return;const t=document.getElementById("mc-search-input"),i=t?t.value.toLowerCase():"";let a=this._messages.filter(o=>this._currentTab==="all"?!0:this._currentTab==="unread"?!o.read:o.category===this._currentTab);if(i&&(a=a.filter(o=>o.title.toLowerCase().includes(i)||o.content.toLowerCase().includes(i))),a.length===0){i?e.innerHTML=`
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
                `;return}e.innerHTML=a.map(o=>{const s=new Date(o.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),d={global:"📢",direct:"📩",system:"⚙️"}[o.category]||"✉️";return`
                <div class="glass-card mc-item" data-id="${o.id}" style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 16px;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s, background-color 0.2s;
                    border: 1px solid ${o.read?"rgba(255,255,255,0.08)":"rgba(0, 200, 83, 0.4)"};
                    background: rgba(7, 27, 45, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow: ${o.read?"none":"0 4px 16px rgba(0, 200, 83, 0.1)"};
                    align-items: center;
                ">
                    <!-- Category Icon -->
                    <div style="
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                        background: ${o.read?"rgba(255,255,255,0.05)":"rgba(0, 200, 83, 0.1)"};
                        border: 1px solid ${o.read?"rgba(255,255,255,0.1)":"rgba(0, 200, 83, 0.3)"};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        flex-shrink: 0;
                        position: relative;
                    ">
                        ${d}
                        ${o.read?"":`
                            <div style="
                                position: absolute;
                                top: -4px;
                                right: -4px;
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                background-color: var(--tv-pitch-green);
                                border: 2px solid rgba(7, 27, 45, 1);
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
                        ">${o.title}</div>
                        <div style="
                            font-size: 13px; 
                            color: var(--fds-text-dim); 
                            line-height: 1.4;
                            margin-bottom: 6px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${o.content}</div>
                        <div style="
                            font-size: 11px; 
                            color: var(--fds-text-muted); 
                            font-weight: 700;
                            text-transform: uppercase;
                        ">${s}</div>
                    </div>

                    <!-- Chevron -->
                    <div style="color: rgba(255,255,255,0.2); flex-shrink: 0;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </div>
                </div>
            `}).join(""),e.querySelectorAll(".mc-item").forEach(o=>{o.addEventListener("click",async s=>{if(this._isOpeningMessage)return;const l=s.currentTarget.getAttribute("data-id");if(l){this._isOpeningMessage=!0,this._audioManager.playClick();try{const d=this._messages.find(c=>c.id===l);d&&!d.read&&(await q.getInstance().markAsRead(l),d.read=!0),this._showFullMessage(l)}finally{this._isOpeningMessage=!1}}})})}_showFullMessage(e){const t=this._messages.find(o=>o.id===e);if(!t)return;const i=new Date(t.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),a=new Date(t.createdAt).toLocaleDateString(),n=document.createElement("div");n.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
            z-index: 10000; display: flex; align-items: flex-end; justify-content: center;
            animation: fade-in 0.2s ease-out;
        `,n.innerHTML=`
            <div style="
                width: 100%; max-width: 600px; 
                background: rgba(7,27,45,0.95);
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
        `,document.body.appendChild(n),n.querySelector("#btn-close-msg")?.addEventListener("click",()=>{this._audioManager.playClick(),n.remove(),this._renderMessages()})}}class ut{_channel=null;_cdcChannel=null;_matchId;_listeners=new Set;constructor(e){this._matchId=e}get matchId(){return this._matchId}connect(){if(!w.isOnline||!m){console.log(`[LiveMatchClient] Offline mode — simulated channel for ${this._matchId}`);return}this._channel=m.channel(`live_match:${this._matchId}`,{config:{broadcast:{self:!0}}}),this._channel.on("broadcast",{event:"match_event"},e=>{const t=e.payload;this._notify(t)}).subscribe(),this._cdcChannel=m.channel(`public:live_match_answers:${this._matchId}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"live_match_answers",filter:`live_match_id=eq.${this._matchId}`},e=>{const t=e.new;console.log("[LiveMatchClient] Postgres CDC answer insert detected:",t),this._notify({event:"ANSWER_SUBMITTED",userId:t.user_id,questionIndex:t.question_index,isCorrect:t.is_correct})}).subscribe()}async sendAnswer(e,t,i,a){const n={event:"ANSWER_SUBMITTED",userId:e,questionIndex:t,score:a,isCorrect:i};this._channel&&this._channel.send({type:"broadcast",event:"match_event",payload:n}),this._notify(n),w.isOnline&&await ue.invoke("live-match",{liveMatchId:this._matchId,userId:e,questionIndex:t,selectedIndex:i?0:1,responseTimeMs:1500})}sendFinishMatch(e,t){const i={event:"MATCH_FINISH",userId:e,score:t};this._channel&&this._channel.send({type:"broadcast",event:"match_event",payload:i}),this._notify(i)}onEvent(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(e){this._listeners.forEach(t=>t(e))}disconnect(){this._channel&&m&&(m.removeChannel(this._channel),this._channel=null),this._cdcChannel&&m&&(m.removeChannel(this._cdcChannel),this._cdcChannel=null),this._listeners.clear()}}class ce{static DEFAULT_K_FACTOR=32;static calculateExpectedScore(e,t){return 1/(1+Math.pow(10,(t-e)/400))}static calculateNewRatings(e,t,i,a=ce.DEFAULT_K_FACTOR){const n=ce.calculateExpectedScore(e,t),o=1-n,s=1-i,l=Math.round(a*(i-n)),d=Math.round(a*(s-o)),c=Math.max(100,e+l),h=Math.max(100,t+d);return{winnerNewElo:c,loserNewElo:h,winnerEloChange:l,loserEloChange:d}}}class gt{_uiManager;_audioManager;_saveManager;_opponent;_questions;_onComplete;_client;_currentIndex=0;_myScore=0;_opponentScore=0;_timerInterval=null;_timeLeftSec=10;_hasPlayedFullTimeWhistle=!1;_answers=[];_isDestroyed=!1;constructor(e,t,i,a,n,o,s){this._uiManager=e,this._audioManager=t,this._saveManager=i,this._opponent=n,this._questions=o,this._onComplete=s,this._client=new ut(a)}startMatch(){this._client.connect(),this._client.onEvent(e=>{if(e.userId===this._opponent.id&&e.event==="ANSWER_SUBMITTED"&&e.score!==void 0){this._opponentScore=e.score;const t=document.getElementById("opponent-score");t&&(t.innerText=`${this._opponentScore}`)}}),this.render()}render(){const e=this._uiManager.container,t=this._saveManager.profile,i=this._questions[this._currentIndex];if(!i){this._showFinalResults();return}const a=r.currentLocale==="am"?i.promptAm||i.promptEn||i.prompt:r.currentLocale==="om"?i.promptOm||i.promptEn||i.prompt:i.promptEn||i.prompt,n=r.currentLocale==="am"?i.optionsAm&&i.optionsAm.length===i.options.length?i.optionsAm:i.options:r.currentLocale==="om"?i.optionsOm&&i.optionsOm.length===i.options.length?i.optionsOm:i.options:i.optionsEn&&i.optionsEn.length===i.options.length?i.optionsEn:i.options;e.innerHTML=`
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
                    background: rgba(7,27,45,0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                ">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="background: #EF4444; color: var(--fds-text-main); font-size: var(--fds-font-xs); font-weight: 900; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">${r.currentLocale==="am"?"ቀጥታ 1v1":r.currentLocale==="om"?"KALLATTII 1v1":"LIVE 1v1"}</span>
                        <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${r.currentLocale==="am"?`ዙር ${this._currentIndex+1} ከ ${this._questions.length}`:r.currentLocale==="om"?`MARSAA ${this._currentIndex+1} / ${this._questions.length}`:`ROUND ${this._currentIndex+1} OF ${this._questions.length}`}</div>
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
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${r.currentLocale==="am"?"እርስዎ":r.currentLocale==="om"?"ISIN":"YOU"}</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">${t.username}</div>
                        <div id="my-score" style="font-size: 24px; font-weight: 900; color: var(--tv-pitch-green);">${this._myScore}</div>
                    </div>
                    <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-red-live); background: rgba(239,68,68,0.15); padding: 8px 16px; border-radius: 20px;">VS</div>
                    <div style="text-align: right;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${r.currentLocale==="am"?"ተፎካካሪ":r.currentLocale==="om"?"DORMAA":"OPPONENT"}</div>
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
                        ${n.map((o,s)=>`
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
                                <span style="flex: 1;">${o}</span>
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
                    background: rgba(7,27,45,0.95);
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
                .live-option-btn.correct { background: rgba(0,200,83,0.15) !important; border-color: var(--fds-green-pitch) !important; }
                .live-option-btn.wrong { background: rgba(239,68,68,0.15) !important; border-color: var(--fds-red-live) !important; }
                .live-option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: var(--fds-green-pitch); }
                .live-option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: var(--fds-red-live); }
                .live-option-btn.correct .feedback-icon::after { content: '✓'; }
                .live-option-btn.wrong .feedback-icon::after { content: '✕'; }
            </style>
        `,setTimeout(()=>{},80),this._startTimer(),this._bindEvents(i),setTimeout(()=>{const o=document.getElementById("live-answers-grid");o&&(o.style.pointerEvents="auto")},420)}destroy(){this._isDestroyed=!0,this._stopTimer(),this._client.disconnect()}_startTimer(){this._stopTimer(),this._timeLeftSec=10;const e=document.getElementById("live-timer-bar");this._timerInterval=setInterval(()=>{if(this._timeLeftSec--,e){const t=this._timeLeftSec/10*100;e.style.width=t+"%",this._timeLeftSec<=5&&(e.style.backgroundColor="#EF4444")}this._timeLeftSec<=0&&(this._stopTimer(),this._handleTimeOut())},1e3)}_stopTimer(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)}_bindEvents(e){document.querySelectorAll(".live-option-btn").forEach(a=>{a.addEventListener("click",async n=>{const o=n.currentTarget;if(this._stopTimer(),document.querySelectorAll(".live-option-btn").forEach(d=>d.disabled=!0),await this._audioManager.playQuizAnswerSelected(),this._isDestroyed)return;const l=parseInt(o.getAttribute("data-index")||"0");this._onOptionSelected(l,o,e)})});const i=document.getElementById("live-exit-btn");i&&i.addEventListener("click",()=>{this._audioManager.playClick(),this._client.disconnect(),this._stopTimer(),this._onComplete()})}async _onOptionSelected(e,t,i){const a=e===i.correctIndex,n=document.querySelectorAll(".live-option-btn"),o=(10-this._timeLeftSec)*1e3;this._answers.push({questionId:i.id,selectedIndex:e,responseTimeMs:o});const s=this._currentIndex===this._questions.length-1;let l=Promise.resolve();if(a){t.classList.add("correct"),l=this._audioManager.playQuizCorrectAnswer();const h=100+Math.floor(this._timeLeftSec/10*50);this._myScore+=h;const g=document.getElementById("my-score");g&&(g.innerText=String(this._myScore)),this._showFeedbackOverlay(!0)}else{if(t.classList.add("wrong"),i.correctIndex!==void 0){const c=n[i.correctIndex];c&&c.classList.add("correct")}l=this._audioManager.playQuizWrongAnswer(),this._showFeedbackOverlay(!1)}const d=this._saveManager.cloudUserId||"local-user";this._client.sendAnswer(d,this._currentIndex,a,this._myScore),await l,!this._isDestroyed&&(s&&(await this._audioManager.playQuizWhistle(),this._isDestroyed)||(this._hideFeedbackOverlay(),this._currentIndex++,this.render()))}_showFeedbackOverlay(e){const t=document.getElementById("live-feedback-overlay"),i=document.getElementById("live-feedback-icon"),a=document.getElementById("live-feedback-text");t&&i&&a&&(t.style.borderColor=e?"var(--tv-pitch-green)":"#EF4444",t.style.boxShadow=e?"0 10px 40px rgba(0,200,83,0.3)":"0 10px 40px rgba(239,68,68,0.3)",t.style.color=e?"var(--tv-pitch-green)":"#EF4444",i.innerText=e?"⚽":"🧤",a.innerText=e?r.currentLocale==="am"?"ግብ!!!!!":r.currentLocale==="om"?"GALCHII!!!!!":"GOAL!!!!!":r.currentLocale==="am"?"ግብ ተከለከለ!":r.currentLocale==="om"?"GALCHII QABAME!":"GOAL SAVED!",t.style.opacity="1",t.style.transform="translateX(-50%) scale(1)")}_hideFeedbackOverlay(){const e=document.getElementById("live-feedback-overlay");e&&(e.style.pointerEvents="none",e.style.opacity="0",e.style.transform="translateX(-50%) scale(0.9)")}_handleTimeOut(){const e=this._questions[this._currentIndex];this._answers.push({questionId:e.id,selectedIndex:-1,responseTimeMs:1e4});const t=this._saveManager.cloudUserId||"local-user";this._client.sendAnswer(t,this._currentIndex,!1,this._myScore),this._audioManager.playQuizWhistle();const i=document.querySelectorAll(".live-option-btn");if(e.correctIndex!==void 0){const o=i[e.correctIndex];o&&o.classList.add("correct")}const n=this._currentIndex===this._questions.length-1?400:1200;setTimeout(()=>{this._currentIndex++,this.render()},n)}_showFinalResults(){this._hasPlayedFullTimeWhistle||(this._hasPlayedFullTimeWhistle=!0,this._audioManager.playQuizWhistle());const e=this._uiManager.container,t=this._saveManager.profile.eloRating||0,i=this._myScore>this._opponentScore,a=this._myScore===this._opponentScore,n=ce.calculateNewRatings(t,this._opponent.elo_rating,i?1:a?.5:0);this._saveManager.profile.eloRating=n.winnerNewElo,this._saveManager.addCoins(i?300:100),this._submitToBackend(),e.innerHTML=`
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
                        ${i?r.currentLocale==="am"?"ድል":r.currentLocale==="om"?"INJIFANNOO":"VICTORY":a?r.currentLocale==="am"?"አቻ":r.currentLocale==="om"?"QIXAA":"DRAW":r.currentLocale==="am"?"ሽነፋ":r.currentLocale==="om"?"MO'AMUU":"DEFEAT"}
                    </div>
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-dim); margin-bottom: 32px;">
                        ${r.currentLocale==="am"?"የመጨረሻ ውጤት":r.currentLocale==="om"?"FIIXAAN GA'II":"FINAL SCORE"}: ${this._myScore} - ${this._opponentScore}
                    </div>

                    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${r.currentLocale==="am"?"ደረጃ":r.currentLocale==="om"?"SADARKAA":"RATING"}</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-blue-accent);">
                                ${n.winnerNewElo} <span style="font-size: var(--fds-font-xs);">(${n.winnerEloChange>=0?"+":""}${n.winnerEloChange})</span>
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${r.currentLocale==="am"?"ሳንቲሞች":r.currentLocale==="om"?"SANTIMA":"COINS"}</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--tv-gold-primary);">
                                +${i?300:100}
                            </div>
                        </div>
                    </div>

                    ${L.Button({id:"live-finish-btn",text:r.currentLocale==="am"?"ወደ ሊግ ማዕከል ተመለስ":r.currentLocale==="om"?"GARA WALTOMMII LIIGII DEEBI'I":"RETURN TO LEAGUE HUB",variant:"primary",fullWidth:!0})}
                </div>
            </div>
            <style>
                #live-finish-btn:active { transform: scale(0.96); }
            </style>
        `,e.querySelector("#live-finish-btn")?.addEventListener("click",()=>{this._audioManager.playClick(),this._onComplete()})}async _submitToBackend(){if(this._saveManager.cloudUserId)try{const{supabase:e}=await pe(async()=>{const{supabase:t}=await Promise.resolve().then(()=>Ue);return{supabase:t}},void 0);e&&await e.rpc("submit_match_result",{p_match_type:"live",p_answers:this._answers,p_live_match_id:this._client.matchId})}catch(e){console.warn("[LiveMatchScreen] Failed to submit live match result",e)}}}class I{static _activeTab="home";static _lastCallback=null;static TABS=[{id:"home",label:"Home",icon:"🏠"},{id:"play",label:"Play",icon:"🎮"},{id:"standings",label:"Leaderboard",icon:"🏆"},{id:"profile",label:"Profile",icon:T.identity}];static LABELS={home:{en:"Home",am:"መነሻ",om:"Mula'a"},play:{en:"Play",am:"ተጫወት",om:"Tapha"},standings:{en:"Leaderboard",am:"ደረጃዎች",om:"Sadarkaa"},profile:{en:"Profile",am:"መገለጫ",om:"Profile"}};static get activeTab(){return I._activeTab}static setActiveTab(e){I._activeTab=e,I.updateTabHighlights()}static refresh(){I._lastCallback&&I.render(I._lastCallback)}static render(e){I._lastCallback=e;let t=document.getElementById("fds-bottom-nav");t||(t=document.createElement("div"),t.id="fds-bottom-nav",t.style.position="fixed",t.style.bottom="0",t.style.left="0",t.style.width="100%",t.style.paddingBottom="env(safe-area-inset-bottom, 16px)",t.style.height="calc(64px + env(safe-area-inset-bottom, 16px))",t.style.background="rgba(2, 6, 23, 0.96)",t.style.borderTop="2px solid var(--fds-gold-primary, #FFD54F)",t.style.boxShadow="0 -8px 32px rgba(0, 0, 0, 0.85)",t.style.backdropFilter="blur(16px)",t.style.zIndex="9000",t.style.display="flex",t.style.justifyContent="space-around",t.style.alignItems="center",t.style.pointerEvents="auto",document.body.appendChild(t));const i=r.currentLocale;t.innerHTML=I.TABS.map(n=>{const o=n.id===I._activeTab,s=I.LABELS[n.id][i]||n.label;return`
                <button class="nav-tab-item ${o?"nav-tab-active":""}" data-tab-id="${n.id}" style="
                    background: none;
                    border: none;
                    color: ${o?"var(--fds-gold-primary, #FFD54F)":"#94A3B8"};
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
                    transform: ${o?"scale(1.1)":"scale(1)"};
                    filter: ${o?"drop-shadow(0 2px 8px rgba(255,213,79,0.4))":"none"};
                ">
                    <div style="position: relative; display: inline-block;">
                        <span style="font-size: 22px; margin-bottom: 2px; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px;">${n.icon}</span>
                        <div id="nav-badge-${n.id}" style="
                            display: none;
                            position: absolute;
                            top: -4px; right: -8px;
                            background: var(--tv-pitch-green, #00C853);
                            color: white; font-size: 10px; font-weight: 900;
                            border-radius: 10px; padding: 2px 6px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                        "></div>
                    </div>
                    <span class="tab-text" style="
                        font-size: var(--fds-font-xs);
                        font-weight: ${o?"800":"600"};
                        letter-spacing: 0.5px;
                        font-family: var(--fds-font-body);
                    ">${s}</span>
                </button>
            `}).join(""),t.querySelectorAll(".nav-tab-item").forEach(n=>{n.addEventListener("click",o=>{const l=o.currentTarget.getAttribute("data-tab-id");if(localStorage.getItem("ETHIO_FOOTBALL_MUTED")!=="true"&&typeof navigator<"u"&&navigator.vibrate)try{navigator.vibrate(10)}catch{}typeof window.ethioOnBackPress=="function"&&window.ethioOnBackPress()||l&&(l!==I._activeTab&&I.setActiveTab(l),e(l))})})}static updateTabHighlights(){const e=document.getElementById("fds-bottom-nav");if(!e)return;e.querySelectorAll(".nav-tab-item").forEach(i=>{const n=i.getAttribute("data-tab-id")===I._activeTab,o=i;o.style.color=n?"var(--fds-gold-primary, #FFD54F)":"#94A3B8",o.style.transform=n?"scale(1.1)":"scale(1)",o.style.filter=n?"drop-shadow(0 2px 8px rgba(255,213,79,0.4))":"none";const s=o.querySelector(".tab-text");s&&(s.style.fontWeight=n?"800":"600")})}static setBadge(e,t){const i=document.getElementById(`nav-badge-${e}`);i&&(t>0?(i.innerText=t>99?"99+":t.toString(),i.style.display="block"):i.style.display="none")}static hide(){const e=document.getElementById("fds-bottom-nav");e&&(e.style.display="none")}static show(){const e=document.getElementById("fds-bottom-nav");e&&(e.style.display="flex")}}class W{static _instance=null;_profileCache=null;_preferencesCache=null;constructor(){}static getInstance(){return W._instance||(W._instance=new W),W._instance}async getProfile(){if(!w.isOnline)return null;const e=m;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("users").select("*").eq("id",t.id).single();return a?(console.warn("[ProfileService] Error fetching profile:",a),null):(this._profileCache=i,i)}catch(t){return console.warn("[ProfileService] Failed to get profile:",t),null}}async updateProfile(e){if(!w.isOnline)return;const t=m;if(t)try{const{data:{user:i}}=await t.auth.getUser();if(!i)return;const{error:a}=await t.from("users").update(e).eq("id",i.id);a?console.warn("[ProfileService] Error updating profile:",a):this._profileCache&&(this._profileCache={...this._profileCache,...e})}catch(i){console.warn("[ProfileService] Failed to update profile:",i)}}async getPreferences(){if(!w.isOnline)return null;const e=m;if(!e)return null;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return null;const{data:i,error:a}=await e.from("user_preferences").select("*").eq("user_id",t.id).single();return a?(console.warn("[ProfileService] Error fetching preferences:",a),null):(this._preferencesCache=i,i)}catch(t){return console.warn("[ProfileService] Failed to get preferences:",t),null}}async updatePreferences(e){if(!w.isOnline)return;const t=m;if(t)try{const{data:{user:i}}=await t.auth.getUser();if(!i)return;const{error:a}=await t.from("user_preferences").update(e).eq("user_id",i.id);a?console.warn("[ProfileService] Error updating preferences:",a):this._preferencesCache&&(this._preferencesCache={...this._preferencesCache,...e})}catch(i){console.warn("[ProfileService] Failed to update preferences:",i)}}async getEarnedAchievements(){if(!w.isOnline)return[];const e=m;if(!e)return[];try{const{data:{user:t}}=await e.auth.getUser();if(!t)return[];const{data:i,error:a}=await e.from("user_achievements").select("achievement_id, earned_at, achievements:achievements (*)").eq("user_id",t.id);return a?(console.warn("[ProfileService] Error fetching user achievements:",a),[]):i||[]}catch(t){return console.warn("[ProfileService] Failed to get user achievements:",t),[]}}async getRewards(){if(!w.isOnline)return[];const e=m;if(!e)return[];try{const{data:{user:t}}=await e.auth.getUser();if(!t)return[];const{data:i,error:a}=await e.from("rewards").select("*").eq("user_id",t.id);return a?(console.warn("[ProfileService] Error fetching user rewards:",a),[]):i||[]}catch(t){return console.warn("[ProfileService] Failed to get rewards:",t),[]}}subscribeToProfileChanges(e){if(!w.isOnline)return()=>{};const t=m;if(!t)return()=>{};let i=null;return t.auth.getUser().then(({data:{user:a}})=>{if(!a)return;const n=m;n&&(i=n.channel(`public:users:id=eq.${a.id}`).on("postgres_changes",{event:"UPDATE",schema:"public",table:"users",filter:`id=eq.${a.id}`},o=>{this._profileCache=o.new,e(this._profileCache)}).subscribe())}),()=>{const a=m;i&&a&&a.removeChannel(i)}}}class Y{static _instance=null;constructor(){}static getInstance(){return Y._instance||(Y._instance=new Y),Y._instance}async getCategories(){if(!w.isOnline)return[];const e=m;if(!e)return[];try{const{data:t,error:i}=await e.from("faq_items").select("category");return i?(console.warn("[FAQService] Error fetching FAQ categories:",i),[]):t?Array.from(new Set(t.map(n=>n.category))):[]}catch(t){return console.warn("[FAQService] Failed to get FAQ categories:",t),[]}}async getFAQsByCategory(e){if(!w.isOnline)return[];const t=m;if(!t)return[];try{const{data:i,error:a}=await t.from("faq_items").select("*").eq("category",e).order("sort_order",{ascending:!0});return a?(console.warn("[FAQService] Error fetching FAQs by category:",a),[]):i||[]}catch(i){return console.warn("[FAQService] Failed to get FAQs by category:",i),[]}}async searchFAQs(e){if(!w.isOnline)return[];const t=m;if(!t)return[];if(!e||e.trim()==="")return[];try{const{data:i,error:a}=await t.from("faq_items").select("*").or(`question_en.ilike.%${e}%,answer_en.ilike.%${e}%`).order("sort_order",{ascending:!0});return a?(console.warn("[FAQService] Error searching FAQs:",a),[]):i||[]}catch(i){return console.warn("[FAQService] Failed to search FAQs:",i),[]}}}class ae{static instance;constructor(){}static getInstance(){return ae.instance||(ae.instance=new ae),ae.instance}async createTicket(e,t,i){if(!w.isOnline)return console.warn("[SupportService] Offline mode: cannot create ticket."),{ticketId:"",success:!1};const a=m;if(!a)return{ticketId:"",success:!1};try{const{data:{user:n},error:o}=await a.auth.getUser();if(o||!n)return console.error("[SupportService] Auth error or user not found:",o),{ticketId:"",success:!1};const{data:s,error:l}=await a.from("support_tickets").insert({user_id:n.id,category:e,message:t,subject:i||null,status:"open"}).select("id").single();return l?(console.error("[SupportService] Failed to create ticket:",l),{ticketId:"",success:!1}):{ticketId:s.id,success:!0}}catch(n){return console.error("[SupportService] Error creating ticket:",n),{ticketId:"",success:!1}}}async getMyTickets(){if(!w.isOnline)return console.warn("[SupportService] Offline mode: returning empty tickets list."),[];const e=m;if(!e)return[];try{const{data:{user:t},error:i}=await e.auth.getUser();if(i||!t)return console.error("[SupportService] Auth error or user not found:",i),[];const{data:a,error:n}=await e.from("support_tickets").select("*").eq("user_id",t.id).order("created_at",{ascending:!1});return n?(console.error("[SupportService] Failed to fetch tickets:",n),[]):a}catch(t){return console.error("[SupportService] Error fetching tickets:",t),[]}}async getTicketById(e){if(!w.isOnline)return console.warn("[SupportService] Offline mode: cannot fetch ticket."),null;const t=m;if(!t)return null;try{const{data:i,error:a}=await t.from("support_tickets").select("*").eq("id",e).single();return a?(console.error(`[SupportService] Failed to fetch ticket with ID ${e}:`,a),null):i}catch(i){return console.error(`[SupportService] Error fetching ticket with ID ${e}:`,i),null}}}class ht{static show(){return new Promise(e=>{const t=document.createElement("div");t.style.cssText=`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 27, 45, 0.85); /* Dark slate background */
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                box-sizing: border-box;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;const i=r.currentLocale==="am"?"ከመለያ መውጣት":r.currentLocale==="om"?"Herrega Keessaa Ba'uu":"Log Out",a=r.currentLocale==="am"?"በእርግጥ ከኢትዮ ፋንታሲ መለያዎ መውጣት ይፈልጋሉ?":r.currentLocale==="om"?"Dhuguma herrega Ethio Fantasy keessaa ba'uu barbaadduu?":"Are you sure you want to log out of your Ethio Fantasy account?",n=r.currentLocale==="am"?"ሰርዝ":r.currentLocale==="om"?"HAQI":"Cancel",o=r.currentLocale==="am"?"ውጣ":r.currentLocale==="om"?"BA'I":"Log Out";t.innerHTML=`
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
                        " onmouseover="this.style.background='rgba(239, 68, 68, 0.05)'" onmouseout="this.style.background='transparent'">${o}</button>
                    </div>
                </div>
            `,document.body.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1";const l=t.firstElementChild;l&&(l.style.transform="scale(1) translateY(0)")});const s=l=>{t.style.pointerEvents="none",t.style.opacity="0";const d=t.firstElementChild;d&&(d.style.transform="scale(0.95) translateY(10px)"),setTimeout(()=>{document.body.contains(t)&&document.body.removeChild(t),e(l)},300)};t.querySelector("#dlg-cancel-btn")?.addEventListener("click",()=>s(!1)),t.querySelector("#dlg-logout-btn")?.addEventListener("click",()=>s(!0))})}}class he{_uiManager;_saveManager;_audioManager;_onBack;_subScreen="main";_defaultSubScreen="main";_settings;_helpCategory=null;_showContactSupportForm=!1;_faqsCache=[];constructor(e,t,i,a,n="main"){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a,this._subScreen=n,this._defaultSubScreen=n,window.ethioOnBackPress=()=>this._subScreen!==this._defaultSubScreen||this._helpCategory||this._showContactSupportForm?(this._audioManager.playClick(),this._goBack(),!0):!1,this._settings=this._getDefaultSettings(),this._loadSettings()}async _loadSettings(){const e=localStorage.getItem("ETHIO_FOOTBALL_SETTINGS_V2");if(e)try{this._settings=JSON.parse(e)}catch{this._settings=this._getDefaultSettings()}else this._settings=this._getDefaultSettings();const t=localStorage.getItem("ETHIO_FOOTBALL_MUTED")==="true";this._settings.soundEffects=!t;const i=await W.getInstance().getPreferences();i&&(this._settings.soundEffects=i.sound_enabled,this._settings.notifications={dailyChallenge:i.notif_daily,tournament:i.notif_tournament,rewards:i.notif_rewards,announcements:i.notif_announcements,subscription:i.notif_subscription,system:i.notif_system},i.sound_enabled&&this._audioManager.isMuted?this._audioManager.toggleMute():!i.sound_enabled&&!this._audioManager.isMuted&&this._audioManager.toggleMute()),this.render()}destroy(){window.ethioOnBackPress=null}_getDefaultSettings(){return{soundEffects:!0,notifications:{dailyChallenge:!0,tournament:!0,rewards:!0,announcements:!0,subscription:!0,system:!0}}}async _saveSettings(){localStorage.setItem("ETHIO_FOOTBALL_SETTINGS_V2",JSON.stringify(this._settings)),localStorage.setItem("ETHIO_FOOTBALL_MUTED",String(!this._settings.soundEffects)),this._settings.soundEffects&&this._audioManager.isMuted?this._audioManager.toggleMute():!this._settings.soundEffects&&!this._audioManager.isMuted&&this._audioManager.toggleMute(),await W.getInstance().updatePreferences({sound_enabled:this._settings.soundEffects,notif_daily:this._settings.notifications.dailyChallenge,notif_tournament:this._settings.notifications.tournament,notif_rewards:this._settings.notifications.rewards,notif_announcements:this._settings.notifications.announcements,notif_subscription:this._settings.notifications.subscription,notif_system:this._settings.notifications.system})}render(){const e=this._uiManager.container;this._subScreen==="main"?this._renderMainScreen(e):this._subScreen==="profile"?this._renderProfileScreen(e,t=>_.render(t)):this._subScreen==="language"?this._renderLanguageScreen(e,t=>_.render(t)):this._subScreen==="notifications"?this._renderNotificationsScreen(e,t=>_.render(t)):this._subScreen==="sound"?this._renderSoundScreen(e,t=>_.render(t)):this._subScreen==="help"?this._renderHelpScreen(e,t=>_.render(t)):this._subScreen==="terms"?this._renderTermsScreen(e,t=>_.render(t)):this._subScreen==="privacy"?this._renderPrivacyScreen(e,t=>_.render(t)):this._subScreen==="about"&&this._renderAboutScreen(e,t=>_.render(t))}_renderMainScreen(e){const t=(l,d,c,h,g)=>`
            <div id="${g}" class="settings-tile" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 24px; width: 28px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${l}</span>
                    <div>
                        <div style="font-size: 15px; font-weight: 800; color: white; letter-spacing: 0.3px;">${d}</div>
                        ${c?`<div style="font-size: 13px; color: var(--fds-text-dim); margin-top: 2px; font-weight: 600;">${c}</div>`:""}
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    ${h}
                </div>
            </div>
        `,i='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',a=l=>`
            <label class="switch-container" style="pointer-events: none;">
                <input type="checkbox" class="switch-input" ${l?"checked":""}>
                <span class="switch-slider"></span>
            </label>
        `,n=r.currentLocale==="am"?"አማርኛ":r.currentLocale==="om"?"Afan Oromo":"English",o=Object.values(this._settings.notifications).some(l=>l);e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${_.render(r.currentLocale==="am"?"ቅንብሮች":r.currentLocale==="om"?"QINDAA'INOOTA":"Settings")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- Account Group -->
                    <div style="font-size: 12px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 20px; text-transform: uppercase; letter-spacing: 1px;">${r.currentLocale==="am"?"መለያ እና መገለጫ":r.currentLocale==="om"?"HERREGA & PROFILE":"ACCOUNT & PROFILE"}</div>
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 16px; padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        ${t("🌍",r.currentLocale==="am"?"ቋንቋ":r.currentLocale==="om"?"Afaan":"Language",n,i,"tile-language")}
                        ${t("🔔",r.currentLocale==="am"?"ማሳወቂያዎች":r.currentLocale==="om"?"Beeksisa":"Notifications","",a(o),"tile-notifications")}
                        <div style="border-bottom: none;">
                            ${t("🔊",r.currentLocale==="am"?"የድምፅ ውጤቶች":r.currentLocale==="om"?"Sagalee":"Sound Effects",this._settings.soundEffects?r.currentLocale==="am"?"የበራ":r.currentLocale==="om"?"Kan Baname":"Enabled":r.currentLocale==="am"?"የጠፋ":r.currentLocale==="om"?"Kan Cufame":"Muted",a(this._settings.soundEffects),"tile-sound")}
                        </div>
                    </div>

                    <!-- Legal Group -->
                    <div style="font-size: 12px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 8px; margin-left: 20px; text-transform: uppercase; letter-spacing: 1px;">${r.currentLocale==="am"?"እገዛ እና ህጋዊ":r.currentLocale==="om"?"GARGAARSA & SEERA":"SUPPORT & LEGAL"}</div>
                    <div class="glass-card" style="margin-bottom: 32px; border-radius: 16px; padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        ${t("❓",r.currentLocale==="am"?"እገዛ እና ድጋፍ":r.currentLocale==="om"?"Gargaarsa & Deeggarsa":"Help & Support","",i,"tile-help")}
                        ${t("📜",r.currentLocale==="am"?"ውሎች እና ሁኔታዎች":r.currentLocale==="om"?"Waliigaltee & Haalawwan":"Terms & Conditions","",i,"tile-terms")}
                        <div style="border-bottom: none;">
                            ${t("🔒",r.currentLocale==="am"?"የግላዊነት ፖሊሲ":r.currentLocale==="om"?"Imaammata Dhuunfaa":"Privacy Policy","",i,"tile-privacy")}
                        </div>
                    </div>

                    <!-- Logout -->
                    <div class="glass-card settings-tile" id="btn-logout" style="margin-bottom: 16px; border-radius: 16px; padding: 0; text-align: center; border: 1px solid rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1); overflow: hidden; box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);">
                        <div style="padding: 16px; font-size: 15px; font-weight: 900; color: #FCA5A5; cursor: pointer; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            ${r.currentLocale==="am"?"ውጣ":r.currentLocale==="om"?"BA'I":"LOG OUT"}
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
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),[{id:"tile-language",sub:"language"},{id:"tile-help",sub:"help"},{id:"tile-terms",sub:"terms"},{id:"tile-privacy",sub:"privacy"}].forEach(l=>{document.getElementById(l.id)?.addEventListener("click",()=>{this._audioManager.playClick(),this._subScreen=l.sub,this.render()})}),document.getElementById("tile-notifications")?.addEventListener("click",()=>{this._audioManager.playClick();const l=!Object.values(this._settings.notifications).some(d=>d);Object.keys(this._settings.notifications).forEach(d=>{this._settings.notifications[d]=l}),this._saveSettings(),this.render()}),document.getElementById("tile-sound")?.addEventListener("click",()=>{this._audioManager.playClick(),this._settings.soundEffects=!this._settings.soundEffects,this._saveSettings(),this.render()}),document.getElementById("btn-logout")?.addEventListener("click",async()=>{this._audioManager.playClick(),await ht.show()&&(await B.getInstance().signOut(),window.location.reload())})}_renderProfileScreen(e,t){const i=this._saveManager.profile,a=i.phone?this._maskPhone(i.phone):`${r.currentLocale==="am"?"እንግዳ ተጫዋች":r.currentLocale==="om"?"Taphataa Keessummaa":"Guest Player"}`,n="July 22, 2026",o=i.eloRating&&i.eloRating>1400?r.currentLocale==="am"?"የበራ ፕሪሚየም":r.currentLocale==="om"?"Premium Hojjetu":"Active Premium":r.currentLocale==="am"?"የበራ መሰረታዊ":r.currentLocale==="om"?"Basic Hojjetu":"Active Basic",s=(l,d)=>`
            <div style="display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: var(--fds-font-sm); font-weight: 700; color: var(--fds-text-dim);">${l}</div>
                <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${d}</div>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(r.currentLocale==="am"?"የእኔ መገለጫ":r.currentLocale==="om"?"PROFILE KOO":"MY PROFILE")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${s(r.currentLocale==="am"?"የስልክ ቁጥር (MSISDN)":r.currentLocale==="om"?"Lakkoofsa MSISDN":"Masked MSISDN",a)}
                        ${s(r.currentLocale==="am"?"የምዝገባ ሁኔታ":r.currentLocale==="om"?"Haala Kaffaltii":"Subscription Status",o)}
                        <div style="border-bottom: none;">
                            ${s(r.currentLocale==="am"?"የተመዘገቡበት ቀን":r.currentLocale==="om"?"Guyyaa Galmee":"Registration Date",n)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderLanguageScreen(e,t){const i=(n,o)=>{const s=r.currentLocale===n;return`
                <div class="settings-tile lang-item" data-lang="${n}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${o}</div>
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

                ${t(r.currentLocale==="am"?"ቋንቋ ይምረጡ":r.currentLocale==="om"?"AFAAN FILADHU":"SELECT LANGUAGE")}

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
        `,this._bindSubScreenBack(e),e.querySelectorAll(".lang-item").forEach(n=>{n.addEventListener("click",o=>{const l=o.currentTarget.getAttribute("data-lang");l&&(this._audioManager.playClick(),r.setLocale(l),I.refresh(),this.render())})})}_renderNotificationsScreen(e,t){const i=(n,o)=>{const s=this._settings.notifications[n];return`
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${o}</div>
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

                ${t(r.currentLocale==="am"?"ማሳወቂያዎች":r.currentLocale==="om"?"BEEKSIISAA":"NOTIFICATIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i("dailyChallenge",r.currentLocale==="am"?"የዕለት ተግዳሮቶች":r.currentLocale==="om"?"Qormaata Guyyaa":"Daily Challenge")}
                        ${i("tournament",r.currentLocale==="am"?"የሊግ ውድድር ዜናዎች":r.currentLocale==="om"?"Dorgommiiwwan Liigii":"Tournament Updates")}
                        ${i("rewards",r.currentLocale==="am"?"ሽልማቶች እና ጉርሻዎች":r.currentLocale==="om"?"Badhaasa & Bonus":"Rewards & Bonuses")}
                        ${i("announcements",r.currentLocale==="am"?"ማስታወቂያዎች":r.currentLocale==="om"?"Beeksisa Sirnaa":"Announcements")}
                        ${i("subscription",r.currentLocale==="am"?"የምዝገባ ማሳወቂያዎች":r.currentLocale==="om"?"Kaffaltii Addaa":"Subscription Alerts")}
                        <div style="border-bottom: none;">
                            ${i("system",r.currentLocale==="am"?"የስርዓት ማንቂያዎች":r.currentLocale==="om"?"Gargaarsa Sirnaa":"System Alerts")}
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
        `,this._bindSubScreenBack(e),e.querySelectorAll(".notif-toggle").forEach(n=>{n.addEventListener("change",o=>{this._audioManager.playClick();const s=o.currentTarget,l=s.getAttribute("data-key");l&&(this._settings.notifications[l]=s.checked,this._saveSettings())})})}_renderSoundScreen(e,t){const i=(s,l)=>{const d=this._settings.soundEffects===s;return`
                <div class="settings-tile sound-item" data-val="${s}" style="
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                ">
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${l}</div>
                    <div style="
                        width: 20px; height: 20px; border-radius: 50%; 
                        border: 2px solid ${d?"var(--tv-gold-primary)":"rgba(255,255,255,0.3)"};
                        display: flex; align-items: center; justify-content: center;
                    ">
                        ${d?'<div style="width: 10px; height: 10px; border-radius: 50%; background: var(--tv-gold-primary);"></div>':""}
                    </div>
                </div>
            `},a=r.currentLocale==="am"?"ድምፅ አብራ":r.currentLocale==="om"?"Bani":"Enable",n=r.currentLocale==="am"?"ድምፅ አጥፋ":r.currentLocale==="om"?"Cufi":"Disable";e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${t(r.currentLocale==="am"?"የድምፅ ውጤቶች":r.currentLocale==="om"?"SAGAALE TAPHA":"SOUND EFFECTS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${i(!0,a)}
                        <div style="border-bottom: none;">
                            ${i(!1,n)}
                        </div>
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e),e.querySelectorAll(".sound-item").forEach(s=>{s.addEventListener("click",l=>{const c=l.currentTarget.getAttribute("data-val")==="true";this._settings.soundEffects=c,this._saveSettings(),this._audioManager.playClick(),this.render()})})}_renderHelpScreen(e,t){const i='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',a=[{id:"account",name:r.currentLocale==="am"?"መለያ":r.currentLocale==="om"?"Herrega":"Account",desc:"Account creation, recovery and security",icon:"👤"},{id:"subscription",name:r.currentLocale==="am"?"ምዝገባ":r.currentLocale==="om"?"Kaffaltii":"Subscription",desc:"Premium access and daily billing",icon:"💳"},{id:"unsubscription",name:r.currentLocale==="am"?"ምዝገባ መሰረዝ":r.currentLocale==="om"?"Haquu":"Unsubscription",desc:"How to opt out or cancel service",icon:"🛑"},{id:"dailyChallenge",name:r.currentLocale==="am"?"የዕለት ተግዳሮት":r.currentLocale==="om"?"Qormaata Guyyaa":"Daily Challenge",desc:"Rules and bonuses for daily plays",icon:"📅"},{id:"tournament",name:r.currentLocale==="am"?"ውድድር":r.currentLocale==="om"?"Dorgommii":"Tournament",desc:"Joining and competing in live events",icon:"🏆"},{id:"rewards",name:r.currentLocale==="am"?"ሽልማቶች":r.currentLocale==="om"?"Badhaasa":"Rewards",desc:"Claiming cash prizes and coins",icon:"🎁"},{id:"gameplay",name:r.currentLocale==="am"?"የጨዋታ ሁኔታ":r.currentLocale==="om"?"Tapha":"Gameplay",desc:"How to answer questions and score",icon:"⚽"},{id:"leaderboard",name:r.currentLocale==="am"?"ደረጃ ሰሌዳ":r.currentLocale==="om"?"Sadarkaa":"Leaderboard",desc:"ELO rating and division climbing",icon:"📊"},{id:"profile",name:r.currentLocale==="am"?"መገለጫ":(r.currentLocale==="om","Profile"),desc:"Managing your player identity",icon:"👤"},{id:"notifications",name:r.currentLocale==="am"?"ማሳወቂያዎች":r.currentLocale==="om"?"Beeksisa":"Notifications",desc:"SMS alerts and system updates",icon:"🔔"},{id:"technicalIssues",name:r.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":r.currentLocale==="om"?"Rakkina Sirnaa":"Technical Issues",desc:"Report bugs or connection problems",icon:"🔧"}],n={account:[{q:"How is my account created?",a:"Your account is automatically created when you authenticate with your Ethio Telecom mobile phone number. There is no password required."},{q:"Can I delete my account?",a:"To delete your account data, please contact Ethio Telecom customer service or submit a support ticket via the app."}],subscription:[{q:"What is Premium Subscription?",a:"Premium subscription gives you unlimited daily plays, full access to all leagues, and entry into the weekly cash prize draws for 2 Birr/day."},{q:"How do I pay for subscription?",a:"Subscription fees are automatically deducted from your Ethio Telecom airtime balance daily."}],unsubscription:[{q:"How do I unsubscribe?",a:'You can cancel your active subscription anytime by going to Settings > Account > Profile and choosing Unsubscribe, or by sending "STOP" to the Ethio Telecom shortcode 8282.'}],dailyChallenge:[{q:"What is the Daily Challenge?",a:"The Daily Challenge is a special daily set of 10 trivia questions on hot football topics. Completing it awards double reward coins and a 1.5x XP bonus!"},{q:"How many times can I play the Daily Challenge?",a:"You can play the Daily Challenge once per calendar day. It resets every night at midnight EAT."}],tournament:[{q:"How do tournaments work?",a:"Tournaments are knockout brackets held every weekend. Players register during the week and compete live in 1v1 match phases to progress."},{q:"What are the tournament entry requirements?",a:"Premium subscribers can enter tournaments for free. Basic and free players must pay a 100 coin registration fee."}],rewards:[{q:"What rewards can I win?",a:"You can win in-game coins, profile XP, custom football badges, and real cash prizes credited directly to your Ethio Telecom mobile account balance."},{q:"When are weekly prizes distributed?",a:"Weekly prizes are processed and sent every Monday at 10:00 AM EAT based on the final Sunday night division standings."}],gameplay:[{q:"How do I play a match?",a:"Read the question carefully and tap the correct option before the timer runs out. Fast answers score Goals, while incorrect ones are Saved by the goalkeeper!"},{q:"How does the match timer work?",a:"You have 30 seconds per question in Solo Matches, and 20 seconds in Live 1v1 Matches. Answering quicker increases your possession stat!"}],leaderboard:[{q:"How are leaderboard points calculated?",a:"Leaderboard standings are based on ELO ratings. You win ELO points by defeating opponents in Live 1v1 Matches and scoring high accuracy in Solo Matches."},{q:"How often does the leaderboard reset?",a:"Division leaderboards reset weekly on Sunday at midnight EAT, after which the top players are promoted and rewards are dispatched."}],profile:[{q:"Why can't I edit my username?",a:"To comply with Ethio Telecom VAS portal guidelines, player profiles are verified and tied securely to your MSISDN. Manually changing names is restricted."}],notifications:[{q:"What notifications will I receive?",a:"You will receive SMS alerts for tournament kick-offs, daily challenge reminders, and subscription renewals. You can toggle these settings anytime."}],technicalIssues:[{q:"The app is freezing. What should I do?",a:"Ensure you have a stable network connection (3G/4G/LTE/5G). Try refreshing the app page by swiping down, or clearing your mobile browser cache."}],privacy:[{q:"How is my data used?",a:"We collect your phone number and game statistics solely to manage your game state and calculate rankings. We never share your data with third parties."}],terms:[{q:"Are there age restrictions?",a:"Yes, you must be 18 years or older, or have parental consent, and be an active Ethio Telecom subscriber to compete for cash rewards."}]};if(this._showContactSupportForm){e.innerHTML=`
                <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                    ${t(r.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":r.currentLocale==="om"?"RAKKINA SIRNAA":"TECHNICAL ISSUES")}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                        
                        <div class="glass-card" style="border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); text-align: left;" id="support-form-container">
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px; letter-spacing: 0.5px;">${r.currentLocale==="am"?"✉️ ሪፖርት ያድርጉ":r.currentLocale==="om"?"✉️ Gabaasi":"✉️ Report an Issue"}</div>
                            <div style="font-size: 14px; color: var(--fds-text-dim); margin-bottom: 20px;">Contact support to resolve bugs, connection drops, or game errors.</div>

                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">${r.currentLocale==="am"?"የጉዳዩ ዓይነት":r.currentLocale==="om"?"GOSA RAKKINA":"PROBLEM CATEGORY"}</label>
                                <select id="support-category" style="width: 100%; padding: 12px 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: white; outline: none; font-size: 15px; appearance: none; -webkit-appearance: none;">
                                    <option value="Billing & Subscription">${r.currentLocale==="am"?"ክፍያ እና ምዝገባ":r.currentLocale==="om"?"Kaffaltii & Galmee":"Billing & Subscription"}</option>
                                    <option value="Technical Issues">${r.currentLocale==="am"?"ቴክኒካዊ ጉዳዮች":r.currentLocale==="om"?"Rakkina Sirnaa":"Technical Issues"}</option>
                                    <option value="Rewards & Points">${r.currentLocale==="am"?"ሽልማቶች እና ነጥቦች":r.currentLocale==="om"?"Badhaasa & Qabxii":"Rewards & Points"}</option>
                                    <option value="General Feedback">${r.currentLocale==="am"?"አጠቃላይ አስተያየት":r.currentLocale==="om"?"Yaada Waligalaa":"General Feedback"}</option>
                                </select>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">${r.currentLocale==="am"?"መልእክት":r.currentLocale==="om"?"ERGAA":"DESCRIPTION"}</label>
                                <textarea id="support-message" placeholder="${r.currentLocale==="am"?"ችግርዎን እዚህ ይግለጹ...":r.currentLocale==="om"?"Rakkina keessan asitti ibsaa...":"Provide details about the issue..."}" style="width: 100%; height: 100px; padding: 14px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: white; outline: none; resize: none; font-family: inherit; font-size: 15px; box-sizing: border-box;"></textarea>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">OPTIONAL SCREENSHOT</label>
                                <div style="width: 100%; padding: 14px; background: rgba(0,0,0,0.3); border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; color: var(--fds-text-dim); text-align: center; font-size: 14px; cursor: pointer;">
                                    📷 Tap to upload screenshot
                                </div>
                            </div>
                            
                            <div id="btn-submit-support" style="background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%); padding: 14px; text-align: center; border-radius: 12px; font-weight: 900; color: white; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);">
                                ${r.currentLocale==="am"?"መልእክት ላክ":r.currentLocale==="om"?"ERGAA ERGI":"SUBMIT SUPPORT TICKET"}
                            </div>
                        </div>
                    </div>
                </div>
            `,this._bindSubScreenBack(e),document.getElementById("btn-back-help")?.addEventListener("click",()=>{this._audioManager.playClick(),this._showContactSupportForm=!1,this.render()}),document.getElementById("btn-submit-support")?.addEventListener("click",async()=>{this._audioManager.playClick();const l=document.getElementById("support-message")?.value.trim(),d=document.getElementById("support-category"),c=d?d.value:"General Feedback";if(!l){K.show(r.currentLocale==="am"?"እባክዎን ከማስገባትዎ በፊት መልእክት ያስገቡ።":r.currentLocale==="om"?"Maree ergamuu dura ergaa galchaa.":"Please enter a message before submitting.","warning");return}const h=document.getElementById("support-form-container");if(h){h.innerHTML=`
                        <div style="text-align: center; padding: 16px; color: var(--fds-text-dim);">
                            ${r.currentLocale==="am"?"ጥያቄዎ ወደ አገልጋይ በመላክ ላይ...":r.currentLocale==="om"?"Ergaan gara serveritti ergamaa jira...":"Submitting ticket to server..."}
                        </div>
                    `;const g=await ae.getInstance().createTicket(c,l),f=g.success?`EF-${g.ticketId.substring(0,8).toUpperCase()}`:"EF-"+Math.floor(1e5+Math.random()*9e5);h.innerHTML=`
                        <div style="text-align: center; padding: 16px;">
                            <div style="font-size: 40px; margin-bottom: 8px;">✅</div>
                            <div style="font-size: var(--fds-font-md); font-weight: 800; color: var(--tv-pitch-green); margin-bottom: 4px;">${r.currentLocale==="am"?"ጥያቄዎ ገብቷል":r.currentLocale==="om"?"ERGAAN ERGAMEERA":"TICKET SUBMITTED"}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 12px;">${r.currentLocale==="am"?"የድጋፍ ቡድናችን በቅርቡ በኤስኤምኤስ ምላሽ ይሰጣል።":r.currentLocale==="om"?"Gareen deeggarsa keenyaa dhiyeenyatti SMSn deebii kenne.":"Our support team will respond via SMS shortly."}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 700; color: var(--fds-text-main); background: rgba(255,255,255,0.08); padding: 6px; border-radius: 6px; font-family: monospace; display: inline-block;">REF: ${f}</div>
                        </div>
                    `}});return}if(this._helpCategory){const l=this._faqsCache.length>0?this._faqsCache:n[this._helpCategory]||[],d=l.map((v,u)=>`
                <div class="glass-card" style="border-radius: 12px; margin-bottom: 12px; border-color: rgba(255,255,255,0.08); overflow: hidden;">
                    <div class="faq-header" data-idx="${u}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.02);">
                        <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${v.q}</div>
                        <span class="faq-icon" style="color: var(--tv-gold-primary); font-size: var(--fds-font-xs); transition: transform 0.2s;">➕</span>
                    </div>
                    <div class="faq-body" id="faq-body-${u}" style="max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out; background: rgba(0,0,0,0.2);">
                        <div style="padding: 16px; font-size: var(--fds-font-sm); color: var(--fds-text-muted); line-height: 1.5;">${v.a}</div>
                    </div>
                </div>
            `).join(""),c=a.find(v=>v.id===this._helpCategory),h=c?c.name:this._helpCategory,g=`
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

                    ${t(`${h.toUpperCase()}`)}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                        
                        <div style="margin-bottom: 24px; padding-left: 12px; border-left: 4px solid var(--tv-gold-primary);">
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 4px; letter-spacing: 0.5px;">Common Questions</div>
                            <div style="font-size: 14px; color: var(--fds-text-dim);">Solutions and relevant instructions</div>
                        </div>
                        
                        <!-- Search FAQs -->
                        <div style="position: relative; margin-bottom: 24px;">
                            <span style="position: absolute; left: 14px; top: 12px; opacity: 0.6;">🔍</span>
                            <input type="text" id="faq-search-input" placeholder="${r.currentLocale==="am"?"ጥያቄዎችን ይፈልጉ...":r.currentLocale==="om"?"Gaaffiiwwan Barbaadi...":"Search FAQs..."}" style="
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
                            ${l.length>0?d:g}
                        </div>
                    </div>
                </div>
            `,this._bindSubScreenBack(e),document.getElementById("btn-back-help")?.addEventListener("click",()=>{this._audioManager.playClick(),this._helpCategory=null,this._faqsCache=[],this.render()}),document.getElementById("faq-search-input")?.addEventListener("input",v=>{const u=v.target.value.toLowerCase();e.querySelectorAll("#faq-list-wrapper > .glass-card").forEach(b=>{const k=(b.querySelector(".faq-header > div")?.textContent||"").toLowerCase(),A=(b.querySelector(".faq-body > div")?.textContent||"").toLowerCase();k.includes(u)||A.includes(u)?b.style.display="block":b.style.display="none"})}),e.querySelectorAll(".faq-header").forEach(v=>{v.addEventListener("click",u=>{this._audioManager.playClick();const y=u.currentTarget,b=y.getAttribute("data-idx"),k=e.querySelector(`#faq-body-${b}`),A=y.querySelector(".faq-icon");k&&A&&(k.style.maxHeight==="0px"||!k.style.maxHeight?(k.style.maxHeight=k.scrollHeight+"px",A.innerText="➖"):(k.style.maxHeight="0px",A.innerText="➕"))})});return}const o=a.map(l=>`
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

                ${t(r.currentLocale==="am"?"እገዛ እና ድጋፍ":r.currentLocale==="om"?"GARGAARSA":"HELP & SUPPORT")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <div class="glass-card" style="border-radius: 16px; padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        ${o}
                    </div>

                </div>
            </div>
        `,this._bindSubScreenBack(e),document.getElementById("btn-contact-support")?.addEventListener("click",()=>{this._audioManager.playClick(),this._showContactSupportForm=!0,this.render()}),e.querySelectorAll(".help-category-tile").forEach(l=>{l.addEventListener("click",async d=>{const h=d.currentTarget.getAttribute("data-cat-id");if(h){if(this._audioManager.playClick(),h==="technicalIssues"){this._showContactSupportForm=!0,this.render();return}this._helpCategory=h;const g=document.getElementById("faq-list-wrapper");g&&(g.innerHTML=`<div style="padding: 20px; color: var(--fds-text-dim);">${r.currentLocale==="am"?"ጥያቄዎች በመጫን ላይ...":r.currentLocale==="om"?"Gaaffiiwwan fe'amaa jiru...":"Loading FAQs..."}</div>`);const x=await Y.getInstance().getFAQsByCategory(h);this._faqsCache=x.map(v=>{let u=v.question_en,y=v.answer_en;return r.currentLocale==="am"&&v.question_am&&v.answer_am?(u=v.question_am,y=v.answer_am):r.currentLocale==="om"&&v.question_om&&v.answer_om&&(u=v.question_om,y=v.answer_om),{q:u,a:y}}),this.render()}})})}_renderTermsScreen(e,t){const i=r.currentLocale==="am"?`
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
        `:r.currentLocale==="om"?`
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

                ${t(r.currentLocale==="am"?"ውሎች እና ሁኔታዎች":r.currentLocale==="om"?"WALIIGALTEE":"TERMS & CONDITIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(7,27,45,0.85); color: var(--fds-text-muted);">
                        ${i}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_renderPrivacyScreen(e,t){const i=r.currentLocale==="am"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 0;">1. የምንሰበስበው መረጃ</h2>
                <p>ለጨዋታው አስተዳደር እንዲረዳን የተጠቃሚውን ስልክ ቁጥር (MSISDN)፣ የቋንቋ ምርጫ እና የጨዋታ ነጥቦችን እንሰበስባለን።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">2. ከኢትዮ ቴሌኮም ጋር ያለው ትስስር</h2>
                <p>አፕሊኬሽኑ ከኢትዮ ቴሌኮም የቪኤኤስ (VAS) መተግበሪያ ጋር በቀጥታ የተገናኘ ሲሆን፣ ሳምንታዊ ሽልማቶችን ለማረጋገጥ ስልክዎን እንጠቀማለን።</p>
                
                <h2 style="color: var(--tv-gold-primary); font-size: 18px; margin-top: 20px;">3. የመረጃ ጥበቃ እና ደህንነት</h2>
                <p>የተጫዋች መረጃ እና የስልክ ቁጥር በከፍተኛ ደህንነት የተጠበቀ ነው። መረጃዎን ለሶስተኛ ወገን አናጋራም።</p>
            </div>
        `:r.currentLocale==="om"?`
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

                ${t(r.currentLocale==="am"?"የግላዊነት ፖሊሲ":r.currentLocale==="om"?"IMAAMMATA DHUUNFAA":"PRIVACY POLICY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); background: rgba(7,27,45,0.85); color: var(--fds-text-muted);">
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

                ${t(r.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":r.currentLocale==="om"?"WAA'EE ETHIO FANTASY":"ABOUT ETHIO FANTASY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px; text-align: center;">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚽</div>
                    <div style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">EthioFantasy</div>
                    <div style="font-size: var(--fds-font-sm); color: var(--tv-gold-primary); font-weight: 800; margin-bottom: 24px; letter-spacing: 1.5px; text-transform: uppercase;">Ethio Telecom VAS Integration</div>
                    
                    <div class="glass-card" style="border-radius: 12px; padding: 20px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: var(--fds-font-sm); line-height: 1.6; color: var(--fds-text-muted); margin-bottom: 24px;">
                        <p style="margin-top: 0;"><strong>${r.currentLocale==="am"?"የመተግበሪያ መግለጫ:":r.currentLocale==="om"?"IBSA APPLIKAASHINII:":"Application Description:"}</strong><br>${r.currentLocale==="am"?"ኢትዮፋንታሲ በኢትዮጵያ ውስጥ ላሉ የእግር ኳስ አፍቃሪዎች የተዘጋጀ ልዩ የእግር ኳስ ጥያቄዎች ሊግ ነው። ዕለታዊ የትሪቪያ ጨዋታዎችን ይጫወቱ፣ ሌሎች ተጫዋቾችን በቀጥታ 1v1 ይፈትኑ እና የገንዘብ ሽልማቶችን ለማሸነፍ በሊግ ደረጃዎች ይውጡ።":r.currentLocale==="om"?"EthioFantasy dorgommii gaaffii kubbaa miilaa fayyadamtoota Itoophiyaatif qophaa'ee dha. Tapha guyyaa taphadhaa, dorgomtoota kan biroo 1v1 irratti falmaa, badhaasa qarshii mo'achuuf sadarkaa liigii kooraa.":"EthioFantasy is a premium Football Quiz League platform crafted specifically for football fans in Ethiopia. Play daily trivia matches, challenge other players in live 1v1 showdowns, and climb the league divisions to win cash prizes."}</p>
                        
                        <p style="margin-bottom: 0;"><strong>${r.currentLocale==="am"?"ዋና ዋና ባህሪያት:":r.currentLocale==="om"?"AMALA GURGUDDOO:":"Key Features:"}</strong><br>
                        ${r.currentLocale==="am"?"• የዕለት ተግዳሮቶች ከነጥብ ማባዣዎች ጋር<br>• የቀጥታ 1v1 ጨዋታዎች<br>• የሳምንቱ መጨረሻ ውድድሮች<br>• የደረጃ እድገት እና የ ELO ሰሌዳ<br>• የተቀናጀ የኤስኤምኤስ ክፍያ ማረጋገጫ":r.currentLocale==="om"?"• Qormaata guyyaa qabxii baay'isu waliin<br>• Tapha 1v1 kallattiin<br>• Dorgommii dhuma torbaniti<br>• Sadarkaa ELO fi guddina liigii<br>• Kaffaltii SMSn mirkanaa'u":"• Daily themed challenges with score multipliers<br>• Live 1v1 real-time matchmaking<br>• Interactive Weekend knockout tournaments<br>• Professional division promotions & ELO ranking leaderboard<br>• Integrated billing checking via SMS OTP"}</p>
                    </div>

                    <div class="glass-card" style="border-radius: 12px; padding: 16px; border-color: rgba(255,255,255,0.08); text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 24px;">
                        <div><strong>${r.currentLocale==="am"?"ስሪት:":r.currentLocale==="om"?"Gosa:":"Version:"}</strong> 1.1.0</div>
                        <div style="margin-top: 6px;"><strong>${r.currentLocale==="am"?"አልሚ:":r.currentLocale==="om"?"Oomishaa:":"Developer:"}</strong> InnoGames VAS Team</div>
                        <div style="margin-top: 6px;"><strong>${r.currentLocale==="am"?"የኢትዮ ቴሌኮም ትስስር:":r.currentLocale==="om"?"Waliin Hojii Itiyo Telekoom:":"Ethio Telecom Integration:"}</strong> VAS Gateway API v3.2</div>
                        <div style="margin-top: 6px;"><strong>${r.currentLocale==="am"?"ግንኙነት:":r.currentLocale==="om"?"Qunnamtii:":"Contact:"}</strong> support@ethiofantasy.com</div>
                    </div>

                    <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700;">
                        ${r.currentLocale==="am"?"© 2026 ኢትዮ ቴሌኮም VAS። መብቱ በህግ የተጠበቀ ነው።":r.currentLocale==="om"?"© 2026 Itiyo Telekoom VAS. Mirgi Hunduu Seeraan Kan Eegame.":"© 2026 Ethio Telecom VAS. All Rights Reserved."}
                    </div>
                </div>
            </div>
        `,this._bindSubScreenBack(e)}_goBack(){if(this._subScreen!==this._defaultSubScreen)this._subScreen=this._defaultSubScreen;else if(!(this._helpCategory!==null||this._showContactSupportForm)){this._onBack();return}this._helpCategory=null,this._showContactSupportForm=!1,this.render()}_bindSubScreenBack(e){_.bind(e,()=>{this._audioManager.playClick(),this._goBack()})}_maskPhone(e){let t=e.replace(/[^0-9+]/g,"");return t.startsWith("+")&&(t=t.substring(1)),t.startsWith("251")&&(t="251"+t.replace(/^0+/,"")),t.substring(0,4)+"****"+t.substring(t.length-2)}}class P{static _instance=null;constructor(){}static getInstance(){return P._instance||(P._instance=new P),P._instance}async getNotifications(e){if(!w.isOnline)return[];const t=m;if(!t)return[];try{const{data:{user:i}}=await t.auth.getUser();if(!i)return[];let a=t.from("notifications").select("*").or(`user_id.eq.${i.id},user_id.is.null`).order("created_at",{ascending:!1});e&&(a=a.eq("category",e));const{data:n,error:o}=await a;return o?(console.warn("[NotificationService] Error fetching notifications:",o),[]):n||[]}catch(i){return console.warn("[NotificationService] Failed to get notifications:",i),[]}}async getUnreadCount(){if(!w.isOnline)return 0;const e=m;if(!e)return 0;try{const{data:{user:t}}=await e.auth.getUser();if(!t)return 0;const{count:i,error:a}=await e.from("notifications").select("*",{count:"exact",head:!0}).or(`user_id.eq.${t.id},user_id.is.null`).eq("read",!1);return a?(console.warn("[NotificationService] Error fetching unread count:",a),0):i||0}catch(t){return console.warn("[NotificationService] Failed to get unread count:",t),0}}async markAsRead(e){if(!w.isOnline)return;const t=m;if(t)try{const{error:i}=await t.from("notifications").update({read:!0}).eq("id",e);i&&console.warn("[NotificationService] Error marking as read:",i)}catch(i){console.warn("[NotificationService] Failed to mark as read:",i)}}async markAllAsRead(){if(!w.isOnline)return;const e=m;if(e)try{const{data:{user:t}}=await e.auth.getUser();if(!t)return;const{error:i}=await e.from("notifications").update({read:!0}).or(`user_id.eq.${t.id},user_id.is.null`).eq("read",!1);i&&console.warn("[NotificationService] Error marking all as read:",i)}catch(t){console.warn("[NotificationService] Failed to mark all as read:",t)}}subscribeToNewNotifications(e){if(!w.isOnline)return()=>{};const t=m;if(!t)return()=>{};let i=null;return t.auth.getUser().then(({data:{user:a}})=>{if(!a)return;const n=m;n&&(i=n.channel(`public:notifications:user_id=eq.${a.id}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},o=>{const s=o.new;(s.user_id===a.id||s.user_id===null)&&e(s)}).subscribe())}),()=>{const a=m;i&&a&&a.removeChannel(i)}}}class mt{_uiManager;_audioManager;_onBack;_activeTab="all";_notifications=[];_unsubscribeRealtime=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i,this._unsubscribeRealtime=P.getInstance().subscribeToNewNotifications(a=>{this._notifications.unshift(a),this.render()}),this._loadNotifications()}async _loadNotifications(){const e=P.getInstance();this._notifications=await e.getNotifications(),this.render()}render(){const e=this._uiManager.container,t=r.currentLocale,i=this._notifications.filter(l=>this._activeTab==="all"?!0:this._activeTab==="unread"?!l.read:l.category===this._activeTab),n=[{id:"all",label:{en:"All",am:"ሁሉም",om:"Hunda"}},{id:"unread",label:{en:"Unread",am:"ያልተነበቡ",om:"Kan Hin Dubbifamne"}},{id:"daily",label:{en:"Daily",am:"የዕለት",om:"Guyyaa"}},{id:"tournament",label:{en:"League",am:"ሊግ",om:"Liigii"}},{id:"rewards",label:{en:"Rewards",am:"ሽልማቶች",om:"Badhaasa"}},{id:"announcements",label:{en:"System",am:"ስርዓት",om:"Sirna"}},{id:"subscription",label:{en:"Billing",am:"ክፍያ",om:"Kaffaltii"}}].map(l=>{const d=l.id===this._activeTab,c=l.id==="unread"?this._notifications.filter(h=>!h.read).length:l.id==="all"?this._notifications.length:this._notifications.filter(h=>h.category===l.id).length;return`
                <button class="notif-tab ${d?"active-notif-tab":""}" data-tab-id="${l.id}" style="
                    flex: 0 0 auto;
                    padding: 8px 14px;
                    border-radius: 20px;
                    border: 1px solid ${d?"var(--tv-gold-primary)":"rgba(255,255,255,0.08)"};
                    background: ${d?"rgba(255, 213, 79, 0.12)":"rgba(7, 27, 45, 0.6)"};
                    color: ${d?"var(--tv-gold-primary)":"#94A3B8"};
                    font-size: var(--fds-font-sm);
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                ">
                    ${l.label[t]||l.label.en} (${c})
                </button>
            `}).join(""),o=i.length>0?i.map(l=>{const c={daily:"📅",tournament:"🏆",rewards:"🎁",announcements:"📢",system:"⚙️",subscription:"💳"}[l.category]||"🔔",h=t==="am"&&l.title_am?l.title_am:t==="om"&&l.title_om?l.title_om:l.title_en,g=t==="am"&&l.body_am?l.body_am:t==="om"&&l.body_om?l.body_om:l.body_en,f=new Date(l.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                <div class="glass-card notif-item ${l.read?"notif-read":"notif-unread"}" data-notif-id="${l.id}" style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 14px;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s, background-color 0.2s;
                    border-color: ${l.read?"rgba(255,255,255,0.05)":"rgba(255, 213, 79, 0.3)"};
                    background: ${l.read?"rgba(7, 27, 45, 0.6)":"rgba(255, 213, 79, 0.03)"};
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
                    ">${c}</div>

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
                        ">${g}</div>
                        <div style="
                            font-size: var(--fds-font-xs); 
                            color: var(--fds-text-dim); 
                            font-weight: 600;
                        ">⏱️ ${f}</div>
                    </div>
                </div>
            `}).join(""):L.EmptyState("📭","No Notifications"),s=this._notifications.some(l=>!l.read);e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
                <!-- App Bar -->
                ${_.render(t==="am"?"ማሳወቂያዎች":t==="om"?"BEEKSIISAA":"NOTIFICATIONS",s?`
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
                        ${o}
                    </div>
                </div>
            </div>
            <style>
                .notif-tab::-webkit-scrollbar { display: none; }
                .notif-item:active { transform: scale(0.98); }
            </style>
        `,this._bindEvents()}_filterNotifications(e){const t=r.currentLocale;let i=this._notifications.filter(n=>this._activeTab==="all"?!0:this._activeTab==="unread"?!n.read:n.category===this._activeTab);if(e.trim()){const n=e.toLowerCase();i=i.filter(o=>o.title_en&&o.title_en.toLowerCase().includes(n)||o.title_am&&o.title_am.toLowerCase().includes(n)||o.title_om&&o.title_om.toLowerCase().includes(n)||o.body_en&&o.body_en.toLowerCase().includes(n)||o.body_am&&o.body_am.toLowerCase().includes(n)||o.body_om&&o.body_om.toLowerCase().includes(n))}const a=document.getElementById("notifications-list");a&&(a.innerHTML=i.length>0?i.map(o=>{const l={daily:"📅",tournament:"🏆",rewards:"🎁",announcements:"📢",system:"⚙️",subscription:"💳"}[o.category]||"🔔",d=t==="am"&&o.title_am?o.title_am:t==="om"&&o.title_om?o.title_om:o.title_en,c=t==="am"&&o.body_am?o.body_am:t==="om"&&o.body_om?o.body_om:o.body_en,h=new Date(o.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                    <div class="glass-card notif-item ${o.read?"notif-read":"notif-unread"}" data-notif-id="${o.id}" style="
                        display: flex;
                        gap: 16px;
                        padding: 16px;
                        margin-bottom: 12px;
                        border-radius: 14px;
                        cursor: pointer;
                        position: relative;
                        transition: transform 0.2s, background-color 0.2s;
                        border-color: ${o.read?"rgba(255,255,255,0.05)":"rgba(255, 213, 79, 0.3)"};
                        background: ${o.read?"rgba(7, 27, 45, 0.6)":"rgba(255, 213, 79, 0.03)"};
                    ">
                        <!-- Status Indicator Dot -->
                        ${o.read?"":`
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
                                color: ${o.read?"#CBD5E1":"#FFFFFF"};
                                margin-bottom: 4px;
                            ">${d}</div>
                            <div style="
                                font-size: var(--fds-font-sm); 
                                color: var(--fds-text-dim); 
                                line-height: 1.4;
                                margin-bottom: 6px;
                            ">${c}</div>
                            <div style="
                                font-size: var(--fds-font-xs); 
                                color: var(--fds-text-dim); 
                                font-weight: 600;
                            ">⏱️ ${h}</div>
                        </div>
                    </div>
                `}).join(""):L.EmptyState("📭","No Notifications"),a.querySelectorAll(".notif-item").forEach(o=>{o.addEventListener("click",async s=>{const d=s.currentTarget.getAttribute("data-notif-id");d&&(this._audioManager.playClick(),await P.getInstance().markAsRead(d),await this._loadNotifications())})}),document.getElementById("btn-empty-clear-notif")?.addEventListener("click",()=>{this._audioManager.playClick();const o=document.getElementById("notif-search-input");o&&(o.value="",this._filterNotifications(""))}))}_bindEvents(){_.bind(this._uiManager.container,()=>{this._audioManager.playClick(),this._unsubscribeRealtime&&this._unsubscribeRealtime(),this._onBack()}),document.getElementById("notif-search-input")?.addEventListener("input",n=>{const o=n.target.value;this._filterNotifications(o)}),document.getElementById("btn-mark-read")?.addEventListener("click",async()=>{this._audioManager.playClick(),await P.getInstance().markAllAsRead(),await this._loadNotifications()}),this._uiManager.container.querySelectorAll(".notif-tab").forEach(n=>{n.addEventListener("click",o=>{const l=o.currentTarget.getAttribute("data-tab-id");l&&(this._audioManager.playClick(),this._activeTab=l,this.render())})}),this._uiManager.container.querySelectorAll(".notif-item").forEach(n=>{n.addEventListener("click",async o=>{const l=o.currentTarget.getAttribute("data-notif-id");l&&(this._audioManager.playClick(),await P.getInstance().markAsRead(l),await this._loadNotifications())})}),document.getElementById("btn-empty-home")?.addEventListener("click",()=>{this._audioManager.playClick(),this._unsubscribeRealtime&&this._unsubscribeRealtime(),this._onBack()});const a=this._uiManager.container.querySelector(".stadium-container");a&&oe.attach(a,async()=>{this._audioManager.playClick(),await this._loadNotifications()})}}class ft{_uiManager;_saveManager;_audioManager;_onBack;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}async render(){const e=this._uiManager.container;e.innerHTML=L.LoadingState("Loading stats...");const t=this._saveManager.profile,i=await R.getInstance().getHistory(50);let a=t.totalMatches||0,n=t.totalWins||0,o=a>0?Math.round(n/a*100):0,s=0,l=o,d=0,c=0,h=0;if(i.length>0){let S=0,E=0,O=0,Q=0,V=0;i.forEach(H=>{S+=Number(H.accuracy)||0,E+=Number(H.avg_response_time)||0,O+=Number(H.correct_count)||0,V+=Number(H.total_questions)||10,Q+=(Number(H.total_questions)||10)-(Number(H.correct_count)||0)}),l=Math.round(S/i.length),s=E/i.length*1e3;const se=O/V,le=Q/V;d=Math.round(a*10*se),c=Math.round(a*10*le)}const g=s>0?(s/1e3).toFixed(1)+"s":"--",f=t.xp,x=t.highScores["football-quiz"]||0,v=(S,E,O)=>`
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <div style="font-size: var(--fds-font-xs); font-weight: 700; color: var(--fds-text-dim); text-transform: uppercase;">${S}</div>
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-main);">${E}%</div>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: ${E}%; height: 100%; background: ${O}; border-radius: 4px; box-shadow: 0 0 8px ${O}; transition: width 1s ease-out;"></div>
                </div>
            </div>
        `,u=(S,E)=>`
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="font-size: 14px; font-weight: 600; color: var(--fds-text-dim);">${S}</div>
                <div style="font-size: 15px; font-weight: 800; color: var(--fds-text-main);">${E}</div>
            </div>
        `,y=(S,E)=>C.renderCard(`<div style="display: flex; flex-direction: column;">${E}</div>`,S),b=(S,E)=>C.renderCard(`<div style="padding: 20px 16px 8px 16px;">${E}</div>`,S);let k="";a>0?k=b("VISUAL ANALYTICS",`
                ${v("Win Rate",o,"var(--fds-gold-primary)")}
                ${v("Overall Accuracy",l,"var(--fds-green-pitch)")}
            `):k=b("VISUAL ANALYTICS",`
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
                ${_.render("Statistics")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                    
                    ${y("OVERVIEW",`
                        ${u("Games Played",String(a))}
                        ${u("Matches Won",String(n))}
                        ${u("Accuracy",`${l}%`)}
                        <div style="border-bottom: none;">${u("Points / Rank Point",`${f} XP`)}</div>
                    `)}

                    ${y("PERFORMANCE",`
                        ${u("Highest Score",x.toLocaleString())}
                        ${u("Average Response Time",g)}
                        ${u("Correct Answers",String(d))}
                        ${u("Wrong Answers",String(c))}
                        <div style="border-bottom: none;">${u("Skipped Questions",String(h))}</div>
                    `)}

                    ${k}

                </div>
            </div>
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()});const A=e.querySelector(".stadium-container");A&&oe.attach(A,async()=>{this._audioManager.playClick(),await this.render()})}}class vt{_uiManager;_audioManager;_onClose;_statusMessage="";_isSubscribing=!1;_isCheckingStatus=!1;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onClose=i,window.addEventListener("focus",this._handleFocus)}_handleFocus=()=>{this._isSubscribing&&!this._isCheckingStatus&&this._checkSubscriptionStatus()};destroy(){window.removeEventListener("focus",this._handleFocus)}async _checkSubscriptionStatus(){this._isCheckingStatus=!0,this._statusMessage="Checking subscription status...",this.render();try{await new Promise(e=>setTimeout(e,1e3)),this._statusMessage="Complete the SMS subscription to activate EthioFantasy."}catch{this._statusMessage="Could not verify subscription. Please try again."}finally{this._isCheckingStatus=!1,this._isSubscribing=!1,this.render()}}render(){const e=this._uiManager.container;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding-bottom: 80px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 600px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    ${_.render("Subscription")}

                    <div style="padding: 24px 16px;">
                        ${this._statusMessage?`
                            <div style="
                                background: rgba(7, 27, 45, 0.85);
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
                            background: rgba(7, 27, 45, 0.85);
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                            border: 1px solid var(--tv-pitch-green);
                            box-shadow: 0 16px 48px rgba(0, 200, 83, 0.15), inset 0 1px 1px rgba(255,255,255,0.1);
                        ">
                            <div style="font-size: 48px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(0,200,83,0.4));">⚡</div>
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
                                box-shadow: 0 8px 24px rgba(0, 200, 83, 0.4), inset 0 2px 4px rgba(255,255,255,0.2);
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
                    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.4);
                }
            </style>
        `,this._bindEvents()}_bindEvents(){const e=this._uiManager.container;_.bind(e,()=>{this._audioManager.playClick(),this.destroy(),this._onClose()});const t=e.querySelector("#btn-subscribe");t&&t.addEventListener("click",()=>{this._isCheckingStatus||(this._audioManager.playClick(),this._isSubscribing=!0,this._statusMessage="Opening Messages app...",this.render(),setTimeout(()=>{const i="sms:9401?body=OK",a=document.createElement("a");a.href=i;try{document.body.appendChild(a),a.click(),document.body.removeChild(a),setTimeout(()=>{const n=document.getElementById("sms-fallback-ui");n&&(n.style.display="block"),this._statusMessage="Complete the SMS subscription to activate EthioFantasy.";const o=e.querySelector(".status-msg-text");o&&(o.textContent=this._statusMessage)},1500)}catch{const o=document.getElementById("sms-fallback-ui");o&&(o.style.display="block")}},500))}),e.querySelector("#btn-copy-num")?.addEventListener("click",()=>{this._audioManager.playClick(),navigator.clipboard.writeText("9401"),this._statusMessage="Number copied to clipboard.",this.render()}),e.querySelector("#btn-copy-msg")?.addEventListener("click",()=>{this._audioManager.playClick(),navigator.clipboard.writeText("OK"),this._statusMessage="Message copied to clipboard.",this.render()})}}class ne{static _instance=null;_listeners=new Map;static getInstance(){return ne._instance||(ne._instance=new ne),ne._instance}constructor(){}on(e,t){this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t)}off(e,t){this._listeners.has(e)&&this._listeners.get(e).delete(t)}emit(e,t){this._listeners.has(e)&&this._listeners.get(e).forEach(i=>{try{i(t)}catch(a){console.error(`[EventBus] Error handling event '${e}':`,a)}})}}class fe{static _instance;constructor(){}static getInstance(){return this._instance||(this._instance=new fe),this._instance}async getAchievements(){return new Promise(e=>{setTimeout(()=>{e([{id:"prog_1",categoryId:"progress",titleEn:"Rookie",titleAm:"ጀማሪ",titleOm:"Jalqabaa",descriptionEn:"Reach level 5.",descriptionAm:"ደረጃ 5 ይድረሱ።",descriptionOm:"Sadarkaa 5 gahi.",icon:"⭐",isUnlocked:!0,progress:5,maxProgress:5,xpReward:500,dateUnlocked:new Date().toISOString()},{id:"prog_2",categoryId:"progress",titleEn:"Rising Star",titleAm:"አዲስ ኮከብ",titleOm:"Urjii Ba'u",descriptionEn:"Reach level 15.",descriptionAm:"ደረጃ 15 ይድረሱ።",descriptionOm:"Sadarkaa 15 gahi.",icon:"🌟",isUnlocked:!1,progress:12,maxProgress:15,xpReward:1500},{id:"prog_3",categoryId:"progress",titleEn:"Champion",titleAm:"ሻምፒዮን",titleOm:"Shaampiyoonaa",descriptionEn:"Reach level 30.",descriptionAm:"ደረጃ 30 ይድረሱ።",descriptionOm:"Sadarkaa 30 gahi.",icon:"🏆",isUnlocked:!1,progress:12,maxProgress:30,xpReward:3e3},{id:"prog_4",categoryId:"progress",titleEn:"Legend",titleAm:"አፈ ታሪክ",titleOm:"Leegandii",descriptionEn:"Reach level 50.",descriptionAm:"ደረጃ 50 ይድረሱ።",descriptionOm:"Sadarkaa 50 gahi.",icon:"👑",isUnlocked:!1,progress:12,maxProgress:50,xpReward:5e3},{id:"streak_1",categoryId:"daily_streak",titleEn:"3 Days Streak",titleAm:"የ3 ቀናት ተከታታይ",titleOm:"Walitti Fufiinsa Guyyaa 3",descriptionEn:"Play for 3 consecutive days.",descriptionAm:"ለ3 ተከታታይ ቀናት ይጫወቱ።",descriptionOm:"Guyyaa 3 walitti fufee taphadhu.",icon:"🔥",isUnlocked:!0,progress:3,maxProgress:3,xpReward:300,dateUnlocked:new Date().toISOString()},{id:"streak_2",categoryId:"daily_streak",titleEn:"7 Days Streak",titleAm:"የ7 ቀናት ተከታታይ",titleOm:"Walitti Fufiinsa Guyyaa 7",descriptionEn:"Play for a full week.",descriptionAm:"ለሙሉ ሳምንት ይጫወቱ።",descriptionOm:"Torban tokko guutuu taphadhu.",icon:"📅",isUnlocked:!1,progress:4,maxProgress:7,xpReward:1e3},{id:"quiz_1",categoryId:"quiz",titleEn:"First Correct Answer",titleAm:"የመጀመሪያ ትክክለኛ መልስ",titleOm:"Deebii Sirrii Jalqabaa",descriptionEn:"Answer your first question correctly.",descriptionAm:"የመጀመሪያ ጥያቄዎን በትክክል ይመልሱ።",descriptionOm:"Gaaffii jalqabaa sirriitti deebisi.",icon:"✅",isUnlocked:!0,progress:1,maxProgress:1,xpReward:100,dateUnlocked:new Date().toISOString()},{id:"quiz_2",categoryId:"quiz",titleEn:"Perfect Round",titleAm:"ፍጹም ዙር",titleOm:"Marsaa Guutuu",descriptionEn:"Answer all 10 questions correctly in a match.",descriptionAm:"በአንድ ጨዋታ ሁሉንም 10 ጥያቄዎች በትክክል ይመልሱ።",descriptionOm:"Tapha tokko keessatti gaaffilee hunda sirriitti deebisi.",icon:"🎯",isUnlocked:!1,progress:0,maxProgress:1,xpReward:2e3},{id:"rew_1",categoryId:"rewards",titleEn:"Airtime Reward",titleAm:"የአየር ሰዓት ሽልማት",titleOm:"Badhaasa Qilleensaa",descriptionEn:"Win a weekly tournament to earn 50 ETB airtime.",descriptionAm:"50 ብር የአየር ሰዓት ለማግኘት ሳምንታዊ ውድድር ያሸንፉ።",descriptionOm:"Qilleensa ETB 50 argachuuf tapha torbee mo'adhu.",icon:"📱",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!0,rewardType:"airtime",rewardAmount:"50 ETB",redeemed:!1}},{id:"rew_2",categoryId:"rewards",titleEn:"Data Package Reward",titleAm:"የዳታ ጥቅል ሽልማት",titleOm:"Badhaasa Daataa",descriptionEn:"Reach Champion rank to unlock a 1GB Data Package.",descriptionAm:"የ1GB ዳታ ጥቅል ለመክፈት የሻምፒዮን ደረጃ ይድረሱ።",descriptionOm:"Daataa 1GB banuuf sadarkaa shaampiyoonaa gahi.",icon:"🌐",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!0,rewardType:"data",rewardAmount:"1GB",redeemed:!1}},{id:"rew_3",categoryId:"rewards",titleEn:"Telebirr Prize",titleAm:"የቴሌብር ሽልማት",titleOm:"Badhaasa Telebirr",descriptionEn:"Monthly Champion gets a 500 ETB Telebirr deposit.",descriptionAm:"የወሩ ሻምፒዮን 500 ብር የቴሌብር ተቀማጭ ያገኛል።",descriptionOm:"Shaampiyooniin ji'aa Telebirr ETB 500 argata.",icon:"💳",isUnlocked:!1,progress:0,maxProgress:1,xpReward:0,rewardEligibility:{isEligible:!1,rewardType:"telebirr",rewardAmount:"500 ETB"}},{id:"seas_1",categoryId:"seasonal",titleEn:"Ethiopian Premier League",titleAm:"የኢትዮጵያ ፕሪሚየር ሊግ",titleOm:"Piriimiyeer Liigii Itoophiyaa",descriptionEn:"Play 5 matches during the EPL special week.",descriptionAm:"በኢትዮጵያ ፕሪሚየር ሊግ ልዩ ሳምንት 5 ጨዋታዎችን ይጫወቱ።",descriptionOm:"Torbee EPL keessatti taphoota 5 taphadhu.",icon:"⚽",isUnlocked:!0,progress:5,maxProgress:5,xpReward:1e3,dateUnlocked:new Date().toISOString()},{id:"com_1",categoryId:"community",titleEn:"Invite Friends",titleAm:"ጓደኞችን ይጋብዙ",titleOm:"Hiriyoota Affeeri",descriptionEn:"Successfully invite 3 friends to the game.",descriptionAm:"3 ጓደኞችን በተሳካ ሁኔታ ወደ ጨዋታው ይጋብዙ።",descriptionOm:"Hiriyoota 3 gara taphaatti affeeri.",icon:"🤝",isUnlocked:!1,progress:1,maxProgress:3,xpReward:1500}])},600)})}}class yt{_uiManager;_saveManager;_audioManager;_onBack;_achievements=[];_activeTab="all";constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}async render(){const e=this._uiManager.container;e.innerHTML=`
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
                            ${L.LoadingState(r.currentLocale==="am"?"ስኬቶችን በመጫን ላይ...":"Loading achievements...")}
                        </div>
                    </div>
                </div>

                <!-- Detail Modal -->
                <div id="ach-detail-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2,6,23,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 24px;">
                    <div style="background: rgba(7,27,45,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 400px; position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 24px 48px rgba(0,0,0,0.5);">
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
                    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.4);
                }
                
                .ach-card {
                    background: rgba(7, 27, 45, 0.85);
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
                    border-color: rgba(0, 200, 83, 0.4);
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
                    background: var(--tv-pitch-green, #00C853);
                    box-shadow: 0 0 12px rgba(0, 200, 83, 0.8);
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
                    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(0, 200, 83, 0.2));
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
                    background: linear-gradient(90deg, #4ADE80, #00C853);
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
                    background: rgba(0, 200, 83, 0.2);
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
        `;const t=document.getElementById("achievements-app-bar-container");if(t){const i=r.currentLocale==="am"?"ስኬቶች":r.currentLocale==="om"?"Milkaa'ina":"Achievements";t.innerHTML=_.render(i),_.bind(t,()=>{this._audioManager.playClick(),this._onBack()})}try{this._achievements=await fe.getInstance().getAchievements(),this._renderContent()}catch(i){console.error("Failed to load achievements",i);const a=document.getElementById("achievements-content");a&&(a.innerHTML=L.EmptyState("⚠️","Error","Failed to load achievements. Please try again."))}}_renderContent(){const e=document.getElementById("achievements-content");if(!e)return;const t=this._saveManager.profile,i=this._achievements.filter(d=>d.isUnlocked).length,a=this._achievements.length,n=a>0?Math.round(i/a*100):0;let o="";o+=`
            <div style="padding: 24px 16px 16px 16px;">
                <div class="glass-card" style="padding: 16px; border-radius: 16px; text-align: center; background: rgba(7,27,45,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="text-align: left;">
                            <div style="font-size: 11px; font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase; letter-spacing: 0.5px;">OVERALL COMPLETION</div>
                            <div style="font-size: 24px; font-weight: 900; color: white;">${n}%</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 11px; font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase; letter-spacing: 0.5px;">TOTAL XP</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--tv-gold-primary);">${t.xp} XP</div>
                        </div>
                    </div>

                    <div class="ach-progress-bg" style="height: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.4);">
                        <div class="ach-progress-fill" style="width: ${n}%; background: linear-gradient(90deg, #FBBF24, #00C853);"></div>
                    </div>
                    
                    <div style="font-size: 13px; font-weight: 700; color: var(--fds-text-muted);">
                        UNLOCKED: <span style="color: white;">${i}</span> / ${a}
                    </div>
                </div>
            </div>
        `,o+=`
            <div style="padding: 0 16px 16px 16px; position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.8) 80%, rgba(2,6,23,0) 100%); backdrop-filter: blur(8px); margin: 0 -16px; padding-left: 16px;">
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px;" class="hide-scrollbar">
                    ${[{id:"all",label:"All"},{id:"progress",label:"Progress"},{id:"daily_streak",label:"Streak"},{id:"quiz",label:"Quiz"},{id:"rewards",label:"Rewards"},{id:"seasonal",label:"Seasonal"},{id:"community",label:"Community"}].map(d=>`
                        <button class="ach-tab ${this._activeTab===d.id?"active":""}" data-tab="${d.id}">
                            ${d.label}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;const l=this._activeTab==="all"?this._achievements:this._achievements.filter(d=>d.categoryId===this._activeTab);o+=`
            <div style="padding: 0 16px;">
                ${l.length>0?l.map(d=>this._buildAchievementCard(d)).join(""):L.EmptyState("🎁","No Achievements","Keep playing to unlock your first achievement.")}
            </div>
        `,e.innerHTML=o,this._bindTabs()}_buildAchievementCard(e){const t=r.currentLocale==="am"?e.titleAm:r.currentLocale==="om"?e.titleOm:e.titleEn,i=r.currentLocale==="am"?e.descriptionAm:r.currentLocale==="om"?e.descriptionOm:e.descriptionEn,a=Math.min(100,Math.round(e.progress/e.maxProgress*100)),n=e.isUnlocked?"unlocked":"locked";let o="";return e.categoryId==="rewards"&&e.rewardEligibility&&(o=`<div class="ethio-reward-tag">${e.rewardEligibility.rewardType}</div>`),`
            <div class="ach-card ${n}" data-id="${e.id}" style="cursor: pointer;">
                ${o}
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
        `}_bindTabs(){document.querySelectorAll(".ach-tab").forEach(o=>{o.addEventListener("click",s=>{const d=s.currentTarget.getAttribute("data-tab");d&&d!==this._activeTab&&(this._audioManager.playClick(),this._activeTab=d,this._renderContent())})});const t=document.querySelectorAll(".ach-card"),i=document.getElementById("ach-detail-modal"),a=document.getElementById("ach-modal-content"),n=document.getElementById("btn-close-ach-modal");t.forEach(o=>{o.addEventListener("click",s=>{const d=s.currentTarget.getAttribute("data-id"),c=this._achievements.find(h=>h.id===d);if(c&&i&&a){this._audioManager.playClick();const h=r.currentLocale==="am"?c.titleAm:r.currentLocale==="om"?c.titleOm:c.titleEn,g=r.currentLocale==="am"?c.descriptionAm:r.currentLocale==="om"?c.descriptionOm:c.descriptionEn,f=Math.min(100,Math.round(c.progress/c.maxProgress*100)),x=c.isUnlocked?"linear-gradient(90deg, #4ADE80, #00C853)":"linear-gradient(90deg, #FBBF24, #F59E0B)";a.innerHTML=`
                        <div style="font-size: 64px; margin-bottom: 16px; text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${c.icon}</div>
                        <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 8px;">${h}</div>
                        <div style="font-size: 14px; color: var(--fds-text-muted); margin-bottom: 24px; max-width: 80%; line-height: 1.5;">${g}</div>
                        
                        <div style="width: 100%; max-width: 300px; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05);">
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 800; color: white; margin-bottom: 8px;">
                                <span>PROGRESS</span>
                                <span>${c.progress} / ${c.maxProgress}</span>
                            </div>
                            <div class="ach-progress-bg" style="height: 8px; background: rgba(255,255,255,0.1); margin-bottom: 16px; margin-top: 0;">
                                <div class="ach-progress-fill" style="width: ${f}%; background: ${x};"></div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 800; color: white;">
                                <span>REWARD</span>
                                <span style="color: var(--tv-gold-primary);">+${c.xpReward} XP</span>
                            </div>
                        </div>
                        
                        <button id="btn-close-ach-modal-inner" class="ethio-profile-btn ethio-profile-btn-primary" style="max-width: 300px;">OK</button>
                    `,i.style.display="flex",document.getElementById("btn-close-ach-modal-inner")?.addEventListener("click",()=>{this._audioManager.playClick(),i.style.display="none"})}})}),n?.addEventListener("click",()=>{this._audioManager.playClick(),i&&(i.style.display="none")})}}class re{static instance;constructor(){}static getInstance(){return re.instance||(re.instance=new re),re.instance}async getAwards(e){if(!w.isOnline||!m)return[];try{const{data:t,error:i}=await m.rpc("get_past_tournament_winners",{p_period_type:e});if(!i&&t&&Array.isArray(t))return t.map(a=>({awardId:`awd_${a.user_id}_${e}`,tournamentId:`trn_${e}`,tournamentType:e,rank:a.rank,userMsisdn:a.msisdn||"",maskedMsisdn:this.maskMsisdn(a.msisdn||""),prizeAmount:this.calculatePrize(a.rank,e),currency:"ETB",tournamentStartDate:"",tournamentEndDate:"",awardDate:new Date().toISOString(),createdAt:new Date().toISOString()}))}catch(t){console.error("[AwardsService] Failed to fetch awards",t)}return[]}calculatePrize(e,t){if(t==="monthly"){if(e===1)return 5e4;if(e===2)return 25e3;if(e===3)return 1e4}else if(t==="weekly"){if(e===1)return 1e4;if(e===2)return 5e3;if(e===3)return 2500}else{if(e===1)return 1e3;if(e===2)return 500;if(e===3)return 250}return 0}maskMsisdn(e){const t=e.replace("+","");if(t.length<9)return e;const i=t.substring(0,5),a=t.substring(t.length-2);return`${i}*****${a}`}}class bt{_uiManager;_audioManager;_onBack;_activeTab="daily";_awards=[];_loading=!0;_error=null;constructor(e,t,i){this._uiManager=e,this._audioManager=t,this._onBack=i,this._loadAwards()}async _loadAwards(){this._loading=!0,this._error=null,this.render();try{this._awards=await re.getInstance().getAwards(this._activeTab)}catch{this._error="Failed to load awards. Please try again."}finally{this._loading=!1,this.render()}}render(){const e=this._uiManager.container,t=i=>this._activeTab===i?`
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
                    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.4);
                `:`
                    flex: 1;
                    background: rgba(7, 27, 45, 0.7);
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
                    ${_.render("My Awards")}

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
        `,this._bindEvents()}_renderContent(){if(this._loading)return L.LoadingState("Loading awards...");if(this._error)return`
                <div style="text-align: center; padding: 40px 16px;">
                    ${L.ErrorState("btn-retry-awards")}
                    <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-top: 12px;">${this._error}</div>
                </div>
            `;const e=B.getInstance().currentUser?.phone||"",t=this._awards.filter(a=>a.userMsisdn===e);if(t.length===0)return`
                <div style="text-align: center; padding: 60px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: 80px; margin-bottom: 24px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">🏆</div>
                    <div style="font-size: 20px; font-weight: 900; color: white; margin-bottom: 12px;">No tournament awards yet</div>
                    <div style="color: var(--fds-text-dim); font-size: 14px; margin-bottom: 32px; max-width: 280px; line-height: 1.5;">Compete in tournaments to earn rewards.</div>
                    <button class="ethio-profile-btn ethio-profile-btn-secondary" style="max-width: 240px;" id="btn-view-tournaments">VIEW TOURNAMENTS</button>
                </div>
            `;let i='<div style="display: flex; flex-direction: column; gap: 16px;" class="fade-in-up">';return t.forEach(a=>{i+=this._renderAwardCard(a)}),i+="</div>",i}_renderAwardCard(e){let t="";e.rank===1?t="🥇 1st Place":e.rank===2?t="🥈 2nd Place":e.rank===3?t="🥉 3rd Place":t=`🏅 ${e.rank}th Place`;const i=new Date(e.tournamentEndDate).toLocaleDateString("en-US",{month:"long",year:"numeric"});return`
            <div class="glass-card" style="
                padding: 16px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                background: rgba(7, 27, 45, 0.7);
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
                    <div style="background: rgba(0, 200, 83, 0.2); color: #4ADE80; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">
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
        `}_capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}_bindEvents(){const e=this._uiManager.container;_.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),e.querySelectorAll(".award-tab").forEach(t=>{t.addEventListener("click",i=>{const a=i.currentTarget.getAttribute("data-tab");a&&a!==this._activeTab&&(this._audioManager.playClick(),this._activeTab=a,this._loadAwards())})}),e.querySelector("#btn-view-tournaments")?.addEventListener("click",()=>{this._audioManager.playClick(),this._onBack()}),e.querySelector("#btn-retry-awards")?.addEventListener("click",()=>{this._audioManager.playClick(),this._loadAwards()})}}class xt{_uiManager;_saveManager;_audioManager;_onBack;_referralCode;_referralLink;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a,this._referralCode=this._saveManager.profile.phone||"GUEST",this._referralLink=`https://ethiofantasy.com/join?ref=${this._referralCode}`}destroy(){}render(){const e=this._uiManager.container,t='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${_.render(r.currentLocale==="am"?"ጓደኞችን ይጋብዙ":r.currentLocale==="om"?"HIRIYOOTA AFFEERI":"INVITE FRIENDS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- HERO -->
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 4px 12px rgba(255,213,79,0.3));">👥</div>
                        <h1 style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${r.currentLocale==="am"?"ጓደኞችን ይጋብዙ":r.currentLocale==="om"?"Hiriyoota Affeeri":"Invite Friends"}</h1>
                        <p style="font-size: 15px; color: var(--fds-text-dim); line-height: 1.5; font-weight: 600;">${r.currentLocale==="am"?"ጓደኞችዎን ወደ ውድድሩ ያምጡ።":r.currentLocale==="om"?"Hiriyoota keessan dorgommiitti fidaa.":"Bring your friends into the competition."}</p>
                    </div>

                    <!-- REFERRAL INFO -->
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">${r.currentLocale==="am"?"የግብዣ ኮድ":r.currentLocale==="om"?"Koodii Affeerichaa":"REFERRAL CODE"}</label>
                            <div style="display: flex; gap: 12px;">
                                <div style="flex: 1; padding: 14px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: white; font-size: 16px; font-family: monospace; letter-spacing: 1px;">
                                    ${this._referralCode}
                                </div>
                                <div class="btn-copy" data-type="code" style="padding: 0 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;">
                                    ${t}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; color: var(--tv-gold-primary); margin-bottom: 8px; font-weight: 800; text-transform: uppercase;">${r.currentLocale==="am"?"የግብዣ ሊንክ":r.currentLocale==="om"?"Liinkii Affeerichaa":"REFERRAL LINK"}</label>
                            <div style="display: flex; gap: 12px;">
                                <div style="flex: 1; padding: 14px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: var(--fds-text-dim); font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    ${this._referralLink}
                                </div>
                                <div class="btn-copy" data-type="link" style="padding: 0 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;">
                                    ${t}
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- CTA -->
                    <div id="btn-share" style="background: linear-gradient(135deg, var(--fds-green-pitch) 0%, var(--fds-green-dark) 100%); padding: 16px; text-align: center; border-radius: 12px; font-weight: 900; font-size: 16px; color: white; letter-spacing: 0.5px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3); margin-bottom: 24px;">
                        ${r.currentLocale==="am"?"ጓደኞችን ይጋብዙ":r.currentLocale==="om"?"HIRIYOOTA AFFEERI":"INVITE FRIENDS"}
                    </div>

                    <!-- STATUS / EMPTY STATE -->
                    <div style="text-align: center; padding: 24px 16px;">
                        <div style="font-size: 40px; margin-bottom: 12px; opacity: 0.5;">📉</div>
                        <div style="font-size: 15px; font-weight: 800; color: white; margin-bottom: 4px;">${r.currentLocale==="am"?"ምንም ጓደኞች ገና አልተጋበዙም":r.currentLocale==="om"?"Hiriyoonni hin affeeramne":"No Referrals Yet"}</div>
                        <div style="font-size: 13px; color: var(--fds-text-dim);">${r.currentLocale==="am"?"ጓደኞችን ይጋብዙ እና እዚህ የእርስዎን ሁኔታ ይከታተሉ።":r.currentLocale==="om"?"Hiriyoota affeeri asitti hordofi.":"Invite friends to track your referral status here."}</div>
                    </div>

                </div>
            </div>
            <style>
                .btn-copy:active, #btn-share:active { transform: scale(0.98); opacity: 0.9; }
            </style>
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),e.querySelectorAll(".btn-copy").forEach(a=>{a.addEventListener("click",n=>{this._audioManager.playClick();const s=n.currentTarget.getAttribute("data-type")==="code"?this._referralCode:this._referralLink;navigator.clipboard.writeText(s),K.show(r.currentLocale==="am"?"ተቀድቷል ✅":r.currentLocale==="om"?"WARAABAMEERA ✅":"COPIED ✅","success")})}),document.getElementById("btn-share")?.addEventListener("click",async()=>{if(this._audioManager.playClick(),navigator.share)try{await navigator.share({title:r.currentLocale==="am"?"ኢትዮ ፋንታሲን ይጫወቱ":r.currentLocale==="om"?"Ethio Fantasy Taphadhu":"Play EthioFantasy",text:r.currentLocale==="am"?`በኢትዮ ፋንታሲ ላይ ተቀላቀሉኝ! የኔን ኮድ ይጠቀሙ፡ ${this._referralCode}`:r.currentLocale==="om"?`Ethio Fantasy irratti na waliin taphadhu! Koodii koo: ${this._referralCode}`:`Join me on EthioFantasy! Use my code: ${this._referralCode}`,url:this._referralLink})}catch(a){console.log("Share error:",a)}else navigator.clipboard.writeText(this._referralLink),K.show(r.currentLocale==="am"?"ሊንክ ተቀድቷል ✅":r.currentLocale==="om"?"LIINKIIN WARAABAMEERA ✅":"LINK COPIED ✅","success")})}}class wt{_uiManager;_saveManager;_audioManager;_onBack;constructor(e,t,i,a){this._uiManager=e,this._saveManager=t,this._audioManager=i,this._onBack=a}destroy(){}_maskPhone(e){let t=e.replace(/[^0-9]/g,"");return e.startsWith("+")?t=e.substring(1):t=e,t.startsWith("251")||(t="251"+t.replace(/^0+/,"")),t.length<9?t:t.substring(0,4)+"*****"+t.substring(t.length-2)}async render(){const e=this._uiManager.container,t=this._saveManager.profile,i=$.getDivision(t.xp);let a="Unranked";try{const s=await D.getInstance().getMyDailyStats();s&&(a=`#${s.rank}`)}catch(s){console.error("Failed to get rank:",s)}const n=t.username||`Player_${Math.floor(Math.random()*4294967295).toString(16)}`,o=t.phone?this._maskPhone(t.phone):"Guest";e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${_.render(r.currentLocale==="am"?"መለያ":r.currentLocale==="om"?"EENYUMMAA":"IDENTITY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <!-- PLAYER IDENTITY CARD -->
                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 16px; padding: 32px 24px; text-align: center; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        
                        <div style="
                            width: 100px; height: 100px; 
                            border-radius: 50%; 
                            background: linear-gradient(135deg, var(--tv-gold-primary), #B8860B);
                            display: flex; align-items: center; justify-content: center; 
                            font-size: 50px; 
                            margin: 0 auto 16px auto;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                            border: 4px solid rgba(255,255,255,0.2);
                        ">
                            👤
                        </div>
                        
                        <div style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">
                            ${n}
                        </div>
                        
                        <div style="display: inline-block; padding: 6px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; color: var(--fds-text-dim); font-size: 16px; font-family: monospace; letter-spacing: 1px;">
                            ${o}
                        </div>

                    </div>

                    <!-- PLAYER STATUS -->
                    <div style="font-size: 14px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 12px; text-transform: uppercase; padding-left: 8px;">
                        ${r.currentLocale==="am"?"የተጫዋች ሁኔታ":r.currentLocale==="om"?"SADARKAA TAPHATAA":"PLAYER STATUS"}
                    </div>

                    <div class="glass-card" style="margin-bottom: 24px; border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(7, 27, 45, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <div style="font-size: 14px; color: var(--fds-text-dim);">${r.currentLocale==="am"?"ሊግ":r.currentLocale==="om"?"Liigii":"League"}</div>
                            <div style="font-size: 16px; font-weight: 800; color: white;">${i.name}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <div style="font-size: 14px; color: var(--fds-text-dim);">${r.currentLocale==="am"?"ደረጃ":r.currentLocale==="om"?"Sadarkaa":"Rank"}</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--tv-gold-primary);">${a}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-size: 14px; color: var(--fds-text-dim);">${r.currentLocale==="am"?"ነጥብ":r.currentLocale==="om"?"Qabxii":"Rank Point"}</div>
                            <div style="font-size: 16px; font-weight: 800; color: var(--tv-pitch-green);">${t.xp.toLocaleString()} XP</div>
                        </div>

                    </div>

                    <!-- SECURITY NOTICE -->
                    <div style="text-align: center; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
                        <div style="font-size: 20px; margin-bottom: 8px; opacity: 0.7;">🔒</div>
                        <div style="font-size: 13px; color: var(--fds-text-dim); font-weight: 600; line-height: 1.5;">
                            ${r.currentLocale==="am"?"የእርስዎ ማንነት የተጠበቀ እና ሊስተካከል የማይችል ነው። የሞባይል ስልክ ቁጥርዎ በደህንነት ምክንያት ሙሉ በሙሉ አይታይም።":r.currentLocale==="om"?"Eenyummaan keessan eegamaa fi sirreeffamuu hin danda'u.":"Your identity profile is secured and read-only. Sensitive information like your full mobile number is masked."}
                        </div>
                    </div>

                </div>
            </div>
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()})}}class _t{_uiManager;_audioManager;_onBack;_activeCategory=null;_faqsCache=[];constructor(e,t,i,a){this._uiManager=e,this._audioManager=i,this._onBack=a}destroy(){}render(){const e=this._uiManager.container,t='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',i=[{id:"account",name:"Account",icon:"👤"},{id:"subscription",name:"Subscription",icon:"💳"},{id:"gameplay",name:"Gameplay",icon:"⚽"},{id:"dailyChallenge",name:"Daily Challenge",icon:"📅"},{id:"tournament",name:"Tournament",icon:"🏆"},{id:"rewards",name:"Rewards",icon:"🎁"},{id:"technicalIssues",name:"Technical Issues",icon:"🔧"}],a={account:[{q:"How is my account created?",a:"Your account is automatically created when you authenticate with your Ethio Telecom mobile phone number. There is no password required."},{q:"Can I delete my account?",a:"To delete your account data, please contact Ethio Telecom customer service or submit a support ticket via the app."}],subscription:[{q:"What is Premium Subscription?",a:"Premium subscription gives you unlimited daily plays, full access to all leagues, and entry into the weekly cash prize draws for 2 Birr/day."},{q:"How do I pay for subscription?",a:"Subscription fees are automatically deducted from your Ethio Telecom airtime balance daily."}],gameplay:[{q:"How do I play a match?",a:"Read the question carefully and tap the correct option before the timer runs out. Fast answers score Goals, while incorrect ones are Saved by the goalkeeper!"},{q:"How does the match timer work?",a:"You have 30 seconds per question in Solo Matches, and 20 seconds in Live 1v1 Matches. Answering quicker increases your possession stat!"}],dailyChallenge:[{q:"What is the Daily Challenge?",a:"The Daily Challenge is a special daily set of 10 trivia questions on hot football topics. Completing it awards double reward coins and a 1.5x XP bonus!"},{q:"How many times can I play the Daily Challenge?",a:"You can play the Daily Challenge once per calendar day. It resets every night at midnight EAT."}],tournament:[{q:"How do tournaments work?",a:"Tournaments are knockout brackets held every weekend. Players register during the week and compete live in 1v1 match phases to progress."},{q:"What are the tournament entry requirements?",a:"Premium subscribers can enter tournaments for free. Basic and free players must pay a 100 coin registration fee."}],rewards:[{q:"What rewards can I win?",a:"You can win in-game coins, profile XP, custom football badges, and real cash prizes credited directly to your Ethio Telecom mobile account balance."},{q:"When are weekly prizes distributed?",a:"Weekly prizes are processed and sent every Monday at 10:00 AM EAT based on the final Sunday night division standings."}],technicalIssues:[{q:"The app is freezing. What should I do?",a:"Ensure you have a stable network connection (3G/4G/LTE/5G). Try refreshing the app page by swiping down, or clearing your mobile browser cache."}]};if(this._activeCategory){const s=this._faqsCache.length>0?this._faqsCache:a[this._activeCategory]||[],l=s.map((x,v)=>`
                <div class="ethio-profile-card faq-card interactive" style="margin-bottom: 12px;">
                    <div class="faq-header" data-idx="${v}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; background: rgba(255,255,255,0.02);">
                        <div style="font-size: 15px; font-weight: 800; color: white; letter-spacing: 0.2px; padding-right: 16px;">${x.q}</div>
                        <span class="faq-icon" style="color: var(--tv-gold-primary); font-size: 18px; transition: transform 0.2s;">➕</span>
                    </div>
                    <div class="faq-body" id="faq-body-${v}" style="max-height: 0; overflow: hidden; transition: max-height 0.25s ease-out; background: rgba(0,0,0,0.3);">
                        <div style="padding: 16px; font-size: 14px; color: var(--fds-text-dim); line-height: 1.6; font-weight: 600;">${x.a}</div>
                    </div>
                </div>
            `).join(""),d=i.find(x=>x.id===this._activeCategory),c=d?d.name:this._activeCategory,h=`
                <div style="text-align: center; padding: 40px 16px;">
                    <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">📋</div>
                    <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 8px;">No FAQs Available</div>
                    <div style="font-size: 14px; color: var(--fds-text-dim);">There are no questions listed for this category yet.</div>
                </div>
            `;e.innerHTML=`
                <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">
                    <div class="ethio-layer ethio-layer-pitch"></div>
                    <div class="ethio-layer ethio-layer-overlay"></div>
                    <div class="ethio-layer ethio-layer-lights"></div>

                    ${_.render("FAQ")}

                    <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                        
                        <div style="margin-bottom: 24px; padding-left: 12px; border-left: 4px solid var(--tv-gold-primary);">
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 4px; letter-spacing: 0.5px;">${c.toUpperCase()}</div>
                            <div style="font-size: 14px; color: var(--fds-text-dim);">Find answers and solutions</div>
                        </div>

                        <!-- SEARCH -->
                        <div style="position: relative; margin-bottom: 24px;">
                            <span style="position: absolute; left: 14px; top: 12px; opacity: 0.6;">🔍</span>
                            <input type="text" id="faq-search-input" placeholder="Search questions..." style="
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
                            ${s.length>0?l:h}
                        </div>
                    </div>
                </div>
            `,_.bind(e,()=>{this._audioManager.playClick(),this._activeCategory=null,this._faqsCache=[],this.render()}),document.getElementById("faq-search-input")?.addEventListener("input",x=>{const v=x.target.value.toLowerCase();e.querySelectorAll(".faq-card").forEach(y=>{const b=(y.querySelector(".faq-header > div")?.textContent||"").toLowerCase(),k=(y.querySelector(".faq-body > div")?.textContent||"").toLowerCase();b.includes(v)||k.includes(v)?y.style.display="block":y.style.display="none"})}),e.querySelectorAll(".faq-header").forEach(x=>{x.addEventListener("click",v=>{this._audioManager.playClick();const u=v.currentTarget,y=u.getAttribute("data-idx"),b=e.querySelector(`#faq-body-${y}`),k=u.querySelector(".faq-icon");b&&k&&(e.querySelectorAll(".faq-body").forEach(A=>{if(A!==b&&A.style.maxHeight!=="0px"){A.style.maxHeight="0px";const S=A.id.replace("faq-body-",""),E=e.querySelector(`.faq-header[data-idx="${S}"] .faq-icon`);E&&(E.innerHTML="➕")}}),b.style.maxHeight==="0px"||!b.style.maxHeight?(b.style.maxHeight=b.scrollHeight+"px",k.innerHTML="➖"):(b.style.maxHeight="0px",k.innerHTML="➕"))})});return}const n=i.map(s=>`
            <div class="faq-category-tile" data-cat-id="${s.id}" style="
                display: flex; align-items: center; justify-content: space-between; 
                padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 24px; width: 28px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">${s.icon}</span>
                    <div style="font-size: 15px; font-weight: 800; color: white; letter-spacing: 0.3px;">${s.name}</div>
                </div>
                <div style="display: flex; align-items: center;">
                    ${t}
                </div>
            </div>
        `).join("");e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${_.render("FAQ")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <div style="margin-bottom: 24px; padding-left: 12px; border-left: 4px solid var(--tv-gold-primary);">
                        <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 4px; letter-spacing: 0.5px;">FAQ CATEGORIES</div>
                        <div style="font-size: 14px; color: var(--fds-text-dim);">Select a topic for help</div>
                    </div>

                    <div class="ethio-profile-card" style="padding: 0;">
                        ${n}
                    </div>

                </div>
            </div>
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()}),e.querySelectorAll(".faq-category-tile").forEach(s=>{s.addEventListener("click",async l=>{const c=l.currentTarget.getAttribute("data-cat-id");if(c){this._audioManager.playClick(),this._activeCategory=c,this.render();try{const g=await Y.getInstance().getFAQsByCategory(c);g&&g.length>0&&(this._faqsCache=g.map(f=>{let x=f.question_en,v=f.answer_en;return r.currentLocale==="am"&&f.question_am&&f.answer_am?(x=f.question_am,v=f.answer_am):r.currentLocale==="om"&&f.question_om&&f.answer_om&&(x=f.question_om,v=f.answer_om),{q:x,a:v}}))}catch(h){console.error("Failed to fetch FAQs:",h)}this.render()}})})}}const kt="1.0.0",St={version:kt};class At{_uiManager;_audioManager;_onBack;constructor(e,t,i,a){this._uiManager=e,this._audioManager=i,this._onBack=a}destroy(){}render(){const e=this._uiManager.container,i=[{title:r.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":r.currentLocale==="om"?"Waa'ee EthioFantasy":"About EthioFantasy",content:r.currentLocale==="am"?"ኢትዮፋንታሲ በኢትዮጵያ ውስጥ ላሉ የእግር ኳስ አፍቃሪዎች የተዘጋጀ ልዩ የእግር ኳስ ጥያቄዎች ሊግ ነው።":r.currentLocale==="om"?"EthioFantasy dorgommii gaaffii kubbaa miilaa fayyadamtoota Itoophiyaatif qophaa'ee dha.":"EthioFantasy is a premium Football Quiz League platform crafted specifically for football fans in Ethiopia."},{title:r.currentLocale==="am"?"እንዴት እንደሚሰራ":r.currentLocale==="om"?"Akkamitti Hojjeta":"How It Works",content:r.currentLocale==="am"?"ዕለታዊ የትሪቪያ ጨዋታዎችን ይጫወቱ፣ ሌሎች ተጫዋቾችን በቀጥታ 1v1 ይፈትኑ እና በሊግ ደረጃዎች ይውጡ።":r.currentLocale==="om"?"Tapha guyyaa taphadhaa, dorgomtoota kan biroo 1v1 irratti falmaa, sadarkaa liigii kooraa.":"Play daily trivia matches, challenge other players in live 1v1 showdowns, and climb the league divisions."},{title:r.currentLocale==="am"?"ጨዋታዎች እና ፈተናዎች":r.currentLocale==="om"?"Taphawwanii fi Qormaata":"Games & Challenges",content:r.currentLocale==="am"?"የዕለት ተግዳሮቶች ከነጥብ ማባዣዎች ጋር እና የክህሎት ማረጋገጫ የሆኑ ጥያቄዎች።":r.currentLocale==="om"?"Qormaata guyyaa qabxii baay'isu waliin.":"Daily themed challenges with score multipliers and skill-based quizzes."},{title:r.currentLocale==="am"?"ውድድሮች":r.currentLocale==="om"?"Dorgommii":"Tournaments",content:r.currentLocale==="am"?"የሳምንቱ መጨረሻ ውድድሮች እና የE-ስፖርት አይነት የማለፊያ ውድድሮች።":r.currentLocale==="om"?"Dorgommii dhuma torbaniti.":"Interactive Weekend knockout tournaments with E-Sports style brackets."},{title:r.currentLocale==="am"?"ሽልማቶች":r.currentLocale==="om"?"Badhaasa":"Rewards",content:r.currentLocale==="am"?"የገንዘብ ሽልማቶችን እና ልዩ ባጆችን በውድድሮች አሸንፈው ይውሰዱ።":r.currentLocale==="om"?"Badhaasa qarshii mo'achuuf sadarkaa liigii kooraa.":"Win real cash prizes, badges, and recognition on the Ethio Telecom VAS platform."},{title:r.currentLocale==="am"?"ድጋፍ":r.currentLocale==="om"?"Deeggarsa":"Support",content:"support@ethiofantasy.com<br>Powered by InnoGames VAS Team"}].map(a=>`
            <div class="ethio-profile-card" style="padding: 20px; margin-bottom: 16px;">
                <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${a.title}
                </div>
                <div style="font-size: 14px; color: var(--fds-text-dim); line-height: 1.6;">
                    ${a.content}
                </div>
            </div>
        `).join("");e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto;">
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${_.render(r.currentLocale==="am"?"ስለ ኢትዮ ፋንታሲ":r.currentLocale==="om"?"WAA'EE ETHIO FANTASY":"ABOUT ETHIOFANTASY")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="font-size: 56px; margin-bottom: 12px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">⚽</div>
                        <div style="font-size: 24px; font-weight: 900; color: white; letter-spacing: 1px;">ETHIOFANTASY</div>
                        <div style="font-size: 14px; font-weight: 700; color: var(--tv-gold-primary); letter-spacing: 2px; margin-top: 4px;">VAS INTEGRATION</div>
                    </div>

                    ${i}

                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px dashed rgba(255,255,255,0.15);">
                        <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 4px;">EthioFantasy</div>
                        <div style="font-size: 14px; font-weight: 700; color: var(--tv-gold-primary); margin-bottom: 12px;">Version ${St.version}</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.4);">© ${new Date().getFullYear()} Ethio Telecom VAS. All Rights Reserved.</div>
                    </div>

                </div>
            </div>
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()})}}class Et{_uiManager;_audioManager;_onBack;constructor(e,t,i,a){this._uiManager=e,this._audioManager=i,this._onBack=a}destroy(){}render(){const e=this._uiManager.container,t=r.currentLocale==="am"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">1. መግቢያ እና የኢትዮፋንታሲ ስምምነት</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">ለኢትዮ ቴሌኮም ደንበኞች ወደተዘጋጀው የኢትዮ ፋንታሲ የእግር ኳስ ጥያቄ ሊግ እንኳን በደህና መጡ። ይህንን ተጨማሪ እሴት አገልግሎት (VAS) በመጠቀም፣ ከኢትዮፋንታሲ እና ከኢትዮ ቴሌኮም ጋር ውል ይገባሉ።</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">2. የምዝገባ ዕቅድ እና ክፍያ</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">ለፕሪሚየም አገልግሎት ዕለታዊ ክፍያ 2 ብር ሲሆን፤ መሰረታዊ አገልግሎት ዕለታዊ ክፍያ 1 ብር ነው። የምዝገባ ክፍያው ከኢትዮ ቴሌኮም የሞባይል ሂሳብዎ ላይ በቀጥታ ተቀናሽ ይደረጋል።</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">3. የጨዋታ እና የደረጃ ሰሌዳ ታማኝነት</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">ጥያቄዎችን በተሰጠው የጊዜ ገደብ ውስጥ መመለስ ይኖርብዎታል። በጨዋታ ላይ ማጭበርበር ወይም ያልተፈቀዱ ቦቶችን መጠቀም መለያዎ በቋሚነት እንዲታገድ ያደርጋል።</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">4. ሽልማቶች እና የገንዘብ ሽልማት ስርጭት</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 0;">በዕለታዊ ተግዳሮቶች፣ ውድድሮች እና ጨዋታዎች የተገኙ የሽልማት ነጥቦች (XP እና ሳንቲሞች) የተለየ ካልተገለጸ በስተቀር እውነተኛ የገንዘብ ዋጋ የላቸውም። ኦፊሴላዊ የሳምንታዊ ደረጃ ሰሌዳ የገንዘብ ሽልማቶች በቀጥታ ወደ ተመዝጋቢው የተረጋገጠ የኢትዮ ቴሌኮም ሞባይል ሂሳብ ገቢ ይደረጋሉ።</p>
            </div>
        `:r.currentLocale==="om"?`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">1. Seensa & Waliigaltee EthioFantasy</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">Gara EthioFantasy, dorgommii gaaffii kubbaa miilaa Itiyo Telekoom fayyadamtootaaf qophaa'eetti baga nagaan dhuftan.</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">2. Kaffaltii</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">Kaffaltiin Premium guyyaatti qarshii 2 yommuu ta'u, kaffaltiin Basic guyyaatti qarshii 1 dha. Kaffaltiin kun herrega bilbila keessanii irraa hir'ifama.</p>

                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">3. Tapha & Sadarkaa</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">Gaaffiiwwan yeroo kenname keessatti deebisuu qabdu. Mala dogoggoraa fayyadamuun akaauntii keessan cufsiisa.</p>

                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">4. Badhaasa Qarshii</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 0;">Badhaasni torban amanamummaadhaan herrega bilbila keessan irratti kaffalama.</p>
            </div>
        `:`
            <div style="font-family: sans-serif; line-height: 1.6;">
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">1. Introduction & Agreement</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">Welcome to EthioFantasy, the premium Football Quiz League developed for Ethio Telecom customers. By accessing this Value Added Service (VAS), you enter into a binding agreement with EthioFantasy and Ethio Telecom.</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">2. Subscription Plans & Billing</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">Subscribing to Premium grants unlimited gameplay access, full league entry, and entry into weekly cash pools. Premium subscription billing is 2 Birr/day. Basic subscription is billed at 1 Birr/day. Daily subscription fees are automatically deducted from your Ethio Telecom airtime balance.</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">3. Gameplay & Leaderboard Integrity</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 24px;">The Football Quiz League requires participants to answer themed questions within the allocated time (30 seconds for Solo, 20 seconds for Live 1v1). Score progression and ELO points are recorded in real-time. Cheating, abusing system vulnerabilities, or using bots is strictly prohibited and results in immediate account termination.</p>
                
                <h2 style="color: white; font-size: 16px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">4. Rewards & Prize Distribution</h2>
                <p style="color: var(--fds-text-dim); margin-top: 0; margin-bottom: 0;">Reward points (XP and coins) gained in Daily Challenges, Tournaments, and matches do not have real cash value unless specified. Official weekly leaderboard cash prizes are credited directly to the subscriber's verified Ethio Telecom mobile account balance. Decision of the EthioFantasy administration on rank calculations is final.</p>
            </div>
        `;e.innerHTML=`
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto;">
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                ${_.render(r.currentLocale==="am"?"ውሎች እና ሁኔታዎች":r.currentLocale==="om"?"WALIIGALTEE":"TERMS & CONDITIONS")}

                <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px 120px 16px;">
                    <div style="margin-bottom: 24px; padding-left: 12px; border-left: 4px solid var(--tv-gold-primary);">
                        <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 4px; letter-spacing: 0.5px;">LEGAL AGREEMENT</div>
                        <div style="font-size: 14px; color: var(--fds-text-dim);">Please read these terms carefully</div>
                    </div>

                    <div class="ethio-profile-card" style="padding: 24px;">
                        ${t}
                    </div>
                </div>
            </div>
        `,_.bind(e,()=>{this._audioManager.playClick(),this._onBack()})}}const Lt=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(p,e,t){if(p==="click"){const i=e;e=async function(a){const n=a.currentTarget;if(n&&n.nodeType===Node.ELEMENT_NODE){if(n.hasAttribute("disabled")||n.hasAttribute("data-ethio-processing")){a.preventDefault(),a.stopImmediatePropagation();return}n.setAttribute("data-ethio-processing","true");const o=n.style.pointerEvents;n.style.pointerEvents="none";try{const s=i.call(this,a);s instanceof Promise&&await s}finally{setTimeout(()=>{n.removeAttribute("data-ethio-processing"),n.style.pointerEvents=o},300)}}else i.call(this,a)}}return Lt.call(this,p,e,t)};async function It(){const p=new Ge;await p.initialize();const e=B.getInstance(p.saveManager),t=U.getInstance(),i=ne.getInstance(),a=new Qe(p.uiManager);a.registerGame(new et),q.getInstance().subscribeToBadgeUpdates(u=>{I.setBadge("profile",u)});const n=window;n.ethioAudio=p.audioManager,n.ethioSave=p.saveManager,n.ethioAuth=e,n.ethioCache=t,n.ethioEvents=i;let o={home:["home"],play:["play"],standings:["standings"],profile:["profile"]},s="home",l=null;try{window.history.replaceState({root:!0},""),window.history.pushState({trap:!0},"")}catch{}const d=async(u,y=!0)=>{if(l&&typeof l.destroy=="function"&&l.destroy(),p.audioManager.stopAllQuizAudio(),l=null,y){const b=o[s]||[];b.length>0&&b[b.length-1]!==u&&b.push(u)}switch(u){case"home":I.setActiveTab("home"),s="home",t.setQuizActive(!1);const b=new at(p.saveManager,p.audioManager,p.uiManager,{onKickOff:async()=>{t.setQuizActive(!0),a.getRegisteredGames().find(X=>X.metadata.id==="football-quiz").setCompetition("walia-ibex"),o[s].push("quiz_game"),await a.launchGame("football-quiz")},onLiveMatch:()=>d("matchmaking"),onDailyChallenge:()=>{d("play_single_path",!1)},onCompetitions:()=>c("standings"),onLeaderboard:()=>c("standings"),onAchievements:()=>c("profile"),onAdminPanel:()=>d("admin"),onSettings:()=>d("settings"),onNotifications:()=>d("notifications"),onViewStats:()=>d("stats"),onMessages:()=>d("messages"),onCasualPlay:async()=>{const F=a.getRegisteredGames().find(X=>X.metadata.id==="football-quiz");F.setCompetition("all"),F.matchType="casual",o[s].push("quiz_game"),await a.launchGame("football-quiz")}});l=b,b.render();break;case"play":I.setActiveTab("play"),s="play",t.setQuizActive(!1);const k=new rt(p.uiManager,p.audioManager,{onCasualPlay:async F=>{const X=a.getRegisteredGames().find(qe=>qe.metadata.id==="football-quiz");X.setCompetition(F&&F!=="random"?F:"all"),X.matchType="casual",o[s].push("quiz_game"),await a.launchGame("football-quiz")}});l=k,k.render();break;case"standings":I.setActiveTab("standings"),s="standings",t.setQuizActive(!1);const A=new lt(p.uiManager,p.saveManager,p.audioManager,g);l=A,await A.render();break;case"play_single_path":t.setQuizActive(!0);const S=await j.getInstance().getTodayChallenge(),E=a.getRegisteredGames().find(F=>F.metadata.id==="football-quiz");!S.completed&&S.questions.length>0?(E.setCompetition(S.questions[0]?.category||"world-cup"),E.setPreloadedQuestions(S.questions),E.matchType="daily",E.dailyChallengeId=S.id,o[s].push("quiz_game"),await a.launchGame("football-quiz")):(pe(()=>Promise.resolve().then(()=>Je),void 0).then(F=>F.Toast.show(r.currentLocale==="am"?"የዕለቱ ውድድር አልቋል! 내일 ይሞክሩ":"Daily challenge already completed! Come back tomorrow.","error")),t.setQuizActive(!1),c("home"));break;case"profile":I.setActiveTab("profile"),s="profile",t.setQuizActive(!1);const O=new dt(p.uiManager,p.saveManager,p.audioManager,{onAchievements:()=>d("achievements"),onStatistics:()=>d("stats"),onLeaderboard:()=>c("standings"),onSubscription:()=>d("subscription"),onMessages:()=>d("messages"),onSettings:()=>d("settings"),onHelp:()=>d("help"),onAbout:()=>d("about"),onPrivacy:()=>d("privacy"),onTerms:()=>d("terms"),onAwards:()=>d("awards"),onInvite:()=>d("invite"),onIdentity:()=>d("identity"),onFaq:()=>d("faq")});l=O,O.render();break;case"messages":t.setQuizActive(!1);const Q=new pt(p.uiManager,p.audioManager,g);l=Q,Q.render();break;case"settings":t.setQuizActive(!1);const V=new he(p.uiManager,p.saveManager,p.audioManager,g,"main");l=V,V.render();break;case"help":t.setQuizActive(!1);const se=new he(p.uiManager,p.saveManager,p.audioManager,g,"help");l=se,se.render();break;case"achievements":t.setQuizActive(!1);const le=new yt(p.uiManager,p.saveManager,p.audioManager,g);l=le,le.render();break;case"awards":t.setQuizActive(!1);const H=new bt(p.uiManager,p.audioManager,g);l=H,H.render();break;case"invite":t.setQuizActive(!1);const ve=new xt(p.uiManager,p.saveManager,p.audioManager,g);l=ve,ve.render();break;case"identity":t.setQuizActive(!1);const ye=new wt(p.uiManager,p.saveManager,p.audioManager,g);l=ye,ye.render();break;case"faq":t.setQuizActive(!1);const be=new _t(p.uiManager,p.saveManager,p.audioManager,g);l=be,be.render();break;case"about":t.setQuizActive(!1);const xe=new At(p.uiManager,p.saveManager,p.audioManager,g);l=xe,xe.render();break;case"privacy":t.setQuizActive(!1);const we=new he(p.uiManager,p.saveManager,p.audioManager,g,"privacy");l=we,we.render();break;case"terms":t.setQuizActive(!1);const _e=new Et(p.uiManager,p.saveManager,p.audioManager,g);l=_e,_e.render();break;case"notifications":t.setQuizActive(!1);const ke=new mt(p.uiManager,p.audioManager,g);l=ke,ke.render();break;case"admin":t.setQuizActive(!1);const Se=new tt(p.uiManager,p.audioManager,g);l=Se,Se.render();break;case"matchmaking":t.setQuizActive(!1);const Ae=new ct(p.uiManager,p.audioManager,p.saveManager,async F=>{n.ethioLiveMatchInfo=F,d("live_match")},g);l=Ae,await Ae.render();break;case"live_match":t.setQuizActive(!0);const de=n.ethioLiveMatchInfo;if(!de){g();return}const Be=await N.getInstance().fetchQuestionsByIds(de.questionIds,r.currentLocale),Ee=new gt(p.uiManager,p.audioManager,p.saveManager,de.liveMatchId,de.opponent,Be,g);l=Ee,Ee.startMatch();break;case"stats":t.setQuizActive(!1);const Le=new ft(p.uiManager,p.saveManager,p.audioManager,g);l=Le,Le.render();break;case"subscription":t.setQuizActive(!1);const Ie=new vt(p.uiManager,p.audioManager,g);l=Ie,Ie.render();break}},c=u=>{const y=o[u],b=y[y.length-1];if(s===u){if(b===u)return;o[u]=[u],d(u,!0);return}s=u,d(b,!0)};n.ethioReloadHome=()=>c("home"),n.ethioHandleBack=()=>{g()},n.ethioCloseGame=()=>{t.setQuizActive(!1);const u=o[s]||[];u.length>0&&(u[u.length-1]==="quiz_game"||u[u.length-1]==="match_stats")&&u.pop();const y=u.length>0?u[u.length-1]:s;d(y,!1)},n.ethioForceHome=()=>{t.setQuizActive(!1);const u=o[s]||[];u.length>0&&(u[u.length-1]==="quiz_game"||u[u.length-1]==="match_stats")&&u.pop(),o.home=["home"],s="home",d("home",!0)},i.on("RELOAD_CURRENT_VIEW",()=>{t.isQuizActive||(console.log("[Bootstrap] Reloading current view upon event trigger."),d(s,!1))}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&!t.isQuizActive&&(console.log("[Bootstrap] App resumed. Triggering background refresh for stale data."),i.emit("DATA_REFRESHED"))});const h=()=>{const u=navigator.onLine;let y=document.getElementById("ethio-offline-banner");u?(y&&(y.style.background="var(--fds-green-pitch)",y.innerHTML="<span>✅</span><span>Connection restored! Refreshing data...</span>",setTimeout(()=>{y?.remove()},2e3)),t.isQuizActive||(console.log("[Bootstrap] Network restored. Triggering reconnection data sync."),i.emit("NETWORK_RESTORED"),i.emit("RELOAD_CURRENT_VIEW"))):y||(y=document.createElement("div"),y.id="ethio-offline-banner",y.style.cssText=`
                    position: fixed; top: 0; left: 0; width: 100vw;
                    background: #EF4444; color: white; text-align: center;
                    font-size: 13px; font-weight: 800; padding: 8px 12px; z-index: 99999;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex;
                    align-items: center; justify-content: center; gap: 8px; font-family: sans-serif;
                `,y.innerHTML="<span>⚠️</span><span>No internet connection. Paused. Reconnecting...</span>",document.body.appendChild(y))};window.addEventListener("online",h),window.addEventListener("offline",h);const g=()=>{const u=o[s]||[];if(typeof window.ethioOnBackPress=="function"&&window.ethioOnBackPress())return;p.audioManager.playClick();const y=document.querySelector('#session-recovery-overlay, #ethio-exit-modal, #ethio-leave-modal, .glass-card-modal, [id*="modal"]');if(y){y.remove();return}if(t.isQuizActive){f();return}if(u.length>1){u.pop();const b=u[u.length-1];(b==="quiz_game"||b==="match_stats")&&u.pop();const k=u.length>0?u[u.length-1]:s;d(k,!1)}else s==="home"?x():c("home")},f=()=>{if(document.getElementById("ethio-leave-modal"))return;const y=document.createElement("div");y.id="ethio-leave-modal",y.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.88); backdrop-filter: blur(16px);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            padding: 20px; box-sizing: border-box; pointer-events: auto;
        `,y.innerHTML=`
            <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 24px; text-align: center; border-radius: 20px;">
                <h2 style="font-size: 20px; font-weight: 900; color: white; margin: 0 0 8px 0; text-transform: uppercase;">LEAVE MATCH?</h2>
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 24px 0; line-height: 1.4;">Your progress will be suspended. You can resume later.</p>
                <div style="display: flex; gap: 10px;">
                    <button id="leave-btn-continue" class="ethio-btn ethio-btn-primary" style="flex: 1;">CONTINUE</button>
                    <button id="leave-btn-leave" class="ethio-btn ethio-btn-secondary" style="flex: 1;">LEAVE</button>
                </div>
            </div>
        `,document.body.appendChild(y),document.getElementById("leave-btn-continue")?.addEventListener("click",()=>{p.audioManager.playClick(),y.remove()}),document.getElementById("leave-btn-leave")?.addEventListener("click",()=>{p.audioManager.playClick(),y.remove(),t.setQuizActive(!1);const b=o[s]||[];b.length>0&&b[b.length-1]==="quiz_game"&&b.pop();const k=b.length>0?b[b.length-1]:s;d(k,!1)})},x=()=>{if(document.getElementById("ethio-exit-modal"))return;const y=document.createElement("div");y.id="ethio-exit-modal",y.style.cssText=`
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.88); backdrop-filter: blur(16px);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            padding: 20px; box-sizing: border-box; pointer-events: auto;
        `,y.innerHTML=`
            <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 24px; text-align: center; border-color: var(--fds-gold-primary); border-radius: 20px;">
                <div style="font-size: 44px; margin-bottom: 8px;">⚽🏆</div>
                <h2 style="font-size: 20px; font-weight: 900; color: white; margin: 0 0 8px 0; text-transform: uppercase;">EXIT ETHIOFANTASY?</h2>
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 24px 0; line-height: 1.4;">Are you sure you want to exit the Football Quiz League? Your streak is saved.</p>
                <div style="display: flex; gap: 10px;">
                    <button id="exit-btn-stay" class="ethio-btn ethio-btn-primary" style="flex: 1;">STAY IN GAME</button>
                    <button id="exit-btn-confirm" class="ethio-btn ethio-btn-secondary" style="flex: 1; border-color: #EF4444; color: #FCA5A5;">EXIT APP</button>
                </div>
            </div>
        `,document.body.appendChild(y),document.getElementById("exit-btn-stay")?.addEventListener("click",()=>{p.audioManager.playClick(),y.remove()}),document.getElementById("exit-btn-confirm")?.addEventListener("click",()=>{p.audioManager.playClick(),y.remove(),window.navigator?.app?.exitApp?window.navigator.app.exitApp():window.Android?.exitApp?window.Android.exitApp():window.close()})};window.addEventListener("popstate",u=>{u.preventDefault();try{window.history.pushState({trap:!0},"")}catch{}g()}),window.addEventListener("keydown",u=>{(u.key==="Escape"||u.key==="Back")&&g()}),n.ethioReloadHome=()=>c("home"),n.ethioNavigateToTab=u=>c(u),n.ethioPlayAgain=async u=>{t.setQuizActive(!0),a.getRegisteredGames().find(b=>b.metadata.id==="football-quiz").setCompetition(u),o[s]||(o[s]=[s]),o[s].push("quiz_game"),await a.launchGame("football-quiz")},I.render(u=>{c(u)});let v=null;return e.subscribe(u=>{const y=u?.id!==v;if(v=u?.id||null,!u)console.log("[Bootstrap] User signed out. Invalidating cache."),t.clear(),I.hide(),new st(p.uiManager,p.audioManager,e,()=>{}).render();else if(console.log("[Bootstrap] User authenticated. Refreshing profile & channels:",u.username),I.show(),te.getInstance().initUserChannels(u.id),i.emit("PROFILE_UPDATED",u),y){z.getInstance().getActiveSession()&&z.getInstance().clearSession(),o={home:["home"],play:["play"],standings:["standings"],profile:["profile"]},s="home",d("home",!1);try{window.history.replaceState({root:!0},""),window.history.pushState({trap:!0},"")}catch{}}}),console.log("[Bootstrap] ⚽ Smart Caching & Refresh Strategy initialized."),p}async function Mt(){try{await It()}catch(p){console.error(p);const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.innerText=`Runtime Error: ${p.message||p}

Stack: ${p.stack||""}`,document.body.appendChild(e)}}window.addEventListener("error",p=>{const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.style.zIndex="999999",e.innerText=`Global Error: ${p.message}
At: ${p.filename}:${p.lineno}`,document.body.appendChild(e)});window.addEventListener("unhandledrejection",p=>{const e=document.createElement("div");e.style.color="red",e.style.position="absolute",e.style.top="100px",e.style.left="10px",e.style.backgroundColor="white",e.style.padding="10px",e.style.fontFamily="monospace",e.style.zIndex="999999",e.innerText=`Unhandled Promise Rejection: ${p.reason}`,document.body.appendChild(e)});Mt().catch(console.error);export{m as a,w as s};
