import { useEffect, useState } from "react";
import {
  type DesignResource,
  getResourcesForSkill,
} from "../../data/resources";
import ResourceCards from "../Resources/ResourceCards";

interface Props {
  skillId: string;
}

export default function RelatedResources({ skillId }: Props) {
  const [resources, setResources] = useState<DesignResource[]>([]);

  useEffect(() => {
    getResourcesForSkill(skillId)
      .then(setResources)
      .catch(() => setResources([]));
  }, [skillId]);

  if (!resources.length) return null;

  return (
    <div className="related-resources">
      <h3 className="related-skills-title">
        <span aria-hidden="true" />
        Related Design Resources
      </h3>
      <ResourceCards resources={resources} variant="compact" />
    </div>
  );
}
