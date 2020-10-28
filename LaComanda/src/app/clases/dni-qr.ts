export class DniQR {

    public static decodeQR(string: String): any{
        let informacion = string.split('@');
        let retorno = {};
        if(string[0] == '@'){
            retorno['dni'] = informacion[1].trim();
            retorno['apellido'] = informacion[4];
            retorno['nombre'] = informacion[5]
        }
        else{
            retorno['dni'] = informacion[4];
            retorno['apellido'] = informacion[2];
            retorno['nombre'] = informacion[1];
        }
        return retorno;
    }
}
