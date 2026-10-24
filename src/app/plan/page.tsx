import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanForm } from "@/components/plan-form";

export const metadata: Metadata = {
  title: "Build a shortlist",
  description:
    "Start with taste signals, add texture, sodium, diet, noise, and mobility needs, and get an evidence-labeled restaurant shortlist.",
};

function PlanFallback() {
  return (
    <>
      <section className="border-b border-white/[0.08] bg-obsidian-900/60 backdrop-blur-md">
        <div className="container-page py-8 sm:py-12">
          <div className="h-5 w-24 rounded skeleton" />
          <div className="mt-8 h-12 w-3/4 max-w-xl rounded skeleton" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded skeleton" />
        </div>
      </section>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="liquid-glass h-64 p-8">
              <div className="h-6 w-40 rounded skeleton" />
              <div className="mt-6 h-14 w-full rounded-xl skeleton" />
              <div className="mt-3 h-14 w-2/3 rounded-xl skeleton" />
            </div>
          ))}
        </div>
        <div className="liquid-glass h-80 p-6">
          <div className="h-7 w-40 rounded skeleton" />
          <div className="mt-6 h-4 w-full rounded skeleton" />
          <div className="mt-3 h-4 w-5/6 rounded skeleton" />
        </div>
      </div>
    </>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<PlanFallback />}>
      <PlanForm />
    </Suspense>
  );
}
