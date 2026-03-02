import { ComponentType, useState } from 'react';

interface PartnerLogoProps {
  name: string;
  image: string;
  Icon: ComponentType<{ className?: string }>;
}

export function PartnerLogo({ name, image, Icon }: PartnerLogoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
      {failed ? (
        <Icon className="w-12 h-12 text-gray-400 mb-4" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          className="w-20 h-20 object-contain mb-4 opacity-80"
          onError={() => setFailed(true)}
        />
      )}
      <p className="text-gray-700 font-semibold text-center">{name}</p>
    </div>
  );
}

