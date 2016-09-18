import * as ng from 'angular';
import { DbService } from './interfaces.ts';
import * as path2regexp from 'path-to-regexp';
import * as lodash from 'lodash';
import {DbManager, DbResource, Store, DbEndpoint, DbEndpointGen} from './db_resource.ts';

/*AngularJS service for setting up a mock backend*/
export class DbServiceClass {

	/*
		Create DbService Class.
		@param {DbManager} manager - Database manager object from provider
		@param {string} apiUrl - API root url from provider
	*/
	constructor(private manager : DbManager, private apiUrl : string){}

	/*
		Setup database.
		@param {ng.ItthpBackendService} $httpBackend - Angular mocks $httpBackend service
	*/
	setup($httpBackend : ng.IHttpBackendService) : void{

		const api_match = path2regexp(this.apiUrl + "*")

		const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'JSONP', 'PATCH'];

		methods.forEach(method => {$httpBackend['when' + method](api_match).respond(this.manager.mock_request.bind(this.manager))});

		methods.forEach(method => {$httpBackend['when' + method](/.*/).passThrough()});
	}
}

/*AngularJS provider for preparing a mock backend.*/
class DbServiceProvider implements ng.IServiceProvider {

	private manager : DbManager;
	private delay_set : Boolean;
	public apiUrl : string;
	public templates : any;

	/*
		Create DbServiceProvider class
	*/
	constructor(){
		this.manager = new DbManager();
		this.delay_set = false;
		this.apiUrl = '/api/';

		const templates = {
			getAll: function(stores : Array<DbResource>, params : any, data : any){
				const store : DbResource  = stores[0];

        const read_data = store.read();

        return [200, read_data, {}];
			},
			getAllBy: function(feature: string, stores : Array<DbResource>, params : any, data : any){
				if (!params.hasOwnProperty(feature)){
            return [400, feature + ' parameter missing', {}]
        }

				const store : DbResource  = stores[0];

        const read_data = store.read();

        const filtered_read_data = read_data.filter(item => item[feature] == params[feature]);

        return [200, filtered_read_data, {}];
			},
			getOneBy: function(feature: string, stores : Array<DbResource>, params : any, data : any){
				if (!params.hasOwnProperty(feature)){
            return [400, feature + ' parameter missing', {}]
        }

				const store : DbResource  = stores[0];

        const read_data = store.read();

        const filtered_read_data = read_data.filter(item => item[feature] == params[feature]);

        if (!filtered_read_data.length){
        	return [404, 'Item not found', {}];
        }

        return [200, filtered_read_data[0], {}];
			},
			create: function(stores : Array<DbResource>, params : any, data : any){
	      const store : DbResource  = stores[0];

	      const created_item = store.create(data);

	      return [201, created_item, {}];
		  },
		  update: function(stores : Array<DbResource>, params : any, data : any){
	      if (!params.hasOwnProperty('id')){
	        return [400, 'ID parameter missing', {}]
	      }

	      const store : DbResource = stores[0];

	      const updated_item = store.update(data);

	      if(updated_item == -1){return [404, 'Item not found', {}]}

	      return [204, '', {}];
		  },
		  delete: function(stores : Array<DbResource>, params : any, data : any){
		  	if (!params.hasOwnProperty('id')){
          return [400, 'ID parameter missing', {}]
        }

        const store : DbResource = stores[0];

        const is_deleted = store.destroy(Number(params.id));

        if(!is_deleted){ return [404, 'Item not found', {}]}

        return [204, '', {}];
		  }
		};

		const curry_templates = {};

		Object.keys(templates).forEach(key => {
			curry_templates[key] = lodash.curry(templates[key]);
		})

		this.templates = curry_templates;
	}

	/*
		Set a universal API delay.
		@param {number} delay - The time duration (ms) of the delay applied to all HTTP requests
	*/
	public setDelay(delay : number, $provide : ng.auto.IProvideService) : void{
		//credit to https://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/
		if (this.delay_set){
			console.log('WARNING: MOCK BACKEND DELAY ALREADY SET')
			return;
		}

		this.delay_set = true;

		// automatic delay on $httpBackend
		$provide.decorator('$httpBackend', backendDelay);

		backendDelay.$inject = ['$delegate'];

		function backendDelay($delegate : ng.IHttpBackendService) : Function
		{
	    var proxy = function(method : string, url : string, data : string, callback : Function, headers : any) {
	      var interceptor = function() {
	        var _this = this,
	          _arguments = arguments;

	        setTimeout(function() {
	          callback.apply(_this, _arguments);
	        }, delay);

	      };
	      
	      return $delegate.call(this, method, url, data, interceptor, headers);
	    };

	    for(var key in $delegate) {
	      proxy[key] = $delegate[key];
	    }

	    return proxy;
		}
	}

	/*
		Add a mock endpoint.
		@param {string} method - HTTP Verb used for endpoint
		@param {string} url - URL (can have parameters) to associate with endpoint
		@param {Array.<string>} stores - Names of resources to load into endpoint function
		@param {function(Array, Object, Object):Array} endpoint - Function that returns mock HTTP response data
	*/
	public addEndpoint(method : string, url: string, stores: Array<string>, endpoint: DbEndpointGen){
		this.manager.add_endpoint(method, url, stores, endpoint);
	}

	/*
		Add a mock resource.
		@param {string} name - Resource name
		@param {Array.<Object>} resources - Resource data
	*/
	public addResources(name: string, resources : Array<any>) : void{
		this.manager.add_resource(name, resources);
	}

	// Fetch angular service service
	public $get() : DbServiceClass {
		let service = new DbServiceClass(this.manager, this.apiUrl);
		return service;
	}
}

DbServiceProvider.$inject = [];

export default DbServiceProvider;