import React from 'react';
import './styles.less';

export interface DividerBlockProps {
  children?: any,
  style?: React.CSSProperties,
  text: string
}

function DividerBlock({
  children,
  style,
  text,
}: DividerBlockProps) {
  return (
    <div className="custom_divider" style={{ ...style }}>
      <span style={{ fontWeight: 600 }}>{text}</span>
      {children}
    </div>
  );
}

export default DividerBlock;
