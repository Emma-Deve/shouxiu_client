// 作用：针对antd实现按需打包，引入了组件就会打包对应样式，无需再引入样式文件
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                '@font-size-base': '20px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};