import React from 'react';
import Icon from './Icon';
// import './App.scss';
const jsforce = require('jsforce');

jsforce.browser.init({
  clientId: process.env.REACT_APP_SALESFORCE_CLIENT_ID,
  redirectUri: process.env.REACT_APP_SALESFORCE_REDIRECT_URI,
});

const App: React.FC = () => {
  return (
    <div className="App">

      <div id="folder" className="app-icon folder" draggable="true">
        <div style={{position: "relative"}} draggable="true">
          <img src="folder.png" draggable="true"/>
          <span className="app-icon-name">取引先一覧</span>
        </div>
      </div>
      <Icon id="folder" img="folder.png" name="取引先一覧" />
      <Icon id="game" img="game.png" name="game" />
      <Icon id="monitor" img="monitor.png" name="monitor" />
      <Icon id="cryptography" img="monitor.png" name="オブジェクト一覧" />
      <div id="pen" className="app-icon pen">
        <div className="relative"><img src="pen.png" /><span className="app-icon-name">Reference</span></div>
      </div>
      <div id="trash" className="app-icon trash">
        <div className="relative"><img src="trash.png" /><span className="app-icon-name">ゴミ箱</span></div>
      </div>
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

const Home: React.FC = () => {
  return (
    <div></div>
  )
}

export default App;