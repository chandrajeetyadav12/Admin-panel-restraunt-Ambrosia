export default function CuisineDistribution({ data }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm flex-fill">
      <h5 className="mb-3 heading_5">Cuisine-wise Menu Distribution</h5>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Cuisine</th>
            <th>Sections</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.cuisineName}</td>
              <td>{item.totalSections}</td>
              <td>{item.totalItems}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
