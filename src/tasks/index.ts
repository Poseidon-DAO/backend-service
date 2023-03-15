import getTransferEventLogs from "./eventLogs";
import getCollections from "./collections";

export function startScheduledTasks() {
  getTransferEventLogs.start();
  getCollections.start();
}

export function stopScheduledTasks() {
  getTransferEventLogs.stop();
  getCollections.stop();
}
