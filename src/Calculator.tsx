import React, { useEffect, useState, useCallback } from 'react';

const Button: React.FC<{value: number | string, onClick: any}> = ({ value, onClick }) => {
  return <button onClick={onClick}>{value}</button>
}

const Calculator: React.FC = ({ }) => {
  const [value, setValue] = useState('');
  const onNumberClick = (v: number) => {
    return (e: React.MouseEvent) => {
      setValue(`${value}${v.toString()}`)
    }
  }

  const onOpClick = (op: string) => {
    return (e: React.MouseEvent) => {
      if (op === "=") {
        setValue(eval(value))
      } else if (op === "AC") {
        setValue('')
      } else {
        setValue(`${value}${op}`)
      }
    }
  }
  return (
    <div className="calculator-block">
      <div>{value === '' ? '0' : value}</div>
      <table>
        <tbody>
          <tr>
            <td><Button value="(" onClick={onOpClick("(")}/></td>
            <td><Button value=")" onClick={onOpClick(")")}/></td>
            <td><Button value="%" onClick={onOpClick("%")}/></td>
            <td><Button value="AC" onClick={onOpClick("AC")}/></td>
          </tr>
          <tr>
          {[7,8,9].map(i => {
              return <td key={i}><Button value={i} onClick={onNumberClick(i)}/></td>
            })}
            <td><Button value="÷" onClick={onOpClick("/")}/></td>
          </tr>
          <tr>
            {[4,5,6].map(i => {
              return <td key={i}><Button value={i} onClick={onNumberClick(i)}/></td>
            })}
            <td><Button value="×" onClick={onOpClick("*")}/></td>
          </tr>
          <tr>
            {[1,2,3].map(i => {
              return <td key={i}><Button value={i} onClick={onNumberClick(i)}/></td>
            })}
            <td><Button value="−" onClick={onOpClick("-")}/></td>
          </tr>
          <tr>
            <td><Button value="0" onClick={onNumberClick(0)}/></td>
            <td><Button value="." onClick={onOpClick(".")}/></td>
            <td><Button value="=" onClick={onOpClick("=")}/></td>
            <td><Button value="+" onClick={onOpClick("+")}/></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Calculator;