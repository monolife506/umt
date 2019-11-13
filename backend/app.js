let express = require('express');
let path = require('path');
let app = express();

app.use('/api', require('./routes/index'));

app.use(express.static(path.resolve(__dirname, 'static')));
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'static/index.html')) ;
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});