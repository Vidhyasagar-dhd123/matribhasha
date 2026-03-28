import localTranslate from "./localTranslation.service";

export const vendors = {
    local : localTranslate
} as const;

export type VendorType = keyof typeof vendors;