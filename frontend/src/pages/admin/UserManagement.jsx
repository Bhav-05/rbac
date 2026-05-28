import { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import api from "../../services/api";
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const fetch = () => api.get("/admin/users").then(({data}) => setUsers(data.users));
  useEffect(() => { fetch(); }, []);
  const deleteUser = async (id, name) => {
    if (!window.confirm("Delete " + name + " and all their tasks?")) return;
    await api.delete("/admin/users/" + id); fetch();
  };
  const toggleStatus = async (u) => {
    await api.patch("/admin/users/" + u._id + "/status", { status: u.status === "active" ? "inactive" : "active" });
    fetch();
  };
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <main style={S.main}>
        <h1 style={S.pageTitle}>User Management</h1>
        <p style={S.pageSub}>{users.length} registered users</p>
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr style={S.thead}>{["Name","Email","Role","Status","Joined","Actions"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={S.tr}>
                  <td style={S.td}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={S.avatar}>{u.name[0].toUpperCase()}</div><span style={{fontSize:13,fontWeight:500}}>{u.name}</span></div></td>
                  <td style={{...S.td,color:"var(--text2)",fontSize:12}}>{u.email}</td>
                  <td style={S.td}><span style={{...S.badge,background:u.role==="admin"?"#eff6ff":"#f9fafb",color:u.role==="admin"?"#1d4ed8":"var(--text2)"}}>{u.role}</span></td>
                  <td style={S.td}><span style={{...S.badge,background:u.status==="active"?"var(--success-bg)":"var(--danger-bg)",color:u.status==="active"?"var(--success)":"var(--danger)"}}>{u.status}</span></td>
                  <td style={{...S.td,color:"var(--text3)",fontSize:12}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={S.td}>{u.role!=="admin"&&<div style={{display:"flex",gap:6}}><button style={S.btnT} onClick={()=>toggleStatus(u)}>{u.status==="active"?"Deactivate":"Activate"}</button><button style={S.btnD} onClick={()=>deleteUser(u._id,u.name)}>Delete</button></div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  avatar:{width:26,height:26,background:"#eff6ff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:"#1d4ed8",flexShrink:0},
  badge:{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:500,textTransform:"capitalize"},
  btnT:{padding:"4px 10px",background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--radius)",color:"var(--text2)",fontSize:11,cursor:"pointer"},
  btnD:{padding:"4px 10px",background:"#fff",border:"1px solid #fca5a5",borderRadius:"var(--radius)",color:"var(--danger)",fontSize:11,cursor:"pointer"},
};
