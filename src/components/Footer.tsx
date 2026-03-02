import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  siteSettings?: Record<string, { value: string; type: string }>;
}

export function Footer({ setCurrentPage, siteSettings = {} }: FooterProps) {
  const siteName = siteSettings?.site_name?.value ;
  const siteDescription = siteSettings?.site_description?.value || 'نعمل على توفير الرعاية والدعم للأسر المحتاجة في مجتمعنا، ونسعى لبناء مستقبل أفضل من خلال برامجنا المتنوعة.';
  const siteLogo = siteSettings?.site_logo?.value;
  const contactEmail = siteSettings?.contact_email?.value || 'info@reayaty.org.sa';
  const contactPhone = siteSettings?.contact_phone?.value || '+966 58 062 6974';
  const contactAddress = siteSettings?.contact_address?.value || 'المدينة المنورة - طريق سلطانة - شارع زنيرة الرومية';
  const socialFacebook = siteSettings?.social_facebook?.value;
  const socialTwitter = siteSettings?.social_twitter?.value;
  const socialInstagram = siteSettings?.social_instagram?.value;
  const socialLinkedin = siteSettings?.social_linkedin?.value;
  const footerText = siteSettings?.footer_text?.value || `© 2024 ${siteName}. جميع الحقوق محفوظة.`;
  const copyrightYear = siteSettings?.footer_copyright_year?.value || '2024';
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="h-14 w-auto object-contain" />
              ) : (
                <Heart className="w-8 h-8 text-emerald-500" fill="currentColor" />
              )}
              <h3 className="text-white text-lg font-bold">{siteName}</h3>
            </div>
            {siteDescription && (
              <p className="text-sm leading-relaxed mb-4">
                {siteDescription}
              </p>
            )}
            <div className="flex gap-3">
              {socialFacebook && (
                <a href={socialFacebook} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialTwitter && (
                <a href={socialTwitter} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialInstagram && (
                <a href={socialInstagram} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialLinkedin && (
                <a href={socialLinkedin} target="_blank" rel="noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white text-base font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-emerald-500 transition-colors">
                  من نحن
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('programs')} className="hover:text-emerald-500 transition-colors">
                  البرامج والمشاريع
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('board')} className="hover:text-emerald-500 transition-colors">
                  مجلس الإدارة
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('news')} className="hover:text-emerald-500 transition-colors">
                  الأخبار والفعاليات
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-base font-bold mb-4">المشاركة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentPage('volunteering')} className="hover:text-emerald-500 transition-colors">
                  التطوع معنا
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('membership')} className="hover:text-emerald-500 transition-colors">
                  العضوية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('membership-donate')} className="hover:text-emerald-500 transition-colors">
                  التبرع
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-emerald-500 transition-colors">
                  تواصل معنا
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-base font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              {contactAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{contactAddress}</span>
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span dir="ltr">{contactPhone}</span>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>{contactEmail}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>{footerText.replace('2024', copyrightYear)}</p>
        </div>
      </div>
    </footer>
  );
}
