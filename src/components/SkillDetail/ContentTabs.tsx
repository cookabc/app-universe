import{useState,type CSSProperties}from'react';import MarkdownRenderer from'../common/MarkdownRenderer';import type{SkillData}from'../../data/skills';import{extractCodeBlocks}from'../../utils/markdownParser';

interface Props{skill:SkillData}
const TABS=[{k:'overview',l:'📖 Overview'},{k:'doc',l:'📄 Full Doc'},{k:'examples',l:'💻 Code Examples'},{k:'files',l:'📂 Files'}]as const;
type TK=typeof TABS[number]['k'];

export default function ContentTabs({skill}:Props){const[tab,setTab]=useState<TK>('overview');

const btnStyle=(tkey:string):CSSProperties=>({
  padding:'10px 18px',border:'none',background:'none',
  color:tab===tkey?'var(--text-primary)':'var(--text-secondary)',
  fontSize:'13px',fontWeight:600,cursor:'pointer',
  borderBottom:tab===tkey?'2px solid var(--accent)':'2px solid transparent',
  transition:'all .2s',whiteSpace:'nowrap',fontFamily:'var(--font-mono)',
});

return(<div style={{marginBottom:'32px'}}>
<div style={{display:'flex',gap:'4px',borderBottom:'1px solid var(--border)',overflowX:'auto',marginBottom:'20px'}}>
{TABS.map(t=><button key={t.k}onClick={()=>setTab(t.k)}style={btnStyle(t.k)}>{t.l}</button>)}
</div>
<div style={{animation:'fadeInUp .3s ease'}}>
{tab==='overview'&&<Overview skill={skill}/>}
{tab==='doc'&&<MarkdownRenderer content={skill.content}/>}
{tab==='examples'&&<Examples skill={skill}/>}
{tab==='files'&&<Files skill={skill}/>}
</div></div>);}

function Overview({skill}:Props){
return(<div>
<h3 style={{fontSize:'16px',fontWeight:700,marginBottom:'16px'}}>What is this?</h3>
<p style={{color:'var(--text-secondary)',lineHeight:1.7,fontSize:'14px',marginBottom:'24px'}}>{skill.description||'No description provided.'}</p>
{skill.keyFeatures.length>0&&(<><h3 style={{fontSize:'16px',fontWeight:700,marginBottom:'12px'}}>Key Features</h3>
<ul style={{listStyle:'none',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'8px',marginBottom:'24px'}}>
{skill.keyFeatures.map((f,i)=><li key={i}style={{padding:'10px 14px',borderRadius:'var(--radius-sm)',background:'var(--bg-secondary)',border:'1px solid var(--border)',fontSize:'13px',color:'var(--text-secondary)',display:'flex',alignItems:'center',gap:'8px'}}><span>✨</span>{f}</li>)}</ul></>)}
{skill.useCases.length>0&&(<><h3 style={{fontSize:'16px',fontWeight:700,marginBottom:'12px'}}>Use Cases</h3>
<div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'24px'}}>
{skill.useCases.map((uc,i)=><div key={i}style={{padding:'12px 16px',borderRadius:'var(--radius-sm)',background:'var(--bg-secondary)',border:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px'}}><span style={{fontSize:'18px'}}>{uc.icon}</span><div><div style={{fontWeight:600,fontSize:'13px'}}>{uc.title}</div><div style={{fontSize:'12px',color:'var(--text-secondary)'}}>{uc.description}</div></div></div>)}</div></>)}
</div>);}

function Examples({skill}:Props){const blocks=extractCodeBlocks(skill.content);
return(<div><p style={{color:'var(--text-secondary)',fontSize:'14px',marginBottom:'16px'}}>Found {blocks.length} code examples:</p>
{blocks.map((b,i)=><div key={i}style={{marginBottom:'16px',borderRadius:'var(--radius-sm)',background:'var(--bg-card)',border:'1px solid var(--border)',overflow:'hidden'}}>
<div style={{padding:'8px 16px',background:'var(--bg-secondary)',fontSize:'12px',fontFamily:'var(--font-mono)',color:'var(--text-secondary)',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span>{b.language||'code'}</span><span>Example #{i+1}</span></div>
<pre style={{margin:0,padding:'16px',overflowX:'auto',background:'var(--bg-secondary)',fontSize:'13px',fontFamily:'var(--font-mono)',lineHeight:1.6}}><code>{b.code}</code></pre></div>)}</div>);}

function Files({skill}:Props){const tree=skill.fileInfo.tree;
function FileNode({node,depth}:{node:any;depth:number}){const[open,setOpen]=useState(depth<1);
if(node.type==='dir')return(<div><button onClick={()=>setOpen(!open)}style={{display:'flex',alignItems:'center',gap:'6px',padding:'3px 0',marginLeft:depth*16,background:'none',border:'none',color:'var(--text-primary)',cursor:'pointer',fontSize:'13px',width:'100%',textAlign:'left'}}><span>{open?'▾':'▸'}</span><span>📁</span><span>{node.name}/</span></button>
{open&&node.children?.map((c:any,j:number)=><FileNode key={j}node={c}depth={depth+1}/>)}</div>);
return(<div style={{display:'flex',alignItems:'center',gap:'6px',padding:'3px 0',marginLeft:depth*16,fontSize:'13px',color:'var(--text-secondary)'}}><span style={{visibility:'hidden'}}>▸</span><span>📄</span><span>{node.name}</span>{node.size!=null?<span style={{marginLeft:'auto',opacity:.5}}>{(node.size/1024).toFixed(1)}KB</span>:null}</div>);}
return(<div style={{borderRadius:'var(--radius-md)',background:'var(--bg-card)',border:'1px solid var(--border)',padding:'16px',fontFamily:'var(--font-mono)',fontSize:'13px'}}>
<div style={{marginBottom:'8px',fontWeight:600,color:'var(--text-secondary)'}}>📁 {tree?.name||skill.id}/</div>
{tree?.children?.map((c:any,i:number)=><FileNode key={i}node={c}depth={0}/>)||<div style={{color:'var(--text-secondary)'}}>No files found</div>}</div>);}
