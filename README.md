# Academic-platform

此文件夹内包含了后端项目的代码。此系统使用Node.js、GraphQL、MongoDB、ElasticSearch等技术构建，与前端项目共同构成了学者信息系统。

## 目录结构

- `academic-platform/`
    - `graphql/` GraphQL的主要代码
        - `resolvers/`GraphQL Resolvers的代码
        - `typeDefs.js`GraphQL的类型定义相关代码
    - `log/` 项目的日志
    - `models/` MongoDB和ElasticSearch的模型代码
    - `util/` 数据导入、权限检查、推荐系统等其他杂项代码
    - `.env`项目运行时的环境变量
    - `index.js`启动项目的脚本
    - `index.html` 用于引入 Vue 和其他资源的固定 HTML
    - `package.json` NPM 包描述文件

## 部署

参见部署文件中的 `academic-platform.md`。