"use client";

import { useEffect, useState } from "react";
import {
  type DesignResource,
  getFeaturedResources,
} from "../../data/resources";
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
    <section className="max-w-7xl mx-auto px-4 pb-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
        Featured Resources
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Reference layers for better skill usage: product framing, design-system
        context, and promptable visual styles.
      </p>
      <ResourceCards resources={resources} />
    </section>
  );
}
