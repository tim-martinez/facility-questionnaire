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

export const generateEmailBody = (formData) => {
  return SECTIONS.map((section) => {
    const sectionData = formData[section.id] || {};
    let sectionText = `\n${section.title.toUpperCase()}\n${'='.repeat(
      section.title.length
    )}\n`;

    section.questions.forEach((question) => {
      if (question.type === 'group') {
        sectionText += `\n${question.label}:\n`;
        question.subfields.forEach((subfield) => {
          const value =
            sectionData[question.id]?.[subfield.id] || 'Not provided';
          sectionText += `  ${subfield.label}: ${value}\n`;
        });
      } else {
        const value = sectionData[question.id] || 'Not provided';
        sectionText += `${question.label}: ${value}\n`;
      }
    });

    return sectionText;
  }).join('\n');
};

export const submitQuestionnaire = (formData) => {
  const emailBody = generateEmailBody(formData);
  const subject = `Air Traffic Facility Questionnaire - ${
    formData['facility-info']?.['facility-name'] || 'Unknown Facility'
  }`;

  // CHANGE THIS EMAIL ADDRESS TO YOUR DESIRED RECIPIENT
  const recipientEmail = 'your-email@example.com';

  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(emailBody)}`;

  window.location.href = mailtoLink;
};
