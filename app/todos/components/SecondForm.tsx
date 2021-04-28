import { EditForm, FormProps } from "app/core/components/EditForm"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { LabeledTextAreaField } from "app/core/components/LabeledTextAreaField"
import * as z from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function SecondForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <EditForm<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="name" />
      <LabeledTextAreaField name="information" label="information" placeholder="information" />
    </EditForm>
  )
}
