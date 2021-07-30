const searchCoin = () => {
  const button = document.querySelector('.button-search');
  button.addEventListener('click', getImputValue);
};

const clearCoins = () => {
  const button = document.querySelector('.clear-button');
  button.addEventListener('click', clear);
};

const getImputValue = () => {
  const input = document.querySelector('#coin').value;
  const inputUpperCase = input.toUpperCase();
  clear();
  return input === ''
    ? alertMessage('Moeda deve ser informada')
    : getApiInfo(inputUpperCase);
};

const addElements = (value) => {
  const sectionApi = document.querySelector('.api-container');
  const li = document.createElement('li');
  sectionApi.appendChild(li);
  li.innerHTML = value;
};

/*
UTILIZANDO FETCH, THEN E CATCH
const getApiInfo = (coin) => {
  const endPoint = `https://api.ratesapi.io/api/latest?base=${coin}`
  fetch(endPoint)
    .then(response => response.json())
    .then(data => {
      // console.log(data.error);
      if (data.error) {
        throw new Error(data.error)
      } else {
        handleRates(data.rates);
      }
    })
    .catch(error => alertMessage(error))
}

CONVERSÃO BASEADA NO VALOR DO EUR:
1 EUR - 6.036967 BRL
1 EUR - 1.187936 USD

6.036967 BRL = 1.187936 USD
    1        =   X
1 BRL = 6.036967 / 1.187936 = 5.08
*/

const convertCoin = (coin, coins) => {
  // VALOR DO EUR EM RELAÇÃO A ALGUMA MOEDA
  const baseCoinName = coin.toUpperCase();
  const baseCoinValue = coins[baseCoinName];
  let data = {};
  const listCoinsBase = Object.entries(coins);
  for (let i = 0; i <= listCoinsBase.length - 1; i += 1) {
    const newCoin = listCoinsBase[i];
    const convertValueCoin =
      Math.round((baseCoinValue / newCoin[1]) * 100) / 100;
    data = { ...data, [newCoin[0]]: convertValueCoin };
  }
  const listCoins = {
    base: baseCoinName,
    data,
  };
  return listCoins;
};

// UTILIZANDO TRY CATCH, ASYNC E AWAIT
const getApiInfo = async (coin) => {
  const myKey = '8054368420c2240af09996bb326814e0';
  const endPoint = `http://api.exchangeratesapi.io/v1/latest?access_key=${myKey}`;
  const endPointBtc = `https://api.coindesk.com/v1/bpi/currentprice/${coin}.json`;
  if (coin === 'BTC') {
    return apiBTC();
  }
  try {
    const response = await fetch(endPoint);
    const data = await response.json();
    // console.log(data.rates);

    const responseBtc = await fetch(endPointBtc);
    const objectBtc = await responseBtc.json();
    // console.log(objectBtc.bpi[coin].rate);
    const number = objectBtc.bpi[coin].rate;
    const numberSplit = number.split(',');
    const numberJoin = numberSplit.join('');
    // console.log(numberJoin);
    const result = convertCoin(coin, data.rates);
    result.data['BTC'] = parseFloat(numberJoin);
    console.log(result);

    if (data.error) {
      throw new Error(data.error);
    } else {
      handleRates(result);
    }
  } catch (error) {
    alertMessage('Moeda Inválida');
  }
};

const apiBTC = () => {
  const endPoint = `https://api.coindesk.com/v1/bpi/currentprice.json`;
  fetch(endPoint)
    .then((response) => response.json())
    .then((data) => {
      Object.entries(data.bpi).forEach((object) => {
        newRateBTC(object[1]);
      });
    });
};
// apiBTC();

const newRateBTC = (coin) => {
  rateCoin = parseFloat(coin.rate.replace(',', ''), 10);
  let message = `01 ${coin.code} = ${rateCoin.toFixed(2)} BTC`;
  // console.log(parseFloat(coin.rate));
  addElements(message);
};

const handleRates = ({base, data}) => {
  let array = Object.entries(data);
  // console.log(array.sort());
  let newArray = array.sort();
  newArray.forEach((array) => handleArray(base, array));
};

const handleArray = (base, [keys, value]) => {
  let message = `01 ${keys} = ${value.toFixed(2)} ${base}`;
  addElements(message);
};

const clear = () => {
  const apiContainer = document.querySelector('.api-container');
  apiContainer.innerHTML = '';
};

const alertMessage = (message) => {
  window.alert(message);
};

window.onload = () => {
  searchCoin();
  clearCoins();
};
