export default function Hero() {
  return (
    <section className="pt-20 md:pt-32 pb-20 md:pb-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-dark-900 dark:to-dark-800">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
              Welcome to my portfolio
            </span>
          </div>

          {/* Heading */}
          <h1 className="section-heading text-5xl md:text-6xl lg:text-7xl text-balance mb-6">
            Full-Stack Developer & Creator
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 text-balance mb-8 leading-relaxed">
            I build beautiful, functional web applications that solve real problems. 
            Specializing in modern technologies and best practices.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="btn-primary">
              View My Work
            </button>
            <a
              href="/resume.pdf"
              download
              className="btn-outline"
            >
              Download Resume
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-300 dark:border-gray-700">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
                50+
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Projects Completed
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
                30+
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Happy Clients
              </p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
                5+
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Years Experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
