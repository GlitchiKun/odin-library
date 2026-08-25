const myLibrary = [];

function Book(title, author, number_of_pages, read = false) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.number_of_pages = number_of_pages;
  this.read = read;
  this.color =
    "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");
}

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
    div_book.title = `${b.number_of_pages} page${b.number_of_pages > 1 ? "s" : ""}\n${b.read ? "Read" : "Not Read"}`;

    shelf.appendChild(div_book);
  });
}

addBookToLibrary("The Lord of the Rings", "J.R.R Tolkien", 1000);
addBookToLibrary("Harry Potter", "J.K Rowling", 250, true);
addBookToLibrary("1984", "Georges Orwell", 420, true);

displayBooks();

let dragged_book;

shelfs = document.getElementsByClassName("shelf");

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
