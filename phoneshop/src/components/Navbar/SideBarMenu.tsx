import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { CiHeart, CiHome, CiLogin, CiLogout, CiMenuFries, CiShop, CiShoppingCart, CiUser } from 'react-icons/ci';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


export default function SideBarMenu() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleSignIn = () => {
    router.push('/sign-in');
    setSheetOpen(false);
  };

  const handleLinkClick = () => {
    setSheetOpen(false);
  };

  return (
    <>
      <div className="block sm:hidden relative">
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <CiMenuFries size={34} />
          </SheetTrigger>
          <SheetContent
            className={cn(
              "px-4 w-full md:w-[400px] flex flex-col items-center justify-center [&>#closeBtn]:text-3xl"
            )}
          >
            <div className="flex flex-col gap-4 text-2xl">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                onClick={handleLinkClick}
              >
                <CiHome size={30} /> Home
              </Link>
              {isSignedIn && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                  onClick={handleLinkClick}
                >
                  <CiUser size={30} /> Dashboard
                </Link>
              )}
              <Link
                href="/store"
                className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                onClick={handleLinkClick}
              >
                <CiShop size={30} /> Store
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                onClick={handleLinkClick}
              >
                <CiShoppingCart size={30} /> Cart
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                onClick={handleLinkClick}
              >
                <CiHeart size={30} /> Favorite
              </Link>
            </div>
            <div className="absolute bottom-4 right-4">
              {isSignedIn ? (
                <Button
                  className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                  variant="nostyle"
                >
                  <CiLogout size={40} />
                  <SignOutButton />
                </Button>
              ) : (
                <Button
                  className="flex items-center gap-2 hover:text-zinc-500 transition-colors"
                  variant="nostyle"
                  onClick={handleSignIn}
                >
                  <CiLogin size={50} />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
