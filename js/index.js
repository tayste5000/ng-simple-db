"use strict";
var ng = require('angular');
require('angular-mocks');
var db_store_ts_1 = require('./db_store.ts');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ng.module('ngSimpleDb', [
    'ngMockE2E'
])
    .provider('ngSimpleStore', db_store_ts_1.default).name;
