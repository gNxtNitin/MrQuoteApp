/**
 * Flattens a nested object into a single-level object with dot-separated keys.
 *
 * @param obj - The object to flatten.
 * @param parentKey - The parent key for recursion (used internally).
 * @param result - The accumulator for the flattened result (used internally).
 * @returns A flattened object.
 */

export const flattenObject = (
    obj: { [key: string]: any },
    parentKey = "",
    result: { [key: string]: any } = {}
  ): { [key: string]: any } => {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            const arrayKey = `${newKey}[${index}]`;
            if (typeof item === "object" && item !== null) {
              flattenObject(item, arrayKey, result);
            } else {
              result[arrayKey] = item;
            }
          });
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObject(obj[key], newKey, result);
        } else {
          const simplifiedKey = newKey.replace(/\[\d+\]\./g, "").replace(/\[\d+\]/g, ""); // Remove [index]
          result[simplifiedKey] = obj[key];
        }
      }
    }
    return result;
  };
  