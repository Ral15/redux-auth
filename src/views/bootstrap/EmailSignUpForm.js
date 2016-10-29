import React, { PropTypes } from "react";
import Input from "./Input";
import ButtonLoader from "./ButtonLoader";
import { emailSignUpFormUpdate, emailSignUp } from "../../actions/email-sign-up";
import { connect } from "react-redux";
import { Glyphicon } from "react-bootstrap";

class EmailSignUpForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    inputProps: PropTypes.shape({
      firstName: PropTypes.object,
      lastName: PropTypes.object,
      phone: PropTypes.object,
      email: PropTypes.object,
      password: PropTypes.object,
      passwordConfirmation: PropTypes.object,
      companyName: PropTypes.object,
      submit: PropTypes.object
    })
  };

  // first_name" : "Jorge Luis",
  //   "last_name" : "González Sánchez",
  //   "phone" :   "4771180440",
  //   "email" : "andreetoledo22@mienvio.mx",
  //   "password" : "dev@mienvio.mx",
  //   "password_confirmation" : "dev@mienvio.mx",
  //   "company_name" : "mienvio"

  static defaultProps = {
    next: () => {},
    inputProps: {
      lastName: {},
      firstName: {},
      phone: {},
      email: {},
      password: {},
      companyName: {},
      submit: {}
    }
  };

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  handleInput (key, val) {
    this.props.dispatch(emailSignUpFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit (event) {
    event.preventDefault();
    let formData = this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form"]).toJS();
    this.props.dispatch(emailSignUp(formData, this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render () {
    let disabled = (
      this.props.auth.getIn(["user", "isSignedIn"]) ||
      this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])
    );

    return (
      <form className='redux-auth email-sign-up-form clearfix'
            onSubmit={this.handleSubmit.bind(this)}>
        <div className="col-md-6">
          <Input type="text"
               label="Nombre*"
               placeholder=""
               groupClassName="email-sign-up-firstName"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "firstName"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "firstName"])}
               onChange={this.handleInput.bind(this, "firstName")}
               {...this.props.inputProps.firstName} />
          <Input type="text"
               label="Apellidos*"
               placeholder=""
               groupClassName="email-sign-up-lastName"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "lastName"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "lastName"])}
               onChange={this.handleInput.bind(this, "lastName")}
               {...this.props.inputProps.lastName} />
        </div>
        <div className="col-md-6">
          <Input type="text"
               label="Empresa"
               placeholder=""
               groupClassName="email-sign-up-companyName"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "companyName"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "companyName"])}
               onChange={this.handleInput.bind(this, "companyName")}
               {...this.props.inputProps.companyName} />

          <Input type="text"
               label="Correo electrónico*"
               placeholder=""
               groupClassName="email-sign-up-email"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "email"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "email"])}
               onChange={this.handleInput.bind(this, "email")}
               {...this.props.inputProps.email} />
        </div>
        <div className="col-md-6">
          <Input type="password"
               label="Contraseña"
               placeholder="Password"
               groupClassName="email-sign-up-password"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password"])}
               onChange={this.handleInput.bind(this, "password")}
               {...this.props.inputProps.password} />
          <Input type="password"
               label="Confirmar contraseña"
               placeholder="Password Confirmation"
               groupClassName="email-sign-up-password-confirmation"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password_confirmation"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password_confirmation"])}
               onChange={this.handleInput.bind(this, "password_confirmation")}
               {...this.props.inputProps.passwordConfirmation} />
        </div>

        <ButtonLoader loading={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])}
                      type="submit"
                      className="email-sign-up-submit btn-block btn-danger"
                      icon={<Glyphicon glyph="send" />}
                      disabled={disabled}
                      onClick={this.handleSubmit.bind(this)}
                      {...this.props.inputProps.submit}>
          Regístrate
        </ButtonLoader>
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignUpForm);
