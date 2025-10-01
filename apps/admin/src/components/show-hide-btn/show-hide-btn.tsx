import { Icon } from "@iconify/react";

// ----------------------------------------------------------------

interface ShowHideBtnProps {
  show?: boolean;
  onClick: () => void;
}

const ShowHideBtn: React.FC<ShowHideBtnProps> = ({ show, onClick }) => (
  <div onClick={onClick}>
    <Icon icon={!show ? "lucide:eye" : "lucide:eye-off"} className="size-5" />
  </div>
);

export default ShowHideBtn;
