import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminPage() {
  await requireAdmin();

  return <div>Admin</div>;
}
