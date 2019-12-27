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

let incrementalIndex = 10;
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
      proxyUrl: process.env.proxy_url,
    });

    jsforce.browser.on('connect', function(conn: any) {
      connection = conn
    })
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
          incrementalIndex++
          const dialogs = {
            ...prevState.dialogs,
            [id]: {
              id,
              name: icon.name,
              left: incrementalIndex * 10,
              top: incrementalIndex * 10,
              width: '800px',
              height: '300px',
              style: {
                backgroundColor: 'white',
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
        return <Icon 
          key={iconId} 
          id={iconId}
          img={icon.img}
          name={icon.name}
          top={icon.top}
          left={icon.left}
          style={icon.style}
          onDoubleClick={() => {doubleClick(icon)}}
          />
      })}
      {Object.keys(dialogs).map((dialogId) => {
        const dialog = dialogs[dialogId]
        return <Dialog 
          key={dialogId}
          id={dialogId}
          name={dialog.name}
          left={dialog.left}
          top={dialog.top}
          height={dialog.height}
          width={dialog.width}
          style={dialog.style}
          onClose={() => {}}
          onMaximize={() => {}}
          onMinimize={() => {}}
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