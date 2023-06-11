enum HTTP_METHOD {
    GET = "GET",
    DELETE = "DELETE",
    POST = "POST",
    PUT = "PUT"
} 

enum SERVICE_CALLBACK {
    GET_DEVICE_LIST = "GET_DEVICES",
    DELETE_DEVICE = "DELETE_DEVICE",
    CREATE_DEVICE = "CREATE_DEVICE",
    UPDATE_DEVICE = "UPDATE_DEVICE",
    UPDATE_DEVICE_STATE = "UPDATE_DEVICE_STATE"
}

/**
 * Class para permitir interactuar con el backend
 */
class services {
    private static HOST:string = "http://localhost:8000"
    private static ERROR_JSON = JSON.stringify("Ocurrio un error al realizar la operación")


    public getDeviceList(callback:HttpCallback){
        this.callService(callback, SERVICE_CALLBACK.GET_DEVICE_LIST, HTTP_METHOD.GET, `${services.HOST}/devices`)
    }

    public deleteDevice(callback:HttpCallback, deviceId:number){
        this.callService(callback, SERVICE_CALLBACK.DELETE_DEVICE, HTTP_METHOD.DELETE, `${services.HOST}/device/${deviceId}`)
    }

    public createDevice(callback:HttpCallback, device:Device){
        this.callService(callback, SERVICE_CALLBACK.CREATE_DEVICE, HTTP_METHOD.PUT, `${services.HOST}/device`, device)
    }

    public updateDevice(callback:HttpCallback, device:Device){
        this.callService(callback, SERVICE_CALLBACK.UPDATE_DEVICE, HTTP_METHOD.POST, `${services.HOST}/device/${device.id}`, device)
    }
    
    public updateDeviceStatus(callback:HttpCallback, id:number, state:boolean){
        
        var data = '{"state": ' + state +'}'
        this.callService(callback, SERVICE_CALLBACK.UPDATE_DEVICE_STATE, HTTP_METHOD.POST, `${services.HOST}/device/${id}/state`, JSON.parse(data))
    }

    private callService(callback:HttpCallback, callbackKey:SERVICE_CALLBACK, method:string, url:string, data?:any){
        var xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if(xmlReq.readyState == 4){
                if(xmlReq.status == 200){
                    callback.handleServiceResponse(xmlReq.responseText, callbackKey)
                } else {
                    callback.handleServiceResponse(xmlReq.responseText)
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