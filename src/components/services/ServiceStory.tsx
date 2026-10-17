import { ArrowDown, Check } from "lucide-react";
import type { Service } from "@/lib/services";

/**
 * A service in two plain statements (portfolio scenes): Before (the problem today, small and muted) →
 * After (the result, large and bright, with a tick). Fades in when the scene becomes active
 * (`.sx3-scene.is-on`); styles under "Service stories" (sst-*) in globals.css.
 */
export default function ServiceStory({ service }: { service: Service }) {
  const { before, after } = service.story;
  return (
    <div className="sst">
      <p className="sst-before"><small>Before</small>{before}</p>
      <span className="sst-arrow" aria-hidden="true"><ArrowDown size={18} /></span>
      <p className="sst-after"><small><Check size={13} strokeWidth={3} /> After</small>{after}</p>
    </div>
  );
}
