import axios from "axios";

var hostName =  "https://letsauth.org";

export async function sendLoginToCA(usr, pwd, authCSR) {
    try {
      let response = await axios.get(hostName + "/la3/account/login-begin/" + usr);
      response = await axios.post(hostname + "/la3/account/login-finish/" + usr, {/*credentials, CSR, backup codes*/})
      return response;
    } catch (error) {
      console.log(error.response);
      if (!error.response) {
        alert("1Key Server is not responding. Please try again later.");
      } else {
        console.log(error.response.data);
        //possible errors: 403 (unable to sign csr) or 500 (internal server error)
        // TODO: maybe differentiate error message based on error type...
      }
      return null;
    }
  }

  /**
 * Completes registering a 1Key account with the CA.
 *
 * @param usr string of desired username for the new 1Key account
 * @param pwd plain text string of desired master password for the new 1Key account
 * @param authCSR certificate signing request for an authenticator certificate that contains the public key from this authenticator's keypair
 *
 * @returns response if successful or null if error occurs
 */
export async function sendRegisterToCA(usr, pwd, authCSR) {
    try {
      let [options, status] = await axios.get(hostName + "/la3/account/create-begin/"+usr);
      //response contains return code (200, 403, or 50X), as well as credential creation options. like jsonResponse(w, options, http.StatusOK)
      let response2 = await axios.post(hostName + "/la3/account/create-finish/" + usr, {
        options
      });
      return response2;
    } catch (error) {
      console.log(error);
      if (!error.response) {
        alert("1Key Server is not responding. Please try again later.");
      } else {
        alert(error.response.data);
        //possible errors: 403 (unable to sign csr) or 500 (internal server error)
        // TODO: maybe differentiate error message based on error type...
      }
      return null;
    }
  }


  