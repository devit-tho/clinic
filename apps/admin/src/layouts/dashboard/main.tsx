import { PropsWithChildren } from "react";

// --------------------------------------------------------------------

const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="mb-16 relative flex size-full basis-auto flex-col">
      {children}
    </main>
  );
};

export default Main;
