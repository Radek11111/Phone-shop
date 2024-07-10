import Link from "next/link";

import { FaSearch } from "react-icons/fa";


const Navbar = () => {
  return (
    <nav className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-xl flex items-center ">
            Phone <br />
            <span className="text-slate-500 w-8">Store</span>
            <img
              src="/logo.png"
              className="bg-transparent"
              width="85"
              height="85"
              alt=""
            />
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Wyszukaj..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul
          className="flex gap-4
          "
        >
          <Link href="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Strona główna
            </li>
          </Link>
          <Link href="/favorite">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Ulubione
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
