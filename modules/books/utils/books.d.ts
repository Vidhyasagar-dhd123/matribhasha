
export interface Book {
  id: string;
  title: string;
  author: string;
  originalLanguage: string;
  reviews: string;
  pages: string[]|null;
  uuid:string;
  isbn: string;
  published: number;
  versions: string[];
  description: string;
}