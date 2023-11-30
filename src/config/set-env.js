"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");

var arg = process.env.NEXT_PUBLIC_BASE_URL;

// Set the environment variable in .env dynamically
if (arg) {
    (0, fs_1.writeFileSync)('.env', "NEXT_PUBLIC_BASE_URL=".concat(arg, "\n"));
}
else {
    console.error('Error: REACT_APP_API_URL_ARG not provided.');
    process.exit(1);
}
