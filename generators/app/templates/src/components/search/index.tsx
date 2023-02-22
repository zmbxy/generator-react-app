import {
  Attributes,
  createElement,
  FunctionComponent,
  ReactNode,
  ComponentClass,
} from 'react';
import { Form, Row, Col, FormInstance } from 'antd';
import { Rule } from 'antd/lib/form';

// 表单 form item 元素配置
declare type ItemElement<P = Record<string, any>> = {
  type: FunctionComponent<P> | ComponentClass<P> | string;
  rules?: Rule[];
  props?: (Attributes & P) | null;
  children?: ReactNode[];
};

// 筛选项配置
export declare type SearchItem<T extends {}> = {
  label?: string;
  name?: keyof T;
  formItem: ItemElement;
};

declare type RenderOption = {
  rowItems: number; // 设置每行显示的个数
  showItems?: number; // 默认显示的内容，多出的部分，通过更多参数展开使用
};

declare type SearchProps<T = any> = {
  items: SearchItem<any>[]; // 配置表单的参数
  rowItems?: number; // 设置每行显示的个数
  showItems?: number; // 设置显示的个数
  form?: FormInstance<T>;
  onChange?: (values: T) => void;
};

const renderFormItem = <T extends {}>(items: SearchItem<T>[], options: RenderOption): ReactNode[] => {
  const { rowItems, showItems } = options;

  const span = 24 / rowItems;
  // const itemSize = items.length;

  return items.slice(0, showItems).map(({ label, name, formItem }, idx) => {
    const { type, props, children, rules } = formItem;
    return (
      <Col span={span} key={name as string}>
        <Form.Item label={label} name={name as any} key={`search_item_${idx}`} rules={rules}>
          {createElement(type, props, children)}
        </Form.Item>
      </Col>
    );
  });
};

function SearchForm<T = any>({
  items,
  onChange,
  rowItems = 4,
  showItems,
  form
}: SearchProps<T>) {

  const searchValuesChange = (_changedValues: T, allValues: T) => {
    if (onChange) {
      onChange(allValues);
    }
  };

  return (
    <Form style={{ width: '100%', position: 'relative' }} form={form} onValuesChange={searchValuesChange}>
      <Row gutter={[32, 0]}>{renderFormItem(items, { rowItems, showItems })}</Row>
    </Form>
  );
}

export default SearchForm;
