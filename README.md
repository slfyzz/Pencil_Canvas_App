# Canvas

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.7.

Canvas is a web app that allows users to login via their google account, create multiple Canvases and share them with other users.

This project is part of hiring process as an assessement, it was my first try in Angular world in 7 days :)

![alt text](https://i.ibb.co/CvKG672/Ramadan.png)

## Installation
This app will install all required dependencies automatically. Just start the commands below in the root folder where you stored the package.
```bash
npm install
```

## Run Application and start development Server

To run this app in your browser just start everything with the command below in the applications root folder. It will start a simple web server on http://localhost:4200/

```bash
npm start
```

## visualization

![Alt Text](https://media.giphy.com/media/4MK3WiH5huMJhDH5OP/giphy.gif)

## Features 

1. User authentication: Using Firebase to support authentication, so that the first screen a user sees, asks them to login via their google account. If the user is detected to have been already authenticated, then directly take them to Dashboard.
2. Dashboaed: contains 2 sections:
    a. Owned Canvases: Canvases owned by the signed user.
    b. Shared Canvases: Canvases shared with the signed user (read-only).
3. Canvas: show a large canvas on the page using http://fabricjs.com/ and allow the user to draw using their mouse, the user should be able to switch the stroke color and width.
4. Everything the user draws here, is synced into the Firebase database in real-time for that user’s account, automatically, without hitting a submit button.
5. The user is allowed to insert images from their local computers into the canvas.
6. The user is allowed to share the canvas with another user.



## further Improvements 

1. Syncing the Canvas into Firebase database is quite inefficient
    What the application currently does is sending the whole JSON of Fabric Canvas with any modifications by the user, which keep sending the unchanged data many times unnecessarily. 
    attempts:
       Sending only the changed part of the Fabric Canvas Object. But due to lack of resources, API of fabric and time, I couldn't find a way to integrate the list of objects          into the Canvas Object.
2. More friendly User Interface.
  
