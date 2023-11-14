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
    header.style.opacity = 1;
    arrow.style.opacity = 0;
    content.style.opacity = 0;
    document.body.style.overflow = "hidden"; // Enable scrolling

    // Function to start video playback and hide the "Enter" circle
    function startVideo() {
        video1.pause();
        video1.style.opacity = 1; // Fade in the first video
        enterCircle.style.display = "none"; // Hide the "Enter" circle
        document.body.style.overflow = "auto"; // Enable scrolling
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

    // Smooth scrolling for internal anchor links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector(".page-header").offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
