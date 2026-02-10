const zod = require("zod");
const registerSshema = zod.object({
    Username : zod.string(),
    Useremail : zod.string().email(),
    Password : zod.string().min(6),
})
module.exports = {
    registerSshema: registerSshema,

}
