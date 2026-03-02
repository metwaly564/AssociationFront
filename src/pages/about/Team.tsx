import { useEffect, useRef, useState } from "react";
import { publicApi, type TeamMember } from "../../lib/api";

export function Team() {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  
  // Page content state
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [executiveDirector, setExecutiveDirector] = useState<any>(null);
  const [boardTitle, setBoardTitle] = useState("أعضاء مجلس الإدارة");
  const [staffTitle, setStaffTitle] = useState("موظفو الجمعية");
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  useEffect(() => {
    if (heroImages.length > 0) {
      const id = setInterval(() => {
        setCurrent((idx) => (idx + 1) % heroImages.length);
      }, 4000);
      return () => clearInterval(id);
    }
  }, [heroImages.length]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      // Load page content
      const pageContent = await publicApi.getTeamPageContent();
      
      // Set hero images
      if (pageContent.heroImages && pageContent.heroImages.length > 0) {
        setHeroImages(pageContent.heroImages.map((img: any) => img.image_url).filter(Boolean));
      } else {
        // Fallback to default images
        setHeroImages([
          "https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg",
          "https://images.pexels.com/photos/3810753/pexels-photo-3810753.jpeg",
          "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg"
        ]);
      }
      
      // Set executive director
      if (pageContent.executiveDirector) {
        setExecutiveDirector(pageContent.executiveDirector);
      }
      
      // Set section titles
      const boardTitleSection = pageContent.content?.find((c: any) => c.section_key === 'board_title');
      const staffTitleSection = pageContent.content?.find((c: any) => c.section_key === 'staff_title');
      if (boardTitleSection?.title) setBoardTitle(boardTitleSection.title);
      if (staffTitleSection?.title) setStaffTitle(staffTitleSection.title);
      
      // Load team members
      const members = await publicApi.getTeam();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team data:', error);
      // Fallback to default images
      setHeroImages([
        "https://images.pexels.com/photos/3184644/pexels-photo-3184644.jpeg",
        "https://images.pexels.com/photos/3810753/pexels-photo-3810753.jpeg",
        "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const boardMembers = teamMembers.filter(m => m.type === 'board').sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const employees = teamMembers.filter(m => m.type === 'staff').sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <div className="bg-white" dir="rtl">
      {/* Hero slider (one image at a time) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
        <div ref={sliderRef} className="relative w-full h-[320px] md:h-[420px]">
          {heroImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="صورة فريق العمل"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Executive director */}
      {executiveDirector && (
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Card */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-5">
                {executiveDirector.image_url && (
                  <img
                    src={executiveDirector.image_url}
                    alt={executiveDirector.title || "المدير التنفيذي"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  {executiveDirector.title && (
                    <div className="text-sm text-gray-500 mb-1">{executiveDirector.title}</div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 leading-7">
                    {executiveDirector.name}
                  </h3>
                  <dl className="mt-4 space-y-2 text-gray-700 text-sm">
                    {executiveDirector.email && (
                      <div className="flex flex-wrap items-center gap-2">
                        <dt className="text-gray-500">البريد الإلكتروني:</dt>
                        <dd>
                          <a href={`mailto:${executiveDirector.email}`} className="text-emerald-700 hover:underline" dir="ltr">
                            {executiveDirector.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {executiveDirector.phone && (
                      <div className="flex flex-wrap items-center gap-2">
                        <dt className="text-gray-500">رقم الهاتف:</dt>
                        <dd>
                          <a href={`tel:${executiveDirector.phone}`} className="text-emerald-700" dir="ltr">{executiveDirector.phone}</a>
                        </dd>
                      </div>
                    )}
                    {(executiveDirector.period_from || executiveDirector.period_to) && (
                      <div className="flex flex-wrap items-center gap-2">
                        <dt className="text-gray-500">الفترة:</dt>
                        <dd className="text-gray-700">
                          {executiveDirector.period_from && <>من: {executiveDirector.period_from}</>}
                          {executiveDirector.period_from && executiveDirector.period_to && <span className="mx-2">إلى:</span>}
                          {executiveDirector.period_to && <>{executiveDirector.period_to}</>}
                        </dd>
                      </div>
                    )}
                    {executiveDirector.qualification && (
                      <div>
                        <dt className="sr-only">المؤهل</dt>
                        <dd>{executiveDirector.qualification}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>

            {/* Adjacent text */}
            {executiveDirector.description && (
              <div className="bg-gray-50 border rounded-xl p-6 leading-8 text-gray-800">
                {executiveDirector.description.split('\n').map((para: string, i: number) => (
                  <p key={i} className={i > 0 ? 'mt-3' : ''}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Board members */}
      {boardMembers.length > 0 && (
        <section className="bg-white py-6">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{boardTitle}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {boardMembers.map((m) => (
                <div key={m.id} className="bg-white border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        {m.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{m.name}</div>
                      <div className="text-sm text-emerald-700">{m.role}</div>
                    </div>
                  </div>
                  {m.bio && (
                    <div className="mt-4 text-sm text-gray-700">
                      {m.bio}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Employees */}
      {employees.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{staffTitle}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-white border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    {emp.image_url ? (
                      <img src={emp.image_url} alt={emp.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        {emp.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{emp.name}</div>
                      <div className="text-sm text-emerald-700">{emp.role}</div>
                    </div>
                  </div>
                  {emp.bio && (
                    <div className="mt-4 text-sm text-gray-700">
                      {emp.bio}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
