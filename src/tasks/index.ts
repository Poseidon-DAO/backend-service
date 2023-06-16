import getTransferEventLogs from "./eventLogs";
import getCollections from "./collections";
import getCollectionSales from "./collection-sales";

export function startScheduledTasks() {
  getTransferEventLogs.start();
  getCollections.start();
  // getCollectionSales.start();
}

export function stopScheduledTasks() {
  getTransferEventLogs.stop();
  getCollections.stop();
  // getCollectionSales.stop();
}
