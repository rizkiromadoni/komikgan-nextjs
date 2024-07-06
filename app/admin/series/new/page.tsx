"use client";

import SeriesForm from "@/components/admin/forms/SeriesForm";

const NewSeriesPage = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <SeriesForm />
    </main>
  );
};

export default NewSeriesPage;
