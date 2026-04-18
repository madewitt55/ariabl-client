import { useState } from 'react';
import './App.css';
import UploadForm from './UploadForm';
import type { Tag } from './services/api';
import TagView, { hasErrors, hasWarnings } from './TagView';
import Editor from './Editor';

function App() {
    const [tags, setTags] = useState<Tag[]>();
    const [originalHtml, setoriginalHtml] = useState<string>('');
    const [modifiedHtml, setModifiedHtml] = useState<string>('');
    const [view, setView] = useState<'Tags' | 'Editor'>('Tags');
    
    const errors = tags ? hasErrors(tags) : false;
    const warnings = tags ? hasWarnings(tags) : false;
    const heading = errors ? 'Your code has some issues'
        : warnings ? 'Your code could use a few tweaks'
        : 'Your code looks solid';
    const subheading = errors ? "Let's resolve them"
        : warnings ? 'Consider making a few changes'
        : "Let's optimize it";

    return (
        <div className='flex flex-col items-center h-screen overflow-hidden'>
            {tags?.length ? (
                <div className='flex flex-col items-center w-full flex-1 min-h-0 pt-8'>
                    <h1 className='text-4xl font-bold mb-2'>{heading}</h1>
                    <h2 className='text-2xl mb-6'>{subheading}</h2>

                    {/* Select TagView or EditorView */}
                    <div className='flex flex-row mb-6 rounded-lg border border-gray-600 divide-x divide-gray-600'>
                        {(['Tags', 'Editor'] as const).map((option, i) => (
                            <button
                                key={option}
                                onClick={() => setView(option)}
                                className={`px-6 py-2 font-medium text-sm cursor-pointer transition-colors
                                    ${i === 0 ? 'rounded-l-lg' : ''}
                                    ${i === 1 ? 'rounded-r-lg' : ''}
                                    ${view === option ? 'bg-white text-black' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {view === 'Tags' ? (
                        <TagView tags={tags} setTags={setTags} />
                    ) : (
                        <Editor
                            originalHtml={originalHtml}
                            modifiedHtml={modifiedHtml}
                            setOriginalHtml={setoriginalHtml}
                        />
                    )}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center flex-1'>
                    <h1 className='text-4xl font-bold mb-2'>Let's Get Started</h1>
                    <h2 className='text-2xl mb-6'>Upload an HTML file or paste code below</h2>
                    <UploadForm setTags={setTags} originalHtml={originalHtml} setOriginalHtml={setoriginalHtml}/>
                </div>
            )}
        </div>
    )
}

export default App;
