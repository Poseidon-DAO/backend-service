import { CronJob } from "cron";

import { eventLogsFetcher } from "./eventLogsFetcher";

// runs every 10 mins
const schedule =
  process.env.NODE_ENV === "dev" ? "*/10 * * * *" : "*/10 * * * *";

export default new CronJob(schedule, eventLogsFetcher);
