import { message, notification } from 'antd';

message.config({
  top: 60,
  maxCount: 1,
  duration: 4,
});

notification.config({
  top: 60,
  placement: 'topRight',
});
