import ChaptersTable from "@/components/admin/tables/ChaptersTable";
import { Suspense } from "react";

const AdminChaptersPage = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Suspense fallback="Loading...">
        <ChaptersTable />
      </Suspense>
    </main>
  );
};

export default AdminChaptersPage;
