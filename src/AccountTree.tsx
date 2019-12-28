import React, { useState, useEffect } from 'react';
import Folder from './Folder';

interface AccountListProperty {
  connection: Connection
}

interface Connection {
  query: (q: string, f: (err: string, res: RecordResponse) => void) => void
}

interface RecordResponse {
  records: any[]
}

const AccountTree: React.FC<AccountListProperty> = ({ connection }) => {
  const [files, setFiles] = useState([] as any[]);
  const [isRequiredConnection, setIsRequiredConnection] = useState(false)

  useEffect(() => {
    if (connection) {
      connection.query('SELECT Name, (SELECT Name FROM Contacts) FROM Account', (err: string, res: RecordResponse) => {
        if (err) { console.error(err); return; }
        setFiles(res.records.map(r => {
          if (r.Contacts !== null) {
            return {
              type: "Directory",
              name: r.Name,
              show: false,
              files: r.Contacts.records.map((c: any) => {
                return {
                  type: "File",
                  name: c.Name,
                }
              })
            }
          } else {
            return {
              type: "File",
              name: r.Name,
            }
          }
        }))
      });
    } else {
      setIsRequiredConnection(true);
    }
  }, [connection])
  return (
    isRequiredConnection ? (
      <div>認証が必要です</div>
    ) : <Folder name="AccountTree" show={true} files={files}/>
  );
}

export default AccountTree;