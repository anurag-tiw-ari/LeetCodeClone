import axios from "axios";

const getLanguageById=(lang)=>
    {
       const language={
        "c++":54,
        java:"62",
        javascript:"63"
       }

       return language[lang.toLowerCase()];
}

const submitBatch=async (submissions)=>{

    const options = {
      method: 'POST',
      url:'https://judge0-ce.p.rapidapi.com/submissions/batch',
      params: {
        base64_encoded: 'true'
      },
      headers: {
        'x-rapidapi-key':'0e972bd187msh4119df5449d3af5p1c8f6cjsnec753a0a4e2a',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        submissions
      }
    };
    
    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    
    return await  fetchData();   
    //Returning TokenArray of, Token For Each Object(Each Test Case) in Submission array
    // [
    //
    //  {
    //    "token":"bkjdvbjsbjhjfhjfhjerfbweb",
    //  },
    //  {
    //    "token":"ksdfkjdsmvvmgagsfhjerfbnc",
    //  }
    //
    //]

    
}

const waiting=async(timer)=>{
    setTimeout(()=>{
       return 1;
    },timer)
}

const submitToken=async (tokenStr)=>{

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens:tokenStr,
        base64_encoded: 'true',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '0e972bd187msh4119df5449d3af5p1c8f6cjsnec753a0a4e2a',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } 
        catch (error) {
        console.error("Judge0 400 Error:", error?.response?.data || error.message);
        throw new Error("Judge0 token fetch failed");
    }
    }

    while(true)
    {
    const result = await fetchData();

     if (!result || !result.submissions) {
        throw new Error("Invalid response from Judge0");
    }

   const IsResultObtained = result.submissions.every((curr)=>{
        return curr.status_id>=3
    })

    if(IsResultObtained)
        return result.submissions;

    await waiting(1000);

}


}


export {getLanguageById, submitBatch,submitToken}