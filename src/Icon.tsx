import React from 'react';

interface Property {
  id: string
  img: string
  name: string
}

const Icon: React.FC<Property> = (props) => {
  return (
    <div id={props.id} className={'app-icon ' + props.id}>
      <div className="relative"><img src={props.img} />
        <span className="app-icon-name">{props.name}</span>
      </div>
    </div>
  );
}

export default Icon;