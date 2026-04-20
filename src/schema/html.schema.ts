import { object, string } from "zod";

export const parseHtmlSchema = object({
    html: string('html is required').min(1)
});

export const restructureHtmlSchema = object({
    html: string('html is required').min(1)
});

export const validateHtmlStructureSchema = object({
    html: string('html is required').min(1)
});

export const accessibilityCheckSchema = object({
    html: string('html is required').min(1)
});
