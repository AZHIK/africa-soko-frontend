# africa-soko-frontend

A simple web application that serves a front-end with vanilla HTML, CSS, and JavaScript.

## Installation

To run this project locally, you need to have [Node.js](https.nodejs.org/) installed.

1.  Clone the repository:
    ```bash
    git clone https://github.com/AZHIK/africa-soko-frontend
    ```
2.  Navigate to the project directory:
    ```bash
    cd africa-soko-frontend
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Running in Development

To run the project in a development environment, execute the following command:

```bash
npm start
```

This will start a local server at `http://localhost:3000`.

## Deployment on Render

This project is configured to be deployed on Render. You can deploy it by following these steps:

1.  Create a new "Web Service" on Render and connect it to your GitHub repository.
2.  Render will automatically detect the `render.yaml` file and configure the deployment settings.
3.  The `buildCommand` is set to `npm install` and the `startCommand` is set to `npm start`.
4.  The service will be deployed and accessible at the URL provided by Render.

## Environment Variables

The following environment variables are used in this project:

-   `PORT`: The port on which the server will run. Defaults to `3000`.

## Dependencies

This project has no external dependencies listed in the `package.json` file.

## Project Structure

```
.
├── .gitignore
├── index.html
├── manifest.json
├── package-lock.json
├── package.json
├── render.yaml
├── server.js
├── sw.js
├── .well-known
│   └── assetlinks.json
└── assets
    ├── audio
    ├── favicon
    ├── fonts
    ├── images
    ├── js
    ├── screenshots
    ├── styles
    ├── templates
    └── videos
```
