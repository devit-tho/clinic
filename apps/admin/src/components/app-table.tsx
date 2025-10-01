import { useLocales } from "@/locales";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SelectionMode,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import clsx from "clsx";
import capitalize from "lodash/capitalize";
import lowerCase from "lodash/lowerCase";
import * as React from "react";
import { Link } from "react-router-dom";
import Iconify from "./iconify";

export interface Column {
  name: string;
  field: string;
  sortable?: boolean;
}

interface AppTableProp<T = object> {
  invisibleColumns?: string[];
  columns: Column[];
  datas: T[];
  renderCell: (data: T, columnKey: React.Key, ind?: number) => any;
  tableEmptyContent?: React.ReactNode | string;
  tableDataLoading: boolean;
  dataName: string;
  selectionMode?: SelectionMode;
  addItem?: boolean;
  showTopContent?: boolean;
  showBottomContent?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | undefined;
  filterName?: keyof T;
}

export default function AppTable<T extends { id?: string | number | null }>({
  columns,
  invisibleColumns = [],
  datas,
  renderCell,
  tableEmptyContent = "Data not found",
  tableDataLoading,
  dataName = "users",
  selectionMode = "single",
  addItem = false,
  showTopContent = true,
  showBottomContent = true,
  shadow = "sm",
  filterName,
}: AppTableProp<T>) {
  const { t, currentLang } = useLocales();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(invisibleColumns)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.field)
    );
  }, [visibleColumns, currentLang]);

  const filteredItems = React.useMemo(() => {
    let filteredDatas = [...datas];

    if (hasSearchFilter) {
      filteredDatas = filteredDatas.filter((data) =>
        (data[filterName as keyof T] as string)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    return filteredDatas;
  }, [datas, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T] as number;
      const second = b[sortDescriptor.column as keyof T] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCells = React.useCallback(renderCell, [renderCell]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    if (!showTopContent) return null;
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={t("app_table.search")}
            startContent={<Iconify icon="fluent:search-24-filled" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown aria-label="Columns dropdown">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<Iconify icon="fluent:chevron-down-12-filled" />}
                  variant="flat"
                >
                  {t("app_table.columns")}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.field} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {addItem && (
              <Button
                color="primary"
                endContent={<Iconify icon="fluent:add-12-filled" />}
                as={Link}
                to={{ pathname: "create" }}
              >
                {t("app_table.add_new")}
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            {t("total")} {datas.length} {lowerCase(dataName)}
          </span>
          <label className="flex items-center text-small text-default-400">
            {t("app_table.row_page")}:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    datas.length,
    hasSearchFilter,
    currentLang,
  ]);

  const bottomContent = React.useMemo(() => {
    if (!showBottomContent) return null;
    return (
      <div className="flex items-center justify-between p-2">
        {selectionMode === "multiple" && (
          <span className="w-[30%] text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
          </span>
        )}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            {t("app_table.previous")}
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            {t("app_table.next")}
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter, currentLang]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      shadow={shadow}
      // bottomContentPlacement="outside"
      classNames={{
        wrapper: clsx("max-h-[600px]", shadow === "none" && "p-0"),
      }}
      selectedKeys={selectedKeys}
      selectionMode={selectionMode}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      // topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.field}
            allowsSorting={column.sortable}
            className={clsx(
              column.field === "actions" ? "text-end" : "text-start"
            )}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={tableEmptyContent}
        isLoading={tableDataLoading}
        items={sortedItems}
      >
        {sortedItems.map((item, ind) => (
          <TableRow key={ind}>
            {(columnKey) => (
              <TableCell>{renderCells(item, columnKey, ind)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
