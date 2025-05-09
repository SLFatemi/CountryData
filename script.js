'use strict';

//
// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal
//
// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

/////////////////////////////////////


///////////////////////// Sleep implementation
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
    renderCountry(res);
    await getAndShowNeighbours(res);
  } catch (e) {
    alert(e.message);
  }
  return null;
}

function renderCountry(res, className = '') {
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
      renderCountry(res, 'neighbour');
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
  renderCountry(res);
  await getAndShowNeighbours(res);
}

btnName.addEventListener('click', countryName);
btnCountry.addEventListener('click', whereAmI);

////////////////////// MAKING A NEW PROMISE /////////////////////////////
// WRONG!
// function lotteryPromise() {
//   return new Promise(function(resolve, reject) {
//     if (Math.random() >= 0.5) resolve();
//     else reject();
//   });
// }
//`
// function lotteryPromise() {
//   console.log('Lottery draw is happening 🔮');
//   return new Promise(function(resolve) {
//     setTimeout(() => {
//       if (Math.random() >= 0.5) resolve('You won 💰');
//       else resolve('You lost 💩');
//     }, 3000);
//   });
// }
//
//
// async function main() {
//   for (let i = 1; i < 1000; i++) {
//     console.log(i);
//     await promisifiedSetTimeOut(1000);
//   }
//   // try {
//   //   const result = await lotteryPromise();
//   //   alert(result);
//   // } catch (e) {
//   // }
//   // return null;
// }
//
// //
// // async function somethingElse() {
// //   await promisifiedSetTimeOut(5000);
// //   for (let i = 1; i < 1000; i++) {
// //     console.log('Yep');
// //   }
// // }
//
// function promisifiedSetTimeOut(timeout) {
//   return new Promise(resolve => {
//     setTimeout(resolve, timeout);
//   });
// }
//
// main();
// // somethingElse();
//
// function sleep(ms) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// }
//
//
// function createImage(imgPath) {
//   return new Promise((resolve, reject) => {
//     const img = document.createElement('img');
//     img.style.display = 'inline-block';
//     img.src = imgPath;
//     img.addEventListener('load', () => {
//       resolve(img);
//     });
//     img.addEventListener('error', () => {
//       reject('There was an Error');
//     });
//   });
// }
//
// async function loadAll(imgArr) {
//   try {
//     const imgs = imgArr.map(async imgPath =>
//       await createImage(imgPath));
//     const imgsEl = await Promise.all(imgs);
//     imgsEl.forEach((img) => {
//       img.classList.add('parallel');
//     });
//     return imgsEl;
//
//   } catch (e) {
//   }
//   return null;
//
// }
//
// function renderImages(imgs) {
//   document.querySelector('.images').innerHTML = '';
//   for (let img of imgs) {
//     document.querySelector('.images').insertAdjacentElement('beforeend', img);
//   }
// }
//
// async function main() {
//   try {
//     const images = await loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);
//     renderImages(images);
//   } catch (e) {
//     console.error(e);
//   }
//   return null;
// }
//
// main();
//

// async function get3Countries(c1, c2, c3) {
//   const fetches = [
//     fetch(`https://restcountries.com/v2/name/${c1}`),
//     fetch(`https://restcountries.com/v2/name/${c2}`),
//     fetch(`https://restcountries.com/v2/name/${c3}`)
//   ];
//   const response = await Promise.all(fetches);
//   const jsonResponse = response.map((res) => res.json());
//   const data = await Promise.allSettled(jsonResponse);
//   console.log(data.map((d) => d?.value[0]?.capital));
// }
//
// get3Countries('Germany', 'Sweden', 'Denmark');
//
