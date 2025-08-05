
# Form Component to `formKey` Mapping

This document outlines the mapping between the form components and the `formKey` constants used in `FORM_STORAGE_KEYS`. Use this as a reference to ensure consistent usage of the storage hooks.

## Mapping Table

| Form Component | `formKey` | `FORM_STORAGE_KEYS` Constant |
|---|---|---|
| `PersonalInfoSection` | `personal-info-form` | `PERSONAL_INFO` |
| `WorkExperienceSection` | `work-experience-form` | `WORK_EXPERIENCE` |
| `EducationSection` | `education-form` | `EDUCATION` |
| `SkillsSection` | `skills-form` | `SKILLS` |

## Usage

When using the `useFormPersistence` hook or other storage functions, use the string literal from the `formKey` column.

### Example

```tsx
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { personalInfoSchema } from '@/features/resume-schemas';

function PersonalInfoSection() {
  const { formData, handleFieldChange } = useFormPersistence({
    formKey: 'personal-info-form', // Correct key
    schema: personalInfoSchema,
  });

  // ...
}
```

