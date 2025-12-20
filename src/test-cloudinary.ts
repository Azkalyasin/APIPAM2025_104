import cloudinary from './config/cloudinary';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🧪 Testing Cloudinary Connection...\n');

// Test connection
cloudinary.api
  .ping()
  .then((result) => {
    console.log('✅ Cloudinary connected successfully!');
    console.log('📦 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('📊 Status:', result.status);
  })
  .catch((error) => {
    console.error('❌ Cloudinary connection failed:');
    console.error(error.message);
    console.log('\n💡 Check your credentials in .env file!');
  });
