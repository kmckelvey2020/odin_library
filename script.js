let myLibrary = [];

function Book(title, author, isbn, pages, read) {
    // the constructor...
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
    displayBook(book);
}

// remove book from array
function removeBookFromLibrary() {

}

// toggle read status from unread to read or vice versa
function toggleReadStatus() {

}

// loop through the array and display each book on the page
function displayBook(book) {
    const unorderedList = document.getElementById("book_slides");
    const listItem = document.createElement('li');
    listItem.id = "slide";
    listItem.className = "slide";

    const page5 = document.createElement('div');
    page5.className = "page5";
    const page6 = document.createElement('div');
    page6.className = "page6";

    const title = document.createElement('h2');
    title.innerHTML = `${book.title}`;
    const author = document.createElement('p');
    author.innerHTML = `Author: ${book.author}`;
    const isbn = document.createElement('p');
    isbn.innerHTML = `ISBN: ${book.isbn}`;    
    const pages = document.createElement('p');
    pages.innerHTML = `Pages: ${book.pages}`;
    const read = document.createElement('p');
    read.innerHTML = `Read: ${book.read}`;
    const del = document.createElement('button');
    del.innerHTML = `Delete Book`;
    del.id = "del_btn";
    del.className = "btn del_btn";
    del.addEventListener("click", removeBookFromLibrary);

    page6.appendChild(title);
    page5.appendChild(author);
    page5.appendChild(isbn);
    page5.appendChild(pages);
    page5.appendChild(read);
    page5.appendChild(del);

    listItem.appendChild(page6);
    listItem.appendChild(page5);

    const activeSlide = unorderedList.querySelector("[data-active]");

    listItem.dataset.active = true;
    unorderedList.appendChild(listItem);

    if(activeSlide) delete activeSlide.dataset.active;
}

// import books in json format
function importBooks() {

}

// export books in json format
function exportBooks() {

}

//var obj = {a: "Hello", b: "World"};
//saveText( JSON.stringify(obj), "filename.json" );
function exportToJsonFile(jsonData) {
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

function exportToCsvFile(jsonData) {
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

    const activeSlide = slides.querySelector("[data-active]");
    delete activeSlide.dataset.active;

    const animatedSlide = offset === 1 ? document.getElementById("pageR") : document.getElementById("pageL");
    const animation = offset === 1 ? "animate" : "rev_animate";
    animatedSlide.classList.add(`${animation}`);

    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if(newIndex >= slides.children.length) newIndex = 0;

    setTimeout(() => {
        slides.children[newIndex].dataset.active = true;
    }, 550);
}

function removeAnimation(event) {
    const target = event.target;
    const animation = target.classList.contains("animate") ? "animate" : "rev_animate";
    const animatedSlide = animation === "animate" ? document.getElementById("pageR") : document.getElementById("pageL");
    animatedSlide.classList.remove(`${animation}`);
}

function addListeners() {
    const searchForm = document.getElementById("search_form");
    const bookForm = document.getElementById("book_form");
    const carousel_buttons = document.querySelectorAll(".carousel_button");
    const pages_to_turn = document.querySelectorAll(".turn");

    searchForm.addEventListener("submit", searchForBook);
    bookForm.addEventListener("submit", addBookToLibrary);
    carousel_buttons.forEach(button => {
        button.addEventListener("click", handleCarouselClick);
    })
    pages_to_turn.forEach(page => {
        page.addEventListener("transitionend", removeAnimation);
    })
}

addListeners();
