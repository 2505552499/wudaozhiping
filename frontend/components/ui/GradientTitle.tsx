import React from 'react';

interface GradientTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  align?: 'left' | 'center' | 'right';
  className?: string;
  highlightWords?: string[];
}

const GradientTitle: React.FC<GradientTitleProps> = ({
  children,
  as = 'h2',
  align = 'left',
  className = '',
  highlightWords = [],
}) => {
  const Tag = as;
  
  const sizes = {
    h1: 'text-4xl md:text-5xl lg:text-6xl',
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
    h4: 'text-xl md:text-2xl',
  };
  
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // 如果标题中含有需要高亮的词，将其替换为带渐变效果的版本
  if (typeof children === 'string' && highlightWords.length > 0) {
    let processedText = children;
    highlightWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'g');
      processedText = processedText.replace(regex, `<span class="bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple bg-clip-text text-transparent">$1</span>`);
    });
    
    return (
      <Tag 
        className={`font-bold ${sizes[as]} ${alignment[align]} tracking-tight ${className}`}
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
    );
  }

  // 普通版本，整个标题应用渐变
  return (
    <Tag 
      className={`font-bold ${sizes[as]} ${alignment[align]} tracking-tight bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple bg-clip-text text-transparent ${className}`}
    >
      {children}
    </Tag>
  );
};

export default GradientTitle;
