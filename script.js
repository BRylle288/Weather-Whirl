function handleCredentialResponse(response) {
    if (!response.credential) {
        console.error("Google Sign-In failed: No credential received.");
        document.getElementById("user-info").innerHTML = "Invalid login attempt.";
        return;
    }

    // Decode JWT Token to Get User Info
    const responsePayload = parseJwt(response.credential);

    if (!responsePayload) {
        document.getElementById("user-info").innerHTML = "Invalid token received.";
        return;
    }

    console.log("User:", responsePayload);
    
    document.getElementById("user-info").innerHTML = `
        <img src="${responsePayload.picture}" width="50" height="50"><br>
        <strong>Name:</strong> ${responsePayload.name}<br>
        <strong>Email:</strong> ${responsePayload.email}
    `;
}

function parseJwt(token) {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (error) {
        console.error("Invalid JWT Token:", error);
        return null;
    }
}
