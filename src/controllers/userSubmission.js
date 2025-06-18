import Problem from "../models/problem.js";
import { getLanguageById } from "../utils/problemUtility.js";
import Submission from "../models/submission.js";
import { submitBatch,submitToken } from "../utils/problemUtility.js";
import User from "../models/user.js";

const submitCode= async(req,res)=>
    {
           
         try
         {
              const userId=req.result._id;

              const problemId=req.params.id;

              const {code,language}=req.body;

              if(!userId || !problemId || !code || !language)
              {
                 throw new Error("Some Field are missing")
              }

              const dsaProblem=await Problem.findById(problemId);

              if(!dsaProblem)
              {
                throw new Error("Problem Not Found")
              }

              const {visibleTestCases, hiddenVisibleTestCases}=dsaProblem;

              const submittedResult = await Submission.create({
                userId,
                problemId,
                code,
                language,
                testCasesPassed:0,
                status:"pending",
                testCasesTotal:hiddenVisibleTestCases.length
              })

                //JUDGE0
              
                //source_code:
                //language_id:
                //stdin:
                //expectedOutput:

                const languageId=getLanguageById(language);

                const encodeBase64 = (str) => Buffer.from(str, 'utf-8').toString('base64');

                const submissions=hiddenVisibleTestCases.map((curr)=>{
                return {
                    source_code:encodeBase64(code),
                    language_id:languageId,
                    stdin:encodeBase64(curr.input),
                    expected_output:encodeBase64(curr.output)
                }
                })

                console.log("submissions", submissions)

                const submitResult = await submitBatch(submissions)

            //  console.log(submitResult)

                let tokenStr='';

                for(const element of submitResult)
                {
                const {token} = element;
                
                tokenStr += token + ',';

                }

                const testResult = await submitToken(tokenStr)

                //testReult == Array of objects

            //  console.log(testResult)

               //For each testCase testResult will have following fields:
               //   1. language_id:54
               //   2. stdin:'2 3'
               //   3. expected_output:'5'
               //   4. stdout:'5'
               //   5. created_at:'2025-05-12T16:47:37.239Z'
               //   6. finished_at: '2025-05-12T16:47:37.695Z'
               //   7. time: '0.002'   (sec)
               //   8. memory: 904   (KB)
               //   9. stderr:null,
               //   10. token: 'dhhjhjghgyjfhj7436fhjfhjfowdhnds637'

               // Total RunTime: Time taken by each test case
               // Total Memeory: Max(Memeory Taken by Each Test Case)

               let runTime=0;
               let memory=0;
               let status='accepted'
               let errorMessage=null
               let testCasesPassed=0;

               // console.log(testResult)

               for(const test of testResult)
               {
                if(test.status_id==3)
                {
                    testCasesPassed++;
                    runTime=runTime+parseFloat(test.time);
                    memory=Math.max(memory,test.memory)

                }
                else{
                    if(test.status_id==4)
                    {
                        status='wrong answer'
                        errorMessage = test.status.description
                    }
                    else {
                        status='error'
                        errorMessage = test.status.description
                    }
                }
               }

               submittedResult.status=status;
               submittedResult.testCasesPassed=testCasesPassed
               submittedResult.errorMessage=errorMessage
               submittedResult.runTime=runTime
               submittedResult.memory=memory

               await submittedResult.save();

              const isInclude = req.result.problemSolved.includes(problemId);

              if(!isInclude)
              {
                  if(status==='accepted')
                  req.result.problemSolved.push(problemId);
                  await req.result.save();
              }

              const accepted = (status==='accepted')

            res.status(201).json({
                accepted,
                testCasesTotal:hiddenVisibleTestCases.length,
                testCasesPassed,
                runTime,
                memory
            })
         }
         catch(err)
         {
            res.status(401).send("Error:"+err)
         }

    }

const runCode = async(req,res)=>{
    try
    {
         const userId=req.result._id;

         const problemId=req.params.id;

         const {code,language}=req.body;

         if(!userId || !problemId || !code || !language)
         {
            throw new Error("Some Field are missing")
         }

         const dsaProblem=await Problem.findById(problemId);

         if(!dsaProblem)
         {
           throw new Error("Problem Not Found")
         }

         const {visibleTestCases, hiddenVisibleTestCases}=dsaProblem;

           //JUDGE0
         
           //source_code:
           //language_id:
           //stdin:
           //expectedOutput:

           const languageId=getLanguageById(language);

           const encodeBase64 = (str) => Buffer.from(str, 'utf-8').toString('base64');

           const submissions=visibleTestCases.map((curr)=>{
           return {
               source_code:encodeBase64(code),
               language_id:languageId,
               stdin:encodeBase64(curr.input),
               expected_output:encodeBase64(curr.output)
           }
           })

          // console.log("submissions", submissions)

           if(!submissions) throw new Error("Submission Array Error")

           const submitResult = await submitBatch(submissions)

         //  console.log("submitResult", submitResult)

           if (!submitResult || submitResult.length === 0) throw new Error("Submission Batch Error");

           const tokenStr = submitResult.map(el => el.token).join(',');


           if(!tokenStr) throw new Error("tokenstr Array Error")

           const testResult = await submitToken(tokenStr)

           if(testResult.length==0) throw new Error("test Result Error Token Submission Error")

           

         const decoded = (base64Str)=>
            {
                if(base64Str)
               return Buffer.from(base64Str, 'base64').toString('utf-8');
            }

           console.log("testResult", testResult)

         const normalResult = testResult.map((curr)=>{
            return{
                status_id:curr.status_id,
                description:curr.status.description,
                stdin:decoded(curr.stdin),
                expected_output:decoded(curr.expected_output),
                stdout:decoded(curr.stdout)
            }
         })


          res.status(201).send(normalResult)
    }
    catch(err)
    {
       res.status(401).send("Error:"+err)
    }
}




export {submitCode,runCode}