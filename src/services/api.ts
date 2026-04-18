const BASE_URL: string = 'http://localhost:3000/api';

import { uploadHtmlSchema } from "../schema/html.schema";
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

export interface UploadHtmlData {
    html: string;
}
export interface UploadHtmlResponse {
    tags: Tag[];
    modifiedTags: Tag[];
    modifiedHtml: string;
    message: string;
}

export interface SerializeTagsData {
    tags: Tag[]
}
export interface SerializeTagsResponse {
    html: string;
}

export async function uploadHtml(data: UploadHtmlData): Promise<UploadHtmlResponse> {
    try {
        uploadHtmlSchema.parse(data);

        const res: AxiosResponse = await axios.post(`${BASE_URL}/html`, {
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
