/* global React, ReactDOM */
/* eslint-disable react/prop-types, react/no-multi-comp,
 no-eval, no-nested-ternary */

// eslint-disable-next-line no-unused-vars
//const projectName = "javascript-calculator";

// based on code by @no-stack-dub-sack (github) / @no_stack_sub_sack (codepen)

//variables
const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/,
  endsWithNegativeSign = /\d[x/+‑]{1}‑$/,
  //styling for AC button
  clearStyle = { background: "#5dacbd" },
  //styling for operator buttons
  operatorStyle = { background: "#a7bcb9" },
  //style for = button
  equalsStyle = {
    background: "#24527a",
    position: "absolute",
    height: 130,
    bottom: 5,
    right: 5
  };

// COMPONENTS:
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: ""
    };
    this.LimitWarning = this.LimitWarning.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.initialize = this.initialize.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
  }

  //display a warning for digit limit
  LimitWarning() {
    this.setState({
      currentVal: "Digit Limit Met",
      prevVal: this.state.currentVal
    });
    //display it for 1000ms then return to previous value
    setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
  }

  //handle the calculations
  handleEvaluate() {
    if (!this.state.currentVal.includes("Limit")) {
      let expression = this.state.formula;
      //if formula ends with an opetator, remove that operator
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      //replace regex with actual operator value
      expression = expression
        .replace(/x/g, "*")
        .replace(/‑/g, "-");
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula:
          expression
            .replace(/\*/g, "⋅")
            .replace(/-/g, "‑")
            .replace(/(x|\/|\+)‑/, "$1-")
            .replace(/^‑/, "-") +
          "=" +
          answer,
        prevVal: answer,
        evaluated: true
      });
    }
  }

  handleOperators(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state;
      this.setState({ currentVal: value, evaluated: false });
      //display formula and given operator value
      if (evaluated) {
        this.setState({ formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({
          prevVal: formula,
          formula: formula + value
        });
        //handle negative sign
      } else if (!endsWithNegativeSign.test(formula)) {
        this.setState({
          formula:
            (endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value
        });
      } else if (value !== "‑") {
        this.setState({
          formula: prevVal + value
        });
      }
    }
  }
  
//display given number
  handleNumbers(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const { currentVal, formula, evaluated } = this.state;
      const value = e.target.value;
      this.setState({ evaluated: false });
      //digit limit is 21
      if (currentVal.length > 21) {
        this.LimitWarning();
      } else if (evaluated) {
        this.setState({
          currentVal: value,
          formula: value !== "0" ? value : ""
        });
      } else {
        this.setState({
          currentVal:
            currentVal === "0" || isOperator.test(currentVal)
              ? value
              : currentVal + value,
          formula:
            currentVal === "0" && value === "0"
              ? formula === ""
                ? value
                : formula
              : /([^.0-9]0|^0)$/.test(formula)
              ? formula.slice(0, -1) + value
              : formula + value
        });
      }
    }
  }

  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false
      });
    } else if (
      !this.state.currentVal.includes(".") &&
      !this.state.currentVal.includes("Limit")
    ) {
      this.setState({ evaluated: false });
      //digit limit is 21
      if (this.state.currentVal.length > 21) {
        this.LimitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentVal === "0" && this.state.formula === "")
      ) {
        this.setState({
          currentVal: "0.",
          formula: this.state.formula + "0."
        });
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + "."
        });
      }
    }
  }
//reset state for AC
  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      lastClicked: "",
      evaluated: false
    });
  }

  //render components
  render() {
    return (
      <div>
        <div className="calculator">
          <Formula formula={this.state.formula.replace(/x/g, "⋅")} />
          <Output currentValue={this.state.currentVal} />
          <Buttons
            decimal={this.handleDecimal}
            evaluate={this.handleEvaluate}
            initialize={this.initialize}
            numbers={this.handleNumbers}
            operators={this.handleOperators}
          />
        </div>
      </div>
    );
  }
}

//create buttons
class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button
          className="jumbo"
          id="clear"
          onClick={this.props.initialize}
          style={clearStyle}
          value="AC"
        >
          AC
        </button>
        <button
          id="divide"
          onClick={this.props.operators}
          style={operatorStyle}
          value="/"
        >
          /
        </button>
        <button
          id="multiply"
          onClick={this.props.operators}
          style={operatorStyle}
          value="x"
        >
          x
        </button>
        <button id="seven" onClick={this.props.numbers} value="7">
          7
        </button>
        <button id="eight" onClick={this.props.numbers} value="8">
          8
        </button>
        <button id="nine" onClick={this.props.numbers} value="9">
          9
        </button>
        <button
          id="subtract"
          onClick={this.props.operators}
          style={operatorStyle}
          value="‑"
        >
          ‑
        </button>
        <button id="four" onClick={this.props.numbers} value="4">
          4
        </button>
        <button id="five" onClick={this.props.numbers} value="5">
          5
        </button>
        <button id="six" onClick={this.props.numbers} value="6">
          6
        </button>
        <button
          id="add"
          onClick={this.props.operators}
          style={operatorStyle}
          value="+"
        >
          +
        </button>
        <button id="one" onClick={this.props.numbers} value="1">
          1
        </button>
        <button id="two" onClick={this.props.numbers} value="2">
          2
        </button>
        <button id="three" onClick={this.props.numbers} value="3">
          3
        </button>
        <button
          className="jumbo"
          id="zero"
          onClick={this.props.numbers}
          value="0"
        >
          0
        </button>
        <button id="decimal" onClick={this.props.decimal} value=".">
          .
        </button>
        <button
          id="equals"
          onClick={this.props.evaluate}
          style={equalsStyle}
          value="="
        >
          =
        </button>
      </div>
    );
  }
}

//create display screen
class Output extends React.Component {
  render() {
    return (
      <div className="outputScreen" id="display">
        {this.props.currentValue}
      </div>
    );
  }
}

class Formula extends React.Component {
  render() {
    return <div className="formulaScreen">{this.props.formula}</div>;
  }
}

//render to HTML DOM
ReactDOM.render(<Calculator />, document.getElementById("app"));
