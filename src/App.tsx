import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import UploadForm from './UploadForm';
import {parseHtml, restructureHtml, validateHtmlStructure, type Tag} from './services/api';
import TagView from './TagView';
import Editor from './Editor';

function App() {
    const navigate = useNavigate();
    const [tags, setTags] = useState<Tag[]>();
    const [code, setCode] = useState<string>('');
    const [validCode, setValidCode] = useState<boolean>(false);
    const [suggestedCode, setSuggestedCode] = useState<string>('');
    const [view, setView] = useState<'Tags' | 'Editor'>('Tags');
    const [heading, setHeading] = useState<string>("Let's Get Started");
    const [subheading, setSubheading] = useState<string>('Upload an HTML file or paste code below');

    async function parse(html: string): Promise<Tag[]> {
        try {
            const tags: Tag[] = (await parseHtml({html})).tags;
            return tags;
        }
        catch (err: any) {
            console.log(err.message);
            return [];
        }
    }

    async function restructure(html: string): Promise<string> {
        try {
            const restructuredHtml: string = (await restructureHtml({html})).html;
            return restructuredHtml;
        }
        catch (err: any) {
            console.log(err.message);
            return '';
        }
    }

    async function validate(html: string): Promise<boolean> {
        try {
            const isValid: boolean = (await validateHtmlStructure({html})).isValid;
            return isValid;
        }
        catch (err: any) {
            console.log(err.message);
            return false;
        }
    }

    async function updateCode(html: string): Promise<void> {
        const tags: Tag[] = await parse(html);
        if (!tags.length) return; // No tags, return

        //if (html === code) return; // No changes, return

        setTags(tags);
        setHeading('Analyzing code...');
        setSubheading('');

        const isValid: boolean = await validate(html);
        setValidCode(isValid);

        if (!isValid) {
            const restructuredHtml: string = await restructure(html);
            setSuggestedCode(restructuredHtml);
            setHeading('Your code has some issues');
            setSubheading("Let's resolve them.");
        }
        else {
            setSuggestedCode('');
            setHeading('Your code looks solid!');
            setSubheading("Let's optimize it.");
        }
    }

    return (
        <div className='flex flex-col items-center h-screen overflow-hidden pt-8 pb-8'>
            <h1 className='text-4xl font-bold mb-2'>{heading}</h1>
            <h2 className='text-2xl mb-4'>{subheading}</h2>

            {tags?.length ? (
                <div className='flex flex-row rounded-lg border border-gray-600 divide-x divide-gray-600 mb-6'>
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
            ): null}

            <div className='flex flex-row items-center flex-1 min-h-0 pb-8'>
                <div className='card rounded-2xl shadow-xl p-8 h-full'
                    style={{ width: tags?.length && view === 'Editor' ? '80vw' : '60vw' }}>
                    {tags?.length ? (
                        view === 'Tags' ? (
                            <TagView tags={tags} setHeading={setHeading} setSubheading={setSubheading} />
                        ) : (
                            <Editor
                                code={code}
                                update={updateCode}
                                suggestedCode={suggestedCode}
                                setSuggestedCode={setSuggestedCode}
                            />
                        )
                    ) : (
                        <UploadForm submit={updateCode} code={code} setCode={setCode} />
                    )}
                </div>

                {tags?.length ? (
                    <div className='action-panel flex flex-col gap-2 p-4 rounded-2xl ml-4'>
                        <button
                            disabled={!validCode}
                            onClick={() => navigate('/optimize', { state: { tags, code } })}
                            className={`rounded-lg px-6 py-3 font-medium text-lg transition-colors
                                ${!validCode
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                    : 'bg-green-600 hover:bg-green-700 cursor-pointer text-white'
                                }`}
                        >
                            Optimize
                        </button>
                        <button
                            className='bg-gray-600 rounded-lg px-6 py-3 font-medium text-lg cursor-pointer'
                            onClick={() => setTags([])}
                        >
                            Go back
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default App;
