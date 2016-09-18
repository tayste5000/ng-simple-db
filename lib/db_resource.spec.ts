import {DbResource, DbManager} from './db_resource.ts';
import {expect} from 'chai';

// Initialize data array
let colors : Array<any> = [
	{
		id: 1,
		feature: 'yellow'
	},
	{
		id: 2,
		feature: 'blue'
	},
	{
		id: 3,
		feature: 'green'
	},
	{
		id: 4,
		feature: 'red'
	},
	{
		id: 5,
		feature: 'orange'
	}
];

// Initialize data array
let trees : Array<any> = [
	{
		id: 1,
		feature: 'oak'
	},
	{
		id: 2,
		feature: 'maple'
	},
	{
		id: 3,
		feature: 'alder'
	},
	{
		id: 4,
		feature: 'ash'
	},
	{
		id: 5,
		feature: 'pine'
	}
];

describe('DbResource', () => {

	// Reinitialize before each function
	beforeEach(() => {
		colors = [
			{
				id: 1,
				feature: 'yellow'
			},
			{
				id: 2,
				feature: 'blue'
			},
			{
				id: 3,
				feature: 'green'
			},
			{
				id: 4,
				feature: 'red'
			},
			{
				id: 5,
				feature: 'orange'
			}
		];
	})

	it('Handles read()', () => {
		const resource = new DbResource(colors);
		const response = resource.read();
		expect(response).to.deep.equal(colors);
	});

	it('Handles create()', () => {
		const resource = new DbResource(colors);
		const response = resource.create({feature: 'purple'});
		const response2 = resource.read();
		expect(response2[5].feature).to.equal('purple');
	});

	it('Handles update()', () => {
		const resource = new DbResource(colors);
		const response = resource.update({id: 2, feature: 'purple'});
		const response2 = resource.read();
		expect(response2[1].feature).to.equal('purple');
	});

	it('update() returns -1 if id doesn\'t exist', () => {
		const resource = new DbResource(colors);
		const response = resource.update({id: 8, feature: 'purple'});
		expect(response).to.equal(-1);
	});

	it('Handles destroy(), returns true upon success', () => {
		const resource = new DbResource(colors);
		const response = resource.destroy(1);
		const response2 = resource.read();
		expect(response).to.equal(true);
		expect(response2[0].feature).to.equal('blue');
	});

	it('destroy() returns false if id doesn\'t exist', () => {
		const resource = new DbResource(colors);
		const response = resource.destroy(8);
		expect(response).to.equal(false);
	});
});

describe('DbManager', () => {
	// Reinitialize before each function
	beforeEach(() => {
		colors = [
			{
				id: 1,
				feature: 'yellow'
			},
			{
				id: 2,
				feature: 'blue'
			},
			{
				id: 3,
				feature: 'green'
			},
			{
				id: 4,
				feature: 'red'
			},
			{
				id: 5,
				feature: 'orange'
			}
		];
		// Initialize data array
		trees = [
			{
				id: 1,
				feature: 'oak'
			},
			{
				id: 2,
				feature: 'maple'
			},
			{
				id: 3,
				feature: 'alder'
			},
			{
				id: 4,
				feature: 'ash'
			},
			{
				id: 5,
				feature: 'pine'
			}
		];
	});

	it('Handles add_endpoint(method, url, stores, endpoint)', () => {
		const manager = new DbManager();

		manager.add_resource('colors', colors);

		manager.add_endpoint('GET', '/colors/:foo', ['colors'], function(stores, pararms, data){
			const items = stores[0].read();
			return [200, items, {}];
		});

		const response = manager.mock_request('GET', '/colors/1', undefined, undefined, undefined);

		expect(response).to.deep.equal([200, colors, {}]);
	});

	it('add_endpoint(method, url, stores, endpoint) throws error with nonexisting url', () => {
		const manager = new DbManager();

		const response = manager.mock_request('GET', '/colors/1', undefined, undefined, undefined);

		expect(response[0]).to.equal(404);
		expect(response[1]).to.equal('GET /colors/1 not found');
	});

	it('add_endpoint(method, url, stores, endpoint) accepts multiple stores', () => {
		const manager = new DbManager();

		manager.add_resource('colors', colors);

		manager.add_resource('trees', trees);

		manager.add_endpoint('GET', '/colors/:foo', ['trees', 'colors'], function(stores, pararms, data){
			const trees = stores[0].read();
			const colors = stores[1].read();
			expect(trees).to.deep.equal(trees);
			expect(colors).to.deep.equal(colors);
			return [200, colors, {}];
		});

		const response = manager.mock_request('GET', '/colors/1', undefined, undefined, undefined);

		expect(response).to.deep.equal([200, colors, {}]);
	});


});