// DEPRECATED: Use usePropertyProfile.createPropertyDraft() instead
// This file contains legacy creation logic that conflicts with the sanitized payload system
// All property creation should go through the single sanitized pathway

/*
LEGACY CODE - DO NOT USE
This file has been deprecated to prevent payload conflicts.
Use: usePropertyProfile.createPropertyDraft(rawFormData) instead
*/

export function deprecatedNotice() {
  console.warn("This file is deprecated. Use usePropertyProfile.createPropertyDraft() instead");
}