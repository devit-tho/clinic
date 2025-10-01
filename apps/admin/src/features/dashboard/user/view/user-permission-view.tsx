import { updatePermission, usePermission } from "@/api/permission";
import datas from "@/assets/permissions";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { INVOICE, PATIENT, TREATMENT } from "@/utils/permission-data";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Checkbox } from "@heroui/checkbox";
import { addToast, Button } from "@heroui/react";
import _isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

interface UserPermissionProps {
  id: string;
}

interface Permission {
  name: string;
  checked: boolean;
  items: Omit<Permission & { key: INVOICE | PATIENT | TREATMENT }, "items">[];
}

// ----------------------------------------------------------------------

const UserPermissionView: React.FC<UserPermissionProps> = ({ id }) => {
  const { t } = useLocales();
  const router = useRouter();

  const { permissionData } = usePermission(id);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>(datas);

  const title = `${permissionData?.user.alias} - ${t("page_title.user.permission")}`;

  useEffect(() => {
    if (_isEmpty(permissionData)) return;
    const curPermission = permissionData.values;
    setPermissions((prevState) =>
      prevState.map((permission) => {
        const newItem = permission.items.map((item) => ({
          ...item,
          checked: curPermission.includes(item.key),
        }));
        const allChecked = newItem.every((item) => item.checked);
        return {
          ...permission,
          checked: allChecked,
          items: newItem,
        };
      })
    );
  }, [permissionData]);

  function handleParent(ind: number, checked: boolean) {
    setPermissions((prevState) =>
      prevState.map((permission, i) => {
        if (ind !== i) return permission;
        return {
          ...permission,
          checked,
          items: permission.items.map((item) => ({ ...item, checked })),
        };
      })
    );
  }

  function handleChild(
    parentIndex: number,
    key: INVOICE | PATIENT | TREATMENT
  ) {
    setPermissions((prevState) =>
      prevState.map((permission, pIndex) => {
        if (pIndex !== parentIndex) return permission;
        return {
          ...permission,
          items: permission.items.map((item) =>
            item.key === key ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );

    setPermissions((prevState) =>
      prevState.map((permission, pIndex) => {
        if (pIndex !== parentIndex) return permission;
        const allChecked = permission.items.every((item) => item.checked);
        return { ...permission, checked: allChecked };
      })
    );
  }

  async function handleUpdate() {
    const values: (INVOICE | PATIENT | TREATMENT)[] = [];
    permissions.forEach((permission) => {
      if (permission.checked) {
        permission.items.forEach((item) => {
          values.push(item.key);
        });
      } else {
        permission.items.forEach((item) => {
          if (!item.checked) return;
          values.push(item.key);
        });
      }
    });

    try {
      if (!permissionData) return;
      setLoading(true);
      await updatePermission(id, permissionData.id, { values });
      addToast({
        description: t("user_permission.updated"),
        color: "success",
      });
      router.back();
      setLoading(false);
    } catch (error) {
      addToast({
        description: "Something went wrong 😟",
        color: "danger",
      });
      console.error(error);
    }
  }

  if (!permissionData) return null;

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <CustomBreadcrumbs
            heading={t("user_permission.title")}
            links={[
              { name: t("dashboard"), href: paths.dashboard.root },
              { name: t("user"), href: paths.dashboard.user.root },
              { name: permissionData.user.alias },
              { name: t("permission") },
            ]}
          />

          <Button color="primary" onPress={handleUpdate} isLoading={loading}>
            {t("update")}
          </Button>
        </div>

        <div className="flex flex-col gap-y-4">
          {permissions.map((permission, ind) => (
            <Accordion
              key={ind}
              defaultExpandedKeys={["0", "1", "2"]}
              variant="splitted"
            >
              <AccordionItem
                key={ind}
                aria-label="Accordion 1"
                title={
                  <Checkbox
                    isSelected={permission.checked}
                    onValueChange={(checked) => handleParent(ind, checked)}
                  >
                    {permission.name}
                  </Checkbox>
                }
              >
                <div className="flex flex-wrap gap-4 py-2">
                  {permission.items.map((item, i) => (
                    <Checkbox
                      key={i}
                      onValueChange={() => handleChild(ind, item.key)}
                      isSelected={item.checked}
                    >
                      {item.name}
                    </Checkbox>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserPermissionView;
