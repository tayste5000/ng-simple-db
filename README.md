# ngSimpleDB

A small module for easily building a fake backend into an angular application. Written with typescript.

### How it works:
+ In the config block:
    + Specify the API base URL (defaults to /)
    + Provide route names paired with arrays of data to build each endpoint
    + Set an API delay (default is no delay)
+ In the run block:
    + Trigger the setup function to build the backend
+ What you get:
    + Using the $http service (or anything that uses this), any GET, POST, PUT, or DELETE request which matches one of the routes specified will perform the expected operation (using the array you supplied with route name as a data store)

#### Quick Start
#
**To install:**
#
`npm install -S ng-simpledb`
#
**To see a quick demonstration:**
#
`npm install -S angular angular-mocks`
#
And then place the following in a script tag (after loading angular, angular-mocks, and ng-simpledb):
```
var app = angular.module('myApp',['ngMockE2E', 'ngSimpleDb']);

app.config(function(ngSimpleStoreProvider, $provide){
    
    //sets api root
    ngSimpleStoreProvider.apiUrl = '/api/';
    
    //creates backend resource at /api/foo
    ngSimpleStoreProvider.addResource('foo', [
        {id: 1, name: 'bar'},
        {id: 2, name: 'baz'}
    ]);
    
    //delays all api requests by 700ms
    ngSimpleStoreProvider.setDelay(700, $provide);
});

app.run(function(ngSimpleStore, $httpBackend){
    //build fake backend
    ngSimpleStore.setup($httpBackend);
});

app.controller('testCtrl', function($http){
    
    $http.get('/api/foo').then(function(res){
        //returns [{id: 1, name: 'bar'},{id: 2, name: 'baz'}]
        console.log('GET /api/foo yields:',res.data);
    });
    
    $http.get('/api/foo/1').then(function(res){
        //returns {id: 1, name: 'bar'}
        console.log('GET /api/foo/1 yields:', res.data');
    });
    
    $http.post('/api/foo',{name: 'foo'}).then(function(res){
        //returns {id: 3, name: 'foo'}
        console.log('POST /api/foo {name: 'foo'} yields:', res.data);
    });
    
    $http.put('/api/foo/3',{id: 3, name: 'bob'}).then(function(res){
        //returns {id: 3, name: 'bob'}
        console.log('PUT /api/foo/3 {id: 3, name: 'bob'} yields:', res.data);
    });
    
    $http.delete('/api/foo/3').then(function(res){
        //returns RESOURCE SUCCESFULLY DELETED
        console.log('DELETE /api/foo/3 yields:', res.data)
    });
});
```

## ngSimpleStoreProvider

Configure the fake backend

#### ngSimpleStoreProvider.apiUrl

Sets the base url of the api

#### ngSimpleStoreProvider.addResource(name, resourceList)

Adds a fake backend endpoint to apiUrl/name

#### ngSimpleStoreProvider.setDelay(delay, $provide)

Set api delay (ms)

## ngSimpleStore

Build fake backend at runtime

#### ngSimpleStoreProvider.setup($httpBackend)
For each resource added to the provider, this creates functions that mimic the typical behavior of GET, POST, PUT, and DELETE and attaches them to apiUrl/name with $httpBackend




