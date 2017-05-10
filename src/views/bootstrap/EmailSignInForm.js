import React, {PropTypes} from "react";
import ButtonLoader from "./ButtonLoader";
import Input from "./Input";
import { emailSignInFormUpdate, emailSignIn, emailSignInFormUpdateValidation } from "../../actions/email-sign-in";
import { Glyphicon, FormGroup, ControlLabel } from "react-bootstrap";
import { connect } from "react-redux";

class EmailSignInForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    validUser: PropTypes.boolean,
    validPass: PropTypes.boolean,
    inputProps: PropTypes.shape({
      email: PropTypes.object,
      password: PropTypes.object,
      submit: PropTypes.object
    })
  };

  static defaultProps = {
    next: () => {},
    inputProps: {
      email: {},
      password: {},
      submit: {},
    },
    validUser: false,
    validPass: false,
  };

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }


  handleInput (key, val) {
    
    if (key === "email") {
      const reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
      if (reg.test(val)) this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validUser", true));
      else this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validUser", false));
    }
    else if (key == "password") {
      if (val.length >= 1) this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validPass", true));
      else this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validPass", false));
    }
    if (this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "validate"]).get("validPass") && this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "validate"]).get("validUser")) {
      this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validLogIn", true));
    }
    else this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validLogIn", false));

    this.props.dispatch(emailSignInFormUpdate(this.getEndpoint(), key, val));
  }

  handleBlur(event) {
    if (this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "validate"]).get("validPass") && this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "validate"]).get("validUser")) {
      this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validLogIn", true));
    }
    else this.props.dispatch(emailSignInFormUpdateValidation(this.getEndpoint(), "validLogIn", false));
  }

  handleSubmit (event) {
    event.preventDefault();
    let formData = this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form"]).toJS();
    this.props.dispatch(emailSignIn(formData, this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render () {
    let disabled = (
      this.props.auth.getIn(["user", "isSignedIn"]) ||
      this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "loading"])
    );
    return (
      <form className='redux-auth email-sign-in-form clearfix'
            onSubmit={this.handleSubmit.bind(this)}>
        <FormGroup className="col-xs-12 email-sign-in-email">
          <Input type="text"
                placeholder="Correo electrónico"
                disabled={disabled}
                id="email-login"
                value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "email"])}
                errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "email"])}
                onChange={this.handleInput.bind(this, "email")}
                onBlur={this.handleBlur.bind(this)}
                {...this.props.inputProps.email} />
        </FormGroup>
        <FormGroup className="col-xs-12 email-sign-in-password">
          <Input type="password"
                placeholder="Contraseña"
                id="email-password"
                disabled={disabled}
                value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "password"])}
                errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "password"])}
                onChange={this.handleInput.bind(this, "password")}
                onBlur={this.handleBlur.bind(this)}
                {...this.props.inputProps.password} />
        </FormGroup>
        <div className="col-xs-6">
          <ButtonLoader loading={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "loading"])}
                type="submit"
                icon={<Glyphicon glyph="menu-right" />}
                className='email-sign-in-submit btn-danger btn-block login-button-me'
                disabled={disabled}
                name="login-btn-form"
                disabledAux={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "validate"]).get("validLogIn")}
                onClick={this.handleSubmit.bind(this)}
                {...this.props.inputProps.submit}>
            INGRESAR
          </ButtonLoader>
        </div>
        <div className="col-xs-6">
          <p>¿No tienes cuenta?</p>
          <p>¿Olvidaste tu contraseña?</p>
        </div>  
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignInForm);
