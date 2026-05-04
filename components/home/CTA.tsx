export default function CTA() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-900 dark:to-secondary-900">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center text-white">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to Work Together?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed text-balance">
            I&apos;m always interested in hearing about new projects and opportunities. 
            Let&apos;s build something amazing together.
          </p>

          {/* Email Highlight */}
          <div className="mb-10">
            <p className="text-sm opacity-75 mb-2">Get in touch</p>
            <a
              href="mailto:hello@example.com"
              className="text-2xl md:text-3xl font-bold hover:opacity-80 transition-opacity"
            >
              hello@example.com
            </a>
          </div>

          {/* CTA Button */}
          <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
            Send Me an Email
          </button>

          {/* Social Links */}
          <div className="mt-12 flex justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all text-xl"
              aria-label="GitHub"
            >
              🐙
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all text-xl"
              aria-label="LinkedIn"
            >
              💼
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all text-xl"
              aria-label="Twitter"
            >
              𝕏
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
