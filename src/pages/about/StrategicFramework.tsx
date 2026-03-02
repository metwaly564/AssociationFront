import { Eye, Target, Award, Heart, Shield, Users, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi } from '../../lib/api';
import * as LucideIcons from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
  Eye,
  Target,
  Award,
  Heart,
  Shield,
  Users,
  CheckCircle,
  FileText: LucideIcons.FileText,
};

const getIcon = (iconName?: string, defaultIcon: any = Heart) => {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
};

export function StrategicFramework() {
  const [heroTitle, setHeroTitle] = useState('الإطار الاستراتيجي');
  const [heroSubtitle, setHeroSubtitle] = useState('رؤيتنا ورسالتنا وقيمنا وأهدافنا');
  const [vision, setVision] = useState<any>(null);
  const [mission, setMission] = useState<any>(null);
  const [values, setValues] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrategicFrameworkData();
  }, []);

  const loadStrategicFrameworkData = async () => {
    try {
      setLoading(true);
      const data = await publicApi.getStrategicFramework();
      
      // Set hero content
      if (data.content) {
        const heroSection = data.content.find((c: any) => c.section_key === 'hero_title');
        if (heroSection) {
          setHeroTitle(heroSection.title || 'الإطار الاستراتيجي');
          setHeroSubtitle(heroSection.subtitle || '');
        }
      }
      
      // Set vision and mission
      if (data.sections) {
        const visionSection = data.sections.find((s: any) => s.section_key === 'vision');
        const missionSection = data.sections.find((s: any) => s.section_key === 'mission');
        setVision(visionSection || null);
        setMission(missionSection || null);
      }
      
      // Set values
      setValues(data.values || []);
      
      // Set goals
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Error loading strategic framework data:', error);
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

      {/* Vision & Mission */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Vision */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                {(() => {
                  const IconComponent = getIcon(vision?.icon_name, Eye);
                  return <IconComponent className="w-8 h-8 text-emerald-600" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {vision?.title || 'رؤيتنا'}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {vision?.content || 'أن نكون الجمعية الرائدة في تقديم الرعاية الشاملة والمستدامة للأسر المحتاجة، ونساهم في بناء مجتمع متماسك خالٍ من الفقر والحاجة.'}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                {(() => {
                  const IconComponent = getIcon(mission?.icon_name, Target);
                  return <IconComponent className="w-8 h-8 text-emerald-600" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {mission?.title || 'رسالتنا'}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {mission?.content || 'تقديم الدعم الشامل والمتكامل للأسر المحتاجة من خلال برامج مبتكرة ومستدامة، بما يحقق التنمية الاجتماعية والاقتصادية للمستفيدين ويعزز استقلاليتهم.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      {values.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">قيمنا</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const IconComponent = getIcon(value.icon_name, Heart);
                return (
                  <div
                    key={value.id || index}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    {value.description && (
                      <p className="text-gray-600 text-sm">
                        {value.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Strategic Goals */}
      {goals.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">أهدافنا الاستراتيجية</h2>
              </div>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div
                    key={goal.id || index}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-lg pt-1">{goal.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

