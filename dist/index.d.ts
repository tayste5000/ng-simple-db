declare var _default: string;
export default _default;

export interface IDbServiceClass {
	setup($httpBackend : angular.IHttpBackendService) : void; 
}

export interface DbEndpointGen {
	(stores: Array<DbResource>, params: any, data: any): Array<any>
}

export interface DbResource{
	read() : Array<any>
	create(data: any) : any;
	update(data: any) : any;
	delete(id: number) : boolean;
}

export interface IDbServiceProvider extends angular.IServiceProvider{
	apiUrl : string;
	setDelay(delay : number, $provide : angular.auto.IProvideService) : void;
	addResources(name : string, resource : Array<any>) : void;
	addEndopint(method : string, url: string, stores: Array<string>, endpoint: DbEndpointGen)
}