"use client";
import React from 'react';

interface CmsImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

/**
 * Component for displaying images uploaded to CMS
 * Handles both local URLs and CMS URLs
 */
export function CmsImage({ src, alt = '', className = '', ...props }: CmsImageProps) {
  // If src starts with http, it's already a full URL from CMS
  // If it starts with /uploads, convert to full CMS URL
  let imageUrl = src;

  if (src && src.startsWith('/uploads/')) {
    // Convert relative uploads path to full CMS URL
    const cmsBase = import.meta.env.VITE_CMS_BASE || 'http://localhost:3001';
    imageUrl = `${cmsBase}${src}`;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      {...props}
      onError={(e) => {
        console.error('Failed to load image:', imageUrl);
        // Optionally set a fallback image
        // e.currentTarget.src = '/fallback-image.png';
      }}
    />
  );
}