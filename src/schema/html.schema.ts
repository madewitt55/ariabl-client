import { object, string } from "zod";

export const uploadHtmlSchema = object({
    html: string('html is required').min(1)
});