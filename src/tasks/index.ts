import getTransfersLogs from "./transfer-burn-logs";

export function startScheduledTasks() {
  getTransfersLogs.start();
}

export function stopScheduledTasks() {
  getTransfersLogs.stop();
}
