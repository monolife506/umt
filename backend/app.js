let express = require('express');
let path = require('path');
let app = express();

app.use('/api', require('./routes/index'));

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});