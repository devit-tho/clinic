"use client";

// Components
import Header from "./header";
import Main from "./main";

// Hooks

// Helpers
import { useDisclosure } from "@heroui/react";
import { PropsWithChildren } from "react";
import NavVertical from "./nav-vertical";

// --------------------------------------------------------------------

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex h-full">
      <NavVertical
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />

      <Main>
        <Header onOpen={onOpen} />
        <div className="grow p-6">{children}</div>
      </Main>
    </div>
  );
};

export default DashboardLayout;
