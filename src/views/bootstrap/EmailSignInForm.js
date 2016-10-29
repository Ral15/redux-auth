import React, {PropTypes} from "react";
import ButtonLoader from "./ButtonLoader";
import Input from "./Input";
import { emailSignInFormUpdate, emailSignIn } from "../../actions/email-sign-in";
import { Glyphicon } from "react-bootstrap";
import { connect } from "react-redux";

class EmailSignInForm extends React.Component {
  getInitialState() {
    return {
      validUser: false,
      validPass: false
    }
  }
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
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
    if (key === "email") {
      const reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
      if (reg.test(val)) setState({ validUser: true })
      else setState({ validUser: false })
    }
    if (key == "password") {
      if (val.length < 8) setState({ validPass: false })
      else setState({ validPass: true })
    }
    this.props.dispatch(emailSignInFormUpdate(this.getEndpoint(), key, val));
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
      this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "loading"]) ||
      this.state.validUser || this.state.validPass
    );

    return (
      <form className='redux-auth email-sign-in-form clearfix'
            onSubmit={this.handleSubmit.bind(this)}>
        <div className="col-md-10 col-md-offset-1">
          <Input type="text"
                groupClassName="email-sign-in-email"
                label="Correo electrónico"
                placeholder="sr.envio@mienvio.mx"
                disabled={disabled}
                value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "email"])}
                errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "email"])}
                onChange={this.handleInput.bind(this, "email")}
                {...this.props.inputProps.email} />
        </div>
        <div className="col-md-10 col-md-offset-1">
          <Input type="password"
                label="Contraseña"
                groupClassName="email-sign-in-password"
                placeholder="********"
                disabled={disabled}
                value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "password"])}
                errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "password"])}
                onChange={this.handleInput.bind(this, "password")}
                {...this.props.inputProps.password} />
        </div>
        <div className="col-md-10 col-md-offset-1">
          <ButtonLoader loading={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "loading"])}
                type="submit"
                icon={<Glyphicon glyph="log-in" />}
                className='email-sign-in-submit btn-danger btn-block'
                disabled={disabled}
                onClick={this.handleSubmit.bind(this)}
                {...this.props.inputProps.submit}>
            Inicia sesión
          </ButtonLoader>
        </div>
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignInForm);
