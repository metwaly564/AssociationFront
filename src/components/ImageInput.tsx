import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageInputProps {
  value?: string;
  onChange?: (url: string) => void;
  onError?: (error: Error) => void;
  accept?: string;
  maxSize?: number; // In MB
}

export function ImageInput({
  value,
  onChange,
  onError,
  accept = 'image/*',
  maxSize = 5,
}: ImageInputProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        throw new Error(`حجم الملف يجب أن يكون أقل من ${maxSize}MB`);
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('يرجى اختيار صورة صحيحة');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'فشل رفع الملف');
      }

      const data = await response.json();
      const uploadedUrl = data.url;

      setPreview(uploadedUrl);
      onChange?.(uploadedUrl);
    } catch (error: any) {
      // Use alert instead of message.error to avoid antd context issues
      alert(error.message || 'فشل رفع الملف');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange?.('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-60 rounded-lg border-2 border-emerald-200"
          />
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer"
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="image-input"
          />
          <label
            htmlFor="image-input"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-gray-700 font-semibold">
                {loading ? 'جاري التحميل...' : 'اسحب الصورة أو انقر لاختيارها'}
              </p>
              <p className="text-sm text-gray-500">الحد الأقصى: {maxSize}MB</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
