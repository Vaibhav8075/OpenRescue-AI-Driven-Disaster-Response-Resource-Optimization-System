export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-semibold text-gray-800">
        Civic Analytics Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Total Complaints</h2>
          <p className="text-3xl font-bold mt-2">12,430</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Avg Resolution Time</h2>
          <p className="text-3xl font-bold mt-2">5.2 Days</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">High Priority Cases</h2>
          <p className="text-3xl font-bold mt-2 text-red-600">314</p>
        </div>
      </div>
    </div>
  );
}
