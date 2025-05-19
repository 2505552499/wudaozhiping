import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// 仅在开发环境下集成 stagewise 工具栏
if (process.env.NODE_ENV === 'development') {
  // 创建用于挂载工具栏的DOM元素
  let toolbarRoot = document.getElementById('stagewise-toolbar-root');
  if (!toolbarRoot) {
    toolbarRoot = document.createElement('div');
    toolbarRoot.id = 'stagewise-toolbar-root';
    document.body.appendChild(toolbarRoot);
  }

  // 动态导入 stagewise 依赖，确保不影响生产构建
  import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const stagewiseConfig = { plugins: [] };
    const toolbarRootInstance = ReactDOM.createRoot(toolbarRoot);
    toolbarRootInstance.render(<StagewiseToolbar config={stagewiseConfig} />);
  }).catch(err => {
    console.error('stagewise 工具栏加载失败:', err);
  });
}
