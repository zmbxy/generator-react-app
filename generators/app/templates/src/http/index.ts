import axios, {
  Method,
  AxiosInstance,
  ResponseType,
  CustomParamsSerializer,
  RawAxiosRequestHeaders,
  AxiosResponse,
  AxiosError,
} from 'axios';
import qs from 'qs';

interface HeadersFunc {
  (): RawAxiosRequestHeaders;
}

interface IResponse<T> {
  code: number,
  errMsg: string | null;
  data: T;
}

type FileData = {
  file: Blob;
  filename: string,
}

interface ConfigOptions {
  baseURL?: string;
  headers?: RawAxiosRequestHeaders | HeadersFunc;
  timeout?: number;
  responseType?: ResponseType;
  paramsSerializer?: (params: any) => string;
}

declare type RequestConfig = {
  params?: any;
  data?: any;
  method?: Method;
}

// ========== instance & config ==========
let instance: AxiosInstance | null = null;

// ========== axios配置及变量 start ==========
let defaultBaseURL: string;
let defaultHeaders: RawAxiosRequestHeaders | HeadersFunc = {
  'Cache-control': 'no-cache',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json; charset=utf-8',
};
let defaultTimeout: number = 60000;
let defaultResponseType: ResponseType = 'json';
let defaultParamSerializer: CustomParamsSerializer = (params) => (
  qs.stringify(params, { arrayFormat: 'repeat' })
);

function config(options: ConfigOptions) {
  instance = null;
  if (options.baseURL) {
    defaultBaseURL = options.baseURL;
  }
  if (options.headers) {
    defaultHeaders = Object.assign(
      defaultHeaders,
      options.headers
    );
  }
  if (options.responseType) {
    defaultResponseType = options.responseType;
  }
  if (options.timeout) {
    defaultTimeout = options.timeout;
  }
  if (options.paramsSerializer) {
    defaultParamSerializer = options.paramsSerializer;
  }
}

// T - 服务器提供的数据。D - 请求参数
function createAxiosInstance<T, R>() {

  let headers: RawAxiosRequestHeaders;

  if (typeof defaultHeaders === 'object') {
    headers = defaultHeaders;
  } else if (typeof defaultHeaders === 'function') {
    headers = defaultHeaders();
  } else {
    headers = {};
    // eslint-disable-next-line no-console
    console.error(`headers not support "${typeof defaultHeaders}"`);
  }

  const axiosInstance = axios.create({
    baseURL: defaultBaseURL,
    method: 'get', // 默认值
    // transformRequest: [function (data, headers) {
    //   // 对发送的 data 进行任意转换处理
    //   return data;
    // }],
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    // transformResponse: [function (data) {
    //   // 对接收的 data 进行任意转换处理
    //   return data;
    // }],
    // 自定义请求头
    headers,
    paramsSerializer: {
      serialize: defaultParamSerializer
    },
    timeout: defaultTimeout, // 毫秒数。默认值是 `0` (永不超时)
    withCredentials: true, // default
    responseType: defaultResponseType, // 默认值
    responseEncoding: 'utf8', // 默认值
    xsrfCookieName: 'XSRF-TOKEN', // 默认值
    xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值
    // 上传处理进度事件。浏览器专属
    onUploadProgress: function (progressEvent) {
      // 处理原生进度事件
    },
    // 下载处理进度事件。浏览器专属
    onDownloadProgress: function (progressEvent) {
      // 处理原生进度事件
    },
    validateStatus: function (status) {
      return status >= 200 && status < 300; // 默认值
    },
    maxRedirects: 5, // 默认值
    // decompress: true // 默认值
  });

  axiosInstance.interceptors.response.use(
    // 2xx 范围内的状态码都会触发该函数
    (response: AxiosResponse<IResponse<T>, R>) => {
      return response;
    },
    // 超出 2xx 范围的状态码都会触发该函数
    (error) => {
      return Promise.reject(error);
    },
  )

  instance = axiosInstance;
}

function responseHandler<T = any>(response: AxiosResponse): Promise<T | FileData> {
  // 响应二进制数据
  if (response.data instanceof Blob) {
    // 判断实际响应的类型
    const { type } = response.data;
    // 处理JSON数据
    if (type.includes('application/json')) {
      return response.data.arrayBuffer().then((buffer) => {
        var enc = new TextDecoder('utf-8');
        const data = JSON.parse(enc.decode(new Uint8Array(buffer))) as IResponse<T>;
        if (data.code !== 0) {
          return Promise.reject(data.errMsg);
        }
        return Promise.reject('响应数据格式错误');
      });
    }
    const { headers, data } = response;
    const contentDisposition = headers['content-disposition'];
    let filename = '未知文件';
    if (contentDisposition) {
      filename = contentDisposition.substring(contentDisposition.lastIndexOf('filename=') + 'filename='.length)
    }
    return Promise.resolve({
      file: data,
      filename,
    });
  }
  if (response.data) {
    const { code, data, errMsg } = response.data as IResponse<T>;
    if (code === 0) {
      return Promise.resolve(data);
    }
    new AxiosError(errMsg as any, undefined, undefined, undefined, response);
    return Promise.reject(errMsg);
  }
  console.log(response);
  return Promise.reject('response data is object, `{code: number, data: any, errMsg: string | null }`');
}

function errorHandler<T>(error: any): Promise<T> {
  if (error instanceof AxiosError) {
    return Promise.reject('请求超时或服务器异常，请检查网络或联系管理员！');
  }
  return Promise.reject(error);
}

/**
 * GET请求
 * @param url 请求地址 
 * @param params 请求参数
 */
export function get<T = any, R = any>(url: string, params?: R): Promise<T> {
  if (instance == null) {
    createAxiosInstance();
  }
  return (instance as AxiosInstance).get<T, AxiosResponse, R>(
    url,
    {
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8',
      }
    }
  )
    .then((data: AxiosResponse) => responseHandler(data))
    .catch((error) => errorHandler(error));
}

/**
 * POST请求
 * @param url 请求地址
 * @param data 请求参数 - 通过请求体传递
 * @returns 
 */
export function post<T = any, R = any>(url: string, data?: R): Promise<T> {
  if (instance == null) {
    createAxiosInstance();
  }
  return (instance as AxiosInstance).post<T, AxiosResponse, R>(
    url,
    data,
    {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8',
      }
    }
  )
    .then((response: AxiosResponse) => responseHandler(response))
    .catch((error) => errorHandler(error));
}

export function download(url: string, config: RequestConfig): Promise<FileData> {
  if (instance == null) {
    createAxiosInstance();
  }
  return (instance as AxiosInstance)(
    url,
    {
      method: 'GET',
      responseType: 'blob',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8',
      },
      ...config
    }
  )
    .then((response: AxiosResponse) => responseHandler(response))
    .catch((error) => errorHandler(error));
}

const http = {
  config,
  get,
  download,
  post,
}

export default http;