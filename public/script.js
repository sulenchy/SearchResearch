var request = new XMLHttpRequest()


var searchInput = document.getElementById('search');
const app = document.getElementById('root')

// const logo = document.createElement('img')
// logo.src = 'logo.png'

const container = document.createElement('div')
container.setAttribute('class', 'container')


// app.appendChild(logo)
app.appendChild(container)

searchInput.oninput = function(event) {
  var query = event.target.value;
  
  request.open('GET', 'http://localhost:4040/search/' + event.target.value, true)
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400 && data.length > 0) {
      container.innerHTML = '';
      data.forEach((reseacher) => {
        const card = document.createElement('div')
        card.setAttribute('class', 'card')

        const anchor = document.createElement('a');
        anchor.setAttribute('href', reseacher.readMoreLink);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('class', 'supervisor-name')
        anchor.textContent = reseacher.fullName

        const p = document.createElement('p')
        reseacher.description = reseacher.researchInterest.substring(0, 300);
        const interest = reseacher.description.length === 0 ? `Find my interest at` : `${ reseacher.description.split(',').length > 1 ? 'are' : 'is' } ${ reseacher.description }...`
        p.textContent = `My area of research interest ${ interest }`

        container.appendChild(card)
        card.appendChild(anchor)
        card.appendChild(p)
      })
    } else {
      const errorMessage = document.createElement('p')
      errorMessage.textContent = `Sorry, no record was found`
      container.innerHTML = '';
      container.appendChild(errorMessage)
    }
  }
  if (query) {
    request.send();
  }
};

