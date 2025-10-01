import { Spinner } from "@heroui/react";

const LoadingScreen: React.FC = () => (
  <div className="grid min-h-screen place-items-center">
    <Spinner size="lg" className="scale-[2]" />
  </div>
);

export default LoadingScreen;
