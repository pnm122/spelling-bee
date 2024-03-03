### Sessions

Pros:
* Single source of truth from server
* Simple

Cons:
* Write to database for storing session info
* Subsequent write on every successful request made to extend session
* Read from database on every request
* Extra reads and writes can cost money + time
