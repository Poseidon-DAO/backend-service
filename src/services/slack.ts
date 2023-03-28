import fetch from "cross-fetch";
import { ArtistProps, MetaborgUserProps } from "../types/artist";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK!;

const slackApplicationError = async (
  artist: ArtistProps,
  error: string
): Promise<void> => {
  if (!SLACK_WEBHOOK_URL) return;

  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      channel: "#artist-application",
      username: "artist-application-webhook",
      text: "error: " + error + " | " + JSON.stringify(artist.email),
      icon_emoji: ":name_badge:",
    }),
  });
};

const slackApplicationSuccess = async (
  artist: ArtistProps | MetaborgUserProps
): Promise<void> => {
  if (!SLACK_WEBHOOK_URL) return;

  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      channel: "#artist-application",
      username: "artist-application-webhook",
      text: JSON.stringify(artist),
      icon_emoji: ":white_check_mark:",
    }),
  });
};

export { slackApplicationSuccess, slackApplicationError };
