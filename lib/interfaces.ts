export interface Store {
	name : string;
	resources: Array<any>;
}

export interface DbService {
	stores : Array<Store>;
	delay : number;
	setup() : void;
}