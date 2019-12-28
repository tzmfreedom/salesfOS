import React, { useState, useEffect } from 'react';
import Table from './Table';

const jsforce = require('jsforce');

interface SObjectListProperty {
  connection: any
}

const SObjectList: React.FC<SObjectListProperty> = ({ children, connection }) => {
  const [sObjects, setSObjects] = useState([]);
  const [fields, setFields] = useState(['label', 'name'])
  const [isRequiredConnection, setIsRequiredConnection] = useState(false)
  
  useEffect(() => {
    if (connection) {
      connection.describeGlobal((err: any, res: any) => {
        if (err) { console.error(err); return; }
        setSObjects(res.sobjects.filter((r: any) => r.custom));
      });
    } else {
      setIsRequiredConnection(true);
    }
  }, [connection])
  return (
    (isRequiredConnection ? (
      <div>認証が必要です</div>
    ) : (
    <Table records={sObjects} fields={fields} />
    ))
  );
}

export default SObjectList;