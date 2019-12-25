import React from 'react';
import Icon from './Icon';
import './App.scss';
var jsforce = require('jsforce');
jsforce.browser.init({
    clientId: process.env.REACT_APP_SALESFORCE_CLIENT_ID,
    redirectUri: process.env.REACT_APP_SALESFORCE_REDIRECT_URI,
});
var App = function () {
    return (React.createElement("div", { className: "App" },
        React.createElement("div", { id: "folder", className: "app-icon folder", draggable: "true" },
            React.createElement("div", { style: { position: "relative" }, draggable: "true" },
                React.createElement("img", { src: "folder.png", draggable: "true" }),
                React.createElement("span", { className: "app-icon-name" }, "\u53D6\u5F15\u5148\u4E00\u89A7"))),
        React.createElement(Icon, { id: "folder", img: "folder.png", name: "\u53D6\u5F15\u5148\u4E00\u89A7" }),
        React.createElement(Icon, { id: "game", img: "game.png", name: "Trailhead" }),
        React.createElement(Icon, { id: "monitor", img: "monitor.png", name: "\u30ED\u30B0\u30A4\u30F3\u753B\u9762" }),
        React.createElement(Icon, { id: "cryptography", img: "monitor.png", name: "\u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u4E00\u89A7" }),
        React.createElement(Icon, { id: "pen", img: "pen.png", name: "Reference" }),
        React.createElement(Icon, { id: "trash", img: "trash.png", name: "\u30B4\u30DF\u7BB1" }),
        React.createElement("div", { className: "app-bottom-bar" },
            React.createElement("div", { className: "app-bar_start" },
                React.createElement("i", { className: "fas fa-cloud" })),
            React.createElement("div", { className: "app-bar-icon" },
                React.createElement("div", { style: { float: "left" } },
                    React.createElement("i", { className: "fas fa-wifi" }),
                    React.createElement("i", { className: "fas fa-volume-up" }),
                    React.createElement("i", { className: "fas fa-battery-three-quarters" })),
                React.createElement("div", { className: "app-bar_time" },
                    React.createElement("div", { className: "date" }),
                    React.createElement("div", { className: "time" }))))));
};
var Home = function () {
    return (React.createElement("div", null));
};
export default App;
//# sourceMappingURL=App.js.map