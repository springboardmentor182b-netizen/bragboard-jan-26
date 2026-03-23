import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [reports, setReports] = useState([]);

    // 1. Get the Base URL from your .env
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchReports = async () => {
        try {
            // 2. Use the variable for fetching reports
            const response = await fetch(`${API_URL}/admin/reports`);
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => { 
        if (API_URL) {
            fetchReports(); 
        }
    }, [API_URL]);

    const handleDelete = async (reportId) => {
        if (window.confirm("Are you sure you want to delete this shoutout?")) {
            try {
                // 3. Use the variable for the DELETE request
                const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Shoutout deleted.");
                    fetchReports(); // Refresh table
                }
            } catch (error) {
                console.error("Error deleting shoutout:", error);
            }
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '30px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
                Reported Shoutouts Management
            </h1>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #F5F5F5', color: '#666', backgroundColor: '#FAFAFA' }}>
                        <th style={{ padding: '15px' }}>Sender</th>
                        <th style={{ padding: '15px' }}>Receiver</th>
                        <th style={{ padding: '15px' }}>Message</th>
                        <th style={{ padding: '15px' }}>Reason</th>
                        <th style={{ padding: '15px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <tr key={report.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#444' }}>
                                    {report.sender_name || "Unknown Sender"}
                                </td> 
                                <td style={{ padding: '15px', color: '#555' }}>
                                    {report.receiver_name || "Alex Rivera"} 
                                </td> 
                                <td style={{ padding: '15px', fontStyle: 'italic', color: '#333', maxWidth: '300px' }}>
                                    "{report.content || "No content available"}"
                                </td> 
                                <td style={{ padding: '15px', color: '#d9534f', fontWeight: '500' }}>
                                    {report.reason}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button 
                                        onClick={() => handleDelete(report.id)}
                                        style={{ 
                                            backgroundColor: '#FF4D4D', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '8px 16px', 
                                            borderRadius: '5px', 
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            transition: '0.3s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#cc0000'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#FF4D4D'}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                No reports found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;