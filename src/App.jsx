import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, USERS } from './context/AuthContext';
import TaskForm from './components/TaskForm';
import CommentSection from './components/CommentSection';
import TaskCard from './components/TaskCard';

const MainApp = () => {
  const { currentUser, login, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');

  // Persistence
  useEffect(() => {
    const data = localStorage.getItem('tasks_db');
    if (data) setTasks(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks_db', JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      const newTask = { 
        ...taskData, 
        id: Date.now(), 
        comments: [],
        assignedTo: taskData.assignedTo || 'Standard User' 
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleAddComment = (taskId, text, parentId = null) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (!parentId) {
          return { ...task, comments: [...task.comments, { id: Date.now(), text, user: currentUser.name, replies: [] }] };
        }
        return {
          ...task,
          comments: task.comments.map(c => c.id === parentId 
            ? { ...c, replies: [...c.replies, { id: Date.now(), text, user: currentUser.name }] } : c)
        };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId) => {
  if (window.confirm("Are you sure you want to delete this task?")) {
    setTasks(tasks.filter(t => t.id !== taskId));
  }
};

  // Safe Filtering Logic
  const filteredTasks = tasks
    .filter(t => {
      if (!currentUser) return false;
      if (currentUser.role === 'admin') return true;
      const taskOwner = (t.assignedTo || "").trim().toLowerCase();
      const loggedInUser = (currentUser.name || "").trim().toLowerCase();
      return taskOwner === loggedInUser;
    })
    .filter(t => (t.title || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = String(a[sortBy] || "");
      const valB = String(b[sortBy] || "");
      return valA.localeCompare(valB);
    });

  // Login Screen
  if (!currentUser) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Inter', sans-serif" }}>
        <div className="card shadow-lg border-0 p-5 text-center bg-white" style={{ width: '420px', borderRadius: '20px' }}>
          <div className="mb-5">
            <div className="bg-primary text-white d-inline-block p-3 rounded-4 mb-3 shadow-sm">
              <i className="bi bi-journal-check" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h2 className="fw-extrabold text-dark mb-1">Welcome Back</h2>
            <p className="text-muted">Secure Login Portal</p>
          </div>
          
          <div className="d-grid gap-3">
            {USERS.map(u => (
              <button 
                key={u.id} 
                className={`btn btn-lg py-3 fw-bold rounded-4 shadow-sm ${u.role === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => login(u.id)}
              >
                {u.role === 'admin' ? '🔑' : '👤'} Login as {u.name}
              </button>
            ))}
          </div>
          
          <div className="mt-5 border-top pt-3">
            <small className="text-muted">Task Management System</small>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        <header className="d-flex justify-content-between align-items-center mb-5 bg-white p-3 rounded-4 shadow-sm border">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded-3 p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              <i className="bi bi-layers-half text-white"></i>
            </div>
            <h4 className="fw-bold m-0 tracking-tight text-dark">Task <span className="text-primary">Manager</span></h4>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="fw-bold small text-dark">{currentUser.name}</div>
              <div className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase' }}>{currentUser.role}</div>
            </div>
            <button className="btn btn-light border-0 rounded-circle p-2" title="Logout" onClick={logout}>
              <i className="bi bi-box-arrow-right text-danger"></i>
            </button>
          </div>
        </header>

        <div className="row g-3 mb-4">
          <div className="col-md-5">
            <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border-0">
              <span className="input-group-text bg-white border-0 ps-3"><i className="bi bi-search text-muted"></i></span>
              <input 
                type="text" 
                className="form-control border-0 fs-6 ps-2" 
                placeholder="Search assignments..." 
                value={search}
                onChange={e => setSearch(e.target.value)} 
                style={{ height: '50px' }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select form-select-lg shadow-sm rounded-4 border-0 fs-6 text-muted" 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ height: '50px' }}
            >
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
              <option value="assignedTo">Sort by User</option>
            </select>
          </div>
          <div className="col-md-4 text-md-end">
            {currentUser.role === 'admin' && (
              <button 
                className="btn btn-primary btn-lg rounded-4 shadow px-4 fw-bold w-100 w-md-auto" 
                style={{ height: '50px', backgroundColor: '#4F46E5', border: 'none' }}
                onClick={() => setIsModalOpen(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>Create Task
              </button>
            )}
          </div>
        </div>

        <div className="row">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="col-lg-6 mb-4">
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                  <div style={{ height: '6px', width: '100%', backgroundColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981' }}></div>
                  <div className="p-0">
<TaskCard 
  task={task} 
  isAdmin={currentUser.role === 'admin'} 
  onDelete={handleDeleteTask} 
  onEdit={(taskToEdit) => {
    setEditingTask(taskToEdit); // Set the task we want to change
    setIsModalOpen(true);       // Open the form
  }} 
/>
                  </div>
                  <div className="bg-light p-4 pt-2 border-top">
                     <CommentSection 
                       task={task} 
                       onAddComment={handleAddComment} 
                       currentUser={currentUser} 
                     />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="card shadow-sm p-5 bg-white border-0 rounded-5 mx-auto" style={{ maxWidth: '550px' }}>
                <div className="mb-4 bg-light d-inline-block p-4 rounded-circle">
                  <i className="bi bi-folder2-open text-primary" style={{ fontSize: '3.5rem' }}></i>
                </div>
                <h3 className="fw-bold text-dark mb-2">No Active Tasks</h3>
                <p className="text-muted px-lg-5 mb-4">Your workspace is currently clear. Tasks assigned to you or matching your filters will appear here.</p>
                {currentUser.role === 'admin' && (
                  <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold" onClick={() => setIsModalOpen(true)}>
                    Start New Project
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
  <TaskForm 
    tasks={tasks} 
    existingTask={editingTask} // Pass the task data here!
    onSave={handleSaveTask} 
    onClose={() => {
      setIsModalOpen(false);
      setEditingTask(null); // Reset so "New Task" is empty next time
    }} 
  />
)}
      </div>
    </div>
  );
}; // <-- This closes MainApp

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}