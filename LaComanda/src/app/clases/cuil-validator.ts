import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CuilValidator {
    static cuilValido(control: AbstractControl): ValidationErrors | null {
        if(isValidCUITCUIL(control.value)){
            return null;
        }else{
            return {invalido: true};
        }
    }
}

function isValidCUITCUIL(cuit:String) : Boolean
	{
		if (cuit.length != 13) return false;
		
		let rv = false;
		let resultado = 0;
		let cuit_nro = cuit.replace("-", "");
		const codes = "6789456789";
		let verificador = parseInt(cuit_nro[cuit_nro.length-1]);
		let x = 0;
		
		while (x < 10)
		{
			let digitoValidador = parseInt(codes.substring(x, x+1));
			if (isNaN(digitoValidador)) digitoValidador = 0;
			let digito = parseInt(cuit_nro.substring(x, x+1));
			if (isNaN(digito)) digito = 0;
			let digitoValidacion = digitoValidador * digito;
			resultado += digitoValidacion;
			x++;
		}
		resultado = resultado % 11;
		rv = (resultado == verificador);
		return rv;
	}