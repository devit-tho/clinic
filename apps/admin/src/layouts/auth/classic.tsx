import { Image } from "@heroui/image";
import { PropsWithChildren } from "react";

// ----------------------------------------------------------------------

const AuthLayoutClassic: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid h-dvh grid-cols-1 lg:grid-cols-2 p-2">
      <div className="size-full content-center px-2">{children}</div>

      <Image
        src="/images/dentists-meeting.png"
        alt="Dentist meeting"
        className="size-full object-fill rounded-xl "
        classNames={{
          wrapper: "!max-w-full hidden lg:block",
        }}
      />
    </div>
  );
};

export default AuthLayoutClassic;
