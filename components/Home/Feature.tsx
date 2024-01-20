import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const FeatureBox: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full lg:w-3/4 p-8 mb-12",
        className
      )}
    >
      <div className="md:w-1/2">
        <h1 className="mt-2 text-4xl font-bold sm:text-4xl text-black">
          Collaboration & Code
        </h1>
        <p className="mt-3 text-xl text-gray-600 sm:text-lg text-justify tracking-tight">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
          dolores ad iusto. Eveniet quam numquam non excepturi animi,
          architecto, maiores doloremque cupiditate labore autem nisi, cumque
          in!.
        </p>
      </div>
    </div>
  );
};

export default FeatureBox;
