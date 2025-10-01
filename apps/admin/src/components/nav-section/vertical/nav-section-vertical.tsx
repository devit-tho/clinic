import { List, NavList } from "@/layouts/dashboard/config-navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { Collapse } from "../../collapse";
import SidebarList from "./nav-list";

// ----------------------------------------------------------------------

interface NavSectionVerticalProps {
  datas: NavList[];
}

interface GroupProp {
  title: string;
  lists: List[];
}

// ----------------------------------------------------------------------

const NavSectionVertical: React.FC<NavSectionVerticalProps> = ({ datas }) => {
  return (
    <>
      <div className="flex w-full flex-col p-4 gap-y-2">
        {datas.map((sidebar, i) => (
          <Group key={i} title={sidebar.title} lists={sidebar.lists} />
        ))}
      </div>
    </>
  );
};

export default NavSectionVertical;

const Group: React.FC<GroupProp> = ({ title, lists }) => {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderContent = lists.map((list) => (
    <SidebarList
      key={list.title + list.path}
      data={list}
      hasChild={!!list.childrens}
    />
  ));

  return (
    <div className={clsx("flex flex-col gap-y-3")}>
      <div
        className="group flex cursor-pointer items-center self-start"
        onClick={handleToggle}
      >
        <Icon
          icon="lucide:chevron-down"
          className={clsx(
            "size-4 scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
        <span className="-translate-x-2 text-xs font-semibold uppercase tracking-wide transition-all duration-200 group-hover:translate-x-0">
          {title}
        </span>
      </div>

      <Collapse open={open}>{renderContent}</Collapse>
    </div>
  );
};
