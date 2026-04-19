import { EditorView } from '@codemirror/view';

export const scrollX = EditorView.theme({
    '& .cm-scroller': { overflowX: 'auto' },
});

// Sets the editor height and horizontal scroll for use inside react-codemirror-merge panels.
// Vertical scroll and height:100% on the scroller are handled via Editor.css with
// higher specificity (4-class) to beat the merge library's 3-class !important rules.
export const mergeEditorTheme = EditorView.theme({
    '& .cm-scroller': { overflowX: 'auto' },
});
