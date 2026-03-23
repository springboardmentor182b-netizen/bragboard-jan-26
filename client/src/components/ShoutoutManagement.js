import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShoutoutManagement = ({ onlyReported }) => {
    const [shoutouts, setShoutouts] = useState([]);
    
    // STRICTLY from .env only. No hardcoded strings allowed here.
    const API_BASE = process.env.REACT_APP_API_BASE_URL;

    const fetchAllData = async () => {
        try {
            // If API_BASE is undefined, this will throw an error, 
            // alerting you immediately that your .env is broken.
            const response = await axios.get(`${API_BASE}/shoutouts/`);
            const data = response.data.shoutouts ? response.data.shoutouts : response.data;
            setShoutouts(data);
        } catch (err) {
            console.error("Failed to load shoutouts. Check if .env is loaded:", err);
        }
    };

    // ... (rest of your deleteAction, approveAction, reportAction)

    // ACTION 1: Permanent Removal
    const deleteAction = async (id) => {
        if (window.confirm("Permanently delete this shoutout?")) {
            try {
                await axios.delete(`${API_BASE}/shoutouts/${id}`);
                fetchAllData();
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    // ACTION 2: Approve (Sets is_reported to false)
    const approveAction = async (id) => {
        try {
            await axios.put(`${API_BASE}/shoutouts/${id}`, { is_reported: false });
            fetchAllData(); 
        } catch (err) {
            console.error("Approval failed:", err);
        }
    };

    // ACTION 3: Report (Sets is_reported to true)
    const reportAction = async (id) => {
        try {
            await axios.put(`${API_BASE}/shoutouts/${id}`, { is_reported: true });
            fetchAllData();
        } catch (err) {
            console.error("Report failed:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [onlyReported]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2C3E50' }}>
                {onlyReported ? '🚩 Moderation Queue' : '🛠️ Global Management'}
            </h2>
            
            <table style={tableStyle}>
                <thead>
                    <tr style={{ backgroundColor: '#F8F9FA' }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Sender</th>
                        <th style={thStyle}>Receiver</th>
                        <th style={thStyle}>Message</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shoutouts
                        .filter(s => onlyReported ? s.is_reported === true : true)
                        .length > 0 ? (
                        shoutouts
                            .filter(s => onlyReported ? s.is_reported === true : true)
                            .map((s) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>{s.id}</td>
                                    <td style={tdStyle}><strong>{s.sender_name || s.sender}</strong></td>
                                    <td style={tdStyle}><strong>{s.receiver_name || s.receiver}</strong></td>
                                    <td style={tdStyle}>{s.content}</td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {/* APPROVE BUTTON (Green) */}
                                            <button onClick={() => approveAction(s.id)} style={approveBtn}>
                                                Approve
                                            </button>

                                            {/* REPORT BUTTON (Orange) - only shows if not already reported */}
                                            {!s.is_reported && (
                                                <button onClick={() => reportAction(s.id)} style={reportBtn}>
                                                    Report
                                                </button>
                                            )}
                                            
                                            {/* DELETE BUTTON (Red) */}
                                            <button onClick={() => deleteAction(s.id)} style={deleteBtn}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No records found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// --- Styling ---
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: '#fff' };
const thStyle = { borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left' };
const tdStyle = { padding: '12px', textAlign: 'left' };

const approveBtn = { backgroundColor: '#27AE60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const reportBtn = { backgroundColor: '#F39C12', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const deleteBtn = { backgroundColor: '#E74C3C', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };

export default ShoutoutManagement;