enum HTTP_METHOD {
    GET = "GET"
} 

/**
 * Class para permitir interactuar con el backend
 */
class services {
    private static HOST:string = "http://localhost:8000"

    public getDevices(callback:HTTPCallback){
        
        var xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if(xmlReq.readyState == 4){
                if(xmlReq.status == 200){
                    callback.handleServiceResponse(xmlReq.responseText)
                } else {
                    callback.handleServiceResponse("NO DATA")
                }
            } 
        }
        xmlReq.open(HTTP_METHOD.GET, `${services.HOST}/devices `, true)
        xmlReq.send()
    }

}