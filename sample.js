const jwt = require("jsonwebtoken");

secretKey = "asdlfm2-0ri-123fdoasdf"
expiresIn = 10

jwt.sign(
    payload,
    keys.secretOrKey,
    {
      expiresIn: 7200 // 2hrs
    },
    (err, token) => {
      res.json({
        success: true,
        userid: user.id,
        token: token
      });
    }
  );

const decodedToken = jwt.decode(token);