import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { I18nContext } from 'nestjs-i18n';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { ApiResponseStatus } from 'src/core/enums/api-response-status.enum';
// import { COMMON_KEYS } from 'src/core/constants/translations.constants';
import { Response } from 'express';

export function successResponse<T = null>(args?: {
  data?: T | null;
  message?: string;
  httpCode?: number;
}): ApiResponse<T | null> {
  const { data = null, message, httpCode = HttpStatus.OK } = args ?? {};
  // const i18n = I18nContext.current();
  return {
    status: ApiResponseStatus.SUCCESS,
    // message: message ?? i18n?.t(COMMON_KEYS.SUCCESS) ?? 'Success',
    message: 'Success',
    data,
    httpCode,
  };
}

export function errorResponse<T = null>(args?: {
  message?: string;
  data?: T | null;
  httpCode?: number;
}): ApiResponse<T | null> {
  const {
    message,
    data = null,
    httpCode = HttpStatus.BAD_REQUEST,
  } = args ?? {};
  // const i18n = I18nContext.current();

  const result = {
    status: ApiResponseStatus.FAILED,
    // message: message ?? i18n?.t(COMMON_KEYS.FAILED) ?? 'Failed',
    message: 'Failed',
    data,
    httpCode,
  };

  return result;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return (next.handle() as Observable<ApiResponse<T>>).pipe(
      map((data: ApiResponse<T>) => {
        const response = context.switchToHttp().getResponse<Response>();

        if (data.httpCode && typeof data.httpCode === 'number') {
          response.status(data.httpCode);
        } else if (
          response.statusCode === 200 &&
          data.status === ApiResponseStatus.FAILED
        ) {
          response.status(HttpStatus.BAD_REQUEST);
        } else if (
          response.statusCode === 200 &&
          data.status === ApiResponseStatus.SUCCESS
        ) {
          response.status(HttpStatus.OK);
        }

        return {
          status: data.status,
          message: data.message,
          data: data.data,
        };
      }),
    );
  }
}
