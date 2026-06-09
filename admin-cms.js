// Intrinsic Value CMS & Blog Manager Engine
// Persists inline text/image edits and custom blogs to localStorage.

(function() {
    // Current page path resolution (e.g. index.html, about-us.html)
    function getCurrentPageName() {
        let path = window.location.pathname;
        let page = path.substring(path.lastIndexOf('/') + 1);
        if (page === '' || page === '/') {
            return 'index.html';
        }
        return page;
    }

    const currentPage = getCurrentPageName();
    let isEditMode = false;
    let pendingTextChanges = {};
    let pendingImageChanges = {};

    // DOM path generator to uniquely identify any element on static HTML
    function getDOMPath(el) {
        if (!(el instanceof Element)) return null;
        const path = [];
        let currentEl = el;
        while (currentEl.nodeType === Node.ELEMENT_NODE) {
            let selector = currentEl.nodeName.toLowerCase();
            if (currentEl.id) {
                selector += '#' + currentEl.id;
                path.unshift(selector);
                break;
            } else {
                let sib = currentEl, sibCount = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == currentEl.nodeName.toLowerCase()) {
                        sibCount++;
                    }
                }
                selector += `:nth-of-type(${sibCount})`;
            }
            path.unshift(selector);
            currentEl = currentEl.parentNode;
        }
        return path.join(' > ');
    }

    // Apply saved text and image edits on page load
    function applySavedEdits() {
        const textEdits = JSON.parse(localStorage.getItem('pageTextEdits') || '{}');
        const imgEdits = JSON.parse(localStorage.getItem('pageImageEdits') || '{}');

        // Apply text edits
        if (textEdits[currentPage]) {
            Object.keys(textEdits[currentPage]).forEach(path => {
                const el = document.querySelector(path);
                if (el) {
                    el.innerHTML = textEdits[currentPage][path];
                }
            });
        }

        // Apply image edits
        if (imgEdits[currentPage]) {
            Object.keys(imgEdits[currentPage]).forEach(path => {
                const el = document.querySelector(path);
                if (el && el.tagName.toLowerCase() === 'img') {
                    el.src = imgEdits[currentPage][path];
                }
            });
        }
    }

    // Load and render custom blogs if we are on the blog listing page
    function renderCustomBlogs() {
        if (currentPage !== 'blog.html') return;

        const blogContainer = document.querySelector('ul.post_list_ul');
        if (!blogContainer) return;

        const blogs = JSON.parse(localStorage.getItem('customBlogs') || '[]');
        if (blogs.length === 0) return;

        blogs.forEach(blog => {
            const blogItem = document.createElement('li');
            blogItem.id = `custom-post-${blog.id}`;
            blogItem.className = 'stm_post_info post type-post status-publish format-standard has-post-thumbnail hentry';
            blogItem.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
            blogItem.style.paddingBottom = '30px';
            blogItem.style.marginBottom = '30px';

            blogItem.innerHTML = `
                <h4 class="stripe_2" style="color:#001040 !important;">${escapeHtml(blog.title)}</h4>
                <div class="stm_post_details clearfix">
                    <ul class="clearfix" style="list-style: none; margin: 0; padding: 0; display: flex; gap: 15px; font-size: 13px; color: #5f96ee;">
                        <li class="post_date">
                            <i class="fa fa-clock-o" style="margin-right: 5px;"></i>${blog.date}
                        </li>
                        <li class="post_by"><i class="fa fa-user" style="margin-right: 5px;"></i>Posted by: <span>Intrinsic Value</span></li>
                        <li class="post_cat"><i class="fa fa-folder-open" style="margin-right: 5px;"></i>Category: <span>${escapeHtml(blog.category)}</span></li>
                    </ul>
                </div>
                <div class="post_thumbnail" style="margin-top: 15px; margin-bottom: 15px; overflow: hidden; border-radius: 8px;">
                    <img width="1110" height="550" src="${blog.image}" class="wp-post-image" alt="Blog Header" style="width: 100%; height: auto; max-height: 450px; object-fit: cover;">
                </div>
                <div class="post_excerpt" style="font-size: 14px; line-height: 1.6; color: #001040; margin-bottom: 15px;">
                    ${escapeHtml(blog.content.substring(0, 180))}...
                </div>
                <div class="post_read_more">
                    <a class="button bordered icon_right custom-blog-read-more" href="blog-detail.html?id=${blog.id}" style="background-color: #D4AF37 !important; border-color: #D4AF37 !important; color: #fff !important; padding: 8px 20px; font-size: 13px; font-weight: 500; border-radius: 4px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
                        read more <i class="fa fa-chevron-right"></i>
                    </a>
                </div>
            `;

            // Prepend custom blog to the top of the feed
            blogContainer.insertBefore(blogItem, blogContainer.firstChild);
        });
    }

    // Load blog detail dynamically on blog-detail.html
    function loadBlogDetail() {
        if (currentPage !== 'blog-detail.html') return;

        const urlParams = new URLSearchParams(window.location.search);
        const blogId = urlParams.get('id');

        if (!blogId) {
            window.location.href = 'blog.html';
            return;
        }

        const blogs = JSON.parse(localStorage.getItem('customBlogs') || '[]');
        const blog = blogs.find(b => b.id === blogId);

        if (!blog) {
            const container = document.querySelector('.custom-blog-detail-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 50px 20px;">
                        <h2 style="color: #001040; margin-bottom: 20px; font-family:'Poppins', sans-serif;">Blog post not found.</h2>
                        <a href="blog.html" class="button" style="background: #D4AF37; color: #001040; padding: 10px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; font-family:'Poppins', sans-serif;">Back to Blogs</a>
                    </div>`;
            }
            return;
        }

        // Set Title, Metadata, Image
        const titleEl = document.getElementById('blog-title');
        const breadcrumbTitleEl = document.getElementById('breadcrumb-blog-title');
        const dateEl = document.getElementById('blog-date');
        const categoryEl = document.getElementById('blog-category');
        const imageEl = document.getElementById('blog-image');
        const bodyEl = document.getElementById('blog-body');

        if (titleEl) titleEl.innerText = blog.title;
        if (breadcrumbTitleEl) breadcrumbTitleEl.innerText = blog.title;
        if (dateEl) dateEl.innerText = blog.date;
        if (categoryEl) categoryEl.innerText = blog.category;
        if (imageEl) imageEl.src = blog.image;

        // Inject content paragraphs
        if (bodyEl) {
            bodyEl.innerHTML = '';
            blog.content.split('\n\n').forEach(para => {
                if (!para.trim()) return;
                const p = document.createElement('p');
                p.className = 'blog-body-para';
                p.style.marginBottom = '20px';
                p.style.color = '#001040';
                p.style.lineHeight = '1.8';
                p.style.fontSize = '16px';
                p.style.fontFamily = "'Poppins', sans-serif";
                p.innerText = para.trim();
                bodyEl.appendChild(p);
            });
        }
    }

    // Injects floating edit control bar for logged in administrators
    function injectAdminBar() {
        if (localStorage.getItem('adminSession') !== 'true') return;

        // Check if bar is already injected
        if (document.getElementById('admin-cms-floating-bar')) return;

        // Check if URL has ?editMode=true
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('editMode') === 'true') {
            isEditMode = true;
        }

        const bar = document.createElement('div');
        bar.id = 'admin-cms-floating-bar';
        bar.style.position = 'fixed';
        bar.style.bottom = '20px';
        bar.style.right = '20px';
        bar.style.backgroundColor = '#0B1C3D';
        bar.style.border = '1.5px solid #D4AF37';
        bar.style.borderRadius = '12px';
        bar.style.padding = '12px 20px';
        bar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        bar.style.zIndex = '999999';
        bar.style.display = 'flex';
        bar.style.alignItems = 'center';
        bar.style.gap = '15px';
        bar.style.color = '#ffffff';
        bar.style.fontFamily = "'Poppins', sans-serif";
        bar.style.fontSize = '13px';

        bar.innerHTML = `
            <div style="font-weight: 600; color: #D4AF37; display: flex; align-items: center; gap: 8px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00d084; animation: blink 1.5s infinite;"></span>
                CMS Mode
            </div>
            <div style="width: 1px; height: 20px; background: rgba(255,255,255,0.15);"></div>
            <button id="cms-btn-toggle-edit" style="background: ${isEditMode ? '#00d084' : 'rgba(255,255,255,0.1)'}; color: #ffffff; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                <i class="fa fa-edit"></i> Edit Mode: ${isEditMode ? 'ON' : 'OFF'}
            </button>
            <button id="cms-btn-save" style="background: rgba(212,175,55,0.3); color: #abb8c3; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: not-allowed;" disabled>
                <i class="fa fa-save"></i> Save Page
            </button>
            <a href="admin-dashboard.html" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #ffffff; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-weight: 500; transition: border-color 0.3s;">
                <i class="fa fa-dashboard"></i> Portal
            </a>
            
            <style>
                @keyframes blink {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                #admin-cms-floating-bar button:hover {
                    transform: translateY(-1px);
                }
            </style>
        `;

        document.body.appendChild(bar);

        // Bind events
        document.getElementById('cms-btn-toggle-edit').addEventListener('click', toggleEditMode);
        document.getElementById('cms-btn-save').addEventListener('click', savePageChanges);

        if (isEditMode) {
            enableInlineEdits();
        }
    }

    // Toggle inline editing state
    function toggleEditMode() {
        isEditMode = !isEditMode;
        const btn = document.getElementById('cms-btn-toggle-edit');
        if (isEditMode) {
            btn.style.backgroundColor = '#00d084';
            btn.innerText = 'Edit Mode: ON';
            enableInlineEdits();
            showNotice("Edit Mode ON. Click any text to edit. Hover images to swap.");
        } else {
            btn.style.backgroundColor = 'rgba(255,255,255,0.1)';
            btn.innerText = 'Edit Mode: OFF';
            disableInlineEdits();
            showNotice("Edit Mode OFF. Unsaved changes are preserved in memory.");
        }
    }

    // Enable contenteditable on text nodes and hover icons on images
    function enableInlineEdits() {
        // Find text elements: headings, paragraphs, lists, cell items, buttons
        const editableSelectors = 'h1, h2, h3, h4, h5, h6, p, span, li, td, th, strong, em, button, label, a';
        document.querySelectorAll(editableSelectors).forEach(el => {
            // Avoid editing floating bar itself
            if (el.closest('#admin-cms-floating-bar')) return;

            el.setAttribute('contenteditable', 'true');
            el.style.outline = '1.5px dashed rgba(212, 175, 55, 0.4)';
            el.style.cursor = 'text';

            // Prevent default clicks on links and buttons in edit mode so page doesn't reload
            el.addEventListener('click', blockAction);
            el.addEventListener('blur', handleTextBlur);
        });

        // Setup image swapping hover buttons
        document.querySelectorAll('img').forEach(img => {
            if (img.closest('#admin-cms-floating-bar')) return;

            // Make parent position relative so we can place floating swap icon
            const parent = img.parentElement;
            if (parent && getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            img.style.outline = '1.5px dashed rgba(212, 175, 55, 0.4)';
            img.style.cursor = 'pointer';

            // Create image overlay button
            const swapBtn = document.createElement('button');
            swapBtn.className = 'img-swap-badge';
            swapBtn.innerHTML = '<i class="fa fa-camera"></i> Swap';
            swapBtn.style.position = 'absolute';
            swapBtn.style.top = '10px';
            swapBtn.style.right = '10px';
            swapBtn.style.backgroundColor = '#0B1C3D';
            swapBtn.style.border = '1px solid #D4AF37';
            swapBtn.style.borderRadius = '4px';
            swapBtn.style.color = '#ffffff';
            swapBtn.style.fontSize = '11px';
            swapBtn.style.padding = '4px 8px';
            swapBtn.style.cursor = 'pointer';
            swapBtn.style.zIndex = '9999';
            swapBtn.style.fontFamily = "'Poppins', sans-serif";

            // Bind click to file selector
            swapBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerImageSwap(img);
            });

            // Put button next to or inside parent
            if (parent) {
                parent.appendChild(swapBtn);
            }
        });
    }

    function blockAction(e) {
        if (isEditMode) {
            e.preventDefault();
        }
    }

    function disableInlineEdits() {
        const editableSelectors = 'h1, h2, h3, h4, h5, h6, p, span, li, td, th, strong, em, button, label, a';
        document.querySelectorAll(editableSelectors).forEach(el => {
            if (el.closest('#admin-cms-floating-bar')) return;

            el.removeAttribute('contenteditable');
            el.style.outline = '';
            el.style.cursor = '';
            el.removeEventListener('click', blockAction);
            el.removeEventListener('blur', handleTextBlur);
        });

        // Remove swap buttons
        document.querySelectorAll('.img-swap-badge').forEach(badge => badge.remove());
        document.querySelectorAll('img').forEach(img => {
            img.style.outline = '';
            img.style.cursor = '';
        });
    }

    // Monitor text elements when admin finishes editing
    function handleTextBlur(e) {
        const el = e.target;
        const path = getDOMPath(el);
        if (!path) return;

        // Capture innerHTML (preserves links, bold tags, etc.)
        const content = el.innerHTML;
        pendingTextChanges[path] = content;

        markPageDirty();
    }

    // File trigger for image replacement
    function triggerImageSwap(imgEl) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Compress using HTML5 Canvas to keep within LocalStorage limits
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_SIZE = 800;
                    if (width > MAX_SIZE || height > MAX_SIZE) {
                        if (width > height) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        } else {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);

                    // Apply immediately in DOM
                    imgEl.src = compressedBase64;

                    // Log in pending list
                    const path = getDOMPath(imgEl);
                    if (path) {
                        pendingImageChanges[path] = compressedBase64;
                        markPageDirty();
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };
        fileInput.click();
    }

    function markPageDirty() {
        const saveBtn = document.getElementById('cms-btn-save');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.style.backgroundColor = '#D4AF37';
            saveBtn.style.color = '#0B1C3D';
            saveBtn.style.cursor = 'pointer';
        }
    }

    // Save modifications to localStorage
    function savePageChanges() {
        if (currentPage === 'blog-detail.html') {
            // Save updates directly to the custom blog entry database model
            const urlParams = new URLSearchParams(window.location.search);
            const blogId = urlParams.get('id');
            if (blogId) {
                const blogs = JSON.parse(localStorage.getItem('customBlogs') || '[]');
                const blogIdx = blogs.findIndex(b => b.id === blogId);
                if (blogIdx !== -1) {
                    const titleEl = document.getElementById('blog-title');
                    const categoryEl = document.getElementById('blog-category');
                    const imageEl = document.getElementById('blog-image');
                    const bodyEl = document.getElementById('blog-body');
                    
                    if (titleEl) blogs[blogIdx].title = titleEl.innerText.trim();
                    if (categoryEl) blogs[blogIdx].category = categoryEl.innerText.trim();
                    if (imageEl) blogs[blogIdx].image = imageEl.src;
                    
                    if (bodyEl) {
                        const paras = [];
                        bodyEl.querySelectorAll('.blog-body-para').forEach(p => {
                            paras.push(p.innerText.trim());
                        });
                        blogs[blogIdx].content = paras.join('\n\n');
                    }
                    
                    localStorage.setItem('customBlogs', JSON.stringify(blogs));
                }
            }
        } else {
            // Save texts for normal static page elements
            const textEdits = JSON.parse(localStorage.getItem('pageTextEdits') || '{}');
            if (!textEdits[currentPage]) {
                textEdits[currentPage] = {};
            }
            Object.keys(pendingTextChanges).forEach(path => {
                textEdits[currentPage][path] = pendingTextChanges[path];
            });
            localStorage.setItem('pageTextEdits', JSON.stringify(textEdits));

            // Save images for normal static page elements
            const imgEdits = JSON.parse(localStorage.getItem('pageImageEdits') || '{}');
            if (!imgEdits[currentPage]) {
                imgEdits[currentPage] = {};
            }
            Object.keys(pendingImageChanges).forEach(path => {
                imgEdits[currentPage][path] = pendingImageChanges[path];
            });
            localStorage.setItem('pageImageEdits', JSON.stringify(imgEdits));
        }

        // Reset memory variables
        pendingTextChanges = {};
        pendingImageChanges = {};

        // Disable Save button
        const saveBtn = document.getElementById('cms-btn-save');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor = 'rgba(212,175,55,0.3)';
            saveBtn.style.color = '#abb8c3';
            saveBtn.style.cursor = 'not-allowed';
        }

        showNotice("Page modifications saved successfully!");
    }

    // Notice toast overlay
    function showNotice(text) {
        let toast = document.getElementById('cms-notice-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cms-notice-toast';
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = '#0B1C3D';
            toast.style.color = '#ffffff';
            toast.style.border = '1px solid #D4AF37';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '6px';
            toast.style.zIndex = '9999999';
            toast.style.fontSize = '13px';
            toast.style.fontFamily = "'Poppins', sans-serif";
            toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            toast.style.transition = 'all 0.3s ease';
            document.body.appendChild(toast);
        }

        toast.innerText = text;
        toast.style.opacity = '1';
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // General Helpers
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Startup Init
    document.addEventListener('DOMContentLoaded', () => {
        loadBlogDetail();
        applySavedEdits();
        renderCustomBlogs();
        injectAdminBar();
    });

})();
