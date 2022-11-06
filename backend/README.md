# Setup
This project is set up to use esbuild for bundling. See the `build.js` script for detailed information on how the setup works. The sourcecode lives in the `src` directory. You can configure the entrypoint in `build.js`, by default the entrypoint is `./src/main.ts`.

## easy-rpc
The role of this project is "Backend". See the `erpc.json` and `../sources/roles.json` for more info. This is a typical setup of an http-server role type.

# Available scripts:

To install the required dependencies
```
npm i
```

For building the project with esbuild
```
npm run build
```

After building, you can start the server with
```
npm start
```

For development, use this command to automatically refresh whenever you make changes to your code
```
npm run dev
```