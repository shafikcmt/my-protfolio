# Personal Portfolio

A modern, responsive full-stack portfolio website built with Next.js 14, Tailwind CSS, and TypeScript.

## Features

- ✨ **Modern Design** - Clean and professional layout with dark mode support
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ⚡ **Next.js 14** - Latest framework with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid development
- 🔒 **TypeScript** - Type-safe development experience
- 🌙 **Dark Mode** - Built-in dark mode support
- 📊 **SEO Optimized** - Metadata and semantic HTML
- 🚀 **Fast Performance** - Optimized for Core Web Vitals

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout with Navbar and Footer
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation component
│   ├── Footer.tsx          # Footer component
│   └── home/
│       ├── Hero.tsx        # Hero section
│       ├── Features.tsx    # Features section
│       └── CTA.tsx         # Call-to-action section
├── lib/
│   └── theme.ts           # Theme configuration
├── public/                # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── next.config.js        # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Customization

### Update Your Information

- **Navbar**: Edit [components/Navbar.tsx](components/Navbar.tsx) to update navigation links
- **Hero Section**: Customize text in [components/home/Hero.tsx](components/home/Hero.tsx)
- **Features**: Modify skills and tech stack in [components/home/Features.tsx](components/home/Features.tsx)
- **Contact**: Update contact information in [components/home/CTA.tsx](components/home/CTA.tsx)
- **Metadata**: Edit metadata in [app/layout.tsx](app/layout.tsx)

### Styling

- Colors are defined in [tailwind.config.ts](tailwind.config.ts)
- Global styles are in [app/globals.css](app/globals.css)
- Component styles use Tailwind CSS utility classes

### Adding New Pages

Create new files in the `app/` directory following Next.js conventions:

```
app/
├── about/
│   └── page.tsx
├── projects/
│   └── page.tsx
└── blog/
    └── page.tsx
```

## Technologies Used

- **Next.js** - React framework
- **React** - UI library
- **TypeScript** - Programming language
- **Tailwind CSS** - CSS framework
- **ESLint** - Code quality tool

## Deployment

Deploy easily using platforms like:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS**
- **GitHub Pages**

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Support

For support, email hello@example.com or open an issue in the repository.

---

**Happy coding! 🚀**
