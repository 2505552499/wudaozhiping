import os
import re

def fix_payment_result_syntax():
    """修复PaymentResult.js文件中的语法错误"""
    file_path = 'frontend/src/pages/PaymentResult.js'
    
    try:
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修复语法错误 </r> -> </Result>
        fixed_content = content.replace('</r>', '</Result>')
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
            
        print(f"✓ 已修复 {file_path} 中的语法错误")
        return True
    except Exception as e:
        print(f"✗ 修复失败: {str(e)}")
        return False

if __name__ == "__main__":
    fix_payment_result_syntax()
