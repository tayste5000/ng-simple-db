import {expect} from 'chai';
import createBackendResource from './db_methods.ts';

const testStore : Array<Object> = [{
	id: 1,
	name: 'bob'
},{
	id: 2,
	name: 'billy'
},{
	id: 3,
	name: 'joe'
},{
	id: 4,
	name: 'jane'
}];

const resource : Function = createBackendResource(testStore);

describe('db_methods', () => {
	it('handles GET', () => {
		let response : Array<any> = resource('GET', '', '', {}, {});

		expect(response[0]).to.equal(200);
		expect(response[1]).to.deep.equal(testStore);
	});

	it('handles GET with ID', () => {
		let response : Array<any> = resource('GET', '', '', {}, {id: 1});

		expect(response[0]).to.equal(200);
		expect(response[1]).to.deep.equal(testStore[0]);
	});

	it('returns 404 when GET used with invalid ID', () => {
		let response : Array<any> = resource('GET', '', '', {}, {id: 100});

		expect(response[0]).to.equal(404);
	});

	it('handles POST', () => {
		let post_request = {name: 'bob'}

		let response : Array<any> = resource('POST', '', JSON.stringify(post_request), {}, {});

		expect(response[0]).to.equal(201);
		expect(response[1]).to.deep.equal({id: 5, name: 'bob'});
	});

	it('handles PUT', () => {
		let put_request = {id : 2, name: 'joe'};

		let response : Array<any> = resource('PUT', '', JSON.stringify(put_request), {}, {id: 2});

		expect(response[0]).to.equal(200);
		expect(response[1]).to.deep.equal(put_request);
	});

	it('returns 404 when PUT used with invalid ID', () => {
		let put_request = {id : 2, name: 'joe'};

		let response : Array<any> = resource('PUT', '', JSON.stringify(put_request), {}, {id: 8});

		expect(response[0]).to.equal(404);
	});

	it('handles DELETE', () => {
		let delete_response : Array<any> = resource('DELETE', '', '', {}, {id: 1});

		expect(delete_response[0]).to.equal(204);

		let get_response : Array<any> = resource('GET', '', '', {}, {});

		expect(get_response[1]).to.not.contain({id: 1, name: 'bob'});
	});

	it('returns 404 when DELETE used with invalid ID', () => {
		let delete_response : Array<any> = resource('DELETE', '', '', {}, {id: 100});

		expect(delete_response[0]).to.equal(404);
	})


})