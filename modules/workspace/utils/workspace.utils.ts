import { Author } from "@/modules/books/utils/authors";

export interface Workspace {
    editLanguage:{ data: string | null; set: (b: string | null) => void };
}