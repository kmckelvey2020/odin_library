let myLibrary = [
    {
        title: "The Hunchback of Notredame", 
        author: "Monte Cristo", 
        isbn: "789456123354", 
        pages: 562, 
        read: "yes"
    },
    {
        title: "Dog Breeds of the World", 
        author: "Doggino Puppicino", 
        isbn: "456353457643", 
        pages: 342, 
        read: "no"
    },
    {
        title: "The Duch Went Quack", 
        author: "Little Bo Peep", 
        isbn: "8970695457445", 
        pages: 768, 
        read: "yes"
    },
    {
        title: "Exploration of Mars", 
        author: "Charlotte Authorson", 
        isbn: "8567856123354", 
        pages: 58, 
        read: "yes"
    },
    {
        title: "Goldilocks and the Three Bears", 
        author: "Mother Goose", 
        isbn: "1234523354", 
        pages: 142, 
        read: "no"
    }
];

const default_slides_innerHTML = `
    <li class="default slide" data-active>
        <div class="page6"><h3>Click "Add Book" to add to your library</h3></div>
        <div class="page5">
            <p>Add books to get started</p>
            <p>You can export your list!</p>
            <p>Try importing an existing list!</p>
        </div> 
    </li>`;

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
    
    myLibrary.push(book);
    displayBookCarousel(book); // add to DOM Carousel
    displayBookTable(book); // add to DOM Table
    alert("Book added successfully.");
}

//
function validateInputs() {

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

    myLibrary.sort((a,b) => {
        if(a.isbn === `${isbn}`) return 1;
        if(b.isbn === `${isbn}`) return -1;
        if(a.isbn !== `${isbn}` && b.isbn !== `${isbn}`) return 0;
    }) 
    myLibrary.pop();

    if(myLibrary.length === 0) {
        slides.innerHTML = default_slides_innerHTML;
    }

    if(!slides.querySelector("[data-active]")) {
        slides.lastElementChild.dataset.active = true;
    }
}

// Toggle read status from unread to read or vice versa
function toggleReadStatus(book) {
    const index = myLibrary.indexOf(book);

    const readStatus = book.read;
    let newReadStatus;
    if(readStatus==="yes") newReadStatus = "no";
    if(readStatus==="no") newReadStatus = "yes";

    myLibrary[index].read = newReadStatus;
    const readListItem = document.getElementById(`readcarousel${book.isbn}`);
    readListItem.innerHTML = `Read: ${newReadStatus}`;

    const readTableCell = document.getElementById(`readtable${book.isbn}`);
    readTableCell.innerHTML = `${newReadStatus}`

}

// Display myLibrary elements in carousel and table in DOM
function displayLibrary() {
    displayLibraryCarousel();
    displayLibraryTable(false); // isSearch = false
}

// Reset carousel and display myLibrary elements in book carousel
function displayLibraryCarousel() {
    const slides = document.getElementById("book_slides");
    slides.innerHTML = "";

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

    const del = document.createElement('button');
    del.innerHTML = `Delete`;
    del.id = "del_btn";
    del.className = "btn del_btn";
    del.value = `${book.isbn}`;
    del.addEventListener("click", removeBookFromLibrary);

    const activeSlide = slides.querySelector("[data-active]");
    bookListItem.dataset.active = true;
    slides.appendChild(bookListItem);
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
    const button = document.createElement('button');
    if(!isSearch){
        button.innerHTML = `DEL`;
        button.id = "del_btn";
        button.className = "btn del_btn";
        button.value = `${book.isbn}`;
        button.addEventListener("click", removeBookFromLibrary);
    } else { //isSearch === true (user searched for possible books to add to list using library api)
        button.innerHTML = `ADD`;
        button.id = "add_btn";
        button.className = "btn add_btn";
        button.value = `${book.isbn}`;
        button.addEventListener("click", () => {
            myLibrary.push(book);
            displayBookCarousel(book); // add to DOM Carousel
            alert("Book added successfully.");
        });
    }
    
    const toggle = document.createElement('button');
    toggle.innerHTML = "Toggle Read";
    toggle.id = "toggle_read";
    toggle.className = "btn toggle_read";
    toggle.value = `${book.isbn}`;
    toggle.addEventListener("click", () => {
        toggleReadStatus(book);
    });
    
    if(!isSearch){
        cell.appendChild(toggle);
    }
    cell.appendChild(button);
    row.appendChild(cell);
    tbody.appendChild(row);
}

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
        //console.log(headers);
        
        for(let i=1; i<lines.length; i++) {
            if (!lines[i]) continue;
            let book = {};
            let currentline = lines[i].split(columnDelimiter);

            for(let j=0; j<=headers.length; j++) {
                book[headers[j]] = currentline[j];
            }
    
            myLibrary.push(book);
        }
        displayLibrary(); 
        alert("Books imported successfully.");   
    }
}

// Export myLibrary list as JSON data format to client
function exportToJsonFile() {
    const jsonData = [...myLibrary];
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
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
    const jsonData = [...myLibrary];

    let csvStr = parseJSONToCSVStr(jsonData);
    let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;
    let exportFileDefaultName = 'data.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Search https://openlibrary.org/developers/api for book using search_term
function searchForBook(event) {
    event.preventDefault();

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
        //console.log(response);
        return response.json();
    })
    .then((data) => {
        displaySearchResults(data.docs);
    })
    .catch((err) => {
        console.log(err);
    });
}

// Create Book Object for each search result and display in the library table
function displaySearchResults(search_results) {
    const search_arr = search_results.map((result) => {
        return new Book(result.title, result.author_name[0], result.isbn[0], result.number_of_pages_median, "no");
    })
    displayLibraryTable(true, search_arr); // isSearch = true
}

// Update carousel active slide and add animation class to element for page turn animation
function handleCarouselClick(event) {
    const button = event.target;
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
    }, 650); // Wait for page flip animation before making current slide active and visible
}

// After CSS page turn animation completes, remove animation class from the element
function removeAnimation(event) {
    const animated_slide = document.getElementById(`${event.target.id}`);
    const animation = animated_slide.classList.contains("animate") ? "animate" : "rev_animate";
    animated_slide.classList.remove(`${animation}`);
}

// Set up event listeners
function addListeners() {
    const search_form = document.getElementById("search_form");
    const import_form = document.getElementById("import_form");
    const book_form = document.getElementById("book_form");
    const carousel_buttons = document.querySelectorAll(".carousel_button");
    const pages_to_turn = document.querySelectorAll(".turn");
    const display_lib_btn = document.getElementById("display_lib_btn");
    const export_libJSON_btn = document.getElementById("export_libJSON_btn");
    const export_libCSV_btn = document.getElementById("export_libCSV_btn");

    search_form.addEventListener("submit", searchForBook);
    import_form.addEventListener("submit", importBooksCSV);
    book_form.addEventListener("submit", addBookToLibrary);
    carousel_buttons.forEach(button => {
        button.addEventListener("click", handleCarouselClick);
    })
    pages_to_turn.forEach(page => {
        page.addEventListener("transitionend", removeAnimation);
    })
    display_lib_btn.addEventListener("click", () => {
            displayLibraryTable(false);
            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', "#table_title");
            linkElement.click();
    });
    export_libJSON_btn.addEventListener("click", exportToJsonFile);
    export_libCSV_btn.addEventListener("click", exportToCsvFile);
}

// Initialize listeners and current myLibrary
addListeners();
displayLibrary();
