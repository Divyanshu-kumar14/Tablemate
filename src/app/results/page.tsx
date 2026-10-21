import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultsClient } from "@/components/results-client";

export const metadata: Metadata = {
  title: "Your shortlist",
  description:
    "A streamed, evidence-labeled restaurant shortlist with a call script for every card.",
};

function ResultsFallback() {
  return (
    <>
      <section className="border-b border-line/70 bg-paper/40">
        <div className="container-page py-9 sm:py-12">
          <div className="h-5 w-28 rounded skeleton" />
          <div className="mt-5 h-12 w-2/3 rounded skeleton" />
          <div className="mt-3 h-5 w-1/2 rounded skeleton" />
          <div className="mt-6 h-20 w-full rounded-xl skeleton" />
        </div>
      </section>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="card-paper h-64 p-5 lg:col-start-2 lg:row-start-1">
          <div className="h-5 w-32 rounded skeleton" />
          <div className="mt-6 space-y-4">
            <div className="h-4 w-full rounded skeleton" />
            <div className="h-4 w-5/6 rounded skeleton" />
            <div className="h-4 w-4/6 rounded skeleton" />
          </div>
        </div>
        <div className="space-y-6 lg:col-start-1 lg:row-start-1">
          {[0, 1].map((index) => (
            <div key={index} className="card-paper h-72 p-6 sm:p-8">
              <div className="h-4 w-24 rounded skeleton" />
              <div className="mt-3 h-10 w-2/3 rounded skeleton" />
              <div className="mt-2 h-4 w-40 rounded skeleton" />
              <div className="mt-6 h-16 w-full rounded-xl skeleton" />
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-36 rounded-full skeleton" />
                <div className="h-8 w-32 rounded-full skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <ResultsClient />
    </Suspense>
  );
}
