import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { parseHtml, checkImageAlt, checkFormLabels, checkHeadings, checkLandmarks, type Tag } from './services/api';
import TagView, { flattenTags } from './TagView';
import './App.css';

type CheckStatus = 'idle' | 'running' | 'passed' | 'failed';

type Check = {
    name: string;
    status: CheckStatus;
    tags: Tag[];
    disabled: boolean;
    run: (html: string) => Promise<string>;
};

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

function buildChecks(tags: Tag[]): Check[] {
    const flat = flattenTags(tags);
    return [
        {
            name: 'Image Alt Text',
            status: 'idle',
            tags: [],
            disabled: !flat.some(t => t.tagName === 'img'),
            run: async (html) => (await checkImageAlt({ html })).html,
        },
        {
            name: 'Form Label Association',
            status: 'idle',
            tags: [],
            disabled: !flat.some(t => ['input', 'select', 'textarea'].includes(t.tagName)),
            run: async (html) => (await checkFormLabels({ html })).html,
        },
        {
            name: 'Heading Hierarchy',
            status: 'idle',
            tags: [],
            disabled: false,
            run: async (html) => (await checkHeadings({ html })).html,
        },
        {
            name: 'ARIA Landmark Roles',
            status: 'idle',
            tags: [],
            disabled: false,
            run: async (html) => (await checkLandmarks({ html })).html,
        },
    ];
}

function App2() {
    const { state } = useLocation();
    const [code, setCode] = useState<string>(state?.code ?? '');
    const [tags, setTags] = useState<Tag[]>(state?.tags ?? []);
    const [heading, setHeading] = useState<string>('Optimization');
    const [subheading, setSubheading] = useState<string>("Let's work on your code's accessibility.");
    const [checks, setChecks] = useState<Check[]>(() => buildChecks(state?.tags ?? []));
    const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);

    function updateCheck(index: number, patch: Partial<Check>) {
        setChecks(prev => prev.map((c, i) => i === index ? { ...c, ...patch } : c));
    }

    async function runChecks() {
        let currentCode = code;

        for (let i = 0; i < checks.length; i++) {
            if (checks[i].disabled) continue;

            updateCheck(i, { status: 'running' });

            try {
                const updatedHtml = await checks[i].run(currentCode);
                const updatedTags = await parse(updatedHtml);
                updateCheck(i, { status: 'passed', tags: updatedTags });
                currentCode = updatedHtml;
                setCode(currentCode);
                setTags(updatedTags);
            } catch {
                updateCheck(i, { status: 'failed' });
            }
        }
    }

    return (
        <div className='flex flex-col items-center h-screen overflow-hidden pt-8 pb-8'>
            <h1 className='text-4xl font-bold mb-2'>{heading}</h1>
            {subheading && <h2 className='text-2xl mb-4'>{subheading}</h2>}

            <div className='flex flex-row flex-1 min-h-0 gap-6 pb-8 w-full px-8'>
                <div className='card rounded-2xl shadow-xl p-8 flex flex-col flex-1 min-h-0'>
                    <TagView tags={selectedCheck ? selectedCheck.tags : tags} setHeading={setHeading} setSubheading={setSubheading} />
                </div>

                <div className='card rounded-2xl shadow-xl p-8 flex flex-col flex-1 min-h-0 gap-3'>
                    {checks.map((check) => (
                        <div
                            key={check.name}
                            onClick={() => check.status === 'passed' ? setSelectedCheck(check) : undefined}
                            className={`flex flex-col px-6 py-5 rounded-lg gap-3 transition-all
                                ${check.disabled ? 'bg-gray-700 opacity-40 pointer-events-none' :
                                  check.status === 'passed' ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' : 'bg-gray-700'}
                                ${selectedCheck?.name === check.name ? 'ring-2 ring-white' : ''}`}
                        >
                            <div className='flex flex-row items-center'>
                                <span className='font-medium text-lg flex-1'>{check.name}</span>
                                <div className={`w-4 h-4 rounded-full ${
                                    check.status === 'passed' ? 'bg-green-500' :
                                    check.status === 'failed' ? 'bg-red-500' :
                                    'bg-gray-500'
                                }`} />
                            </div>
                            <div className='w-full h-2 rounded-full bg-gray-600 overflow-hidden'>
                                <div className={`h-full rounded-full transition-all duration-500 ${
                                    check.status === 'passed' ? 'w-full bg-green-500' :
                                    check.status === 'failed' ? 'w-full bg-red-500' :
                                    check.status === 'running' ? 'w-1/2 bg-blue-400 animate-pulse' :
                                    'w-0'
                                }`} />
                            </div>
                        </div>
                    ))}
                    <div className='flex flex-row gap-3 self-center mt-2'>
                        <button
                            className='upload-button rounded-lg px-6 py-3 font-medium text-lg cursor-pointer'
                            onClick={runChecks}
                        >
                            Run Checks
                        </button>
                        <button
                            className='bg-gray-600 hover:bg-gray-500 rounded-lg px-6 py-3 font-medium text-lg cursor-pointer transition-colors'
                            onClick={() => {
                                const blob = new Blob([code], { type: 'text/html' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'index.html';
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App2;
