//tipo 1 regulable
//tipo 0 on off

class Device {
    
    public id:number
    public name:string
    public description:string
    public type:number
    public state:boolean
    
    constructor(id?:number, nombre?:string, descripcion?:string, type?:number, state?:boolean){
        this.id = id
        this.name = nombre
        this.description = descripcion
        this.type = type
        this.state = state
    }


    public toString(): string{
        return `id: ${this.id} ,
                nombre: ${this.name} ,
                descripcion: ${this.description}, 
                estado:  ${this.state}, 
                tipo: ${this.type}`;    }

    
}
