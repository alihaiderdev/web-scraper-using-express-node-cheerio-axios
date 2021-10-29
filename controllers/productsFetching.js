const axios = require('axios');
const cheerio = require('cheerio');

exports.fetchProducts = async (req, res) => {
  try {
    // const protectedRoutesList = ['Poco X2', 'Infinix Hot 9'];
    // const categoriesViseUrlList = ['Mi', 'Realme', 'Samsung', 'Infinix', 'OPPO', 'apple', 'Vivo', 'Honor', 'Asus'];
    const categoriesViseUrlList = ['Mi'];
    const categories = [];
    let totalProducts = 0;
    for (let category = 0; category < categoriesViseUrlList.length; category++) {
      let products = [],
        productNumber = 1,
        pages;
      const response = await axios(
        `https://www.flipkart.com/mobiles/pr?sid=tyy%2C4io&p%5B%5D=facets.brand%255B%255D%3D${categoriesViseUrlList[category]}&otracker=nmenu_sub_Electronics_0_${categoriesViseUrlList[category]}`
        // `https://www.flipkart.com/mobiles/pr?sid=tyy%2C4io&p%5B%5D=facets.brand%255B%255D%3Dapple&otracker=nmenu_sub_Electronics_0_apple`
      );
      cheerio
        .load(response.data)('._2MImiq', response.data)
        .each(function () {
          pages = cheerio.load(response.data)(this).find('span').first().text().split('of')[1];
        });
      for (let i = 0; i <= pages; i++) {
        const query = i === 0 ? '' : `&page=${i}`;
        const response = await axios(
          `https://www.flipkart.com/mobiles/pr?sid=tyy%2C4io&p%5B%5D=facets.brand%255B%255D%3D${categoriesViseUrlList[category]}&otracker=nmenu_sub_Electronics_0_${categoriesViseUrlList[category]}${query}`
        );
        if (i < 1) {
          i++;
        }
        console.log('query : ', query);
        const html = response.data;
        const $ = cheerio.load(html);
        $('._1fQZEK', html).each(function () {
          const image = $(this).find('._396cs4 ').attr('src');
          const title = $(this).find('._4rR01T').text();
          const p1 = $(this).find('._30jeq3')?.text()?.split('₹')[1];
          const price = p1?.split(',').join('');
          const features = [];
          //   :nth-child(2)
          const featuresLength = $(this).find('._1xgFaf')?.children('li').length;
          //   features.push($(this).find('._1xgFaf')?.children('li').text());
          products.push({ productNumber: productNumber++, image, title, price, features: featuresLength });
        });
      }
      products.unshift({ categoryViseProductsCount: products.length });
      categories.push({ category: categoriesViseUrlList[category], products });
      totalProducts += products.length - 1;
    }
    console.log('totalProducts : ', totalProducts);
    categories.unshift({ categories: categories.length, totalProducts });

    res.send(categories);
  } catch (error) {
    console.log('Error : ', error);
  }
};

//   const features = [];
//   $('div[id="list"]')
//     .find('div > div > a')
//     .each(function (index, element) {
//       features.push($(element).attr('href'));
//     });

// const response = await axios(
//   'https://www.flipkart.com/mobiles/pr?sid=tyy%2C4io&p%5B%5D=facets.brand%255B%255D%3DRealme&otracker=nmenu_sub_Electronics_0_Realme&otracker=nmenu_sub_Electronics_0_Realme&otracker=nmenu_sub_Electronics_0_Realme&otracker=nmenu_sub_Electronics_0_Realme'
// );
// const html = response.data;
// const $ = cheerio.load(html);
// $('._1fQZEK', html).each(function () {
//   const image = $(this).find('._396cs4 ').attr('src');
//   const title = $(this).find('._4rR01T').text();
//   const p1 = $(this).find('._30jeq3').text().split('₹')[1];
//   const price = p1.split(',').join('');
//   products.push({ image, title, price });
// });
