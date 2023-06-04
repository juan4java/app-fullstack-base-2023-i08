class device {
    
    private id:number
    private nombre:string
    private descripcion:string
    private estado:boolean
    private tipo:boolean
    
    constructor(id?:number, nombre?:string, descripcion?:string, estado?:boolean, tipo?:boolean){
    }

    public isValid():boolean{
        return false
    }

    public toString(): string{
        return `id: ${this.id} ,
                nombre: ${this.nombre} ,
                descripcion: ${this.descripcion}, 
                estado:  ${this.estado}, 
                tipo: ${this.tipo}`;    }
}
