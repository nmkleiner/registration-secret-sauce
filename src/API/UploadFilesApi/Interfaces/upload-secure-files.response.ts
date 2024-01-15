export interface UploadSecureFilesResponse {
  success: boolean;
  data: UploadSecureFilesResponseDto[];
}

export interface UploadSecureFilesResponseDto extends UploadSecureFileResponseDto {
  fileTopic: string;
}

export interface UploadPhase2FilesResponseDto {
  Document_URL: string;
  File_Name: string;
  Readable_URL: string;
  Short_File_Name: string;
  id: string;
}

export interface UploadSecureFileResponseDto {
  key: string;
  bucket_name: string;
}

export interface UploadedPhase2Attachment {
  id: string;
  Document_URL: string;
  Readable_URL: string;
  File_Name: string;
  Short_File_Name: string;
}

export interface UploadedPhase2Attachments {
  data: UploadedPhase2Attachment[];
}
