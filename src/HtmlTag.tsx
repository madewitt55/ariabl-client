import type { Tag } from "./services/api";
import './HtmlTag.css';

// Void elements can not have children and only consist of an open tag
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const ERROR_MESSAGES: Record<string, { name: string; message: string }> = {
    UNCLOSED:        { name: 'Unclosed Tag',       message: 'This tag is never closed.' },
    SELF_CLOSING:    { name: 'Self-Closing Tag',   message: 'Non-void element closed with />.' },
    NOT_SELF_CLOSING:{ name: 'Not Self-Closing',   message: 'Void element should use />.' },
    HAS_CHILDREN:    { name: 'Invalid Children',   message: 'Void elements cannot have children.' },
    HAS_TEXT:        { name: 'Invalid Text',        message: 'Void elements cannot contain text.' },
    CLOSED:          { name: 'Explicit Close Tag',  message: 'Void element has an explicit closing tag.' },
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
                className={`tag-section relative group px-4 py-2 text-xl font-bold select-none 
                        ${props.tag.error ? (props.tag.error === 'NOT_SELF_CLOSING' ? 'text-yellow-400' : 'text-red-400') : ''}`}
            >
                {`<${props.tag.tagName}`}
                {(isSelfClosing) ? (
                    '/>'
                ): '>'}
                <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden text-base font-normal rounded px-2 py-1 whitespace-nowrap
                        ${props.tag.error ? 'group-hover:block' : ''}
                        ${props.tag.error === 'NOT_SELF_CLOSING'
                            ? 'bg-yellow-900 text-yellow-300 border border-yellow-600'
                            : 'bg-red-900 text-red-300 border border-red-600'
                        }`}
                >
                    {props.tag.error && <>
                        <span className='font-bold'>{ERROR_MESSAGES[props.tag.error].name}: </span>
                        {ERROR_MESSAGES[props.tag.error].message}
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
        
        {props.tag.children.map((child: Tag) => (
            <div key={child.id} className='mt-1 ml-6 pl-3 border-l-2 border-gray-600'>
                <HtmlTag tag={child} />
            </div>
        ))}

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
