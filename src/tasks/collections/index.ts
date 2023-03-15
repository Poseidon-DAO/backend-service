import { CronJob } from "cron";

import { collectionsFetcher } from "./collectionsFetcher";

// runs every 10 mins
const schedule =
  process.env.NODE_ENV === "dev" ? "*/10 * * * *" : "*/10 * * * *";

export default new CronJob(schedule, collectionsFetcher);
