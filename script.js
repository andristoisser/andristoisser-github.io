async function fetchTrendingPosts() {
  const searchQuery = 'cancel culture';
  const limit = 100;
  const timeRange = '1w'; // Restrict search to last 3 weeks

  const response = await fetch(`https://www.reddit.com/search.json?q=${searchQuery}&sort=top&t=${timeRange}&limit=${limit}`);
  const data = await response.json();

  // Process the posts
  const titles = data.data.children.map(post => post.data.title);
  const combinedText = titles.join(' '); // Combine titles into one long text

  const doc = nlp(combinedText); // Create a compromise.js document
  let names = doc.people().out('array'); // Extract names from the document

  // Filter out punctuation and text after it in names (except for names starting with "Dr.")
  names = names.map(name => {
    if (!name.startsWith('Dr.')) {
      return name.replace(/[^a-zA-Z\s].*$/, '');
    }
    return name;
  });

  const uniqueNames = [...new Set(names)]; // Remove duplicates using Set
  const randomNames = getRandomElements(uniqueNames, 4); // Get 4 random names

  console.log('Random Names:', randomNames);
  console.log('Modified Names:');
  console.log(`Name 1: ${randomNames[0]} (Modified: ${modifyName(randomNames[0])})`);
  console.log(`Name 2: ${randomNames[1]} (Modified: ${modifyName(randomNames[1])})`);
  console.log(`Name 3: ${randomNames[2]} (Modified: ${modifyName(randomNames[2])})`);
  console.log(`Name 4: ${randomNames[3]} (Modified: ${modifyName(randomNames[3])})`);

  // Display the names with their modified values
  const modifiedName1Element = document.getElementById('modified-name1');
  modifiedName1Element.textContent = `#${modifyName(randomNames[0])}`;

  const modifiedName2Element = document.getElementById('modified-name2');
  modifiedName2Element.textContent = `#${modifyName(randomNames[1])}`;

  const modifiedName3Element = document.getElementById('modified-name3');
  modifiedName3Element.textContent = `#${modifyName(randomNames[2])}`;

  const modifiedName4Element = document.getElementById('modified-name4');
  modifiedName4Element.textContent = `#${modifyName(randomNames[3])}`;

    const modifiedName5Element = document.getElementById('modified-name5');
  modifiedName5Element.textContent = 'Rammstein';

      const modifiedName6Element = document.getElementById('modified-name6');
  modifiedName6Element.textContent = 'Budlight';


// Attach click event listeners to the modified name elements after populating them
modifiedName1Element.addEventListener('click', () => {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = `cancel ${modifyName(randomNames[0])}`;
  handleHashtagChange(); // Fetch new posts when a modified name is clicked
});

modifiedName2Element.addEventListener('click', () => {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = `cancel ${modifyName(randomNames[1])}`;
  handleHashtagChange(); // Fetch new posts when a modified name is clicked
});

modifiedName3Element.addEventListener('click', () => {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = `cancel ${modifyName(randomNames[2])}`;
  handleHashtagChange(); // Fetch new posts when a modified name is clicked
});

modifiedName4Element.addEventListener('click', () => {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = `cancel ${modifyName(randomNames[3])}`;
  handleHashtagChange(); // Fetch new posts when a modified name is clicked
});

modifiedName5Element.addEventListener('click', () => {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = `cancel Rammstein`;
  handleHashtagChange(); // Fetch new posts when a modified name is clicked
});

modifiedName6Element.addEventListener('click', () => {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = `cancel Budlight`;
  handleHashtagChange(); // Fetch new posts when a modified name is clicked
});

}


// Rest of the code...

// Helper function to modify the name
function modifyName(name) {
  const splitName = name.split(' ');
  const modifiedName = splitName.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return modifiedName;
}

// Helper function to get random elements from an array
function getRandomElements(array, numElements) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numElements);
}

fetchTrendingPosts();







// CAREFUL //








let includeNSFW = true;
let includeUpvoteFilter = false;

let previousIncludeNSFW = false;
let previousIncludeUpvoteFilter = false;

let fetchedPostIds = []; // Track the IDs of already fetched posts

async function fetchPostsBySearchQuery(searchQuery, count) {
  try {
    let url = `https://www.reddit.com/search.json?q=${encodeURIComponent(searchQuery)}&limit=${count}&new`;

    // Add NSFW filter to the URL if includeNSFW is true
    if (includeNSFW) {
      url += '&include_over_18=on';
    }

    // Add Upvote filter to the URL if includeUpvoteFilter is true
    if (includeUpvoteFilter) {
      url += '&ups=100';
    }

    console.log('Sending request to URL:', url); // Log the URL

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts for search query: ${searchQuery}`);
    }

    const data = await response.json();
    console.log(`Fetched posts for search query ${searchQuery}:`, data);

    const posts = data.data.children ? data.data.children.map(child => child.data) : [];

    // Apply the NSFW and Upvote filters
    const filteredPosts = posts.filter(post => {
      if (includeNSFW) {
        return true; // Include all posts if NSFW filter is enabled
      }
      return !post.over_18; // Exclude NSFW posts if NSFW filter is disabled
    }).filter(post => {
      if (includeUpvoteFilter) {
        return post.ups > 500; // Only include posts with more than 500 upvotes if Upvote filter is enabled
      }
      return true; // Include all posts if Upvote filter is disabled
    });

    return filteredPosts;
  } catch (error) {
    console.log(`Error fetching posts for search query ${searchQuery}:`, error);
    return [];
  }
}

// Event listener for NSFW toggle
const nsfwToggle = document.getElementById('nsfw-toggle');
nsfwToggle.addEventListener('change', () => {
  includeNSFW = nsfwToggle.checked;
});

// Event listener for Upvote filter toggle
const upvoteToggle = document.getElementById('high-upvotes-toggle');
upvoteToggle.addEventListener('change', () => {
  includeUpvoteFilter = upvoteToggle.checked;
});





let postsArray = [];
let alreadyShownPosts = [];
let currentSearchQuery = 'cancel&culture';
let previousSearchQuery = '';
let isPaused = false;

function createPostElement(post) {
  // Create the post container
  const postElement = document.createElement('div');
  postElement.classList.add('post');

  // Create the raw post data element with typewriter animation
  const rawPostDataElement = document.createElement('pre');
  rawPostDataElement.classList.add('typewriter');
  rawPostDataElement.textContent = JSON.stringify(post, null, 2);

  // Append elements to the post container
  postElement.appendChild(rawPostDataElement);

  // Add click event listener to the post element
  postElement.addEventListener('click', () => {
    rawPostDataDiv.innerHTML = `<pre>${JSON.stringify(post, null, 2)}</pre>`;
  });

  return postElement;
}

function createContentDisplay(post) {
  // Get the content display container
  const contentDisplay = document.getElementById('content-display');

  // Remove the existing post element
  const existingPostElement = contentDisplay.querySelector('.post');
  if (existingPostElement) {
    existingPostElement.remove();
  }

  // Create the post element
  const postElement = createPostElement(post);

  // Append the new post element to the content display
  contentDisplay.appendChild(postElement);
}

function updatePostInfo(post) {
  // Get the post info container
  const postInfoContainer = document.getElementById('post-info');

  // Create the post info element
  const postInfoElement = document.createElement('div');
  postInfoElement.classList.add('post-info');

  // Create the time element
  const timeElement = document.createElement('div');
  timeElement.classList.add('post-info-cell');
  timeElement.classList.add('time');
  timeElement.textContent = `${new Date().toLocaleTimeString()}`;

  // Create the author element
  const authorElement = document.createElement('div');
  authorElement.classList.add('post-info-cell');
  authorElement.classList.add('author');
  authorElement.textContent = `u/${post.author}`;

  // Create the title element
  const titleElement = document.createElement('div');
  titleElement.classList.add('post-info-cell');
  titleElement.classList.add('title');
  titleElement.textContent = post.title;

// Create the post link
const postLink = document.createElement('a');
postLink.classList.add('post-info-cell');
postLink.classList.add('link');
postLink.href = `https://www.reddit.com${post.permalink}`;
postLink.textContent = 'View Post'; // Set the link text
postLink.target = '_blank'; // Open link in a new tab

  // Add class for the most bottom post
  if (post === postsArray[postsArray.length - 1]) {
    postInfoElement.classList.add('most-bottom-post');
  }

  // Append elements to the post info container
  postInfoElement.appendChild(timeElement);
  postInfoElement.appendChild(authorElement);
  postInfoElement.appendChild(titleElement);
  postInfoElement.appendChild(postLink); // Append the post link

  // Insert the post info element at the beginning of the post info container
  postInfoContainer.insertBefore(postInfoElement, postInfoContainer.firstChild);
}



async function displayPostInformation(post) {
  const displayedInfoElement = document.getElementById('displayed_information');
  displayedInfoElement.innerHTML = ''; // Clear previous content

  // Create elements for different post information
  const titleElement = document.createElement('h2');
  titleElement.textContent = post.title;

  const scoreElement = document.createElement('p');
  scoreElement.textContent = `Score: ${post.score}`;

  const upvoteRatioElement = document.createElement('p');
  upvoteRatioElement.textContent = `Upvote/Downvote Ratio: ${post.upvote_ratio}`;

  const highestRatedCommentElement = document.createElement('p');
  highestRatedCommentElement.textContent = 'Fetching highest rated comment...';

  const lowestRatedCommentElement = document.createElement('p');
  lowestRatedCommentElement.textContent = 'Fetching lowest rated comment...';

  const commentCountElement = document.createElement('p');
  commentCountElement.textContent = `Number of Comments: ${post.num_comments}`;

  // Append elements to the displayed_information element
  displayedInfoElement.appendChild(titleElement);
  displayedInfoElement.appendChild(scoreElement);
  displayedInfoElement.appendChild(upvoteRatioElement);
  displayedInfoElement.appendChild(highestRatedCommentElement);
  displayedInfoElement.appendChild(lowestRatedCommentElement);
  displayedInfoElement.appendChild(commentCountElement);

  // Fetch comments for the current post
  const comments = await fetchPostComments(post.id);
  if (comments.length > 0) {
    // Find the highest and lowest rated comments
    const highestRatedComment = comments.reduce((prev, curr) => (curr.score > prev.score ? curr : prev));
    const lowestRatedComment = comments.reduce((prev, curr) => (curr.score < prev.score ? curr : prev));

    highestRatedCommentElement.textContent = `Highest Rated Comment: ${highestRatedComment.body}`;
    lowestRatedCommentElement.textContent = `Lowest Rated Comment: ${lowestRatedComment.body}`;
  } else {
    highestRatedCommentElement.textContent = 'No comments available';
    lowestRatedCommentElement.textContent = 'No comments available';
  }
}

async function fetchPostComments(postId) {
  try {
    const response = await fetch(`https://www.reddit.com/comments/${postId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post: ${postId}`);
    }
    const data = await response.json();
    // The comments are available in the second index of the response array
    return data[1] && data[1].data ? data[1].data.children.map(child => child.data) : [];
  } catch (error) {
    console.log(`Error fetching comments for post: ${postId}`, error);
    return [];
  }
}

function displayPost(post) {
  console.log('Displaying post:', post);

  // Create the post element
  const postElement = createPostElement(post);

  // Update the post info
  updatePostInfo(post);

  // Replace the existing post element in "content-display" with the new post element
  const contentDisplay= document.getElementById('content-display');
  contentDisplay.innerHTML = ''; // Clear previous content
  contentDisplay.appendChild(postElement);
}

let requestInterval;
const fetchInterval = 15000; // Interval in milliseconds

async function fetchAndStorePosts() {
  const count = 60;
  const newPosts = await fetchPostsBySearchQuery(currentSearchQuery, count);
  console.log(`Fetched posts for search query ${currentSearchQuery}:`, newPosts);

  if (newPosts.length === 0) {
    console.log('No posts fetched.');
    isPaused = true;
    console.log('Pausing fetchAndStorePosts');
    return;
  }

  // Clear the postArray if search query has changed
  if (currentSearchQuery !== previousSearchQuery) {
    console.log('Search query changed. Clearing postArray...');
    postsArray = [];
    previousSearchQuery = currentSearchQuery;
  }

  // Check if there are new posts that haven't been shown yet
  const unseenPosts = newPosts.filter(post => !alreadyShownPosts.includes(post));
  postsArray.push(...unseenPosts);

  console.log('Posts array:', postsArray);
  console.log('Already shown posts:', alreadyShownPosts);
  console.log('Post count:', postsArray.length);
  console.log('Already shown count:', alreadyShownPosts.length);

  displayRandomPost();
  isPaused = false;
}

function displayRandomPost() {
  console.log('Displaying random post');

  if (postsArray.length === 0) {
    console.log('No more posts to display');
    isPaused = true; // Pause the function if both arrays are empty
    console.log('Pausing displayRandomPost');
    return;
  }

  let post;

  const randomIndex = Math.floor(Math.random() * postsArray.length);
  post = postsArray[randomIndex];
  postsArray.splice(randomIndex, 1); // Remove the post from postsArray
  alreadyShownPosts.push(post); // Move the post to alreadyShownPosts

  displayPostInformation(post);
  displayPost(post);

  // Log the content of the arrays
  console.log('Posts Array:', postsArray);
  console.log('Already Shown Posts:', alreadyShownPosts);
}

const hashtagInput = document.getElementById('hashtag-input');

let typingTimer;
const doneTypingInterval = 3000; // 3 seconds

function handleHashtagChange() {
  clearTimeout(typingTimer);
  console.log('Clearing postArray');
  typingTimer = setTimeout(() => {
    const newSearchQuery = hashtagInput.value.trim().toLowerCase();
    currentSearchQuery = newSearchQuery;
    postsArray = [];
    isPaused = false;
    fetchAndStorePosts(); // Fetch and store new posts based on the updated search query
  }, doneTypingInterval);
}


// Add event listeners to the checkboxes
nsfwToggle.addEventListener('change', handleToggleNSFW);
upvoteToggle.addEventListener('change', handleToggleUpvote);

// Function to handle toggling the NSFW filter
function handleToggleNSFW() {
  console.log('Toggling NSFW filter');
  includeNSFW = !includeNSFW; // Toggle the includeNSFW flag

  // Clear the postArray
  console.log('Clearing postArray');
  postsArray = [];

  // Fetch and store new posts based on the current search query
}

// Function to handle toggling the Upvote filter
function handleToggleUpvote() {
  console.log('Toggling Upvote filter');
  includeUpvoteFilter = !includeUpvoteFilter; // Toggle the includeUpvoteFilter flag

  // Clear the postArray
  console.log('Clearing postArray');
  postsArray = [];

  // Fetch and store new posts based on the current search query
}

hashtagInput.addEventListener('input', handleHashtagChange);

fetchAndStorePosts();
requestInterval = setInterval(fetchAndStorePosts, fetchInterval);


function downloadPostsAsJSON() {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
  const fileName = `CancelTheCulture_Archive_${currentDate}_${currentTime}.json`;

  const jsonContent = JSON.stringify(alreadyShownPosts, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up the temporary link element
  URL.revokeObjectURL(link.href);
}


// Attach click event listener to the archive button
const archiveButton = document.getElementById('archive-button');
archiveButton.addEventListener('click', downloadPostsAsJSON);
