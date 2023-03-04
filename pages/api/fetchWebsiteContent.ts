import { NextApiRequest, NextApiResponse } from 'next';
import { encode, decode } from "gpt-3-encoder";


// {
//     "request": {
//       "pageUrl": "https://www.technologyreview.com/2020/09/04/1008156/knowledge-graph-ai-reads-web-machine-learning-natural-language-processing/",
//       "api": "analyze",
//       "version": 3
//     },
//     "humanLanguage": "en",
//     "objects": [
//       {
//         "date": "Fri, 04 Sep 2020 00:00:00 GMT",
//         "sentiment": 0,
//         "images": [
//           {
//             "naturalHeight": 633,
//             "width": 1126,
//             "diffbotUri": "image|3|-204151288",
//             "url": "https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=2252,1266",
//             "naturalWidth": 1125,
//             "primary": true,
//             "height": 633
//           }
//         ],
//         "author": "Will Douglas Heaven",
//         "estimatedDate": "Fri, 04 Sep 2020 00:00:00 GMT",
//         "publisherRegion": "North America",
//         "icon": "https://www.technologyreview.com/static/media/favicon.1cfcdb44.ico",
//         "diffbotUri": "article|3|973247980",
//         "siteName": "MIT Technology Review",
//         "type": "article",
//         "title": "This know-it-all AI learns by reading the entire web nonstop",
//         "tags": [
//           {
//             "score": 0.8117656111717224,
//             "sentiment": 0,
//             "count": 2,
//             "label": "Will Douglas Heaven",
//             "uri": "https://diffbot.com/entity/Eb9on2iC4N4uIdf29SR3p6Q",
//             "rdfTypes": [
//               "http://dbpedia.org/ontology/Person"
//             ]
//           },
//           {
//             "score": 0.7393974661827087,
//             "sentiment": 0,
//             "count": 1,
//             "label": "Paul Katsen",
//             "uri": "https://diffbot.com/entity/EqUim_ci0ObmrK2gZM3UfNA",
//             "rdfTypes": [
//               "http://dbpedia.org/ontology/Person"
//             ]
//           },
//           {
//             "score": 0.6481729745864868,
//             "sentiment": 0,
//             "count": 4,
//             "label": "Mike Tung",
//             "uri": "https://diffbot.com/entity/ESGMaGV9uP0SuTmfPTtNEoA",
//             "rdfTypes": [
//               "http://dbpedia.org/ontology/Person"
//             ]
//           },
//           {
//             "score": 0.5857880115509033,
//             "sentiment": 0,
//             "count": 10,
//             "label": "artificial intelligence",
//             "uri": "https://diffbot.com/entity/E_lYDrjmAMlKKwXaDf958zg",
//             "rdfTypes": [
//               "http://dbpedia.org/ontology/Skill",
//               "http://dbpedia.org/ontology/Activity"
//             ]
//           }
//         ],
//         "publisherCountry": "United States",
//         "humanLanguage": "en",
//         "authorUrl": "https://www.technologyreview.com/author/will-douglas-heaven/",
//         "pageUrl": "https://www.technologyreview.com/2020/09/04/1008156/knowledge-graph-ai-reads-web-machine-learning-natural-language-processing/",
//         "html": "<figure><img alt=\"knowledge graph illustration\" sizes=\"(max-width: 32rem) 360px,(max-width: 48rem) 728px,(max-width: 64rem) 808px,(max-width: 80rem) 1064px,(max-width: 90rem) 1126px,1080px\" src=\"https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=2252,1266\" srcset=\"https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=720,480 720w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=360,240 360w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=1456,818 1456w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=728,409 728w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=1616,908 1616w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=808,454 808w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=2128,1196 2128w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=1064,598 1064w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=2252,1266 2252w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=1126,633 1126w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=2160,1214 2160w,https://wp.technologyreview.com/wp-content/uploads/2020/09/knowledge-graph2_web.jpg?fit=1080,607 1080w\"></img></figure>\n<p>Back in July, OpenAI&rsquo;s <a href=\"https://www.technologyreview.com/2020/07/20/1005454/openai-machine-learning-language-generator-gpt-3-nlp/\">latest language model, GPT-3</a>, dazzled with its ability to churn out paragraphs that look as if they could have been written by a human. People started showing off how GPT-3 could also autocomplete code or fill in blanks in spreadsheets.</p>\n<p>In one example, Twitter employee Paul Katsen tweeted &ldquo;the spreadsheet function to rule them all,&rdquo; in which<a href=\"https://twitter.com/pavtalk/status/1285410751092416513\"> GPT-3 fills out columns</a> by itself, pulling in data for US states: the population of Michigan is 10.3 million, Alaska became a state in 1906, and so on.</p>\n<p>Except that GPT-3 can be a bit of a bullshitter. The population of Michigan has never been 10.3 million, and Alaska became a state in 1959.</p>\n<p>Language models like GPT-3 are <a href=\"https://www.technologyreview.com/2020/07/31/1005876/natural-language-processing-evaluation-ai-opinion/\">amazing mimics</a>, but they have little sense of what they&rsquo;re actually saying. &ldquo;They&rsquo;re really good at generating stories about unicorns,&rdquo; says Mike Tung, CEO of Stanford startup Diffbot. &ldquo;But they&rsquo;re not trained to be factual.&rdquo;</p>\n<p>This is a problem if we want <a href=\"https://forms.technologyreview.com/in-machines-we-trust/\">AIs to be trustworthy</a>. That&rsquo;s why Diffbot takes a different approach. It is building an AI that reads every page on the entire public web, in multiple languages, and extracts as many facts from those pages as it can.</p>\n<p>Like GPT-3, Diffbot&rsquo;s system learns by vacuuming up vast amounts of human-written text found online. But instead of using that data to train a language model, Diffbot turns what it reads into a series of three-part factoids that relate one thing to another: subject, verb, object.</p>\n<p>Pointed at <a href=\"https://www.technologyreview.com/author/will-douglas-heaven/\">my bio</a>, for example, Diffbot learns that Will Douglas Heaven is a journalist; Will Douglas Heaven works at MIT Technology Review; MIT Technology Review is a media company; and so on. Each of these factoids gets joined up with billions of others in a sprawling, interconnected network of facts. This is known as a knowledge graph.</p>\n<p>Knowledge graphs are not new. They have been around for decades, and were a fundamental concept in early AI research. But constructing and maintaining knowledge graphs has typically been done by hand, which is hard. This also stopped Tim Berners-Lee from realizing what he called the semantic web, which would have included information for machines as well as humans, so that bots could book our flights, do our shopping, or give smarter answers to questions than search engines.</p>\n<p>A few years ago, Google started using knowledge graphs too. Search for &ldquo;Katy Perry&rdquo; and you will get a box next to the main search results telling you that Katy Perry is an American singer-songwriter with music available on YouTube, Spotify, and Deezer. You can see at a glance that she is married to Orlando Bloom, she&rsquo;s 35 and worth $125 million, and so on. Instead of giving you a list of links to pages about Katy Perry, Google gives you a set of facts about her drawn from its knowledge graph.</p>\n<p>But Google only does this for its most popular search terms. Diffbot wants to do it for everything. By fully automating the construction process, Diffbot has been able to build what may be the largest knowledge graph ever.</p>\n<p>Alongside Google and Microsoft, it is one of only three US companies that crawl the entire public web. &ldquo;It definitely makes sense to crawl the web,&rdquo; says Victoria Lin, a research scientist at Salesforce who works on natural-language processing and knowledge representation. &ldquo;A lot of human effort can otherwise go into making a large knowledge base.&rdquo; Heiko Paulheim at the University of Mannheim in Germany agrees: &ldquo;Automation is the only way to build large-scale knowledge graphs.&rdquo;</p>\n<h3>Super surfer</h3>\n<p>To collect its facts, Diffbot&rsquo;s AI reads the web as a human would&mdash;but much faster. Using a super-charged version of the Chrome browser, the AI views the raw pixels of a web page and uses image-recognition algorithms to categorize the page as one of 20 different types, including video, image, article, event, and discussion thread. It then identifies key elements on the page, such as headline, author, product description, or price, and uses NLP to extract facts from any text.</p>\n<p>Every three-part factoid gets added to the knowledge graph. Diffbot extracts facts from pages written in any language, which means that it can answer queries about Katy Perry, say, using facts taken from articles in Chinese or Arabic even if they do not contain the term &ldquo;Katy Perry.&rdquo;</p>\n<p>Browsing the web like a human lets the AI see the same facts that we see. It also means it has had to learn to navigate the web like us. The AI must scroll down, switch between tabs, and click away pop-ups. &ldquo;The AI has to play the web like a video game just to experience the pages,&rdquo; says Tung.</p>\n<p>Diffbot crawls the web nonstop and rebuilds its knowledge graph every four to five days. According to Tung, the AI adds 100 million to 150 million entities each month as new people pop up online, companies are created, and products are launched. It uses more machine-learning algorithms to fuse new facts with old, creating new connections or overwriting out-of-date ones. Diffbot has to add new hardware to its data center as the knowledge graph grows.</p>\n<p>Researchers can access Diffbot&rsquo;s knowledge graph for free. But Diffbot also has around 400 paying customers. The search engine DuckDuckGo uses it to generate its own Google-like boxes. Snapchat uses it to extract highlights from news pages. The popular wedding-planner app Zola uses it to help people make wedding lists, pulling in images and prices. NASDAQ, which provides information about the stock market, uses it for financial research.</p>\n<h3>Fake shoes</h3>\n<p>Adidas and Nike even use it to search the web for counterfeit shoes. A search engine will return a long list of sites that mention Nike trainers. But Diffbot lets these companies look for sites that are actually selling their shoes, rather just talking about them.</p>\n<p>For now, these companies must interact with Diffbot using code. But Tung plans to add a natural-language interface. Ultimately, he wants to build what he calls a &ldquo;universal factoid question answering system&rdquo;: an AI that could answer almost anything you asked it, with sources to back up its response.</p>\n<p>Tung and Lin agree that this kind of AI cannot be built with language models alone. But better yet would be to combine the technologies, using a language model like GPT-3 to craft a human-like front end for a know-it-all bot.</p>\n<p>Still, even an AI that has its facts straight is not necessarily smart. &ldquo;We&rsquo;re not trying to define what intelligence is, or anything like that,&rdquo; says Tung. &ldquo;We&rsquo;re just trying to build something useful.&rdquo;</p>",
//         "categories": [
//           {
//             "score": 0.953,
//             "name": "Artificial Intelligence",
//             "id": "iabv2-597"
//           },
//           {
//             "score": 0.953,
//             "name": "Technology & Computing",
//             "id": "iabv2-596"
//           }
//         ],
//         "text": "Back in July, OpenAI’s latest language model, GPT-3, dazzled with its ability to churn out paragraphs that look as if they could have been written by a human. People started showing off how GPT-3 could also autocomplete code or fill in blanks in spreadsheets.\nIn one example, Twitter employee Paul Katsen tweeted “the spreadsheet function to rule them all,” in which GPT-3 fills out columns by itself, pulling in data for US states: the population of Michigan is 10.3 million, Alaska became a state in 1906, and so on.\nExcept that GPT-3 can be a bit of a bullshitter. The population of Michigan has never been 10.3 million, and Alaska became a state in 1959.\nLanguage models like GPT-3 are amazing mimics, but they have little sense of what they’re actually saying. “They’re really good at generating stories about unicorns,” says Mike Tung, CEO of Stanford startup Diffbot. “But they’re not trained to be factual.”\nThis is a problem if we want AIs to be trustworthy. That’s why Diffbot takes a different approach. It is building an AI that reads every page on the entire public web, in multiple languages, and extracts as many facts from those pages as it can.\nLike GPT-3, Diffbot’s system learns by vacuuming up vast amounts of human-written text found online. But instead of using that data to train a language model, Diffbot turns what it reads into a series of three-part factoids that relate one thing to another: subject, verb, object.\nPointed at my bio, for example, Diffbot learns that Will Douglas Heaven is a journalist; Will Douglas Heaven works at MIT Technology Review; MIT Technology Review is a media company; and so on. Each of these factoids gets joined up with billions of others in a sprawling, interconnected network of facts. This is known as a knowledge graph.\nKnowledge graphs are not new. They have been around for decades, and were a fundamental concept in early AI research. But constructing and maintaining knowledge graphs has typically been done by hand, which is hard. This also stopped Tim Berners-Lee from realizing what he called the semantic web, which would have included information for machines as well as humans, so that bots could book our flights, do our shopping, or give smarter answers to questions than search engines.\nA few years ago, Google started using knowledge graphs too. Search for “Katy Perry” and you will get a box next to the main search results telling you that Katy Perry is an American singer-songwriter with music available on YouTube, Spotify, and Deezer. You can see at a glance that she is married to Orlando Bloom, she’s 35 and worth $125 million, and so on. Instead of giving you a list of links to pages about Katy Perry, Google gives you a set of facts about her drawn from its knowledge graph.\nBut Google only does this for its most popular search terms. Diffbot wants to do it for everything. By fully automating the construction process, Diffbot has been able to build what may be the largest knowledge graph ever.\nAlongside Google and Microsoft, it is one of only three US companies that crawl the entire public web. “It definitely makes sense to crawl the web,” says Victoria Lin, a research scientist at Salesforce who works on natural-language processing and knowledge representation. “A lot of human effort can otherwise go into making a large knowledge base.” Heiko Paulheim at the University of Mannheim in Germany agrees: “Automation is the only way to build large-scale knowledge graphs.”\nSuper surfer\nTo collect its facts, Diffbot’s AI reads the web as a human would—but much faster. Using a super-charged version of the Chrome browser, the AI views the raw pixels of a web page and uses image-recognition algorithms to categorize the page as one of 20 different types, including video, image, article, event, and discussion thread. It then identifies key elements on the page, such as headline, author, product description, or price, and uses NLP to extract facts from any text.\nEvery three-part factoid gets added to the knowledge graph. Diffbot extracts facts from pages written in any language, which means that it can answer queries about Katy Perry, say, using facts taken from articles in Chinese or Arabic even if they do not contain the term “Katy Perry.”\nBrowsing the web like a human lets the AI see the same facts that we see. It also means it has had to learn to navigate the web like us. The AI must scroll down, switch between tabs, and click away pop-ups. “The AI has to play the web like a video game just to experience the pages,” says Tung.\nDiffbot crawls the web nonstop and rebuilds its knowledge graph every four to five days. According to Tung, the AI adds 100 million to 150 million entities each month as new people pop up online, companies are created, and products are launched. It uses more machine-learning algorithms to fuse new facts with old, creating new connections or overwriting out-of-date ones. Diffbot has to add new hardware to its data center as the knowledge graph grows.\nResearchers can access Diffbot’s knowledge graph for free. But Diffbot also has around 400 paying customers. The search engine DuckDuckGo uses it to generate its own Google-like boxes. Snapchat uses it to extract highlights from news pages. The popular wedding-planner app Zola uses it to help people make wedding lists, pulling in images and prices. NASDAQ, which provides information about the stock market, uses it for financial research.\nFake shoes\nAdidas and Nike even use it to search the web for counterfeit shoes. A search engine will return a long list of sites that mention Nike trainers. But Diffbot lets these companies look for sites that are actually selling their shoes, rather just talking about them.\nFor now, these companies must interact with Diffbot using code. But Tung plans to add a natural-language interface. Ultimately, he wants to build what he calls a “universal factoid question answering system”: an AI that could answer almost anything you asked it, with sources to back up its response.\nTung and Lin agree that this kind of AI cannot be built with language models alone. But better yet would be to combine the technologies, using a language model like GPT-3 to craft a human-like front end for a know-it-all bot.\nStill, even an AI that has its facts straight is not necessarily smart. “We’re not trying to define what intelligence is, or anything like that,” says Tung. “We’re just trying to build something useful.”"
//       }
//     ],
//     "type": "article",
//     "title": "This know-it-all AI learns by reading the entire web nonstop | MIT Technology Review"
//   }
const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { url } = (await req.body) as {
        url?: string;
    };

    if (!url) {
        return res.status(400).send("No URL in request");
    }

    const options = {method: 'GET', headers: {accept: 'application/json'}};

    fetch(`https://api.diffbot.com/v3/analyze?url=${encodeURIComponent(url)}
    &token=b320c0f319a67e14aa6c9c84fa01d699`, options)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        return res.send(response.objects[0].text)
    })
    .catch(err => console.error(err));
    // try {
    //     const requestURL = `https://api.diffbot.com/v3/analyze?url=${encodeURIComponent(url)}&token=b320c0f319a67e14aa6c9c84fa01d699`;
    //     const response = await fetch(requestURL, {
    //     headers: {
    //     'accept': 'application/json'
    //     }
    //     });
    //     let siteData = await response.json();
    //     console.log("html response", response)
    //     if (response.status === 200) {
    //     let siteData = await response.json();
    //     console.log(siteData)
    //     return res.send(siteData.objects[0].text);
    //     let siteText = siteData.objects[0].text;
    //     console.log(siteText)


        // const response = await fetch(`https://www.w3.org/services/html2txt?url=${encodeURIComponent(url)}&noinlinerefs=on&nonums=on`);
        // if (response.status === 200) {
        // const siteText = await response.text();

    //     if (siteText.length <= 200) {
    //         return res.send(siteText);
    //     }

    //     return res.send(siteText);
    //     // siteText = Buffer.from(siteText, 'utf-8').toString()
    //     // const trimmed = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim()
    //     // console.log(trimmed)
    //     // let encoded = encode(trimmed);
    //     // encoded = encoded.slice(0, 3500);
    //     // const encodedSiteText = decode(encoded);
    //     // console.log("decoded", encodedSiteText)
    //     // return res.send(encodedSiteText);
    // } else {
    //     return res.status(400).send("Bad Response")
    // }
    // } catch (error) {
    //     return res.status(400).send("Unexpected Error Occurred");
    // }
}

export default handler;


// import { NextApiRequest, NextApiResponse } from 'next';
// import { encode, decode } from "gpt-3-encoder";

// const handler = async (req: Request): Promise<Response> => {
//     console.log(req)
//     const { url } = (await req.json()) as {
//       url?: string;
//     };
//     console.log(url)
//     if (!url) {
//       return new Response(null, {
//         status: 400,
//         statusText: "No URL in request"
//       });
//     }

//     try {

//         const res = await fetch(
//             `https://www.w3.org/services/html2txt?url=${encodeURIComponent(
//                 url
//             )}&noinlinerefs=on&nonums=on`
//         );
//         console.log("html response", res)
//         if (res.status === 200) {
//             let siteText = await res.text();
//             console.log(siteText)
//             if (siteText.length > 200) {
//                 // The result is valid
//                 if (siteText.length > 400) {
//                     siteText = Buffer.from(siteText, 'utf-8').toString()
//                     siteText = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim()
//                     console.log("trimmed", siteText)
//                     let encoded = encode(siteText)
//                     encoded = encoded.slice(0, 4000)
//                     siteText = decode(encoded)
//                 }
//             } else {
//             return new Response(siteText)
//             }
//         }
//         return new Response(null, {
//             status: 400,
//             statusText: "Website content too short"
//         });
//     }
//     catch (error) {
//         return new Response(null, {
//             status: 400,
//             statusText: "Unexpected Error Occured"
//         });
//     }
// }

// export default handler;



// import { NextApiRequest, NextApiResponse } from 'next';
// import { encode, decode } from "gpt-3-encoder";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   return new Promise(async (resolve, reject) => {
//     const { url } = req.body;

//     try {
//       const response = await fetch(
//         `https://www.w3.org/services/html2txt?url=${encodeURIComponent(
//           url
//         )}&noinlinerefs=on&nonums=on`,
//       );
      
//       if (response.status === 200) {
//         let siteText = await response.text();
        
//         if (siteText.length > 200) {
//           // The result is valid
//           if (siteText.length > 400) {
//             siteText = Buffer.from(siteText, 'utf-8').toString()
//             siteText = siteText.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ").trim()
//             let encoded = encode(siteText)
//             encoded = encoded.slice(0, 4000)
//             siteText = decode(encoded)
//           }
//           resolve(siteText);
//         } else {
//           reject(new Error('Site text is too short'));
//         }
//       } else {
//         reject(new Error('Invalid response from server'));
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
