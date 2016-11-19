import React from "react";
import { hideEmailSignUpSuccessModal } from "../../../actions/ui";
import { connect } from "react-redux";
import Modal from "./Modal";

class EmailSignUpSuccessModal extends React.Component {
  render () {
    return (
      <Modal
        containerClass="email-sign-up-success-modal"
        show={this.props.show}
        closeAction={hideEmailSignUpSuccessModal}
        title="Regístro exitoso">
        <p>
          Ya puedes iniciar sesión y empezar a disfrutar de todos los beneficios que tenemos para ti.
        </p>
      </Modal>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignUpSuccessModal);
