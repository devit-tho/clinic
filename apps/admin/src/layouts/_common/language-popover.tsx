import { Language, useLocales } from "@/locales";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Selection } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

// ----------------------------------------------------------------------

const LanguagePopover: React.FC = () => {
  const { languages, currentLang, onChangeLang } = useLocales();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([currentLang!.label])
  );

  function onSelectionChange(k: Selection) {
    const value = new Set(k).values().next().value as string;
    const language = languages.find((l) => l.label === value) as Language;
    setSelectedKeys(new Set([language.label]));
    onChangeLang(language.key);
  }

  return (
    <Dropdown aria-label="language popover" placement="bottom-end">
      <DropdownTrigger aria-label="Language button">
        <Button isIconOnly variant="light">
          <Icon icon={currentLang!.icon} className="size-8" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        selectionMode="single"
        aria-label="Language options"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        items={languages}
      >
        {(language) => (
          <DropdownItem
            key={language.label}
            startContent={<Icon icon={language.icon} className="size-6" />}
          >
            {language.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguagePopover;
