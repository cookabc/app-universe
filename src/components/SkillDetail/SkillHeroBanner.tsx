import{useState}from'react';import type{SkillData}from'../../data/skills';
interface Props{skill:SkillData}
export default function SkillHeroBanner({skill}:Props){const[cp,setCp]=useState(false);const cat=skill.category;
const copy=async()=>{if(skill.installCommand){await navigator.clipboard.writeText(skill.installCommand);setCp(true);setTimeout(()=>setCp(false),2000)}};
const bg=cp?'rgba(34,197,.25)':'rgba(255,255,255,.15)';
const bd=cp?'1px solid rgba(34,197,.5)':'1px solid rgba(255,255,255,.2)';
return(<div style={{position:'relative',borderRadius:'var(--radius-xl)',overflow:'hidden',marginBottom:'24px'}}>
<div style={{background:cat.gradient,padding:'36px 32px',position:'relative'}}>
<div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 20% 50%,rgba(255,255,255,.08) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,.05) 0%,transparent 40%)'}}/>
<div style={{position:'relative',zIndex:1}}>
<div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}><span style={{fontSize:'24px'}}>{cat.icon}</span><span style={{fontSize:'12px',padding:'3px 10px',borderRadius:'12px',background:'rgba(255,255,255,.15)',color:'#fff',fontWeight:600}}>{cat.label}</span></div>
<h1 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:800,color:'#fff',marginBottom:'10px',lineHeight:1.2,textWrap:'balance'}}>{skill.name}</h1>
<p style={{color:'rgba(255,255,255,.75)',fontSize:'15px',lineHeight:1.5,maxWidth:'700px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{skill.description||'No description'}</p>
<div style={{display:'flex',gap:'10px',marginTop:'18px',flexWrap:'wrap'}}>
{skill.installCommand&&(<button onClick={copy}style={{padding:'7px 16px',borderRadius:'var(--radius-sm)',background:bg,border:bd,color:'#fff',fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',transition:'background-color .15s ease,border-color .15s ease',fontFamily:'var(--font-mono)'}}>{cp?'📋 Copied!':'📋 Copy Install Cmd'}</button>)}
<div style={{display:'flex',gap:'12px',alignItems:'center',fontSize:'12px',color:'rgba(255,255,255,.55)',fontFamily:'var(--font-mono)'}}>
<span>📄 {skill.stats.lineCount} lines</span><span>📂 {skill.fileInfo.totalFiles} files</span><span>⭐ {skill.stats.complexityLabel}</span></div></div></div></div></div>)}
