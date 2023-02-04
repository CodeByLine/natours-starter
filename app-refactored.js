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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
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
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Error',
      message: 'Tour not found',
    });
  }
  res.status(200).json({
    status: 'Success',
    // results: tours.length,
    data: {
      tour: '<Updated Tour Here>',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    // message: 'Tour deleted',
    // results: tours.length,
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//route chained together
app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 8000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}... `);
});
