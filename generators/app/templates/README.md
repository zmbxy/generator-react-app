### 项目启动脚本

1. 安装yarn

   ```shell
   npm install -g yarn
   ```

2. 安装项目依赖

   ```shell
   yarn
   ```

3. 启动项目

   ```shell
   yarn start
   ```

4. 编译打包

   ```shell
   yarn build
   ```

5. 测试

   ```shell
   yarn test
   ```

### 目录结构

```tex
<%= name %>
├─config  // 项目配置相关。包括单元测试配置、webpack配置
│  └─jest
├─public  // 公共静态资源目录，无需处理的静态资源可放在此处
├─scripts // 项目执行脚本文件。node js脚本
├─src // 项目源代码
│  ├─components // 项目级公用组件
│  │  ├─date-picker // 基于antd改装的日期选择组件，使用dayjs替换moment.js
│  │  ├─divider-block // div分割
│  │  ├─input // 改造inputnumber，只能输入整数
│  │  ├─search // 查询组件
│  │  ├─table // 表格组件，基于antd，将部分通用配置进行统一封装处理
│  │  └─time-picker // // 基于antd改装的时间选择组件，使用dayjs替换moment.js
│  ├─http // axios封装，提供统一的api请求处理
│  ├─icons // 图标
│  ├─store // 全局状态管理库的定义等。可以是redux、concent、recoil等
│  ├─utils // 项目级公共函数的库
│  └─views // 业务页面存放代码
│  │  └─user // 已用户为例，每个具体的业务为单独的一个目录
│  │  │  ├─components // 业务级的公共组件。可选
│  │  │  ├─api.ts // 业务API统一定义
│  │  │  ├─constant.ts // 业务的一些常量定义。如业务类型枚举值等定义
│  │  │  ├─types.ts // 业务级的TS类型定义
│  │  │  └─index.tsx // 为业务访问的入口组件
└─__tests__ // 单元测试代码目录
```

### 修改antd them

ant-design UI库的样式定义存放于`antd.them.js`文件中。具体可配置项参考[ant-design文档](https://4x.ant.design/docs/react/customize-theme-cn)

### 项目环境变量定义

项目全局环境变量等信息，通过`.env`进行配置。具体参考`create-react-app`文档的[配置项](https://create-react-app.dev/docs/advanced-configuration)
