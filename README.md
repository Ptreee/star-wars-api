# starWars-API

Data for this API comes from the public API (https://swapi.dev)

## EndPoints:

### GET /films
This endpoint is searching for all movies in DB (Movies Table)
It responds with list (movie array) where each record contains : 
**release date, title and movie id.**

  

    {
	    "movies":[
		    {
			    "movie_id":1,
			    "movieTitle":"A New Hope",
			    "releaseDate":"1977-05-25"
			},
		    {
			    "movie_id":2,
			    "movieTitle":"The Empire Strikes Back",
			    "releaseDate":"1980-05-17"
			},
	          ....................


   


### POST /favorites
In this endpoint user can create his/her own favorite list.
In the body of this request, the user have to provide: 

 - Name for the list.
 - Number of movie IDs 
 
**Request body:**

    {
    	"list_name":"myNewList",
    	"movie_id":"1,2,4"
    }
In response API will generate favorite list with automatic ID and list name provided by user
**Response**

> Please note that only characters and numbers are allowed any special characters will be replaced with '_'


    {
	    "msg":  "Success! New list created",
	    "list_id":  5,
	    "list_name":  "myNewList",
	    "movies":  [
		    {
			    "movie_id":  1,
			    "movieTitle":  "A New Hope",
			    "releaseDate":  "1977-05-25",
			    "Characters":  [
				    {
					    "name":  "Luke Skywalker"
					},
					.............

### GET /favorites
Endpoint returns list of saved favorite lists. 
In the request user can search by name of saved list and change rows per page
**Request body:**

    {
	    "list_name":"",
	    "page":1,
	    "pageSize":10
    }

**Response:**

    {
	    "data":  {
		    "count":  5,
		    "rows":  [
			    {
				    "favList_id":  1,
				    "list_name":  "oldies"
			    },
			    {
				    "favList_id":  2,
				    "list_name":  "newones"
			    },
			    ................

### GET /favorites/:id

Endpoint takes as a parameter the ID of the list in the database and return the details of the favorite list (ID, name, movie list and character list for each movie).

**Response:**

    {
	    "data":  {
		    "favList_id":  1,
		    "list_name":  "full",
		    "Movies":  [
			    {
				    "movieTitle":  "A New Hope",
				    "releaseDate":  "1977-05-25",
				    "Characters":  [
					    {
					    "name":  "Luke Skywalker"
					    },
					    {
					    "name":  "C-3PO"
					    },
					    ........................

### GET /favorites/:id/file

**This endpoint  sends the favorites list details as an Excel file.** 
The first column contain a distinct list of characters appearing in the movies included in a given favorite list, 

The second column contain the movie titles separated by a comma, 

> But only those that are in the given favorite list.

