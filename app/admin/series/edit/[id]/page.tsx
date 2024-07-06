"use client";

import { useGetSingleSeries } from "@/services/series/queries";
import SeriesForm from "@/components/admin/forms/SeriesForm";

const EditSeriesPage = ({ params }: { params: {id: number} }) => {
  const { data, isLoading } = useGetSingleSeries({ id: params.id })

  if (isLoading) return <p>Please wait...</p>
  if (!data) return <p>Series not found</p>

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <SeriesForm data={data} />
    </main>
  );
};

export default EditSeriesPage;
