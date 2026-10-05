"use server";

import { createClient } from "../supabase/server";
import { PreviewFormData } from "../types/dreamsite";

export async function saveDreamSiteLead(formData: PreviewFormData) {
  try {
    if (!formData.businessName || !formData.template) {
      return {
        success: false,
        error: "Business name and template selection are required.",
      };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("dream_site_leads")
      .insert([
        {
          business_name: formData.businessName,
          category: formData.category,
          tagline: formData.tagline,
          whatsapp: formData.whatsapp,
          template: formData.template,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    console.error("Server Action Error:", err);
    return {
      success: false,
      error: "Unexpected server error while saving lead.",
    };
  }
}
