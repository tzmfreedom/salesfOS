import React, { useState, useCallback } from 'react';
import Icon from './Icon';
import './App.scss';
import folderImg from './img/folder.png';
import gameImg from './img/game.png';
import monitorImg from './img/monitor.png';
import cryptographyImg from './img/cryptography.png';
import penImg from './img/pen.png';
import trashImg from './img/trash.png';

// const jsforce = require('jsforce');

// jsforce.browser.init({
//   clientId: process.env.REACT_APP_SALESFORCE_CLIENT_ID,
//   redirectUri: process.env.REACT_APP_SALESFORCE_REDIRECT_URI,
// });

const originalMousemove = document.onmousemove
const originalMouseup = document.onmouseup

const defaultIcons: any = {
  folder: {
    img: folderImg,
    name: '取引先一覧',
    left: 20,
    top: 20,
    style: {
    },
    selected: true,
  },
  game: {
    img: gameImg,
    name: 'Trailhead',
    left: 20,
    top: 100,
    style: {
    },
    selected: false,
  },
  monitor: {
    img: monitorImg,
    name: 'ログイン画面',
    left: 20,
    top: 180,
    style: {
    },
    selected: false,
  },
  cryptography: {
    img: cryptographyImg,
    name: 'オブジェクト一覧',
    left: 20,
    top: 260,
    style: {
    },
    selected: false,
  },
  pen: {
    img: penImg,
    name: 'Reference',
    left: 20,
    top: 340,
    style: {
    },
    selected: false,
  },
  trash: {
    img: trashImg,
    name: 'ゴミ箱',
    left: 20,
    top: 420,
    style: {
      border: '',
    },
    selected: false,
  },
};

const onDoubleClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
  alert('hello')
}

const App: React.FC = () => {
  const [icons, setIcons] = useState(defaultIcons)
  const [selectedIconId, setSelectedIconId] = useState('game')
  const [oldX, setOldX] = useState(0)
  const [oldY, setOldY] = useState(0)
  const [draggedIconId, setDraggedIconId] = useState('')

  const onMouseDown = (iconId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();

      setSelectedIconId(iconId)
      // get the mouse cursor position at startup:
      setOldX(e.clientX);
      setOldY(e.clientY);
      setDraggedIconId(iconId);
    }
  }

  document.onmouseup = draggedIconId === '' ? null : (e: MouseEvent) => {
    if (draggedIconId !== 'trash' && isOnTrash(e)) {
      delete icons[draggedIconId];
      setIcons(icons);
    }
    setDraggedIconId('')
  }

  const isOnTrash = useCallback((e) => {
    const trash = icons.trash;
    return e.clientX >= trash.left &&
      e.clientX <= trash.left + 66 &&
      e.clientY >= trash.top &&
      e.clientY <= trash.top + 66;
  }, [icons.trash])

  document.onmousemove = draggedIconId === '' ? null : (e: MouseEvent) => {
    e.preventDefault();
    // calculate the new cursor position:
    setOldX(e.clientX);
    setOldY(e.clientY);

    const icon = icons[draggedIconId]
    // set the element's new position:
    icon.top = (icon.top + e.clientY - oldY);
    icon.left = (icon.left + e.clientX - oldX);
    if (draggedIconId !== 'trash') {
      if (isOnTrash(e)) {
        icons.trash.style = { ...icons.trash.style, border: 'solid 1px red'};
      } else {
        icons.trash.style = { ...icons.trash.style, border: ''};
      }
    }
    setIcons(icons)
  }
  return (
    <div className="App">
      {Object.keys(icons).map((iconId) => {
        const icon = icons[iconId]
        return <Icon key={iconId} id={iconId} img={icon.img} name={icon.name}
          style={{left: `${icon.left}px`, top: `${icon.top}px`, ...icon.style}}
          selected={selectedIconId === iconId}
          onMouseDown={onMouseDown(iconId)}
          onDoubleClick={onDoubleClick}/>
      })}
      <div className="app-bottom-bar">
        <div className="app-bar_start"><i className="fas fa-cloud"></i></div>
        <div className="app-bar-icon">
          <div style={{float: "left"}}>
            <i className="fas fa-wifi"></i>
            <i className="fas fa-volume-up"></i>
            <i className="fas fa-battery-three-quarters"></i>
          </div>
          <div className="app-bar_time">
            <div className="date"></div>
            <div className="time"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;