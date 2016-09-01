import * as ng from 'angular';
import { DbService, Store } from './interfaces.ts';
import * as path2regexp from 'path-to-regexp';
import createBackendResource from './db_methods.ts';

export class DbServiceClass {
	constructor(private stores : Array<Store>, private apiUrl : string){}

	setup($httpBackend : ng.IHttpBackendService) : void{
		this.stores.forEach(addRoutes.bind(this));

		$httpBackend.whenGET(/.*/).passThrough();
		
		$httpBackend.whenPOST(/.*/).passThrough();
		
		$httpBackend.whenPUT(/.*/).passThrough();
		
		$httpBackend.whenDELETE(/.*/).passThrough();

		function addRoutes(store : Store) : void {
			let resources : Array<any> = store.resources;

			let path_regex : RegExp = path2regexp(`${this.apiUrl}${store.name}/:id`);

			let resource : Function = createBackendResource(store.resources);

			if(store.extra_handlers){
				store.extra_handlers.forEach(extra_handler => {
					let custom_path_regex : RegExp;

					if (extra_handler.hasOwnProperty('captureParams')){
						custom_path_regex = path2regexp(`${this.apiUrl}${store.name}/${extra_handler.url}`);
					}

					console.log(extra_handler, custom_path_regex);

					extra_handler.verbs.forEach(verb => {
						if (custom_path_regex){
							$httpBackend.when(verb, custom_path_regex, undefined, undefined, extra_handler.captureParams).respond(extra_handler.handleFunc);
						} else {
							$httpBackend.when(verb, `${this.apiUrl}${store.name}/${extra_handler.url}`).respond(extra_handler.handleFunc);
						}
					})
				})
			}

			$httpBackend.whenGET(path_regex, undefined, ['id']).respond(resource);

			$httpBackend.whenPUT(path_regex, undefined, undefined, ['id']).respond(resource);

			$httpBackend.whenDELETE(path_regex, undefined, ['id']).respond(resource);

			$httpBackend.whenGET(`${this.apiUrl}${store.name}`).respond(resource);

			$httpBackend.whenPOST(`${this.apiUrl}${store.name}`).respond(resource);
		}
	}
}

class DbServiceProvider implements ng.IServiceProvider {

	//resource name : resources mapping
	private stores : Array<Store>;
	private delay_set : Boolean;
	public apiUrl : string;

	constructor(){
		this.stores = [];
		this.delay_set = false;
		this.apiUrl = '/';
	}

	//credit to https://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/
	public setDelay(delay : number, $provide : ng.auto.IProvideService) : void{

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

	public addResources(name: string, resources : Array<any>, extra_handlers: Array<any>) : void{
		if(extra_handlers){
			this.stores.push({name: name, resources: resources, extra_handlers: extra_handlers})
		}

		this.stores.push({name: name, resources: resources});
	}

	public $get() : DbServiceClass {
		let service = new DbServiceClass(this.stores, this.apiUrl);
		return service;
	}
}

DbServiceProvider.$inject = [];

export default DbServiceProvider;