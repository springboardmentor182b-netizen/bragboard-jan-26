import React, { useState, useEffect } from 'react';

const GiveShoutout = () => {
    const [users, setUsers] = useState([]);
    const [receiverId, setReceiverId] = useState('');
    const [message, setMessage] = useState('');

    // Fetch the list of users so we can choose one in a dropdown
    useEffect(() => {
        fetch('http://127.0.0.1:8000/leaderboard/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/leaderboard/shoutout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender: "Me (Intern)", 
                receiver_id: parseInt(receiverId),
                content: message
            }),
        });

        if (response.ok) {
            alert("Shoutout Sent! Refresh the leaderboard to see the change.");
            setMessage('');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
            <h3>📣 Give a Shoutout</h3>
            <form onSubmit={handleSubmit}>
                <select onChange={(e) => setReceiverId(e.target.value)} required>
                    <option value="">Select a Colleague</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <br /><br />
                <textarea 
                    placeholder="Why are they awesome?" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Send Shoutout</button>
            </form>
        </div>
    );
};

export default GiveShoutout;