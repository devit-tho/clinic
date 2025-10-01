import { useRecentPatient } from "@/api/patient";
import { Column } from "@/components/app-table";
import { useLocales } from "@/locales";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

const RecentPatient: React.FC = () => {
  const { t } = useLocales();

  const { patientsData } = useRecentPatient();

  const TABLE_HEAD: Column[] = [
    { name: t("name"), field: "name" },
    { name: t("age"), field: "age" },
    { name: t("phone_number"), field: "phoneNumber" },
    { name: t("created_by"), field: "createdBy" },
  ];

  return (
    <>
      <Table
        aria-label="recent patient"
        topContent={
          <span className="font-bold text-lg text-foreground-800">
            {t("recent_patient")}
          </span>
        }
        classNames={{
          base: "col-span-4",
        }}
      >
        <TableHeader columns={TABLE_HEAD}>
          {(v) => <TableColumn key={v.field}>{v.name}</TableColumn>}
        </TableHeader>
        <TableBody items={patientsData}>
          {(v) => (
            <TableRow>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.age}</TableCell>
              <TableCell>{v.phoneNumber}</TableCell>
              <TableCell>{v.user.alias}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default RecentPatient;
