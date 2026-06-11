"use client";

import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Image from "next/image";
import img from "../public/heroImage.png";
import Link from "next/link";
import LoginIcon from "../icons/LoginIcon";
import GithubIcon from "../icons/GithubIcon";

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

            <p>Create custom forms, manage responses and query using llm.</p>

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
                  size="md"
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

        <section className="min-h-100"></section>
      </div>
    </div>
  );
}
