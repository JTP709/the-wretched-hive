"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import Image from "next/image";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const setSearchParam = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("search", query);
      else params.delete("search");

      router.push(`${pathname}?${params}`);
    }, 500),
    [searchParams, pathname, router]
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setQuery(value);
    setSearchParam(value);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchParam("");
  }

  return (
    <div className="flex flex-row">
      <label>
        Search:
        <input
          className="ml-2 text-black"
          type="text"
          placeholder="Thermal Detonator"
          onChange={handleOnChange}
          value={query}
        />
      </label>
      <button onClick={handleClearSearch}>
        <Image className="ml-2" src="/backspace.svg" alt="clear search" width="24" height="24" />
      </button>
    </div>
  )
};
