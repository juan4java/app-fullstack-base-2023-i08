enum typeEnum {
    ON_OFF = "Encendido - Apagado",
    ON_DIAL_OFF = "Reguble - Apagado",
}

class device {
    
    public id:number
    public name:string
    public description:string
    public state:number
    public type:boolean
    
    constructor(id?:number, nombre?:string, descripcion?:string, estado?:number, tipo?:boolean){
    }

    public isValid():boolean{
        return false
    }

    public toString(): string{
        return `id: ${this.id} ,
                nombre: ${this.name} ,
                descripcion: ${this.description}, 
                estado:  ${this.state}, 
                tipo: ${this.type}`;    }

    
}
