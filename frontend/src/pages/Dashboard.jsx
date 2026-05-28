import { useEffect, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const SC = {
  pending:{"color":"var(--warning)","bg":"var(--warning-bg)"},
  "in-progress":{"color":"#7c3aed","bg":"#f5f3ff"},
  completed:{"color":"var(--success)","bg":"var(--success-bg)"},
};
const NEXT = { pending:"in-progress","in-progress":"completed",completed:"pending" };

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", status:"pending" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try { const { data } = await api.get("/tasks"); setTasks(data.tasks); }
    catch { setError("Failed to load tasks"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const createTask = async (e) => {
    e.preventDefault(); setError("");
    try { await api.post("/tasks", form); setForm({ title:"", description:"", status:"pending" }); fetchTasks(); }
    catch (err) { setError(err.response?.data?.message || "Failed to create task"); }
  };

  const deleteTask = async (id) => { await api.delete("/tasks/" + id); fetchTasks(); };
  const cycleStatus = async (task) => { await api.put("/tasks/" + task._id, { status: NEXT[task.status] }); fetchTasks(); };

  const counts = {
    total:tasks.length,
    pending:tasks.filter(t=>t.status==="pending").length,
    progress:tasks.filter(t=>t.status==="in-progress").length,
    done:tasks.filter(t=>t.status==="completed").length,
  };

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <main style={S.main}>
        <div style={S.header}>
          <h1 style={S.pageTitle}>My Tasks</h1>
          <p style={S.pageSub}>Welcome back, {user?.name}</p>
        </div>
        <div style={S.statsRow}>
          {[
            {label:"Total",value:counts.total,color:"var(--accent)"},
            {label:"Pending",value:counts.pending,color:"var(--warning)"},
            {label:"In Progress",value:counts.progress,color:"#7c3aed"},
            {label:"Completed",value:counts.done,color:"var(--success)"},
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{...S.statNum,color:s.color}}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={S.section}>
          <h3 style={S.sectionTitle}>Add a task</h3>
          {error && <div style={S.errorBox}>{error}</div>}
          <form onSubmit={createTask} style={S.form}>
            <input style={{...S.input,flex:2}} placeholder="Task title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
            <input style={{...S.input,flex:3}} placeholder="Description (optional)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            <select style={S.input} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button style={S.addBtn} type="submit">Add task</button>
          </form>
        </div>
        <div style={S.section}>
          <h3 style={S.sectionTitle}>All tasks ({tasks.length})</h3>
          {loading && <p style={{color:"var(--text3)",fontSize:13}}>Loading...</p>}
          {!loading && tasks.length === 0 && <div style={S.empty}>No tasks yet. Add your first task above.</div>}
          <div style={S.list}>
            {tasks.map(task => {
              const sc = SC[task.status] || SC.pending;
              return (
                <div key={task._id} style={S.taskRow}>
                  <div style={S.taskLeft}>
                    <span style={{...S.badge,color:sc.color,background:sc.bg}}>{task.status}</span>
                    <div>
                      <div style={S.taskTitle}>{task.title}</div>
                      {task.description && <div style={S.taskDesc}>{task.description}</div>}
                    </div>
                  </div>
                  <div style={S.taskActions}>
                    <button style={S.cycleBtn} onClick={()=>cycleStatus(task)}>Next status</button>
                    <button style={S.delBtn} onClick={()=>deleteTask(task._id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
const S = {
  main:{flex:1,padding:"28px 32px",background:"var(--page)",minHeight:"100vh"},
  header:{marginBottom:22},
  pageTitle:{fontSize:20,fontWeight:600,color:"var(--text1)",marginBottom:2},
  pageSub:{fontSize:13,color:"var(--text3)"},
  statsRow:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24},
  statCard:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"16px 18px"},
  statNum:{fontSize:26,fontWeight:600,marginBottom:2},
  statLabel:{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.05em"},
  section:{marginBottom:24},
  sectionTitle:{fontSize:11,fontWeight:600,color:"var(--text3)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"},
  errorBox:{background:"var(--danger-bg)",border:"1px solid #fca5a5",color:"var(--danger)",padding:"9px 12px",borderRadius:"var(--radius)",fontSize:13,marginBottom:10},
  form:{display:"flex",gap:8,flexWrap:"wrap"},
  input:{padding:"8px 11px",border:"1px solid var(--border)",borderRadius:"var(--radius)",fontSize:13,color:"var(--text1)",outline:"none",background:"#fff",flex:1,minWidth:120},
  addBtn:{padding:"8px 16px",background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--radius)",fontSize:13,fontWeight:500,whiteSpace:"nowrap"},
  empty:{background:"var(--card)",border:"1px dashed var(--border)",borderRadius:"var(--radius)",padding:"28px",textAlign:"center",color:"var(--text3)",fontSize:13},
  list:{display:"flex",flexDirection:"column",gap:6},
  taskRow:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"12px 16px",gap:12},
  taskLeft:{display:"flex",alignItems:"center",gap:12,flex:1},
  badge:{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:500,whiteSpace:"nowrap",textTransform:"capitalize"},
  taskTitle:{fontSize:13,fontWeight:500,color:"var(--text1)"},
  taskDesc:{fontSize:12,color:"var(--text3)",marginTop:1},
  taskActions:{display:"flex",gap:6,flexShrink:0},
  cycleBtn:{padding:"5px 10px",background:"#fff",border:"1px solid var(--border)",borderRadius:"var(--radius)",fontSize:12,color:"var(--text2)",cursor:"pointer"},
  delBtn:{padding:"5px 10px",background:"#fff",border:"1px solid #fca5a5",borderRadius:"var(--radius)",fontSize:12,color:"var(--danger)",cursor:"pointer"},
};
