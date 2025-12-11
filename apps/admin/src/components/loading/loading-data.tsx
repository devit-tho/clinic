import { Progress } from "@heroui/progress";

// ----------------------------------------------------------------------

const LoadingData: React.FC = () => (
  <div className="relative flex min-h-[30dvh] items-center justify-center w-full">
    <Progress
      isIndeterminate
      size="sm"
      aria-label="loading data"
      className="max-w-md"
      color="default"
    />
  </div>
);

export default LoadingData;
