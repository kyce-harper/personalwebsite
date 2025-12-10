# My Portfolio - Xbox 360 Style

A responsive, Xbox-themed portfolio website featuring projects, blog, resume, and about sections. All content is easily editable via JSON files.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Off-canvas Mobile Navigation**: Hamburger menu for smaller screens.
- **Dynamic Content**: Projects, blog posts, resume, and about info loaded from JSON files.
- **Minimal Animations**: Xbox-inspired swirl transitions and subtle tile motion.
- **Background Swirl**: Blurred white decorative swirl element.
- **Accessibility**: Respects `prefers-reduced-motion` for users who prefer reduced animations.
- **GitHub Pages Ready**: Automatic deployment via GitHub Actions.

## Project Structure

```
.
├── index.html                           # Main HTML file
├── style.css                            # Styling
├── script.js                            # JavaScript logic
├── projects.json                        # Projects data
├── about.json                           # About section data
├── resume.json                          # Resume section data
├── blog-posts/                          # Markdown blog posts
│   ├── index.json                       # List of blog post filenames
│   └── *.md                             # Individual blog posts
├── .github/workflows/deploy.yml         # GitHub Actions deployment config
├── .gitignore                           # Git ignore rules
└── README.md                            # This file
```

## Editing Content

### Projects
Edit `projects.json` and add entries with:
- `title` (string)
- `description` (string)
- `image` (path to image; optional)
- `link` (URL to project; optional)

### Blog Posts
Add `.md` files to `blog-posts/` with YAML front matter:
```markdown
---
title: My Blog Post
date: 2025-12-09
excerpt: Short description
---
# Content here...
```
Then update `blog-posts/index.json` with the new filename.

### About Section
Edit `about.json`:
- `bio` (main biography text)
- `bio2` (additional bio text)
- `contact` (array of contact info with `label`, `value`, `href`)

### Resume Section
Edit `resume.json`:
- `education` (array with `degree`, `school`, `graduation`, `gpa`)
- `skills` (string of comma-separated skills)
- `experience` (array with `title`, `company`, `description`)
- `resumeLink` (path to PDF)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/personalwebsite.git
cd personalwebsite
```

2. Serve locally:
```bash
python3 -m http.server 8000
```

3. Open http://localhost:8000 in your browser.

## GitHub Pages Deployment

### Initial Setup (One Time)

1. **Create a new GitHub repository**:
   - Go to https://github.com/new
   - Name it `personalwebsite` (or any name you prefer)
   - Choose "Public" (required for free GitHub Pages)
   - Do NOT initialize with README/gitignore

2. **Push your local repo to GitHub**:
```bash
cd /Users/kyceharper/Documents/personalwebsite
git remote add origin https://github.com/yourusername/personalwebsite.git
git branch -M main
git add .
git commit -m "Initial commit: portfolio site"
git push -u origin main
```

3. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Build and deployment"
   - Source: select **"Deploy from a branch"**
   - Branch: select `gh-pages` (created by Actions)
   - Folder: `/ (root)` 
   - Click **Save**

4. **Wait for the first deployment**:
   - Go to **Actions** tab
   - Watch the `Deploy to GitHub Pages` workflow run
   - Once complete, your site is live at:
   - `https://yourusername.github.io/personalwebsite`

### Making Changes

After initial setup, just edit files and push:
```bash
# Make changes to any file (e.g., projects.json, about.json, etc.)
git add .
git commit -m "Update projects section"
git push
```

The GitHub Actions workflow will automatically:
1. Detect the push to `main`
2. Deploy your site to the `gh-pages` branch
3. Update your live site within ~30 seconds

### Troubleshooting Deployment

- **Check Actions**: Go to repo → **Actions** tab → see workflow logs
- **Pages not updating**: Make sure `gh-pages` branch is selected in Pages settings
- **Custom domain**: In Pages settings, add your domain in "Custom domain" field

## Customization

- **Colors**: Edit the gradient and accent colors in `style.css`
- **Animations**: Adjust durations and easing in the `@keyframes` sections
- **Header**: Update `dashboard-title` and `user-info` in `index.html`
- **Avatar/Gamertag**: Edit the emoji and text in the avatar section
- **Background swirl**: Modify the SVG in `index.html` or adjust opacity in `style.css`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tips for Success

1. **Keep it simple**: JSON files are easier to maintain than code changes
2. **Use descriptive names**: For projects, use clear titles (users will see them)
3. **Test locally first**: Use `python3 -m http.server 8000` before pushing
4. **Check Actions logs**: If something looks wrong, Actions → workflow logs will tell you why
5. **Use branches for big changes**: Create a feature branch for major updates, merge with PR

## License

This project is open source and available under the MIT License.
### Blog Post Format

Each blog post should have front matter at the top:

```markdown
---
title: Your Post Title
date: December 9, 2025
excerpt: A short description that appears in the list view
---

# Your Post Title

Your content here in markdown...

## Subheading

More content with **bold** and *italic* text.

```cpp
// Code blocks work too!
int main() {
    return 0;
}
```
```

### Front Matter Fields

- `title` - Post title (optional - will extract from first # heading if missing)
- `date` - Display date (optional - shows "No date" if missing)
- `excerpt` - Short preview text (optional - auto-generates from content if missing)

## 🎨 Customization

### Edit Your Info

In `index.html`, update:
- Dashboard title
- User info subtitle

In `script.js`, update the content functions:
- `renderProjects()` - Your projects
- `renderResume()` - Your resume
- `renderAbout()` - Your about page with contact info

### Change Colors

Edit `style.css` - all the Xbox green colors are defined there.

### Add More Tiles

In `script.js`, add new items to the `tiles` array:
```javascript
{
    title: 'Contact',
    subtitle: 'Get in Touch',
    icon: '📧',
    type: 'contact'
}
```

Then create a `renderContact()` function.

## ⌨️ Keyboard Controls

- **Arrow Left/Right** or **A/D** - Navigate tiles
- **Enter** or **Space** - Select tile
- **Escape** or **B** - Go back
- **Click** - Also works!

## 🔧 Local Development

Just open `index.html` in a browser! No build step needed.

For blog posts to load locally, you'll need a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

Then visit `http://localhost:8000`

## 📝 Tips

- Keep blog post filenames descriptive: `2025-12-09-my-cool-post.md`
- Posts are sorted by date (newest first)
- Markdown supports code blocks, headings, links, lists, etc.
- The excerpt is auto-generated if you don't provide one
- Remember to update `index.json` when adding new posts!

## 🐛 Troubleshooting

**Blog posts not loading?**
- Check that `blog-posts/index.json` lists all your files
- Make sure file names in `index.json` match exactly (including `.md`)
- Open browser console (F12) to see any error messages

**Tiles not showing?**
- Make sure all 4 files are in the same directory
- Check browser console for JavaScript errors

**Need help?**
- Open an issue on GitHub
- Check that all files are uploaded correctly

## 📄 License

Feel free to use this for your own portfolio! No attribution required (but appreciated).

---

Built with ❤️ and nostalgia for the Xbox 360 era