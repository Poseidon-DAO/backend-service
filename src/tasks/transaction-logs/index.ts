import { CronJob } from "cron";

import { fetchLogs } from "./fetchLogs";

// runs every 10 mins
export default new CronJob("*/10 * * * *", fetchLogs);
