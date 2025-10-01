import { createUser } from "@/api";
import { Clipboard } from "@/components/clipboard";
import CustomBreadcrumbs from "@/components/custom-breadcrumb";
import { useLocales } from "@/locales";
import { useRouter } from "@/routes/hooks";
import paths from "@/routes/paths";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { addToast, Input } from "@heroui/react";
import { UserResponse } from "@repo/entities";
import { CreateUserType, UpdateUserType } from "@repo/schemas";
import { useState } from "react";
import UserForm from "../user-form";

// ----------------------------------------------------------------------

const UserCreate: React.FC = () => {
  const { t } = useLocales();

  const router = useRouter();

  const [userResponse, setUserResponse] = useState<UserResponse>();

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const title = t("page_title.user.create");

  function openModal(res: UserResponse) {
    setUserResponse(res);
    onOpen();
  }

  function closeModal() {
    setUserResponse(undefined);
    onClose();
    router.back();
  }

  async function onSubmit(v: CreateUserType | UpdateUserType) {
    try {
      const res = await createUser(v as CreateUserType);
      addToast({
        description: t("user_response.created"),
        color: "success",
      });
      openModal(res);
    } catch (error) {
      addToast({
        description: "Something went wrong 😟",
        color: "danger",
      });
      console.error(error);
    }
  }

  return (
    <>
      <title>{title}</title>

      <div className="mx-auto flex max-w-screen-lg flex-col gap-y-6">
        <CustomBreadcrumbs
          heading={t("settings_form.create_user")}
          links={[
            { name: t("dashboard"), href: paths.dashboard.root },
            { name: t("user"), href: paths.dashboard.user.root },
            { name: t("action.create") },
          ]}
        />

        <UserForm onSubmit={onSubmit} />

        {userResponse && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={closeModal}
          >
            <ModalContent>
              <ModalHeader>{t("user_response.new_account")}</ModalHeader>
              <ModalBody className="gap-y-6">
                <Input
                  label={t("username")}
                  value={userResponse.username}
                  readOnly
                  endContent={
                    <Clipboard
                      value={userResponse.username}
                      content={t("user_response.copy_username")}
                    />
                  }
                />

                <Input
                  label={t("password")}
                  value={userResponse.password}
                  readOnly
                  endContent={
                    <Clipboard
                      value={userResponse.password}
                      content={t("user_response.copy_password")}
                    />
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={closeModal}>
                  {t("user_response.close")}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </div>
    </>
  );
};

export default UserCreate;
