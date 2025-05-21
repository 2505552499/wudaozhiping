import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, List, Popover, message, Select, Tag, Tooltip } from 'antd';
import { CommentOutlined, DeleteOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
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
    const [annotationType, setAnnotationType] = useState('text');
    const [drawingHistory, setDrawingHistory] = useState([]);
    const [currentColor, setCurrentColor] = useState('#ff0000');
    const [lineWidth, setLineWidth] = useState(3);

    // 初始化Canvas
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current?.clientWidth || 640;
            canvas.height = videoRef.current?.clientHeight || 360;
            
            const context = canvas.getContext('2d');
            context.lineCap = 'round';
            context.strokeStyle = currentColor;
            context.lineWidth = lineWidth;
            contextRef.current = context;
        }
    }, [videoRef, currentColor, lineWidth]);

    // 获取视频当前帧
    useEffect(() => {
        if (videoRef.current) {
            const updateCurrentFrame = () => {
                setCurrentFrame(Math.floor(videoRef.current.currentTime * 1000));
            };
            
            videoRef.current.addEventListener('timeupdate', updateCurrentFrame);
            return () => {
                videoRef.current?.removeEventListener('timeupdate', updateCurrentFrame);
            };
        }
    }, [videoRef]);

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
        if (!currentAnnotation.trim() && annotationType === 'text') {
            message.warning('请输入批注内容');
            return;
        }

        try {
            let annotationData = {
                video_id: videoId,
                timestamp: currentFrame,
                time_seconds: videoRef.current.currentTime,
                type: annotationType,
                content: currentAnnotation
            };

            // 如果是绘图批注，添加画布数据
            if (annotationType === 'drawing' && canvasRef.current) {
                annotationData.drawing_data = canvasRef.current.toDataURL('image/png');
            }

            const response = await axios.post('/api/annotations', annotationData);
            if (response.data.success) {
                message.success('添加批注成功');
                setCurrentAnnotation('');
                clearCanvas();
                fetchAnnotations();
            }
        } catch (error) {
            console.error('添加批注失败:', error);
            message.error('添加批注失败');
        }
    };

    // 删除批注
    const deleteAnnotation = async (annotationId) => {
        try {
            const response = await axios.delete(`/api/annotations/${annotationId}`);
            if (response.data.success) {
                message.success('删除批注成功');
                fetchAnnotations();
            }
        } catch (error) {
            console.error('删除批注失败:', error);
            message.error('删除批注失败');
        }
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

    // 绘图相关函数
    const startDrawing = ({ nativeEvent }) => {
        if (annotationType !== 'drawing' || !contextRef.current) return;
        
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing || !contextRef.current) return;
        
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
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
                    isAdmin && (
                        <Tooltip title="删除批注">
                            <Button 
                                type="link" 
                                danger 
                                onClick={() => deleteAnnotation(item.id)}
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    )
                ].filter(Boolean)}
            >
                <List.Item.Meta
                    title={
                        <div>
                            <Tag color="blue">{timeFormatted}</Tag>
                            <Tag color={item.type === 'text' ? 'green' : 'orange'}>
                                {item.type === 'text' ? '文字批注' : '绘图批注'}
                            </Tag>
                        </div>
                    }
                    description={
                        <div>
                            {item.type === 'text' ? (
                                <div>{item.content}</div>
                            ) : (
                                <div>
                                    <img 
                                        src={item.drawing_data} 
                                        alt="批注绘图" 
                                        style={{ maxWidth: '100%', border: '1px solid #d9d9d9' }} 
                                    />
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
                <div style={{ marginBottom: 8 }}>
                    <Select
                        value={annotationType}
                        onChange={setAnnotationType}
                        style={{ width: 120, marginRight: 8 }}
                    >
                        <Option value="text">文字批注</Option>
                        <Option value="drawing">绘图批注</Option>
                    </Select>

                    {annotationType === 'drawing' && (
                        <>
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
                        </>
                    )}
                </div>

                {annotationType === 'text' ? (
                    <TextArea
                        rows={3}
                        value={currentAnnotation}
                        onChange={(e) => setCurrentAnnotation(e.target.value)}
                        placeholder="输入批注内容..."
                        style={{ marginBottom: 8 }}
                    />
                ) : (
                    <div 
                        style={{ 
                            position: 'relative', 
                            border: '1px solid #d9d9d9',
                            marginBottom: 8,
                            backgroundColor: '#000'
                        }}
                    >
                        <canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={finishDrawing}
                            onMouseLeave={finishDrawing}
                            style={{
                                display: 'block',
                                width: '100%',
                                cursor: annotationType === 'drawing' ? 'crosshair' : 'default'
                            }}
                        />
                    </div>
                )}

                <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={addAnnotation}
                >
                    保存批注
                </Button>
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
