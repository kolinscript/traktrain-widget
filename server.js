const express            = require('express');
const axios              = require('axios');
const path               = require('path');
const bodyParser         = require('body-parser');
const cors               = require('cors');
const port               = process.env.PORT || 5000;
const app                = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './dist/traktrain-widget')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './dist/traktrain-widget', 'index.html'));
});

app.get('/api/widget', function(req, res) {
  const widget_id = req.query.id;
  const widget_link = `https://traktrain.com/api/wigdet/${widget_id}`;
  axios.get(widget_link)
    .then((widget) => {
      res.status(200).json({widget: widget});
    })
    .catch((error) => {
      res.status(200).json({body: {error: {text: error}}});
    });
});

app.listen(port, () => console.log('Api live on port', + port));
