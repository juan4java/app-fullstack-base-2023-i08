//=======[ Settings, Imports & Data ]==========================================
var PORT    = 3000;

var express = require('express');
var app     = express();
var connection = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

/**
 * Obtener Dispositivos desde base de datos
 */
app.get('/devices/', function(req, res, next) {
    var sql = `SELECT * FROM Devices`;
    var responseAsJson

    connection.query(sql, function (err, result) {
      
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            responseAsJson = JSON.parse(`{"message":"FALLO"}`)
            res.status(404)
        } else {
            responseAsJson = result;
            res.status(200)
        }
        res.send((JSON.stringify(responseAsJson)));
    });    
});

/**
 * Update dispositivo
 * retorna el dispositivo con los cambios
 * si falla, retorna un error
 */
app.post('/device/:id', function(req, res) {
    
  
    var state = req.body.state ? 1:0
    var type = req.body.type ? 1:0

    var sql = `UPDATE Devices SET name='${req.body.name}',description='${req.body.description}',state='${state}',type='${type}' WHERE id='${req.params.id}'`;
    connection.query(sql, function (err, result) {
        var responseAsJson
       
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            responseAsJson = JSON.parse(`{"message":"FALLO"}`)
        } else {
            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No se actualizo ningun dispositivo"}`)
                res.status(404)
            } else {
                var response = `{"id":${req.params.id},"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
                responseAsJson = JSON.parse(response)
                res.status(200)
            }
        }
        res.send((JSON.stringify(responseAsJson)));
    });
});

/**
 * Update dispositivo
 * retorna el dispositivo con los cambios
 * si falla, retorna un error
 */
app.post('/device/:id/state', function(req, res) {
    
  
    var state = req.body.state ? 1:0

    var sql = `UPDATE Devices SET state='${state}' WHERE id='${req.params.id}'`;
    connection.query(sql, function (err, result) {
        var responseAsJson
       
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            responseAsJson = JSON.parse(`{"message":"FALLO"}`)
        } else {
            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No se actualizo ningun dispositivo"}`)
                res.status(404)
            } else {
                var response = `{"message":"Dispositivo cambio de estado", "id":${req.params.id},"state":${req.body.state}}`
                responseAsJson = JSON.parse(response)
                res.status(200)
            }
        }
        res.send((JSON.stringify(responseAsJson)));
    });
});

/**
 * Crea un dispositivo y lo retorna con su id asignado
 * Si no lo crea retorna un mensaje de error
 */
app.put('/device/', function(req, res) {
    
    var state = req.body.state ? 1:0
    var type = req.body.type ? 1:0

    var sql = `INSERT INTO Devices (name,description,state,type) VALUES ('${req.body.name}','${req.body.description}','${state}','${type}')`;
    connection.query(sql, function (err, result) {
       
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            var responseAsJson = JSON.parse(`{"message":"FALLO"}`)
            res.send((JSON.stringify(responseAsJson))).status(200);
        } else {
            
            var responseAsJson
            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No creo el dispositivo"}`)
                res.status(404)
            } else {
                var response = `{"id":${result.insertId},"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
                responseAsJson = JSON.parse(response)
                res.status(200)
            }
            res.send((JSON.stringify(responseAsJson)));
        }
    });
});


/**
 * Delete dispositivo
 */
app.delete('/device/:id', function(req, res) {
    
    var sql = `DELETE FROM Devices  WHERE id='${req.params.id}'`;
    connection.query(sql, function (err, result) {
        var responseAsJson
        
        if (err) {
            console.error('Error while connect to DB: ' + err.stack);
            responseAsJson = JSON.parse(`{"message":"FALLO"}`)
            res.status(503)
        } else {

            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No existe el dispositivo"}`)
                res.status(404)
            } else {
                responseAsJson = JSON.parse(`{"message":"Dispositivo eliminado, id:${req.params.id}", "id":${req.params.id}}`)
                res.status(200)
            }
        }
        res.send((JSON.stringify(responseAsJson)));
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

/**
 * TEST obtener Dispositivos de prueba
 */
app.get('/test/devices/', function(req, res, next) {
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
 * TEST Update dispositivo
 * retorna el dispositivo con los cambios
 * si falla, retorna un error
 */
app.post('/test/device/:id', function(req, res) {
  
    var response = `{"id":${req.params.id},"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
    responseAsJson = JSON.parse(response)
    res.send((JSON.stringify(responseAsJson))).status(200);
});

/**
 * TEST Crea un dispositivo y lo retorna con su id asignado
 * Si no lo crea retorna un mensaje de error
 */
app.put('/test/device/', function(req, res) {
  
    var response = `{"id":9999,"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
    responseAsJson = JSON.parse(response)
    res.send((JSON.stringify(responseAsJson))).status(200);
});


/**
 * TEST Delete dispositivo
 */
app.delete('/test/device/:id', function(req, res) {
    
        var responseAsJson
        responseAsJson = JSON.parse(`{"message":"Elementos borrados 1 "}`)
        res.send((JSON.stringify(responseAsJson))).status(200);
});


app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================