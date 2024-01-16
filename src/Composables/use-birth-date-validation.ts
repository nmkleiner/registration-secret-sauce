import { useUserStore } from '../Stores/User/user.store';
import dayjs from 'dayjs';
import { useCountryStore } from '../Stores/Country/country.store';
import { UserLeadTypeEnum } from '../Enums/user-lead-type.enum';

const ageInYears = ref(null);
const ageInDays = ref(null);
const isBetweenAgeActive = ref(false);

export function useUserAgeValidation() {
  //TODO: Check with Noam if to disable all logic with useUserStore().registrationAgeRange;
  const { min, max, criticalAge } = useUserStore().registrationAgeRange;

  const betweenAges = computed(
    () => ageInYears.value !== null && ageInYears.value >= criticalAge && ageInYears.value < min,
  );
  const criticalAgeUnderMin = computed(
    () => ageInYears.value !== null && ageInYears.value < criticalAge,
  );
  const ageOverMax = computed(() => ageInYears.value !== null && ageInYears.value > max);
  const hasAgeWarning = computed(
    () => criticalAgeUnderMin.value || ageOverMax.value || betweenAges.value,
  );

  function handleBirthDateSelected(date: string) {
    const formattedDateOfBirth = dayjs(date, useCountryStore().dateFormat).format('YYYY-MM-DD');
    ageInYears.value = dayjs().diff(formattedDateOfBirth, 'year');
    ageInDays.value = dayjs().diff(formattedDateOfBirth, 'day');
  }

  const isOverMaxAge = (leadType: string | null): boolean => {
    return leadType === UserLeadTypeEnum.overMaxAge;
  };
  const isBetweenAges = (leadType: string | null): boolean => {
    isBetweenAgeActive.value = leadType === UserLeadTypeEnum.betweenAges;
    return leadType === UserLeadTypeEnum.betweenAges;
  };

  const isUnderMinPossibleAgeErrorMsg = (errorMessage: string | null = null): boolean => {
    return errorMessage === UserLeadTypeEnum.underMinPossibleAgeErrorMsg;
  };

  return {
    isUnderMinPossibleAgeErrorMsg,
    isOverMaxAge,
    isBetweenAges,
    betweenAges,
    hasAgeWarning,
    handleBirthDateSelected,
    isBetweenAgeActive
  };
}
