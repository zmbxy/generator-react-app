import { forwardRef } from 'react';
import { TimePicker as AntdTimePicker } from 'antd';

const TimePicker = forwardRef(
  (props, ref) => <AntdTimePicker {...props} mode={undefined} ref={ref} />,
);

TimePicker.displayName = 'TimePicker';

export default TimePicker;
