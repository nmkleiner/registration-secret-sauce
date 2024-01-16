import { BasicInput } from '../Entities/FormElements';
import { CreateAccountRequestData } from '../API/AuthApi/auth-api.interfaces';
import { useProduct } from '../../../excel-registration-front/src/Core/Composables/program/useProduct';
import { TaglitProduct } from '../../../excel-registration-front/src/Core/Infrastructure/API/taglit-product.enum';
import { ExcelCreateAccountInputs } from '../../../excel-registration-front/src/Modules/Excel/Enums/excel-create-account.inputs';
import { OnwardCreateAccountInputs } from '../../../excel-registration-front/src/Modules/Onward/Enums/onward-create-account.inputs';
import { GenderEnum } from '../Enums/gender.enum';
import { useFormNavigationStore } from '../Stores/FormNavigation/form-navigation.store';
import { PhoneInput } from '../Entities/FormElements/phone-input';

export function useCreateAccountAnswers() {
  function getAnswers(createAccountInputs: BasicInput[]): CreateAccountRequestData {
    function getCreateAccountExcelUserAnswers(
      createAccountInputs: BasicInput[],
    ): CreateAccountRequestData {
      return createAccountInputs.reduce((acc, input) => {
        const inputId = input.id as ExcelCreateAccountInputs;
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
      createAccountInputs: BasicInput[],
    ): CreateAccountRequestData {
      const createAccountRequestData = createAccountInputs.reduce((acc, input) => {
        const inputId = input.id as OnwardCreateAccountInputs;
        const inputValue = input.getValueForAnswer() as string;

        if (input instanceof PhoneInput) {
          acc[inputId] = `(${input.countryPrefix})-${inputValue.replaceAll('-', '')}`;
        } else {
          acc[inputId] = inputValue;
        }

        acc[OnwardCreateAccountInputs.GENDER] = GenderEnum.UNKNOWN;

        return acc;
      }, {} as CreateAccountRequestData);

      createAccountRequestData.urlParams = buildUrlParams();

      return createAccountRequestData;
    }

    const product = useProduct().product.value;
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
