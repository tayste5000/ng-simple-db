"use strict";
var chai_1 = require('chai');
var db_methods_ts_1 = require('./db_methods.ts');
var testStore = [{
        id: 1,
        name: 'bob'
    }, {
        id: 2,
        name: 'billy'
    }, {
        id: 3,
        name: 'joe'
    }, {
        id: 4,
        name: 'jane'
    }];
var resource = db_methods_ts_1.default(testStore);
describe('db_methods', function () {
    it('handles GET', function () {
        var response = resource('GET', '', '', {}, {});
        chai_1.expect(response[0]).to.equal(200);
        chai_1.expect(response[1]).to.deep.equal(testStore);
    });
    it('handles GET with ID', function () {
        var response = resource('GET', '', '', {}, { id: 1 });
        chai_1.expect(response[0]).to.equal(200);
        chai_1.expect(response[1]).to.deep.equal(testStore[0]);
    });
    it('returns 404 when GET used with invalid ID', function () {
        var response = resource('GET', '', '', {}, { id: 100 });
        chai_1.expect(response[0]).to.equal(404);
    });
    it('handles POST', function () {
        var post_request = { name: 'bob' };
        var response = resource('POST', '', JSON.stringify(post_request), {}, {});
        chai_1.expect(response[0]).to.equal(201);
        chai_1.expect(response[1]).to.deep.equal({ id: 5, name: 'bob' });
    });
    it('handles PUT', function () {
        var put_request = { id: 2, name: 'joe' };
        var response = resource('PUT', '', JSON.stringify(put_request), {}, { id: 2 });
        chai_1.expect(response[0]).to.equal(200);
        chai_1.expect(response[1]).to.deep.equal(put_request);
    });
    it('returns 404 when PUT used with invalid ID', function () {
        var put_request = { id: 2, name: 'joe' };
        var response = resource('PUT', '', JSON.stringify(put_request), {}, { id: 8 });
        chai_1.expect(response[0]).to.equal(404);
    });
    it('handles DELETE', function () {
        var delete_response = resource('DELETE', '', '', {}, { id: 1 });
        chai_1.expect(delete_response[0]).to.equal(204);
        var get_response = resource('GET', '', '', {}, {});
        chai_1.expect(get_response[1]).to.not.contain({ id: 1, name: 'bob' });
    });
    it('returns 404 when DELETE used with invalid ID', function () {
        var delete_response = resource('DELETE', '', '', {}, { id: 100 });
        chai_1.expect(delete_response[0]).to.equal(404);
    });
});
