import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import ModerationTable from "../components/ModerationTable";
import DepartmentChart from "../components/DepartmentChart";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, shoutouts: 0, reports: 0 });

  useEffect(() => {
    fetch("http://localhost:8000/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Shout-outs" value={stats.shoutouts.toLocaleString()} />
        <StatCard title="Active Users" value={stats.users.toLocaleString()} />
        <StatCard title="Flagged Content" value={stats.reports.toLocaleString()} />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepartmentChart />
        <ModerationTable />
      </div>
    </div>
  );
}
