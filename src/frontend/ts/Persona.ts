class Persona {
    private nombre:string
    private apellido:string
    private documento:number
    
    constructor(apellido?:string, nombre?:string, documento?:number){
        this.apellido = apellido
        this.documento =  documento
        this.nombre = nombre
    }

    public isValid():boolean{
        if(this.apellido != ""  &&  this.nombre != "" && this.documento > 0)
            return true
        return false
    }

    public toString(): string{
        return `apellido: ${this.apellido} ,nombre: ${this.nombre} ,documento: ${this.documento}`;
    }
}
