import { type Vote } from "@prisma/client";
import { format } from "date-fns";

export function groupVotesByTimestamp(votes: Vote[]) {
  let groupedVotes: Record<string, Vote[]> = {};

  for (let i = 0; i < votes.length; i++) {
    let currentVote = votes[i];
    let timestamp = format(currentVote.updatedAt, "MM/dd/yyyy");

    if (!groupedVotes[timestamp]) {
      groupedVotes[timestamp] = [currentVote];
    } else {
      groupedVotes[timestamp] = [...groupedVotes[timestamp], currentVote];
    }
  }

  return groupedVotes;
}
