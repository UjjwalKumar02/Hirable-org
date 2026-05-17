import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center bg-sky-500 text-white p-5 gap-5">
      <Link href={"/signup"}>Signup</Link>
      <Link href={"/login"}>Login</Link>
    </div>
  );
}
