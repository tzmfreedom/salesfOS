const jsforce = require('jsforce')
jsforce.browser.init({
  clientId: '3MVG9yZ.WNe6byQBYCaGTfGZBI242shnVTHgzqwWYLIsBR8CLxuYI1e7e3p3S48nyTgT3lvoCylIjvxjx7Pt.',
  redirectUri: 'https://tzmfreedom.github.io/salesfOS/',
  proxyUrl: 'https://tzmfreedom-jsforce-proxy.herokuapp.com/proxy/'
});

let connection: any;
const originalMousemove = document.onmousemove;
const originalMouseup = document.onmouseup;

jsforce.browser.on('connect', function(conn: any) {
  // frame.showToast({
  //   width: 260,
  //   height: 100,
  //   duration: 1000,
  //   align: 'center',
  //   style: {
  //     borderRadius: '2px',
  //     backgroundColor: 'rgba(0,124,255,0.8)',
  //   },
  //   html: '<span style="color:white;">ログインしました</span>',
  //   closeButton: true,
  //   closeButtonColor: 'white',
  // });
  connection = conn;
});

// function showDescribeWindow() {
//   connection.describeGlobal(function(err, res) {
//     if (err) { console.error(err); }
//     const body = res.sobjects.filter(function(sobject) {
//       return sobject.custom;
//     }).map(function(sobject) {
//       return `<tr><td>${sobject.label}</td><td>${sobject.name}</td></tr>`;
//     }).join('');
//     const html = '<table class="table" style="overflow: scroll;height: 500px;">' +
//       '<thead><tr><th>Name</th><th>Developer Name</th></tr></thead>' +
//       `<tbody>${body}</tbody>` +
//       '</table>';
//     const frame = jsFrame.create({
//       title: 'カスタムオブジェクト一覧',
//       appearanceName: 'yosemite',
//       left: 20, top: 20, width: 620, height: 500,
//       movable: true,
//       resizable: true,
//       html: html,
//       style: {
//         overflow: 'auto',
//       },
//     });
//     frame.show();
//   });
// }

// function showUserWindow() {
//   connection.query('SELECT Id, Name FROM Account', (err, res) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     const body = res.records.map(function(sobject) {
//       console.log(sobject);
//       return `<tr><td>${sobject.Id}</td><td>${sobject.Name}</td></tr>`;
//     }).join('');
//     const html = '<table class="table" style="overflow: scroll;height: 500px;">' +
//       '<thead><tr><th>Id</th><th>Name</th></tr></thead>' +
//       `<tbody>${body}</tbody>` +
//       '</table>';
//     const frame = jsFrame.create({
//       title: '取引先一覧',
//       appearanceName: 'yosemite',
//       left: 20, top: 20, width: 620, height: 500,
//       movable: true,
//       resizable: true,
//       html: html,
//       style: {
//         overflow: 'auto',
//       },
//     });
//     frame.show();
//   });
// }


// setInterval(function() {
//   $('.date').text(moment().format('YYYY-MM-DD'));
//   $('.time').text(moment().format('HH:mm'));
// }, 1000);
