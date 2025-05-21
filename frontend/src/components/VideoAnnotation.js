import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, List, Popover, message, Select, Tag, Tooltip, Modal } from 'antd';
import { CommentOutlined, DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined, CameraOutlined, PauseOutlined } from '@ant-design/icons';
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
 * @param {function} props.onAnnotationSelected - 批注选中回调函数
 */
const VideoAnnotation = (props) => {
    const { videoUrl, videoId, videoRef, isAdmin = false, onAnnotationSelected } = props;
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

    // 初始化Canvas
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            // 设置适当的原始尺寸，防止被缩放影响绘图效果
            if (!canvas.width || canvas.width < 100) {
                canvas.width = videoRef.current?.videoWidth || 640;
            }
            if (!canvas.height || canvas.height < 100) {
                canvas.height = videoRef.current?.videoHeight || 360;
            }
            
            const context = canvas.getContext('2d');
            context.lineCap = 'round';
            context.strokeStyle = currentColor;
            context.lineWidth = lineWidth;
            contextRef.current = context;
            console.log('Canvas 初始化完成，已设置绘图样式:', { 颜色: currentColor, 线宽: lineWidth });
        }
    }, [videoRef, currentColor, lineWidth]);
    
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
        if (videoRef.current) {
            // 增加空值检查，避免访问未加载视频的currentTime属性
            const updateCurrentFrame = () => {
                // 仅在videoRef.current不为空且有currentTime属性时才更新
                if (videoRef.current && typeof videoRef.current.currentTime !== 'undefined') {
                    try {
                        const time = videoRef.current.currentTime;
                        setCurrentFrame(Math.floor(time * 1000));
                        setVideoTime(time);
                    } catch (error) {
                        console.error('获取视频时间出错:', error);
                    }
                }
            };
            
            // 添加事件监听
            const videoElement = videoRef.current;
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
    }, [videoRef]);
    
    // 截取当前视频帧
    const captureVideoFrame = () => {
        if (!videoRef.current) {
            message.error('视频加载失败');
            return;
        }
        
        try {
            // 暂停视频
            videoRef.current.pause();
            
            // 添加调试日志
            console.log('视频尺寸:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
            
            // 创建一个临时canvas来截取视频帧
            const tempCanvas = document.createElement('canvas');
            // 确保设置正确的尺寸，防止宽高为0
            tempCanvas.width = videoRef.current.videoWidth || 640;
            tempCanvas.height = videoRef.current.videoHeight || 360;
            
            // 将视频帧绘制到canvas上
            const tempContext = tempCanvas.getContext('2d');
            tempContext.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // 将canvas内容转为数据地址
            const frameDataUrl = tempCanvas.toDataURL('image/jpeg');
            setCapturedFrame(frameDataUrl);
            console.log('截取的视频帧 URL 长度:', frameDataUrl.length);
            
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
                canvasRef.current.width = videoRef.current.videoWidth || 640;
                canvasRef.current.height = videoRef.current.videoHeight || 360;
                
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
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    // 获取批注列表
    useEffect(() => {
        if (videoId) {
            fetchAnnotations();
        }
    }, [videoId]);

    // 获取批注列表
    const fetchAnnotations = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/annotations/${videoId}`);
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
            let annotationData = {
                video_id: videoId,
                timestamp: currentFrame,
                time_seconds: videoTime,
                type: 'combined', // 合并的批注类型
                content: currentAnnotation
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
                if (videoRef.current) {
                    videoRef.current.play();
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
        if (videoRef.current) {
            videoRef.current.currentTime = timestamp / 1000;
            if (onAnnotationSelected) {
                onAnnotationSelected(timestamp);
            }
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
                        <div>
                            <Tag color="blue">{timeFormatted}</Tag>
                            <Tag color="purple">指导批注</Tag>
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
            {renderAnnotationToolbar()}

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
