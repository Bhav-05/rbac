import { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import api from "../../services/api";
const SC = {"pending":{"color":"var(--warning)","bg":"var(--warning-bg)"},"in-progress":{"color":"#7c3aed","bg":"#f5f3ff"},"completed":{"color":"var(--success)","bg":"var(--success-bg)"}};
export default function TaskMonitor() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => { api.get("/admin/tasks").then(({data}) => setTasks(data.tasks)); }, []);
  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <main style={S.main}>
        <h1 style={S.pageTitle}>Task Monitor</h1>
        <p style={S.pageSub}>{tasks.length} tasks across all users</p>
        <div style={S.filters}>
          {["all","pending","in-progress","completed"].map(f => (
            <button key={f} style={{...S.fBtn,...( filter===f?S.fActive:{})}} onClick={()=>setFilter(f)}>{f}</button>
          ))}
        </div>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr style={S.thead}>{["Title","Owner","Status","Created"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(t => {
                const sc = SC[t.status]||SC.pending;
                return (
                  <tr key={t._id} style={S.tr}>
                    <td style={S.td}><div style={{fontSize:13,fontWeight:500}}>{t.title}</div>{t.description&&<div style={{fontSize:11,color:"var(--text3)",marginTop:1}}>{t.description}</div>}</td>
                    <td style={{...S.td,fontSize:12}}><div style={{fontWeight:500}}>{t.userId?.name||"—"}</div><div style={{color:"var(--text3)",fontSize:11}}>{t.userId?.email}</div></td>
                    <td style={S.td}><span style={{...S.badge,color:sc.color,background:sc.bg}}>{t.status}</span></td>
                    <td style={{...S.td,color:"var(--text3)",fontSize:12}}>{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={S.empty}>No tasks found.</div>}
        </div>
      </main>
    </div>
  );
}
const S = {
  main:{flex:1,padding:"28px 32px",background:"var(--page)",minHeight:"100vh"},
  pageTitle:{fontSize:20,fontWeight:600,color:"var(--text1)",marginBottom:2},
  pageSub:{fontSize:13,color:"var(--text3)",marginBottom:16},
  filters:{display:"flex",gap:6,marginBottom:16},
  fBtn:{padding:"5px 12px",background:"#fff",border:"1px solid var(--border)",borderRadius:20,fontSize:12,color:"var(--text2)",cursor:"pointer",textTransform:"capitalize"},
  fActive:{background:"var(--accent)",border:"1px solid var(--accent)",color:"#fff"},
  tableWrap:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"},
  table:{width:"100%",borderCollapse:"collapse"},
  thead:{background:"#f8fafc"},
  th:{padding:"10px 14px",fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600,textAlign:"left",borderBottom:"1px solid var(--border)"},
  tr:{borderBottom:"1px solid var(--border)"},
  td:{padding:"12px 14px",color:"var(--text1)",verticalAlign:"middle"},
  badge:{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:500,textTransform:"capitalize"},
  empty:{padding:"24px",textAlign:"center",color:"var(--text3)",fontSize:13},
};
