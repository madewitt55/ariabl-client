const BASE_URL: string = 'http://localhost:3000/api';

import { uploadHtmlSchema } from "../schema/html.schema";
import axios, { type AxiosResponse } from "axios";
import { ZodError } from "zod";

export interface UploadHtmlData {
    html: string;
}

export type Tag = {
    id: number;
    tagName: string; // ex. h1, h2, div
    innerText: string; // ex. <h1> INNER TEXT </h1>
    attributes: Record<string, string>; // ex. <h1 attr="attr"></h1>
    children: Tag[];
    error: 'UNCLOSED' | 'CLOSED' | 'SELF_CLOSING' | 'NOT_SELF_CLOSING' | null;
};
export interface UploadHtmlResponse {
    tags: Tag[];
    message: string;
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
