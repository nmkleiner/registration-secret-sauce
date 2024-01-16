import { IsOpen } from "../BaseClasses/is-open";
import { translate } from "../../../../excel-registration-front/src/Core/Translations/vue-i18n";
import { RawQuestion } from "registration-secret-sauce";
import { RawFormSection } from "registration-secret-sauce";
import { SectionInterface } from "./section.interface";
import {
  FileUserAnswer,
  UploadedFile,
  UserAnswer,
} from "registration-secret-sauce";
import {
  UploadPhase2FilesResponseDto,
  UploadSecureFilesResponse,
  UploadSecureFilesResponseDto,
} from "registration-secret-sauce";
import { isEmpty, keyBy } from "lodash-es";
import { UserRegistrationApi } from "registration-secret-sauce";
import { useUserStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/User/user.store";
import { useModalsStore } from "registration-secret-sauce";
import { FileInput } from "../FormElements/file-input";
import {
  EXCEL_SAVE_BUTTON_OFF_LIST,
  ONWARD_SAVE_BUTTON_OFF_LIST,
} from "registration-secret-sauce";
import { useCountryStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Country/country.store";
import { BasicInput } from "../FormElements";
import UploadFilesApi from "registration-secret-sauce";
import { ModalNames } from "registration-secret-sauce";
import { isFileInput } from "../FormElements/Helpers/is-file-input";
import { useApplicationStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/Application/application.store";
import { sortObjectsByProperty } from "../../../../excel-registration-front/src/Core/Helpers/sort-objects-by-property";
import { useFormNavigationStore } from "../../../../../../registration-secret-sauce/src/Stores/Stores/FormNavigation/form-navigation.store";
import { formElementsFactory } from "../../Factories/form-elements.factory";
import {
  addContactEmailValidationRules,
  addContactPhoneValidationRules,
  addParentsEmailValidationRules,
  addParentsPhonesValidationRules,
} from "../../../../excel-registration-front/src/Core/Validation/assign-validation-rules";
// import ExcelGoogleTagManager from '@/Modules/Excel/Managers/ExcelGoogleTagManager/excel-google-tag.manager';
import {
  DocumentResponse,
  OnwardSaveSectionResponse,
  SaveSectionResponse,
} from "registration-secret-sauce";
import {
  SectionNames,
  sectionsWithLoaderOnSave,
} from "registration-secret-sauce";
// import { useInternshipPreferencesStore } from '@/Modules/Excel/Stores/InternshipPreferences/internship-preferences.store';
import { useProduct } from "../../../../excel-registration-front/src/Core/Composables/program/useProduct";
import { TaglitProduct } from "registration-secret-sauce";
import { OnwardErrorMessageEnum } from "../../../../excel-registration-front/src/Modules/Onward/Enums/onward-error-message.enum";
import { OnwardSectionNames } from "../../../../excel-registration-front/src/Modules/Onward/Enums/onward-section-names.enum";
import { RegistrationTab } from "../Tab/registration-tab";
import { RepetitiveQuestion } from "../FormElements/repetitive-question";
import { HiddenInput } from "../FormElements/hidden-input";
import {
  // isExcelPushResponse,
  isOnwardPushResponse,
} from "registration-secret-sauce";

export class FormSection extends IsOpen implements SectionInterface {
  public id: string;
  public tab: RegistrationTab;
  public name: string;
  public fieldName: string;
  public uniqueName: string;
  public order: number;
  public inputs: BasicInput[];
  public columns: number = 3;
  public isCompleted: boolean;
  public buttonDisabled: boolean = false;
  public saveButtonText: string;
  public isEditAfterSubmit: boolean;
  public isLocked: boolean = false;
  public isSaveAndLock: boolean = false;
  public isVisible: boolean = true;
  public saveInProcess: boolean = false;
  public registrationPhase: number;
  private isSaveButtonActive: boolean = true;

  constructor(rawFormSection: RawFormSection, tab: RegistrationTab) {
    super();
    this.tab = tab;
    this.id = rawFormSection.id;
    this.name = rawFormSection.name;
    this.order = rawFormSection.order;
    this.columns = rawFormSection.numberOfColumns;
    this.fieldName = this.getFieldName(rawFormSection);
    this.uniqueName = this.getUniqueName(rawFormSection);
    this.isCompleted = Boolean(rawFormSection.completedAt);
    this.isEditAfterSubmit = rawFormSection.isEditAfterSubmit;
    this.isSaveAndLock = rawFormSection.isSaveLock;
    this.registrationPhase = rawFormSection.registrationPhase;
    this.saveButtonText = this.calculateSaveButtonText();
    this.inputs = this.buildInputs(rawFormSection.formFields);
    this.initializeRepetitiveQuestions();
    this.addValidationRules();
    this.saveButtonIsActive(rawFormSection);
    this.checkIfSectionIsLocked();
    this.setIsVisibility();
  }

  public async save(
    isValid?: boolean,
    isSaveProcess: boolean = false
  ): Promise<void> {
    const { isPhase2Application, activationStatus } = useApplicationStore();
    const allowEditAfterSubmit =
      this.isEditAfterSubmit &&
      !isPhase2Application &&
      activationStatus !== "Inactive";
    //  prevent saving if not all required inputs are valid and section is not marked as editable after submit
    if (isValid === false && !allowEditAfterSubmit) {
      return;
    }

    this.activateLoader();
    this.saveInProcess = true;
    this.close();
    useFormNavigationStore().handleSectionSave(this);
    if (!useProduct().isOnward.value) {
      this.isCompleted = true;
      this.tab.evaluateCompleted();
    }

    if (
      this.isSaveAndLock ||
      (this.isOnwardConsularChecks && this.isCompleted)
    ) {
      this.lock();
    }

    const formSectionId = this.id;
    const countryIsoCode = useCountryStore().productCountryIsoCode;
    const { contactId, activeApplicationId: applicationId } =
      useUserStore().ids;
    const { throwError, isPhase2Submission } = useApplicationStore();
    const uploadedFiles = await this.getUploadedFiles();
    await this.getUploadedFilesOnwardPhase2(); // should be above getAnswersFromInputs()
    const userAnswers = this.getAnswersFromInputs();
    const isPhase2SaveProcess = isSaveProcess && this.registrationPhase === 2;
    const partialSubmit =
      (allowEditAfterSubmit && isValid === false) || isPhase2SaveProcess;

    this.resetAllErrorsProgram();

    // this.fireGoogleTagManagerEvent();
    const response = await UserRegistrationApi.submitSection({
      throwError,
      contactId,
      applicationId,
      userAnswers,
      uploadedFiles,
      formSectionId,
      countryIsoCode,
      isPhase2Submission,
      partialSubmit,
    });

    this.saveInProcess = false;
    this.deactivateLoader();
    if (response.success) {
      this.handleSaveSuccess(response, partialSubmit);
    } else {
      return this.handleFailedSave();
    }
  }

  public lock() {
    const { isPhase2Application, activationStatus } = useApplicationStore();
    //  if section is marked as editable after submit, and applicant is not moved to phase 2, and application is not inactive - do not lock section
    const allowEditAfterSubmit =
      this.isEditAfterSubmit &&
      !isPhase2Application &&
      activationStatus !== "Inactive";
    if (allowEditAfterSubmit) {
      return;
    }

    this.isLocked = true;
    if (this.inputs) {
      this.inputs.forEach((input) => input.lock());
    }
  }

  public unlock() {
    this.isLocked = false;
    if (this.inputs) {
      this.inputs.forEach((input) => input.unlock());
    }
  }

  public disableButton() {
    this.buttonDisabled = true;
  }

  public enableButton() {
    this.buttonDisabled = false;
  }

  public calculateSaveButtonText() {
    return this.isSaveAndLock
      ? translate("general.buttons.saveAndLock")
      : translate("general.buttons.save");
  }

  public fas(isCompleted: boolean) {
    this.isCompleted = isCompleted;
  }

  protected async getUploadedFiles(): Promise<UploadedFile[]> {
    const inputFiles = this.getFileInputs();

    if (this.isOnwardConsularChecks) {
      return;
    }
    if (isEmpty(inputFiles)) {
      return;
    }
    const userAnswersFiles = this.getFilesUserAnswers(inputFiles);

    if (!isEmpty(userAnswersFiles)) {
      if (useProduct().isExcel.value) {
        useModalsStore().openModal(ModalNames.uploadWaitFileModal);
      }

      const files: FileUserAnswer[] = [];
      const largeFiles: FileUserAnswer[] = [];

      const largeFileSize = 10 * 1024 ** 2;
      userAnswersFiles.forEach((file: FileUserAnswer) => {
        file.value.size >= largeFileSize
          ? largeFiles.push(file)
          : files.push(file);
      });

      const uploadedFiles = await this.uploadFiles(files);
      const uploadedLargeFiles = await this.uploadLargeFiles(largeFiles);

      useModalsStore().closeModal(ModalNames.uploadWaitFileModal);

      return [...uploadedFiles, ...uploadedLargeFiles].map(
        (uploadedFile): UploadedFile => {
          const input = inputFiles.find(
            (input) => input.fileTopic === uploadedFile.fileTopic
          );
          return {
            ...uploadedFile,
            id: input.fileId,
            formId: input.fieldName,
            isIsraeliPassport: input.isIsraeliPassport,
          };
        }
      );
    }
  }

  protected async getUploadedFilesOnwardPhase2(): Promise<UploadedFile[]> {
    const inputFiles = this.getFileInputs();

    if (!this.isOnwardConsularChecks) {
      return;
    }
    if (isEmpty(inputFiles)) {
      return;
    }
    const userAnswersFiles = this.getFilesUserAnswers(inputFiles);

    if (!isEmpty(userAnswersFiles)) {
      const uploadFilesResponseDtos = await this.uploadPhase2Attachments(
        userAnswersFiles
      );

      const inputsKeyedByIds = keyBy(inputFiles, (input) => input.id);
      uploadFilesResponseDtos.forEach((uploadFilesResponseDto) => {
        const selectedInput = inputsKeyedByIds[uploadFilesResponseDto.id];

        if (
          selectedInput &&
          uploadFilesResponseDto.Document_URL &&
          uploadFilesResponseDto.Readable_URL
        ) {
          selectedInput.setPhase2Fields(uploadFilesResponseDto);
        }
      });
      useModalsStore().closeModal(ModalNames.uploadWaitFileModal);
    }
  }

  public async scrollToSection() {
    await nextTick();
    const sectionElement = document.getElementById(this.id);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  public get saveButtonActive() {
    return this.isSaveButtonActive;
  }

  protected getAnswersFromInputs(): UserAnswer[] {
    const visibleInputs = this.inputs.filter((input) => input.isVisible);
    const hiddenInputs = this.inputs.filter(
      (input): input is HiddenInput => input instanceof HiddenInput
    );
    const userAnswers = [...visibleInputs, ...hiddenInputs].map((input) => {
      if (input instanceof FileInput && this.isOnwardConsularChecks) {
        return input.getAnswerForConsularCheck();
      }
      return input.getAnswer();
    });

    const repetitiveQuestions = this.repetitiveQuestions;

    if (!isEmpty(repetitiveQuestions)) {
      userAnswers.push(
        ...repetitiveQuestions.map((question) => question.getDuplicatedAnswer())
      );
    }

    return userAnswers.filter((answer) => Boolean(answer));
  }

  protected getFileInputs(): FileInput[] | null {
    const fileInputs = this.inputs.filter(isFileInput);
    if (isEmpty(fileInputs)) {
      return null;
    }
    return fileInputs;
  }

  protected getFilesUserAnswers(
    fileInputs: FileInput[]
  ): FileUserAnswer[] | null {
    const filesAnswers: FileUserAnswer[] = [];
    fileInputs?.map((input) => {
      const inputAnswer = input.getAnswer();
      if (inputAnswer) {
        filesAnswers.push(inputAnswer);
      }
    });
    if (isEmpty(filesAnswers)) {
      return null;
    }
    return filesAnswers;
  }

  protected saveButtonIsActive(rawFormSection: RawFormSection): void {
    switch (useProduct().product.value) {
      case TaglitProduct.EXCEL:
        this.isSaveButtonActive = !EXCEL_SAVE_BUTTON_OFF_LIST.includes(
          rawFormSection.mappings?.uniqueName
        );
        break;
      case TaglitProduct.ONWARD:
        this.isSaveButtonActive = !ONWARD_SAVE_BUTTON_OFF_LIST.includes(
          rawFormSection.mappings?.uniqueName
        );
    }
  }

  get isOnwardConsularChecks(): boolean {
    return (
      useProduct().isOnward.value &&
      this.uniqueName === OnwardSectionNames.consularChecks
    );
  }

  private checkIfSectionIsLocked() {
    if (this.isCompleted && this.isSaveAndLock) {
      this.lock();
    }

    if (this.isOnwardConsularChecks && this.isCompleted) {
      this.lock();
    }
  }

  private async uploadFiles(
    fileUserAnswers: FileUserAnswer[]
  ): Promise<UploadSecureFilesResponseDto[]> {
    const formData = new FormData();

    fileUserAnswers.forEach((fileUserAnswer) => {
      formData.append(fileUserAnswer.type, fileUserAnswer.value);
    });

    try {
      const uploadSecureFilesResponse: UploadSecureFilesResponse =
        await UploadFilesApi.uploadFiles(formData);

      return uploadSecureFilesResponse.data;
    } catch (error) {
      alert("Error uploading files");
    }
  }

  private async uploadPhase2Attachments(
    fileUserAnswers: FileUserAnswer[]
  ): Promise<UploadPhase2FilesResponseDto[]> {
    const { contactId, activeApplicationId } = useUserStore().ids;

    const formData = new FormData();

    fileUserAnswers.forEach((fileUserAnswer) => {
      formData.append(fileUserAnswer.key, fileUserAnswer.value);
    });

    try {
      return UploadFilesApi.uploadPhase2Attachments(
        formData,
        contactId,
        activeApplicationId
      );
    } catch (error) {
      alert("Error uploading files");
    }
  }

  private async uploadLargeFiles(
    fileUserAnswers: FileUserAnswer[]
  ): Promise<Awaited<UploadSecureFilesResponseDto>[]> {
    return Promise.all(
      fileUserAnswers.map(
        async (
          fileUserAnswer: FileUserAnswer
        ): Promise<UploadSecureFilesResponseDto> => {
          const response = await UploadFilesApi.uploadFileChunks(
            fileUserAnswer.value
          );

          return {
            ...response,
            fileTopic: fileUserAnswer.type,
          };
        }
      )
    );
  }

  private buildInputs(formFields: RawQuestion[]): BasicInput[] {
    return sortObjectsByProperty(
      formFields.map((formField) => {
        const formElement = formElementsFactory(formField, {
          name: this.name,
          columns: this.columns,
        });
        useApplicationStore().formElementsManager.addFormElement(formElement);
        return formElement;
      }),
      "sort"
    );
  }

  private initializeRepetitiveQuestions(): void {
    const removeDependentsFromFormSectionInputs = () => {
      const repetitiveQuestionsDependents: BasicInput[] =
        repetitiveQuestions.reduce((acc, repetitiveQuestion) => {
          return [
            ...acc,
            ...repetitiveQuestion.initialDependents,
            repetitiveQuestion.repetitiveButton,
          ];
        }, []);

      this.inputs = this.inputs.filter(
        (input) =>
          !keyBy(repetitiveQuestionsDependents, (item) => item.id)[input.id]
      );
    };

    const repetitiveQuestions = this.repetitiveQuestions;
    if (isEmpty(repetitiveQuestions)) {
      return;
    }

    repetitiveQuestions.forEach((repetitiveQuestion) => {
      repetitiveQuestion.initializeDependents();
    });

    removeDependentsFromFormSectionInputs();
  }

  private addValidationRules() {
    addContactEmailValidationRules(this.inputs);
    addParentsEmailValidationRules(this.inputs);
    addContactPhoneValidationRules(this.inputs);
    addParentsPhonesValidationRules(this.inputs);
  }

  private handleFailedSave(): void {
    this.isCompleted = false;
    this.tab.evaluateCompleted();
    this.unlock();

    const sectionTab = useFormNavigationStore().tabs.find((tab) => {
      return tab.sections?.includes(this);
    });

    useFormNavigationStore().setSelectedTab(sectionTab);
    this.open()?.scrollToSection();

    if (useApplicationStore().throwError) {
      useApplicationStore().toggleThrowError();
    }
  }

  // protected fireGoogleTagManagerEvent() {
  //   ExcelGoogleTagManager.fireSubmitSectionEvent(this.order);
  // }

  private async handleSaveSuccess(
    response: SaveSectionResponse,
    partialSubmit: boolean
  ): Promise<void> {
    this.updateDocumentIds(response.documents);
    useUserStore().setContactId(response.contactId);

    // if (isExcelPushResponse(response)) {
    //   useApplicationStore().updateApplicationAfterSave({
    //     phase1AllowSubmission: response.application.Phase_1_Allow_Submission__c,
    //     phase2AllowSubmission: response.application.Phase_2_Allow_Submission__c,
    //   });
    //
    //   useInternshipPreferencesStore().updateSalesforceJobOfferings();
    // }

    if (isOnwardPushResponse(response)) {
      this.updateFormIds(response);
      useApplicationStore().parentSectionManager.handleSubmit(this);

      useApplicationStore().updateApplicationAfterSave({
        phase1AllowSubmission: response.application.Phase_1_Allow_Submission__c,
        phase2AllowSubmission: false,
      });

      this.resetProgramsErrors();

      await useApplicationStore().updateDataForAlgorithmPrograms({
        gender: response.application.Gender__c,
        campusId:
          response.application[
            "ED_College_University_Name__r.Taglitom_Campus_ID__c"
          ],
        peerQuestionValue:
          response.application.First_Priority_With_Whom_Want_to_Go__c,
        studentValue: response.application.ED_Are_you_currently_a_student__c,
        isAllowAlumniRegistration:
          response.application.Allow_Alumni_Registration__c,
      });

      useApplicationStore().setIneligibleError(
        response.application.Final_Eligibility__c ===
          OnwardErrorMessageEnum.Ineligible
      );

      this.handleParentAnswer();

      this.isCompleted = true;
      this.tab.evaluateCompleted();
    }

    this.resetFileInputs();

    if (partialSubmit) {
      return;
    }
  }

  private getUniqueName(rawFormSection: RawFormSection): string {
    if (!rawFormSection.mappings) {
      return "no mapping";
    }
    return rawFormSection.mappings.uniqueName || "no mapping";
  }

  private getFieldName(rawFormSection: RawFormSection): string {
    if (!rawFormSection.mappings) {
      return "no mapping";
    }
    return rawFormSection.mappings.fieldName || "no mapping";
  }

  private activateLoader() {
    if (sectionsWithLoaderOnSave.includes(this.uniqueName as SectionNames)) {
      useModalsStore().openModal(ModalNames.pleaseWait);
    }
  }

  private deactivateLoader() {
    if (sectionsWithLoaderOnSave.includes(this.uniqueName as SectionNames)) {
      useModalsStore().closeModal(ModalNames.pleaseWait);
    }
  }

  private resetFileInputs() {
    const fileInputs = this.getFileInputs();
    if (!isEmpty(fileInputs)) {
      fileInputs.forEach((input) => input.resetFile());
    }
  }

  private updateDocumentIds(documents: DocumentResponse[]) {
    const fileInputs = this.getFileInputs();
    documents.forEach((document) => {
      fileInputs.forEach((item) => {
        if (
          document.formId === item.fileTopic ||
          document.formId === item.fieldName
        ) {
          item.fileId = document.id;
        }
      });
    });
  }

  private resetProgramsErrors(): void {
    useApplicationStore().setIneligibleError(false);
  }

  private updateFormIds(response: OnwardSaveSectionResponse) {
    const updateParentFormIds = () => {
      response.parents.forEach((parent) => {
        const parentIdInput = this.inputs.find(
          (input) => input.uniqueName === parent.Form_Id__c
        );
        if (parentIdInput) {
          parentIdInput.value = parent.Id;
        }
      });
    };
    const updateDuplicatesFormIds = () => {
      const duplicatesIds = [response.allergies, response.medications]
        .filter((ids) => !isEmpty(ids))
        .flat();

      const hiddenDependents = this.repetitiveQuestions
        .map((repetitiveQuestion) => repetitiveQuestion.getHiddenDependents())
        .flat();

      duplicatesIds.forEach((ids) => {
        hiddenDependents.forEach((hiddenInput) => {
          if (ids.Form_Id__c === hiddenInput.uniqueName) {
            hiddenInput.value = ids.Id;
          }
        });
      });
    };

    updateParentFormIds();
    updateDuplicatesFormIds();
  }

  private handleParentAnswer() {
    if (this.uniqueName !== OnwardSectionNames.parentInformation) {
      return;
    }

    useUserStore().setContactHasLivingParent();
  }

  private get repetitiveQuestions(): RepetitiveQuestion[] {
    return this.inputs.filter(
      (input): input is RepetitiveQuestion =>
        input instanceof RepetitiveQuestion
    );
  }

  private setIsVisibility() {
    this.isVisible = this.inputs.some((obj) => obj.isVisible);
  }

  private resetAllErrorsProgram(): void {
    useApplicationStore().setIneligibleError(false);
  }
}
