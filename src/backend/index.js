//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var dataAccess = require('./database-access');
var connection = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
/**
 * obtener Dispositivos de prueba
 */
app.get('/devices/test/', function(req, res, next) {
    devices = [
        { 
            'id': 1, 
            'name': 'Lampara 1', 
            'description': 'Luz living', 
            'state': 0, 
            'type': 1, 
        },
        { 
            'id': 2, 
            'name': 'Ventilador 1', 
            'description': 'Ventilador Habitacion', 
            'state': 1, 
            'type': 2, 
        },
    ]
    res.send(JSON.stringify(devices)).status(200);
});

/**
 * Obtener Dispositivos desde base de datos
 */
app.get('/devices/', function(req, res, next) {
   
    var sql = "select * from Devices";
    connection.query(sql, function (err, result) {
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            res.send((JSON.stringify("NO_DATA") )).status(200);
        } else {
            res.send((JSON.stringify(result))).status(200);
        }
    });    
});

/**
 * Obtener Dispositivos desde base de datos
 */
app.get('/devices/external', function(req, res, next) {
    console.log("getdevices")
    var devices = dataAccess.getDevices();
    console.log(devices)
    res.send((JSON.stringify(devices))).status(200);
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
