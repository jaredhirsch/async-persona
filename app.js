const ejs = require('ejs'),
  express = require('express'),
  fs = require('fs'),
  https = require('https');

var app = express(),
  tpl = fs.readFileSync(__dirname + '/tpl.ejs', 'utf8'),
  scheme = process.env['SCHEME'] || 'http',
  hostname = process.env['HOSTNAME'] || 'personaexample.com',
  port = process.env['PORT'] || 8888,
  // audience example: "http://personaexample.com:8888"
  audience = scheme + '://' + hostname + ':' + port;

app.use('/static', express.static('static'));
app.use(express.bodyParser());

app.get('/sync', function(req, res) {
  var rendered = ejs.render(tpl, {
    scriptName: 'sync.js',
    includeSnippet: true
  });
  res.send(rendered);
});


app.get('/async', function(req, res) {
  var rendered = ejs.render(tpl, {scriptName: 'async.js'});
  res.send(rendered);
});

// verifier code lifted from https://github.com/mozilla/browserid-cookbook
app.post('/verify', function(req, res) {

  console.info('verifying assertion with persona hosted verifier');
  var assertion = req.body.assertion,
    body = JSON.stringify({
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
    }, function onVerifierResponse(vres) {
      // vres.setEncoding('utf8');
      var data = '';
      vres.on('data', function(chunk) { data += chunk });
      vres.on('end', function() {
        //res.contentType('application/json');
        var email = JSON.parse(data).email;
        if (email) {
          console.info('browserid auth successful');
          res.json(email); 
        } else {
          console.error(verified.reason);
          res.writeHead(403);
        }
//        res.write(data);
        res.end();
      });
    });
  request.write(body);
  console.info('body is ' + body);
  request.end();
});


app.listen(port, hostname);
