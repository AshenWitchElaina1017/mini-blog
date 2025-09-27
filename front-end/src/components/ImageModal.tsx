import React from 'react';

/**
 * @typedef {object} ImageModalProps
 * @property {string} imageUrl - 需要在模态框中展示的图片的 URL。
 * @property {() => void} onClose - 关闭模态框时需要调用的函数。
 */
type ImageModalProps = {
  imageUrl: string;
  onClose: () => void;
};
/**
 * ImageModal 组件
 * @param {ImageModalProps} props - 组件的 props
 * @returns {JSX.Element | null} - 返回一个用于显示放大图片的模态框，或者在没有 imageUrl 时返回 null。
 * 这个组件用于创建一个全屏的模态框来展示一张图片。
 * 它包含一个半透明的背景遮罩和一个居中的图片。
 * 用户可以通过点击背景或关闭按钮来关闭这个模态框。
 */
export default function ImageModal({ imageUrl, onClose }: ImageModalProps): JSX.Element | null {
  // 如果没有提供 imageUrl，则不渲染任何内容
  if (!imageUrl) {
    return null;
  }
  /**
   * 处理背景点击事件
   * @param {React.MouseEvent<HTMLDivElement>} e - 点击事件对象
   * 这个函数确保只有在直接点击背景遮罩时才会关闭模态框，
   * 点击图片本身不会触发关闭。
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // e.target 是实际点击的元素
    // e.currentTarget 是事件监听器所在的元素 (即背景 div)
    // 如果两者相同，说明用户是直接点击的背景，而不是图片
    if (e.target === e.currentTarget) {
      onClose(); // 调用父组件传入的 onClose 函数
    }
  };
  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300"
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        <img
          src={imageUrl}
          alt="放大的图片"
          className="w-auto h-auto max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
}