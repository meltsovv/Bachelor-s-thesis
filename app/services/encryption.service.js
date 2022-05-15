/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable no-continue */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
const CryptoJS = require('crypto-js');

const saltRounds = process.env.SALT;

function makeid() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&*';
  for (let i = 0; i < Math.ceil(Math.random() * 4); i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function getBackCharCode(params) {
  let text = '';
  params.forEach((element) => {
    text += String.fromCharCode(element.join(''));
  });
  return text;
}
function getKeys(q, p) {
  const n = q * p;
  const mod = (p - 1) * (q - 1);
  let e = 0;
  const easeNumbers = [];
  nextPrime: for (let i = 2; i <= mod; i++) {
    for (let j = 2; j < i; j++) {
      if (i % j === 0) continue nextPrime;
    }
    easeNumbers.push(i);
  }
  let index = 0;
  function ease(a, b) {
    let returnedA = a;
    let returnedB = b;
    let num;
    while (returnedB) {
      num = returnedA % returnedB;
      returnedA = returnedB;
      returnedB = num;
    }
    if (Math.abs(returnedA) === 1) {
      return {
        ease_number: easeNumbers[index],
      };
    }
    index++;
    return ease(easeNumbers[index], mod);
  }
  e = ease(easeNumbers[0], mod).ease_number;
  const openKey = { e, n };
  const findD = () => {
    let d = 1;
    let a = true;
    while (a) {
      if ((d * e) % mod === 1) {
        a = false;
        return d;
      }
      d++;
    }
  };
  const d = findD();
  const closeKey = { d, n };
  return { closeKey, openKey };
}
function decodedNub(params, d, n) {
  console.log(params);
  const allArr = [];
  params.forEach((param, j) => {
    const arr = [];
    param.forEach((element, i) => {
      arr.push(element ** d % n);
    });
    allArr.push(arr);
  });
  console.log(allArr);
  return allArr;
}
function getCodedMassege(params) {
  let string = '';
  params.forEach((element, i) => {
    const text = `${makeid()}${element
      .map((el) => `${el}${makeid()}`)
      .join('')}`;
    string += `${text.length}${text}`;
  });
  return string;
}
function cod(params, openKey) {
  const allMassege = [];
  params.forEach((param, j) => {
    const word = [];
    param.forEach((element, i) => {
      word.push(element ** openKey.e % openKey.n);
      if (i === param.length - 1) {
        allMassege.push(word);
      }
    });
  });
  return allMassege;
}
const getCharCodeArr = (params, n) => {
  const textArray = [];
  for (let i = 0; i < params.toString().length; i++) {
    const iElement = params.toString()[i];
    let text = iElement.charCodeAt(0);
    const secondTextArray = [];
    if (n <= Number.parseInt(text, 10)) {
      text = text.toString();
      for (let j = 0; j < text.length; j++) {
        const jElement = text[j];
        secondTextArray.push(jElement);
        if (j === text.length - 1) {
          textArray.push(secondTextArray);
        }
      }
    } else {
      secondTextArray.push(text);
      textArray.push(secondTextArray);
    }
    if (i === params.length - 1) {
      return textArray;
    }
  }
};

exports.encrypt = (string) => {
  const { q, p } = JSON.parse(process.env.OPEN_PAIR_KEY_ENCRYPY);
  const keys = getKeys(q, p);
  return getCodedMassege(
    cod(getCharCodeArr(string, keys.openKey.n), keys.openKey)
  );
};

exports.decrypt = (code) => {
  const { n, d } = JSON.parse(process.env.SECRET_PAIR_KEY_ENCRYPY);
  let counterText = '';
  const array = [];
  let decodedText;
  for (let index = 0; index < code.split('').length; index++) {
    let count = index;
    while (!isNaN(Number.parseInt(code.split('')[count], 10))) {
      counterText += code.split('')[count];
      count++;
    }
    array.push(
      code
        .split('')
        .splice(index + counterText.length, Number.parseInt(counterText, 10))
        .join('')
    );
    index = index + counterText.length + Number.parseInt(counterText, 10) - 1;
    counterText = '';
  }
  const arr = [];
  array.forEach((param, i) => {
    if (param.length === 1) {
      arr.push([param]);
      if (i === array.length - 1) {
        decodedText = JSON.parse(getBackCharCode(decodedNub(arr, d, n)));
      }
    } else {
      const numbers = [];
      for (let index = 0; index < param.length; index++) {
        const element = param[index];
        if (!isNaN(Number.parseInt(element, 10))) {
          let count = index;
          counterText = '';
          while (!isNaN(Number.parseInt(param[count], 10))) {
            counterText += param[count];
            count++;
          }
          numbers.push(counterText);
          index += counterText.length;
          counterText = '';
        }
      }
      arr.push(numbers);
      if (i === array.length - 1) {
        decodedText = JSON.parse(getBackCharCode(decodedNub(arr, d, n)));
      }
    }
  });
  return decodedText;
};
exports.bcryptCreatePass = (password) =>
  CryptoJS.SHA3(password + saltRounds).toString();

exports.bcryptCheckPass = (password, hash) =>
  CryptoJS.SHA3(password + saltRounds).toString() === hash;
