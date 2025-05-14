import os
import json
import uuid
from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

# 论坛数据文件路径
FORUM_POSTS_FILE = 'data/forum_posts.json'
FORUM_COMMENTS_FILE = 'data/forum_comments.json'

# 确保数据文件存在
def ensure_forum_files_exist():
    # 确保目录存在
    os.makedirs('data', exist_ok=True)
    
    # 确保帖子文件存在
    if not os.path.exists(FORUM_POSTS_FILE):
        with open(FORUM_POSTS_FILE, 'w', encoding='utf-8') as f:
            json.dump({"posts": []}, f, ensure_ascii=False, indent=4)
    
    # 确保评论文件存在
    if not os.path.exists(FORUM_COMMENTS_FILE):
        with open(FORUM_COMMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump({"comments": []}, f, ensure_ascii=False, indent=4)

# 读取帖子数据
def read_posts():
    ensure_forum_files_exist()
    try:
        with open(FORUM_POSTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取帖子数据出错: {e}")
        return {"posts": []}

# 保存帖子数据
def save_posts(data):
    ensure_forum_files_exist()
    try:
        with open(FORUM_POSTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        print(f"保存帖子数据出错: {e}")
        return False

# 读取评论数据
def read_comments():
    ensure_forum_files_exist()
    try:
        with open(FORUM_COMMENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"读取评论数据出错: {e}")
        return {"comments": []}

# 保存评论数据
def save_comments(data):
    ensure_forum_files_exist()
    try:
        with open(FORUM_COMMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        return True
    except Exception as e:
        print(f"保存评论数据出错: {e}")
        return False

# 获取用户角色
def get_user_role(username):
    from app import get_user_data
    user_data = get_user_data(username)
    if user_data and 'role' in user_data:
        return user_data['role']
    return 'user'  # 默认为普通用户

# 创建帖子
def create_post():
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 获取请求数据
        data = request.get_json()
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        
        # 验证数据
        if not title or not content:
            return jsonify({"success": False, "message": "标题和内容不能为空"}), 400
        
        # 读取现有帖子
        posts_data = read_posts()
        
        # 创建新帖子
        post_id = str(uuid.uuid4())
        new_post = {
            "id": post_id,
            "title": title,
            "content": content,
            "author": current_user,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "status": "pending",  # 待审核状态
            "likes": 0,
            "views": 0,
            "tags": data.get('tags', [])
        }
        
        # 添加新帖子
        posts_data["posts"].append(new_post)
        
        # 保存数据
        if save_posts(posts_data):
            return jsonify({
                "success": True, 
                "message": "帖子创建成功，等待管理员审核",
                "post_id": post_id
            }), 201
        else:
            return jsonify({"success": False, "message": "保存帖子失败"}), 500
            
    except Exception as e:
        print(f"创建帖子出错: {e}")
        return jsonify({"success": False, "message": f"创建帖子出错: {str(e)}"}), 500

# 获取帖子列表（已审核通过的）
def get_posts():
    try:
        # 获取查询参数
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # 读取帖子数据
        posts_data = read_posts()
        
        # 过滤出已审核通过的帖子
        approved_posts = [post for post in posts_data["posts"] if post["status"] == "approved"]
        
        # 获取评论数据，为每个帖子添加评论计数
        comments_data = read_comments()
        
        # 为每个帖子添加评论计数
        for post in approved_posts:
            post_comments = [c for c in comments_data["comments"] if c["post_id"] == post["id"]]
            post["comment_count"] = len(post_comments)
        
        # 按创建时间倒序排序
        approved_posts.sort(key=lambda x: x["created_at"], reverse=True)
        
        # 分页
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_posts = approved_posts[start_idx:end_idx]
        
        # 返回结果
        return jsonify({
            "success": True,
            "total": len(approved_posts),
            "page": page,
            "per_page": per_page,
            "posts": paginated_posts
        }), 200
            
    except Exception as e:
        print(f"获取帖子列表出错: {e}")
        return jsonify({"success": False, "message": f"获取帖子列表出错: {str(e)}"}), 500

# 获取待审核的帖子列表（仅管理员可用）
def get_pending_posts():
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 检查用户角色
        user_role = get_user_role(current_user)
        if user_role != 'admin':
            return jsonify({"success": False, "message": "权限不足"}), 403
        
        # 获取查询参数
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # 读取帖子数据
        posts_data = read_posts()
        
        # 过滤出待审核的帖子
        pending_posts = [post for post in posts_data["posts"] if post["status"] == "pending"]
        
        # 按创建时间倒序排序
        pending_posts.sort(key=lambda x: x["created_at"], reverse=True)
        
        # 分页
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_posts = pending_posts[start_idx:end_idx]
        
        # 返回结果
        return jsonify({
            "success": True,
            "total": len(pending_posts),
            "page": page,
            "per_page": per_page,
            "posts": paginated_posts
        }), 200
            
    except Exception as e:
        print(f"获取待审核帖子列表出错: {e}")
        return jsonify({"success": False, "message": f"获取待审核帖子列表出错: {str(e)}"}), 500

# 获取帖子详情
def get_post_detail(post_id):
    try:
        # 读取帖子数据
        posts_data = read_posts()
        
        # 查找指定帖子
        post = None
        for p in posts_data["posts"]:
            if p["id"] == post_id:
                post = p
                break
        
        if not post:
            return jsonify({"success": False, "message": "帖子不存在"}), 404
        
        # 检查帖子状态
        try:
            # 尝试获取当前用户，如果未登录则不会抛出异常
            current_user = get_jwt_identity()
            user_role = get_user_role(current_user) if current_user else 'guest'
        except Exception:
            # 如果获取用户身份失败，则视为游客
            current_user = None
            user_role = 'guest'
        
        # 如果帖子未审核通过，且当前用户不是管理员或作者，则不允许查看
        if post["status"] != "approved" and user_role != 'admin' and (not current_user or post["author"] != current_user):
            return jsonify({"success": False, "message": "该帖子尚未审核通过"}), 403
        
        # 增加浏览次数（只有已审核通过的帖子才增加浏览次数）
        if post["status"] == "approved":
            for p in posts_data["posts"]:
                if p["id"] == post_id:
                    # 确保 views 字段存在且是整数
                    if "views" not in p:
                        p["views"] = 0
                    p["views"] += 1
                    break
            
            # 保存更新后的数据
            save_posts(posts_data)
        
        # 获取帖子评论
        comments_data = read_comments()
        post_comments = [c for c in comments_data["comments"] if c["post_id"] == post_id]
        post_comments.sort(key=lambda x: x["created_at"])
        
        # 返回结果
        result = post.copy()
        result["comments"] = post_comments
        result["comment_count"] = len(post_comments)
        
        return jsonify({
            "success": True,
            "post": result
        }), 200
            
    except Exception as e:
        print(f"获取帖子详情出错: {e}")
        return jsonify({"success": False, "message": f"获取帖子详情出错: {str(e)}"}), 500

# 审核帖子（仅管理员可用）
def review_post(post_id):
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 检查用户角色
        user_role = get_user_role(current_user)
        if user_role != 'admin':
            return jsonify({"success": False, "message": "权限不足"}), 403
        
        # 获取请求数据
        data = request.get_json()
        action = data.get('action')  # 'approve' 或 'reject'
        reason = data.get('reason', '')  # 拒绝理由（可选）
        
        if action not in ['approve', 'reject']:
            return jsonify({"success": False, "message": "无效的操作"}), 400
        
        # 读取帖子数据
        posts_data = read_posts()
        
        # 查找并更新指定帖子
        post_found = False
        for post in posts_data["posts"]:
            if post["id"] == post_id:
                post_found = True
                post["status"] = "approved" if action == "approve" else "rejected"
                post["review_by"] = current_user
                post["review_at"] = datetime.now().isoformat()
                if action == "reject" and reason:
                    post["reject_reason"] = reason
                break
        
        if not post_found:
            return jsonify({"success": False, "message": "帖子不存在"}), 404
        
        # 保存更新后的数据
        if save_posts(posts_data):
            return jsonify({
                "success": True, 
                "message": "审核完成",
                "status": "approved" if action == "approve" else "rejected"
            }), 200
        else:
            return jsonify({"success": False, "message": "保存数据失败"}), 500
            
    except Exception as e:
        print(f"审核帖子出错: {e}")
        return jsonify({"success": False, "message": f"审核帖子出错: {str(e)}"}), 500

# 添加评论
def add_comment(post_id):
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 获取请求数据
        data = request.get_json()
        content = data.get('content', '').strip()
        
        # 验证数据
        if not content:
            return jsonify({"success": False, "message": "评论内容不能为空"}), 400
        
        # 检查帖子是否存在且已审核通过
        posts_data = read_posts()
        post_exists = False
        post_approved = False
        
        for post in posts_data["posts"]:
            if post["id"] == post_id:
                post_exists = True
                if post["status"] == "approved":
                    post_approved = True
                break
        
        if not post_exists:
            return jsonify({"success": False, "message": "帖子不存在"}), 404
        
        if not post_approved:
            return jsonify({"success": False, "message": "该帖子尚未审核通过，无法评论"}), 403
        
        # 读取评论数据
        comments_data = read_comments()
        
        # 创建新评论
        comment_id = str(uuid.uuid4())
        new_comment = {
            "id": comment_id,
            "post_id": post_id,
            "content": content,
            "author": current_user,
            "created_at": datetime.now().isoformat(),
            "likes": 0
        }
        
        # 添加新评论
        comments_data["comments"].append(new_comment)
        
        # 保存数据
        if save_comments(comments_data):
            return jsonify({
                "success": True, 
                "message": "评论添加成功",
                "comment": new_comment
            }), 201
        else:
            return jsonify({"success": False, "message": "保存评论失败"}), 500
            
    except Exception as e:
        print(f"添加评论出错: {e}")
        return jsonify({"success": False, "message": f"添加评论出错: {str(e)}"}), 500

# 获取用户自己发布的帖子
def get_user_posts():
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 获取查询参数
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # 读取帖子数据
        posts_data = read_posts()
        
        # 过滤出用户自己的帖子
        user_posts = [post for post in posts_data["posts"] if post["author"] == current_user]
        
        # 按创建时间倒序排序
        user_posts.sort(key=lambda x: x["created_at"], reverse=True)
        
        # 分页
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_posts = user_posts[start_idx:end_idx]
        
        # 返回结果
        return jsonify({
            "success": True,
            "total": len(user_posts),
            "page": page,
            "per_page": per_page,
            "posts": paginated_posts
        }), 200
            
    except Exception as e:
        print(f"获取用户帖子列表出错: {e}")
        return jsonify({"success": False, "message": f"获取用户帖子列表出错: {str(e)}"}), 500

# 点赞帖子
def like_post(post_id):
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 读取帖子数据
        posts_data = read_posts()
        
        # 查找并更新指定帖子
        post_found = False
        for post in posts_data["posts"]:
            if post["id"] == post_id and post["status"] == "approved":
                post_found = True
                # 确保likes字段存在
                if "likes" not in post:
                    post["likes"] = 0
                post["likes"] += 1
                break
        
        if not post_found:
            return jsonify({"success": False, "message": "帖子不存在或未审核通过"}), 404
        
        # 保存更新后的数据
        if save_posts(posts_data):
            # 打印日志以便调试
            print(f"帖子点赞成功: {post_id}, 当前点赞数: {post['likes']}")
            return jsonify({
                "success": True, 
                "message": "点赞成功"
            }), 200
        else:
            return jsonify({"success": False, "message": "保存数据失败"}), 500
            
    except Exception as e:
        print(f"点赞帖子出错: {e}")
        return jsonify({"success": False, "message": f"点赞帖子出错: {str(e)}"}), 500

# 点赞评论
def like_comment(comment_id):
    try:
        # 获取当前用户
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"success": False, "message": "未授权操作"}), 401
        
        # 读取评论数据
        comments_data = read_comments()
        
        # 查找并更新指定评论
        comment_found = False
        for comment in comments_data["comments"]:
            if comment["id"] == comment_id:
                comment_found = True
                # 确保likes字段存在
                if "likes" not in comment:
                    comment["likes"] = 0
                comment["likes"] += 1
                break
        
        if not comment_found:
            return jsonify({"success": False, "message": "评论不存在"}), 404
        
        # 保存更新后的数据
        if save_comments(comments_data):
            # 打印日志以便调试
            print(f"评论点赞成功: {comment_id}, 当前点赞数: {comment['likes']}")
            return jsonify({
                "success": True, 
                "message": "点赞成功"
            }), 200
        else:
            return jsonify({"success": False, "message": "保存数据失败"}), 500
            
    except Exception as e:
        print(f"点赞评论出错: {e}")
        return jsonify({"success": False, "message": f"点赞评论出错: {str(e)}"}), 500
