export class Usuario {

    public nombre:string;
    public apellido:string;
    public foto:string;
    public dni:string;
    public cuil:string;
    public perfil:string;
    public estado:string;

    constructor(nombre,apellido,foto,dni,cuil,perfil,estado)
    {
        this.nombre = nombre;
        this.apellido = apellido;
        this.foto = foto;
        this.dni = dni;
        this.cuil = cuil;
        this.perfil = perfil;
        this.estado = estado;

    }

}