//=======[ DOC ]===============================================================
// Este archivo deberia contener el manejo exclusivo de accesos a base de datos
// para evitar tener en index.js todo este manejo.
// Problema, no me es posible aun hacer el callback correctamente para que 
// desde index.js llege la informacion y no undefined.
// Solo logre implementar getDevices que obtiene correcmantente los datos
//=======[ Settings, Imports & Data ]==========================================

var connection = require('./mysql-connector');

//=======[ Main module code ]==================================================

var dataAccess = {
    getDevices: function () { 
        var sql = "select * from Devices";
        connection.query(sql, function (err, result) {
            if (err) {
                console.error('Error while connect to DB: ' + err.stack);
                return "MO_DATA";
            } else {
                console.log("RESPUESTA "  + result);
                return result;
            }
            
        });
    },
    setDevice:function () { 
        console.log('TODO: set');
    },
    updateDevice:function () { 
        console.log('TODO: update');
    },
    deleteDevice:function () { 
        console.log('TODO: delete');
    }
};

module.exports = dataAccess
//=======[ End of file ]=======================================================
