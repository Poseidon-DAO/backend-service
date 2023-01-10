import { fetchLogs } from "./fetchLogs";

export function startScheduledTasks() {
  fetchLogs.start();
}

export function stopScheduledTasks() {
  fetchLogs.stop();
}
