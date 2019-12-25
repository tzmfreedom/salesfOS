import React from 'react';
var Icon = function (props) {
    return (React.createElement("div", { id: props.id, className: "app-icon game" },
        React.createElement("div", { className: "relative" },
            React.createElement("img", { src: props.img }),
            React.createElement("span", { className: "app-icon-name" }, props.name))));
};
export default Icon;
//# sourceMappingURL=Icon.js.map