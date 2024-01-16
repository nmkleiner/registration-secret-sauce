import {
  AuthenticateResponse,
  CheckDetailsResponse,
  ControlQuestionsResponse,
  CreateAccountResponse,
  EmailExistResponse,
} from '../../API/AuthApi/auth-api.interfaces';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { DocumentType } from '../../Enums/document-type.enum';
import { DocumentStatus } from '../../Enums/document-status.enum';
import { useModalsStore } from '../Modals/modals.store';
import { UserState } from './user-state.interface';
import { useCountryStore } from '../Country/country.store';
import { BasicInput } from '../../Entities/FormElements';
import { ModalNames } from '../Modals/modals-state.interface';
import { ContactDetails } from '../../../../excel-registration-front/src/Modules/Excel/Interfaces/Profile/contact-details';
import { AuthApi, ContactDataApi, UserRegistrationApi } from '../../API';
import { sortObjectsByProperty } from '../../../../excel-registration-front/src/Core/Helpers/sort-objects-by-property';
import { ApplicationItem } from '../../../../excel-registration-front/src/Modules/Excel/Interfaces/Profile/application-item.interface';
import {
  ContactInformation,
  UserDocument,
  UserPhase2Document,
} from '../../Interfaces/contact-data.interfaces';
import { ApplicationTransformer } from '../../../../excel-registration-front/src/Modules/Excel/Transformers/application.transformer';
import ExcelGoogleTagManager from '../../../../excel-registration-front/src/Modules/Excel/Managers/ExcelGoogleTagManager/excel-google-tag.manager';
import { IsraelPassport } from '../../API/FormBuilderApi/Interfaces/excel-get-form-data-response.interface';
import UploadFilesApi from '../../API/UploadFilesApi/upload-files-api';
import { useSeasonStore } from '../Season/season.store';
import { useApplicationStore } from '../Application/application.store';
import { OnwardQuestionUniqueNames } from '../../../../excel-registration-front/src/Modules/Onward/Enums/onward-question-names.enum';
import { useDropdownOptionsStore } from '../DropdownOptions/dropdown-options.store';
import { useCreateAccountAnswers } from '../../Composables/use-create-account-answers';
import { useProduct } from '../../../../excel-registration-front/src/Core/Composables/program/useProduct';
import ReturningApplicantsForm from '../../../../excel-registration-front/src/Modules/Onward/Creators/ReturningApplicantForm/ReturningApplicantsForm';
import { ControlQuestionReturningApplicant } from '../../../../excel-registration-front/src/Modules/Onward/Interfaces/control-question-returning-applicant';
// import { useLogin } from '@/Core/Composables/login/useLogin';
// import router from '@/Modules/Common/Router';
// import { OnwardPathNames } from '@/Modules/Onward/Router/path-names.enum';

export const useUserStore = defineStore('User', {
  state: (): UserState => ({
    ids: {
      contactId: useStorage('contactId', ''),
      activeApplicationId: '',
    },
    returningApplicantForm: ReturningApplicantsForm,
    contactInformation: {
      firstName: '',
      lastName: '',
      mobilePhone: '',
      email: '',
      secondaryEmail: '',
      dateOfBirth: '',
      countryOfBirth: '',
      mailingCountry: '',
      mailingCountryCode: '',
      gender: '',
      profilePicture: '',
      hasLivingParent: true,
    },
    contactDocuments: [],
    phase2Documents: [],
    applicationsList: [],
    profileLocalFile: null,
    isAuthenticated: false,
    registrationAgeRange: {
      min: null,
      max: null,
      criticalAge: null,
    },
  }),
  getters: {
    fullName(): string {
      const { firstName, lastName } = this.contactInformation;
      return `${firstName} ${lastName}`;
    },
    sortedApplications(): ApplicationItem[] {
      return sortObjectsByProperty(this.applicationsList, 'seasonCode', 'DESC');
    },
    applicationId(): string {
      return this.ids.activeApplicationId;
    },
  },
  actions: {
    emailExist(email: string): Promise<EmailExistResponse> {
      const countryIsoCode = useCountryStore().productCountryIsoCode;
      return AuthApi.emailExist(email, countryIsoCode);
    },
    setEmail(email: string) {
      this.contactInformation.email = email;
    },
    sendTempCode(email: string) {
      const countryIsoCode = useCountryStore().productCountryIsoCode;
      return AuthApi.sendTempCode(email, countryIsoCode);
    },
    loginRequest(password: string) {
      const email = this.contactInformation.email;
      const countryIsoCode = useCountryStore().productCountryIsoCode;
      return AuthApi.loginRequest(email, password, countryIsoCode);
    },
    checkDetailsRequest(createAccountInputs: BasicInput[]): Promise<CheckDetailsResponse> {
      const userAnswers = useCreateAccountAnswers().getAnswers(createAccountInputs);

      return AuthApi.checkDetails(userAnswers);
    },
    async createAccountRequest(createAccountInputs: BasicInput[]): Promise<CreateAccountResponse> {
      const userAnswers = useCreateAccountAnswers().getAnswers(createAccountInputs);

      return await AuthApi.createAccount(userAnswers);
    },
    async authenticate() {
      if (this.isAuthenticated) {
        return;
      }

      const user = await AuthApi.authenticate();

      if (user) {
        this.contactInformation.email = user.email;

        this.setIds(user);
        useCountryStore().initCountry(user);
        this.isAuthenticated = true;

        if (useProduct().isOnward.value) {
          useUserStore().returningApplicantForm.initApplicationIdAndCreatedDateFields(
            user.application_id,
            user.onward_active_application_created_date,
          );
        }
      }

      return user;
    },

    async controlQuestionRequest(
      payload: ControlQuestionReturningApplicant,
    ): Promise<ControlQuestionsResponse> {
      return AuthApi.controlQuestionRequest(payload);
    },
    async getProfilePageData() {
      await Promise.all([
        this.getMyApplications(),
        this.getContactProfileData(),
        useSeasonStore().getAvailableSeasons(),
        useDropdownOptionsStore().fetchCountries(),
      ]);
    },
    async getMyApplications() {
      const applications = await UserRegistrationApi.getApplications(this.ids.contactId);

      this.applicationsList = ApplicationTransformer.transform(applications);
    },
    async getContactProfileData() {
      const contactProfileData = await ContactDataApi.getContactProfileData(this.ids.contactId);
      this.setContactInformation(contactProfileData);
    },
    setIds(user: AuthenticateResponse['user']) {
      const {
        contact_id: contactId,
        application_id: applicationId,
        onward_active_application: onwardApplicationId,
      } = user;
      ExcelGoogleTagManager.init(contactId);
      this.ids.contactId = contactId;

      if (useProduct().isOnward.value && onwardApplicationId) {
        this.ids.activeApplicationId = onwardApplicationId;
      } else {
        this.ids.activeApplicationId = applicationId;
      }
    },
    setApplicationId(applicationId: string) {
      this.ids.activeApplicationId = applicationId;
    },
    setContactInformation(contactData: ContactInformation) {
      this.contactInformation.firstName = contactData.firstName || '';
      this.contactInformation.lastName = contactData.lastName || '';
      this.contactInformation.email = contactData.email || '';
      this.contactInformation.dateOfBirth = contactData.dateOfBirth || '';
      this.contactInformation.profilePicture = contactData.profilePicture || '';
      this.contactInformation.mailingCountry = contactData.mailingCountry || '';
      this.contactInformation.mailingCountryCode = contactData.mailingCountryCode || '';
      this.contactInformation.gender = contactData.gender || '';
      this.contactInformation.secondaryEmail = contactData.secondaryEmail || '';
      this.contactInformation.countryOfBirth = contactData.countryOfBirth || '';
      this.contactInformation.mobilePhone = contactData.mobilePhone || '';
    },
    setContactDocuments(contactDocuments: UserDocument[]) {
      this.contactDocuments = contactDocuments;
    },
    setPhase2Documents(phase2Documents: UserPhase2Document[]) {
      this.phase2Documents = phase2Documents;
    },
    setContactHasLivingParent(hasLivingParent?: boolean) {
      if (hasLivingParent === undefined) {
        const hasLivingParentInput =
          useApplicationStore().formElementsManager.getFormElementByUniqueName(
            OnwardQuestionUniqueNames.hasLivingParent1,
          );
        this.contactInformation.hasLivingParent = hasLivingParentInput?.value === 'Yes';
      } else {
        this.contactInformation.hasLivingParent = hasLivingParent;
      }
    },
    setIsraelPassport(israelPassport: IsraelPassport) {
      this.contactDocuments.push({
        id: israelPassport.id,
        formId: israelPassport.id,
        value: israelPassport.documentUrl,
        type: DocumentType.IsraeliPassport,
        documentStatus: DocumentStatus.Uploaded,
      });
    },
    setContactId(contactId: string) {
      this.ids.contactId = contactId;
    },
    async updateContactDetails(contactDetails: ContactDetails) {
      const profilePicture = this.profileLocalFile
        ? await UploadFilesApi.uploadAttachments(this.profileLocalFile)
        : this.contactInformation.profilePicture;

      const { contactId, activeApplicationId } = this.ids;
      await ContactDataApi.updateContactDetails({
        contactDetails,
        applicationId: activeApplicationId,
        contactId,
        profilePicture,
      });

      await this.getContactProfileData();
    },
    async updateProfilePicture() {
      useModalsStore().openModal(ModalNames.uploadWaitFileModal);
      const profilePicture = this.profileLocalFile
        ? await UploadFilesApi.uploadAttachments(this.profileLocalFile)
        : this.contactInformation.profilePicture;
      useModalsStore().closeModal(ModalNames.uploadWaitFileModal);

      const { contactId, activeApplicationId } = this.ids;
      await ContactDataApi.updateContactDetails({
        applicationId: activeApplicationId,
        contactId,
        profilePicture,
      });
    },

    setProfileLocalFile(file: File) {
      let formData = new FormData();
      formData.append('file', file);

      this.profileLocalFile = formData;
    },
    async getCreateAccountData() {
      const createAccountData = await AuthApi.getCreateAccountData();

      this.registrationAgeRange = {
        min: parseInt(createAccountData.min),
        max: parseInt(createAccountData.max),
        criticalAge: parseInt(createAccountData.criticalAge),
      };
    },
    cleanState() {
      this.isAuthenticated = false;
      this.ids.contactId = '';
      this.ids.activeApplicationId = '';
      this.contactInformation = {
        firstName: '',
        lastName: '',
        mobilePhone: '',
        email: '',
        secondaryEmail: '',
        dateOfBirth: '',
        countryOfBirth: '',
        mailingCountry: '',
        mailingCountryCode: '',
        gender: '',
        profilePicture: '',
        hasLivingParent: true,
      };
    },
  },
});
