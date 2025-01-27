"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number,
  currentPage: number,
}

export default function Pagination({ totalPages, currentPage}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnClick = (pageNumber: number) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", pageNumber.toString());
    router.push(`/?${currentParams.toString()}`);
  };

  return (
    <div className="flex w-full justify-center">
      {Array.from({ length: totalPages}, (_, index) => {
        const pageNumber = index + 1;
        const isCurrentPage = currentPage === pageNumber;
        const baseClassName = "px-4 py-2 bg-gray-500 text-white";
        const className = `${isCurrentPage ? "font-bold bg-gray-700" : "bg-gray-500 hover:bg-gray-700"} ${baseClassName}`;
        return (
          <button
            key={pageNumber}
            className={className}
            disabled={isCurrentPage}
            onClick={() => handleOnClick(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      })}
    </div>
  )
};
