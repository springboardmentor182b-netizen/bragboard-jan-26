
import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Load the reports when the page opens
    const fetchReports = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/admin/reports');
            const data = await response.json();
            setReports(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // 2. Function to delete a bad shoutout
    // 2. Function to delete a bad shoutout
const handleDelete = async (shoutoutId) => { // <--- This is the variable name
    if (window.confirm("Are you sure you want to delete this shoutout?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/shoutouts/${shoutoutId}`, { // <--- Updated this line
                method: 'DELETE',
            });
            if (response.ok) {
                alert("Shoutout removed successfully!");
                fetchReports(); // Refresh the list
            }
        } catch (error) {
            alert("Failed to delete shoutout.");
        }
    }
};

    if (loading) return <div className="p-10 text-center">Loading Reports...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Admin Moderation</h1>
            
            {reports.length === 0 ? (
                <p className="text-gray-500">No reports found. The board is clean!</p>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">Reason: {report.reason}</p>
                                <p className="text-sm text-gray-600">Shoutout ID: {report.shoutout_id}</p>
                            </div>
                            <button 
                                onClick={() => handleDelete(report.shoutout_id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Delete Shoutout
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;