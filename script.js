let currentIndex = 1; // Start on second tile (Blog)
const carousel = document.getElementById('carousel');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const counter = document.getElementById('counter');

let blogPosts = [];
let currentView = 'list';
let isMobile = window.innerWidth <= 768;

// Update mobile status on resize
window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    updateCarousel();
});

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
        if (!response.ok) {
            console.error('Failed to load index.json:', response.status);
            blogPosts = [];
            return;
        }
        const files = await response.json();
        console.log('Found blog post files:', files);
        
        const posts = await Promise.all(
            files.map(async (filename) => {
                try {
                    const res = await fetch(`blog-posts/${filename}`);
                    if (!res.ok) {
                        console.error(`Failed to load ${filename}:`, res.status);
                        return null;
                    }
                    const markdown = await res.text();
                    console.log(`Loaded ${filename}:`, markdown.substring(0, 100));
                    return parseMarkdownPost(markdown, filename);
                } catch (err) {
                    console.error(`Error loading ${filename}:`, err);
                    return null;
                }
            })
        );
        
        blogPosts = posts.filter(p => p !== null).sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log('Processed blog posts:', blogPosts);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPosts = [];
    }
}

// Parse markdown with front matter
function parseMarkdownPost(markdown, filename) {
    const lines = markdown.split('\n');
    let frontMatter = {};
    let contentStart = 0;
    
    // Check for front matter (--- at start)
    if (lines[0].trim() === '---') {
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                contentStart = i + 1;
                break;
            }
            const line = lines[i].trim();
            if (line) {
                const colonIndex = line.indexOf(':');
                if (colonIndex > -1) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    frontMatter[key] = value;
                }
            }
        }
    }
    
    const content = lines.slice(contentStart).join('\n').trim();
    
    // Extract title from first # heading if not in front matter
    let title = frontMatter.title || frontMatter.Title;
    if (!title) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
    }
    
    // Get date - try multiple formats
    let date = frontMatter.date || frontMatter.Date || 'No date';
    
    // Get excerpt
    let excerpt = frontMatter.excerpt || frontMatter.Excerpt;
    if (!excerpt) {
        // Remove markdown headers and get first 200 chars
        const cleanContent = content.replace(/^#+\s+/gm, '').replace(/[*_`]/g, '').trim();
        excerpt = cleanContent.substring(0, 200) + '...';
    }
    
    console.log(`Parsed ${filename}:`, { title, date, excerpt: excerpt.substring(0, 50) });
    
    return {
        title: title,
        date: date,
        slug: filename.replace('.md', ''),
        content: content,
        excerpt: excerpt
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
    return `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>My Projects</h1>
        
        <div class="project-card">
            <h2>High-Performance Ray Tracer</h2>
            <p>Custom C++ ray tracer with SIMD optimizations and multi-threading. Achieved 10x performance improvement over baseline implementation.</p>
            <div class="project-gallery">
                <div class="project-image">🖼️</div>
                ${!isMobile ? '<div class="project-image">🖼️</div><div class="project-image">🖼️</div>' : ''}
            </div>
            <p><a href="https://github.com/yourusername/raytracer" target="_blank">View on GitHub →</a></p>
        </div>
        
        <div class="project-card">
            <h2>Memory Allocator</h2>
            <p>Custom memory allocator implementing pool allocation and slab allocation strategies for game engines.</p>
            <div class="project-gallery">
                <div class="project-image">🖼️</div>
                ${!isMobile ? '<div class="project-image">🖼️</div><div class="project-image">🖼️</div>' : ''}
            </div>
            <p><a href="https://github.com/yourusername/allocator" target="_blank">View on GitHub →</a></p>
        </div>
        
        <div class="project-card">
            <h2>Physics Engine</h2>
            <p>2D rigid body physics engine with collision detection and resolution. Used in multiple game jam projects.</p>
            <div class="project-gallery">
                <div class="project-image">🖼️</div>
                ${!isMobile ? '<div class="project-image">🖼️</div><div class="project-image">🖼️</div>' : ''}
            </div>
            <p><a href="https://github.com/yourusername/physics" target="_blank">View on GitHub →</a></p>
        </div>
    `;
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
    return `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>Resume</h1>
        <h2>Education</h2>
        <p><strong>B.S. Computer Science</strong> - University Name<br>Expected Graduation: 2026<br>GPA: 3.8/4.0</p>
        
        <h2 style="margin-top: 30px;">Technical Skills</h2>
        <p>C++17/20, Python, SIMD, Multi-threading, OpenGL, Vulkan, CMake, Git, Linux</p>
        
        <h2 style="margin-top: 30px;">Experience</h2>
        <div class="blog-post">
            <h3>Performance Engineering Intern - Company Name</h3>
            <p>Optimized rendering pipeline, reducing frame time by 30% through profiling and targeted optimizations.</p>
        </div>
        
        <p style="margin-top: 30px;"><a href="/path/to/resume.pdf" download>Download Full Resume (PDF) →</a></p>
    `;
}

function renderAbout() {
    return `
        <button class="close-btn" onclick="closeModal()">×</button>
        <h1>About Me</h1>
        <p style="font-size: 1.1rem; line-height: 1.8;">
            I'm a Computer Science student passionate about performance engineering and systems programming. 
            I love working close to the metal, optimizing code, and building high-performance applications in C++.
        </p>
        <p style="font-size: 1.1rem; line-height: 1.8; margin-top: 20px;">
            When I'm not coding, you can find me playing games (hence the Xbox theme!), reading about 
            computer architecture, or working on my latest game engine project.
        </p>
        <h2 style="margin-top: 30px;">Contact</h2>
        <p>Email: <a href="mailto:your.email@example.com">your.email@example.com</a></p>
        <p>GitHub: <a href="https://github.com/yourusername" target="_blank">@yourusername</a></p>
        <p>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank">Your Name</a></p>
    `;
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

// Mouse hover only for desktop
let hoverTimeout = null;
if (!('ontouchstart' in window)) {
    carousel.addEventListener('mousemove', (e) => {
        if (isMobile) return; // Skip on mobile
        
        const tiles = carousel.querySelectorAll('.tile');
        let hoveredIndex = -1;
        let maxZIndex = -1;
        
        tiles.forEach((tile, index) => {
            const rect = tile.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
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
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
            
            hoverTimeout = setTimeout(() => {
                currentIndex = hoveredIndex;
                updateCarousel();
            }, 200);
        }
    });
}

function updateCarousel() {
    const tileElements = carousel.querySelectorAll('.tile');
    const total = tileElements.length;
    
    // Adjust spacing based on screen size
    const spacing = isMobile ? 240 : 450;
    
    tileElements.forEach((tile, index) => {
        const offset = index - currentIndex;
        const absOffset = Math.abs(offset);
        
        let x = offset * spacing;
        let z = -absOffset * (isMobile ? 100 : 200);
        let scale = 1 - (absOffset * (isMobile ? 0.25 : 0.15));
        let opacity = 1 - (absOffset * 0.4);
        
        // Hide tiles that are too far away
        if (absOffset > 1 && isMobile) {
            opacity = 0;
            scale = 0.5;
        } else if (absOffset > 2) {
            opacity = 0;
        }
        
        tile.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        tile.style.opacity = opacity;
        tile.style.zIndex = 100 - absOffset;
        tile.style.pointerEvents = absOffset <= 1 ? 'auto' : 'none';
    });
    
    counter.textContent = `${currentIndex + 1} of ${total}`;
}

function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = tiles.length - 1;
    if (currentIndex >= tiles.length) currentIndex = 0;
    updateCarousel();
}

async function openModal(index) {
    currentView = 'list';
    
    // Prevent body scroll on mobile when modal is open
    document.body.style.overflow = 'hidden';
    
    modal.classList.add('active', 'syncing');
    modalContent.innerHTML = '<div class="sync-spinner"></div>';
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const content = await renderContent(tiles[index].type);
    modalContent.innerHTML = content;
    modal.classList.remove('syncing');
}

function closeModal() {
    modal.classList.remove('active');
    currentView = 'list';
    
    // Re-enable body scroll
    document.body.style.overflow = 'hidden'; // Keep hidden since body uses overflow: hidden
}

// Keyboard controls
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

// Close modal when clicking backdrop
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        if (currentView === 'post') {
            backToBlogList();
        } else {
            closeModal();
        }
    }
});

// Touch/swipe controls for carousel
let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
}, { passive: true });

carousel.addEventListener('touchmove', (e) => {
    touchMoved = true;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    if (!touchMoved) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only trigger if horizontal swipe is more significant than vertical
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        navigate(diffX > 0 ? 1 : -1);
    }
});

// Touch controls for modal
let modalTouchStartY = 0;
modal.addEventListener('touchstart', (e) => {
    modalTouchStartY = e.touches[0].clientY;
}, { passive: true });

// Prevent pull-to-refresh on mobile
let lastTouchY = 0;
document.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDelta = touchY - lastTouchY;
    
    // Prevent pull to refresh at top of page
    if (window.scrollY === 0 && touchDelta > 0) {
        e.preventDefault();
    }
    
    lastTouchY = touchY;
}, { passive: false });

// Initialize
loadBlogPosts().then(() => {
    createTiles();
});