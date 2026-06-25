import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tooltip } from 'react-tooltip';

interface HelpTooltipProps {
  id: string;
  help: string;
}

const imgStyle: React.CSSProperties = {
  maxWidth: '100%',
  borderRadius: '6px',
  margin: '0.5rem 0',
};

const components = {
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} style={imgStyle} loading="lazy" />
  ),
};

export function HelpIcon({ id }: { id: string }) {
  const iconId = `help-svg-${id}`;
  return (
    <svg
      data-tooltip-id={id}
      id={iconId}
      className="help-icon-inline"
      width="18" height="18" viewBox="0 0 18 18"
      fill="none"
    >
      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
      <text x="9" y="13" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="bold" opacity="0.7">
        ?
      </text>
    </svg>
  );
}

export function HelpTooltip({ id, help }: HelpTooltipProps) {
  return (
    <Tooltip
      id={id}
      place="right"
      delayShow={400}
      clickable
      opacity={1}
      style={{
        maxWidth: '520px',
        maxHeight: '360px',
        overflowY: 'auto',
        padding: '0.75rem',
        fontSize: '0.8rem',
        lineHeight: '1.5',
        background: '#151530',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        color: '#c8c8e0',
        zIndex: 200,
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {help}
      </ReactMarkdown>
    </Tooltip>
  );
}
