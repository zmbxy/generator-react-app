import 'antd/dist/antd.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as dayjs from 'dayjs';
import znch from 'dayjs/locale/zh-cn';
import routes from './routes';
import './config';
import './index.less';
import registerGlobalState from './store/registerGlobalState';
import http from './http';

dayjs.extend(isLeapYear);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale(znch);

let root: null | ReactDOM.Root = null;

// @ts-ignore
const isMicoAppEnv = window.__MICRO_APP_ENVIRONMENT__;
// @ts-ignore
const appName = window.__MICRO_APP_NAME__;
// @ts-ignore
const routeBasename = window.__MICRO_APP_BASE_ROUTE__ || process.env.PUBLIC_URL;

const antdConfig: ConfigProviderProps = {
  componentSize: 'middle',
  dropdownMatchSelectWidth: true,
  form: {
    requiredMark: true,
    colon: true,
  },
  input: {
    autoComplete: 'off',
  },
  locale: zhCN,
  // renderEmpty: (name?: string) => (<div></div>),
  virtual: false,
};

registerGlobalState();

http.config({
  baseURL: `${process.env.PUBLIC_URL}/api`,
});

const router = createBrowserRouter(routes, { basename: routeBasename });

function mount() {
  root = ReactDOM.createRoot(document.getElementById('task-situation_root') as HTMLElement);

  root.render(
    <ConfigProvider {...antdConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

function unmount() {
  if (root != null) {
    root.unmount();
    root = null;
  }
}

if (isMicoAppEnv) {
  // @ts-ignore
  window[`micro-app-${appName}`] = { mount, unmount };
} else {
  mount();
}
