const BASE_URL: string = 'http://localhost:3000/api';

import { restructureHtmlSchema, parseHtmlSchema, validateHtmlStructureSchema, accessibilityCheckSchema } from "../schema/html.schema";
import { serializeTagsSchema } from "../schema/tag.schema";
import axios, { type AxiosResponse } from "axios";
import { ZodError } from "zod";

export type Tag = {
    id: number;
    tagName: string;
    attributes: Record<string, string>;
    content: Array<string | Tag>;
    error: 'UNCLOSED' | 'SELF_CLOSING' | 'NOT_SELF_CLOSING' | null;
};

export interface ParseHtmlData {
    html: string;
}
export interface ParseHtmlResponse {
    tags: Tag[];
    message: string;
}

export interface SerializeTagsData {
    tags: Tag[];
}
export interface SerializeTagsResponse {
    html: string;
    message: string;
}

export interface RestructureHtmlData {
    html: string;
}
export interface RestructureHtmlResponse {
    html: string;
    message: string;
}

export interface ValidateHtmlStructureData {
    html: string;
}
export interface ValidateHtmlStructureResponse {
    isValid: boolean;
    message: string;
}

export async function parseHtml(data: ParseHtmlData): Promise<ParseHtmlResponse> {
    try {
        parseHtmlSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/parse`, {
            html: data.html
        });

        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export async function serializeTags(data: SerializeTagsData): Promise<SerializeTagsResponse> {
    try {
        serializeTagsSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/tags/serialize`, {
            tags: data.tags
        });

        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export async function restructureHtml(data: RestructureHtmlData): Promise<RestructureHtmlResponse> {
    try {
        restructureHtmlSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/restructure`, {
            html: data.html
        });

        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export interface CheckImageAltData {
    html: string;
}
export interface CheckImageAltResponse {
    html: string;
    message: string;
}

export async function checkImageAlt(data: CheckImageAltData): Promise<CheckImageAltResponse> {
    try {
        accessibilityCheckSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/check-image-alt`, {
            html: data.html
        });

        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export async function checkFormLabels(data: CheckImageAltData): Promise<CheckImageAltResponse> {
    try {
        accessibilityCheckSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/check-form-labels`, { html: data.html });
        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export async function checkHeadings(data: CheckImageAltData): Promise<CheckImageAltResponse> {
    try {
        accessibilityCheckSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/check-headings`, { html: data.html });
        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export async function checkLandmarks(data: CheckImageAltData): Promise<CheckImageAltResponse> {
    try {
        accessibilityCheckSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/check-landmarks`, { html: data.html });
        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}

export async function validateHtmlStructure(data: ValidateHtmlStructureData): Promise<ValidateHtmlStructureResponse> {
    try {
        validateHtmlStructureSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html/validate`, {
            html: data.html
        });

        return res.data;
    } catch (err: any) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0]?.message ?? 'Validation error');
        }
        else if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data.message ?? 'Unknown error occured');
        }
        else {
            throw new Error('An unknown error occured');
        }
    }
}
