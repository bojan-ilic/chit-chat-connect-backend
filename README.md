ChitChatConnect Backend
=======================

Welcome to the backend repository of ChitChatConnect, a social network application built using the MERN stack.

Description
-----------

This repository contains the backend logic for ChitChatConnect. It includes various routes, controllers, middleware,
models, and utility files to support user management, posts, comments, likes, ads, messages, and more.

File Structure
--------------

- `/backend`: Main backend directory
    - `/routes`: API routes for different features
        - `index.ts`
        - `users.ts`
        - `auth.ts`
        - `posts.ts`
        - `comments.ts`
        - `likes.ts`
        - `ads.ts`
        - `messages.ts`
    - `/middleware`: Middleware functions
        - `verifyToken.ts`
    - `/utils`: Utility functions
        - `jwt.ts`
    - `/controllers`: Logic for handling various endpoints
        - `userController`
        - `authController`
        - `postController`
        - `commentController`
        - `likeController`
        - `tagController`
        - `adController`
        - `messageController`
    - `/models`: MongoDB data models
        - `userModel.ts`
        - `postModel.ts`
        - `commentModel.ts`
        - `likeModel.ts`
        - `adModel.ts`
        - `messageModel.ts`
        - `tagModel.ts`
    - `/rest_api`: HTTP requests for API endpoints
        - `auth.http`
        - `user.http`
        - `post.http`
        - `comment.http`
        - `like.http`
        - `ad.http`
        - `message.http`
        - `tag.http`
    - `/stages`: Additional logic files
        - `joins.ts`
    - `/config`: Configuration files
        - `config.ts`
        - `constants.ts`

Installation
------------

To get started, follow these steps:

1. **Clone the Repository:**

- `git clone git@github.com:bojan-ilic/chit-chat-connect-backend.git`


2. **Install Dependencies:**

- `cd chit-chat-connect-backend`
- `npm install`


3. **Set Environment Variables:** Create a `.env` file in the root directory and add the necessary environment
   variables. You might reference `dotenv` documentation for details.

Available Scripts
-----------------

**Start the Server:**

- `npm start`

**Testing:**

- `npm test`

API Routes
------

- **Auth:** `/auth`
- **Users:** `/users`
- **Posts:** `/posts`
- **Comments:** `/comments`
- **Likes:** `/likes`
- **Ads:** `/ads`
- **Messages:** `/messages`
- **Tags:** `/tags`

Additional Details
------------------

### Libraries Used

- **bcrypt**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **express**: Web framework for Node.js
- **jsonwebtoken**: JSON Web Token implementation
- **moment**: Date and time manipulation
- **mongoose**: MongoDB object modeling
- **stripe**: Payment processing

Contributions
-------------

Contributions are welcome! If you find any issues or want to suggest improvements, feel free to create an issue or
submit a pull request.

License
-------

This project is licensed under the ISC License. 