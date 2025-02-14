import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { AzureBlobStorageService } from '@training-insights/shared/file-storage';

const FIT_CONTENT_TYPE = 'application/fit';
const CONTAINER_NAME = 'fit-files';

const storageService = new AzureBlobStorageService(
  process.env.STORAGE_CONNECTION_STRING || 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1'
);

export const fileRouter = router({
  upload: protectedProcedure  // Using protected procedure to ensure auth
    .input(z.object({
      fileName: z.string(),
      contentType: z.string(),
      fileBuffer: z.instanceof(Buffer)
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        await storageService.createContainer(CONTAINER_NAME);
        
        const file = await storageService.uploadFile(
          CONTAINER_NAME,
          input.fileName,
          input.fileBuffer,
          { contentType: input.contentType }
        );

        return { file };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload file',
          cause: error
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({
      fileName: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        await storageService.deleteFile(CONTAINER_NAME, input.fileName);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete file',
          cause: error
        });
      }
    })
});