/**
 * Split camelCased string in to multiple words based on uppercase letters.
 *
 * camelCase -> Camel Case
 *
 * @param camelCasedString String to split
 * @returns string with separated words
 */
export function camel2Words(camelCasedString: string): string {
  return camelCasedString.match(/(([a-z]|[A-Z])[a-z]*)/g)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
