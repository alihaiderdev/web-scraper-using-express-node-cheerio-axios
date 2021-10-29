const PORT = 8080;

const express = require('express');
const app = express();
const cors = require('cors');
const { fetchProducts } = require('./controllers/productsFetching');
app.use(cors());

app.get('/', function (req, res) {
  res.send('This is my webscraper');
  //   res.json('This is my webscraper');
});

app.get('/fetchProducts', fetchProducts);

// app.get('/results', async (req, res) => {
//   try {
//     const response = await axios(url);
//     const html = response.data;
//     const $ = cheerio.load(html);
//     const products = [];
//     $('._3CuAg8', html).each(function () {
//       const title = $(this).text();
//       //   const url = $(this).find('a').attr('href');
//       products.push({ title });
//     });
//     products.unshift({ totalTitlesCount: products.length });

//     res.send(products);
//   } catch (error) {
//     console.log('Error : ', error);
//   }
// });

app.listen(PORT, () => console.log(`server running on PORT http://localhost:${PORT}`));
