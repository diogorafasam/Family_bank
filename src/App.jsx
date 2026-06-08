import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── CONFIGURAÇÃO ─────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://iwttpcfxxziivncwcger.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dHRwY2Z4eHppaXZuY3djZ2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTIxODQsImV4cCI6MjA5NjA4ODE4NH0.9To8B31Vz8_wZW4qeXQx1xUE48j8lZtNqs3i0WO3HRQ";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DARK={bg:"#0B0F1A",surface:"#111827",elevated:"#1A2236",border:"#1E2D45",accent:"#00B8D9",accentS:"rgba(0,184,217,0.12)",green:"#00C98B",greenS:"rgba(0,201,139,0.12)",red:"#FF4D6A",redS:"rgba(255,77,106,0.12)",amber:"#F59E0B",amberS:"rgba(245,158,11,0.12)",purple:"#9B5DE5",text:"#F0F4FF",text2:"#8A99B3",text3:"#4A5568",shadow:"rgba(0,0,0,0.35)",trackBg:"#1A2236",modalBg:"rgba(0,0,0,0.78)"};
const LIGHT={bg:"#F0F4FF",surface:"#FFFFFF",elevated:"#F1F5FB",border:"#E2E8F4",accent:"#0284C7",accentS:"rgba(2,132,199,0.1)",green:"#059669",greenS:"rgba(5,150,105,0.1)",red:"#DC2626",redS:"rgba(220,38,38,0.1)",amber:"#D97706",amberS:"rgba(217,119,6,0.1)",purple:"#7C3AED",text:"#0F172A",text2:"#475569",text3:"#94A3B8",shadow:"rgba(15,23,42,0.1)",trackBg:"#E2E8F4",modalBg:"rgba(15,23,42,0.45)"};
const Ctx=createContext(LIGHT);
const useT=()=>useContext(Ctx);
const FONT="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap";
const COLORS5=["#0284C7","#059669","#7C3AED","#D97706","#DB2777"];
const ACC_TYPES=[{id:"checking",label:"Conta à Ordem",icon:"🏦",color:"#0284C7"},{id:"savings",label:"Conta Poupança",icon:"💰",color:"#059669"},{id:"investment",label:"Investimentos",icon:"📈",color:"#7C3AED"},{id:"cash",label:"Dinheiro em Mão",icon:"💵",color:"#D97706"},{id:"crypto",label:"Criptomoedas",icon:"₿",color:"#F59E0B"},{id:"pension",label:"Fundo de Pensão",icon:"🎯",color:"#DB2777"},{id:"other",label:"Outro",icon:"📦",color:"#64748B"}];
const fmt=n=>new Intl.NumberFormat("pt-PT",{style:"currency",currency:"EUR"}).format(n||0);
const uid=()=>crypto.randomUUID();

function makeCSS(T,dark){
  const sh=dark?"":"box-shadow:0 1px 6px "+T.shadow+";";
  const sh2=dark?"":"box-shadow:2px 0 8px "+T.shadow+";";
  return `
@import url('${FONT}');
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text}}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes pf{from{width:0}to{width:var(--w)}}
@keyframes si{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fu{animation:fadeUp .4s ease forwards}.fi{animation:fadeIn .25s ease}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;background:${T.green};box-shadow:0 0 6px ${T.green}}
.mono{font-family:'DM Mono',monospace}
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.track{height:6px;background:${T.trackBg};border-radius:3px;overflow:hidden}
.fill{height:100%;border-radius:3px;animation:pf 1s ease forwards}
.card{background:${T.surface};border:1px solid ${T.border};border-radius:16px;padding:18px;transition:border-color .2s;${sh}}
.card:hover{border-color:${T.accent}55}
.stat{background:${T.surface};border:1px solid ${T.border};border-radius:16px;padding:18px;flex:1;min-width:140px;transition:all .2s;${sh}}
.stat:hover{transform:translateY(-2px);border-color:${T.accent}66}
.btn{background:${T.accent};color:#fff;border:none;border-radius:10px;padding:9px 16px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.btn:hover{opacity:.88;transform:translateY(-1px)}.btn.gr{background:${T.green}}.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.gbtn{background:${T.elevated};color:${T.text2};border:1px solid ${T.border};border-radius:10px;padding:8px 14px;font-family:'DM Sans',sans-serif;font-weight:500;font-size:13px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.gbtn:hover{border-color:${T.accent};color:${T.text}}
.ibtn{background:none;border:none;cursor:pointer;padding:5px;border-radius:7px;color:${T.text3};transition:all .15s;display:inline-flex;align-items:center;justify-content:center;font-size:15px}
.ibtn:hover{background:${T.elevated};color:${T.text}}.ibtn.del:hover{color:${T.red}}.ibtn.edit:hover{color:${T.accent}}
.inp{background:${T.elevated};border:1px solid ${T.border};border-radius:10px;padding:9px 13px;color:${T.text};font-family:'DM Sans',sans-serif;font-size:14px;outline:none;width:100%;transition:border-color .2s}
.inp:focus{border-color:${T.accent}}.inp::placeholder{color:${T.text3}}.inp:disabled{opacity:.5;cursor:not-allowed}
.sel{background:${T.elevated};border:1px solid ${T.border};border-radius:10px;padding:9px 13px;color:${T.text};font-family:'DM Sans',sans-serif;font-size:14px;outline:none;width:100%;cursor:pointer;appearance:none;transition:border-color .2s}
.sel:focus{border-color:${T.accent}}
.nav-i{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;transition:all .15s;color:${T.text2};border:1px solid transparent;white-space:nowrap}
.nav-i:hover{background:${T.elevated};color:${T.text}}.nav-i.on{background:${T.accentS};color:${T.accent};border-color:${T.accent}33}
.modal-bg{position:fixed;inset:0;background:${T.modalBg};backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:800;animation:fadeIn .2s}
.modal{background:${T.surface};border:1px solid ${T.border};border-radius:20px;padding:24px;width:92%;max-width:460px;animation:fadeUp .3s ease;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px ${T.shadow}}
.toast{position:fixed;bottom:74px;right:14px;background:${T.surface};border:1px solid ${T.border};border-radius:14px;padding:12px 16px;z-index:900;animation:si .35s ease;max-width:300px;box-shadow:0 8px 32px ${T.shadow}}
.tr{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;transition:background .15s}.tr:hover{background:${T.elevated}}
.tbl{width:100%;border-collapse:collapse}
.tbl th{padding:10px 14px;font-size:11px;font-weight:600;color:${T.text2};text-transform:uppercase;letter-spacing:.6px;text-align:left;background:${T.elevated};border-bottom:1px solid ${T.border}}
.tbl td{padding:11px 14px;border-bottom:1px solid ${T.border};color:${T.text}}.tbl tr:hover td{background:${T.elevated}}
.tog{width:42px;height:23px;border-radius:12px;position:relative;cursor:pointer;transition:background .2s;border:none;flex-shrink:0}
.knob{position:absolute;top:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.sidebar{flex-shrink:0;background:${T.surface};border-right:1px solid ${T.border};display:flex;flex-direction:column;transition:width .25s cubic-bezier(.4,0,.2,1);overflow:hidden;${sh2}}
.hdr{background:${T.surface};border-bottom:1px solid ${T.border};${sh}}
.bot-nav{position:fixed;bottom:0;left:0;right:0;background:${T.surface};border-top:1px solid ${T.border};height:62px;z-index:200;display:none;align-items:center;justify-content:space-around;padding:0 4px}
.bnav-btn{display:flex;flex-direction:column;align-items:center;gap:2px;flex:1;padding:6px 4px;cursor:pointer;color:${T.text2};border:none;background:none;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;transition:color .15s}
.bnav-btn.on{color:${T.accent}}.bnav-icon{font-size:20px;line-height:1}
.fab{width:46px;height:46px;border-radius:15px;background:${T.accent};border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-size:24px;font-weight:900;box-shadow:0 4px 18px ${T.accent}55;transition:all .2s;flex-shrink:0}
.fab:hover{opacity:.88;transform:scale(1.05)}
.tbtn{background:${T.elevated};border:1px solid ${T.border};border-radius:10px;padding:7px 12px;cursor:pointer;font-size:13px;color:${T.text2};display:flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;transition:all .2s}
.tbtn:hover{border-color:${T.accent};color:${T.text}}
.spinner{width:38px;height:38px;border:3px solid ${T.border};border-top-color:${T.accent};border-radius:50%;animation:spin .8s linear infinite}
@media(max-width:640px){.sidebar{display:none!important}.bot-nav{display:flex!important}.main-wrap{padding-bottom:70px!important}.hide-m{display:none!important}.stat{min-width:calc(50% - 7px)!important;padding:12px!important}.card{padding:13px!important;border-radius:12px!important}.modal{padding:18px!important;width:95%!important}.pad{padding:13px!important}}
@media(min-width:641px){.bot-nav{display:none!important}}
`;}

function Av({m,s=34}){const init=(m.initials||m.name||"?").slice(0,2).toUpperCase();const col=m.color||"#0284C7";return <div style={{width:s,height:s,background:col+"22",border:"2px solid "+col+"55",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:s*.34,fontWeight:700,color:col,flexShrink:0}}>{init}</div>;}
function Prog({pct,color}){const T=useT();return <div className="track"><div className="fill" style={{"--w":Math.min(pct,100)+"%",background:pct>=100?"linear-gradient(90deg,"+T.green+","+T.accent+")":"linear-gradient(90deg,"+color+","+color+"cc)"}}/></div>;}
function Toast({msg,icon,onClose}){useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);return <div className="toast fi"><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{icon}</span><span style={{fontSize:13,fontWeight:600,flex:1}}>{msg}</span><button className="ibtn" onClick={onClose}>×</button></div></div>;}
function Lbl({children}){const T=useT();return <div style={{fontSize:11,color:T.text2,textTransform:"uppercase",letterSpacing:".8px",marginBottom:6}}>{children}</div>;}
function Fld({label,children}){return <div><Lbl>{label}</Lbl>{children}</div>;}
function Tog({on,toggle}){const T=useT();return <button className="tog" style={{background:on?T.accent:T.border}} onClick={toggle}><div className="knob" style={{left:on?22:3}}/></button>;}
function Spinner(){return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:16}}><div className="spinner"/><div style={{fontSize:14,opacity:.6}}>A carregar...</div></div>;}

function Mdl({title,onClose,onSave,saveLabel,children}){return <div className="modal-bg" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h3 style={{fontSize:17,fontWeight:700}}>{title}</h3><button className="ibtn" onClick={onClose} style={{fontSize:22}}>×</button></div>{children}<div style={{display:"flex",gap:9,marginTop:20}}><button className="gbtn" onClick={onClose} style={{flex:1}}>Cancelar</button><button className="btn" onClick={onSave} style={{flex:2,justifyContent:"center"}}>{saveLabel||"Guardar"}</button></div></div></div>;}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen(){
  const T=useT();
  const [mode,setMode]=useState("login");
  const [name,setName]=useState(""); const [famName,setFamName]=useState(""); const [invCode,setInvCode]=useState("");
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false); const [err,setErr]=useState("");

  const doLogin=async()=>{setLoading(true);setErr("");const{error}=await sb.auth.signInWithPassword({email,password:pass});if(error)setErr(error.message);setLoading(false);};
  const doRegister=async()=>{
    if(!name.trim()||!famName.trim()){setErr("Preenche todos os campos");return;}
    setLoading(true);setErr("");
    const{data,error}=await sb.auth.signUp({email,password:pass});
    if(error){setErr(error.message);setLoading(false);return;}
    const uid2=data.user?.id||data.session?.user?.id;
    if(!uid2){setErr("Erro ao criar utilizador. Tenta novamente.");setLoading(false);return;}
    const{data:fam,error:fe}=await sb.from("families").insert({name:famName.trim()}).select().single();
    if(fe){setErr("Erro ao criar família: "+fe.message);setLoading(false);return;}
    await sb.from("family_members").insert({family_id:fam.id,user_id:uid2,name:name.trim(),role:"admin",color:COLORS5[0]});
    setLoading(false);
  };
  const doJoin=async()=>{
    if(!name.trim()||!invCode.trim()){setErr("Preenche todos os campos");return;}
    setLoading(true);setErr("");
    const{data:fam,error:fe}=await sb.from("families").select("id").eq("invite_code",invCode.trim().toUpperCase()).single();
    if(fe||!fam){setErr("Código inválido.");setLoading(false);return;}
    const{data,error}=await sb.auth.signUp({email,password:pass});
    if(error){setErr(error.message);setLoading(false);return;}
    const uid2=data.user?.id||data.session?.user?.id;
    await sb.from("family_members").insert({family_id:fam.id,user_id:uid2,name:name.trim(),role:"member",color:COLORS5[1]});
    setLoading(false);
  };

  const TABS=[{id:"login",l:"Entrar"},{id:"register",l:"Criar família"},{id:"invite",l:"Tenho convite"}];
  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"100%",maxWidth:400}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:60,height:60,background:"linear-gradient(135deg,"+T.accent+","+T.green+")",borderRadius:17,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#fff",margin:"0 auto 12px",boxShadow:"0 8px 24px "+T.accent+"44"}}>F</div>
        <div style={{fontWeight:800,fontSize:22,color:T.text}}>FamilyBank</div>
        <div style={{fontSize:14,color:T.text2,marginTop:3}}>Gestão financeira familiar em tempo real</div>
      </div>
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:20,padding:26,boxShadow:"0 4px 24px "+T.shadow}}>
        <div style={{display:"flex",gap:3,marginBottom:20,background:T.elevated,borderRadius:11,padding:3}}>
          {TABS.map(t=><button key={t.id} onClick={()=>{setMode(t.id);setErr("");}} style={{flex:1,padding:"7px 0",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:mode===t.id?T.surface:"transparent",color:mode===t.id?T.accent:T.text2,transition:"all .2s"}}>{t.l}</button>)}
        </div>
        {err&&<div style={{padding:"10px 13px",background:T.redS,border:"1px solid "+T.red+"44",borderRadius:10,fontSize:13,color:T.red,marginBottom:14}}>{err}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {(mode==="register"||mode==="invite")&&<Fld label="O teu nome"><input className="inp" placeholder="Ex: Diogo" value={name} onChange={e=>setName(e.target.value)}/></Fld>}
          {mode==="register"&&<Fld label="Nome da família"><input className="inp" placeholder="Ex: Família Sampaio" value={famName} onChange={e=>setFamName(e.target.value)}/></Fld>}
          {mode==="invite"&&<Fld label="Código de convite"><input className="inp" placeholder="Ex: FAM2026AB" value={invCode} onChange={e=>setInvCode(e.target.value)} style={{textTransform:"uppercase",letterSpacing:3}}/></Fld>}
          <Fld label="Email"><input className="inp" type="email" placeholder="email@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)}/></Fld>
          <Fld label="Palavra-passe"><input className="inp" type="password" placeholder="Mínimo 6 caracteres" value={pass} onChange={e=>setPass(e.target.value)}/></Fld>
        </div>
        <button className="btn" onClick={mode==="login"?doLogin:mode==="register"?doRegister:doJoin} disabled={loading} style={{width:"100%",justifyContent:"center",marginTop:18}}>
          {loading?"A processar...":mode==="login"?"Entrar →":mode==="register"?"Criar família →":"Entrar na família →"}
        </button>
      </div>
    </div>
  </div>;
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({familyId,onDone}){
  const T=useT();
  const [accs,setAccs]=useState([{id:1,type:"checking",label:"",balance:""},{id:2,type:"savings",label:"",balance:""}]);
  const upd=(id,k,v)=>setAccs(p=>p.map(a=>a.id===id?{...a,[k]:v}:a));
  const add=()=>setAccs(p=>[...p,{id:Date.now(),type:"checking",label:"",balance:""}]);
  const rem=id=>setAccs(p=>p.filter(a=>a.id!==id));
  const total=accs.reduce((s,a)=>s+(parseFloat(a.balance)||0),0);
  const valid=accs.filter(a=>a.label.trim()&&parseFloat(a.balance)>0);
  const [saving,setSaving]=useState(false);
  const finish=async()=>{
    if(!valid.length)return;
    setSaving(true);
    const{error}=await sb.from("accounts").insert(valid.map(a=>({family_id:familyId,type:a.type,label:a.label.trim(),balance:parseFloat(a.balance)})));
    if(error){alert("Erro ao guardar: "+error.message);setSaving(false);return;}
    onDone();
  };
  return <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"100%",maxWidth:520}}>
      <div style={{textAlign:"center",marginBottom:22}}>
        <div style={{fontSize:44,marginBottom:10}}>💳</div>
        <h2 style={{fontSize:20,fontWeight:700,color:T.text}}>Regista o teu dinheiro atual</h2>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6}}>Introduz <strong style={{color:T.text}}>todo o dinheiro que tens agora</strong>. Este será o teu <strong style={{color:T.accent}}>saldo inicial</strong>.</p>
      </div>
      <div style={{background:T.surface,border:"1px solid "+T.border,borderRadius:20,padding:24,boxShadow:"0 4px 24px "+T.shadow}}>
        <div style={{padding:"11px 15px",background:T.accentS,border:"1px solid "+T.accent+"33",borderRadius:12,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,color:T.text2,fontWeight:500}}>Total patrimônio</span>
          <span className="mono" style={{fontSize:20,fontWeight:800,color:T.accent}}>{fmt(total)}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {accs.map(acc=>{
            const at=ACC_TYPES.find(t=>t.id===acc.type)||ACC_TYPES[0];
            return <div key={acc.id} style={{background:T.elevated,border:"1px solid "+T.border,borderRadius:13,padding:13}}>
              <div style={{display:"flex",gap:9,marginBottom:10,alignItems:"center"}}>
                <div style={{width:32,height:32,background:at.color+"18",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{at.icon}</div>
                <select className="sel" value={acc.type} onChange={e=>upd(acc.id,"type",e.target.value)} style={{flex:1}}>{ACC_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}</select>
                {accs.length>1&&<button className="ibtn del" onClick={()=>rem(acc.id)}>🗑</button>}
              </div>
              <div style={{display:"flex",gap:9}}>
                <div style={{flex:2}}><div style={{fontSize:10,color:T.text2,marginBottom:4}}>DESCRIÇÃO</div><input className="inp" placeholder={"Ex: "+at.label+" Bankinter"} value={acc.label} onChange={e=>upd(acc.id,"label",e.target.value)}/></div>
                <div style={{flex:1}}><div style={{fontSize:10,color:T.text2,marginBottom:4}}>SALDO (€)</div><input className="inp" type="number" placeholder="0.00" value={acc.balance} onChange={e=>upd(acc.id,"balance",e.target.value)} style={{fontWeight:700,fontSize:15}}/></div>
              </div>
            </div>;
          })}
        </div>
        <button className="gbtn" onClick={add} style={{marginTop:10,fontSize:12,padding:"7px 13px"}}>+ Adicionar outra conta</button>
        <button className="btn gr" onClick={finish} disabled={saving||!valid.length} style={{width:"100%",justifyContent:"center",marginTop:16}}>
          {saving?"A guardar...":"🚀 Começar a usar"}
        </button>
      </div>
    </div>
  </div>;
}

// ─── REALTIME HOOK ────────────────────────────────────────────────────────────
function useFamily(familyId){
  const [d,setD]=useState({family:null,members:[],accounts:[],transactions:[],goals:[],categories:[],budgets:[]});
  const [loading,setLoading]=useState(true);
  const load=async()=>{
    if(!familyId)return;
    try{
      // Load each separately so one failure doesn't block everything
      const fa=await sb.from("families").select("*").eq("id",familyId).single();
      const me=await sb.from("family_members").select("*").eq("family_id",familyId);
      const ac=await sb.from("accounts").select("*").eq("family_id",familyId).order("created_at");
      const tx=await sb.from("transactions").select("*").eq("family_id",familyId).order("date",{ascending:false});
      const go=await sb.from("goals").select("*").eq("family_id",familyId).order("created_at");
      const ca=await sb.from("categories").select("*").eq("family_id",familyId).order("label");
      const bu=await sb.from("budgets").select("*").eq("family_id",familyId);
      if(tx.error)console.error("TX ERROR:",tx.error.message);
      setD({
        family:fa.data,
        members:me.data||[],
        accounts:ac.data||[],
        transactions:tx.data||[],
        goals:go.data||[],
        categories:ca.data||[],
        budgets:bu.data||[],
      });
    }catch(e){console.error("load error:",e);}
    setLoading(false);
  };
  useEffect(()=>{
    load();
    if(!familyId)return;
    const ch=sb.channel("fb-"+familyId)
      .on("postgres_changes",{event:"*",schema:"public",table:"transactions",filter:"family_id=eq."+familyId},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"accounts",filter:"family_id=eq."+familyId},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"goals",filter:"family_id=eq."+familyId},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"categories",filter:"family_id=eq."+familyId},load)
      .subscribe();
    return()=>sb.removeChannel(ch);
  },[familyId]);
  return{d,loading,reload:load};
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({d}){
  const T=useT();
  const{transactions:tx,members,goals,categories:cats,accounts}=d;
  const inc=tx.filter(t=>t.type==="income").reduce((a,t)=>a+parseFloat(t.amount),0);
  const exp=tx.filter(t=>t.type==="expense").reduce((a,t)=>a+parseFloat(t.amount),0);
  // Saldo real = patrimônio inicial ajustado pelas transações
  const balanceByAccount=accounts.map(acc=>{
    const accTx=tx.filter(t=>t.account_id===acc.id);
    const inflow=accTx.filter(t=>t.type==="income").reduce((s,t)=>s+parseFloat(t.amount),0);
    const outflow=accTx.filter(t=>t.type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);
    return parseFloat(acc.balance)+inflow-outflow;
  });
  const pat=balanceByAccount.reduce((s,b)=>s+b,0);
  const rate=inc>0?((inc-exp)/inc*100).toFixed(1):0;
  const gc=id=>cats.find(c=>c.id===id)||{icon:"📦",label:"Outros",color:"#64748B"};
  const gm=id=>members.find(m=>m.user_id===id)||{name:"?",color:"#64748B"};
  const catTots=cats.map(c=>({...c,total:tx.filter(t=>t.type==="expense"&&t.category===c.id).reduce((a,t)=>a+parseFloat(t.amount),0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);
  return <div style={{display:"flex",flexDirection:"column",gap:18}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      {[{l:"Saldo Total",v:fmt(pat),col:T.accent,i:"🏦"},{l:"Receitas Mês",v:fmt(inc),col:T.green,i:"📥"},{l:"Despesas Mês",v:fmt(exp),col:T.red,i:"📤"},{l:"Taxa Poupança",v:rate+"%",col:T.accent,i:"📊"}].map(s=>
        <div key={s.l} className="stat fu"><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:10,color:T.text2,textTransform:"uppercase",letterSpacing:".8px",marginBottom:5}}>{s.l}</div><div className="mono" style={{fontSize:20,fontWeight:700,color:s.col}}>{s.v}</div></div><span style={{fontSize:24,opacity:.6}}>{s.i}</span></div></div>
      )}
    </div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
      <div className="card fu" style={{flex:"2 1 300px"}}>
        <div style={{fontWeight:600,fontSize:14,marginBottom:10}}>Últimas Transações</div>
        {tx.length===0?<div style={{textAlign:"center",padding:"24px",color:T.text2,fontSize:13}}>Sem transações ainda.</div>:
          tx.slice(0,8).map(t=>{
            const cat=gc(t.category),m=gm(t.user_id);
            const acc=accounts.find(a=>a.id===t.account_id);
            return <div key={t.id} className="tr">
              <div style={{width:34,height:34,background:(cat.color||"#64748B")+"18",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{cat.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description}</div>
                <div style={{fontSize:11,color:T.text2}}>{cat.label}{acc?" · "+acc.label:""} · {m.name}</div>
              </div>
              <div className="mono" style={{fontSize:13,fontWeight:700,color:t.type==="income"?T.green:T.red,flexShrink:0}}>{t.type==="income"?"+":"-"}{fmt(parseFloat(t.amount))}</div>
            </div>;
          })}
      </div>
      <div style={{flex:"1 1 190px",display:"flex",flexDirection:"column",gap:14}}>
        <div className="card fu">
          <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Contas</div>
          {accounts.map((acc,i)=>{
            const at=ACC_TYPES.find(t=>t.id===acc.type)||ACC_TYPES[0];
            const bal=balanceByAccount[i]||0;
            return <div key={acc.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:i>0?"1px solid "+T.border:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{at.icon}</span><span style={{fontSize:13,fontWeight:500}}>{acc.label}</span></div>
              <span className="mono" style={{fontSize:13,fontWeight:700,color:bal>=0?T.green:T.red}}>{fmt(bal)}</span>
            </div>;
          })}
        </div>
        {catTots.length>0&&<div className="card fu">
          <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Por Categoria</div>
          {catTots.slice(0,4).map(cat=><div key={cat.id} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}><span>{cat.icon} {cat.label}</span><span className="mono" style={{color:T.text2}}>{fmt(cat.total)}</span></div><Prog pct={exp>0?(cat.total/exp)*100:0} color={cat.color||"#64748B"}/></div>)}
        </div>}
      </div>
    </div>
    {goals.length>0&&<div className="card fu">
      <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Objetivos de Poupança</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {goals.slice(0,3).map(g=>{const pct=parseFloat(g.current_amount)/parseFloat(g.target)*100;return <div key={g.id} style={{flex:"1 1 180px",background:T.elevated,border:"1px solid "+T.border,borderRadius:12,padding:13}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:18}}>{g.icon}</span><span style={{fontWeight:600,fontSize:13}}>{g.name}</span></div><span className="mono" style={{fontWeight:700,color:g.color||T.accent,fontSize:13}}>{pct.toFixed(0)}%</span></div><Prog pct={pct} color={g.color||T.accent}/><div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,color:T.text2}}><span>{fmt(parseFloat(g.current_amount))}</span><span>{fmt(parseFloat(g.target))}</span></div></div>;})}
      </div>
    </div>}
  </div>;
}

// ─── TRANSAÇÕES ───────────────────────────────────────────────────────────────
function Transactions({d,familyId,userId,toast,reload}){
  const T=useT();
  const{transactions:tx,categories:cats,members,accounts}=d;
  const [mdl,setMdl]=useState(null);
  const [ft,setFt]=useState("all");
  const [search,setSearch]=useState("");
  const gc=id=>cats.find(c=>c.id===id)||{icon:"📦",label:"Outros",color:"#64748B"};
  const gm=id=>members.find(m=>m.user_id===id)||{name:"?",color:"#64748B"};
  const list=tx.filter(t=>ft==="all"||t.type===ft).filter(t=>!search||t.description.toLowerCase().includes(search.toLowerCase()));

  // ── GUARDAR TRANSAÇÃO + ATUALIZAR SALDO DA CONTA ──────────────────────────
  const save=async(f)=>{
    const amount=parseFloat(f.amount);
    const row={
      family_id:familyId,
      user_id:userId,
      type:f.type,
      amount,
      category:f.category||cats[0]?.id||"outros",
      description:f.description,
      date:f.date,
      recurring:f.recurring||false,
      account_id:f.account_id||null,
    };

    let err=null;
    if(f.id){
      // Editar: reverter saldo antigo e aplicar novo
      const oldTx=tx.find(t=>t.id===f.id);
      if(oldTx?.account_id){
        const{data:accData}=await sb.from("accounts").select("balance").eq("id",oldTx.account_id).single();
        if(accData){
          const revert=oldTx.type==="expense"?parseFloat(oldTx.amount):-parseFloat(oldTx.amount);
          await sb.from("accounts").update({balance:parseFloat(accData.balance)+revert}).eq("id",oldTx.account_id);
        }
      }
      const res=await sb.from("transactions").update(row).eq("id",f.id);
      err=res.error;
    } else {
      const res=await sb.from("transactions").insert({...row,id:uid()});
      err=res.error;
    }

    if(err){
      alert("Erro ao guardar transação: "+err.message);
      return;
    }

    // Atualizar saldo da conta
    if(f.account_id){
      const{data:accData}=await sb.from("accounts").select("balance").eq("id",f.account_id).single();
      if(accData){
        const delta=f.type==="income"?amount:-amount;
        await sb.from("accounts").update({balance:parseFloat(accData.balance)+delta}).eq("id",f.account_id);
      }
    }

    toast(f.type==="income"?"Receita: "+fmt(amount):"Despesa: "+fmt(amount),f.type==="income"?"📥":"📤");
    setMdl(null);
    // Force reload to show new transaction
    setTimeout(()=>load(),500);
  };

  // ── ELIMINAR TRANSAÇÃO + REVERTER SALDO ───────────────────────────────────
  const del=async(t)=>{
    if(t.account_id){
      const{data:accData}=await sb.from("accounts").select("balance").eq("id",t.account_id).single();
      if(accData){
        const revert=t.type==="expense"?parseFloat(t.amount):-parseFloat(t.amount);
        await sb.from("accounts").update({balance:parseFloat(accData.balance)+revert}).eq("id",t.account_id);
      }
    }
    await sb.from("transactions").delete().eq("id",t.id);
    toast("Transação eliminada","🗑️");
    setTimeout(()=>load(),500);
  };

  return <div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      <input className="inp" placeholder="🔍 Pesquisar..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:200}}/>
      <select className="sel" value={ft} onChange={e=>setFt(e.target.value)} style={{maxWidth:140}}><option value="all">Todos</option><option value="income">Receitas</option><option value="expense">Despesas</option></select>
      <button className="btn" onClick={()=>setMdl("new")} style={{marginLeft:"auto"}}>+ Nova</button>
    </div>
    <div className="card" style={{padding:0,overflow:"hidden"}}>
      <table className="tbl">
        <thead><tr><th>Descrição</th><th className="hide-m">Conta</th><th className="hide-m">Por</th><th className="hide-m">Data</th><th>Valor</th><th style={{width:72}}>Ações</th></tr></thead>
        <tbody>
          {list.length===0&&<tr><td colSpan={6}><div style={{textAlign:"center",padding:"32px",color:T.text2}}><div style={{fontSize:30,marginBottom:8}}>📭</div>Sem transações</div></td></tr>}
          {list.map(t=>{
            const cat=gc(t.category),m=gm(t.user_id);
            const acc=accounts.find(a=>a.id===t.account_id);
            return <tr key={t.id}>
              <td><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:30,height:30,background:(cat.color||"#64748B")+"18",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{cat.icon}</div><div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}>{t.description}</div><div style={{fontSize:11,color:T.text2}}>{cat.label}</div></div></div></td>
              <td className="hide-m" style={{fontSize:12,color:T.text2}}>{acc?acc.label:"—"}</td>
              <td className="hide-m"><div style={{display:"flex",alignItems:"center",gap:5}}><Av m={m} s={20}/><span style={{fontSize:12,color:T.text2}}>{m.name}</span></div></td>
              <td className="hide-m" style={{fontSize:12,color:T.text2}}>{t.date}</td>
              <td><span className="mono" style={{fontSize:13,fontWeight:700,color:t.type==="income"?T.green:T.red}}>{t.type==="income"?"+":"-"}{fmt(parseFloat(t.amount))}</span></td>
              <td><div style={{display:"flex",gap:2}}><button className="ibtn edit" onClick={()=>setMdl(t)}>✏️</button><button className="ibtn del" onClick={()=>del(t)}>🗑</button></div></td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    {mdl&&<TxModal init={mdl==="new"?null:mdl} cats={cats} accounts={accounts} onClose={()=>setMdl(null)} onSave={save}/>}
  </div>;
}

function TxModal({init,cats,accounts,onClose,onSave}){
  const T=useT();
  const blank={type:"expense",amount:"",category:cats[0]?.id||"",description:"",date:new Date().toISOString().slice(0,10),recurring:false,account_id:accounts[0]?.id||""};
  const [f,setF]=useState(init?{...init,amount:String(parseFloat(init.amount)),account_id:init.account_id||accounts[0]?.id||""}:blank);
  const h=(k,v)=>setF(p=>({...p,[k]:v}));
  const tc=f.type==="income"?T.green:T.red;
  const selAcc=accounts.find(a=>a.id===f.account_id);
  const at=selAcc?ACC_TYPES.find(t=>t.id===selAcc.type)||ACC_TYPES[0]:null;
  return <Mdl title={init?"Editar Transação":"Nova Transação"} onClose={onClose} onSave={()=>{if(!f.amount||!f.description)return;onSave(f);}} saveLabel={init?"Guardar":"Adicionar"}>
    <div style={{display:"flex",gap:7,marginBottom:14}}>
      {["expense","income"].map(t=><button key={t} onClick={()=>h("type",t)} style={{flex:1,padding:"8px",borderRadius:9,border:"1px solid",cursor:"pointer",fontSize:12,fontWeight:600,background:f.type===t?tc+"18":"transparent",color:f.type===t?tc:T.text2,borderColor:f.type===t?tc:T.border}}>{t==="expense"?"📤 Despesa":"📥 Receita"}</button>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Fld label="Valor (€)"><input className="inp" type="number" placeholder="0.00" value={f.amount} onChange={e=>h("amount",e.target.value)} style={{fontSize:20,fontWeight:700}}/></Fld>
      <Fld label="Descrição"><input className="inp" placeholder="Ex: Supermercado Pingo Doce" value={f.description} onChange={e=>h("description",e.target.value)}/></Fld>
      <Fld label="Conta">
        <select className="sel" value={f.account_id} onChange={e=>h("account_id",e.target.value)}>
          <option value="">Sem conta associada</option>
          {accounts.map(a=>{const at2=ACC_TYPES.find(t=>t.id===a.type)||ACC_TYPES[0];return <option key={a.id} value={a.id}>{at2.icon} {a.label} — {fmt(parseFloat(a.balance))}</option>;})}
        </select>
        {selAcc&&<div style={{marginTop:8,padding:"8px 12px",background:at?at.color+"11":T.elevated,border:"1px solid "+(at?at.color+"44":T.border),borderRadius:9,fontSize:12,color:T.text2,display:"flex",justifyContent:"space-between"}}>
          <span>{at?.icon} {selAcc.label}</span>
          <span className="mono" style={{fontWeight:600,color:f.type==="expense"?T.red:T.green}}>
            {f.type==="expense"?"→ ":"← "}{fmt(Math.abs(parseFloat(f.amount)||0))}
          </span>
        </div>}
      </Fld>
      <div style={{display:"flex",gap:11}}>
        <Fld label="Categoria"><select className="sel" value={f.category} onChange={e=>h("category",e.target.value)}>{cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select></Fld>
        <Fld label="Data"><input className="inp" type="date" value={f.date} onChange={e=>h("date",e.target.value)}/></Fld>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",fontSize:13}}><input type="checkbox" checked={f.recurring} onChange={e=>h("recurring",e.target.checked)} style={{width:15,height:15,accentColor:T.accent}}/>Pagamento recorrente</label>
    </div>
  </Mdl>;
}

// ─── CONTAS ───────────────────────────────────────────────────────────────────
function Accounts({d,familyId,toast}){
  const T=useT();
  const{accounts,transactions:tx}=d;
  const [mdl,setMdl]=useState(null);

  // Calcular saldo real de cada conta (saldo inicial + transações)
  const accsWithBal=accounts.map(acc=>{
    const accTx=tx.filter(t=>t.account_id===acc.id);
    const inflow=accTx.filter(t=>t.type==="income").reduce((s,t)=>s+parseFloat(t.amount),0);
    const outflow=accTx.filter(t=>t.type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);
    return{...acc,realBalance:parseFloat(acc.balance)+inflow-outflow};
  });
  const total=accsWithBal.reduce((s,a)=>s+a.realBalance,0);

  const save=async(f)=>{
    const row={family_id:familyId,type:f.type,label:f.label.trim(),balance:parseFloat(f.balance)};
    if(f.id)await sb.from("accounts").update(row).eq("id",f.id);
    else await sb.from("accounts").insert({...row,id:uid()});
    toast("Conta guardada","🏦");setMdl(null);
  };
  const del=async(id)=>{await sb.from("accounts").delete().eq("id",id);toast("Conta eliminada","🗑️");};

  return <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h2 style={{fontSize:17,fontWeight:600}}>Contas e Patrimônio</h2><p style={{fontSize:13,color:T.text2,marginTop:3}}>Saldos atualizados em tempo real</p></div><button className="btn" onClick={()=>setMdl("new")}>+ Nova conta</button></div>
    <div style={{background:"linear-gradient(135deg,"+T.accent+","+T.green+")",borderRadius:18,padding:"22px 24px",color:"#fff"}}>
      <div style={{fontSize:11,opacity:.8,marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>Saldo Total Atual</div>
      <div className="mono" style={{fontSize:32,fontWeight:900,marginBottom:3}}>{fmt(total)}</div>
      <div style={{fontSize:13,opacity:.75}}>{accounts.length} conta{accounts.length!==1?"s":""}</div>
    </div>
    {accounts.length===0?<div className="card" style={{textAlign:"center",padding:"36px",color:T.text2}}><p style={{marginBottom:14}}>Adiciona as tuas contas.</p><button className="btn" onClick={()=>setMdl("new")} style={{margin:"0 auto"}}>+ Adicionar</button></div>
    :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:13}}>
      {accsWithBal.map(acc=>{
        const at=ACC_TYPES.find(t=>t.id===acc.type)||ACC_TYPES[0];
        const pct=total>0?(acc.realBalance/total)*100:0;
        const accTx=tx.filter(t=>t.account_id===acc.id);
        const inflow=accTx.filter(t=>t.type==="income").reduce((s,t)=>s+parseFloat(t.amount),0);
        const outflow=accTx.filter(t=>t.type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);
        return <div key={acc.id} className="card fu" style={{position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+at.color+","+at.color+"44)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:40,height:40,background:at.color+"18",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{at.icon}</div><div><div style={{fontWeight:600,fontSize:14}}>{acc.label}</div><div style={{fontSize:11,color:T.text2}}>{at.label}</div></div></div>
            <div style={{display:"flex",gap:3}}><button className="ibtn edit" onClick={()=>setMdl(acc)}>✏️</button><button className="ibtn del" onClick={()=>del(acc.id)}>🗑</button></div>
          </div>
          <div className="mono" style={{fontSize:24,fontWeight:800,color:at.color,marginBottom:6}}>{fmt(acc.realBalance)}</div>
          {(inflow>0||outflow>0)&&<div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
            {inflow>0&&<span style={{fontSize:11,color:T.green,background:T.greenS,padding:"2px 8px",borderRadius:20}}>+{fmt(inflow)} entradas</span>}
            {outflow>0&&<span style={{fontSize:11,color:T.red,background:T.redS,padding:"2px 8px",borderRadius:20}}>-{fmt(outflow)} saídas</span>}
          </div>}
          <div style={{fontSize:11,color:T.text2,marginBottom:6}}>Inicial: <span className="mono">{fmt(parseFloat(acc.balance))}</span></div>
          <div style={{height:5,background:T.trackBg,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:Math.max(0,pct)+"%",background:at.color,borderRadius:3}}/></div>
          <div style={{fontSize:11,color:T.text2,marginTop:4}}>{pct.toFixed(1)}% do saldo total</div>
        </div>;
      })}
    </div>}
    {mdl&&<AccModal init={mdl==="new"?null:mdl} onClose={()=>setMdl(null)} onSave={save}/>}
  </div>;
}

function AccModal({init,onClose,onSave}){
  const T=useT();
  const blank={type:"checking",label:"",balance:""};
  const [f,setF]=useState(init?{...init,balance:String(parseFloat(init.balance))}:blank);
  const h=(k,v)=>setF(p=>({...p,[k]:v}));
  const at=ACC_TYPES.find(t=>t.id===f.type)||ACC_TYPES[0];
  return <Mdl title={init?"Editar Conta":"Nova Conta"} onClose={onClose} onSave={()=>{if(!f.label||!f.balance)return;onSave(f);}} saveLabel={init?"Guardar":"Adicionar"}>
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <Fld label="Tipo"><select className="sel" value={f.type} onChange={e=>h("type",e.target.value)}>{ACC_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}</select></Fld>
      <Fld label="Nome"><input className="inp" placeholder={"Ex: "+at.label+" Bankinter"} value={f.label} onChange={e=>h("label",e.target.value)}/></Fld>
      <Fld label={init?"Saldo atual (€)":"Saldo inicial (€)"}><input className="inp" type="number" placeholder="0.00" value={f.balance} onChange={e=>h("balance",e.target.value)} style={{fontSize:22,fontWeight:700}}/></Fld>
      <div style={{padding:"10px 13px",background:T.accentS,borderRadius:9,border:"1px solid "+T.accent+"33",fontSize:12,color:T.text2,lineHeight:1.6}}>
        {init?"Corrige o saldo inicial se necessário. As transações associadas atualizam automaticamente.":"Introduz o saldo que tens hoje nesta conta. Cada despesa/receita irá atualizá-la."}
      </div>
    </div>
  </Mdl>;
}

// ─── OBJETIVOS ────────────────────────────────────────────────────────────────
function Goals({d,familyId,toast}){
  const T=useT();
  const{goals}=d;
  const [mdl,setMdl]=useState(null);
  const mo=dd=>Math.max(0,Math.round((new Date(dd)-new Date())/(1000*60*60*24*30)));
  const save=async(f)=>{
    const row={family_id:familyId,name:f.name,icon:f.icon,color:f.color,target:parseFloat(f.target),current_amount:parseFloat(f.current||0),deadline:f.deadline||null};
    if(f.id)await sb.from("goals").update(row).eq("id",f.id);
    else await sb.from("goals").insert({...row,id:uid()});
    toast("Objetivo guardado!",f.icon);setMdl(null);
  };
  const del=async(id)=>{await sb.from("goals").delete().eq("id",id);toast("Objetivo eliminado","🗑️");};
  return <div style={{display:"flex",flexDirection:"column",gap:15}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h2 style={{fontSize:17,fontWeight:600}}>Objetivos de Poupança</h2><p style={{fontSize:13,color:T.text2,marginTop:3}}>Visível por toda a família</p></div><button className="btn" onClick={()=>setMdl("new")}>+ Novo</button></div>
    {goals.length===0&&<div className="card" style={{textAlign:"center",padding:"36px",color:T.text2}}><div style={{fontSize:36,marginBottom:10}}>🎯</div><p style={{marginBottom:14}}>Cria o primeiro objetivo.</p><button className="btn" onClick={()=>setMdl("new")} style={{margin:"0 auto"}}>+ Criar objetivo</button></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:13}}>
      {goals.map(g=>{
        const pct=parseFloat(g.current_amount)/parseFloat(g.target)*100;
        const months=g.deadline?mo(g.deadline):0;
        const monthly=months>0?(parseFloat(g.target)-parseFloat(g.current_amount))/months:0;
        return <div key={g.id} className="card fu" style={{position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,"+(g.color||T.accent)+","+(g.color||T.accent)+"44)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:40,height:40,background:(g.color||T.accent)+"18",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{g.icon}</div><div><div style={{fontWeight:600,fontSize:14}}>{g.name}</div>{g.deadline&&<div style={{fontSize:11,color:T.text2}}>Prazo: {g.deadline}</div>}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><span className="mono" style={{fontSize:17,fontWeight:700,color:g.color||T.accent}}>{pct.toFixed(0)}%</span><button className="ibtn edit" onClick={()=>setMdl(g)}>✏️</button><button className="ibtn del" onClick={()=>del(g.id)}>🗑</button></div>
          </div>
          <div style={{marginBottom:10}}><Prog pct={pct} color={g.color||T.accent}/></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
            <div><div className="mono" style={{fontWeight:600}}>{fmt(parseFloat(g.current_amount))}</div><div style={{color:T.text2}}>atual</div></div>
            {months>0&&<div style={{textAlign:"center"}}><div className="mono" style={{fontWeight:600,color:T.amber}}>{fmt(monthly)}</div><div style={{color:T.text2}}>/mês</div></div>}
            <div style={{textAlign:"right"}}><div className="mono" style={{fontWeight:600}}>{fmt(parseFloat(g.target))}</div><div style={{color:T.text2}}>objetivo</div></div>
          </div>
          <div style={{marginTop:10,background:T.elevated,borderRadius:8,padding:"7px 10px",fontSize:12,color:T.text2}}>{months>0?"⏳ "+months+" meses · faltam "+fmt(parseFloat(g.target)-parseFloat(g.current_amount)):"🎉 Objetivo atingido!"}</div>
        </div>;
      })}
    </div>
    {mdl&&<GoalModal init={mdl==="new"?null:mdl} onClose={()=>setMdl(null)} onSave={save}/>}
  </div>;
}

function GoalModal({init,onClose,onSave}){
  const T=useT();
  const ICONS=["🏖️","🛡️","🚗","🏡","📚","✈️","💍","🎓","🏥","🎮","📱","🛋️","🐶","🎵","⚽"];
  const COLS=[T.accent,T.green,T.amber,T.red,T.purple,"#DB2777"];
  const blank={name:"",icon:"🎯",color:T.accent,target:"",current:"0",deadline:""};
  const [f,setF]=useState(init?{...init,target:String(parseFloat(init.target)),current:String(parseFloat(init.current_amount))}:blank);
  const h=(k,v)=>setF(p=>({...p,[k]:v}));
  const mo=f.deadline&&f.target?Math.max(1,Math.round((new Date(f.deadline)-new Date())/(1000*60*60*24*30))):1;
  const monthly=parseFloat(f.target||0)>0?Math.max(0,(parseFloat(f.target)-parseFloat(f.current||0))/mo):0;
  return <Mdl title={init?"Editar":"Novo Objetivo"} onClose={onClose} onSave={()=>{if(!f.name||!f.target)return;onSave(f);}} saveLabel={init?"Guardar":"Criar"}>
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <Fld label="Ícone"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{ICONS.map(ic=><button key={ic} onClick={()=>h("icon",ic)} style={{width:36,height:36,borderRadius:9,border:"2px solid",cursor:"pointer",fontSize:18,background:f.icon===ic?T.accentS:T.elevated,borderColor:f.icon===ic?T.accent:T.border}}>{ic}</button>)}</div></Fld>
      <Fld label="Nome"><input className="inp" placeholder="Ex: Férias no Algarve..." value={f.name} onChange={e=>h("name",e.target.value)}/></Fld>
      <div style={{display:"flex",gap:11}}>
        <Fld label="Valor alvo (€)"><input className="inp" type="number" placeholder="0" value={f.target} onChange={e=>h("target",e.target.value)}/></Fld>
        <Fld label="Já poupado (€)"><input className="inp" type="number" placeholder="0" value={f.current} onChange={e=>h("current",e.target.value)}/></Fld>
      </div>
      <Fld label="Data limite"><input className="inp" type="date" value={f.deadline} onChange={e=>h("deadline",e.target.value)}/></Fld>
      <Fld label="Cor"><div style={{display:"flex",gap:8}}>{COLS.map(col=><button key={col} onClick={()=>h("color",col)} style={{width:28,height:28,borderRadius:"50%",background:col,border:"3px solid",cursor:"pointer",borderColor:f.color===col?"#fff":"transparent"}}/>)}</div></Fld>
      {f.target&&f.deadline&&<div style={{padding:"10px 13px",background:T.accentS,borderRadius:9,border:"1px solid "+T.accent+"33",fontSize:12,color:T.text2,lineHeight:1.6}}>Precisas de <strong style={{color:T.accent}}>{fmt(monthly)}/mês</strong> para atingir <strong style={{color:T.text}}>{fmt(parseFloat(f.target))}</strong></div>}
    </div>
  </Mdl>;
}

// ─── MEMBROS ─────────────────────────────────────────────────────────────────
function Members({d,familyId,toast}){
  const T=useT();
  const{members,family,transactions:tx}=d;
  const code=family?.invite_code||"...";
  const [copied,setCopied]=useState(false);
  const [shareMsg,setShareMsg]=useState(false);
  const copy=()=>{
    try{navigator.clipboard.writeText(code);}catch(e){}
    setCopied(true);setTimeout(()=>setCopied(false),2500);
    toast("Código copiado!","📋");
  };
  const share=()=>{
    const msg="Olá! Podes juntar-te à nossa família no FamilyBank.\n\nLink: "+window.location.origin+"\nCódigo de convite: "+code.toUpperCase()+"\n\n1. Abre o link\n2. Escolhe 'Tenho convite'\n3. Insere o código acima";
    if(navigator.share){navigator.share({title:"FamilyBank — Convite",text:msg});}
    else{try{navigator.clipboard.writeText(msg);}catch(e){}toast("Mensagem copiada para partilhar!","📤");}
  };

  return <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div><h2 style={{fontSize:17,fontWeight:600}}>Membros da Família</h2><p style={{fontSize:13,color:T.text2,marginTop:3}}>{family?.name||"—"} · {members.length} membro{members.length!==1?"s":""}</p></div>

    {/* Cards dos membros */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
      {members.map(m=>{
        const mTx=tx.filter(t=>t.user_id===m.user_id);
        const mExp=mTx.filter(t=>t.type==="expense").reduce((s,t)=>s+parseFloat(t.amount),0);
        const mInc=mTx.filter(t=>t.type==="income").reduce((s,t)=>s+parseFloat(t.amount),0);
        return <div key={m.id} className="card fu">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <Av m={m} s={46}/>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{m.name}</div>
              <span className="badge" style={{background:m.role==="admin"?T.accentS:T.elevated,color:m.role==="admin"?T.accent:T.text2,marginTop:4}}>{m.role==="admin"?"⭐ Admin":"👤 Membro"}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:9}}>
            <div style={{flex:1,background:T.elevated,borderRadius:9,padding:"8px 11px"}}>
              <div style={{fontSize:10,color:T.text2,marginBottom:3}}>RECEITAS</div>
              <div className="mono" style={{fontSize:13,fontWeight:700,color:T.green}}>{fmt(mInc)}</div>
            </div>
            <div style={{flex:1,background:T.elevated,borderRadius:9,padding:"8px 11px"}}>
              <div style={{fontSize:10,color:T.text2,marginBottom:3}}>DESPESAS</div>
              <div className="mono" style={{fontSize:13,fontWeight:700,color:T.red}}>{fmt(mExp)}</div>
            </div>
          </div>
        </div>;
      })}
    </div>

    {/* Convidar novo membro */}
    <div className="card" style={{border:"2px dashed "+T.accent+"44"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{width:40,height:40,background:T.accentS,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👋</div>
        <div><div style={{fontWeight:600,fontSize:15}}>Convidar membro</div><div style={{fontSize:13,color:T.text2,marginTop:2}}>Partilha o código para alguém entrar na família</div></div>
      </div>

      {/* Código */}
      <div style={{padding:"14px 18px",background:T.elevated,border:"2px dashed "+T.accent+"44",borderRadius:12,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:T.text2,marginBottom:4,textTransform:"uppercase",letterSpacing:".8px"}}>Código de convite</div>
          <span className="mono" style={{fontSize:22,letterSpacing:5,color:T.accent,fontWeight:800}}>{code.toUpperCase()}</span>
        </div>
        <button className="btn" onClick={copy} style={{flexShrink:0}}>{copied?"✓ Copiado!":"📋 Copiar"}</button>
      </div>

      {/* Instruções */}
      <div style={{background:T.elevated,borderRadius:12,padding:"13px 15px",marginBottom:12}}>
        <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Como a outra pessoa entra:</div>
        {[
          {n:"1",t:"Abre o link da app",s:window.location.origin},
          {n:"2",t:"Toca em "Tenho convite"",s:"No ecrã de login"},
          {n:"3",t:"Preenche o nome e email",s:"Cria uma palavra-passe nova"},
          {n:"4",t:"Insere o código acima",s:"E toca em "Entrar na família""},
        ].map(step=><div key={step.n} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:T.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>{step.n}</div>
          <div><div style={{fontSize:13,fontWeight:500}}>{step.t}</div><div style={{fontSize:11,color:T.text2,marginTop:1}}>{step.s}</div></div>
        </div>)}
      </div>

      {/* Botão partilhar */}
      <button className="btn" onClick={share} style={{width:"100%",justifyContent:"center"}}>
        📤 Partilhar convite (WhatsApp / Mensagem)
      </button>
    </div>
  </div>;
}

// ─── DEFINIÇÕES ───────────────────────────────────────────────────────────────
function Settings({user,dark,setDark,onLogout}){
  const T=useT();
  const [pass,setPass]=useState(""); const [saving,setSaving]=useState(false); const [msg,setMsg]=useState("");
  const changePass=async()=>{if(pass.length<6){setMsg("Mínimo 6 caracteres");return;}setSaving(true);const{error}=await sb.auth.updateUser({password:pass});setSaving(false);setPass("");setMsg(error?error.message:"✓ Atualizada!");};
  return <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div><h2 style={{fontSize:17,fontWeight:600}}>Definições</h2></div>
    <div className="card"><div style={{fontWeight:600,fontSize:14,marginBottom:14}}>Aparência</div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:14}}>Modo Escuro</span><Tog on={dark} toggle={()=>setDark(p=>!p)}/></div></div>
    <div className="card"><div style={{fontWeight:600,fontSize:14,marginBottom:14}}>Segurança</div><div style={{marginBottom:13}}><Lbl>Nova palavra-passe</Lbl><input className="inp" type="password" placeholder="Mínimo 6 caracteres" value={pass} onChange={e=>setPass(e.target.value)}/></div>{msg&&<div style={{fontSize:13,color:msg.startsWith("✓")?T.green:T.red,marginBottom:10}}>{msg}</div>}<button className="btn" onClick={changePass} disabled={saving} style={{justifyContent:"center"}}>{saving?"A guardar...":"Atualizar"}</button></div>
    <div className="card"><div style={{fontWeight:600,fontSize:14,marginBottom:14}}>Conta</div><div style={{fontSize:13,color:T.text2,marginBottom:14}}>Sessão: <strong style={{color:T.text}}>{user?.email}</strong></div><button className="gbtn" onClick={onLogout} style={{borderColor:T.red,color:T.red}}>Terminar sessão</button></div>
  </div>;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [dark,setDark]=useState(false);
  const T=dark?DARK:LIGHT;
  const CSS=useMemo(()=>makeCSS(T,dark),[dark]);
  const [user,setUser]=useState(null);
  const [familyId,setFamilyId]=useState(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [tab,setTab]=useState("dashboard");
  const [toasts,setToasts]=useState([]);
  const [sidebar,setSidebar]=useState(true);
  const toast=(msg,icon)=>{const id=uid();setToasts(p=>[...p,{id,msg,icon:icon||"🔔"}]);};

  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUser(session.user);loadMember(session.user.id);}
      else setAuthLoading(false);
    });
    const{data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUser(session.user);loadMember(session.user.id);}
      else{setUser(null);setFamilyId(null);setAuthLoading(false);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  const loadMember=async(userId)=>{
    try{
      const{data}=await sb.from("family_members").select("*").eq("user_id",userId);
      if(data&&data.length>0)setFamilyId(data[0].family_id);
    }catch(e){console.error("loadMember:",e);}
    setAuthLoading(false);
  };

  const logout=async()=>await sb.auth.signOut();
  const{d,loading:dataLoading,reload}=useFamily(familyId);

  const NAV_M=[{id:"dashboard",icon:"⊞",label:"Dashboard"},{id:"accounts",icon:"🏦",label:"Contas"},{id:"transactions",icon:"↕",label:"Transações"},{id:"goals",icon:"🎯",label:"Objetivos"},{id:"members",icon:"👥",label:"Membros"}];
  const NAV_B=[{id:"settings",icon:"⚙️",label:"Definições"}];
  const allNav=[...NAV_M,...NAV_B];
  const cur=allNav.find(n=>n.id===tab);
  const BNAV=[{id:"dashboard",icon:"⊞",label:"Início"},{id:"accounts",icon:"🏦",label:"Contas"},{id:"transactions",icon:"↕",label:"Transações"},{id:"goals",icon:"🎯",label:"Objetivos"},{id:"settings",icon:"⚙️",label:"Definições"}];

  if(authLoading)return(<Ctx.Provider value={T}><style dangerouslySetInnerHTML={{__html:CSS}}/><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg}}><div className="spinner"/></div></Ctx.Provider>);
  if(!user)return(<Ctx.Provider value={T}><style dangerouslySetInnerHTML={{__html:CSS}}/><AuthScreen/></Ctx.Provider>);
  if(!familyId)return(<Ctx.Provider value={T}><style dangerouslySetInnerHTML={{__html:CSS}}/><div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,padding:20,textAlign:"center"}}><div style={{fontSize:40}}>⚠️</div><div style={{fontSize:16,fontWeight:600,color:T.text}}>Conta criada!</div><div style={{fontSize:14,color:T.text2,lineHeight:1.6}}>A tua conta foi criada mas ainda não está ligada a uma família. Tenta terminar sessão e entrar novamente.</div><button onClick={logout} style={{marginTop:8,padding:"10px 24px",background:T.accent,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>Terminar sessão</button></div></Ctx.Provider>);
  if(!dataLoading&&d.accounts.length===0)return(<Ctx.Provider value={T}><style dangerouslySetInnerHTML={{__html:CSS}}/><Onboarding familyId={familyId} onDone={()=>{}}/></Ctx.Provider>);

  return(<Ctx.Provider value={T}>
    <style dangerouslySetInnerHTML={{__html:CSS}}/>
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:T.bg}}>
      <div className="sidebar" style={{width:sidebar?220:62}}>
        <div style={{padding:"16px 12px",borderBottom:"1px solid "+T.border}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,flexShrink:0,background:"linear-gradient(135deg,"+T.accent+","+T.green+")",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#fff",boxShadow:"0 4px 14px "+T.accent+"44"}}>F</div>{sidebar&&<div style={{overflow:"hidden"}}><div style={{fontWeight:800,fontSize:14,color:T.text,whiteSpace:"nowrap"}}>FamilyBank</div><div style={{fontSize:11,color:T.text2,marginTop:1,display:"flex",alignItems:"center",gap:5}}><span className="dot"/><span>Tempo real</span></div></div>}</div></div>
        <nav style={{flex:1,padding:"9px 7px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
          {sidebar&&<div style={{fontSize:10,color:T.text3,padding:"7px 7px 3px",textTransform:"uppercase",letterSpacing:"1px"}}>Principal</div>}
          {NAV_M.map(item=><div key={item.id} className={"nav-i "+(tab===item.id?"on":"")} onClick={()=>setTab(item.id)} title={!sidebar?item.label:undefined}><span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>{sidebar&&<span style={{fontSize:13}}>{item.label}</span>}</div>)}
          {sidebar&&<div style={{fontSize:10,color:T.text3,padding:"13px 7px 3px",textTransform:"uppercase",letterSpacing:"1px"}}>Geral</div>}
          {NAV_B.map(item=><div key={item.id} className={"nav-i "+(tab===item.id?"on":"")} onClick={()=>setTab(item.id)} title={!sidebar?item.label:undefined}><span style={{fontSize:15,flexShrink:0}}>{item.icon}</span>{sidebar&&<span style={{fontSize:13}}>{item.label}</span>}</div>)}
        </nav>
        {sidebar&&<div style={{padding:"12px 11px",borderTop:"1px solid "+T.border}}>
          <div style={{fontSize:10,color:T.text3,marginBottom:6,textTransform:"uppercase",letterSpacing:".8px"}}>{d.family?.name||"Família"}</div>
          <div className="mono" style={{fontSize:18,fontWeight:800,color:T.accent}}>{fmt(d.accounts.reduce((s,a)=>s+parseFloat(a.balance),0))}</div>
          <div style={{marginTop:6,display:"flex",gap:4}}>{d.members.slice(0,4).map(m=><Av key={m.id} m={m} s={24}/>)}</div>
        </div>}
        <div style={{padding:"7px",borderTop:"1px solid "+T.border}}><button className="gbtn" onClick={()=>setSidebar(p=>!p)} style={{width:"100%",justifyContent:"center",padding:"7px",fontSize:12}}>{sidebar?"◀ Recolher":"▶"}</button></div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <div className="hdr" style={{padding:"10px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <div style={{minWidth:0}}><h1 style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:6,color:T.text}}><span>{cur?.icon}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cur?.label}</span></h1><div className="hide-m" style={{fontSize:11,color:T.text2,marginTop:1}}>{d.family?.name||"—"}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
            <button className="tbtn" onClick={()=>setDark(p=>!p)}>{dark?"☀️":"🌙"}</button>
            <div className="hide-m" style={{display:"flex",gap:3}}>{d.members.slice(0,3).map(m=><Av key={m.id} m={m} s={27}/>)}</div>
            {tab==="transactions"&&<button className="btn hide-m" onClick={()=>{}}>+ Adicionar</button>}
          </div>
        </div>
        <div className="main-wrap pad" style={{flex:1,overflow:"auto",padding:"18px",background:T.bg}}>
          {dataLoading?<Spinner/>:<>
            {tab==="dashboard"&&<Dashboard d={d}/>}
            {tab==="accounts"&&<Accounts d={d} familyId={familyId} toast={toast}/>}
            {tab==="transactions"&&<Transactions d={d} familyId={familyId} userId={user.id} toast={toast} reload={reload}/>}
            {tab==="goals"&&<Goals d={d} familyId={familyId} toast={toast}/>}
            {tab==="members"&&<Members d={d} familyId={familyId} toast={toast}/>}
            {tab==="settings"&&<Settings user={user} dark={dark} setDark={setDark} onLogout={logout}/>}
          </>}
        </div>
      </div>
    </div>
    <nav className="bot-nav">
      {BNAV.map(item=><button key={item.id} className={"bnav-btn "+(tab===item.id?"on":"")} onClick={()=>setTab(item.id)}><span className="bnav-icon">{item.icon}</span><span>{item.label}</span></button>)}
      <button className="fab" onClick={()=>setTab("transactions")}>+</button>
    </nav>
    <div style={{position:"fixed",bottom:74,right:14,display:"flex",flexDirection:"column",gap:8,zIndex:999,maxWidth:300}}>
      {toasts.slice(-3).map(t=><Toast key={t.id} msg={t.msg} icon={t.icon} onClose={()=>setToasts(p=>p.filter(x=>x.id!==t.id))}/>)}
    </div>
  </Ctx.Provider>);
}
