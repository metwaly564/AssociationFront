import { Heart, Menu, X, ChevronDown, Bug } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CmsImage } from "./CmsImage";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  siteSettings?: Record<string, { value: string; type: string }>;
}

export function Header({ currentPage, setCurrentPage, siteSettings = {} }: HeaderProps) {
  const { debugSettings, refreshSettings } = useTheme();
  const siteName = siteSettings?.site_name?.value;
  const siteDescription = siteSettings?.site_description?.value;
  const siteLogo = siteSettings?.site_logo?.value;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // مؤقتات للإغلاق البطيء
  let aboutTimer: NodeJS.Timeout;
  let programsTimer: NodeJS.Timeout;
  let governanceTimer: NodeJS.Timeout;
  let membershipTimer: NodeJS.Timeout;
  let feedbackTimer: NodeJS.Timeout;
  let moreTimer: NodeJS.Timeout;

  const navItems = [
    { id: "home", label: "الرئيسية" },
    { id: "about", label: "تعرف علينا " },
    { id: "programs", label: "البرامج والمشاريع" },
    { id: "board", label: "رأيك يهمنا" },
    { id: "volunteering", label: "التطوع" },
    { id: "membership", label: "العضوية" },
    { id: "news", label: "الأخبار" },
    { id: "contact", label: "تواصل معنا" },
  ];

  const aboutItems = [
    { id: "about-strategy", label: "الهوية والرؤية والرسالة" },
    { id: "about-assembly", label: "الجمعية العمومية" },
    { id: "about-management", label: "مجلس الإدارة" },
    { id: "about-structure", label: "الهيكل التنظيمي" },
    { id: "about-team", label: "فريق العمل" },
    { id: "about-committees", label: "اللجان" },
    { id: "about-offices", label: "المكاتب التنفيذية" },
    { id: "about-licenses", label: "التراخيص والاعتمادات" },
  ];

  const programsItems = [
    { id: "programs", label: "البرامج والمبادرات" },
    { id: "programs-annual", label: "الخطة السنوية" },
  ];

  const membershipItems = [
    { id: "membership", label: "شروط العضوية" },
    { id: "membership-jobs", label: "الوظائف" },
    { id: "membership-partnership", label: "الشراكات" },
  ];

  return (
    <header className="bg-header shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {siteLogo ? (
              <CmsImage src={siteLogo} alt={siteName} className="h-16 w-auto object-contain" />
            ) : (
              <Heart className="w-10 h-10 text-primary" fill="currentColor" />
            )}
            
          </button>

          {/* === شريط التنقل === */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              // --- من نحن ---
              if (item.id === "about") {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => {
                      clearTimeout(aboutTimer);
                      setAboutOpen(true);
                    }}
                    onMouseLeave={() => {
                      aboutTimer = setTimeout(() => setAboutOpen(false), 250);
                    }}
                  >
                    <button
                      onClick={() => setAboutOpen((v) => !v)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${aboutOpen ||
                          currentPage.startsWith("about-") ||
                          currentPage === "about"
                          ? "bg-primary text-white"
                          : "text-primary hover:bg-theme"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {aboutOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                        <button
                          key="about"
                          onClick={() => {
                            setCurrentPage('about');
                            setAboutOpen(false);
                          }}
                          className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === 'about'
                              ? 'bg-primary/10 text-primary'
                              : 'text-primary hover:bg-theme'
                            }`}
                        >
                          من نحن
                        </button>
                        {aboutItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentPage(sub.id);
                              setAboutOpen(false);
                            }}
                            className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === sub.id
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // --- رأيك يهمنا ---
              if (item.id === "board") {
                const items = [
                  { id: "feedback-employees", label: "استبيان رضا الموظفين" },
                  { id: "feedback-volunteers", label: "استبيان رضا المتطوعين" },
                  { id: "feedback-donors", label: "استبيان رضا المتبرعين" },
                  { id: "feedback-beneficiaries", label: "استبيان رضا المستفيدين" },
                  { id: "feedback-stakeholders", label: "استبيان رضا أصحاب العلاقة" },
                  { id: "feedback-results", label: "نتائج الاستبيانات" },
                ];
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => {
                      clearTimeout(feedbackTimer);
                      setFeedbackOpen(true);
                    }}
                    onMouseLeave={() => {
                      feedbackTimer = setTimeout(() => setFeedbackOpen(false), 250);
                    }}
                  >
                    <button
                      onClick={() => setFeedbackOpen((v) => !v)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${feedbackOpen || currentPage.startsWith("feedback-")
                          ? "bg-primary text-white"
                          : "text-primary hover:bg-theme"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {feedbackOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg py-2 z-50">
                        {items.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentPage(sub.id);
                              setFeedbackOpen(false);
                            }}
                            className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === sub.id
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // --- البرامج ---
              if (item.id === "programs") {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => {
                      clearTimeout(programsTimer);
                      setProgramsOpen(true);
                    }}
                    onMouseLeave={() => {
                      programsTimer = setTimeout(() => setProgramsOpen(false), 250);
                    }}
                  >
                    <button
                      onClick={() => setProgramsOpen((v) => !v)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${programsOpen ||
                          currentPage === "programs" ||
                          currentPage === "programs-annual"
                          ? "bg-primary text-white"
                          : "text-primary hover:bg-theme"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {programsOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                        {programsItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentPage(sub.id);
                              setProgramsOpen(false);
                            }}
                            className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === sub.id
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // --- العضوية ---
              if (item.id === "membership") {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => {
                      clearTimeout(membershipTimer);
                      setMembershipOpen(true);
                    }}
                    onMouseLeave={() => {
                      membershipTimer = setTimeout(() => setMembershipOpen(false), 250);
                    }}
                  >
                    <button
                      onClick={() => setMembershipOpen((v) => !v)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${membershipOpen ||
                          [
                            "membership",
                            "membership-jobs",
                            "membership-partnership",
                          ].includes(currentPage)
                          ? "bg-primary text-white"
                          : "text-primary hover:bg-theme"
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {membershipOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                        {membershipItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setCurrentPage(sub.id);
                              setMembershipOpen(false);
                            }}
                            className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === sub.id
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // --- الصفحات الأخرى ---
              if (["news", "volunteering", "contact"].includes(item.id)) {
                return null;
              }
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
            {/* Governance dropdown (الحوكمة) */}
            <div className="hidden lg:flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => {
                  clearTimeout(governanceTimer);
                  setGovernanceOpen(true);
                }}
                onMouseLeave={() => {
                  governanceTimer = setTimeout(() => setGovernanceOpen(false), 250);
                }}
              >
                <button
                  onClick={() => setGovernanceOpen((v) => !v)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${governanceOpen ||
                      [
                        "gov-policies",
                        "gov-operational-budget",
                        "gov-financial-statements",
                        "gov-reports",
                      ].includes(currentPage)
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span>الحوكمة</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {governanceOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg py-2 z-50">
                    {[
                      { id: "gov-policies", label: "الأنظمة واللوائح والسياسات" },
                      { id: "gov-operational-budget", label: "الخطة التشغيلية والموازنة" },
                      { id: "gov-financial-statements", label: "القوائم والتقارير المالية" },
                      { id: "gov-reports", label: "التقارير" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setCurrentPage(sub.id);
                          setGovernanceOpen(false);
                        }}
                        className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === sub.id
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* المزيد */}
            <div className="hidden lg:flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => {
                  clearTimeout(moreTimer);
                  setMoreOpen(true);
                }}
                onMouseLeave={() => {
                  moreTimer = setTimeout(() => setMoreOpen(false), 250);
                }}
              >
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${moreOpen || ["news", "volunteering", "contact"].includes(currentPage)
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span>المزيد</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {moreOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                    {[
                      { id: "news", label: "الأخبار" },
                      { id: "volunteering", label: "التطوع" },
                      { id: "contact", label: "تواصل معنا" },
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setCurrentPage(sub.id);
                          setMoreOpen(false);
                        }}
                        className={`block w-full text-right px-4 py-2 text-sm transition-colors ${currentPage === sub.id
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>


          {/* زر التبرع */}
          <button
            onClick={() => setCurrentPage("membership-donate")}
            className="hidden lg:block bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/80 transition-colors shadow-md"
          >
            تبرع الآن
          </button>

          {/* زر Debug للإعدادات */}
          <button
            onClick={() => {
              debugSettings();
              refreshSettings();
            }}
            className="hidden lg:block bg-blue-600 text-white p-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md ml-2"
            title="Debug Theme Settings"
          >
            <Bug className="w-5 h-5" />
          </button>

          {/* القائمة الجانبية للموبايل */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-primary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="py-3 flex flex-col gap-1">

              {/* الرئيسية */}
              <button
                onClick={() => {
                  setCurrentPage("home");
                  setMobileMenuOpen(false);
                }}
                className="text-right px-4 py-2 text-sm hover:bg-gray-100"
              >
                الرئيسية
              </button>

              {/* ===== من نحن ===== */}
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100"
              >
                <span>تعرف علينا</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {aboutOpen && (
                <div className="flex flex-col bg-gray-50">
                  <button
                    onClick={() => {
                      setCurrentPage("about");
                      setMobileMenuOpen(false);
                    }}
                    className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                  >
                    من نحن
                  </button>

                  {aboutItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCurrentPage(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ===== البرامج ===== */}
              <button
                onClick={() => setProgramsOpen(!programsOpen)}
                className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100"
              >
                <span>البرامج والمشاريع</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {programsOpen && (
                <div className="flex flex-col bg-gray-50">
                  {programsItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCurrentPage(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ===== رأيك يهمنا ===== */}
              <button
                onClick={() => setFeedbackOpen(!feedbackOpen)}
                className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100"
              >
                <span>رأيك يهمنا</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {feedbackOpen && (
                <div className="flex flex-col bg-gray-50">
                  {[
                    { id: "feedback-employees", label: "استبيان رضا الموظفين" },
                    { id: "feedback-volunteers", label: "استبيان رضا المتطوعين" },
                    { id: "feedback-donors", label: "استبيان رضا المتبرعين" },
                    { id: "feedback-beneficiaries", label: "استبيان رضا المستفيدين" },
                    { id: "feedback-stakeholders", label: "استبيان رضا أصحاب العلاقة" },
                    { id: "feedback-results", label: "نتائج الاستبيانات" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCurrentPage(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ===== العضوية ===== */}
              <button
                onClick={() => setMembershipOpen(!membershipOpen)}
                className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100"
              >
                <span>العضوية</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {membershipOpen && (
                <div className="flex flex-col bg-gray-50">
                  {membershipItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCurrentPage(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ===== الحوكمة ===== */}
              <button
                onClick={() => setGovernanceOpen(!governanceOpen)}
                className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100"
              >
                <span>الحوكمة</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {governanceOpen && (
                <div className="flex flex-col bg-gray-50">
                  {[
                    { id: "gov-policies", label: "الأنظمة واللوائح والسياسات" },
                    { id: "gov-operational-budget", label: "الخطة التشغيلية والموازنة" },
                    { id: "gov-financial-statements", label: "القوائم والتقارير المالية" },
                    { id: "gov-reports", label: "التقارير" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCurrentPage(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ===== المزيد ===== */}
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100"
              >
                <span>المزيد</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {moreOpen && (
                <div className="flex flex-col bg-gray-50">
                  {[
                    { id: "news", label: "الأخبار" },
                    { id: "volunteering", label: "التطوع" },
                    { id: "contact", label: "تواصل معنا" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setCurrentPage(sub.id);
                        setMobileMenuOpen(false);
                      }}
                      className="text-right px-6 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* زر التبرع */}
              <button
                onClick={() => {
                  setCurrentPage("membership-donate");
                  setMobileMenuOpen(false);
                }}
                className="mx-4 mt-3 bg-primary text-white py-2 rounded-lg text-sm"
              >
                تبرع الآن
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}
