import Image from 'next/image';
import { useSignedImageUrl } from './ImageUrlHook';

interface ColumnContentProps {
  content: string;
  imageUrl: string | null;
  imagePosition: 'above' | 'below' | null;
}

export function ColumnContent({
  content,
  imageUrl,
  imagePosition
}: ColumnContentProps) {
  const { signedUrl, loading } = useSignedImageUrl(imageUrl);

  const textElement = (
    <div className="flex-1 flex items-center justify-center">
      <div className="space-y-6 max-w-lg">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-slate-700 text-lg leading-relaxed font-light text-center">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );

  const imageElement = signedUrl && !loading ? (
    <div className="flex-1 flex items-center justify-center">
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={signedUrl}
          alt="Column image"
          width={400}
          height={300}
          className="object-cover"
        />
      </div>
    </div>
  ) : loading ? (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-[400px] h-[300px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl animate-pulse flex items-center justify-center shadow-lg">
        <div className="text-slate-500 font-medium">Loading image...</div>
      </div>
    </div>
  ) : null;

  if (!imageElement) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-lg">
          <div className="space-y-6">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-slate-700 text-lg leading-relaxed font-light text-center">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (imagePosition === 'above') {
    return (
      <div className="h-full flex flex-col">
        {imageElement}
        {textElement}
      </div>
    );
  } else if (imagePosition === 'below') {
    return (
      <div className="h-full flex flex-col">
        {textElement}
        {imageElement}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {imageElement}
      {textElement}
    </div>
  );
}