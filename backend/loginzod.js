const loginSshema = zod.object({
    Useremail : zod.string().email(),
    Password : zod.string().min(6),
})
//login zod
