import { CronJob } from "cron";

import { transferEventLogsFetcher } from "./transferEventLogsFetcher";

// runs every 10 mins on prod
// runs every 1 min on dev
const schedule =
  process.env.NODE_ENV === "dev" ? "*/60 * * * * *" : "*/10 * * * *";

export default new CronJob(schedule, transferEventLogsFetcher);
