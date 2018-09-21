import { SettingConfigModel, SettingConfigGroupResponse, SettingGroupConfigModel } from './interfaces';

/**
 * Split camelCased string in to an array of strings.
 *
 * camelCase => ['camel', 'Case']
 *
 * @param camelCasedString String to split
 * @returns array with camelCased string parts
 */
export function splitCamel(camelCasedString: string): Array<string> {
  return camelCasedString.match(/([a-z]+)|([A-Z][a-z]+)|([A-Z]+(?![a-z]))/g);
}


/**
 * Uppercase the first letter of given string
 *
 * string => String
 *
 * @param str string to uppercase the first character
 * @returns string with uppercase first character
 */
export function uCFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


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
    return uCFirst(camelCasedString);
  }
  return splitCamel(camelCasedString)
    .map(word => uCFirst(word))
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


/**
 * Transforms deep payload object into flat array with key path and value
 *
 * Example object:
 * {
 *   name: 'John'
 *   attributes: {
 *     age: 18,
 *     weight: 75
 *   }
 * }
 *
 * Result:
 * [
 *   {
 *     path: ['name'],
 *     value: 'John'
 *   },
 *   {
 *     path: ['attributes', 'age'],
 *     value: 18
 *   },
 *   {
 *     path: ['attributes', 'weight'],
 *     value: 75
 *   }
 * ]
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


/**
 * Update values parameter in each of settings for given group and return the new group
 *
 * @param settingGroupConfigResponse - setting group configuration from API response
 * @return - setting group where all settings that have select values are updated for the app
 */
export function initSettingConfigGroup(settingGroupConfigResponse: SettingConfigGroupResponse): SettingGroupConfigModel {
  const result: SettingGroupConfigModel = {};

  for (const settingSlug in settingGroupConfigResponse) {
    if (settingSlug === '_') {
      result['_'] = settingGroupConfigResponse[settingSlug];

    } else if (
      'values' in settingGroupConfigResponse[settingSlug] ||
      settingGroupConfigResponse[settingSlug].format === 'select' ||
      settingGroupConfigResponse[settingSlug].format === 'fontselect'
    ) {
      const selectValues = settingGroupConfigResponse[settingSlug].values;
      let values: SettingConfigModel['values'] = [];

      if (isPlainObject(selectValues)) {
        values = Object.keys(selectValues).map((value => {
          return { value: value, title: selectValues[value] };
        }));

      } else if (selectValues instanceof Array) {
        values = selectValues.map(value => {
          return { value: value, title: camel2Words(String(value)) };
        });

      } else {
        values = [{
          value: String(selectValues),
          title: String(selectValues)
        }];
      }

      // Turn ['yes', 'no'] select type into toggle input type
      if (values.length === 2 &&
          ((values[0].value === 'yes' && values[1].value === 'no') || (values[0].value === 'no' && values[1].value === 'yes'))) {
        settingGroupConfigResponse[settingSlug].format = 'toggle';
      }

      result[settingSlug] = {
        ...settingGroupConfigResponse[settingSlug],
        values: values
      };

    } else {
      result[settingSlug] = settingGroupConfigResponse[settingSlug] as SettingGroupConfigModel;
    }
  }

  return result;
}
