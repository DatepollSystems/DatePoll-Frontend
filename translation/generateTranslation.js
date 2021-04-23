/**
 * Credits go to https://github.com/qunabu/translate-script.
 * Adds compatibility to LibreTranslation API (https://translate.dafnik.me)
 * Adds cache feature
 * Adds check agains manual written language files in /src/assets/i18n/{target}.json
 */

const fetch = require('node-fetch');
// noinspection NodeCoreCodingAssistance
const fs = require('fs');

// noinspection JSUnresolvedVariable
const INPUT_FILE = process.argv[2] || './de.json';
// noinspection JSUnresolvedVariable
const TARGET_LANG = process.argv[3] || 'en';

let localCache = null;
let localManual = null;

/**
 * Get json from local machine
 * @param {String} filename on local machine
 * @returns {Promise} resolved object is JSON
 */
const getJSON = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      }
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

/**
 * Loads the cache and returns int
 * @param {String} term, to get translation
 * @param {String} target language code eg `en`
 * @returns {Object} or null if there is no entry
 */
const getManualEntry = (target, term) => {
  if (localManual == null) {
    const path = './src/assets/i18n/' + target + '.json';
    if (!fs.existsSync(path)) {
      console.log('!!! NO MANUAL LANGUAGE FILES EXISTS !!!');
      localManual = {};
    } else {
      localManual = JSON.parse(fs.readFileSync(path, 'UTF-8'));
    }
  }
  return localManual[term] ? localManual[term] : null;
};

/**
 * Loads the cache and returns int
 * @param {String} term, key to be translated
 * @param {String} target language code eg `en`
 * @returns {Object} or null if there is no entry
 */
const getCacheEntry = (target, term) => {
  if (localCache == null) {
    const path = './translation/translation_cache_' + target + '.json';
    if (!fs.existsSync(path)) {
      localCache = {};
    } else {
      localCache = JSON.parse(fs.readFileSync(path, 'UTF-8'));
    }
  }
  return localCache[term] ? localCache[term] : null;
};

/**
 * Saves new cache entry to cache
 * @param {String} key New cache entry key
 * @param {String} newCacheEntry New cache entry line
 * @param {String} target language code eg `en`
 * @returns {string[]} list of cache entries
 */
const writeToCache = (key, newCacheEntry, target) => {
  if (localCache == null) {
    localCache = {};
  }
  localCache[key] = newCacheEntry;
  fs.writeFile('./translation/translation_cache_' + target + '.json', JSON.stringify(localCache), function (err) {
    if (err) throw err;
    console.log('Saving "' + key + '" in ' + target + ': "' + newCacheEntry + '" to cache');
  });
};

/**
 * Calls the translate.dafnik.me
 * @param {Object} term, term to be translated the shape of `{key:"", value:""}`, eg. `{key:"fullName", value:"Full name"}
 * @param {String} target language code eg `en`
 * @returns {Promise} resolve object is in the same shape as input
 */
const getTranslation = (term, target) => {
  const cacheEntry = getCacheEntry(target, term.value);
  if (cacheEntry != null) {
    return new Promise((resolve) => {
      console.log('Translating from cache "' + term.value + '" to ' + target + ': "' + cacheEntry + '"');
      resolve({
        // resole the translation
        key: term.key,
        value: cacheEntry,
      });
    });
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch('https://translate.dafnik.me/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
          q: term.value,
          target: target,
          source: 'de',
        }),
      })
        .then((response) => (response.ok ? response : reject(`Fetch failed with status code ${response.status}`)))
        .then((response) => response.json()) // parses response to JSON
        .then(
          (
            json // check if the result is valid,
          ) => {
            if (json.error) {
              reject(json.error); // reject if response contains error
            } else {
              console.log('Translating "' + term.value + '" to ' + target + ': "' + json.translatedText + '"');
              writeToCache(term.value, json.translatedText, target);
              resolve({
                // resole the translation
                key: term.key,
                value: json.translatedText,
              });
            }
          }
        )
        .catch((error) => reject(error)); // reject in case of any error
    });
  });
};

/**
 * Saves object as JSON into file
 * @param {String} filename, name of file to be saved
 * @param {Object} obj to be saved as json
 * @returns {Promise}
 */
const writeToFile = (filename, obj) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(obj), (err) => (err ? reject(err) : resolve(filename)));
  });
};

/**
 * Proccess all the input array and calls `getTranslation` onEach row
 * @param {Array} arr, array of objects term to be translated in the shape of `{key:"", value:""}`, eg. `{key:"fullName", value:"Full name"}
 * @param target
 * @returns {Promise} resolved array is in the same shape as input
 */
const processTranslation = (arr, target = 'en') => {
  let toDeletes = [];
  for (const term of arr) {
    if (getManualEntry(target, term.key) != null) {
      toDeletes.push(term);
    }
  }
  for (const toDelete of toDeletes) {
    const i = arr.indexOf(toDelete);
    arr.splice(i, 1);
  }

  return new Promise((resolve) => {
    /**
     *
     * @param {Array} arr input variables array. Terms to be translated
     * @param {Array} book output variable array. Translated terms.
     * @param {Integer} currentIndex of proccesing queue
     */
    const convert = (arr, book = [], currentIndex = 0) =>
      currentIndex <= arr.length - 1
        ? getTranslation(arr[currentIndex], target).then((obj) => convert(arr, [...book, obj], currentIndex + 1))
        : resolve(book);
    convert(arr);
  });
};

/**
 * Converts object to array
 * @param {Object} obj
 * @returns {Array}
 * @example
 * // returns [{key:"fullName", value:"Full name"}]
 * convertToArray({fullName:"Full Name"})
 */
const convertToArray = (obj) => Object.keys(obj).map((key) => ({key, value: obj[key]}));

/**
 * Converts array to object
 * @returns {Object}
 * @example
 * // returns {fullName:"Full Name"}
 * convertToObject([{key:"fullName", value:"Full name"}])
 * @param arr
 */
const convertToObject = (arr) => arr.reduce((acc = {}, curr) => ({...acc, [curr.key]: curr.value}), {});

/** Runs the application */

// noinspection JSCheckFunctionSignatures
getJSON(INPUT_FILE) // get data from input file
  .then((input_vars) => convertToArray(input_vars)) // convert data from object to array
  .then((input_arr) => processTranslation(input_arr, TARGET_LANG, process.env.GKEY)) // process the whole array
  .then((transl_arr) => convertToObject(transl_arr)) // convert data from array to object
  .then((output_vars) => writeToFile(`./src/assets/i18n/${TARGET_LANG}_auto.json`, output_vars)) // saves translated object into file)
  .then((filename) => console.log(`translation succesfully saved in ${filename}`)) // outputs success
  .catch((err) => console.error('Error', err)); // shows error in case of any of above fails
