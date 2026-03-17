# KidsToys Landing Page

A colorful and engaging single-page website for a children's toy store. The landing page showcases featured toys, store information, and contact details in a child-friendly design that appeals to both kids and parents.

## Project Overview

This is a static website focused on presenting the store's brand and key information to potential customers. The landing page features:

- Eye-catching hero section with store branding
- Featured toys showcase with product grid
- Store location and hours information
- Contact form and social media links
- Mobile-responsive design
- Modern animations and interactions

## Setup Instructions

### Local Development

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd proj_b4a-kidstoys-landing-page
   ```

2. Open the project in your preferred code editor

3. Launch the site:
   - **Option 1:** Open `index.html` directly in your web browser
   - **Option 2:** Use a local development server for better experience:
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js (http-server)
     npx http-server

     # Using PHP
     php -S localhost:8000
     ```

4. Visit `http://localhost:8000` in your browser

### No Build Process Required

This is a pure HTML/CSS/JavaScript project with no build step. All files run directly in the browser.

## File Structure

```
proj_b4a-kidstoys-landing-page/
├── index.html           # Main HTML structure
├── styles.css           # All styling and animations
├── main.js              # Interactive functionality
├── assets/              # Images and media files
│   └── images/
│       ├── hero-bg.jpg
│       ├── store-front.jpg
│       └── toys/
│           ├── toy-1.jpg
│           ├── toy-2.jpg
│           ├── toy-3.jpg
│           ├── toy-4.jpg
│           ├── toy-5.jpg
│           └── toy-6.jpg
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Customization Guide

### Updating Store Information

1. **Store Name and Tagline**
   - Edit the `<h1>` and tagline in the hero section of `index.html`

2. **Store Address and Hours**
   - Locate the store info section in `index.html`
   - Update address, phone number, and operating hours

3. **Featured Toys**
   - Replace toy images in `assets/images/toys/`
   - Update toy names and descriptions in the featured toys section
   - Maintain consistent image dimensions for best results

4. **Contact Information**
   - Update email address in the contact form action attribute
   - Modify social media links in the footer section

5. **Colors and Branding**
   - CSS custom properties (variables) are defined in `styles.css`
   - Modify the `:root` section to match your brand colors

### Adding New Sections

To add new content sections:
1. Add semantic HTML structure in `index.html`
2. Style the section in `styles.css`
3. Add any interactive behavior in `main.js`

## Deployment Instructions

### GitHub Pages

1. Push your code to a GitHub repository

2. Go to repository Settings → Pages

3. Under "Source", select the branch (usually `main`)

4. Click Save

5. Your site will be available at: `https://yourusername.github.io/proj_b4a-kidstoys-landing-page/`

### Other Hosting Options

This static site can be hosted on:
- **Netlify:** Drag and drop the project folder
- **Vercel:** Connect your GitHub repository
- **Cloudflare Pages:** Connect your repository
- **Traditional Web Hosting:** Upload files via FTP to your web host

## Browser Compatibility

This website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Modern CSS and JavaScript features are used with fallbacks for older browsers.

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- Responsive design for all screen sizes
- Respects prefers-reduced-motion for animations

## Contact Information

For website maintenance or updates, contact:
- Email: support@kidstoys.example.com
- Website: www.kidstoys.example.com

## License

This project is proprietary. All rights reserved.
