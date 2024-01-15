import { AxiosProgressEvent, AxiosRequestConfig } from "axios";
import { ref } from "vue";

const progressPercentage = ref(0);
export function useUploadProgress() {
  const setProgressPercentage = (value: number) => {
    progressPercentage.value = value;
  };

  const config: AxiosRequestConfig = {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      setProgressPercentage(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      );
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return {
    config,
    progressPercentage,
    setProgressPercentage,
  };
}
