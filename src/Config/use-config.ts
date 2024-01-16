import { reactive, ref } from "vue";
import { TaglitProduct } from "../Enums/taglit-product.enum.ts";

export interface AppConfig {
  VITE_ENVIRONMENT: string;
  VITE_BASE_API_URL: string;
  VITE_WEBSITE_URL: string;
  jwt: string;
}

const appConfig = reactive<AppConfig>({
  VITE_ENVIRONMENT: "",
  VITE_BASE_API_URL: "",
  VITE_WEBSITE_URL: "",
  jwt: "",
});
const product = ref<TaglitProduct>(null);

export function useConfig() {
  function setAppConfig(key: keyof AppConfig, value: string): void {
    appConfig[key] = value;
  }

  function getConfig(key: keyof AppConfig): string {
    if (!appConfig[key]) {
      console.error(
        `Config key ${key} is not defined, use setAppConfig to set it`
      );
    }

    return appConfig[key];
  }

  function setProduct(value: TaglitProduct) {
    product.value = value;
  }

  function getProduct(): TaglitProduct {
    return product.value;
  }

  return {
    getConfig,
    setAppConfig,
    setProduct,
    getProduct,
  };
}
