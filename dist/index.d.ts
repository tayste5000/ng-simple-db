declare var _default: string;
export default _default;

export interface IDbServiceClass {
	setup($httpBackend : angular.IHttpBackendService) : void; 
}

export interface IDbServiceProvider extends angular.IServiceProvider{
	apiUrl : string;
	setDelay(delay : number, $provide : angular.auto.IProvideService) : void;
	addResources(name : string, resource : Array<any>) : void;
}