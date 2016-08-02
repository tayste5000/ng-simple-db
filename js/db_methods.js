"use strict";
var lodash = require('lodash');
function backendResource(store, method, url, data, headers, params) {
    switch (method) {
        case 'GET':
            //if no 'id' parameter passed, do getAll	
            if (!params.hasOwnProperty('id')) {
                return [200, lodash.cloneDeep(store), {}];
            }
            var get_item = lodash.find(store, { id: params.id });
            if (!get_item) {
                return [404, 'RESOURCE NOT FOUND', {}];
            }
            return [200, lodash.cloneDeep(get_item), {}];
        case 'POST':
            var post_item = JSON.parse(data);
            post_item.id = store.slice(-1)[0].id + 1;
            store.push(post_item);
            return [201, lodash.cloneDeep(post_item), {}];
        case 'PUT':
            //must have 'id' param
            if (!params.hasOwnProperty('id')) {
                return [400, 'RESOURCE ID MISSING', {}];
            }
            var put_item = JSON.parse(data);
            var put_index = lodash.findIndex(store, { id: params.id });
            if (put_index == -1) {
                return [404, 'RESOURCE NOT FOUND', {}];
            }
            store[put_index] = lodash.cloneDeep(put_item);
            return [200, lodash.cloneDeep(put_item), {}];
        case 'DELETE':
            //must have 'id' param
            if (!params.hasOwnProperty('id')) {
                return [400, 'RESOURCE ID MISSING', {}];
            }
            var index = lodash.findIndex(store, { id: Number(params.id) });
            if (index == -1) {
                return [404, 'RESOURCE NOT FOUND', {}];
            }
            store.splice(index, 1);
            return [204, 'RESOURCE SUCCESFULLY DELETED', {}];
        default:
            return [400, 'METHOD NOT FOUND', {}];
    }
}
function createBackendResource(store) {
    return lodash.curry(backendResource)(store);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createBackendResource;
