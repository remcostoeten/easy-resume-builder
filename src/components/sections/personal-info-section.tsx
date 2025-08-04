"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "lucide-react"
import { FormSection } from "../form/form-section"
import { FormGrid } from "../form/form-grid"
import { FormField } from "../form/form-field"
import { Button } from "@/components/ui/button"
import { personalInfoSchema, type TPersonalInfoForm } from "../../schemas/resume-schemas"
import { resumeReducer } from "../../store/resume-store"
import type { TPersonalInfo } from "../../types/resume"

export type TPersonalInfoSectionProps = {
  readonly data: TPersonalInfo
}

export function PersonalInfoSection({ data }: TPersonalInfoSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm<TPersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      location: data.location,
      website: data.website || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      summary: data.summary || "",
    },
    mode: "onChange",
  })

  const watchedValues = watch()

  function handleFormSubmit(formData: TPersonalInfoForm) {
    resumeReducer({
      type: "UPDATE_PERSONAL_INFO",
      data: formData,
    })
  }

  function handleAutoSave() {
    if (isDirty && isValid) {
      handleSubmit(handleFormSubmit)()
    }
  }

  return (
    <FormSection title="Personal Information" icon={<User className="h-5 w-5" />} isRequired>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormGrid columns={2}>
          <FormField
            label="First Name"
            type="text"
            placeholder="John"
            required
            {...register("firstName")}
            error={errors.firstName?.message}
            hasError={Boolean(errors.firstName)}
          />

          <FormField
            label="Last Name"
            type="text"
            placeholder="Doe"
            required
            {...register("lastName")}
            error={errors.lastName?.message}
            hasError={Boolean(errors.lastName)}
          />
        </FormGrid>

        <FormGrid columns={2}>
          <FormField
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            required
            {...register("email")}
            error={errors.email?.message}
            hasError={Boolean(errors.email)}
          />

          <FormField
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            required
            {...register("phone")}
            error={errors.phone?.message}
            hasError={Boolean(errors.phone)}
          />
        </FormGrid>

        <FormField
          label="Location"
          type="text"
          placeholder="New York, NY"
          required
          {...register("location")}
          error={errors.location?.message}
          hasError={Boolean(errors.location)}
        />

        <FormGrid columns={3}>
          <FormField
            label="Website"
            type="url"
            placeholder="https://johndoe.com"
            {...register("website")}
            error={errors.website?.message}
            hasError={Boolean(errors.website)}
          />

          <FormField
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            {...register("linkedin")}
            error={errors.linkedin?.message}
            hasError={Boolean(errors.linkedin)}
          />

          <FormField
            label="GitHub"
            type="url"
            placeholder="https://github.com/johndoe"
            {...register("github")}
            error={errors.github?.message}
            hasError={Boolean(errors.github)}
          />
        </FormGrid>

        <FormField
          label="Professional Summary"
          type="textarea"
          placeholder="Brief overview of your professional background and key achievements..."
          {...register("summary")}
          error={errors.summary?.message}
          hasError={Boolean(errors.summary)}
        />

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">{isDirty ? "Unsaved changes" : "All changes saved"}</div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleAutoSave} disabled={!isDirty || !isValid}>
              Save Changes
            </Button>
            <Button type="submit" disabled={!isDirty || !isValid}>
              Save & Continue
            </Button>
          </div>
        </div>
      </form>
    </FormSection>
  )
}
