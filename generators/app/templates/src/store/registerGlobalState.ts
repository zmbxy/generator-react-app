import { run, cst, PluginOn, SigStateChangedData } from 'concent';

// 由管理平台通知的全局事件。查看系统版本信息（sys_version）和查看系统图例（sys_legend）
declare type AppGlobalUser = {
  roleId?: string;
  userId?: string;
  accountName?: string;
  areaId?: string;
  currentArea?: string;
  currentAreaName?: string,
  permissions?: string[],
  token?: string | null;
  authCode?: string[];
};

export default function registerGlobalState() {

  run(
    {
      $$global: {
        state: {
          userId: null,
          roleId: null,
          username: null,
          areaId: null,
          currentArea: null,
          currentAreaName: null,
          permissions: [],
          token: null,
        },
        lifecycle: {
          initStateDone() {
          },
          willUnmount() {
          },
        },
        reducer: {
          update(appUser: AppGlobalUser) {
            return {
              userId: appUser.userId,
              roleId: appUser.roleId,
              username: appUser.accountName,
              areaId: appUser.areaId,
              currentArea: appUser.currentArea,
              currentAreaName: appUser.currentAreaName,
            }
          },
          updateToken(appUser: AppGlobalUser, state: any) {
            return {
              ...state,
              permissions: appUser.authCode,
              token: appUser.token,
            }
          },
        },
      }
    } as any,
    {
      plugins: [
        {
          install: (on: PluginOn) => {
            on(cst.SIG_STATE_CHANGED, ({ payload: { sharedState } }: SigStateChangedData) => {
              // localStorage.setItem(`${appPrefix}:login-user`, JSON.stringify(sharedState));
            });
            return { name: 'local-store' };
          }
        }
      ]
    }
  );
}
