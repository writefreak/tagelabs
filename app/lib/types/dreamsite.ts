export type TemplateType =
  | "modern_agency"
  | "editorial_portfolio"
  | "bold_saas";

export interface PreviewFormData {
  businessName: string;
  category: string;
  tagline: string;
  whatsapp: string;
  template: TemplateType;
}
