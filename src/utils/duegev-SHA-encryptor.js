import { sha512 } from "sha512-crypt-ts";

export class DuegevEncryptor {
    static generateRandomSalt() {
        const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./';
        const length = 8 + Math.random() * 8;
        let result = '';
        for (let i = length; i > 0; --i) { result += alphabet[Math.floor(Math.random() * alphabet.length)]; }
        return result;
    }

    static SHA512Encrypt(word, salt = 'random') {
        salt = salt === 'random'
            ? DuegevEncryptor.generateRandomSalt()
            : salt;
        return sha512.crypt(word, salt);
    }
}