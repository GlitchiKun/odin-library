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
