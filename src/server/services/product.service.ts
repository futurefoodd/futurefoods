
import { UUID } from 'crypto';
import {supabase} from '../clients/supabaseClient'

// interface ProductFromSupabase {
//   id: any; // Consider using `number` or `string` if you know the type
//   name: any;
//   price: any;
//   product_rating: any;
//   image_folder_path: any;
// }

export const getAllProducts = async () => {
  try{
    const { data:products, error } = await supabase
    .from('Products')
    .select('id,name,price,product_rating, image_folder_path, promo_price, status, pic')
    .order('created_at', {ascending:false})
  
    if (error) {
    throw new Error('Failed to fetch Products.');
  }

  // If no products, return empty array early
  if (!products || products.length === 0) {
    return [];
  }

  //get the main Image ONLY
    const bucketName = 'nvc';
    const imagePromises = products.map( product => {
    // const URL = supabase
    //   .storage
    //   .from(bucketName).getPublicUrl(product.image_folder_path)
        
    // product.image_folder_path = URL.data.publicUrl
   return getProductImages(bucketName, product.image_folder_path, true)
   
    // return {
    //   ...product,
    //   image:image
    // }
  });
  // Use Promise.allSettled to handle individual image failures gracefully
  const imageResults = await Promise.allSettled(imagePromises);
  const images = imageResults.map(result => 
    result.status === 'fulfilled' ? result.value : []
  );

    // Map over the products again to add the resolved image URLs
    const productsWithImages = products.map((product, index) => {
      return {
        ...product,
        image: images[index] // Add the resolved image URL
      };
    });
  return productsWithImages;
  } catch(err){
    console.log(err)
  return null
  }
};

const getProductImages = async (bucketName:string, folderPath:string | null | undefined, mainImage:boolean = false) =>{
  
  try {
    // Guard against missing folderPath
    if (!folderPath) {
      console.warn('getProductImages called with empty folderPath');
      return [];
    }

    // For mainImage, we can skip the list call and directly construct the URL
    if (mainImage) {
      const pathSegments = folderPath.split('/').filter(Boolean)
      const mainImageName = pathSegments[pathSegments.length - 1]
      const response = supabase
        .storage
        .from(bucketName).getPublicUrl(`${folderPath}/${mainImageName}_1.png`)
      return [response.data.publicUrl]
    }

    // For non-main images, try to list the folder
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath); 

    if (error) {
      // Check if it's a storage error that might return HTML
      console.error('Error retrieving imageList for folder:', folderPath, 'Error:', error);
      
      // If listing fails, try to return at least a default image or empty array
      // Don't throw - return empty array to prevent breaking the entire product list
      return [];
    }

    // If no data returned, return empty array
    if (!data || data.length === 0) {
      console.warn('No images found in folder:', folderPath);
      return [];
    }
    
    const plublicImageUrlArray = data.map(el=>{
      const resObject = supabase
       .storage
       .from(bucketName).getPublicUrl(`${folderPath}/${el.name}`)
       return resObject.data.publicUrl
     })
     return plublicImageUrlArray

  } catch (error: any) {
    // Catch any unexpected errors (like JSON parsing errors)
    console.error('Unexpected server error in getProductImages:', error);
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      folderPath,
      bucketName,
      mainImage
    });
    // Return empty array instead of throwing to prevent breaking the entire request
    return [];
  }
}

export const getProduct = async (productId:UUID) => {
  // return getProductImages('nvc', 'public/smooth_skin_and_body_repair', true)
  try{

    const { data, error } = await supabase
    .from('Products')
    .select('*')
    .eq('id', productId) // Use .eq() for a "where id = productId" clause,
  
  
    if (error) {
    throw new Error('Failed to fetch Products:', error);
  }
  if (!data || data.length === 0) {
    return []
  }
  const image = await getProductImages('nvc',data[0].image_folder_path)
  data[0].image = image
  return data
}catch(err){
  console.log('Error getting Product in getProduct() in service ',err)
   throw new Error('cant get single product data')
}
}