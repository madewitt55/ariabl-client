import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { scrollX } from './extensions';
import './UploadForm.css';
import uploadIcon from './media/upload.png';
import {useRef} from 'react';

function UploadForm(props: {
    submit: (html: string) => void;
    code: string,
    setCode: (code: string) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => props.setCode(ev.target?.result as string);
        reader.readAsText(file);
    }

    return (
        <div className='flex flex-col w-full h-full'>
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
                value={props.code}
                onChange={(value: string) => props.setCode(value)}
                theme={vscodeDark}
                height='100%'
                className='flex-1 min-h-0'
                extensions={[html(), scrollX]}
            />
            <button 
                className='flex flex-row items-center mt-3 upload-button rounded-lg px-8 py-3 cursor-pointer self-center font-medium text-xl'
                onClick={() => props.submit(props.code)}
            >
                Submit
            </button>
        </div>
    )
}

export default UploadForm;
