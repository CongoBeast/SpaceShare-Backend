// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors');
// const crypto = require('crypto');
// const moment = require('moment');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');


// const multer = require('multer');
// const { v2: cloudinary } = require('cloudinary');
// const dotenv = require('dotenv');
// const fs = require('fs');

// dotenv.config();

// const app = express();
// const PORT = 3001;
// app.use(express.json());

// const JWT_SECRET = 'your_jwt_secret'; // Use a strong, secret key in production

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// const generateToken = (userId) => {
//     const secretKey = 'your-secret-key'; // Replace with your own secret key
//     const expiresIn = '1h'; // Token expiration time, e.g., 1 hour
//     const payload = { sub: userId,  iat: Math.floor(Date.now() / 1000), // Issued at time (current time in seconds)
//     };
//     return jwt.sign(payload, secretKey, { expiresIn });;
//   };

// cloudinary.config({
//   cloud_name: "dxxlrzouc",
//   api_key: "191187614991536",
//   api_secret: "9b75q3SXcar-yJFsWQsfXWFhnM8",
// });


// async function encryptPassword(password) {
//     try {
//       // Define the number of salt rounds
//       const saltRounds = 10;
  
//       // Generate the salt
//       const salt = await bcrypt.genSalt(saltRounds);
  
//       // Hash the password with the salt
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       console.log('Encrypted Password:', hashedPassword);
//       return hashedPassword;
//     } catch (error) {
//       console.error('Error encrypting password:', error);
//     }
//   }

// const generateId = () => {
//     return crypto.randomBytes(12).toString('hex'); // Generates a 24-character hexadecimal string
//   };

// const apiConfig = {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Request-Headers': '*',
//       'api-key': '4graSqucDumhuePX7lpf75s6TrTFkwYXU1KN2h6vN3j72edWz6oue9BBFYOHvfUC',
//     },
//     urlBase: 'https://ap-south-1.aws.data.mongodb-api.com/app/data-nmutxbv/endpoint/data/v1/action/'
//   };

//   // 940f3190-a288-460e-8c8d-0b1eacdd115c

// const axiosInstance = axios.create({
//     baseURL: apiConfig.urlBase,
//     headers: apiConfig.headers,
//   });

//   app.post('/create-chat', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "chats",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   // check if a chat already exists 
//   app.post('/check-chat', async (req, res) => {
//     const { userId, recieverName } = req.body;
  
//     if (!userId || !recieverName) {
//       return res.status(400).json({ error: 'Both userId and recieverName are required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "chats",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: {
//         $or: [
//           { userId, recieverName },
//           { userId: recieverName, recieverName: userId } // reverse match
//         ]
//       }
//     });
  
//     try {
//       const response = await axios({
//         ...apiConfig,
//         url: `${apiConfig.urlBase}findOne`,
//         data,
//       });
  
//       if (response.data.document) {
//         console.log("This chat exists")
//         return res.json({ exists: true, chat: response.data.document });
//       } else {
//         console.log("This chat doesnt exists")
//         return res.json({ exists: false });
//       }
//     } catch (error) {
//       console.error('Error checking chat existence:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  

//   app.post('/get-chats', (req, res) => {
//     const { username } = req.body;
  
//     if (!username) {
//       return res.status(400).json({ error: 'Username is required' });
//     } else {
//       console.log("username is valid");
//     }
  
//     const data = JSON.stringify({
//       collection: "chats",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: {
//         $or: [
//           { userId: username },
//           { recieverName: username }
//         ]
//       },
//       sort: {
//         lastTimestamp: -1  // Descending order
//       }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });
  
  
//   app.post('/send-message', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "messages",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/get-messages', (req, res) => {
//     const { chatId } = req.body;

//     console.log(chatId)
  
//     if (!chatId) {
//       return res.status(400).json({ error: 'Username is required' });
//     }
//     else{
//       console.log("username is vlid")
//     }
  
//     const data = JSON.stringify({
//       collection: "messages",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { chatId: chatId },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         console.log(response.data)
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });



//   app.put('/edit-chats/:id', async (req, res) => {
//     const { id } = req.params; 
//     const updateData = req.body; 

//     console.log(id)

//     const data = JSON.stringify({
//         collection: "chats", 
//         database: "meli-flow-prod", 
//         dataSource: "Cluster0",
//         filter: { _id: id }, 
//         update: { $set: updateData }, 
//     });

//     axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
//         .then(response => res.json(response.data))
//         .catch(error => {
//             console.error('Error updating offer:', error);
//             res.status(500).send(error);
//         });
// });



// app.post('/submit-package', (req, res) => {
//   const packageData = req.body;

//   if (!packageData._id) {
//     packageData._id = generateId();
//   }

//   // Add the datePosted timestamp
//   packageData.datePosted = new Date().toISOString();

//   const data = JSON.stringify({
//     "collection": "packages",
//     "database": "meli-flow-prod",
//     "dataSource": "Cluster0",
//     "document": packageData
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//     .then(response => {
//       res.json(response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       res.status(500).send(error);
//     });
// });


//   app.post('/add-request', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "requests",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });


//   app.put('/edit-offer/:id', async (req, res) => {
//     const { id } = req.params; 
//     const updateData = req.body; 

//     console.log(id)

//     const data = JSON.stringify({
//         collection: "packages", 
//         database: "meli-flow-prod", 
//         dataSource: "Cluster0",
//         filter: { _id: id }, 
//         update: { $set: updateData }, 
//     });

//     axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
//         .then(response => res.json(response.data))
//         .catch(error => {
//             console.error('Error updating offer:', error);
//             res.status(500).send(error);
//         });
// });

// app.delete('/delete-offer/:id', async (req, res) => {
//   const { id } = req.params;

//   const data = JSON.stringify({
//       collection: "packages", 
//       database: "meli-flow-prod", 
//       dataSource: "Cluster0",
//       filter: { _id: id }, 
//   });

//   console.log(id)

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}deleteOne`, data })
//       .then(response => res.json(response.data))
//       .catch(error => {
//           console.error('Error deleting offer:', error);
//           res.status(500).send(error);
//       });
// });



//   app.post('/set-notification', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "notifications",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/get-notifications', (req, res) => {
//     const { username } = req.body;
  
//     if (!username) {
//       return res.status(400).json({ error: 'Username is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "notifications",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { username: username },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });
  

// app.get('/packages', (req, res) => {
//   const type = req.query.type; // Get the type (sell or buy) from the request
//   const pipeline = [];

//   // Match packages based on type (sell or buy)
//   if (type === 'sell' || type === 'buy') {
//     pipeline.push({
//       $match: {
//         type: type, // Filter by type (sell or buy)
//       },
//     });
//   }

//   // Filter out expired packages
//   pipeline.push({
//     $match: {
//       expirationDate: {
//         $gt: new Date(), // Only include packages where expirationDate is greater than the current date
//       },
//     },
//   });

//   // Add a $sort stage to sort by departureDate in ascending order (earliest first)
//   pipeline.push({
//     $sort: {
//       departureDate: 1, // 1 for ascending order (earliest first)
//     },
//   });

//   const data = JSON.stringify({
//     collection: 'packages',
//     database: 'meli-flow-prod',
//     dataSource: 'Cluster0',
//     pipeline: pipeline,
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}aggregate`, data })
//     .then((response) => {
//       res.json(response.data.documents);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       res.status(500).send(error);
//     });
// });

// app.get('/packages/by-user', (req, res) => {
//   const username = req.query.username;
//   const type = req.query.type;
//   const pipeline = [];

//   // Match by username
//   if (username) {
//     pipeline.push({
//       $match: {
//         username: username,
//       },
//     });
//   }

//   // Optionally match by type if provided
//   if (type === 'sell' || type === 'buy') {
//     pipeline.push({
//       $match: {
//         type: type,
//       },
//     });
//   }

//   // Filter out expired packages
//   pipeline.push({
//     $match: {
//       expirationDate: {
//         $gt: new Date(),
//       },
//     },
//   });

//   // Sort by departureDate ascending
//   pipeline.push({
//     $sort: {
//       departureDate: 1,
//     },
//   });

//   const data = JSON.stringify({
//     collection: 'packages',
//     database: 'meli-flow-prod',
//     dataSource: 'Cluster0',
//     pipeline: pipeline,
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}aggregate`, data })
//     .then((response) => {
//       res.json(response.data.documents);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       res.status(500).send(error);
//     });
// });

// app.get('/sent-requests/by-user', (req, res) => {
//   const username = req.query.username;
//   const status = req.query.type;
//   const pipeline = [];

//   // Match by username
//   if (username) {
//     pipeline.push({
//       $match: {
//         reqquestee: username,
//       },
//     });
//   }

//   // Optionally match by type if provided
//   if (status === 'Pending' || status === 'Accepted') {
//     pipeline.push({
//       $match: {
//         status: status,
//       },
//     });
//   }

//   // Sort by departureDate ascending
//   pipeline.push({
//     $sort: {
//       departureDate: 1,
//     },
//   });

//   const data = JSON.stringify({
//     collection: 'requests',
//     database: 'meli-flow-prod',
//     dataSource: 'Cluster0',
//     pipeline: pipeline,
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}aggregate`, data })
//     .then((response) => {
//       res.json(response.data.documents);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       res.status(500).send(error);
//     });
// });

// app.get('/recieved-requests/by-user', (req, res) => {
//   const username = req.query.username;
//   const status = req.query.type;
//   const pipeline = [];

//   // Match by username
//   if (username) {
//     pipeline.push({
//       $match: {
//         userId: username,
//       },
//     });
//   }

//   // Optionally match by type if provided
//   if (status === 'Pending' || status === 'Accepted') {
//     pipeline.push({
//       $match: {
//         status: status,
//       },
//     });
//   }

//   // Sort by departureDate ascending
//   pipeline.push({
//     $sort: {
//       departureDate: 1,
//     },
//   });

//   const data = JSON.stringify({
//     collection: 'requests',
//     database: 'meli-flow-prod',
//     dataSource: 'Cluster0',
//     pipeline: pipeline,
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}aggregate`, data })
//     .then((response) => {
//       res.json(response.data.documents);
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       res.status(500).send(error);
//     });
// });

// app.put('/edit-request/:id', async (req, res) => {
//   const { id } = req.params; 
//   const updateData = req.body; 

//   const data = JSON.stringify({
//       collection: "request", 
//       database: "meli-flow-prod", 
//       dataSource: "Cluster0",
//       filter: { _id: id }, 
//       update: { $set: updateData }, 
//   });

//   axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data })
//       .then(response => res.json(response.data))
//       .catch(error => {
//           console.error('Error updating offer:', error);
//           res.status(500).send(error);
//       });
// });


//     const registerUser = async (userData) => {
//       try {
//         // Check if the username exists
//         let response = await axiosInstance.post('findOne', {
//           dataSource: 'Cluster0',
//           database: 'meli-flow-prod',
//           collection: 'users',
//           filter: { username: userData.username },
//         });
    
//         if (response.data.document) {
//           return { status: 400, message: 'Username already exists' };
//         }
    
//         // Check if the email exists
//         response = await axiosInstance.post('findOne', {
//           dataSource: 'Cluster0',
//           database: 'meli-flow-prod',
//           collection: 'users',
//           filter: { email: userData.email },
//         });
    
//         if (response.data.document) {
//           return { status: 400, message: 'Email already registered' };
//         }
    
//         const { hashedPassword, ...rest } = userData;
    
//         // Register the new user
//         response = await axiosInstance.post('insertOne', {
//           dataSource: 'Cluster0',
//           database: 'meli-flow-prod',
//           collection: 'users',
//           document: {
//             ...rest,
//             hashedPassword: hashedPassword,
//             signupTimestamp: new Date(),
//           },
//         });
    
//         const token = generateToken();
    
//         return { status: 200, token };
//       } catch (error) {
//         console.error('Error registering user:', error);
//         return { status: 500, message: 'Internal server error' };
//       }
//     };
    

//   const registerShipper = async (userData) => {

//     try {
//       // Check if the username exists
//       let response = await axiosInstance.post('findOne', {
//         dataSource: 'Cluster0', // Replace with your data source name
//         database: 'meli-flow-prod', // Replace with your database name
//         collection: 'shippers', // Replace with your collection name
//         filter: { "completeUserData.userID": userData.completeUserData.userID },
//       });
  
//       if (response.data.document) {
//         return { status: 400, message: 'Username already exists' };
//       }
  
//       // Check if the email exists
//       response = await axiosInstance.post('findOne', {
//         dataSource: 'Cluster0',
//         database: 'meli-flow-prod',
//         collection: 'shippers',
//         filter: { email: userData.completeUserData.email },
//       });
  
//       if (response.data.document) {
//         return { status: 400, message: 'Email already registered' };
//       }
  
//       // Register the new user
//       response = await axiosInstance.post('insertOne', {
//         dataSource: 'Cluster0',
//         database: 'meli-flow-prod',
//         collection: 'shippers',
//         document: { ...userData, signupTimestamp: new Date() },
//       });
  
//       const token = generateToken() // Assume you have a function to generate tokens
  
//       return { status: 200, token };
//     } catch (error) {
//       console.error('Error registering user:', error);
//       return { status: 500, message: 'Internal server error' };
//     }
//   };

//   app.post('/update-user', (req, res) => {

//     const packageData = req.body;

//     const { filter, update } = packageData;

//     console.log(filter)
    
//     if (!filter._id) {
//       return res.status(400).json({ error: 'Missing _id for update.' });
//     }
  
//     const data = JSON.stringify({
//       collection: "users",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { 
//         "_id": { "$oid": filter._id } // Wrap the ID in $oid
//       },
//       update: { "$set": update }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}updateOne`,
//       data
//     })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error.response?.data || error.message);
//         res.status(500).send(error);
//       });
//   });


//   app.put('/update-notification/:id', async (req, res) => {
//     const { id } = req.params;
//     const updateData = req.body;
  
//     const data = JSON.stringify({
//       collection: "notifications",   // Use your actual collection name
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { _id: { "$oid": id } },
//       update: { $set: updateData },
//     });
  
//     try {
//       const response = await axios({
//         ...apiConfig,
//         url: `${apiConfig.urlBase}updateOne`,
//         data,
//       });
  
//       res.json({ success: true, result: response.data });
//     } catch (error) {
//       console.error('Error updating notification:', error.response?.data || error.message);
//       res.status(500).json({ success: false, error: error.message });
//     }
//   });

// app.post('/get-user', (req, res) => {
//     const { username } = req.body;
    

//     if (!username) {
//       return res.status(400).json({ error: 'UserId is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "users",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { "username": username },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//         console.log(response.data.documents)
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/delete-user', (req, res) => {

//     const packageData = req.body;

//     const { filter, update } = packageData;

//     console.log(filter)
    
//     if (!filter._id) {
//       return res.status(400).json({ error: 'Missing _id for update.' });
//     }
  
//     const data = JSON.stringify({
//       collection: "users",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { 
//         "_id": { "$oid": filter._id } // Wrap the ID in $oid
//       },
//       update: { "$set": update }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}updateOne`,
//       data
//     })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error.response?.data || error.message);
//         res.status(500).send(error);
//       });
//   });

  
//   app.post('/register', async (req, res) => {
//     try {
//       const userData = { ...req.body };
//       userData.hashedPassword = await encryptPassword(userData.password);
//       delete userData.password;
//       delete userData.confirmPassword;
  
//       const response = await registerUser(userData);
  
//       if (response.status === 200) {
//         res.json({ token: response.token });
//       } else {
//         res.status(response.status).json({ message: response.message });
//       }
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Registration failed' });
//     }
//   });
  
//   // Login User
//   app.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     // console.log(bcrypt.hash(password, 10))
  
//     const data = JSON.stringify({
//       "collection": "users",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "filter": { username }
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}findOne`, data })
//       .then(response => {
//         const user = response.data.document;

//         console.log(user.hashedPassword)
//         if (user && bcrypt.compareSync(password, user.hashedPassword)) {
//           const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  
//           // Update user's loggedOn status and loginTimestamp
//           const loginTimestamp = new Date().toISOString();
//           const updateData = JSON.stringify({
//             "collection": "users",
//             "database": "meli-flow-prod",
//             "dataSource": "Cluster0",
//             "filter": { "_id": user._id },
//             "update": { "$set": { isLoggedOn: true, loginTimestamp } }
//           });
  
//           axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data: updateData })
//             .then(() => res.json({ token }))
//             .catch(error => res.status(500).send(error));
  
//         } else {
//           res.status(401).send('Invalid credentials');
//         }
//       })
//       .catch(error => res.status(500).send(error));
//   });





//   // Register shipper
//   app.post('/register-shipper', async (req, res) => {
//     var userData = {}
//     userData = req.body;

//     // console.log(req.body)

//     const hashedPassword = await encryptPassword(userData.password)

//     const completeUserData = {
//       ...userData,          // Spread all existing user data
//       hashedPassword,       // Add the hashed password
//       registrationDate: new Date(),
//       lastLoggedIn: new Date(),
//       isLoggedOn: false
//     };

//     // console.log(hashedPassword)
  
//     const response = await registerShipper({ completeUserData });
  
//     if (response.status === 200) {
//       res.json({ token: response.token });
//     } else {
//       res.status(response.status).json({ message: response.message });
//     }
//   });
  
//   // Login shipper
//   app.post('/login-shipper', (req, res) => {
//     const { companyName, password } = req.body;

//     console.log(companyName)
  
//     const data = JSON.stringify({
//       "collection": "shippers",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "filter": { "completeUserData.companyName": companyName }
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}findOne`, data })
//       .then(response => {
//         const user = response.data.document;


//         if (user && bcrypt.compareSync(password, user.completeUserData.hashedPassword)) {
//           const token = jwt.sign({ userId: user.completeUserData.userID }, JWT_SECRET, { expiresIn: '1h' });
  
//           console.log(user.completeUserData.userID)
//           // Update user's loggedOn status and loginTimestamp
//           const loginTimestamp = new Date().toISOString();
//           const updateData = JSON.stringify({
//             "collection": "shippers",
//             "database": "meli-flow-prod",
//             "dataSource": "Cluster0",
//             "filter": { "completeUserData.userID": user.completeUserData.userID },
//             "update": { "$set": { "completeUserData.isLoggedOn": true, loginTimestamp } }
//           });
  
//           axios({ ...apiConfig, url: `${apiConfig.urlBase}updateOne`, data: updateData })
//             .then(() => res.json({ token }))
//             .catch(error => res.status(500).send(error));
  
//         } else {
//           res.status(401).send('Invalid credentials');
//         }
//       })
//       .catch(error => res.status(500).send(error));
//   });


//   app.post('/get-shipper', (req, res) => {
//     const { companyName } = req.body;
    

//     if (!companyName) {
//       return res.status(400).json({ error: 'UserId is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "shippers",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { "completeUserData.companyName": companyName },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/update-shipper', (req, res) => {

//     const packageData = req.body;

//     const { filter, update } = packageData;

//     console.log(filter)
    
//     if (!filter._id) {
//       return res.status(400).json({ error: 'Missing _id for update.' });
//     }
  
//     const data = JSON.stringify({
//       collection: "shippers",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { 
//         "_id": { "$oid": filter._id } // Wrap the ID in $oid
//       },
//       update: { "$set": update }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}updateOne`,
//       data
//     })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error.response?.data || error.message);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/get-all-shippers', (req, res) => {
//     const data = JSON.stringify({
//       collection: "shippers",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: {}, // No condition
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });


//   app.post('/set-rate', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "rates",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/update-rate', (req, res) => {
//     const packageData = req.body;
  
//     if (!packageData._id) {
//       return res.status(400).json({ error: 'Missing _id for update.' });
//     }
  
//     const data = JSON.stringify({
//       collection: "rates",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { _id: packageData._id } ,  // Make sure _id is a valid ObjectId string
//       update: { "$set": packageData }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}updateOne`,
//       data
//     })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error.response?.data || error.message);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/get-rates', (req, res) => {
//     const { companyId } = req.body;

//     if (!companyId) {
//       return res.status(400).json({ error: 'UserId is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "rates",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { companyId : companyId},
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//         console.log(response.data)
//         console.log("in get lead times function");

//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });


// // set and get lead times
//   app.post('/set-leadTimes', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }

//     const data = JSON.stringify({
//       "collection": "leadTimes",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });

//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   app.post('/update-leadTimes', (req, res) => {
//     const packageData = req.body;
  
//     if (!packageData._id) {
//       return res.status(400).json({ error: 'Missing _id for update.' });
//     }
  
//     const data = JSON.stringify({
//       collection: "leadTimes",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { _id: packageData._id },
//       update: { "$set": packageData }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}updateOne`,
//       data
//     })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error.response?.data || error.message);
//         res.status(500).send(error);
//       });
//   });
  

//   app.post('/get-leadTimes', (req, res) => {
//     const { companyId } = req.body;

//     if (!companyId) {
//       return res.status(400).json({ error: 'UserId is required' });
//     }

//     const data = JSON.stringify({
//       collection: "leadTimes",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { companyId : companyId},
//     });

//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   // Multer setup to store files temporarily
// const upload = multer({ dest: 'uploads/' });

// // Upload route
// app.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     const filePath = req.file.path;

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: 'chat_avatars', // Optional: target folder in Cloudinary
//     });

//     // Remove temp file
//     fs.unlinkSync(filePath);

//     res.json({ success: true, url: result.secure_url });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ success: false, message: 'Image upload failed.' });
//   }
// });



// // set the reviews
//   app.post('/set-reviews', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }

//     const data = JSON.stringify({
//       "collection": "reviews",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });

//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//     app.post('/get-reviews', (req, res) => {
//     const { companyId } = req.body;

//     console.log("reviews company ID" , companyId)
  
//     if (!companyId) {
//       return res.status(400).json({ error: 'Username is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "reviews",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { companyID: companyId },
//       sort: { createdAt: -1 }
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//         console.log(response.data.documents)
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });


//   app.post('/set-packing-list', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "packing-list",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//     app.post('/set-shipment', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "shipments",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });
  

//   app.post('/get-shipments', (req, res) => {
//     const { companyId } = req.body;

//     // console.log("shipments company ID" , companyId)
  
//     if (!companyId) {
//       return res.status(400).json({ error: 'companyId is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "shipments",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { shipperID: companyId },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

// app.post('/track', (req, res) => {
//     const { trackingId } = req.body;

//     if (!trackingId) {
//         return res.status(400).json({ error: 'Tracking ID is required' });
//     }

//     const data = JSON.stringify({
//         collection: "shipments",
//         database: "meli-flow-prod",
//         dataSource: "Cluster0",
//         filter: { 
//             shipperID: trackingId 
//         },
//         // Projection to include only necessary fields
//         projection: {
//             shipperID: 1,
//             transportMode: 1,
//             status: 1,
//             currentLocation: 1,
//             eta: 1,
//             timestamps: 1,
//             createdAt: 1,
//             clientsCount: 1
//         }
//     });

//     axios({
//         ...apiConfig,
//         url: `${apiConfig.urlBase}findOne`,
//         data
//     })
//     .then(response => {
//         if (response.data.document) {
//             res.json(response.data.document);
//         } else {
//             res.status(404).json({ error: 'Shipment not found' });
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     });
// });

//   app.post('/update-shipments', (req, res) => {
//   const packageData = req.body;
//   const { filter, update } = packageData;

//   if (!filter._id) {
//     return res.status(400).json({ error: 'Missing _id for update.' });
//   }

//   // Modified to handle both direct updates and timestamp pushes
//   const updateOperation = {
//     ...(update.timestamps ? { 
//       $push: { timestamps: update.timestamps },
//       $set: {
//         currentLocation: update.currentLocation,
//         status: update.status,
//         eta: update.eta
//       }
//     } : { $set: update })
//   };

//   const data = JSON.stringify({
//     collection: "shipments",
//     database: "meli-flow-prod",
//     dataSource: "Cluster0",
//     // filter: { "_id": { "$oid": filter._id }},
//     filter: { _id: filter._id },
//     update: updateOperation
//   });

//   axios({
//     ...apiConfig,
//     url: `${apiConfig.urlBase}updateOne`,
//     data
//   })
//     .then(response => {
//       res.json(response.data);
//     })
//     .catch(error => {
//       console.error('Error:', error.response?.data || error.message);
//       res.status(500).send(error);
//     });
// });


//   app.post('/set-announcements', (req, res) => {
//     const packageData = req.body;
//     if (!packageData._id) {
//       packageData._id = generateId();
//     }
  
//     const data = JSON.stringify({
//       "collection": "announcements",
//       "database": "meli-flow-prod",
//       "dataSource": "Cluster0",
//       "document": packageData
//     });
  
//     axios({ ...apiConfig, url: `${apiConfig.urlBase}insertOne`, data })
//       .then(response => {
//         res.json(response.data);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//     app.post('/get-announcements', (req, res) => {
//     const { companyId } = req.body;

//     // console.log("shipments company ID" , companyId)
  
//     if (!companyId) {
//       return res.status(400).json({ error: 'companyId is required' });
//     }
  
//     const data = JSON.stringify({
//       collection: "announcements",
//       database: "meli-flow-prod",
//       dataSource: "Cluster0",
//       filter: { companyId: companyId },
//     });
  
//     axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}find`,
//       data,
//     })
//       .then((response) => {
//         res.json(response.data.documents);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         res.status(500).send(error);
//       });
//   });

//   // Keep-alive function to prevent server from spinning down
// const keepAlive = async () => {
//   try {
//     console.log('🔄 Keep-alive ping at:', new Date().toISOString());
    
//     // Simple database query to keep connection active
//     const data = JSON.stringify({
//       collection: "users",
//       database: "meli-flow-prod", 
//       dataSource: "Cluster0",
//       filter: { "_id": "keep_alive_ping" }, // This document likely won't exist
//       limit: 1
//     });

//     const response = await axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}findOne`,
//       data
//     });

//     console.log('✅ Keep-alive successful');
//     return response.data;
    
//   } catch (error) {
//     console.log('⚠️ Keep-alive ping (expected - keeps connection active):', error.message);
//     // This is expected since we're querying for a non-existent document
//     // The important thing is that we made a connection to the database
//   }
// };

// // Start the keep-alive interval (15 minutes = 900,000 milliseconds)
// const startKeepAlive = () => {
//   console.log('🚀 Starting keep-alive service...');
  
//   // Run immediately
//   keepAlive();
  
//   // Then run every 15 minutes
//   const interval = setInterval(keepAlive, 15 * 60 * 1000);
  
//   // Optional: Handle graceful shutdown
//   process.on('SIGINT', () => {
//     console.log('🛑 Stopping keep-alive service...');
//     clearInterval(interval);
//     process.exit(0);
//   });
  
//   return interval;
// };

// // Alternative: More robust keep-alive with health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'alive', 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime() 
//   });
// });

// // Enhanced keep-alive that also makes HTTP request to itself
// const keepAliveEnhanced = async () => {
//   try {
//     console.log('🔄 Enhanced keep-alive ping at:', new Date().toISOString());
    
//     // 1. Database ping
//     const data = JSON.stringify({
//       collection: "users",
//       database: "meli-flow-prod", 
//       dataSource: "Cluster0",
//       filter: { "_id": "keep_alive_ping" },
//       limit: 1
//     });

//     await axios({
//       ...apiConfig,
//       url: `${apiConfig.urlBase}findOne`,
//       data
//     });

//     // 2. Self HTTP request (if you know your server URL)
//     // Uncomment and replace with your actual server URL when deployed
//     const serverUrl = 'https://spaceshare-backend.onrender.com';
//     await axios.get(`${serverUrl}/health`);

//     console.log('✅ Enhanced keep-alive successful');
    
//   } catch (error) {
//     console.log('⚠️ Keep-alive ping:', error.message);
//   }
// };

// // Start enhanced keep-alive
// const startEnhancedKeepAlive = () => {
//   console.log('🚀 Starting enhanced keep-alive service...');
//   keepAliveEnhanced();
//   return setInterval(keepAliveEnhanced, 15 * 60 * 1000);
// };

// startKeepAlive();

//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// // const express = require('express');
// // const bodyParser = require('body-parser');
// // const cors = require('cors');
// // const crypto = require('crypto');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const multer = require('multer');
// // const { v2: cloudinary } = require('cloudinary');
// // const dotenv = require('dotenv');
// // const fs = require('fs');
// // const { MongoClient, ServerApiVersion } = require('mongodb');

// // dotenv.config();

// // const app = express();
// // const PORT = 3001;
// // app.use(express.json());

// // const JWT_SECRET = 'your_jwt_secret';

// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(cors());

// // // MongoDB Connection
// // // const uri = "mongodb+srv://thomasmethembe43:KSqoTlwvlK45FyVP@cluster0.2vjumfn.mongodb.net/meli-flow-prod?retryWrites=true&w=majority&appName=Cluster0";
// // const uri = "mongodb+srv://thomasmethembe43:KSqoTlwvlK45FyVP@cluster0.2vjumfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   }
// // });

// // // Utility functions
// // const generateToken = (userId) => {
// //   const secretKey = 'your-secret-key';
// //   const expiresIn = '1h';
// //   const payload = { sub: userId, iat: Math.floor(Date.now() / 1000) };
// //   return jwt.sign(payload, secretKey, { expiresIn });
// // };

// // const generateId = () => crypto.randomBytes(12).toString('hex');

// // async function encryptPassword(password) {
// //   const saltRounds = 10;
// //   const salt = await bcrypt.genSalt(saltRounds);
// //   return await bcrypt.hash(password, salt);
// // }

// // cloudinary.config({
// //   cloud_name: "dxxlrzouc",
// //   api_key: "191187614991536",
// //   api_secret: "9b75q3SXcar-yJFsWQsfXWFhnM8",
// // });

// // // Database operations wrapper
// // async function withDB(operation) {
// //   let connection;
// //   try {
// //     connection = await client.connect();
// //     return await operation(connection.db("meli-flow-prod"));
// //   } catch (error) {
// //     console.error('Database error:', error);
// //     throw error;
// //   } finally {
// //     if (connection) {
// //       // await connection.close();
// //       console.log("done")
// //     }
// //   }
// // }

// // // Chat Endpoints
// // app.post('/create-chat', async (req, res) => {
// //   try {
// //     const packageData = req.body;
// //     if (!packageData._id) packageData._id = generateId();

// //     const result = await withDB(async (db) => {
// //       return await db.collection("chats").insertOne(packageData);
// //     });

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // app.post('/check-chat', async (req, res) => {
// //   try {
// //     const { userId, recieverName } = req.body;
// //     if (!userId || !recieverName) {
// //       return res.status(400).json({ error: 'Both userId and recieverName are required' });
// //     }

// //     const result = await withDB(async (db) => {
// //       return await db.collection("chats").findOne({
// //         $or: [
// //           { userId, recieverName },
// //           { userId: recieverName, recieverName: userId }
// //         ]
// //       });
// //     });

// //     res.json({ exists: !!result, chat: result });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // app.post('/get-chats', async (req, res) => {
// //   try {
// //     const { username } = req.body;
// //     if (!username) return res.status(400).json({ error: 'Username is required' });

// //     const result = await withDB(async (db) => {
// //       return await db.collection("chats").find({
// //         $or: [
// //           { userId: username },
// //           { recieverName: username }
// //         ]
// //       }).sort({ lastTimestamp: -1 }).toArray();
// //     });

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // // Message Endpoints
// // app.post('/send-message', async (req, res) => {
// //   try {
// //     const packageData = req.body;
// //     if (!packageData._id) packageData._id = generateId();

// //     const result = await withDB(async (db) => {
// //       return await db.collection("messages").insertOne(packageData);
// //     });

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // app.post('/get-messages', async (req, res) => {
// //   try {
// //     const { chatId } = req.body;
// //     if (!chatId) return res.status(400).json({ error: 'ChatId is required' });

// //     const result = await withDB(async (db) => {
// //       return await db.collection("messages").find({ chatId }).toArray();
// //     });

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // // Package Endpoints
// // app.post('/submit-package', async (req, res) => {
// //   try {
// //     const packageData = req.body;
// //     if (!packageData._id) packageData._id = generateId();
// //     packageData.datePosted = new Date().toISOString();

// //     const result = await withDB(async (db) => {
// //       return await db.collection("packages").insertOne(packageData);
// //     });

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // app.get('/packages', async (req, res) => {
// //   try {
// //     const type = req.query.type;
// //     const pipeline = [];

// //     if (type === 'sell' || type === 'buy') {
// //       pipeline.push({ $match: { type } });
// //     }

// //     pipeline.push({
// //       $match: { expirationDate: { $gt: new Date() } }
// //     });

// //     pipeline.push({ $sort: { departureDate: 1 } });

// //     const result = await withDB(async (db) => {
// //       return await db.collection("packages").aggregate(pipeline).toArray();
// //     });

// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // // User Authentication Endpoints
// // app.post('/register', async (req, res) => {
// //   try {
// //     const userData = { ...req.body };
// //     userData.hashedPassword = await encryptPassword(userData.password);
// //     delete userData.password;
// //     delete userData.confirmPassword;

// //     const existingUser = await withDB(async (db) => {
// //       return await db.collection("users").findOne({ username: userData.username });
// //     });

// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Username already exists' });
// //     }

// //     const result = await withDB(async (db) => {
// //       return await db.collection("users").insertOne({
// //         ...userData,
// //         signupTimestamp: new Date()
// //       });
// //     });

// //     const token = generateToken(result.insertedId);
// //     res.json({ token });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Registration failed' });
// //   }
// // });

// // app.post('/login', async (req, res) => {
// //   try {
// //     const { username, password } = req.body;

// //     const user = await withDB(async (db) => {
// //       return await db.collection("users").findOne({ username });
// //     });

// //     if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
// //       return res.status(401).send('Invalid credentials');
// //     }

// //     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
// //     const loginTimestamp = new Date().toISOString();

// //     await withDB(async (db) => {
// //       return await db.collection("users").updateOne(
// //         { _id: user._id },
// //         { $set: { isLoggedOn: true, loginTimestamp } }
// //       );
// //     });

// //     res.json({ token });
// //   } catch (error) {
// //     res.status(500).send(error);
// //   }
// // });

// // // Shipper Endpoints
// // app.post('/register-shipper', async (req, res) => {
// //   try {
// //     let userData = req.body;
// //     const hashedPassword = await encryptPassword(userData.password);

// //     const completeUserData = {
// //       ...userData,
// //       hashedPassword,
// //       registrationDate: new Date(),
// //       lastLoggedIn: new Date(),
// //       isLoggedOn: false
// //     };

// //     const existingShipper = await withDB(async (db) => {
// //       return await db.collection("shippers").findOne({
// //         "completeUserData.userID": completeUserData.userID
// //       });
// //     });

// //     if (existingShipper) {
// //       return res.status(400).json({ message: 'Shipper already exists' });
// //     }

// //     const result = await withDB(async (db) => {
// //       return await db.collection("shippers").insertOne({ completeUserData });
// //     });

// //     const token = generateToken(completeUserData.userID);
// //     res.json({ token });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Registration failed' });
// //   }
// // });

// // // File Upload Endpoint
// // const upload = multer({ dest: 'uploads/' });
// // app.post('/upload', upload.single('image'), async (req, res) => {
// //   try {
// //     const filePath = req.file.path;
// //     const result = await cloudinary.uploader.upload(filePath, {
// //       folder: 'chat_avatars',
// //     });
// //     fs.unlinkSync(filePath);
// //     res.json({ success: true, url: result.secure_url });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: 'Image upload failed.' });
// //   }
// // });

// // // Keep-alive endpoint
// // app.get('/health', (req, res) => {
// //   res.status(200).json({ 
// //     status: 'alive', 
// //     timestamp: new Date().toISOString(),
// //     uptime: process.uptime() 
// //   });
// // });

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);

// // });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');
const fs = require('fs');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const webpush = require('web-push');

// Add VAPID configuration after dotenv.config() and before app setup
webpush.setVapidDetails(
  'mailto:thomasmethembe43@gmail.com', // Replace with your email
  process.env.VAPID_PUBLIC_KEY || 'BK7dxcNdI2llF77NsAfx6I8Bve-Xkq0na15Vhi59dtipUwDVskIZsNly2xrsjMNZ7XgyeNN66xOQ9HUqdeaVPM0', // Add to .env file
  process.env.VAPID_PRIVATE_KEY || 'BTwMeBKMUvUlERv5dg97Fxw2DSgAV--0gpRLA4X4uvU' // Add to .env file
);

dotenv.config();

const app = express();
const PORT = 3001;
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret'; // Use a strong, secret key in production

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection
const uri = "mongodb+srv://thomasmethembe43:KSqoTlwvlK45FyVP@cluster0.2vjumfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database connection
let db;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("meli-flow-prod");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Initialize database connection
connectToDatabase();

// Utility functions
const generateToken = (userId) => {
    const secretKey = 'your-secret-key'; // Replace with your own secret key
    const expiresIn = '1h'; // Token expiration time, e.g., 1 hour
    const payload = { sub: userId,  iat: Math.floor(Date.now() / 1000) };
    return jwt.sign(payload, secretKey, { expiresIn });
};

cloudinary.config({
  cloud_name: "dxxlrzouc",
  api_key: "191187614991536",
  api_secret: "9b75q3SXcar-yJFsWQsfXWFhnM8",
});

async function encryptPassword(password) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('Encrypted Password:', hashedPassword);
      return hashedPassword;
    } catch (error) {
      console.error('Error encrypting password:', error);
    }
}

const generateId = () => {
    return crypto.randomBytes(12).toString('hex');
};

// Chat Endpoints
app.post('/create-chat', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("chats").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/check-chat', async (req, res) => {
  try {
    const { userId, recieverName } = req.body;

    if (!userId || !recieverName) {
      return res.status(400).json({ error: 'Both userId and recieverName are required' });
    }

    const chat = await db.collection("chats").findOne({
      $or: [
        { userId, recieverName },
        { userId: recieverName, recieverName: userId }
      ]
    });

    if (chat) {
      console.log("This chat exists");
      return res.json({ exists: true, chat });
    } else {
      console.log("This chat doesn't exist");
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking chat existence:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/get-chats', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    } else {
      console.log("username is valid");
    }

    const chats = await db.collection("chats").find({
      $or: [
        { userId: username },
        { recieverName: username }
      ]
    }).sort({ lastTimestamp: -1 }).toArray();

    res.json(chats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.put('/edit-chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(id);

    const result = await db.collection("chats").updateOne(
      { _id: id },
      { $set: updateData }
    );

    res.json(result);
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).send(error);
  }
});

// Message Endpoints
app.post('/send-message', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("messages").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }


  try {
  const senderName = packageData.userName || 'Someone';
  const recipientId = packageData.recieverID;
  const messageText = packageData.message;

  if (recipientId && messageText) {
    await sendPushNotification(recipientId, messageText, senderName);
  }
} catch (notificationError) {
  console.error('Failed to send push notification:', notificationError);
  // Don't fail the message sending if notification fails
}
});

app.post('/get-messages', async (req, res) => {
  try {
    const { chatId } = req.body;

    console.log(chatId);

    if (!chatId) {
      return res.status(400).json({ error: 'ChatId is required' });
    } else {
      console.log("chatId is valid");
    }

    const messages = await db.collection("messages").find({ chatId }).toArray();

    console.log(messages);
    res.json(messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Package Endpoints
app.post('/submit-package', async (req, res) => {
  try {
    const packageData = req.body;

    if (!packageData._id) {
      packageData._id = generateId();
    }

    packageData.datePosted = new Date().toISOString();

    const result = await db.collection("packages").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/add-request', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("requests").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.put('/edit-offer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(id);

    const result = await db.collection("packages").updateOne(
      { _id: id },
      { $set: updateData }
    );

    res.json(result);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).send(error);
  }
});

app.delete('/delete-offer/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const result = await db.collection("packages").deleteOne({ _id: id });
    res.json(result);
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).send(error);
  }
});

// Notification Endpoints
app.post('/set-notification', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("notifications").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-notifications', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const notifications = await db.collection("notifications").find({ username }).toArray();
    res.json(notifications);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.put('/update-notification/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await db.collection("notifications").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Package Listing Endpoints
app.get('/packages', async (req, res) => {
  try {
    const type = req.query.type;
    console.log(type)
    const pipeline = [];

    if (type === 'sell' || type === 'buy') {
      pipeline.push({
        $match: { type }
      });
    }

    pipeline.push({
      $match: {
        // expirationDate: { $gt: new Date() }
        expirationDate: {$gt: new Date().toISOString().slice(0, 10)}
      }
    });

    pipeline.push({
      $sort: { departureDate: 1 }
    });

    const packages = await db.collection('packages').aggregate(pipeline).toArray();
    res.json(packages);
    console.log(pipeline)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.get('/packages/by-user', async (req, res) => {
  try {
    const username = req.query.username;
    const type = req.query.type;
    const pipeline = [];

    if (username) {
      pipeline.push({
        $match: { username }
      });
    }

    if (type === 'sell' || type === 'buy') {
      pipeline.push({
        $match: { type }
      });
    }

    pipeline.push({
      $match: {
        expirationDate: { $gt: new Date() }
      }
    });

    pipeline.push({
      $sort: { departureDate: 1 }
    });

    const packages = await db.collection('packages').aggregate(pipeline).toArray();
    res.json(packages);
    console.log(packages)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Request Endpoints
app.get('/sent-requests/by-user', async (req, res) => {
  try {
    const username = req.query.username;
    const status = req.query.type;
    const pipeline = [];

    if (username) {
      pipeline.push({
        $match: { reqquestee: username }
      });
    }

    if (status === 'Pending' || status === 'Accepted') {
      pipeline.push({
        $match: { status }
      });
    }

    pipeline.push({
      $sort: { departureDate: 1 }
    });

    const requests = await db.collection('requests').aggregate(pipeline).toArray();
    res.json(requests);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.get('/recieved-requests/by-user', async (req, res) => {
  try {
    const username = req.query.username;
    const status = req.query.type;
    const pipeline = [];

    if (username) {
      pipeline.push({
        $match: { userId: username }
      });
    }

    if (status === 'Pending' || status === 'Accepted') {
      pipeline.push({
        $match: { status }
      });
    }

    pipeline.push({
      $sort: { departureDate: 1 }
    });

    const requests = await db.collection('requests').aggregate(pipeline).toArray();
    res.json(requests);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.put('/edit-request/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await db.collection("requests").updateOne(
      { _id: id },
      { $set: updateData }
    );

    res.json(result);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).send(error);
  }
});

// User Authentication
const registerUser = async (userData) => {
  try {
    // Check if the username exists
    let user = await db.collection('users').findOne({ username: userData.username });
    
    if (user) {
      return { status: 400, message: 'Username already exists' };
    }

    // Check if the email exists
    user = await db.collection('users').findOne({ email: userData.email });

    if (user) {
      return { status: 400, message: 'Email already registered' };
    }

    const { hashedPassword, ...rest } = userData;

    // Register the new user
    const result = await db.collection('users').insertOne({
      ...rest,
      hashedPassword: hashedPassword,
      signupTimestamp: new Date(),
    });

    const token = generateToken(result.insertedId);

    return { status: 200, token };
  } catch (error) {
    console.error('Error registering user:', error);
    return { status: 500, message: 'Internal server error' };
  }
};

const registerShipper = async (userData) => {
  try {
    // Check if the username exists
    let shipper = await db.collection('shippers').findOne({
      "completeUserData.userID": userData.completeUserData.userID
    });

    if (shipper) {
      return { status: 400, message: 'Username already exists' };
    }

    // Check if the email exists
    shipper = await db.collection('shippers').findOne({
      email: userData.completeUserData.email
    });

    if (shipper) {
      return { status: 400, message: 'Email already registered' };
    }

    // Register the new shipper
    const result = await db.collection('shippers').insertOne({
      ...userData,
      signupTimestamp: new Date()
    });

    const token = generateToken(result.insertedId);

    return { status: 200, token };
  } catch (error) {
    console.error('Error registering shipper:', error);
    return { status: 500, message: 'Internal server error' };
  }
};

// User Endpoints
app.post('/update-user', async (req, res) => {
  try {
    const packageData = req.body;
    const { filter, update } = packageData;

    console.log(filter);

    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }

    const result = await db.collection("users").updateOne(
      { "_id": new ObjectId(filter._id) },
      { "$set": update }
    );

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-user', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const users = await db.collection("users").find({ username }).toArray();
    res.json(users);
    console.log(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/delete-user', async (req, res) => {
  try {
    const packageData = req.body;
    const { filter, update } = packageData;

    console.log(filter);

    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }

    const result = await db.collection("users").updateOne(
      { "_id": new ObjectId(filter._id) },
      { "$set": update }
    );

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
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

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.collection("users").findOne({ username });

    console.log(user?.hashedPassword);
    
    if (user && bcrypt.compareSync(password, user.hashedPassword)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      const loginTimestamp = new Date().toISOString();
      await db.collection("users").updateOne(
        { "_id": user._id },
        { "$set": { isLoggedOn: true, loginTimestamp } }
      );

      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Shipper Endpoints
app.post('/register-shipper', async (req, res) => {
  try {
    var userData = req.body;
    const hashedPassword = await encryptPassword(userData.password);

    const completeUserData = {
      ...userData,
      hashedPassword,
      registrationDate: new Date(),
      lastLoggedIn: new Date(),
      isLoggedOn: false
    };

    const response = await registerShipper({ completeUserData });

    if (response.status === 200) {
      res.json({ token: response.token });
    } else {
      res.status(response.status).json({ message: response.message });
    }
  } catch (error) {
    console.error('Error registering shipper:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/login-shipper', async (req, res) => {
  try {
    const { companyName, password } = req.body;

    console.log(companyName);

    const user = await db.collection("shippers").findOne({
      "completeUserData.companyName": companyName
    });

    if (user && bcrypt.compareSync(password, user.completeUserData.hashedPassword)) {
      const token = jwt.sign({ userId: user.completeUserData.userID }, JWT_SECRET, { expiresIn: '1h' });

      console.log(user.completeUserData.userID);
      
      const loginTimestamp = new Date().toISOString();
      await db.collection("shippers").updateOne(
        { "completeUserData.userID": user.completeUserData.userID },
        { "$set": { "completeUserData.isLoggedOn": true, loginTimestamp } }
      );

      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/get-shipper', async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'CompanyName is required' });
    }

    const shippers = await db.collection("shippers").find({
      "completeUserData.companyName": companyName
    }).toArray();

    // console.log(companyName)

    res.json(shippers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/update-shipper', async (req, res) => {
  try {
    const packageData = req.body;
    const { filter, update } = packageData;

    console.log(filter);

    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }

    const result = await db.collection("shippers").updateOne(
      { "_id": new ObjectId(filter._id) },
      { "$set": update }
    );

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-all-shippers', async (req, res) => {
  try {
    const shippers = await db.collection("shippers").find({}).toArray();
    res.json(shippers);
    // console.log(shippers)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Rate Endpoints
app.post('/set-rate', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("rates").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/update-rate', async (req, res) => {
  try {
    const packageData = req.body;

    if (!packageData._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }

    const result = await db.collection("rates").updateOne(
      { _id: packageData._id },
      { "$set": packageData }
    );

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-rates', async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'CompanyId is required' });
    }

    const rates = await db.collection("rates").find({ companyId }).toArray();
    res.json(rates);
    console.log("in get rates function");
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Lead Times Endpoints
app.post('/set-leadTimes', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("leadTimes").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/update-leadTimes', async (req, res) => {
  try {
    const packageData = req.body;

    if (!packageData._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }

    const result = await db.collection("leadTimes").updateOne(
      { _id: packageData._id },
      { "$set": packageData }
    );

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-leadTimes', async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'CompanyId is required' });
    }

    const leadTimes = await db.collection("leadTimes").find({ companyId }).toArray();
    res.json(leadTimes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// File Upload
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'chat_avatars',
    });

    fs.unlinkSync(filePath);

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed.' });
  }
});

// Review Endpoints
app.post('/set-reviews', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("reviews").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-reviews', async (req, res) => {
  try {
    const { companyId } = req.body;

    console.log("reviews company ID", companyId);

    if (!companyId) {
      return res.status(400).json({ error: 'CompanyId is required' });
    }

    const reviews = await db.collection("reviews").find({ companyID: companyId })
      .sort({ createdAt: -1 }).toArray();

    res.json(reviews);
    console.log(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Packing List & Shipment Endpoints
app.post('/set-packing-list', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("packing-list").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/set-shipment', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("shipments").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-shipments', async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }

    const shipments = await db.collection("shipments").find({ shipperID: companyId }).toArray();
    res.json(shipments);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/track', async (req, res) => {
  try {
    const { trackingId } = req.body;

    if (!trackingId) {
      return res.status(400).json({ error: 'Tracking ID is required' });
    }

    const shipment = await db.collection("shipments").findOne(
      { shipperID: trackingId },
      {
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
      }
    );

    if (shipment) {
      res.json(shipment);
    } else {
      res.status(404).json({ error: 'Shipment not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/update-shipments', async (req, res) => {
  try {
    const packageData = req.body;
    const { filter, update } = packageData;

    if (!filter._id) {
      return res.status(400).json({ error: 'Missing _id for update.' });
    }

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

    const result = await db.collection("shipments").updateOne(
      { _id: filter._id },
      updateOperation
    );

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Announcement Endpoints
app.post('/set-announcements', async (req, res) => {
  try {
    const packageData = req.body;
    if (!packageData._id) {
      packageData._id = generateId();
    }

    const result = await db.collection("announcements").insertOne(packageData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.post('/get-announcements', async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }

    const announcements = await db.collection("announcements").find({ companyId }).toArray();
    res.json(announcements);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

// Keep-alive function to prevent server from spinning down
const keepAlive = async () => {
  try {
    console.log('🔄 Keep-alive ping at:', new Date().toISOString());
    
    // Simple database query to keep connection active
    await db.collection("users").findOne({ "_id": "keep_alive_ping" });

    console.log('✅ Keep-alive successful');
  } catch (error) {
    console.log('⚠️ Keep-alive ping (expected - keeps connection active):', error.message);
    // This is expected since we're querying for a non-existent document
    // The important thing is that we made a connection to the database
  }
};

// Start the keep-alive interval (15 minutes = 900,000 milliseconds)
const startKeepAlive = () => {
  console.log('🚀 Starting keep-alive service...');
  
  // Run immediately
  keepAlive();
  
  // Then run every 15 minutes
  const interval = setInterval(keepAlive, 15 * 60 * 1000);
  
  // Optional: Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('🛑 Stopping keep-alive service...');
    clearInterval(interval);
    client.close();
    process.exit(0);
  });
  
  return interval;
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: db ? 'connected' : 'disconnected'
  });
});

// Enhanced keep-alive that also makes HTTP request to itself
const keepAliveEnhanced = async () => {
  try {
    console.log('🔄 Enhanced keep-alive ping at:', new Date().toISOString());
    
    // Database ping
    await db.collection("users").findOne({ "_id": "keep_alive_ping" });

    // Self HTTP request (uncomment and replace with your actual server URL when deployed)
    // const serverUrl = 'https://your-server-url.com';
    // await axios.get(`${serverUrl}/health`);

    console.log('✅ Enhanced keep-alive successful');
    
  } catch (error) {
    console.log('⚠️ Keep-alive ping:', error.message);
  }
};

// Start keep-alive service
startKeepAlive();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await client.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await client.close();
  process.exit(0);
});

// Add subscription endpoint - place with other endpoints
app.post('/subscribe', async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    if (!subscription || !userId) {
      return res.status(400).json({ error: 'Subscription and userId are required' });
    }

    // Check if user already has a subscription
    const existingSubscription = await db.collection("subscriptions").findOne({ userId });

    if (existingSubscription) {
      // Update existing subscription
      await db.collection("subscriptions").updateOne(
        { userId },
        { 
          $set: { 
            subscription,
            updatedAt: new Date().toISOString()
          }
        }
      );
    } else {
      // Create new subscription
      await db.collection("subscriptions").insertOne({
        _id: generateId(),
        userId,
        subscription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Add notification sending function
const sendPushNotification = async (userId, message, senderName) => {
  try {
    const userSubscription = await db.collection("subscriptions").findOne({ userId });
    
    if (!userSubscription) {
      console.log(`No subscription found for user: ${userId}`);
      return false;
    }

    const payload = JSON.stringify({
      title: 'Meli Flow - New Message',
      body: `${senderName}: ${message}`,
      icon: '/favicon-32x32.png',
      badge: '/favicon-32x32.png',
      tag: 'message-notification',
      data: {
        url: '/chat',
        chatId: userId,
        senderId: senderName
      }
    });

    await webpush.sendNotification(userSubscription.subscription, payload);
    console.log(`Push notification sent successfully to user: ${userId}`);
    return true;

  } catch (error) {
    console.error('Error sending push notification:', error);
    
    // Remove invalid subscriptions
    if (error.statusCode === 410 || error.statusCode === 404) {
      await db.collection("subscriptions").deleteOne({ userId });
      console.log(`Removed invalid subscription for user: ${userId}`);
    }
    
    return false;
  }
};

// Add notification endpoint
app.post('/send-notification', async (req, res) => {
  try {
    const { recipientId, message, senderName } = req.body;

    if (!recipientId || !message || !senderName) {
      return res.status(400).json({ error: 'recipientId, message, and senderName are required' });
    }

    const success = await sendPushNotification(recipientId, message, senderName);
    
    if (success) {
      res.json({ success: true, message: 'Notification sent successfully' });
    } else {
      res.json({ success: false, message: 'Failed to send notification - user may not have notifications enabled' });
    }

  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Add this to your existing send-message endpoint after the message is successfully sent
// Modify your existing /send-message endpoint by adding this after the insertOne call:

// In your existing /send-message endpoint, add this after the successful insertOne:
/*
// Add this code block right after: const result = await db.collection("messages").insertOne(packageData);

// Send push notification to recipient
try {
  const senderName = packageData.userName || 'Someone';
  const recipientId = packageData.recieverID;
  const messageText = packageData.message;

  if (recipientId && messageText) {
    await sendPushNotification(recipientId, messageText, senderName);
  }
} catch (notificationError) {
  console.error('Failed to send push notification:', notificationError);
  // Don't fail the message sending if notification fails
}
*/

// Optional: Endpoint to remove subscription (for logout/unsubscribe)
app.post('/unsubscribe', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    await db.collection("subscriptions").deleteOne({ userId });
    res.json({ success: true, message: 'Unsubscribed successfully' });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
