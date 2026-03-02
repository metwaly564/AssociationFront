import { Handshake, Send, Users, DollarSign, Code, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../../lib/api';
import * as LucideIcons from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
  Handshake,
  DollarSign,
  Code,
  Users,
  CheckCircle,
};

const getIcon = (iconName?: string, defaultIcon: any = Handshake) => {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
};

const getColorClasses = (color?: string) => {
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
  };
  return colorMap[color || 'emerald'] || 'bg-emerald-100 text-emerald-600';
};

export function Partnership() {
  const [heroTitle, setHeroTitle] = useState('الشراكة');
  const [heroSubtitle, setHeroSubtitle] = useState('نعمل معاً لتحقيق أهداف مشتركة');
  const [introText, setIntroText] = useState('نؤمن بقوة الشراكة في تحقيق أهدافنا المشتركة. نبحث عن شركاء استراتيجيين يشاركوننا رؤيتنا ويساهمون في خدمة المجتمع.');
  const [whyTitle, setWhyTitle] = useState('لماذا الشراكة معنا؟');
  const [whyDescription, setWhyDescription] = useState('الشراكة معنا تفتح آفاقاً واسعة للتعاون المثمر والاستفادة المتبادلة. نحن نقدم بيئة داعمة وشفافة للشركاء مع إمكانية الوصول إلى شبكة واسعة من المستفيدين والمجتمعات المحلية.');
  const [formTitle, setFormTitle] = useState('قدّم طلب شراكة');
  const [formSubtitle, setFormSubtitle] = useState('املأ النموذج أدناه وسنتواصل معك لمناقشة فرص الشراكة المتاحة');
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    organization_type: '',
    partnership_type_id: '',
    description: '',
    partnership_proposal: '',
  });

  useEffect(() => {
    loadPartnershipData();
  }, []);

  const loadPartnershipData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getPartnership();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الشراكة');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
        
        const whyTitleSection = data.content.find((c: any) => c.section_key === 'why_title');
        if (whyTitleSection) {
          setWhyTitle(whyTitleSection.title || 'لماذا الشراكة معنا؟');
        }
        
        const whyDescSection = data.content.find((c: any) => c.section_key === 'why_description');
        if (whyDescSection) {
          setWhyDescription(whyDescSection.description || '');
        }
        
        const formTitleSection = data.content.find((c: any) => c.section_key === 'form_title');
        if (formTitleSection) {
          setFormTitle(formTitleSection.title || 'قدّم طلب شراكة');
        }
        
        const formSubtitleSection = data.content.find((c: any) => c.section_key === 'form_subtitle');
        if (formSubtitleSection) {
          setFormSubtitle(formSubtitleSection.description || '');
        }
      }
      
      // Set types
      setTypes(data.types || []);
    } catch (error) {
      console.error('Error loading partnership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await publicApi.submitPartnershipRequest(formData);
      alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      setFormData({
        organization_name: '',
        contact_name: '',
        email: '',
        phone: '',
        website: '',
        organization_type: '',
        partnership_type_id: '',
        description: '',
        partnership_proposal: '',
      });
    } catch (error: any) {
      alert('فشل إرسال الطلب: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="w-10 h-10" />
            <h1 className="text-4xl lg:text-5xl font-bold">{heroTitle}</h1>
          </div>
          {heroSubtitle && (
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </section>

      {/* Intro Text */}
      {introText && (
        <section className="container mx-auto px-4 py-8">
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            {introText}
          </p>
        </section>
      )}

      {/* Why Partnership Section */}
      {(whyTitle || whyDescription) && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {whyTitle && (
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{whyTitle}</h2>
              )}
              {whyDescription && (
                <p className="text-gray-700 text-lg leading-relaxed text-center">
                  {whyDescription}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Partnership Types */}
      {types.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">أنواع الشراكة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {types.map((type) => {
              const IconComponent = getIcon(type.icon_name, Handshake);
              const colorClasses = getColorClasses(type.color);
              return (
                <div
                  key={type.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className={`w-16 h-16 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                    {type.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {type.description}
                      </p>
                    )}
                    {type.benefits && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">المزايا:</h4>
                        <p className="text-gray-600 text-sm">{type.benefits}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Application Form */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Send className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{formTitle}</h2>
              {formSubtitle && (
                <p className="text-gray-600">{formSubtitle}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">اسم المنظمة *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="اسم المنظمة أو المؤسسة"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">اسم المسؤول *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="اسم المسؤول عن الشراكة"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                  <label className="block text-gray-700 font-semibold mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="+966 5XX XXX XXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">الموقع الإلكتروني</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">نوع المنظمة</label>
                  <input
                    type="text"
                    value={formData.organization_type}
                    onChange={(e) => setFormData({ ...formData, organization_type: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                    placeholder="مثال: جمعية خيرية، شركة، مؤسسة"
                  />
                </div>
              </div>

              {types.length > 0 && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">نوع الشراكة المطلوبة</label>
                  <select
                    value={formData.partnership_type_id}
                    onChange={(e) => setFormData({ ...formData, partnership_type_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors"
                  >
                    <option value="">اختر نوع الشراكة</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">وصف المنظمة</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                  placeholder="وصف مختصر عن المنظمة ونشاطاتها..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">مقترح الشراكة *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.partnership_proposal}
                  onChange={(e) => setFormData({ ...formData, partnership_proposal: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none transition-colors resize-none"
                  placeholder="اكتب مقترحك للشراكة وأهدافها المتوقعة..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
