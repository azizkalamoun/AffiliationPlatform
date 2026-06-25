
export const getActiveUserIdFromTokens = () => {
  try {
    const cookies = document.cookie;
    const authTokensStartIndex = cookies.indexOf("authTokens");
    const secret = "blabla_access_token";
    const jwt = require("jsonwebtoken");

    if (authTokensStartIndex !== -1) {
      let authTokens = cookies.substring(authTokensStartIndex);
      authTokens = decodeURIComponent(authTokens).split(";")[0].split("=")[1];

      if (authTokens && authTokens !== "{}") {
        const { accessToken } = JSON.parse(authTokens);
        if (accessToken) {
          const decodedToken: any = jwt.verify(accessToken, secret);
          return decodedToken.id;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
