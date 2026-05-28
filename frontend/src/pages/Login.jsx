import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.leftContent}>
          <div style={S.logoMark}>RB</div>
          <h1 style={S.headline}>RoleBase</h1>
          <p style={S.tagline}>Role-based task management with full audit logging and admin controls.</p>
          <div style={S.features}>
            {["JWT authentication","Role-based access control","Activity logging","Admin dashboard"].map(f => (
              <div key={f} style={S.featureRow}><span style={S.check}>✓</span> {f}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={S.right}>
        <div style={S.card}>
          <h2 style={S.cardTitle}>Sign in to your account</h2>
          {error && <div style={S.errorBox}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Email address</label>
              <input style={S.input} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input style={S.input} type="password" placeholder="Enter your password"
                value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
            </div>
            <button style={{...S.btn, opacity:loading?0.7:1}} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p style={S.switchText}>Don't have an account? <Link to="/register" style={S.switchLink}>Create one</Link></p>
          <div style={S.demoBox}>
            <div style={S.demoTitle}>Demo credentials</div>
            <div style={S.demoRow}><span style={S.demoRole}>Admin</span><span style={S.demoCreds}>admin@test.com / admin123</span></div>
            <div style={S.demoRow}><span style={{...S.demoRole,background:"#f0fdf4",color:"#16a34a"}}>User</span><span style={S.demoCreds}>ramFinal@test.com / 123456</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
const S = {
  page:{display:"flex",minHeight:"100vh",background:"#fff"},
  left:{flex:1,background:"var(--sidebar)",display:"flex",alignItems:"center",justifyContent:"center",padding:48},
  leftContent:{maxWidth:360},
  logoMark:{width:44,height:44,background:"var(--accent)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,color:"#fff",marginBottom:24},
  headline:{fontSize:28,fontWeight:600,color:"#fff",marginBottom:10},
  tagline:{fontSize:14,color:"#94a3b8",lineHeight:1.7,marginBottom:28},
  features:{display:"flex",flexDirection:"column",gap:10},
  featureRow:{fontSize:13,color:"#cbd5e1",display:"flex",alignItems:"center",gap:8},
  check:{color:"var(--accent)",fontWeight:600},
  right:{width:440,display:"flex",alignItems:"center",justifyContent:"center",padding:40},
  card:{width:"100%",maxWidth:380},
  cardTitle:{fontSize:20,fontWeight:600,color:"var(--text1)",marginBottom:20},
  errorBox:{background:"var(--danger-bg)",border:"1px solid #fca5a5",color:"var(--danger)",padding:"10px 14px",borderRadius:"var(--radius)",fontSize:13,marginBottom:16},
  field:{marginBottom:14},
  label:{display:"block",fontSize:12,fontWeight:500,color:"var(--text2)",marginBottom:5},
  input:{width:"100%",padding:"9px 12px",border:"1px solid var(--border)",borderRadius:"var(--radius)",fontSize:14,color:"var(--text1)",outline:"none",background:"#fff"},
  btn:{width:"100%",padding:"10px",background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--radius)",fontSize:14,fontWeight:500,marginTop:4,marginBottom:16},
  switchText:{textAlign:"center",fontSize:13,color:"var(--text3)",marginBottom:20},
  switchLink:{color:"var(--accent)",fontWeight:500},
  demoBox:{background:"#f8fafc",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"12px 14px"},
  demoTitle:{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8},
  demoRow:{display:"flex",alignItems:"center",gap:8,marginBottom:5,fontSize:12},
  demoRole:{background:"#eff6ff",color:"#1d4ed8",padding:"1px 8px",borderRadius:4,fontSize:11,fontWeight:500},
  demoCreds:{color:"var(--text2)",fontFamily:"monospace",fontSize:12},
};
