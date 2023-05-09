import { CronJob } from "cron";

import { collectionsFetcher } from "./collectionsFetcher";

// runs every 10 mins on dev
// runs every 30 mins on prod
const schedule =
  process.env.NODE_ENV === "dev" ? "*/10 * * * *" : "*/30 * * * *";

export default new CronJob(schedule, collectionsFetcher);
