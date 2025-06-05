import Problem from "../models/problem.js";
import User from "../models/user.js";
import {getLanguageById,submitBatch,submitToken} from "../utils/problemUtility.js";

const createProblem = async (req,res)=>{
    const{title,description,difficulty,tags,visibleTestCases,
        hiddenVisibleTestCases,startCode,
        referenceSolution,problemCreator}=req.body

    try{
          for(const solution of referenceSolution)
          {
             const {language,completeCode}=solution;

              //source_code:
              //language_id:
              //stdin:
              //expectedOutput:

              const languageId=getLanguageById(language);


              const submissions=visibleTestCases.map((curr)=>{
                return {
                    source_code:completeCode,
                    language_id:languageId,
                    stdin:curr.input,
                    expected_output:curr.output
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

          //Now We can store it in DB

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


            const submissions=visibleTestCases.map((curr)=>{
                return {
                    source_code:completeCode,
                    language_id:languageId,
                    stdin:curr.input,
                    expected_output:curr.output
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
    


export {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblemsByUser}