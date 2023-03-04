// just like index.tsx, but with a slug param

// Path: [slug].tsx

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";
import BackgroundCircles from "../components/BackgroundCircles";
import { randomSiteData } from "../lib/randomSiteData";
import { RiNumber1 } from "react-icons/ri";
import Link from "next/link";
import Faq from "../components/Faq";
import { FcSearch } from "react-icons/fc";
import Marquee from "react-fast-marquee";
import { useRouter } from "next/router";

const Home: NextPage = () => {
    const router = useRouter();
    const urlState = router.query.slug;
    const [loading, setLoading] = useState(false);
    const [randomizing, setRandomizing] = useState(false);
    const [url, setUrl] = useState("");
    const [generatedSummary, setGeneratedSummary] = useState<String>("");
    const [latestSites, setLatestSites] = useState<Array<any>>([]);
    // console.log("Streamed response: ", generatedSummary);

    // add a ref
    //TODO FINISH REF
    const summaryRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (
            urlState &&
            router.isReady &&
            !url &&
            typeof urlState !== "string" &&
            urlState.every((subslug: string) => typeof subslug === "string")
        ) {
            setUrl(urlState.join("/"));
            generateSummary(
                // use the slug to generate the url
                urlState.join("/")

            );
        }
    }, [router.isReady, urlState]);

    useEffect(() => {
        console.log("loaded");
        fetchLatestSites();
    }, []);

    useEffect(() => {
        if (randomizing) {
            setLoading(false);
            return () => { };
        }
    }, [loading]);

    function fetchLatestSites() {
        setLatestSites([]);
        fetch("/api/latestSites")
            .then((res) => res.json())
            .then((data) => {
                let newLatestSites: String[] = [];
                data.map((url: any) => newLatestSites.push(url.url));
                setLatestSites(newLatestSites);

                console.log(data);
            });
    }

    function handleLatestSiteClick(url: string) {
        setUrl(url);
        generateSummary(url);
    }

    const postSummary = (url: string, summary: string) => {
        fetch("/api/postSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
                summary: summary,
            }),
        }).then(() => fetchLatestSites());
    };

    const generateSummary = async (recentURL: string = url) => {
        setGeneratedSummary("");
        setLoading(true);

        const isValidURL = (str: string) => {
            try {
                new URL(str);
                //make sure that the url is only one word
                if (str.split(" ").length > 1) {
                    return false;
                }

                return true;
            } catch (error) {
                return false;
            }
        };

        let fullUrl = recentURL.trim();
        if (!/^https?:\/\//i.test(fullUrl)) {
            fullUrl = "https://" + fullUrl;
        }
        //remove trailing slash if it exists
        if (fullUrl[fullUrl.length - 1] === "/") {
            fullUrl = fullUrl.slice(0, -1);
        }

        console.log(fullUrl);

        if (!isValidURL(fullUrl)) {
            console.error("Invalid URL provided.");
            toast.error("Invalid URL provided", {
                icon: "❌",
            });
            setLoading(false);
            return;
        }

        const summary = await fetch("/api/getSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: fullUrl,
            }),
        });

        const summaryData = await summary.json();
        console.table(summaryData);

        if (summaryData !== null) {
            setGeneratedSummary(summaryData.summary);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/fetchWebsiteContent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: fullUrl,
                }),
            });

            console.log("fetched and trimmed", response);

            if (!response.ok) {
                const statusText = response.statusText
                    ? response.statusText
                    : "This site isn't valid. Maybe try another?";
                toast.error(statusText, {
                    icon: "❌",
                });
                setLoading(false);
                return;
            }

            const siteContent = await response.text();

            const summaryResponse = await fetch("/api/generateSummaryFromText", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: siteContent,
                }),
            });
            console.log("Edge function returned.");
            console.log("Response is", summaryResponse);

            if (!response.ok) {
                const statusText = summaryResponse.statusText
                    ? summaryResponse.statusText
                    : "This site isn't valid. Maybe try another?";
                toast.error(statusText, {
                    icon: "❌",
                });
                setLoading(false);

                // throw new Error(response.statusText);
            }

            // This data is a ReadableStream
            const data = summaryResponse.body;
            console.log("Data readable stream", data);
            if (!data) {
                setLoading(false);
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                setGeneratedSummary((prev) => {
                    const newGeneratedSummary = prev + chunkValue;
                    console.log("summary is ", newGeneratedSummary);

                    if (done && newGeneratedSummary.length >= 50) {
                        postSummary(fullUrl, newGeneratedSummary);
                    }
                    return newGeneratedSummary;
                });
            }

            setLoading(false);
        } catch (error) {
            const statusText =
                "An unexpected error occured. Try again or try another site";
            toast.error(statusText, {
                icon: "❌",
            });
            setLoading(false);
        }
    };

    function randomizeSite() {
        setRandomizing(true);
        let randomValue =
            randomSiteData[Math.floor(Math.random() * randomSiteData.length)];
        setUrl(randomValue);
        generateSummary(randomValue).then(() => setRandomizing(false));
    }

    return (
        <div className="dark:bg-[#0A0A0A] bg-[#FAF5EE]">

            <Toaster />
            <div className="flex max-w-5xl mx-auto flex-col items-center justify-center min-h-screen flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen" >
                <Head>
                    <title>SiteExplainer</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Header />
                {/* <div className={"z-0"}>
                    <BackgroundCircles />
                </div> */}
                <main className="flex z-10 flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
                    <div className="max-w-xl w-full">
                        <div className="flex flex-row items-center px-4">
                            <input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full rounded-l-md border-gray-100  shadow-lg dark:bg-gray-200 bg-gray-100 focus:border-1 outline-none  dark:text-black my-5 p-3"
                                placeholder={"thislandingpagemakesnosense.com"}
                            />
                            <FcSearch className="text-5xl dark:bg-gray-200 bg-gray-100 p-2 rounded-r-md text-black" />
                        </div>
                    </div>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{ duration: 2000 }}
                    />
                    <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
                    <ResizablePanel>
                        <AnimatePresence mode="wait">
                            <motion.div className="space-y-10 my-10">
                                {generatedSummary && (
                                    <>
                                        <div>
                                            <h2 className="sm:text-4xl dark:text-white text-3xl font-bold text-slate-900 mx-auto">
                                                Your generated summary
                                            </h2>
                                        </div>
                                        <div className="space-y-8 dark:text-white flex flex-col items-center justify-center max-w-xl mx-auto">
                                            <div
                                                className="rounded-xl dark:text-white p-4 dark:bg-gray-200 bg-gray-100 transition cursor-copy border text-md shadow-inner font-semibold text-left"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        generatedSummary.toString()
                                                    );
                                                    toast("Summary copied to clipboard", {
                                                        icon: "✂️",
                                                    });
                                                }}>
                                                <p className={"dark:text-black"}>{generatedSummary}</p>

                                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I honestly had no idea what ${url} did until I used siteexplainer.com 🔥`)}`}
                                                    target="_blank" className="text-[#1da1f2] font-medium text-sm px-5 py-2.5 text-center inline-flex items-center hover:opacity-80">
                                                    <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"></path></svg>
                                                    Share on Twitter
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        {latestSites && latestSites.length !== 0 && (
                            <div className="px-2 py-2 rounded-lg my-4">
                                <div className="w-full mx-auto sm:px-6 lg:px-2">
                                    <div className="max-w-7xl px-1 py-1 text-center sm:mx-auto sm:px-2">
                                        <h2 className="text-3xl text-gray-900 font-medium mb-2 dark:text-gray-300">
                                            Latest Searches
                                        </h2>
                                        <ul className="md:max-w-5xl w-full flex  flex-row justify-center md:gap-6 gap-4   items-center mx-auto p-2 rounded-full my-6">
                                            <Marquee gradient={false} className={"rounded-full"}>
                                                {latestSites.map((url, index) => (
                                                    <AnimatePresence key={`latest-site-${index}`}>
                                                        <motion.li
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="text-gray-600 ml-4"
                                                            key={`latest-site-${index}`}>
                                                            <button
                                                                onClick={() => handleLatestSiteClick(url)}
                                                                className="w-full  md:px-3 px-1 md:py-4 py-3 border-[0.5px] font-semibold dark:border-gray-500 shadow-md  bg-gray-300 md:text-md text-sm dark:bg-[#1e293b] border-gray-100 rounded-xl flex flex-row text-black hover:bg-gray-200 dark:text-white
                              ">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="w-6 h-6">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                                                    />
                                                                </svg>

                                                                {url}
                                                            </button>
                                                        </motion.li>
                                                    </AnimatePresence>
                                                ))}
                                            </Marquee>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ResizablePanel>
                </main>
                <Faq />
                <Footer />
            </div>

        </div>
    );
};

export default Home;

