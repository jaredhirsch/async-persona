const ejs = require('ejs'),
  express = require('express'),
  fs = require('fs'),
  https = require('https'),
  verifier = require("browserid-verifier");

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

app.post('/verify', function(req, res) {
  console.info('verifying assertion with persona hosted verifier');
  verifier({
    assertion: req.body.assertion,
    audience: audience
  }, function(err, r) {
    if (err) { console.error('oh noes! ' + err); }
    console.info('response: ' + r)
    res.json(r);
  });
});


app.listen(port, hostname);
