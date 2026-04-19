import { useState } from 'react';
import CodeMirrorMerge from 'react-codemirror-merge';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { scrollX, mergeEditorTheme } from './extensions';
import './Editor.css';

function Editor(props: {
    code: string;
    update: (html: string) => void;
    suggestedCode: string;
    setSuggestedCode: (html: string) => void;
}) {
    const [code, setCode] = useState<string>(props.code);

    if (!props.suggestedCode.length) {
        return (
            <div className='flex flex-col h-full'>
                <span className='text-center text-lg font-medium text-gray-300 mb-2'>Your Code</span>
                <CodeMirror
                    value={code}
                    theme={vscodeDark}
                    extensions={[html(), scrollX]}
                />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-row mb-2'>
                <span className='flex-1 text-center text-lg font-medium text-gray-300'>Your Code</span>
                <span className='flex-1 text-center text-lg font-medium text-gray-300'>Suggested Changes</span>
            </div>
            <CodeMirrorMerge theme={vscodeDark} highlightChanges gutter>
                <CodeMirrorMerge.Original
                    value={code}
                    onChange={(value: string) => setCode(value)}
                    extensions={[html(), mergeEditorTheme]}
                />
                <CodeMirrorMerge.Modified
                    value={props.suggestedCode}
                    extensions={[html(), mergeEditorTheme]}
                    editable={false}
                />
            </CodeMirrorMerge>
            <button
                className='upload-button rounded-lg px-8 py-3 cursor-pointer font-medium text-lg self-center mt-6'
                onClick={() => {
                    setCode(props.suggestedCode);
                    props.setSuggestedCode('');
                    props.update(props.suggestedCode);
                }}
            >
                Accept Changes
            </button>
        </div>
    );
}

export default Editor;
