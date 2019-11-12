let express = require('express');
let path = require('path');
let app = express();

app.get('/', function(req, res) {
    res.send('hello world');
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});