# DAW Base App - Changes Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## 3.0.0
* Project modification
    * FRONTEND
        * Listar dispositivos
        * Crear dispositivos
        * Eliminar un dispositivo por vez, si es exitoso se quita de la lista
        * Endencer apagar un dispositivo, actualizando los labels
        * Las acciones confirmadas son mostradas mediante un mensaje y se actualizan si son exitosas en backend
        * Ante errores 4xx o 5xx se informa el error y no se aplican cambos en el front end

    * BACKEND
        * Endpoint para listar dispositivos
        * Endpoint para actualizar un dispositivo, retorna el dispositivo si se actualiza
        * Endpoint para actualizar el estado de un dispositivo, retorna los cambios
        * Endpoint para eliminar un dispositivo, retorna el id si se elimina, si no se encuentra retorna el aviso
            * Si falla al eliminarlo, retorna un error
        * Endpoint para crear un dispositivo, retorna el dispositivo y su id
        * Endpoints de test case para pruebas sin base de datos, anteponiendo /test/ al endpoint
        * Se validan los datos por cada operacion para que puedan ser usados en la interaccion con la base de datos

## 2.2.0

* Project modification
    * Adds TypeScript compiler service to Docker Compose
    * Reestructures frontend folder for TypeScript
    * Adds new info to README accordingly
    * Changes project architecture image

## 2.1.0

* Project modification
    * Enhaces README accordingly to Goto IoT
    * Adds example of finished application
    * Removes unnecessary frontend images
    * Changes src code folders names

## 2.0.0

* Project modification
    * Changes project and organization names
    * Removes Typescript container
    * Removes Typescript Code
    * Executes Javascript code directly
    * Changes licence to MIT
    * Modifies README accordingly

## 1.0.0

* Project creation
    * Docker Compose implementation for whole project.
    * Typescript compilation into docker-compose.
    * MySQL 5.7 DB Server.
    * PHPMyAdmin.
    * NodeJS backend application.
    * Materialize CSS framework.
