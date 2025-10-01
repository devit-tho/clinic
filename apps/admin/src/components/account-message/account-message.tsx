// import { Clipboard } from "@/components/clipboard";
// import { useLocales } from "@/locales";
// import {
//   Button,
//   Input,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from "@heroui/react";
// import { Fragment } from "react";

// ----------------------------------------------------------------

interface AccountMessageProps {
  hasUser: boolean;
  onClose: () => void;
  // newUser: CreateDoctorStaff["account"] | null;
  title: string;
}

const AccountMessage: React.FC<AccountMessageProps> = (
  {
    // hasUser,
    // onClose,
    // // newUser,
    // title,
  }
) => {
  // const { t } = useLocales();

  return (
    <>
      {/* <Modal isOpen={hasUser} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <Fragment>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              {newUser && (
                <Fragment>
                  <Input
                    label={t("username")}
                    value={newUser?.username}
                    isReadOnly
                    endContent={
                      <Clipboard
                        content="Copy username"
                        value={newUser.username}
                        success="Username copied"
                      />
                    }
                  />
                  <Input
                    label={t("password")}
                    value={newUser?.password}
                    isReadOnly
                    endContent={
                      <Clipboard
                        content="Copy password"
                        value={newUser.password}
                        success="Password copied"
                      />
                    }
                  />
                </Fragment>
              )}
            </ModalBody>
            <ModalFooter>
              <Button type="button" onPress={onClose}>
                {t("close")}
              </Button>
            </ModalFooter>
          </Fragment>
        )}
      </ModalContent>
    </Modal> */}
    </>
  );
};

export default AccountMessage;
