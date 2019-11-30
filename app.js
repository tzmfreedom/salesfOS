jsforce.browser.init({
  clientId: '3MVG9yZ.WNe6byQBYCaGTfGZBI242shnVTHgzqwWYLIsBR8CLxuYI1e7e3p3S48nyTgT3lvoCylIjvxjx7Pt.',
  redirectUri: 'https://tzmfreedom.github.io/salesfOS/',
  proxyUrl: 'https://tzmfreedom-jsforce-proxy.herokuapp.com/proxy/'
});

let connection;
const jsFrame = new JSFrame();
const originalMousemove = document.onmousemove;
const originalMouseup = document.onmouseup;

jsforce.browser.on('connect', function(conn) {
  jsFrame.showToast({
    width: 260,
    height: 100,
    duration: 1000,
    align: 'center',
    style: {
      borderRadius: '2px',
      backgroundColor: 'rgba(0,124,255,0.8)',
    },
    html: '<span style="color:white;">ログインしました</span>',
    closeButton: true,
    closeButtonColor: 'white',
  });
  connection = conn;
});

$('.app-bar_start').click(function() {
  jsforce.browser.login();
});

function showDescribeWindow() {
  connection.describeGlobal(function(err, res) {
    if (err) { console.error(err); }
    const body = res.sobjects.filter(function(sobject) {
      return sobject.custom;
    }).map(function(sobject) {
      return `<tr><td>${sobject.label}</td><td>${sobject.name}</td></tr>`;
    }).join('');
    const html = '<table class="table" style="overflow: scroll;height: 500px;">' +
      '<thead><tr><th>Name</th><th>Developer Name</th></tr></thead>' +
      `<tbody>${body}</tbody>` +
      '</table>';
    const frame = jsFrame.create({
      title: 'カスタムオブジェクト一覧',
      appearanceName: 'yosemite',
      left: 20, top: 20, width: 620, height: 500,
      movable: true,
      resizable: true,
      html: html,
      style: {
        overflow: 'auto',
      },
    });
    frame.show();
  });
}

function showUserWindow() {
  connection.query('SELECT Id, Name FROM Account', (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    const body = res.records.map(function(sobject) {
      console.log(sobject);
      return `<tr><td>${sobject.Id}</td><td>${sobject.Name}</td></tr>`;
    }).join('');
    const html = '<table class="table" style="overflow: scroll;height: 500px;">' +
      '<thead><tr><th>Id</th><th>Name</th></tr></thead>' +
      `<tbody>${body}</tbody>` +
      '</table>';
    const frame = jsFrame.create({
      title: '取引先一覧',
      appearanceName: 'yosemite',
      left: 20, top: 20, width: 620, height: 500,
      movable: true,
      resizable: true,
      html: html,
      style: {
        overflow: 'auto',
      },
    });
    frame.show();
  });
}

let dragElem;
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

function dragMouseDown(elem) {
  return function(e) {
    e.preventDefault();
    if (e.target.parentNode.parentNode !== elem) {
      return;
    }
    dragElem = e.target.parentNode.parentNode;
    select(dragElem.id);
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement(elem);
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag(elem);
  };
}

function elementDrag(elem) {
  return function(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elem.style.top = (elem.offsetTop - pos2) + "px";
    elem.style.left = (elem.offsetLeft - pos1) + "px";
    if (elem.id !== 'trash') {
      const trash = document.getElementById('trash');
      if (isOnTrash(e)) {
        trash.style.border = 'solid 1px red';
      } else {
        trash.style.border = '';
      }
    }
  };
}

function isOnTrash(e) {
  const trash = document.getElementById('trash');
  return e.clientX >= trash.offsetLeft &&
    e.clientX <= trash.offsetLeft + trash.offsetWidth &&
    e.clientY >= trash.offsetTop &&
    e.clientY <= trash.offsetTop + trash.offsetHeight;
}

function closeDragElement(elem) {
  return function(e) {
    if (elem.id !== 'trash' && isOnTrash(e)) {
      elem.remove();
    }
    // stop moving when mouse button is released:
    document.onmouseup = originalMouseup;
    document.onmousemove = originalMousemove;
  };
}

$('.app-icon').each(function() {
  this.onmousedown = dragMouseDown(this);
});

$('.app-icon').dblclick(function() {
  const id = $(this).attr('id');
  select(id);
  switch (id) {
    case 'folder':
      showUserWindow();
      break;
    case 'monitor':
      openWindow('https://login.salesforce.com/');
      break;
    case 'game':
      openWindow('https://trailhead.salesforce.com/');
      break;
    case 'pen':
      openWindow('https://developer.salesforce.com/');
      break;
    case 'cryptography':
      showDescribeWindow();
      break;
  }
});

function openWindow(url) {
  window.open(url, '_blank');
}

function select(id) {
  $('.app-icon').each(function() {
    if (id !== $(this).attr('id')) {
      $(this).removeClass('app-icon-clicked');
    } else {
      $(this).addClass('app-icon-clicked');
    }
  });
}

setInterval(function() {
  $('.date').text(moment().format('YYYY-MM-DD'));
  $('.time').text(moment().format('HH:mm'));
}, 1000);
