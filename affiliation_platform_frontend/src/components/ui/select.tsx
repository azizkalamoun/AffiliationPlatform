import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "border focus:bg-white focus:text-black dark:text-white bg-background text-gray-500 text-sm rounded-md focus:ring-gray-600-500 focus:border-gray-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400dark:focus:ring-gray-500 dark:focus:border-gray-500 hover:cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export { Select };
