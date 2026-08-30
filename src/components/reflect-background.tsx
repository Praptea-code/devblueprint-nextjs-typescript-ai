import ReflectBackground from "@/components/originkit/ui/reflect-background-custom-style";

export default function BackgroundLayer() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block"
    >
      <ReflectBackground style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
