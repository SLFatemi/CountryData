'use strict';


// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////


/////////////////////////// Sleep implementation
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(() => resolve('ali'), ms));
// }
//
// async function main() {
//   console.log(1);
//   await sleep(1000);
//   console.log(2);
//   await sleep(1000);
//   console.log(3);
// }
//
// main();

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

function getHTML(data, className = '') {
  return `
        <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1e6).toFixed(1)} M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
  `;
}

////////////////////////////////////////////// ASYNC
//
// function main() {
//   countriesContainer.innerHTML = '';
//   const country = prompt('Enter the name of your desired country');
//   fetch(`https://restcountries.com/v2/name/${country}`).then(
//     (data) => data.json()
//       .then(
//         (res) => {
//           res = res[0];
//           const html = getHTML(res);
//           countriesContainer.insertAdjacentHTML('beforeend', html);
//           countriesContainer.style.opacity = 1;
//           const neighbourCountries = res.borders;
//           for (const neighbourCountry of neighbourCountries) {
//             fetch(`https://restcountries.com/v2/alpha/${neighbourCountry}`)
//               .then(
//                 (data) => {
//                   data.json()
//                     .then((res) => {
//                         const html = getHTML(res, 'neighbour');
//                         countriesContainer.insertAdjacentHTML('beforeend', html);
//                       }
//                     ).catch(() => alert('There was an error'));
//                 }
//               )
//               .catch(() => alert('There was an error'));
//           }
//         }
//       )
//       .catch(
//         () => alert('Invalid Country, Try again')
//       )
//   ).catch(() => alert('There was an error connecting to the server'));
//
// }
//
// btn.addEventListener('click', main);

///////////////////////////////////////////// AWAIT

async function fetchDataCountry(country) {
  try {
    const [data] = (await (await (fetch(`https://restcountries.com/v2/name/${country}`))).json());
    return data;
  } catch (e) {
  }
  return null;
}

async function fetchDataNeighbour(country) {
  try {
    return (await (await (fetch(`https://restcountries.com/v2/alpha/${country}`))).json());
  } catch (e) {
  }
  return null;
}

async function main() {
  countriesContainer.innerHTML = '';
  const country = prompt('Enter the name of your desired country');
  const res = await fetchDataCountry(country);
  if (!res) return;
  const html = getHTML(res);
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
  const neighbourCountries = res.borders;
  for (const neighbourCountry of neighbourCountries) {
    const res = await fetchDataNeighbour(neighbourCountry);
    if (!res)
      return;
    const html = getHTML(res, 'neighbour');
    countriesContainer.insertAdjacentHTML('beforeend', html);
  }
}

btn.addEventListener('click', main);

