import * as ng from 'angular';
import 'angular-mocks';

import DbProvider from './db_store.ts';

export default ng.module('ngSimpleDb',[
	'ngMockE2E'
])

.provider('ngSimpleStore', DbProvider).name;