<template>
  <TabsListMobile v-if="isMobile" />
  <TabsListDesktop v-else />
</template>

<script setup lang="ts">
import { useMobileHandler } from '@/Core/Composables/mobileHandler';
import TabsListMobile from '@/Modules/Common/Components/Form/Tab/TabsList/TabsListMobile.vue';
import TabsListDesktop from '@/Modules/Common/Components/Form/Tab/TabsList/TabsListDesktop.vue';
import { useApplicationStore } from '@/Modules/Common/Stores/Application/application.store';
import { last } from 'lodash-es';
import { useFormNavigationStore } from '@/Modules/Common/Stores/FormNavigation/form-navigation.store';
import { usePaymentStore } from '@/Modules/Common/Stores/Payment/payment.store';
import { useI18n } from 'vue-i18n';
import { useProduct } from '@/Core/Composables/program/useProduct';

const { isMobile } = useMobileHandler();

const isPhase2Application = computed(() => useApplicationStore().isPhase2Application);
const submissionTab = last(useFormNavigationStore().tabs);
const { t } = useI18n();
watch(
  isPhase2Application,
  (value) => {
    if (!useProduct().isExcel.value) {
      return;
    }
    if (!value) {
      return;
    }
    if (useApplicationStore().activePhase === 2) {
      return;
    }

    const payDeposit = 'Pay Deposit';
    submissionTab.setIcon('fa-light fa-envelope-open-dollar');
    submissionTab.text = payDeposit;
    submissionTab.sections[0].name = payDeposit;

    useFormNavigationStore().setSelectedTab(submissionTab);
    const paymentStatus = usePaymentStore().status;
    if (paymentStatus === 'Unpaid') {
      submissionTab.setNotCompleted(true);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
@import 'src/assets/style/abstract/breakpoints';

.tabsList {
  display: flex;
  margin-bottom: 40px;

  @include phone {
    margin-bottom: 24px;
  }
}
</style>
