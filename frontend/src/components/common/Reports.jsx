import React from 'react';
import './Reports.css';

const Reports = () => {
  // Mock data based on the screenshot
  const reports = [
    { id: 'R1001', className: 'Data Structures', plagiarism: 15 },
    { id: 'R1002', className: 'Algorithms', plagiarism: 0 },
    { id: 'R1003', className: 'Database Systems', plagiarism: 22 },
  ];

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Class Name</th>
              <th>Plagiarism (%)</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.className}</td>
                <td>{report.plagiarism}%</td>
                <td>
                  <button className="view-btn">View Report</button>
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