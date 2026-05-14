import { useState, useEffect, useRef, useMemo } from "react";
import {
  Dumbbell, BarChart2, Calendar, Home, Plus, Trash2,
  ChevronLeft, Check, TrendingUp, Flame, Award, X, Edit2,
  Play, Pause, RotateCcw, ArrowUp, Scale, ChevronDown, ChevronUp,
  Zap, Activity, FileText, Droplets, RefreshCw, Quote, Download,
  Shuffle, Trophy, Moon, Palette, AlarmClock, Target, ArrowRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES = {
  orange: { name:"Orange", accent:"#f97316", accentDim:"#7c2d12", accentMuted:"rgba(249,115,22,0.15)", accentText:"text-orange-500", bg:"bg-gray-950", card:"bg-gray-900", border:"border-gray-800", nav:"bg-gray-900" },
  blue:   { name:"Blue",   accent:"#3b82f6", accentDim:"#1e3a5f", accentMuted:"rgba(59,130,246,0.15)", accentText:"text-blue-500",   bg:"bg-gray-950", card:"bg-gray-900", border:"border-gray-800", nav:"bg-gray-900" },
  green:  { name:"Green",  accent:"#22c55e", accentDim:"#14532d", accentMuted:"rgba(34,197,94,0.15)",  accentText:"text-green-500",  bg:"bg-gray-950", card:"bg-gray-900", border:"border-gray-800", nav:"bg-gray-900" },
  purple: { name:"Purple", accent:"#a855f7", accentDim:"#581c87", accentMuted:"rgba(168,85,247,0.15)", accentText:"text-purple-500", bg:"bg-gray-950", card:"bg-gray-900", border:"border-gray-800", nav:"bg-gray-900" },
  red:    { name:"Red",    accent:"#ef4444", accentDim:"#7f1d1d", accentMuted:"rgba(239,68,68,0.15)",  accentText:"text-red-500",    bg:"bg-gray-950", card:"bg-gray-900", border:"border-gray-800", nav:"bg-gray-900" },
  slate:  { name:"Slate",  accent:"#94a3b8", accentDim:"#1e293b", accentMuted:"rgba(148,163,184,0.15)",accentText:"text-slate-400",  bg:"bg-slate-950",card:"bg-slate-900",border:"border-slate-800",nav:"bg-slate-900" },
  midnight:{ name:"Midnight",accent:"#818cf8",accentDim:"#312e81",accentMuted:"rgba(129,140,248,0.15)",accentText:"text-indigo-400", bg:"bg-[#0a0a1a]", card:"bg-[#111128]", border:"border-indigo-950", nav:"bg-[#111128]" },
};

// ─── Quotes ───────────────────────────────────────────────────────────────────
const QUOTES = [
  {text:"The pain you feel today will be the strength you feel tomorrow.",author:"Arnold Schwarzenegger"},
  {text:"If something stands between you and your success, move it. Never be denied.",author:"Dwayne Johnson"},
  {text:"The last three or four reps is what makes the muscle grow.",author:"Arnold Schwarzenegger"},
  {text:"You have to think it before you can do it. The mind is what makes it all possible.",author:"Kai Greene"},
  {text:"All progress takes place outside the comfort zone.",author:"Michael John Bobak"},
  {text:"No man has the right to be an amateur in the matter of physical training.",author:"Socrates"},
  {text:"To keep winning, I have to keep improving.",author:"Ronnie Coleman"},
  {text:"Strength does not come from physical capacity. It comes from an indomitable will.",author:"Mahatma Gandhi"},
  {text:"Take care of your body. It's the only place you have to live.",author:"Jim Rohn"},
  {text:"Once the mind says it can't be done, the body won't do it.",author:"David Goggins"},
  {text:"You don't find willpower. You create it.",author:"David Goggins"},
  {text:"Your body can stand almost anything. It's your mind that you have to convince.",author:"Andrew Murphy"},
  {text:"Don't stop when you're tired. Stop when you're done.",author:"David Goggins"},
  {text:"We are what we repeatedly do. Excellence, then, is not an act, but a habit.",author:"Aristotle"},
  {text:"If it doesn't challenge you, it doesn't change you.",author:"Fred DeVito"},
  {text:"I don't count my sit-ups. I only start counting when it starts hurting.",author:"Muhammad Ali"},
  {text:"The body achieves what the mind believes.",author:"Napoleon Hill"},
  {text:"A year from now you'll wish you had started today.",author:"Karen Lamb"},
  {text:"Either you run the day, or the day runs you.",author:"Jim Rohn"},
  {text:"Success usually comes to those who are too busy to be looking for it.",author:"Henry David Thoreau"},
  {text:"Tough times never last, but tough people do.",author:"Robert H. Schuller"},
  {text:"The difference between try and triumph is just a little umph.",author:"Marvin Phillips"},
  {text:"You must expect great things of yourself before you can do them.",author:"Michael Jordan"},
  {text:"The only way to define your limits is by going beyond them.",author:"Arthur Clarke"},
  {text:"Champions aren't made in gyms. Champions are made from something deep inside.",author:"Muhammad Ali"},
];

// ─── Exercise alternatives map ────────────────────────────────────────────────
const ALTERNATIVES = {
  "Bench Press":["Push-Ups","Dumbbell Press","Cable Fly","Chest Dips"],
  "Squat":["Leg Press","Bulgarian Split Squat","Goblet Squat","Hack Squat"],
  "Deadlift":["Romanian Deadlift","Trap Bar Deadlift","Good Mornings","Back Extensions"],
  "Overhead Press":["Dumbbell Shoulder Press","Arnold Press","Landmine Press","Machine Press"],
  "Barbell Row":["Dumbbell Row","Cable Row","T-Bar Row","Chest-Supported Row"],
  "Pull-Ups":["Lat Pulldown","Assisted Pull-Ups","Cable Pullover","Negative Pull-Ups"],
  "Barbell Curl":["Dumbbell Curl","Hammer Curl","Cable Curl","Preacher Curl"],
  "Tricep Pushdown":["Overhead Tricep Extension","Skull Crushers","Diamond Push-Ups","Cable Kickback"],
  "Leg Press":["Squat","Hack Squat","Bulgarian Split Squat","Step-Ups"],
  "Romanian Deadlift":["Leg Curl","Good Mornings","Stiff-Leg Deadlift","Hip Thrust"],
};
const getAlternatives = (name) => ALTERNATIVES[name] || ["Dumbbell variation","Machine variation","Bodyweight variation"];

// ─── Epley 1RM ────────────────────────────────────────────────────────────────
const epley1RM = (w, r) => r === 1 ? w : Math.round(w * (1 + r / 30));

// ─── Streak milestones ────────────────────────────────────────────────────────
const MILESTONES = [1,2,4,8,12,16,24,52];
const getMilestone = (streak) => MILESTONES.find(m => m === streak);

// ─── Storage ──────────────────────────────────────────────────────────────────
const KEYS = { workouts:"ft_workouts", bodyweight:"ft_bodyweight", plans:"ft_plans", schedule:"ft_schedule", notes:"ft_notes", water:"ft_water", theme:"ft_theme" };
async function load(key) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function save(key, val) { try { await window.storage.set(key, JSON.stringify(val)); } catch {} }

// ─── Misc helpers ─────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0,10);
const dayName = (d) => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d];
const weekStart = () => { const d = new Date(); d.setDate(d.getDate()-d.getDay()); return d.toISOString().slice(0,10); };
const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(Math.round(n));
const uid = () => Math.random().toString(36).slice(2,10);
const fmtTime = (ts) => new Date(ts).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});

const MUSCLE_GROUPS = ["Chest","Back","Shoulders","Biceps","Triceps","Legs","Glutes","Core","Full Body","Cardio"];
const PLAN_COLORS = ["#f97316","#3b82f6","#22c55e","#a855f7","#ef4444","#eab308","#06b6d4","#ec4899"];
const WATER_GOAL = 8;

// Muscle body map positions (SVG)
// Updated SVG positions for more detailed map looks
const MUSCLE_POSITIONS = {
  Chest:     {x:96,  y:72,  r:16}, 
  Back:      {x:96,  y:82,  r:16},
  Shoulders: {x:62,  y:62,  r:11}, 
  Biceps:    {x:54,  y:82,  r:9},
  Triceps:   {x:138, y:82,  r:9},  
  Legs:      {x:96,  y:140, r:18},
  Glutes:    {x:96,  y:112, r:12}, 
  Core:      {x:96,  y:96,  r:11},
  "Full Body":{x:96, y:50,  r:10}, 
  Cardio:    {x:96,  y:30,  r:8},
};

// New Ranking System (Hard to achieve Diamond)
const RANKS = [
  { name: "Unranked", min: 0,    color: "#4b5563" }, 
  { name: "Bronze",   min: 60,   color: "#cd7f32" }, // ~2 weeks training
  { name: "Silver",   min: 250,  color: "#94a3b8" }, // ~2 months
  { name: "Gold",     min: 600,  color: "#fbbf24" }, // ~5 months
  { name: "Platinum", min: 1200, color: "#22d3ee" }, // ~9 months
  { name: "Diamond",  min: 2600, color: "#3b82f6" }, // ~1 year (50 sets/week)
];

const getRank = (totalSets) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalSets >= RANKS[i].min) return { ...RANKS[i], index: i };
  }
  return { ...RANKS[0], index: 0 };
};

const DEFAULT_PLANS = [
  {id:"p1",name:"Push Day",color:"#f97316",exercises:[
    {id:"e1",name:"Bench Press",muscleGroup:"Chest",sets:4,reps:8,weight:135},
    {id:"e2",name:"Incline DB Press",muscleGroup:"Chest",sets:3,reps:10,weight:60},
    {id:"e3",name:"Overhead Press",muscleGroup:"Shoulders",sets:3,reps:10,weight:95},
    {id:"e4",name:"Lateral Raises",muscleGroup:"Shoulders",sets:3,reps:15,weight:20},
    {id:"e5",name:"Tricep Pushdown",muscleGroup:"Triceps",sets:3,reps:12,weight:50},
  ]},
  {id:"p2",name:"Pull Day",color:"#3b82f6",exercises:[
    {id:"e6",name:"Deadlift",muscleGroup:"Back",sets:4,reps:5,weight:225},
    {id:"e7",name:"Barbell Row",muscleGroup:"Back",sets:3,reps:8,weight:135},
    {id:"e8",name:"Pull-Ups",muscleGroup:"Back",sets:3,reps:8,weight:0},
    {id:"e9",name:"Face Pulls",muscleGroup:"Shoulders",sets:3,reps:15,weight:30},
    {id:"e10",name:"Barbell Curl",muscleGroup:"Biceps",sets:3,reps:10,weight:65},
  ]},
  {id:"p3",name:"Leg Day",color:"#22c55e",exercises:[
    {id:"e11",name:"Squat",muscleGroup:"Legs",sets:4,reps:8,weight:185},
    {id:"e12",name:"Romanian Deadlift",muscleGroup:"Legs",sets:3,reps:10,weight:135},
    {id:"e13",name:"Leg Press",muscleGroup:"Legs",sets:3,reps:12,weight:270},
    {id:"e14",name:"Leg Curl",muscleGroup:"Legs",sets:3,reps:12,weight:80},
    {id:"e15",name:"Calf Raises",muscleGroup:"Legs",sets:4,reps:15,weight:100},
  ]},
];
const DEFAULT_SCHEDULE = {0:null,1:"p2",2:"p3",3:"p1",4:null,5:"p2",6:"p3"};

// ─── Rest Timer ───────────────────────────────────────────────────────────────
function RestTimer({ onDone, accent }) {
  const [secs, setSecs] = useState(90);
  const [running, setRunning] = useState(true);
  const total = 90;
  useEffect(() => {
    if (!running) return;
    if (secs <= 0) { onDone(); return; }
    const t = setTimeout(() => setSecs(s=>s-1), 1000);
    return () => clearTimeout(t);
  }, [secs, running, onDone]);
  const r=44, circ=2*Math.PI*r;
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1f2937" strokeWidth="8"/>
          <circle cx="50" cy="50" r={r} fill="none" stroke={accent} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={circ*(1-secs/total)}
            strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white">{secs}s</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={()=>setRunning(r=>!r)} className="p-2 rounded-xl bg-gray-800 text-white">
          {running?<Pause size={18}/>:<Play size={18}/>}
        </button>
        <button onClick={()=>setSecs(total)} className="p-2 rounded-xl bg-gray-800 text-white"><RotateCcw size={18}/></button>
        <button onClick={onDone} style={{background:accent}} className="px-4 py-2 rounded-xl text-white font-bold text-sm">Skip</button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [workouts, setWorkouts] = useState([]);
  const [bodyweight, setBodyweight] = useState([]);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [notes, setNotes] = useState([]);
  const [water, setWater] = useState({date:today(),cups:0});
  const [themeKey, setThemeKey] = useState("orange");
  const [loaded, setLoaded] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [milestonePopup, setMilestonePopup] = useState(null);

  const theme = THEMES[themeKey] || THEMES.orange;

  useEffect(() => {
    (async () => {
      const w=await load(KEYS.workouts), b=await load(KEYS.bodyweight),
            p=await load(KEYS.plans),   s=await load(KEYS.schedule),
            n=await load(KEYS.notes),   wt=await load(KEYS.water),
            th=await load(KEYS.theme);
      if(w) setWorkouts(w); if(b) setBodyweight(b);
      if(p) setPlans(p);    if(s) setSchedule(s);
      if(n) setNotes(n);    if(th) setThemeKey(th);
      if(wt) setWater(wt.date===today()?wt:{date:today(),cups:0});
      setLoaded(true);
    })();
  }, []);

  useEffect(()=>{ if(loaded) save(KEYS.workouts,workouts); },[workouts,loaded]);
  useEffect(()=>{ if(loaded) save(KEYS.bodyweight,bodyweight); },[bodyweight,loaded]);
  useEffect(()=>{ if(loaded) save(KEYS.plans,plans); },[plans,loaded]);
  useEffect(()=>{ if(loaded) save(KEYS.schedule,schedule); },[schedule,loaded]);
  useEffect(()=>{ if(loaded) save(KEYS.notes,notes); },[notes,loaded]);
  useEffect(()=>{ if(loaded) save(KEYS.water,water); },[water,loaded]);
  useEffect(()=>{ if(loaded) save(KEYS.theme,themeKey); },[themeKey,loaded]);

  const addWorkout = (w) => {
    setWorkouts(prev => {
      const next = [w, ...prev];
      const streak = calcStreak(next, schedule);
      const milestone = getMilestone(streak);
      if (milestone) setMilestonePopup(milestone);
      return next;
    });
  };
  const deleteWorkout = (id) => setWorkouts(prev=>prev.filter(w=>w.id!==id));
  const addCup = () => setWater(w=>({...w,cups:Math.min(w.cups+1,20)}));
  const removeCup = () => setWater(w=>({...w,cups:Math.max(w.cups-1,0)}));

  const exportCSV = () => {
    const rows = [["Date","Workout","Exercise","Muscle Group","Sets","Reps","Weight","Volume"]];
    workouts.forEach(w => {
      w.exercises?.forEach(e => {
        rows.push([w.date,w.name,e.name,e.muscleGroup,e.sets,e.reps,e.weight,e.sets*e.reps*e.weight]);
      });
    });
    const csv = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "workouts.csv";
    a.click();
  };

  if (!loaded) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-2xl font-black animate-pulse" style={{color:theme.accent}}>LOADING...</div>
    </div>
  );

  if (activeWorkout) return (
    <WorkoutSession
      plan={plans.find(p=>p.id===activeWorkout)}
      workouts={workouts}
      theme={theme}
      onFinish={(w)=>{addWorkout(w);setActiveWorkout(null);}}
      onCancel={()=>setActiveWorkout(null)}
    />
  );

  return (
    <div className={`min-h-screen ${theme.bg} text-white font-mono max-w-md mx-auto relative`}>
      {milestonePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className={`${theme.card} rounded-3xl p-8 mx-6 text-center border-2`} style={{borderColor:theme.accent}}>
            <div className="text-5xl mb-3">🏆</div>
            <div className="text-2xl font-black text-white mb-1">{milestonePopup} WEEK{milestonePopup===1?"":"S"}!</div>
            <div className="text-gray-400 text-sm mb-6">You've hit a consistency milestone. Keep going.</div>
            <button onClick={()=>setMilestonePopup(null)} className="px-8 py-3 rounded-2xl text-white font-black" style={{background:theme.accent}}>LET'S GO</button>
          </div>
        </div>
      )}
      <div className="pb-20">
        {tab==="dashboard" && <Dashboard workouts={workouts} plans={plans} schedule={schedule} onStart={setActiveWorkout} bodyweight={bodyweight} water={water} addCup={addCup} removeCup={removeCup} theme={theme}/>}
        {tab==="log"       && <LogTab workouts={workouts} addWorkout={addWorkout} deleteWorkout={deleteWorkout} plans={plans} theme={theme} exportCSV={exportCSV}/>}
        {tab==="plans"     && <PlansTab plans={plans} setPlans={setPlans} schedule={schedule} setSchedule={setSchedule} theme={theme}/>}
        {tab==="body"      && <BodyTab bodyweight={bodyweight} setBodyweight={setBodyweight} workouts={workouts} theme={theme}/>}
        {tab==="notes"     && <NotesTab notes={notes} setNotes={setNotes} theme={theme}/>}
        {tab==="stats"     && <StatsTab workouts={workouts} plans={plans} schedule={schedule} theme={theme} exportCSV={exportCSV}/>}
        {tab==="settings"  && <SettingsTab themeKey={themeKey} setThemeKey={setThemeKey} theme={theme}/>}
      </div>
      <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md ${theme.nav} border-t ${theme.border} flex`}>
        {[
          {id:"dashboard",icon:<Home size={17}/>,label:"Home"},
          {id:"log",icon:<Dumbbell size={17}/>,label:"Log"},
          {id:"plans",icon:<Calendar size={17}/>,label:"Plans"},
          {id:"body",icon:<Scale size={17}/>,label:"Body"},
          {id:"notes",icon:<FileText size={17}/>,label:"Notes"},
          {id:"stats",icon:<BarChart2 size={17}/>,label:"Stats"},
          {id:"settings",icon:<Palette size={17}/>,label:"Theme"},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-bold transition-colors"
            style={{color:tab===t.id?theme.accent:"#6b7280"}}>
            {t.icon}<span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Settings / Theme Tab ─────────────────────────────────────────────────────
function SettingsTab({ themeKey, setThemeKey, theme }) {
  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h2 className="text-2xl font-black">THEME</h2>
        <div className="text-xs text-gray-500 mt-1">Pick your accent color.</div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(THEMES).map(([key,t])=>(
          <button key={key} onClick={()=>setThemeKey(key)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${themeKey===key?"border-white":"border-gray-800"} ${theme.card}`}>
            <div className="w-8 h-8 rounded-full flex-shrink-0" style={{background:t.accent}}/>
            <div className="text-left">
              <div className="font-black text-white">{t.name}</div>
              <div className="text-xs text-gray-500">Accent color</div>
            </div>
            {themeKey===key && <Check size={18} className="ml-auto" style={{color:t.accent}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ workouts, plans, schedule, onStart, bodyweight, water, addCup, removeCup, theme }) {
  const dow = new Date().getDay();
  const todayPlan = plans.find(p=>p.id===schedule[dow]);
  const tomorrowPlan = plans.find(p=>p.id===schedule[(dow+1)%7]);
  const prs = getPRs(workouts).slice(0,3);
  const streak = calcStreak(workouts,schedule);
  const weekVol = calcWeeklyVolume(workouts);
  const lastBW = bodyweight[bodyweight.length-1];
  const [quoteIdx, setQuoteIdx] = useState(()=>Math.floor(Date.now()/86400000)%QUOTES.length);
  const q = QUOTES[quoteIdx];

  // Muscle recency — days since each group was trained
  const muscleRecency = useMemo(()=>{
    const last={};
    [...workouts].sort((a,b)=>b.date.localeCompare(a.date)).forEach(w=>{
      w.exercises?.forEach(e=>{if(!last[e.muscleGroup])last[e.muscleGroup]={days:daysSince(w.date),date:w.date};});
    });
    return last;
  },[workouts]);

  return (
    <div className="p-4 space-y-4">
      <div className="pt-4 pb-1">
        <div className="text-xs text-gray-500 uppercase tracking-widest">Today</div>
        <div className="text-2xl font-black text-white">{new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</div>
      </div>

      {/* Quote */}
      <div className={`${theme.card} rounded-2xl p-4 border ${theme.border} relative overflow-hidden`}>
        <div className="absolute top-3 right-3 opacity-10"><Quote size={32} style={{color:theme.accent}}/></div>
        <div className="text-sm text-gray-300 leading-relaxed italic mb-2">"{q.text}"</div>
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold" style={{color:theme.accent}}>— {q.author}</div>
          <button onClick={()=>setQuoteIdx(i=>(i+1)%QUOTES.length)} className="p-1.5 rounded-lg bg-gray-800 text-gray-500">
            <RefreshCw size={12}/>
          </button>
        </div>
      </div>

      {/* Today's plan */}
      <div className={`rounded-2xl p-4 ${theme.card} border ${theme.border}`}>
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Today's Workout</div>
        {todayPlan ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-black" style={{color:todayPlan.color}}>{todayPlan.name}</span>
              <span className="text-sm text-gray-400">{todayPlan.exercises.length} exercises</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {[...new Set(todayPlan.exercises.map(e=>e.muscleGroup))].map(mg=>(
                <span key={mg} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">{mg}</span>
              ))}
            </div>
            <button onClick={()=>onStart(todayPlan.id)} style={{background:todayPlan.color}}
              className="w-full py-3 rounded-xl font-black text-white flex items-center justify-center gap-2">
              <Play size={16} fill="white"/> START WORKOUT
            </button>
          </>
        ) : (
          <div className="text-gray-500 text-sm">Rest day — no workout scheduled.</div>
        )}
      </div>

      {/* Tomorrow preview */}
      {tomorrowPlan && (
        <div className={`${theme.card} rounded-2xl p-3 border ${theme.border} flex items-center justify-between`}>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Tomorrow</div>
            <div className="font-black" style={{color:tomorrowPlan.color}}>{tomorrowPlan.name}</div>
          </div>
          <ArrowRight size={16} className="text-gray-600"/>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${theme.card} rounded-2xl p-3 border ${theme.border}`}>
          <Flame size={16} className="mb-1" style={{color:theme.accent}}/>
          <div className="text-2xl font-black text-white">{streak}</div>
          <div className="text-xs text-gray-500">wk streak</div>
        </div>
        <div className={`${theme.card} rounded-2xl p-3 border ${theme.border}`}>
          <Activity size={16} className="text-blue-500 mb-1"/>
          <div className="text-2xl font-black text-white">{fmt(weekVol)}</div>
          <div className="text-xs text-gray-500">lbs/week</div>
        </div>
        <div className={`${theme.card} rounded-2xl p-3 border ${theme.border}`}>
          <Scale size={16} className="text-green-500 mb-1"/>
          <div className="text-2xl font-black text-white">{lastBW?lastBW.weight:"--"}</div>
          <div className="text-xs text-gray-500">lbs</div>
        </div>
      </div>

      {/* Water */}
      <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-400"/>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Water Today</span>
          </div>
          <span className="text-sm font-black text-white">{water.cups}/{WATER_GOAL} cups</span>
        </div>
        <div className="flex gap-1 mb-3">
          {Array.from({length:WATER_GOAL}).map((_,i)=>(
            <div key={i} className={`flex-1 h-3 rounded-full transition-all ${i<water.cups?"bg-blue-400":"bg-gray-800"}`}/>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={removeCup} className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-400 font-black text-lg">−</button>
          <button onClick={addCup} className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-1">
            <Droplets size={14}/> Add Cup
          </button>
        </div>
      </div>

      {/* Muscle heat map */}
      <MuscleHeatMap workouts={workouts} theme={theme}/>

      {/* Recent PRs */}
      {prs.length>0 && (
        <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-yellow-400"/>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Recent PRs</span>
          </div>
          <div className="space-y-2">
            {prs.map((pr,i)=>(
              <div key={i} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-white font-bold">{pr.exercise}</span>
                  <span className="ml-2 text-xs text-gray-600">1RM ~{epley1RM(pr.weight,pr.reps)}lbs</span>
                </div>
                <span className="text-sm text-yellow-400 font-black">{pr.weight}×{pr.reps}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <WeeklyVolMini workouts={workouts} theme={theme}/>
    </div>
  );
}

// ─── Muscle Heat Map ──────────────────────────────────────────────────────────
function MuscleHeatMap({ workouts, theme }) {
  const [view, setView] = useState("week"); // "week" or "alltime"
  const ws = weekStart();

  const stats = useMemo(() => {
    const week = {};
    const allTime = {};
    workouts.forEach(w => {
      const isThisWeek = w.date >= ws;
      w.exercises?.forEach(e => {
        const mg = e.muscleGroup;
        if (isThisWeek) week[mg] = (week[mg] || 0) + e.sets;
        allTime[mg] = (allTime[mg] || 0) + e.sets;
      });
    });
    return { week, allTime };
  }, [workouts, ws]);

  const currentData = view === "week" ? stats.week : stats.allTime;
  const max = Math.max(...Object.values(currentData), 1);

  return (
    <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          {view === "week" ? "Weekly Heatmap" : "Mastery Ranks"}
        </div>
        <div className="flex bg-gray-800 p-1 rounded-lg">
          <button onClick={() => setView("week")}
            className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${view === "week" ? "bg-gray-700 text-white" : "text-gray-500"}`}>
            WEEK
          </button>
          <button onClick={() => setView("alltime")}
            className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${view === "alltime" ? "bg-gray-700 text-white" : "text-gray-500"}`}>
            ALL-TIME
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <svg viewBox="0 0 192 200" className="w-32 flex-shrink-0">
          <ellipse cx="96" cy="30" rx="18" ry="20" fill="#1f2937"/>
          <rect x="68" y="50" width="56" height="60" rx="8" fill="#1f2937"/>
          <rect x="40" y="52" width="24" height="60" rx="8" fill="#1f2937"/>
          <rect x="128" y="52" width="24" height="60" rx="8" fill="#1f2937"/>
          <rect x="72" y="108" width="22" height="70" rx="8" fill="#1f2937"/>
          <rect x="98" y="108" width="22" height="70" rx="8" fill="#1f2937"/>
          
          {Object.entries(MUSCLE_POSITIONS).map(([mg, pos]) => {
            const val = currentData[mg] || 0;
            if (view === "week") {
              const opacity = val > 0 ? 0.3 + (val / max) * 0.7 : 0;
              return opacity > 0 && <circle key={mg} cx={pos.x} cy={pos.y} r={pos.r} fill={theme.accent} opacity={opacity} />;
            } else {
              const rank = getRank(val);
              return val > 0 && <circle key={mg} cx={pos.x} cy={pos.y} r={pos.r} fill={rank.color} opacity={0.9} />;
            }
          })}
        </svg>

        <div className="flex-1 space-y-2">
          {MUSCLE_GROUPS.filter(mg => currentData[mg]).sort((a,b) => currentData[b] - currentData[a]).map(mg => {
            const val = currentData[mg];
            const rank = getRank(val);
            const nextRank = RANKS[rank.index + 1];
            const progress = nextRank ? ((val - rank.min) / (nextRank.min - rank.min)) * 100 : 100;

            return (
              <div key={mg}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-gray-400">{mg}</span>
                  <span style={{ color: view === "alltime" ? rank.color : "white" }} className="font-bold uppercase">
                    {view === "alltime" ? rank.name : `${val}s`}
                  </span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" 
                    style={{ width: `${view === "week" ? (val/max)*100 : progress}%`, background: view === "alltime" ? rank.color : theme.accent }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeeklyVolMini({ workouts, theme }) {
  const data = last7Days(workouts);
  return (
    <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">7-Day Volume</div>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={data} barSize={16}>
          <Bar dataKey="vol" fill={theme.accent} radius={[4,4,0,0]}/>
          <XAxis dataKey="day" tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{background:"#111827",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:12}} formatter={(v)=>[`${fmt(v)} lbs`,"Vol"]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Log Tab ──────────────────────────────────────────────────────────────────
function LogTab({ workouts, addWorkout, deleteWorkout, plans, theme, exportCSV }) {
  const [showNew, setShowNew] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  const getOverload = (exName) => {
    const hist = getExerciseHistory(workouts, exName);
    if (hist.length<2) return false;
    const [l,p]=hist; return l.sets>=p.sets&&l.weight>=p.weight&&l.reps>=p.reps;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-black">WORKOUT LOG</h2>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="p-2 rounded-xl bg-gray-800 text-gray-400"><Download size={16}/></button>
          <button onClick={()=>setShowQuick(true)} className="px-3 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-bold">Quick</button>
          <button onClick={()=>setShowNew(true)} className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:theme.accent}}>
            <Plus size={20}/>
          </button>
        </div>
      </div>
      {showQuick && <QuickLogForm theme={theme} onSave={(w)=>{addWorkout(w);setShowQuick(false);}} onCancel={()=>setShowQuick(false)}/>}
      {showNew && <NewWorkoutForm plans={plans} theme={theme} onSave={(w)=>{addWorkout(w);setShowNew(false);}} onCancel={()=>setShowNew(false)}/>}
      {workouts.length===0&&!showNew&&!showQuick && (
        <div className="text-center text-gray-500 py-12">
          <Dumbbell size={40} className="mx-auto mb-3 opacity-30"/>
          <div>No workouts yet.</div>
        </div>
      )}
      <div className="space-y-3">
        {workouts.map(w=><WorkoutCard key={w.id} workout={w} getOverload={getOverload} onDelete={()=>deleteWorkout(w.id)} theme={theme}/>)}
      </div>
    </div>
  );
}

// Quick log — single exercise fast entry
function QuickLogForm({ theme, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [mg, setMg] = useState("Chest");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const save = () => {
    if (!name.trim()) return;
    onSave({id:uid(),name:`Quick: ${name}`,date:today(),exercises:[{name,muscleGroup:mg,sets,reps,weight}]});
  };
  return (
    <div className={`${theme.card} rounded-2xl border p-4 space-y-3`} style={{borderColor:theme.accent}}>
      <div className="text-sm font-black uppercase tracking-widest" style={{color:theme.accent}}>Quick Log</div>
      <input placeholder="Exercise name" value={name} onChange={e=>setName(e.target.value)}
        className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white font-bold border border-gray-700 outline-none"/>
      <select value={mg} onChange={e=>setMg(e.target.value)} className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white border border-gray-700 outline-none">
        {MUSCLE_GROUPS.map(m=><option key={m}>{m}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-2">
        {[["Sets",sets,setSets],["Reps",reps,setReps],["Weight",weight,setWeight]].map(([l,v,s])=>(
          <div key={l}>
            <div className="text-xs text-gray-500 mb-1 uppercase">{l}</div>
            <input type="number" value={v} onChange={e=>s(Number(e.target.value)||0)}
              className="w-full bg-gray-800 rounded-lg px-2 py-2 text-sm text-white outline-none border border-gray-700 text-center font-bold"/>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-400 font-bold text-sm">Cancel</button>
        <button onClick={save} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{background:theme.accent}}>Log It</button>
      </div>
    </div>
  );
}

function WorkoutCard({ workout, getOverload, onDelete, theme }) {
  const [open, setOpen] = useState(false);
  const vol = workout.exercises?.reduce((a,e)=>a+(e.sets*e.reps*e.weight),0)??0;
  return (
    <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
      <button className="w-full p-4 flex items-center justify-between" onClick={()=>setOpen(o=>!o)}>
        <div className="text-left">
          <div className="font-black text-white">{workout.name}</div>
          <div className="text-xs text-gray-500">{workout.date} · {fmt(vol)} lbs</div>
        </div>
        {open?<ChevronUp size={16} className="text-gray-500"/>:<ChevronDown size={16} className="text-gray-500"/>}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
          {workout.exercises?.map((ex,i)=>(
            <div key={i} className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  {ex.name}
                  {getOverload(ex.name)&&(
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold" style={{background:theme.accentMuted,color:theme.accent}}>
                      <ArrowUp size={10}/>OL
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{ex.muscleGroup} · 1RM ~{epley1RM(ex.weight,ex.reps)}lbs</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black" style={{color:theme.accent}}>{ex.weight>0?`${ex.weight}lbs`:"BW"}</div>
                <div className="text-xs text-gray-500">{ex.sets}×{ex.reps}</div>
              </div>
            </div>
          ))}
          <button onClick={onDelete} className="mt-2 text-xs text-red-500 flex items-center gap-1"><Trash2 size={12}/> Delete</button>
        </div>
      )}
    </div>
  );
}

function NewWorkoutForm({ plans, theme, onSave, onCancel }) {
  const [name, setName] = useState(`Workout ${new Date().toLocaleDateString()}`);
  const [exercises, setExercises] = useState([{id:uid(),name:"",muscleGroup:"Chest",sets:3,reps:10,weight:0}]);
  const addEx = () => setExercises(e=>[...e,{id:uid(),name:"",muscleGroup:"Chest",sets:3,reps:10,weight:0}]);
  const remEx = (id) => setExercises(e=>e.filter(x=>x.id!==id));
  const updEx = (id,f,v) => setExercises(e=>e.map(x=>x.id===id?{...x,[f]:["sets","reps","weight"].includes(f)?Number(v)||0:v}:x));
  return (
    <div className={`${theme.card} rounded-2xl p-4 space-y-4`} style={{border:`1px solid ${theme.accent}80`}}>
      <div className="text-sm font-black uppercase tracking-widest" style={{color:theme.accent}}>New Workout</div>
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white font-bold border border-gray-700 outline-none"/>
      {exercises.map(ex=>(
        <div key={ex.id} className="bg-gray-800 rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <input placeholder="Exercise name" value={ex.name} onChange={e=>updEx(ex.id,"name",e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none border border-gray-600"/>
            <button onClick={()=>remEx(ex.id)} className="p-2 text-red-400"><Trash2 size={14}/></button>
          </div>
          <select value={ex.muscleGroup} onChange={e=>updEx(ex.id,"muscleGroup",e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none border border-gray-600">
            {MUSCLE_GROUPS.map(m=><option key={m}>{m}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-2">
            {["sets","reps","weight"].map(f=>(
              <div key={f}>
                <div className="text-xs text-gray-500 mb-1 uppercase">{f}</div>
                <input type="number" value={ex[f]} onChange={e=>updEx(ex.id,f,e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-2 py-2 text-sm text-white outline-none border border-gray-600 text-center font-bold"/>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addEx} className="w-full py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm flex items-center justify-center gap-2">
        <Plus size={14}/> Add Exercise
      </button>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-400 font-bold text-sm">Cancel</button>
        <button onClick={()=>onSave({id:uid(),name,date:today(),exercises})} className="flex-1 py-3 rounded-xl text-white font-black text-sm" style={{background:theme.accent}}>Save</button>
      </div>
    </div>
  );
}

// ─── Workout Session ──────────────────────────────────────────────────────────
function WorkoutSession({ plan, workouts, theme, onFinish, onCancel }) {
  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [done, setDone] = useState([]);
  const [weight, setWeight] = useState(null);
  const [reps, setReps] = useState(null);
  const [finished, setFinished] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [exercises, setExercises] = useState(plan.exercises.map(e=>({...e})));

  const ex = exercises[exIdx];
  const totalSets = exercises.reduce((a,e)=>a+e.sets,0);
  const doneSets = done.reduce((a,d)=>a+d.sets,0)+setIdx;

  useEffect(()=>{ if(ex){setWeight(ex.weight);setReps(ex.reps);} },[exIdx]);

  const logSet = () => {
    if (setIdx+1<ex.sets) { setSetIdx(s=>s+1); setResting(true); }
    else {
      setDone(d=>[...d,{exName:ex.name,muscleGroup:ex.muscleGroup,sets:ex.sets,reps:Number(reps)||ex.reps,weight:Number(weight)||ex.weight}]);
      setSetIdx(0);
      if (exIdx+1<exercises.length) { setExIdx(i=>i+1); setResting(true); }
      else setFinished(true);
    }
  };

  const swapExercise = (newName) => {
    setExercises(prev=>prev.map((e,i)=>i===exIdx?{...e,name:newName}:e));
    setSwapOpen(false);
  };

  if (finished) return (
    <div className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center p-6 text-center`}>
      <div className="text-6xl mb-4">🔥</div>
      <div className="text-3xl font-black text-white mb-2">WORKOUT DONE</div>
      <div className="text-gray-400 mb-6">{done.length} exercises · {done.reduce((a,d)=>a+d.sets,0)} sets</div>
      <div className={`w-full ${theme.card} rounded-2xl p-4 mb-6 border ${theme.border} space-y-2`}>
        {done.map((d,i)=>(
          <div key={i} className="flex justify-between text-sm">
            <div>
              <span className="text-white font-bold">{d.exName}</span>
              <span className="ml-2 text-xs text-gray-600">~{epley1RM(d.weight,d.reps)}lbs 1RM</span>
            </div>
            <span className="font-black" style={{color:theme.accent}}>{d.weight>0?`${d.weight}lbs`:"BW"} ×{d.reps}</span>
          </div>
        ))}
      </div>
      <button onClick={()=>onFinish({id:uid(),name:plan.name,date:today(),planId:plan.id,exercises:done})}
        className="w-full py-4 rounded-2xl text-white font-black text-lg" style={{background:theme.accent}}>SAVE WORKOUT</button>
    </div>
  );

  const hist = getExerciseHistory(workouts, ex.name);
  const lastTime = hist[0];
  const alts = getAlternatives(ex.name);

  return (
    <div className={`min-h-screen ${theme.bg} flex flex-col p-4`}>
      <div className="flex items-center justify-between pt-4 mb-4">
        <button onClick={onCancel} className={`p-2 rounded-xl ${theme.card}`}><X size={20}/></button>
        <div className="text-center">
          <div className="font-black" style={{color:plan.color}}>{plan.name}</div>
          <div className="text-xs text-gray-500">Ex {exIdx+1}/{exercises.length}</div>
        </div>
        <button onClick={()=>setSwapOpen(o=>!o)} className={`p-2 rounded-xl ${theme.card} text-gray-400`}><Shuffle size={16}/></button>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${totalSets>0?(doneSets/totalSets)*100:0}%`,background:theme.accent}}/>
      </div>

      {swapOpen && (
        <div className={`${theme.card} rounded-2xl border ${theme.border} p-4 mb-4`}>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Swap Exercise</div>
          <div className="space-y-2">
            {alts.map(alt=>(
              <button key={alt} onClick={()=>swapExercise(alt)}
                className="w-full text-left px-4 py-3 rounded-xl bg-gray-800 text-white text-sm font-bold hover:bg-gray-700 transition-colors">
                {alt}
              </button>
            ))}
          </div>
          <button onClick={()=>setSwapOpen(false)} className="mt-3 w-full py-2 rounded-xl bg-gray-800 text-gray-400 text-sm font-bold">Cancel</button>
        </div>
      )}

      <div className="flex-1 space-y-4">
        <div className={`${theme.card} rounded-2xl p-5 border ${theme.border}`}>
          <div className="text-2xl font-black text-white mb-1">{ex.name}</div>
          <div className="text-sm text-gray-500">{ex.muscleGroup} · Set {setIdx+1} of {ex.sets}</div>
          {lastTime && <div className="mt-2 text-xs text-blue-400 flex items-center gap-1"><TrendingUp size={10}/> Last: {lastTime.weight>0?`${lastTime.weight}lbs`:"BW"} × {lastTime.sets}×{lastTime.reps}</div>}
        </div>
        {resting ? (
          <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
            <div className="text-center text-sm text-gray-500 mb-2 font-bold uppercase tracking-widest">Rest</div>
            <RestTimer onDone={()=>setResting(false)} accent={theme.accent}/>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[["Weight (lbs)",weight,setWeight,5],["Reps",reps,setReps,1]].map(([label,val,setter,step])=>(
                <div key={label} className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</div>
                  <div className="flex items-center gap-1">
                    <button onClick={()=>setter(v=>Math.max(0,Number(v)-step))} className="w-10 h-10 rounded-xl bg-gray-800 text-white font-black flex items-center justify-center text-lg">−</button>
                    <input type="number" value={val??""} onChange={e=>setter(e.target.value)}
                      className="flex-1 bg-transparent text-center text-2xl font-black outline-none" style={{color:theme.accent}}/>
                    <button onClick={()=>setter(v=>Number(v)+step)} className="w-10 h-10 rounded-xl bg-gray-800 text-white font-black flex items-center justify-center text-lg">+</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={logSet} className="w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-2" style={{background:plan.color}}>
              <Check size={22}/> LOG SET
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Plans Tab ────────────────────────────────────────────────────────────────
function PlansTab({ plans, setPlans, schedule, setSchedule, theme }) {
  const [editing, setEditing] = useState(null);
  const [schedOpen, setSchedOpen] = useState(false);
  const deletePlan=(id)=>{
    setPlans(p=>p.filter(x=>x.id!==id));
    setSchedule(s=>{const ns={...s};Object.keys(ns).forEach(k=>{if(ns[k]===id)ns[k]=null;});return ns;});
  };
  if(editing) return <PlanEditor plan={editing==="new"?{id:uid(),name:"",color:theme.accent,exercises:[]}:plans.find(p=>p.id===editing)} theme={theme}
    onSave={(p)=>{setPlans(prev=>editing==="new"?[...prev,p]:prev.map(x=>x.id===p.id?p:x));setEditing(null);}}
    onCancel={()=>setEditing(null)}/>;
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-black">PLANS</h2>
        <button onClick={()=>setEditing("new")} className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:theme.accent}}><Plus size={20}/></button>
      </div>
      <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
        <button className="w-full p-4 flex items-center justify-between" onClick={()=>setSchedOpen(o=>!o)}>
          <span className="font-black text-white flex items-center gap-2"><Calendar size={16} style={{color:theme.accent}}/>Weekly Schedule</span>
          {schedOpen?<ChevronUp size={16} className="text-gray-500"/>:<ChevronDown size={16} className="text-gray-500"/>}
        </button>
        {schedOpen && (
          <div className="px-4 pb-4 grid grid-cols-7 gap-1 border-t border-gray-800 pt-3">
            {[0,1,2,3,4,5,6].map(d=>{
              const plan=plans.find(p=>p.id===schedule[d]);
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500">{dayName(d)}</div>
                  <select value={schedule[d]||""} onChange={e=>setSchedule(s=>({...s,[d]:e.target.value||null}))}
                    className="w-full text-xs bg-gray-800 rounded-lg py-1 text-white outline-none border border-gray-700 text-center"
                    style={{color:plan?.color||"#9ca3af"}}>
                    <option value="">—</option>
                    {plans.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {plans.map(plan=>(
        <div key={plan.id} className={`${theme.card} rounded-2xl border ${theme.border} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-black text-lg" style={{color:plan.color}}>{plan.name}</div>
            <div className="flex gap-2">
              <button onClick={()=>setEditing(plan.id)} className="p-2 rounded-xl bg-gray-800 text-gray-400"><Edit2 size={14}/></button>
              <button onClick={()=>deletePlan(plan.id)} className="p-2 rounded-xl bg-gray-800 text-red-400"><Trash2 size={14}/></button>
            </div>
          </div>
          {plan.exercises.map((ex,i)=>(
            <div key={i} className="flex justify-between text-sm py-0.5">
              <span className="text-white">{ex.name}</span>
              <span className="text-gray-500">{ex.sets}×{ex.reps} @ {ex.weight>0?`${ex.weight}lbs`:"BW"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PlanEditor({ plan, theme, onSave, onCancel }) {
  const [p, setP] = useState({...plan,exercises:plan.exercises.map(e=>({...e}))});
  const addEx=()=>setP(x=>({...x,exercises:[...x.exercises,{id:uid(),name:"",muscleGroup:"Chest",sets:3,reps:10,weight:0}]}));
  const remEx=(id)=>setP(x=>({...x,exercises:x.exercises.filter(e=>e.id!==id)}));
  const updEx=(id,f,v)=>setP(x=>({...x,exercises:x.exercises.map(e=>e.id===id?{...e,[f]:["sets","reps","weight"].includes(f)?Number(v)||0:v}:e)}));
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 pt-4">
        <button onClick={onCancel} className={`p-2 rounded-xl ${theme.card}`}><ChevronLeft size={18}/></button>
        <h2 className="text-xl font-black">EDIT PLAN</h2>
      </div>
      <input placeholder="Plan name" value={p.name} onChange={e=>setP(x=>({...x,name:e.target.value}))}
        className="w-full bg-gray-900 rounded-xl px-4 py-3 text-white font-bold border border-gray-700 outline-none"/>
      <div>
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Color</div>
        <div className="flex gap-2">{PLAN_COLORS.map(c=>(
          <button key={c} onClick={()=>setP(x=>({...x,color:c}))} className="w-8 h-8 rounded-full border-2 transition-all"
            style={{background:c,borderColor:p.color===c?"white":"transparent"}}/>
        ))}</div>
      </div>
      <div className="space-y-3">
        {p.exercises.map(ex=>(
          <div key={ex.id} className="bg-gray-900 rounded-xl p-3 space-y-2 border border-gray-800">
            <div className="flex gap-2">
              <input placeholder="Exercise name" value={ex.name} onChange={e=>updEx(ex.id,"name",e.target.value)}
                className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none border border-gray-700"/>
              <button onClick={()=>remEx(ex.id)} className="p-2 text-red-400"><Trash2 size={14}/></button>
            </div>
            <select value={ex.muscleGroup} onChange={e=>updEx(ex.id,"muscleGroup",e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none border border-gray-700">
              {MUSCLE_GROUPS.map(m=><option key={m}>{m}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2">
              {["sets","reps","weight"].map(f=>(
                <div key={f}>
                  <div className="text-xs text-gray-500 mb-1 uppercase">{f}</div>
                  <input type="number" value={ex[f]} onChange={e=>updEx(ex.id,f,e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-2 py-2 text-sm text-white outline-none border border-gray-700 text-center font-bold"/>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={addEx} className="w-full py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 text-sm flex items-center justify-center gap-2"><Plus size={14}/> Add Exercise</button>
      </div>
      <div className="flex gap-2 pb-4">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-400 font-bold">Cancel</button>
        <button onClick={()=>onSave(p)} className="flex-1 py-3 rounded-xl text-white font-black" style={{background:theme.accent}}>Save Plan</button>
      </div>
    </div>
  );
}

// ─── Body Tab ─────────────────────────────────────────────────────────────────
function BodyTab({ bodyweight, setBodyweight, workouts, theme }) {
  const [input, setInput] = useState("");
  const addEntry=()=>{const w=parseFloat(input);if(!w)return;setBodyweight(b=>[...b,{date:today(),weight:w}]);setInput("");};
  const chartData=bodyweight.slice(-30).map(b=>({date:b.date.slice(5),w:b.weight}));
  const latest=bodyweight[bodyweight.length-1];
  const prev=bodyweight[bodyweight.length-2];
  const diff=latest&&prev?(latest.weight-prev.weight).toFixed(1):null;

  // Rest day counter per muscle
  const muscleRest = useMemo(()=>{
    const last={};
    [...workouts].sort((a,b)=>b.date.localeCompare(a.date)).forEach(w=>{
      w.exercises?.forEach(e=>{if(!last[e.muscleGroup])last[e.muscleGroup]=daysSince(w.date);});
    });
    return last;
  },[workouts]);

  return (
    <div className="p-4 space-y-4">
      <div className="pt-4"><h2 className="text-2xl font-black">BODY</h2></div>
      <div className={`${theme.card} rounded-2xl p-4 border ${theme.border} flex gap-3`}>
        <input type="number" placeholder="Weight (lbs)" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&addEntry()}
          className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white font-bold border border-gray-700 outline-none text-lg"/>
        <button onClick={addEntry} className="px-5 py-3 rounded-xl text-white font-black" style={{background:theme.accent}}>LOG</button>
      </div>
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current</div>
            <div className="text-3xl font-black text-white">{latest.weight}<span className="text-sm text-gray-500 ml-1">lbs</span></div>
            <div className="text-xs text-gray-500">{latest.date}</div>
          </div>
          <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Change</div>
            <div className={`text-3xl font-black ${diff>0?"text-red-400":diff<0?"text-green-400":"text-white"}`}>
              {diff!==null?(diff>0?`+${diff}`:diff):"--"}<span className="text-sm text-gray-500 ml-1">lbs</span>
            </div>
          </div>
        </div>
      )}
      {chartData.length>1 && (
        <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">30-Day Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
              <XAxis dataKey="date" tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} interval={4}/>
              <YAxis tick={{fill:"#6b7280",fontSize:10}} axisLine={false} tickLine={false} domain={["auto","auto"]} width={35}/>
              <Tooltip contentStyle={{background:"#111827",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:12}} formatter={(v)=>[`${v} lbs`]}/>
              <Line type="monotone" dataKey="w" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{r:4,fill:"#22c55e"}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Rest day counter */}
      {Object.keys(muscleRest).length>0 && (
        <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
          <div className="p-4 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <AlarmClock size={13}/> Days Since Last Trained
          </div>
          <div className="divide-y divide-gray-800">
            {Object.entries(muscleRest).sort((a,b)=>b[1]-a[1]).map(([mg,days])=>(
              <div key={mg} className="flex justify-between items-center px-4 py-2.5">
                <span className="text-sm text-gray-300">{mg}</span>
                <span className={`text-sm font-black ${days>=5?"text-red-400":days>=3?"text-yellow-400":"text-green-400"}`}>
                  {days===0?"Today":`${days}d ago`}
                  {days>=5&&<span className="ml-1 text-xs">⚠</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
        <div className="p-4 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-widest">History</div>
        {bodyweight.length===0&&<div className="p-4 text-gray-500 text-sm">No entries yet.</div>}
        <div className="divide-y divide-gray-800">
          {[...bodyweight].reverse().slice(0,15).map((b,i)=>(
            <div key={i} className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-400">{b.date}</span>
              <span className="text-sm font-black text-white">{b.weight} lbs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────
function NotesTab({ notes, setNotes, theme }) {
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const addNote=()=>{if(!text.trim())return;setNotes(n=>[{id:uid(),text:text.trim(),ts:Date.now()},...n]);setText("");};
  const deleteNote=(id)=>setNotes(n=>n.filter(x=>x.id!==id));
  const saveEdit=()=>{if(!editText.trim())return;setNotes(n=>n.map(x=>x.id===editId?{...x,text:editText.trim(),edited:Date.now()}:x));setEditId(null);};
  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h2 className="text-2xl font-black">NOTES</h2>
        <div className="text-xs text-gray-500 mt-1">Goals, ideas, reminders — anything.</div>
      </div>
      <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a note..." rows={3}
          className="w-full bg-transparent px-4 pt-4 pb-2 text-white text-sm outline-none resize-none placeholder-gray-600"/>
        <div className="flex justify-between items-center px-4 pb-3">
          <span className="text-xs text-gray-600">{text.length>0?`${text.length} chars`:""}</span>
          <button onClick={addNote} disabled={!text.trim()}
            className="px-4 py-2 rounded-xl text-sm font-black transition-all text-white"
            style={{background:text.trim()?theme.accent:"#374151"}}>Save Note</button>
        </div>
      </div>
      {notes.length===0&&<div className="text-center text-gray-600 py-10"><FileText size={36} className="mx-auto mb-3 opacity-30"/><div className="text-sm">No notes yet.</div></div>}
      <div className="space-y-3">
        {notes.map(note=>(
          <div key={note.id} className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
            {editId===note.id ? (
              <div>
                <textarea value={editText} onChange={e=>setEditText(e.target.value)} rows={4} autoFocus
                  className="w-full bg-transparent px-4 pt-4 pb-2 text-white text-sm outline-none resize-none border-b border-gray-800"/>
                <div className="flex gap-2 p-3">
                  <button onClick={()=>setEditId(null)} className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-400 text-sm font-bold">Cancel</button>
                  <button onClick={saveEdit} className="flex-1 py-2 rounded-xl text-white text-sm font-black" style={{background:theme.accent}}>Save</button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap mb-3">{note.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{fmtTime(note.edited||note.ts)}{note.edited?" (edited)":""}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>{setEditId(note.id);setEditText(note.text);}} className="p-1.5 rounded-lg bg-gray-800 text-gray-500"><Edit2 size={13}/></button>
                    <button onClick={()=>deleteNote(note.id)} className="p-1.5 rounded-lg bg-gray-800 text-red-500"><Trash2 size={13}/></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab({ workouts, plans, schedule, theme, exportCSV }) {
  const prs = getPRs(workouts);
  const weeklyData = calcWeeklyData(workouts);
  const streak = calcStreak(workouts,schedule);
  const totalVol = workouts.reduce((a,w)=>a+(w.exercises?.reduce((b,e)=>b+(e.sets*e.reps*e.weight),0)??0),0);
  const muscleBreakdown = calcMuscleBreakdown(workouts);

  // Deload check — 4+ consecutive hard weeks
  const weeklyVols = calcWeeklyData(workouts).slice(-5);
  const hardWeeks = weeklyVols.filter(w=>w.vol>0).length;
  const suggestDeload = hardWeeks>=4;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-black">STATS</h2>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 text-gray-400 text-xs font-bold">
          <Download size={13}/> Export CSV
        </button>
      </div>

      {suggestDeload && (
        <div className="rounded-2xl p-4 border" style={{background:"rgba(234,179,8,0.1)",borderColor:"#eab308"}}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-yellow-400"/>
            <span className="text-sm font-black text-yellow-400">DELOAD SUGGESTED</span>
          </div>
          <div className="text-xs text-gray-400">You've trained hard for 4+ consecutive weeks. Consider a deload week — reduce weights by ~40% to recover and come back stronger.</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Dumbbell size={16} style={{color:theme.accent}}/>} val={workouts.length} label="Total Workouts" theme={theme}/>
        <StatCard icon={<Flame size={16} style={{color:theme.accent}}/>} val={`${streak}w`} label="Streak" theme={theme}/>
        <StatCard icon={<Zap size={16} className="text-yellow-400"/>} val={fmt(totalVol)} label="Total Volume" theme={theme}/>
        <StatCard icon={<Award size={16} className="text-yellow-400"/>} val={prs.length} label="PRs Tracked" theme={theme}/>
      </div>

      {/* Milestone badges */}
      <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Trophy size={13} className="text-yellow-400"/>Milestones</div>
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map(m=>(
            <div key={m} className={`px-3 py-1.5 rounded-full text-xs font-black border transition-all ${streak>=m?"border-yellow-400 text-yellow-400 bg-yellow-400/10":"border-gray-700 text-gray-600"}`}>
              {m}w {streak>=m?"✓":""}
            </div>
          ))}
        </div>
      </div>

      {weeklyData.length>0 && (
        <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Weekly Volume (lbs)</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false}/>
              <XAxis dataKey="week" tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} width={30} tickFormatter={fmt}/>
              <Tooltip contentStyle={{background:"#111827",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:11}} formatter={(v)=>[`${fmt(v)} lbs`]}/>
              <Bar dataKey="vol" fill={theme.accent} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {muscleBreakdown.length>0 && (
        <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Volume by Muscle</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={muscleBreakdown} layout="vertical" barSize={12}>
              <XAxis type="number" tick={{fill:"#6b7280",fontSize:9}} axisLine={false} tickLine={false} tickFormatter={fmt}/>
              <YAxis type="category" dataKey="name" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} width={70}/>
              <Tooltip contentStyle={{background:"#111827",border:"1px solid #374151",borderRadius:8,color:"#fff",fontSize:11}} formatter={(v)=>[`${fmt(v)} lbs`]}/>
              <Bar dataKey="vol" fill="#a855f7" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {prs.length>0 && (
        <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Award size={14} className="text-yellow-400"/>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Personal Records + 1RM</span>
          </div>
          <div className="divide-y divide-gray-800">
            {prs.map((pr,i)=>(
              <div key={i} className="flex justify-between items-center px-4 py-3">
                <div>
                  <div className="text-sm font-bold text-white">{pr.exercise}</div>
                  <div className="text-xs text-gray-500">{pr.date} · Est. 1RM: <span className="text-blue-400 font-bold">{epley1RM(pr.weight,pr.reps)}lbs</span></div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-yellow-400">{pr.weight>0?`${pr.weight}lbs`:"BW"}</div>
                  <div className="text-xs text-gray-500">{pr.sets}×{pr.reps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, val, label, theme }) {
  return (
    <div className={`${theme.card} rounded-2xl p-4 border ${theme.border}`}>
      <div className="mb-1">{icon}</div>
      <div className="text-2xl font-black text-white">{val}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

// ─── Data helpers ─────────────────────────────────────────────────────────────
function getExerciseHistory(workouts,name){const r=[];workouts.forEach(w=>w.exercises?.forEach(e=>{if(e.name.toLowerCase()===name.toLowerCase())r.push({...e,date:w.date});}));return r.sort((a,b)=>b.date.localeCompare(a.date));}
function getPRs(workouts){const b={};workouts.forEach(w=>w.exercises?.forEach(e=>{if(!b[e.name]||e.weight>b[e.name].weight||(e.weight===b[e.name].weight&&e.reps>b[e.name].reps))b[e.name]={...e,date:w.date};}));return Object.values(b).sort((a,b)=>b.date.localeCompare(a.date));}
function calcWeeklyVolume(workouts){const ws=weekStart();return workouts.filter(w=>w.date>=ws).reduce((a,w)=>a+(w.exercises?.reduce((b,e)=>b+(e.sets*e.reps*e.weight),0)??0),0);}
function calcStreak(workouts,schedule){if(!workouts.length)return 0;let s=0;const now=new Date();for(let i=0;i<52;i++){const ws=new Date(now);ws.setDate(ws.getDate()-ws.getDay()-i*7);const we=new Date(ws);we.setDate(we.getDate()+6);const wss=ws.toISOString().slice(0,10),wes=we.toISOString().slice(0,10);if(workouts.some(w=>w.date>=wss&&w.date<=wes))s++;else if(i>0)break;}return s;}
function calcWeeklyData(workouts){const wks={};workouts.forEach(w=>{const d=new Date(w.date);d.setDate(d.getDate()-d.getDay());const k=d.toISOString().slice(5,10);wks[k]=(wks[k]||0)+(w.exercises?.reduce((a,e)=>a+(e.sets*e.reps*e.weight),0)??0);});return Object.entries(wks).sort((a,b)=>a[0].localeCompare(b[0])).slice(-8).map(([week,vol])=>({week,vol}));}
function last7Days(workouts){const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=d.toISOString().slice(0,10);const vol=workouts.filter(w=>w.date===ds).reduce((a,w)=>a+(w.exercises?.reduce((b,e)=>b+(e.sets*e.reps*e.weight),0)??0),0);days.push({day:dayName(d.getDay()),vol});}return days;}
function calcMuscleBreakdown(workouts){const m={};workouts.forEach(w=>w.exercises?.forEach(e=>{const mg=e.muscleGroup||"Other";m[mg]=(m[mg]||0)+(e.sets*e.reps*e.weight);}));return Object.entries(m).map(([name,vol])=>({name,vol})).sort((a,b)=>b.vol-a.vol).slice(0,7);}
function daysSince(dateStr){const d=new Date(dateStr);const now=new Date();return Math.floor((now-d)/(1000*60*60*24));}
