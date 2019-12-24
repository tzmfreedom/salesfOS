import React from 'react';

interface Property {
  id: string
  name: string
  style: any
  onMouseDown: any
  selected: boolean
}

const Dialog: React.FC<Property> = ({ children, style, id, name, onMouseDown, selected }) => {
  return (
    <div id={id} 
      style={{zIndex: 10, ...style, width: '500px', height: '300px', backgroundColor: 'white'}}
      className={'dialog' + (selected ? ' dialog-selected' : '')}
      onMouseDown={onMouseDown}
      >
        <h1>{name}</h1>
      {children}
    </div>
  );
}

export default Dialog;