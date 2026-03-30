import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  return (
    <p className="text-sm text-gray-500">
      {params?.error
        ? `Code error: ${params.error}`
        : "An unspecified error occurred."}
    </p>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Sorry, something went wrong.
              </h2>
            </div>
            <div className="p-6 pt-0">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
