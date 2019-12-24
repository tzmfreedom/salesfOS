import React, { useState, useCallback, useEffect } from 'react';
import Icon from './Icon';
import Dialog from './Dialog';
import './App.scss';
import folderImg from './img/folder.png';
import gameImg from './img/game.png';
import monitorImg from './img/monitor.png';
import cryptographyImg from './img/cryptography.png';
import penImg from './img/pen.png';
import trashImg from './img/trash.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWifi, faVolumeUp, faBatteryThreeQuarters, faCloud } from '@fortawesome/free-solid-svg-icons'

const jsforce = require('jsforce');

let incrementalIndex = 10

const defaultIcons: any = {
  folder: {
    img: folderImg,
    name: '取引先一覧',
    left: 20,
    top: 20,
    style: {
    },
    selected: true,
    onDoubleClick(e: React.MouseEvent) {
    }
  },
  game: {
    img: gameImg,
    name: 'Trailhead',
    left: 20,
    top: 100,
    style: {
    },
    selected: false,
    onDoubleClick(e: React.MouseEvent) {
      alert('game')
    }
  },
  monitor: {
    img: monitorImg,
    name: 'ログイン画面',
    left: 20,
    top: 180,
    style: {
    },
    selected: false,
    onDoubleClick(e: React.MouseEvent) {
      alert('hello')
    }
  },
  cryptography: {
    img: cryptographyImg,
    name: 'オブジェクト一覧',
    left: 20,
    top: 260,
    style: {
    },
    selected: false,
    onDoubleClick(e: React.MouseEvent) {
      alert('hello')
    }
  },
  pen: {
    img: penImg,
    name: 'Reference',
    left: 20,
    top: 340,
    style: {
    },
    selected: false,
    onDoubleClick(e: React.MouseEvent) {
      alert('hello')
    }
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
    onDoubleClick(e: React.MouseEvent) {
      alert('hello')
    }
  },
};

const appStart = () => jsforce.browser.login();

const App: React.FC = () => {
  const [iconConfig, setIconConfig] = useState({
    icons: defaultIcons,
    dialogs: {} as any,
    draggedIconId: '',
    draggedDialogId: '',
  })
  const [selectedIconId, setSelectedIconId] = useState('game')
  const [selectedDialogId, setSelectedDialogId] = useState('')
  const [oldX, setOldX] = useState(0)
  const [oldY, setOldY] = useState(0)

  const onMouseDown = useCallback((iconId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();

      setSelectedIconId(iconId)
      // get the mouse cursor position at startup:
      setOldX(e.clientX);
      setOldY(e.clientY);
      setIconConfig((prevState: any) => {
        return {...prevState, draggedIconId: iconId}
      });
    }
  }, [])

  const isOnTrash = (trash: any, e: any) => {
    return e.clientX >= trash.left &&
      e.clientX <= trash.left + 66 &&
      e.clientY >= trash.top &&
      e.clientY <= trash.top + 66;
  }

  useEffect(() => {
    jsforce.browser.init({
      clientId: process.env.SALESFORCE_CLIENT_ID,
      redirectUri: process.env.SALESFORCE_REDIRECT_URI,
    });
  })

  useEffect(() => {
    const onmouseup = (e: MouseEvent) => {
      setIconConfig((prevState: any) => {
        if (prevState.draggedIconId !== 'trash' && isOnTrash(prevState.icons.trash, e)) {
          delete prevState.icons[iconConfig.draggedIconId];
          return { ...prevState, icons: prevState.icons, draggedIconId: '' }
        }
        return { ...prevState, draggedIconId: '', draggedDialogId: '' }
      });
    }
    document.addEventListener('mouseup', onmouseup)
    return () => document.removeEventListener('mouseup', onmouseup)
  })

  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      // calculate the new cursor position:
      setOldX(e.clientX);
      setOldY(e.clientY);
      setIconConfig((prevState: any) => {
        if (prevState.draggedIconId !== '') {
          const icons = prevState.icons
          const icon = icons[prevState.draggedIconId]
          // set the element's new position:
          icon.top = (icon.top + e.clientY - oldY);
          icon.left = (icon.left + e.clientX - oldX);
          if (prevState.draggedIconId !== 'trash') {
            if (isOnTrash(prevState.icons.trash, e)) {
              icons.trash.style = { ...icons.trash.style, border: 'solid 1px red' };
            } else {
              icons.trash.style = { ...icons.trash.style, border: '' };
            }
          }
          return {...prevState, icons: prevState.icons}
        } else if (prevState.draggedDialogId !== '') {
          const dialogs= prevState.dialogs
          const dialog = dialogs[prevState.draggedDialogId]
          // set the element's new position:
          dialog.top = (dialog.top + e.clientY - oldY);
          dialog.left = (dialog.left + e.clientX - oldX);
          return {...prevState, dialogs: prevState.dialogs}
        }
        return prevState
      })
    }
    document.addEventListener('mousemove', onmousemove)
    return () => document.removeEventListener('mousemove', onmousemove)
  })

  const onDialogMouseDown = useCallback((dialogId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();

      setSelectedDialogId(dialogId);
      // get the mouse cursor position at startup:
      setOldX(e.clientX);
      setOldY(e.clientY);
      setIconConfig((prevState: any) => {
        const dialog = prevState.dialogs[dialogId]
        dialog.style.zIndex = ++incrementalIndex
        return {...prevState, dialogs: prevState.dialogs, draggedDialogId: dialogId}
      });
    }
  }, [])

  const { icons, dialogs } = iconConfig
  return (
    <div className="App">
      {Object.keys(icons).map((iconId) => {
        const icon = icons[iconId]
        return <Icon key={iconId} id={iconId} img={icon.img} name={icon.name}
          style={{left: `${icon.left}px`, top: `${icon.top}px`, ...icon.style}}
          selected={selectedIconId === iconId}
          onMouseDown={onMouseDown(iconId)}
          onDoubleClick={() => {
            setIconConfig(prevState => {
              const id = Object.keys(prevState.dialogs).length
              const dialogs = {
                ...prevState.dialogs,
                [id] : {
                  id,
                  name: 'hoge',
                  left: 100,
                  top: 100,
                  style: {
                    zIndex: ++incrementalIndex,
                  },
                  children: <div>{id}</div>,
                }
              }
              console.log(dialogs)
              return {...prevState, dialogs: dialogs}
            })
          }}/>
      })}
      {Object.keys(dialogs).map((dialogId) => {
        const dialog = dialogs[dialogId]
        return <Dialog key={dialogId} id={dialogId} name={dialog.name}
          style={{left: `${dialog.left}px`, top: `${dialog.top}px`, ...dialog.style}}
          onMouseDown={onDialogMouseDown(dialogId)}
          selected={selectedDialogId === dialogId}
          >{dialog.children}</Dialog>
      })}
      <div className="app-bottom-bar">
        <div className="app-bar_start">
          <FontAwesomeIcon icon={faCloud} onClick={appStart}/>
        </div>
        <div className="app-bar-icon">
          <div style={{float: "left"}}>
            <FontAwesomeIcon icon={faWifi} />
            <FontAwesomeIcon icon={faVolumeUp} />
            <FontAwesomeIcon icon={faBatteryThreeQuarters} />
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