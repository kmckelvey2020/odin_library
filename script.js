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

function Book(title, author, isbn, pages, read) {
    // Book constructor
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.pages = pages;
    this.read = read;
}

// Store user input as a new book object into myLibrary array and call displayBook to add to DOM
function addBookToLibrary(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const book = new Book(formData.get("title"), formData.get("author"), formData.get("isbn"), formData.get("pages"), formData.get("read")==="on" ? "yes" : "no");
    
    myLibrary.push(book);
    displayBookCarousel(book); // add to DOM Carousel
    displayBookTable(book); // add to DOM Table
}

// remove book from myLibrary array and from DOM
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

    slides.querySelector(".slide").dataset.active = true;
}

// toggle read status from unread to read or vice versa
function toggleReadStatus(book) {

}

function displayLibrary() {
    displayLibraryCarousel();
    displayLibraryTable(false); // search = false
}

function displayLibraryCarousel() {
    myLibrary.forEach((book) => {
        displayBookCarousel(book)
    });
}

function displayLibraryTable(search) {
    myLibrary.forEach((book) => {
        displayBookTable(book, search)
    });
}

// display Book in DOM Carousel
function displayBookCarousel(book) {
    const unorderedList = document.getElementById("book_slides");
    const bookListItem = document.createElement('li');
    bookListItem.id = `${book.isbn}`;
    bookListItem.className = "slide";
    bookListItem.innerHTML = `
        <div class="page6">
            <h2>${book.title}</h2>
        </div>
        <div class="page5">
            <p>Author: ${book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>Pages: ${book.pages}</p>
            <p>Read: ${book.read}</p>
        </div> 
        `;

    const del = document.createElement('button');
    del.innerHTML = `Delete Book`;
    del.id = "del_btn";
    del.className = "btn del_btn";
    del.value = `${book.isbn}`;
    del.addEventListener("click", removeBookFromLibrary);

    const activeSlide = unorderedList.querySelector("[data-active]");
    bookListItem.dataset.active = true;
    unorderedList.appendChild(bookListItem);
    bookListItem.querySelector(".page6").appendChild(del);
    if(activeSlide) delete activeSlide.dataset.active;
}

// display Book in DOM Table
function displayBookTable(book, search) {
    const tbody = document.getElementById("book_tbody");
    const row = document.createElement('tr');
    row.id = `row${book.isbn}`;
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.pages}</td>
        <td>${book.read}</td>
        `;

    const cell = document.createElement('td');
    const button = document.createElement('button');
    console.log(search);
    if(!search){
        button.innerHTML = `DEL`;
        button.id = "del_btn";
        button.className = "btn del_btn";
        button.value = `${book.isbn}`;
        button.addEventListener("click", removeBookFromLibrary);
    } else { //search === true (user searched for possible books to add to list using library api)
        button.innerHTML = `ADD`;
        button.id = "add_btn";
        button.className = "btn add_btn";
        button.value = `${book.isbn}`;
        button.addEventListener("click", (book) => {
            myLibrary.push(book);
            displayBookCarousel(book); // add to DOM Carousel
        });
    }
    
    cell.appendChild(button);
    row.appendChild(cell);
    tbody.appendChild(row);
}

// import books in json format
function importBooks() {

}

//var obj = {a: "Hello", b: "World"};
//exportToJsonFile( JSON.stringify(obj) );
function exportToJsonFile() {
    const jsonData = { library: myLibrary };
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function parseJSONToCSVStr(jsonData) {

    if(jsonData.length == 0) {
        return '';
    }

    let keys = Object.keys(jsonData[0]);

    let columnDelimiter = ',';
    let lineDelimiter = '\n';

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.forEach(item => {
        keys.forEach((key, index) => {
            csvStr += item[key];
            if( index < keys.length-1 ) {
            csvStr += columnDelimiter;
            }
        });

        //keys.forEach((key, index) => {
        //    if( (index > 0) && (index < keys.length-1) ) {
        //        csvStr += columnDelimiter;
        //    }
        //    csvStr += item[key];
        //});
        csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);;
}

function exportToCsvFile() {
    const jsonData = { library: myLibrary };

    let csvStr = parseJSONToCSVStr(jsonData);
    let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;

    let exportFileDefaultName = 'data.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function searchForBook(event) {
    event.preventDefault();

    const formData = new FormData(this);
    console.log(formData.get("search_term"));
    for(const [key, value] of formData) {
        console.log(`${key}: ${value}`);
    };
}

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
    }, 650);
}

function removeAnimation(event) {
    const animated_slide = document.getElementById(`${event.target.id}`);
    const animation = animated_slide.classList.contains("animate") ? "animate" : "rev_animate";
    animated_slide.classList.remove(`${animation}`);
}

function addListeners() {
    const search_form = document.getElementById("search_form");
    const book_form = document.getElementById("book_form");
    const carousel_buttons = document.querySelectorAll(".carousel_button");
    const pages_to_turn = document.querySelectorAll(".turn");
    const display_lib_btn = document.getElementById("display_lib_btn");
    const export_libJSON_btn = document.getElementById("export_libJSON_btn");
    const export_libCSV_btn = document.getElementById("export_libCSV_btn");

    search_form.addEventListener("submit", searchForBook);
    book_form.addEventListener("submit", addBookToLibrary);
    carousel_buttons.forEach(button => {
        button.addEventListener("click", handleCarouselClick);
    })
    pages_to_turn.forEach(page => {
        page.addEventListener("transitionend", removeAnimation);
    })
    display_lib_btn.addEventListener("click", displayLibraryTable);
    export_libJSON_btn.addEventListener("click", exportToJsonFile);
    export_libCSV_btn.addEventListener("click", exportToCsvFile);
}

addListeners();
displayLibrary();
