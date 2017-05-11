import React from "react";
import { hideEmailSignInErrorModal } from "../../../actions/ui";
import Modal from "./Modal";

class EmailSignInErrorModal extends React.Component {
  render () {
    console.log('ni le da aqui')
    return (
      <Modal
        show={this.props.show}
        containerClass="email-sign-in-error-modal"
        closeAction={hideEmailSignInErrorModal}
        title="Error al iniciar sesión"
        errorAddr={["emailSignIn", "errors"]} />
    );
  }
}

export default EmailSignInErrorModal;
