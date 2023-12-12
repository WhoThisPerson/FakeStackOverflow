[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project
- Required Dependencies:
- Client: npm install axios
- Server: npm install mongoose express express-session cookie-parser cors bcrpyt nodemon

- 1. Start DB with "mongosh mongodb://127.0.0.1:27017/fake_so"
- 2. Run "node init.js admin@email.com adminPass" in server directory
- 3. Run "nodemon server.js SuperSecretKey" in server directory
- 4. Run "npm start" in client directory to begin application
- 5. Log into admin account

## Team Member 1 Contribution (B1 Qirong Wu)
- Looks
- Implemented the Cookie and Session Handling of User Type
- Implemented Welcome Page Buttons (Register, Login, Guest) and Functionality
- Adjusted Question and Answer Posting
- Added Comments and Users Schema
- Altered requirements for posting
- Attempted to implement delete functionality (Deleting User works)

## Team Member 2 Contribution (B2 David Yeung)
- Limiting 5 questions on the Home / Search Results Page
- Limiting 5 Answers on Question Content Page
- Limiting 3 Comments per Object
- Added Posting Comments Functionality 
- Buttons on Search Results Page only work on the results 
- Hid Post Question and Post Answer buttons when a guest is logged in

