import Backend from "../.erpc/generated/Backend";

const backend = new Backend({
  allowedCorsOrigins: ["*"],
  port: 1234,
});

backend.api.ping = async (msg) => {
  console.log("incoming ping request: " + msg);
  return "PONG";
};

backend.onConnection(async (target) => {
  console.log("Frontend connected!");
  console.log(await target.api.ping("PING"));
});

(async () => {
  await backend.run();
})();
