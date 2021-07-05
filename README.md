# Funnyfy

## Description

<p>It is a website created from boredom and routine, to be able to disconnect with so much stress for at least a few minutes a day.

## MVP


### ROUTES:

- GET / 
  - renders Landing page 

- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form
  
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
    
- GET /auth/sigin
- redirects to / if user logged in

- POST /auth/sigin
  - redirects to / if user logged in
  - body:
    - email
    - password

- POST /auth/logout
  - Session Destroy
 
- GET /main
  - renders the main.hbs
  - all the jokes and categories
  - profile icon to get into the profile
  
- GET /profile/:id
  - renders the Profile detail page
  - includes the list of favourite jokes
  - personal user data
  - button for edit the profile and user data
  
- POST /profile/:id/edit
  - renders to edit profile
  - redirect then to the profile with the save changes
  - delete favourite jokes
  
-GET /main/general
  - renders general.hbs
  - carrousel of jokes with the add to fav button  
  
-GET /main/programming
  - renders programming.hbs
  - carrousel of jokes with the add to fav button


-GET /main/knock-knock
  - renders knock-knock.hbs
  - carrousel of jokes with the add to fav button


## Models

User model
 
```
 username: {
    type: String,
    require: true                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
  },
  favJokes: [{type: Schema.Types.ObjectId, ref: 'Joke'}]
```

Joke model

```
id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  setup: {
    type: String,
    require: true,
  },
  punchline: {
    type: String,
    require: true,
    
``` 


# Backlog

User profile:
- share jokes on social networks

Homepage
- Add image and gif
- Search joke



## Links

### Workflow & Wireframe

https://whimsical.com/wireframe-proj2-4VMv3yMwTojLnN8vExhoKU

### Trello

https://trello.com/b/7R0sJtUj/project-2

### Git

https://github.com/ritamak/funnyfy


### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
