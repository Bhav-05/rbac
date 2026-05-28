import { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import api from "../../services/api";
const ACTION = {
  LOGIN:{label:"Login",color:"var(--accent)",bg:"var(--accent-bg)"},
  TASK_CREATED:{label:"Created",color:"var(--success)",bg:"var(--success-bg)"},
  TASK_UPDATED:{label:"Updated",color:"var(--warning)",bg:"var(--warning-bg)"},
  TASK_DELETED:{label:"Deleted",color:"var(--danger)",bg:"var(--danger-bg)"},
};
export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { api.get("/admin/logs").then(({data}) => setLogs(data.logs)); }, []);
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <main style={S.main}>
        <h1 style={S.pageTitle}>Activity Logs</h1>
        <p style={S.pageSub}>{logs.length} recorded events</p>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr style={S.thead}>{["Event","User","Detail","Time"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {logs.map(log => {
                const m = ACTION[log.action]||{label:log.action,color:"var(--text2)",bg:"#f9fafb"};
                return (
                  <tr key={log._id} style={S.tr}>
                    <td style={S.td}><span style={{...S.badge,color:m.color,background:m.bg}}>{m.label}</span></td>
                    <td style={{...S.td,fontSize:13}}><div style={{fontWeight:500}}>{log.userId?.name||"Unknown"}</div><div style={{fontSize:11,color:"var(--text3)"}}>{log.userId?.email}</div></td>
                    <td style={{...S.td,color:"var(--text2)",fontSize:13}}>{log.details}</td>
                    <td style={{...S.td,color:"var(--text3)",fontSize:12,whiteSpace:"nowrap"}}>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {logs.length===0&&<div style={S.empty}>No activity recorded yet.</div>}
        </div>
      </main>
    </div>
  );
}
const S = {
  main:{flex:1,padding:"28px 32px",background:"var(--page)",minHeight:"100vh"},
  pageTitle:{fontSize:20,fontWeight:600,color:"var(--text1)",marginBottom:2},
  pageSub:{fontSize:13,color:"var(--text3)",marginBottom:20},
  tableWrap:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"},
  table:{width:"100%",borderCollapse:"collapse"},
  thead:{background:"#f8fafc"},
  th:{padding:"10px 14px",fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600,textAlign:"left",borderBottom:"1px solid var(--border)"},
  tr:{borderBottom:"1px solid var(--border)"},
  td:{padding:"12px 14px",color:"var(--text1)",verticalAlign:"middle"},
  badge:{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:500},
  empty:{padding:"24px",textAlign:"center",color:"var(--text3)",fontSize:13},
};
