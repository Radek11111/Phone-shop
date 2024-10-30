'use client'

import Link from "next/link";



const SignIn = () => {
  return (
    <div className="p-3 max-w-lg mx-auto w-full ">
      <h1 className="text-3xl text-center font-semibold my-7 ">Sign In</h1>
      <form className="flex flex-col  gap-4 ">
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg "
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ">
          <a href="/api/auth/login">Login</a>
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link href='/signUp'>
        <span className="text-blue-700">Sign up</span>
        </Link>
        <p> {} </p>
      </div>
    </div>
  );
};

export default SignIn;
