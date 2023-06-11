enum typeEnum {
    ON_OFF = "Encendido - Apagado",
    DIAL = "Reguble",
}

class Device {
    
    public id:number
    public name:string
    public description:string
    public type:boolean
    public state:boolean
    
    constructor(id?:number, nombre?:string, descripcion?:string, type?:boolean, status?:boolean){
        this.id = id
        this.name = nombre
        this.description = descripcion
        this.type = type
        this.state = status 
    }


    public toString(): string{
        return `id: ${this.id} ,
                nombre: ${this.name} ,
                descripcion: ${this.description}, 
                estado:  ${this.state}, 
                tipo: ${this.type}`;    }

    
}
