import { CronJob } from "cron";

import { eventLogsFetcher } from "./eventLogsFetcher";

// runs every 60 mins on dev
// runs every 10 mins on prod
const schedule =
  process.env.NODE_ENV === "dev" ? "*/60 * * * *" : "*/10 * * * *";

export default new CronJob(schedule, eventLogsFetcher);
