enum HTTP_METHOD {
    GET = "GET",
    DELETE = "DELETE"
} 

enum SERVICE_CALLBACK {
    GET_DEVICES = "GET_DEVICES",
    DELETE_DEVICE = "DELETE_DEVICE"
}

/**
 * Class para permitir interactuar con el backend
 */
class services {
    private static HOST:string = "http://localhost:8000"
    private static ERROR_JSON = JSON.stringify("Ocurrio un error al realizar la operación")

    public getDevices(callback:HttpCallback){
        this.callService(callback, SERVICE_CALLBACK.GET_DEVICES, HTTP_METHOD.GET, `${services.HOST}/devices`)
    }

    public deleteDevice(callback:HttpCallback, deviceId:number){
        this.callService(callback, SERVICE_CALLBACK.DELETE_DEVICE, HTTP_METHOD.DELETE,`${services.HOST}/device/${deviceId}`)
    }

    private callService(callback:HttpCallback, callbackKey:SERVICE_CALLBACK, method:string, url:string, data?:string){
        var xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if(xmlReq.readyState == 4){
                if(xmlReq.status == 200){
                    callback.handleServiceResponse(xmlReq.responseText, callbackKey)
                } else {
                    callback.handleServiceResponse(services.ERROR_JSON, "ERROR")
                }
            } 
        }

        xmlReq.open(method, url, true)
        
        if(data){
            xmlReq.setRequestHeader("Content-Type", "application/json")
            xmlReq.send(JSON.stringify(data))
        } else {
            xmlReq.send()
        }
    }

}