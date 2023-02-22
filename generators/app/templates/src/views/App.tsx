import { useEffect, useCallback, Suspense, useState } from 'react';
import { Outlet, RouteObject, useNavigate } from 'react-router-dom';
import { message, Spin, Modal } from 'antd';
import { useConcent } from 'concent';
import routes from '../routes';
import http, { get } from '@/http';

// 由管理平台通知的全局事件。查看系统版本信息（sys_version）和查看系统图例（sys_legend）
declare type AppGlobalUser = {
  roleId?: string;
  userId?: string;
  accountName?: string;
  areaId?: string;
  currentArea?: string;
  currentAreaName?: string,
  permissions?: string[],
};

declare type MicroAppState = {
  appKey: string;
  userInfo?: AppGlobalUser,
  path?: string;
  event?: AppGlobalEvent;
}

const menuList = (routes: RouteObject[]): any[] => {
  const menuArr: any[] = [];
  routes.forEach((item) => {
    if ((item as any).hide) {
      return;
    }
    menuArr.push({
      name: (item as any).name,
      path: item.path,
      children: item.children ? menuList(item.children) : undefined,
    });
  });
  return menuArr;
};

function App() {

  const [loading, setLoading] = useState<boolean>(false);
  const { globalReducer, globalState } = useConcent();
  const nativage = useNavigate();

  const microAppListener = useCallback((data: MicroAppState) => {
    const { userInfo, path } = data;
    if (userInfo) {
      globalReducer.update(userInfo);
    }
    if (path) {
      nativage(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // @ts-ignore
    window.microApp?.addDataListener(microAppListener, true);
    // setLoading(true);
    // 菜单
    const list = menuList(routes[0].children);
    // @ts-ignore
    window.microApp?.dispatch({ menuList: list });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (globalState.userId != null) {
      get('/common/user/getToken', { id: globalState.userId }).then((data) => {
        if (data.token == null) {
          const countdown = {
            value: 10,
          }
          const modal = Modal.warning({
            title: '认证失败',
            content: (
              `未获取到登录用户信息，${countdown.value}后返回管理平台`
            ),
            onOk(close) {
              window.location.replace('/bnrcs');
              close();
            },
            okText: '立即返回'
          });
          const interval = setInterval(() => {
            if (countdown.value === 0) {
              clearInterval(interval);
              modal.destroy();
              window.location.replace('/bnrcs');
              return;
            }
            modal.update({
              content: (
                `未获取到登录用户信息，${countdown.value}后返回管理平台`
              ),
            });
          }, 1000);
          return;
        }
        globalReducer.updateToken({
          token: data.token,
          permissions: data.authCode,
        });
        http.config({
          headers: {
            'Auth-Token': data.token,
          }
        });
      }).catch((err) => {
        message.error(err);
      }).finally(() => {
        setLoading(false);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.userId]);

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: 40 }}>
      <Suspense
        fallback={(
          <Spin spinning delay={5}>
            <div style={{ width: '100%', height: 'calc(100vh - 130px)' }} />
          </Spin>
        )}
      >
        <Spin spinning={loading} tip="认证中...">
          {loading && (
            <div style={{ width: '100%', height: 'calc(100vh - 130px)' }} />
          )}
          {/* {globalState.token != null && <Outlet />} */}
          <Outlet />
        </Spin>
      </Suspense>
    </div>
  )
}

export default App;
