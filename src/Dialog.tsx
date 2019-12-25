import React, { MouseEvent } from 'react';

interface Property {
  id: string
  name: string
  style: any
  onMouseDown: any
  selected: boolean
  onClose: (e: React.MouseEvent) => void
  onMinimize: (e: React.MouseEvent) => void
  onMaximize: (e: React.MouseEvent) => void
}

const Dialog: React.FC<Property> = ({ children, style, id, onMouseDown, selected, onClose, onMinimize, onMaximize }) => {
  return (
    <div id={id} 
      style={{zIndex: 10, ...style, width: '800px', height: '300px', backgroundColor: 'white'}}
      className={'dialog' + (selected ? ' dialog-selected' : '')}
      >
      <div className="title-bar" onMouseDown={onMouseDown}>
        <div className="dialog-close" onClick={onClose}></div>
        <div className="dialog-min" onClick={onMinimize}></div>
        <div className="dialog-max" onClick={onMaximize}></div>
      </div>
      <div className="dialog-content">
      {children}
      </div>
    </div>
  );
}

export default Dialog;