import React from 'react';

interface TableProperty {
  fields: string[]
  records: any[]
}

const Table: React.FC<TableProperty> = ({ fields, records }) => {
  return (
    <table className="table-header-fixed">
      <thead>
      <tr>
        {fields.map(field => {
          return <th>{field}</th>
        })}
      </tr>
      </thead>
      <tbody>
        {records.map(record => {
          return (
            <tr>
              {fields.map(field => (
                <td>{record[field]}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default Table;