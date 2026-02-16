import StatCard from "../components/StatCard";
import ModerationTable from "../components/ModerationTable";
import DepartmentChart from "../components/DepartmentChart";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Shout-outs" value="1,248" />
        <StatCard title="Active Users" value="856" />
        <StatCard title="Flagged Content" value="3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DepartmentChart />
        <ModerationTable />
      </div>
    </div>
  );
}
