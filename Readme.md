# DEV 

## First time
```bash
cp dist.env .env
```

## Usual
```bash
docker-compose up -d
```


# PREPROD
 ```bash
docker-compose -f docker-compose.preprod.yml up -d 
 ```
 
 ## Task
 You can use javascript programming language you feel most comfortable in (replace “Javascript Date” with whatever the native object is in the language to express a Date & Time).
 
 Given the attached CSV data file, write a function findOpenRestaurants(csvFilename, searchDatetime) which takes as parameters a filename and a "Javascript Date" object and returns a list of restaurant names which are open on that date and time. Optimized solutions are nice, but correct solutions are more important!
 Assumptions:
 
 * If a day of the week is not listed, the restaurant is closed on that day
 * All times are local — don’t worry about timezone-awareness
 * The CSV file will be well-formed
 
 If you have any questions, let me know. Submit your solution to your github account. Please use multiple commits so we can see your progress.
 
 Bonus 1: create a server with an endpoint that allows a client to request open restaurants based on a datetime passed to the server. Avoid the use of opinionated frameworks that use generators such as NestJS or Ruby on Rails.
 
 Bonus 2: Design a database that stores restaurant name and restaurant open times in a normalized manner. Also create a query that denormalizes the data in a user friendly format.
 
 
