async function fetchTrendingPosts() {
  const searchQuery = 'cancel culture';
  const limit = 100;
  const timeRange = '3w'; // Restrict search to last 3 weeks

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
  const randomNames = getRandomElements(uniqueNames, 3); // Get 3 random names

  console.log('Random Names:', randomNames);
  console.log('Modified Names:');
  console.log(`Name 1: ${randomNames[0]} (Modified: ${modifyName(randomNames[0])})`);
  console.log(`Name 2: ${randomNames[1]} (Modified: ${modifyName(randomNames[1])})`);
  console.log(`Name 3: ${randomNames[2]} (Modified: ${modifyName(randomNames[2])})`);

  // Display the names with their modified values
  const modifiedName1Element = document.getElementById('modified-name1');
  modifiedName1Element.textContent = `#${modifyName(randomNames[0])}`;

  const modifiedName2Element = document.getElementById('modified-name2');
  modifiedName2Element.textContent = `#${modifyName(randomNames[1])}`;

  const modifiedName3Element = document.getElementById('modified-name3');
  modifiedName3Element.textContent = `#${modifyName(randomNames[2])}`;

// Attach click event listeners to the modified name elements
modifiedName1Element.addEventListener('click', () => {
  const modifiedName = modifyName(randomNames[0]);
  updateHashtagInput(modifiedName);
});

modifiedName2Element.addEventListener('click', () => {
  const modifiedName = modifyName(randomNames[1]);
  updateHashtagInput(modifiedName);
});

modifiedName3Element.addEventListener('click', () => {
  const modifiedName = modifyName(randomNames[2]);
  updateHashtagInput(modifiedName);
});

function updateHashtagInput(modifiedName) {
  const hashtagInput = document.getElementById('hashtag-input');
  hashtagInput.value = modifiedName;
  handleHashtagChange();
}



// Helper function to modify the name
function modifyName(name) {
  const splitName = name.split(' ');
  const modifiedName = splitName.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  return modifiedName;
}

// Helperfunction to get random elements from an array
function getRandomElements(array, numElements) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numElements);
}

fetchTrendingPosts();
