export default function SummaryCards({ summary }) {
  return (
    <div className="d-flex flex-wrap gap-3">
      <Card title="Total Cuisines" value={summary.totalCuisines} />
      <Card title="Active Cuisines" value={summary.activeCuisines} />
      <Card title="Total Sections" value={summary.totalSections} />
      <Card title="Total Items" value={summary.totalItems} />
      <Card title="Popular Items" value={summary.popularItems} />
      <Card title="Veg Items" value={summary.vegItems} />
      <Card title="Non-Veg Items" value={summary.nonVegItems} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      className="bg-white p-3 rounded shadow-sm dashboardSummaryCard"
    //   style={{ width: "180px" }}
    >
      <p className="mb-1   fw-bold text-gray">{title}</p>
      <h4 className="mb-0">{value}</h4>
    </div>
  );
}
