import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
// import { I18nContext } from 'nestjs-i18n';
import { ApiResponseStatus } from 'src/core/enums/api-response-status.enum';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
// import { ERROR_KEYS } from 'src/core/constants/translations.constants';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const i18n = I18nContext.current();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      // i18n?.t(ERROR_KEYS.INTERNAL_SERVER_ERROR) ?? 'Internal server error';
      'Internal server error'; // TODO: Add translation

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null && 'message' in res) {
        const resMessage = (res as { message: string | string[] }).message;
        message = resMessage;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const apiResponse: ApiResponse<null> = {
      status: ApiResponseStatus.FAILED,
      message: Array.isArray(message) ? message.join(', ') : message,
      data: null,
    };

    return response.status(status).json(apiResponse);
  }
}
