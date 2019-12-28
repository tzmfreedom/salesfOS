import React, { useState, useEffect } from 'react';
import Table from './Table';

interface AccountListProperty {
  connection: Connection
}

interface Connection {
  query: (q: string, f: (err: string, res: RecordResponse) => void) => void
}

interface RecordResponse {
  records: any[]
}

const AccountList: React.FC<AccountListProperty> = ({ children, connection }) => {
  const [records, setRecords] = useState([] as any[]);
  const [fields, setFields] = useState(['Id', 'Name', 'CreatedDate'])
  const [isRequiredConnection, setIsRequiredConnection] = useState(false)

  useEffect(() => {
    if (connection) {
      connection.query('SELECT Id, Name, CreatedDate FROM Account', (err: string, res: RecordResponse) => {
        if (err) { console.error(err); return; }
        setRecords(res.records)
      });
    } else {
      setIsRequiredConnection(true);
    }
  }, [connection])
  return (
    (isRequiredConnection ? (
      <div>認証が必要です</div>
    ) : (
      <Table records={records} fields={fields} />
    ))
  );
}

export default AccountList;