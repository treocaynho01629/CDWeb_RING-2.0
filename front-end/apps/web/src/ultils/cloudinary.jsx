import { Cloudinary } from "@cloudinary/url-gen";

const cloudinary = (publicId) => {
  //Create a Cloudinary instance and set your cloud name
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    },
  });

  //Instantiate a CloudinaryImage object for the image with the public ID
  const myImage = cld.image(publicId);
  return myImage;
};

export default cloudinary;
