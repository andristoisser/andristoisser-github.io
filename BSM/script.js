document.addEventListener("DOMContentLoaded", function() {
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    const video1 = document.getElementById("background-video");
    const video2 = document.getElementById("background-video2");
    const header = document.querySelector(".page-header");
    const arrow = document.querySelector(".arrow-container");
    const content = document.querySelector(".content");
    const enterCircle = document.getElementById("initial-overlay");

    // Initially hide the second video, header, and content
    video2.style.display = "none";
    header.style.opacity = 0;
    arrow.style.opacity = 0;
    content.style.opacity = 0;

    // Function to start video playback and hide the "Enter" circle
    function startVideo() {
        video1.pause();
        video1.style.opacity = 1; // Fade in the first video
        enterCircle.style.display = "none"; // Hide the "Enter" circle
    }

    // Add a click event listener to the document to start video on user click
    document.addEventListener("click", function() {
        startVideo();
        video1.play();

        // Show the header, arrow, and content after the first video has finished playing
        video1.addEventListener("ended", function() {
            header.style.opacity = 1;
            arrow.style.opacity = 1;
            content.style.opacity = 1;

            // Hide the first video and show the second video
            video1.style.display = "none";
            video2.style.display = "block";

            // Fade in the second video
            video2.style.opacity = 1;
            video2.play();

            setTimeout(function() {
                video1.style.opacity = 0; // Fade out the first video
            }, 4000); // Set a delay before fading out the first video
        });
    });
});
