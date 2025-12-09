import { ApiError, useUser } from "@/api";
import { updatePermissions, usePermissions } from "@/api/permission";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { LoadingData } from "@/components/loading";
import { Permission, usePermissionAccess } from "@/hooks/use-permission-access";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { addToast, Button } from "@heroui/react";
import { Action, Resource } from "@repo/permissions";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

interface UserPermissionProps {
  id: string;
}

// ----------------------------------------------------------------------

const UserPermissionView: React.FC<UserPermissionProps> = ({ id }) => {
  const { t } = useLocales();
  const router = useRouter();

  const { permissions: datas } = usePermissionAccess();

  const { userData, userLoading } = useUser(id);
  const { permissionsData, permissionsLoading } = usePermissions(id);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>(datas);

  const title = `${userData?.alias} - ${t("page_title.user.permission")}`;

  useEffect(() => {
    if (!permissionsData || isEmpty(permissionsData)) return;

    setPermissions((prev) => {
      const next = prev.map((permission) => {
        const found = permissionsData.find(
          (x) => x.resource === permission.key
        );

        if (!found) return permission;

        const updatedItems = permission.items.map((item) => ({
          ...item,
          checked: found.actions.includes(item.key),
        }));

        const updatedChecked = updatedItems.every((x) => x.checked);

        // 🔥 PREVENT UNNECESSARY RERENDERS
        const isSame =
          permission.checked === updatedChecked &&
          permission.items.every(
            (item, i) => item.checked === updatedItems[i].checked
          );

        return isSame
          ? permission
          : { ...permission, checked: updatedChecked, items: updatedItems };
      });

      // 🔥 If nothing changed, return previous state (NO RENDER)
      const hasChanged = next.some((p, i) => p !== prev[i]);
      return hasChanged ? next : prev;
    });
  }, [permissionsData, permissions]);

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
    resource: Resource,
    action: Action,
    childChecked: boolean
  ) {
    setPermissions((prevState) =>
      prevState.map((permission) => {
        if (permission.key !== resource) return permission;
        return {
          ...permission,
          items: permission.items.map((item) =>
            item.key === action ? { ...item, checked: childChecked } : item
          ),
        };
      })
    );

    setPermissions((prevState) =>
      prevState.map((permission) => {
        if (resource !== permission.key) return permission;
        const allChecked = permission.items.every((item) => item.checked);
        return { ...permission, checked: allChecked };
      })
    );
  }

  async function handleUpdate() {
    const dataChecked = permissions.filter((permission) =>
      permission.items.some((item) => item.checked)
    );

    const transformDatas = dataChecked.map((permission) => {
      const itemChecked = permission.items
        .filter((item) => item.checked)
        .map((item) => item.key);

      return {
        resource: permission.key,
        actions: itemChecked,
      };
    });

    try {
      if (!permissionsData) return;
      setLoading(true);
      await updatePermissions(id, { datas: transformDatas });
      addToast({
        description: t("user_permission.updated"),
        color: "success",
      });
      router.back();
      setLoading(false);
    } catch (error) {
      if (error instanceof ApiError) {
        addToast({
          description: error.message,
          color: "danger",
        });
        setLoading(false);
        return;
      }
      console.error(error);
      setLoading(false);
    }
  }

  if (userLoading || permissionsLoading) {
    return <LoadingData />;
  }

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
              { name: userData?.alias },
              { name: t("permission") },
            ]}
          />

          <Button color="primary" onPress={handleUpdate} isLoading={loading}>
            {t("update")}
          </Button>
        </div>

        <div className="flex flex-col gap-y-4">
          {permissions.map((permission, ind) => (
            <Card
              key={permission.key}
              classNames={{
                header: "p-4",
                body: "p-4 flex-row flex-wrap gap-4",
              }}
            >
              <CardHeader>
                <Checkbox
                  isSelected={!!permission.checked}
                  onValueChange={(checked) => handleParent(ind, checked)}
                >
                  {t(permission.key)}
                </Checkbox>
              </CardHeader>

              <Divider />

              <CardBody>
                {permission.items.map((item) => (
                  <Checkbox
                    key={item.key}
                    isSelected={item.checked}
                    onValueChange={(checked) =>
                      handleChild(permission.key, item.key, checked)
                    }
                  >
                    {t(`action.${item.key}`)}
                  </Checkbox>
                ))}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserPermissionView;
