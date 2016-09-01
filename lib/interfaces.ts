export interface Store {
	name : string;
	resources: Array<any>;
	extra_handlers?: Array<any>;
}

export interface DbService {
	stores : Array<Store>;
	delay : number;
	setup() : void;
}