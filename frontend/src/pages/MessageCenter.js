import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, Typography, List, Avatar, Badge, Card, 
  Button, Input, message, Empty, Tabs, Spin,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  MessageOutlined, 
  SendOutlined
} from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { messageAPI, appointmentAPI } from '../api';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const MessageCenter = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState({});
  const messagesEndRef = useRef(null);

  // 获取用户消息
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await messageAPI.getUserMessages();
      if (response.data.success) {
        // 按时间排序，最新的在前面
        const sortedMessages = response.data.messages.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
        setMessages(sortedMessages);
        
        // 提取联系人列表
        const contactsMap = {};
        const currentUserId = localStorage.getItem('username');
        
        sortedMessages.forEach(msg => {
          // 确定联系人ID（如果自己是发送者，则联系人是接收者；反之亦然）
          const contactId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
          
          if (!contactsMap[contactId]) {
            contactsMap[contactId] = {
              id: contactId,
              lastMessage: msg.content,
              lastTime: msg.created_at,
              unread: msg.receiver_id === currentUserId && !msg.read // 只有接收到的消息才可能未读
            };
          } else if (new Date(msg.created_at) > new Date(contactsMap[contactId].lastTime)) {
            contactsMap[contactId].lastMessage = msg.content;
            contactsMap[contactId].lastTime = msg.created_at;
            if (msg.receiver_id === currentUserId) {
              contactsMap[contactId].unread = contactsMap[contactId].unread || !msg.read;
            }
          }
        });
        
        // 转换为数组并按最后消息时间排序
        const contactsList = Object.values(contactsMap).sort((a, b) => 
          new Date(b.lastTime) - new Date(a.lastTime)
        );
        setContacts(contactsList);
        
        // 按联系人组织对话
        const conversationsMap = {};
        const currentUser = localStorage.getItem('username');
        
        sortedMessages.forEach(msg => {
          // 确定联系人ID（如果自己是发送者，则联系人是接收者；反之亦然）
          const contactId = msg.sender_id === currentUser ? msg.receiver_id : msg.sender_id;
          
          if (!conversationsMap[contactId]) {
            conversationsMap[contactId] = [];
          }
          conversationsMap[contactId].push(msg);
        });
        
        setConversations(conversationsMap);
        
        // 如果有联系人但没有选中任何一个，则选中第一个
        if (contactsList.length > 0 && !activeContact) {
          setActiveContact(contactsList[0].id);
        }
      } else {
        message.error(response.data.message || '获取消息失败');
      }
    } catch (error) {
      console.error('获取消息失败:', error);
      message.error('获取消息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchMessages();
    
    // 设置定时刷新
    const interval = setInterval(fetchMessages, 30000); // 每30秒刷新一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 当活动联系人变化或消息更新时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [activeContact, messages]);
  
  // 滚动到对话底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 标记消息为已读
  const markAsRead = async (messageId) => {
    try {
      const response = await messageAPI.markMessageAsRead(messageId);
      if (response.data.success) {
        // 更新本地消息状态
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
        
        // 强制刷新一次消息列表，确保未读状态正确更新
        fetchMessages();
        
        // 触发自定义事件，通知其他组件更新未读消息计数
        const event = new CustomEvent('unreadMessagesChanged');
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('标记消息已读失败:', error);
    }
  };

  // 选择联系人
  const selectContact = (contactId) => {
    setActiveContact(contactId);
    
    // 标记该联系人的所有未读消息为已读
    if (conversations[contactId]) {
      const unreadMessages = conversations[contactId].filter(msg => !msg.read);
      
      // 如果有未读消息，标记它们为已读
      if (unreadMessages.length > 0) {
        Promise.all(unreadMessages.map(msg => markAsRead(msg.id)))
          .then(() => {
            // 强制刷新未读消息计数
            fetchMessages();
            
            // 请求完成后触发一个额外的事件来更新在所有地方的未读计数
            setTimeout(() => {
              const event = new CustomEvent('unreadMessagesChanged');
              window.dispatchEvent(event);
            }, 500); // 增加延时确保所有消息已被标记
          });
      }
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!replyContent.trim()) {
      message.warning('请输入消息内容');
      return;
    }
    
    setSendLoading(true);
    try {
      const response = await appointmentAPI.sendMessage({
        receiver_id: activeContact,
        content: replyContent.trim()
      });
      
      if (response.data.success) {
        // 清空输入框
        setReplyContent('');
        
        // 添加新消息到本地状态
        const newMessage = response.data.data;
        setMessages(prev => [...prev, newMessage]);
        
        // 更新对话
        setConversations(prev => {
          const updated = { ...prev };
          if (!updated[activeContact]) {
            updated[activeContact] = [];
          }
          updated[activeContact].push(newMessage);
          return updated;
        });
        
        // 刷新消息列表
        fetchMessages();
      } else {
        message.error(response.data.message || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送失败，请稍后重试');
    } finally {
      setSendLoading(false);
    }
  };

  // 格式化时间
  const formatTime = (timeString) => {
    const date = moment(timeString);
    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  // 渲染联系人列表
  const renderContacts = () => (
    <List
      dataSource={contacts}
      renderItem={contact => (
        <List.Item 
          onClick={() => selectContact(contact.id)}
          className={activeContact === contact.id ? 'active-contact' : ''}
          style={{ 
            cursor: 'pointer', 
            padding: '12px 16px',
            backgroundColor: activeContact === contact.id ? '#e6f7ff' : 'transparent',
            borderLeft: activeContact === contact.id ? '3px solid #1890ff' : 'none'
          }}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={contact.unread} offset={[-5, 5]}>
                <Avatar icon={<UserOutlined />} />
              </Badge>
            }
            title={<Text strong>{contact.id}</Text>}
            description={
              <Text type="secondary" ellipsis={{ rows: 1 }}>
                {contact.lastMessage}
              </Text>
            }
          />
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {moment(contact.lastTime).format('MM-DD HH:mm')}
            </Text>
          </div>
        </List.Item>
      )}
      locale={{ emptyText: <Empty description="暂无联系人" /> }}
    />
  );

  // 渲染对话消息
  const renderConversation = () => {
    const currentUserId = localStorage.getItem('username');
    const conversation = conversations[activeContact] || [];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* 对话头部 */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <Text strong style={{ fontSize: '16px' }}>{activeContact}</Text>
        </div>
        
        {/* 消息列表 */}
        <div 
          style={{ 
            flex: 1, 
            padding: '16px', 
            overflowY: 'auto',
            backgroundColor: '#f5f5f5'
          }}
        >
          {conversation.length === 0 ? (
            <Empty description="暂无消息记录" />
          ) : (
            conversation.map(msg => {
              const isSelf = msg.sender_id === currentUserId;
              return (
                <div 
                  key={msg.id} 
                  style={{
                    display: 'flex',
                    flexDirection: isSelf ? 'row-reverse' : 'row',
                    marginBottom: '16px'
                  }}
                >
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ marginRight: isSelf ? 0 : '12px', marginLeft: isSelf ? '12px' : 0 }}
                  />
                  <div style={{ maxWidth: '70%' }}>
                    <div>
                      <Text strong style={{ marginRight: '8px' }}>
                        {isSelf ? '我' : msg.sender_id}
                      </Text>
                      <Tooltip title={formatTime(msg.created_at)}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {moment(msg.created_at).format('MM-DD HH:mm:ss')}
                        </Text>
                      </Tooltip>
                    </div>
                    <Card 
                      style={{ 
                        marginTop: '4px',
                        backgroundColor: isSelf ? '#e6f7ff' : '#fff',
                        borderColor: isSelf ? '#91d5ff' : '#d9d9d9'
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                    >
                      <Text>{msg.content}</Text>
                    </Card>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* 消息输入框 */}
        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
          <TextArea
            rows={3}
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="请输入消息内容..."
            disabled={!activeContact}
          />
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={sendLoading}
              onClick={sendMessage}
              disabled={!activeContact}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>
          <MessageOutlined style={{ marginRight: 8 }} />
          消息中心
        </Title>
        
        <Card bodyStyle={{ padding: 0, minHeight: '600px' }}>
          <div style={{ display: 'flex', height: '600px' }}>
            {/* 联系人列表 */}
            <div style={{ width: '300px', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <Spin />
                </div>
              ) : (
                renderContacts()
              )}
            </div>
            
            {/* 对话区域 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {activeContact ? (
                renderConversation()
              ) : (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Empty description="请选择一个联系人开始对话" />
                </div>
              )}
            </div>
          </div>
        </Card>
      </Content>
    </MainLayout>
  );
};

export default MessageCenter;
