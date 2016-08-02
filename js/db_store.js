"use strict";
var path2regexp = require('path-to-regexp');
var db_methods_ts_1 = require('./db_methods.ts');
var DbServiceClass = (function () {
    function DbServiceClass(stores, apiUrl) {
        this.stores = stores;
        this.apiUrl = apiUrl;
    }
    DbServiceClass.prototype.setup = function ($httpBackend) {
        this.stores.forEach(addRoutes.bind(this));
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        function addRoutes(store) {
            var resources = store.resources;
            var path_regex = path2regexp("" + this.apiUrl + store.name + "/:id");
            var resource = db_methods_ts_1.default(store.resources);
            $httpBackend.whenGET(path_regex, undefined, ['id']).respond(resource);
            $httpBackend.whenPUT(path_regex, undefined, ['id']).respond(resource);
            $httpBackend.whenDELETE(path_regex, undefined, ['id']).respond(resource);
            $httpBackend.whenGET("" + this.apiUrl + store.name).respond(resource);
            $httpBackend.whenPOST("" + this.apiUrl + store.name).respond(resource);
        }
    };
    return DbServiceClass;
}());
exports.DbServiceClass = DbServiceClass;
var DbServiceProvider = (function () {
    function DbServiceProvider() {
        this.stores = [];
        this.delay_set = false;
        this.apiUrl = '/';
    }
    DbServiceProvider.prototype.setDelay = function (delay, $provide) {
        if (this.delay_set) {
            console.log('WARNING: MOCK BACKEND DELAY ALREADY SET');
            return;
        }
        this.delay_set = true;
        // automatic delay on $httpBackend REMOVE IN PRODUCTION
        $provide.decorator('$httpBackend', backendDelay);
        backendDelay.$inject = ['$delegate'];
        function backendDelay($delegate) {
            var proxy = function (method, url, data, callback, headers) {
                var interceptor = function () {
                    var _this = this, _arguments = arguments;
                    setTimeout(function () {
                        callback.apply(_this, _arguments);
                    }, delay);
                };
                return $delegate.call(this, method, url, data, interceptor, headers);
            };
            for (var key in $delegate) {
                proxy[key] = $delegate[key];
            }
            return proxy;
        }
    };
    DbServiceProvider.prototype.addResources = function (name, resources) {
        this.stores.push({ name: name, resources: resources });
    };
    DbServiceProvider.prototype.$get = function () {
        var service = new DbServiceClass(this.stores, this.apiUrl);
        return service;
    };
    return DbServiceProvider;
}());
DbServiceProvider.$inject = [];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DbServiceProvider;
