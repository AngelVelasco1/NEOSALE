import { Card } from "@/components/ui/card";
import { exportCustomers } from "@/app/(admin)/actions/customers/exportCustomers";
import { ExportDataButtons } from "@/app/(admin)/components/shared/ExportDataButtons";

export default function CustomerActions() {
  return (
    <Card className="mb-6 p-5 border border-slate-700/50 bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-slate-950/50 rounded-xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <ExportDataButtons action={exportCustomers} tableName="customers" />
      </div>
    </Card>
  );
}
