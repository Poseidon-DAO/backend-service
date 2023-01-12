import getTransactionLogs from "./transaction-logs";

export function startScheduledTasks() {
  getTransactionLogs.start();
}

export function stopScheduledTasks() {
  getTransactionLogs.stop();
}
