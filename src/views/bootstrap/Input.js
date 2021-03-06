import React, { PropTypes } from "react";
import { Input, Glyphicon, FormControl } from "react-bootstrap";
import Immutable from "immutable";

class AuthInput extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    errors: PropTypes.object
  };

  static defaultProps = {
    label: "",
    value: null,
    errors: Immutable.fromJS([])
  };

  handleInput (ev) {
    this.props.onChange(ev.target.value);
  }

  renderErrorList () {
    if (this.props.errors.size) {
      return (
        <div className='auth-error-message has-error'>
          {this.props.errors.map((err, i) => {
            return (
              <p className="control-label inline-error-item"
                 style={{paddingLeft: "20px", position: "relative", marginBottom: "28px"}}
                 key={i}>

                <Glyphicon glyph="exclamation-sign"
                           style={{
                             position: "absolute",
                             left: 0,
                             top: 2
                           }}
                /> {err}
              </p>
            );
          })}
        </div>
      );
    } else {
      return <span />;
    }
  }


  // <FormControl type="text"  
  //             className="" 
  //             maxLength="30"
  //             onBlur={this.handleBlur.bind(this)}
  //             value={this.state.name}
  //             onChange={this.handleInput.bind(this, 'email')} />

  render () {
    return (
      <div>
        <FormControl {...this.props}
                required
               bsStyle={(this.props.errors.size) ? "error" : null}
               onChange={this.handleInput.bind(this)} />
        {this.renderErrorList()}
      </div>
    );
  }
}

export default AuthInput;
