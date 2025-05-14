import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Card, Row, Col, Button, Select, 
  Input, Tag, Avatar, Rate, Modal, Form, DatePicker, 
  TimePicker, message, Tabs, List, Badge, Divider, Space, Empty, Spin
} from 'antd';
import { 
  UserOutlined, EnvironmentOutlined, CalendarOutlined, 
  ClockCircleOutlined, SearchOutlined, FilterOutlined
} from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';

// 鎾栨締锟紸PI锟芥粴穰洑
import coachAPI from '../api/coachAPI';
import appointmentAPI from '../api/appointmentAPI';
import paymentService from '../services/paymentService';

// 鎾栨締锟斤拷鑺革拷閵嬪帺锟介殲?import AppointmentListItem from '../components/AppointmentListItem';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 锟借垁锟斤拷锟芥倢铦忥拷鈽咃拷妗咃拷鍘扳槄
const skillOptions = [
  '鎲姡锟斤拷?, '锟芥€犮锟?, '锟金ぉ哄澗锟?, '鏁讹几锟斤拷?, '锟芥€ワ拷锟?,
  '锟斤拷锟?, '闋濓拷绠诧拷?, '铦涚锟斤拷?, '鐢囪閽熸啛稹憭妤?, '锟藉棥锟?
];

function CoachAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 锟藉梿锟斤拷锟介妺?  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showCoachDetailModal, setShowCoachDetailModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [appointmentFormData, setAppointmentFormData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [paymentAppointmentId, setPaymentAppointmentId] = useState(null);
  
  // 铦戝仸锟姐棁杈洪殲?  const [filters, setFilters] = useState({
    city: undefined,
    district: undefined,
    skill: undefined
  });
  
  // 鐠夛拷锟藉唺RL锟斤拷愫殫锟斤拷锟金█ｏ拷tab锟斤拷愫殫璜逛寠锟藉吀锟斤拷锛凤拷锟斤拷锟斤拷锟藉€?
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  // 锟界憰锟斤拷鍡碉拷锟金掆€?
  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const response = await coachAPI.getCoaches();
      setCoaches(response.data.coaches || []);
    } catch (error) {
      console.error('锟界憰锟斤拷鍡碉拷锟金掆€濇啳姊彇:', error);
      message.error('锟界憰锟斤拷鍡碉拷锟金掆€濇啳姊彇鍤楄绐堣潝婊氾拷锟芥哗锟?);
    } finally {
      setLoading(false);
    }
  };

  // 锟界憰锟斤拷黏靖锟斤拷稹憭鈥?
  const fetchCities = async () => {
    try {
      const response = await coachAPI.getCities();
      setCities(response.data.cities || []);
    } catch (error) {
      console.error('锟界憰锟斤拷黏靖锟斤拷稹憭鈥濇啳姊彇:', error);
    }
  };

  // 锟界憰锟斤拷绠忥拷锟金掆€?
  const fetchDistricts = async (city) => {
    if (!city) {
      setDistricts([]);
      return;
    }
    
    try {
      const response = await coachAPI.getDistricts(city);
      setDistricts(response.data.districts || []);
    } catch (error) {
      console.error('锟界憰锟斤拷绠忥拷锟金掆€濇啳姊彇:', error);
    }
  };

  // 锟界憰锟斤拷鍐斤拷鎲革拷婕诧拷稹憭鈥?
  const fetchUserAppointments = async () => {
    setAppointmentLoading(true);
    try {
      const response = await appointmentAPI.getUserAppointments();
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('锟界憰锟芥喐锟芥疾锟金掆€濇啳姊彇:', error);
      message.error('锟界憰锟芥喐锟芥疾锟金掆€濇啳姊彇鍤楄绐堣潝婊氾拷锟芥哗锟?);
    } finally {
      setAppointmentLoading(false);
    }
  };

  // 锟芥花钄潙鍋︼拷銞囪竞闅?  const handleResetFilters = () => {
    setFilters({
      city: undefined,
      district: undefined,
      skill: undefined
    });
    setDistricts([]);
  };

  // 鎲拷锟斤拷黏靖锟斤拷鋩瑰噿
  const handleCityChange = (value) => {
    setFilters({
      ...filters,
      city: value,
      district: undefined
    });
    fetchDistricts(value);
  };

  // 鎲拷锟斤拷绠忥拷锟戒€瑰噿
  const handleDistrictChange = (value) => {
    setFilters({
      ...filters,
      district: value
    });
  };

  // 鎲拷锟斤拷锟斤拷璩拷锟?  const handleSkillChange = (value) => {
    setFilters({
      ...filters,
      skill: value
    });
  };

  // 锟芥瀼锟芥喐锟芥疾鐠呪姤锟斤拷锟?
  const openAppointmentModal = (coach) => {
    setSelectedCoach(coach);
    setShowAppointmentModal(true);
    setShowCoachDetailModal(false);
  };

  // 锟藉柌稹鎲革拷婕茬拝鈯ワ拷锟斤拷
  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedCoach(null);
  };

  // 锟芥泟鍏э拷鍡碉拷闇傝锟界拝鈯ワ拷锟斤拷
  const openCoachDetailModal = (coach) => {
    setSelectedCoach(coach);
    setShowCoachDetailModal(true);
  };

  // 锟藉柌稹锟藉椀锟介渹琛岋拷鐠呪姤锟斤拷锟?
  const closeCoachDetailModal = () => {
    setShowCoachDetailModal(false);
  };

  // 锟芥瀼锟斤拷鐓撅拷锟斤拷锟借垁鑺嬶拷锟斤拷 - 锟藉喗锟借潖锟界锟斤拷鑺嬶拷锟斤拷閵濆噵铦欙拷?  const handleOpenMessageModal = (coach) => {
    setSelectedCoach(coach);
    setShowMessageModal(true);
    setShowCoachDetailModal(false);
  };

  // 锟藉柌稹锟界吘锟斤拷锟斤拷鑸€鑺嬶拷锟斤拷
  const closeMessageModal = () => {
    setShowMessageModal(false);
  };
  // 锟界吘锟斤拷锟斤拷鑸愶拷锟藉椀锟?
  const handleSendMessage = async (values) => {
    try {
      const response = await coachAPI.sendMessage({
        coach_id: selectedCoach.id,
        message: values.message
      });
      
      if (response.data.success) {
        message.success('鐦拷锟斤拷鐓撅拷锟斤拷锟?);
        closeMessageModal();
      } else {
        message.error(response.data.message || '锟界吘锟斤拷锟斤拷鑷粌闊?);
      }
    } catch (error) {
      console.error('锟界吘锟斤拷锟斤拷鑷粌闊?', error);
      message.error('锟界吘锟斤拷锟斤拷鑷粌闊愪紣锟介渹鐟烇拷锟金　烇拷闇?);
    }
  };

  // 棰诧拷皎瓕锟借常愫殫稹伓锛嗛澖鑴诧拷铦忥拷D閵濇哗鈼ら澖鏍笺嚎鍤楋拷鑰ㄦ啳惴紀ach4_4锟芥锟藉殫?  const normalizeCoachId = (id) => {
    // 鎲掞拷锟絀D锟斤拷閴勯姖瑙侊拷铦ラ伕锟斤拷鑸拷锟借埅鈼わ拷韬扮Г闈芥牸愫匡拷锟紻
    if (typeof id === 'string' && id.includes('_')) {
      // 锟界憰锟斤拷绠葛D鍤楋拷绺э拷鍔愶拷锟藉瀺鐟拷馉购锟斤拷稹拪锟斤拷鍏革拷鍤?      const baseId = id.split('_')[0];
      console.log(`闈芥锟斤拷鍡碉拷ID: 闅?${id} 闈芥牸杩ら姖?${baseId}`);
      return baseId;
    }
    return id;
  };

  // 锟金锋急鎲革拷婕?- 锟藉暎閵侊拷鑷獞锟姐棁馥嫎鎲革拷婕诧拷鎿х硴锟借。锟斤拷鍠查殲?  const handleSubmitAppointment = async (values) => {
    try {
      // 闇傝。锟介湀鍟ｏ拷selectedCoach锟斤拷馉稏锟?      console.log('锟金锋急鎲革拷婕诧拷鍡ワ拷selectedCoach:', JSON.stringify(selectedCoach));
      console.log('锟金锋急鎲革拷婕诧拷鍡ワ拷锟藉椀锟絀D铦愰锟?', typeof selectedCoach.id, '锟藉椀锟絀D锟?', selectedCoach.id);
      
      // 闁拷锟斤拷稹潡锟借潖锟紻鍤楌，氾紗闈借嫹锟斤拷锟介墑锟借锟界槢椁冿拷锟斤拷锟借澔锟?
      const normalizedCoachId = normalizeCoachId(selectedCoach.id);
      console.log('闁拷锟斤拷纭嬶拷锟斤拷锟借潖锟紻:', normalizedCoachId);
      
      // 闈藉槬锟芥喐锟芥疾閵靛吀锟斤拷鍞虫椏鍤楌，氶崅閳ぞ革拷鎾辩补锟借潵?      const appointmentData = {
        coach_id: normalizedCoachId, // 闆胯蓟閸傞柅锟斤拷锟金夛拷ID
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        location: selectedCoach.location.city + ' ' + selectedCoach.location.districts[0], // 闆胯蓟閸傦拷鍡碉拷锟斤拷锟借澋?        skill: values.training_type, // 鎾狅拷raining_type锟芥儵锟斤拷閰択ill
        duration: values.duration // 鐦涢锟絛uration鎽焾鎸?
      };
      
      // 锟介娇娲荤拤锟斤拷浜わ拷铦忥拷锟絚oach_id
      console.log('鎲革拷婕诧拷鍞虫椏:', appointmentData); 
      console.log('锟斤拷铦忥拷锟介埈鏂わ拷锟藉椀锟絀D铦愰锟?', typeof appointmentData.coach_id, '锟?', appointmentData.coach_id);
      
      // 闈藉槬锟芥喐锟芥疾锟藉敵鏃?
      setAppointmentFormData(appointmentData);
      
      // 闇傦絹鋽拷鍐斤拷锟借嚞鐐忛柆锟斤拷锟藉柈穑埐闅?      Modal.confirm({
        title: '鎲革拷婕叉拰鑴拷閳?,
        content: '锟藉吀锟斤拷黏た绶碉拷鍐金查殲銞涳拷铦ヨタ鏅讹拷鍓侊拷椁堜€圭硴铦旀粴锟斤拷鑷拷鍤?,
        okText: '铦¤鏈栵拷鑷拷',
        cancelText: '铦旀粴锟斤拷鑷拷',
        onOk: () => {
          // 锟芥瀼锟斤拷鑷拷鐠呪姤锟斤拷锟?
          setShowPaymentModal(true);
        },
        onCancel: async () => {
          // 锟芥箶穰粬锟金﹂仯鎲革拷婕插殫鋽讹拷闅炰亝鏅?
          await createAppointmentWithoutPayment(appointmentData);
        }
      });
      
      // 锟藉柌稹鎲革拷婕茬拝鈯ワ拷锟斤拷
      setShowAppointmentModal(false);
    } catch (error) {
      console.error('鎲拷锟芥喐锟芥疾鎲鎻?', error);
      message.error('鎲拷锟芥喐锟芥疾鎲鎻栧殫璜圭獔铦旀粴锟斤拷婊╋拷');
    }
  };
  
  // 锟金﹂仯鎲革拷婕查浛锟斤拷铦¤鏈栵拷鑷拷
  const createAppointmentWithoutPayment = async (appointmentData) => {
    try {
      // 锟介拝锟介姖锟介殲璩ｃ涵锟芥鍍庤潠妗愶拷锟藉椀锟絀D鐢囷拷锛嗗殫灞革拷锟芥粴锟斤拷鍒镐敭鎲?      const appointmentDataToSend = {
        ...appointmentData,
        coach_id: normalizeCoachId(appointmentData.coach_id) // 锟介娇娲昏潠妗愶拷ID鐢囷拷锛?
      };
      console.log('锟金﹂仯鎲革拷婕查浛锟斤拷锟借嚟锟藉殫锟斤拷锟斤拷愫拷?', JSON.stringify(appointmentDataToSend));
      
      const appointmentResponse = await appointmentAPI.createAppointment(appointmentDataToSend);
      console.log('鎲革拷婕诧拷馥暒閬ｏ拷婊氾拷:', appointmentResponse.data);
      
      if (appointmentResponse.data.success) {
        message.success('鎲革拷婕诧拷馥暒閬ｏ拷穑偧锟藉殫宄曪拷锟借嚟瑾戣潝婊氾拷锟?锟金筹拷鎲革拷婕?閵濆墫锟斤拷闉夝查殲?);
        // 锟界憻榘垫喐锟芥疾锟金掆€?
        fetchUserAppointments();
        // 锟斤拷鎻拷鍞筹拷锟斤拷锟借潵琛岋拷铦?        setActiveTab('2');
      } else {
        message.error(appointmentResponse.data.message || '锟金﹂仯鎲革拷婕叉啳姊彇');
      }
    } catch (error) {
      console.error('锟金﹂仯鎲革拷婕叉啳姊彇:', error);
      message.error('锟金﹂仯鎲革拷婕叉啳姊彇鍤楄绐堣潝婊氾拷锟芥哗锟?);
    }
  };
  
  // 鎲拷锟斤拷鑷拷鐦氾拷锟?
  const handlePayment = async () => {
    if (!appointmentFormData && !paymentAppointmentId) {
      message.error('鎲革拷婕诧拷鍞虫椏閵濇粴锟斤拷婀涳拷闇傜惪锟斤拷鍦堬拷铦?);
      setShowPaymentModal(false);
      return;
    }
    
    setPaymentLoading(true);
    
    try {
      let appointmentId = paymentAppointmentId;
      
      if (!appointmentId) {
        // 鐠夛拷锟戒氦穑埐闅炵潈锟斤拷锟姐涵锟芥馉稏锟?        console.log('锟借嚟锟斤拷婊拷selectedCoach:', JSON.stringify(selectedCoach));
        console.log('锟借嚟锟斤拷婊拷appointmentFormData:', JSON.stringify(appointmentFormData));
        console.log('锟借嚟锟斤拷婊拷锟藉椀锟絀D铦愰锟?', typeof appointmentFormData.coach_id, '锟藉椀锟絀D锟?', appointmentFormData.coach_id);
        
        // 锟斤拷锟芥挶绮癸拷铦?        console.log('锟界吘锟斤拷锟借潵琛€锟芥挶绠勭獔鐦?', appointmentFormData);
        // 锟介拝锟介姖锟介殲璩ｃ涵锟芥鍍庤潠妗愶拷锟藉椀锟絀D鐢囷拷锛嗗殫灞革拷锟芥粴锟斤拷鍒镐敭鎲?        const appointmentDataToSend = {
          ...appointmentFormData,
          coach_id: normalizeCoachId(appointmentFormData.coach_id) // 锟介娇娲昏潠妗愶拷ID鐢囷拷锛?
        };
        console.log('鎽伴畫锟斤拷鐓撅拷锟斤拷鎲革拷婕诧拷鍞虫椏:', JSON.stringify(appointmentDataToSend));
        
        const appointmentResponse = await appointmentAPI.createAppointment(appointmentDataToSend);
        console.log('鎲革拷婕诧拷馥暒閬ｏ拷婊氾拷:', appointmentResponse.data);
        
        if (!appointmentResponse.data.success) {
          message.error(appointmentResponse.data.message || '锟金﹂仯鎲革拷婕叉啳姊彇');
          setPaymentLoading(false);
          return;
        }
        
        appointmentId = appointmentResponse.data.appointment_id;
        console.log('锟界憰锟斤拷鍟侊拷鎲革拷婕睮D:', appointmentId);
        
        if (!appointmentId) {
          message.error('锟戒锟斤拷鐟曪拷鎲革拷婕睮D鍤楄绐堬拷婊╋拷');
          setPaymentLoading(false);
          return;
        }
      }
      
      // 锟金﹂仯锟借嚟锟介湀锛凤拷
      console.log('锟界吘锟斤拷穑埐闅炵潈锟芥挶绠勭獔鐦? appointment_id=', appointmentId, 
        appointmentFormData ? ', duration=' + appointmentFormData.duration : '');
      
      let paymentResponse;
      if (paymentAppointmentId) {
        // 閵濈畯姝囷拷鍘帮拷铦ヨ穑埐闅?        paymentResponse = await paymentService.payForExistingAppointment(appointmentId);
      } else {
        // 閵濈榘垫喐锟芥疾锟借嚟锟?
        paymentResponse = await paymentService.createPayment(
          appointmentId,
          appointmentFormData.duration
        );
      }
      console.log('锟借嚟锟斤拷馥暒閬ｏ拷婊氾拷:', paymentResponse);
      
      if (paymentResponse.success) {
        // 闈藉槬锟斤拷鑷拷锟藉敵鏃?
        setPaymentData(paymentResponse.data);
        
        // 锟芥瀼锟斤拷鑷拷鎽拌劜穑埐闅炪棝鈻筹拷?        paymentService.openAlipayPage(paymentResponse.data.pay_url);
        
        message.success('鎾岃劔锟芥挊锟斤拷鑷拷鎲胯彑稷挵鍤楄绐堟懓宄曪拷锟借嚟锟?);
        // 鐨滐拷鑶勶拷鑷拷鎲革拷婕睮D
        setPaymentAppointmentId(null);
      } else {
        message.error(paymentResponse.message || '锟金﹂仯锟借嚟锟介湀锛凤拷鎲鎻?);
      }
    } catch (error) {
      console.error('锟借嚟锟芥啳锟斤拷鎲鎻?', error);
      message.error('锟借嚟锟芥啳锟斤拷鎲鎻栧殫璜圭獔铦旀粴锟斤拷婊╋拷');
    } finally {
      setPaymentLoading(false);
      setShowPaymentModal(false);
    }
  };
  
  // 锟藉柌稹锟借嚟锟界拝鈯ワ拷锟斤拷
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentAppointmentId(null);
    // 锟界憻榘垫喐锟芥疾锟金掆€?
    fetchUserAppointments();
    // 锟斤拷鎻拷鍞筹拷锟斤拷锟借潵琛岋拷铦?    setActiveTab('2');
  };

  // 锟金楋拷鎲革拷婕?
  const handleCancelAppointment = async (appointmentId) => {
    Modal.confirm({
      title: '铦栨牚鎭曪拷稹潡锟芥喐锟芥疾',
      content: '锟藉嚱锛嗘懓鏈烇拷锟金楋拷椁堝棙钁垫喐锟芥疾锟芥⒐锟?,
      okText: '铦栨牚鎭?,
      cancelText: '锟金楋拷',
      onOk: async () => {
        try {
          const response = await appointmentAPI.cancelAppointment(appointmentId);
          
          if (response.data.success) {
            message.success('鎲革拷婕叉拰鑴ｏ拷鐦?);
            // 锟界憻榘垫喐锟芥疾锟金掆€?
            fetchUserAppointments();
          } else {
            message.error(response.data.message || '锟金楋拷鎲革拷婕叉啳姊彇');
          }
        } catch (error) {
          console.error('锟金楋拷鎲革拷婕叉啳姊彇:', error);
          message.error('锟金楋拷鎲革拷婕叉啳姊彇鍤楄绐堣潝婊氾拷锟芥哗锟?);
        }
      }
    });
  };

  // 锟藉槬锟斤拷稹潡愫拷?  useEffect(() => {
    fetchCoaches();
    fetchCities();
    fetchUserAppointments();
    
    // 鐠夛拷锟藉唺RL锟斤拷愫殫锟斤拷锟金█ｄ攭锟借姡穑埐闅炴潯锟斤拷穑埊鈻筹拷锝囷拷锟借姼稷啞锟斤拷鎻拷鍞筹拷锟斤拷锟借潵琛岋拷铦?    const params = new URLSearchParams(location.search);
    const fromPayment = params.get('from');
    if (fromPayment === 'payment') {
      setActiveTab('2');
    }
  }, []);

  // 锟界憰锟芥喐锟芥疾锟藉梿锟斤拷锟斤拷?  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '鏁猴拷锛嗛湀?;
      case 'confirmed':
        return '鎾岃劑锛嗛湀?;
      case 'completed':
        return '鎾岃劊锟斤拷?;
      case 'cancelled':
        return '鎾岃劊锟界槰?;
      default:
        return '锟借姲浒伙拷鍡嗭拷?;
    }
  };

  // 锟界憰锟芥喐锟芥疾锟藉梿锟斤拷锟借潙鏆革拷锟?  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'blue';
      case 'confirmed':
        return 'green';
      case 'completed':
        return 'purple';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  // 鎲拷锟借潯瑙佹湒锟借嚟锟斤拷锠橈拷
  const handlePayNow = (appointment) => {
    try {
      // 闇堟泟钄拷鍔愯憠锟斤拷锟借潖锟借獞闈樿傅穑埐闅炰€癸拷铦旇礉锟界攪锟借櫆椁堭ァ濓拷
      // 锟斤拷浒伙拷鏇夛拷锟芥箶锟借潖锟界笐锟?      const coach = coaches.find(c => c.id === appointment.coach_id);
      if (coach) {
        setSelectedCoach(coach);
      } else {
        // 鎲掞拷锟斤拷鏇嗭拷锟藉敵锟借潖锟界笐锟借崝锟介浛杓婚崅鎲革拷婕查姖鍓旓拷锟藉幇锟介澖鈯ワ拷锟斤拷閬ｉ姖锟介姖鑺帮拷锟介枾锟斤拷鍡碉拷鎾栧鎯?
        setSelectedCoach({
          id: appointment.coach_id,
          name: appointment.coach_name || '锟借姲浒伙拷鍡碉拷',
          avatar: appointment.coach_avatar,
          location: { 
            city: appointment.location.split(' ')[0], 
            districts: [appointment.location.split(' ')[1] || ''] 
          }
        });
      }
      
      // 闇堟泟钄喐锟芥疾ID锟藉叾锟斤拷鑷拷
      setPaymentAppointmentId(appointment.id);
      
      // 锟芥瀼锟斤拷鑷拷鐠呪姤锟斤拷锟?
      setShowPaymentModal(true);
    } catch (error) {
      console.error('鎲拷锟借潯瑙佹湒锟借嚟锟芥啳姊彇:', error);
      message.error('鎲拷锟斤拷鑷拷闇傜憻锟芥啳姊彇鍤楄绐堣潝婊氾拷锟芥哗锟?);
    }
  };
  // 锟界憰锟斤拷鑷拷锟藉梿锟斤拷锟斤拷鐮嶏拷鎲葛牕?
  const getPaymentStatusText = (status) => {
    if (!status || status === 'unpaid') return '锟借姡穑埐闅?;
    if (status === 'paid') return '鎾岃劔穑埐闅?;
    return '锟借姲浒伙拷鍡嗭拷?;
  };
  
  const getPaymentStatusColor = (status) => {
    if (!status || status === 'unpaid') return 'orange';
    if (status === 'paid') return 'green';
    return 'default';
  };
  
  // 鐨滆劔锟斤拷鍡碉拷锟解垹锟?
  const renderCoachCard = (coach) => {
    return (
      <Card
        key={coach.id}
        hoverable
        style={{ marginBottom: 16, cursor: 'pointer' }}
        onClick={() => openCoachDetailModal(coach)} // 锟藉绋拷鈭狅拷锟戒害锟介渹琛岋拷
        cover={
          <div style={{ padding: 24, textAlign: 'center', background: '#f5f5f5' }}>
            <Avatar src={coach.avatar} size={100} />
          </div>
        }
        actions={[
          <Button 
            key="appointment" 
            type="primary" 
            onClick={(e) => {
              e.stopPropagation(); // 锟介杩拷瀛电ì閳·杈ｏ拷鍩濋儴锟藉暎悒冿拷?              openAppointmentModal(coach);
            }}
          >
            铦¤鏈栨喐锟芥疾
          </Button>
        ]}
      >
        <Card.Meta
          title={
            <div>
              {coach.name}
              <Rate 
                disabled 
                defaultValue={coach.rating} 
                style={{ fontSize: 12, marginLeft: 8 }} 
              />
            </div>
          }
          description={
            <>
              <p>
                <EnvironmentOutlined /> {coach.location.city} {coach.location.districts[0]}
              </p>
              <p>
                {coach.skills.slice(0, 3).map(skill => (
                  <Tag key={skill} color="blue" style={{ marginBottom: 4 }}>{skill}</Tag>
                ))}
                {coach.skills.length > 3 && <Tag>...</Tag>}
              </p>
              <div style={{ color: 'red', fontWeight: 'bold', marginTop: 8 }}>
                {coach.price}锟?鎾狆ぉ吼?
              </div>
            </>
          }
        />
      </Card>
    );
  };

  // 鐨滆劔锟芥喐锟芥疾锟金掆€濇喛?  const renderAppointmentItem = (appointment) => {
    return (
      <List.Item
        actions={[
          // 锟芥泟鍏э拷稹潡锟斤拷鍘板兗
          appointment.status === 'pending' && (
            <Button onClick={() => handleCancelAppointment(appointment.id)} type="text" danger>
              锟金楋拷鎲革拷婕?
            </Button>
          ),
          // 锟芥泟鍏ц潯瑙佹湒锟借嚟锟斤拷鍘板兗(鎲掞拷锟斤拷鑺ｐ查殲?
          (!appointment.payment_status || appointment.payment_status === 'unpaid') && (
            <Button onClick={() => handlePayNow(appointment)} type="primary" style={{ backgroundColor: '#1890ff' }}>
              铦¤鏈栵拷鑷拷
            </Button>
          )
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={
            <div>
              <span>{appointment.coach_name || '锟借姲浒伙拷鍡碉拷'}</span>
              {/* 锟芥泟鍏ф喐锟芥疾锟藉梿锟?*/}
              <Tag 
                color={getStatusColor(appointment.status)} 
                style={{ marginLeft: 8 }}
              >
                {getStatusText(appointment.status)}
              </Tag>
              {/* 锟芥泟鍏э拷鑷拷锟藉梿锟?*/}
              <Tag 
                color={getPaymentStatusColor(appointment.payment_status)} 
                style={{ marginLeft: 8 }}
              >
                {getPaymentStatusText(appointment.payment_status)}
              </Tag>
            </div>
          }
          description={
            <>
              <p>
                <CalendarOutlined style={{ marginRight: 8 }} />
                鎲革拷婕诧拷浜わ拷: {appointment.date}
              </p>
              <p>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                鎲革拷婕诧拷鍦掟、? {appointment.time}
                {appointment.duration && `鍤楀硶皈拕锟? ${appointment.duration}鎾狆ぉ吼刞}
              </p>
              <p>
                闇堝墧锟芥喛瀵ю? {appointment.skill || '锟借姡锟芥懓?}
              </p>
            </>
          }
        />
      </List.Item>
    );
  };

  // 椁堬拷瑾橈拷鍡碉拷锟金掆€?
  const filteredCoaches = coaches.filter(coach => {
    if (filters.city && coach.location.city !== filters.city) {
      return false;
    }
    
    if (filters.district && !coach.location.districts.includes(filters.district)) {
      return false;
    }
    
    if (filters.skill && !coach.skills.includes(filters.skill)) {
      return false;
    }
    
    return true;
  });

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>锟藉椀锟芥喐锟芥疾</Title>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="鎲革拷婕诧拷鍡碉拷" key="1">
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={6} md={5} lg={4}>
                  <Select
                    placeholder="锟姐棁馥嫎锟金ぞ革拷"
                    style={{ width: '100%' }}
                    value={filters.city}
                    onChange={handleCityChange}
                    allowClear
                  >
                    {cities.map(city => (
                      <Option key={city} value={city}>{city}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={6} md={5} lg={4}>
                  <Select
                    placeholder="锟姐棁馥嫎锟界畯锟?
                    style={{ width: '100%' }}
                    value={filters.district}
                    onChange={handleDistrictChange}
                    disabled={!filters.city}
                    allowClear
                  >
                    {districts.map(district => (
                      <Option key={district} value={district}>{district}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={6} md={5} lg={4}>
                  <Select
                    placeholder="闇堝墧锟芥喛瀵ю?
                    style={{ width: '100%' }}
                    value={filters.skill}
                    onChange={handleSkillChange}
                    allowClear
                  >
                    {skillOptions.map(skill => (
                      <Option key={skill} value={skill}>{skill}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={6} md={9} lg={12}>
                  <Button onClick={handleResetFilters} icon={<FilterOutlined />}>
                    锟芥花钄潙鍋︼拷?                  </Button>
                </Col>
              </Row>
            </Card>
            
            <Row gutter={[16, 16]}>
              {loading ? (
                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                </Col>
              ) : filteredCoaches.length > 0 ? (
                filteredCoaches.map(coach => (
                  <Col xs={24} sm={12} md={8} lg={6} key={coach.id}>
                    {renderCoachCard(coach)}
                  </Col>
                ))
              ) : (
                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Empty description="锟斤拷锟借潥琛€锟斤拷鈭╄荆锟斤拷锟借潖? />
                </Col>
              )}
            </Row>
          </TabPane>
          
          <TabPane 
            tab={
              <Badge count={appointments.filter(a => a.status === 'pending').length} offset={[10, 0]}>
                锟金筹拷鎲革拷婕?
              </Badge>
            } 
            key="2"
          >
            <List
              loading={appointmentLoading}
              itemLayout="horizontal"
              dataSource={appointments}
              renderItem={renderAppointmentItem}
              pagination={{
                pageSize: 5,
                showTotal: total => `锟?${total} 锟解娍锟借潵鍦?
              }}
              locale={{ emptyText: <Empty description="锟斤拷锟芥喐锟芥疾闇堝暎锟? /> }}
            />
          </TabPane>
        </Tabs>

        {/* 鎲革拷婕茬拝鈯ワ拷锟斤拷 */}
        <Modal
          title="鎲革拷婕诧拷鍡碉拷"
          visible={showAppointmentModal}
          onCancel={closeAppointmentModal}
          footer={null}
          destroyOnClose
        >
          {selectedCoach && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar src={selectedCoach.avatar} size={64} />
                <Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
                  {selectedCoach.name}
                </Title>
              </div>
              
              <Form
                layout="vertical"
                onFinish={handleSubmitAppointment}
                initialValues={{
                  duration: 1
                }}
              >
                <Form.Item
                  label="闇堝墧锟芥喛瀵ю?
                  name="training_type"
                  rules={[{ required: true, message: '闇傜惪锟姐棁馥嫎闇堝墧锟芥喛瀵ю? }]}
                >
                  <Select placeholder="锟姐棁馥嫎闇堝墧锟芥喛瀵ю?>
                    {selectedCoach.skills.map(skill => (
                      <Option key={skill} value={skill}>{skill}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  label="鎲革拷婕诧拷浜わ拷"
                  name="date"
                  rules={[{ required: true, message: '闇傜惪锟姐棁馥嫎鎲革拷婕诧拷浜わ拷' }]}
                >
                  <DatePicker style={{ width: '100%' }} disabledDate={current => current && current < moment().startOf('day')} />
                </Form.Item>
                
                <Form.Item
                  label="鎲革拷婕诧拷鍦掟、?
                  name="time"
                  rules={[{ required: true, message: '闇傜惪锟姐棁馥嫎鎲革拷婕诧拷鍦掟、? }]}
                >
                  <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
                </Form.Item>
                
                <Form.Item
                  label="闇堝墧锟斤拷鍦掗淡(鎾狆ぉ吼?"
                  name="duration"
                  rules={[{ required: true, message: '闇傜惪锟姐棁馥嫎闇堝墧锟斤拷鍦掗淡' }]}
                >
                  <Select placeholder="锟姐棁馥嫎闇堝墧锟斤拷鍦掗淡">
                    <Option value={1}>1鎾狆ぉ吼?/Option>
                    <Option value={1.5}>1.5鎾狆ぉ吼?/Option>
                    <Option value={2}>2鎾狆ぉ吼?/Option>
                    <Option value={3}>3鎾狆ぉ吼?/Option>
                  </Select>
                </Form.Item>
                
                <Row justify="end">
                  <Space>
                    <Button onClick={closeAppointmentModal}>锟金楋拷</Button>
                    <Button type="primary" htmlType="submit">锟金锋急鎲革拷婕?/Button>
                  </Space>
                </Row>
              </Form>
            </>
          )}
        </Modal>

        {/* 锟藉椀锟介渹琛岋拷鐠呪姤锟斤拷锟?*/}
        <Modal
          title="锟藉椀锟介渹琛岋拷"
          visible={showCoachDetailModal}
          onCancel={closeCoachDetailModal}
          footer={[
            <Button key="back" onClick={closeCoachDetailModal}>
              锟藉柌稹
            </Button>,
            <Button
              key="message"
              type="default"
              onClick={() => handleOpenMessageModal(selectedCoach)}
            >
              锟界吘锟斤拷锟斤拷?            </Button>,
            <Button
              key="appointment"
              type="primary"
              onClick={() => openAppointmentModal(selectedCoach)}
            >
              铦¤鏈栨喐锟芥疾
            </Button>
          ]}
        >
          {selectedCoach && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar src={selectedCoach.avatar} size={100} />
                <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
                  {selectedCoach.name}
                </Title>
                <Rate disabled defaultValue={selectedCoach.rating} />
              </div>
              
              <Divider />
              
              <div>
                <p><strong>锟藉暎韬瑰殫?/strong>{selectedCoach.location.city} {selectedCoach.location.districts.join(', ')}</p>
                <p><strong>闅炵憻鑱㈠殫?/strong>{selectedCoach.price}锟?鎾狆ぉ吼?/p>
                <p>
                  <strong>閵濄瘎榈殫?/strong>
                  {selectedCoach.skills.map(skill => (
                    <Tag key={skill} color="blue" style={{ margin: '4px' }}>{skill}</Tag>
                  ))}
                </p>
                <p><strong>铦烇拷闅為〉锟?/strong>{selectedCoach.description || '锟斤拷锟借潪锟介殲?}</p>
              </div>
            </>
          )}
        </Modal>

        {/* 锟界吘锟斤拷锟斤拷鑸€鑺嬶拷锟斤拷 */}
        <Modal
          title="锟界吘锟斤拷锟斤拷鑸愶拷锟藉椀锟?
          visible={showMessageModal}
          onCancel={closeMessageModal}
          footer={null}
        >
          {selectedCoach && (
            <Form layout="vertical" onFinish={handleSendMessage}>
              <Form.Item
                label="锟藉棥杈ｉ埈?
              >
                <Input value={selectedCoach.name} disabled />
              </Form.Item>
              
              <Form.Item
                label="鐦拷锟斤拷锟芥崋"
                name="message"
                rules={[{ required: true, message: '闇傜憗锟斤拷浜わ拷锟借嚞锟芥懓? }]}
              >
                <Input.TextArea rows={4} placeholder="棰叉瀼锟斤拷鍐斤拷锟界吘锟斤拷锟界槰锟斤拷" />
              </Form.Item>
              
              <Row justify="end">
                <Space>
                  <Button onClick={closeMessageModal}>锟金楋拷</Button>
                  <Button type="primary" htmlType="submit">锟界吘锟?/Button>
                </Space>
              </Row>
            </Form>
          )}
        </Modal>

        {/* 锟借嚟锟界拝鈯ワ拷锟斤拷 */}
        <Modal
          title="铦栨牚鎭曪拷鑷拷"
          visible={showPaymentModal}
          onCancel={closePaymentModal}
          footer={[
            <Button key="back" onClick={closePaymentModal}>
              锟金楋拷
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={paymentLoading}
              onClick={handlePayment}
            >
              铦栨牚鎭曪拷鑷拷
            </Button>
          ]}
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Title level={3} style={{ color: 'red' }}>
              {selectedCoach ? selectedCoach.price + '锟?鎾狆ぉ吼? : '闇堚垹锟介姖?..'}
            </Title>
            
            {appointmentFormData && (
              <Text>
                鎲革拷婕诧拷鍦掗淡: {appointmentFormData.duration}鎾狆ぉ吼? 
                锟藉椀锟? {selectedCoach?.name || '锟借姲浒伙拷鍡碉拷'}
              </Text>
            )}
            
            {paymentAppointmentId && (
              <Text>
                锟藉喗杩わ拷鍏惰浌鎾岃劊锟芥挶绠囷拷鎲革拷婕查馥锟斤拷鑷拷
              </Text>
            )}
          </div>
          
          <div style={{ marginTop: 24 }}>
            <p>闇傜憺锛嗛湀鏀獞閵濊·绺戯拷鑽旓拷</p>
            <ul>
              <li>锟藉椀锟? {selectedCoach?.name || '锟借姲浒伙拷鍡碉拷'}</li>
              <li>鎲革拷婕诧拷浜わ拷: {appointmentFormData?.date || '鎲革拷婕查湀鍟ｏ拷閵濆墧锟斤拷浜わ拷'}</li>
              <li>闇堝墧锟芥喛瀵ю? {appointmentFormData?.skill || '鎲革拷婕查湀鍟ｏ拷閵濆墧锟芥喛瀵ю?}</li>
            </ul>
            <p>锟藉绋?铦栨牚鎭曪拷鑷拷"鎾狅拷姝查牕鐮嶏拷锟借嚟锟芥喛鑿燄版懓宄曪拷闅炰€圭嫛锟?/p>
          </div>
        </Modal>
      </Content>
    </MainLayout>
  );
}

export default CoachAppointment;
