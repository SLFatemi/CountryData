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

const btnName = document.querySelector('.btn-name');
const btnCountry = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
// PART 1
// 1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
// 2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}.
// The AJAX call will be done to a URL with this format: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=52.508&longitude=13.381. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
// 3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
// 4. Chain a .catch method to the end of the promise chain and log errors to the console
// 5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

function getHTML(data, className = '') {
  return `
        <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1e6).toFixed(1) > 0 ? (+data.population / 1e6).toFixed(1) : 'Less than 1'}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
  `;
}


function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => resolve(position), (error) => reject(error));
  });
}

async function reverseGeocoding(lat, lng) {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
    if (!res.ok) alert(`${res.status}`);
    return await res.json();
  } catch (e) {
  }
  return null;
}


async function whereAmI() {
  countriesContainer.innerHTML = '';
  let [lat, lng] = [0, 0];
  try {
    const pos = await getPosition();
    [lat, lng] = [pos.coords.latitude, pos.coords.longitude];
    const countryData = (await reverseGeocoding(lat, lng));
    alert(`You are in ${countryData.city}, ${countryData.countryName}`);
    const res = await fetchDataCountry(countryData.countryName);
    showCountry(res);
    await getAndShowNeighbours(res);
  } catch (e) {
  }
  return null;
}

function showCountry(res, className = '') {
  const html = getHTML(res, className);
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

async function getAndShowNeighbours(res) {
  const neighbourCountries = res.borders;
  if (neighbourCountries) {
    for (const neighbourCountry of neighbourCountries) {
      const res = await fetchDataNeighbour(neighbourCountry);
      if (!res)
        return;
      showCountry(res, 'neighbour');
    }
  }
}

async function fetchDataCountry(country) {
  try {
    const response = (await (fetch(`https://restcountries.com/v2/name/${country}`)));
    if (!response.ok) alert(`${response.status}`);
    const [data] = await response.json();
    return data;
  } catch (e) {
  }
  return null;
}

async function fetchDataNeighbour(country) {
  try {
    const res = await (fetch(`https://restcountries.com/v2/alpha/${country}`));
    if (!res.ok) alert(`${res.status}`);
    return await res.json();

  } catch (e) {
  }
  return null;
}

async function countryName() {
  countriesContainer.innerHTML = '';
  const country = prompt('Enter the name of your desired country');
  const res = await fetchDataCountry(country);
  if (!res) return;
  showCountry(res);
  await getAndShowNeighbours(res);
}

btnName.addEventListener('click', countryName);
btnCountry.addEventListener('click', whereAmI);
