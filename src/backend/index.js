//=======[ Settings, Imports & Data ]==========================================
var PORT    = 3000;

var express = require('express');
var app     = express();
var connection = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

var FIELD_ID = 'id'
var FIELD_STATE = 'state'
var FIELD_TYPE = 'type'
var FIELD_NAME = 'name'
var FIELD_DESC = 'description'
//=======[ Main module code ]==================================================

/**
 * Obtener Dispositivos desde base de datos
 */
app.get('/devices/', function(req, res, next) {
    var sql = `SELECT * FROM Devices`;
    var responseAsJson

    connection.query(sql, function (err, result) {
      
        if (err) {
            responseAsJson = handleError(err, res);
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
    
    if(req.params.id == null || req.body == null || 
        req.body.state == null || req.body.type == null || req.body.name == null || req.body.description == null){
        sendErrorResponse(res);
        return
    }
    
    if(!isValidField(req.body.state, FIELD_STATE) ||
         !isValidField(req.body.type, FIELD_TYPE) || 
         !isValidField(req.params.id, FIELD_ID)){
        sendErrorResponse(res);
        return
    }

    var id = getDeviceIdAsNumber(req.params.id)
    var state = req.body.state ? 1:0
    var type = req.body.type ? 1:0

    var sql = `UPDATE Devices SET name='${req.body.name}',description='${req.body.description}',state='${state}',type='${type}'
            WHERE id='${id}'`;
    connection.query(sql, function (err, result) {
        var responseAsJson
       
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No se actualizo ningun dispositivo"}`)
                res.status(404)
            } else {
                var response = `{"id":${id},"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
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
    
    if(req.params.id == null || req.body == null || 
        req.body.state == null ){
        sendErrorResponse(res);
        return
    }

    if(!isValidField(req.body.state, FIELD_STATE) || !isValidField(req.params.id, FIELD_ID)){
        sendErrorResponse(res);
        return
    }
    var id = getDeviceIdAsNumber(req.params.id)
    var state = req.body.state ? 1:0

    var sql = `UPDATE Devices SET state='${state}' WHERE id='${id}'`;
    connection.query(sql, function (err, result) {
        var responseAsJson
       
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No se actualizo ningun dispositivo"}`)
                res.status(404)
            } else {
                var response = `{"message":"Dispositivo cambio de estado", "id":${id},"state":${req.body.state}}`
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
    
    if( req.body == null || 
        req.body.state == null || req.body.type == null || req.body.name == null || req.body.description == null){
        sendErrorResponse(res);
        return
    }

    if(!isValidField(req.body.state, FIELD_STATE) || !isValidField(req.body.type, FIELD_TYPE)){
        sendErrorResponse(res);
        return
    }

    var state = req.body.state ? 1:0
    var type = req.body.type ? 1:0

    var sql = `INSERT INTO Devices (name,description,state,type) 
                VALUES ('${req.body.name}','${req.body.description}','${state}','${type}')`;

    connection.query(sql, function (err, result) {
       
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            
            var responseAsJson
            if(result.affectedRows == 0){
                responseAsJson = JSON.parse(`{"message":"No creo el dispositivo"}`)
                res.status(404)
            } else {
                var response = `{"id":${result.insertId},
                                "name":"${req.body.name}",
                                "description":"${req.body.description}",
                                "state":${req.body.state},
                                "type":${req.body.type}}`
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
    
    if(!isValidField(req.params.id, FIELD_ID)){
        sendErrorResponse(res);
        return
    }
    
    var id = getDeviceIdAsNumber(req.params.id)

    var sql = `DELETE FROM Devices WHERE id='${id}'`;
    connection.query(sql, function (err, result) {
        var responseAsJson
        
        if (err) {
            responseAsJson = handleError(err, res);
        } else {

            if(result.affectedRows == 0){
                //Si el dispoistivo no existe, es un 200, ya que el front end deberia quitarlo
                responseAsJson = JSON.parse(`{"message":"No existe el dispositivo", "id":${id}}`)
                res.status(200)
            } else {
                //Se elimino correctamente
                responseAsJson = JSON.parse(`{"message":"Dispositivo eliminado, id:${id}", "id":${id}}`)
                res.status(200)
            }
        }
        res.send((JSON.stringify(responseAsJson)));
    });
});
    
/**
 * Establece mensaje y status de response
 * @param {*} err 
 * @param {*} res 
 * @returns 
 */
function handleError(err, res) {
    console.error('Error while connect to DB: ' + err.stack);
    responseAsJson = JSON.parse(`{"message":"Fallo al obtener los datoss"}`);
    res.status(503);
    return responseAsJson;
}

/**
 * Envia respuesta y mensaje ante un error
 * @param {*} res 
 */
function sendErrorResponse(res) {
    responseAsJson = JSON.parse(`{"message":"Parametros no validos , o incompletos"}`);
    res.status(400);
    res.send((JSON.stringify(responseAsJson)));
}

/**
 * Valida que un id sea numerico, posea un largo determinado maximo
 */
function isValidDeviceId(id){
    if(id.length > 11){
        return false
    }
    var pattern = /^\d+$/;
    let result =  pattern.test(id);
    if(result){
        return true;
    } else {
        console.log("Device invalid for id" , id)
        return false
    }
}

/**
 * Valido que el campo sea del tipo esperado
 * @param {*} value 
 * @param {*} field 
 * @returns 
 */
function isValidField(value, field){

    switch(field){
        case FIELD_ID:
            return isValidDeviceId(value)

        case FIELD_STATE:
            if(value == true || value == false){
                return true;
            }
            break

        case FIELD_TYPE:
            if(value == 1 || value == 0){
                return true;
            }
            break
        }
    return false
}

function getDeviceIdAsNumber(id){
    return parseInt(id)
}

//=======[ Endpoints of test ]=======================================================
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

    if(req.params.id == null || req.body == null || 
        req.body.state == null || req.body.type == null || req.body.name == null || req.body.description == null){
        sendErrorResponse(res);
        return
    }
    
    var response = `{"id":${req.params.id},"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
    responseAsJson = JSON.parse(response)
    res.send((JSON.stringify(responseAsJson))).status(200);
});

/**
 * TEST Crea un dispositivo y lo retorna con su id asignado
 * Si no lo crea retorna un mensaje de error
 */
app.put('/test/device/', function(req, res) {

    if(req.params.id == null || req.body == null || 
        req.body.state == null || req.body.type == null || req.body.name == null || req.body.description == null){
        sendErrorResponse(res);
        return
    }

    var response = `{"id":9999,"name":"${req.body.name}","description":"${req.body.description}","state":${req.body.state},"type":${req.body.type}}`
    responseAsJson = JSON.parse(response)
    res.send((JSON.stringify(responseAsJson))).status(200);
});


/**
 * TEST Delete dispositivo
 */
app.delete('/test/device/:id', function(req, res) {

    if(req.params.id == null){
        sendErrorResponse(res);
        return
    }

    var responseAsJson
    responseAsJson = JSON.parse(`{"message":"Elementos borrados 1 "}`)
    res.send((JSON.stringify(responseAsJson))).status(200);
});


app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});
//=======[ End of file ]=======================================================