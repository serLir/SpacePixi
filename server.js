"use strict";

const path = require('path');

var app = require(path.resolve(__dirname, 'app')),
	port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log('Listening on port ', port)
});