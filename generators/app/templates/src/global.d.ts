interface Pagination<T = any> {
  pageNum: number; // 当前查询的页码
  pageSize: number; // 当前查询页的数据大小
  size: number; // 当前页实际的数据大小
  pages: number; // 总页数
  total: number;
  list: T[]; // 数据列表/集合
}

declare type PaginationParams<T> = Pick<Pagination, 'pageNum' | 'pageSize'> & {
  [P in keyof T]: T[P];
};

declare type AppGlobalEvent = 'sys_version' | 'sys_legend';