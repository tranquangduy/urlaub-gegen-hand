'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import {
  MessageTemplate,
  getAllTemplates,
  getTemplatesByCategory,
} from '@/lib/messageTemplates';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateSelectorProps {
  onSelectTemplate: (content: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
}) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const userRole = user?.roles?.[0] || 'both';

  const categories = [
    { value: 'greeting', label: 'Greetings' },
    { value: 'inquiry', label: 'Inquiries' },
    { value: 'confirmation', label: 'Confirmations' },
    { value: 'rejection', label: 'Rejections' },
    { value: 'arrangement', label: 'Arrangements' },
    { value: 'other', label: 'Other' },
  ];

  const handleSelectTemplate = (template: MessageTemplate) => {
    onSelectTemplate(template.content);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" title="Use template message">
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Tabs defaultValue="all">
          <div className="border-b px-3 py-2">
            <h4 className="text-sm font-medium">Message Templates</h4>
            <p className="text-xs text-muted-foreground">
              Select a template to quickly send a message
            </p>
          </div>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-3">
            <TabsTrigger
              value="all"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="p-0">
            <Command>
              <CommandInput placeholder="Search templates..." />
              <CommandList>
                <CommandEmpty>No templates found.</CommandEmpty>
                {getAllTemplates(userRole as any).map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => handleSelectTemplate(template)}
                    className="flex flex-col items-start"
                  >
                    <span className="font-medium">{template.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {template.content}
                    </span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </TabsContent>
          {categories.map((category) => (
            <TabsContent
              key={category.value}
              value={category.value}
              className="p-0"
            >
              <Command>
                <CommandList>
                  <CommandEmpty>No templates found.</CommandEmpty>
                  {getTemplatesByCategory(
                    category.value as any,
                    userRole as any
                  ).map((template) => (
                    <CommandItem
                      key={template.id}
                      onSelect={() => handleSelectTemplate(template)}
                      className="flex flex-col items-start"
                    >
                      <span className="font-medium">{template.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {template.content}
                      </span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
