
import { UUID } from 'crypto';
import {supabase} from '../clients/supabaseClient'


export const getAllProducts = async () => {
  try{

    const { data:products, error } = await supabase
    .from('Products')
    .select('id,name,price,product_rating, image_path_1')
    .order('created_at', {ascending:false})
  
    if (error) {
    throw new Error('Failed to fetch Products.');
  }
  //get the main Image ONLY
    const bucketName = 'nvc';
    const productsWithImages = products.map(product => {
    const URL = supabase
      .storage
      .from(bucketName).getPublicUrl(product.image_path_1)
        
    product.image_path_1 = URL.data.publicUrl

    return {
      ...product,
    };
  });

  return productsWithImages;
  } catch(err){
    console.log
  return null
  }
};

const getImageUrl = async (product:any, bucketName:string) =>{
  const map = new Map();
  const imagePaths = [];
    // Dynamically check for image_url_1, image_url_2, etc.
    for (let i = 1; i <= 4; i++) { // You can adjust this to a higher number if needed.
        const imageUrlKey = `image_path_${i}`;
        if (product[imageUrlKey]) {
          map.set(`image_path_${i}`, product[imageUrlKey]);
            imagePaths.push(product[imageUrlKey]);
        }
    }
    const imageUrls = imagePaths.map(path => {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
      return data.publicUrl;
  });
// console.log('final',{...product,imageUrls})
  return {...product,imageUrls};
  
}

export const getProduct = async (productId:UUID) => {
  try{

    const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', productId) // Use .eq() for a "where id = productId" clause,
  
  
    if (error) {
    throw new Error('Failed to fetch Products.');
  }
  return getImageUrl(data[0] ,'nvc')
  // console.log('data',data)
}catch(err){
  console.log('Error getting Product in getProduct() in service ',err)
}
}