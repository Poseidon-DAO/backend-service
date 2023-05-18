import fetch from "cross-fetch";
import { POSTMARK_URL } from "@constants/mail";
import { ArtistProps, MetaborgUserProps } from "../types/artist";

const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  body: string
): Promise<void> => {
  if (!from || !to) return;

  await fetch(POSTMARK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "X-Postmark-Server-Token": process.env.POSTMARK_TOKEN!,
    },
    body: JSON.stringify({
      From: from,
      To: to,
      Subject: subject,
      TextBody: stripHtml(body),
      HtmlBody: body,
      MessageStream: "outbound",
    }),
  });
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, "");
};

const formatArtistApplication = (artist: ArtistProps): string => {
  return `<html>
    <body>
      <h1>New ${
        artist.project && artist.project !== "Other"
          ? artist.project.charAt(0).toUpperCase() +
            artist.project.slice(1) +
            " "
          : ""
      }Artist Application</h1></br>
      <h3>${artist.name} - ${artist.email}</h3></br>
      <h2>Bio</h2>
      <p>${artist.bio}</p>
      <p>${artist.exhibitions}</p></br></br>
      <h2>Info</h2>
      <a>${artist.samples}</a>
      <a>${artist.twitter_url}</a>
      <a>${
        artist.instagram_url ? "<a>" + artist.instagram_url + "</a>" : ""
      }</a>
      <a>${artist.website ? "<a>" + artist.website + "</a>" : ""}</a>
    </body>
  </html>`;
};

const formatMetaborgBurnSubmit = (artist: MetaborgUserProps): string => {
  return `<html>
    <body>
      <h1>Burn Data</h1></br>
      <h3>${artist.name} - ${artist.email}</h3></br>
      <h2>Address</h2>
      <p>${artist.address}</p></br></br>
      <h2>City</h2>
      <p>${artist.city}</p></br></br>
      <h2>Country</h2>
      <p>${artist.country}</p></br></br>
      <h2>Token id</h2>
      <a>${artist.tokenId}</a>
    </body>
  </html>`;
};

export { sendEmail, formatArtistApplication, formatMetaborgBurnSubmit };
