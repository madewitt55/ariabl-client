import CodeMirrorMerge from 'react-codemirror-merge';
import { EditorView } from '@codemirror/view';
import { html } from '@codemirror/lang-html';
import './Editor.css';

const minHeight = EditorView.theme({
    '&': { minHeight: '50vh' },
});

function Editor(props: {
    originalHtml: string;
    modifiedHtml: string;
    setOriginalHtml: (value: string) => void;
}) {
    return (
        <CodeMirrorMerge style={{ width: '80vw' }} className='text-blue-400' highlightChanges gutter>
            <CodeMirrorMerge.Original
                value={props.originalHtml}
                extensions={[html(), minHeight]}
                onChange={props.setOriginalHtml}
            />
            <CodeMirrorMerge.Modified
                value={props.modifiedHtml}
                extensions={[html(), minHeight]}
            />
        </CodeMirrorMerge>
    );
}

export default Editor;
