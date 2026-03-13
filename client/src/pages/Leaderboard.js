import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/leaderboard/')
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error("Error:", err));
    }, []);

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
                    {data.map((user, index) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;