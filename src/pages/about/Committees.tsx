import { FileText, Users, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '../../lib/api';
import { PartnersCarousel } from '../../components/PartnersCarousel';
import * as LucideIcons from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
  FileText,
  DollarSign: LucideIcons.DollarSign,
  Stethoscope: LucideIcons.Stethoscope,
  Briefcase: LucideIcons.Briefcase,
  Heart: LucideIcons.Heart,
  Users,
  CheckCircle,
};

const getIcon = (iconName?: string, defaultIcon: any = FileText) => {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
};

export function Committees() {
  const [heroTitle, setHeroTitle] = useState('اللجان');
  const [heroSubtitle, setHeroSubtitle] = useState('لجان متخصصة لتحقيق أهدافنا');
  const [introText, setIntroText] = useState('نستعرض هنا اللجان الدائمة والمؤقتة والوثائق المرتبطة بها.');
  const [committees, setCommittees] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommitteesData();
  }, []);

  const loadCommitteesData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getCommittees();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'اللجان');
          setHeroSubtitle(heroSection.subtitle || '');
        }
        
        const introSection = data.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
      }
      
      // Set committees
      setCommittees(data.committees || []);
      
      // Load supervising authorities
      try {
        const authorities = await publicApi.getSupervisingAuthorities();
        setSupervisors(authorities);
      } catch (error) {
        console.error('Error loading supervising authorities:', error);
        // Fallback to empty array
        setSupervisors([]);
      }
    } catch (error) {
      console.error('Error loading committees data:', error);
    } finally {
      setLoading(false);
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
      <section className="relative bg-gray-800/20 text-white overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/2 lg:w-2/5 bg-no-repeat bg-left bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-left.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 lg:py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-emerald-600 text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-black text-lg mb-6 leading-relaxed max-w-2xl">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Intro Text */}
      {introText && (
        <section className="container mx-auto px-4 py-8">
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            {introText}
          </p>
        </section>
      )}

      {/* Committees list */}
      {committees.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">قائمة اللجان</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((committee) => {
              const IconComponent = getIcon(committee.icon_name, FileText);
              return (
                <div
                  key={committee.id}
                  className="group bg-white border rounded-xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mt-0.5 w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{committee.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        committee.type === 'permanent' 
                          ? 'bg-blue-100 text-blue-700' 
                          : committee.type === 'temporary'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {committee.type === 'permanent' 
                          ? 'دائمة' 
                          : committee.type === 'temporary'
                          ? 'مؤقتة'
                          : 'دائمة ومؤقتة'}
                      </span>
                    </div>
                  </div>
                  
                  {committee.description && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {committee.description}
                    </p>
                  )}
                  
                  {committee.members && committee.members.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">الأعضاء ({committee.members.length})</span>
                      </div>
                      <div className="space-y-1">
                        {committee.members.slice(0, 3).map((member: any, idx: number) => (
                          <div key={member.id || idx} className="text-sm text-gray-600">
                            • {member.name}
                            {member.role && <span className="text-gray-500"> - {member.role}</span>}
                          </div>
                        ))}
                        {committee.members.length > 3 && (
                          <div className="text-sm text-gray-500">
                            + {committee.members.length - 3} عضو آخر
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {committee.tasks && committee.tasks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">المهام ({committee.tasks.length})</span>
                      </div>
                      <ul className="space-y-1">
                        {committee.tasks.slice(0, 2).map((task: any, idx: number) => (
                          <li key={task.id || idx} className="text-sm text-gray-600">
                            • {task.task_text}
                          </li>
                        ))}
                        {committee.tasks.length > 2 && (
                          <li className="text-sm text-gray-500">
                            + {committee.tasks.length - 2} مهمة أخرى
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <PartnersCarousel partners={supervisors} title="الجهات المشرفة والداعمة" />
    </div>
  );
}
