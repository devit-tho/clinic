import { useLocales } from "@/locales";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

interface DeleteItemProps {
  isOpen: boolean;
  onPress: () => Promise<void> | void;
  onClose: () => void;
  onOpenChange: () => void;
  title: string;
}

const DeleteItem: React.FC<DeleteItemProps> = ({
  onOpenChange,
  isOpen,
  onPress,
  onClose,
  title,
}) => {
  const { t } = useLocales();

  return (
    <Modal
      backdrop="blur"
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>Delete {title}</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this {title.toLowerCase()}?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onPress}>
            {t("action.delete")}
          </Button>
          <Button color="primary" variant="light" onPress={onClose}>
            {t("action.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteItem;
