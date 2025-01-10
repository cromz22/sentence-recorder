# Recorder Frontend

Frontend handles recording, replay, and submission of audio.
The code is written with [TypeScript](https://www.typescriptlang.org/) + [React](https://react.dev/), with [Vite](https://vite.dev/) as the build tool and [Bun](https://bun.sh/) as the package manager and runtime engine.

## Installation

- Follow the [Bun docs](https://bun.sh/docs/installation) for installing Bun.

- To install dependencies for this project, run:

    ```
    bun install
    ```

## Development

- Make sure to start the backend server first.

- To start the development server, run:

    ```
    bunx --bun vite
    ```

    The app starts at [http://localhost:5173](http://localhost:5173) by default.

- For linting, run:

    ```
    bun run lint
    ```

- For formatting, run:

    ```
    bun prettier --write .
    ```
