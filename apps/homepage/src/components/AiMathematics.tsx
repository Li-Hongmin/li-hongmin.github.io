import { ArrowUpRight } from "lucide-react";
import { Fragment } from "react";
import type { AiMathematics as AiMathematicsData } from "../data/profile";

// Render the minimal inline TeX used in rStation titles (e.g. "$H^{+-}$").
export function renderMathTitle(title: string) {
  return title.split(/\$([^$]+)\$/).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
    const pieces = part.split(/\^\{([^}]*)\}/);
    return (
      <i key={index}>
        {pieces.map((piece, pieceIndex) => (pieceIndex % 2 === 0 ? piece : <sup key={pieceIndex}>{piece.replace("-", "−")}</sup>))}
      </i>
    );
  });
}

export default function AiMathematics({ data }: { data: AiMathematicsData }) {
  return (
    <section className="editorial-section section-shell" id="ai-mathematics" aria-labelledby="ai-mathematics-heading">
      <div className="section-heading-row">
        <p className="section-kicker">AI Mathematics / rStation</p>
        <h2 id="ai-mathematics-heading">AI-generated mathematics</h2>
      </div>
      <p className="ai-math-summary">
        {data.summary}{" "}
        <a href={data.profileHref} target="_blank" rel="noreferrer">rStation<ArrowUpRight aria-hidden="true" size={13} /></a>
      </p>
      <p className="ai-math-disclosure" role="note">{data.disclosure}</p>
      <div className="publication-list" aria-label="Accepted rStation papers">
        {data.items.map((item) => (
          <article className="publication-row" key={item.id} data-rstation-id={item.paperId}>
            <time>{item.date}</time>
            <div className="publication-copy">
              <h3>{renderMathTitle(item.title)}</h3>
              <p>
                rStation {item.board} · {item.paperId} {item.version} · Accepted (platform review)
                {item.qualifier ? ` · ${item.qualifier}` : ""}
              </p>
            </div>
            <div className="link-cluster">
              {item.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}<ArrowUpRight aria-hidden="true" size={14} />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
