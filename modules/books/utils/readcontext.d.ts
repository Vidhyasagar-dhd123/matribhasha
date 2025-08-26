import { Author } from "./authors";
import { Book } from "./books";
import { Page } from "./page";
import { PageVersion } from "./pageversion";

export interface Values {
  book: { data: Book | null; set: (b: Book | null) => void }
  authors: { data: Author[] | null; set: (a: Author[] | null) => void }
  author: { data: Author | null; set: (a: Author | null) => void }
  page: { data: Page | null; set: (p: Page | null) => void }
  pages: { data: Page[] | null; set: (p: Page[] | null) => void }
  chapter: { data: object; set: (c: object) => void }
  chapters: { data: object[]; set: (cs: object[]) => void }
  language: { data: string|null; set: (l: string) => void }
  content: { data: PageVersion | null; set: (c: PageVersion | null) => void }
}
