interface Props {
  data: Array<any>;
  columns: Array<{ prop: string; label: string }>;
}

function Table(props: Props) {
  const { columns, data } = props;

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((raw, rindex) => (
          <tr key={rindex}>
            {columns.map((column, cindex) => (
              <td key={cindex}>{raw[column.prop]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
