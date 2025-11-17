import React from 'react';
import './MyClasses.css';

const MyClasses = () => {
  // Mock data based on the screenshot
  const classes = [
    { id: 1, name: 'Data Structures', teacher: 'Prof. John Doe', dueDate: '2025-11-15', status: 'Completed' },
    { id: 2, name: 'Algorithms', teacher: 'Prof. Jane Smith', dueDate: '2025-11-20', status: 'Pending' },
    { id: 3, name: 'Database Systems', teacher: 'Dr. Emily White', dueDate: '2025-11-10', status: 'Completed' },
  ];

  return (
    <div className="my-classes-container">
      <h2>My Classes</h2>
      <div className="table-wrapper">
        <table className="classes-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Teacher</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.teacher}</td>
                <td>{cls.dueDate}</td>
                <td>
                  <span className={`status ${cls.status.toLowerCase()}`}>{cls.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClasses;