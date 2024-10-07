// Collect all images, videos, and other assets (like CSS files if needed)
const images = document.querySelectorAll('img');
const videos = document.querySelectorAll('video');
const links = document.querySelectorAll('link[rel="stylesheet"]');
const totalAssets = images.length + videos.length + links.length;

// Ensure we preload all image and video assets
function preloadImage(img) {
    return new Promise((resolve, reject) => {
        if (img.complete) {
            resolve(); // Image already loaded
        } else {
            img.onload = () => {
                console.log(`Loaded image: ${img.src}`);
                resolve();
            };
            img.onerror = (e) => {
                console.error(`Failed to load image: ${img.src}`);
                resolve(); // Resolve even if there's an error, so it won't block
            };
        }
    });
}

function preloadVideo(video) {
    return new Promise((resolve, reject) => {
        video.onloadeddata = () => {
            console.log(`Loaded video: ${video.src}`);
            resolve();
        };
        video.onerror = (e) => {
            console.error(`Failed to load video: ${video.src}`);
            resolve(); // Resolve even if there's an error
        };
    });
}

function preloadLink(link) {
    return new Promise((resolve, reject) => {
        const newLink = document.createElement('link');
        newLink.href = link.href;
        newLink.rel = link.rel;
        newLink.onload = () => {
            console.log(`Loaded CSS: ${link.href}`);
            resolve();
        };
        newLink.onerror = (e) => {
            console.error(`Failed to load CSS: ${link.href}`);
            resolve(); // Resolve even if there's an error
        };
        document.head.appendChild(newLink); // Add it to the document
    });
}

function areAssetsLoaded() {
    // Check if all images and videos are already loaded (either cached or fully loaded)
    let allLoaded = true;

    images.forEach((img) => {
        if (!img.complete) {
            allLoaded = false;
        }
    });

    videos.forEach((video) => {
        if (video.readyState < 4) { // readyState 4 means "HAVE_ENOUGH_DATA"
            allLoaded = false;
        }
    });

    return allLoaded;
}

function preloadAllAssetsIfNeeded() {
    if (areAssetsLoaded()) {
        // Skip loading screen if all assets are already loaded
        console.log("Assets already loaded, skipping preload.");
        loadingScreen.style.display = 'none';
        pageContent.style.display = 'block';
    } else {
        // Proceed with preloading and showing loading bar
        console.log("Assets not fully loaded, showing loading screen.");
        preloadAllAssets();
    }
}

// Call this function when switching to a new page or on page load
window.addEventListener('load', () => {
    preloadAllAssetsIfNeeded();
});

// Preload all assets
function preloadAllAssets() {
    const preloadPromises = [];

    images.forEach((img) => {
        preloadPromises.push(preloadImage(img).then(updateLoadingBar));
    });

    videos.forEach((video) => {
        preloadPromises.push(preloadVideo(video).then(updateLoadingBar));
    });

    links.forEach((link) => {
        preloadPromises.push(preloadLink(link).then(updateLoadingBar));
    });

    return Promise.all(preloadPromises);
}

let assetsLoaded = 0;
const loadingBar = document.getElementById('loadingBar');
const loadingScreen = document.getElementById('loadingScreen');
const pageContent = document.getElementById('pageContent');

function updateLoadingBar() {
    assetsLoaded++;
    const progress = (assetsLoaded / totalAssets) * 100;
    loadingBar.style.width = progress + '%';

    console.log(`Progress: ${progress}%`);

    if (progress >= 100) {
        setTimeout(() => {
            console.log('All assets loaded, showing content.');
            loadingScreen.style.display = 'none';
            pageContent.style.display = 'block';
        }, 500);
    }
}

// On window load, trigger preloading of all assets
window.addEventListener('load', () => {
    if (totalAssets > 0) {
        preloadAllAssets().then(() => {
            console.log('All assets preloaded.');
            // Optionally scroll to a specific page/section
            const targetPage = document.querySelector('#page7'); // Example for specific page
            if (targetPage) {
                targetPage.scrollIntoView();
            }
        }).catch((err) => {
            console.error('Error during preloading:', err);
        });
    } else {
        // No assets found, show the content immediately
        console.log('No assets to preload, showing content immediately.');
        loadingScreen.style.display = 'none';
        pageContent.style.display = 'flex';
    }
});
