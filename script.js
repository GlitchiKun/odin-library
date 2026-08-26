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
}

Book.prototype.read = function () {
  this.is_read = true;
};

function addBookToLibrary(title, author, number_of_pages, read = false) {
  let book = new Book(title, author, number_of_pages, read);
  myLibrary.push(book);
}

function displayBooks() {
  const shelf = document.getElementsByClassName("shelf")[0]; //TODO choose the best shelf

  while (shelf.firstChild) {
    shelf.removeChild(shelf.lastChild);
  }

  myLibrary.forEach((b) => {
    let div_book = document.createElement("div");
    div_book.draggable = true;
    div_book.classList.add("book");
    div_book.style.backgroundColor = b.color;
    div_book.innerText = `${b.title}\n${b.author}`;
    div_book.title = `${b.number_of_pages} page${b.number_of_pages > 1 ? "s" : ""}\n${b.is_read ? "Read" : "Not Read"}`;
    div_book.dataset.bookId = b.id;
    shelf.appendChild(div_book);
  });
}

function handleDragEvents() {
  let shelfs = document.getElementsByClassName("shelf");

  for (let s of shelfs) {
    s.addEventListener("dragstart", (e) => (dragged_book = e.target));

    s.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    s.addEventListener("drop", (e) => {
      e.preventDefault();
      s.appendChild(dragged_book);
    });
  }

  let read_action = document.getElementById("read-book");

  read_action.addEventListener("dragstart", (e) => (dragged_book = e.target));

  read_action.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  read_action.addEventListener("drop", (e) => {
    e.preventDefault();
    myLibrary
      .filter((b) => b.id == dragged_book.dataset.bookId)
      .forEach((b) => {
        console.log(b);
        b.read();
      });
    displayBooks();
  });

  let delete_action = document.getElementById("delete-book");

  delete_action.addEventListener("dragstart", (e) => (dragged_book = e.target));

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

handleDragEvents();

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
