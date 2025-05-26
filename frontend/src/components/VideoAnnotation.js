import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, List, Popover, message, Select, Tag, Tooltip, Modal, Rate, Card, Divider } from 'antd';
import { CommentOutlined, DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined, CameraOutlined, PauseOutlined, StarOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 视频批注组件
 * @param {Object} props - 组件属性
 * @param {string} props.videoUrl - 视频URL
 * @param {string} props.videoId - 视频ID
 * @param {Object} props.videoRef - 视频DOM引用
 * @param {boolean} props.isAdmin - 是否为管理员
 * @param {boolean} props.isCoach - 是否为教练
 * @param {string} props.trainingVideoId - 训练视频ID
 * @param {function} props.onAnnotationSelected - 批注选中回调函数
 * @param {function} props.onAnnotationUpdate - 标注更新回调函数
 */
const VideoAnnotation = (props) => {
    const {
        videoUrl,
        videoId,
        videoRef,
        isAdmin = false,
        isCoach = false,
        trainingVideoId,
        onAnnotationSelected,
        onAnnotationUpdate
    } = props;
    const [annotations, setAnnotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentAnnotation, setCurrentAnnotation] = useState('');
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [drawingHistory, setDrawingHistory] = useState([]);
    const [currentColor, setCurrentColor] = useState('#ff0000');
    const [lineWidth, setLineWidth] = useState(3);
    const [capturedFrame, setCapturedFrame] = useState(null); // 存储截取的视频帧
    const [isAnnotating, setIsAnnotating] = useState(false); // 是否正在批注模式
    const [videoTime, setVideoTime] = useState(0); // 当前视频时间

    // 教练评分和反馈相关状态
    const [coachScore, setCoachScore] = useState(0);
    const [coachFeedback, setCoachFeedback] = useState('');
    const [showCoachPanel, setShowCoachPanel] = useState(false);
    const [savingAnnotation, setSavingAnnotation] = useState(false);
    const [publishingAnnotation, setPublishingAnnotation] = useState(false);

    // 内部视频引用
    const internalVideoRef = useRef(null);
    const actualVideoRef = videoRef || internalVideoRef;

    // 初始化Canvas
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // 设置适当的原始尺寸，防止被缩放影响绘图效果
            if (!canvas.width || canvas.width < 100) {
                canvas.width = actualVideoRef.current?.videoWidth || 640;
            }
            if (!canvas.height || canvas.height < 100) {
                canvas.height = actualVideoRef.current?.videoHeight || 360;
            }

            const context = canvas.getContext('2d');
            context.lineCap = 'round';
            context.strokeStyle = currentColor;
            context.lineWidth = lineWidth;
            contextRef.current = context;
            console.log('Canvas 初始化完成，已设置绘图样式:', { 颜色: currentColor, 线宽: lineWidth });
        }
    }, [actualVideoRef, currentColor, lineWidth]);

    // 监听颜色和线宽变化，及时更新绘图上下文
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = currentColor;
            contextRef.current.lineWidth = lineWidth;
            console.log('绘图样式已更新:', { 颜色: currentColor, 线宽: lineWidth });
        }
    }, [currentColor, lineWidth]);

    // 获取视频当前帧
    useEffect(() => {
        if (actualVideoRef.current) {
            // 增加空值检查，避免访问未加载视频的currentTime属性
            const updateCurrentFrame = () => {
                // 仅在actualVideoRef.current不为空且有currentTime属性时才更新
                if (actualVideoRef.current && typeof actualVideoRef.current.currentTime !== 'undefined') {
                    try {
                        const time = actualVideoRef.current.currentTime;
                        setCurrentFrame(Math.floor(time * 1000));
                        setVideoTime(time);
                    } catch (error) {
                        console.error('获取视频时间出错:', error);
                    }
                }
            };

            // 添加事件监听
            const videoElement = actualVideoRef.current;
            if (videoElement) {
                videoElement.addEventListener('timeupdate', updateCurrentFrame);

                // 清理函数
                return () => {
                    if (videoElement) {
                        videoElement.removeEventListener('timeupdate', updateCurrentFrame);
                    }
                };
            }
        }
    }, [actualVideoRef]);

    // 截取当前视频帧
    const captureVideoFrame = () => {
        if (!actualVideoRef.current) {
            message.error('视频加载失败');
            return;
        }

        try {
            // 暂停视频
            actualVideoRef.current.pause();

            // 添加调试日志
            console.log('视频尺寸:', actualVideoRef.current.videoWidth, 'x', actualVideoRef.current.videoHeight);

            // 检查视频是否已经加载完成
            if (actualVideoRef.current.readyState < 2) {
                message.error('视频尚未加载完成，请稍后再试');
                return;
            }

            // 创建一个临时canvas来截取视频帧
            const tempCanvas = document.createElement('canvas');
            // 确保设置正确的尺寸，防止宽高为0
            tempCanvas.width = actualVideoRef.current.videoWidth || 640;
            tempCanvas.height = actualVideoRef.current.videoHeight || 360;

            // 将视频帧绘制到canvas上
            const tempContext = tempCanvas.getContext('2d');

            // 设置crossOrigin属性以避免CORS问题
            if (actualVideoRef.current.crossOrigin !== 'anonymous') {
                actualVideoRef.current.crossOrigin = 'anonymous';
            }

            let frameDataUrl;
            try {
                tempContext.drawImage(actualVideoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);

                // 将canvas内容转为数据地址
                frameDataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
                setCapturedFrame(frameDataUrl);
                console.log('截取的视频帧 URL 长度:', frameDataUrl.length);
            } catch (canvasError) {
                console.error('Canvas绘制错误:', canvasError);
                // 如果无法截取视频帧，创建一个简单的占位图
                tempContext.fillStyle = '#f0f0f0';
                tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempContext.fillStyle = '#666';
                tempContext.font = '20px Arial';
                tempContext.textAlign = 'center';
                tempContext.fillText('视频帧截取失败', tempCanvas.width / 2, tempCanvas.height / 2);

                frameDataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
                setCapturedFrame(frameDataUrl);
                message.warning('无法截取视频帧，使用占位图代替');
            }

            // 启用批注模式 在状态更新后立即初始化画布
            setIsAnnotating(true);

            // 立即强制调用初始化 - 这里是全局调用，确保进入批注后立即生效
            setTimeout(() => {
                forceInitContext();
                if (contextRef.current && canvasRef.current) {
                    // 初始化后立即测试绘制一个点
                    contextRef.current.fillStyle = currentColor;
                    contextRef.current.fillRect(0, 0, 1, 1);  // 画一个1x1像素的点
                    console.log('即时初始化并测试绘图器');
                }
            }, 100); // 稍微延时确保状态已经更新

            // 清空并初始化绘图画布
            if (canvasRef.current && contextRef.current) {
                // 设置画布尺寸与视频一致
                canvasRef.current.width = actualVideoRef.current.videoWidth || 640;
                canvasRef.current.height = actualVideoRef.current.videoHeight || 360;

                // 重新设置绘图上下文样式，确保绘图可以立即开始
                contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                contextRef.current.lineCap = 'round';
                contextRef.current.strokeStyle = currentColor;
                contextRef.current.lineWidth = lineWidth;

                // 在canvas上绘制视频帧
                const img = new Image();
                img.onload = () => {
                    console.log('图片加载成功，尺寸:', img.width, 'x', img.height);
                    contextRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    // 强制初始化绘图上下文，确保立即可以绘图
                    forceInitContext();
                    // 将绘图模式设置为“源覆盖”，确保绘图在图片上方
                    contextRef.current.globalCompositeOperation = 'source-over';
                    // 指定1像素宽度的虚线 立即绘制来测试绘图是否正常
                    contextRef.current.strokeStyle = 'rgba(255,0,0,0.01)';
                    contextRef.current.beginPath();
                    contextRef.current.moveTo(0, 0);
                    contextRef.current.lineTo(1, 1);
                    contextRef.current.stroke();
                    // 重新设置回原始颜色
                    contextRef.current.strokeStyle = currentColor;
                    console.log('绘图上下文已强制初始化:', { 颜色: currentColor, 线宽: lineWidth });
                };
                img.onerror = (err) => {
                    console.error('图片加载出错:', err);
                };
                img.src = frameDataUrl;
            }

            message.success('视频帧截取成功');
        } catch (error) {
            console.error('视频帧截取失败:', error);
            message.error('视频帧截取失败: ' + error.message);
        }
    };

    // 取消批注模式
    const cancelAnnotation = () => {
        setIsAnnotating(false);
        setCapturedFrame(null);
        clearCanvas();
        setCurrentAnnotation('');

        // 可以选择恢复视频播放
        if (actualVideoRef.current) {
            actualVideoRef.current.play();
        }
    };

    // 获取批注列表
    useEffect(() => {
        if (videoId || trainingVideoId) {
            fetchAnnotations();
        }
    }, [videoId, trainingVideoId]);

    // 获取批注列表
    const fetchAnnotations = async () => {
        setLoading(true);
        try {
            let response;
            // 如果有trainingVideoId，使用训练视频专用API
            if (trainingVideoId) {
                const token = localStorage.getItem('token');
                response = await axios.get(`/api/training-videos/${trainingVideoId}/annotations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                // 否则使用通用批注API
                response = await axios.get(`/api/annotations/${videoId}`);
            }

            if (response.data.success) {
                setAnnotations(response.data.annotations);
            }
        } catch (error) {
            console.error('获取批注失败:', error);
            message.error('获取批注列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 添加批注
    const addAnnotation = async () => {
        if (!isAnnotating) {
            message.warning('请先截取视频帧');
            return;
        }

        try {
            // 获取当前用户信息
            const currentUser = localStorage.getItem('username') || '未知用户';
            const userRole = localStorage.getItem('role') || 'user';

            // 添加调试信息
            console.log('保存批注时的用户信息:', {
                username: currentUser,
                role: userRole,
                localStorage_username: localStorage.getItem('username'),
                localStorage_role: localStorage.getItem('role')
            });

            let annotationData = {
                video_id: videoId,
                timestamp: currentFrame,
                time_seconds: videoTime,
                type: 'combined', // 合并的批注类型
                content: currentAnnotation,
                author: currentUser,
                author_role: userRole
            };

            // 添加画布数据和原始视频帧
            if (canvasRef.current) {
                // 重要改动: 创建一个新的画布来合并帧图和绘图，确保保存完整的批注
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvasRef.current.width;
                tempCanvas.height = canvasRef.current.height;
                const tempContext = tempCanvas.getContext('2d');

                // 先绘制帧图作为背景
                if (capturedFrame) {
                    const img = new Image();
                    img.src = capturedFrame;

                    // 绘制同步处理
                    if (img.complete) {
                        tempContext.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
                        // 再将当前画布内容绘制到新画布上
                        tempContext.drawImage(canvasRef.current, 0, 0);
                    } else {
                        // 异步加载图片
                        img.onload = () => {
                            tempContext.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
                            tempContext.drawImage(canvasRef.current, 0, 0);
                        };
                    }
                } else {
                    // 如果没有帧图，直接复制画布内容
                    tempContext.drawImage(canvasRef.current, 0, 0);
                }

                // 确保绘图内容可见 - 设置颜色和宽度
                tempContext.strokeStyle = currentColor;
                tempContext.lineWidth = lineWidth;
                tempContext.globalAlpha = 1.0;

                // 保存合成的图像数据
                annotationData.drawing_data = tempCanvas.toDataURL('image/png');
                // 同时保存原始帧图
                annotationData.frame_image = capturedFrame;

                console.log('保存绘图数据, 长度:', annotationData.drawing_data.length);
            }

            const response = await axios.post('/api/annotations', annotationData);
            if (response.data.success) {
                message.success('添加批注成功');
                setCurrentAnnotation('');
                clearCanvas();
                fetchAnnotations();
                setIsAnnotating(false);
                setCapturedFrame(null);

                // 可以选择恢复视频播放
                if (actualVideoRef.current) {
                    actualVideoRef.current.play();
                }
            }
        } catch (error) {
            console.error('添加批注失败:', error);
            message.error('添加批注失败');
        }
    };

    // 删除批注
    const deleteAnnotation = async (annotationId) => {
        // 显示确认对话框
        Modal.confirm({
            title: '确认删除',
            content: '您确定要删除这条批注吗？此操作不可撤销。',
            okText: '确认删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    // 显示加载中提示
                    const hideLoading = message.loading('正在删除批注...', 0);

                    const response = await axios.delete(`/api/annotations/${annotationId}`);

                    // 关闭加载提示
                    hideLoading();

                    if (response.data.success) {
                        message.success('删除批注成功');
                        fetchAnnotations();
                    } else {
                        message.error(response.data.message || '删除批注失败');
                    }
                } catch (error) {
                    console.error('删除批注失败:', error);
                    message.error('删除批注失败: ' + (error.response?.data?.message || error.message));
                }
            }
        });
    };

    // 跳转到批注时间点
    const jumpToAnnotation = (timestamp) => {
        if (actualVideoRef.current) {
            actualVideoRef.current.currentTime = timestamp / 1000;
            if (onAnnotationSelected) {
                onAnnotationSelected(timestamp);
            }
        }
    };

    // 保存教练标注（评分和反馈）
    const saveCoachAnnotation = async () => {
        if (!trainingVideoId) {
            message.error('缺少训练视频ID');
            return;
        }

        if (coachScore === 0) {
            message.error('请先给出评分');
            return;
        }

        setSavingAnnotation(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/training-videos/${trainingVideoId}/annotate`,
                {
                    score: coachScore,
                    feedback: coachFeedback
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                message.success('标注保存成功');
                setShowCoachPanel(false);
                onAnnotationUpdate && onAnnotationUpdate();
            } else {
                message.error(response.data.message || '保存标注失败');
            }
        } catch (error) {
            console.error('保存教练标注失败:', error);
            message.error('保存标注失败，请稍后重试');
        } finally {
            setSavingAnnotation(false);
        }
    };

    // 发布教练标注
    const publishCoachAnnotation = async () => {
        if (!trainingVideoId) {
            message.error('缺少训练视频ID');
            return;
        }

        setPublishingAnnotation(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/training-videos/${trainingVideoId}/publish`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                message.success('标注已发布，学员可以查看');
                onAnnotationUpdate && onAnnotationUpdate();
            } else {
                message.error(response.data.message || '发布标注失败');
            }
        } catch (error) {
            console.error('发布教练标注失败:', error);
            message.error('发布标注失败，请稍后重试');
        } finally {
            setPublishingAnnotation(false);
        }
    };

    // 取消发布教练标注
    const unpublishCoachAnnotation = async () => {
        if (!trainingVideoId) {
            message.error('缺少训练视频ID');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/training-videos/${trainingVideoId}/unpublish`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                message.success('已取消发布标注');
                onAnnotationUpdate && onAnnotationUpdate();
            } else {
                message.error(response.data.message || '取消发布失败');
            }
        } catch (error) {
            console.error('取消发布教练标注失败:', error);
            message.error('取消发布失败，请稍后重试');
        }
    };

    // 核心功能：强制初始化画布上下文
    const forceInitContext = () => {
        if (contextRef.current && canvasRef.current) {
            // 重新设置画布和上下文属性
            canvasRef.current.style.opacity = '1'; // 确保画布可见

            // 强制设置绘图上下文属性
            contextRef.current.globalAlpha = 1.0;
            contextRef.current.lineCap = 'round';
            contextRef.current.lineJoin = 'round';
            contextRef.current.strokeStyle = currentColor;
            contextRef.current.lineWidth = lineWidth;

            console.log('画布已强制初始化:', { 颜色: currentColor, 线宽: lineWidth });
        }
    };

    // 绘图相关函数
    const getMousePosition = (canvas, evt) => {
        // 获取canvas的实际尺寸和显示尺寸
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = ({ nativeEvent }) => {
        if (!contextRef.current || !canvasRef.current) return;

        // 强制设置绘图样式，确保立即生效
        contextRef.current.lineCap = 'round';
        contextRef.current.strokeStyle = currentColor;
        contextRef.current.lineWidth = lineWidth;

        // 使用纠正后的坐标
        const { x, y } = getMousePosition(canvasRef.current, nativeEvent);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);

        // 调试日志
        console.log('开始绘图坐标:', x, y, '当前样式:', { 颜色: currentColor, 线宽: lineWidth });
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing || !contextRef.current || !canvasRef.current) return;

        // 在每次绘制时强制设置样式，避免被覆盖
        contextRef.current.strokeStyle = currentColor;
        contextRef.current.lineWidth = lineWidth;

        // 使用纠正后的坐标
        const { x, y } = getMousePosition(canvasRef.current, nativeEvent);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    const finishDrawing = () => {
        if (contextRef.current) {
            contextRef.current.closePath();
            setIsDrawing(false);

            // 保存当前绘图到历史记录
            if (canvasRef.current) {
                const imageData = contextRef.current.getImageData(
                    0, 0, canvasRef.current.width, canvasRef.current.height
                );
                setDrawingHistory(prev => [...prev, imageData]);
            }
        }
    };

    const clearCanvas = () => {
        if (contextRef.current && canvasRef.current) {
            contextRef.current.clearRect(
                0, 0, canvasRef.current.width, canvasRef.current.height
            );
            setDrawingHistory([]);
        }
    };

    const undoLastDrawing = () => {
        if (drawingHistory.length === 0 || !contextRef.current || !canvasRef.current) return;

        // 移除最后一步
        const newHistory = [...drawingHistory];
        newHistory.pop();
        setDrawingHistory(newHistory);

        // 清空画布
        contextRef.current.clearRect(
            0, 0, canvasRef.current.width, canvasRef.current.height
        );

        // 重新绘制历史记录
        if (newHistory.length > 0) {
            const lastImageData = newHistory[newHistory.length - 1];
            contextRef.current.putImageData(lastImageData, 0, 0);
        }
    };

    // 渲染批注列表项
    const renderAnnotationItem = (item) => {
        const timeFormatted = new Date(item.time_seconds * 1000).toISOString().substr(11, 8);

        // 获取作者信息
        const author = item.author || '未知用户';
        const authorRole = item.author_role || 'user';

        // 添加调试信息
        console.log('渲染批注项:', {
            id: item.id,
            author: author,
            authorRole: authorRole,
            原始数据: item
        });

        // 根据角色设置不同的标签颜色
        const getRoleTag = (role) => {
            switch (role) {
                case 'coach':
                    return <Tag color="gold">教练</Tag>;
                case 'admin':
                    return <Tag color="red">管理员</Tag>;
                default:
                    return <Tag color="green">学员</Tag>;
            }
        };

        return (
            <List.Item
                key={item.id}
                actions={[
                    <Tooltip title="跳转到此时间点">
                        <Button
                            type="link"
                            onClick={() => jumpToAnnotation(item.timestamp)}
                            icon={<CommentOutlined />}
                        />
                    </Tooltip>,
                    <Tooltip title="删除批注">
                        <Button
                            type="link"
                            danger
                            onClick={() => deleteAnnotation(item.id)}
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                ].filter(Boolean)}
            >
                <List.Item.Meta
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                            <Tag color="blue">{timeFormatted}</Tag>
                            <Tag color="purple">指导批注</Tag>
                            {getRoleTag(authorRole)}
                            <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                                批注者：{author}
                            </span>
                        </div>
                    }
                    description={
                        <div>
                            {/* 如果是合并类型批注，先显示绘图，再显示文字 */}
                            {(item.type === 'combined' || item.type === 'drawing') && item.drawing_data && (
                                <div style={{ marginBottom: 8 }}>
                                    <img
                                        src={item.drawing_data}
                                        alt="批注绘图"
                                        style={{ maxWidth: '100%', border: '1px solid #d9d9d9' }}
                                    />
                                </div>
                            )}

                            {/* 如果有文字内容，显示文字批注 */}
                            {item.content && (
                                <div style={{ margin: '8px 0' }}>
                                    {item.content}
                                </div>
                            )}
                        </div>
                    }
                />
            </List.Item>
        );
    };

    // 教练评分面板
    const renderCoachPanel = () => {
        if (!isCoach || !trainingVideoId) return null;

        return (
            <Card
                title="教练评分与反馈"
                style={{ marginBottom: 16 }}
                extra={
                    <Button
                        type={showCoachPanel ? "default" : "primary"}
                        onClick={() => setShowCoachPanel(!showCoachPanel)}
                    >
                        {showCoachPanel ? "收起" : "展开"}
                    </Button>
                }
            >
                {showCoachPanel && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ marginBottom: 8 }}>
                                <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                                <span style={{ fontWeight: 'bold' }}>训练评分：</span>
                            </div>
                            <Rate
                                value={coachScore}
                                onChange={setCoachScore}
                                style={{ fontSize: '20px' }}
                            />
                            <span style={{ marginLeft: 8, color: '#666' }}>
                                ({coachScore}/5)
                            </span>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ marginBottom: 8 }}>
                                <CommentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span style={{ fontWeight: 'bold' }}>指导反馈：</span>
                            </div>
                            <TextArea
                                rows={4}
                                value={coachFeedback}
                                onChange={(e) => setCoachFeedback(e.target.value)}
                                placeholder="请输入对学员训练的指导意见和建议..."
                            />
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={saveCoachAnnotation}
                                loading={savingAnnotation}
                                style={{ marginRight: 8 }}
                            >
                                保存标注
                            </Button>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={publishCoachAnnotation}
                                loading={publishingAnnotation}
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                发布给学员
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        );
    };

    // 管理员批注工具栏
    const renderAnnotationToolbar = () => {
        console.log('检查管理员状态:', isAdmin); // 添加调试日志
        // 临时注释掉管理员检查，让所有用户都能看到批注工具
        // if (!isAdmin) return null;

        return (
            <div className="annotation-toolbar" style={{ marginBottom: 16 }}>
                {!isAnnotating ? (
                    // 开始批注前的界面
                    <div>
                        <Button
                            type="primary"
                            icon={<CameraOutlined />}
                            onClick={captureVideoFrame}
                            block
                        >
                            开始批注（截取当前帧）
                        </Button>
                    </div>
                ) : (
                    // 开始批注后的界面
                    <div>
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', marginBottom: 8 }}>
                                <Select
                                    value={currentColor}
                                    onChange={setCurrentColor}
                                    style={{ width: 80, marginRight: 8 }}
                                >
                                    <Option value="#ff0000">红色</Option>
                                    <Option value="#00ff00">绿色</Option>
                                    <Option value="#0000ff">蓝色</Option>
                                    <Option value="#ffff00">黄色</Option>
                                    <Option value="#ffffff">白色</Option>
                                </Select>

                                <Select
                                    value={lineWidth}
                                    onChange={setLineWidth}
                                    style={{ width: 80, marginRight: 8 }}
                                >
                                    <Option value={1}>细线</Option>
                                    <Option value={3}>中等</Option>
                                    <Option value={5}>粗线</Option>
                                </Select>

                                <Button
                                    icon={<UndoOutlined />}
                                    onClick={undoLastDrawing}
                                    disabled={drawingHistory.length === 0}
                                    style={{ marginRight: 8 }}
                                >
                                    撤销
                                </Button>

                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={clearCanvas}
                                    style={{ marginRight: 8 }}
                                >
                                    清空
                                </Button>
                            </div>
                        </div>

                        {/* 绘图画布区域 */}
                        <div
                            style={{
                                position: 'relative',
                                border: '1px solid #d9d9d9',
                                marginBottom: 8,
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            {/* 批注前显示截图 */}
                            {capturedFrame && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 1
                                    }}
                                >
                                    <img
                                        src={capturedFrame}
                                        alt="当前视频帧"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            )}

                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={finishDrawing}
                                onMouseLeave={finishDrawing}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '500px',
                                    cursor: 'crosshair',
                                    position: 'relative',
                                    zIndex: 2,
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>

                        {/* 文字批注区域 */}
                        <TextArea
                            rows={3}
                            value={currentAnnotation}
                            onChange={(e) => setCurrentAnnotation(e.target.value)}
                            placeholder="输入批注内容..."
                            style={{ marginBottom: 8 }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                type="default"
                                onClick={cancelAnnotation}
                                style={{ marginRight: 8 }}
                            >
                                取消批注
                            </Button>

                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={addAnnotation}
                            >
                                保存批注
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="video-annotation-container">
            {/* 视频播放器 */}
            {videoUrl && (
                <div style={{ marginBottom: 16 }}>
                    <video
                        ref={actualVideoRef}
                        src={videoUrl}
                        controls
                        crossOrigin="anonymous"
                        style={{ width: '100%', maxHeight: '400px' }}
                        onLoadedMetadata={() => {
                            console.log('视频元数据加载完成');
                        }}
                        onError={(e) => {
                            console.error('视频加载错误:', e);
                        }}
                    />
                </div>
            )}

            {/* 教练评分面板 */}
            {renderCoachPanel()}

            {/* 批注工具栏 */}
            {renderAnnotationToolbar()}

            {/* 批注列表 */}
            <List
                className="annotation-list"
                loading={loading}
                itemLayout="vertical"
                dataSource={annotations}
                renderItem={renderAnnotationItem}
                locale={{ emptyText: '暂无批注' }}
            />
        </div>
    );
};

export default VideoAnnotation;
