import React from "react";
import { hideEmailSignInErrorModal } from "../../../actions/ui";
import Modal from "./Modal";

class EmailSignInErrorModal extends React.Component {
  render () {
    const msg = "Alguno de los datos es invalido!";
    return (
      <Modal
        show={this.props.show}
        containerClass="email-sign-in-error-modal"
        closeAction={hideEmailSignInErrorModal}
        title="Error al iniciar sesión"
        errorAddr={msg} />
    );
  }
}

export default EmailSignInErrorModal;
