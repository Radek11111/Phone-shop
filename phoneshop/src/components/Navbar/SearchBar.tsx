import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function SearchBar({
  openSearchBar,
  setOpenSearchBar,
}: {
  openSearchBar: boolean;
  setOpenSearchBar: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.trim();
    if (search.length > 1) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/search`,
          {
            params: { q: "phone" },
          }
        );
        setData(response.data.products);
        setError(null);
      } catch (error) {
        setError("Błąd podczas wyszukiwania");
        toast({
          title: "Error",
          description: "Product not found",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setData([]);
    }
  };

  return (
    <Dialog open={openSearchBar}>
      <DialogContent className="lg:max-w-screen-xl z-[99999999] [&>.closeBtn]:hidden">
        <div className="flex items-center w-full gap-4">
          <Search className="text-slate-400" />
          <Input
            onInput={handleSearch}
            placeholder="Type any product here"
            className="border-0 outline-none focus:outline-none text-slate-500"
          />
          <Button
            onClick={() => setOpenSearchBar(!openSearchBar)}
            variant="nostyle"
            size="icon"
            className="hover:bg-zinc-200"
          >
            <X />
          </Button>
        </div>
        <div className="flex h-[600px] overflow-y-auto w-full py-12 gap-4 flex-col justify-start items-center px-12">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            data.map((item: Product, idx: number) => (
              <div
                onClick={() => {
                  router.push(`/products/${item.id}`);
                  setOpenSearchBar(false);
                }}
                key={idx}
              >
                <div className="group cursor-pointer flex flex-col items-center mx-auto px-4 ">
                  <Image
                    src={item.thumbnail}
                    height={120}
                    width={100}
                    className="transition-transform duration-300 ease-in-out group-hover:scale-110  "
                    alt={item.title}
                  />
                  <h3 className="text-slate-800 mb-1 mt-4">{item.title}</h3>
                  <p className="pt-0 text-center ">
                    {item.description.length > 100
                      ? `${item.description.substring(0, 50)} ...`
                      : item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
