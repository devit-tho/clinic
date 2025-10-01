import { Button, Tooltip, addToast } from "@heroui/react";

import { Icon } from "@iconify/react";
import { useCopyToClipboard } from "usehooks-ts";

// ----------------------------------------------------------------

interface ClipboardProps {
  content: string;
  value: string;
  success?: string;
  fail?: string;
}

// ----------------------------------------------------------------

const Clipboard: React.FC<ClipboardProps> = ({
  content,
  value,
  success = "Copied",
  fail = "Failed to copy",
}) => {
  const [, copy] = useCopyToClipboard();

  async function handleCopy() {
    try {
      await copy(value);
      addToast({
        description: success,
        color: "success",
      });
    } catch (error) {
      addToast({
        description: fail,
        color: "danger",
      });
    }
  }

  return (
    <Tooltip content={content}>
      <Button isIconOnly size="sm" onPress={handleCopy} variant="light">
        <Icon icon="solar:clipboard-text-linear" className="size-5" />
      </Button>
    </Tooltip>
  );
};

export default Clipboard;
