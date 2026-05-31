const { useState, useEffect, useCallback } = React;

// ── API KEY HELPERS ──────────────────────────────────────────────────────────
const getKey = () => { try { return localStorage.getItem('fp_key') || ''; } catch { return ''; } };
const saveKey = k => { try { localStorage.setItem('fp_key', k); } catch {} };

// ── API KEY GATE ─────────────────────────────────────────────────────────────
function ApiKeyGate({ onReady }) {
  const [key, setK] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const k = key.trim();
    if (!k.startsWith('sk-ant-')) { setErr("Format invalide — doit commencer par sk-ant-"); return; }
    setBusy(true); setErr('');
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': k, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 5, messages: [{ role: 'user', content: 'ok' }] })
      });
      if (r.ok || r.status === 400) { saveKey(k); onReady(); }
      else { const d = await r.json(); setErr(d.error?.message || "Clé refusée — vérifie qu'elle est active."); }
    } catch { setErr("Erreur réseau."); }
    setBusy(false);
  };

  const C2 = { bg:'#07070E', card:'#0C0C1A', border:'#15152A', p1:'#00D4FF', txt:'#C8C8E0', muted:'#44445A' };
  return (
    <div style={{minHeight:'100vh',background:C2.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'-apple-system,Segoe UI,system-ui,sans-serif'}}>
      <div style={{width:'100%',maxWidth:380,background:C2.card,borderRadius:12,padding:28,border:`1px solid ${C2.border}`}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:10}}>⚡</div>
          <h1 style={{color:'#fff',fontSize:22,fontWeight:900,margin:'0 0 6px',letterSpacing:-0.5}}>Formation Pro</h1>
          <p style={{color:C2.muted,fontSize:12,margin:0,lineHeight:1.6}}>Entre ta clé API Anthropic pour activer les cours et outils IA. Stockée localement, jamais partagée.</p>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:C2.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:5}}>Clé API Anthropic</div>
          <input type="password" value={key} onChange={e=>setK(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
            placeholder="sk-ant-api03-..."
            style={{width:'100%',background:'#05050F',border:`1px solid ${C2.border}`,color:'#CCC',padding:'10px 12px',borderRadius:6,fontSize:12,fontFamily:'Courier New,monospace',boxSizing:'border-box'}}/>
        </div>
        {err && <div style={{color:'#FF8888',fontSize:11,marginBottom:10,padding:'8px 10px',background:'#1A0808',borderRadius:4,lineHeight:1.5}}>{err}</div>}
        <button onClick={submit} disabled={busy||!key.trim()}
          style={{width:'100%',padding:11,background:busy||!key.trim()?'#111':C2.p1,color:busy||!key.trim()?'#333':'#000',border:'none',borderRadius:6,cursor:busy||!key.trim()?'default':'pointer',fontFamily:'inherit',fontSize:12,fontWeight:700,letterSpacing:0.5,marginBottom:16}}>
          {busy ? '⏳ Vérification...' : '▶ ACTIVER LA FORMATION'}
        </button>
        <div style={{background:'#08080F',borderRadius:6,padding:12,border:`1px solid ${C2.border}`}}>
          <div style={{fontSize:10,color:C2.muted,marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>Obtenir une clé</div>
          <div style={{fontSize:11,color:'#555',lineHeight:1.7}}>1. console.anthropic.com<br/>2. Settings → API Keys<br/>3. Create Key → copier<br/>4. Coller ici</div>
        </div>
        <p style={{fontSize:10,color:'#222',textAlign:'center',marginTop:12,margin:'12px 0 0'}}>Cours, quiz et outils hors-IA fonctionnent sans clé.</p>
      </div>
    </div>
  );
}

// ── API WRAPPER (uses stored key + proper headers) ───────────────────────────

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  bg:"#07070E", card:"#0C0C1A", border:"#15152A",
  p1:"#00D4FF", p2:"#FFB800", p3:"#FF4D6D",
  txt:"#C8C8E0", muted:"#44445A", dim:"#222238"
};
const PC = { p1:C.p1, p2:C.p2, p3:C.p3, p4:"#A855F7" };

// ─── MODULE CATALOGUE ────────────────────────────────────────────────────────
const MODULES = [
  // PILIER 1
  { id:"p1m1", pid:"p1", title:"APIs & JSON", sub:"Le protocole universel des machines", time:"90 min", diff:"Fondamental",
    objectives:["Comprendre le modèle requête/réponse REST","Lire, écrire et débugger du JSON sans effort","Faire ta première vraie requête API Anthropic"],
    concepts:["HTTP verbs GET/POST/PUT/DELETE","URL structure & endpoints","JSON syntax exacte & erreurs fréquentes","Headers & authentification","Status codes & gestion d'erreur"] },
  { id:"p1m2", pid:"p1", title:"Webhooks & Make.com", sub:"L'architecture event-driven", time:"75 min", diff:"Fondamental",
    objectives:["Distinguer polling et event-driven","Configurer un Webhook dans Make.com","Construire un premier scénario complet"],
    concepts:["Push vs Pull architecture","Payload JSON structure","Make.com modules & routing","Filtres et conditions","Error handling en production"] },
  { id:"p1m3", pid:"p1", title:"Prompt Engineering Professionnel", sub:"Few-Shot, CoT & Production", time:"90 min", diff:"Intermédiaire",
    objectives:["Écrire des prompts à sorties 100% prévisibles","Maîtriser Few-Shot et Chain-of-Thought","Construire des pipelines LLM robustes"],
    concepts:["Zero-Shot vs Few-Shot vs Many-Shot","Chain-of-Thought decomposition","System prompts & rôles","Contraintes de format strict","Temperature & paramètres avancés","Prompt injection & sécurité"] },
  { id:"p1m4", pid:"p1", title:"Architecture Production IA", sub:"Scalabilité & robustesse", time:"60 min", diff:"Avancé",
    objectives:["Gérer les erreurs API en production","Optimiser les coûts (70-90% d'économies)","Monitorer un pipeline LLM"],
    concepts:["Retry logic & circuit breakers","Prompt caching (90% savings)","Batch API (50% savings)","Token counting & optimisation","Rate limiting & throttling","Monitoring & alerting"] },
  // PILIER 2
  { id:"p2m1", pid:"p2", title:"Revenue Models & Unit Economics", sub:"Qui paie, combien, pourquoi ça tient", time:"90 min", diff:"Fondamental",
    objectives:["Déconstruire n'importe quel modèle de revenus en 10 minutes","Calculer LTV, CAC et Payback Period","Évaluer la santé économique unitaire d'une boîte"],
    concepts:["6 revenue models (SaaS, marketplace, freemium...)","ARR/MRR/NRR — les métriques SaaS","LTV = ARPU × Marge × (1/Churn)","CAC & Payback Period","LTV:CAC ratio (healthy >3x)","Churn analysis & cohort thinking"] },
  { id:"p2m2", pid:"p2", title:"Cash Flow & Modélisation Financière", sub:"La différence entre survivre et mourir", time:"75 min", diff:"Fondamental",
    objectives:["Calculer Burn Rate et Runway avec précision","Construire une projection de trésorerie 3 mois","Distinguer Default Alive vs Default Dead"],
    concepts:["Burn Brut vs Burn Net","Runway statique vs dynamique","Cash Flow vs Profit (BFR)","Projection de trésorerie","Default Alive (Paul Graham)","Tableau de bord financier PME"] },
  { id:"p2m3", pid:"p2", title:"Valorisation & Financement", sub:"DCF, multiples & dette mezzanine", time:"90 min", diff:"Avancé",
    objectives:["Valoriser une startup avec 3 méthodes","Structurer un financement 150k€","Présenter un dossier bancaire qui passe"],
    concepts:["EV/ARR, EV/EBITDA, P/E multiples","DCF simplifié & terminal value","Comparable transactions","Stack dette senior/mezzanine/equity","Les 5C du crédit bancaire","Garantie BPI — le hack sous-utilisé"] },
  { id:"p2m4", pid:"p2", title:"Pitch Deck & Dossier Financier", sub:"De la conviction au closing", time:"75 min", diff:"Intermédiaire",
    objectives:["Construire un pitch deck selon Sequoia","Calculer TAM/SAM/SOM bottom-up","Rédiger un dossier bancaire qui convainc"],
    concepts:["Les 10 slides obligatoires Sequoia","TAM bottom-up (seule méthode crédible)","P&L 3 ans défendable","One-pager financier","Usage des fonds & milestones","Slide Équipe — le critère #1 des VCs"] },
  // PILIER 3
  { id:"p3m1", pid:"p3", title:"A.I.D.A & Persuasion Structurée", sub:"128 ans de preuves", time:"60 min", diff:"Fondamental",
    objectives:["Appliquer AIDA à n'importe quel texte","Écrire une accroche qui arrête le scroll","Multiplier son taux de réponse par 3 à 5"],
    concepts:["Attention — les 6 formats d'accroche","Intérêt — le problème du LECTEUR pas de toi","Désir — transformation vs feature","Action — le CTA sans friction","AIDA vs PAS vs PASTOR","Psychologie de la décision B2B"] },
  { id:"p3m2", pid:"p3", title:"Élagage Radical & Rythme", sub:"La chirurgie du texte", time:"60 min", diff:"Fondamental",
    objectives:["Couper 50% d'un texte sans perdre le sens","Reconnaître et supprimer les 5 types de parasites","Créer du rythme avec la longueur des phrases"],
    concepts:["Règle du mot fantôme","Adverbes parasites → verbes forts","Voix active vs passive","Formules creuses — liste noire complète","Rythme binaire et ternaire","Le test Hemingway (Grade 6-8)"] },
  { id:"p3m3", pid:"p3", title:"Séquence Email & Ton Parlé", sub:"Du premier contact au closing", time:"75 min", diff:"Intermédiaire",
    objectives:["Écrire une séquence 3 emails complète","Adopter un ton parlé crédible et direct","Fermer une séquence sans brûler le contact"],
    concepts:["Email 1 Direct (AIDA pur, 80-100 mots)","Email 2 Storytelling (StoryBrand)","Email 3 Rupture/Ressource","Timing J0/J+3/J+7","Objets de mail — les 8 formats qui marchent","Personnalisation précise vs générique"] },

  // ── ADVANCED MODULES ──────────────────────────────────────────────────────
  { id:"p1m5", pid:"p1", title:"Debugging & Production", sub:"Les 12 pannes réelles et leurs solutions", time:"90 min", diff:"Avancé",
    objectives:["Diagnostiquer les 12 pannes les plus fréquentes","Construire un monitoring actif","Livrer un runbook professionnel"],
    concepts:["Format RSS qui change","Caractères spéciaux qui cassent JSON","Prompt drift en production","Doublons de webhooks","Rate limiting en cascade","Quota Make.com dépassé","Timezone décalée","Monitoring actif Google Sheets"] },
  { id:"p1m6", pid:"p1", title:"Intégrations CRM & APIs Avancées", sub:"HubSpot, Salesforce, Pipedrive", time:"120 min", diff:"Avancé",
    objectives:["Intégrer HubSpot/Salesforce/Pipedrive","Construire un pipeline de qualification automatique","Éviter les pièges des intégrations CRM"],
    concepts:["Les 5 CRM les plus fréquents","HTTP Request avancé dans Make.com","Pattern Get or Create","Qualification automatique avec Claude","Sandbox vs production","Permission scoping"] },
  { id:"p2m5", pid:"p2", title:"Intelligence Financière Sectorielle", sub:"Benchmarks réels + lecture de bilans", time:"90 min", diff:"Avancé",
    objectives:["Mémoriser les benchmarks par secteur","Lire un vrai bilan en 10 minutes","Identifier les signaux d'alerte"],
    concepts:["Benchmarks SaaS B2B, Marketplace, Conseil, Industrie, Retail","Méthode de lecture bilan en 4 étapes","pappers.fr — bilans PME françaises","Signaux d'alerte dans un bilan","Ratios dette nette/EBITDA","BFR et cycle de trésorerie"] },
  { id:"p2m6", pid:"p2", title:"Dossier Bancaire & Négociation", sub:"Convaincre un banquier senior", time:"90 min", diff:"Avancé",
    objectives:["Comprendre la psychologie du banquier","Construire un dossier bancaire professionnel","Négocier avec 3 banques en parallèle"],
    concepts:["Psychologie du banquier — cherche à éviter les mauvais dossiers","Processus bancaire en 3 étapes","Structure exacte du dossier","Arguments qui font la différence","Règle des 3 banques","Garantie BPI — procédure complète"] },
  // ── PILIER 4 : BUSINESS DEVELOPMENT ────────────────────────────────────────
  { id:"p4m1", pid:"p4", title:"Positionnement & Pricing", sub:"Packager et pricer son offre", time:"75 min", diff:"Fondamental",
    objectives:["Créer 3 packages prêts à vendre","Fixer les prix par le ROI client","Éviter les erreurs de pricing qui tuent les marges"],
    concepts:["4 modèles de pricing (TJM, forfait, retainer, perf)","Méthode prix = 5-10% valeur créée annuelle","Les 3 packages concrets","Technique d'ancrage par le haut","Contrat et acompte 50%","Scope creep — gestion"] },
  { id:"p4m2", pid:"p4", title:"Prospection & Réseau", sub:"Les 90 premiers jours", time:"75 min", diff:"Fondamental",
    objectives:["Convertir ton réseau existant en premiers clients","Appliquer la règle des 3 touchpoints","Mesurer et optimiser ta prospection"],
    concepts:["Warm vs cold outreach","Stratégie des 90 premiers jours","La technique du cadeau de valeur","Scripts warm outreach — 3 situations","Règle des 3 touchpoints","CRM personnel simple","Mesure des taux de conversion"] },
  { id:"p4m3", pid:"p4", title:"Livraison & Recommandations", sub:"Sur-livrer pour être recommandé", time:"60 min", diff:"Fondamental",
    objectives:["Livrer de façon à générer des recommandations","Gérer les situations difficiles professionnellement","Construire des relations clients durables"],
    concepts:["Protocole brief + update + livraison","Technique de sur-livraison","Gestion scope creep","Client qui ne répond plus","Demander le témoignage au bon moment","Suivi J+30 J+90 J+6mois"] },
];

// Course data loaded from course_data.js (EMBEDDED_CONTENT, EMBEDDED_QUIZZES)
// Advanced data loaded from advanced_data.js (ADVANCED_CONTENT, ADVANCED_QUIZZES)

const PILIERS = {
  p1:{ name:"I.A. & Automatisation", sub:"L'Infrastructure", icon:"⚡", color:C.p1 },
  p2:{ name:"Finance & Stratégie", sub:"La Valeur", icon:"📊", color:C.p2 },
  p3:{ name:"Copywriting Stratégique", sub:"La Voix", icon:"✍️", color:C.p3 },
  p4:{ name:"Business Development", sub:"La Croissance", icon:"🚀", color:"#A855F7" },
};

// ─── GENERATION PROMPT ───────────────────────────────────────────────────────




// ─── API ─────────────────────────────────────────────────────────────────────


// ─── STORAGE ─────────────────────────────────────────────────────────────────
const store = {
  get: async (k) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch{ return null; } },
  set: async (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch{} }
};

// ─── SECTION RENDERER ────────────────────────────────────────────────────────
const ICONS = { intuition:"💡", mecanique:"⚙️", exemple:"📋", erreur:"⚠️", standard_pro:"🎯", exercice:"✏️" };
const COLORS = { intuition:C.p1, mecanique:"#A78BFA", exemple:C.p2, erreur:C.p3, standard_pro:"#22C55E", exercice:"#F59E0B" };

function renderContent(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} style={{height:8}}/>;
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rich = parts.map((p,j) => {
      if(p.startsWith("**")&&p.endsWith("**")) return <strong key={j} style={{color:"#E8E8F8",fontWeight:700}}>{p.slice(2,-2)}</strong>;
      if(p.startsWith("`")&&p.endsWith("`")) return <code key={j} style={{background:"#111126",color:C.p1,padding:"1px 6px",borderRadius:3,fontSize:"0.9em",fontFamily:"'Courier New',monospace"}}>{p.slice(1,-1)}</code>;
      return p;
    });
    if(line.trim().startsWith("•") || line.trim().startsWith("-")) {
      return <div key={i} style={{display:"flex",gap:8,padding:"3px 0",alignItems:"flex-start"}}>
        <span style={{color:C.muted,flexShrink:0,marginTop:1}}>›</span>
        <span style={{fontSize:13,color:"#AAABCC",lineHeight:1.65}}>{rich}</span>
      </div>;
    }
    return <p key={i} style={{fontSize:13,color:"#AAABCC",lineHeight:1.75,marginBottom:2}}>{rich}</p>;
  });
}

function CourseSection({ s, pc }) {
  const [open, setOpen] = useState(true);
  const col = COLORS[s.type] || pc;
  const icon = ICONS[s.type] || "📌";
  return (
    <div style={{marginBottom:16,borderRadius:8,overflow:"hidden",border:`1px solid ${col}22`}}>
      <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:`${col}0C`,cursor:"pointer",userSelect:"none"}}>
        <span style={{fontSize:16}}>{icon}</span>
        <span style={{fontSize:12,fontWeight:700,color:col,flex:1,letterSpacing:0.3}}>{s.titre}</span>
        <span style={{fontSize:11,color:C.muted,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
      </div>
      {open && (
        <div style={{padding:"14px 16px",background:C.card}}>
          {renderContent(s.contenu)}
          {s.code && (
            <div style={{marginTop:12,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border}`}}>
              {s.label_code && <div style={{background:C.dim,padding:"6px 12px",fontSize:10,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{s.label_code}</div>}
              <pre style={{margin:0,padding:"12px 14px",background:"#050510",fontSize:11,color:"#7AC5D8",lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap"}}>{s.code}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── QUIZ ────────────────────────────────────────────────────────────────────
function Quiz({ questions, moduleId, scores, setScores }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState(null);
  const [shown, setShown] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(!!scores[moduleId]);

  if(!questions?.length) return <div style={{color:C.muted,fontSize:12,padding:20,textAlign:"center"}}>Génère le cours d'abord pour débloquer le quiz.</div>;

  if(done) {
    const sc=scores[moduleId], tot=questions.length;
    return (
      <div style={{textAlign:"center",padding:28,background:C.card,borderRadius:8,border:`1px solid ${sc===tot?"#22C55E33":"#FFB80033"}`}}>
        <div style={{fontSize:36,marginBottom:8}}>{sc===tot?"🏆":sc>=tot*0.6?"📚":"🔄"}</div>
        <div style={{fontSize:14,fontWeight:700,color:sc===tot?"#22C55E":"#FFB800",marginBottom:4}}>
          {sc===tot?"Module validé ✓":sc>=3?"Bonne progression":"À consolider"}
        </div>
        <div style={{fontSize:12,color:C.muted,marginBottom:16}}>{sc}/{tot} correctes</div>
        <button onClick={()=>{setDone(false);setQi(0);setSel(null);setShown(false);setCorrect(0);}}
          style={{padding:"7px 16px",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:4,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>
          Recommencer
        </button>
      </div>
    );
  }

  const q = questions[qi];
  const validate = () => {
    if(sel===null) return;
    const ok = sel===q.ans;
    const nc = correct+(ok?1:0);
    setShown(true);
    if(qi===questions.length-1) {
      setTimeout(()=>{ setScores(s=>({...s,[moduleId]:nc})); setDone(true); },1800);
    } else {
      setTimeout(()=>{ setCorrect(nc); setQi(qi+1); setSel(null); setShown(false); },1800);
    }
  };

  return (
    <div style={{background:C.card,borderRadius:8,border:`1px solid ${C.border}`,overflow:"hidden"}}>
      <div style={{background:C.dim,padding:"10px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,letterSpacing:2,color:C.muted,textTransform:"uppercase"}}>Question {qi+1}/{questions.length}</span>
        <div style={{display:"flex",gap:4}}>{questions.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:i<qi?"#22C55E":i===qi?"#FFB800":C.border}}/>)}</div>
      </div>
      <div style={{padding:20}}>
        <p style={{fontSize:13,color:"#E0E0F0",fontWeight:600,lineHeight:1.6,marginBottom:14}}>{q.q}</p>
        {q.opts.map((o,i)=>{
          let bg=C.card,br=C.border,co=C.txt;
          if(shown){if(i===q.ans){bg="#081A08";br="#22C55E55";co="#22C55E";}else if(i===sel){bg="#1A0808";br="#FF4D6D55";co="#FF4D6D";}}
          else if(sel===i){bg="#0F0F2A";br:"#5555CC";}
          return (
            <div key={i} onClick={()=>!shown&&setSel(i)} style={{display:"flex",gap:10,padding:"10px 12px",background:bg,border:`1px solid ${br}`,borderRadius:6,cursor:shown?"default":"pointer",marginBottom:8,color:co,fontSize:12,lineHeight:1.5,transition:"all 0.12s"}}>
              <span style={{flexShrink:0,width:18,height:18,borderRadius:"50%",border:`1px solid ${br}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{String.fromCharCode(65+i)}</span>
              {o}
            </div>
          );
        })}
        {shown&&<div style={{padding:"10px 12px",background:"#08101A",border:`1px solid ${C.p1}22`,borderRadius:6,fontSize:11,color:"#7AA8BE",lineHeight:1.65,marginBottom:12}}>💡 {q.ex}</div>}
        {!shown&&<button onClick={validate} disabled={sel===null} style={{padding:"9px 22px",background:sel!==null?"#fff":"#111",color:sel!==null?"#000":"#444",border:"none",borderRadius:4,cursor:sel!==null?"pointer":"default",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1}}>VALIDER →</button>}
      </div>
    </div>
  );
}

// ─── AI TOOLS ─────────────────────────────────────────────────────────────────
function PromptTester() {
  const [prompt,setPrompt]=useState(`Tu es un analyste business senior.

EXEMPLE 1 :
NEWS: "Renault annonce 15% de réduction d'effectifs dans les fonctions support."
OUTPUT: {"titre":"Renault restructure","opportunite":"Outplacement 3000+ salariés","urgence":"haute","action":"Contact DRH auto J+30"}

NEWS: {{news}}

Réponds UNIQUEMENT en JSON valide.`);
  const [news,setNews]=useState("BPI France débloque 2 milliards pour les startups deeptech françaises.");
  const [result,setResult]=useState(""); const [valid,setValid]=useState(null);
  const [feedback,setFeedback]=useState(""); const [loading,setLoading]=useState(false);
  const test=async()=>{
    if(!getKey()){setResult("🔒 Clé API manquante — configure-la via le cadenas en haut de l'accueil.");return;}
    setLoading(true);setResult("");setValid(null);setFeedback("");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,messages:[{role:"user",content:prompt.replace("{{news}}",news)}]})});
      const d=await r.json(); const txt=d.content[0].text; setResult(txt);
      try{JSON.parse(txt.trim());setValid(true);}catch{setValid(false);}
      const fb=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:250,system:"Expert prompt engineering. Feedback court, 2-3 bullet points max, en français.",messages:[{role:"user",content:"Évalue ce prompt Few-Shot pour une automatisation et donne 2-3 améliorations concrètes :\n\n"+prompt}]})});
      const fd=await fb.json(); setFeedback(fd.content[0].text);
    }catch(e){setResult("Erreur : "+e.message);}
    setLoading(false);
  };
  const ta={width:"100%",background:"#05050F",border:`1px solid ${C.border}`,color:"#CCC",padding:12,borderRadius:6,fontSize:11,fontFamily:"'Courier New',monospace",resize:"vertical",boxSizing:"border-box",lineHeight:1.65};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Ton prompt</div><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={10} style={ta}/></div>
      <div><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>News de test (remplace {`{{news}}`})</div><textarea value={news} onChange={e=>setNews(e.target.value)} rows={2} style={{...ta,fontFamily:"inherit"}}/></div>
      <button onClick={test} disabled={loading} style={{padding:"10px 20px",background:loading?"#111":C.p1,color:loading?"#333":"#000",border:"none",borderRadius:4,cursor:loading?"default":"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1}}>
        {loading?"⏳ Test en cours...":"▶ TESTER AVEC CLAUDE"}
      </button>
      {result&&<div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <span style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>Output</span>
          {valid!==null&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:valid?"#22C55E22":"#FF4D6D22",color:valid?"#22C55E":"#FF4D6D",fontWeight:700}}>{valid?"✓ JSON VALIDE":"✗ INVALIDE"}</span>}
        </div>
        <pre style={{background:"#04040E",padding:12,borderRadius:6,fontSize:11,color:valid?"#7AC5D8":"#FF8888",lineHeight:1.6,overflowX:"auto",whiteSpace:"pre-wrap",border:`1px solid ${valid?"#22C55E22":"#FF4D6D22"}`,margin:0}}>{result}</pre>
      </div>}
      {feedback&&<div style={{padding:12,background:"#080F1A",border:`1px solid ${C.p1}22`,borderRadius:6}}>
        <div style={{fontSize:10,color:C.p1,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>💡 Analyse Claude</div>
        <div style={{fontSize:11,color:"#8AAABB",lineHeight:1.7}}>{feedback}</div>
      </div>}
    </div>
  );
}

function EmailCoach() {
  const [email,setEmail]=useState(""); const [target,setTarget]=useState("directeur commercial PME industrielle");
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  const analyze=async()=>{
    if(!email.trim())return;
    if(!getKey()){setResult({error:"🔒 Clé API manquante — configure-la via le cadenas en haut de l'accueil."});return;}
    setLoading(true); setResult(null);
    try{
      const sys=`Expert copywriting B2B. Analyse AIDA stricte. Réponse JSON uniquement :
{"scores":{"attention":0-25,"interet":0-25,"desir":0-25,"action":0-25},"total":0-100,"problemes":["..."],"version_amelioree":"...","conseil_cle":"..."}`;
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,system:sys,messages:[{role:"user",content:`Analyse cet email destiné à un(e) ${target} :\n\n${email}`}]})});
      const d=await r.json();
      if(!r.ok) throw new Error(d?.error?.message||"Erreur API "+r.status);
      const rawTxt=d?.content?.[0]?.text||"{}";
      const txt=rawTxt.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      setResult(JSON.parse(txt));
    }catch(e){setResult({error:e.message});}
    setLoading(false);
  };
  const sC=result&&!result.error?(result.total||Object.values(result.scores||{}).reduce((a,b)=>a+b,0)):0;
  const gC=sC>80?"#22C55E":sC>60?"#FFB800":"#FF4D6D";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Cible</div>
        <input value={target} onChange={e=>setTarget(e.target.value)} style={{width:"100%",background:"#05050F",border:`1px solid ${C.border}`,color:"#CCC",padding:"8px 10px",borderRadius:5,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"}}/></div>
      <div><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Ton email</div>
        <textarea value={email} onChange={e=>setEmail(e.target.value)} rows={8} placeholder="Colle ton email ici..."
          style={{width:"100%",background:"#05050F",border:`1px solid ${C.border}`,color:"#CCC",padding:12,borderRadius:6,fontSize:12,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",lineHeight:1.6}}/></div>
      <button onClick={analyze} disabled={loading||!email.trim()} style={{padding:"10px 20px",background:loading||!email.trim()?"#111":C.p3,color:loading||!email.trim()?"#333":"#fff",border:"none",borderRadius:4,cursor:loading||!email.trim()?"default":"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1}}>
        {loading?"⏳ Analyse...":"▶ ANALYSER AVEC CLAUDE"}
      </button>
      {result&&!result.error&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"center",padding:"14px 20px",background:C.card,borderRadius:8,border:`1px solid ${gC}33`,flexShrink:0}}>
              <div style={{fontSize:28,fontWeight:800,color:gC}}>{sC}</div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>Score /100</div>
            </div>
            <div style={{flex:1}}>
              {Object.entries(result.scores||{}).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <span style={{fontSize:10,color:C.muted,width:52,textTransform:"capitalize"}}>{k}</span>
                  <div style={{flex:1,height:4,background:"#111",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(v/25)*100}%`,background:v>18?"#22C55E":v>12?"#FFB800":"#FF4D6D",transition:"width 0.5s"}}/>
                  </div>
                  <span style={{fontSize:10,color:"#555",width:20,textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {result.conseil_cle&&<div style={{padding:12,background:`${C.p3}0D`,border:`1px solid ${C.p3}22`,borderRadius:6,fontSize:12,color:"#EEA"}}>🎯 {result.conseil_cle}</div>}
          {result.version_amelioree&&<div>
            <div style={{fontSize:10,color:"#22C55E",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Version améliorée</div>
            <pre style={{background:"#050F08",padding:14,borderRadius:6,fontSize:11,color:"#90D890",lineHeight:1.7,whiteSpace:"pre-wrap",border:"1px solid #22C55E22",margin:0}}>{result.version_amelioree}</pre>
          </div>}
        </div>
      )}
      {result?.error&&<div style={{color:"#FF8888",fontSize:11}}>Erreur : {result.error}</div>}
    </div>
  );
}

function FinancialAnalyzer() {
  const [form,setForm]=useState({name:"",sector:"SaaS B2B",arr:"",burn:"",team:"",desc:""});
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const analyze=async()=>{
    if(!form.name)return;
    if(!getKey()){setResult({error:"🔒 Clé API manquante — configure-la via le cadenas en haut de l'accueil."});return;}
    setLoading(true); setResult(null);
    try{
      const sys=`Analyste PE senior (5Md€ AUM). Analyse en 4 étapes Chain-of-Thought. JSON strict :
{"etape1_revenus":{"analyse":"...","metriques":["..."]},"etape2_finances":{"marge_estimee":"...","burn_assessment":"..."},"etape3_barrieres":{"barriere_1":"...","barriere_2":"...","vulnerabilite":"..."},"etape4_financement":{"recommandation":"...","structure":"...","conditions":"..."},"note":"A|B|C|D","synthese":"..."}`;
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":getKey(),"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,system:sys,messages:[{role:"user",content:`Analyse : ${form.name} | ${form.sector} | ARR: ${form.arr}€ | Burn: ${form.burn}€/mois | Équipe: ${form.team} | ${form.desc}`}]})});
      const d=await r.json();
      if(!r.ok) throw new Error(d?.error?.message||"Erreur API "+r.status);
      const rawTxt=d?.content?.[0]?.text||"{}";
      const txt=rawTxt.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      setResult(JSON.parse(txt));
    }catch(e){setResult({error:e.message});}
    setLoading(false);
  };
  const gc={"A":"#22C55E","B":"#85E090","C":"#FFB800","D":"#FF4D6D"};
  const inp={width:"100%",background:"#05050F",border:`1px solid ${C.border}`,color:"#CCC",padding:"8px 10px",borderRadius:5,fontSize:12,fontFamily:"inherit",boxSizing:"border-box"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{k:"name",l:"Entreprise",ph:"Qonto, Doctrine..."},{k:"sector",l:"Secteur",ph:"SaaS B2B"},{k:"arr",l:"ARR/CA annuel (€)",ph:"2500000"},{k:"burn",l:"Burn mensuel (€)",ph:"80000"},{k:"team",l:"Équipe",ph:"25"}].map(({k,l,ph})=>(
          <div key={k}><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{l}</div>
            <input value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp}/></div>
        ))}
        <div style={{gridColumn:"1/-1"}}><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Description</div>
          <textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={2} placeholder="Plateforme de..." style={{...inp,resize:"none"}}/></div>
      </div>
      <button onClick={analyze} disabled={loading||!form.name} style={{padding:"10px 20px",background:loading||!form.name?"#111":C.p2,color:loading||!form.name?"#333":"#000",border:"none",borderRadius:4,cursor:loading||!form.name?"default":"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700,letterSpacing:1}}>
        {loading?"⏳ Analyse PE en cours...":"▶ ANALYSER AVEC CLAUDE"}
      </button>
      {result&&!result.error&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{padding:"10px 16px",background:C.card,borderRadius:6,border:`1px solid ${gc[result.note]||"#444"}33`,flexShrink:0,textAlign:"center"}}>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>Note</div>
              <div style={{fontSize:24,fontWeight:800,color:gc[result.note]||"#AAA"}}>{result.note}</div>
            </div>
            <p style={{flex:1,fontSize:11,color:"#AAA",lineHeight:1.65,margin:0}}>{result.synthese}</p>
          </div>
          {[{k:"etape1_revenus",l:"Étape 1 — Revenus",c:C.p2},{k:"etape2_finances",l:"Étape 2 — Finances",c:"#85E090"},{k:"etape3_barrieres",l:"Étape 3 — Barrières",c:"#A78BFA"},{k:"etape4_financement",l:"Étape 4 — Financement",c:C.p1}].map(({k,l,c})=>result[k]&&(
            <div key={k} style={{padding:12,background:C.card,borderRadius:6,borderLeft:`3px solid ${c}`}}>
              <div style={{fontSize:10,color:c,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{l}</div>
              {Object.entries(result[k]).map(([ik,iv])=>(
                <div key={ik} style={{marginBottom:4}}>
                  {Array.isArray(iv)?iv.map((item,idx)=><div key={idx} style={{fontSize:11,color:"#AAA",paddingLeft:10,borderLeft:`1px solid ${C.border}`,marginBottom:2}}>· {item}</div>)
                  :<div style={{fontSize:11,color:"#AAA"}}><span style={{color:C.muted,marginRight:6}}>{ik.replace(/_/g," ")} :</span>{iv}</div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {result?.error&&<div style={{color:"#FF8888",fontSize:11}}>Erreur : {result.error}</div>}
    </div>
  );
}

function RunwayCalc() {
  const [cash,setCash]=useState(900000); const [rev,setRev]=useState(70000);
  const [exp,setExp]=useState(140000); const [growth,setGrowth]=useState(8);
  const burn=exp-rev; const runway=burn>0?cash/burn:999;
  const be=growth>0?Math.ceil(Math.log(exp/rev)/Math.log(1+growth/100)):Infinity;
  const st=runway<6?{c:C.p3,l:"🚨 ALARME ROUGE",r:"Lever ou couper immédiatement"}:runway<12?{c:C.p2,l:"⚠️ VIGILANCE",r:"Initier la levée maintenant (3-6 mois de process)"}:runway<18?{c:"#85E090",l:"✅ CORRECT",r:"Lever pour négocier en position de force"}:{c:"#22C55E",l:"💪 FORCE",r:"Tu peux refuser les term sheets défavorables"};
  const fmt=n=>n>=1e6?(n/1e6).toFixed(2)+"M€":(n/1000).toFixed(0)+"k€";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {[{l:"💰 Trésorerie",v:cash,s:setCash,mn:0,mx:5000000,st:50000,fmt:fmt},{l:"📈 MRR mensuel",v:rev,s:setRev,mn:0,mx:500000,st:5000,fmt:fmt},{l:"📉 Charges/mois",v:exp,s:setExp,mn:0,mx:600000,st:5000,fmt:fmt},{l:"🚀 Croissance MRR %/mois",v:growth,s:setGrowth,mn:0,mx:30,st:1,fmt:v=>v+"%"}].map(({l,v,s,mn,mx,st,fmt:f})=>(
        <div key={l}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:11,color:C.muted}}>{l}</span>
            <span style={{fontSize:11,color:"#DDD",fontWeight:700}}>{f(v)}</span>
          </div>
          <input type="range" min={mn} max={mx} step={st} value={v} onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:C.p2}}/>
        </div>
      ))}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[{l:"Burn Net",v:burn>0?"+"+fmt(burn):"✓",c:burn>0?C.p3:"#22C55E"},{l:"Runway",v:runway===999?"∞":Math.round(runway*10)/10+" mois",c:st.c},{l:"Mois avant BE",v:be===Infinity?"∞":be+" mois",c:"#888"}].map(({l,v,c})=>(
          <div key={l} style={{background:C.card,padding:10,borderRadius:6,border:`1px solid ${c}22`,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.muted,marginBottom:3}}>{l}</div>
            <div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{padding:12,background:`${st.c}0D`,border:`1px solid ${st.c}33`,borderRadius:6}}>
        <div style={{fontSize:12,fontWeight:700,color:st.c,marginBottom:3}}>{st.l}</div>
        <div style={{fontSize:11,color:"#AAA"}}>{st.r}</div>
      </div>
    </div>
  );
}

// ─── MODULE SCREEN ────────────────────────────────────────────────────────────
const TOOL_MODULES = { p1m3:"prompt", p3m3:"email", p2m3:"finance", p2m2:"runway" };

function ModuleScreen({ module, scores, setScores, onBack, onNeedKey }) {
  const p = PILIERS[module.pid];
  const pc = p.color;
  const [tab, setTab] = useState("cours");
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [genError, setGenError] = useState("");
  const toolKey = TOOL_MODULES[module.id];

  // Load from storage
  useEffect(() => {
    store.get("course_"+module.id).then(d => { if(d) setCourse(d); });
    store.get("quiz_"+module.id).then(d => { if(d) setQuiz(d); });
  }, [module.id]);

  const generateCourse = async () => {
    const data = EMBEDDED_CONTENT[module.id] || (typeof ADVANCED_CONTENT !== 'undefined' && ADVANCED_CONTENT[module.id]);
    if (!data) { setGenError("Contenu non disponible pour ce module."); return; }
    setCourse(data);
    await store.set("course_"+module.id, data);
  };

  const generateQuiz = async () => {
    const data = EMBEDDED_QUIZZES[module.id] || (typeof ADVANCED_QUIZZES !== 'undefined' && ADVANCED_QUIZZES[module.id]);
    if (!data) return;
    setQuiz(data);
    await store.set("quiz_"+module.id, data);
  };

  const tabs = [
    {k:"cours",l:"📖 Cours"},
    {k:"quiz",l:"📝 Quiz"},
    ...(toolKey?[{k:"outil",l:"🛠 Pratique IA"}]:[]),
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:C.bg}}>
      {/* Header */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:"0 0 8px",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
          ← Modules
        </button>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:9,letterSpacing:2,color:pc,textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{p.icon} {p.sub} · {module.diff}</div>
            <h2 style={{fontSize:18,fontWeight:800,color:"#fff",margin:"0 0 2px",letterSpacing:-0.4,lineHeight:1.2}}>{module.title}</h2>
            <div style={{fontSize:11,color:C.muted}}>{module.sub}</div>
          </div>
          {scores[module.id]!==undefined&&<span style={{fontSize:10,padding:"3px 8px",background:"#22C55E22",color:"#22C55E",borderRadius:20,flexShrink:0,marginTop:4}}>✓ Validé</span>}
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginTop:12,overflowX:"auto",paddingBottom:2}}>
          {tabs.map(({k,l})=>(
            <button key={k} onClick={()=>setTab(k)} style={{padding:"6px 14px",background:tab===k?pc:"transparent",color:tab===k?"#000":C.muted,border:`1px solid ${tab===k?pc:C.border}`,borderRadius:20,cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:tab===k?700:400,whiteSpace:"nowrap",flexShrink:0,transition:"all 0.15s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:16}}>

        {/* COURS TAB */}
        {tab==="cours"&&(
          <div>
            {/* Objectives */}
            <div style={{marginBottom:16,padding:14,background:C.card,borderRadius:8,border:`1px solid ${pc}22`}}>
              <div style={{fontSize:10,color:pc,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:8}}>Objectifs de ce module</div>
              {module.objectives.map((o,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
                  <span style={{color:pc,flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:12,color:"#AABBC8",lineHeight:1.5}}>{o}</span>
                </div>
              ))}
            </div>

            {/* Pre-test prompt */}
            {!course&&!genLoading&&(
              <div style={{marginBottom:16,padding:14,background:"#0A0A1A",borderRadius:8,border:`1px solid ${C.border}`,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:12,lineHeight:1.6}}>
                  🧠 <strong style={{color:C.txt}}>Méthode d'apprentissage actif :</strong> Le cours est généré par Claude avec une profondeur maximale — exemples réels, erreurs fréquentes, standard professionnel, exercice appliqué.
                </div>
                <button onClick={generateCourse} style={{padding:"11px 24px",background:pc,color:"#000",border:"none",borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,letterSpacing:0.5}}>
                  ⚡ Générer le cours complet
                </button>
                {genError&&<div style={{color:"#FF8888",fontSize:11,marginTop:8}}>{genError}</div>}
              </div>
            )}

            {genLoading&&(
              <div style={{padding:32,textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:12,animation:"spin 1s linear infinite",display:"inline-block"}}>⚡</div>
                <div style={{fontSize:12,color:C.muted}}>Claude génère un cours professionnel complet...</div>
                <div style={{fontSize:11,color:C.dim,marginTop:6}}>Exemples réels · Erreurs fréquentes · Standard pro · Exercice</div>
              </div>
            )}

            {course&&(
              <div>
                {/* Intro */}
                <div style={{marginBottom:16,padding:14,background:C.card,borderLeft:`3px solid ${pc}`,borderRadius:"0 8px 8px 0"}}>
                  <p style={{fontSize:13,color:"#CCC",lineHeight:1.8,margin:0,fontStyle:"italic"}}>{course.intro}</p>
                </div>
                {/* Sections */}
                {course.sections?.map((s,i)=><CourseSection key={i} s={s} pc={pc}/>)}
                {/* Synthèse */}
                {course.synthese&&(
                  <div style={{marginTop:8,marginBottom:16,padding:14,background:C.card,borderRadius:8,border:`1px solid #22C55E33`}}>
                    <div style={{fontSize:10,color:"#22C55E",textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:8}}>✓ Synthèse — À retenir absolument</div>
                    {renderContent(course.synthese)}
                  </div>
                )}
                {/* Prochaine étape */}
                {course.prochaine_etape&&(
                  <div style={{padding:14,background:`${pc}0D`,borderRadius:8,border:`1px solid ${pc}33`}}>
                    <div style={{fontSize:10,color:pc,textTransform:"uppercase",letterSpacing:1.5,fontWeight:700,marginBottom:6}}>→ Prochaine étape (dans les 24h)</div>
                    {renderContent(course.prochaine_etape)}
                  </div>
                )}
                {/* Regenerate */}
                <div style={{marginTop:16,textAlign:"center"}}>
                  <button onClick={generateCourse} style={{padding:"7px 14px",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
                    🔄 Regénérer le cours
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {tab==="quiz"&&(
          <div>
            {!quiz&&!quizLoading&&(
              <div style={{padding:24,textAlign:"center",background:C.card,borderRadius:8,border:`1px solid ${C.border}`,marginBottom:16}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:12,lineHeight:1.6}}>
                  📝 <strong style={{color:C.txt}}>Active Recall :</strong> Questions de niveau professionnel générées par Claude. Niveau Application/Analyse (pas juste mémorisation).
                </div>
                <button onClick={generateQuiz} style={{padding:"10px 22px",background:pc,color:"#000",border:"none",borderRadius:6,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>
                  Générer le quiz
                </button>
              </div>
            )}
            {quizLoading&&<div style={{padding:28,textAlign:"center",color:C.muted,fontSize:12}}>⏳ Génération des questions...</div>}
            {quiz&&<Quiz questions={quiz} moduleId={module.id} scores={scores} setScores={setScores}/>}
          </div>
        )}

        {/* TOOLS TAB */}
        {tab==="outil"&&(
          <div>
            {toolKey==="runway"&&<RunwayCalc/>}
            {toolKey==="email"&&<EmailScorer/>}
            {(toolKey==="prompt"||toolKey==="finance")&&(
              <div style={{padding:20,background:C.card,borderRadius:8,border:`1px solid ${C.border}`,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:12}}>🛠</div>
                <div style={{fontSize:13,fontWeight:700,color:"#DDD",marginBottom:8}}>Outil de pratique</div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>
                {toolKey==="prompt"?"Utilise le prompt Few-Shot du cours sur make.com. Valide tes outputs sur jsonlint.com.":"Trouve une startup française et analyse-la avec les méthodes du cours. Calcule LTV:CAC et valorisation estimée."}
              </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ scores, onSelect }) {
  const total = MODULES.length;
  const done = Object.keys(scores).length;
  const pct = Math.round((done/total)*100);

  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"20px 16px 32px"}}>
      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:9,letterSpacing:3,color:C.muted,textTransform:"uppercase",marginBottom:4}}>Formation · 7 Jours</div>
            <h1 style={{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:-1,margin:"0 0 4px"}}>Maîtrise Pro</h1>
            <p style={{fontSize:12,color:C.muted,margin:0}}>IA & Auto · Finance · Copywriting</p>
          </div>
          <button onClick={()=>{}} title="Formation Pro" style={{background:"transparent",border:"none",color:"#333",padding:"6px 8px",cursor:"default",fontSize:14,flexShrink:0,marginTop:2}}>
            ⚡
          </button>
        </div>
        {/* Progress */}
        <div style={{marginTop:14,background:C.card,borderRadius:6,height:5,overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${C.p1},${C.p2},${C.p3})`,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:10,color:C.muted,marginTop:4}}>{done}/{total} modules validés</div>
      </div>

      {/* Methodology badge */}
      <div style={{marginBottom:20,padding:12,background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.p1,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:700}}>🧠 Méthode d'apprentissage</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {["Contenu généré par Claude","Active Recall","Exemples réels","Standard Pro","Pratique délibérée IA"].map(b=>(
            <span key={b} style={{fontSize:10,padding:"3px 8px",background:C.dim,color:C.muted,borderRadius:20}}>{b}</span>
          ))}
        </div>
      </div>

      {/* Piliers */}
      {Object.entries(PILIERS).map(([pid,p])=>{
        const mods = MODULES.filter(m=>m.pid===pid);
        const pdone = mods.filter(m=>scores[m.id]!==undefined).length;
        return (
          <div key={pid} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:18}}>{p.icon}</span>
              <div>
                <div style={{fontSize:9,color:p.color,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>{p.sub}</div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:-0.3}}>{p.name}</div>
              </div>
              <span style={{marginLeft:"auto",fontSize:10,color:C.muted}}>{pdone}/{mods.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {mods.map((m,i)=>{
                const d=scores[m.id]!==undefined;
                const hasCourse=false; // will load from storage
                return (
                  <button key={m.id} onClick={()=>onSelect(m)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:C.card,border:`1px solid ${d?p.color+"44":C.border}`,borderRadius:8,cursor:"pointer",textAlign:"left",width:"100%",transition:"border 0.15s"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${d?p.color:C.dim}`,background:d?p.color:C.dim,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:d?"#000":C.muted}}>
                      {d?"✓":i+1}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:d?"#666":"#DDD",marginBottom:2}}>{m.title}</div>
                      <div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.sub}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
                      <span style={{fontSize:9,color:C.muted}}>{m.time}</span>
                      <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:m.diff==="Fondamental"?C.dim:m.diff==="Intermédiaire"?"#1A1408":"#0A1208",color:m.diff==="Fondamental"?C.muted:m.diff==="Intermédiaire"?"#AA8822":"#22AA55"}}>{m.diff}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* AI Tools summary */}
      <div style={{marginTop:8,padding:14,background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:10,fontWeight:700}}>🤖 Outils IA intégrés</div>
        {[{c:C.p1,t:"Testeur de Prompt",m:"Module 3 — Pilier 1"},{c:C.p3,t:"Coach Email",m:"Module 3 — Pilier 3"},{c:C.p2,t:"Analyste Financier",m:"Module 3 — Pilier 2"},{c:C.p2,t:"Calculateur Runway",m:"Module 2 — Pilier 2"}].map(({c,t,m})=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
            <span style={{fontSize:12,color:"#CCC",flex:1}}>{t}</span>
            <span style={{fontSize:10,color:C.muted}}>{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

function App() {
  const [current, setCurrent] = useState(null);
  const [scores, setScores] = useState({});


  useEffect(() => {
    store.get("scores").then(d => { if(d) setScores(d); });
  }, []);

  const saveScores = useCallback((s) => {
    setScores(s);
    store.set("scores", s);
  }, []);

  return (
    <>
      {current
        ? <ModuleScreen module={current} scores={scores} setScores={saveScores} onBack={()=>setCurrent(null)} onNeedKey={()=>setShowKey(true)}/>
        : <HomeScreen scores={scores} onSelect={setCurrent}/>
      }
    </>
  );
}

// ── PWA ROOT ─────────────────────────────────────────────────────────────────
const rootEl = ReactDOM.createRoot(document.getElementById('root'));
rootEl.render(<App />);

// Hide splash
window.addEventListener('load', () => {
  setTimeout(() => {
    const s = document.getElementById('splash');
    if (s) { s.style.opacity = '0'; setTimeout(() => s.remove(), 500); }
  }, 1800);
});