'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var fs_1 = require('fs');

var arg = process.env.NEXT_PUBLIC_BASE_URL;
var arg2 = process.env.NEXT_PUBLIC_DOMAIN;

// Set the environment variable in .env dynamically
if (arg && arg2) {
  var content = 'NEXT_PUBLIC_BASE_URL='.concat(arg, '\nNEXT_PUBLIC_DOMAIN=').concat(arg2, '\n');
  (0, fs_1.writeFileSync)('.env', content);
} else {
  console.error('Error: NEXT_PUBLIC_DOMAIN or NEXT_PUBLIC_BASE_URL not provided.');
  process.exit(1);
}
