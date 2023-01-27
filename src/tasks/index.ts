import getTransferEventLogs from "./eventLogs";

export function startScheduledTasks() {
  getTransferEventLogs.start();
}

export function stopScheduledTasks() {
  getTransferEventLogs.stop();
}
