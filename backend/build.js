// ======= CONFIGURATION =======

// what the output dir should be named
const OUTPUT_DIR_NAME = "build"
// the entrypoint of the application
const ENTRY_FILE = "./src/main.ts"

// =============================

console.log("⚙️ starting build script");
const fse = require('fs-extra');
const childProcess = require('child_process');

// the dependency is copied to the build dir because it is marked as external and not processed by esbuild
console.log("🗐 copying @easy-rpc/node into ./" + OUTPUT_DIR_NAME);
fse.copySync("./node_modules/@easy-rpc", "./" + OUTPUT_DIR_NAME + "/node_modules/@easy-rpc")
console.log("✅ copying done");

// esbuild processes the source files to an optimized version
console.log("🛠️ running esbuild...");
let child; // child process running the esbuild output
if (process.argv.find(a => a == "-w")) {
    child = childProcess.fork("./" + OUTPUT_DIR_NAME + "/" + ENTRY_FILE.split("/").at(-1).replace(".ts", ".js"))
}

require('esbuild').build({
    entryPoints: [ENTRY_FILE],
    bundle: true,
    outdir: './' + OUTPUT_DIR_NAME,
    format: "cjs",
    platform: 'node',
    minify: true,
    target: "node14",
    // if the -w flag is present, start esbuild in watch mode
    watch: process.argv.find(a => a == "-w") ? {
        onRebuild(error, result) {
            // whenever a change is detected, check if there is an error
            if (error) {
                console.error('watch build failed:', error)
            } else {
                console.log("♻️ Running...");
                // if there is no error, check if a child process is currently set
                if (child) {
                    // if there is a childprocess, kill it
                    child.kill();
                    child.on("close", () => {
                        // when the child is killed, run a new process at the configured location
                        child = childProcess.fork("./" + OUTPUT_DIR_NAME + "/" + ENTRY_FILE.split("/").at(-1).replace(".ts", ".js"))
                        child.on("exit", () => child = undefined)
                        child.on("close", () => child = undefined)
                    })
                } else {
                    child = childProcess.fork("./" + OUTPUT_DIR_NAME + "/" + ENTRY_FILE.split("/").at(-1).replace(".ts", ".js"))
                    child.on("exit", () => child = undefined)
                    child.on("close", () => child = undefined)
                }
            }
        },
    } : undefined,
    external: ["@easy-rpc/node"] // because easy-rpc node uses native compiled .node files which cannot be processed by esbuild, the dependency needs to be external and the dependency copied to the build dir
})
    .then(() => { })
    .catch(() => process.exit(1));
console.log("✅ esbuild done");

console.log("✅ build script done");

if (process.argv.find(a => a == "-w")) {
    console.log("👀 watching for changes...");
}