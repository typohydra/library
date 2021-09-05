let myLibrary = [];

// book class
function Book(title, author, pages, haveRead, uniqueId) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead; // true or false
    this.uniqueId = uniqueId;
}

Book.prototype.info = function() {
    return `${this.title} 
    author: ${this.author} 
    pages: ${this.pages}
    ${this.haveRead ? 'already read' : 'not read yet'}.`;
}

let booksAddedCounter = -1; //used to give unique id to a book
function addBookToLibrary(title, author, pages, haveRead) {
    booksAddedCounter++;
    myLibrary.push(new Book(title, author, pages, haveRead, booksAddedCounter));
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

const bookDisplay = document.querySelector('#book-display');
function displayBooks() {
    if(localStorage.length !== 0 )
    {
        myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
        myLibrary.forEach( book => {
            book.info = function() {
                return `${this.title} 
    author: ${this.author} 
    pages: ${this.pages}
    ${this.haveRead ? 'already read' : 'not read yet'}.`;
            }
            displayNewBook(book);
        })
    }
}
displayBooks();

function displayNewBook(book) {
    const bookToDisplay = document.createElement('div');
    const bookInfoContainer = document.createElement('p');
    const bookBtnsContainer = document.createElement('div');
    bookBtnsContainer.classList.add('book-btns-container');
    bookBtnsContainer.classList.add('book-btns-container');
    bookInfoContainer.innerText = book.info();
    bookToDisplay.setAttribute('data-UniqueId', `${book.uniqueId}`); //same as remove button data-index value
    bookDisplay.appendChild(bookToDisplay);
    bookToDisplay.appendChild(bookInfoContainer);
    bookToDisplay.appendChild(bookBtnsContainer);

    //add remove button to each book
    const removeBookBtn = document.createElement('button');
    removeBookBtn.classList.add('book-btns');
    removeBookBtn.classList.add('remove-btns');
    removeBookBtn.innerText = 'remove book';    
        //add self made attribute to new book's remove button to mark its position in myLbrary array
        //it will make deletion easier
    removeBookBtn.setAttribute("data-uniqueId", book.uniqueId);
    bookBtnsContainer.appendChild(removeBookBtn);
   
    removeBookBtn.addEventListener('click', () => {
        //remove book from display
        const idOfBookToRemove = removeBookBtn.getAttribute('data-uniqueId');
        const bookToRemove = document.querySelector(`[data-uniqueId ='${idOfBookToRemove}']`);
        bookDisplay.removeChild(bookToRemove);

        //remove same book from the array
        for(let book=0; book<myLibrary.length; book++) {
            if(myLibrary[book].uniqueId === Number(idOfBookToRemove)) {
                myLibrary.splice(book, 1);
                break;
            }
        }
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    })

    //MARK AS READ
    const toggleReadBtn = document.createElement('button');
    toggleReadBtn.innerText = book.haveRead ? "mark as unread" : "mark as read";
    toggleReadBtn.classList.add('book-btns');
    toggleReadBtn.classList.add('markAs-btns');
    bookBtnsContainer.appendChild(toggleReadBtn);

    toggleReadBtn.addEventListener('click', () => {
        book.haveRead = !book.haveRead;
        toggleReadBtn.innerText = book.haveRead ? "mark as unread" : "mark as read";
        bookInfoContainer.innerText = book.info();
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    })
}

const newBookBtn = document.querySelector('#new-book-btn');
const newBookForm = document.querySelector('#new-book-form');
newBookBtn.addEventListener('click', () => {
    newBookForm.style.visibility = "visible";
});

//form input
const formSubmitBtn = document.querySelector('#submit-btn');
const bookNameInput = document.querySelector('#name-input');
const authorInput = document.querySelector('#author-input');
const pagesInput = document.querySelector('#pages-input');
const haveReadInput = document.querySelector('#haveRead-input');
formSubmitBtn.addEventListener('click', () => {
    if( bookNameInput.value.length == 0 || authorInput.value.length == 0 || pagesInput.value.length == 0) {
        alert('you need to fill input fields');
    }
    else {
        let newBook = addBookToLibrary(bookNameInput.value, authorInput.value, pagesInput.value, haveReadInput.value === 'No' ? false : true);
        //new book is added at the end of the array
        displayNewBook(myLibrary[myLibrary.length-1]);
    }
})
