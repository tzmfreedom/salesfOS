import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';

interface Property {
  name: string
  files: Entry[]
  show: boolean
}

type Entry = AppFile | AppDirectory

interface AppFile {
  type: 'File'
  name: string
}

interface AppDirectory {
  type: 'Directory'
  name: string
  files: Entry[]
  show: boolean
}

const Folder: React.FC<Property> = ({ name, files, show }) => {
  const [isShow, setShow] = useState(show);
  const onClick = useCallback(() => {
    setShow(!isShow)
  }, [isShow]);
  return (
    <div className="folder-block">
      <span className="folder-title" onClick={onClick}>
        <span className="folder-name"><FontAwesomeIcon icon={isShow ? faFolderOpen : faFolder}/></span>
        {name}
      </span>
      <ul style={{display: (isShow ? 'block' : 'none')}}>
        {files.map((f, index) => {
          return f.type == 'File' ? (
            <li key={index}><span className="file-name"><FontAwesomeIcon icon={faFile} /></span>{f.name}</li>
          ) : <li key={index}><Folder name={f.name} show={f.show} files={f.files} /></li>
        })}
      </ul>
    </div>
  );
}

export default Folder;