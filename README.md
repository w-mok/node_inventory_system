# Treez CRUD REST API Assignment

<b>Prerequisites:</b>
- Docker
- Make

How to run the app: (All the necessary commands can be found inside the Makefile)

In your terminal, run:
  - <b>make prod</b> (This spins up the docker containers for Postgresql, the api app, the migrations and seeds files needed for the database)
  - <b>make test</b> (This spins up the test environment)
  - <b>make clean</b> (stops all the containers and removes the docker volumes)
  
There are a handful of improvements that can be made to this api. For example, dealing with the race conditions of updating the database. There is an example of what I did in the `queries/orders.js` file where I used transactions to handle this. Also, how to deal with more than one order being requested at the same time and how to handle them with the inventories in the database.


<h1>Endpoints</h1>
List of API calls to the app to perform certain actions

- Postman
- Insomnia
- cURL

<b>Inventories:</b>
GET: Read all inventory items:
- http://localhost:1337/api/v1/inventories/ <br>

GET: Read all inventory items:
- http://localhost:1337/api/v1/inventories/ <br>

GET: Read a single inventory items:
- http://localhost:1337/api/v1/inventories/1 <br>

POST: Create an inventory item:
- http://localhost:1337/api/v1/inventories/ <br>
Example for the request body: 
```	
{
  "title": "iPad Pro",
  "description": "10 inch Retina Display",
  "quantity_available": 10,
  "price": 499.99
}
```

PUT: Update the inventory:
- http://localhost:1337/api/v1/inventories/ <br>
Example for the request body:
```
{
  "price": 599.99
}
```  

<b>Orders:</b>
GET: Read all orders records:
- http://localhost:1337/api/v1/orders/

GET: Read a single orders record
- http://localhost:1337/api/v1/orders/1

POST: Create an order (this will also subtract from the inventory accordingly)
- http://localhost:1337/api/v1/orders/ <br>
Example for the request body:
```
{
  "user_id": 4,
  "user_email": "jasondoe@gmail.com",
  "inventories_id": 2,
  "quantity_ordered": 1,
  "order_status": "Processing"
}
```
PUT: Update order
- http://localhost:1337/api/v1/orders/ <br>
Example for the request body:
```
{
   "new_quantity": 3
}
```
DELETE: Delete an order (this will also add back the inventory items back into the table accordingly)
- http://localhost:1337/api/v1/orders/1

