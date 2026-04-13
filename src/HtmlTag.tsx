import type { Tag } from "./services/api";
import './HtmlTag.css';

// Void elements can not have children and only consist of an open tag
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const ERROR_MESSAGES: Record<string, { name: string; message: string }> = {
    UNCLOSED:        { name: 'Unclosed Tag',       message: 'This tag is never closed.' },
    SELF_CLOSING:    { name: 'Self-Closing Tag',   message: 'Non-void element closed with />' },
    NOT_SELF_CLOSING:{ name: 'Not Self-Closing',   message: 'Void element should use />' },
    HAS_CHILDREN:    { name: 'Invalid Children',   message: 'Void elements cannot have children' },
    HAS_TEXT:        { name: 'Invalid Text',        message: 'Void elements cannot contain text' },
    CLOSED:          { name: 'Explicit Close Tag',  message: 'Void element has an explicit closing tag' },
};

function HtmlTag(props: {
    tag: Tag,
}) {
    const isVoidElement: boolean = VOID_ELEMENTS.has(props.tag.tagName);
    const isSelfClosing: boolean = props.tag.error === 'SELF_CLOSING' || (isVoidElement && props.tag.error === null);
    const isClosed: boolean = (!isVoidElement && props.tag.error !== 'UNCLOSED' && props.tag.error !== 'SELF_CLOSING') || (isVoidElement && props.tag.error === 'CLOSED');

    return (
        <>
        <div className='tag-body flex flex-row rounded-lg border font-mono w-full'>
            {/* Tag name eg. <h1>, <div>, <p> */}
            <div
                // Void tags that are not self closing display as warnings, all others display as errors
                className={`tag-section relative group px-4 py-2 text-xl font-bold select-none flex items-center
                        ${props.tag.error ? (props.tag.error === 'NOT_SELF_CLOSING' ? 'text-yellow-400' : 'text-red-400') : ''}`}
            >
                {`<${props.tag.tagName}`}
                {(isSelfClosing) ? (
                    '/>'
                ): '>'}
                {/* Tooltip on hover */}
                <div
                    className={`flex flex-row text-center absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden text-sm font-sans font-normal rounded-lg px-3 py-2 shadow-lg min-w-max z-10 whitespace-nowrap
                        ${props.tag.error ? 'group-hover:block' : ''}
                        ${props.tag.error === 'NOT_SELF_CLOSING'
                            ? 'bg-yellow-950 text-yellow-200 border border-yellow-700'
                            : 'bg-red-950 text-red-200 border border-red-800'
                        }`}
                >
                    {props.tag.error && <>
                        <strong>{ERROR_MESSAGES[props.tag.error].name}</strong>
                        <p>{ERROR_MESSAGES[props.tag.error].message}</p>
                    </>}
                </div>
            </div>
            {/* Text contained within the tag */}
            <div className='tag-section px-4 py-2 flex-1 text-sm self-center'>
                {props.tag.innerText}
            </div>
            {/* Attribute keys and values of the tag */}
            <div className='tag-section px-4 py-2 text-sm self-center'>
                {Object.entries(props.tag.attributes).map(([key, val]) => (
                    <span key={key} className='mr-3'>
                        <span className='tag-attr-key'>{key}</span>
                        {val && <span className='tag-attr-val'>="{val}"</span>}
                    </span>
                ))}
            </div>
        </div>
        
        {props.tag.children.length > 0 && (
            <div className='mt-1 ml-6 pl-3 border-l-2 border-gray-600 flex flex-col gap-1'>
                {props.tag.children.map((child: Tag) => (
                    <HtmlTag key={child.id} tag={child} />
                ))}
            </div>
        )}

        {(isClosed) && (
            <div className='tag-body inline-flex flex-row rounded-lg border font-mono overflow-hidden self-start'>
            <div className={`tag-section px-4 py-2 text-xl font-bold ${props.tag.error ? 'text-red-400' : ''}`}>
                &lt;/&gt;
            </div>
        </div>
        )}
        </>
    )
}

export default HtmlTag;
