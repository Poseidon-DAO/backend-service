import { CronJob } from "cron";

import { transferEventLogsFetcher } from "./transferEventLogsFetcher";

// runs every 10 mins
export default new CronJob("*/10 * * * *", transferEventLogsFetcher);
