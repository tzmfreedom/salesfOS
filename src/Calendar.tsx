import React, { useEffect, useState, useCallback } from 'react';

interface Property {
  year: number
  month: number
}

const Calendar: React.FC<Property> = ({ year, month }) => {
  const [weeks, setWeeks] = useState<string[][]>([]);
  const [date, setDate] = useState({year, month});
  useEffect(() => {
    const {year, month} = date;
    const days = (new Date(year, month, 0)).getDate();
    const day = (new Date(year, month-1)).getDay();
    let w = [];
    const ws = [];
    for (let i = 0; i < day; i++) {
      w.push('');
    }
    for (let i = 0; i < days; i++) {
      const d = i + day;
      if (i !== 0 && d%7 === 0) {
        ws.push(w)
        w = [];
      }
      w.push((i+1).toString());
    }
    if (w.length > 0) {
      ws.push(w)
    }
    console.log(ws);
    setWeeks(ws);
  }, [date.year, date.month])

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    let {year, month} = date;
    if (month === 1) {
      month = 12;
      year--;
    } else {
      month--;
    }
    setDate({year, month});
  }, [date.year, date.month]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    let {year, month} = date;
    if (month === 12) {
      month = 1;
      year++;
    } else {
      month++;
    }
    setDate({year, month});
  }, [date.year, date.month]);
  return (
    <div className="calendar-block">
      <div>
        <button onClick={prev}>&lt;</button>
        <button onClick={next}>&gt;</button>
      </div>
      <h2>{date.year}/{date.month}</h2>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((days, index) => (
            <tr key={index}>
              {days.map((d, index) => (
                <td key={index}>{d}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;