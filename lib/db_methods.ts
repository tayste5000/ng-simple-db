import * as lodash from 'lodash';

function backendResource(store : Array<any>, method : string, url : string, data : string, headers : any, params : any) : Array<any>{

	switch (method) {
		case 'GET':
			//if no 'id' parameter passed, do getAll	
			if (!params.hasOwnProperty('id')){
				return [200, lodash.cloneDeep(store), {}];
			}

			let get_item : any = lodash.find(store, {id: params.id});

			if (!get_item){
				return [404, 'RESOURCE NOT FOUND', {}];
			}

			return [200, lodash.cloneDeep(get_item), {}];

		case 'POST':

			let post_item : any = JSON.parse(data);

			post_item.id = store.slice(-1)[0].id + 1;

			store.push(post_item);

			return [201, lodash.cloneDeep(post_item), {}];

		case 'PUT':

			//must have 'id' param
			if (!params.hasOwnProperty('id')){
				return [400, 'RESOURCE ID MISSING', {}];
			}

			let put_item : Object = JSON.parse(data);

			let put_index : number = lodash.findIndex(store, {id : params.id});

			if (put_index == -1){
				return [404, 'RESOURCE NOT FOUND', {}];
			}

			store[put_index] = lodash.cloneDeep(put_item);

			return [200, lodash.cloneDeep(put_item), {}];

		case 'DELETE':

			//must have 'id' param
			if (!params.hasOwnProperty('id')){
				return [400, 'RESOURCE ID MISSING', {}];
			}

			let index : number = lodash.findIndex(store, {id : Number(params.id)});

			if (index == -1){
				return [404, 'RESOURCE NOT FOUND', {}];
			}

			store.splice(index, 1);

			return [204, 'RESOURCE SUCCESFULLY DELETED', {}];
		
		default:

			return [400, 'METHOD NOT FOUND', {}];
	}

}

function createBackendResource(store: Array<Object>){
	return lodash.curry(backendResource)(store);
}

export default createBackendResource;