document.addEventListener('DOMContentLoaded', () => {
    loadingScreen.style.display = 'flex'; // Show loading screen
    preloadAllAssets();
});

let preloadPromises = [];
const links = document.querySelectorAll('link[rel="stylesheet"]');
const images = document.querySelectorAll('img');
const videos = document.querySelectorAll('video');
let totalAssets = links.length + images.length + videos.length;
let assetsLoaded = 0;

const loadingBar = document.getElementById('loadingBar');
const loadingScreen = document.getElementById('loadingScreen');
const pageContent = document.getElementById('pageContent');

const updateTotalAssets = () => {
    totalAssets = links.length + images.length + videos.length;
};

function preloadImage(img) {
    console.log(`Attempting to preload image: ${img.src}`); // Log the attempt to preload
    return new Promise((resolve) => {
        if (img.complete) {
            console.log(`Image already loaded: ${img.src}`);
            resolve();
        } else {
            img.onload = () => {
                console.log(`Image loaded: ${img.src}`);
                resolve();
            };
            img.onerror = () => {
                console.error(`Error loading image: ${img.src}`);
                resolve(); // Resolve even on error
            };
        }
    });
}

function preloadVideo(video) {
    console.log(`Attempting to preload video: ${video.src}`); // Log the attempt to preload
    return new Promise((resolve) => {
        if (video.readyState >= 3) { // Video can play without buffering
            console.log(`Video already loaded: ${video.src}`);
            resolve();
        } else {
            video.onloadeddata = () => {
                console.log(`Video loaded: ${video.src}`);
                resolve();
            };
            video.onerror = () => {
                console.error(`Error loading video: ${video.src}`);
                resolve(); // Resolve even on error
            };

            // Fallback timeout if onloadeddata doesn't trigger
            setTimeout(() => {
                if (video.readyState < 3) { // Check again if not loaded
                    console.warn(`Video load fallback for: ${video.src}`);
                    resolve();
                }
            }, 3000); // Adjust timeout as needed
        }
    });
}



function preloadLink(link) {
    console.log(`Attempting to preload link: ${link.href}`); // Log the attempt to preload
    return new Promise((resolve) => {
        const newLink = document.createElement('link');
        newLink.href = link.href;
        newLink.rel = link.rel;
        newLink.onload = () => {
            console.log(`CSS loaded: ${link.href}`);
            resolve();
        };
        newLink.onerror = () => {
            console.error(`Error loading CSS: ${link.href}`);
            resolve();
        };
        document.head.appendChild(newLink);
    });
}

function updateLoadingBar() {
    assetsLoaded++;
    const progress = Math.min((assetsLoaded / totalAssets) * 100, 100);

    loadingBar.style.width = `${progress}%`;
    console.log(`Progress: ${progress}%`); // Log progress
}

function preloadAllAssets() {
    console.log(`Total assets to load: ${totalAssets}`);

    images.forEach((img) => preloadPromises.push(preloadImage(img).then(updateLoadingBar)));
    videos.forEach((video) => preloadPromises.push(preloadVideo(video).then(updateLoadingBar)));
    links.forEach((link) => preloadPromises.push(preloadLink(link).then(updateLoadingBar)));

    Promise.all(preloadPromises).then(() => {
        assetsLoaded = totalAssets;
        loadingBar.style.width = '100%';
        loadingScreen.style.display = 'none';
        pageContent.style.opacity = '1';
        pageContent.style.position = 'relative';
        console.log("All assets for this page preloaded.");
    });
    
}
