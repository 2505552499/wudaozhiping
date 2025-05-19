import React from 'react';
import PropTypes from 'prop-types';

const GradientTitle = ({
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
      processedText = processedText.replace(regex, `<span class="bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent">$1</span>`);
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
      className={`font-bold ${sizes[as]} ${alignment[align]} tracking-tight bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent ${className}`}
    >
      {children}
    </Tag>
  );
};

GradientTitle.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
  highlightWords: PropTypes.arrayOf(PropTypes.string),
};

export default GradientTitle;
