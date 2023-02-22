import React, { useState } from 'react';
import { Input as AntdInput } from 'antd';

export type NumberValueType = number | null;

export interface InputNumberProps {
  value?: NumberValueType,
  defaultValue?: NumberValueType,
  onChange?: Function,
  max?: number,
  min?: number,
  disabled?: boolean;
  [key: string]: any
}

function InputNumber({
  value: propsValue,
  onChange,
  defaultValue,
  max,
  min,
  ...rest
}: InputNumberProps) {
  const [stateValue, setStateValue] = useState<NumberValueType>(null);

  function triggerChange(value: NumberValueType) {
    if (onChange) {
      onChange(value);
    }
    setStateValue(value);
  }

  function valueChange(value: string) {
    if (value == null || value.length === 0) {
      triggerChange(null);
      return;
    }
    if (/^\d+$/.test(value)) {
      const current = Number(value);
      const maxValue = max || (2 ** 31 - 1);
      const minValue = min || 0;
      if (current > maxValue || current < minValue) {
        return;
      }
      triggerChange(Number(value));
    }
  }

  function numberValue(): any {
    if (propsValue != null) {
      return propsValue;
    }
    return stateValue;
  }

  return (
    <AntdInput
      value={numberValue()}
      onChange={(e) => valueChange(e.target.value)}
      style={{ width: '100%' }}
      {...rest}
    />
  );
}

export default InputNumber;
