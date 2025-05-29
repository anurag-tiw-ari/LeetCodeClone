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
        base64_encoded: 'false'
      },
      headers: {
        'x-rapidapi-key':'29ee3e15ecmsh632a0408d7b7cd8p1cfabdjsn98195171ebc8',
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
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '29ee3e15ecmsh632a0408d7b7cd8p1cfabdjsn98195171ebc8',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
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

    while(true)
    {
    const result = await fetchData();

   const IsResultObtained = result.submissions.every((curr)=>{
        return curr.status_id>=3
    })

    if(IsResultObtained)
        return result.submissions;

    await waiting(1000);

}


}


export {getLanguageById, submitBatch,submitToken}