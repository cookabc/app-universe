import{Link,useLocation}from"react-router-dom";
export default function Header(){const loc=useLocation();
return(<header style={{position:"sticky",top:0,zIndex:100,background:"rgba(var(--bg-primary-rgb),.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",padding:"0 24px",height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<Link to="/"style={{fontSize:"18px",fontWeight:700,color:"var(--text-primary)",textDecoration:"none",display:"flex",alignItems:"center",gap:"8px"}}><span style={{fontSize:"22px"}}>⚡</span><span>Skill Gallery</span></Link>
<nav style={{display:"flex",alignItems:"center",gap:"16px",fontSize:"14px"}}>
{loc.pathname!=="/"&&<Link to="/"style={{color:"var(--text-secondary)"}}>← Home</Link>}
<a href="https://opc-skills.ft07.com/"target="_blank"rel="noopener noreferrer"style={{color:"var(--text-secondary)",fontSize:"12px"}}>Inspired by OPC</a>
</nav></header>)}
