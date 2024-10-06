"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    handleStart();

    // Complete progress bar when the new page is rendered
    return () => {
      handleComplete();
    };
  }, [pathname, searchParams]);

  return null;
}

export default function ProgressBarWithSuspense() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
