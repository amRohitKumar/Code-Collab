type Props = {
  isOpen?: boolean;
  // leftIcon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  leftIcon: React.ReactNode;
  rightComponent?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const EditorSidebarRow = ({
  isOpen,
  leftIcon,
  rightComponent,
  ...otherProps
}: Props) => {
  return (
    <div
      className="w-full grid grid-cols-4 gap-4 justify-items-center mb-4 items-center px-2"
      {...otherProps}
    >
      {leftIcon}
      {isOpen && rightComponent}
    </div>
  );
};

export default EditorSidebarRow;
