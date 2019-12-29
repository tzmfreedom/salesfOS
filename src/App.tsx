import React, { useCallback, useEffect, useReducer, CSSProperties } from 'react';
import Icon from './Icon';
import Dialog from './Dialog';
import AccountList from './AccountList';
import AccountTree from './AccountTree';
import SObjectList from './SObjectList';
import Folder from './Folder';
import Console from './Console';
import './App.scss';
import folderImg from './img/folder.png';
import gameImg from './img/game.png';
import monitorImg from './img/monitor.png';
import cryptographyImg from './img/cryptography.png';
import penImg from './img/pen.png';
import trashImg from './img/trash.png';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWifi, faVolumeUp, faBatteryThreeQuarters, faCloud } from '@fortawesome/free-solid-svg-icons'
import terminalIcon from './img/terminal.svg'

const jsforce = require('jsforce');

interface IconProperty {
  img: any
  name: string
  left: number
  top: number
  style: CSSProperties
  selected: boolean
  type: 'link' | 'window'
  link?: string
  body?: (connection: any) => JSX.Element
}

interface DialogProperty {
  id: string
  name: string
  left: number
  top: number
  width: number
  height: number
  style: React.CSSProperties
  children: JSX.Element
  hidden: boolean
}

interface State {
  icons: {[key: string]: IconProperty}
  dialogs: {[key: string]: DialogProperty},
  mouse: {x: number, y: number}
  incrementalIndex: number
  connection: any
  date: string
  time: string
}

const defaultIcons: {[s: string]: IconProperty} = {
  console: {
    img: terminalIcon,
    name: 'コンソール',
    left: 100,
    top: 20,
    style: {
    },
    selected: true,
    type: 'window',
    body: (_) => <Console />
  },
  accountTree: {
    img: folderImg,
    name: 'AccountTree',
    left: 20,
    top: 580,
    style: {
    },
    selected: true,
    type: 'window',
    body: (connection) => <AccountTree connection={connection}/>
  },
  folder: {
    img: folderImg,
    name: '取引先一覧',
    left: 20,
    top: 500,
    style: {
    },
    selected: true,
    type: 'window',
    body: (_) => <Folder name="hoge" show={true} files={[
      {type: "File", name: "foo1"},
      {type: "File", name: "foo2"},
      {type: "File", name: "foo3"},
      {type: "File", name: "foo4"},
      {
        type: "Directory",
        name: "dir1",
        show: false,
        files: [
          { type: "File", name: "foo5" },
          { type: "File", name: "foo6" },
          {
            type: "Directory",
            name: "dir1",
            show: false,
            files: [
              { type: "File", name: "foo8" },
              { type: "File", name: "foo9" },
            ],
          },
          { type: "File", name: "foo7" },
        ]
      },
    ]}/>
  },
  account: {
    img: folderImg,
    name: '取引先一覧',
    left: 20,
    top: 20,
    style: {
    },
    selected: true,
    type: 'window',
    body: (connection) => <AccountList connection={connection} />
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
    body: (connection) => <SObjectList connection={connection} />
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
    body: (connection) => <AccountList connection={connection}/>
  },
};

const deleteDialog = (dialogId: string) => {
  return {
    type: 'delete_dialog' as const,
    dialogId,
  }
}

const connect = (connection: any) => {
  return {
    type: 'connect' as const,
    connection,
  }
}

const minimize = (dialogId: string) => {
  return {
    type: 'minimize' as const,
    dialogId,
  }
}

const activateWindow = (dialogId: string) => {
  return {
    type: 'activate_window' as const,
    dialogId,
  }
}

const addWindow = (icon: IconProperty) => {
  return {
    type: 'add_window' as const,
    icon,
  }
}

const setTime = (date: string, time: string) => {
  return {
    type: 'set_time' as const,
    date,
    time,
  }
}

type Action = (
  | ReturnType<typeof deleteDialog>
  | ReturnType<typeof connect>
  | ReturnType<typeof minimize>
  | ReturnType<typeof activateWindow>
  | ReturnType<typeof addWindow>
  | ReturnType<typeof setTime>
);

const reducer = (state: State, action: Action): State => {
  switch(action.type) {
    case 'delete_dialog': {
      const dialogs = state.dialogs;
      delete dialogs[action.dialogId]
      return {
        ...state,
        dialogs,
      }
    }
    case 'connect':
      return {
        ...state,
        connection: action.connection,
      }
    case 'minimize': {
      const dialogs = state.dialogs;
      dialogs[action.dialogId].hidden = true;
      return {
        ...state,
        dialogs
      }
    }
    case 'activate_window': {
      const dialogs = state.dialogs
      dialogs[action.dialogId].hidden = false;
      return {
        ...state,
        dialogs,
      }
    }
    case 'add_window':
      state.incrementalIndex++
      const index = state.incrementalIndex
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [index]: {
            id: index,
            name: action.icon.name,
            left: index * 10,
            top: index * 10,
            width: 800,
            height: 300,
            style: {
              backgroundColor: 'white',
            },
            children: action.icon.body!(state.connection),
          }
        }
      }
    case 'set_time':
      return {
        ...state,
        date: action.date,
        time: action.time,
      }
    default:
      console.error(action)
      throw new Error();
  }
}

const App: React.FC = () => {
  const [state, dispatch]= useReducer(reducer, {
    icons: defaultIcons,
    dialogs: {},
    connection: null,
    mouse: {x: 0, y: 0},
    incrementalIndex: 10,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm'),
  });

  const isOnTrash = useCallback((trash: IconProperty, e: MouseEvent) => {
    return e.clientX >= trash.left &&
      e.clientX <= trash.left + 66 &&
      e.clientY >= trash.top &&
      e.clientY <= trash.top + 66;
  }, [])

  useEffect(() => {
    const intervalId = setInterval(function () {
      const date = moment().format('YYYY-MM-DD');
      const time = moment().format('HH:mm');
      dispatch({type: "set_time", date, time})
    }, 1000);

    jsforce.browser.init({
      clientId: process.env.client_id,
      redirectUri: process.env.redirect_uri,
      proxyUrl: process.env.proxy_url,
    });

    jsforce.browser.on('connect', function(connection: any) {
      dispatch({type: 'connect', connection})
    });
    return () => clearInterval(intervalId)
  }, [])

  const onClose = useCallback((dialogId: string) => {
    dispatch({type: 'delete_dialog', dialogId})
  }, [])
  
  const onMinimize = useCallback((dialogId: string) => {
    dispatch({type: 'minimize', dialogId})
  }, [])

  const appStart = useCallback(() => jsforce.browser.login(), []);

  const doubleClick = useCallback((icon) => {
    switch (icon.type) {
      case 'link':
        window.open(icon.link, '_blank')
        break;
      case 'window':
      default:
        dispatch({type: 'add_window', icon});
        break;
    }
  }, [])
  const activateWindow = useCallback((dialogId: string) => {
    return (e: React.MouseEvent) => {
      dispatch({type: 'activate_window', dialogId});
    }
  }, []);
  const { icons, dialogs } = state
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
          hidden={dialog.hidden}
          onClose={onClose}
          onMinimize={onMinimize}
          >{dialog.children}</Dialog>
      })}
      <div className="app-bottom-bar">
        <div className="app-bar_start">
          <FontAwesomeIcon icon={faCloud} onClick={appStart}/>
        </div>
        <div className="task-bar" style={{
          marginLeft: '20px',
          float: 'left',
        }}>
          {Object.keys(dialogs).map((dialogId) => {
            const dialog = dialogs[dialogId]
            return <div
              style={{
                float: 'left',
                color: 'white',
                lineHeight: '40px',
                padding: '0 10px',
                borderLeft: '1px solid white',
                borderRight: '1px solid white',
                cursor: 'default',
              }}
              key={dialogId}
              onClick={activateWindow(dialogId)}
            >{dialog.name}</div>
          })}
        </div>
        <div className="app-bar-icons">
          <div style={{float: "left"}}>
            <div className="app-bar-icon">
              <FontAwesomeIcon icon={faWifi} />
            </div>
            <div className="app-bar-icon">
              <FontAwesomeIcon icon={faVolumeUp} />
            </div>
            <div className="app-bar-icon">
              <FontAwesomeIcon icon={faBatteryThreeQuarters} />
            </div>
          </div>
          <div className="app-bar_time">
            <div className="date">{state.date}</div>
            <div className="time">{state.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;