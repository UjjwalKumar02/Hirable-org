"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Image from "next/image";
import img from "../public/heroImage.png";
import img2 from "../public/query.png";
import Link from "next/link";
import LoginIcon from "../icons/LoginIcon";
import GithubIcon from "../icons/GithubIcon";
import DesignIcon from "../icons/DesignIcon";
import DashboardIcon from "../icons/DashboardIcon";
import QueryIcon from "../icons/QueryIcon";
import { EditIcon } from "../icons/EditIcon";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center tracking-tight">
      <div className="max-w-6xl w-full min-h-200 flex flex-col items-center ">
        {/* navbar */}
        <nav className="w-full flex justify-between items-center py-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tighter">Hirable</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push("/signup")}
              className="flex items-center gap-1.5"
            >
              <LoginIcon /> Sign up
            </Button>

            <Link href={"https://github.com/UjjwalKumar02/hirable-org"}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => console.log("first")}
                className="flex items-center gap-1.5"
              >
                <GithubIcon /> GitHub
              </Button>
            </Link>
          </div>
        </nav>

        {/* hero section */}
        <section className="min-h-screen w-full flex flex-col pt-22">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-6xl font-semibold tracking-tighter text-center">
              The Hiring Buddy
              <br />
              for Everyone
            </h1>

            <p>
              Create forms, collect responses, and get AI-powered insights
              instantly.
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/signup")}
                className="flex items-center gap-1.5"
              >
                <LoginIcon /> Get started
              </Button>

              <Link href={"https://github.com/UjjwalKumar02/hirable-org"}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => console.log("first")}
                  className="flex items-center gap-1.5"
                >
                  <GithubIcon /> Star on GitHub
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full mt-18">
            <Image
              src={img}
              alt="hero-image"
              width={1000}
              height={1000}
              loading="eager"
              className="w-full border border-gray-200 rounded-xl shadow-xs"
            />
          </div>
        </section>

        <section className=" w-full flex flex-col gap-12 py-45 justify-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-semibold">Get started in minutes.</h2>
            <p>Build forms, collect responses, and let AI do the analysis.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border border-gray-200 shadow-xs rounded-xl py-11 min-w-70 justify-center">
              <EditIcon />
              <h3 className="text-3xl font-semibold">Create</h3>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 shadow-xs rounded-xl py-11 min-w-70 justify-center">
              <DesignIcon />
              <h3 className="text-3xl font-semibold">Design</h3>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 shadow-xs rounded-xl py-11 min-w-70 justify-center">
              <DashboardIcon />
              <h3 className="text-3xl font-semibold">Dashboard</h3>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 shadow-xs rounded-xl py-11 min-w-70 justify-center">
              <QueryIcon />
              <h3 className="text-3xl font-semibold">AI Query</h3>
            </div>
          </div>
        </section>

        <section className="w-full py-10 flex items-center justify-between">
          <Image
            src={img2}
            alt="llmImage"
            width={1000}
            height={1000}
            className="border border-gray-200 shadow-xs min-h-80 max-w-[48%] object-cover rounded-xl"
          />

          <div className="flex flex-col gap-5 max-w-[48%] min-w-[48%]">
            <h2 className="text-4xl font-semibold">
              Ask AI about your responses
            </h2>

            <p>
              Search, summarize, and uncover insights from every response using
              AI.
            </p>
          </div>
        </section>

        <section className="min-h-screen flex flex-col justify-center">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-6xl font-semibold tracking-tighter text-center">
              Build smarter forms with AI
            </h1>

            {/* <p>Create custom forms, manage responses and query using llm.</p> */}

            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/signup")}
                className="flex items-center gap-1.5"
              >
                <LoginIcon /> Get started
              </Button>

              <Link href={"https://github.com/UjjwalKumar02/hirable-org"}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => console.log("first")}
                  className="flex items-center gap-1.5"
                >
                  <GithubIcon /> Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <nav className="border-t border-gray-200 w-full flex justify-between items-center py-8 px-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tighter">Hirable</h2>
          </div>

          <div className="flex items-center gap-4">
            <Link href={"https://github.com/UjjwalKumar02/hirable-org"}>
              GitHub
            </Link>
            <Link href={"https://ujjwalkumar02.github.io/pro/"}>Author</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
