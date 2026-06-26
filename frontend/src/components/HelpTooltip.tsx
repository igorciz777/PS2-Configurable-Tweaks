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
  return (
    <svg
      data-tooltip-id={id}
      className="help-icon-inline"
      width="16" height="16" viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <text x="8" y="11.5" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
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
        maxWidth: '480px',
        maxHeight: '360px',
        overflowY: 'auto',
        padding: '0.75rem 1rem',
        fontSize: '0.8rem',
        lineHeight: '1.6',
        background: '#0e1026',
        border: '1px solid rgba(74, 125, 255, 0.15)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        color: '#c0c4d8',
        zIndex: 200,
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {help}
      </ReactMarkdown>
    </Tooltip>
  );
}
