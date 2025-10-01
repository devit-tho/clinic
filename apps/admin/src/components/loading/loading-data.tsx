import { Progress } from "@heroui/progress";

// ----------------------------------------------------------------------

const LoadingData: React.FC = () => (
  <div className="relative flex h-full items-center justify-center">
    <div className="absolute bottom-28">
      <Progress isIndeterminate size="lg" aria-label="loading data" />
    </div>
  </div>
);

export default LoadingData;
