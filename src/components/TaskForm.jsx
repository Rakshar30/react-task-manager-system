import React, { useState } from 'react';
import { USERS } from '../context/AuthContext';

const TaskForm = ({ onSave, tasks, existingTask = null, onClose }) => {
  const [formData, setFormData] = useState(existingTask || {
    title: '', description: '', status: 'Pending', priority: 'Low', assignedTo: 'Standard User', relatedTaskId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required");

    // Task Relationship Logic
    if (formData.relatedTaskId) {
      const related = tasks.find(t => t.id === parseInt(formData.relatedTaskId));
      if (related && related.assignedTo !== formData.assignedTo) {
        alert("Constraint Error: Tasks can only be linked if assigned to the same user!");
        return;
      }
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog">
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{existingTask ? 'Edit Task' : 'Create New Task'}</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit} className="modal-body">
            <label className="small fw-bold">Task Title</label>
            <input className="form-control mb-3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            
            <label className="small fw-bold">Description</label>
            <textarea className="form-control mb-3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="row">
              <div className="col-6 mb-3">
                <label className="small fw-bold">Priority</label>
                <select className="form-select" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
              <div className="col-6 mb-3">
                <label className="small fw-bold">Status</label>
                <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Pending</option><option>Completed</option>
                </select>
              </div>
            </div>

            <label className="small fw-bold">Assign To</label>
            <select className="form-select mb-3" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
              {USERS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
            </select>

            <label className="small fw-bold">Link Related Task (Optional)</label>
            <select className="form-select mb-3" value={formData.relatedTaskId} onChange={e => setFormData({...formData, relatedTaskId: e.target.value})}>
              <option value="">None</option>
              {tasks.filter(t => t.id !== formData.id).map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>

            <div className="modal-footer px-0 pb-0">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Task</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;