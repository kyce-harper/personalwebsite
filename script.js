let currentIndex = 1; // Start on second tile (Blog)
const carousel = document.getElementById('carousel');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const counter = document.getElementById('counter');

let blogPosts = [];
let projects = [];
let aboutData = {};
let resumeData = {};
let currentView = 'list';

const tiles = [
    {
        title: 'Projects',
        subtitle: 'My Work',
        icon: '🎮',
        type: 'projects'
    },
    {
        title: 'Blog',
        subtitle: 'Thoughts & Updates',
        icon: '📝',
        type: 'blog'
    },
    {
        title: 'Resume',
        subtitle: 'Experience & Skills',
        icon: '📄',
        type: 'resume'
    },
    {
        title: 'About',
        subtitle: 'Who I Am',
        icon: '👤',
        type: 'about'
    }
];

// Load all blog posts from blog-posts folder
async function loadBlogPosts() {
    try {
        const response = await fetch('blog-posts/index.json');
        const files = await response.json();
        
        const posts = await Promise.all(
            files.map(async (filename) => {
                const res = await fetch(`blog-posts/${filename}`);
                const markdown = await res.text();
                return parseMarkdownPost(markdown, filename);
            })
        );
        
        blogPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPosts = [];
    }
}

// Load projects from projects.json for easy editing
async function loadProjects() {
    try {
        const res = await fetch('projects.json');
        projects = await res.json();
    } catch (err) {
        console.warn('projects.json not found or invalid, using fallback projects', err);
        projects = [];
    }
}

// Load about data from about.json
async function loadAbout() {
    try {
        const res = await fetch('about.json');
        aboutData = await res.json();
    } catch (err) {
        console.warn('about.json not found, using defaults', err);
        aboutData = {};
    }
}

// Load resume data from resume.json
async function loadResume() {
    try {
        const res = await fetch('resume.json');
        resumeData = await res.json();
    } catch (err) {
        console.warn('resume.json not found, using defaults', err);
        resumeData = {};
    }
}

// Parse markdown with front matter
function parseMarkdownPost(markdown, filename) {
    const lines = markdown.split('\n');
    let inFrontMatter = false;
    let frontMatter = {};
    let contentStart = 0;
    
    // Check for front matter (--- at start)
    if (lines[0].trim() === '---') {
        inFrontMatter = true;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                contentStart = i + 1;
                break;
            }
            const [key, ...value] = lines[i].split(':');
            if (key && value.length) {
                frontMatter[key.trim()] = value.join(':').trim();
            }
        }
    }
    
    const content = lines.slice(contentStart).join('\n');
    
    // Extract title from first # heading if not in front matter
    let title = frontMatter.title;
    if (!title) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
    }
    
    return {
        title: title,
        date: frontMatter.date || 'No date',
        slug: filename.replace('.md', ''),
        content: content,
        excerpt: frontMatter.excerpt || content.substring(0, 200).replace(/#/g, '').trim() + '...'
    };
}

// Render content based on tile type
async function renderContent(type) {
    switch(type) {
        case 'projects':
            return renderProjects();
        case 'blog':
            return renderBlog();
        case 'resume':
            return renderResume();
        case 'about':
            return renderAbout();
    }
}

function renderProjects() {
    const list = projects && projects.length ? projects : [];

    let html = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>My Projects</h1>
    `;

    if (list.length === 0) {
        html += `<p>No projects found. Add entries to <code>projects.json</code>.</p>`;
        return html;
    }

    list.forEach(p => {
        html += `
            <div class="project-card">
                <h2>${p.title}</h2>
                <p>${p.description}</p>
                <div class="project-gallery">
                    <div class="project-image" style="background-image: url('${p.image}'); background-size: cover; background-position: center;"></div>
                </div>
                ${p.link ? `<p><a href="${p.link}" target="_blank">View Project →</a></p>` : ''}
            </div>
        `;
    });

    return html;
}

function renderBlog() {
    if (blogPosts.length === 0) {
        return `
            <button class="close-btn" onclick="closeModal()">×</button>
            <h1>Blog Posts</h1>
            <p>No blog posts found. Add .md files to the blog-posts folder!</p>
        `;
    }
    
    let html = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>Blog Posts</h1>
    `;
    
    blogPosts.forEach((post, index) => {
        html += `
            <div class="blog-post" onclick="showBlogPost(${index})">
                <div class="blog-date">${post.date}</div>
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
            </div>
        `;
    });
    
    return html;
}

function renderResume() {
    const edu = resumeData.education ? resumeData.education[0] : {};
    const exp = resumeData.experience || [];
    const skills = resumeData.skills || '';
    const pdfLink = resumeData.resumeLink || '/path/to/resume.pdf';

    let html = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>Resume</h1>
        <h2>Education</h2>
    `;

    if (edu.degree) {
        html += `<p><strong>${edu.degree}</strong> - ${edu.school}<br>${edu.graduation}<br>${edu.gpa}</p>`;
    }

    if (skills) {
        html += `
            <h2 style="margin-top: 30px;">Technical Skills</h2>
            <p>${skills}</p>
        `;
    }

    if (exp.length > 0) {
        html += `<h2 style="margin-top: 30px;">Experience</h2>`;
        exp.forEach(e => {
            html += `
                <div class="blog-post">
                    <h3>${e.title} - ${e.company}</h3>
                    <p>${e.description}</p>
                </div>
            `;
        });
    }

    html += `<p style="margin-top: 30px;"><a href="${pdfLink}" download>Download Full Resume (PDF) →</a></p>`;
    return html;
}

function renderAbout() {
    const bio = aboutData.bio || '';
    const bio2 = aboutData.bio2 || '';
    const contacts = aboutData.contact || [];

    let html = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>About Me</h1>
    `;

    if (bio) {
        html += `<p style="font-size: 1.1rem; line-height: 1.8;">${bio}</p>`;
    }
    if (bio2) {
        html += `<p style="font-size: 1.1rem; line-height: 1.8; margin-top: 20px;">${bio2}</p>`;
    }

    if (contacts.length > 0) {
        html += `<h2 style="margin-top: 30px;">Contact</h2>`;
        contacts.forEach(c => {
            html += `<p>${c.label}: <a href="${c.href}" target="_blank">${c.value}</a></p>`;
        });
    }

    return html;
}

function showBlogPost(index) {
    const post = blogPosts[index];
    currentView = 'post';
    
    const htmlContent = marked.parse(post.content);
    
    modalContent.innerHTML = `
        <button class="close-btn" onclick="closeModal()">×</button>
        <div class="back-to-list" onclick="backToBlogList()">← Back to Blog List</div>
        <div class="blog-full-content">
            <div class="blog-date">${post.date}</div>
            ${htmlContent}
        </div>
    `;
}

function backToBlogList() {
    currentView = 'list';
    openModal(1); // Blog is index 1
}

function createTiles() {
    carousel.innerHTML = '';
    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile';
        div.setAttribute('data-index', index);
        div.innerHTML = `
            <div class="tile-icon">${tile.icon}</div>
            <div class="tile-title">${tile.title}</div>
            <div class="tile-subtitle">${tile.subtitle}</div>
        `;
        div.onclick = () => openModal(index);
        carousel.appendChild(div);
    });
    updateCarousel();
}

// Add mouse move detection on the carousel container with debounce
let hoverTimeout = null;
carousel.addEventListener('mousemove', (e) => {
    const tiles = carousel.querySelectorAll('.tile');
    let hoveredIndex = -1;
    let maxZIndex = -1;
    
    tiles.forEach((tile, index) => {
        const rect = tile.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Check if mouse is over this tile
        if (mouseX >= rect.left && mouseX <= rect.right &&
            mouseY >= rect.top && mouseY <= rect.bottom) {
            const zIndex = parseInt(tile.style.zIndex) || 0;
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
                hoveredIndex = index;
            }
        }
    });
    
    if (hoveredIndex !== -1 && hoveredIndex !== currentIndex) {
        // Clear any existing timeout
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        
        // Set a delay before switching
        hoverTimeout = setTimeout(() => {
            currentIndex = hoveredIndex;
            updateCarousel();
        }, 200); // 200ms delay
    }
});

function updateCarousel() {
    const tileElements = carousel.querySelectorAll('.tile');
    const total = tileElements.length;

    // Compute spacing based on the tile width so spacing scales with viewport
    let baseSpacing = 450; // fallback
    if (tileElements.length > 0) {
        const rect = tileElements[0].getBoundingClientRect();
        baseSpacing = Math.round(rect.width + 30);
    }

    tileElements.forEach((tile, index) => {
        const offset = index - currentIndex;
        const absOffset = Math.abs(offset);

        const x = offset * baseSpacing;
        const z = -absOffset * 200;
        const scale = 1 - (absOffset * 0.15);
        let opacity = 1 - (absOffset * 0.3);

        if (absOffset > 2) {
            opacity = 0;
        }

        tile.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        tile.style.opacity = opacity;
        tile.style.zIndex = 100 - absOffset;
        tile.style.pointerEvents = 'auto'; // Ensure tiles can receive hover events
    });

    counter.textContent = `${currentIndex + 1} of ${total}`;
}

// add a brief swirl effect on tiles to make navigation feel lively
function triggerTileSwirl() {
    if (!carousel) return;
    carousel.classList.add('tile-swirling');
    clearTimeout(window._tileSwirlTimeout);
    window._tileSwirlTimeout = setTimeout(() => {
        carousel.classList.remove('tile-swirling');
    }, 120);
}

function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = tiles.length - 1;
    if (currentIndex >= tiles.length) currentIndex = 0;
    updateCarousel();
    // subtle swirl feedback when navigating
    triggerTileSwirl();
}

async function openModal(index) {
    currentView = 'list';
    
    // clear any closing state then add active + syncing which triggers the swirl
    modal.classList.remove('closing');
    modal.classList.add('active', 'syncing');

    // Wait very briefly for the entrance animation (kept minimal and snappy)
    await new Promise(resolve => setTimeout(resolve, 120));

    const content = await renderContent(tiles[index].type);
    modalContent.innerHTML = content;
    // remove syncing class immediately after content insertion
    setTimeout(() => modal.classList.remove('syncing'), 10);
}

function closeModal() {
    if (!modal.classList.contains('active')) return;

    // trigger closing animation, then hide after it finishes
    modal.classList.add('closing');
    modal.classList.remove('syncing');
    // wait for CSS closing animation duration to finish (kept minimal)
    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        currentView = 'list';
    }, 140);
}

document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
            if (currentView === 'post') {
                backToBlogList();
            } else {
                closeModal();
            }
        }
    } else {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            navigate(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            navigate(1);
        } else if (e.key === 'Enter' || e.key === ' ') {
            openModal(currentIndex);
        }
    }
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        if (currentView === 'post') {
            backToBlogList();
        } else {
            closeModal();
        }
    }
});

let touchStartX = 0;
carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

carousel.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        navigate(diff > 0 ? 1 : -1);
    }
});

// Initialize: load blog posts + projects + about + resume, then create tiles
Promise.all([loadBlogPosts(), loadProjects(), loadAbout(), loadResume()]).then(() => {
    createTiles();
    // Recompute carousel layout when the viewport changes
    window.addEventListener('resize', () => {
        // small debounce to avoid layout thrash
        clearTimeout(window._carouselResizeTimeout);
        window._carouselResizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 80);
    });
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');

    const navOverlay = document.getElementById('navOverlay');

    if (hamburger && mainNav) {
        // Ensure mainNav uses offcanvas class when on small screens
        function updateNavMode() {
            if (window.innerWidth <= 900) {
                mainNav.classList.add('offcanvas');
            } else {
                mainNav.classList.remove('offcanvas', 'open');
                if (navOverlay) navOverlay.classList.remove('visible');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }

        updateNavMode();

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const opened = mainNav.classList.toggle('open');
            if (navOverlay) navOverlay.classList.toggle('visible', opened);
            hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

        // Close nav when clicking outside or tapping overlay
        window.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    if (navOverlay) navOverlay.classList.remove('visible');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                mainNav.classList.remove('open');
                navOverlay.classList.remove('visible');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        }

        // Ensure nav mode updates on resize
        window.addEventListener('resize', () => {
            updateNavMode();
        });
    }
});