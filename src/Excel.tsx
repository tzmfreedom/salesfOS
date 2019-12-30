import React, { useState, useCallback } from 'react';

const initRows: string[][] = [];
for (let i = 0; i < 10; i++) {
  const row = [];
  for (let j = 0; j < 10; j++) {
    row.push('')
  }
  initRows.push(row)
}

const Excel: React.FC = ({ }) => {
  const [dump, setDump] = useState('')
  const [rows, setRows] = useState<string[][]>(initRows)
  const onInput = (i: number, j: number) => {
    return (e: React.FormEvent<HTMLTableCellElement>) => {
      rows[i][j] = e.currentTarget.innerText
      setRows(rows)
    }
  }
  const onClick = useCallback((e: React.MouseEvent) => {
    setDump(rows.map(row => row.join(',')).join("\n"))
  }, [])
  return (
    <div className="excel-block">
      <table>
        <tbody>
          {rows.map((columns, i) => {
            return (
              <tr key={i}>
                {columns.map((column, j)=> {
                  return <td key={j}
                    onInput={onInput(i, j)}
                    suppressContentEditableWarning={true}
                    contentEditable={true}>{column}</td>
                })}
              </tr>
            )
          })}
          <tr></tr>
        </tbody>
      </table>
      <button onClick={onClick}>ダンプ</button>
      <pre>{dump}</pre>
    </div>
  );
}

export default Excel;