import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const BASE_URL = "https://phone-shop-git-main-radek11111s-projects.vercel.app";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req))
    await auth.protect({
      unauthenticatedUrl: BASE_URL,
      unauthorizedUrl: BASE_URL,
    });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
