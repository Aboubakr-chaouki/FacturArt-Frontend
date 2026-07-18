import { ClientList } from "./component/client-list";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ClientList />
    </div>
  );
}
