Instructions for using Nas server:

Every item of the DB contains two properties: number = the car number, slot: a string which indicates where the car is parked.
Variable called PARKINGLOTSIZE located at the .env file is used to determine the parking lot size.

# in order to retrieve an item info from the DB, type either the car number or the slot of the item you are looking for as a GET request after the slash. The output will show both the car number and slot string of the item, if there was no item found, the output will be 'no car or slot found'.

For Example: GET http://localhost:8080/carNumber, GET http://localhost:8080/slot

# in order to unpark a car from the parking lot, type the slot string of which the car is parked at after the slash and send it as a DELETE request. the output will show the parking lot after the car was unparked, if the slot was not found, the output will be 'no slot number found'.

For Example: DELETE http://localhost:8080/slot

# in order to park a car, make a Post request and in the body of the request under carNum, type the car number of the car you would like to park. if the parking lot is full, the output will be 'parking lot is full', else the ouput will show the slot number the car is parked at.

For Example: POST http://localhost:8080/ req.body = {carNum: 2228912748}

Rate-limit logic:

The rate-limit algorithm I chose was called token bucket. The algorithm works by only giving permission for making a request if the user has tokens, if he doesnt, the user will get a message 'access denied'. The user gets a refill to 10 tokens every 10 seconds. For every request the user makes that didnt get denied, a token gets removed.
