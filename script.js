let myLibrary = [];
let dragged_book;

function Book(title, author, number_of_pages, read = false) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.number_of_pages = number_of_pages;
  this.is_read = read;
  this.color =
    "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");
  this.shelf = 0;
}

Book.prototype.read = function () {
  this.is_read = true;
};

Book.prototype.changeShelf = function (shelf_index) {
  this.shelf = shelf_index;
};

function addBookToLibrary(title, author, number_of_pages, read = false) {
  let book = new Book(title, author, number_of_pages, read);
  myLibrary.push(book);
}

function getBookFromID(id) {
  return myLibrary.filter((b) => b.id == id)[0];
}

function displayBooks() {
  for (let shelf of document.getElementsByClassName("shelf")) {
    while (shelf.firstChild) {
      shelf.removeChild(shelf.lastChild);
    }
  }

  const action_book_div = document.getElementsByClassName("action-book")[0];

  myLibrary.forEach((b) => {
    const shelf = document.getElementsByClassName("shelf")[b.shelf]; //TODO choose the best shelf
    let div_book = document.createElement("div");
    div_book.draggable = true;
    div_book.classList.add("book");
    div_book.style.backgroundColor = b.color;
    div_book.innerText = `${b.title}\n${b.author}`;
    div_book.title = `${b.number_of_pages} page${b.number_of_pages > 1 ? "s" : ""}\n${b.is_read ? "Read" : "Not Read"}`;
    div_book.dataset.bookId = b.id;
    div_book.addEventListener("dragstart", () =>
      action_book_div.classList.remove("hidden"),
    );
    div_book.addEventListener("drag", (e) => {
      dragged_book = e.target;
    });
    div_book.addEventListener("dragend", () =>
      action_book_div.classList.add("hidden"),
    );
    shelf.appendChild(div_book);
  });
}

function handleAddBookEvent() {
  const add_book_form = document.getElementById("add-book-form");
  const add_book_dialog = document.getElementById("add-book-dialog");
  add_book_form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    addBookToLibrary(
      data.get("title"),
      data.get("author"),
      data.get("number-of-page"),
      data.get("read-it"),
    );

    displayBooks();

    add_book_dialog.close();
  });
}

function handleDragEvents() {
  let shelfs = document.getElementsByClassName("shelf");

  for (let i = 0; i < shelfs.length; i++) {
    shelfs[i].addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    shelfs[i].addEventListener("drop", (e) => {
      e.preventDefault();
      let book = getBookFromID(dragged_book.dataset.bookId);
      book.changeShelf(i);
      shelfs[i].appendChild(dragged_book);
    });
  }

  let read_action = document.getElementById("read-book");

  read_action.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  read_action.addEventListener("drop", (e) => {
    e.preventDefault();
    myLibrary
      .filter((b) => b.id == dragged_book.dataset.bookId)
      .forEach((b) => b.read());
    displayBooks();
  });

  let delete_action = document.getElementById("delete-book");

  delete_action.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  delete_action.addEventListener("drop", (e) => {
    e.preventDefault();
    myLibrary = myLibrary.filter((i) => i.id != dragged_book.dataset.bookId);
    displayBooks();
  });
}

addBookToLibrary("The Lord of the Rings", "J.R.R Tolkien", 1000);
addBookToLibrary("Harry Potter", "J.K Rowling", 250, true);
addBookToLibrary("1984", "Georges Orwell", 420, true);

displayBooks();

handleAddBookEvent();
handleDragEvents();
