import { set } from 'lodash/fp';
import {
  SettingConfigModel,
  SettingConfigGroupResponse,
  SettingGroupConfigModel,
} from './interfaces';

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
    .map((word) => uCFirst(word))
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
 * Converts string to currency formatted string
 * @param number
 */
export function stringToCurrency(number: string): string {
  return parseFloat(number).toLocaleString('en-US', {
    minimumFractionDigits: 2,
  });
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
export function objectToPathArray(
  payload: Object,
): { path: string[]; value: any }[] {
  const results = [];

  for (const key in payload) {
    if (isPlainObject(payload[key])) {
      for (const child of objectToPathArray(payload[key])) {
        child.path.unshift(key);
        results.push(child);
      }
    } else {
      results.push({
        path: [key],
        value: payload[key],
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
export function initSettingConfigGroup(
  settingGroupConfigResponse: SettingConfigGroupResponse,
): SettingGroupConfigModel {
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
        values = Object.keys(selectValues).map((value) => {
          return { value: value, title: selectValues[value] };
        });
      } else if (selectValues instanceof Array) {
        values = selectValues.map((value) => {
          return { value: value, title: camel2Words(String(value)) };
        });
      } else {
        values = [
          {
            value: String(selectValues),
            title: String(selectValues),
          },
        ];
      }

      // Turn ['yes', 'no'] select type into toggle input type
      if (
        values.length === 2 &&
        ((values[0].value === 'yes' && values[1].value === 'no') ||
          (values[0].value === 'no' && values[1].value === 'yes'))
      ) {
        settingGroupConfigResponse[settingSlug].format = 'toggle';
      }

      result[settingSlug] = {
        ...settingGroupConfigResponse[settingSlug],
        values: values,
      };
    } else {
      result[settingSlug] = settingGroupConfigResponse[
        settingSlug
      ] as SettingGroupConfigModel;
    }
  }

  return result;
}

/**
 * Assign value to object by path and return updated object
 *
 * @param obj Object to update
 * @param path Path string from which object keys will be updated
 * @param value value to update
 */
export function assignByPath(obj: any, path: string, value: any) {
  const pathArr = path.replace(/^\//, '').split('/');
  return set(pathArr, value, obj);
}

/**
 * Removes invalid characters by XML 1.0 specification
 *
 * @param string
 * @returns cleaned string
 */
export function removeXMLInvalidChars(string: string): string {
  const notSafeRegex =
    /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
  return string.replace(notSafeRegex, '');
}

/**
 * Get icon name from URL
 *
 * @param url
 */
export function getIconFromUrl(url: string) {
  let iconName = 'link';
  const availableIcons = [
    'facebook',
    'twitter',
    'instagram',
    'flickr',
    '500px',
    'dribbble',
    'linkedin',
    'behance',
    'pinterest',
    'vimeo',
    'youtube',
    'tumblr',
    'spotify',
  ];

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {}

  if (parsedUrl && parsedUrl.hostname) {
    const hostParts = parsedUrl.hostname.split('.');

    if (hostParts.length > 1) {
      const hostName = hostParts[hostParts.length - 2];

      if (availableIcons.indexOf(hostName) > -1) {
        iconName = hostName;
      }
    }
  }

  return iconName;
}

/**
 * Converts object of attributes to string of HTML attributes
 */
export function toHtmlAttributes(attributes: {
  [key: string]: string;
}): string {
  let html = '';

  Object.keys(attributes)
    .filter(
      (attribute) => attributes[attribute] && attributes[attribute].length > 0,
    )
    .map((attribute) => {
      html += ` ${attribute}="${attributes[attribute]}"`;
    });

  return html;
}

export function toImageHtmlAttributes(
  siteSlug: string,
  attributes: { filename: string; width: string | null; height: string | null },
) {
  let html = '';
  const mediaUrl = `/storage/${
    siteSlug.length ? `-sites/${siteSlug}/` : ''
  }media`;

  html += ` src="${mediaUrl}/${attributes.filename}"`;

  if (attributes.width) {
    html += ` srcset="${mediaUrl}/_${attributes.width}x${attributes.height}_${attributes.filename} 1x, ${mediaUrl}/${attributes.filename} 2x"`;
    html += ` width="${attributes.width}"`;
  }

  if (attributes.height) {
    html += ` height="${attributes.height}"`;
  }

  return html;
}

export function getImageItem(
  siteSlug: string,
  filename: string,
  attributes: { [key: string]: string },
) {
  const mediaUrl = `/storage/${
    siteSlug.length ? `-sites/${siteSlug}/` : ''
  }media`;

  if (attributes.alt) {
    attributes.alt = attributes.alt
      .replace(/\n/g, ' ') // remove new line
      .replace(/(<([^>]+)>)/gi, '') // remove html tags
      .replace(/  +/g, ' ') // remove too many empty spaces
      .trim();
  }

  attributes.src = `${mediaUrl}/${filename}`;

  if (attributes.width && attributes.height) {
    attributes.srcset = `${mediaUrl}/_${attributes.width}x${attributes.height}_${filename} 1x, ${mediaUrl}/${filename} 2x`;
  }

  return attributes;
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function formatPrice(price, currency) {
  const floatPrice = parseFloat(price);
  if (isNaN(floatPrice)) {
    return '';
  }

  return `${floatPrice.toFixed(2)} ${currency}`;
}

export function toCartAttributes(attributes: string): string[] {
  return attributes
    .split(',')
    .map((attribute) => attribute.trim())
    .filter((attribute) => attribute.length > 0);
}
