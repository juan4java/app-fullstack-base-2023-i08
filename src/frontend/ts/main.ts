declare var M:any;

enum ElementId {
    textarea_1 = "textarea_1",

    input_nombre = "input_nombre",
    input_apellido = "input_apellido",
    input_documento = "input_documento",
    
    button_add = "button_add",
    button_reset = "button_reset",
    button_hide= "button_hide",
    button_show= "button_show"
}

enum EventName {
    keypress = "keypress",
    click = "click"
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

    static contador():number{
        console.log(`Estoy contando`)
        return Main.total++;
    }

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

    getPersona(){
        var apellido = document.getElementById(ElementId.input_apellido) as HTMLInputElement
        var nombre = document.getElementById(ElementId.input_nombre) as HTMLInputElement
        var documento = document.getElementById(ElementId.input_documento) as HTMLInputElement
        
        return {"a":apellido.value, "n":nombre.value, "d":parseInt(documento.value)}
    }

    getPersona2(...elements:ElementId[]){
        let m  = new Map()
        elements.forEach(element => {
            var apellido = document.getElementById(element) as HTMLInputElement
            m.set(element,apellido.value)
        });
    }

    resetElements(...elements:ElementId[]){
        
        elements.forEach(element => {
            var e = document.getElementById(element) as HTMLInputElement
            e.value = ""
        });
    }


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

            case "range_field":
               var range = <HTMLInputElement> document.getElementById('range_field');
               var valor = <HTMLInputElement> document.getElementById('label_slider');
               console.log(range.value)
               valor.value = range.value;
        }
    }

    private handleButtonReset() {
        this.personaArray = new Array();
    }

    private handleInput(event: any) {
        var value = document.getElementById(event.target.id) as HTMLInputElement;
        if (value.value.length >= 10) {
            console.log(`User is ATR mode`);
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
}


window.addEventListener("load", ()=>{   
    
    M.updateTextFields();
   
    addListener(ElementId.button_add, EventName.click);
    addListener(ElementId.button_show, EventName.click);
    addListener(ElementId.button_reset, EventName.click);
    addListener(ElementId.button_hide, EventName.click);

    addListener(ElementId.input_apellido, EventName.keypress );
    addListener(ElementId.input_documento, EventName.keypress );
    addListener(ElementId.input_nombre, EventName.keypress );

    var rangeField = document.getElementById('range_field');
    rangeField.addEventListener("change", Main.getInstance())

   M.toast({html: 'Pagina Lista!'})
});

function addListener(elementId:ElementId, eventName:EventName){
    var boton: HTMLElement = document.getElementById(elementId)
    if(boton)
        boton.addEventListener(eventName, Main.getInstance())
    else 
        console.log("WARNING: Este element no se encontro " , elementId)
}