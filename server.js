'use strict';
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(express.static('data'));


app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });


