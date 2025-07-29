import { SECTIONS } from './sections.js';

export const checkSectionCompletion = (sectionIndex, formData) => {
  const section = SECTIONS[sectionIndex];
  const sectionData = formData[section.id] || {};

  return section.questions.every((question) => {
    if (!question.required) return true;

    if (question.type === 'group') {
      return question.subfields.some((subfield) => {
        const value = sectionData[question.id]?.[subfield.id];
        return value !== undefined && value !== '';
      });
    }

    const value = sectionData[question.id];
    return value !== undefined && value !== '';
  });
};

