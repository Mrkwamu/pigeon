import type { ConnectionOptions } from "bullmq";

const redisConnection: ConnectionOptions = {
  host: "127.0.0.1",
  port: 6379,
};

export default redisConnection;
