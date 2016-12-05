import React, { PropTypes } from "react";
import Input from "./Input";
import ButtonLoader from "./ButtonLoader";
import { emailSignUpFormUpdate, emailSignUp, emailSignUpFormUpdateValidation } from "../../actions/email-sign-up";
import { connect } from "react-redux";
import { Glyphicon, FormGroup, ControlLabel } from "react-bootstrap";

class EmailSignUpForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    validFirstName: PropTypes.boolean,
    validLastName: PropTypes.boolean,
    validEmail: PropTypes.boolean,
    validCompany: PropTypes.boolean,
    validPhone: PropTypes.boolean,
    validPass: PropTypes.boolean,
    validConfirmPass: PropTypes.boolean,
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
    validFirstName: false,
    validLastName: false,
    validEmail: false,
    validCompany: false,
    validPhone: false,
    validPass: false,
    validConfirmPass: false,
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
    //regex
    let name_reg = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g
    let email_reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    let phone_reg = /[0-9:]{10}/g 

    if (key === "first_name") {
      if (name_reg.test(val)) this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validFirstName", true));
      else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validFirstName", false));
    }
    else if (key === "last_name") {
      if (name_reg.test(val)) this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validLastName", true));
      else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validLastName", false));
    }
    else if (key === "email") {
      if (email_reg.test(val)) this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validEmail", true));
      else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validEmail", false));
    }
    else if (key === "phone") {
      // val.replace(/-/g, '')
      if (phone_reg.test(val)) this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validPhone", true));
      else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validPhone", false));
    }
    else if (key == "password") {
      if (val.length >= 8) this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validPass", true));
      else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validPass", false));
    }
    else if (key == "password_confirmation") {
      if (val == this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password"])) this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validConfirmPass", true));
      else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validConfirmPass", false));
    }
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

  handleBlur(event) {
    const v = this.props.auth
    if (v.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validFirstName") &&
        v.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validLastName") &&
        v.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validEmail") &&
        v.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validPhone") &&
        v.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validPass") &&
        v.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validConfirmPass")
        ){
        this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validSignUp", true));
    }
    else this.props.dispatch(emailSignUpFormUpdateValidation(this.getEndpoint(), "validSignUp", false));
  }

  validationFirstName(event) {
    const isValid = this.props.auth
    if(isValid.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validFirstName")) return 'success'
    return 'error'
  }

  validationLastName(event) {
    const isValid = this.props.auth
    if(isValid.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validLastName")) return 'success'
    return 'error'
  }

  validationEmail(event) {
    const isValid = this.props.auth
    if(isValid.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validEmail")) return 'success'
    return 'error'
  }

  validationPhone(event) {
    const isValid = this.props.auth
    if(isValid.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validPhone")) return 'success'
    return 'error'
  }

  validationPass(event) {
    const isValid = this.props.auth
    if(isValid.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validPass")) return 'success'
    return 'error'
  }

  validationPassConfirm(event) {
    const isValid = this.props.auth
    if(isValid.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validConfirmPass")) return 'success'
    return 'error'
  }

  render () {
    let disabled = (
      this.props.auth.getIn(["user", "isSignedIn"]) ||
      this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])
    );

    return (
      <form className='redux-auth email-sign-up-form clearfix'
            onSubmit={this.handleSubmit.bind(this)}>
        <FormGroup className="col-sm-6 email-sign-up-first_name" validationState={this.validationFirstName()} >
        <ControlLabel>Nombre*</ControlLabel>
          <Input type="text"
               placeholder="Sr"
               disabled={disabled}
               id="first-name-signup"
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "first_name"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "first_name"])}
               onChange={this.handleInput.bind(this, "first_name")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.first_name} />
        </FormGroup>
        <FormGroup className="col-sm-6 email-sign-up-last_name" validationState={this.validationLastName()} >
        <ControlLabel>Apellidos*</ControlLabel>
          <Input type="text"
               id="last-name-signup"
               placeholder="Envío"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "last_name"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "last_name"])}
               onChange={this.handleInput.bind(this, "last_name")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.last_name} />
        </FormGroup>
        <FormGroup className="col-sm-12 email-sign-up-email" validationState={this.validationEmail()} >
        <ControlLabel>Correo electrónico*</ControlLabel>
          <Input type="text"
               placeholder="sr.envio@mienvio.mx"
               disabled={disabled}
               id="email-signup"
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "email"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "email"])}
               onChange={this.handleInput.bind(this, "email")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.email} />
        </FormGroup>
        <FormGroup className="col-sm-6 email-sign-up-company_name">
        <ControlLabel>Empresa</ControlLabel>
          <Input type="text"
               placeholder="Mi Envío"
               disabled={disabled}
               id="company-signup"
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "company_name"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "company_name"])}
               onChange={this.handleInput.bind(this, "company_name")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.company_name} />
        </FormGroup>
        <FormGroup className="col-sm-6 email-sign-up-phone" validationState={this.validationPhone()} >
        <ControlLabel>Telefono*</ControlLabel>
          <Input type="tel"
               placeholder="123-456-7890"
               disabled={disabled}
               id="phone-signup"
               maxLength="10"
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "phone"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "phone"])}
               onChange={this.handleInput.bind(this, "phone")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.phone} />
        </FormGroup>
        <FormGroup className="col-sm-6 email-sign-up-password" validationState={this.validationPass()} >
        <ControlLabel>Contraseña*</ControlLabel>
          <Input type="password"
               placeholder="********"
               disabled={disabled}
               id="password-signup"
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password"])}
               onChange={this.handleInput.bind(this, "password")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.password} />
        </FormGroup>
      <FormGroup className="col-sm-6 email-sign-up-password-confirmation" validationState={this.validationPassConfirm()} >
        <ControlLabel>Confirmar contraseña*</ControlLabel>
          <Input type="password"
               placeholder="repetir contraseña"
               disabled={disabled}
               id="passwordConfirm-signup"
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password_confirmation"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password_confirmation"])}
               onChange={this.handleInput.bind(this, "password_confirmation")}
               onBlur={this.handleBlur.bind(this)}
               {...this.props.inputProps.password_confirmation} />
        </FormGroup>
        <div className="col-xs-12">
          <ButtonLoader loading={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])}
                        type="submit"
                        className="email-sign-up-submit btn-block btn-danger register-button-me"
                        icon={<Glyphicon glyph="send" />}
                        disabled={disabled}
                        name="register-button-me"
                        disabledAux={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "validate"]).get("validSignUp")}
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
