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
      first_name: PropTypes.object,
      last_name: PropTypes.object,
      phone: PropTypes.object,
      email: PropTypes.object,
      password: PropTypes.object,
      password_confirmation: PropTypes.object,
      company_name: PropTypes.object,
      submit: PropTypes.object
    })
  };


  static defaultProps = {
    next: () => {},
    inputProps: {
      last_name: {},
      first_name: {},
      phone: {},
      email: {},
      password: {},
      company_name: {},
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
    console.log(key + ' ' + val)
    if (key === "first_name") alert('huhhuu')
    this.props.dispatch(emailSignUpFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit (event) {
    event.preventDefault();
    let formData = this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form"]).toJS();
    console.log(formData)
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
               placeholder="Sr"
               groupClassName="email-sign-up-first_name"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "first_name"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "first_name"])}
               onChange={this.handleInput.bind(this, "first_name")}
               {...this.props.inputProps.first_name} />
        </div>
        <div className="col-md-6">
          <Input type="text"
               label="Apellidos*"
               placeholder="Envío"
               groupClassName="email-sign-up-last_name"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "last_name"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "last_name"])}
               onChange={this.handleInput.bind(this, "last_name")}
               {...this.props.inputProps.last_name} />
        </div>
        <div className="col-md-12">
          <Input type="text"
               label="Correo electrónico*"
               placeholder="sr.envio@mienvio.mx"
               groupClassName="email-sign-up-email"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "email"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "email"])}
               onChange={this.handleInput.bind(this, "email")}
               {...this.props.inputProps.email} />
        </div>
        <div className="col-md-6">
          <Input type="text"
               label="Empresa"
               placeholder="Mi Envío"
               groupClassName="email-sign-up-company_name"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "company_name"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "company_name"])}
               onChange={this.handleInput.bind(this, "company_name")}
               {...this.props.inputProps.company_name} />
        </div>
        <div className="col-md-6">
          <Input type="tel"
               label="Telefono*"
               placeholder="123-456-7890"
               groupClassName="email-sign-up-phone"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "phone"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "phone"])}
               onChange={this.handleInput.bind(this, "phone")}
               {...this.props.inputProps.phone} />
        </div>
        <div className="col-md-6">
          <Input type="password"
               label="Contraseña*"
               placeholder="********"
               groupClassName="email-sign-up-password"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password"])}
               onChange={this.handleInput.bind(this, "password")}
               {...this.props.inputProps.password} />
        </div>
        <div className="col-md-6">
          <Input type="password"
               label="Confirmar contraseña*"
               placeholder="repetir contraseña"
               groupClassName="email-sign-up-password-confirmation"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password_confirmation"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password_confirmation"])}
               onChange={this.handleInput.bind(this, "password_confirmation")}
               {...this.props.inputProps.password_confirmation} />
        </div>
        <div className="col-xs-12">
          <ButtonLoader loading={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])}
                        type="submit"
                        className="email-sign-up-submit btn-block btn-danger"
                        icon={<Glyphicon glyph="send" />}
                        disabled={disabled}
                        onClick={this.handleSubmit.bind(this)}
                        {...this.props.inputProps.submit}>
            Regístrate
          </ButtonLoader>
        </div>
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignUpForm);
