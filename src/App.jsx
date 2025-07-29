import React, { useState, useEffect } from 'react';
import { SECTIONS } from './components/sections.js';
import {
  checkSectionCompletion,
  generateEmailBody,
} from './components/formUtils.js';

// Progress Bar Component
const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div className="progress-header">
      <span>Progress</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div className="progress-bar-bg">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

// Sidebar Navigation Item Component
const SidebarNavItem = ({
  section,
  index,
  isActive,
  isCompleted,
  onClick,
  sidebarOpen,
}) => (
  <button onClick={onClick} className={`nav-item ${isActive ? 'active' : ''}`}>
    <div className="nav-item-content">
      {isCompleted ? (
        <span className="nav-item-icon completed">✓</span>
      ) : (
        <div className="nav-item-icon incomplete" />
      )}
      {sidebarOpen && <span className="nav-item-text">{section.title}</span>}
    </div>
  </button>
);

// Sidebar Component
const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sections,
  currentSection,
  setCurrentSection,
  completedSections,
  progress,
}) => (
  <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
    <div className="sidebar-header">
      <div className="sidebar-header-content">
        {sidebarOpen && <h2 className="sidebar-title">Sections</h2>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sidebar-toggle"
        >
          {sidebarOpen ? '‹' : '☰'}
        </button>
      </div>

      {sidebarOpen && <ProgressBar progress={progress} />}
    </div>

    <div className="sidebar-nav">
      {sections.map((section, index) => (
        <SidebarNavItem
          key={section.id}
          section={section}
          index={index}
          isActive={currentSection === index}
          isCompleted={completedSections.has(index)}
          onClick={() => setCurrentSection(index)}
          sidebarOpen={sidebarOpen}
        />
      ))}
    </div>
  </div>
);

// Form Input Components
const TextInput = ({
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="form-input"
    placeholder={placeholder}
    required={required}
  />
);

const SelectInput = ({ value, onChange, options, required }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="form-select"
    required={required}
  >
    <option value="">Select an option</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const TextareaInput = ({ value, onChange, placeholder, required }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="form-textarea"
    placeholder={placeholder}
    rows={3}
    required={required}
  />
);

const GroupInput = ({ question, value, onChange }) => (
  <div className="group-container">
    {question.subfields.map((subfield) => (
      <div key={subfield.id} className="group-row">
        <label className="group-label">{subfield.label}:</label>
        <input
          type={subfield.type}
          value={value?.[subfield.id] || ''}
          onChange={(e) => onChange(subfield.id, e.target.value)}
          className="group-input"
          placeholder={subfield.placeholder}
        />
      </div>
    ))}
  </div>
);

// Question Component
const Question = ({ question, sectionId, formData, onInputChange }) => {
  const value = formData[sectionId]?.[question.id] || '';

  const handleChange = (newValue, subfieldId = null) => {
    onInputChange(sectionId, question.id, newValue, subfieldId);
  };

  const handleGroupChange = (subfieldId, newValue) => {
    const currentGroupValue = formData[sectionId]?.[question.id] || {};
    const updatedGroupValue = { ...currentGroupValue, [subfieldId]: newValue };
    onInputChange(sectionId, question.id, updatedGroupValue);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextInput
            value={value}
            onChange={handleChange}
            placeholder={question.placeholder}
            required={question.required}
          />
        );

      case 'number':
        return (
          <TextInput
            value={value}
            onChange={handleChange}
            placeholder={question.placeholder}
            required={question.required}
            type="number"
          />
        );

      case 'select':
        return (
          <SelectInput
            value={value}
            onChange={handleChange}
            options={question.options}
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <TextareaInput
            value={value}
            onChange={handleChange}
            placeholder={question.placeholder}
            required={question.required}
          />
        );

      case 'group':
        return (
          <GroupInput
            question={question}
            value={value}
            onChange={handleGroupChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="question">
      <label className="question-label">
        {question.label}
        {question.required && <span className="required">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

// Section Header Component
const SectionHeader = ({
  section,
  currentSection,
  totalSections,
  isCompleted,
}) => (
  <div className="section-header">
    <h2 className="section-title">{section.title}</h2>
    <div className="section-meta">
      <span>
        Section {currentSection + 1} of {totalSections}
      </span>
      {isCompleted && <span className="section-completed">✓</span>}
    </div>
  </div>
);

// Navigation Buttons Component
const NavigationButtons = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  mailtoUrl,
}) => (
  <div className="navigation">
    <button
      onClick={onPrevious}
      disabled={currentSection === 0}
      className="nav-button secondary"
    >
      <span>‹</span>
      <span>Previous</span>
    </button>

    {currentSection === totalSections - 1 ? (
      <button 
        className="nav-button submit"
        onClick={() => {
          // Create a temporary anchor and click it
          const link = document.createElement('a');
          link.href = mailtoUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        <span>📧</span>
        <span>Submit Questionnaire</span>
      </button>
    ) : (
      <button onClick={onNext} className="nav-button primary">
        <span>Next</span>
        <span>›</span>
      </button>
    )}
  </div>
);

// Main Form Content Component
const FormContent = ({
  currentSection,
  formData,
  completedSections,
  onInputChange,
  onNavigate,
  mailtoUrl,
}) => {
  const section = SECTIONS[currentSection];

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">
            Air Traffic Control Facility Questionnaire
          </h1>
          <p className="form-description">
            Please provide information about your air traffic facility to help
            us create accurate traffic simulations.
          </p>
        </div>

        <div className="form-body">
          <SectionHeader
            section={section}
            currentSection={currentSection}
            totalSections={SECTIONS.length}
            isCompleted={completedSections.has(currentSection)}
          />

          <div className="questions-container">
            {section.questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                sectionId={section.id}
                formData={formData}
                onInputChange={onInputChange}
              />
            ))}
          </div>

          <NavigationButtons
            currentSection={currentSection}
            totalSections={SECTIONS.length}
            onPrevious={() => onNavigate(Math.max(0, currentSection - 1))}
            onNext={() =>
              onNavigate(Math.min(SECTIONS.length - 1, currentSection + 1))
            }
            mailtoUrl={mailtoUrl}
          />
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AirTrafficQuestionnaire = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState(new Set());

  const handleInputChange = (
    sectionId,
    questionId,
    value,
    subfieldId = null
  ) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (!newData[sectionId]) newData[sectionId] = {};

      if (subfieldId) {
        if (!newData[sectionId][questionId])
          newData[sectionId][questionId] = {};
        newData[sectionId][questionId][subfieldId] = value;
      } else {
        newData[sectionId][questionId] = value;
      }

      return newData;
    });
  };

  useEffect(() => {
    const completed = new Set();
    SECTIONS.forEach((section, index) => {
      if (checkSectionCompletion(index, formData)) {
        completed.add(index);
      }
    });
    setCompletedSections(completed);
  }, [formData]);

  // Generate mailto URL dynamically
  const generateMailtoUrl = () => {
    const emailBody = generateEmailBody(formData);
    const subject = `Air Traffic Facility Questionnaire - ${
      formData['facility-info']?.['facility-name'] || 'Unknown Facility'
    }`;
    const recipientEmail = 'timothy.perry151@gmail.com';
    
    // Create basic mailto first to test
    const basicMailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}`;
    
    // Check if full URL would be too long (2048 char limit)
    const fullUrl = `${basicMailto}&body=${encodeURIComponent(emailBody)}`;
    
    if (fullUrl.length > 2000) {
      // Use shortened body
      const shortBody = "Please see attached questionnaire data.\n\n" + 
        "Facility: " + (formData['facility-info']?.['facility-name'] || 'Unknown') + "\n" +
        "Type: " + (formData['facility-info']?.['facility-type'] || 'Unknown') + "\n\n" +
        "Full data was too long for email. Please contact for complete information.";
      return `${basicMailto}&body=${encodeURIComponent(shortBody)}`;
    }
    
    return fullUrl;
  };

  const progress = (completedSections.size / SECTIONS.length) * 100;

  return (
    <div className="app-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sections={SECTIONS}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        completedSections={completedSections}
        progress={progress}
      />

      <div className="main-content">
        <FormContent
          currentSection={currentSection}
          formData={formData}
          completedSections={completedSections}
          onInputChange={handleInputChange}
          onNavigate={setCurrentSection}
          mailtoUrl={generateMailtoUrl()}
        />
      </div>
    </div>
  );
};

export default AirTrafficQuestionnaire;
