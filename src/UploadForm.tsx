import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import './UploadForm.css';
import uploadIcon from './media/upload.png';
import {useRef} from 'react';
import { uploadHtml, type Tag, type UploadHtmlResponse } from './services/api';

function UploadForm(props: {
    setTags: (tags: Tag[]) => void,
    htmlText: string,
    setHtmlText: (text: string) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => props.setHtmlText(ev.target?.result as string);
        reader.readAsText(file);
    }

    async function submit() {
        try {
            const data: UploadHtmlResponse = await uploadHtml({ html: props.htmlText });
            props.setTags(data.tags);
            console.log(data.tags)
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <div className='form flex flex-col w-[60vw] h-[80vh] rounded-2xl shadow-xl p-8'>
            {/* Hidden file input */}
            <input 
                ref={fileInputRef}
                type='file' accept='.html,.htm' /* .html and .htm files only */
                className='hidden'
                onChange={handleFileChange}
            />
            <button 
                className='flex flex-row items-center gap-2 upload-button rounded-lg px-8 py-3 cursor-pointer self-center font-medium text-xl'
                onClick={() => fileInputRef.current?.click() /* Open file picker input */}
            >
                Upload File
                <img src={uploadIcon} className='w-7 h-7'/>
            </button>
            <label className='text-base text-gray-400 mt-2'>Or paste here</label>
            <CodeMirror
                value={props.htmlText}
                onChange={(value: string) => props.setHtmlText(value)}
                height="50vh"
                extensions={[html()]}
                className='text-blue-400'
            />
            <button 
                className='flex flex-row items-center mt-6 upload-button rounded-lg px-8 py-3 cursor-pointer self-center font-medium text-xl'
                onClick={submit}
            >
                Submit
            </button>
        </div>
    )
}

export default UploadForm;
