import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [data, setData] = useState([]);

    // 1. Pull the API URL from .env
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // 2. Use the variable for the GET request
        // Added a fallback check just in case the variable is missing
        if (API_URL) {
            fetch(`${API_URL}/admin/leaderboard/`)
                .then(res => res.json())
                .then(json => setData(json))
                .catch(err => console.error("Error fetching leaderboard:", err));
        } else {
            console.warn("REACT_APP_API_URL is not defined in .env");
        }
    }, [API_URL]);

    return (
        <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '15px' }}>
            <h2 style={{ color: '#D35400', marginBottom: '20px' }}>🏆 Company Leaderboard</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #FFE0D0', color: '#888' }}>
                        <th style={{ padding: '12px' }}>Rank</th>
                        <th style={{ padding: '12px' }}>Name</th>
                        <th style={{ padding: '12px' }}>Shoutouts</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((user, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#D35400' }}>{index + 1}</td>
                                <td style={{ padding: '15px' }}>{user.name}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        backgroundColor: '#FFE0D0', 
                                        padding: '5px 12px', 
                                        borderRadius: '20px', 
                                        fontWeight: 'bold',
                                        color: '#D35400' 
                                    }}>
                                        {user.shoutout_count}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                Loading leaderboard...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;