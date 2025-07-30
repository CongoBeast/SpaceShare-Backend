const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

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

cloudinary.config({
  cloud_name: "dxxlrzouc",
  api_key: "191187614991536",
  api_secret: "9b75q3SXcar-yJFsWQsfXWFhnM8",
});


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

  app.post('/create-chat', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "chats",
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

  // check if a chat already exists 
  app.post('/check-chat', async (req, res) => {
    const { userId, recieverName } = req.body;
  
    if (!userId || !recieverName) {
      return res.status(400).json({ error: 'Both userId and recieverName are required' });
    }
  
    const data = JSON.stringify({
      collection: "chats",
      database: "carryon",
      dataSource: "Cluster0",
      filter: {
        $or: [
          { userId, recieverName },
          { userId: recieverName, recieverName: userId } // reverse match
        ]
      }
    });
  
    try {
      const response = await axios({
        ...apiConfig,
        url: `${apiConfig.urlBase}findOne`,
        data,
      });
  
      if (response.data.document) {
        console.log("This chat exists")
        return res.json({ exists: true, chat: response.data.document });
      } else {
        console.log("This chat doesnt exists")
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking chat existence:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.post('/get-chats', (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    } else {
      console.log("username is valid");
    }
  
    const data = JSON.stringify({
      collection: "chats",
      database: "carryon",
      dataSource: "Cluster0",
      filter: {
        $or: [
          { userId: username },
          { recieverName: username }
        ]
      },
      sort: {
        lastTimestamp: -1  // Descending order
      }
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
  
  
  app.post('/send-message', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "messages",
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

  app.post('/get-messages', (req, res) => {
    const { chatId } = req.body;

    console.log(chatId)
  
    if (!chatId) {
      return res.status(400).json({ error: 'Username is required' });
    }
    else{
      console.log("username is vlid")
    }
  
    const data = JSON.stringify({
      collection: "messages",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { chatId: chatId },
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        console.log(response.data)
        res.json(response.data.documents);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });



  app.put('/edit-chats/:id', async (req, res) => {
    const { id } = req.params; 
    const updateData = req.body; 

    console.log(id)

    const data = JSON.stringify({
        collection: "chats", 
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



app.post('/submit-package', (req, res) => {
  const packageData = req.body;

  if (!packageData._id) {
    packageData._id = generateId();
  }

  // Add the datePosted timestamp
  packageData.datePosted = new Date().toISOString();

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


  app.post('/add-request', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "requests",
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

app.get('/packages/by-user', (req, res) => {
  const username = req.query.username;
  const type = req.query.type;
  const pipeline = [];

  // Match by username
  if (username) {
    pipeline.push({
      $match: {
        username: username,
      },
    });
  }

  // Optionally match by type if provided
  if (type === 'sell' || type === 'buy') {
    pipeline.push({
      $match: {
        type: type,
      },
    });
  }

  // Filter out expired packages
  pipeline.push({
    $match: {
      expirationDate: {
        $gt: new Date(),
      },
    },
  });

  // Sort by departureDate ascending
  pipeline.push({
    $sort: {
      departureDate: 1,
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

app.get('/sent-requests/by-user', (req, res) => {
  const username = req.query.username;
  const status = req.query.type;
  const pipeline = [];

  // Match by username
  if (username) {
    pipeline.push({
      $match: {
        reqquestee: username,
      },
    });
  }

  // Optionally match by type if provided
  if (status === 'Pending' || status === 'Accepted') {
    pipeline.push({
      $match: {
        status: status,
      },
    });
  }

  // Sort by departureDate ascending
  pipeline.push({
    $sort: {
      departureDate: 1,
    },
  });

  const data = JSON.stringify({
    collection: 'requests',
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

app.get('/recieved-requests/by-user', (req, res) => {
  const username = req.query.username;
  const status = req.query.type;
  const pipeline = [];

  // Match by username
  if (username) {
    pipeline.push({
      $match: {
        userId: username,
      },
    });
  }

  // Optionally match by type if provided
  if (status === 'Pending' || status === 'Accepted') {
    pipeline.push({
      $match: {
        status: status,
      },
    });
  }

  // Sort by departureDate ascending
  pipeline.push({
    $sort: {
      departureDate: 1,
    },
  });

  const data = JSON.stringify({
    collection: 'requests',
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

app.put('/edit-request/:id', async (req, res) => {
  const { id } = req.params; 
  const updateData = req.body; 

  const data = JSON.stringify({
      collection: "request", 
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


    const registerUser = async (userData) => {
      try {
        // Check if the username exists
        let response = await axiosInstance.post('findOne', {
          dataSource: 'Cluster0',
          database: 'carryon',
          collection: 'users',
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
    
        const { hashedPassword, ...rest } = userData;
    
        // Register the new user
        response = await axiosInstance.post('insertOne', {
          dataSource: 'Cluster0',
          database: 'carryon',
          collection: 'users',
          document: {
            ...rest,
            hashedPassword: hashedPassword,
            signupTimestamp: new Date(),
          },
        });
    
        const token = generateToken();
    
        return { status: 200, token };
      } catch (error) {
        console.error('Error registering user:', error);
        return { status: 500, message: 'Internal server error' };
      }
    };
    

  const registerShipper = async (userData) => {

    try {
      // Check if the username exists
      let response = await axiosInstance.post('findOne', {
        dataSource: 'Cluster0', // Replace with your data source name
        database: 'carryon', // Replace with your database name
        collection: 'shippers', // Replace with your collection name
        filter: { "completeUserData.userID": userData.completeUserData.userID },
      });
  
      if (response.data.document) {
        return { status: 400, message: 'Username already exists' };
      }
  
      // Check if the email exists
      response = await axiosInstance.post('findOne', {
        dataSource: 'Cluster0',
        database: 'carryon',
        collection: 'shippers',
        filter: { email: userData.completeUserData.email },
      });
  
      if (response.data.document) {
        return { status: 400, message: 'Email already registered' };
      }
  
      // Register the new user
      response = await axiosInstance.post('insertOne', {
        dataSource: 'Cluster0',
        database: 'carryon',
        collection: 'shippers',
        document: { ...userData, signupTimestamp: new Date() },
      });
  
      const token = generateToken() // Assume you have a function to generate tokens
  
      return { status: 200, token };
    } catch (error) {
      console.error('Error registering user:', error);
      return { status: 500, message: 'Internal server error' };
    }
  };

  app.post('/update-user', (req, res) => {

    const packageData = req.body;

    const { filter, update } = packageData;

    console.log(filter)
    
    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }
  
    const data = JSON.stringify({
      collection: "users",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { 
        "_id": { "$oid": filter._id } // Wrap the ID in $oid
      },
      update: { "$set": update }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}updateOne`,
      data
    })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).send(error);
      });
  });


  app.put('/update-notification/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    const data = JSON.stringify({
      collection: "notifications",   // Use your actual collection name
      database: "carryon",
      dataSource: "Cluster0",
      filter: { _id: { "$oid": id } },
      update: { $set: updateData },
    });
  
    try {
      const response = await axios({
        ...apiConfig,
        url: `${apiConfig.urlBase}updateOne`,
        data,
      });
  
      res.json({ success: true, result: response.data });
    } catch (error) {
      console.error('Error updating notification:', error.response?.data || error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

app.post('/get-user', (req, res) => {
    const { username } = req.body;
    

    if (!username) {
      return res.status(400).json({ error: 'UserId is required' });
    }
  
    const data = JSON.stringify({
      collection: "users",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { "username": username },
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        res.json(response.data.documents);
        console.log(response.data.documents)
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });

  app.post('/delete-user', (req, res) => {

    const packageData = req.body;

    const { filter, update } = packageData;

    console.log(filter)
    
    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }
  
    const data = JSON.stringify({
      collection: "users",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { 
        "_id": { "$oid": filter._id } // Wrap the ID in $oid
      },
      update: { "$set": update }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}updateOne`,
      data
    })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).send(error);
      });
  });

  
  app.post('/register', async (req, res) => {
    try {
      const userData = { ...req.body };
      userData.hashedPassword = await encryptPassword(userData.password);
      delete userData.password;
      delete userData.confirmPassword;
  
      const response = await registerUser(userData);
  
      if (response.status === 200) {
        res.json({ token: response.token });
      } else {
        res.status(response.status).json({ message: response.message });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Registration failed' });
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





  // Register shipper
  app.post('/register-shipper', async (req, res) => {
    var userData = {}
    userData = req.body;

    // console.log(req.body)

    const hashedPassword = await encryptPassword(userData.password)

    const completeUserData = {
      ...userData,          // Spread all existing user data
      hashedPassword,       // Add the hashed password
      registrationDate: new Date(),
      lastLoggedIn: new Date(),
      isLoggedOn: false
    };

    // console.log(hashedPassword)
  
    const response = await registerShipper({ completeUserData });
  
    if (response.status === 200) {
      res.json({ token: response.token });
    } else {
      res.status(response.status).json({ message: response.message });
    }
  });
  
  // Login shipper
  app.post('/login-shipper', (req, res) => {
    const { companyName, password } = req.body;

    console.log(companyName)
  
    const data = JSON.stringify({
      "collection": "shippers",
      "database": "carryon",
      "dataSource": "Cluster0",
      "filter": { "completeUserData.companyName": companyName }
    });
  
    axios({ ...apiConfig, url: `${apiConfig.urlBase}findOne`, data })
      .then(response => {
        const user = response.data.document;


        if (user && bcrypt.compareSync(password, user.completeUserData.hashedPassword)) {
          const token = jwt.sign({ userId: user.completeUserData.userID }, JWT_SECRET, { expiresIn: '1h' });
  
          console.log(user.completeUserData.userID)
          // Update user's loggedOn status and loginTimestamp
          const loginTimestamp = new Date().toISOString();
          const updateData = JSON.stringify({
            "collection": "shippers",
            "database": "carryon",
            "dataSource": "Cluster0",
            "filter": { "completeUserData.userID": user.completeUserData.userID },
            "update": { "$set": { "completeUserData.isLoggedOn": true, loginTimestamp } }
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


  app.post('/get-shipper', (req, res) => {
    const { companyName } = req.body;
    

    if (!companyName) {
      return res.status(400).json({ error: 'UserId is required' });
    }
  
    const data = JSON.stringify({
      collection: "shippers",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { "completeUserData.companyName": companyName },
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

  app.post('/update-shipper', (req, res) => {

    const packageData = req.body;

    const { filter, update } = packageData;

    console.log(filter)
    
    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }
  
    const data = JSON.stringify({
      collection: "shippers",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { 
        "_id": { "$oid": filter._id } // Wrap the ID in $oid
      },
      update: { "$set": update }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}updateOne`,
      data
    })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).send(error);
      });
  });

  app.post('/get-all-shippers', (req, res) => {
    const data = JSON.stringify({
      collection: "shippers",
      database: "carryon",
      dataSource: "Cluster0",
      filter: {}, // No condition
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


  app.post('/set-rate', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "rates",
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

  app.post('/update-rate', (req, res) => {
    const packageData = req.body;
  
    if (!packageData._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }
  
    const data = JSON.stringify({
      collection: "rates",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { _id: packageData._id } ,  // Make sure _id is a valid ObjectId string
      update: { "$set": packageData }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}updateOne`,
      data
    })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).send(error);
      });
  });

  app.post('/get-rates', (req, res) => {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'UserId is required' });
    }
  
    const data = JSON.stringify({
      collection: "rates",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { companyId : companyId},
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        res.json(response.data.documents);
        console.log(response.data)
        console.log("in get lead times function");

      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });


// set and get lead times
  app.post('/set-leadTimes', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const data = JSON.stringify({
      "collection": "leadTimes",
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

  app.post('/update-leadTimes', (req, res) => {
    const packageData = req.body;
  
    if (!packageData._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }
  
    const data = JSON.stringify({
      collection: "leadTimes",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { _id: packageData._id },
      update: { "$set": packageData }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}updateOne`,
      data
    })
      .then(response => {
        res.json(response.data);
      })
      .catch(error => {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).send(error);
      });
  });
  

  app.post('/get-leadTimes', (req, res) => {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    const data = JSON.stringify({
      collection: "leadTimes",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { companyId : companyId},
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

  // Multer setup to store files temporarily
const upload = multer({ dest: 'uploads/' });

// Upload route
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'chat_avatars', // Optional: target folder in Cloudinary
    });

    // Remove temp file
    fs.unlinkSync(filePath);

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
});



// set the reviews
  app.post('/set-reviews', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const data = JSON.stringify({
      "collection": "reviews",
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

    app.post('/get-reviews', (req, res) => {
    const { companyId } = req.body;

    console.log("reviews company ID" , companyId)
  
    if (!companyId) {
      return res.status(400).json({ error: 'Username is required' });
    }
  
    const data = JSON.stringify({
      collection: "reviews",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { companyID: companyId },
      sort: { createdAt: -1 }
    });
  
    axios({
      ...apiConfig,
      url: `${apiConfig.urlBase}find`,
      data,
    })
      .then((response) => {
        res.json(response.data.documents);
        console.log(response.data.documents)
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send(error);
      });
  });


  app.post('/set-packing-list', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "packing-list",
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

    app.post('/set-shipment', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "shipments",
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
  

  app.post('/get-shipments', (req, res) => {
    const { companyId } = req.body;

    // console.log("shipments company ID" , companyId)
  
    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }
  
    const data = JSON.stringify({
      collection: "shipments",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { shipperID: companyId },
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

app.post('/track', (req, res) => {
    const { trackingId } = req.body;

    if (!trackingId) {
        return res.status(400).json({ error: 'Tracking ID is required' });
    }

    const data = JSON.stringify({
        collection: "shipments",
        database: "carryon",
        dataSource: "Cluster0",
        filter: { 
            shipmentID: trackingId 
        },
        // Projection to include only necessary fields
        projection: {
            shipperID: 1,
            transportMode: 1,
            status: 1,
            currentLocation: 1,
            eta: 1,
            timestamps: 1,
            createdAt: 1,
            clientsCount: 1
        }
    });

    axios({
        ...apiConfig,
        url: `${apiConfig.urlBase}findOne`,
        data
    })
    .then(response => {
        if (response.data.document) {
            res.json(response.data.document);
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    });
});

  app.post('/update-shipments', (req, res) => {
  const packageData = req.body;
  const { filter, update } = packageData;

  if (!filter._id) {
    return res.status(400).json({ error: 'Missing _id for update.' });
  }

  // Modified to handle both direct updates and timestamp pushes
  const updateOperation = {
    ...(update.timestamps ? { 
      $push: { timestamps: update.timestamps },
      $set: {
        currentLocation: update.currentLocation,
        status: update.status,
        eta: update.eta
      }
    } : { $set: update })
  };

  const data = JSON.stringify({
    collection: "shipments",
    database: "carryon",
    dataSource: "Cluster0",
    // filter: { "_id": { "$oid": filter._id }},
    filter: { _id: filter._id },
    update: updateOperation
  });

  axios({
    ...apiConfig,
    url: `${apiConfig.urlBase}updateOne`,
    data
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).send(error);
    });
});


  app.post('/set-announcements', (req, res) => {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }
  
    const data = JSON.stringify({
      "collection": "announcements",
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

    app.post('/get-announcements', (req, res) => {
    const { companyId } = req.body;

    // console.log("shipments company ID" , companyId)
  
    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }
  
    const data = JSON.stringify({
      collection: "announcements",
      database: "carryon",
      dataSource: "Cluster0",
      filter: { companyId: companyId },
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

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
