import { findLast, keyBy, last } from 'lodash-es';
import { useUserStore } from '../../Stores/User/user.store';
import { BasicInput } from './index';
import { UserDocument } from '../../Interfaces/contact-data.interfaces';
import { BaseSectionInterface } from '../Section/section.interface';
import {
  ConsularCheckFileUserAnswer,
  FileUserAnswer,
} from '../../Types/Form/user-answer.type';
import { RawFileType, RawQuestion } from '../../Interfaces/Form/question.interfaces';
import { DocumentStatus } from '../../Enums/document-status.enum';
import { UploadPhase2FilesResponseDto } from '../../API/UploadFilesApi/Interfaces/upload-secure-files.response';

export class FileInput extends BasicInput {
  public file: File;
  public allowedFileTypes: string[];
  public fileTopic: string;
  public fileId: string;
  public isAdditionalQuestion: boolean;
  private phase2Fields: UploadPhase2FilesResponseDto;

  constructor(rawQuestion: RawQuestion, formSection: BaseSectionInterface) {
    super(rawQuestion, formSection);
    this.allowedFileTypes = this.getFileTypes(rawQuestion.fileTypes);
    this.fileTopic = rawQuestion.fileTopic?.name || 'no file topic';
    this.isAdditionalQuestion = rawQuestion.isAdditionalQuestion;

    this.loadFileInputData();
    this.loadPhase2FileInputData();
    this.evaluateAdditionalQuestionVisibility();
  }

  getValueForAnswer(): File {
    return this.file;
  }

  getAnswer(): FileUserAnswer {
    const value = this.getValueForAnswer();
    if (!value) {
      return null;
    }
    return {
      isDocument: true,
      type: this.fileTopic,
      key: this.id,
      value,
    };
  }

  getAnswerForConsularCheck(): ConsularCheckFileUserAnswer {
    const value = this.getValueForAnswer();
    if (!value) {
      return null;
    }

    return {
      key: this.id,
      type: this.fileTopic,
      formId: this.uniqueName,
      isPhase2Document: true,
      isPhase2DocumentV2: true,
      fileIndex: this.label.at(-1), // label = 'Document for consular verification #1' => fileIndex = 1
      value: '',
      ...this.phase2Fields,
    };
  }

  public setPhase2Fields(uploadFilesResponseDto: UploadPhase2FilesResponseDto): void {
    this.phase2Fields = uploadFilesResponseDto;
  }

  public get isIsraeliPassport(): boolean {
    return this.objectName === 'israel_passport';
  }

  public isValidFileType(uploadedFile: File): boolean {
    if (!this.allowedFileTypes.length) {
      return true;
    }
    if (this.allFileTypesAllowed) {
      return true;
    }
    return this.allowedFileTypes.some(
      (fileType) => `.${last(uploadedFile.name.split('.'))}` === fileType,
    );
  }

  public resetFile(): void {
    this.file = null;
  }

  private get allFileTypesAllowed() {
    return this.allowedFileTypes.includes('.all');
  }

  private getFileTypes(fileTypes: RawFileType[]): string[] {
    return fileTypes.map((fileType) => {
      return fileType.type;
    });
  }

  private loadFileInputData(): void {
    if (!this.fileTopic) {
      return;
    }

    const documents = keyBy(useUserStore().contactDocuments, (document) => document.type);
    if (documents) {
      const documentData: UserDocument = documents[this.fileTopic];

      if (documentData) {
        this.fileId = documentData.id;
        if (documentData.value) {
          this.value = documentData.value;
        }
      }
    }
  }

  private loadPhase2FileInputData(): void {
    const documents = useUserStore().phase2Documents;

    if (!documents.length) {
      return;
    }

    const documentForCurrentField = findLast(
      documents,
      (document) => document.fileIndex && document.fileIndex === String(this.label.at(-1)),
    );

    if (documentForCurrentField) {
      this.fillInput(documentForCurrentField.Short_File_Name);
    }
  }

  private evaluateAdditionalQuestionVisibility(): void {
    if (!this.isAdditionalQuestion) return;

    const document = useUserStore()?.contactDocuments.find((doc) => doc.type === this.fileTopic);

    this.isVisible = !!document && document.documentStatus !== DocumentStatus.NotRequired;
  }
}
