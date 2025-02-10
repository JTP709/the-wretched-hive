"use client"

import { useGetHealthCheck } from "@/api/client/queries/health"

export default function HealthCheck() {
  const { isError, isFetching, data } = useGetHealthCheck();
  const hasIssue = isError || !data || data?.status !== 200;

  return !isFetching && hasIssue
    ? (
      <div>
        <p>We are experiencing issues with our services at the moment.</p>
        <p>Rest assured, we&apos;re working hard on getting them back up!</p>
      </div>
    ) : null;
};
