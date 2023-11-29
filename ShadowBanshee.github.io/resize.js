//bansheesection
// Get the container and set its height based on the aspect ratio of the background image
const BansheeSection = document.getElementsByClassName('BansheeSection')[0];

function setBansheeContainerHeight() {
    const imgWidth = 600; // Replace with your actual image width
    const imgHeight = 467; // Replace with your actual image height
  
    // Calculate the aspect ratio based on the original image dimensions
    const aspectRatio = imgWidth / imgHeight;
  
    const containerWidth = BansheeSection.clientWidth;
    const containerHeight = containerWidth / aspectRatio;
  
    // Set the aspect ratio in the style
    BansheeSection.style.paddingBottom = `${1 / aspectRatio * 100}%`;

    console.log(`Banshee Container Width: ${containerWidth}, Container Height: ${containerHeight}`);
}

// Call the function initially and on window resize
setBansheeContainerHeight();
window.addEventListener('resize', setBansheeContainerHeight);

//superkid
// Get the container and set its height based on the aspect ratio of the background image
const SuperKidSection = document.getElementsByClassName('SuperKidSection')[0];

function setSuperKidContainerHeight() {
    const imgWidth = 600; // Replace with your actual image width
    const imgHeight = 469; // Replace with your actual image height
  
    // Calculate the aspect ratio based on the original image dimensions
    const aspectRatio = imgWidth / imgHeight;
  
    const containerWidth = SuperKidSection.clientWidth;
    const containerHeight = containerWidth / aspectRatio;
  
    // Set the aspect ratio in the style
    SuperKidSection.style.paddingBottom = `${1 / aspectRatio * 100}%`;

    console.log(`SuperKid Container Width: ${containerWidth}, Container Height: ${containerHeight}`);
}

// Call the function initially and on window resize
setSuperKidContainerHeight();
window.addEventListener('resize', setSuperKidContainerHeight);
