Allihoopa SDK example
=====================

This is a simple test harness used to expose some simple features of the SDK in
the parent folder. To get up and running with development, you will need a
recent version of [Node] (5.x or later) installed on your machine.

To get the SDK and example set up for development mode, run the following:

```bash
# Clone the repository
git clone git@github.com:allihoopa/allihoopa.js.git

# Enter the package root
cd allihoopa.js

# Install all dependencies
yarn install

# Add a development link on your machine
# NOTE: This might require sudo on your machine
yarn link

# Go to the example
cd example

# Install the Allihoopa SDK as a link
yarn link allihoopa 

# Install dependencies
yarn install

```

...and the setup is complete. This sets up a symlink in `node_modules/allihoopa`
to the parent folder, so that any changes you make there immediately pushes
through to this project.

## Building and running

In order to run the example, you need an app identifier and api key to be used with
the Allihoopa APIs. These should be specified in the  `ALLIHOOPA_APP_IDENTIFIER` and
`ALLIHOOPA_API_KEY` environment variables, e.g. by adding the following to
your `~/.profile`:

```bash
export ALLIHOOPA_APP_IDENTIFIER=your-app-identifier
export ALLIHOOPA_API_KEY=your-api-key
```

To work on the SDK through this example, you will need three processes running
in parallel:

* TypeScript compiler in the SDK root. Start with `npm run tsc:watch` in the
  parent folder.
* Test runner in the SDK root. Start with `npm run test:watch` in the parent
  folder.
* Webpack dev server in the example root. Start with `npm run dev-server` in
  *this* folder.

This exposes the example web interface on http://localhost:8080.

Additionally, you will need to open a browser on http://localhost:9876 to
actually run the tests.

To simplify with running and watching the logs, there's a `start-tmux.sh` script
in this folder that sets up a [tmux] window running all three processes in panes
next to each other.


[Node]: https://nodejs.org
[tmux]: https://tmux.github.io
