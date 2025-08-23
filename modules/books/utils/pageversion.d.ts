import { Author } from "./authors";

export interface PageVersion{
    language:string;
    content:string;
    pageId:string;
    authorId:null|Author; //Populated authorId
}