import * as lodash from 'lodash';
import * as path2regexp from 'path-to-regexp';

/*Attaches simples CRUD operations to a data collection.*/
export class DbResource {

	/*
		Create DbResource class
		@param {Array.<Object>} store - Data collection being used
	*/
	constructor(public store: Array<any>){}

	/*
		Get all data in collection
		@return {Array.<Object>} The data
	*/
	read() : Array<any>{
		return lodash.cloneDeep(this.store);
	}

	/*
		Add a data object to the collection.
		@param {Object} data - The object being created.
		@return {Object} The object created, with its newly added ID
	*/
	create(data: any) : any{
		data.id = this.store.slice(-1)[0].id + 1;
		this.store.push(lodash.cloneDeep(data));
		return data;
	}

	/*
		Update a data object in the collection.
		@param {Object} data - The object being updated.
		@return {(number|Object)} The updated object or -1 if
		there is no corresponding object in the store.
	*/
	update(data: any) : any{
		if (!data.hasOwnProperty('id')){return -1}
		const index = lodash.findIndex(this.store, {id: data.id});
		if (index == -1){return -1}
		lodash.merge(this.store[index], data);
		return lodash.cloneDeep(this.store[index]);
	}

	/*
		Destroy a data object in the collection.
		@param {number} id - The id of the object being destroyed.
		@return {boolean} A boolean value indicating if the object
		has been dstroyed or not.
	*/
	destroy(id: number) : boolean{
		const index = lodash.findIndex(this.store, {id: id});
		if (index == -1){return false}
		this.store.splice(index, 1);
		return true;
	}
}

export interface Store{
	name: string;
	resource: DbResource;
}

export interface DbEndpointGen{
	(stores: Array<DbResource>, params: any, data: any) : Array<any>;
}

export interface DbEndpoint{
	url: any;
	method: string;
	stores: Array<string>;
	endpoint: DbEndpointGen;
}

/*Container for a variety of HTTP response mocking functionality*/
export class DbManager {
	public endpoints : Array<DbEndpoint>;
	public stores: Array<Store>;

	/*
		Create DbManager class.
	*/
	constructor(){
		this.endpoints = [];
		this.stores = [];
	}

	/*
		Used as a global endpoint when interfacing with $httpBackend
		@param {string} method - HTTP Verb being used
		@param {string} url - URL being requested
		@param {string} data - request data
		@param {Object} header - request headers
		@param {Object} params - request parameters
	*/
	mock_request(method : string, url : string, data : string, headers : any, params : any){

		// Parse data into JSON if any exists 
		let parsed_data : any = {};
		if(data){
			parsed_data = JSON.parse(data);
		}

		// Find the first endpoint in this.endpoints which matches the method and url
		const route = lodash.find(this.endpoints, endpoint => endpoint.url.exec(url) && endpoint.method == method);

		// Throw error if not method is found
		if (!route){return [404, method + ' ' + url + ' not found']}

		// Extract params from url and merge with any preexisting params
		const keys = route.url.keys.map(key => key.name);
		const param_values = route.url.exec(url).slice(1);
		const new_params = keys.reduce((items, key, i) => {
			items[key] = param_values[i];
			return items}, {});
		params = lodash.merge({}, params, new_params);

		// Resolved stores from route
		const stores = route.stores.map(store => {
			const next_store = lodash.find(this.stores, {name: store});
			if (!next_store){throw 'Error: Store ' + store + ' does not exist'}
			return next_store.resource;
		});

		// Compute response and return
		const response = route.endpoint(stores, params, parsed_data);
		return response;
	}

	/*
		Add a store
		@param {string} name - Resource name
		@param {data} data - Resource data
	*/
	add_resource(name: string, data: Array<any>){

		// Add to list of stores; initialize resource class
		this.stores.push({
			name: name, 
			resource: new DbResource(data)
		});
	}

	/*
		Add an endpoint.
		@param {string} method - Endpoint method
		@param {string} url - Endopint url
		@param {Array.<string>} stores - Stores used by endpoint
		@param {function} endopint - Function for computing the HTTP response
	*/
	add_endpoint(method : string, url: string, stores: Array<string>, endpoint: DbEndpointGen){

		// Add to list of endpoints; compile path
		this.endpoints.push({
			url: path2regexp(url),
			stores: stores,
			method: method,
			endpoint: endpoint
		});
	}
}