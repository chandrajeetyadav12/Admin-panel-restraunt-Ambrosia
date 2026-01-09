export default function SectionItemCount({ data }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm flex-fill">
      <h5 className="mb-3 heading_5">Section-wise Item Count</h5>

      <table className="table table-sm">
        <thead>
          <tr>
            <th>Section</th>
            <th>Cuisine</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.sectionName}</td>
              <td>{item.cuisineName}</td>
              <td>{item.totalItems}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
