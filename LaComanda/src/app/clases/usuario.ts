export class Usuario {

    public uid;
    public nombre: string;
    public apellido: string;
    public foto: string;
    public dni: string;
    public cuil: string;
    public perfil: string;
    public estado: string;
    public tipo: string;

    constructor(uid, nombre, apellido, foto, dni, cuil, perfil, estado, tipo = null) {
        this.uid = uid;
        this.nombre = nombre;
        this.apellido = apellido;
        this.foto = foto;
        this.dni = dni;
        this.cuil = cuil;
        this.perfil = perfil;
        this.estado = estado;
        this.tipo = tipo;

    }

}
