import { List } from "@/layouts/dashboard/config-navigation";
import { useActiveLink, usePathname } from "@/routes/hooks";
import { useEffect, useState } from "react";
import { Collapse } from "../../collapse";
import SideItem from "./nav-item";

interface NavListProps {
  hasChild: boolean;
  data: List;
}

const NavList: React.FC<NavListProps> = ({ data, hasChild }) => {
  const pathname = usePathname();
  const active = useActiveLink(data.path, hasChild);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
  }, [pathname]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col">
      <SideItem
        active={active}
        data={data}
        open={open}
        onClick={handleToggle}
      />

      {hasChild && (
        <Collapse open={open}>
          <div className="pl-7">
            {(data.childrens || []).map((child, i) => (
              <NavSubList key={i} data={child} />
            ))}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export default NavList;

const NavSubList: React.FC<Omit<NavListProps, "hasChild">> = ({ data }) => (
  <NavList data={data} hasChild={!!data.childrens} />
);
