import CodeMirror from '@uiw/react-codemirror';
import {html} from '@codemirror/lang-html';
import './UploadForm.css';
import uploadIcon from './media/upload.png';
import {useState} from 'react';

function UploadForm() {
    const [htmlText, setHtmlText] = useState<string>('');

    return (
        <form className='form flex flex-col w-[60vw] h-[80vh] rounded-2xl shadow-xl p-8'>
            <button className='flex flex-row items-center mt-8 gap-2 upload-button rounded-lg px-8 py-3 cursor-pointer self-center font-medium text-xl'>
                Upload File
                <img src={uploadIcon} className='w-7 h-7'/>
            </button>
            <label className='text-base text-gray-400 mt-4'>Or paste here</label>
            <CodeMirror
                value={htmlText}
                onChange={(value: string) => setHtmlText(value)}
                height="50vh"
                extensions={[html()]}
                className='text-blue-400'
            />
        </form>
    )
}

export default UploadForm;
