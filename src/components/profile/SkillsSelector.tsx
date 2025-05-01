'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CATEGORIES, SKILLS_BY_CATEGORY } from '@/lib/constants';
import { CategorySlug } from '@/types';
import { X } from 'lucide-react';

interface SkillsSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsSelector({
  selectedSkills,
  onChange,
}: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const handleCheckboxChange = (skill: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedSkills, skill]);
    } else {
      onChange(selectedSkills.filter((s) => s !== skill));
    }
  };

  const handleAddCustomSkill = () => {
    const trimmedSkill = customSkill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      onChange([...selectedSkills, trimmedSkill]);
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const filteredCategories = Object.entries(CATEGORIES)
    .map(([slug, category]) => {
      const skillsInCategory = SKILLS_BY_CATEGORY[slug as CategorySlug] || [];
      const filteredSkills = skillsInCategory.filter((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, skills: filteredSkills };
    })
    .filter((category) => category.skills.length > 0);

  return (
    <div className="space-y-4">
      <Label>Selected Skills</Label>
      <div className="flex flex-wrap gap-2 p-2 border rounded min-h-[40px]">
        {selectedSkills.length === 0 && (
          <span className="text-sm text-muted-foreground">
            No skills selected
          </span>
        )}
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              className="ml-1.5 text-blue-600 hover:text-blue-800"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <Input
        type="text"
        placeholder="Search skills..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Accordion type="multiple" className="w-full">
        {filteredCategories.map((category) => (
          <AccordionItem value={category.slug} key={category.id}>
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {category.skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(skill, !!checked)
                      }
                    />
                    <label
                      htmlFor={`skill-${skill}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-4 space-y-2">
        <Label htmlFor="customSkill">Add Custom Skill</Label>
        <div className="flex gap-2">
          <Input
            id="customSkill"
            type="text"
            placeholder="Enter custom skill"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSkill();
              }
            }}
          />
          <Button type="button" onClick={handleAddCustomSkill}>
            Add
          </Button>
        </div>
      </div>

      {/* Optionally display filtered custom skills if needed */}
      {/* {filteredCustomSkills.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Filtered Custom Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {filteredCustomSkills.map(skill => (
             // Same display as selected skills span
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
