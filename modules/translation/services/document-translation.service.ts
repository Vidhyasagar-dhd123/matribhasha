import indicTransClient from "./indicTrans.service";

export const listDocuments = () => indicTransClient.getDocuments();
export const uploadDocument = (formData: FormData) => indicTransClient.uploadPdf(formData);

export const getDocumentPages = (
  docId: string | number,
  queryParams: { page?: number; start?: number; end?: number; all?: boolean } = {}
) => indicTransClient.getPages(docId, queryParams);

export const extractDocumentPage = (docId: string | number, pageNumber?: number) =>
  indicTransClient.extractPage(docId, pageNumber);

export const getDocumentImages = (docId: string | number, pageNumber?: number) =>
  indicTransClient.getImages(docId, pageNumber);

export const translateDocumentPage = (
  docId: string | number,
  pageNumber: number,
  targetLang: string,
  sourceLang = "eng_Latn"
) => indicTransClient.translatePage(docId, pageNumber, targetLang, sourceLang);

export const translateDocument = (
  docId: string | number,
  targetLang: string,
  sourceLang = "eng_Latn"
) => indicTransClient.translateAll(docId, targetLang, sourceLang);

export const translateDocumentRange = (
  docId: string | number,
  startPage: number,
  endPage: number,
  targetLang: string,
  sourceLang = "eng_Latn"
) => indicTransClient.translateRange(docId, startPage, endPage, targetLang, sourceLang);

export const getDocumentTranslations = (
  docId: string | number,
  language = "hin_Deva",
  all?: boolean,
  page?: number
) => indicTransClient.getTranslations(docId, language, all, page);

export const getTranslationUsage = () => indicTransClient.getStats();

export const topUpTranslationTokens = () => indicTransClient.topupTokens();