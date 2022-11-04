import Frontend from "../.erpc/generated/Frontend";
import Backend from "../.erpc/generated/Backend";

// target to send requests to
const backend = new Backend({
  address: "http://localhost",
  port: 1234,
});

console.log(await backend.api.ping("PING"));

// server to respond to incoming requests
const server = new Frontend({});
server.api.ping = async (msg) => {
  console.log("incoming ping request: " + msg);
  return "PONG";
};
server.start();
