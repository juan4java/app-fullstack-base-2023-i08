declare var M:any;

/**
 * Enum para ids de elementos
 */
enum ElementId {

    input_name = "input_name",
    input_description = "input_description",
    input_type = "input_type",
    input_state = "input_state",

    button_cancel = "button_cancel",
    button_create_save = "button_save",
    button_delete = "button_delete",

    div_device_list = "div_device_list",

    modal_create = "modal_create",
    modal_delete = "modal_delete",
    modal_help = "modal_help",

    checkbox_state = "checkbox_state",
    label_state = "label_state"
}

/**
 * Enum para eventos
 */
enum EventName {
    keypress = "keypress",
    click = "click",
    change = "change"
}

/**
 * Class main para la app
 */
class Main implements EventListenerObject, HttpCallback{
    private service:services = new services
    static main:Main
    private static deviceIdToDelete:number = -1

    static TOAST_PAGE_LOADED:string = "Pagina cargada!"
    static TOAST_DEVICE_ON:string = "Se encendio el dispositivo"
    static TOAST_DEVICE_OFF:string = "Se apago el dispositivo"
    static TOAST_DEVICE_DELETED:string = "Se borro el dispositivo"
    static TOAST_DEVICE_UPDATED:string = "Se actualizo el dispositivo"
    static TOAST_DEVICE_CREATED:string = "Se creo el dispositivo"
    static TOAST_DEVICE_CREATE_FIELD_REQUIRED:string = "Todos los campos son requeridos!"
    
    /**
     * Uso una unica instancia.
     * @returns
     */
    static getInstance(){
        if( this.main == undefined)
            this.main = new Main();
        return this.main;
    }

    private constructor(){
        console.log(`Mi constructor main`)
        //Cargo los devices
        this.refreshDeviceList()
    }
      
    /**
     * Manejador de eventos 
     * @param event 
     */
    handleEvent(event){
        console.log(`evento ${event.target.id}`)

        switch(event.target.id){
            case ElementId.button_delete:
                this.handleButtonConfirmDelete();
                break
                        
            case ElementId.button_create_save:
                this.handleButtonCreateSave(event.target.id)
                break

            case ElementId.checkbox_state:
                this.handleDeviceChangeState(ElementId.checkbox_state, ElementId.label_state, false);
                break
                
            default:    
                //Manejo eventos del listado
                if(event.target.id.startsWith("href_status_")){
                    this.handleDeviceStatusOnOff(event.target.id);

                } else if(event.target.id.startsWith("href_delete_")){
                    this.handleDeleteIconClick(event.target.id);

                } else if(event.target.id.startsWith("href_update_")){
                    this.handleUpdateDevice(event.target.id);

                } else if(event.target.id.startsWith("checkbox_state_")){
                    var id = this.getDeviceIdFromEventName(event.target.id)
                    this.handleDeviceChangeState(event.target.id, `label_state_${id}`, false);
                }              
        }
    }

    /**
     * Maneja cuando se hace guardar y crear un nuevo dispositivo
     * @param id 
     */
    private handleButtonCreateSave(id: string) {
        var d = this.getDeviceFromModal();
        console.log(d)
        
        if(d.name && d.description && (d.type == 0 || d.type == 1)){
            //Creo un device y llamo al servicio
            var device:Device = new Device(-1,d.name,d.description,d.type==0, d.state)
            this.service.createDevice(this, device)

            //Cierro el modal
            this.closeModal(ElementId.modal_create);

            //Limpio la informacion del modal
            this.updateDeviceModal()
        } else {
            showToast(Main.TOAST_DEVICE_CREATE_FIELD_REQUIRED);
        }
    }

    /**
     * 
     * @param modalName Cierra un modal por nombre
     */
    private closeModal(modalName:string) {
        var elem = document.getElementById(modalName);
        var instance = M.Modal.getInstance(elem);
        instance.close();
    }

    private handleUpdateDevice(targetId: string ) {
        var deviceId = this.getDeviceIdFromEventName(targetId)
        var d = this.getDeviceFromModal(deviceId);
        console.log(d)
        var device:Device = new Device(deviceId, d.name,d.description,d.type==0, d.state)
        this.service.updateDevice(this,device)
        // // this.refreshDeviceList()        
    }

    /**
     * Maneja el click de eliminar un dispositivo
     */
    private handleDeleteIconClick(targetId:string) {
        var deviceId = this.getDeviceIdFromEventName(targetId)
        Main.deviceIdToDelete = deviceId

        var modal = document.getElementById(ElementId.modal_delete);
        var instance = M.Modal.getInstance(modal);
        instance.open();
    }

    /**
     * Maneja el evento de apagado encendido, actualizacion de icono  y texto
     * @param targetId 
     */
    private handleDeviceStatusOnOff(targetId: string) {

        var deviceId = this.getDeviceIdFromEventName(targetId)
        
        var icon = document.getElementById(targetId);
        var state = icon.innerHTML.includes("flash_off")
        
        this.service.updateDeviceStatus(this, deviceId, state)
    }

    /**
     * Recupero el id a partir del nombre del evento.
     * @param eventId 
     * @returns 
     */
    private getDeviceIdFromEventName(eventId:string){
        var elements:string[] = eventId.split("_")
        var id = parseInt(elements[elements.length-1])
        return id
    }

    /**
     * ACtualizar el label para el switch, o resetear el componente a un estado "Apagado"
     * @param elementId 
     * @param labelId 
     * @param reset 
     */
    private handleDeviceChangeState(elementId:string, labelId:string,reset:boolean) {
        var state = <HTMLInputElement>document.getElementById(elementId);
        var label = <HTMLInputElement>document.getElementById(labelId);
        
        if(reset){
            state.value = ""
            label.innerHTML = "Apagado"
        } else {
            label.innerHTML = (state.checked) ? "Encendido" : "Apagado";
        }
    }

    /**
     * Manejador de evento para el boton borrar
     */
    private handleButtonConfirmDelete() {

        this.closeModal(ElementId.modal_delete)

        this.service.deleteDevice(this, Main.deviceIdToDelete)
    }

    /**
     * Manejador de respuestas del backend
     * @param response 
     * @param operation 
     */
    public handleServiceResponse(response: string, operation?:string) {
        
        switch(operation){
            case SERVICE_CALLBACK.GET_DEVICE_LIST:
                this.handleServiceResponseGetDevices(response)
                break
            case SERVICE_CALLBACK.DELETE_DEVICE:
                this.handleServiceResponseDelete(response)
                break
            case SERVICE_CALLBACK.CREATE_DEVICE:
                this.handleServiceResponseCreate(response)
                break
            case SERVICE_CALLBACK.UPDATE_DEVICE:
                this.handleServiceResponseUpdate(response)
                break
            case SERVICE_CALLBACK.UPDATE_DEVICE_STATE:
                this.handleServiceResponseUpdateState(response)
                break
            default:
                var json = JSON.parse(response)
                showToast(json.message)
                break
        }
    }

    /**
     * Recupera un dispositivo del modal
     * Si no se pasa id el modal es el del alta
     * Si se pasa el id, se recupera ese dispositivo mediante una variable concatenada
     * @returns 
     */  
    private getDeviceFromModal(deviceId?: number) {

        var postName = ""
        if(deviceId >= 0){
            postName = "_"+deviceId
        }

        var name = <HTMLInputElement> document.getElementById(ElementId.input_name+postName);
        var description = <HTMLInputElement> document.getElementById(ElementId.input_description+postName);
        var type = <HTMLSelectElement> document.getElementById(ElementId.input_type+postName);
        var state = <HTMLInputElement> document.getElementById(ElementId.checkbox_state+postName);
       
        return {"name":name.value,
                "description":description.value,
                "type": type.selectedIndex,
                "state":state.checked,
            }    
    }

    /**
     * 
     * @param device 
     */
    private updateDeviceModal(device?:Device){

        var postName = ""
        var isDeviceInList = false
        if(device){
            isDeviceInList = device.id >= 0
            if(isDeviceInList) {
                postName = "_"+device.id    
            }
        }

        var name = <HTMLInputElement> document.getElementById(ElementId.input_name+postName);
        var description = <HTMLInputElement> document.getElementById(ElementId.input_description+postName);
        var type = <HTMLSelectElement> document.getElementById(ElementId.input_type+postName);
        var state = <HTMLInputElement> document.getElementById(ElementId.checkbox_state+postName);
           
       
        console.log(device)
        if(isDeviceInList) {

            //Actualizo los datos que se muestran en la lista
            this.updateHeaderDevice(device.id, device.state);

            var nameId:string = "header_list_"+device.id
            console.log(nameId)
            document.getElementById(nameId).innerHTML = device.id+"-"+device.name+"-"+device.description

            //Actualizo los valores que se ven al hacer click en el boton Editar
            name.value = device.name
            description.value = device.description
            type.selectedIndex = device.type ? 1:0
            state.checked = device.state
        } else {           
            //Se limpian los valores, es el modal de creacion
            name.value = ""
            description.value = ""
            type.selectedIndex = 0
            state.checked = false
        }

        this.handleDeviceChangeState(ElementId.checkbox_state, ElementId.label_state, true)
    }

    /**
     * Actualiza datos e iconos del header para el dispositivo
     * @param id 
     * @param state 
     */
    private updateHeaderDevice(id: number, state: boolean) {
        
        var el: string = "message_icon_" + id;
        document.getElementById(el).innerHTML = state ? "Encendido" : "Apagado";

        el = "bar_icon_state_" + id;
        var el1 = document.getElementById(el)

        el1.innerHTML = state ? "check" : "close";
        
        var icon = document.getElementById("href_status_"+id);
        var state = icon.innerHTML.includes("flash_off")

        if (icon.innerHTML.includes("flash_off")) {
            var valueOn = `<i class="material-icons">flash_on</i>Apagar`;
            icon.innerHTML = valueOn;
            showToast(Main.TOAST_DEVICE_ON);
        } else {
            var valueOn = `<i class="material-icons">flash_off</i>Encender`;
            icon.innerHTML = valueOn;
            showToast(Main.TOAST_DEVICE_OFF);
        }
    }

    /**
     * Recupero datos del BackEnd.
     */
    private getDeviceList(){
        this.service.getDeviceList(this)
    }

    private refreshDeviceList(){
        var deviceListDiv: HTMLElement = document.getElementById(ElementId.div_device_list)
        deviceListDiv.innerHTML =  `<div class="progress">
                                        <div class="indeterminate"></div>
                                    </div>`
        
        this.getDeviceList()
    }

    /**
     * Maneja la respuesta de una creacion exitosa de dispositivo
     * @param response 
     */
    private handleServiceResponseCreate(response: string) {
        //Recupero toda la lista
        this.getDeviceList()
        //Informo que el equipo se creo
        showToast(Main.TOAST_DEVICE_CREATED)
    }

    /**
     * Maneja la respuesta de una actualizacion exitosa de dispositivo
     * @param response 
     */
    private handleServiceResponseUpdate(response: string) {
        var device:Device = JSON.parse(response)
        console.log(device)
        this.updateDeviceModal(device)
        showToast(Main.TOAST_DEVICE_UPDATED)
    }
    
    /**
     * Maneja la respuesta de una actualizacion exitosa de dispositivo
     * @param response 
     */
    private handleServiceResponseUpdateState(response: string) {
        
        var device = JSON.parse(response)
        this.updateHeaderDevice(device.id, device.state)
        showToast(device.message)
    }

    /**
     * Manejador de respuestas a datos provenientes de backend
     * @param response
     */
    public handleServiceResponseDelete(response: string) {
        
        var resp = JSON.parse(response)
        document.getElementById("li_"+resp.id).innerHTML = ""
    
        showToast(resp.message);
     }

    /**
     * Manejador de respuestas a datos provenientes de backend
     * @param response
     */
    public handleServiceResponseGetDevices(response: string) {
        var array = JSON.parse(response)
        var deviceListDiv: HTMLElement = document.getElementById(ElementId.div_device_list)
        
        var deviceList = ""
        array.forEach((e) => {
            var estado:boolean = e.state == 0;
            var stateOnOff
            var stateMessage
            var messageIcon
            var barIconState

            if(estado){
                barIconState =`close`
                stateOnOff =`flash_off`
                messageIcon =`Apagado`
                stateMessage =`Encender`
            } else {
                barIconState =`check`
                stateOnOff =`flash_on`
                messageIcon =`Encendido`
                stateMessage =`Apagar`
            }
                // } else {
            //     barIcon =`check`
            //     rigthIcon =`flash_on`
            //     rigthIcon =`Encendido al ${estado}%`
            //     message =`Apagar`
            // }

            deviceList =    `${deviceList}
                            <li id="li_${e.id}">
                                <div class="collapsible-header">
                                    <i class="material-icons">chevron_right</i><span class="title" id="header_list_${e.id}">${e.id}-${e.name}-${e.description}</span>
                                    <span class="badge" id="message_icon_${e.id}">${messageIcon}</span><i class="material-icons" id="bar_icon_state_${e.id}">${barIconState}</i>
                                </div>

                                <div class="collapsible-body"> 
                                    <ul class="collection" id="ul_device_${e.id}">
                                        <li class="collection-item avatar">
                                            <i class="material-icons circle blue" id="icon_${e.id}">cloud_done</i>
                                            <span class="title">${e.description}</span>
                                            <br>
                                            
                                            <a href="#!" class="content" id="href_status_${e.id}"><i class="material-icons" id="state_icon_${e.id}">${stateOnOff}</i>${stateMessage}</a>

                                            <a href="#!" class="secondary-content"><i class="material-icons" id="href_delete_${e.id}">delete</i></a>
                                            <a href="#modal_edit_${e.id}" class="waves-effect waves-light modal-trigger">Editar</a>
                                        </li>
                                    </ul>
                                </div>

                                <!-- Modal Trigger -->
                                ${this.getHtmlModalEdit(e)}
                            </li>
                            `;
        });

        deviceListDiv.innerHTML = `<ul class="collapsible">
                                        ${deviceList}
                                    </ul>`;
       
        //Agregp listener para los elementos que requieren una accion de la lista de dispositivos
        array.forEach(e => {
            var elems = document.getElementById(`modal_edit_${e.id}`);
            var instances = M.Modal.init(elems, {
                "outDuration":500,
                "endingTop":"10%"});

            var iconE: HTMLElement = document.getElementById(`href_status_${e.id}`)
            iconE.addEventListener(EventName.click, Main.getInstance())

            var iconE: HTMLElement = document.getElementById(`href_delete_${e.id}`)
            iconE.addEventListener(EventName.click, Main.getInstance())

            var iconE: HTMLElement = document.getElementById(`href_update_${e.id}`)
            iconE.addEventListener(EventName.click, Main.getInstance())

            var iconE: HTMLElement = document.getElementById(`checkbox_state_${e.id}`)
            iconE.addEventListener(EventName.click, Main.getInstance())
        });

        var elemsC = document.querySelectorAll('select');
        M.FormSelect.init(elemsC, {});

        var elems = document.querySelectorAll('.collapsible');
        elems.forEach(e => {
            var instances = M.Collapsible.init(e, {
                accordion: true
                });
        });
    }

    /**
     * Aca armo el modal para la edicion de un dispositivo.
     * @param e 
     * @param name 
     * @returns 
     */
    private getHtmlModalEdit(e:Device) {
        
        var labelState = e.state == true ? "Encendido" :"Apagado"
        var type = e.type == true 
        var modal =
        `    
        <!-- Modal Structure -->
        <div id="modal_edit_${e.id}" class="modal">
            <div class="modal-content">
            <h4>Editar dispostivo: ${e.name}</h4>

            <div class="row">

            <!-- Campo Name-->
            <div class="input-field col s6">
                <i class="material-icons prefix">input</i>
                <input  value="${e.name}" id="input_name_${e.id}" type="text" class="validate">
                <label  class="active" for="input_name" >Nombre</label>
            </div>

            <!-- Campo Description-->
            <div class="input-field col s6">
                <i class="material-icons prefix">input</i>
                <input  value="${e.description}" id="input_description_${e.id}" type="text" class="validate">
                <label  class="active" for="input_name" >Descripcion</label>
            </div>

            <!-- Campo Type-->
            <div class="input-field col s6">
                <i class="material-icons prefix">settings</i>
                <select id="input_type_${e.id}">
                `
                if(type){
                    modal = modal + this.getHtmlDeviceTypeSelectedVariable()
                } else {
                    modal = modal + this.getHtmlDeviceTypeSelectedOnOff()
                }
                modal = modal + `
                </select>
                <label>Tipo</label>
            </div>

            <!-- Campo Status-->
            <div class="input-field col s1">
                <i class="material-icons prefix">power</i>
            </div>

            <div class="input-field col s5">
                <div class="switch">
                    <div>
                        <div>
                            <label id="label_state_${e.id}">${labelState}</label>
                            <div>
                                <label>
                                    
                                    `
                                    if( e.state == true){
                                        modal = modal + this.getHtmlDeviceStateOn(e.id)
                                    } else {
                                        modal = modal + this.getHtmlDeviceStateOff(e.id)
                                    }
                                    modal = modal + `
                                    <span class="lever"></span>
                                    
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            </div>

            <div class="row">
                <div class="-field col s12">
                
                <i class="material-icons prefix">warning</i>
                <input  value="Los cambios seran aplicados al Guardar" type="text" disabled="true">
                
                </div>
            </div>

            <!-- Buttons -->
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-red btn-flat">Salir</a>
                <a href="#!" class="modal-close waves-effect btn waves-blue btn-flat" id="href_update_${e.id}">ACTUALIZAR</a>
            </div>
        </div>
        </div>
        `

        return modal
    }

    private getHtmlDeviceTypeSelectedOnOff() {
        return `
                <option value="false" selected>Encendido - Apagado</option>
                <option value="true">Regulable</option>
                `
    }

    private getHtmlDeviceTypeSelectedVariable() {
        return `
                <option value="true" selected>Regulable</option>
                <option value="false">Encendido - Apagado</option>
                `
    }

    private getHtmlDeviceStateOn(id) {
        return `
            <input type="checkbox" id="checkbox_state_${id}" checked="checked">
            `;
    }
    private getHtmlDeviceStateOff(id) {
        return `
            <input type="checkbox" id="checkbox_state_${id}">`  
    }
}

window.addEventListener("load", ()=>{   
    initMaterialize();
    initCombosMaterialize();
  
    addListener(ElementId.button_create_save, EventName.click);
    addListener(ElementId.button_delete, EventName.click);
    
    addListener(ElementId.input_type, EventName.change );
    addListener(ElementId.input_state, EventName.change );
    addListener(ElementId.checkbox_state, EventName.change );
    
    addListener(ElementId.input_name, EventName.keypress );
    addListener(ElementId.input_description, EventName.keypress );
 
    showToast(Main.TOAST_PAGE_LOADED);
});

function initCombosMaterialize() {
    var elems = document.getElementById(ElementId.modal_create);
    M.Modal.init(elems, {
        "outDuration": 500,
        "endingTop": "10%"
    });

    var elems = document.getElementById(ElementId.modal_delete);
    M.Modal.init(elems, {
        "outDuration": 500,
        "endingTop": "10%"
    });

    var elemsC = document.querySelectorAll('combo');
    M.FormSelect.init(elemsC, {});

    var elems = document.getElementById(ElementId.modal_help);
    M.Modal.init(elems, {
        "outDuration": 500,
        "endingTop": "10%"
    });
}

function initMaterialize() {
    M.updateTextFields();
}

function showToast(text) {
    M.toast({html: text,displayLength:1000})
}

/**
 * Permite agregar un listener a un elemento
 * @param elementId
 * @param eventName 
 */
function addListener(elementId:ElementId, eventName:EventName){
    var boton: HTMLElement = document.getElementById(elementId)
    if(boton)
        boton.addEventListener(eventName, Main.getInstance())
    else 
        console.log("WARNING: Este element no se encontro " , elementId)
}