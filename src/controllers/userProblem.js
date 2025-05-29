import Problem from "../models/problem.js";
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

export default createProblem