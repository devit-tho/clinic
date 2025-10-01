import Logo from "@/components/logo";
import { NavSectionVertical } from "@/components/nav-section";
import Scrollbar from "@/components/scrollbar";
import { Drawer, DrawerBody, DrawerContent } from "@heroui/drawer";
import clsx from "clsx";
import { useMediaQuery } from "usehooks-ts";
import { useNavData } from "./config-navigation";

// ----------------------------------------------------------------------

interface NavVerticalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

// ----------------------------------------------------------------------

const NavVertical: React.FC<NavVerticalProps> = ({
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const navData = useNavData();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const renderContent = (
    <Scrollbar>
      <div className="p-4">
        <Logo />
      </div>

      <NavSectionVertical datas={navData} />
    </Scrollbar>
  );

  return (
    <div
      className={clsx(
        "hidden flex-col h-screen sticky shrink lg:shrink-0 transition-all duration-200 lg:block top-0"
      )}
    >
      {isDesktop ? (
        <div className="lg:w-[280px] h-full border-r border-foreground-100  z-[200] bg-background">
          {renderContent}
        </div>
      ) : (
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
          radius="none"
          placement="left"
          size="xs"
          classNames={{
            body: "p-0",
            closeButton: "hidden",
          }}
        >
          <DrawerContent>
            <DrawerBody>{renderContent}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default NavVertical;
