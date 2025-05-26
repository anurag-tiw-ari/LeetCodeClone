import validator from "validator"

const validate=(data)=>{

    const mandatoryField=["firstName","emailId","password"]

    const IsAllowed=mandatoryField.every((curr)=>{
        return  Object.keys(data).includes(curr)
    })

    if(!IsAllowed)
    {
        throw new Error("Field is Missing")
    }

    if(!validator.isEmail(data.emailId))
    {
        throw new Error("Invalid Credentials")
    }

    if(!validator.isStrongPassword(data.password))
    {
        throw new Error("Password is weak")
    }


}

export default validate;