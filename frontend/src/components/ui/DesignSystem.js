import React from 'react';
import { Button, Card, Tag, Avatar, Progress, Badge } from 'antd';
import {
  StarFilled,
  HeartFilled,
  TrophyFilled,
  FireFilled,
  ThunderboltFilled
} from '@ant-design/icons';

// 统一的颜色系统
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // 主色
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // 强调色
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// 渐变背景组件
export const GradientBackground = ({ children, variant = 'primary', className = '' }) => {
  const gradients = {
    primary: 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    warm: 'bg-gradient-to-br from-orange-400 to-pink-400',
    cool: 'bg-gradient-to-br from-green-400 to-blue-500',
    dark: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'
  };

  return (
    <div className={`${gradients[variant]} ${className}`}>
      {children}
    </div>
  );
};

// 美化的卡片组件
export const BeautifulCard = ({
  children,
  title,
  subtitle,
  icon,
  gradient = false,
  hover = true,
  className = '',
  ...props
}) => {
  const cardClass = `
    ${gradient ? 'bg-gradient-to-br from-white to-blue-50' : 'bg-white'}
    ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    transition-all duration-300 ease-in-out
    border-0 rounded-2xl shadow-lg
    ${className}
  `;

  return (
    <Card
      className={cardClass}
      title={
        title && (
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-0">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 mb-0">{subtitle}</p>}
            </div>
          </div>
        )
      }
      {...props}
    >
      {children}
    </Card>
  );
};

// 美化的按钮组件
export const StyledButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border-0',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <Button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-medium shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-0.5
        ${className}
      `}
      icon={icon}
      loading={loading}
      {...props}
    >
      {children}
    </Button>
  );
};

// 美化的标签组件
export const StyledTag = ({ children, color = 'blue', variant = 'filled', ...props }) => {
  const variants = {
    filled: `bg-${color}-500 text-white`,
    outline: `border-2 border-${color}-500 text-${color}-500 bg-transparent`,
    soft: `bg-${color}-100 text-${color}-700`
  };

  return (
    <Tag
      className={`
        ${variants[variant]}
        rounded-full px-3 py-1 text-xs font-medium
        border-0 shadow-sm
      `}
      {...props}
    >
      {children}
    </Tag>
  );
};

// 美化的进度条组件
export const StyledProgress = ({
  percent,
  showInfo = true,
  gradient = true,
  size = 'default',
  ...props
}) => {
  const strokeColor = gradient
    ? {
        '0%': '#3b82f6',
        '50%': '#8b5cf6',
        '100%': '#ec4899'
      }
    : '#3b82f6';

  return (
    <Progress
      percent={percent}
      strokeColor={strokeColor}
      trailColor="#f1f5f9"
      strokeWidth={size === 'small' ? 6 : size === 'large' ? 12 : 8}
      showInfo={showInfo}
      className="mb-0"
      {...props}
    />
  );
};

// 美化的头像组件
export const StyledAvatar = ({
  src,
  name,
  size = 'default',
  online = false,
  gradient = false,
  ...props
}) => {
  const sizeMap = {
    small: 32,
    default: 40,
    large: 64,
    huge: 80
  };

  return (
    <div className="relative inline-block">
      <Avatar
        src={src}
        size={sizeMap[size]}
        className={`
          ${gradient ? 'bg-gradient-to-br from-blue-500 to-purple-600' : ''}
          shadow-lg border-2 border-white
        `}
        {...props}
      >
        {name && name.charAt(0).toUpperCase()}
      </Avatar>
      {online && (
        <Badge
          status="success"
          className="absolute -bottom-1 -right-1"
        />
      )}
    </div>
  );
};

// 美化的统计卡片
export const StatCard = ({
  title,
  value,
  suffix,
  prefix,
  trend,
  trendValue,
  icon,
  color = 'blue'
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <BeautifulCard className="overflow-hidden">
      <div className="relative">
        {/* 背景装饰 */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorMap[color]} opacity-10 rounded-full transform translate-x-6 -translate-y-6`}></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shadow-lg`}>
              {icon}
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? '↗' : '↘'}
                <span>{trendValue}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              {prefix && <span className="text-lg text-gray-500">{prefix}</span>}
              <span className="text-3xl font-bold text-gray-800">{value}</span>
              {suffix && <span className="text-lg text-gray-500">{suffix}</span>}
            </div>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
      </div>
    </BeautifulCard>
  );
};

// 美化的徽章组件
export const AchievementBadge = ({
  name,
  description,
  earned = false,
  icon,
  rarity = 'common'
}) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  return (
    <div className={`
      relative p-4 rounded-2xl border-2 transition-all duration-300
      ${earned
        ? `bg-gradient-to-br ${rarityColors[rarity]} text-white shadow-lg hover:shadow-xl`
        : 'bg-gray-100 border-gray-300 text-gray-500'
      }
    `}>
      <div className="text-center">
        <div className={`
          w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl
          ${earned ? 'bg-white/20' : 'bg-gray-300'}
        `}>
          {icon}
        </div>
        <h4 className="font-bold text-sm mb-1">{name}</h4>
        <p className="text-xs opacity-80">{description}</p>
      </div>

      {earned && (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
            ✓
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  colors,
  GradientBackground,
  BeautifulCard,
  StyledButton,
  StyledTag,
  StyledProgress,
  StyledAvatar,
  StatCard,
  AchievementBadge
};
