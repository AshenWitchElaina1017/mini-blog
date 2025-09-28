import { type MouseEvent } from 'react';

type ImageModalProps = {
  imageUrl: string;
  onClose: () => void;
};

export default function ImageModal({ imageUrl, onClose }: ImageModalProps): JSX.Element | null {
  if (!imageUrl) {
    return null;
  }

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300"
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        <img src={imageUrl} alt="放大的图片" className="w-auto h-auto max-h-[90vh] object-contain" />
      </div>
    </div>
  );
}

