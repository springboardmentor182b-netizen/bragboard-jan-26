import { useReports } from "../../features/reports/hooks/useReports";
import ReportCard from "../../features/reports/components/ReportCard";

const STATUS_TABS = ["All", "pending", "resolved", "dismissed"];

const ReportedShoutouts = () => {
  const {
    reports,
    loading,
    error,
    actionLoading,
    activeFilter,
    setActiveFilter,
    pendingCount,
    handleResolve,
    handleDelete,
  } = useReports("pending");

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reported Shoutouts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and action shoutouts flagged by employees
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b pb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
              activeFilter === tab
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3
                        rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-400 text-sm">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🏳️</div>
          <p>No {activeFilter !== "All" ? activeFilter : ""} reports found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              actionLoading={actionLoading}
              onResolve={handleResolve}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportedShoutouts;