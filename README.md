# Getting Started with Recipease

## Intro

Recipease is a recipe storage application that allows you to view, create, and edit your favorite recipes. It removes the need for repeated searches on the Internet for recipes tied to long-winded stories and recommendations. This is the front-end web application repository for this project, built on React and run with Vite. The back-end repository can be found [here](https://github.com/efisher5/recipease-server).

This application is currently running at https://recipease-cooking.netlify.app/

## Available Scripts

To run this project, you will need to have the back-end repository in a sibling directory. Then, run the following:

### `npm install`

Installs all necessary dependencies

### `npm run build:api`

Builds the UI DTO's using the OpenAPI framework. Files are placed in the `openapi` folder.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run dev`

Runs the project on [http://localhost:3001](http://localhost:3001) with Vite.
