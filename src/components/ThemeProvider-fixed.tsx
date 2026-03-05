"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeColors {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  header_background: string;
  footer_background: string;
  text_primary: string;
  text_secondary: string;
  text_light: string;
  link_color: string;
  link_hover_color: string;
  button_primary_bg: string;
  button_primary_text: string;
  button_secondary_bg: string;
  button_secondary_text: string;
  card_background: string;
  card_border: string;
  border_color: string;
  // Typography
  font_family_primary: string;
  font_family_headings: string;
  font_size_base: string;
  font_size_h1: string;
  font_size_h2: string;
  font_size_h3: string;
  font_size_h4: string;
  font_size_h5: string;
  font_size_h6: string;
  font_weight_normal: string;
  font_weight_bold: string;
  line_height_base: string;
  line_height_headings: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  debugSettings: () => Promise<void>;
}

const defaultColors: ThemeColors = {
  primary_color: '#1f2937',
  secondary_color: '#3b82f6',
  accent_color: '#10b981',
  background_color: '#ffffff',
  header_background: '#ffffff',
  footer_background: '#f9fafb',
  text_primary: '#111827',
  text_secondary: '#6b7280',
  text_light: '#9ca3af',
  link_color: '#3b82f6',
  link_hover_color: '#2563eb',
  button_primary_bg: '#3b82f6',
  button_primary_text: '#ffffff',
  button_secondary_bg: '#f3f4f6',
  button_secondary_text: '#374151',
  card_background: '#ffffff',
  card_border: '#e5e7eb',
  border_color: '#d1d5db',
  // Typography
  font_family_primary: 'Tajawal, sans-serif',
  font_family_headings: 'Tajawal, sans-serif',
  font_size_base: '16px',
  font_size_h1: '2.25rem',
  font_size_h2: '1.875rem',
  font_size_h3: '1.5rem',
  font_size_h4: '1.25rem',
  font_size_h5: '1.125rem',
  font_size_h6: '1rem',
  font_weight_normal: '400',
  font_weight_bold: '700',
  line_height_base: '1.6',
  line_height_headings: '1.3',
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  loading: true,
  refreshSettings: async () => { },
  debugSettings: async () => { },
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  useEffect(() => {
    applyThemeToCSS(colors);
  }, [colors]);

  // Auto-refresh settings every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadThemeSettings();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadThemeSettings = async () => {
    try {
      console.log('🎨 Loading theme settings...');
      // Use the same API base as other API calls
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://associationback.onrender.com/api/public';
      const response = await fetch(`${API_BASE}/settings`);
      console.log('API Response:', response.status, response.statusText);

      if (response.ok) {
        const text = await response.text();
        const cmsBaseUrl = import.meta.env.VITE_CMS_BASE || 'https://associationback.onrender.com';
        const data = JSON.parse(text.replace(/http:\/\/localhost:3001/g, cmsBaseUrl));
        console.log('API Data:', data);

        if (data.settings) {
          const themeSettings: Partial<ThemeColors> = {};
          Object.entries(data.settings).forEach(([key, setting]: [string, any]) => {
            console.log(`Setting: ${key} = ${setting.value} (type: ${setting.type})`);
            if ((setting.type === 'color' || setting.type === 'font' || setting.type === 'size' || setting.type === 'weight' || setting.type === 'height') && setting.value) {
              themeSettings[key as keyof ThemeColors] = setting.value;
              console.log(`✅ Applied setting: ${key} = ${setting.value}`);
            }
          });
          setColors({ ...defaultColors, ...themeSettings });
          console.log('🎨 Final colors:', { ...defaultColors, ...themeSettings });
        } else {
          console.log('⚠️ No settings found in API response');
        }
      } else {
        console.error('❌ API request failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Failed to load theme settings:', error);
      // Use default colors on error
    } finally {
      setLoading(false);
    }
  };

  const applyThemeToCSS = (themeColors: ThemeColors) => {
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([key, value]) => {
      let cssVar = '';

      // Handle different types of settings
      if (key.startsWith('font_family_')) {
        cssVar = `--font-${key.replace('font_family_', '').replace(/_/g, '-')}`;
      } else if (key.startsWith('font_size_')) {
        cssVar = `--text-${key.replace('font_size_', '').replace(/_/g, '-')}`;
      } else if (key.startsWith('font_weight_')) {
        cssVar = `--font-${key.replace(/_/g, '-')}`;
      } else if (key.startsWith('line_height_')) {
        cssVar = `--leading-${key.replace('line_height_', '').replace(/_/g, '-')}`;
      } else {
        // Color settings
        cssVar = `--color-${key.replace(/_/g, '-')}`;
      }

      root.style.setProperty(cssVar, value);
    });
  };

  const debugSettings = async () => {
    console.log('🔍 Debugging theme settings...');
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'https://associationback.onrender.com/api/public';
      const response = await fetch(`${API_BASE}/settings`);
      if (response.ok) {
        const text = await response.text();
        const cmsBaseUrl = import.meta.env.VITE_CMS_BASE || 'https://associationback.onrender.com';
        const data = JSON.parse(text.replace(/http:\/\/localhost:3001/g, cmsBaseUrl));
        console.log('📊 API Response:', data);
        console.log('🎨 Current applied colors:', colors);
      } else {
        console.error('❌ API call failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Debug error:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      colors,
      loading,
      refreshSettings: loadThemeSettings,
      debugSettings
    }}>
      {children}
    </ThemeContext.Provider>
  );
}