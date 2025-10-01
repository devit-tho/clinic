export interface FormProps<InitialType, SubmitType> {
  initialValues?: InitialType;
  onSubmit: (v: SubmitType) => Promise<void>;
}
