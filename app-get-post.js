const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json()); // middleware
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello World!');
//   res.status(200).json({ message: 'Hello World!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('oh hi!');
//   //   res.status(200).json(req.body);
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  // const { id } = req.query;
  // console.log(req.params);
  const id = req.params.id * 1; // convert fr string to number
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'Error',
      message: 'Tour not found',
    });
  }

  // A simplistic solution
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'Error',
  //     message: 'Tour not found',
  //   });
  // }

  res.status(200).json({
    status: 'Success',
    // results: tours.length,
    data: {
      // id: id,
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('Done!');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}... `);
});
