import React, { useState } from 'react';
import Table from './Table';

const AccountList: React.FC = ({ children }) => {
  const [records, setRecords] = useState([
    {
      Id: '123',
      Name: 'hello',
    },
    {
      Id: '321',
      Name: 'world',
    }
  ]);
  const [fields, setFields] = useState(['Id', 'Name', 'CreatedDate'])
  return (
    <div>
      <Table records={records} fields={fields}/>
    </div>
  );
}

export default AccountList;