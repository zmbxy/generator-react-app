import { createPortal } from 'react-dom';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

interface QuickJumperProps {
  jumperTo: number;
  onChange?: (value: number) => void;
  container: Element | null;
  total: number;
}

function QuickJumper({ jumperTo, onChange, container, total }: QuickJumperProps) {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    setValue(jumperTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumperTo]);

  return (
    container &&
    createPortal(
      <li className="ant-pagination-options-quick-jumper">
        跳至
        <Input
          type="text"
          aria-label="页"
          value={value}
          style={{ textAlign: 'center', width: 80 }}
          onChange={(e) => {
            const { value: current } = e.target;
            if (isEmpty(value)) {
              setValue(undefined);
            }
            if (/\d+/.test(current) && onChange) {
              const numberValue = Number(current);
              if (numberValue > total) {
                setValue(total);
              } else {
                setValue(numberValue);
              }
            }
          }}
          onBlur={() => {
            if (onChange == null) {
              return;
            }
            if (isEmpty(value)) {
              setValue(1);
              onChange(1);
            } else {
              onChange(value as number);
            }
          }}
        />
        页
      </li>,
      container as any,
    )
  );
}

export default QuickJumper;
