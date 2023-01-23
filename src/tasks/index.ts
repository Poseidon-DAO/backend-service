import getTransferEventLogs from "./transferEventLogs";

export function startScheduledTasks() {
  getTransferEventLogs.start();
}

export function stopScheduledTasks() {
  getTransferEventLogs.stop();
}
