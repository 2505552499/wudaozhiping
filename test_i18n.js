// 简单的国际化测试脚本
const fs = require('fs');
const path = require('path');

// 读取国际化文件
const zhCN = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/src/i18n/locales/zh-CN.json'), 'utf8'));
const enUS = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/src/i18n/locales/en-US.json'), 'utf8'));

console.log('🔍 检查国际化文件...');

// 检查 platformTag 是否存在
const zhPlatformTag = zhCN.home?.hero?.platformTag;
const enPlatformTag = enUS.home?.hero?.platformTag;

console.log('✅ 中文 platformTag:', zhPlatformTag);
console.log('✅ 英文 platformTag:', enPlatformTag);

if (zhPlatformTag && enPlatformTag) {
  console.log('🎉 国际化修复成功！');
  console.log('📝 现在 "AI驱动的武术分析平台" 标签支持中英文切换：');
  console.log('   中文：', zhPlatformTag);
  console.log('   英文：', enPlatformTag);
} else {
  console.log('❌ 国际化配置有问题');
}
