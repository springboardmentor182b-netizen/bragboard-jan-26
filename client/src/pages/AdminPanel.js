import React, { useEffect, useState } from 'react';
// 1. Removed Sidebar import since it's redundant

const AdminPanel = () => {
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admin/reports');
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => { fetchReports(); }, []);

    const handleDelete = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this shoutout?")) {
        try {
            // UPDATED URL: Added /admin before /reports
            const response = await fetch(`http://127.0.0.1:8000/admin/reports/${reportId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert("Shoutout deleted.");
                fetchReports(); // This refreshes the table automatically
            }
        } catch (error) {
            console.error("Error deleting shoutout:", error);
        }
    }
};

    return (
        /* 2. Changed 'flex' container to a simple div since the global Sidebar 
           usually handles the layout positioning now */
        <div style={{ padding: '40px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '30px', color: '#333' }}>Reported Shoutouts Management</h1>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #F5F5F5', color: '#666' }}>
                        <th style={{ padding: '12px' }}>Employee</th>
                        <th style={{ padding: '12px' }}>Message</th>
                        <th style={{ padding: '12px' }}>Reason</th>
                        <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                {report.sender_name || "Unknown Employee"}
                            </td> 
                            
                            <td style={{ padding: '12px', fontStyle: 'italic' }}>
                                "{report.content || "No content available"}"
                            </td> 
                            
                            <td style={{ padding: '12px', color: '#d9534f' }}>
                                {report.reason}
                            </td>
                            
                            <td style={{ padding: '12px' }}>
                                <button 
                                    onClick={() => handleDelete(report.id)}
                                    style={{ 
                                        backgroundColor: '#FF4D4D', 
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '8px 16px', 
                                        borderRadius: '5px', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;