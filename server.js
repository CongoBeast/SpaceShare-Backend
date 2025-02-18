const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret'; // Use a strong, secret key in production

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const generateToken = (userId) => {
    const secretKey = 'your-secret-key'; // Replace with your own secret key
    const expiresIn = '1h'; // Token expiration time, e.g., 1 hour
    const payload = { sub: userId,  iat: Math.floor(Date.now() / 1000), // Issued at time (current time in seconds)
    };
    return jwt.sign(payload, secretKey, { expiresIn });;
  };


async function encryptPassword(password) {
    try {
      // Define the number of salt rounds
      const saltRounds = 10;
  
      // Generate the salt
      const salt = await bcrypt.genSalt(saltRounds);
  
      // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      console.log('Encrypted Password:', hashedPassword);
      return hashedPassword;
    } catch (error) {
      console.error('Error encrypting password:', error);
    }
  }

const generateId = () => {
    return crypto.randomBytes(12).toString('hex'); // Generates a 24-character hexadecimal string
  };

const apiConfig = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '4graSqucDumhuePX7lpf75s6TrTFkwYXU1KN2h6vN3j72edWz6oue9BBFYOHvfUC',
    },
    urlBase: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-nmutxbv/endpoint/data/v1/action/'
  };

const axiosInstance = axios.create({
    baseURL: apiConfig.urlBase,
    headers: apiConfig.headers,
  });


app.post('/submit-package', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "packages",
      "database": "carryon",
      "dataSource": "Cluster0",
      "document": packageData
    });
  
    axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });

  app.put('/edit-offer/:id', async (req, res) => {
    const { id } = req.params; 
    const updateData = req.body; 

    console.log(id)

    const data = JSON.stringify({
        collection: "packages", 
        database: "carryon", 
        dataSource: "Cluster0",
        filter: { _id: id }, 
        update: { $set: updateData }, 
    });

    axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
        .then(response => res.json(response.data))
        .catch(error => {
            console.error('Error updating offer:', error);
            res.status(500).send(error);
        });
});

app.delete('/delete-offer/:id', async (req, res) => {
  const { id } = req.params;

  const data = JSON.stringify({
      collection: "packages", 
      database: "carryon", 
      dataSource: "Cluster0",
      filter: { _id: id }, 
  });

  console.log(id)

  axios({ ...apiConfig, url: `${apiConfig.urlBase}deleteOne`, data })
      .then(response => res.json(response.data))
      .catch(error => {
          console.error('Error deleting offer:', error);
          res.status(500).send(error);
      });
});



  app.post('/set-notification', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "notifications",
      "database": "carryon",
      "dataSource": "Cluster0",
      "document": packageData
    });
  
    axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });

  app.post('/get-notifications', (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
  
    const data = JSON.stringify({
      collection: "notifications",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { username: username },
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        res.json(response.data.documents);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });
  

app.get('/packages', (req, res) => {
  const type = req.query.type; // Get the type (sell or buy) from the request
  const pipeline = [];

  // Match packages based on type (sell or buy)
  if (type === 'sell' || type === 'buy') {
    pipeline.push({
      $match: {
        type: type, // Filter by type (sell or buy)
      },
    });
  }

  // Filter out expired packages
  pipeline.push({
    $match: {
      expirationDate: {
        $gt: new Date(), // Only include packages where expirationDate is greater than the current date
      },
    },
  });

  // Add a $sort stage to sort by departureDate in ascending order (earliest first)
  pipeline.push({
    $sort: {
      departureDate: 1, // 1 for ascending order (earliest first)
    },
  });

  const data = JSON.stringify({
    collection: 'packages',
    database: 'carryon',
    dataSource: 'Cluster0',
    pipeline: pipeline,
  });

  axios({ ...apiConfig, url: `${apiConfig.urlBase}aggregate`, data })
    .then((response) => {
      res.json(response.data.documents);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send(error);
    });
});


  const registerUser = async (userData) => {

    console.log(userData)

    try {
      // Check if the username exists
      let response = await axiosInstance.post('findOne', {
        dataSource: 'Cluster0', // Replace with your data source name
        database: 'carryon', // Replace with your database name
        collection: 'users', // Replace with your collection name
        filter: { username: userData.username },
      });
  
      if (response.data.document) {
        return { status: 400, message: 'Username already exists' };
      }
  
      // Check if the email exists
      response = await axiosInstance.post('findOne', {
        dataSource: 'Cluster0',
        database: 'carryon',
        collection: 'users',
        filter: { email: userData.email },
      });
  
      if (response.data.document) {
        return { status: 400, message: 'Email already registered' };
      }
  
      // Register the new user
      response = await axiosInstance.post('insertOne', {
        dataSource: 'Cluster0',
        database: 'carryon',
        collection: 'users',
        document: { ...userData, signupTimestamp: new Date() },
      });
  
      const token = generateToken() // Assume you have a function to generate tokens
  
      return { status: 200, token };
    } catch (error) {
      console.error('Error registering user:', error);
      return { status: 500, message: 'Internal server error' };
    }
  };
  
  
  // Register User
  app.post('/register', async (req, res) => {
    const { username, password, email, userType } = req.body;

    const hashedPassword = await encryptPassword(password)

    console.log(hashedPassword)
  
    const response = await registerUser({ username, hashedPassword, email, userType });
  
    if (response.status === 200) {
      res.json({ token: response.token });
    } else {
      res.status(response.status).json({ message: response.message });
    }
  });
  
  // Login User
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // console.log(bcrypt.hash(password, 10))
  
    const data = JSON.stringify({
      "collection": "users",
      "database": "carryon",
      "dataSource": "Cluster0",
      "filter": { username }
    });
  
    axios({ ...apiConfig, url: `${apiConfig.urlBase}findOne`, data })
      .then(response => {
        const user = response.data.document;

        console.log(user.hashedPassword)
        if (user && bcrypt.compareSync(password, user.hashedPassword)) {
          const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
          // Update user's loggedOn status and loginTimestamp
          const loginTimestamp = new Date().toISOString();
          const updateData = JSON.stringify({
            "collection": "users",
            "database": "carryon",
            "dataSource": "Cluster0",
            "filter": { "_id": user._id },
            "update": { "$set": { isLoggedOn: true, loginTimestamp } }
          });
  
          axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data: updateData })
            .then(() => res.json({ token }))
            .catch(error => res.status(500).send(error));
  
        } else {
          res.status(401).send('Invalid credentials');
        }
      })
      .catch(error => res.status(500).send(error));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  