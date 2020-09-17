// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const { buildArticle, deleteArticle } = require('./webhookFunctions')

var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  
  var port = process.env.PORT || 3000;
  
  app.listen(port, function () {
    console.log('webhook listening on port ' + port + '!');
  });

app.use(bodyParser.json())

app.post("/hook", (req, res) => {
  if(req.body.data.items) {
      for (let item of req.body.data.items) {
        if(req.body.message.operation === 'publish' && item.type === 'article') {
            buildArticle(item.codename)
        }
        else if (req.body.message.operation === 'unpublish' && item.type === 'article')
        {
            deleteArticle(item.codename)
        }
      }
  }
  res.status(200).end()
})