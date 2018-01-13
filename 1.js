let Bignumber = require('bignumber.js');

// let CHAR = [
//   '0',
//   '1',
//   '2',
//   '3',
//   '4',
//   '5',
//   '6',
//   '7',
//   '8',
//   '9',
//   'a',
//   'b',
//   'c',
//   'd',
//   'e',
//   'f',
//   'g',
//   'h',
//   'i',
//   'j',
//   'k',
//   'l',
//   'm',
//   'n',
//   'o',
//   'p',
//   'q',
//   'r',
//   's',
//   't',
//   'u',
//   'v',
//   'w',
//   'x',
//   'y',
//   'z',
//   'A',
//   'B',
//   'C',
//   'D',
//   'E',
//   'F',
//   'G',
//   'H',
//   'I',
//   'J',
//   'K',
//   'L',
//   'M',
//   'N',
//   'O',
//   'P',
//   'Q',
//   'R',
//   'S',
//   'T',
//   'U',
//   'V',
//   'W',
//   'X',
//   'Y',
//   'Z',
//   '$',
//   '_'
// ];
// let INDEX = [
//   54,
//   6,
//   34,
//   41,
//   49,
//   59,
//   46,
//   37,
//   28,
//   8,
//   2,
//   13,
//   38,
//   11,
//   16,
//   40,
//   3,
//   29,
//   61,
//   18,
//   24,
//   58,
//   57,
//   43,
//   32,
//   21,
//   53,
//   48,
//   7,
//   1,
//   5,
//   27,
//   17,
//   15,
//   22,
//   47,
//   50,
//   25,
//   30,
//   20,
//   36,
//   9,
//   4,
//   31,
//   14,
//   45,
//   26,
//   51,
//   42,
//   10,
//   55,
//   39,
//   23,
//   60,
//   44,
//   12,
//   63,
//   52,
//   35,
//   62,
//   19,
//   33,
//   0,
//   56
// ];
// let HASH = {};
// for (let i = 0; i < 64; i++) {
//   let j = INDEX[i];
//   HASH[CHAR[i]] = CHAR[j];
// }
// console.log(HASH);
// Object.keys(HASH).forEach(function(k) {
//   let v = HASH[k];
//   HASH_REVERT[v] = k;
// });
// console.log(HASH_REVERT);

let HASH = {
  '0': 'S',
  '1': '6',
  '2': 'y',
  '3': 'F',
  '4': 'N',
  '5': 'X',
  '6': 'K',
  '7': 'B',
  '8': 's',
  '9': '8',
  a: '2',
  b: 'd',
  c: 'C',
  d: 'b',
  e: 'g',
  f: 'E',
  g: '3',
  h: 't',
  i: 'Z',
  j: 'i',
  k: 'o',
  l: 'W',
  m: 'V',
  n: 'H',
  o: 'w',
  p: 'l',
  q: 'R',
  r: 'M',
  s: '7',
  t: '1',
  u: '5',
  v: 'r',
  w: 'h',
  x: 'f',
  y: 'm',
  z: 'L',
  A: 'O',
  B: 'p',
  C: 'u',
  D: 'k',
  E: 'A',
  F: '9',
  G: '4',
  H: 'v',
  I: 'e',
  J: 'J',
  K: 'q',
  L: 'P',
  M: 'G',
  N: 'a',
  O: 'T',
  P: 'D',
  Q: 'n',
  R: 'Y',
  S: 'I',
  T: 'c',
  U: '_',
  V: 'Q',
  W: 'z',
  X: '$',
  Y: 'j',
  Z: 'x',
  '$': '0',
  _: 'U'
};
let HASH_REVERT = {
  '0': '$',
  '1': 't',
  '2': 'a',
  '3': 'g',
  '4': 'G',
  '5': 'u',
  '6': '1',
  '7': 's',
  '8': '9',
  '9': 'F',
  S: '0',
  y: '2',
  F: '3',
  N: '4',
  X: '5',
  K: '6',
  B: '7',
  s: '8',
  d: 'b',
  C: 'c',
  b: 'd',
  g: 'e',
  E: 'f',
  t: 'h',
  Z: 'i',
  i: 'j',
  o: 'k',
  W: 'l',
  V: 'm',
  H: 'n',
  w: 'o',
  l: 'p',
  R: 'q',
  M: 'r',
  r: 'v',
  h: 'w',
  f: 'x',
  m: 'y',
  L: 'z',
  O: 'A',
  p: 'B',
  u: 'C',
  k: 'D',
  A: 'E',
  v: 'H',
  e: 'I',
  J: 'J',
  q: 'K',
  P: 'L',
  G: 'M',
  a: 'N',
  T: 'O',
  D: 'P',
  n: 'Q',
  Y: 'R',
  I: 'S',
  c: 'T',
  _: 'U',
  Q: 'V',
  z: 'W',
  '$': 'X',
  j: 'Y',
  x: 'Z',
  U: '_'
};

let seq = [5, 3, 4, 1, 2, 0];

/**
 * id数字转成6个伪字符串，最大支持64^6=68719476736个
 * 首先id转成64进制字符串，然后不足6位的前缀补齐6位0
 * 为避免数字过小时前缀0过多，将前缀n个0变为n-1个随机字母和1个连字符-
 * 按照第1和6、2和4、3和5字符顺序互相交换，即123456变为645231
 * 最后按照码表置换，去掉开头的连字符得解
 */
function id2str(id) {
  let n = new Bignumber(id);
  let n64 = n.toString(64);
  if(n64.length < 6) {
    let s = '';
    for (let i = 0; i < 5 - n64.length; i++) {
      s += rand();
    }
    s += '-';
    n64 = s + n64;
  }
  // console.log(n64);
  let s = '';
  for (let i = 0; i < 6; i++) {
    let c = n64[i];
    s += HASH[c] || n64[i];
  }
  // console.log(s);
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += s[seq[i]];
  }
  // console.log(res);
  if(res[0] === '-') {
    res = res.slice(1);
  }
  // console.log(res);
  return res;
}

/**
 * 随机字符串转id
 * 首先不满6位字符串（即5位）前缀补连字符-
 * 按照码表进行反向置换
 * 按照第1和5、2和4、3和6字符顺序互相交换，即123456变为546213
 * 连字符-之前的字符全部替换为0
 * 将结果作为64进制数字转换为10进制
 */
function str2id(str) {
  if(str.length === 5) {
    str = '-' + str;
  }
  // console.log(str);
  let s = '';
  for (let i = 0; i < 6; i++) {
    let t = str[seq[i]];
    s += HASH_REVERT[t] || t;
  }
  // console.log(s);
  let i = s.indexOf('-');
  if(i > -1) {
    s = '00000' + s.slice(i + 1);
    s = s.slice(s.length - 6);
  }
  // console.log(s);
  return new Bignumber(s, 64).toString();
}

function rand() {
  let n = Math.floor(Math.random() * 64);
  return new Bignumber(n).toString(64);
}

let test = [];
for (let i = 0; i < 99; i++) {
  test.push(i);
}
test.push(835);
test.push(3126);
test.push(44444);
test.push(500000);
test.push(9332033);
test.push(10000001);
test.push(982348932);
test.push(2937374820);
for (let i = 0; i < test.length; i++) {
  let id = test[i];
  let s = id2str(id);
  let res = str2id(s);
  console.log(id, s, res, String(id) === res);
}

// let arr = [];
// for (let i = 0; i < 64; i++) {
//   // arr.push(new Bignumber(i).toString(64));
//   arr.push(i);
// }
// for (let k = 0; k < 10000; k++) {
//   let i = Math.floor(Math.random() * 64);
//   let j = Math.floor(Math.random() * 64);
//   if(i !== j) {
//     swap(i, j);
//   }
// }
// function swap(i, j) {
//   let temp = arr[i];
//   arr[i] = arr[j];
//   arr[j] = temp;
// }
// console.log(arr);
