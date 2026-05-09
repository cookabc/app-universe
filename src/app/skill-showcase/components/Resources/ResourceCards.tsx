import type { CSSProperties } from "react";
import type { DesignResource } from "../../data/resources";

interface Props {
  resources: DesignResource[];
  variant?: "featured" | "compact";
}

export default function ResourceCards({
  resources,
  variant = "featured",
}: Props) {
  if (!resources.length) return null;

  return (
    <div
      className={
        variant === "featured"
          ? "resource-card-grid"
          : "resource-card-grid compact"
      }
    >
      {resources.map((resource, index) => (
        <article
          key={resource.id}
          className="resource-card"
          style={{ "--resource-color": resource.accent } as CSSProperties}
        >
          <div className="resource-card-head">
            <span className="resource-card-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="resource-card-kind">{resource.eyebrow}</span>
          </div>
          <h3>{resource.name}</h3>
          <p>{resource.description}</p>
          <div className="resource-card-best">
            {resource.bestFor
              .slice(0, variant === "featured" ? 3 : 2)
              .map((item) => (
                <span key={item}>{item}</span>
              ))}
          </div>
          <div className="resource-card-footer">
            <div className="resource-card-tags">
              {resource.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a
              href={resource.url}
              className="resource-card-action"
              aria-label={`Open ${resource.name}`}
            >
              <span>Open</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
