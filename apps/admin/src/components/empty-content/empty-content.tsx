import { Icon, IconifyIcon } from "@iconify/react";

interface EmptyContentProp {
  icon: string | IconifyIcon;
  content: string;
}

const EmptyContent: React.FC<EmptyContentProp> = ({ icon, content }) => {
  return (
    <div className="flex flex-col items-center gap-y-2.5 pb-10 pt-20">
      <Icon icon={icon} className="size-20 text-foreground-400" />
      <span className="text-foreground-400">{content}</span>
    </div>
  );
};

export default EmptyContent;
