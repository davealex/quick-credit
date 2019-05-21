function filterList() {
  const input = document.getElementById('myInput');
  const filter = input.value.toUpperCase();
  const ul = document.getElementById('myList');
  const li = ul.getElementsByTagName('li');

  for (let i = 0; i < li.length; i += 1) {
    const [a] = li[i].getElementsByTagName('a');
    const txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}
