var express = require('express');
var bmp = require('bmp-js');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid/v1');
var router = require('./user/userApi.js')


const app = express();
const PORT = process.env.PORT || 80


app.use(router);
app.use(express.static(__dirname+ "/client/"));
app.use(express.static(__dirname+ "/markup/"));
app.use(express.static(__dirname+ "/image/"));

app.listen(PORT, () =>{
    console.log('Server has been started')
})




