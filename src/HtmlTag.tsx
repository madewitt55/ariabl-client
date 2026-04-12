import type { Tag } from "./services/api";
import './HtmlTag.css';

// Void elements can not have children and only consist of an open tag
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function HtmlTag(props: {
    tag: Tag,
}) {

    const isVoidElement: boolean = VOID_ELEMENTS.has(props.tag.tagName);
    const isSelfClosing: boolean = props.tag.error === 'SELF_CLOSING' || (isVoidElement && props.tag.error === null);
    const isClosed: boolean = (!isVoidElement && props.tag.error !== 'UNCLOSED' && props.tag.error !== 'SELF_CLOSING') || (isVoidElement && props.tag.error === 'CLOSED');

    return (
        <>
        <div className='tag-body flex flex-row rounded-lg border font-mono w-full overflow-hidden'>
            {/* Tag name eg. <h1>, <div>, <p> */}
            <div
                className={`tag-section px-4 py-2 text-xl font-bold ${props.tag.error ? 'text-red-400' : ''}`}
            >
                {`<${props.tag.tagName}`}
                {(isSelfClosing) ? (
                    '/>'
                ): '>'}
                
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
