import React, { useState } from 'react';

const CommentSection = ({ task, onAddComment, currentUser }) => {
  const [text, setText] = useState('');
  const [replyState, setReplyState] = useState({ commentId: null, text: '' });

  const handlePostComment = () => {
    if (!text.trim()) return;
    onAddComment(task.id, text);
    setText('');
  };

  const handlePostReply = (commentId) => {
    if (!replyState.text.trim()) return;
    onAddComment(task.id, replyState.text, commentId);
    setReplyState({ commentId: null, text: '' });
  };

  return (
    <div className="mt-3">
      <h6 className="border-bottom pb-1">Comments</h6>
      <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {task.comments.map(c => (
          <div key={c.id} className="mb-2 p-2 bg-light rounded shadow-sm">
            <small className="fw-bold text-primary">{c.user}</small>
            <p className="mb-1 small">{c.text}</p>
            
            {/* Replies */}
            <div className="ms-4 border-start ps-2">
              {c.replies.map(r => (
                <div key={r.id} className="small mb-1">
                  <span className="fw-bold">{r.user}:</span> {r.text}
                </div>
              ))}
              
              {/* Reply Input */}
              <div className="d-flex gap-1 mt-1">
                <input 
                  className="form-control form-control-sm" 
                  placeholder="Write a reply..."
                  value={replyState.commentId === c.id ? replyState.text : ''}
                  onChange={(e) => setReplyState({ commentId: c.id, text: e.target.value })}
                />
                <button className="btn btn-sm btn-link text-decoration-none" onClick={() => handlePostReply(c.id)}>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-group input-group-sm">
        <input className="form-control" placeholder="Add comment..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn btn-primary" onClick={handlePostComment}>Post</button>
      </div>
    </div>
  );
};

export default CommentSection;