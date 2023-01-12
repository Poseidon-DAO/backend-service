import { CronJob } from "cron";

import { fetchTransferBurnLogs } from "./fetchTransferBurnLogs";

// runs every 10 mins
export default new CronJob("*/10 * * * * *", fetchTransferBurnLogs);
