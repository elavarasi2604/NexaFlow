import { useEffect, useMemo, useState } from "react";
import {
  Routes, Route, Navigate, Link, useNavigate, useLocation
} from "react-router-dom";
import {
  LayoutDashboard, CheckSquare, CalendarDays, MessageCircle,
  BarChart3, FileText, Bell, Users, ClipboardList, Settings as SettingsIcon,
  LogOut, Search, Plus, RefreshCw, MoreVertical, Clock3,
  CheckCircle2, CircleDot, AlertTriangle, Trash2, Pencil,
  X, Menu, ChevronRight, FolderOpen, Send, UserRound,
  ArrowUpRight, Activity, ShieldCheck
} from "lucide-react";
import api from "./api";

const navGroups = [
  {
    title: "MAIN MENU",
    items: [
      ["/", "Dashboard", LayoutDashboard],
      ["/tasks", "Tasks", CheckSquare],
      ["/calendar", "Calendar", CalendarDays],
      ["/communication", "Communication", MessageCircle],
      ["/analytics", "Analytics", BarChart3],
      ["/documents", "Documents", FileText],
      ["/notifications", "Notifications", Bell]
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      ["/team", "Team", Users],
      ["/reports", "Reports", ClipboardList]
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      ["/settings", "Settings", SettingsIcon]
    ]
  }
];

function Protected({ children }) {
  return children;
}

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Elavarasi","role":"User"}');

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div className="brand-name">
            <strong>NexaFlow</strong>
            <span>WORKFLOW</span>
          </div>
        </div>

        <div className="sidebar-scroll">
          {navGroups.map((group) => (
            <div className="menu-section" key={group.title}>
              <div className="menu-title">{group.title}</div>
              {group.items.map(([path, label, Icon]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-item ${location.pathname === path ? "active" : ""}`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{label}</span>
                  {label === "Notifications" && <b className="nav-badge">3</b>}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">{(user.name || "U")[0].toUpperCase()}</div>
            <div className="user-meta">
              <strong>{user.name || "User"}</strong>
              <span>{user.role || "User"}</span>
            </div>
            <button className="icon-button small" onClick={() => navigate("/settings")}>
              <MoreVertical size={17} />
            </button>
          </div>
          <button className="signout" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu size={21} />
        </button>
        {children}
      </main>
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");

  const load = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return tasks.filter(t => !q || `${t.title} ${t.description}`.toLowerCase().includes(q));
  }, [tasks, query]);

  const pending = tasks.filter(t => t.status === "Pending").length;
  const progress = tasks.filter(t => t.status === "In Progress").length;
  const completed = tasks.filter(t => t.status === "Completed").length;

  return (
    <Layout>
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your workflow</p>
        </div>
        <div className="top-actions">
          <div className="global-search">
            <Search size={17} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks..." />
          </div>
          <Link className="icon-button notification" to="/notifications"><Bell size={19}/><b>3</b></Link>
          <div className="top-avatar">E</div>
        </div>
      </div>

      <div className="content">
        <div className="welcome">
          <div>
            <span className="eyebrow">WORKSPACE OVERVIEW</span>
            <h2>Good morning, Elavarasi 👋</h2>
            <p>Here’s what’s happening with your workflow today.</p>
          </div>
          <Link to="/tasks" className="primary-button"><CheckSquare size={17}/> View Tasks</Link>
        </div>

        <div className="stats-grid">
          <StatCard icon={ClipboardList} label="Total Tasks" value={tasks.length} />
          <StatCard icon={Clock3} label="Pending" value={pending} tone="amber" />
          <StatCard icon={Activity} label="In Progress" value={progress} tone="blue" />
          <StatCard icon={CheckCircle2} label="Completed" value={completed} tone="green" />
        </div>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-head">
              <div><h2>Task Progress</h2><p>Current workflow status</p></div>
              <Link to="/analytics" className="text-link">Analytics <ArrowUpRight size={15}/></Link>
            </div>
            <div className="progress-chart">
              {[
                ["Pending", pending, "amber"],
                ["In Progress", progress, "blue"],
                ["Completed", completed, "green"]
              ].map(([label, value, tone]) => (
                <div className="progress-row" key={label}>
                  <div className="progress-label"><span>{label}</span><strong>{value}</strong></div>
                  <div className="progress-track"><div className={`progress-fill ${tone}`} style={{width: `${tasks.length ? Math.max(7, value / tasks.length * 100) : 0}%`}} /></div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div><h2>Upcoming Deadlines</h2><p>Tasks that need attention</p></div>
              <Link to="/calendar" className="text-link">Calendar <ChevronRight size={15}/></Link>
            </div>
            <div className="deadline-list">
              {tasks.filter(t => t.status !== "Completed").slice(0, 4).map(task => (
                <div className="deadline-row" key={task._id || task.id}>
                  <div className="date-box">{new Date(task.dueDate).getDate()}<small>{new Date(task.dueDate).toLocaleString("en", {month:"short"})}</small></div>
                  <div className="deadline-main"><strong>{task.title}</strong><span>{task.priority} priority</span></div>
                  <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panel-head">
            <div><h2>Recent Tasks</h2><p>Latest workflow activity</p></div>
            <Link to="/tasks" className="text-link">View all <ChevronRight size={15}/></Link>
          </div>
          <TaskTable tasks={filtered.slice(0, 5)} compact />
        </section>
      </div>
    </Layout>
  );
}

function TaskTable({ tasks, compact = false, onEdit, onDelete }) {
  if (!tasks.length) {
    return <div className="empty-state"><CheckSquare size={28}/><h3>No tasks found</h3><p>Create a task to get started.</p></div>;
  }

  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead><tr><th>Task</th><th>Status</th><th>Priority</th><th>Due Date</th>{!compact && <th>Created</th>}{!compact && <th></th>}</tr></thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id || task.id}>
              <td>
                <div className="task-cell">
                  <div className="task-dot"><CheckSquare size={15}/></div>
                  <div><strong>{task.title}</strong><span>{task.description}</span></div>
                </div>
              </td>
              <td><span className={`status ${task.status.toLowerCase().replaceAll(" ","-")}`}>{task.status}</span></td>
              <td><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></td>
              <td>{new Date(task.dueDate).toLocaleDateString()}</td>
              {!compact && <td>{new Date(task.createdAt).toLocaleDateString()}</td>}
              {!compact && <td><div className="row-actions">
                <button className="icon-button small" onClick={() => onEdit?.(task)}><Pencil size={15}/></button>
                <button className="icon-button small danger" onClick={() => onDelete?.(task)}><Trash2 size={15}/></button>
              </div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(task || {
    title: "", description: "", status: "Pending", priority: "Medium", dueDate: ""
  });

  const update = (key, value) => setForm(prev => ({...prev, [key]: value}));

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div><h2>{task ? "Edit Task" : "Create New Task"}</h2><p>Keep your workflow organized.</p></div>
          <button className="icon-button" onClick={onClose}><X size={19}/></button>
        </div>
        <div className="form-grid">
          <label>Task title<input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Enter task title"/></label>
          <label>Description<textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Describe the task"/></label>
          <label>Status<select value={form.status} onChange={e => update("status", e.target.value)}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
          <label>Priority<select value={form.priority} onChange={e => update("priority", e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Due date<input type="date" value={form.dueDate} onChange={e => update("dueDate", e.target.value)}/></label>
        </div>
        <div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(form)}>Save Task</button></div>
      </div>
    </div>
  );
}

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [modal, setModal] = useState(null);

  const load = async () => setTasks((await api.get("/tasks")).data);
  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t =>
    (!query || `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase())) &&
    (status === "All" || t.status === status) &&
    (priority === "All" || t.priority === priority)
  );

  const save = async (form) => {
    if (!form.title.trim() || !form.dueDate) return alert("Please enter a title and due date.");
    if (form._id) await api.put(`/tasks/${form._id}`, form);
    else await api.post("/tasks", form);
    setModal(null);
    load();
  };

  const remove = async task => {
    if (confirm(`Delete "${task.title}"?`)) {
      await api.delete(`/tasks/${task._id || task.id}`);
      load();
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Tasks"
        subtitle="Manage and track your workflow tasks"
        action={<button className="primary-button" onClick={() => setModal({})}><Plus size={17}/> New Task</button>}
      />

      <div className="content">
        <div className="stats-grid five">
          <StatCard icon={ClipboardList} label="Total Tasks" value={tasks.length}/>
          <StatCard icon={Clock3} label="Pending" value={tasks.filter(t=>t.status==="Pending").length} tone="amber"/>
          <StatCard icon={Activity} label="In Progress" value={tasks.filter(t=>t.status==="In Progress").length} tone="blue"/>
          <StatCard icon={CheckCircle2} label="Completed" value={tasks.filter(t=>t.status==="Completed").length} tone="green"/>
          <StatCard icon={AlertTriangle} label="High Priority" value={tasks.filter(t=>t.priority==="High").length} tone="red"/>
        </div>

        <section className="panel">
          <div className="toolbar">
            <div className="task-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks..."/></div>
            <select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select>
            <select value={priority} onChange={e=>setPriority(e.target.value)}><option>All</option><option>High</option><option>Medium</option><option>Low</option></select>
            <button className="icon-button" onClick={load}><RefreshCw size={18}/></button>
          </div>
          <div className="panel-head table-title"><div><h2>All Tasks</h2><p>{filtered.length} task{filtered.length !== 1 ? "s" : ""} found</p></div></div>
          <TaskTable tasks={filtered} onEdit={setModal} onDelete={remove}/>
        </section>
      </div>
      {modal !== null && <TaskModal task={modal.id ? modal : null} onClose={()=>setModal(null)} onSave={save}/>}
    </Layout>
  );
}

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [month, setMonth] = useState(new Date(2026, 9, 1));

  useEffect(() => {
    api.get("/tasks").then(r => setTasks(r.data));
  }, []);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({length: firstDay + daysInMonth}, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const monthName = month.toLocaleString("en", { month: "long", year: "numeric" });

  return (
    <Layout>
      <PageHeader
        title="Calendar"
        subtitle="View deadlines and scheduled workflow activity"
      />

      <div className="content">
        <section className="panel calendar-panel">
          <div className="calendar-head">
            <div>
              <h2>{monthName}</h2>
              <p>{tasks.filter(t => {
                const d = new Date(t.dueDate);
                return d.getFullYear() === year && d.getMonth() === monthIndex;
              }).length} scheduled task(s)</p>
            </div>

            <div className="calendar-actions">
              <button className="secondary-button" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}>‹</button>
              <button className="secondary-button" onClick={() => setMonth(new Date())}>Today</button>
              <button className="secondary-button" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}>›</button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <b key={d}>{d}</b>)}
          </div>

          <div className="calendar-grid">
            {cells.map((day, i) => {
              const dayTasks = day ? tasks.filter(t => {
                const d = new Date(t.dueDate);
                return d.getFullYear() === year && d.getMonth() === monthIndex && d.getDate() === day;
              }) : [];

              return (
                <div className={`calendar-day ${dayTasks.length ? "has-event" : ""}`} key={i}>
                  {day && <b>{day}</b>}
                  {dayTasks.map(t => (
                    <span className={`calendar-event ${t.priority.toLowerCase()}`} key={t.id} title={t.title}>
                      {t.title}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Communication() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const load = async () => {
    try { setMessages((await api.get("/messages")).data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!message.trim()) return;
    await api.post("/messages", { name: "Elavarasi", text: message.trim() });
    setMessage("");
    load();
  };

  return (
    <Layout>
      <PageHeader title="Communication" subtitle="Coordinate with your team" />
      <div className="content">
        <section className="panel chat-panel">
          <div className="chat-list">
            {messages.map(m => (
              <div className="chat-message" key={m._id}>
                <div className="avatar">{(m.name || "U")[0]}</div>
                <div><strong>{m.name}</strong><p>{m.text}</p><small>{m.time}</small></div>
              </div>
            ))}
          </div>
          <div className="quick-replies">
            {["I will take this task.", "Task completed.", "Need clarification."].map(q =>
              <button key={q} className="secondary-button" onClick={()=>setMessage(q)}>{q}</button>
            )}
          </div>
          <div className="chat-input">
            <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a message..." onKeyDown={e=>{if(e.key==="Enter")send();}}/>
            <button className="primary-button" onClick={send}><Send size={17}/> Send</button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Analytics() {
  const [tasks,setTasks]=useState([]);
  useEffect(()=>{api.get("/tasks").then(r=>setTasks(r.data));},[]);
  const total=tasks.length||1;
  return <Layout><PageHeader title="Analytics" subtitle="Understand your workflow performance"/><div className="content"><div className="stats-grid"><StatCard icon={Activity} label="Completion Rate" value={`${Math.round(tasks.filter(t=>t.status==="Completed").length/total*100)}%`} tone="green"/><StatCard icon={Clock3} label="Pending Rate" value={`${Math.round(tasks.filter(t=>t.status==="Pending").length/total*100)}%`} tone="amber"/><StatCard icon={ShieldCheck} label="High Priority" value={tasks.filter(t=>t.priority==="High").length} tone="red"/></div><section className="panel"><div className="panel-head"><div><h2>Workflow Health</h2><p>Distribution of current tasks</p></div></div><div className="analytics-bars">{[["Pending",tasks.filter(t=>t.status==="Pending").length,"amber"],["In Progress",tasks.filter(t=>t.status==="In Progress").length,"blue"],["Completed",tasks.filter(t=>t.status==="Completed").length,"green"]].map(([n,v,c])=><div className="analytics-bar" key={n}><span>{n}</span><div><i className={c} style={{width:`${v/total*100}%`}}/></div><b>{v}</b></div>)}</div></section></div></Layout>;
}

function Documents() {
  const [docs, setDocs] = useState([]);

  const load = async () => setDocs((await api.get("/documents")).data);
  useEffect(() => { load(); }, []);

  const upload = async e => {
    const files = [...e.target.files];
    if (!files.length) return;
    const form = new FormData();
    files.forEach(f => form.append("files", f));
    await api.post("/documents", form);
    e.target.value = "";
    load();
  };

  const remove = async id => {
    if (confirm("Delete this document?")) {
      await api.delete(`/documents/${id}`);
      load();
    }
  };

  const download = async doc => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/documents/${doc._id}/download`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=doc.name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <PageHeader title="Documents" subtitle="Access and organize workflow documents"
        action={<label className="primary-button file-button"><Plus size={17}/> Upload Document<input type="file" multiple hidden onChange={upload}/></label>}/>
      <div className="content">
        <section className="panel">
          <div className="panel-head"><div><h2>Document Library</h2><p>{docs.length} document(s) stored in MongoDB</p></div></div>
          {!docs.length ? <div className="empty-state"><FolderOpen size={30}/><h3>No documents yet</h3><p>Upload files to store them in MongoDB.</p></div> :
            <div className="document-grid">{docs.map(d =>
              <div className="document-card" key={d._id}>
                <div className="document-icon"><FileText size={22}/></div>
                <div><strong title={d.name}>{d.name}</strong><span>{d.type} · {Math.max(1,Math.round(d.size/1024))} KB</span></div>
                <button className="icon-button small" onClick={()=>download(d)}><ArrowUpRight size={15}/></button>
                <button className="icon-button small danger" onClick={()=>remove(d._id)}><Trash2 size={16}/></button>
              </div>
            )}</div>}
        </section>
      </div>
    </Layout>
  );
}

function Notifications() {
  const [items,setItems]=useState([]);
  const load=async()=>setItems((await api.get("/notifications")).data);
  useEffect(()=>{load();},[]);
  const markAll=async()=>{await api.patch("/notifications/read-all");load();};
  const mark=async id=>{await api.patch(`/notifications/${id}/read`);load();};
  const unread=items.filter(n=>!n.read).length;

  return <Layout>
    <PageHeader title="Notifications" subtitle={`${unread} unread notification${unread===1?"":"s"}`}
      action={<button className="secondary-button" onClick={markAll}>Mark all as read</button>}/>
    <div className="content"><section className="panel notification-list">
      {items.map(n=><button className={`notification-row ${n.read?"read":"unread"}`} key={n._id} onClick={()=>mark(n._id)}>
        <div className="notification-icon"><Bell size={18}/></div>
        <div><strong>{n.title}</strong><p>{n.text}</p><small>{n.time}</small></div>
        {!n.read&&<i className="unread-dot"/>}
      </button>)}
    </section></div>
  </Layout>;
}

function Team() {
  const [people,setPeople]=useState([]);
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({name:"",role:"Developer"});
  const load=async()=>setPeople((await api.get("/team")).data);
  useEffect(()=>{load();},[]);
  const add=async()=>{if(!form.name.trim())return;await api.post("/team",form);setForm({name:"",role:"Developer"});setAdding(false);load();};
  const remove=async id=>{if(confirm("Remove this member?")){await api.delete(`/team/${id}`);load();}};

  return <Layout>
    <PageHeader title="Team" subtitle="Manage your workflow team" action={<button className="primary-button" onClick={()=>setAdding(true)}><Plus size={17}/> Add Member</button>}/>
    <div className="content">
      {adding&&<section className="panel inline-form"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Member name"/><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Developer</option><option>Designer</option><option>Project Lead</option><option>Analyst</option></select><button className="primary-button" onClick={add}>Add</button><button className="secondary-button" onClick={()=>setAdding(false)}>Cancel</button></section>}
      <div className="team-grid">{people.map(p=><div className="member-card" key={p._id}><div className="avatar large">{p.initial}</div><strong>{p.name}</strong><span>{p.role}</span><div className="member-actions"><button className="secondary-button">View Profile</button>{p.role!=="Project Lead"&&<button className="icon-button danger" onClick={()=>remove(p._id)}><Trash2 size={16}/></button>}</div></div>)}</div>
    </div>
  </Layout>;
}

function Reports() {
  const [tasks, setTasks] = useState([]);
  useEffect(()=>{api.get("/tasks").then(r=>setTasks(r.data));},[]);

  const download = () => {
    const rows = [
      ["Task","Status","Priority","Due Date","Created"],
      ...tasks.map(t => [t.title,t.status,t.priority,t.dueDate,t.createdAt])
    ];
    const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexaflow-workflow-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <PageHeader
        title="Reports"
        subtitle="Review workflow summaries and performance"
        action={<button className="primary-button" onClick={download}><FileText size={17}/> Export CSV</button>}
      />
      <div className="content">
        <div className="stats-grid">
          <StatCard icon={ClipboardList} label="Total Tasks" value={tasks.length}/>
          <StatCard icon={CheckCircle2} label="Completed" value={tasks.filter(t=>t.status==="Completed").length} tone="green"/>
          <StatCard icon={Clock3} label="Pending" value={tasks.filter(t=>t.status==="Pending").length} tone="amber"/>
          <StatCard icon={AlertTriangle} label="High Priority" value={tasks.filter(t=>t.priority==="High").length} tone="red"/>
        </div>
        <section className="panel report-card">
          <div className="report-icon"><ClipboardList size={24}/></div>
          <div>
            <h2>Workflow Report</h2>
            <p>Export the current task list with status, priority, due date and creation date.</p>
          </div>
          <button className="primary-button" onClick={download}>Generate Report</button>
        </section>
      </div>
    </Layout>
  );
}

function Settings() {
  const [profile,setProfile]=useState({name:"",email:"",role:"",notifications:true,summary:true});
  const [saved,setSaved]=useState(false);
  useEffect(()=>{api.get("/settings").then(r=>setProfile(r.data));},[]);
  const save=async()=>{const r=await api.put("/settings",profile);setProfile(r.data);setSaved(true);setTimeout(()=>setSaved(false),1800);};

  return <Layout>
    <PageHeader title="Settings" subtitle="Manage your account and workspace preferences"/>
    <div className="content"><section className="panel settings-card">
      <div className="settings-section"><h2>Profile</h2>
        <label>Display name<input value={profile.name||""} onChange={e=>setProfile({...profile,name:e.target.value})}/></label>
        <label>Email<input value={profile.email||""} onChange={e=>setProfile({...profile,email:e.target.value})}/></label>
        <label>Role<input value={profile.role||""} onChange={e=>setProfile({...profile,role:e.target.value})}/></label>
        <div className="save-line"><button className="primary-button" onClick={save}>Save Changes</button>{saved&&<span className="saved-message">Saved successfully ✓</span>}</div>
      </div>
      <div className="settings-section"><h2>Workspace</h2>
        <div className="setting-row"><div><strong>Workflow notifications</strong><span>Receive task and deadline updates</span></div><input type="checkbox" checked={!!profile.notifications} onChange={e=>setProfile({...profile,notifications:e.target.checked})}/></div>
        <div className="setting-row"><div><strong>Daily summary</strong><span>Show a daily workflow summary</span></div><input type="checkbox" checked={!!profile.summary} onChange={e=>setProfile({...profile,summary:e.target.checked})}/></div>
      </div>
    </section></div>
  </Layout>;
}

function Auth({register=false}) {
  const navigate=useNavigate();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const submit=e=>{e.preventDefault();localStorage.setItem("user",JSON.stringify({name:name||"Elavarasi",role:"User",email}));navigate("/")};
  return <div className="auth-page"><div className="auth-card"><div className="brand auth-brand"><div className="brand-icon">✦</div><div className="brand-name"><strong>NexaFlow</strong><span>WORKFLOW</span></div></div><h1>{register?"Create account":"Welcome back"}</h1><p>{register?"Set up your NexaFlow workspace":"Sign in to continue to your workflow"}</p><form onSubmit={submit}>{register&&<label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label>Email<input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input required type="password" placeholder="••••••••"/></label><button className="primary-button full">{register?"Create Account":"Sign In"}</button></form><button className="auth-link" onClick={()=>navigate(register?"/login":"/register")}>{register?"Already have an account? Sign in":"New to NexaFlow? Create an account"}</button></div></div>;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/register" element={<Auth register/>}/>
    <Route path="/" element={<Protected><Dashboard/></Protected>}/>
    <Route path="/tasks" element={<Protected><TasksPage/></Protected>}/>
    <Route path="/calendar" element={<Protected><CalendarPage/></Protected>}/>
    <Route path="/communication" element={<Protected><Communication/></Protected>}/>
    <Route path="/analytics" element={<Protected><Analytics/></Protected>}/>
    <Route path="/documents" element={<Protected><Documents/></Protected>}/>
    <Route path="/notifications" element={<Protected><Notifications/></Protected>}/>
    <Route path="/team" element={<Protected><Team/></Protected>}/>
    <Route path="/reports" element={<Protected><Reports/></Protected>}/>
    <Route path="/settings" element={<Protected><Settings/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}