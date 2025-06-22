
import cron from 'node-cron';
import Problem from './models/problem.js'; 

cron.schedule('39 17 * * *', async () => {
  
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());


    const existing = await Problem.findOne({ potdDate: todayDate });
    if (existing) {
        console.log(`POTD already set for ${today}: ${existing.title}`);
        return;
    }

    let problems = await Problem.find({ potdDate: null });

    if (problems.length === 0) {
        console.log("Hi")
        problems = await Problem.find(); 
    }

    if (problems.length === 0) return; 

    const randomProblem = problems[Math.floor(Math.random() * problems.length)];

    await Problem.findByIdAndUpdate(randomProblem._id, { potdDate: todayDate });

    console.log(`POTD set for ${today}: ${randomProblem.title}`);
});

