import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
import hashlib
import re

class UserAuth:
    def __init__(self, root, on_login_success=None):
        """初始化用户认证系统
        
        Args:
            root: 父窗口
            on_login_success: 登录成功后的回调函数
        """
        self.root = root
        self.on_login_success = on_login_success
        self.user_data_file = "users.json"
        
        # 确保用户数据文件存在
        if not os.path.exists(self.user_data_file):
            with open(self.user_data_file, 'w', encoding='utf-8') as f:
                json.dump({}, f)
        
        # 创建登录窗口
        self.login_window = tk.Toplevel(root)
        self.login_window.title("武道智评 - 用户登录")
        self.login_window.geometry("400x500")
        self.login_window.resizable(False, False)
        self.login_window.protocol("WM_DELETE_WINDOW", self.close_auth)
        
        # 设置窗口居中
        self.center_window(self.login_window)
        
        # 登录/注册选项卡
        self.auth_notebook = ttk.Notebook(self.login_window)
        self.auth_notebook.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # 创建登录和注册页面
        self.login_frame = ttk.Frame(self.auth_notebook)
        self.register_frame = ttk.Frame(self.auth_notebook)
        
        self.auth_notebook.add(self.login_frame, text="用户登录")
        self.auth_notebook.add(self.register_frame, text="用户注册")
        
        # 初始化登录和注册表单
        self.setup_login_form()
        self.setup_register_form()
    
    def center_window(self, window):
        """使窗口居中显示"""
        window.update_idletasks()
        width = window.winfo_width()
        height = window.winfo_height()
        x = (window.winfo_screenwidth() // 2) - (width // 2)
        y = (window.winfo_screenheight() // 2) - (height // 2)
        window.geometry('{}x{}+{}+{}'.format(width, height, x, y))
    
    def setup_login_form(self):
        """设置登录表单"""
        # 标题
        title_frame = tk.Frame(self.login_frame, bg="#c62828", height=60)
        title_frame.pack(fill=tk.X, pady=(0, 20))
        
        title_label = tk.Label(title_frame, text="欢迎回到武道智评", 
                              font=("Arial", 16, "bold"), fg="white", bg="#c62828")
        title_label.pack(pady=10)
        
        # 用户名
        username_frame = tk.Frame(self.login_frame)
        username_frame.pack(fill=tk.X, pady=10)
        
        username_label = tk.Label(username_frame, text="用户名:", font=("Arial", 12))
        username_label.pack(anchor=tk.W)
        
        self.login_username = tk.Entry(username_frame, font=("Arial", 12), width=30)
        self.login_username.pack(fill=tk.X, pady=5)
        
        # 密码
        password_frame = tk.Frame(self.login_frame)
        password_frame.pack(fill=tk.X, pady=10)
        
        password_label = tk.Label(password_frame, text="密码:", font=("Arial", 12))
        password_label.pack(anchor=tk.W)
        
        self.login_password = tk.Entry(password_frame, font=("Arial", 12), width=30, show="*")
        self.login_password.pack(fill=tk.X, pady=5)
        
        # 登录按钮
        button_frame = tk.Frame(self.login_frame)
        button_frame.pack(fill=tk.X, pady=20)
        
        self.login_button = tk.Button(button_frame, text="登录", 
                                    command=self.login,
                                    bg='#4285F4', fg='white', font=('Arial', 12, 'bold'), 
                                    height=1, width=15)
        self.login_button.pack(pady=10)
        
        # 游客登录
        guest_button = tk.Button(button_frame, text="游客模式", 
                               command=self.guest_login,
                               font=('Arial', 10), 
                               height=1, width=15)
        guest_button.pack(pady=5)
    
    def setup_register_form(self):
        """设置注册表单"""
        # 标题
        title_frame = tk.Frame(self.register_frame, bg="#2E7D32", height=60)
        title_frame.pack(fill=tk.X, pady=(0, 20))
        
        title_label = tk.Label(title_frame, text="加入武道智评", 
                              font=("Arial", 16, "bold"), fg="white", bg="#2E7D32")
        title_label.pack(pady=10)
        
        # 用户名
        username_frame = tk.Frame(self.register_frame)
        username_frame.pack(fill=tk.X, pady=10)
        
        username_label = tk.Label(username_frame, text="用户名 (4-20位字母数字):", font=("Arial", 12))
        username_label.pack(anchor=tk.W)
        
        self.register_username = tk.Entry(username_frame, font=("Arial", 12), width=30)
        self.register_username.pack(fill=tk.X, pady=5)
        
        # 密码
        password_frame = tk.Frame(self.register_frame)
        password_frame.pack(fill=tk.X, pady=10)
        
        password_label = tk.Label(password_frame, text="密码 (至少8位，包含字母和数字):", font=("Arial", 12))
        password_label.pack(anchor=tk.W)
        
        self.register_password = tk.Entry(password_frame, font=("Arial", 12), width=30, show="*")
        self.register_password.pack(fill=tk.X, pady=5)
        
        # 确认密码
        password_confirm_frame = tk.Frame(self.register_frame)
        password_confirm_frame.pack(fill=tk.X, pady=10)
        
        password_confirm_label = tk.Label(password_confirm_frame, text="确认密码:", font=("Arial", 12))
        password_confirm_label.pack(anchor=tk.W)
        
        self.register_password_confirm = tk.Entry(password_confirm_frame, font=("Arial", 12), width=30, show="*")
        self.register_password_confirm.pack(fill=tk.X, pady=5)
        
        # 注册按钮
        button_frame = tk.Frame(self.register_frame)
        button_frame.pack(fill=tk.X, pady=20)
        
        self.register_button = tk.Button(button_frame, text="注册", 
                                       command=self.register,
                                       bg='#2E7D32', fg='white', font=('Arial', 12, 'bold'), 
                                       height=1, width=15)
        self.register_button.pack(pady=10)
    
    def login(self):
        """处理用户登录"""
        username = self.login_username.get().strip()
        password = self.login_password.get()
        
        if not username or not password:
            messagebox.showerror("登录失败", "用户名和密码不能为空")
            return
        
        # 读取用户数据
        with open(self.user_data_file, 'r', encoding='utf-8') as f:
            users = json.load(f)
        
        # 检查用户是否存在
        if username not in users:
            messagebox.showerror("登录失败", "用户名或密码不正确")
            return
        
        # 验证密码
        hashed_password = self.hash_password(password)
        if users[username]["password"] != hashed_password:
            messagebox.showerror("登录失败", "用户名或密码不正确")
            return
        
        # 更新最后登录时间
        users[username]["last_login"] = self.get_current_time()
        users[username]["login_count"] = users[username].get("login_count", 0) + 1
        
        # 保存用户数据
        with open(self.user_data_file, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=4)
        
        # 登录成功
        messagebox.showinfo("登录成功", f"欢迎回来，{username}！")
        self.login_window.destroy()
        
        # 执行登录成功回调
        if self.on_login_success:
            self.on_login_success(username)
    
    def register(self):
        """处理用户注册"""
        username = self.register_username.get().strip()
        password = self.register_password.get()
        password_confirm = self.register_password_confirm.get()
        
        # 验证输入
        if not username or not password or not password_confirm:
            messagebox.showerror("注册失败", "所有字段都必须填写")
            return
        
        # 验证用户名格式
        if not re.match(r'^[a-zA-Z0-9]{4,20}$', username):
            messagebox.showerror("注册失败", "用户名必须是4-20位字母或数字")
            return
        
        # 验证密码格式
        if len(password) < 8 or not re.search(r'[a-zA-Z]', password) or not re.search(r'[0-9]', password):
            messagebox.showerror("注册失败", "密码至少8位，且必须包含字母和数字")
            return
        
        # 验证两次密码输入是否一致
        if password != password_confirm:
            messagebox.showerror("注册失败", "两次输入的密码不一致")
            return
        
        # 读取现有用户数据
        with open(self.user_data_file, 'r', encoding='utf-8') as f:
            users = json.load(f)
        
        # 检查用户名是否已存在
        if username in users:
            messagebox.showerror("注册失败", "该用户名已被占用")
            return
        
        # 添加新用户
        users[username] = {
            "password": self.hash_password(password),
            "register_time": self.get_current_time(),
            "last_login": self.get_current_time()
        }
        
        # 保存用户数据
        with open(self.user_data_file, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=4)
        
        # 注册成功
        messagebox.showinfo("注册成功", "注册成功！请登录系统")
        
        # 切换到登录选项卡
        self.auth_notebook.select(0)
        self.login_username.delete(0, tk.END)
        self.login_username.insert(0, username)
        self.login_password.delete(0, tk.END)
    
    def guest_login(self):
        """游客模式登录"""
        if self.on_login_success:
            self.on_login_success("游客")
        self.login_window.destroy()
    
    def close_auth(self):
        """关闭认证窗口"""
        self.root.destroy()  # 如果用户关闭登录窗口，则关闭整个应用程序
    
    def hash_password(self, password):
        """对密码进行哈希处理"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def get_current_time(self):
        """获取当前时间字符串"""
        import datetime
        return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 测试代码
if __name__ == "__main__":
    root = tk.Tk()
    root.withdraw()  # 隐藏主窗口
    
    def on_login(username):
        print(f"用户 {username} 登录成功")
        root.deiconify()  # 显示主窗口
    
    auth = UserAuth(root, on_login_success=on_login)
    
    root.mainloop() 