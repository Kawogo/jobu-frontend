import axios from "axios";




const http =  axios.create({
      baseURL: "http://localhost:8000",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      withCredentials: true,
});


// // Add an interceptor to include the X-XSRF-TOKEN header
// http.interceptors.request.use((config) => {
//   http.get('/sanctum/csrf-cookie')

//   const tokenElement = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;

  
//   if (tokenElement) {
//     config.headers['X-XSRF-TOKEN'] = tokenElement.content;
//   }


//   return config;
// });






export default http