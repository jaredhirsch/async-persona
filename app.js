const ejs = require('ejs'),
  express = require('express'),
  fs = require('fs'),
  https = require('https'),
  qs = require('qs');

var app = express(),
  tpl = fs.readFileSync(__dirname + '/tpl.ejs', 'utf8'),
  scheme = process.env['SCHEME'] || 'http',
  hostname = process.env['HOSTNAME'] || 'personaexample.com',
  port = process.env['PORT'] || 8888,
  // audience example: "http://personaexample.com:8888"
  audience = scheme + '://' + hostname + ':' + port;

app.get('/sync', function(req, res) {
  var rendered = ejs.render(tpl, {
    scriptName: 'sync.js',
    includeSnippet: true
  });
  res.send(rendered);
});

app.use('/static', express.static('static'));

app.get('/async', function(req, res) {
  var rendered = ejs.render(tpl, {scriptName: 'async.js'});
  res.send(rendered);
});

// verifier code lifted from https://github.com/mozilla/browserid-cookbook
app.get('/verify', function(req, res) {
  function onVerifierResponse(vres) {
    var data = '';
    vres.setEncoding('utf8');
    vres.on('data', function(chunk) { data += chunk });
    vres.on('end', function() {
      var verified = JSON.parse(data);
      res.contentType('application/json');
      if (verified.status == 'okay') {
        console.info('browserid auth successful');
        req.session.email = verified.email;
        res.redirect('/'); // TODO do I need this redirect?
      } else {
        console.error(verified.reason);
        res.writeHead(403);
      }
      res.write(data);
      res.end();
    });
  }

  console.info('verifying assertion with persona hosted verifier');
  var assertion = req.body.assertion,
    body = qs.stringify({
      assertion: assertion,
      audience: audience
    }),
    request = https.request({
      host: 'verifier.login.persona.org',
      path: '/verify',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': body.length
      }
    }, onVerifierResponse);
  request.write(body);
  request.end();
});

app.listen(port, hostname);
