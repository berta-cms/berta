/**
 * Split camelCased string in to multiple words based on uppercase letters.
 *
 * camelCase -> Camel Case
 *
 * @param camelCasedString String to split
 * @returns string with separated words
 */
export function camel2Words(camelCasedString: string): string {
  // If we get a word with non-letter characters, just uppercase the first letter and return.
  if (/[^A-z]/i.test(camelCasedString)) {
    return camelCasedString.charAt(0).toUpperCase() + camelCasedString.slice(1);
  }
  return camelCasedString.match(/([a-z]+)|([A-Z][a-z]+)|([A-Z]+(?![a-z]))/g)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


/**
 *  Function to test if an object is a plain object, i.e. is constructed
 *  by the built-in Object constructor and inherits directly from Object.prototype
 *  or null. Some built-in objects pass the test, e.g. Math which is a plain object
 *  and some host or exotic objects may pass also.
 *
 *  @param obj - value to test
 */
export function isPlainObject(obj: any): boolean {

  // Basic check for Type object that's not null
  if (typeof obj === 'object' && obj !== null) {

    // If Object.getPrototypeOf supported, use it
    if (typeof Object.getPrototypeOf === 'function') {
      const proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || proto === null;
    }

    // Otherwise, use internal class
    // This should be reliable as if getPrototypeOf not supported, is pre-ES5
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  // Not an object
  return false;
}

export function slugify(str: string): string {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to   = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  return str;
}

/**
 * Transforms payload object into flat array with key path and value
 *
 * @param payload object to convert
 */
export function objectToPathArray(payload: Object): {path: string[], value: any}[] {
  const results = [];

  for (const key in payload) {
    if (isPlainObject(payload[key])) {
      for ( const child of objectToPathArray(payload[key])) {
        child.path.unshift(key);
        results.push(child);
      }

    } else {
      results.push({
        path: [key],
        value: payload[key]
      });
    }
  }

  return results;
}
