/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */

const characterContainer = document.getElementById('character-container');
const cardTemplate = document.getElementById('card-template');
const paginationContainer = document.getElementById('pagination-container');
const modal = document.getElementById('modal');
let localPage = 1;

/* ************************ */
/* CLOSE MODAL              */
/* ************************ */

const closeModal = () => {
    // Allow the page to scroll again.
    document.querySelector('body').style.overflow = 'visible';

    // Hide the modal.
    modal.classList.add('hidden');

    // Clear the modal contents.
    modal.innerHTML = '';
};

/* ************************ */
/* OPEN MODAL               */
/* params: image (string)   */
/* ************************ */

const openModal = image => {
    // Prevent page from scrolling under modal.
    document.querySelector('body').style.overflow = 'hidden';

    // Insert the image and close button.
    modal.innerHTML = `<img src='${image}' /><button id="close" class="button" onclick="closeModal()">CLOSE</button>`;

    // Reveal the modal.
    modal.classList.remove('hidden');
};

/* *************************** */
/* CREATE CHARACTER CARDS      */
/* params: characters (array)  */
/* *************************** */

const createCharacterCards = characters => {
    characters.forEach(character => {
        // Clone the contents of the card-template.
        const card = cardTemplate.content.cloneNode(true);

        // Insert the character name.
        card.querySelector('[data-name]').innerHTML = `<h2>${character.name}</h2>`;

        // Insert the character image.
        card.querySelector('img').src = character.image;

        // Add the character to the container.
        characterContainer.append(card);
    });

    // Find all of the cards.
    const items = document.querySelectorAll('.card');

    // Add a click event listener, and pass the image url to the modal.
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            openModal(characters[index].image);
        });
    });
};

/* ************************ */
/* RESET PAGE               */
/* ************************ */

const resetPage = () => {
    // Fetch new set of characters to display.
    fetchAllCharacters();

    // Scroll to the top of the page.
    window.scrollTo(0, 0);
};

/* ************************ */
/* CREATE PAGINATION        */
/* params: pages (object)   */
/* ************************ */

const createPagination = pages => {
    if (localPage > 1) {
        const previousButton = document.createElement('button');
        previousButton.innerHTML = 'PREV';
        previousButton.classList.add('button');
        previousButton.addEventListener('click', () => {
            localPage -= 1;
            resetPage();
        });
        paginationContainer.append(previousButton);
    }

    if (pages.next) {
        const nextButton = document.createElement('button');
        nextButton.innerHTML = 'NEXT';
        nextButton.classList.add('button');
        nextButton.addEventListener('click', () => {
            localPage += 1;
            resetPage();
        });
        paginationContainer.append(nextButton);
    }
};

// Determine if a number is even.
const isEven = num => num % 2 === 0;

// Determine which API page to fetch based on local page number.
const calculateApiPage = () => {
    if (localPage < 2) {
        return 1;
    }
    if (isEven(localPage)) {
        return localPage / 2;
    }
    return (localPage + 1) / 2;
};

const fetchAllCharacters = async () => {
    try {
        // API endpoint for all characters available.
        const url = `https://rickandmortyapi.com/api/character?page=${calculateApiPage()}`;

        // Fetch JSON promise.
        const result = await fetch(url);

        // Parse the JSON promise and deliver a Javascript object.
        const data = await result.json();

        // Reset the page.
        characterContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        // Create pagination.
        createPagination(data.info);

        // Call on the displayCharacter function to dynamically create cards.
        if (isEven(localPage)) {
            // If odd local page number, provide first 10 results.
            createCharacterCards(data.results.slice(10, 20));
        } else {
            // If even page number, provide last 10 results.
            createCharacterCards(data.results.slice(0, 10));
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Initialize the page with loading placeholders for slow connections.
for (let i = 0; i < 10; i++) {
    characterContainer.append(cardTemplate.content.cloneNode(true));
}

// Fetch all characters
fetchAllCharacters();
