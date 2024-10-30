"use client";

import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/navigation"; // Import useRouter from next/router

type Listing = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

const Listings = () => {
  const router = useRouter();
  const fetchListings = async (): Promise<Listing[]> => {
    const res = await fetch(
      "https://dummyjson.com/products/category/smartphones"
    );
    const data = await res.json();
    return data.products;
  };

  const {
    data: listing,
    error,
    isLoading,
  } = useQuery<Listing[], Error>({
    queryKey: ["listing"],
    queryFn: fetchListings,
  });

  if (isLoading)
    return <div className="mx-auto justify-center">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleListingClick = (id: number) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="mx-auto mt-0 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center">
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {listing?.map((listing) => (
          <div
            key={listing.id}
            className="group relative text-center"
            onClick={() => handleListingClick(listing.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="w-34 h-34 p-2 border border-white/50 shadow-md rounded-lg overflow-hidden">
              <img
                src={listing.thumbnail}
                alt={listing.title}
                className="h-full w-full object-cover object-center transform transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="mt-4 text-start">
              <h2 className="text-lg text-slate-700">
                {listing.title}
                <span aria-hidden="true" className="absolute inset-0" />
              </h2>

              <p>Price: ${listing.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
