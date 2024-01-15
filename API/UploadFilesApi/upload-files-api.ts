import { BaseApi } from '@/Core/Infrastructure/API/base.api';
import { UploadFilesRoutes } from '@/Modules/Common/API/UploadFilesApi/upload-files-routes.enum';
import { AppHttpClient } from '@/Core/Infrastructure/HttpClient/http-client';
import {
  UploadPhase2FilesResponseDto,
  UploadSecureFileResponseDto,
  UploadSecureFilesResponse,
} from '@/Modules/Common/API/UploadFilesApi/Interfaces/upload-secure-files.response';
import { useUploadProgress } from '@/Core/Composables/uploadProgress/useUploadProgress';
import { AxiosResponse } from 'axios';

class UploadFilesApi extends BaseApi {
  public async uploadFileChunks(file: File): Promise<UploadSecureFileResponseDto> {
    const openSessionUploadLargeFile = await this.httpClient.post(
      UploadFilesRoutes.initiateChunksUpload,
      {
        original_file_name: file.name,
      },
    );
    const responseData = openSessionUploadLargeFile.data.data;

    const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks (adjust as needed)
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);

      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('index', String(chunkIndex));
      formData.append('key_name', responseData.key_name);
      formData.append('bucket_name', responseData.bucket);
      formData.append('upload_id', responseData.upload_id);

      try {
        const config = useUploadProgress().config;

        await this.httpClient.post(UploadFilesRoutes.uploadChunks, formData, config);
      } catch (error) {
        console.error('Error uploading chunk:', error);
      }
    }

    try {
      const response = await this.httpClient.post<{ data: UploadSecureFileResponseDto }>(
        UploadFilesRoutes.completeChunksUpload,
        {
          key_name: responseData.key_name,
          bucket_name: responseData.bucket,
          upload_id: responseData.upload_id,
        },
      );

      return response.data.data;
    } catch (e) {
      return null;
    }
  }

  public async uploadFiles(formData: FormData): Promise<UploadSecureFilesResponse> {
    const config = useUploadProgress().config;

    try {
      const uploadFilesResponse: UploadSecureFilesResponse = await this.httpClient.post(
        UploadFilesRoutes.secureFiles,
        formData,
        config,
      );
      return uploadFilesResponse;
    } catch (e) {
      return null;
    }
  }

  public async uploadPhase2Attachments(
    formData: FormData,
    contactId: string,
    applicationId: string,
  ): Promise<UploadPhase2FilesResponseDto[]> {
    const config = useUploadProgress().config;

    try {
      const uploadFilesResponse = await this.httpClient.post<{
        data: UploadPhase2FilesResponseDto[];
      }>(`${UploadFilesRoutes.uploadPhase2Files}/${contactId || applicationId}`, formData, config);

      return uploadFilesResponse.data.data;
    } catch (e) {
      return null;
    }
  }

  public async uploadAttachments(formData: FormData): Promise<string> {
    const config = useUploadProgress().config;

    try {
      const response: AxiosResponse = await this.httpClient.post(
        UploadFilesRoutes.uploadAttachments,
        formData,
        config,
      );

      return response?.data?.file || '';
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async downloadWaiverFile(): Promise<Blob> {
    try {
      const response: AxiosResponse = await this.httpClient.get<Blob>(UploadFilesRoutes.waiverPdf, {
        responseType: 'blob',
      });

      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default new UploadFilesApi(AppHttpClient.instance);
