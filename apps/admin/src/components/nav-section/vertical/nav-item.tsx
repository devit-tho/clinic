import Iconify from "@/components/iconify";
import { usePermissionAccess } from "@/hooks/use-permission-access";
import { List } from "@/layouts/dashboard/config-navigation";
import { RouterLink } from "@/routes/components";
import { Button, ButtonProps } from "@heroui/button";
import clsx from "clsx";

// ----------------------------------------------------------------------

interface NavItemProp extends ButtonProps {
  data: List;
  open: boolean;
  active: boolean;
  onClick: () => void;
}

// ----------------------------------------------------------------------

const NavItem: React.FC<NavItemProp> = ({
  data,
  open,
  active,
  onClick,
  ...other
}) => {
  const { handlePermission } = usePermissionAccess();

  const { icon, childrens, path, permission } = data;

  const renderContent = (
    <>
      <div className="flex items-center gap-x-2">
        {typeof icon === "string" ? (
          <Iconify icon={icon} className="size-5" />
        ) : (
          <>{icon}</>
        )}
        <span className={clsx("text-base")}>{data.title}</span>
      </div>
    </>
  );

  const buttonProps: ButtonProps = {
    color: active ? "primary" : "default",
    variant: active ? "flat" : "light",
  };

  const gotChildren: ButtonProps = {
    className: "mb-2 justify-between",
    onPress: onClick,
    endContent: (
      <Iconify
        icon="lucide:chevron-down"
        className={clsx(
          "size-5 transition-all duration-200",
          open ? "rotate-0" : "-rotate-90"
        )}
      />
    ),
    ...buttonProps,
    ...other,
  };

  const noChildren: ButtonProps = {
    as: RouterLink,
    href: path,
    className: "mb-2 justify-start",
    ...buttonProps,
    ...other,
  };

  if (permission && !handlePermission(permission)) {
    return null;
  }

  return (
    <Button {...(!!childrens ? gotChildren : noChildren)}>
      {renderContent}
    </Button>
  );
};

export default NavItem;
