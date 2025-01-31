import CryptoJS from "react-native-crypto-js";

export function initialsName(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
}

/**
 * Generates a random 10-digit number as a string.
 * @returns {string} A 10-digit random number.
 */
export function generateRandom10DigitNumber(): string {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
}




function encryptPassword(plainText: string, key: string): string {
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000"); // IV of zeros

    const encrypted = CryptoJS.AES.encrypt(plainText, keyBytes, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}

export { encryptPassword };
