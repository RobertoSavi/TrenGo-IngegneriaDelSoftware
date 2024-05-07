



async function signupUtente(req, res){
    const { email, password, username } = req.body;
    const errors = [];
    
    // Validate email
    if (!isEmailValid(email)) {
        errors.push({ field: "email", message: "Invalid email" });
    }

    // Validate password
    if (!isPasswordValid(password)) {
        errors.push({ field: "password", message: "Invalid password" });
    }

    // Validate username
    if (!isUsernameValid(username)) {
        errors.push({ field: "username", message: "Invalid username" });
    }

    // Check if email is already registered
    const isEmailRegistered = await isEmailAlreadyRegistered(email);
    if (isEmailRegistered) {
        errors.push({ field: "email", message: "Email already registered" });
    }

    // Check if username is already taken
    const isUsernameTaken = await isUsernameAlreadyTaken(username);
    if (isUsernameTaken) {
        errors.push({ field: "username", message: "Username already taken" });
    }

    // Check if email is pending registration
    const isEmailPending = await isEmailPendingRegistration(email);
    if (isEmailPending) {
        errors.push({ field: "email", message: "Email pending registration" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "error", errors });
    }

    try {
        // Create user
        const newUser = await UserModel.create({ email, password, username, active: false });

        // Generate random token
        const token = generateRandomToken(30);

        // Insert token into token collection
        await TokenModel.create({ token, userID: newUser._id });

        // Construct confirmation link
        const base_url = process.env.BASE_URL || "http://localhost:5050";
        const confirmationLink = `${base_url}/api/tokens/token/${token}`;

        // Send confirmation email
        await sendConfirmationEmail(email, confirmationLink);

        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "error", reason: "Internal server error" });
    }
}


async function loginUtente(req, res){

}

async function getUtenteByUsername(req, res){
    let query={username: req.params.username};
	let result=await collection.findOne(query);

	if (!result) 
	{
		res.send("Not found").status(404);
	}	
	else 
	{
		res.send(result).status(200);
	}
}