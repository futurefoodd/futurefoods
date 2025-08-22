
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
    .select('id,name,price,product_rating, image_folder_path')
    .order('created_at', {ascending:false})
  
    if (error) {
    throw new Error('Failed to fetch Products.', error);
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
  const images = await Promise.all(imagePromises);

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

const getProductImages = async (bucketName:string, folderPath:string, mainImage:boolean = false) =>{
  
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath); 

    if (error) {
      console.error('Error retrieving imageList:', error);
      throw new Error('Error retrieving imageList:',error)
    }

    if(!mainImage){

      const plublicImageUrlArray = data.map(el=>{
        const resObject = supabase
         .storage
         .from(bucketName).getPublicUrl(`${folderPath}/${el.name}`)
         return resObject.data.publicUrl
       })
      //  console.log('plublicImageUrlArray:', plublicImageUrlArray)
       return plublicImageUrlArray
    }
    const mainImageName = folderPath.split('/')[1]
    // console.log('mainImageName',mainImageName)
    const response = supabase
      .storage
      .from(bucketName).getPublicUrl(`${folderPath}/${mainImageName}_1.png`)
      // console.log('response',[response.data.publicUrl])
      return [response.data.publicUrl]

  } catch (error) {
    console.error('Unexpected server error:', error);
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
    throw new Error('Failed to fetch Products.');
  }
  const image = await getProductImages('nvc',data[0].image_folder_path)
  data[0].image = image
  console.log('data',data)
  return data
}catch(err){
  console.log('Error getting Product in getProduct() in service ',err)
   throw new Error('cant get single product data')
}
}