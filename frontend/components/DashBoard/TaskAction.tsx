import React, { useState } from 'react';

const TaskAction = ({ task }) => {
  const [action, setAction] = useState('');

  const handleReject = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/tasks/${task._id}/reject-${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    alert(data.message);
  };

  const handleApprove = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/tasks/${task._id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className='absolute right-4 top-4 w-20 h-20'>
      {task.pendingAction && (
        <>
          <button onClick={handleApprove}>Approve</button>
          <button onClick={handleReject}>Reject</button>
        </>
      )}
    </div>
  );
};

export default TaskAction;
