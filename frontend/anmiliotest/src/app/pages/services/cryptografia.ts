import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secretKey: string = `${environment.secret}`; // Reemplaza con tu clave secreta

  encryptData(data: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    return encryptedData;
  }

  decryptData(encryptedData: string): string {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}
