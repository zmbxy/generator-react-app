import { useMemo, useState } from 'react';
import { PaginationProps, Table as AntdTable } from 'antd';
import { ColumnType } from 'antd/lib/table';
import QuickJumper from './QuickJumper';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { isEmpty } from 'lodash';
import { TableRowSelection } from 'antd/lib/table/interface';

interface TableProps<T> {
  columns: ColumnType<T>[];
  data?: T[] | Pagination<T>;
  rowKey?: string;
  loading?: boolean;
  simplePagination?: boolean;
  paginationPosition?: string;
  defaultPageSize?: number;
  rowSelection?: TableRowSelection<T>;
  onChange?: (pagination: Pick<Pagination, 'pageNum' | 'pageSize'>) => void;
}

const defaultPagination: PaginationProps = {
  size: 'default',
  simple: false,
  showQuickJumper: false, // 关闭默认的快速跳转
  showSizeChanger: true, // 是否显示pageSize切换器
  hideOnSinglePage: false, // 只有一页时不隐藏分页器
  defaultCurrent: 1,
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  showTotal: (total: number) => `共${total}条`,
};

function Table<T = any>({
  columns,
  data,
  rowKey,
  loading,
  onChange,
  rowSelection,
  simplePagination = false,
  defaultPageSize = 10,
  paginationPosition = 'bottomRight',
}: TableProps<T>) {
  const [wrapper, setWrapper] = useState<Element | null>(null);

  const pagination = useMemo(() => {
    if (data == null || Array.isArray(data)) {
      return false;
    }
    return {
      ...defaultPagination,
      current: data.pageNum,
      pageSize: data.pageSize,
      total: data.total,
      simple: simplePagination,
      showTotal: simplePagination ? undefined : (total: number) => `共${total}条`,
      defaultPageSize,
      position: [paginationPosition],
    };
  }, [data, simplePagination, defaultPageSize, paginationPosition]);

  const dataSource = (): any => {
    if (data == null || Array.isArray(data)) {
      return data;
    }
    return data.list;
  };

  const paginationChange = (current?: number, pageSize?: number) => {
    if (onChange == null) {
      return;
    }
    const { pageSize: originPageSize } = data as Pagination<T>;
    if (pageSize !== originPageSize) {
      onChange({ pageNum: 1, pageSize: pageSize as number });
    } else {
      onChange({ pageNum: current as number, pageSize });
    }
  };

  const filterChange = (filters: Record<string, FilterValue | null>) => {
    console.log(filters);
  };

  const sortChange = (sorter: SorterResult<any> | SorterResult<any>[]) => {
    console.log(sorter);
  };

  const tableColumns = useMemo(() => {
    return columns.map(({ render: customRender, ...rest }) => ({
      ...rest,
      render: (value: any, record: any, idx: number) => {
        if (customRender) {
          const renderValue = customRender(value, record, idx);
          if (isEmpty(renderValue)) {
            return '--';
          }
          return renderValue;
        }
        if (isEmpty(value)) {
          return '--';
        }
        return value;
      },
    }));
  }, [columns]);

  return (
    <>
      <AntdTable
        ref={(wrapper) => {
          if (wrapper != null) {
            const iWrapper = wrapper.querySelector('.ant-pagination.ant-table-pagination');
            setWrapper(iWrapper);
          }
        }}
        bordered
        size="middle"
        rowKey={rowKey}
        columns={tableColumns as any}
        dataSource={dataSource()}
        pagination={pagination as any}
        loading={loading}
        rowSelection={rowSelection as any}
        onChange={(pagination, filters, sorter, extra) => {
          const { action } = extra;
          if (action === 'paginate') {
            const { current, pageSize } = pagination;
            paginationChange(current, pageSize);
            return;
          }
          if (action === 'filter') {
            filterChange(filters);
            return;
          }
          if (action === 'sort') {
            sortChange(sorter);
            return;
          }
        }}
      />
      {pagination && typeof data === 'object' && !simplePagination && (
        <QuickJumper
          container={wrapper}
          jumperTo={pagination.current}
          total={(data as any).pages}
          onChange={(jumperTo) => {
            if (onChange) {
              onChange({ pageNum: jumperTo, pageSize: pagination.pageSize });
            }
          }}
        />
      )}
    </>
  );
}

export default Table;
