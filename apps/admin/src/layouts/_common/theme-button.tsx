import { Button } from "@heroui/button";
import { useTheme } from "@heroui/use-theme";
import { Icon } from "@iconify/react";

const ThemeButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      isIconOnly
      radius="full"
      onPress={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
    >
      <Icon icon={theme === "light" ? "lucide:moon" : "lucide:sun"} />
    </Button>
  );
};

export default ThemeButton;
