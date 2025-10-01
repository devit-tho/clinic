import { Navbar, NavbarContent } from "@heroui/navbar";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AccountPopover, LanguagePopover, ThemeButton } from "../_common";

interface SideProps {
  onOpen: () => void;
}

const Header: React.FC<SideProps> = ({ onOpen }) => {
  return (
    <Navbar
      classNames={{
        wrapper: "max-w-full py-10",
      }}
      className="lg:justify-between"
    >
      <Button
        isIconOnly
        variant="light"
        size="lg"
        className="lg:hidden"
        onPress={onOpen}
      >
        <Icon icon="lucide:sidebar" className="size-5" />
      </Button>

      <NavbarContent as="div" justify="end">
        <LanguagePopover />

        <ThemeButton />

        <AccountPopover />
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
