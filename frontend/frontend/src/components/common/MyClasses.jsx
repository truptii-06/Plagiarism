import React, { useState } from 'react';
import './MyClasses.css'; // We will create this new CSS file

const MyClasses = () => {
  // Mock data for the classes list
  const [classes, setClasses] = useState([
    { id: 1, name: 'Information Technology - TE', subject: 'AI', students: 28 },
    { id: 2, name: 'Computer Science - SE', subject: 'Data Science', students: 35 },
    { id: 3, name: 'Information Technology - BE', subject: 'Machine Learning', students: 22 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('');

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName || !newClassSubject) {
      alert('Please fill out all fields.');
      return;
    }
    const newClass = {
      id: classes.length + 1,
      name: newClassName,
      subject: newClassSubject,
      students: 0,
    };
    setClasses([...classes, newClass]);
    setShowForm(false); // Hide form after submission
    setNewClassName(''); // Reset form fields
    setNewClassSubject('');
  };

  return (
    <div className="my-classes-container">
      <div className="classes-header">
        <h2>My Classes</h2>
        <button className="create-class-btn" onClick={() => setShowForm(true)}>
          + Create New Class
        </button>
      </div>
      
      <p>Manage your classes and view enrolled students.</p>

      <div className="class-grid">
        {classes.map((cls) => (
          <div className="class-card" key={cls.id}>
            <h3>{cls.name}</h3>
            <p className="class-subject">{cls.subject}</p>
            <div className="class-info">
              <span className="student-count">{cls.students} Students</span>
              <button className="manage-btn">Manage</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form for Creating a New Class */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h3>Create a New Class</h3>
            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label htmlFor="className">Class Name</label>
                <input
                  type="text"
                  id="className"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., Grade 10 - English"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="classSubject">Subject</label>
                <input
                  type="text"
                  id="classSubject"
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  placeholder="e.g., English"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit">Create Class</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;