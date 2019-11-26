jsforce.browser.init({
  clientId: '3MVG9yZ.WNe6byQBYCaGTfGZBI242shnVTHgzqwWYLIsBR8CLxuYI1e7e3p3S48nyTgT3lvoCylIjvxjx7Pt.',
  redirectUri: 'http://localhost:8000'
});
var connection;
if (jsforce.browser.connection && jsforce.browser.connection.instanceUrl !== '') {
  connection = jsforce.browser.connection;
} else {
  jsforce.browser.login();
  jsforce.browser.on('connect', function(conn) {
    connection = conn;
  });
}
$('.app-bar_start').click(function() {
  const jsFrame = new JSFrame();
  connection.describeGlobal(function(err, res) {
    if (err) { console.error(err); }
    var body = res.sobjects.filter(function(sobject) {
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
      appearanceName: 'redstone',
      left: 20, top: 20, width: 620, height: 500,
      movable: true,
      resizable: true,
      html: html,
    });
    frame.show();
  });
});

$('.app-icon').click(function() {
  var id = $(this).attr('id');
  $('.app-icon').each(function() {
    if (id !== $(this).attr('id')) {
      $(this).removeClass('app-icon-clicked');
    } else {
      $(this).addClass('app-icon-clicked');
    }
  });
});

setInterval(function() {
  $('.date').text(moment().format('YYYY-MM-DD'));
  $('.time').text(moment().format('HH:mm'));
}, 1000);
