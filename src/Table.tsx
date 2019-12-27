import React from 'react';

interface TableProperty {
  fields: string[]
  records: any[]
}

const Table: React.FC<TableProperty> = ({ fields, records }) => {
  return (
    <table className="flex-table">
      <thead>
      <tr>
        {fields.map(field => {
          return <th key={field}>{field}</th>
        })}
      </tr>
      </thead>
      <tbody>
        {records.map(record => {
          return (
            <tr key={record.Id}>
              {fields.map(field => (
                <td key={`${record.Id}-${field}`}>{record[field]}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default Table;