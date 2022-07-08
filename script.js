let myLibrary = [];

function Book() {
    // the constructor...

}

// take user input and store the new book objects into an array
function addBookToLibrary(event) {
    //do stuff here
    event.preventDefault();

    const formData = new FormData(this);
    formData.forEach((element) => {
        console.log(element);
    });
    console.log(formData);
}

// remove book from array
function removeBoomFromLibrary() {

}

// toggle read status from unread to read or vice versa
function toggleReadStatus() {

}

// loop through the array and display each book on the page
function displayBooks() {

}

// import books in json format
function importBooks() {

}

// export books in json format
function exportBooks() {

}

function searchForBook(event) {
    event.preventDefault();

    const formData = new FormData(this);
    formData.forEach((element) => {
        console.log(element);
    });
    for(const [key, value] of formData) {
        console.log(`${key}: ${value}`);
    };
    console.log(this);
    console.log(formData.values);
}

function addListeners() {
    const searchForm = document.getElementById("search_form");
    const bookForm = document.getElementById("book_form");

    searchForm.addEventListener("submit", searchForBook);
    bookForm.addEventListener("submit", addBookToLibrary);
}

addListeners();
