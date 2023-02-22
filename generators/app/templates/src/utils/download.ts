declare type File = {
  file: Blob;
  filename: string;
}

function downloadFile(file: File, contentType?: string) {
  // 转换为blob对象
  let blob = new Blob([file.file], { type: contentType });
  // 创建a标签下载链接
  let downloadElement = document.createElement('a');
  // 设置下载属性， 文件名转换：ISO8859-1的字符转换成中文
  downloadElement.setAttribute("download", decodeURI(file.filename));
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 移除下载链接
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

export default downloadFile;
