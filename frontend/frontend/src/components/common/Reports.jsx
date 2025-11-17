import React, { useState } from 'react';
import './Reports.css'; // We'll create this new CSS file

const Reports = () => {
  // Mock data for the reports list. You would fetch this from your backend.
  const [reports, setReports] = useState([
    {
      id: 1,
      projectName: 'Research Paper Analysis',
      submittedDate: '2025-09-25',
      status: 'Completed',
    },
    {
      id: 2,
      projectName: 'Advanced Algorithms Thesis',
      submittedDate: '2025-09-26',
      status: 'In Process',
    },
    {
      id: 3,
      projectName: 'Market Research for New App',
      submittedDate: '2025-09-27',
      status: 'Pending',
    },
    {
      id: 4,
      projectName: 'History of Ancient Rome Essay',
      submittedDate: '2025-09-22',
      status: 'Completed',
    },
  ]);

  return (
    <div className="reports-container">
      <h2>My Reports</h2>
      <p>Track the status of your submitted documents and view final reports.</p>
      
      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.projectName}</td>
                <td>{report.submittedDate}</td>
                <td>
                  <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="view-report-btn" 
                    disabled={report.status !== 'Completed'}
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;