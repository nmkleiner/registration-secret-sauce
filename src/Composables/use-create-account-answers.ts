import { CreateAccountRequestData } from "../API";
import { CreateAccountInputs, GenderEnum, TaglitProduct } from "../Enums";
import { useConfig } from "../Config/use-config.ts";
import { useFormNavigationStore } from "../Stores";

export function useCreateAccountAnswers() {
  function getAnswers(
    createAccountInputs: BasicInput[]
  ): CreateAccountRequestData {
    function getCreateAccountExcelUserAnswers(
      createAccountInputs: BasicInput[]
    ): CreateAccountRequestData {
      return createAccountInputs.reduce((acc, input) => {
        const inputId = input.id as CreateAccountInputs;
        const inputValue = input.getValueForAnswer() as string;

        if (input instanceof PhoneInput) {
          acc[inputId] = `(${input.countryPrefix})-${inputValue}`;
        } else {
          acc[inputId] = inputValue;
        }
        return acc;
      }, {} as CreateAccountRequestData);
    }

    function getCreateAccountOnwardUserAnswers(
      createAccountInputs: BasicInput[]
    ): CreateAccountRequestData {
      const createAccountRequestData = createAccountInputs.reduce(
        (acc, input) => {
          const inputId = input.id as OnwardCreateAccountInputs;
          const inputValue = input.getValueForAnswer() as string;

          if (input instanceof PhoneInput) {
            acc[inputId] = `(${input.countryPrefix})-${inputValue.replaceAll(
              "-",
              ""
            )}`;
          } else {
            acc[inputId] = inputValue;
          }

          acc[OnwardCreateAccountInputs.GENDER] = GenderEnum.UNKNOWN;

          return acc;
        },
        {} as CreateAccountRequestData
      );

      createAccountRequestData.urlParams = buildUrlParams();

      return createAccountRequestData;
    }

    const product = useConfig().getProduct();
    switch (product) {
      case TaglitProduct.EXCEL:
        return getCreateAccountExcelUserAnswers(createAccountInputs);
      case TaglitProduct.ONWARD:
        return getCreateAccountOnwardUserAnswers(createAccountInputs);
    }
  }

  return {
    getAnswers,
  };
}

export function buildUrlParams(): {
  full_url: string;
} & Record<string, string> {
  return {
    ...useFormNavigationStore().queryParams,
    full_url: useFormNavigationStore().fullLoginUrl,
  };
}
