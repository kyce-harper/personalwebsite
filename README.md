# Xbox 360 Style Portfolio

A retro Xbox 360-inspired portfolio website with automatic blog post loading from markdown files.

## 🎮 Features

- Xbox 360 dashboard UI with carousel navigation
- Automatic blog post loading from markdown files
- Keyboard navigation (Arrow keys, Enter, Escape)
- Touch/swipe support for mobile
- Markdown support with front matter
- Fully static - works on GitHub Pages

## 📁 File Structure

```
your-repo/
├── index.html
├── style.css
├── script.js
├── blog-posts/
│   ├── index.json
│   ├── 2025-12-05-cache-optimization.md
│   ├── 2025-11-28-systems-programming.md
│   └── 2025-11-15-game-jam.md
└── README.md
```

## 🚀 Setup for GitHub Pages

1. Create a new repository named `yourusername.github.io`
2. Clone it locally
3. Add all the files from this project
4. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial portfolio"
   git push origin main
   ```
5. Your site will be live at `https://yourusername.github.io`

## ✍️ Adding Blog Posts

### Quick Method (Just Add Markdown!)

1. Create a new `.md` file in the `blog-posts/` folder
2. Name it with the date: `YYYY-MM-DD-post-title.md`
3. Add it to `blog-posts/index.json`
4. Push to GitHub - done!

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