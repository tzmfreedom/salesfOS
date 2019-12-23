import React from 'react';
import Icon from './Icon';
import './App.scss';
import folderImg from './img/folder.png';
import gameImg from './img/game.png';
import monitorImg from './img/monitor.png';
import cryptographyImg from './img/cryptography.png';
import penImg from './img/pen.png';
import trashImg from './img/trash.png';

const jsforce = require('jsforce');

jsforce.browser.init({
  clientId: process.env.REACT_APP_SALESFORCE_CLIENT_ID,
  redirectUri: process.env.REACT_APP_SALESFORCE_REDIRECT_URI,
});

const App: React.FC = () => {
  return (
    <div className="App">
      <Icon id="folder" img={folderImg} name="取引先一覧" />
      <Icon id="game" img={gameImg} name="Trailhead" />
      <Icon id="monitor" img={monitorImg} name="ログイン画面" />
      <Icon id="cryptography" img={cryptographyImg} name="オブジェクト一覧" />
      <Icon id="pen" img={penImg} name="Reference" />
      <Icon id="trash" img={trashImg} name="ゴミ箱" />
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