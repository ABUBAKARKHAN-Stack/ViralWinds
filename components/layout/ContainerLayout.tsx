import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
};

const ContainerLayout: FC<Props> = ({ children, className }) => {
    return (
        <div
            className={cn(
                "xsm:max-w-xl mx-auto h-full w-full max-w-full p-4 sm:max-w-2xl md:max-w-3xl lg:max-w-325 lg:px-20 2xl:max-w-375",
                className,
            )}
        >
            {children}
        </div>
    );
};

export default ContainerLayout;
