
/* *********************************** //
//                BOOK                 //
// *********************************** */

function Book(title, author, isbn, pages, read) {
    // Book constructor
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.pages = pages;
    this.read = read;
}

// Store user input as a new book object into myLibrary array and call displayBook functions to add to DOM
function addBookToLibrary(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const book = new Book(formData.get("title"), formData.get("author"), formData.get("isbn"), formData.get("pages"), formData.get("read")==="on" ? "yes" : "no");
    
    if(!isValidInput(book)) {
        alert("Error: Invalid - Book already exists or inputs do not adhere to validation rules.");
        return;
    }

    addBookToStorage(book);
    displayBookCarousel(book); // add to DOM Carousel
    displayBookTable(book); // add to DOM Table
    clearFields();
    alert("Book added successfully.");
}

// Validate inputs
function isValidInput(book) {
    const title_pattern = /['\.\*\^\(\)\/a-zA-Z0-9!@#&?%_\s-]{1,35}/;
    const author_pattern = /['a-zA-Z_\s-]{1,25}/;
    const isbn_pattern = /[0-9-]{1,20}/;
    const pages_pattern = /[0-9]{1,5}/;
    const myLibrary = getLibrary();
    const book_exists = myLibrary.reduce((prev, curr) => {
        if(prev || `${curr.isbn}` === `${book.isbn}`) {
            return true;
        } else return false;
    }, false);
    if(!book_exists && book.title.trim().match(title_pattern) && book.author.trim().match(author_pattern) && book.isbn.trim().match(isbn_pattern) && book.pages.trim().match(pages_pattern)) {
        return true;
    } else return false;
}

// Clear form input fields
function clearFields() {
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("isbn").value = '';
    document.getElementById("pages").value = '';
    document.getElementById("read").value = null;
}

// Remove book from myLibrary array and from DOM
function removeBookFromLibrary(event) {
    const isbn = event.target.value;
    const book_list_item = document.getElementById(`${isbn}`);
    const slides = book_list_item
        .closest("[data-carousel]")
        .querySelector("[data-slides]");
    book_list_item.remove();

    const book_row = document.getElementById(`row${isbn}`);
    book_row.remove();

    removeBookFromStorage(isbn);
    const myLibrary = getLibrary();

    if(myLibrary.length === 0) {
        slides.innerHTML = default_slides_innerHTML;
    }

    if(!slides.querySelector("[data-active]")) {
        slides.lastElementChild.dataset.active = true;
    }
}

// Toggle read status from unread to read or vice versa
function toggleReadStatus(isbn) {
    const myLibrary = getLibrary();
    const index = myLibrary.reduce((prev, curr, book_index) => {
        if(curr.isbn===isbn) {
            return book_index;
        } else return prev;
    }, -1);

    const readStatus = myLibrary[index].read;
    let newReadStatus;
    if(readStatus==="yes") newReadStatus = "no";
    if(readStatus==="no") newReadStatus = "yes";

    if(index!==-1) myLibrary[index].read = newReadStatus;
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));

    const readListItem = document.getElementById(`readcarousel${isbn}`);
    readListItem.innerHTML = `Read: ${newReadStatus}`;

    const readTableCell = document.getElementById(`readtable${isbn}`);
    readTableCell.innerHTML = `${newReadStatus}`
}

/* *********************************** //
//           DISPLAY LIBRARY           //
// *********************************** */

// Display myLibrary elements in carousel and table in DOM
function displayLibrary() {
    displayLibraryCarousel();
    displayLibraryTable(false); // isSearch = false
}

const default_slides_innerHTML = `
    <li class="default slide" data-active>
        <div class="page6"><h3>Click "Add Book" to add to your library</h3></div>
        <div class="page5">
            <p>Add books to get started</p>
            <p>You can export your list!</p>
            <p>Try importing an existing list!</p>
        </div> 
    </li>`;

// Reset carousel and display myLibrary elements in book carousel
function displayLibraryCarousel() {
    const slides = document.getElementById("book_slides");
    slides.innerHTML = "";

    const myLibrary = getLibrary();
    myLibrary.forEach((book) => {
        displayBookCarousel(book)
    });

    if(myLibrary.length === 0) {
        slides.innerHTML = default_slides_innerHTML;
    }
}

// Reset tbody and display myLibrary elements (or search_arr elements) in tbody in DOM
function displayLibraryTable(isSearch, search_arr=[]) {
    const tbody = document.getElementById("book_tbody");
    tbody.innerHTML = "";
    const table_title = document.getElementById("table_title");

    if(!isSearch) {
        table_title.innerHTML = "MyLibrary:";
        table_title.className = "lib_title";
        tbody.className = "book_tbody myLibrary_tbody";
        const myLibrary = getLibrary();
        myLibrary.forEach((book) => {
            displayBookTable(book, isSearch)
        });
    } else {
        table_title.innerHTML = "Search Results:";
        table_title.className = "search_title";
        tbody.className = "book_tbody search_tbody";
        search_arr.forEach((book) => {
            displayBookTable(book, isSearch)
        });
    }
}

// Display Book in DOM Carousel
function displayBookCarousel(book) {
    const slides = document.getElementById("book_slides");
    const bookListItem = document.createElement('li');
    bookListItem.id = `${book.isbn}`;
    bookListItem.className = "slide";
    bookListItem.innerHTML = `
        <div class="page6">
            <h3>${book.title}</h3>
        </div>
        <div class="page5">
            <p>Author: ${book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>Pages: ${book.pages}</p>
            <p id="readcarousel${book.isbn}">Read: ${book.read}</p>
        </div> 
        `;

    const del = createButton("Delete", "del_btn", "btn del_btn", `${book.isbn}`, "click", removeBookFromLibrary)
    const toggle = createButton("Toggle Read", "toggle_read", "btn toggle_read", `${book.isbn}`, "click", () => {
        toggleReadStatus(book.isbn);
    })
    const activeSlide = slides.querySelector("[data-active]");
    bookListItem.dataset.active = true;
    slides.appendChild(bookListItem);
    bookListItem.querySelector(".page5").appendChild(toggle);
    bookListItem.querySelector(".page6").appendChild(del);
    if(activeSlide) delete activeSlide.dataset.active;
}

// Display Book in DOM Table
function displayBookTable(book, isSearch) {
    const tbody = document.getElementById("book_tbody");
    const row = document.createElement('tr');
    row.id = `row${book.isbn}`;
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.pages}</td>
        <td id="readtable${book.isbn}">${book.read}</td>
        `;

    const cell = document.createElement('td');
    cell.className = "options";
    let button = document.createElement('button');
    if(!isSearch){
        button = createButton("DEL", "del_btn", "btn del_btn", `${book.isbn}`, "click", removeBookFromLibrary)
    } else { //isSearch === true (user searched for possible books to add to list using library api)
        button = createButton("ADD", "add_btn", "btn add_btn", `${book.isbn}`, "click", () => {
            if(!isValidInput(book)) {
                alert("Error: Invalid - Book already exists, a required field is missing, or input exceeds character limit.");
                return;
            }
            addBookToStorage(book);
            displayBookCarousel(book); // add to DOM Carousel
            alert("Book added successfully.");
        });
    }
    
    if(!isSearch){
        const toggle = createButton("Toggle Read", "toggle_read", "btn toggle_read", `${book.isbn}`, "click", () => {
            toggleReadStatus(book.isbn);
        })
        cell.appendChild(toggle);
    }
    cell.appendChild(button);
    row.appendChild(cell);
    tbody.appendChild(row);
}

// Create new button with given attributes
function createButton(innerHTML, id, class_name, value, event_name, event_cb) {
    const button = document.createElement('button');
    button.innerHTML = innerHTML;
    button.id = id;
    button.className = class_name;
    button.value = value;
    button.addEventListener(event_name, event_cb);
    return button;
}

/* *********************************** //
//       IMPORT/EXPORT BOOK LISTS      //
// *********************************** */

// Import books in json format from CSV format
function importBooksCSV(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const csv = formData.get("import_file");

    if(csv.size===0) {
        alert("No file was chosen for upload. Please choose a csv file in the correct format (Headers: Title, Author, ISBN, Pages, Read).");
        return;
    }

    const reader = new FileReader();
    reader.readAsText(csv);
    reader.onload = () => {
        const csvText = reader.result.replace(/[\r]/g, '');
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const lines = csvText.split(lineDelimiter);
        const headers = lines[0].split(columnDelimiter);
        console.log(headers);
        
        for(let i=1; i<lines.length; i++) {
            if (!lines[i]) continue;
            let book = {};
            let currentline = lines[i].split(columnDelimiter);

            for(let j=0; j<=headers.length; j++) {
                book[headers[j]] = currentline[j];
            }
            addBookToStorage(book);
        }
        displayLibrary(); 
        alert("Books imported successfully.");   
    }
}

// Export myLibrary list as JSON data format to client
function exportToJsonFile() {
    const myLibrary = getLibrary();
    const jsonData = [...myLibrary];
    const dataStr = JSON.stringify(jsonData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Convert jsonData to CSV format
function parseJSONToCSVStr(jsonData) {
    if(jsonData.length === 0) {
        return '';
    }

    const keys = Object.keys(jsonData[0]);
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.forEach(item => {
        keys.forEach((key, index) => {
            csvStr += item[key];
            if( index < keys.length-1 ) {
            csvStr += columnDelimiter;
            }
        });
        csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);;
}

// Export myLibrary list as CSV file format to client
function exportToCsvFile() {
    const myLibrary = getLibrary();
    const jsonData = [...myLibrary];

    const csvStr = parseJSONToCSVStr(jsonData);
    const dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;
    const exportFileDefaultName = 'data.csv';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

/* *********************************** //
//              STORAGE                //
// *********************************** */

function getLibrary() {
    let myLibrary;
    if(localStorage.getItem('myLibrary')===null) {
        myLibrary = [];
    } else {
        myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    }
    return myLibrary;
}

function addBookToStorage(book) {
    const myLibrary = getLibrary();
    myLibrary.push(book);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function removeBookFromStorage(book) {
    const myLibrary = getLibrary();
    myLibrary.forEach((lib_book, index) => {
        if(lib_book.isbn===book.isbn) {
            myLibrary.splice(index,1);
        }
    });
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function deleteLibraryFromStorage() {
    const myLibrary = [];
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    displayLibrary();
    alert("MyLibrary was successfully deleted.");   
}

/* *********************************** //
//                MODAL                //
// *********************************** */

function openModal(modal, modal_container, message) {
    modal.querySelector("p").innerHTML = `${message}`;
    modal_container.style.display = "block";
}

function closeModals() {
    const modal_containers = document.querySelectorAll(".modal_container");
    modal_containers.forEach(modal_container => {
        modal_container.style.display = "none";
    })
}

function confirmModal() {
    deleteLibraryFromStorage();
    closeModals();
}

/* *********************************** //
//        SEARCH FOR NEW BOOKS         //
// *********************************** */

// Search https://openlibrary.org/developers/api for book using search_term
function searchForBook(event) {
    event.preventDefault();

    const searching_container = document.getElementById("searching_container");
    const searching = document.getElementById("searching");
    const message = "Searching...";
    openModal(searching, searching_container, message);

    const formData = new FormData(this);
    const search_term = formData.get("search_term");
    const base_url = "https://openlibrary.org/search.json?q=";
    const fields = "&fields=title,author_name,isbn,number_of_pages_median,availability&limit=5";
    const search_url = `${base_url}${search_term}${fields}`;
    const configurations={ method: 'GET' };
    makeFetch(search_url, configurations);  
}

// Fetch results from https://openlibrary.org/developers/api
const makeFetch = async (url, configurations) => {
    await fetch(url, {
        ...configurations
    })
    .then((response) => {
        if(!response.ok) {
            throw new Error("Failed to fetch.");
        }
        return response.json();
    })
    .then((data) => {
        displaySearchResults(data.docs);
        closeModals(); 
    })
    .catch((err) => {
        console.log(err);
    });
}

// Create Book Object for each search result and display in the library table
function displaySearchResults(search_results) {
    if(search_results.length===0) {
        alert("No search results found. Try a different search term.");
        return;
    }
    const search_arr = search_results.map((result) => {
        return new Book(`${result.title}`, result.author_name && result.author_name[0] ? `${result.author_name[0]}` : "N/A", result.isbn && result.isbn[0] ? `${result.isbn[0]}` : "N/A", result.number_of_pages_median ? `${result.number_of_pages_median}` : "N/A", "no");
    })
    displayLibraryTable(true, search_arr); // isSearch = true
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', "#table_title");
    linkElement.click();
}

/* *********************************** //
//           CAROUSEL UI               //
// *********************************** */

// Update carousel active slide and add animation class to element for page turn animation
function handleCarouselClick(event) {
    const button = event.target;
    const carousel_buttons = document.querySelectorAll(".carousel_button");
    carousel_buttons.forEach(button => {
        button.setAttribute("disabled", true);
    })

    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    const slides = button
        .closest("[data-carousel]")
        .querySelector("[data-slides]");

    const active_slide = slides.querySelector("[data-active]") ? slides.querySelector("[data-active]") : slides.querySelector(".slide");
    delete active_slide.dataset.active;

    const animated_slide = offset === 1 ? document.getElementById("pageR") : document.getElementById("pageL");
    const animation = offset === 1 ? "animate" : "rev_animate";
    animated_slide.classList.add(`${animation}`);

    let newIndex = [...slides.children].indexOf(active_slide) + offset;
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if(newIndex >= slides.children.length) newIndex = 0;

    setTimeout(() => {
        slides.children[newIndex].dataset.active = true;
        carousel_buttons.forEach(button => {
            button.removeAttribute("disabled");
        })
    }, 650); // Wait for page flip animation before making current slide active and visible
}

// After CSS page turn animation completes, remove animation class from the element
function removeAnimation(event) {
    const animated_slide = document.getElementById(`${event.target.id}`);
    const animation = animated_slide.classList.contains("animate") ? "animate" : "rev_animate";
    animated_slide.classList.remove(`${animation}`);
}

/* *************************************** //
// INITIALIZE LISTENERS AND LIBRARY IN DOM //
// *************************************** */

// TO DO: ADD EVENT LISTENERS FOR KEYBOARD STROKES

// Set up event listeners
function addListeners() {
    const search_form = document.getElementById("search_form");
    const import_form = document.getElementById("import_form");
    const book_form = document.getElementById("book_form");
    search_form.addEventListener("submit", searchForBook);
    import_form.addEventListener("submit", importBooksCSV);
    book_form.addEventListener("submit", addBookToLibrary);

    const carousel_buttons = document.querySelectorAll(".carousel_button");
    const pages_to_turn = document.querySelectorAll(".turn");
    carousel_buttons.forEach(button => {
        button.addEventListener("click", handleCarouselClick);
    })
    pages_to_turn.forEach(page => {
        page.addEventListener("transitionend", removeAnimation);
    })

    const modals = document.querySelectorAll(".modal");
    const modal_closers = document.querySelectorAll(".modal_close");
    const confirm_btn = document.getElementById("confirm_btn");
    const confirmation = document.getElementById("confirmation");
    const confirmation_container = document.getElementById("confirmation_container");
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    });
    modal_closers.forEach(modal_closer => {
        modal_closer.addEventListener("click", closeModals);
    });
    confirm_btn.addEventListener("click", confirmModal);

    const display_lib_btn = document.getElementById("display_lib_btn");
    const delete_lib_btn = document.getElementById("delete_lib_btn");
    const export_libCSV_btn = document.getElementById("export_libCSV_btn");
    display_lib_btn.addEventListener("click", () => {
        displayLibraryTable(false);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', "#table_title");
        linkElement.click();
    });
    delete_lib_btn.addEventListener("click", () => {
        const message = "Are you sure you want to delete your entire library list? This action cannot be undone.";
        openModal(confirmation, confirmation_container, message);
    });
    export_libCSV_btn.addEventListener("click", exportToCsvFile);
}

// Initialize listeners and current myLibrary
addListeners();
displayLibrary();
