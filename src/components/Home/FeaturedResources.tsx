import { useEffect, useState } from "react";
import { getFeaturedResources, type DesignResource } from "../../data/resources";
import ResourceCards from "../Resources/ResourceCards";

export default function FeaturedResources() {
  const [resources, setResources] = useState<DesignResource[]>([]);

  useEffect(() => {
    getFeaturedResources()
      .then(setResources)
      .catch(() => setResources([]));
  }, []);

  if (!resources.length) return null;

  return (
    <section
      id="resources"
      className="featured-resources"
      aria-labelledby="featured-resources-heading"
    >
      <div className="featured-resources-header">
        <div>
          <p className="workbench-kicker">Resources</p>
          <h2 id="featured-resources-heading">Featured Design Resources</h2>
        </div>
        <p>
          These are the reference layers behind better skill usage: product framing, design-system
          context, and promptable visual styles.
        </p>
      </div>
      <ResourceCards resources={resources} />
    </section>
  );
}
