import { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/analytics").then(({data}) => setStats(data.analytics)); }, []);

  const cards = [
    { label:"Total Users",   value:stats?.totalUsers,     color:"#6366f1", icon:"👤" },
    { label:"Total Tasks",   value:stats?.totalTasks,     color:"#0ea5e9", icon:"📋" },
    { label:"Completed",     value:stats?.completedTasks, color:"#10b981", icon:"✅" },
    { label:"Pending",       value:stats?.pendingTasks,   color:"#f59e0b", icon:"⏳" },
    { label:"Activity Logs", value:stats?.totalLogs,      color:"#8b5cf6", icon:"📊" },
  ];

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <main style={S.main}>
        <h1 style={S.title}>Overview</h1>
        <p style={S.sub}>System-wide analytics</p>
        <div style={S.grid}>
          {cards.map(c => (
            <div key={c.label} style={{...S.card, borderTop:"3px solid "+c.color}}>
              <div style={S.icon}>{c.icon}</div>
              <div style={{...S.val, color:c.color}}>{stats ? c.value ?? 0 : "—"}</div>
              <div style={S.cardLabel}>{c.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const S = {
  main:      { flex:1, padding:"32px 36px", background:"var(--bg)", minHeight:"100vh" },
  title:     { fontFamily:"var(--font-head)", fontSize:26, fontWeight:700, color:"var(--text)", marginBottom:4 },
  sub:       { color:"var(--text2)", fontSize:13, marginBottom:28 },
  grid:      { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 },
  card:      { background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"22px 20px" },
  icon:      { fontSize:22, marginBottom:10 },
  val:       { fontFamily:"var(--font-head)", fontSize:34, fontWeight:800, marginBottom:4 },
  cardLabel: { fontSize:11, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.06em" },
};
