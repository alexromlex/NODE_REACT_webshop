import { v4 as uuidv4 } from 'uuid';

export function updateArray(array: Record<string, any>[], item: Record<string, any>) {
  const indx = array.findIndex((i) => i.id === item.id, -1);
  if (indx > -1) {
    return (array[indx] = { ...array[indx], ...item });
  }
}

export const getDateStart = (periodMonth: number, fromDate: null | Date = null) => {
  const date = fromDate ? new Date(fromDate) : new Date();
  return new Date(date.setMonth(date.getMonth() - periodMonth));
};

export const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getLastMonthShortNames(m: number) {
  const date: Date = new Date();
  let monthNow: number = date.getMonth();
  const monthResults: { indexes: number[]; names: string[] } = { indexes: [], names: [] };
  while (m > 0) {
    monthResults.names.unshift(monthShortNames[monthNow]);
    monthResults.indexes.unshift(monthNow);
    if (monthNow === 0) monthNow = 12;
    m--;
    monthNow--;
  }
  return monthResults;
}

export const statusStyle = {
  new: { bg: 'primary', text: 'white', hex: '#0d6efd' },
  invoiced: { bg: 'info', text: 'dark', hex: '#0dcaf0' },
  released: { bg: 'warning', text: 'dark', hex: '#ffc107' },
  fulfilled: { bg: 'success', text: 'with', hex: '#198754' },
  holded: { bg: 'danger', text: 'white', hex: '#dc3545' },
  cancelled: { bg: 'secondary', text: 'white', hex: '#adb5bd' },
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    // console.log('[S] currentPage <= 3');
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export const regexName = (name: string, replacer: string, toLower = true) => {
  const regex = /[.* %?^${}()|'"/[\]\\]/g;
  if (toLower) name = '' + name.toLowerCase();
  //@ts-ignore
  return '' + name.replaceAll(regex, replacer);
};

export const uuid4 = () => {
  return uuidv4();
};

export function getCookie(name: string | number) {
  const matches = document.cookie.match(
    //@ts-ignore
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

interface CookieAtributes {
  expires?: string | Date;
  'max-age'?: number;
  domain?: string;
  path?: string;
  somesite?: 'no_restriction' | 'lax' | 'strict' | 'unspecified';
  secure?: boolean;
}

export function setCookie(name: string | number, value: any, attributes: CookieAtributes = {}) {
  attributes = {
    path: '/',
    // add other defaults here if necessary
    ...attributes,
  };

  if (attributes.expires instanceof Date) {
    attributes.expires = attributes.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const attributeKey in attributes) {
    updatedCookie += '; ' + attributeKey;
    const attributeValue = attributes[attributeKey];
    if (attributeValue !== true) {
      updatedCookie += '=' + attributeValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string | number) {
  setCookie(name, '', {
    'max-age': -1,
  });
}

export const dateFormatter = (d: string) => {
  return new Date(d).toLocaleString('hu-HU', {
    dateStyle: 'short',
    timeStyle: 'short',
    hourCycle: 'h24',
  });
};
export const priceFormatter = (v: number) => {
  return v.toLocaleString('hu-HU') + ' HUF';
};

export const getPropByString = (obj: object, propString: string) => {
  const props = propString.split('.');
  let value = obj;
  for (const p of props) {
    if (value[p] === undefined) return value;
    value = value[p];
  }
  return value;
};

export const promiseWrapper = (promise, delay = 3000) => {
  let status: string = 'pending';
  let result: any;
  const s = promise
    .then((value) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          status = 'success';
          result = value;
          resolve(value);
        }, delay);
      });
    })
    .catch((error) => {
      status = 'error';
      result = error;
    });

  return () => {
    switch (status) {
      case 'pending':
        throw s;
      case 'success':
        return result;
      case 'error':
        throw result;
      default:
        throw new Error('Unknown status');
    }
  };
};
