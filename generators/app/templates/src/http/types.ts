import {
  AxiosBasicCredentials,
  AxiosProxyConfig,
  AxiosRequestHeaders,
  Method,
  ResponseType,
} from 'axios';

export interface ErrorHandler {
  (error: any): Promise<any>;
}

export declare type ResponseData<T = any> = {
  code: number,
  errMsg: string | null,
  data: T,
};

export declare type SimpleResponse<T = any> = {
  success: boolean, // 表示本次请求成功还是失败
  data?: T
};

export declare type DataType<T = any> = ResponseData<T> | SimpleResponse<T>;

export interface ResponseTransformer<T = any> {
  (data: ResponseData<T>, headers?: AxiosRequestHeaders): SimpleResponse<T>;
}

export declare type RequestConfig<T = any> = {
  baseURL?: string;
  method?: Method,
  url: string,
  params?: any,
  data?: any,
  responseType?: ResponseType,
  httpAgent?: any;
  httpsAgent?: any;
  maxBodyLength?: number;
  maxRedirects?: number;
  maxContentLength?: number;
  timeout?: number;
  timeoutErrorMessage?: string;
  headers?: AxiosRequestHeaders;
  auth?: AxiosBasicCredentials;
  withCredentials?: boolean;
  proxy?: AxiosProxyConfig | false;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  paramsSerializer?: (params: any) => string;
  transformResponse?: ResponseTransformer<T>;
  responseErrorHandler?: ErrorHandler,
  children?: (data?: DataType<T>) => JSX.Element,
};
