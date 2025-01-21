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

