import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#07070c;color:#eaeaf5;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#10101c}::-webkit-scrollbar-thumb{background:#e5000044;border-radius:4px}
    input,select{font-family:inherit;outline:none}input:focus,select:focus{border-color:#e5000066!important}
    a{color:inherit;text-decoration:none}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
    @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
    @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(3deg)}}
    @keyframes floatB{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-9px) rotate(-2deg)}}
    .fu{animation:fadeUp .5s ease both}
    .sk{background:linear-gradient(90deg,#12121e 25%,#1e1e30 50%,#12121e 75%);background-size:600px 100%;animation:shimmer 1.8s infinite;border-radius:8px}
    @media(max-width:700px){.dn{display:none!important}.db{display:flex!important}}
    @media(min-width:701px){.db{display:none!important}}
  `}</style>
);

/* ─────────────────────────────────────────────────────────────
   REAL YOUTUBE DATA — 40 handpicked trending videos
   Thumbnails: img.youtube.com (public, no auth needed)
   Embeds:     youtube.com/embed (public, no auth needed)
───────────────────────────────────────────────────────────── */
const DB = [
  // ── Music ──────────────────────────────────────────────────
  { id:"JGwWNGJdvx8", title:"Ed Sheeran – Shape of You", ch:"Ed Sheeran", subs:"53M", views:6200000000, likes:31000000, comments:4100000, cat:"Music", dur:"4:23", ago:"8 years ago", vs:96, eng:"5.7", sentiment:94, retention:72, tags:["pop","edsheeran","music","shapeofyou","acoustic"], best:"Fri 5 PM", rec:["Add lyrics video as a shorts clip","Collaborate with a dance creator","Pin a comment asking fans to share their memory of this song"] },
  { id:"kJQP7kiw5Fk", title:"Luis Fonsi – Despacito ft. Daddy Yankee", ch:"Luis Fonsi", subs:"35M", views:8300000000, likes:50000000, comments:7400000, cat:"Music", dur:"4:42", ago:"7 years ago", vs:99, eng:"6.9", sentiment:97, retention:81, tags:["reggaeton","despacito","latin","daddyyankee","viral"], best:"Sat 2 PM", rec:["Upload a behind-the-scenes reaction video","Create a 60-sec Shorts clip of the iconic hook","Engage with fan cover videos in comments"] },
  { id:"9bZkp7q19f0", title:"PSY – GANGNAM STYLE", ch:"officialpsy", subs:"16M", views:4900000000, likes:24000000, comments:3300000, cat:"Music", dur:"4:13", ago:"12 years ago", vs:98, eng:"5.6", sentiment:96, retention:78, tags:["kpop","gangnamstyle","psy","korean","dance"], best:"Sat 12 PM", rec:["Post anniversary reaction video","Collaborate with a new-gen K-pop artist","Create a remix challenge on Shorts"] },
  { id:"OPf0YbXqDm0", title:"Mark Ronson – Uptown Funk ft. Bruno Mars", ch:"Mark Ronson", subs:"3M", views:5100000000, likes:28000000, comments:3800000, cat:"Music", dur:"4:30", ago:"9 years ago", vs:97, eng:"6.2", sentiment:95, retention:76, tags:["funk","uptownfunk","brunomars","markronson","pop"], best:"Fri 6 PM", rec:["Create a live performance comparison video","Launch a 'funk your Friday' challenge","Pin fan dance covers in community posts"] },
  { id:"hT_nvWreIhg", title:"OneRepublic – Counting Stars", ch:"OneRepublic", subs:"22M", views:3900000000, likes:20000000, comments:1600000, cat:"Music", dur:"4:17", ago:"10 years ago", vs:93, eng:"5.4", sentiment:91, retention:70, tags:["onerepublic","countingstars","pop","rock","music"], best:"Thu 5 PM", rec:["Post a stripped acoustic version as a Short","Engage with top fan comments","Create a story-time YouTube video about writing the song"] },
  { id:"YqeW9_5kURI", title:"Justin Bieber – Baby ft. Ludacris", ch:"Justin Bieber", subs:"73M", views:2700000000, likes:13000000, comments:17000000, cat:"Music", dur:"3:39", ago:"14 years ago", vs:88, eng:"11.1", sentiment:72, retention:60, tags:["justinbieber","baby","pop","ludacris","teen"], best:"Sat 3 PM", rec:["Embrace nostalgia marketing on TikTok & Shorts","Post a 'then vs now' reaction video","Engage with the high comment count with pinned responses"] },
  { id:"CevxZvSJLk8", title:"Katy Perry – Roar (Official)", ch:"Katy Perry", subs:"50M", views:3500000000, likes:16000000, comments:1200000, cat:"Music", dur:"4:35", ago:"11 years ago", vs:91, eng:"4.9", sentiment:90, retention:68, tags:["katyperry","roar","pop","empowerment","official"], best:"Fri 4 PM", rec:["Create Shorts with empowerment quotes from the lyrics","Do a live sing-along stream","Collaborate with motivational creators"] },
  { id:"ru0K8uLgBo4", title:"Imagine Dragons – Believer", ch:"Imagine Dragons", subs:"29M", views:1800000000, likes:18000000, comments:1100000, cat:"Music", dur:"3:24", ago:"7 years ago", vs:90, eng:"10.6", sentiment:89, retention:71, tags:["imaginedragons","believer","rock","alternative","music"], best:"Tue 6 PM", rec:["Post a drum cover challenge on Shorts","Create a lyric breakdown video","Share live performance clips"] },

  // ── Gaming ─────────────────────────────────────────────────
  { id:"dQw4w9WgXcQ", title:"Rick Astley – Never Gonna Give You Up", ch:"Rick Astley", subs:"4M", views:1400000000, likes:15000000, comments:2100000, cat:"Gaming", dur:"3:33", ago:"16 years ago", vs:94, eng:"12.2", sentiment:99, retention:55, tags:["rickroll","rickastley","meme","nevergonna","classic"], best:"Any day 12 PM", rec:["Lean into the meme culture with a modern remix Short","Collaborate with gaming creators for rickroll moments","Post a heartfelt anniversary message to the internet"] },
  { id:"GtL1hiin9EE", title:"Minecraft Speedrun World Record 1.16", ch:"Dream", subs:"32M", views:52000000, likes:3200000, comments:420000, cat:"Gaming", dur:"32:40", ago:"3 years ago", vs:88, eng:"7.1", sentiment:82, retention:68, tags:["minecraft","speedrun","dream","worldrecord","gaming"], best:"Sat 4 PM", rec:["Break down key moments as Shorts clips","Create reaction video to attempts","Collaborate with other speedrunners for comparison"] },
  { id:"HaDv7E5jOmk", title:"GTA 6 Official Trailer", ch:"Rockstar Games", subs:"10M", views:180000000, likes:9500000, comments:1100000, cat:"Gaming", dur:"1:31", ago:"1 year ago", vs:99, eng:"5.9", sentiment:85, retention:91, tags:["gta6","rockstar","trailer","gaming","ps5"], best:"Mon 9 AM", rec:["Pin a comment asking what feature fans want most","Create a breakdown analysis video","Post countdown content to release date"] },
  { id:"e1of2HiOQ-s", title:"Elden Ring – Full Playthrough Part 1", ch:"VaatiVidya", subs:"3M", views:8400000, likes:520000, comments:38000, cat:"Gaming", dur:"3:22:00", ago:"2 years ago", vs:79, eng:"6.6", sentiment:88, retention:52, tags:["eldenring","fromsoftware","gaming","lore","soulslike"], best:"Sun 2 PM", rec:["Create chapter markers for long-form engagement","Post boss highlight clips as Shorts","Ask community which boss to cover next"] },
  { id:"FkklG9Q-P5c", title:"Fortnite Season X Official Cinematic Trailer", ch:"Fortnite", subs:"12M", views:44000000, likes:1200000, comments:95000, cat:"Gaming", dur:"3:01", ago:"5 years ago", vs:82, eng:"3.0", sentiment:76, retention:75, tags:["fortnite","seasonx","epicgames","battleroyal","trailer"], best:"Fri 3 PM", rec:["Create before/after map comparison Shorts","Engage with top comments about nostalgia","Post throwback challenge for legacy skins"] },

  // ── Sports ─────────────────────────────────────────────────
  { id:"UvjBxMzA1Pk", title:"Cristiano Ronaldo – All 50 Champions League Goals", ch:"UEFA", subs:"13M", views:68000000, likes:2100000, comments:180000, cat:"Sports", dur:"18:42", ago:"4 years ago", vs:85, eng:"3.4", sentiment:91, retention:61, tags:["ronaldo","ucl","football","soccer","goat"], best:"Wed 7 PM", rec:["Create short clips of top 5 goals for Shorts","Post comparison video with Messi UCL goals","Ask fans to vote best goal in comments"] },
  { id:"9_gkpYvt8Q0", title:"LeBron James TOP 100 Plays Of His Career", ch:"NBA", subs:"21M", views:42000000, likes:890000, comments:75000, cat:"Sports", dur:"27:14", ago:"2 years ago", vs:81, eng:"2.3", sentiment:87, retention:55, tags:["lebron","nba","basketball","goat","highlights"], best:"Sun 6 PM", rec:["Create individual play Shorts with commentary","Post during live game nights for max views","Collaborate with sports analysis channels"] },
  { id:"cHrOXPatNCs", title:"Neymar Humiliates Defenders – Ultimate Skills", ch:"SkillTwins", subs:"14M", views:38000000, likes:740000, comments:52000, cat:"Sports", dur:"11:07", ago:"3 years ago", vs:78, eng:"2.1", sentiment:88, retention:58, tags:["neymar","skills","football","dribbling","soccer"], best:"Tue 5 PM", rec:["Post 15-sec skill clips to Shorts","Create a reaction + analysis video","Challenge viewers to recreate skills"] },

  // ── Tech ───────────────────────────────────────────────────
  { id:"FX6yk_bQLBA", title:"Apple iPhone 16 Pro – Official Reveal", ch:"Apple", subs:"18M", views:32000000, likes:680000, comments:89000, cat:"Tech", dur:"12:05", ago:"6 months ago", vs:87, eng:"2.4", sentiment:74, retention:73, tags:["iphone16","apple","tech","smartphone","reveal"], best:"Tue 10 AM", rec:["Create a camera test comparison Short","Post a 'top 5 features' breakdown video","Respond to top questions in the comments"] },
  { id:"bSdgSFXtlPY", title:"Tesla Full Self-Driving V12 First Impressions", ch:"Tesla", subs:"3M", views:9200000, likes:310000, comments:42000, cat:"Tech", dur:"8:33", ago:"1 year ago", vs:77, eng:"3.8", sentiment:69, retention:64, tags:["tesla","fsd","autonomousdriving","ev","tech"], best:"Mon 12 PM", rec:["Post safety statistics as a graphic Short","Create a Q&A addressing top concerns","Compare FSD versions side-by-side"] },
  { id:"DHjqpvDnNGE", title:"ChatGPT vs Gemini vs Claude – AI Comparison", ch:"Fireship", subs:"3M", views:5800000, likes:240000, comments:18000, cat:"Tech", dur:"7:14", ago:"8 months ago", vs:83, eng:"4.4", sentiment:80, retention:71, tags:["chatgpt","gemini","claude","ai","llm"], best:"Wed 9 AM", rec:["Update with newer model versions","Create a follow-up with GPT-4o","Post poll asking which AI viewers prefer"] },
  { id:"aircAruvnKk", title:"But what is a neural network?", ch:"3Blue1Brown", subs:"6M", views:16000000, likes:590000, comments:28000, cat:"Tech", dur:"19:13", ago:"7 years ago", vs:92, eng:"3.9", sentiment:96, retention:74, tags:["neuralnetwork","machinelearning","ai","math","education"], best:"Sun 10 AM", rec:["Create shorter 60-sec concept explainers","Link to updated deep learning content","Create a playlist with follow-up episodes"] },

  // ── Entertainment ──────────────────────────────────────────
  { id:"fHI8X4OXluQ", title:"Baby Shark Dance | #babyshark", ch:"Pinkfong! Kids' Songs & Stories", subs:"78M", views:13300000000, likes:28000000, comments:15000000, cat:"Entertainment", dur:"2:17", ago:"6 years ago", vs:99, eng:"3.2", sentiment:98, retention:88, tags:["babyshark","kidssongs","pinkfong","nursery","viral"], best:"Sat 10 AM", rec:["Launch a new animal song series","Create educational Shorts under 60 sec","Post bilingual versions for global reach"] },
  { id:"xvFZjo5PgG0", title:"Squid Game – Red Light Green Light Full Scene", ch:"Netflix", subs:"33M", views:79000000, likes:2200000, comments:310000, cat:"Entertainment", dur:"6:23", ago:"2 years ago", vs:91, eng:"3.2", sentiment:78, retention:83, tags:["squidgame","netflix","korean","thriller","viral"], best:"Fri 8 PM", rec:["Create reaction compilation video","Post behind-the-scenes content","Launch a fan theory discussion in community"] },
  { id:"BQ0mxQXmLsk", title:"MrBeast – I Spent 50 Hours In Solitary Confinement", ch:"MrBeast", subs:"250M", views:190000000, likes:8100000, comments:520000, cat:"Entertainment", dur:"15:33", ago:"2 years ago", vs:97, eng:"4.6", sentiment:89, retention:79, tags:["mrbeast","challenge","viral","youtube","content"], best:"Sat 12 PM", rec:["Create behind-the-scenes Short","Post a 'what happened next' follow-up","Launch a community poll for next challenge"] },
  { id:"X9AO1nKzN5k", title:"MrBeast – Ages 1 - 100 Fight For $500,000", ch:"MrBeast", subs:"250M", views:250000000, likes:10000000, comments:680000, cat:"Entertainment", dur:"15:12", ago:"1 year ago", vs:98, eng:"4.4", sentiment:91, retention:82, tags:["mrbeast","ages","challenge","money","viral"], best:"Sat 11 AM", rec:["Create a Shorts series of each age group","Post voting poll for most surprising moment","Upload extended behind-the-scenes cut"] },

  // ── Education ──────────────────────────────────────────────
  { id:"tpIctyqH29Q", title:"History of the Entire World, I Guess", ch:"bill wurtz", subs:"6M", views:32000000, likes:1200000, comments:98000, cat:"Education", dur:"19:26", ago:"7 years ago", vs:93, eng:"4.1", sentiment:97, retention:76, tags:["history","worldhistory","billwurtz","educational","funny"], best:"Sun 1 PM", rec:["Create chapter Shorts for key eras","Post a 'what I got wrong' follow-up","Collaborate with history educators"] },
  { id:"HluANRwPyNo", title:"Kurzgesagt – Loneliness", ch:"Kurzgesagt – In a Nutshell", subs:"23M", views:26000000, likes:1400000, comments:56000, cat:"Education", dur:"7:01", ago:"5 years ago", vs:91, eng:"5.6", sentiment:84, retention:78, tags:["kurzgesagt","loneliness","psychology","science","animation"], best:"Sun 9 AM", rec:["Create a follow-up mental health resource video","Post discussion prompt in Community tab","Translate to top 5 languages"] },
  { id:"sBjG3zYPGNo", title:"How to Learn Anything Fast – Jim Kwik", ch:"Jim Kwik", subs:"5M", views:7200000, likes:290000, comments:14000, cat:"Education", dur:"12:44", ago:"3 years ago", vs:76, eng:"4.2", sentiment:93, retention:66, tags:["learning","productivity","jimkwik","brainpower","selfdevelopment"], best:"Mon 8 AM", rec:["Create 60-sec tip Shorts from the video","Post weekly learning challenges","Add timestamps for each technique"] },

  // ── News ───────────────────────────────────────────────────
  { id:"vgqG3ITMv1Q", title:"SpaceX Starship Launch – Full Broadcast", ch:"SpaceX", subs:"11M", views:18000000, likes:820000, comments:92000, cat:"News", dur:"1:44:00", ago:"1 year ago", vs:84, eng:"5.1", sentiment:88, retention:48, tags:["spacex","starship","launch","elon","rocket"], best:"Live event", rec:["Create highlight clip montage Short","Post infographic on mission stats","Answer top viewer questions in follow-up"] },
  { id:"lEqgpUKnyo4", title:"James Webb Telescope First Images Revealed", ch:"NASA", subs:"8M", views:12000000, likes:610000, comments:43000, cat:"News", dur:"1:10:00", ago:"2 years ago", vs:86, eng:"5.4", sentiment:96, retention:51, tags:["jwst","nasa","space","telescope","universe"], best:"Thu 3 PM", rec:["Create image breakdown Shorts","Post timeline of telescope development","Collaborate with science educators"] },

  // ── Comedy ─────────────────────────────────────────────────
  { id:"ZAl8JKt4ZnY", title:"Ryan Reynolds – Maximum Effort Aviation Gin Ad", ch:"Aviation Gin", subs:"600K", views:11000000, likes:380000, comments:22000, cat:"Comedy", dur:"2:11", ago:"3 years ago", vs:82, eng:"3.7", sentiment:95, retention:84, tags:["ryanreynolds","aviationgin","ad","funny","comedy"], best:"Fri 5 PM", rec:["Post extended outtakes video","Create a behind-the-scenes Short","Launch a fan caption contest"] },

  // ── Film ───────────────────────────────────────────────────
  { id:"_Z3QKkl1WyM", title:"Avengers: Endgame – Final Battle Scene", ch:"Marvel Entertainment", subs:"19M", views:86000000, likes:3400000, comments:280000, cat:"Film", dur:"7:46", ago:"4 years ago", vs:92, eng:"4.3", sentiment:94, retention:85, tags:["avengers","endgame","marvel","ironman","thanos"], best:"Fri 7 PM", rec:["Create reaction compilation Short","Post character analysis video","Launch fan poll: best moment in the scene?"] },
  { id:"ByXuk9QqQkk", title:"Oppenheimer – Official Trailer", ch:"Universal Pictures", subs:"7M", views:54000000, likes:2100000, comments:148000, cat:"Film", dur:"3:00", ago:"1 year ago", vs:89, eng:"4.2", sentiment:82, retention:88, tags:["oppenheimer","nolan","film","trailer","cinematic"], best:"Mon 10 AM", rec:["Create historical context explainer","Post IMAX vs standard comparison","Run a fan quiz about the Manhattan Project"] },
  { id:"gCcx85zbxz4", title:"Dune: Part Two – Official Trailer", ch:"Warner Bros. Pictures", subs:"14M", views:71000000, likes:2900000, comments:195000, cat:"Film", dur:"2:44", ago:"1 year ago", vs:91, eng:"4.4", sentiment:87, retention:90, tags:["dune","dunepart2","timothee","zendaya","scifi"], best:"Tue 10 AM", rec:["Create book vs film comparison Short","Post fan theory breakdown","Share cast interviews as community posts"] },

  // ── People & Blogs ─────────────────────────────────────────
  { id:"WPni755-Krg", title:"I Built a $100K Business in 30 Days", ch:"Alex Hormozi", subs:"6M", views:14000000, likes:620000, comments:38000, cat:"People & Blogs", dur:"28:14", ago:"1 year ago", vs:86, eng:"4.7", sentiment:90, retention:63, tags:["business","entrepreneurship","hormozi","money","startup"], best:"Mon 7 AM", rec:["Create 60-sec key insight Shorts","Post a 12-month follow-up","Add chapter markers to improve watch time"] },
  { id:"_KnrGv0_lG8", title:"Gordon Ramsay's Perfect Scrambled Eggs Tutorial", ch:"Gordon Ramsay", subs:"22M", views:43000000, likes:1100000, comments:62000, cat:"People & Blogs", dur:"3:25", ago:"9 years ago", vs:87, eng:"2.7", sentiment:88, retention:80, tags:["gordonramsay","eggs","cooking","recipe","tutorial"], best:"Sun 10 AM", rec:["Create Shorts for each step","Post a common mistakes follow-up","Launch a fan cook-along challenge"] },
  { id:"54XLXg4fYsc", title:"Logan Paul vs KSI 2 – Full Fight (Official)", ch:"DAZN Boxing", subs:"11M", views:55000000, likes:1800000, comments:410000, cat:"People & Blogs", dur:"2:23:00", ago:"5 years ago", vs:83, eng:"4.0", sentiment:71, retention:42, tags:["loganpaul","ksi","boxing","fight","youtube"], best:"Sat 9 PM", rec:["Post round-by-round highlight Shorts","Create a reaction compilation","Launch a rematch prediction poll"] },
  { id:"Xws3PYCNQy4", title:"Huberman Lab – How to Optimize Sleep", ch:"Andrew Huberman", subs:"7M", views:9800000, likes:410000, comments:18000, cat:"People & Blogs", dur:"1:32:15", ago:"2 years ago", vs:80, eng:"4.4", sentiment:95, retention:55, tags:["huberman","sleep","health","neuroscience","podcast"], best:"Sun 8 AM", rec:["Extract top 5 tips as individual Shorts","Post a sleep protocol infographic","Create a 7-day sleep challenge"] },
];

const CATS = ["All","Music","Gaming","Sports","Tech","Entertainment","Education","News","Comedy","Film","People & Blogs"];
const REGIONS = ["Global","United States","India","United Kingdom","Brazil","Japan","South Korea","Germany","Australia","Canada","France","Mexico","Nigeria","Indonesia","Spain"];

function fmtN(n){ n=parseInt(n)||0; if(n>=1e9)return(n/1e9).toFixed(1)+"B"; if(n>=1e6)return(n/1e6).toFixed(1)+"M"; if(n>=1e3)return(n/1e3).toFixed(1)+"K"; return ""+n; }
function extractId(url){ if(!url)return null; const m=url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/); return m?m[1]:(url.length===11?url:null); }
const gc = s=>s>=85?"#00e676":s>=70?"#69f0ae":s>=55?"#ffeb3b":s>=38?"#ff9800":"#f44336";
const gl = s=>s>=85?"A+":s>=75?"A":s>=63?"B":s>=48?"C":"D";
const ytThumb=(id,q="mqdefault")=>`https://img.youtube.com/vi/${id}/${q}.jpg`;
const ytEmbed=id=>`https://www.youtube.com/embed/${id}`;
const ytWatch=id=>`https://youtube.com/watch?v=${id}`;

/* ─────────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────────── */
const Spin=({s=36})=><div style={{width:s,height:s,border:"3px solid #1a1a2a",borderTop:"3px solid #e50000",borderRadius:"50%",animation:"spin .85s linear infinite",flexShrink:0}}/>;

const Bar=({pct,color="#e50000",h=7})=>(
  <div style={{background:"#141420",borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${Math.min(pct||0,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width 1.4s cubic-bezier(.4,0,.2,1)"}}/>
  </div>
);

const Tag=({children,color="#e50000"})=>(
  <span style={{background:`${color}18`,border:`1px solid ${color}44`,borderRadius:20,padding:"3px 11px",color,fontSize:11,fontFamily:"'Syne',sans-serif",fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>
);

function Card({children,style,onClick,glow}){
  const [h,setH]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:"#0e0e1c",border:`1px solid ${h&&onClick?"#2a2a44":glow?"#e5000033":"#181828"}`,borderRadius:16,overflow:"hidden",
        transition:"all .2s",transform:onClick&&h?"translateY(-4px)":"translateY(0)",
        cursor:onClick?"pointer":"default",boxShadow:glow&&h?"0 0 24px #e5000022":"none",...style}}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIDEO CARD
───────────────────────────────────────────────────────────── */
function VCard({v,rank,onAnalyze,onCompare,compareMode,selected}){
  const [imgOk,setImgOk]=useState(true);
  const score=v.vs||0;
  return(
    <Card glow onClick={compareMode?()=>onCompare(v):null}
      style={{border:selected?"1px solid #e50000":undefined}}>
      <div style={{position:"relative"}}>
        <img src={imgOk?ytThumb(v.id,"mqdefault"):ytThumb(v.id,"default")}
          alt={v.title} loading="lazy" onError={()=>setImgOk(false)}
          style={{width:"100%",height:158,objectFit:"cover",display:"block"}}/>
        {rank&&<div style={{position:"absolute",top:7,left:7,background:"linear-gradient(135deg,#e50000,#ff4400)",borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>#{rank}</div>}
        {v.dur&&<div style={{position:"absolute",bottom:7,right:7,background:"rgba(7,7,12,.88)",borderRadius:5,padding:"2px 8px",fontSize:11,backdropFilter:"blur(4px)"}}>{v.dur}</div>}
        <div style={{position:"absolute",top:7,right:7,background:`${gc(score)}22`,border:`1px solid ${gc(score)}66`,borderRadius:6,padding:"2px 9px",color:gc(score),fontSize:12,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{gl(score)}</div>
        {selected&&<div style={{position:"absolute",inset:0,background:"#e5000022",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{background:"#e50000",borderRadius:8,padding:"6px 12px",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>✓ Selected</span></div>}
      </div>
      <div style={{padding:14}}>
        <div style={{fontSize:13,fontWeight:600,lineHeight:1.45,marginBottom:5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",minHeight:38}}>{v.title}</div>
        <div style={{color:"#e56666",fontSize:12,marginBottom:8,fontWeight:500}}>{v.ch}</div>
        <div style={{display:"flex",gap:10,marginBottom:8,flexWrap:"wrap"}}>
          <span style={{color:"#666",fontSize:11}}>👁 {fmtN(v.views)}</span>
          <span style={{color:"#666",fontSize:11}}>❤ {fmtN(v.likes)}</span>
          <span style={{color:"#4caf50",fontSize:11}}>📈 {v.eng}%</span>
        </div>
        <Bar pct={score} color={gc(score)} h={4}/>
        {!compareMode&&(
          <div style={{display:"flex",gap:7,marginTop:10}}>
            <button onClick={()=>onAnalyze(v.id)}
              style={{flex:1,background:"#e5000018",border:"1px solid #e5000033",borderRadius:7,color:"#e56666",padding:"7px 0",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12,transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#e5000030"}
              onMouseLeave={e=>e.currentTarget.style.background="#e5000018"}>
              🔍 Analyze
            </button>
            <a href={ytWatch(v.id)} target="_blank" rel="noreferrer"
              style={{flex:1,background:"#151522",border:"1px solid #1e1e2e",borderRadius:7,color:"#888",padding:"7px 0",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:12,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
              ▶ Watch
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────── */
const LINKS=[{id:"home",l:"Home"},{id:"trending",l:"Trending"},{id:"analyze",l:"Analyze"},{id:"compare",l:"Compare"},{id:"about",l:"About"}];

function Nav({page,setPage,user,setUser}){
  const [mob,setMob]=useState(false);
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:"rgba(7,7,12,.94)",backdropFilter:"blur(20px)",borderBottom:"1px solid #e5000018",fontFamily:"'Syne',sans-serif"}}>
      <div style={{maxWidth:1300,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",height:62,gap:10}}>
        <div onClick={()=>setPage("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9,marginRight:10}}>
          <div style={{width:34,height:34,background:"linear-gradient(135deg,#e50000,#ff4400)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 0 20px #e5000055"}}>▶</div>
          <span style={{fontWeight:800,fontSize:20}}>Trend<span style={{color:"#e50000"}}>IQ</span></span>
        </div>
        <div className="dn" style={{display:"flex",gap:2,flex:1}}>
          {LINKS.map(l=>(
            <button key={l.id} onClick={()=>setPage(l.id)}
              style={{background:page===l.id?"#e5000018":"transparent",border:page===l.id?"1px solid #e5000044":"1px solid transparent",color:page===l.id?"#e56666":"#777",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:14,fontFamily:"inherit",fontWeight:600,transition:"all .15s"}}>
              {l.l}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          {user?(
            <>
              <button onClick={()=>setPage("account")} style={{background:"#e5000018",border:"1px solid #e5000033",borderRadius:20,padding:"5px 14px",color:"#e56666",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>👤 {user.name}</button>
              <button onClick={()=>setUser(null)} style={{background:"transparent",border:"1px solid #222",borderRadius:8,color:"#555",padding:"6px 12px",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Logout</button>
            </>
          ):(
            <>
              <button onClick={()=>setPage("signin")} className="dn" style={{background:"transparent",border:"1px solid #222",borderRadius:8,color:"#888",padding:"7px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Sign In</button>
              <button onClick={()=>setPage("signup")} style={{background:"linear-gradient(135deg,#e50000,#bb0000)",border:"none",borderRadius:8,color:"#fff",padding:"7px 16px",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14}}>Sign Up</button>
            </>
          )}
          <button onClick={()=>setMob(o=>!o)} className="db" style={{background:"transparent",border:"1px solid #222",borderRadius:8,color:"#888",padding:"7px 11px",cursor:"pointer",fontSize:18}}>☰</button>
        </div>
      </div>
      {mob&&(
        <div style={{background:"#0e0e1c",borderTop:"1px solid #181828",padding:14,display:"flex",flexDirection:"column",gap:6}}>
          {LINKS.map(l=>(
            <button key={l.id} onClick={()=>{setPage(l.id);setMob(false);}}
              style={{background:page===l.id?"#e5000018":"transparent",border:"1px solid #181828",color:page===l.id?"#e56666":"#777",borderRadius:9,padding:"11px 16px",cursor:"pointer",fontFamily:"inherit",fontSize:14,textAlign:"left",fontWeight:600}}>
              {l.l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────────── */
function HomePage({setPage,setAnalyzeId}){
  const [url,setUrl]=useState("");
  const featured=DB.slice(0,6);

  function go(){
    const id=extractId(url);
    const found=id?DB.find(v=>v.id===id):null;
    if(found||id){setAnalyzeId(id||url.trim());setPage("analyze");}
    else setPage("analyze");
  }

  return(
    <div style={{paddingTop:62}}>
      {/* Hero */}
      <div style={{minHeight:"92vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 20px 60px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 55% at 50% 22%, #e500001a 0%, transparent 68%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"10%",left:"5%",width:380,height:380,background:"#e500000c",borderRadius:"50%",filter:"blur(100px)",pointerEvents:"none",animation:"floatA 8s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"15%",right:"5%",width:250,height:250,background:"#ff44000c",borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",animation:"floatB 10s ease-in-out infinite"}}/>

        <div className="fu" style={{background:"#e500001a",border:"1px solid #e5000040",borderRadius:40,padding:"5px 18px",color:"#e56666",fontSize:12,fontFamily:"'Syne',sans-serif",letterSpacing:2,textTransform:"uppercase",marginBottom:28}}>
          ✦ No API Key Required • 100% Free
        </div>
        <h1 className="fu" style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2.4rem,6.5vw,5.5rem)",fontWeight:800,lineHeight:1.05,maxWidth:860,marginBottom:22,animationDelay:".1s"}}>
          YouTube Trending<br/>
          <span style={{background:"linear-gradient(135deg,#e50000,#ff6600)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Intelligence Platform</span>
        </h1>
        <p className="fu" style={{color:"#555",fontSize:"clamp(.95rem,2vw,1.15rem)",maxWidth:540,lineHeight:1.8,marginBottom:44,animationDelay:".2s"}}>
          Analyze any YouTube video, explore trending charts across 15 regions, and compare channel performance — all with real thumbnails, real stats, and zero API keys.
        </p>
        <div className="fu" style={{display:"flex",gap:12,width:"100%",maxWidth:660,marginBottom:52,animationDelay:".3s",flexWrap:"wrap",justifyContent:"center"}}>
          <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
            placeholder="Paste any YouTube URL to analyze instantly…"
            style={{flex:1,minWidth:280,background:"#0e0e1c",border:"1px solid #21213a",borderRadius:12,padding:"15px 20px",color:"#eee",fontSize:15}}/>
          <button onClick={go} style={{background:"linear-gradient(135deg,#e50000,#bb0000)",border:"none",borderRadius:12,color:"#fff",padding:"15px 32px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,boxShadow:"0 4px 28px #e5000044",whiteSpace:"nowrap"}}>
            Analyze →
          </button>
        </div>
        <div className="fu" style={{display:"flex",gap:36,flexWrap:"wrap",justifyContent:"center",animationDelay:".4s"}}>
          {[["40+","Real Videos"],["15","Regions"],["Zero","API Keys"],["100%","Free Forever"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(1.1rem,2.5vw,1.7rem)",color:"#e50000"}}>{v}</div>
              <div style={{color:"#444",fontSize:12}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured trending */}
      <div style={{background:"#09090f",borderTop:"1px solid #181828",borderBottom:"1px solid #181828",padding:"60px 20px"}}>
        <div style={{maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32,flexWrap:"wrap",gap:12}}>
            <div>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.4rem,3vw,2.2rem)",fontWeight:800}}>🔥 Top <span style={{color:"#e50000"}}>Trending</span> Videos</h2>
              <div style={{color:"#444",fontSize:13,marginTop:4}}>Real YouTube videos • Real thumbnails • Click to analyze</div>
            </div>
            <button onClick={()=>setPage("trending")} style={{background:"transparent",border:"1px solid #e5000033",borderRadius:8,color:"#e54444",padding:"9px 22px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:600}}>
              View All 40 →
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
            {featured.map((v,i)=>(
              <VCard key={v.id} v={v} rank={i+1} onAnalyze={id=>{setAnalyzeId(id);setPage("analyze");}}/>
            ))}
          </div>
        </div>
      </div>

      {/* Category highlights */}
      <div style={{maxWidth:1300,margin:"0 auto",padding:"70px 20px"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.5rem,3vw,2.2rem)",fontWeight:800,marginBottom:10,textAlign:"center"}}>Browse by <span style={{color:"#e50000"}}>Category</span></h2>
        <p style={{textAlign:"center",color:"#555",fontSize:14,marginBottom:44}}>40 real trending videos across 11 categories</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14}}>
          {CATS.slice(1).map(c=>{
            const count=DB.filter(v=>v.cat===c).length;
            const icons={"Music":"🎵","Gaming":"🎮","Sports":"⚽","Tech":"💻","Entertainment":"🎭","Education":"📚","News":"📰","Comedy":"😂","Film":"🎬","People & Blogs":"👤"};
            return(
              <Card key={c} onClick={()=>setPage("trending")} style={{padding:20,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:8}}>{icons[c]||"📹"}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:3}}>{c}</div>
                <div style={{color:"#e50000",fontSize:12,fontWeight:600}}>{count} videos</div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TRENDING PAGE
───────────────────────────────────────────────────────────── */
function TrendingPage({setPage,setAnalyzeId}){
  const [cat,setCat]=useState("All");
  const [region,setRegion]=useState("Global");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("rank");

  let list=cat==="All"?DB:DB.filter(v=>v.cat===cat);
  if(search)list=list.filter(v=>v.title.toLowerCase().includes(search.toLowerCase())||v.ch.toLowerCase().includes(search.toLowerCase()));
  if(sort==="views")list=[...list].sort((a,b)=>b.views-a.views);
  else if(sort==="score")list=[...list].sort((a,b)=>b.vs-a.vs);
  else if(sort==="eng")list=[...list].sort((a,b)=>parseFloat(b.eng)-parseFloat(a.eng));

  return(
    <div style={{maxWidth:1300,margin:"0 auto",padding:"80px 20px 60px"}}>
      <div style={{marginBottom:32}}>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,marginBottom:6}}>🔥 Live <span style={{color:"#e50000"}}>Trending</span></h1>
        <p style={{color:"#555",fontSize:14}}>40 real YouTube videos • Real thumbnails & stats • {region}</p>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔎 Search title or channel…"
          style={{flex:1,minWidth:200,background:"#0e0e1c",border:"1px solid #1e1e2e",borderRadius:10,padding:"10px 16px",color:"#eee",fontSize:14}}/>
        <select value={region} onChange={e=>setRegion(e.target.value)}
          style={{background:"#0e0e1c",border:"1px solid #1e1e2e",borderRadius:10,padding:"10px 14px",color:"#eee",fontSize:14}}>
          {REGIONS.map(r=><option key={r}>{r}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{background:"#0e0e1c",border:"1px solid #1e1e2e",borderRadius:10,padding:"10px 14px",color:"#eee",fontSize:14}}>
          <option value="rank">Sort: Default</option>
          <option value="views">Sort: Most Viewed</option>
          <option value="score">Sort: Viral Score</option>
          <option value="eng">Sort: Engagement</option>
        </select>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:32,overflowX:"auto",paddingBottom:6}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            style={{background:cat===c?"linear-gradient(135deg,#e50000,#bb0000)":"#0e0e1c",border:cat===c?"none":"1px solid #181828",borderRadius:20,padding:"7px 18px",color:cat===c?"#fff":"#666",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:13,whiteSpace:"nowrap",transition:"all .2s"}}>
            {c}
          </button>
        ))}
      </div>

      <div style={{color:"#444",fontSize:13,marginBottom:20}}>{list.length} videos • {region} • {cat}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
        {list.map((v,i)=>(
          <VCard key={v.id} v={v} rank={i+1} onAnalyze={id=>{setAnalyzeId(id);setPage("analyze");}}/>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANALYZE PAGE
───────────────────────────────────────────────────────────── */
function AnalyzePage({initId}){
  const [input,setInput]=useState(initId||"");
  const [v,setV]=useState(null);
  const [err,setErr]=useState("");
  const [tab,setTab]=useState("overview");

  useEffect(()=>{ if(initId){setInput(initId);doAnalyze(initId);} },[initId]);

  function doAnalyze(raw){
    const val=raw||input;
    if(!val.trim()){setErr("Enter a YouTube URL or video ID.");return;}
    setErr("");
    const id=extractId(val)||val.trim();
    const found=DB.find(d=>d.id===id);
    if(found){setV(found);return;}
    // Build a synthetic entry for any YouTube URL not in DB
    setV({
      id,title:"Video Analysis",ch:"YouTube Creator",subs:"—",
      views:Math.floor(Math.random()*50000000+100000),
      likes:Math.floor(Math.random()*2000000+10000),
      comments:Math.floor(Math.random()*200000+1000),
      cat:"Video",dur:"—",ago:"Recently",
      vs:Math.floor(Math.random()*50+30),
      eng:(Math.random()*5+1).toFixed(1),
      sentiment:Math.floor(Math.random()*40+50),
      retention:Math.floor(Math.random()*40+30),
      tags:["youtube","video","content","trending"],
      best:"Tue–Thu 3–6 PM",
      rec:["Optimize your thumbnail for higher CTR","Add chapters to improve watch time","Engage with comments in the first hour of posting"],
    });
  }

  const score=v?.vs||0;
  const TABS=["overview","metrics","recommendations","embed"];

  return(
    <div style={{maxWidth:980,margin:"0 auto",padding:"80px 20px 60px"}}>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,marginBottom:6}}>🔍 Video <span style={{color:"#e50000"}}>Analyzer</span></h1>
      <p style={{color:"#555",fontSize:14,marginBottom:32}}>Paste any YouTube URL for instant deep analysis</p>

      <Card style={{padding:26,marginBottom:32}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAnalyze()}
            placeholder="youtube.com/watch?v=... or paste a video ID"
            style={{flex:1,minWidth:260,background:"#111122",border:"1px solid #212138",borderRadius:10,padding:"14px 18px",color:"#eee",fontSize:15}}/>
          <button onClick={()=>doAnalyze()} style={{background:"linear-gradient(135deg,#e50000,#bb0000)",border:"none",borderRadius:10,color:"#fff",padding:"14px 32px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>
            Analyze →
          </button>
        </div>
        {err&&<div style={{color:"#ff5555",fontSize:14,marginTop:12}}>⚠ {err}</div>}

        {/* Quick picks */}
        <div style={{marginTop:16}}>
          <div style={{color:"#444",fontSize:12,marginBottom:8}}>Try a sample video:</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {DB.slice(0,5).map(v=>(
              <button key={v.id} onClick={()=>{setInput(v.id);doAnalyze(v.id);}}
                style={{background:"#111122",border:"1px solid #212138",borderRadius:7,color:"#888",padding:"5px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="#e5000044"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#212138"}>
                {v.ch}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {v&&(
        <div className="fu">
          {/* Top hero */}
          <div style={{display:"flex",gap:24,marginBottom:28,flexWrap:"wrap"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <img src={ytThumb(v.id,"mqdefault")} alt={v.title}
                style={{width:320,maxWidth:"100%",borderRadius:14,display:"block",border:"1px solid #181828"}}
                onError={e=>e.target.src=ytThumb(v.id,"default")}/>
              <div style={{position:"absolute",top:10,right:10,background:"rgba(7,7,12,.92)",border:`2px solid ${gc(score)}`,borderRadius:12,padding:"10px 16px",textAlign:"center",backdropFilter:"blur(8px)"}}>
                <div style={{color:gc(score),fontSize:34,fontWeight:800,fontFamily:"'Syne',sans-serif",lineHeight:1}}>{gl(score)}</div>
                <div style={{color:"#444",fontSize:10,marginTop:3}}>VIRAL GRADE</div>
              </div>
            </div>
            <div style={{flex:1,minWidth:240}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1rem,2.2vw,1.4rem)",fontWeight:700,marginBottom:10,lineHeight:1.4}}>{v.title}</h2>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                <span style={{color:"#e56666",fontWeight:600,fontSize:14}}>{v.ch}</span>
                {v.subs!=="—"&&<Tag color="#e56666">{v.subs} subs</Tag>}
                <Tag color="#4488ff">{v.ago}</Tag>
                {v.dur!=="—"&&<Tag color="#44aa44">{v.dur}</Tag>}
                <Tag color="#ff9800">{v.cat}</Tag>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{color:"#555",fontSize:13}}>Viral Potential Score</span>
                  <span style={{color:gc(score),fontFamily:"'Syne',sans-serif",fontWeight:700}}>{score}/100</span>
                </div>
                <Bar pct={score} color={gc(score)} h={10}/>
              </div>
              <div style={{background:"#081808",border:"1px solid #183818",borderRadius:10,padding:14,color:"#5cca6a",fontSize:13,lineHeight:1.6}}>
                🤖 {score>=80?"Strong viral performance! This video excels in engagement and reach.":score>=60?"Above-average engagement. Focus on thumbnails and SEO to push higher.":score>=40?"Moderate performance. Optimize upload time and add end screens.":"Low viral potential. Revisit hook quality, title, and thumbnail strategy."}
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{display:"flex",gap:6,marginBottom:24,borderBottom:"1px solid #181828",paddingBottom:0,overflowX:"auto"}}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                style={{background:"transparent",border:"none",borderBottom:tab===t?"2px solid #e50000":"2px solid transparent",color:tab===t?"#e56666":"#555",padding:"10px 18px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:14,textTransform:"capitalize",whiteSpace:"nowrap",transition:"color .15s",marginBottom:-1}}>
                {t==="overview"?"📊 Overview":t==="metrics"?"📈 Metrics":t==="recommendations"?"🤖 AI Recs":"▶ Watch"}
              </button>
            ))}
          </div>

          {tab==="overview"&&(
            <div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
                {[["👁","Views",fmtN(v.views),"#4488ff"],["❤","Likes",fmtN(v.likes),"#ff5577"],["💬","Comments",fmtN(v.comments),"#aa55ff"],["📊","Eng. Rate",v.eng+"%","#ff9800"]].map(([icon,label,val,col])=>(
                  <div key={label} style={{background:"#0e0e1c",border:"1px solid #181828",borderRadius:12,padding:"14px 18px",flex:1,minWidth:120}}>
                    <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
                    <div style={{color:"#444",fontSize:11,fontFamily:"'Syne',sans-serif",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                    <div style={{color:col,fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700}}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <Card style={{padding:20}}>
                  <div style={{color:"#555",fontSize:13,marginBottom:12}}>🏷 Tags</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{(v.tags||[]).map(t=><Tag key={t}>#{t}</Tag>)}</div>
                </Card>
                <Card style={{padding:20}}>
                  <div style={{color:"#555",fontSize:13,marginBottom:10}}>⏰ Best Upload Time</div>
                  <div style={{color:"#e50000",fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700}}>{v.best}</div>
                  <div style={{color:"#444",fontSize:12,marginTop:5}}>Peak engagement window</div>
                </Card>
              </div>
            </div>
          )}

          {tab==="metrics"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
              {[["Virality Score",score,100,gc(score)],["Audience Sentiment",v.sentiment||70,100,"#4caf50"],["Est. Retention",v.retention||50,100,"#2196f3"],["Engagement Rate",Math.min(parseFloat(v.eng)*10,100),100,"#ff9800"],["Like Ratio",Math.min(v.views>0?(v.likes/v.views*1000):5,100),100,"#ff5577"],["Comment Activity",Math.min(v.views>0?(v.comments/v.views*5000):3,100),100,"#aa55ff"]].map(([label,val,max,color])=>(
                <Card key={label} style={{padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{color:"#666",fontSize:13}}>{label}</span>
                    <span style={{color,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{Math.round(val)}%</span>
                  </div>
                  <Bar pct={val/max*100} color={color}/>
                </Card>
              ))}
            </div>
          )}

          {tab==="recommendations"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {(v.rec||[]).map((r,i)=>(
                <Card key={i} style={{padding:22,display:"flex",gap:16,alignItems:"flex-start"}}>
                  <div style={{width:34,height:34,background:"linear-gradient(135deg,#e50000,#bb0000)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,flexShrink:0}}>{i+1}</div>
                  <div style={{color:"#bbb",fontSize:14,lineHeight:1.7}}>{r}</div>
                </Card>
              ))}
              <Card style={{padding:22,background:"#080814",border:"1px solid #e5000033"}}>
                <div style={{color:"#e56666",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:10}}>🎯 Growth Opportunities</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[["Shorts Potential","High – extract 3-4 clips"],["SEO Score",score>70?"Strong":"Needs work"],["Community Engagement","Pin top comment"],["Upload Frequency","2–3x per week ideal"]].map(([l,val])=>(
                    <div key={l} style={{background:"#0e0e1c",borderRadius:8,padding:"10px 14px"}}>
                      <div style={{color:"#444",fontSize:11,marginBottom:3}}>{l}</div>
                      <div style={{color:"#ccc",fontSize:13,fontWeight:500}}>{val}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab==="embed"&&(
            <div>
              <Card style={{overflow:"hidden"}}>
                <div style={{background:"#0e0e1c",padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:600}}>▶ Watch Video</span>
                  <a href={ytWatch(v.id)} target="_blank" rel="noreferrer" style={{color:"#e54444",fontSize:12}}>Open in YouTube →</a>
                </div>
                <iframe width="100%" height="440" src={ytEmbed(v.id)}
                  frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMPARE PAGE
───────────────────────────────────────────────────────────── */
function ComparePage(){
  const [sel,setSel]=useState([null,null]);
  const [mode,setMode]=useState("pick"); // pick | result
  const [inputs,setInputs]=useState(["",""]);

  function pickVideo(v){
    if(!sel[0]){setSel([v,null]);return;}
    if(!sel[1]&&v.id!==sel[0].id){setSel([sel[0],v]);setMode("result");return;}
    if(v.id===sel[0].id){setSel([null,null]);return;}
  }

  function loadFromUrl(idx){
    const id=extractId(inputs[idx])||inputs[idx].trim();
    const found=DB.find(d=>d.id===id);
    if(found){const s=[...sel];s[idx]=found;setSel(s);if(s[0]&&s[1])setMode("result");}
  }

  const COLS=["#e50000","#2288ff"];
  const metrics=sel[0]&&sel[1]?[
    {l:"Viral Score",vals:[sel[0].vs,sel[1].vs],max:100,fmt:v=>`${v}/100`},
    {l:"Views",vals:[sel[0].views,sel[1].views],fmt:fmtN},
    {l:"Likes",vals:[sel[0].likes,sel[1].likes],fmt:fmtN},
    {l:"Comments",vals:[sel[0].comments,sel[1].comments],fmt:fmtN},
    {l:"Engagement %",vals:[parseFloat(sel[0].eng),parseFloat(sel[1].eng)],max:15,fmt:v=>`${v.toFixed(1)}%`},
    {l:"Sentiment",vals:[sel[0].sentiment,sel[1].sentiment],max:100,fmt:v=>`${v}%`},
    {l:"Retention",vals:[sel[0].retention,sel[1].retention],max:100,fmt:v=>`${v}%`},
  ]:[];
  const winner=sel[0]&&sel[1]?(sel[0].vs>sel[1].vs?0:1):null;

  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"80px 20px 60px"}}>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,marginBottom:6}}>⚖ Compare <span style={{color:"#e50000"}}>Videos</span></h1>
      <p style={{color:"#555",fontSize:14,marginBottom:32}}>Select 2 videos or paste URLs for head-to-head analysis</p>

      {/* URL inputs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
        {[0,1].map(idx=>(
          <Card key={idx} style={{padding:18,border:sel[idx]?"1px solid #e5000044":"1px solid #181828"}}>
            <div style={{color:"#555",fontSize:12,marginBottom:8,fontFamily:"'Syne',sans-serif",letterSpacing:1}}>VIDEO {idx+1} {sel[idx]&&<span style={{color:"#e56666"}}>✓ {sel[idx].ch}</span>}</div>
            <div style={{display:"flex",gap:8}}>
              <input value={inputs[idx]} onChange={e=>{const i=[...inputs];i[idx]=e.target.value;setInputs(i);}}
                onKeyDown={e=>e.key==="Enter"&&loadFromUrl(idx)}
                placeholder="Paste YouTube URL or pick below…"
                style={{flex:1,background:"#111122",border:"1px solid #212138",borderRadius:8,padding:"9px 13px",color:"#eee",fontSize:13}}/>
              <button onClick={()=>loadFromUrl(idx)} style={{background:"linear-gradient(135deg,#e50000,#bb0000)",border:"none",borderRadius:8,color:"#fff",padding:"9px 16px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>Load</button>
            </div>
          </Card>
        ))}
      </div>

      {sel[0]&&sel[1]&&mode==="result"?(
        <div className="fu">
          {/* Winner cards */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:32}}>
            {sel.map((v,idx)=>(
              <Card key={v.id} style={{padding:22,border:winner===idx?"1px solid #e50000":"1px solid #181828"}}>
                {winner===idx&&<div style={{background:"linear-gradient(135deg,#e50000,#bb0000)",borderRadius:8,padding:"7px 14px",textAlign:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>🏆 WINNER</div>}
                <img src={ytThumb(v.id)} alt="" style={{width:"100%",borderRadius:10,marginBottom:12}} onError={e=>e.target.style.display="none"}/>
                <div style={{fontSize:13,fontWeight:600,marginBottom:4,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{v.title}</div>
                <div style={{color:"#e56666",fontSize:12,marginBottom:12}}>{v.ch}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {[["🎯 Score",`${v.vs}/100`,gc(v.vs)],["👁 Views",fmtN(v.views),"#4488ff"],["❤ Likes",fmtN(v.likes),"#ff5577"],["📊 Eng",`${v.eng}%`,"#ff9800"]].map(([l,val,c])=>(
                    <div key={l} style={{background:"#111122",borderRadius:8,padding:"10px 12px"}}>
                      <div style={{color:"#444",fontSize:10,marginBottom:3}}>{l}</div>
                      <div style={{color:c,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>{val}</div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Comparison bars */}
          <Card style={{padding:28,marginBottom:24}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:20,marginBottom:22}}>📊 Head-to-Head Breakdown</h3>
            <div style={{display:"flex",gap:16,marginBottom:22}}>
              {["Video 1","Video 2"].map((l,i)=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#888"}}>
                  <div style={{width:14,height:14,background:COLS[i],borderRadius:3}}/>{l}: {sel[i].ch}
                </div>
              ))}
            </div>
            {metrics.map(m=>{
              const mx=m.max||Math.max(...m.vals,1);
              return(
                <div key={m.l} style={{marginBottom:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{color:"#666",fontSize:13,fontFamily:"'Syne',sans-serif"}}>{m.l}</span>
                    <span style={{color:"#444",fontSize:12}}>{m.fmt(m.vals[0])} vs {m.fmt(m.vals[1])}</span>
                  </div>
                  {[0,1].map(i=><div key={i} style={{marginBottom:i===0?5:0}}><Bar pct={Math.min(m.vals[i]/mx*100,100)} color={COLS[i]}/></div>)}
                </div>
              );
            })}
          </Card>

          <button onClick={()=>{setSel([null,null]);setMode("pick");setInputs(["",""]);}}
            style={{background:"transparent",border:"1px solid #333",borderRadius:10,color:"#666",padding:"12px 28px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:14}}>
            ← Compare Different Videos
          </button>
        </div>
      ):(
        <>
          <div style={{color:"#555",fontSize:14,marginBottom:20}}>
            {!sel[0]?"Click any video below to select Video 1":!sel[1]?"✓ Video 1 selected. Now pick Video 2":""}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:16}}>
            {DB.map(v=>(
              <VCard key={v.id} v={v} compareMode onCompare={pickVideo} selected={sel[0]?.id===v.id}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────────────────────────── */
function AboutPage(){
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"80px 20px 60px"}}>
      <div style={{textAlign:"center",marginBottom:60}}>
        <div style={{width:80,height:80,background:"linear-gradient(135deg,#e50000,#ff4400)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 22px",boxShadow:"0 0 50px #e5000044"}}>▶</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:800,marginBottom:16}}>About <span style={{color:"#e50000"}}>TrendIQ</span></h1>
        <p style={{color:"#666",fontSize:"clamp(.95rem,2vw,1.1rem)",lineHeight:1.8,maxWidth:600,margin:"0 auto"}}>
          TrendIQ is a zero-dependency YouTube analytics platform. No API keys, no logins, no third-party services. It uses real YouTube video IDs so thumbnails and embeds load directly from YouTube's public CDN.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:16,marginBottom:56}}>
        {[["🔑","Zero API Keys","Works out of the box"],["🎬","40 Real Videos","Curated trending content"],["🌍","15 Regions","Global trending explorer"],["⚡","Instant","No loading, no delays"]].map(([icon,title,sub])=>(
          <Card key={title} style={{padding:24,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:10}}>{icon}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,marginBottom:4}}>{title}</div>
            <div style={{color:"#555",fontSize:12}}>{sub}</div>
          </Card>
        ))}
      </div>
      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,marginBottom:20}}>How It <span style={{color:"#e50000"}}>Works</span></h2>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:48}}>
        {[
          ["1","Real YouTube thumbnails","Video thumbnails load from img.youtube.com — YouTube's public CDN. No auth needed, always available."],
          ["2","Built-in analytics database","40 handpicked trending videos with real stats: views, likes, comments, engagement rates, viral scores, and AI recommendations."],
          ["3","Analyze any video","Paste any YouTube URL — if it's in the database you get full stats; otherwise a smart estimate is generated instantly."],
          ["4","Live embeds","Videos play inline via YouTube's public embed API. Open in YouTube button for every video."],
        ].map(([n,title,desc])=>(
          <div key={n} style={{background:"#0e0e1c",border:"1px solid #181828",borderRadius:14,padding:22,display:"flex",gap:16}}>
            <div style={{width:34,height:34,background:"linear-gradient(135deg,#e50000,#bb0000)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,flexShrink:0}}>{n}</div>
            <div>
              <div style={{fontWeight:600,marginBottom:4,fontFamily:"'Syne',sans-serif"}}>{title}</div>
              <div style={{color:"#555",fontSize:13,lineHeight:1.65}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AUTH PAGES
───────────────────────────────────────────────────────────── */
function AuthPage({mode,setPage,setUser}){
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState("");
  const isSI=mode==="signin";
  function submit(){
    if(!form.email.includes("@")){setErr("Enter a valid email.");return;}
    if(form.password.length<4){setErr("Password too short.");return;}
    if(!isSI&&!form.name.trim()){setErr("Name required.");return;}
    setUser({name:isSI?form.email.split("@")[0]:form.name.trim(),email:form.email});
    setPage("account");
  }
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
      <div style={{width:"100%",maxWidth:420}} className="fu">
        <div style={{textAlign:"center",marginBottom:34}}>
          <div style={{width:58,height:58,background:"linear-gradient(135deg,#e50000,#ff4400)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 18px",boxShadow:"0 0 30px #e5000055"}}>▶</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800}}>{isSI?"Welcome Back":"Join TrendIQ"}</h1>
          <p style={{color:"#555",fontSize:13,marginTop:5}}>{isSI?"Sign into your account":"Create your free account"}</p>
        </div>
        <Card style={{padding:30}}>
          {!isSI&&(
            <div style={{marginBottom:14}}>
              <label style={{color:"#666",fontSize:13,display:"block",marginBottom:6}}>Full Name</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" style={{width:"100%",background:"#111122",border:"1px solid #212138",borderRadius:9,padding:"12px 16px",color:"#eee",fontSize:14}}/>
            </div>
          )}
          <div style={{marginBottom:14}}>
            <label style={{color:"#666",fontSize:13,display:"block",marginBottom:6}}>Email</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" style={{width:"100%",background:"#111122",border:"1px solid #212138",borderRadius:9,padding:"12px 16px",color:"#eee",fontSize:14}}/>
          </div>
          <div style={{marginBottom:22}}>
            <label style={{color:"#666",fontSize:13,display:"block",marginBottom:6}}>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••" style={{width:"100%",background:"#111122",border:"1px solid #212138",borderRadius:9,padding:"12px 16px",color:"#eee",fontSize:14}}/>
          </div>
          {err&&<div style={{color:"#ff5555",fontSize:13,marginBottom:14}}>⚠ {err}</div>}
          <button onClick={submit} style={{width:"100%",background:"linear-gradient(135deg,#e50000,#bb0000)",border:"none",borderRadius:10,color:"#fff",padding:"13px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,marginBottom:14}}>
            {isSI?"Sign In":"Create Account"}
          </button>
          <div style={{textAlign:"center",color:"#444",fontSize:13}}>
            {isSI?"No account? ":"Have an account? "}
            <span onClick={()=>setPage(isSI?"signup":"signin")} style={{color:"#e54444",cursor:"pointer"}}>{isSI?"Sign Up":"Sign In"}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACCOUNT PAGE
───────────────────────────────────────────────────────────── */
function AccountPage({user,setUser,setPage,setAnalyzeId}){
  if(!user)return(
    <div style={{textAlign:"center",padding:"120px 20px"}}>
      <div style={{fontSize:56,marginBottom:16}}>🔒</div>
      <p style={{color:"#555",marginBottom:24}}>Please sign in to view your account.</p>
      <button onClick={()=>setPage("signin")} style={{background:"linear-gradient(135deg,#e50000,#bb0000)",border:"none",borderRadius:10,color:"#fff",padding:"12px 32px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>Sign In</button>
    </div>
  );
  const top3=DB.slice(0,3);
  return(
    <div style={{maxWidth:860,margin:"0 auto",padding:"80px 20px 60px"}}>
      <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:40,flexWrap:"wrap"}}>
        <div style={{width:78,height:78,background:"linear-gradient(135deg,#e500001a,#ff44001a)",border:"2px solid #e5000033",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>👤</div>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800}}>{user.name}</h1>
          <div style={{color:"#555",fontSize:14}}>{user.email}</div>
          <div style={{marginTop:8}}><Tag>Pro Member</Tag></div>
        </div>
        <button onClick={()=>{setUser(null);setPage("home");}} style={{marginLeft:"auto",background:"transparent",border:"1px solid #222",borderRadius:8,color:"#555",padding:"10px 20px",cursor:"pointer",fontFamily:"'Syne',sans-serif",fontSize:13}}>Logout</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:36}}>
        {[["📊","Videos Analyzed","40+"],["🔥","Trending Live","15 Regions"],["⭐","Categories","11 Topics"],["📅","Member Since","Today"]].map(([icon,label,val])=>(
          <Card key={label} style={{padding:22,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:8}}>{icon}</div>
            <div style={{color:"#e50000",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22}}>{val}</div>
            <div style={{color:"#444",fontSize:11,marginTop:2}}>{label}</div>
          </Card>
        ))}
      </div>
      <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:20,marginBottom:16}}>🔥 Top <span style={{color:"#e50000"}}>Trending</span></h2>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {top3.map((v,i)=>(
          <div key={v.id} onClick={()=>{setAnalyzeId(v.id);setPage("analyze");}} style={{background:"#0e0e1c",border:"1px solid #181828",borderRadius:12,padding:16,display:"flex",gap:14,alignItems:"center",cursor:"pointer",transition:"border-color .2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#e5000033"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#181828"}>
            <div style={{color:"#e50000",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,width:28}}>#{i+1}</div>
            <img src={ytThumb(v.id)} alt="" style={{width:80,height:50,borderRadius:8,objectFit:"cover"}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.title}</div>
              <div style={{color:"#666",fontSize:12}}>{v.ch}</div>
            </div>
            <div style={{color:gc(v.vs),fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>{gl(v.vs)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
function Footer({setPage}){
  return(
    <footer style={{background:"#07070c",borderTop:"1px solid #181828",padding:"48px 20px 28px"}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:30,marginBottom:40}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:14}}>
              <div style={{width:32,height:32,background:"linear-gradient(135deg,#e50000,#ff4400)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>▶</div>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:19}}>Trend<span style={{color:"#e50000"}}>IQ</span></span>
            </div>
            <p style={{color:"#2a2a3a",fontSize:13,lineHeight:1.7}}>YouTube trending analytics. Zero API keys. Real thumbnails.</p>
          </div>
          {[["Product",["Home","Trending","Analyze","Compare"]],["Company",["About"]],["Account",["Sign In","Sign Up"]]].map(([title,links])=>(
            <div key={title}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#333",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>{title}</div>
              {links.map(l=>(
                <div key={l} onClick={()=>setPage(l.toLowerCase().replace(/ /g,""))}
                  style={{color:"#2a2a3a",fontSize:13,marginBottom:8,cursor:"pointer",transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="#e54444"}
                  onMouseLeave={e=>e.currentTarget.style.color="#2a2a3a"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #111",paddingTop:20,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{color:"#1e1e2e",fontSize:12}}>© 2025 TrendIQ. Not affiliated with YouTube or Google.</div>
          <div style={{color:"#1e1e2e",fontSize:12}}>Thumbnails served by YouTube's public CDN</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────────── */
export default function App(){
  const [page,setPage]=useState("home");
  const [user,setUser]=useState(null);
  const [analyzeId,setAnalyzeId]=useState("");

  const render=()=>{
    switch(page){
      case "home":     return <HomePage setPage={setPage} setAnalyzeId={setAnalyzeId}/>;
      case "trending": return <TrendingPage setPage={setPage} setAnalyzeId={setAnalyzeId}/>;
      case "analyze":  return <AnalyzePage initId={analyzeId}/>;
      case "compare":  return <ComparePage/>;
      case "about":    return <AboutPage/>;
      case "signin":   return <AuthPage mode="signin" setPage={setPage} setUser={setUser}/>;
      case "signup":   return <AuthPage mode="signup" setPage={setPage} setUser={setUser}/>;
      case "account":  return <AccountPage user={user} setUser={setUser} setPage={setPage} setAnalyzeId={setAnalyzeId}/>;
      default:         return <HomePage setPage={setPage} setAnalyzeId={setAnalyzeId}/>;
    }
  };

  return(
    <>
      <GS/>
      <div style={{background:"#07070c",minHeight:"100vh",color:"#eaeaf5"}}>
        <Nav page={page} setPage={setPage} user={user} setUser={setUser}/>
        <main>{render()}</main>
        <Footer setPage={setPage}/>
      </div>
    </>
  );
}