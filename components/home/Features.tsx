export default function Features() {
  const features = [
    {
      id: 1,
      icon: '⚡',
      title: 'Performance',
      description: 'Built with cutting-edge technologies for blazing-fast load times and smooth interactions.',
    },
    {
      id: 2,
      icon: '🎨',
      title: 'Design',
      description: 'Beautiful, modern UI designs that provide excellent user experience across all devices.',
    },
    {
      id: 3,
      icon: '🔒',
      title: 'Security',
      description: 'Security-first approach with industry best practices and regular updates.',
    },
    {
      id: 4,
      icon: '📱',
      title: 'Responsive',
      description: 'Fully responsive designs that work perfectly on mobile, tablet, and desktop.',
    },
    {
      id: 5,
      icon: '🚀',
      title: 'Scalable',
      description: 'Architectured to grow with your needs, handling increased traffic and data.',
    },
    {
      id: 6,
      icon: '💡',
      title: 'Innovation',
      description: 'Always exploring new technologies and methodologies to stay ahead of the curve.',
    },
  ]

  return (
    <section id="skills" className="py-20 md:py-32 bg-white dark:bg-dark-900">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="section-heading">My Expertise</h2>
          <p className="section-subheading">
            I combine technical excellence with creative problem-solving
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="card group hover:border-primary-500">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Technologies I Use
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'React',
              'Next.js',
              'TypeScript',
              'Tailwind CSS',
              'Node.js',
              'MongoDB',
              'PostgreSQL',
              'Docker',
              'AWS',
              'Git',
              'GraphQL',
              'REST APIs',
            ].map((tech) => (
              <div
                key={tech}
                className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
