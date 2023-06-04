declare var M:any;

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
    label_slider = "label_slider"
}

enum EventName {
    keypress = "keypress",
    click = "click",
    change = "change"
}

class Main implements EventListenerObject{
    private static total:number = 0;
    private personaArray:Array<Persona> = new Array();
    static main:Main;
    
    static getInstance(){
        if( this.main == undefined)
            this.main = new Main();
        return this.main;
    }

    private constructor(){
        console.log(`Mi constructor main`)
    }

    /**
     * MAneja al boton agregar
     */
    private handleButtonAdd(){
        let pers = this.getPersona()
        var persona = new Persona( pers.a, pers.n, pers.d);
        if(persona.isValid()) {
            this.personaArray.push(persona);
            alert(`Persona agregada ${persona.toString()} , total de personas: ${this.personaArray.length}`);
            
            this.resetElements(ElementId.input_apellido,ElementId.input_nombre,ElementId.input_documento)
        } else {
            alert(`Fallo al agregar`);
        }
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
        this.personaArray = new Array();
    }

    private handleInput(event: any) {
        var value = document.getElementById(event.target.id) as HTMLInputElement;
        if (value.value.length >= 10) {
            console.log(`User is tiping more than 10 characters`);
        }
    }

    private handleButtonShow(elementId:ElementId) {
        let current_value = document.getElementById(elementId) as HTMLInputElement;
        let new_value = "";
        this.personaArray.forEach(e => {
            new_value = new_value + e.toString() + "\n";
        });
        document.getElementById(elementId).innerHTML = new_value;
    }
    
    private handleButtonHide(elementId:ElementId) {
        let current = document.getElementById(elementId) as HTMLInputElement;
        document.getElementById(elementId).innerHTML = "";
    }

    /**
     * Recupero mediante AJAX datos al BackEnd y lo informo por consola.
     */
    private getDevices(){
        var xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if(xmlReq.readyState == 4){
                if(xmlReq.status == 200){
                    console.log("llegue", xmlReq.responseText)
                } else {
                    console.log("mo llegue")
                }
            } 
        }
        xmlReq.open("GET", "http://localhost:8000/devices", true)
        xmlReq.send()
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