const axios = require('axios');

// Server URLs
const MAIN_SERVER = 'https://spaceshare-backend.onrender.com';
const CHAT_SERVER = 'https://space-share-chat.onrender.com';

// Keep-alive function for main server (get packages)
const keepMainServerAlive = async () => {
  try {
    console.log('🔄 Pinging main server at:', new Date().toISOString());
    
    // Make a request to get packages (this will keep the database connection active too)
    const response = await axios.get(`${MAIN_SERVER}/packages?type=sell`);
    
    const packages = response.data || [];
    console.log(`✅ Main server alive - Found ${packages.length} sell packages`);
    
    return packages.length;
    
  } catch (error) {
    console.error('❌ Error pinging main server:', error.message);
    return 0;
  }
};

// Keep-alive function for chat server
const keepChatServerAlive = async () => {
  try {
    console.log('🔄 Pinging chat server at:', new Date().toISOString());
    
    // Make a simple request to check if chat exists (lightweight operation)
    const response = await axios.post(`${CHAT_SERVER}/check-chat`, {
      userId: 'keepalive',
      recieverName: 'ping'
    });
    
    console.log('✅ Chat server alive - Response received');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error pinging chat server:', error.message);
    return false;
  }
};

// Combined keep-alive function
const keepBothServersAlive = async () => {
  console.log('🚀 Running keep-alive for both servers...');
  
  const [mainResult, chatResult] = await Promise.allSettled([
    keepMainServerAlive(),
    keepChatServerAlive()
  ]);
  
  console.log('📊 Keep-alive summary:');
  console.log(`   Main Server: ${mainResult.status === 'fulfilled' ? '✅ Active' : '❌ Failed'}`);
  console.log(`   Chat Server: ${chatResult.status === 'fulfilled' ? '✅ Active' : '❌ Failed'}`);
  console.log('---');
};

// Start the keep-alive service
const startKeepAlive = () => {
  console.log('🚀 Starting dual server keep-alive service (every 10 minutes)...');
  console.log(`   Main Server: ${MAIN_SERVER}`);
  console.log(`   Chat Server: ${CHAT_SERVER}`);
  console.log('');
  
  // Run immediately
  keepBothServersAlive();
  
  // Then run every 10 minutes (600,000 milliseconds)
  const interval = setInterval(keepBothServersAlive, 10 * 60 * 1000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('🛑 Stopping keep-alive service...');
    clearInterval(interval);
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('🛑 Stopping keep-alive service...');
    clearInterval(interval);
    process.exit(0);
  });
  
  return interval;
};

// Start the service
startKeepAlive();