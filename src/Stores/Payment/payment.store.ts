import { defineStore } from 'pinia';
import { PaymentData } from '../../Interfaces/application-data.interfaces';
import { PaymentState } from './payment-state.interface';
import { useFormNavigationStore } from '../FormNavigation/form-navigation.store';
import { isSubmitSection } from '../../../../excel-registration-front/src/Modules/Excel/Entities/Section/Helpers/is-submit-section';

export const usePaymentStore = defineStore('Payment', {
  state: (): PaymentState => ({
    allowPayment: false,
    date: '',
    status: null,
  }),
  getters: {},
  actions: {
    setPaymentState(paymentData: PaymentData) {
      this.date = paymentData.date;
      this.status = paymentData.status;
      this.allowPayment = paymentData.allowPayment;
    },
    handleSuccessfulPayment() {
      this.status = 'Paid';
      this.allowPayment = false;
      this.date = new Date().toISOString();

      const submitSection = useFormNavigationStore().allSections?.find((section) =>
        isSubmitSection(section),
      );
      submitSection.isCompleted = true;
    },
  },
});
