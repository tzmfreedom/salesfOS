import React, { useState, useCallback, useEffect } from 'react';
import Icon from './Icon';
import Dialog from './Dialog';
import AccountList from './AccountList';
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
let connection: any;

interface IconProperty {
  img: any
  name: string
  left: number
  top: number
  style: any
  selected: boolean
  type: 'link' | 'window'
  link?: string
  body?: () => JSX.Element
}

interface IconConfig {
  icons: {[a: string]: IconProperty}
  dialogs: any,
  draggedIconId: string
  draggedDialogId: string
  mouse: {x: number, y: number}
}

const defaultIcons: {[s: string]: IconProperty} = {
  folder: {
    img: folderImg,
    name: '取引先一覧',
    left: 20,
    top: 20,
    style: {
    },
    selected: true,
    type: 'window',
    body: () => <AccountList connection={connection} />
  },
  game: {
    img: gameImg,
    name: 'Trailhead',
    left: 20,
    top: 100,
    style: {
    },
    selected: false,
    type: 'link',
    link: 'https://www.google.co.jp',
  },
  monitor: {
    img: monitorImg,
    name: 'ログイン画面',
    left: 20,
    top: 180,
    style: {
    },
    selected: false,
    type: 'link',
    link: 'https://login.salesforce.com',
  },
  cryptography: {
    img: cryptographyImg,
    name: 'オブジェクト一覧',
    left: 20,
    top: 260,
    style: {
    },
    selected: false,
    type: 'window',
    body: () => <AccountList connection={connection} />
  },
  pen: {
    img: penImg,
    name: 'Reference',
    left: 20,
    top: 340,
    style: {
    },
    selected: false,
    type: 'link',
    link: 'https://trailhead.salesforce.com',
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
    type: 'window',
    body: () => <AccountList connection={connection}/>
  },
};

const appStart = () => jsforce.browser.login();

const App: React.FC = () => {
  const [iconConfig, setIconConfig] = useState({
    icons: defaultIcons,
    dialogs: {} as any,
    draggedIconId: '',
    draggedDialogId: '',
    mouse: {
      x: 0,
      y: 0,
    }
  } as IconConfig)
  const [selectedIconId, setSelectedIconId] = useState('game')
  const [selectedDialogId, setSelectedDialogId] = useState('')

  const onMouseDown = (iconId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      // e.persist()
      const x = e.clientX
      const y = e.clientY

      setSelectedIconId(iconId)
      // get the mouse cursor position at startup:
      setIconConfig((prevState: IconConfig) => {
        return {...prevState, mouse: { x, y}, draggedIconId: iconId}
      });
    }
  }

  const isOnTrash = useCallback((trash: IconProperty, e: MouseEvent) => {
    return e.clientX >= trash.left &&
      e.clientX <= trash.left + 66 &&
      e.clientY >= trash.top &&
      e.clientY <= trash.top + 66;
  }, [])

  useEffect(() => {
    jsforce.browser.init({
      clientId: process.env.client_id,
      redirectUri: process.env.redirect_uri,
      proxyUrl: 'https://tzmfreedom-jsforce-proxy.herokuapp.com/proxy/'
    });

    jsforce.browser.on('connect', function(conn: any) {
      connection = conn
    })

    const onmouseup = (e: MouseEvent) => {
      setIconConfig((prevState: IconConfig) => {
        if (prevState.draggedIconId !== 'trash' && isOnTrash(prevState.icons.trash, e)) {
          delete prevState.icons[iconConfig.draggedIconId];
          return { ...prevState, icons: prevState.icons, draggedIconId: '' }
        }
        return { ...prevState, draggedIconId: '', draggedDialogId: '' }
      });
    }
    
    const onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      // calculate the new cursor position:
      setIconConfig((prevState: IconConfig) => {
        const { mouse: {x, y}, icons, dialogs } = prevState
        if (prevState.draggedIconId !== '') {
          const icon = icons[prevState.draggedIconId]
          // set the element's new position:
          icon.top = (icon.top + e.clientY - y);
          icon.left = (icon.left + e.clientX - x);
          if (prevState.draggedIconId !== 'trash') {
            if (isOnTrash(prevState.icons.trash, e)) {
              icons.trash.style = { ...icons.trash.style, border: 'solid 1px red' };
            } else {
              icons.trash.style = { ...icons.trash.style, border: '' };
            }
          }
          return {...prevState, mouse: {x: e.clientX, y: e.clientY}, icons: prevState.icons}
        } else if (prevState.draggedDialogId !== '') {
          const dialog = dialogs[prevState.draggedDialogId]
          // set the element's new position:
          dialog.top = (dialog.top + e.clientY - y);
          dialog.left = (dialog.left + e.clientX - x);
          return {...prevState, mouse: {x: e.clientX, y: e.clientY}, dialogs: prevState.dialogs}
        }
        return prevState
      })
    }
    document.addEventListener('mouseup', onmouseup)
    document.addEventListener('mousemove', onmousemove)
    return () => {
      document.removeEventListener('mouseup', onmouseup)
      document.removeEventListener('mousemove', onmousemove)
    }
  }, [])

  const onDialogMouseDown = useCallback((dialogId: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      const x = e.clientX
      const y = e.clientY

      setSelectedDialogId(dialogId);
      // get the mouse cursor position at startup:
      setIconConfig((prevState: IconConfig) => {
        const dialog = prevState.dialogs[dialogId]
        dialog.style.zIndex = ++incrementalIndex
        return {...prevState, mouse: {x, y}, dialogs: prevState.dialogs, draggedDialogId: dialogId}
      });
    }
  }, [])


  const doubleClick = useCallback((icon) => {
    switch (icon.type) {
      case 'link':
        window.open(icon.link, '_blank')
        break;
      case 'window':
      default:
        setIconConfig((prevState: IconConfig) => {
          const id = Object.keys(prevState.dialogs).length
          const dialogs = {
            ...prevState.dialogs,
            [id]: {
              id,
              name: icon.name,
              left: incrementalIndex * 10,
              top: incrementalIndex * 10,
              style: {
                zIndex: ++incrementalIndex,
              },
              children: icon.body(),
            }
          }
          return { ...prevState, dialogs: dialogs }
        })
        break;
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
          onDoubleClick={() => {doubleClick(icon)}}
          />
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