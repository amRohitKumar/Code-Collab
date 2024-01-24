type Props = {
  isOpen?: boolean;
  // leftIcon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  leftIcon: React.ReactNode;
  rightComponent?: React.ReactNode;
};

const EditorSidebarRow = ({ isOpen, leftIcon, rightComponent }: Props) => {
  return (
    <>
      <div className="w-full grid grid-cols-4 gap-4 justify-items-center mb-4 items-center">
        {leftIcon}
        {isOpen && rightComponent}
      </div>
    </>
  );
};

export default EditorSidebarRow;
