import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <MaxWidthWrapper>
      <nav className="bg-slate-200 shadow-md">
        <div className=" ">
          <Link href="/">
            <h1>PHONE</h1>
          </Link>
          <form>
            <input type="text" placeholder="Search..." />
            <button>
              <FaSearch/>
            </button>
          </form>
          <ul>
            <li>Home</li>
            <li>New Phone</li>
            <li>Used phones</li>
          </ul>
        </div>
      </nav>
    </MaxWidthWrapper>
  );
};

export default Navbar;
