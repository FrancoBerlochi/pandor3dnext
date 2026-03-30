
import AdminDashboard from "@/components/admin-dashboard/admin-dashboard";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <main className="flex w-full bg-gray-400/15">
        <AdminDashboard></AdminDashboard>
      </main>
    </>
  );
}
