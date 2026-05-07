import React from "react";

export default function TaskCard({ task, isAdmin, onDelete, onEdit }) {
  return (
    <div className="p-4 bg-white position-relative">
      {/* CRUD Action Buttons for Admin only */}
      {isAdmin && (
        <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
          <button className="btn btn-light btn-sm border" onClick={() => onEdit(task)}>
            <i className="bi bi-pencil text-primary"></i>
          </button>
          <button className="btn btn-light btn-sm border" onClick={() => onDelete(task.id)}>
            <i className="bi bi-trash text-danger"></i>
          </button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-start mb-2 pe-5">
        <h5 className="fw-bold text-dark mb-0 fs-4">{task.title}</h5>
      </div>

      <p className="text-secondary mb-4 pe-2" style={{ fontSize: '15px', lineHeight: '1.6' }}>
        {task.description || "No project overview provided."}
      </p>

      <div className="d-flex align-items-center gap-3">
        <span className={`badge rounded-pill px-3 py-2 ${task.status === 'Completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'}`}>
          {task.status}
        </span>
        <div className="d-flex align-items-center gap-1 text-muted small">
          <i className="bi bi-flag-fill"></i>
          <span>{task.priority}</span>
        </div>
        <div className="d-flex align-items-center gap-1 text-muted small ms-auto">
          <i className="bi bi-person-circle"></i>
          <span className="fw-medium">{task.assignedTo}</span>
        </div>
      </div>
    </div>
  );
}