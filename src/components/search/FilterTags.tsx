import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type FilterTagsProps = {
  filters: Record<string, string | number | string[]>;
  onRemove: (key: string, value?: string) => void;
};

export const FilterTags: React.FC<FilterTagsProps> = ({
  filters,
  onRemove,
}) => {
  const renderTag = (key: string, value: string | number | string[]) => {
    if (Array.isArray(value)) {
      return value.map((v) => (
        <Badge
          key={`${key}-${v}`}
          variant="outline"
          className="mr-2 mb-2 flex items-center"
        >
          <span className="mr-1">{`${key}: ${v}`}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(key, String(v))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ));
    }
    return (
      <Badge
        key={key}
        variant="outline"
        className="mr-2 mb-2 flex items-center"
      >
        <span className="mr-1">{`${key}: ${value}`}</span>
        <Button size="sm" variant="ghost" onClick={() => onRemove(key)}>
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    );
  };

  const entries = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
  );

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap my-3">
      {entries.map(([key, value]) => renderTag(key, value))}
      <Button variant="link" size="sm" onClick={() => onRemove('all')}>
        Clear all
      </Button>
    </div>
  );
};
