import { useConfig } from "../Config/use-config.ts";

export function useGenerateNameStyle() {
  const classNameAndProduct = (baseClassName: Array<string | object>) => {
    const currentProduct = useConfig().getProduct().toLowerCase();

    return [...baseClassName, currentProduct];
  };
  return { classNameAndProduct };
}
