declare var M:any;

/**
 * Enum para ids de elementos
 */
enum ElementId {
    textarea_1 = "textarea_1",

    input_nombre = "input_nombre",
    input_apellido = "input_apellido",
    input_documento = "input_documento",
    
    button_add = "button_add",
    button_reset = "button_reset",
    button_hide = "button_hide",
    button_show = "button_show",
    button_list = "button_list",
    
    range_field = "range_field",
    label_slider = "label_slider",

    div_device_list = "div_device_list"
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
    private static total:number = 0;
    static main:Main;

    
    static getInstance(){
        if( this.main == undefined)
            this.main = new Main();
        return this.main;
    }

    private constructor(){
        console.log(`Mi constructor main`)
        //Cargo los devices
        this.getDevices()
    }

    /**
     * MAneja al boton agregar
     */
    private handleButtonAdd(){
        alert(`Fallo al agregar`);
    }

    /**
     * Recupera una persona cargada en la pagina
     * @returns 
     */
    getPersona(){
        var apellido = document.getElementById(ElementId.input_apellido) as HTMLInputElement
        var nombre = document.getElementById(ElementId.input_nombre) as HTMLInputElement
        var documento = document.getElementById(ElementId.input_documento) as HTMLInputElement
        
        return {"a":apellido.value, "n":nombre.value, "d":parseInt(documento.value)}
    }

    /**
     * Limpia los datos del array
     * @param elements 
     */
    resetElements(...elements:ElementId[]){
        
        elements.forEach(element => {
            var e = document.getElementById(element) as HTMLInputElement
            e.value = ""
        });
    }

    /**
     * Manejador de eventos
     * @param event 
     */
    handleEvent(event){
        console.log(`evento ${event.target.id}`)

        switch(event.target.id){
            case ElementId.button_add:
                this.handleButtonAdd();
                break

            case ElementId.input_nombre:
            case ElementId.input_apellido:
            case ElementId.input_documento:
                this.handleInput(event);    
                break

            case ElementId.button_show:
                this.handleButtonShow(ElementId.textarea_1);
                break
            
            case ElementId.button_hide:
                this.handleButtonHide(ElementId.textarea_1);
                break
            
            case ElementId.button_reset:
                this.handleButtonReset();
                this.handleButtonHide(ElementId.textarea_1);
                break

            case ElementId.range_field:
                this.updateRangeValueInLabel(event.target.id, ElementId.label_slider);
                break

            case ElementId.button_list:
                this.handleButtonList();
                this.getDevices()
                break
        }
    }

    /**
     * Permite mantener un label asociado al slicer indicado, de
     * forma que al cambiar el slicer, se vea el valor en el label
     * @param elementId 
     * @param elementLabel 
     */
    updateRangeValueInLabel(elementId:ElementId,elementLabel:ElementId ) {
        var range = <HTMLInputElement> document.getElementById(elementId);
        var label = <HTMLInputElement> document.getElementById(elementLabel);
        label.value = range.value;
    }

    /**
     * Manejador de eventos para listar datos que provienen del backend
     */
    private handleButtonList() {
        console.log("manejando boton listar") 
    }

    private handleButtonReset() {
    }

    private handleInput(event: any) {
        var value = document.getElementById(event.target.id) as HTMLInputElement;
        if (value.value.length >= 10) {
            console.log(`User is tiping more than 10 characters`);
        }
    }

    private handleButtonShow(elementId:ElementId) {
    }
    
    private handleButtonHide(elementId:ElementId) {
        let current = document.getElementById(elementId) as HTMLInputElement;
        document.getElementById(elementId).innerHTML = "";
    }

    /**
     * Recupero mediante AJAX datos al BackEnd y lo informo por consola.
     */
    private getDevices(){
        this.service.getDevices(this)
    }

    /**
     * Manejador de respuestas a datos provenientes de backend
     * @param response
     */
    handleServiceResponse(response: string) {
        var array = JSON.parse(response)
        var deviceListDiv: HTMLElement = document.getElementById(ElementId.div_device_list)
        
        var deviceList = ""
        array.forEach(e => {
            var leftIcon = `folder`
            var estado = e.state * 100
            var rigthIcon
            
            if(estado == 0){
                rigthIcon =`flash_off </i> Apagado`
            } else if(estado == 100){
                rigthIcon =`flash_on </i> encendido`
            } else {
                rigthIcon =`flash_on </i> encendido al ${estado}%`
            }
            
            deviceList = 
                `${deviceList}
                   <ul class="collection" id="ul_device_${e.id}">
                   <li class="collection-item avatar">
                       <i class="material-icons circle">${leftIcon}</i>
                       <span class="title">${e.id} - ${e.name}</span>
                       <p>${e.description}<br>
                       </p>
                       <a href="#!" class="content"><i class="material-icons">${rigthIcon}</a>
                       <a href="#!" class="secondary-content"><i class="material-icons">edit</i></a>
                       </li>
                   </ul>        
                   `     
        });
    
        deviceListDiv.innerHTML = deviceList;
    }
}

window.addEventListener("load", ()=>{   
    initMaterialize();
   
    addListener(ElementId.button_add, EventName.click);
    addListener(ElementId.button_show, EventName.click);
    addListener(ElementId.button_reset, EventName.click);
    addListener(ElementId.button_hide, EventName.click);

    addListener(ElementId.button_list, EventName.click);

    addListener(ElementId.input_apellido, EventName.keypress );
    addListener(ElementId.input_documento, EventName.keypress );
    addListener(ElementId.input_nombre, EventName.keypress );

    addListener(ElementId.range_field, EventName.change );

    endMaterialize();
});


function initMaterialize() {
    M.updateTextFields();
}

function endMaterialize() {
    M.toast({html: 'Pagina Lista!'})
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