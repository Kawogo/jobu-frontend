import axios from "axios";


const base = "http://localhost:8000/api"

const http =  axios.create({
      baseURL: base,
      headers: {
        "Content-type": "application/json",
      }
});


export default http