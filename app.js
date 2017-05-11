const express = require('express');
const app = express();

// configuration settings
app.set('view engine', 'ejs');

app.use(express.static('/public'));
app.use(express.static('/node_modules'));

//temp solution
app.use('/js/', express.static('public/js/'));
app.use('/css/', express.static('public/css/'));
app.use('/images/', express.static('public/images/'));

//mount routes
app.get('/', function (req, res) {
	res.redirect('home')
});
app.get('/home', function (req, res) {
    res.render('../app/templates/pages/index.ejs', {
        title: 'Home page'
    });
});

module.exports = app;