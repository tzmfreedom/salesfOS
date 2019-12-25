import React, { useState, useEffect } from 'react';
import Table from './Table';

const jsforce = require('jsforce');

interface AccountListProperty {
  connection: any
}

const AccountList: React.FC<AccountListProperty> = ({ children, connection }) => {
  const [records, setRecords] = useState([]);
  const [fields, setFields] = useState(['Id', 'Name', 'CreatedDate'])
  
  useEffect(() => {
    connection.query('SELECT Id, Name, CreatedDate FROM Account', (err: any, res: any) => {
      if (err) { console.error(err) }
      setRecords(res.records)
    })
  }, [])
  return (
    <Table records={records} fields={fields} />
  );
}

export default AccountList;