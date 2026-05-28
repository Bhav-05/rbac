import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await api.post("/auth/register", form); navigate("/login"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logoRow}><div style={S.logo}>RB</div><span style={S.logoText}>RoleBase</span></div>
        <h2 style={S.title}>Create your account</h2>
        {error && <div style={S.errorBox}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            {key:"name",label:"Full name",type:"text",ph:"John Smith"},
            {key:"email",label:"Email address",type:"email",ph:"you@example.com"},
            {key:"password",label:"Password",type:"password",ph:"Minimum 6 characters"},
          ].map(({key,label,type,ph}) => (
            <div key={key} style={S.field}>
              <label style={S.label}>{label}</label>
              <input style={S.input} type={type} placeholder={ph}
                value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} required />
            </div>
          ))}
          <button style={{...S.btn,opacity:loading?0.7:1}} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p style={S.switchText}>Already have an account? <Link to="/login" style={S.switchLink}>Sign in</Link></p>
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:"100vh",background:"var(--page)",display:"flex",alignItems:"center",justifyContent:"center",padding:24},
  card:{width:"100%",maxWidth:400,background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:32},
  logoRow:{display:"flex",alignItems:"center",gap:8,marginBottom:20},
  logo:{width:30,height:30,background:"var(--accent)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:"#fff"},
  logoText:{fontSize:15,fontWeight:600,color:"var(--text1)"},
  title:{fontSize:18,fontWeight:600,color:"var(--text1)",marginBottom:18},
  errorBox:{background:"var(--danger-bg)",border:"1px solid #fca5a5",color:"var(--danger)",padding:"10px 14px",borderRadius:"var(--radius)",fontSize:13,marginBottom:14},
  field:{marginBottom:14},
  label:{display:"block",fontSize:12,fontWeight:500,color:"var(--text2)",marginBottom:5},
  input:{width:"100%",padding:"9px 12px",border:"1px solid var(--border)",borderRadius:"var(--radius)",fontSize:14,color:"var(--text1)",outline:"none"},
  btn:{width:"100%",padding:"10px",background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--radius)",fontSize:14,fontWeight:500,marginTop:4,marginBottom:14},
  switchText:{textAlign:"center",fontSize:13,color:"var(--text3)"},
  switchLink:{color:"var(--accent)",fontWeight:500},
};
