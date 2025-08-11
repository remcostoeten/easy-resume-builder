import Link from 'next/link';

export default function ShowcasePage() {
  const showcases = [
    {
      title: 'Theme Toggle Animations',
      description: 'Various animated theme toggle button styles and effects',
      href: '/showcase/theme-toggle-demo',
      tags: ['Animation', 'Theme', 'UI']
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Component Showcase</h1>
        <p className="text-muted-foreground">
          Explore various components, animations, and UI patterns
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showcases.map(function renderShowcase(showcase) {
          return (
            <Link
              key={showcase.href}
              href={showcase.href}
              className="block group"
            >
              <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {showcase.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {showcase.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {showcase.tags.map(function renderTag(tag) {
                    return (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-muted rounded-md"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
