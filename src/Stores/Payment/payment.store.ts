import { defineStore } from "pinia";
import { PaymentState } from "./payment-state.interface";
import { useFormNavigationStore } from "../FormNavigation/form-navigation.store";
import { PaymentData } from "../../Interfaces";

export const usePaymentStore = defineStore("Payment", {
  state: (): PaymentState => ({
    allowPayment: false,
    date: "",
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
      this.status = "Paid";
      this.allowPayment = false;
      this.date = new Date().toISOString();

      const submitSection = useFormNavigationStore().allSections?.find(
        (section) => isSubmitSection(section)
      );
      submitSection.isCompleted = true;
    },
  },
});
