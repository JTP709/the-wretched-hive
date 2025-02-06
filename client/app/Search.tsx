"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const setSearchParam = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", query);

      router.push(`${pathname}?${params}`);
    }, 500),
    [searchParams, pathname, router]
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setQuery(value);
    setSearchParam(value);
  };

  return (
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
  )
};
