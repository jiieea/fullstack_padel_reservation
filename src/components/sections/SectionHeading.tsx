export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="sec-h">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
