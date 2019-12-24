import React from 'react';

interface IconProperty {
  id: string
  img: any 
  name: string
  style: any
  onDoubleClick: any
  onMouseDown: any
  selected: boolean
}

const Icon: React.FC<IconProperty> = ({ style, id, name, selected, img, onDoubleClick, onMouseDown }) => {
  return (
    <div id={id} 
      style={style}
      className={'app-icon ' + id + (selected ? ' app-icon-clicked' : '')}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}>
      <div className="relative">
        <img data-icon-id={id} src={img} />
        <span className="app-icon-name">{name}</span>
      </div>
    </div>
  );
}

export default Icon;