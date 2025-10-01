interface CollapseProp {
  open: boolean;
  children: React.ReactNode;
}

const Collapse: React.FC<CollapseProp> = ({ open, children }) => {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200"
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
};

export default Collapse;
