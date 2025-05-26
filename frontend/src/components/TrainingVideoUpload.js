import React, { useState } from 'react';
import { Upload, Button, message, Modal, Form, Input, Progress } from 'antd';
import { VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const { TextArea } = Input;

const TrainingVideoUpload = ({ appointmentId, onUploadSuccess, visible, onCancel }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileList, setFileList] = useState([]);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error('请选择要上传的视频文件');
      return;
    }

    const formData = new FormData();
    formData.append('video', fileList[0]);
    formData.append('description', values.description || '');

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/training-videos/upload/${appointmentId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.success) {
        message.success('训练视频上传成功！');
        form.resetFields();
        setFileList([]);
        setUploadProgress(0);
        onUploadSuccess && onUploadSuccess();
        onCancel && onCancel();
      } else {
        message.error(response.data.message || '上传失败');
      }
    } catch (error) {
      console.error('上传训练视频失败:', error);
      message.error(error.response?.data?.message || '上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      // 检查文件类型
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('请上传视频文件！');
        return Upload.LIST_IGNORE;
      }

      // 检查文件大小（限制为100MB）
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('视频文件大小不能超过100MB！');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false; // 阻止自动上传
    },
    fileList,
  };

  return (
    <Modal
      title="上传训练视频"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpload}
      >
        <Form.Item
          label="选择视频文件"
          required
        >
          <Upload.Dragger
            {...uploadProps}
            listType="picture"
            maxCount={1}
            accept="video/*"
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <VideoCameraOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持MP4、AVI、MOV等格式，文件大小不超过100MB
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item
          name="description"
          label="视频描述"
        >
          <TextArea
            rows={4}
            placeholder="请描述您的训练内容、遇到的问题或希望教练重点关注的地方..."
            disabled={uploading}
          />
        </Form.Item>

        {uploading && (
          <Form.Item>
            <Progress 
              percent={uploadProgress} 
              status={uploadProgress === 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Form.Item>
        )}

        <Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button 
              onClick={onCancel} 
              style={{ marginRight: 8 }}
              disabled={uploading}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={uploading}
              icon={<UploadOutlined />}
            >
              {uploading ? '上传中...' : '上传视频'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TrainingVideoUpload;
