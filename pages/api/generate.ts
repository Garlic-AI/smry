import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import redis from "../../utils/redis";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

declare module 'next' {
  export interface NextApiRequest {
    json: () => Promise<any>;
  }
}

const ratelimit = redis
  ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(2, "1440 m"),
    analytics: true,
  })
  : undefined;

const handler = async (req: NextApiRequest): Promise<Response> => {
  const { url } = (await req.json()) as {
    url?: string;
  };
  if (!url) {
    return new Response(null, {
      status: 400,
      statusText: "No URL in request"
    });
  }

  if (ratelimit) {
    const identifier = requestIp.getClientIp(req);
    const result = await ratelimit.limit(identifier!);

    if (!result.success) {
      console.log("🙏🙏 Too many requests, you get 30 per day");
      return new Response("🙏🙏 Too many requests, you get 30 per day");
    }
  }

  try {
    let siteText: string;
    const response = await fetch(`https://www.w3.org/services/html2txt?url=${encodeURIComponent(url)}&noinlinerefs=on&nonums=on`);
    console.log("html response", response)
    if (response.status === 200) {
      siteText = await response.text();
      console.log(siteText)
      if (siteText.length > 200) {
        // The result is valid
        if (siteText.length > 400) {
          // const [{ encode, decode }] = await Promise.all([
          //   import('gpt-3-encoder')
          //   ]);
          // siteText = Buffer.from(siteText, 'utf-8').toString()
          // siteText = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim() 
          // console.log("trimmed", siteText)
          // let encoded = encode(siteText)
          // encoded = encoded.slice(0,4000)
          // siteText = decode(encoded)
          // console.log("decoded", siteText)
          siteText = siteText.substring(0, 100)

        }
      } else {
        return new Response(null, {
          status: 400,
          statusText: "Invalid response"
        });
      }
    } else {
      return new Response(null, {
        status: response.status,
        statusText: "Bad response"
      });
    }

    const prompt = `You are given a website's entire content without any formatting, including extraneous text like 'home', 'login', and 'contact' etc. Ignore those sections and focus on the main content of the website. What is the website about and what are its intentions? Try to figure out the main content of the website, and explain it using simplified language that a 10-year-old would understand. DO NOT use existing text from the website, but explain it in your own words. Make not to leave out any information that might be pertinent to a reader.

  "${siteText}"

  Detailed summary of no more than 200 words:
  `

    const payload: OpenAIStreamPayload = {
      model: "text-davinci-003",
      prompt,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 400,
      stream: true,
      n: 1,
      suffix: "\"\"\""
    };

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (e: any) {
    console.log({ e });
    return new Response(null, {
      status: 400,
      statusText: "Bad response"
    });
  }
};

export default handler;




// import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing env var from OpenAI");
// }

// export const config = {
//   runtime: "edge",
// };

// const handler = async (req: Request): Promise<Response> => {
//   const { url } = (await req.json()) as {
//     url  ?: string;
//   };

//   let siteText: string;
//   if (url) {
//     // check if the url is in the db
//     const summary = await prisma.summary.findFirst({
//       where: {
//         website: "https://vercel.com"
//       }
//     });
//     // if it is return the summary from the db
//     if (summary) {
//       return new Response(summary.summary);
//     }

//     // else generate a new summary
//     const response = await fetch(`https://www.w3.org/services/html2txt?url=${encodeURIComponent(url)}&noinlinerefs=on&nonums=on`);
//     siteText = await response.text();
//   } else {
//     return new Response("No prompt in the request", { status: 400 });
//   }

//   const prompt = `${siteText}`

//   const payload: OpenAIStreamPayload = {
//     model: "text-davinci-003",
//     prompt,
//     temperature: 0.7,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     max_tokens: 200,
//     stream: true,
//     n: 1,
//   };

//   const stream = await OpenAIStream(payload);

//   // add the summary to the db
//   // await prisma.summary.create({
//   //   data: {
//   //     website: url,
//   //     summary: stream
//   //   }
//   // })

//   return new Response(stream);
// };

// export default handler;