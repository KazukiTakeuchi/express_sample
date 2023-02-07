window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.user').forEach((e) => {
    e.addEventListener('click', (e) => {
      console.log(e.target.innerHTML);
    })
  })
} )
