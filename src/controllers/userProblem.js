import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
import User from "../models/user.js";
import {getLanguageById,submitBatch,submitToken} from "../utils/problemUtility.js";

const createProblem = async (req,res)=>{
    const{title,description,difficulty,tags,visibleTestCases,
        hiddenVisibleTestCases,startCode,
        referenceSolution,problemCreator}=req.body

      //  console.log("req", req.body)

    try{
          for(const solution of referenceSolution)
          {
             const {language,completeCode}=solution;

              //source_code:
              //language_id:
              //stdin:
              //expectedOutput:

              const languageId=getLanguageById(language);

              const encodeBase64 = (str) => Buffer.from(str, 'utf-8').toString('base64');

              const submissions=visibleTestCases.map((curr)=>{
                return {
                    source_code:encodeBase64(completeCode),
                    language_id:languageId,
                    stdin:encodeBase64(curr.input),
                    expected_output:encodeBase64(curr.output)
                }
              })

              const submitResult = await submitBatch(submissions)

            //  console.log(submitResult)

              let tokenStr='';

              for(const element of submitResult)
              {
                const {token} = element;
                
                tokenStr += token + ',';

              }

              const testResult = await submitToken(tokenStr)

              console.log(testResult)

              for(const test of testResult)
              {
                if(test.status_id!=3)
                {
                  return res.status(400).send("Error Occured")
                }
              }
          }

          //Now We can store it in DB

         // console.log(req.body)

        //   const decoded = (base64Str)=>
        //     {
        //         if(base64Str)
        //        return Buffer.from(base64Str, 'base64').toString('utf-8');
        //     }

        //  const normalResult = testResult.map((curr)=>{
        //     return{
        //         status_id:curr.status_id,
        //         description:curr.status.description,
        //         stdin:decoded(curr.stdin),
        //         expected_output:decoded(curr.expected_output),
        //         stdout:decoded(curr.stdout)
        //     }
        //  })

          const userProblem = await Problem.create(
            {
                ...req.body,
                problemCreator:req.result._id
            }
          )

          res.status(201).send("Problem Saved Successfully")
    }
    catch(err){
          res.status(400).send("Error:"+err.message);
    }
}

const updateProblem = async (req,res)=>{
    
    const {id} = req.params;
 
    const {title,description,difficulty,tags,visibleTestCases,
        hiddenVisibleTestCases,startCode,
        referenceSolution,problemCreator} = req.body
    
    try{

        if(!id)
        {
            throw new Error("Invalid Id")
        }

        const problem =  await Problem.findById(id)

        if(!problem)
        {
            throw new Error("Invalid Id")
        }

        for(const solution of referenceSolution)
        {
            const {language,completeCode}=solution;

            const languageId=getLanguageById(language);

            const encodeBase64 = (str) => Buffer.from(str, 'utf-8').toString('base64');

            const submissions=visibleTestCases.map((curr)=>{
              return {
                    source_code:encodeBase64(completeCode),
                    language_id:languageId,
                    stdin:encodeBase64(curr.input),
                    expected_output:encodeBase64(curr.output)
                }
              })

            const submitResult = await submitBatch(submissions)

            //  console.log(submitResult)

            let tokenStr='';

            for(const element of submitResult)
            {
                const {token} = element;
                
                tokenStr += token + ',';

            }

            const testResult = await submitToken(tokenStr)

            //  console.log(testResult)

            for(const test of testResult)
            {
                if(test.status_id!=3)
                {
                return res.status(400).send("Error Occured")
                }
            }
        }

        const newProblem = await Problem.findByIdAndUpdate(id,req.body,{runValidators:true,new:true})

        res.status(200).send("Problem Updated Successfully")
    }
    catch(err){
        res.status(400).send("Error:"+err.message);
    }
}

const deleteProblem = async (req,res)=>{

    const {id}=req.params

    try{

        if(!id)
            throw new Error("Invalid Id")

        const problem= await Problem.findById(id)

        if(!problem)
            throw new Error("Invalid Id")

       const deletedProblem = await Problem.findByIdAndDelete(id)

        res.status(200).send("Problem Deleted Successfully")
    }
    catch(err)
    {
       res.status(400).send("Error:"+err.message)
    }
}

const getProblemById = async (req,res)=>{
    const {id}=req.params

    try{

        if(!id)
            throw new Error("Id is Missing")

        const problem= await Problem.findById(id)

        if(!problem)
            throw new Error("Problem is Missing")

        const foundProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');
      

       if(!foundProblem)
        throw new Error("Problem is missing")

        res.status(200).send(foundProblem)
    }
    catch(err)
    {
       res.status(400).send("Error:"+err.message)
    }
}

const getAllProblems = async (req,res)=>{
  
        try{
    
           const allProblem = await Problem.find({}).select('_id title difficulty tags');
    
           if(!allProblem)
            throw new Error("Problem is missing")
    
            res.status(200).send(allProblem)
        }
        catch(err)
        {
           res.status(400).send("Error:"+err.message)
        }
         

}

const solvedProblemsByUser = async (req,res)=>
    {
        try{
         const user= await User.findById(req.result._id).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
         });

         if(!user)
         {
            throw new Error("user does not exist")
         }

         //console.log(user.problemSolved

         res.status(201).send(user.problemSolved)
         
        }
        catch(err)
        {
            res.status(400).send("Error:"+err)
        }
}

const submittedProblem = async (req,res)=>{
    try
    {
            
        const userId = req.result._id;
        const problemId = req.params.id;

        const ans = await Submission.find({userId,problemId})

        if(ans.length==0)
        {
            res.status(200).send("No Submissions")
        }

        res.status(200).send(ans)

    }
    catch(err)
    {
        res.status(400).send("Error"+err)
    }
}

const likedProblems = async (req,res)=>{
    const {id}=req.params
    
    try{

        if(!id)
            throw new Error("Id is Missing")

        const problem= await Problem.findById(id)

        if(!problem)
            throw new Error("Problem is Missing")

       // const foundProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

        const isInclude = req.result.likedProblems.includes(id);

       // console.log("Hello World 5, isInclude", isInclude)

              if(!isInclude)
              {
              //    console.log("Hello World 6")
                  req.result.likedProblems.push(id);
              //    console.log("Hello World 7")
                  await req.result.save();
              //    console.log("Hello World 8")
              }

              if(isInclude)
              {
            //    console.log("Hello World 9")
                 let index = req.result.likedProblems.indexOf(id)
             //    console.log("Hello World 10")
                req.result.likedProblems.splice(index,1)
           //     console.log("Hello World 11")
                await req.result.save();
             //   console.log("Hello World 12")
              }
        res.status(200).send(true)
    }
    catch(err)
    {
       res.status(400).send("Error:"+err.message)
    }
}

const checkLike = async (req,res)=>{
     
    try{
    const {id} = req.params
    
    const isInclude = req.result.likedProblems.includes(id);

    res.status(200).send(isInclude)
    }
    catch(err){
        res.status(401).send("Error"+err.message)
    }
}

const getLikedProblemsByUser = async (req,res)=>
    {
        try{
         const user= await User.findById(req.result._id).populate({
            path:"likedProblems",
            select:"_id title difficulty tags"
         });

         if(!user)
         {
            throw new Error("user does not exist")
         }

         //console.log(user.problemSolved

         res.status(201).send(user.likedProblems)
         
        }
        catch(err)
        {
            res.status(400).send("Error:"+err)
        }
}

const problemsCreatedByAdmin = async (req,res)=>{
 
    try{


      const userId = req.result._id;

  //  console.log("userId",userId)

   const problems = await Problem.find({problemCreator:userId})

   res.status(200).send(problems)
    }
    catch(err)
    {
        res.status(400).send("Error:"+err.message)
    }

}

export {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblemsByUser,submittedProblem,likedProblems,checkLike,getLikedProblemsByUser,problemsCreatedByAdmin}