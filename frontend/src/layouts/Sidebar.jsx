import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TasksIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>;
const GridIcon  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const UsersIcon = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const MonitorIcon=()=> <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>;
const LogsIcon  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>;
const OutIcon   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  const link = ({ isActive }) => ({
    display:"flex", alignItems:"center", gap:9, padding:"8px 12px", borderRadius:6,
    fontSize:13, fontWeight: isActive ? 500 : 400,
    color: isActive ? "#fff" : "#94a3b8",
    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
    marginBottom:2, transition:"all 0.15s",
  });
  return (
    <aside style={S.wrap}>
      <div>
        <div style={S.brand}>
          <div style={S.logo}>RB</div>
          <div><div style={S.brandName}>RoleBase</div><div style={S.brandSub}>Task Manager</div></div>
        </div>
        <div style={S.section}>
          <div style={S.sLabel}>Menu</div>
          <NavLink to="/dashboard" style={link}><TasksIcon /> My Tasks</NavLink>
        </div>
        {user?.role === "admin" && (
          <div style={S.section}>
            <div style={S.sLabel}>Admin</div>
            <NavLink to="/admin" end style={link}><GridIcon /> Dashboard</NavLink>
            <NavLink to="/admin/users" style={link}><UsersIcon /> Users</NavLink>
            <NavLink to="/admin/tasks" style={link}><MonitorIcon /> Task Monitor</NavLink>
            <NavLink to="/admin/logs" style={link}><LogsIcon /> Activity Logs</NavLink>
          </div>
        )}
      </div>
      <div>
        <div style={S.userRow}>
          <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={S.userName}>{user?.name}</div>
            <div style={S.userRole}>{user?.role}</div>
          </div>
        </div>
        <button style={S.logoutBtn} onClick={handleLogout}><OutIcon /> Sign out</button>
      </div>
    </aside>
  );
}
const S = {
  wrap:{width:220,minHeight:"100vh",background:"var(--sidebar)",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"20px 14px",flexShrink:0},
  brand:{display:"flex",alignItems:"center",gap:10,marginBottom:28,padding:"0 4px"},
  logo:{width:32,height:32,background:"var(--accent)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"#fff",flexShrink:0},
  brandName:{fontSize:14,fontWeight:600,color:"#fff"},
  brandSub:{fontSize:10,color:"#64748b"},
  section:{marginBottom:20},
  sLabel:{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,padding:"0 12px",marginBottom:4},
  userRow:{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"rgba(255,255,255,0.06)",borderRadius:6,marginBottom:8},
  avatar:{width:28,height:28,background:"var(--accent)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:"#fff",flexShrink:0},
  userName:{fontSize:12,fontWeight:500,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},
  userRole:{fontSize:10,color:"#64748b",textTransform:"capitalize"},
  logoutBtn:{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"8px 12px",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#94a3b8",fontSize:12},
};
