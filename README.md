# ngSimpleDB

A small module for easily building a fake backend into an angular application. Written with typescript.

**To install:**
#
`npm install ng-simpledb`
#
**Dependencies:**
+ AngularJS
+ ngMock

### How it works:
+ In the config block:
    + Specify the API base URL (defaults to /api/)
    + Set an API delay (default is no delay)
    + Supply mock data
    + Build mock endpoints using the mock data
+ In the run block:
    + Trigger the setup function to build the backend
+ What you get:
    + Using the $http service (or anything that uses this), any HTTP request which matches one of the routes specified will perform the corresponding operation (using the array you supplied with route name as a data store)

# API

## Resource

Data wrapper for your object that adds simple CRUD methods to it.
Is accessed inside of the endpoint functions.

### Resource.read()

Fetch all data from a resource

### Resource.create(data)

Create a new resource (adds 'id' parameter)

### Resource.update(data)

Replace entry with a matching 'id' parameter.

### Resource.destroy(id)

Replace entry with a matching 'id' parameter.

## ngSimpleStoreProvider

Configure the fake backend

### ngSimpleStoreProvider.apiUrl

Sets the base url of the api

### ngSimpleStoreProvider.setDelay(delay, $provide)

Set a universal API delay.

### ngSimpleStoreProvider.addResource(name, resourceList)

Add a mock resource.

+ resourceList  - An arbitrary collection (array of objects)

### ngSimpleStoreProvider.addEndpoint(method, url, resources, endpoint)

Add a mock endpoint.

+ Resources - Names of resources to load into endpoint function
+ Endpoint - function with the call signature (resources, data, parameters)
returning an array of the form [status, data, headers] which is expected
by ngMocks

### ngSimpleStoreProvider.templates

Contains a set of shortcut endpoint functions.

### ngSimpleStoreProvider.templates.getAll(resources, params, data)

Get all items from the first store loaded.

### ngSimpleStoreProvider.templates.getAllBy(feature, resources, params, data)

Get all items from the first store loaded and filter by a given parameter.

**How it works**: If you pass /api/foo/:id as the url and 'id' as the feature,
this function will look for the value corresponding to 'id' in the url param
(i.e. 1 in /api/foo/1) and then retrieve all objects from your store where
the id property of the object is 1

### ngSimpleStoreProvider.templates.getOneBy(feature, resources, params, data)

Same as getAllBy except only the first element in the resulting array is returned,
and if there are no elements in the resulting array we return 404.

### ngSimpleStoreProvider.templates.create(resources, params, data)

Create new item in the first store loaded.

### ngSimpleStoreProvider.templates.update(resources, params, data)

Update an item in the first store loaded. (return 404 if no item with same ID)

### ngSimpleStoreProvider.templates.delete(resources, params, data)

Delete an item in the first store loaded. (returns 404 if no item with same ID)

## ngSimpleStore

Build fake backend at runtime

### ngSimpleStoreProvider.setup($httpBackend)
For each resource added to the provider, this creates functions that mimic the typical behavior of GET, POST, PUT, and DELETE and attaches them to apiUrl/name with $httpBackend




