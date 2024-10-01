const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const cloudinaryUploadFunction = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
        });
        return data;
    } catch (e) {
        return e; // Return the caught error
    }
};

const cloudinaryRemoveFunction = async (imagePublicId)=>{
    try{
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;
        
    }catch(e){
        return error;

    }
}

module.exports ={
    cloudinaryUploadFunction,
    cloudinaryRemoveFunction,
}