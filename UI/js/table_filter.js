function filterTable() {
  const input = document.getElementById('myInput');
  const filter = input.value.toUpperCase();
  const table = document.getElementById('myTable');
  const tr = table.getElementsByTagName('tr');

  for (let i = 0; i < tr.length; i += 1) {
    const td = tr[i].getElementsByTagName('td')[1];
    if (td) {
      const txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}
