import CodeboxCard from "./CodeboxCard";

const CardGroup = ({ children, className }: { children: models.ICodeBox[], className?: string }) => {
  return (
    <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center items-center">
      {children.map((codebox) => (
        <CodeboxCard key={codebox.id}>{codebox}</CodeboxCard>
      ))}
    </div>
  );
};

export default CardGroup;
