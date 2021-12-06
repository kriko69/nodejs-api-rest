
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token='') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  //informacion que nos interesa de la cuenta de google
  const {name, picture,email} = ticket.getPayload();

  //const payload = ticket.getPayload();
  //console.log(payload);

  //lo ponemos en espanol como esta los atributos de nuestro modelo de usuario
  //para que sea mas facil guardarlo
  return {
      nombre:name,
      image:picture,
      correo:email 
  }
  
}

module.exports={
    googleVerify
}