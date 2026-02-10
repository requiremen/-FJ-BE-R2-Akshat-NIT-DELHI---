const zod = require("zod");
const registerSchema = zod.object({
    Username : zod.string(),
    Useremail : zod.string().email(),
    Password : zod.string().min(6),
})
const loginSchema = zod.object({
    Useremail : zod.string().email(),
    Password : zod.string().min(6),
})
module.exports = {
    registerSchema: registerSchema,
    loginSchema : loginSchema

}
