import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../lib/api';
import * as LucideIcons from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Page content state
  const [heroTitle, setHeroTitle] = useState('تواصل معنا');
  const [heroSubtitle, setHeroSubtitle] = useState('نحن هنا للإجابة على استفساراتك ومساعدتك');
  const [contactInfo, setContactInfo] = useState<any[]>([]);
  const [workingHours, setWorkingHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getContactPageContent();
      
      // Set hero content
      const heroSection = data.content?.find((c: any) => c.section_key === 'hero_title');
      if (heroSection) {
        setHeroTitle(heroSection.title || 'تواصل معنا');
        setHeroSubtitle(heroSection.subtitle || 'نحن هنا للإجابة على استفساراتك ومساعدتك');
      }
      
      // Set contact info
      setContactInfo(data.contactInfo || []);
      
      // Set working hours
      setWorkingHours(data.workingHours || []);
    } catch (error) {
      console.error('Error loading contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.');
  };

  // Group contact info by type
  const groupedInfo = contactInfo.reduce((acc: any, item: any) => {
    if (!acc[item.info_type]) {
      acc[item.info_type] = [];
    }
    acc[item.info_type].push(item);
    return acc;
  }, {});

  // Icon mapping
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8 text-emerald-600" /> : null;
  };

  // Get icon for social media
  const getSocialIcon = (label: string) => {
    const lowerLabel = label?.toLowerCase() || '';
    if (lowerLabel.includes('facebook')) return <Facebook className="w-5 h-5" />;
    if (lowerLabel.includes('twitter')) return <Twitter className="w-5 h-5" />;
    if (lowerLabel.includes('instagram')) return <Instagram className="w-5 h-5" />;
    if (lowerLabel.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
    return null;
  };

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
          {heroSubtitle && (
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Phone Info */}
            {groupedInfo.phone && groupedInfo.phone.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getIcon(groupedInfo.phone[0]?.icon_name || 'Phone') || <Phone className="w-8 h-8 text-emerald-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {groupedInfo.phone[0]?.label || 'اتصل بنا'}
                </h3>
                {groupedInfo.phone.map((item: any, idx: number) => (
                  <p key={idx} className="text-gray-600 mb-2" dir="ltr">
                    {item.value}
                  </p>
                ))}
              </div>
            )}

            {/* Email Info */}
            {groupedInfo.email && groupedInfo.email.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getIcon(groupedInfo.email[0]?.icon_name || 'Mail') || <Mail className="w-8 h-8 text-emerald-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {groupedInfo.email[0]?.label || 'راسلنا'}
                </h3>
                {groupedInfo.email.map((item: any, idx: number) => (
                  <p key={idx} className="text-gray-600 mb-2">
                    <a href={`mailto:${item.value}`} className="hover:text-emerald-600">
                      {item.value}
                    </a>
                  </p>
                ))}
              </div>
            )}

            {/* Address Info */}
            {groupedInfo.address && groupedInfo.address.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getIcon(groupedInfo.address[0]?.icon_name || 'MapPin') || <MapPin className="w-8 h-8 text-emerald-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {groupedInfo.address[0]?.label || 'زُرنا'}
                </h3>
                {groupedInfo.address.map((item: any, idx: number) => (
                  <p key={idx} className="text-gray-600 mb-2">
                    {item.value}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">رقم الجوال *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="05XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">الموضوع *</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                >
                  <option value="">اختر الموضوع</option>
                  <option value="استفسار عام">استفسار عام</option>
                  <option value="التبرع">التبرع</option>
                  <option value="التطوع">التطوع</option>
                  <option value="العضوية">العضوية</option>
                  <option value="الشكاوى والمقترحات">الشكاوى والمقترحات</option>
                  <option value="آخر">آخر</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">الرسالة *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                  rows={6}
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                إرسال الرسالة
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">موقعنا</h3>
              <div className="rounded-xl overflow-hidden shadow-lg h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.394967823098!2d46.67155831542382!3d24.713552584129764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {workingHours.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Clock className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">ساعات العمل</h4>
                    <div className="space-y-2 text-gray-700">
                      {workingHours.map((hour: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>{hour.day_label}</span>
                          <span className={`font-semibold ${hour.is_closed ? 'text-red-600' : ''}`}>
                            {hour.time_range}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {groupedInfo.social && groupedInfo.social.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl p-8">
                <h4 className="text-xl font-bold mb-4">تابعنا على مواقع التواصل</h4>
                <p className="text-emerald-50 mb-6">
                  ابقَ على اطلاع بآخر أخبارنا وفعالياتنا عبر حساباتنا الرسمية
                </p>
                <div className="flex gap-3">
                  {groupedInfo.social.map((item: any, idx: number) => (
                    <a
                      key={idx}
                      href={item.value}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      {getSocialIcon(item.label || item.value) || getIcon(item.icon_name)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
