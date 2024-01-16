import { useProduct } from '../../../excel-registration-front/src/Core/Composables/program/useProduct';

export function useGenerateNameStyle() {
  const classNameAndProduct = (baseClassName: Array<string | object>) => {
    const currentProduct = useProduct().product.value.toLowerCase();

    return [...baseClassName, currentProduct];
  };
  return { classNameAndProduct };
}
